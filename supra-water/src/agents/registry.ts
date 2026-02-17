// =============================================================
// Agent Registry — SUPRA Water 2026 §5.1
//
// Registers all agents, routes events to the correct agent,
// provides health monitoring and lifecycle management.
// =============================================================

import type { DomainEvent, DomainEventType } from '../events/types.js';
import type { AgentContext, AgentHealth, AgentTrigger } from '../types/agents.js';
import type { BaseAgent } from './base-agent.js';

// ─── Agent imports (lazy-loaded to avoid circular deps) ─────

import { VoiceAIAgent } from './voice-ai/agent.js';
import { WhatsAppCXAgent } from './whatsapp-cx/agent.js';
import { BillingEngineAgent } from './billing-engine/agent.js';
import { AnomalyDetectionAgent } from './anomaly-detection/agent.js';
import { CollectionsAgent } from './collections/agent.js';
import { FieldWorkforceAgent } from './field-workforce/agent.js';
import { FraudDetectionAgent } from './fraud-detection/agent.js';
import { RegulatoryAgent } from './regulatory/agent.js';

class AgentRegistry {
  private agents = new Map<string, BaseAgent>();

  // ─── Registration ─────────────────────────────────────────

  register(agent: BaseAgent): void {
    if (this.agents.has(agent.name)) {
      console.warn(`[registry] Agent "${agent.name}" already registered, replacing`);
    }
    this.agents.set(agent.name, agent);
    console.log(`[registry] Registered agent: ${agent.name}`);
  }

  get(name: string): BaseAgent | undefined {
    return this.agents.get(name);
  }

  all(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  // ─── Event Routing ────────────────────────────────────────

  /**
   * Find all agents whose triggers match a given domain event.
   */
  findByEvent(eventType: DomainEventType | string): BaseAgent[] {
    return this.all().filter((agent) =>
      agent.triggers.some(
        (t) => t.type === 'event' && t.eventType === eventType,
      ),
    );
  }

  /**
   * Find agents triggered by a webhook path.
   */
  findByWebhook(path: string): BaseAgent[] {
    return this.all().filter((agent) =>
      agent.triggers.some(
        (t) => t.type === 'webhook' && t.path === path,
      ),
    );
  }

  /**
   * Find agents triggered by WhatsApp messages.
   */
  findByWhatsApp(): BaseAgent[] {
    return this.all().filter((agent) =>
      agent.triggers.some((t) => t.type === 'whatsapp'),
    );
  }

  /**
   * Find agents triggered by voice calls.
   */
  findByVoice(): BaseAgent[] {
    return this.all().filter((agent) =>
      agent.triggers.some((t) => t.type === 'voice'),
    );
  }

  /**
   * Find agents with scheduled triggers matching a cron expression.
   */
  findBySchedule(cron: string): BaseAgent[] {
    return this.all().filter((agent) =>
      agent.triggers.some(
        (t) => t.type === 'schedule' && t.cron === cron,
      ),
    );
  }

  // ─── Route and Execute Domain Event ───────────────────────

  /**
   * Route a domain event to all matching agents and execute them.
   */
  async routeEvent<T extends DomainEventType>(
    event: DomainEvent<T>,
  ): Promise<void> {
    const matchingAgents = this.findByEvent(event.type);

    if (matchingAgents.length === 0) {
      return;
    }

    const context: AgentContext = {
      tenantId: event.tenant_id,
      correlationId: event.id ?? crypto.randomUUID(),
      channel: 'system',
      metadata: { eventType: event.type, aggregateId: event.aggregate_id },
    };

    const prompt = `Process this domain event:\n\nEvent Type: ${event.type}\nAggregate: ${event.aggregate_type} (${event.aggregate_id})\nPayload: ${JSON.stringify(event.payload, null, 2)}`;

    await Promise.allSettled(
      matchingAgents.map(async (agent) => {
        try {
          await agent.process(prompt, context);
        } catch (err) {
          console.error(`[registry] Agent "${agent.name}" failed on ${event.type}:`, err);
        }
      }),
    );
  }

  // ─── Health Monitoring ────────────────────────────────────

  health(): AgentHealth[] {
    return this.all().map((agent) => agent.health);
  }

  // ─── Lifecycle ────────────────────────────────────────────

  /**
   * Register all built-in SUPRA agents.
   */
  registerAll(): void {
    this.register(new VoiceAIAgent());
    this.register(new WhatsAppCXAgent());
    this.register(new BillingEngineAgent());
    this.register(new AnomalyDetectionAgent());
    this.register(new CollectionsAgent());
    this.register(new FieldWorkforceAgent());
    this.register(new FraudDetectionAgent());
    this.register(new RegulatoryAgent());
    console.log(`[registry] All ${this.agents.size} agents registered`);
  }
}

// Singleton
export const agentRegistry = new AgentRegistry();
