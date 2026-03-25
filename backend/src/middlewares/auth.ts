import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt';
import { ApiError } from '../utils/apiError';
import { User } from '../models/User';
import { asyncWrapper } from '../utils/asyncWrapper';

/** Extend Express Request with user context */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { _id: string };
    }
  }
}

export const authenticate = asyncWrapper(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Access token required');
  }

  const token = authHeader.split(' ')[1];

  let payload: JwtPayload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw ApiError.unauthorized('Invalid or expired access token');
  }

  // Lightweight check: verify user still exists
  const exists = await User.exists({ _id: payload.userId });
  if (!exists) throw ApiError.unauthorized('User no longer exists');

  req.user = { ...payload, _id: payload.userId };
  next();
});
