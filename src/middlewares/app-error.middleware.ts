/**
 * Application error type and async route-handler wrapper.
 *
 * `AppError` carries an HTTP status, a stable machine-readable error code and
 * an optional details payload. The global error handler turns it into the
 * standard `{ error: { code, message, details? } }` response.
 */

import type { NextFunction, Request, RequestHandler, Response } from 'express';

export type ErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE_ENTITY'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

const STATUS_BY_CODE: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly details?: unknown;
  readonly isOperational: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    options?: { statusCode?: number; details?: unknown; cause?: unknown },
  ) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = options?.statusCode ?? STATUS_BY_CODE[code];
    this.details = options?.details;
    this.isOperational = true;
    Error.captureStackTrace?.(this, AppError);
  }

  static badRequest(message = 'Bad request', details?: unknown): AppError {
    return new AppError('BAD_REQUEST', message, { details });
  }

  static unauthorized(message = 'Unauthorized', details?: unknown): AppError {
    return new AppError('UNAUTHORIZED', message, { details });
  }

  static forbidden(message = 'Forbidden', details?: unknown): AppError {
    return new AppError('FORBIDDEN', message, { details });
  }

  static notFound(message = 'Resource not found', details?: unknown): AppError {
    return new AppError('NOT_FOUND', message, { details });
  }

  static conflict(message = 'Conflict', details?: unknown): AppError {
    return new AppError('CONFLICT', message, { details });
  }

  static unprocessable(message = 'Validation failed', details?: unknown): AppError {
    return new AppError('UNPROCESSABLE_ENTITY', message, { details });
  }

  static internal(message = 'Internal server error', details?: unknown): AppError {
    return new AppError('INTERNAL_ERROR', message, { details });
  }
}

/** Wrap an async route handler so rejections reach the global error handler. */
export function catchAsync<T extends Request = Request>(
  handler: (req: T, res: Response, next: NextFunction) => Promise<unknown> | unknown,
): RequestHandler {
  return (req, res, next) => {
    void Promise.resolve(handler(req as unknown as T, res, next)).catch(next);
  };
}
