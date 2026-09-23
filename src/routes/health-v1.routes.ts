/**
 * Versioned health routes.
 *
 * @openapi
 * /api/v1/health:
 *   get:
 *     summary: Versioned liveness probe
 *     description: Liveness under the versioned API namespace.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is up
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Health'
 */

import { getHealth } from '@/controllers';
import { createFeatureRouter } from './router-factory';

export const v1HealthRouter = createFeatureRouter('health');

v1HealthRouter.get('/', getHealth);
