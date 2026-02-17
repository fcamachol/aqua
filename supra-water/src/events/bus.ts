import postgres from 'postgres';
import type { DomainEvent, DomainEventType } from './types.js';

// =============================================================
// PostgreSQL LISTEN/NOTIFY Event Bus
// =============================================================

const PG_CHANNEL = 'domain_events';

type NotifyPayload = {
  type: DomainEventType;
  aggregate_id: string;
  tenant_id: string;
};

type EventBusHandler = (event: NotifyPayload) => Promise<void>;

let listener: postgres.Sql | null = null;
let subscription: postgres.SubscriptionHandle | null = null;
const handlers: EventBusHandler[] = [];

/**
 * Start listening on the PostgreSQL NOTIFY channel.
 * Uses a dedicated connection (separate from the query pool)
 * because LISTEN requires a persistent connection.
 */
export async function startListening(
  connectionString?: string,
  channel: string = PG_CHANNEL,
): Promise<void> {
  const url =
    connectionString ||
    process.env.DATABASE_URL ||
    'postgresql://supra:supra@localhost:5432/supra_water';

  listener = postgres(url, { max: 1 });

  subscription = await listener.listen(channel, async (payload) => {
    let parsed: NotifyPayload;
    try {
      parsed = JSON.parse(payload) as NotifyPayload;
    } catch {
      console.error('[event-bus] Failed to parse NOTIFY payload:', payload);
      return;
    }

    for (const handler of handlers) {
      try {
        await handler(parsed);
      } catch (err) {
        console.error('[event-bus] Handler error:', err);
      }
    }
  });

  console.log(`[event-bus] Listening on channel "${channel}"`);
}

/**
 * Register a handler that receives every NOTIFY on the channel.
 * Typically used for real-time push (e.g. WebSocket fan-out).
 * Heavy processing should go through BullMQ (see subscriber.ts).
 */
export function onEvent(handler: EventBusHandler): void {
  handlers.push(handler);
}

/**
 * Gracefully disconnect the LISTEN connection.
 */
export async function shutdown(): Promise<void> {
  if (subscription) {
    await subscription.unlisten();
    subscription = null;
  }
  if (listener) {
    await listener.end();
    listener = null;
  }
  handlers.length = 0;
  console.log('[event-bus] Shut down');
}
