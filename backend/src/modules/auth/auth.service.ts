import bcrypt from 'bcryptjs';
import { User, IUser } from '../../models/User';
import { Subscription } from '../../models/Subscription';
import { signAccessToken, signRefreshToken, verifyRefreshToken, JwtPayload } from '../../utils/jwt';
import { ApiError } from '../../utils/apiError';
import { RegisterInput, LoginInput } from './auth.schema';
import { logger } from '../../utils/logger';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResult {
  user: Partial<IUser>;
  tokens: AuthTokens;
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await User.findOne({ email: input.email });
    if (existing) throw ApiError.conflict('Email already registered');

    const user = await User.create({
      name: input.name,
      email: input.email,
      password: input.password,
      selectedCharity: input.charityId ?? undefined,
      charityPercentage: input.charityPercentage,
    });

    logger.info('New user registered', { userId: user._id.toString(), email: user.email });

    const tokens = await this.generateAndStoreTokens(user);
    return { user: this.sanitizeUser(user), tokens };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await User.findOne({ email: input.email }).select('+password').select('+refreshToken');
    if (!user) throw ApiError.unauthorized('Invalid email or password');

    // Robust check for password existence
    const passwordHash = (user as any).password;
    if (!passwordHash) {
      logger.error('Password hash missing for user during login', { userId: user._id });
      throw ApiError.internal('Authentication configuration error');
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

    logger.info('User logged in', { userId: user._id.toString() });

    const tokens = await this.generateAndStoreTokens(user);
    return { user: this.sanitizeUser(user), tokens };
  }

  async refreshTokens(oldRefreshToken: string): Promise<AuthTokens> {
    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(oldRefreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await User.findById(payload.userId).select('+refreshToken');
    if (!user || !user.refreshToken) throw ApiError.unauthorized('Session expired');

    // Compare against hashed stored token
    const isValid = await bcrypt.compare(oldRefreshToken, user.refreshToken);
    if (!isValid) throw ApiError.unauthorized('Refresh token mismatch');

    return this.generateAndStoreTokens(user);
  }

  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
    logger.info('User logged out', { userId });
  }

  // ─── Private helpers ──────────────────────────────────

  private async generateAndStoreTokens(user: IUser): Promise<AuthTokens> {
    const payload: JwtPayload = { userId: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Store hashed refresh token
    const hashed = await bcrypt.hash(refreshToken, 10);
    await User.findByIdAndUpdate(user._id, { refreshToken: hashed });

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: IUser): Partial<IUser> {
    const obj = user.toObject();
    delete (obj as Record<string, unknown>).password;
    delete (obj as Record<string, unknown>).refreshToken;
    return obj;
  }
}

export const authService = new AuthService();
