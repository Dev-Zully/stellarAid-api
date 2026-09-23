/**
 * Health routes.
 */

import { Router } from 'express';
import { getHealth } from '@/controllers';

export const healthRouter: Router = Router();

healthRouter.get('/health', getHealth);
