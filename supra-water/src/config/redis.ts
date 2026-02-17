import Redis from 'ioredis';
import { env } from './env.js';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

/**
 * Factory function for BullMQ workers/queues.
 * Each BullMQ instance needs its own connection.
 */
export function createBullMQConnection(): Redis {
  return new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}
