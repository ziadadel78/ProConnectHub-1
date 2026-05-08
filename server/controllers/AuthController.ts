/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/AuthService';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../logger/logger';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const storage = (req as any).storage;
    const { user, token } = await authService.register(req.body, storage);

    res.status(201).json({ user, token });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const storage = (req as any).storage;
    const { user, token } = await authService.login(req.body, storage);

    res.json({ user, token });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.json({ message: 'Logged out successfully' });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const newToken = authService.refreshToken(token);
    res.json({ token: newToken });
  });
}

export const authController = new AuthController();
