/**
 * User profile service.
 *
 * Profile updates are always scoped to the authenticated user; ownership is
 * enforced by the caller (controller) before reaching here.
 */

import { Prisma } from '@prisma/client';

import { AppError } from '@/middlewares';
import { prisma } from '@/services';

import { toPublicUser, type PublicUser } from './auth.service';

export interface UpdateProfileInput {
  readonly name?: string;
  readonly username?: string;
  readonly bio?: string | null;
  readonly location?: string | null;
  readonly website?: string | null;
  readonly socialLinks?: Record<string, string> | null;
}

function isUniqueViolation(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
}

export async function updateUserProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<PublicUser> {
  const current = await prisma.user.findUnique({ where: { id: userId } });
  if (current === null) {
    throw new AppError('NOT_FOUND', 'User not found');
  }

  if (input.username !== undefined && input.username !== current.username) {
    const taken = await prisma.user.findUnique({ where: { username: input.username } });
    if (taken !== null) {
      throw new AppError('CONFLICT', 'Username already taken');
    }
  }

  const { socialLinks, ...rest } = input;
  const data: Prisma.UserUpdateInput = { ...rest };
  if (socialLinks !== undefined) {
    data.socialLinks = socialLinks === null ? Prisma.DbNull : socialLinks;
  }

  try {
    const updated = await prisma.user.update({ where: { id: userId }, data });
    return toPublicUser(updated);
  } catch (err) {
    // Race: username claimed between the check above and the update.
    if (isUniqueViolation(err)) {
      throw new AppError('CONFLICT', 'Username already taken');
    }
    throw err;
  }
}
