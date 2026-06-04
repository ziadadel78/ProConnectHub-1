/**
 * Authentication Service
 * Contains all authentication business logic
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { AppError } from '../errors/AppError';
import { USER_ROLES } from '../constants/index';
import { logger } from '../logger/logger';

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterPayload, storage: any) {
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) {
      logger.warn('Registration attempted with existing email', { email: data.email });
      throw AppError.conflict('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, config.saltRounds);

    // Create user
    const user = await storage.createUser({
      ...data,
      password: hashedPassword,
    });

    // Generate token
    const token = this.generateToken(user);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    logger.info('User registered successfully', { email: user.email });

    return { user: userWithoutPassword, token };
  }

  /**
   * Login user
   */
  async login(data: LoginPayload, storage: any) {
    // Find user
    const user = await storage.getUserByEmail(data.email);
    if (!user) {
      logger.warn('Login failed: user not found', { email: data.email });
      throw AppError.authentication('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      logger.warn('Login failed: invalid password', { email: data.email });
      throw AppError.authentication('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    logger.info('User logged in successfully', { email: user.email });

    return { user: userWithoutPassword, token };
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: any): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration as any }
    );
  }

  /**
   * Refresh token
   */
  refreshToken(token: string): string {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      return this.generateToken(decoded);
    } catch {
      throw AppError.authentication('Invalid or expired token');
    }
  }
}

export const authService = new AuthService();
