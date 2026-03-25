import { Request, Response } from 'express';
import { authService } from './auth.service';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { RegisterInput, LoginInput } from './auth.schema';
import { env } from '../../config/env';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = asyncWrapper(async (req: Request, res: Response) => {
  const { user, tokens } = await authService.register(req.body as RegisterInput);
  res.cookie('refreshToken', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
  res.status(201).json({ success: true, data: { user, accessToken: tokens.accessToken } });
});

export const login = asyncWrapper(async (req: Request, res: Response) => {
  const { user, tokens } = await authService.login(req.body as LoginInput);
  res.cookie('refreshToken', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
  res.status(200).json({ success: true, data: { user, accessToken: tokens.accessToken } });
});

export const refreshToken = asyncWrapper(async (req: Request, res: Response) => {
  // Accept token from httpOnly cookie OR request body (for mobile clients)
  const token: string = req.cookies?.refreshToken ?? req.body?.refreshToken;
  if (!token) {
    res.status(401).json({ success: false, message: 'Refresh token not provided' });
    return;
  }
  const tokens = await authService.refreshTokens(token);
  res.cookie('refreshToken', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
  res.status(200).json({ success: true, data: { accessToken: tokens.accessToken } });
});

export const logout = asyncWrapper(async (req: Request, res: Response) => {
  await authService.logout(req.user!._id);
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const getMe = asyncWrapper(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});
