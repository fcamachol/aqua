import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import postgres from 'postgres';
import type { DomainEvent, DomainEventType } from './types.js';

// =============================================================
// Event Publisher — store + NOTIFY + BullMQ
// =============================================================

const QUEUE_NAME = 'domain-events';
const PG_CHANNEL = 'domain_events';

let sql: postgres.Sql | null = null;
let eventQueue: Queue | null = null;
let redisConnection: IORedis | null = null;

/**
 * Initialize the publisher with database and Redis connections.
 * Call once at application startup.
 */
export function initPublisher(opts?: {
  databaseUrl?: string;
  redisUrl?: string;
}): void {
  const dbUrl =
    opts?.databaseUrl ||
    process.env.DATABASE_URL ||
    'postgresql://supra:supra@localhost:5432/supra_water';

  const redisUrl =
    opts?.redisUrl || process.env.REDIS_URL || 'redis://localhost:6379';

  sql = postgres(dbUrl);

  redisConnection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

  eventQueue = new Queue(QUEUE_NAME, { connection: redisConnection });

  console.log('[publisher] Initialized');
}

/**
 * Emit a domain event:
 *   1. Persist to domain_events table
 *   2. NOTIFY via PostgreSQL for real-time listeners
 *   3. Push to BullMQ queue for reliable async processing
 */
export async function emitEvent<T extends DomainEventType>(
  event: DomainEvent<T>,
): Promise<void> {
  if (!sql || !eventQueue) {
    throw new Error(
      '[publisher] Not initialized. Call initPublisher() first.',
    );
  }

  const metadata = {
    ...event.metadata,
    timestamp: new Date().toISOString(),
  };

  // 1. Store in domain_events table
  await sql`
    INSERT INTO domain_events (tenant_id, event_type, aggregate_type, aggregate_id, payload, metadata)
    VALUES (
      ${event.tenant_id},
      ${event.type},
      ${event.aggregate_type},
      ${event.aggregate_id},
      ${JSON.stringify(event.payload)},
      ${JSON.stringify(metadata)}
    )
  `;

  // 2. Notify via PostgreSQL for real-time listeners
  const notifyPayload = JSON.stringify({
    type: event.type,
    aggregate_id: event.aggregate_id,
    tenant_id: event.tenant_id,
  });

  await sql`SELECT pg_notify(${PG_CHANNEL}, ${notifyPayload})`;

  // 3. Push to BullMQ queue for reliable async processing
  await eventQueue.add(event.type, {
    ...event,
    metadata,
  });
}

/**
 * Shut down publisher connections.
 */
export async function shutdownPublisher(): Promise<void> {
  if (eventQueue) {
    await eventQueue.close();
    eventQueue = null;
  }
  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = null;
  }
  if (sql) {
    await sql.end();
    sql = null;
  }
  console.log('[publisher] Shut down');
}
