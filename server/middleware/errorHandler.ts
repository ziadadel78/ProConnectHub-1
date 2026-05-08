/**
 * Error Handling Middleware
 * Centralizes error handling for the entire application
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../logger/logger';
import { config } from '../config/environment';

export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log the error
  if (error instanceof AppError) {
    logger.warn(`[${error.code}] ${error.message}`, {
      statusCode: error.statusCode,
      path: req.path,
      method: req.method,
    });
  } else {
    logger.error('Unexpected error', error, {
      path: req.path,
      method: req.method,
    });
  }

  // Handle AppError instances
  if (error instanceof AppError) {
    return res.status(error.statusCode).json(error.toJSON());
  }

  // Handle validation errors
  if (error instanceof Error && error.message.includes('Validation')) {
    return res.status(400).json(
      new AppError(error.message, 'VALIDATION_ERROR', 400).toJSON()
    );
  }

  // Handle unexpected errors
  const statusCode = 500;
  const message = config.nodeEnv === 'production'
    ? 'Internal server error'
    : error.message;

  res.status(statusCode).json(
    new AppError(message, 'INTERNAL_SERVER_ERROR', statusCode).toJSON()
  );
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
