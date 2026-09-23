/**
 * 404 middleware — responds to requests that fell through every route.
 */

import type { Request, Response } from 'express';
import type { ApiResponse } from '@/types';

export function notFoundHandler(req: Request, res: Response<ApiResponse>): void {
  res.status(404).json({
    success: false,
    error: { message: `Cannot ${req.method} ${req.originalUrl}` },
  });
}
