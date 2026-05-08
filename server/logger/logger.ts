/**
 * Logger Module
 * Provides structured logging with different severity levels
 */

import { config } from '../config/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = config.nodeEnv === 'development';
  private minLogLevel = this.getLogLevelPriority(config.logLevel);

  private getLogLevelPriority(level: LogLevel): number {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level];
  }

  private shouldLog(level: LogLevel): boolean {
    return this.getLogLevelPriority(level) >= this.minLogLevel;
  }

  private formatLog(entry: LogEntry): string {
    if (config.logFormat === 'json') {
      return JSON.stringify(entry);
    }

    const { timestamp, level, message, context, error } = entry;
    let log = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      log += ` ${JSON.stringify(context)}`;
    }
    
    if (error) {
      log += `\n${error.stack}`;
    }

    return log;
  }

  debug(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog('debug')) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'debug',
      message,
      context,
    };

    console.log(this.formatLog(entry));
  }

  info(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog('info')) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
    };

    console.log(this.formatLog(entry));
  }

  warn(message: string, context?: Record<string, any>): void {
    if (!this.shouldLog('warn')) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      context,
    };

    console.warn(this.formatLog(entry));
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (!this.shouldLog('error')) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      context,
      error,
    };

    console.error(this.formatLog(entry));
  }
}

export const logger = new Logger();
