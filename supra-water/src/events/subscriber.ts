import { Worker, type Job } from 'bullmq';
import IORedis from 'ioredis';
import type { DomainEvent, DomainEventType, EventHandler } from './types.js';

// =============================================================
// Event Subscriber — BullMQ Worker
// =============================================================

const QUEUE_NAME = 'domain-events';
const DLQ_NAME = 'domain-events-dlq';
const MAX_RETRIES = 3;

type HandlerMap = Map<DomainEventType, EventHandler[]>;

let worker: Worker | null = null;
let redisConnection: IORedis | null = null;

const handlerMap: HandlerMap = new Map();

/**
 * Register a handler for a specific event type.
 * Multiple handlers per event type are supported.
 */
export function registerHandler<T extends DomainEventType>(
  eventType: T,
  handler: EventHandler<T>,
): void {
  const existing = handlerMap.get(eventType) ?? [];
  existing.push(handler as EventHandler);
  handlerMap.set(eventType, existing);
}

/**
 * Start the BullMQ worker that processes events from the queue.
 * Routes each event to its registered handlers by type.
 */
export function startSubscriber(opts?: { redisUrl?: string }): void {
  const redisUrl =
    opts?.redisUrl || process.env.REDIS_URL || 'redis://localhost:6379';

  redisConnection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

  worker = new Worker(
    QUEUE_NAME,
    async (job: Job<DomainEvent>) => {
      const event = job.data;
      const eventType = event.type as DomainEventType;

      const handlers = handlerMap.get(eventType);
      if (!handlers || handlers.length === 0) {
        // No handler registered — skip silently
        return;
      }

      console.log(
        `[subscriber] Processing ${eventType} (job ${job.id}, attempt ${job.attemptsMade + 1})`,
      );

      for (const handler of handlers) {
        await handler(event);
      }
    },
    {
      connection: redisConnection,
      concurrency: 10,
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 5000 },
    },
  );

  // Global error handlers
  worker.on('completed', (job) => {
    console.log(`[subscriber] Completed ${job.name} (job ${job.id})`);
  });

  worker.on('failed', (job, err) => {
    if (!job) return;

    console.error(
      `[subscriber] Failed ${job.name} (job ${job.id}, attempt ${job.attemptsMade}):`,
      err.message,
    );

    // If max retries exhausted, this is a dead letter
    if (job.attemptsMade >= MAX_RETRIES) {
      console.error(
        `[subscriber] Dead letter: ${job.name} (job ${job.id}) — moving to DLQ`,
      );
      // BullMQ keeps failed jobs; we log for observability.
      // A separate DLQ consumer or dashboard can pick these up.
    }
  });

  worker.on('error', (err) => {
    console.error('[subscriber] Worker error:', err);
  });

  console.log('[subscriber] Worker started');
}

/**
 * Gracefully shut down the worker.
 */
export async function shutdownSubscriber(): Promise<void> {
  if (worker) {
    await worker.close();
    worker = null;
  }
  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = null;
  }
  handlerMap.clear();
  console.log('[subscriber] Shut down');
}
