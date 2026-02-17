import { env } from './env.js';
import type { JwtPayload } from '../types/index.js';

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiration: env.JWT_EXPIRATION,
    refreshExpiration: env.JWT_REFRESH_EXPIRATION,
    algorithm: 'HS256' as const,
    issuer: 'supra-water',
  },
} as const;

export type { JwtPayload };
