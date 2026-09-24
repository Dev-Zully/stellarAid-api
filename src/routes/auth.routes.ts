/**
 * Auth routes (v1).
 *
 * `createFeatureRouter('auth')` attaches the auth rate limiter (10/min)
 * automatically. Inputs are validated with the repo's `validate()` middleware
 * before they reach the controller.
 *
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a user (with a pending email verification record)
 *       and returns an access/refresh token pair plus the verification token.
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/PublicUser'
 *                     tokens:
 *                       $ref: '#/components/schemas/TokenPair'
 *                     verificationToken:
 *                       type: string
 *       409:
 *         description: Email already in use
 *       422:
 *         description: Validation failed
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in
 *     description: Exchanges valid credentials for a fresh token pair.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/PublicUser'
 *                     tokens:
 *                       $ref: '#/components/schemas/TokenPair'
 *       401:
 *         description: Invalid credentials
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Rotate a refresh token
 *     description: Revokes the presented refresh token and issues a new
 *       access/refresh pair (single-use rotation).
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New token pair issued
 *       401:
 *         description: Expired or revoked token
 * /api/v1/auth/me:
 *   get:
 *     summary: Current user profile
 *     description: Returns the authenticated user's profile, including role,
 *       emailVerified, linked wallet public keys and the artist profile when
 *       one exists. Never includes the password hash.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Missing, invalid or expired access token
 * /api/v1/auth/logout:
 *   post:
 *     summary: Log out the current session
 *     description: Revokes the given refresh token. Idempotent — revoking an
 *       unknown or already-revoked token still returns 204.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       204:
 *         description: Logged out
 *       401:
 *         description: Missing, invalid or expired access token
 * /api/v1/auth/logout-all:
 *   post:
 *     summary: Log out of all sessions
 *     description: Revokes every refresh token belonging to the user.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: All sessions revoked
 *       401:
 *         description: Missing, invalid or expired access token
 */

import { login, logout, logoutAll, me, refresh, register } from '@/controllers';
import { authenticate, validate } from '@/middlewares';
import { loginSchema, logoutSchema, refreshSchema, registerSchema } from '@/validators';

import { createFeatureRouter } from './router-factory';

export const authRouter = createFeatureRouter('auth');

authRouter.post('/register', validate({ body: registerSchema }), register);
authRouter.post('/login', validate({ body: loginSchema }), login);
authRouter.post('/refresh', validate({ body: refreshSchema }), refresh);
authRouter.get('/me', authenticate, me);
authRouter.post('/logout', authenticate, validate({ body: logoutSchema }), logout);
authRouter.post('/logout-all', authenticate, logoutAll);
