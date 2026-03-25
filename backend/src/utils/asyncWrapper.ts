import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps async route handlers to eliminate try/catch boilerplate.
 * Automatically forwards errors to Express error middleware.
 */
export const asyncWrapper = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
