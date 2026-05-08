/**
 * Environment Configuration
 * Centralizes all environment variables and their validation
 */

export interface EnvironmentConfig {
  nodeEnv: 'development' | 'production' | 'testing';
  port: number;
  apiUrl: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiration: string;
  saltRounds: number;
  sessionSecret: string;
  apiTimeout: number;
  maxRequestSize: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  logFormat: 'json' | 'text';
  enableAnalytics: boolean;
  enableEmailVerification: boolean;
}

function validateEnvironment(): EnvironmentConfig {
  const nodeEnv = (process.env.NODE_ENV || 'development') as EnvironmentConfig['nodeEnv'];
  
  const requiredVars = {
    production: ['DATABASE_URL', 'JWT_SECRET', 'SESSION_SECRET'],
    development: [],
    testing: []
  };

  const missing = requiredVars[nodeEnv].filter(v => !process.env[v]);
  if (missing.length > 0) {
    console.warn(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    nodeEnv,
    port: parseInt(process.env.PORT || '5000', 10),
    apiUrl: process.env.API_URL || 'http://localhost:5000',
    databaseUrl: process.env.DATABASE_URL || '',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtExpiration: process.env.JWT_EXPIRATION || '7d',
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
    apiTimeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
    maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb',
    logLevel: (process.env.LOG_LEVEL || 'info') as EnvironmentConfig['logLevel'],
    logFormat: (process.env.LOG_FORMAT || 'json') as EnvironmentConfig['logFormat'],
    enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
    enableEmailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
  };
}

export const config = validateEnvironment();
