/**
 * API router — mounts every feature router so `app.ts` only wire one router.
 *
 * - Versioned feature routes   → `/api/v1/*`
 * - OpenAPI documentation      → `/api/docs`
 * - Backwards-compat health    → `/health`
 */

import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from '@/swagger';
import { healthRouter } from './health.routes';
import { v1Router } from './v1.routes';

export const apiRouter: Router = Router();

apiRouter.use('/api/v1', v1Router);
apiRouter.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    customSiteTitle: 'Lumora Services API — v1',
  }),
);
apiRouter.use(healthRouter);
