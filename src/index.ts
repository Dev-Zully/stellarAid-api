/**
 * Entry point — boots the HTTP server and manages graceful shutdown.
 */

import { createApp } from './app';
import { env } from '@/config';
import { logger } from '@/utils';

const SHUTDOWN_TIMEOUT_MS = 10_000;

const server = createApp().listen(env.port, () => {
  logger.info('Server started', { port: env.port, nodeEnv: env.nodeEnv, pid: process.pid });
});

function shutdown(signal: NodeJS.Signals): void {
  logger.info('Shutdown requested', { signal });
  server.close(() => {
    logger.info('Server stopped');
    process.exit(0);
  });
  // If connections refuse to drain, force-exit after the timeout.
  const forceTimer = setTimeout(() => {
    logger.error('Forced shutdown: connections did not drain in time');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceTimer.unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
