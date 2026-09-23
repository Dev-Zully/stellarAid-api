/**
 * Minimal structured logger.
 *
 * Wraps `console` with levels, ISO timestamps and JSON output so log lines
 * stay greppable and machine-parsable without a heavier dependency. Swap
 * this module for pino/winston later without touching call sites.
 */

import { env } from '@/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  readonly [key: string]: unknown;
}

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const MIN_LEVEL: LogLevel = env.isProduction ? 'info' : 'debug';

function write(level: LogLevel, message: string, context?: LogContext): void {
  if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[MIN_LEVEL]) {
    return;
  }

  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  const line = JSON.stringify(entry);
  if (level === 'warn') {
    console.warn(line);
  } else if (level === 'error') {
    console.error(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => write('debug', message, context),
  info: (message: string, context?: LogContext) => write('info', message, context),
  warn: (message: string, context?: LogContext) => write('warn', message, context),
  error: (message: string, context?: LogContext) => write('error', message, context),
};
