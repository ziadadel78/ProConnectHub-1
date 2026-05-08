/**
 * Request Validation Middleware
 * Validates incoming requests using Zod schemas
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../errors/AppError';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      const details = error.errors?.reduce((acc: any, err: any) => {
        acc[err.path.join('.')] = err.message;
        return acc;
      }, {});

      throw AppError.validation('Invalid request body', details);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error: any) {
      const details = error.errors?.reduce((acc: any, err: any) => {
        acc[err.path.join('.')] = err.message;
        return acc;
      }, {});

      throw AppError.validation('Invalid query parameters', details);
    }
  };
}
