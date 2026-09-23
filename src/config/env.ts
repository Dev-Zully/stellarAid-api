/**
 * Environment configuration.
 *
 * The single place that reads `process.env`. Values are parsed and validated
 * once at startup so a bad configuration fails fast with a clear message
 * instead of surfacing as a runtime surprise.
 */

const DEFAULT_PORT = 3000;

export type NodeEnv = 'development' | 'production' | 'test';

export interface AppEnv {
  readonly nodeEnv: NodeEnv;
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
  readonly isTest: boolean;
  readonly port: number;
  readonly redisUrl: string | undefined;
}

function readNodeEnv(): NodeEnv {
  const raw = process.env.NODE_ENV?.trim().toLowerCase();
  if (raw === undefined || raw === '') {
    return 'development';
  }
  if (raw === 'development' || raw === 'production' || raw === 'test') {
    return raw;
  }
  throw new Error(
    `Invalid NODE_ENV "${process.env.NODE_ENV}". Expected one of: development, production, test.`,
  );
}

function readPort(): number {
  const raw = process.env.PORT?.trim();
  if (raw === undefined || raw === '') {
    return DEFAULT_PORT;
  }
  const port = Number.parseInt(raw, 10);
  if (Number.isNaN(port) || port < 0 || port > 65535) {
    throw new Error(`Invalid PORT "${raw}". Expected an integer between 0 and 65535.`);
  }
  return port;
}

function readRedisUrl(): string | undefined {
  const raw = process.env.REDIS_URL?.trim();
  if (raw === undefined || raw === '') {
    return undefined;
  }
  if (!/^rediss?:\/\//.test(raw)) {
    throw new Error(`Invalid REDIS_URL "${raw}". Expected a redis:// or rediss:// URL.`);
  }
  return raw;
}

function loadEnv(): AppEnv {
  const nodeEnv = readNodeEnv();
  return {
    nodeEnv,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
    port: readPort(),
    redisUrl: readRedisUrl(),
  };
}

export const env: AppEnv = loadEnv();
