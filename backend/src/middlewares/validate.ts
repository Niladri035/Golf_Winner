import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/apiError';

type ValidateTarget = 'body' | 'query' | 'params';

/**
 * Factory middleware: validates req[target] against a Zod schema.
 * Attaches the parsed (typed) output back to req[target].
 */
export const validate =
  <T>(schema: ZodSchema<T>, target: ValidateTarget = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const formatted = (result.error as ZodError).errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return next(ApiError.badRequest('Validation failed', formatted));
    }
    // Replace with coerced/transformed data
    (req as unknown as Record<string, unknown>)[target] = result.data;
    next();
  };
