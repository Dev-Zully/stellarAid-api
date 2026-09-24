/**
 * Stellar wallet authentication — nonce challenge + signature verification.
 *
 * 1. The client requests a nonce for its public key (`generateNonce`).
 * 2. The wallet signs the nonce string with its secret key.
 * 3. The server checks the signature (`verifySignature`) and consumes the
 *    nonce so it cannot be replayed. Nonces expire after `NONCE_TTL_MS`.
 */

import { randomBytes } from 'node:crypto';

import { Keypair, StrKey } from '@stellar/stellar-sdk';

import { AppError } from '@/middlewares';
import { prisma } from '@/services';

export const NONCE_TTL_MS = 5 * 60 * 1000;

export interface NonceChallenge {
  readonly nonce: string;
  readonly expiresAt: Date;
}

function assertValidPublicKey(publicKey: string): void {
  if (!StrKey.isValidEd25519PublicKey(publicKey)) {
    throw new AppError('BAD_REQUEST', 'Invalid Stellar public key');
  }
}

export async function generateNonce(publicKey: string): Promise<NonceChallenge> {
  assertValidPublicKey(publicKey);
  const nonce = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + NONCE_TTL_MS);
  await prisma.stellarNonce.create({ data: { publicKey, nonce, expiresAt } });
  return { nonce, expiresAt };
}

/** Verify a base64 signature over `nonce` and consume the nonce (single use). */
export async function verifySignature(
  publicKey: string,
  nonce: string,
  signature: string,
): Promise<boolean> {
  assertValidPublicKey(publicKey);

  const record = await prisma.stellarNonce.findUnique({ where: { nonce } });
  if (
    record === null ||
    record.publicKey !== publicKey ||
    record.consumed ||
    record.expiresAt <= new Date()
  ) {
    throw new AppError('UNAUTHORIZED', 'Invalid or expired nonce');
  }

  let valid: boolean;
  try {
    valid = Keypair.fromPublicKey(publicKey).verify(
      Buffer.from(nonce, 'utf8'),
      Buffer.from(signature, 'base64'),
    );
  } catch {
    valid = false;
  }
  if (!valid) {
    throw new AppError('UNAUTHORIZED', 'Invalid signature');
  }

  // Conditional update guards against a concurrent replay of the same nonce.
  const { count } = await prisma.stellarNonce.updateMany({
    where: { id: record.id, consumed: false },
    data: { consumed: true },
  });
  if (count === 0) {
    throw new AppError('UNAUTHORIZED', 'Invalid or expired nonce');
  }
  return true;
}
