/**
 * Express application factory.
 *
 * Kept separate from `src/index.ts` so the app can be created without
 * binding a port — the setup integration tests will need.
 */

import express, { type Express } from 'express';
import { errorHandler, globalLimiter, notFoundHandler } from '@/middlewares';
import { apiRouter } from '@/routes';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(globalLimiter);

  app.use(apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
