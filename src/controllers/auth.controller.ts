/**
 * Auth controller.
 *
 * Thin HTTP wrappers over the auth service. Uses the repo's typed
 * `validate()` + `getValidated()` pattern and demonstrates the `catchAsync`
 * wrapper; responses use the standard `{ success, data }` envelope and never
 * contain a password hash.
 */

import type { Response } from 'express';

import { catchAsync, getValidated } from '@/middlewares';
import {
  loginUser,
  refreshSession,
  registerUser,
  requestPasswordReset,
  resetPassword,
  type PublicUser,
} from '@/services';
import type { TokenPair } from '@/services';
import type { ApiResponse } from '@/types';
import type {
  ForgotPasswordSchema,
  LoginSchema,
  RefreshSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from '@/validators';

type RegisterInput = RegisterSchema;
type LoginInput = LoginSchema;
type RefreshInput = RefreshSchema;
type ForgotPasswordInput = ForgotPasswordSchema;
type ResetPasswordInput = ResetPasswordSchema;

interface RegisterResult {
  user: PublicUser;
  tokens: TokenPair;
  verificationToken: string;
}

interface SessionResult {
  user: PublicUser;
  tokens: TokenPair;
}

/** POST /api/v1/auth/register */
export const register = catchAsync(async (req, res: Response<ApiResponse<RegisterResult>>) => {
  const { body } = getValidated<RegisterInput, unknown, unknown>(req);
  const result = await registerUser(body);
  res.status(201).json({ success: true, data: result });
});

/** POST /api/v1/auth/login */
export const login = catchAsync(async (req, res: Response<ApiResponse<SessionResult>>) => {
  const { body } = getValidated<LoginInput, unknown, unknown>(req);
  const result = await loginUser(body);
  res.status(200).json({ success: true, data: result });
});

/** POST /api/v1/auth/refresh */
export const refresh = catchAsync(async (req, res: Response<ApiResponse<SessionResult>>) => {
  const { body } = getValidated<RefreshInput, unknown, unknown>(req);
  const result = await refreshSession(body.refreshToken);
  res.status(200).json({ success: true, data: result });
});

/** POST /api/v1/auth/forgot-password */
export const forgotPassword = catchAsync(
  async (req, res: Response<ApiResponse<{ message: string }>>) => {
    const { body } = getValidated<ForgotPasswordInput, unknown, unknown>(req);
    const result = await requestPasswordReset(body.email);
    res.status(200).json({ success: true, data: result });
  },
);

/** POST /api/v1/auth/reset-password */
export const reset = catchAsync(async (req, res: Response<ApiResponse<{ message: string }>>) => {
  const { body } = getValidated<ResetPasswordInput, unknown, unknown>(req);
  const result = await resetPassword(body.token, body.password);
  res.status(200).json({ success: true, data: result });
});
