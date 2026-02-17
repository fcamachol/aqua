import type { Request, Response, NextFunction } from 'express';
import { redis } from '../config/redis.js';

export interface RateLimitOptions {
  /** Max requests per window. Default: 100 */
  max?: number;
  /** Window size in seconds. Default: 60 (1 minute) */
  windowSec?: number;
  /** Key prefix for Redis. Default: 'rl' */
  prefix?: string;
}

/**
 * Redis-based sliding-window rate limiter.
 * Default: 100 requests per minute per IP (or per authenticated user).
 */
export function rateLimit(options: RateLimitOptions = {}) {
  const { max = 100, windowSec = 60, prefix = 'rl' } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const identifier = req.user?.userId ?? req.ip ?? 'anonymous';
    const key = `${prefix}:${identifier}`;

    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, windowSec);
      }

      const ttl = await redis.ttl(key);
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - current));
      res.setHeader('X-RateLimit-Reset', Math.ceil(Date.now() / 1000) + Math.max(ttl, 0));

      if (current > max) {
        res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Too many requests. Limit: ${max} per ${windowSec}s`,
            correlationId: req.correlationId ?? 'unknown',
          },
        });
        return;
      }

      next();
    } catch (err) {
      // If Redis is down, allow the request through
      console.error('Rate limiter error:', err);
      next();
    }
  };
}
