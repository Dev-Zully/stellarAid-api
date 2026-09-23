/**
 * Health controller.
 *
 * Controllers stay thin: they map requests to service calls and shape the
 * HTTP response.
 */

import type { Request, Response } from 'express';
import { getHealthStatus, type HealthStatus } from '@/services';

/** GET /health — liveness probe. */
export function getHealth(_req: Request, res: Response<HealthStatus>): void {
  res.status(200).json(getHealthStatus());
}
