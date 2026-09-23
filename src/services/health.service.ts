/**
 * Health service.
 *
 * Owns the liveness data surfaced by the health check endpoint.
 */

export interface HealthStatus {
  readonly status: 'ok';
  readonly uptime: number;
  readonly timestamp: string;
}

export function getHealthStatus(): HealthStatus {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
}
