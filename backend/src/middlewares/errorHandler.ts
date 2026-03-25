import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Known operational errors
  if (err instanceof ApiError) {
    logger.warn('Operational error', {
      path: req.path,
      method: req.method,
      statusCode: err.statusCode,
      message: err.message,
      details: err.details,
    });

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(typeof err.details === 'object' && err.details !== null ? { errors: err.details } : {}),
    });
    return;
  }

  // Mongoose duplicate key
  if ((err as { code?: number }).code === 11000) {
    const field = Object.keys((err as { keyPattern?: Record<string, unknown> }).keyPattern || {}).join(', ');
    res.status(409).json({ success: false, message: `Duplicate value for: ${field}` });
    return;
  }

  // Unknown / programming errors
  logger.error('Unhandled error', {
    path: req.path,
    method: req.method,
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(env.NODE_ENV === 'development' && { stack: err instanceof Error ? err.stack : undefined }),
  });
};
