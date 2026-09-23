/**
 * 404 middleware — responds to requests that fell through every route.
 */

import type { Request, Response } from 'express';
import { AppError, catchAsync } from './app-error.middleware';

export const notFoundHandler = catchAsync((req: Request, _res: Response) => {
  throw AppError.notFound(`Cannot ${req.method} ${req.originalUrl}`);
});
