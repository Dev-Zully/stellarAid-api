/**
 * Global error middleware.
 *
 * Express recognizes 4-argument middleware as the error handler. Anything
 * thrown or passed to `next(err)` from a route lands here.
 */

import type { NextFunction, Request, Response } from 'express';
import { env } from '@/config';
import type { ApiResponse } from '@/types';
import { logger } from '@/utils';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction,
): void {
  logger.error('Unhandled request error', {
    name: err.name,
    message: err.message,
    stack: env.isProduction ? undefined : err.stack,
  });

  res.status(500).json({
    success: false,
    error: { message: 'Internal server error' },
  });
}
