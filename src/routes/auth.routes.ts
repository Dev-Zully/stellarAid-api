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
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     description: Generates a one-hour reset token and sends a reset link.
 *       The response is identical whether the email exists.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Generic password reset response
 *       422:
 *         description: Validation failed
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset a password
 *     description: Consumes a one-time reset token and revokes all sessions.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password reset
 *       400:
 *         description: Invalid or expired token
 *       422:
 *         description: Validation failed
 */

import { forgotPassword, login, refresh, register, reset } from '@/controllers';
import { passwordResetLimiter, validate } from '@/middlewares';
import {
	forgotPasswordSchema,
	loginSchema,
	refreshSchema,
	registerSchema,
	resetPasswordSchema,
} from '@/validators';

import { createFeatureRouter } from './router-factory';

export const authRouter = createFeatureRouter('auth');

authRouter.post('/register', validate({ body: registerSchema }), register);
authRouter.post('/login', validate({ body: loginSchema }), login);
authRouter.post('/refresh', validate({ body: refreshSchema }), refresh);
authRouter.post(
  '/forgot-password',
  passwordResetLimiter,
  validate({ body: forgotPasswordSchema }),
  forgotPassword,
);
authRouter.post(
  '/reset-password',
  passwordResetLimiter,
  validate({ body: resetPasswordSchema }),
  reset,
);
