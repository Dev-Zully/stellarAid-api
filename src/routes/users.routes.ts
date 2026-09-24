/**
 * Users routes (v1).
 *
 * User profile endpoints mount here (feature-scoped and independently
 * testable). Routers are produced by the router factory.
 *
 * @openapi
 * /api/v1/users/me:
 *   patch:
 *     summary: Update the current user's profile
 *     description: Partially updates the authenticated user's profile. Only
 *       the provided fields change; send `null` to clear an optional field.
 *       Changing `username` enforces uniqueness (409 if taken).
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Updated user (with refreshed `updatedAt`)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicUserResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: Username already taken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: { code: CONFLICT, message: Username already taken }
 *       422:
 *         $ref: '#/components/responses/ValidationFailed'
 * /api/v1/users/{id}:
 *   patch:
 *     summary: Update a user's profile by id
 *     description: Only permitted when `id` is the authenticated user;
 *       any other id returns 403.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicUserResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Attempted to modify another user's profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: { code: FORBIDDEN, message: You can only update your own profile }
 *       409:
 *         description: Username already taken
 *       422:
 *         $ref: '#/components/responses/ValidationFailed'
 */

import { updateMe, updateUserById } from '@/controllers';
import { authenticate, validate } from '@/middlewares';
import { updateProfileSchema, userIdParamsSchema } from '@/validators';

import { createFeatureRouter } from './router-factory';

export const usersRouter = createFeatureRouter('users');

usersRouter.patch('/me', authenticate, validate({ body: updateProfileSchema }), updateMe);
usersRouter.patch(
  '/:id',
  authenticate,
  validate({ params: userIdParamsSchema, body: updateProfileSchema }),
  updateUserById,
);
