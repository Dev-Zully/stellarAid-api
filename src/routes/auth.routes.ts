/**
 * Auth routes (v1).
 *
 * Endpoints (registration, login, token refresh) land here. The router is
 * wired through the router factory so auth rate limiting applies uniformly.
 *
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: User created
 *       409:
 *         description: Email already in use
 *       422:
 *         description: Validation failed
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authenticated
 *       401:
 *         description: Invalid credentials
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Rotate a refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New token pair issued
 *       401:
 *         description: Expired or revoked token
 */

import { createFeatureRouter } from './router-factory';

export const authRouter = createFeatureRouter('auth');
