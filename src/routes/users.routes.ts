/**
 * Users routes (v1).
 *
 * User profile endpoints mount here (feature-scoped and independently
 * testable). Routers are produced by the router factory.
 */

import { createFeatureRouter } from './router-factory';

export const usersRouter = createFeatureRouter('users');
