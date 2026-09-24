/**
 * User profile request schemas.
 */

import { z } from 'zod';

import { uuidSchema } from './common.schemas';

const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1, 'Name cannot be empty.').max(120).optional(),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, 'Username must be at least 3 characters.')
      .max(30)
      .regex(/^[a-z0-9_]+$/, 'Username may only contain letters, numbers and underscores.')
      .optional(),
    bio: optionalText(1000),
    location: optionalText(120),
    website: z.string().trim().url('Must be a valid URL.').max(255).nullable().optional(),
    socialLinks: z
      .record(z.string().trim().min(1).max(40), z.string().trim().url('Must be a valid URL.'))
      .nullable()
      .optional(),
  })
  .strict()
  .refine((body) => Object.keys(body).length > 0, {
    message: 'At least one field must be provided.',
  });

export const userIdParamsSchema = z.object({ id: uuidSchema });

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type UserIdParamsSchema = z.infer<typeof userIdParamsSchema>;
