import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';

export const requireRole = (...roles: Array<'user' | 'admin'>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Insufficient permissions'));
    }
    next();
  };

export const requireAdmin = requireRole('admin');
