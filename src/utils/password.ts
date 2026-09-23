/**
 * Password hashing helpers.
 *
 * bcrypt with cost factor 12 documented in BCRYPT_COST.
 * - Hashes are one-way; the raw password is never recoverable.
 * - `comparePassword` uses bcrypt's constant-time comparison.
 */

import bcrypt from 'bcrypt';

export const BCRYPT_COST = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_COST);
}

export function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
