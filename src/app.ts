/**
 * Express application factory.
 *
 * Kept separate from `src/index.ts` so the app can be created without
 * binding a port — the setup integration tests will need.
 *
 * Middleware order (documented header policy):
 * 1. pino-http      — request logging with a per-request UUID (`req.id`),
 *                     echoed back as the `X-Request-Id` response header.
 * 2. helmet         — security headers (CSP, HSTS, X-Frame-Options, nosniff,
 *                     referrer policy, …) with Helmet's sensible defaults.
 * 3. cors           — credentialed CORS for the configured frontend origins
 *                     (`CORS_ORIGIN`, comma-separated); when unset the
 *                     request origin is reflected so any frontend can connect
 *                     during development.
 * 4. compression    — gzip/deflate responses (active in every environment,
 *                     including production).
 */

import cors from 'cors';
import compression from 'compression';
import express, { type Express } from 'express';
import { errorHandler, globalLimiter, notFoundHandler } from '@/middlewares';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { randomUUID } from 'node:crypto';

import { env } from '@/config';
import { apiRouter } from '@/routes';
import { baseLogger } from '@/utils';

const CORS_ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
const CORS_ALLOWED_HEADERS = ['Content-Type', 'Authorization', 'X-Request-Id'];

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', true);

  app.use(
    pinoHttp({
      logger: baseLogger,
      genReqId: (req, _res) => {
        const incoming = req.headers['x-request-id'];
        const id = Array.isArray(incoming) ? incoming[0] : incoming;
        return id && id.length <= 64 ? id : randomUUID();
      },
      customProps: (req) => ({ reqId: req.id }),
    }),
  );
  app.use((req, res, next) => {
    res.setHeader('X-Request-Id', String(req.id ?? ''));
    next();
  });

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins ?? true,
      credentials: true,
      methods: CORS_ALLOWED_METHODS,
      allowedHeaders: CORS_ALLOWED_HEADERS,
      exposedHeaders: ['X-Request-Id', 'Retry-After'],
    }),
  );
  app.use(compression({ threshold: 0 }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(globalLimiter);

  app.use(apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
