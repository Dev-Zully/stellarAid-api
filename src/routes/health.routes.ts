/**
 * Health routes.
 *
 * @openapi
 * /health:
 *   get:
 *     summary: Liveness probe
 *     description: Always returns 200 while the process is running.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is up
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Health'
 */

import { Router } from 'express';
import { getHealth } from '@/controllers';

export const healthRouter: Router = Router();

healthRouter.get('/health', getHealth);
