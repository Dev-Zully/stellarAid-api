/**
 * Password hashing helpers.
 *
 * bcrypt with cost factor 12. Hashes are one-way and `comparePassword` uses
 * bcrypt's constant-time comparison.
 */

import bcrypt from 'bcrypt';

export const BCRYPT_COST = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_COST);
}

export function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
