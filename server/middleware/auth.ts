/**
 * Authentication Middleware
 * Validates JWT tokens and extracts user information
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { AppError } from '../errors/AppError';
import { logger } from '../logger/logger';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw AppError.authentication('No token provided');
    }

    jwt.verify(token, config.jwtSecret, (err: any, user: any) => {
      if (err) {
        logger.warn('Invalid token attempt', { email: user?.email });
        throw AppError.authentication('Invalid or expired token');
      }
      req.user = user;
      next();
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    next(error);
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json(AppError.authentication().toJSON());
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Unauthorized access attempt', { userId: req.user.id, route: req.path });
      return res.status(403).json(AppError.authorization().toJSON());
    }

    next();
  };
}
