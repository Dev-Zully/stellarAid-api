/**
 * Prisma client singleton and connection management.
 *
 * A single PrismaClient is shared across the process. The connection pool is
 * bounded via `connection_limit` in the datasource URL; startup connects
 * eagerly so a missing/unreachable database fails fast instead of surfacing
 * mid-request.
 */

import { PrismaClient } from '@prisma/client';
import { env } from '@/config';
import { logger } from '@/utils';

const CONNECTION_POOL_SIZE = 20;

/** Append Prisma's `connection_limit` so the pool is bounded per instance. */
function buildDatabaseUrl(): string {
  const url = new URL(env.databaseUrl);
  if (!url.searchParams.has('connection_limit')) {
    url.searchParams.set('connection_limit', String(CONNECTION_POOL_SIZE));
  }
  return url.toString();
}

export const prisma = new PrismaClient({
  datasources: { db: { url: buildDatabaseUrl() } },
});

/** Establish the connection pool. Throws when the database is unreachable. */
export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  logger.info('Database connected');
}

/** Drain and close the connection pool. */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info('Database disconnected');
}
