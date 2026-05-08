/**
 * Custom Application Error Class
 * Provides structured error handling with HTTP status codes
 */

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_SERVER_ERROR'
  | 'BUSINESS_LOGIC_ERROR'
  | 'EXTERNAL_SERVICE_ERROR';

interface ErrorResponse {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}

export class AppError extends Error {
  code: ErrorCode;
  statusCode: number;
  details?: Record<string, any>;

  constructor(
    message: string,
    code: ErrorCode = 'INTERNAL_SERVER_ERROR',
    statusCode: number = 500,
    details?: Record<string, any>
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON(): ErrorResponse {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }

  static validation(message: string, details?: Record<string, any>): AppError {
    return new AppError(message, 'VALIDATION_ERROR', 400, details);
  }

  static authentication(message: string = 'Authentication required'): AppError {
    return new AppError(message, 'AUTHENTICATION_ERROR', 401);
  }

  static authorization(message: string = 'Access denied'): AppError {
    return new AppError(message, 'AUTHORIZATION_ERROR', 403);
  }

  static notFound(message: string = 'Resource not found'): AppError {
    return new AppError(message, 'NOT_FOUND', 404);
  }

  static conflict(message: string, details?: Record<string, any>): AppError {
    return new AppError(message, 'CONFLICT', 409, details);
  }

  static internalServerError(message: string = 'Internal server error'): AppError {
    return new AppError(message, 'INTERNAL_SERVER_ERROR', 500);
  }

  static businessLogic(message: string, details?: Record<string, any>): AppError {
    return new AppError(message, 'BUSINESS_LOGIC_ERROR', 422, details);
  }

  static externalService(message: string, details?: Record<string, any>): AppError {
    return new AppError(message, 'EXTERNAL_SERVICE_ERROR', 503, details);
  }
}
