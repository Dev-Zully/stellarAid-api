/**
 * API router — mounts every feature router so `app.ts` only wires one router.
 *
 * Future feature routers mount under their own prefix, e.g.:
 *   apiRouter.use('/api/v1/projects', projectsRouter);
 */

import { Router } from 'express';
import { healthRouter } from './health.routes';

export const apiRouter: Router = Router();

apiRouter.use(healthRouter);
