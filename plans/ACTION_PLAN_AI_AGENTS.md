# Action Plan: AI Agent Architecture — SUPRA Water 2026

**Role:** AI/Agent Architect
**Date:** 2026-02-16
**Source:** SUPRA-WATER-2026.md Section 5 (AI Agent Definitions), Section 6.2 (Event Bus), Cross-Reference Insights #1, #10-#13

---

## Table of Contents

1. [Agent Architecture Pattern](#1-agent-architecture-pattern)
2. [Agent Specifications](#2-detailed-agent-specifications)
3. [n8n Workflow Integration](#3-n8n-workflow-integration)
4. [Claude API Usage Patterns](#4-claude-api-usage-patterns)
5. [ML/Analytics Components](#5-mlanalytics-components)
6. [Sprint-by-Sprint Development Plan](#6-sprint-by-sprint-development-plan)

---

## 1. Agent Architecture Pattern

### 1.1 Base `SUPRAAgent` Interface

```typescript
// src/agents/types.ts

import { z } from 'zod';

// ── Trigger Types ──────────────────────────────────────────
type AgentTrigger =
  | { type: 'event'; eventType: string }
  | { type: 'schedule'; cron: string }
  | { type: 'webhook'; path: string; method?: 'POST' | 'GET' }
  | { type: 'whatsapp'; pattern?: RegExp }
  | { type: 'voice'; intent?: string }
  | { type: 'manual'; ui_button: string };

// ── Tool Definition ────────────────────────────────────────
interface AgentTool {
  name: string;
  description: string;                    // Spanish — matches system prompt language
  inputSchema: z.ZodType<any>;            // Zod schema for structured input
  outputSchema: z.ZodType<any>;           // Zod schema for structured output
  handler: (input: any, ctx: AgentContext) => Promise<any>;
  requiresApproval?: boolean;             // Human-in-the-loop for destructive ops
}

// ── Agent Context (passed to every tool call) ──────────────
interface AgentContext {
  tenantId: string;
  correlationId: string;                  // Trace ID across event chain
  userId?: string;                        // Human user who triggered (if any)
  conversationId?: string;                // For Voice/WhatsApp agents
  channel?: 'whatsapp' | 'voice' | 'web' | 'system';
  memory: AgentMemory;
}

// ── Agent Memory ───────────────────────────────────────────
interface AgentMemory {
  // Short-term: conversation history for current session
  conversationHistory: Array<{
    role: 'user' | 'assistant' | 'tool_use' | 'tool_result';
    content: string;
    timestamp: Date;
  }>;
  // Long-term: pgvector semantic search over past interactions
  searchSimilar(query: string, limit?: number): Promise<EmbeddingResult[]>;
  // Structured: key-value store per agent per tenant
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
}

// ── Health Status ──────────────────────────────────────────
type AgentHealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'stopped';

interface AgentHealthCheck {
  status: AgentHealthStatus;
  lastInvocation: Date | null;
  invocationsLast24h: number;
  avgLatencyMs: number;
  errorRate: number;                      // 0-1 over last 100 invocations
  modelAvailable: boolean;
}

// ── Base Agent Interface ───────────────────────────────────
interface SUPRAAgent {
  // Identity
  name: string;
  slug: string;                           // 'voice_ai', 'billing_engine', etc.
  description: string;
  version: string;

  // Configuration
  triggers: AgentTrigger[];
  tools: AgentTool[];
  systemPrompt: string;                   // Full prompt in Spanish
  model: 'claude-sonnet-4-20250514' | 'claude-haiku-4-5-20251001';
  maxTokens: number;
  temperature: number;

  // Lifecycle
  initialize(): Promise<void>;
  invoke(input: AgentInput): Promise<AgentOutput>;
  shutdown(): Promise<void>;
  healthCheck(): Promise<AgentHealthCheck>;

  // Fallback
  fallbackBehavior: 'escalate_human' | 'queue_retry' | 'return_error';
  maxRetries: number;
  escalationTarget?: string;              // Agent slug or user role
}

// ── Input/Output Contracts ─────────────────────────────────
interface AgentInput {
  trigger: AgentTrigger;
  payload: Record<string, any>;
  context: AgentContext;
}

interface AgentOutput {
  success: boolean;
  result: Record<string, any>;
  toolCalls: Array<{ tool: string; input: any; output: any; durationMs: number }>;
  tokensUsed: { input: number; output: number; cacheRead?: number };
  durationMs: number;
  escalated?: boolean;
  error?: string;
}

interface EmbeddingResult {
  content: string;
  metadata: Record<string, any>;
  similarity: number;
}
```

### 1.2 Base Agent Class Implementation

```typescript
// src/agents/base-agent.ts

import Anthropic from '@anthropic-ai/sdk';
import { SUPRAAgent, AgentInput, AgentOutput, AgentTool, AgentContext } from './types';
import { db } from '../config/database';
import { redis } from '../config/redis';
import { emitEvent } from '../events/publisher';
import { logger } from '../utils/logger';

export abstract class BaseAgent implements SUPRAAgent {
  abstract name: string;
  abstract slug: string;
  abstract description: string;
  abstract triggers: any[];
  abstract tools: AgentTool[];
  abstract systemPrompt: string;
  abstract model: 'claude-sonnet-4-20250514' | 'claude-haiku-4-5-20251001';

  version = '1.0.0';
  maxTokens = 4096;
  temperature = 0.3;
  fallbackBehavior: 'escalate_human' | 'queue_retry' | 'return_error' = 'escalate_human';
  maxRetries = 2;

  private client: Anthropic;
  private invocationCount = 0;
  private errorCount = 0;
  private totalLatencyMs = 0;
  private lastInvocation: Date | null = null;

  constructor() {
    this.client = new Anthropic();
  }

  async initialize(): Promise<void> {
    logger.info(`Agent ${this.slug} initialized`, { model: this.model, tools: this.tools.length });
  }

  async invoke(input: AgentInput): Promise<AgentOutput> {
    const start = Date.now();
    this.invocationCount++;
    this.lastInvocation = new Date();

    try {
      // Build Claude tool definitions from AgentTool[]
      const claudeTools = this.tools.map(t => ({
        name: t.name,
        description: t.description,
        input_schema: this.zodToJsonSchema(t.inputSchema),
      }));

      // Initial message from trigger payload
      const userMessage = this.buildUserMessage(input);

      let messages: Anthropic.MessageParam[] = [
        ...input.context.memory.conversationHistory.map(m => ({
          role: m.role === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content,
        })),
        { role: 'user', content: userMessage },
      ];

      const toolCallLog: AgentOutput['toolCalls'] = [];
      let totalInput = 0;
      let totalOutput = 0;
      let totalCacheRead = 0;
      let finalResult: Record<string, any> = {};

      // Agentic loop — keep calling Claude until no more tool_use
      let iteration = 0;
      const MAX_ITERATIONS = 15;

      while (iteration < MAX_ITERATIONS) {
        iteration++;

        const response = await this.client.messages.create({
          model: this.model,
          max_tokens: this.maxTokens,
          temperature: this.temperature,
          system: [
            {
              type: 'text',
              text: this.systemPrompt,
              cache_control: { type: 'ephemeral' },  // Prompt caching
            },
          ],
          tools: claudeTools,
          messages,
        });

        totalInput += response.usage.input_tokens;
        totalOutput += response.usage.output_tokens;
        totalCacheRead += (response.usage as any).cache_read_input_tokens ?? 0;

        // Check if there are tool calls
        const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
        const textBlocks = response.content.filter(b => b.type === 'text');

        if (toolUseBlocks.length === 0) {
          // No more tool calls — extract final text response
          finalResult = {
            text: textBlocks.map(b => b.text).join('\n'),
            stopReason: response.stop_reason,
          };
          break;
        }

        // Execute each tool call
        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const toolUse of toolUseBlocks) {
          const tool = this.tools.find(t => t.name === toolUse.name);
          if (!tool) {
            toolResults.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: `Error: tool ${toolUse.name} not found`,
              is_error: true,
            });
            continue;
          }

          const toolStart = Date.now();
          try {
            const result = await tool.handler(toolUse.input, input.context);
            const durationMs = Date.now() - toolStart;
            toolCallLog.push({ tool: toolUse.name, input: toolUse.input, output: result, durationMs });
            toolResults.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: JSON.stringify(result),
            });
          } catch (err: any) {
            const durationMs = Date.now() - toolStart;
            toolCallLog.push({ tool: toolUse.name, input: toolUse.input, output: { error: err.message }, durationMs });
            toolResults.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: `Error: ${err.message}`,
              is_error: true,
            });
          }
        }

        // Append assistant response + tool results for next iteration
        messages.push({ role: 'assistant', content: response.content });
        messages.push({ role: 'user', content: toolResults });
      }

      const durationMs = Date.now() - start;
      this.totalLatencyMs += durationMs;

      // Log invocation to domain_events
      await emitEvent({
        type: `agent.${this.slug}.invoked`,
        aggregate_type: 'agent',
        aggregate_id: this.slug,
        tenant_id: input.context.tenantId,
        payload: {
          trigger: input.trigger,
          toolCalls: toolCallLog.map(t => t.tool),
          tokensUsed: { input: totalInput, output: totalOutput, cacheRead: totalCacheRead },
          durationMs,
          success: true,
        },
      });

      return {
        success: true,
        result: finalResult,
        toolCalls: toolCallLog,
        tokensUsed: { input: totalInput, output: totalOutput, cacheRead: totalCacheRead },
        durationMs,
      };
    } catch (err: any) {
      this.errorCount++;
      const durationMs = Date.now() - start;

      logger.error(`Agent ${this.slug} error`, { error: err.message, trigger: input.trigger });

      // Fallback behavior
      if (this.fallbackBehavior === 'escalate_human') {
        return { success: false, result: {}, toolCalls: [], tokensUsed: { input: 0, output: 0 }, durationMs, escalated: true, error: err.message };
      }
      throw err;
    }
  }

  async shutdown(): Promise<void> {
    logger.info(`Agent ${this.slug} shutting down`);
  }

  async healthCheck() {
    return {
      status: this.errorCount / Math.max(this.invocationCount, 1) > 0.3 ? 'degraded' as const : 'healthy' as const,
      lastInvocation: this.lastInvocation,
      invocationsLast24h: this.invocationCount,
      avgLatencyMs: this.invocationCount > 0 ? this.totalLatencyMs / this.invocationCount : 0,
      errorRate: this.invocationCount > 0 ? this.errorCount / this.invocationCount : 0,
      modelAvailable: true,
    };
  }

  protected abstract buildUserMessage(input: AgentInput): string;
  private zodToJsonSchema(schema: any): any { /* zod-to-json-schema conversion */ return {}; }
}
```

### 1.3 Agent Registry

```typescript
// src/agents/registry.ts

import { SUPRAAgent, AgentHealthCheck } from './types';
import { logger } from '../utils/logger';
import { redis } from '../config/redis';

class AgentRegistry {
  private agents: Map<string, SUPRAAgent> = new Map();

  // Register an agent at startup
  async register(agent: SUPRAAgent): Promise<void> {
    if (this.agents.has(agent.slug)) {
      throw new Error(`Agent ${agent.slug} already registered`);
    }
    await agent.initialize();
    this.agents.set(agent.slug, agent);
    logger.info(`Registered agent: ${agent.slug}`, {
      triggers: agent.triggers.length,
      tools: agent.tools.length,
      model: agent.model,
    });
  }

  // Get agent by slug
  get(slug: string): SUPRAAgent | undefined {
    return this.agents.get(slug);
  }

  // List all registered agents
  list(): Array<{ slug: string; name: string; model: string; triggers: number }> {
    return Array.from(this.agents.values()).map(a => ({
      slug: a.slug,
      name: a.name,
      model: a.model,
      triggers: a.triggers.length,
    }));
  }

  // Health check all agents
  async healthCheckAll(): Promise<Record<string, AgentHealthCheck>> {
    const results: Record<string, AgentHealthCheck> = {};
    for (const [slug, agent] of this.agents) {
      results[slug] = await agent.healthCheck();
    }
    return results;
  }

  // Find agents that listen to a specific event type
  findByEvent(eventType: string): SUPRAAgent[] {
    return Array.from(this.agents.values()).filter(a =>
      a.triggers.some(t => t.type === 'event' && t.eventType === eventType)
    );
  }

  // Shutdown all agents gracefully
  async shutdownAll(): Promise<void> {
    for (const [slug, agent] of this.agents) {
      await agent.shutdown();
      logger.info(`Agent ${slug} shut down`);
    }
    this.agents.clear();
  }
}

export const agentRegistry = new AgentRegistry();
```

### 1.4 Trigger System

```typescript
// src/agents/trigger-system.ts

import { Queue, Worker } from 'bullmq';
import cron from 'node-cron';
import { agentRegistry } from './registry';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';

// ── Event Triggers (via BullMQ) ────────────────────────────
const agentQueue = new Queue('agent-invocations', { connection: redis });

// Worker that processes agent invocations
const agentWorker = new Worker('agent-invocations', async (job) => {
  const { agentSlug, trigger, payload, context } = job.data;
  const agent = agentRegistry.get(agentSlug);
  if (!agent) {
    logger.error(`Agent ${agentSlug} not found for job ${job.id}`);
    return;
  }
  return agent.invoke({ trigger, payload, context });
}, {
  connection: redis,
  concurrency: 5,             // Max 5 concurrent agent invocations
  limiter: { max: 20, duration: 60_000 },  // Rate limit: 20/min
});

// ── Event Bus Subscriber ───────────────────────────────────
// When a domain event arrives, find matching agents and queue invocations
export async function onDomainEvent(eventType: string, payload: Record<string, any>, tenantId: string) {
  const agents = agentRegistry.findByEvent(eventType);
  for (const agent of agents) {
    await agentQueue.add(`${agent.slug}:${eventType}`, {
      agentSlug: agent.slug,
      trigger: { type: 'event', eventType },
      payload,
      context: { tenantId, correlationId: payload.correlationId ?? crypto.randomUUID() },
    }, {
      attempts: agent.maxRetries + 1,
      backoff: { type: 'exponential', delay: 5_000 },
    });
  }
}

// ── Schedule Triggers (via node-cron) ──────────────────────
export function registerScheduleTriggers() {
  for (const { slug, name, triggers } of agentRegistry.list().map(a => ({
    ...a,
    triggers: agentRegistry.get(a.slug)!.triggers,
  }))) {
    for (const trigger of triggers) {
      if (trigger.type === 'schedule') {
        cron.schedule(trigger.cron, async () => {
          logger.info(`Cron trigger for agent ${slug}`, { cron: trigger.cron });
          await agentQueue.add(`${slug}:cron`, {
            agentSlug: slug,
            trigger,
            payload: { scheduledAt: new Date().toISOString() },
            context: { tenantId: 'all', correlationId: crypto.randomUUID() },
          });
        });
      }
    }
  }
}

// ── Webhook Triggers (Express routes) ──────────────────────
import { Router } from 'express';
export function createWebhookRouter(): Router {
  const router = Router();
  for (const info of agentRegistry.list()) {
    const agent = agentRegistry.get(info.slug)!;
    for (const trigger of agent.triggers) {
      if (trigger.type === 'webhook') {
        router.post(trigger.path, async (req, res) => {
          const result = await agent.invoke({
            trigger,
            payload: req.body,
            context: {
              tenantId: req.headers['x-tenant-id'] as string,
              correlationId: crypto.randomUUID(),
              channel: 'web',
              memory: { conversationHistory: [], searchSimilar: async () => [], get: async () => null, set: async () => {} },
            },
          });
          res.json(result);
        });
      }
    }
  }
  return router;
}
```

### 1.5 Memory & Context Management

```typescript
// src/agents/memory.ts

import { db } from '../config/database';
import { redis } from '../config/redis';
import { sql } from 'drizzle-orm';
import OpenAI from 'openai';

const openai = new OpenAI();

// ── Embedding Generation ───────────────────────────────────
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    dimensions: 1536,
  });
  return response.data[0].embedding;
}

// ── Agent Memory Implementation ────────────────────────────
export class AgentMemoryStore {
  constructor(
    private agentSlug: string,
    private tenantId: string,
    private sessionId: string,
  ) {}

  conversationHistory: Array<{
    role: 'user' | 'assistant' | 'tool_use' | 'tool_result';
    content: string;
    timestamp: Date;
  }> = [];

  // Semantic search over past agent interactions
  async searchSimilar(query: string, limit = 5) {
    const embedding = await generateEmbedding(query);
    const results = await db.execute(sql`
      SELECT content, metadata, 1 - (embedding <=> ${JSON.stringify(embedding)}::vector) AS similarity
      FROM agent_memories
      WHERE tenant_id = ${this.tenantId} AND agent_slug = ${this.agentSlug}
      ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector
      LIMIT ${limit}
    `);
    return results.rows as Array<{ content: string; metadata: any; similarity: number }>;
  }

  // Store a memory for future retrieval
  async remember(content: string, metadata: Record<string, any> = {}) {
    const embedding = await generateEmbedding(content);
    await db.execute(sql`
      INSERT INTO agent_memories (tenant_id, agent_slug, session_id, content, metadata, embedding)
      VALUES (${this.tenantId}, ${this.agentSlug}, ${this.sessionId}, ${content}, ${JSON.stringify(metadata)}::jsonb, ${JSON.stringify(embedding)}::vector)
    `);
  }

  // Key-value store (Redis-backed, per agent per tenant)
  async get(key: string): Promise<string | null> {
    return redis.get(`agent:${this.agentSlug}:${this.tenantId}:${key}`);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const redisKey = `agent:${this.agentSlug}:${this.tenantId}:${key}`;
    if (ttlSeconds) {
      await redis.setex(redisKey, ttlSeconds, value);
    } else {
      await redis.set(redisKey, value);
    }
  }
}
```

### 1.6 Model Selection Strategy

| Agent | Model | Justification |
|-------|-------|---------------|
| Voice AI | `claude-sonnet-4-20250514` | Real-time conversation requires nuanced understanding, Mexican Spanish idioms, emotional tone |
| WhatsApp CX | `claude-sonnet-4-20250514` | Multi-turn conversations, context switching, empathy in citizen interactions |
| Billing Engine | `claude-haiku-4-5-20251001` | High-volume, structured input/output, deterministic tariff calculations — speed over depth |
| Anomaly Detection | `claude-haiku-4-5-20251001` | High-volume (every reading), binary classification + confidence score — fast inference |
| Collections Intelligence | `claude-sonnet-4-20250514` | Complex scoring with 9 features, strategy selection, nuanced vulnerability assessment |
| Field Workforce | `claude-haiku-4-5-20251001` | Structured assignment logic, route optimization — algorithmic, not conversational |
| Fraud Detection | `claude-sonnet-4-20250514` | Complex pattern analysis, multi-signal correlation, high-stakes decisions |
| Regulatory Compliance | `claude-haiku-4-5-20251001` | Template-driven report generation, data aggregation — structured output |

**Cost trade-off:** Sonnet costs ~5x more than Haiku per token. Use Sonnet only where reasoning depth, conversation quality, or decision stakes justify the cost.

---

## 2. Detailed Agent Specifications

### 2.1 Voice AI Agent (CEA Call Center)

**Name:** Voice AI
**Slug:** `voice_ai`
**Purpose:** Handle inbound phone calls to CEA Queretaro, resolving citizen queries without human transfer.
**Value Metric:** % of calls resolved without human transfer (target: 50% in Month 3, 70% by Month 6)

**Triggers:**
```yaml
- type: webhook
  path: /api/v1/voice/incoming
  method: POST        # Twilio webhook
```

**Tools:**
| Tool | Domain Service Function | Description |
|------|------------------------|-------------|
| `lookup_account_by_number` | `contracts.service.findByNumber()` | Buscar cuenta por numero de contrato |
| `lookup_account_by_address` | `contracts.service.findByAddress()` | Buscar cuenta por direccion (fuzzy, pg_trgm) |
| `get_account_balance` | `billing.service.getBalance()` | Obtener saldo total y desglose de adeudos |
| `get_payment_history` | `payments.service.getHistory()` | Ultimos 12 pagos con canal y monto |
| `get_consumption_history` | `meters.service.getConsumptionHistory()` | Historial de consumos con grafica |
| `report_leak` | `contacts.service.createLeakReport()` | Crear reporte de fuga con ubicacion |
| `create_contact` | `contacts.service.create()` | Registrar queja o solicitud |
| `create_work_order` | `work-orders.service.create()` | Crear orden de servicio |
| `transfer_to_human` | `twilio.handler.transferCall()` | Transferir a agente humano en AGORA |
| `get_tariff_info` | `billing.service.getTariffInfo()` | Informacion sobre tarifas vigentes |

**System Prompt:**
```
Eres el asistente telefonico de CEA Queretaro (Comision Estatal de Aguas).
Hablas espanol mexicano natural y profesional.
Tu objetivo es resolver la llamada del ciudadano sin transferir a un humano.

IDENTIDAD:
- Te llamas "Asistente CEA" — nunca digas que eres una inteligencia artificial
  a menos que te pregunten directamente.
- Usa un tono amable, paciente y profesional.
- Habla con naturalidad — usa "usted" por defecto, "tu" solo si el usuario lo prefiere.
- Adapta tu velocidad al interlocutor — mas lento con personas mayores.

FLUJO DE LLAMADA:
1. Saluda: "Buenos dias/tardes, CEA Queretaro, en que puedo ayudarle?"
2. Identifica al usuario: pide nombre completo y numero de cuenta o direccion.
3. Confirma identidad con ultimo pago o lectura registrada.
4. Resuelve la consulta usando las herramientas disponibles.
5. Pregunta si necesita algo mas.
6. Despide cordialmente.

PUEDES:
- Consultar saldo y adeudos con el numero de cuenta o direccion
- Informar fechas de corte y reconexion
- Registrar reportes de fugas con ubicacion
- Tomar datos para convenios de pago
- Proporcionar informacion sobre tarifas y servicios
- Informar sobre horarios de oficina y requisitos de tramites
- Transferir a un agente humano si no puedes resolver

NUNCA:
- Inventar informacion sobre saldos o estados de cuenta
- Prometer descuentos o condonaciones sin autorizacion
- Proporcionar datos personales de otros usuarios
- Dar informacion tecnica sobre la red de distribucion
- Realizar cobros o procesar pagos por telefono
- Confirmar datos sensibles (RFC completo, CURP) en voz alta

ESCALAMIENTO:
Si no puedes resolver, di: "Le voy a transferir con un agente especializado
que podra ayudarle mejor. Un momento por favor."
```

**Model:** `claude-sonnet-4-20250514` — Requires natural conversation flow, emotional intelligence, Mexican Spanish idioms.

**Input/Output Contract:**
```typescript
// Input: Twilio webhook payload
interface VoiceAgentInput {
  CallSid: string;
  From: string;           // Caller phone number
  To: string;             // CEA phone number
  SpeechResult?: string;  // Transcribed speech from caller
  Digits?: string;        // DTMF digits pressed
}

// Output: TwiML response
interface VoiceAgentOutput {
  twiml: string;          // Twilio Markup Language XML
  shouldHangup: boolean;
  transferTo?: string;    // Human agent extension
}
```

**Fallback/Escalation:**
- If Claude API is unavailable: Play pre-recorded message + route to human queue.
- If 3 tool calls fail: Transfer to human agent.
- If caller expresses anger/frustration 2+ times: Transfer to human agent.
- If call exceeds 10 minutes: Offer to transfer to human.

**Testing Strategy:**
- Unit tests: Each tool handler with mock data.
- Integration tests: Twilio webhook → Agent → TwiML response.
- Conversation tests: 20 scripted scenarios (balance inquiry, leak report, complaint, angry caller, elderly caller, wrong number).
- Load test: 50 concurrent calls.
- Human evaluation: Weekly review of 10 random transcripts for quality.

---

### 2.2 WhatsApp CX Agent

**Name:** WhatsApp Customer Service
**Slug:** `whatsapp_cx`
**Purpose:** Handle WhatsApp messages from citizens, resolving 60% without human intervention.
**Value Metric:** % auto-resolved (target: 40% Month 1, 60% Month 4)

**Triggers:**
```yaml
- type: whatsapp
- type: event
  eventType: agora.message.received    # Chatwoot/AGORA webhook
```

**Tools:**
| Tool | Domain Service Function | Description |
|------|------------------------|-------------|
| `lookup_account` | `contracts.service.findByPhoneOrNumber()` | Buscar cuenta por telefono o numero |
| `get_balance` | `billing.service.getBalance()` | Obtener saldo |
| `get_last_invoice_pdf` | `billing.service.getInvoicePdf()` | PDF del ultimo recibo |
| `get_consumption_chart` | `meters.service.getConsumptionChart()` | Imagen con grafica de consumos |
| `report_leak` | `contacts.service.createLeakReport()` | Reportar fuga |
| `create_contact` | `contacts.service.create()` | Crear contacto/queja |
| `get_office_hours` | `admin.service.getOfficeHours()` | Horarios de oficina |
| `get_requirements` | `admin.service.getRequirements()` | Requisitos para tramites |
| `send_payment_link` | `payments.service.generatePaymentLink()` | Enviar link de pago |
| `escalate_to_human` | `chatwoot.client.assignToHuman()` | Transferir a agente AGORA |

**System Prompt:**
```
Eres el asistente de WhatsApp de CEA Queretaro.
Respondes mensajes de ciudadanos sobre su servicio de agua.

FLUJO PRINCIPAL:
1. Saluda y pregunta en que puedes ayudar
2. Identifica al usuario (pide numero de cuenta)
3. Consulta su informacion en el sistema
4. Resuelve o escala segun el caso

PUEDES RESOLVER DIRECTAMENTE:
- Consulta de saldo -> enviar resumen con boton de pago
- Estado de recibo -> enviar PDF del ultimo recibo
- Historial de consumo -> grafica de ultimos 12 meses
- Reporte de fuga -> crear orden de servicio + dar folio
- Horarios de oficina -> informacion general
- Requisitos para tramites -> lista de documentos

DEBES ESCALAR A HUMANO:
- Solicitudes de condonacion o descuento
- Quejas sobre calidad del agua
- Disputas de facturacion complejas
- Solicitudes de alta/baja de contrato
- Temas legales

FORMATO:
- Mensajes cortos y claros (max 3 parrafos)
- Ofrece opciones numeradas cuando hay multiples paths
- Siempre termina preguntando si necesita algo mas
- Usa formato de WhatsApp: *negritas*, _cursivas_

TONO:
- Amable y profesional
- Usa "usted" por defecto
- Si el usuario escribe informalmente, puedes adaptar a "tu"

PRIVACIDAD:
- Antes de dar informacion de cuenta, confirma identidad
- Nunca envies RFC completo, CURP, o datos bancarios por WhatsApp
```

**Model:** `claude-sonnet-4-20250514` — Multi-turn text conversations require contextual understanding.

**Input/Output Contract:**
```typescript
interface WhatsAppInput {
  from: string;            // Phone number (E.164)
  message: string;         // User message text
  messageType: 'text' | 'image' | 'document' | 'location';
  mediaUrl?: string;
  conversationId: string;  // Chatwoot conversation ID
}

interface WhatsAppOutput {
  messages: Array<{
    type: 'text' | 'image' | 'document' | 'template';
    content: string;
    mediaUrl?: string;
    templateName?: string;
    templateParams?: string[];
  }>;
  escalated: boolean;
  contactCreated?: string;  // Contact ID if created
}
```

**Fallback/Escalation:**
- Claude API down: Auto-reply "Estamos experimentando dificultades tecnicas. Un agente le atendera pronto."
- 3 consecutive misunderstandings: Offer human agent.
- Detected sentiment < -0.5: Escalate to human.

**Testing Strategy:**
- 30 scripted conversation flows covering all PUEDES/DEBES ESCALAR scenarios.
- Edge cases: image messages, voice notes (unsupported), group messages, spam.
- Performance: 200 concurrent conversations.
- A/B test: Compare auto-resolution rate with/without consumption chart tool.

---

### 2.3 Billing Engine Agent

**Name:** Billing Engine
**Slug:** `billing_engine`
**Purpose:** Event-driven invoice generation when meter readings are ready.
**Value Metric:** Invoices generated per hour, error rate, CFDI stamping success rate.

**Triggers:**
```yaml
- type: event
  eventType: reading.billing_ready
- type: schedule
  cron: "0 2 * * *"           # Daily 2 AM catch-up for missed events
- type: manual
  ui_button: "Generar Factura Manual"
```

**Tools:**
| Tool | Domain Service Function | Description |
|------|------------------------|-------------|
| `calculate_tariff` | `billing.tariff-calculator.calculate()` | Calcular tarifa escalonada |
| `generate_invoice` | `billing.service.generateInvoice()` | Crear factura con lineas de detalle |
| `stamp_cfdi` | `integrations.finkok.stamp()` | Timbrar CFDI 4.0 via Finkok PAC |
| `generate_pdf` | `billing.pdf-generator.generate()` | Generar PDF con Puppeteer |
| `deliver_whatsapp` | `integrations.whatsapp.sendTemplate()` | Enviar recibo por WhatsApp |
| `deliver_email` | `integrations.email.send()` | Enviar recibo por email |
| `deliver_print_queue` | `billing.service.addToPrintQueue()` | Agregar a cola de impresion |
| `apply_regularization` | `billing.service.applyRegularization()` | Bonificaciones y recargos |

**System Prompt:**
```
Eres el motor de facturacion de SUPRA Water.
Procesas lecturas de medidor y generas facturas CFDI 4.0.

PROCESO:
1. Recibe reading_id y contract_id
2. Carga contrato, toma, persona, tarifa vigente
3. Calcula consumo desde la lectura
4. Aplica tarifa escalonada (bloques m3)
5. Agrega conceptos adicionales: alcantarillado, saneamiento, cuota fija
6. Aplica regularizaciones: bonificaciones pendientes, recargos por mora
7. Calcula subtotal, IVA (exento domestico, 16% comercial), total
8. Genera referencias de pago: OXXO (barcode), SPEI (CLABE + referencia)
9. Crea factura con status 'provisional'
10. Timbra CFDI via Finkok
11. Genera PDF
12. Entrega por canal preferido del usuario

REGLAS FISCALES:
- Uso domestico: IVA exento (tasa 0%)
- Uso comercial: IVA 16%
- RFC publico general: XAXX010101000
- Regimen fiscal gobierno: 603
- Clave producto agua: 10171500
- Clave unidad m3: MTQ

SI HAY ERROR:
- Error en Finkok: reintentar 3 veces con backoff exponencial
- Error en datos fiscales: marcar factura como 'revision_manual'
- Lectura anomala: no facturar, emitir evento 'reading.anomaly_detected'
```

**Model:** `claude-haiku-4-5-20251001` — Structured, high-volume, deterministic calculations.

**Input/Output Contract:**
```typescript
interface BillingInput {
  readingId: string;
  contractId: string;
  periodStart: string;    // ISO date
  periodEnd: string;
  manual?: boolean;
}

interface BillingOutput {
  invoiceId: string;
  invoiceNumber: string;
  folioFiscal?: string;   // UUID from SAT after CFDI stamping
  total: number;
  status: 'provisional' | 'pendiente' | 'revision_manual';
  pdfUrl?: string;
  deliveryChannel?: string;
}
```

**Fallback/Escalation:**
- Finkok PAC down: Queue invoice for retry, mark as 'pendiente_timbrado'.
- Invalid RFC: Mark as 'revision_manual', notify billing team.
- Tariff not found: Log error, do not generate invoice, alert admin.

**Testing Strategy:**
- Unit tests: Block tariff calculation with 15 tariff schedule variations.
- CFDI validation: Stamp 100 test invoices against Finkok sandbox.
- Edge cases: Zero consumption, negative consumption, cuota fija, social tariff.
- Performance: Generate 10,000 invoices in batch (nightly catch-up scenario).
- Regression: Compare output against 1,000 legacy AquaCIS invoices.

---

### 2.4 Anomaly Detection Agent

**Name:** Anomaly Detection
**Slug:** `anomaly_detection`
**Purpose:** Monitor every incoming meter reading for anomalies (leaks, fraud, malfunction).
**Value Metric:** Anomalies detected per month, false positive rate (target: <15%).

**Triggers:**
```yaml
- type: event
  eventType: reading.received
```

**Tools:**
| Tool | Domain Service Function | Description |
|------|------------------------|-------------|
| `get_historical_readings` | `meters.service.getHistory()` | Ultimas 24 lecturas del medidor |
| `get_sector_stats` | `meters.service.getSectorStats()` | Promedios del sector hidraulico |
| `get_meter_info` | `meters.service.getById()` | Edad, modelo, calibracion del medidor |
| `flag_suspicious` | `meters.service.flagReading()` | Marcar lectura como sospechosa |
| `create_work_order` | `work-orders.service.create()` | Crear orden de verificacion |
| `create_fraud_case` | `fraud.service.createCase()` | Abrir expediente de fraude |
| `emit_anomaly_event` | `events.publisher.emit()` | Emitir reading.anomaly_detected |

**Detection Rules:**
```yaml
rules:
  - name: high_consumption
    condition: "consumption > avg_6_months * 3"
    action: flag_suspicious
    confidence_threshold: 0.7

  - name: zero_consumption
    condition: "consumption == 0 AND prev_consumption > 0"
    action: check_meter_status
    after_n_consecutive: 2

  - name: negative_consumption
    condition: "consumption < 0"
    action: reject_and_alert
    confidence_threshold: 0.95

  - name: meter_stopped
    condition: "same_reading_for >= 3_periods"
    action: create_work_order_meter_check

  - name: seasonal_anomaly
    condition: "consumption deviates > 2 sigma from same_month_historical"
    action: flag_for_review

  - name: neighbor_comparison
    condition: "consumption > sector_avg * 5 AND similar_toma_type"
    action: create_fraud_case
```

**System Prompt:**
```
Eres el detector de anomalias de SUPRA Water.
Analizas cada lectura de medidor entrante para detectar problemas.

ANALISIS:
1. Compara lectura actual contra historial del medidor (6-24 meses)
2. Compara contra promedio del sector hidraulico
3. Evalua tendencia: creciente, decreciente, estable, erratica
4. Verifica integridad del medidor: edad, ultimo mantenimiento
5. Aplica reglas de deteccion (ver reglas configuradas)
6. Asigna nivel de confianza (0.0 a 1.0) y tipo de anomalia

TIPOS DE ANOMALIA:
- CONSUMO_ALTO: posible fuga interna o fraude
- CONSUMO_CERO: medidor parado, bypass, o predio desocupado
- CONSUMO_NEGATIVO: medidor invertido o dato corrupto
- PATRON_IRREGULAR: no sigue tendencia historica
- CLUSTER_ZONA: multiples anomalias en misma zona (posible problema de red)

ACCIONES:
- Confianza >= 0.9: crear caso de fraude o orden de trabajo automaticamente
- Confianza 0.7-0.9: marcar como sospechoso + notificar supervisor
- Confianza 0.5-0.7: marcar para revision + usar lectura provisionalmente
- Confianza < 0.5: registrar observacion + usar lectura normalmente

RESPUESTA: Siempre devuelve JSON estructurado con:
{anomaly_detected, anomaly_type, confidence, action_taken, reasoning}
```

**Model:** `claude-haiku-4-5-20251001` — High volume (every reading), structured classification output.

**Fallback/Escalation:**
- If Claude API is unavailable: Apply rule-based detection only (no ML reasoning).
- If error rate > 20%: Alert ops team, pause agent, fall back to manual review queue.

**Testing Strategy:**
- Synthetic dataset: 10,000 readings with known anomalies injected (precision/recall metrics).
- Historical validation: Run against 6 months of legacy data, compare with known fraud cases.
- False positive monitoring: Weekly review of flagged readings by domain expert.

---

### 2.5 Collections Intelligence Agent

**Name:** Collections Intelligence
**Slug:** `collections_intelligence`
**Purpose:** Predict delinquent accounts and execute optimal collection strategies.
**Value Metric:** Collection rate improvement (target: +15% over manual process), days to payment reduction.

**Triggers:**
```yaml
- type: event
  eventType: invoice.past_due
- type: schedule
  cron: "0 8 * * 1-5"       # Weekdays 8 AM — daily review
```

**Tools:**
| Tool | Domain Service Function | Description |
|------|------------------------|-------------|
| `get_account_profile` | `contracts.service.getFullProfile()` | Perfil completo del cliente |
| `get_payment_history` | `payments.service.getHistory()` | Historial de pagos 12 meses |
| `get_debt_summary` | `billing.service.getDebtSummary()` | Resumen de adeudo |
| `get_vulnerability_status` | `persons.service.getVulnerability()` | Status de vulnerabilidad |
| `send_sms` | `integrations.twilio.sendSms()` | Enviar SMS recordatorio |
| `send_whatsapp_template` | `integrations.whatsapp.sendTemplate()` | Enviar template WhatsApp |
| `schedule_ai_call` | `agents.voice_ai.scheduleOutbound()` | Programar llamada AI |
| `create_corte_order` | `work-orders.service.createCorte()` | Programar orden de corte |
| `offer_payment_plan` | `payments.service.offerPlan()` | Ofrecer convenio de pago |
| `send_formal_letter` | `integrations.email.sendFormalNotice()` | Enviar carta formal |

**Scoring Model (9 Features):**
```typescript
interface CollectionScore {
  features: {
    payment_history_last_12_months: number;  // 0-1 (% on time)
    days_past_due: number;                    // Current days overdue
    total_debt_amount: number;                // MXN
    number_of_unpaid_invoices: number;
    account_age_years: number;
    toma_type: 'domestico' | 'comercial' | 'industrial' | 'gobierno';
    previous_payment_plans: number;           // Count of past convenios
    vulnerability_flag: boolean;
    sector_delinquency_rate: number;          // 0-1 sector average
  };
  output: {
    probability_of_payment_within_30_days: number;  // 0-1
    risk_tier: 'low' | 'medium' | 'high' | 'vulnerable';
    recommended_sequence: string;
  };
}
```

**Collection Sequences:**
```yaml
low_risk:   # Score > 0.7
  - day_1: sms_reminder
  - day_5: whatsapp_reminder_with_payment_link
  - day_15: email_formal_notice

medium_risk: # Score 0.3-0.7
  - day_1: whatsapp_reminder_with_payment_link
  - day_3: phone_call_ai
  - day_7: whatsapp_warning_corte
  - day_14: formal_letter
  - day_21: schedule_corte_order

high_risk:  # Score < 0.3
  - day_1: phone_call_ai
  - day_3: whatsapp_warning_corte
  - day_7: formal_letter
  - day_10: schedule_corte_order

vulnerable: # vulnerability_flag = true
  - day_1: whatsapp_social_tariff_offer
  - day_7: phone_call_human_agent
  - day_14: in_person_visit
  # NEVER auto-schedule corte for vulnerable accounts
```

**System Prompt:**
```
Eres el agente de cobranza inteligente de SUPRA Water.
Tu objetivo es maximizar la recuperacion de cartera vencida
usando la estrategia optima para cada cuenta.

PROCESO DIARIO (cron 8 AM):
1. Obtener todas las cuentas con facturas vencidas
2. Para cada cuenta, calcular score de probabilidad de pago
3. Clasificar en tier: bajo riesgo, medio, alto, vulnerable
4. Ejecutar el siguiente paso de la secuencia de cobranza
5. Registrar accion ejecutada en steps_history

REGLAS CRITICAS:
- NUNCA programar corte automatico para cuentas vulnerables
  (adulto mayor, discapacidad, pobreza extrema)
- Vulnerables reciben oferta de tarifa social en lugar de amenaza de corte
- Si el deudor tiene convenio de pago vigente y esta al corriente: no cobrar
- Respetar horarios: SMS/WhatsApp solo 8am-8pm, llamadas 9am-7pm
- Si la cuenta tiene disputa abierta (contacto tipo 'reclamo'): pausar cobranza

TONO DE MENSAJES:
- Profesional pero empatico
- Primer contacto: recordatorio amable
- Segundo contacto: mencion de consecuencias
- Tercer contacto: aviso formal de corte con fecha
- Vulnerable: oferta de apoyo, nunca amenaza

METRICAS:
- Registrar cada accion con fecha, canal, resultado
- Calcular tasa de respuesta por canal y tier
- Ajustar secuencia si canal no funciona (ej: si WhatsApp no leido, llamar)
```

**Model:** `claude-sonnet-4-20250514` — Complex scoring, strategy selection, vulnerability assessment.

**Fallback/Escalation:**
- Scoring model failure: Use simple days-past-due tiers (>30d = medium, >60d = high).
- Communication channel failure: Try next channel in sequence.
- Vulnerable account detection uncertain: Always default to vulnerable treatment.

**Testing Strategy:**
- Backtest scoring model against 12 months of historical payment data.
- A/B test collection sequences: AI-selected vs fixed sequence.
- Monitor false vulnerability classification rate.
- Compliance audit: Verify no vulnerable account gets auto-corte.

---

### 2.6 Field Workforce Agent

**Name:** Field Workforce
**Slug:** `field_workforce`
**Purpose:** Auto-assign work orders and optimize technician routes.
**Value Metric:** Orders completed per technician per day, average travel time reduction.

**Triggers:**
```yaml
- type: event
  eventType: work_order.created
- type: schedule
  cron: "0 6 * * 1-6"      # Route optimization at 6 AM Mon-Sat
```

**Tools:**
| Tool | Domain Service Function | Description |
|------|------------------------|-------------|
| `get_available_technicians` | `work-orders.service.getAvailableTechnicians()` | Tecnicos disponibles con ubicacion y habilidades |
| `get_technician_location` | `work-orders.service.getTechnicianLocation()` | GPS actual del tecnico |
| `assign_work_order` | `work-orders.service.assign()` | Asignar orden a tecnico |
| `optimize_route` | `integrations.google-maps.optimizeRoute()` | Ruta optima Google Directions API |
| `update_order_status` | `work-orders.service.updateStatus()` | Actualizar estado de orden |
| `capture_field_data` | `work-orders.service.captureFieldData()` | Registrar datos de campo |
| `upload_photos` | `storage.service.uploadPhotos()` | Subir fotos de campo |

**System Prompt:**
```
Eres el agente de gestion de cuadrillas de SUPRA Water.
Asignas ordenes de trabajo y optimizas rutas de tecnicos.

ASIGNACION DE ORDENES:
1. Evaluar tipo de orden y habilidades requeridas
2. Buscar tecnicos disponibles con habilidades compatibles
3. Considerar ubicacion actual del tecnico (cercania a la toma)
4. Considerar carga de trabajo actual (max 8 ordenes/dia)
5. Asignar al tecnico optimo
6. Notificar al tecnico via app movil

OPTIMIZACION DE RUTAS (6 AM):
1. Para cada tecnico, obtener ordenes asignadas del dia
2. Ordenar por prioridad: urgente > alta > normal > baja
3. Dentro de misma prioridad, optimizar por distancia
4. Generar ruta con Google Maps Directions API
5. Enviar ruta al tecnico

PRIORIDADES:
- urgente: fuga activa, corte programado hoy -> asignar inmediatamente
- alta: verificacion fraude, inspeccion urgente -> asignar en 4 horas
- normal: lectura especial, cambio medidor -> asignar para manana
- baja: mantenimiento preventivo -> asignar esta semana

SI NO HAY TECNICOS DISPONIBLES:
- Ordenes urgentes: notificar supervisor para overtime
- Otras: reprogramar al siguiente dia habil
```

**Model:** `claude-haiku-4-5-20251001` — Algorithmic assignment logic, structured I/O.

**Testing Strategy:**
- Simulate 100 work orders across 10 technicians, validate assignment fairness.
- Compare optimized routes vs sequential assignment (measure km saved).
- Test priority override: Urgent order mid-day reassignment.

---

### 2.7 Fraud Detection Agent

**Name:** Fraud Detection
**Slug:** `fraud_detection`
**Purpose:** ML-powered fraud identification through pattern analysis and geospatial clustering.
**Value Metric:** Fraud cases confirmed / cases opened (precision), revenue recovered from confirmed fraud.

**Triggers:**
```yaml
- type: event
  eventType: anomaly.high_confidence     # From anomaly_detection agent
- type: schedule
  cron: "0 3 * * 0"                      # Weekly deep scan Sunday 3 AM
```

**Tools:**
| Tool | Domain Service Function | Description |
|------|------------------------|-------------|
| `get_consumption_patterns` | `meters.service.getDetailedHistory()` | Patron de consumo detallado 24 meses |
| `get_meter_integrity` | `meters.service.getMeterIntegrity()` | Datos de integridad del medidor |
| `get_geospatial_cluster` | `fraud.service.getAreaAnomalies()` | Anomalias en zona geografica (PostGIS) |
| `get_billing_gaps` | `billing.service.findBillingGaps()` | Periodos sin facturacion |
| `get_new_connections` | `contracts.service.getRecentWithoutMeter()` | Tomas nuevas sin medidor |
| `create_fraud_case` | `fraud.service.createCase()` | Abrir expediente SIF |
| `schedule_inspection` | `work-orders.service.createInspection()` | Programar inspeccion de campo |
| `calculate_estimated_loss` | `fraud.service.estimateLoss()` | Calcular volumen y valor estimado de fraude |

**Analysis Methods:**
```yaml
methods:
  - consumption_pattern_analysis:
      description: "Detectar caidas subitas, reducciones imposibles"
      signals:
        - Consumo cae >50% sin explicacion estacional
        - Consumo consistentemente bajo vs vecinos similares
        - Patron de consumo no correlaciona con tipo de toma

  - meter_data_integrity:
      description: "Lecturas manipuladas, medidores invertidos"
      signals:
        - Lectura actual menor que anterior (medidor revertido)
        - Saltos irregulares en secuencia de lecturas
        - Medidor con edad > 10 anos sin calibracion

  - geospatial_clustering:
      description: "Clusters de anomalias en misma zona"
      signals:
        - 3+ anomalias en radio de 200m
        - Zona con historial de tomas clandestinas
        - Nuevas construcciones sin contrato registrado

  - billing_gap_analysis:
      description: "Periodos sin facturacion"
      signals:
        - Toma activa con >3 meses sin factura
        - Contrato suspendido pero consumo detectado

  - new_connection_audit:
      description: "Tomas recientes sin medidor"
      signals:
        - Contrato creado hace >30 dias sin instalacion de medidor
        - Alta frecuencia de altas en zona especifica
```

**System Prompt:**
```
Eres el detector de fraude de SUPRA Water.
Analizas patrones de consumo, datos de medidores y clusters geograficos
para identificar conexiones ilegales y manipulacion de medidores.

PROCESO DE ANALISIS:
1. Recibir alerta de anomalia (alta confianza) o ejecutar scan semanal
2. Cargar datos completos: consumo 24 meses, vecinos, medidor, zona
3. Aplicar metodos de analisis (patron, integridad, geo, gaps, conexiones)
4. Correlacionar senales de multiples metodos
5. Asignar probabilidad de fraude (0.0 a 1.0)
6. Si probabilidad >= 0.6: crear caso de fraude
7. Si probabilidad >= 0.8: programar inspeccion de campo inmediata
8. Calcular volumen estimado de agua perdida y valor economico

TIPOS DE FRAUDE:
- toma_clandestina: conexion no autorizada a la red
- medidor_alterado: medidor manipulado para subregistrar
- bypass: derivacion que evita el medidor
- reconexion_ilegal: servicio reconectado sin autorizacion tras corte

FORMATO DE SALIDA:
{
  "fraud_probability": 0.85,
  "fraud_type": "medidor_alterado",
  "evidence": ["consumo 70% menor que vecinos", "medidor con 12 anos sin calibracion"],
  "estimated_loss_m3": 450,
  "estimated_loss_mxn": 3200,
  "recommended_action": "inspeccion_campo_urgente",
  "case_created": true,
  "case_id": "FRD-2026-0042"
}
```

**Model:** `claude-sonnet-4-20250514` — Complex multi-signal pattern analysis, high-stakes decisions.

**Testing Strategy:**
- Historical validation: Run against known fraud cases from legacy SIF data.
- Precision target: >70% of opened cases should be confirmed as fraud.
- Geospatial clustering: Test with synthetic clusters of various densities.
- Weekly review: Domain expert reviews all new cases.

---

### 2.8 Regulatory Compliance Agent

**Name:** Regulatory Compliance
**Slug:** `regulatory_compliance`
**Purpose:** Auto-generate regulatory reports for CONAGUA, SEMARNAT, and state entities.
**Value Metric:** Reports generated on time (target: 100%), manual intervention rate (target: <5%).

**Triggers:**
```yaml
- type: schedule
  cron: "0 7 1 * *"       # Monthly on the 1st at 7 AM
```

**Tools:**
| Tool | Domain Service Function | Description |
|------|------------------------|-------------|
| `get_extraction_volumes` | `meters.service.getMonthlyVolumes()` | Volumenes de extraccion mensual |
| `get_efficiency_metrics` | `analytics.service.getEfficiencyMetrics()` | Metricas de eficiencia operativa |
| `get_discharge_data` | `meters.service.getDischargeData()` | Datos de descarga de aguas residuales |
| `get_service_indicators` | `analytics.service.getServiceKPIs()` | Indicadores de servicio estatal |
| `get_financial_summary` | `analytics.service.getFinancialSummary()` | Resumen financiero |
| `generate_report_pdf` | `analytics.report-generator.generatePdf()` | Generar PDF del reporte |
| `submit_to_conagua` | `integrations.conagua.submit()` | Enviar a plataforma CONAGUA |
| `notify_compliance_team` | `integrations.email.notifyTeam()` | Notificar equipo de cumplimiento |

**Reports Generated:**
```yaml
reports:
  - name: conagua_monthly_extraction
    frequency: monthly
    deadline: 10th of following month
    contents:
      - Volumenes de extraccion por fuente
      - Volumenes facturados vs producidos
      - Perdidas tecnicas y comerciales (agua no contabilizada)

  - name: conagua_quarterly_efficiency
    frequency: quarterly
    deadline: 15th of month after quarter end
    contents:
      - Eficiencia fisica (agua producida vs facturada)
      - Eficiencia comercial (facturado vs cobrado)
      - Eficiencia global
      - Indicadores NRW (Non-Revenue Water)

  - name: semarnat_discharge
    frequency: quarterly
    deadline: End of month after quarter
    contents:
      - Volumenes de descarga de aguas residuales
      - Calidad del efluente (si disponible de SCADA)
      - Cumplimiento de NOM-001-SEMARNAT

  - name: state_service_indicators
    frequency: monthly
    deadline: 15th of following month
    contents:
      - Cobertura de servicio (tomas activas / tomas totales)
      - Continuidad del servicio (horas promedio)
      - Atencion a reportes (tiempo promedio de resolucion)
      - Satisfaccion del usuario (promedio de encuestas)

  - name: financial_summary
    frequency: monthly
    deadline: 5th of following month
    contents:
      - Ingresos por concepto
      - Cartera vencida por antiguedad
      - Tasa de cobranza
      - Comparativo vs mismo mes ano anterior
```

**System Prompt:**
```
Eres el agente de cumplimiento regulatorio de SUPRA Water.
Generas automaticamente los reportes requeridos por CONAGUA, SEMARNAT,
y entidades estatales.

PROCESO MENSUAL (dia 1 de cada mes):
1. Determinar que reportes vencen este mes
2. Para cada reporte:
   a. Extraer datos del periodo correspondiente
   b. Calcular metricas e indicadores
   c. Validar completitud de datos (>95% requerido)
   d. Generar reporte en formato requerido (PDF + datos)
   e. Si datos incompletos: notificar equipo para completar manualmente
   f. Si datos completos: marcar como listo para revision
3. Notificar al equipo de cumplimiento con resumen de reportes generados

VALIDACIONES:
- Volumenes de extraccion deben ser positivos y consistentes con meses previos
- Variaciones >20% vs mes anterior requieren nota explicativa
- Eficiencia fisica no puede ser >100% (indica error en datos)
- Si faltan datos de >5% de las tomas: marcar reporte como incompleto

FORMATO: Generar reportes segun plantillas oficiales de cada entidad.
```

**Model:** `claude-haiku-4-5-20251001` — Template-driven, data aggregation, structured output.

**Testing Strategy:**
- Generate test reports against 12 months of sample data.
- Validate format compliance with official CONAGUA templates.
- Test incomplete data scenarios (missing readings for 10% of meters).
- Verify deadline calculation logic across months and quarters.

---

## 3. n8n Workflow Integration

### 3.1 Architecture Pattern

Agents connect to n8n workflows through two mechanisms:

1. **n8n triggers agents** via webhook — n8n receives an external event (SPEI payment notification, WhatsApp message, cron schedule) and calls the agent's webhook endpoint.
2. **Agents trigger n8n** via HTTP request — After processing, an agent calls an n8n webhook to execute a multi-step workflow (e.g., billing pipeline: generate invoice -> stamp CFDI -> generate PDF -> deliver).

```
External Event
     |
     v
  n8n Workflow (trigger node)
     |
     v
  HTTP Request to Agent API (/api/v1/agents/{slug}/invoke)
     |
     v
  Agent processes (Claude API + tools)
     |
     v
  Agent returns result to n8n
     |
     v
  n8n continues workflow (next steps: email, WhatsApp, DB update)
```

### 3.2 Workflow Definitions

#### smart-meter-ingestion.json
```
Trigger:  Webhook POST /n8n/webhooks/smart-meter
Purpose:  Receive IoT data from LoRaWAN/ChirpStack, normalize, store, trigger anomaly detection

Nodes:
  1. Webhook Trigger         <- ChirpStack uplink webhook
  2. Function: Normalize     <- Extract device_eui, reading_value, battery, signal from payload
  3. HTTP Request: POST /api/v1/meters/smart/ingest  <- Store in TimescaleDB
  4. IF: anomaly_detected?
     YES -> HTTP Request: POST /api/v1/agents/anomaly_detection/invoke
     NO  -> IF: billing_trigger_met?
              YES -> HTTP Request: POST /api/v1/agents/billing_engine/invoke
              NO  -> End
  5. End
```

#### billing-pipeline.json
```
Trigger:  Webhook POST /n8n/webhooks/billing-pipeline
          OR Event: reading.billing_ready (via pg LISTEN/NOTIFY -> BullMQ -> n8n webhook)
Purpose:  Full billing pipeline from reading to delivery

Nodes:
  1. Webhook Trigger
  2. HTTP Request: POST /api/v1/invoices/generate   <- Calculate tariff, create invoice
  3. IF: invoice.status == 'provisional' AND auto_approve?
     YES -> Continue
     NO  -> Send Email to billing supervisor + End
  4. HTTP Request: POST /api/v1/invoices/{id}/stamp  <- CFDI stamping via Finkok
  5. IF: stamping_success?
     YES -> Continue
     NO  -> Wait 5 min -> Retry (max 3) -> Alert billing team
  6. HTTP Request: GET /api/v1/invoices/{id}/pdf     <- Generate PDF
  7. Switch: delivery_channel
     'whatsapp' -> HTTP Request: Send WhatsApp template 'recibo_listo'
     'email'    -> HTTP Request: Send email with PDF attachment
     'print'    -> HTTP Request: Add to print queue
     'none'     -> Skip
  8. HTTP Request: PATCH /api/v1/invoices/{id}       <- Update status to 'pendiente'
  9. End
```

#### payment-reconciliation.json
```
Trigger:  Schedule: Every 30 minutes (SPEI), Daily 6 AM (OXXO batch)
          Webhook: POST /n8n/webhooks/payment-spei (real-time SPEI notification)
          Webhook: POST /n8n/webhooks/payment-oxxo (Conekta webhook)
Purpose:  Reconcile incoming payments with invoices

Nodes:
  1. Trigger (schedule or webhook)
  2. IF: source == 'spei_webhook'?
     YES -> Parse SPEI notification -> Extract reference
     NO  -> IF: source == 'oxxo_webhook'?
              YES -> Parse Conekta webhook -> Extract reference
              NO  -> HTTP Request: GET /api/v1/payments/pending-reconciliation
  3. HTTP Request: POST /api/v1/payments/reconcile
     Body: { reference, amount, source, transaction_id }
  4. IF: reconciliation_success?
     YES -> Send WhatsApp template 'pago_confirmado'
     NO  -> Log to manual reconciliation queue
  5. IF: account_has_delinquency AND full_payment?
     YES -> HTTP Request: POST /api/v1/delinquency/{id}/resolve
  6. End
```

#### delinquency-orchestration.json
```
Trigger:  Event: invoice.past_due
          Schedule: "0 8 * * 1-5" (weekdays 8 AM)
Purpose:  Execute collection sequences managed by Collections Intelligence agent

Nodes:
  1. Trigger
  2. HTTP Request: POST /api/v1/agents/collections_intelligence/invoke
     Body: { action: 'daily_review' } or { invoice_id, days_past_due }
  3. ForEach: agent_response.actions[]
     -> Switch: action.type
        'sms_reminder'              -> Twilio SMS Node
        'whatsapp_reminder'         -> WhatsApp template node
        'phone_call_ai'            -> HTTP Request: POST /api/v1/agents/voice_ai/outbound
        'formal_letter'            -> HTTP Request: POST /api/v1/notifications/formal-letter
        'schedule_corte'           -> HTTP Request: POST /api/v1/work-orders (type: corte)
        'social_tariff_offer'      -> WhatsApp template: tarifa_social
        'phone_call_human'         -> Add to human call queue in AGORA
  4. HTTP Request: PATCH /api/v1/delinquency/{id}  <- Update steps_history
  5. End
```

#### whatsapp-handler.json
```
Trigger:  Webhook POST /n8n/webhooks/whatsapp-incoming
Purpose:  Route incoming WhatsApp messages to AI agent or human

Nodes:
  1. Webhook Trigger          <- 360dialog / Meta API webhook
  2. Function: Parse message  <- Extract from, text, media, messageId
  3. HTTP Request: POST /api/v1/agents/whatsapp_cx/invoke
     Body: { from, message, messageType, conversationId }
  4. IF: agent_response.escalated?
     YES -> HTTP Request: POST /chatwoot/api/v1/conversations/{id}/assignments
            (assign to human agent in AGORA)
     NO  -> ForEach: agent_response.messages[]
              -> HTTP Request: POST /whatsapp/v1/messages (send reply)
  5. End
```

#### daily-reports.json
```
Trigger:  Schedule: "0 7 * * *" (daily 7 AM)
Purpose:  Generate and send daily operations dashboard

Nodes:
  1. Cron Trigger (7 AM)
  2. HTTP Request: GET /api/v1/analytics/daily-summary
  3. Function: Format summary into dashboard email HTML
  4. Send Email: To operations team
     Subject: "SUPRA Water — Resumen Operativo {date}"
     Body: HTML dashboard with KPIs
  5. HTTP Request: POST /api/v1/analytics/dashboard-snapshot  <- Save for historical
  6. End
```

---

## 4. Claude API Usage Patterns

### 4.1 Token Budget Management

```typescript
// src/agents/token-budget.ts

interface TokenBudget {
  dailyLimit: number;         // Max tokens per day per agent
  monthlyLimit: number;       // Max tokens per month per agent
  warningThreshold: number;   // Alert at this % of budget
}

const TOKEN_BUDGETS: Record<string, TokenBudget> = {
  voice_ai:                { dailyLimit: 2_000_000,  monthlyLimit: 50_000_000,  warningThreshold: 0.8 },
  whatsapp_cx:             { dailyLimit: 3_000_000,  monthlyLimit: 75_000_000,  warningThreshold: 0.8 },
  billing_engine:          { dailyLimit: 1_000_000,  monthlyLimit: 25_000_000,  warningThreshold: 0.9 },
  anomaly_detection:       { dailyLimit: 500_000,    monthlyLimit: 12_000_000,  warningThreshold: 0.9 },
  collections_intelligence:{ dailyLimit: 1_000_000,  monthlyLimit: 25_000_000,  warningThreshold: 0.8 },
  field_workforce:         { dailyLimit: 300_000,    monthlyLimit: 7_000_000,   warningThreshold: 0.9 },
  fraud_detection:         { dailyLimit: 500_000,    monthlyLimit: 12_000_000,  warningThreshold: 0.9 },
  regulatory_compliance:   { dailyLimit: 200_000,    monthlyLimit: 3_000_000,   warningThreshold: 0.9 },
};

// Track usage in Redis
async function trackTokenUsage(agentSlug: string, tokens: { input: number; output: number }) {
  const today = new Date().toISOString().split('T')[0];
  const month = today.substring(0, 7);

  await redis.incrby(`tokens:${agentSlug}:daily:${today}`, tokens.input + tokens.output);
  await redis.incrby(`tokens:${agentSlug}:monthly:${month}`, tokens.input + tokens.output);

  // Check budget
  const dailyUsed = parseInt(await redis.get(`tokens:${agentSlug}:daily:${today}`) ?? '0');
  const budget = TOKEN_BUDGETS[agentSlug];
  if (dailyUsed > budget.dailyLimit * budget.warningThreshold) {
    logger.warn(`Token budget warning: ${agentSlug} at ${(dailyUsed/budget.dailyLimit*100).toFixed(1)}% daily limit`);
  }
  if (dailyUsed > budget.dailyLimit) {
    logger.error(`Token budget EXCEEDED: ${agentSlug} — switching to fallback mode`);
    // Degrade: use rule-based fallback instead of Claude
  }
}
```

### 4.2 Prompt Caching Strategy

All agents use Claude's prompt caching via the `cache_control` block on system prompts. Since system prompts are static per agent, they get cached after the first call and subsequent calls within the 5-minute TTL read from cache, reducing input token costs by up to 90%.

```typescript
// Applied in base-agent.ts (already shown above)
system: [
  {
    type: 'text',
    text: this.systemPrompt,
    cache_control: { type: 'ephemeral' },
  },
],
```

**Cache hit rates by agent (estimated):**
| Agent | Invocations/hour | Cache hit rate | Savings |
|-------|-----------------|----------------|---------|
| Anomaly Detection | 100-500 (per reading) | ~95% | High — many calls within 5-min window |
| Billing Engine | 50-200 (batch billing) | ~90% | High — batch processing |
| WhatsApp CX | 10-50 | ~70% | Medium — spread throughout day |
| Voice AI | 5-20 | ~60% | Medium — call duration varies |
| Collections | 1 (daily batch) | ~80% | Medium — batch within one run |
| Field Workforce | 5-20 | ~50% | Low — spread out |
| Fraud Detection | 1 (weekly scan) | ~30% | Low — infrequent |
| Regulatory | 1 (monthly) | ~0% | Negligible — once a month |

### 4.3 Tool Use Patterns (Structured Output)

```typescript
// Example: Anomaly Detection agent tool call pattern

// Claude returns structured tool_use blocks:
{
  type: 'tool_use',
  id: 'toolu_01...',
  name: 'get_historical_readings',
  input: { meter_id: 'uuid-123', months: 12 }
}

// Tool handler returns structured JSON:
{
  readings: [
    { date: '2025-12-15', value: 1234, consumption: 18 },
    { date: '2025-11-15', value: 1216, consumption: 15 },
    // ...
  ],
  average_consumption: 16.5,
  std_deviation: 3.2
}

// For agents that need fully structured final output (not free-text),
// use a "respond" tool pattern:
const respondTool: AgentTool = {
  name: 'respond',
  description: 'Enviar resultado final del analisis',
  inputSchema: z.object({
    anomaly_detected: z.boolean(),
    anomaly_type: z.enum(['CONSUMO_ALTO', 'CONSUMO_CERO', 'CONSUMO_NEGATIVO', 'PATRON_IRREGULAR', 'CLUSTER_ZONA', 'NONE']),
    confidence: z.number().min(0).max(1),
    action_taken: z.string(),
    reasoning: z.string(),
  }),
  outputSchema: z.object({ acknowledged: z.boolean() }),
  handler: async (input) => {
    // Store result, emit event, etc.
    return { acknowledged: true };
  },
};
```

### 4.4 Error Handling and Retry Logic

```typescript
// src/agents/error-handling.ts

import { Anthropic } from '@anthropic-ai/sdk';

const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1_000,
  maxDelayMs: 30_000,
  retryableErrors: [
    'overloaded_error',    // Claude API overloaded
    'api_error',           // 500-level errors
    'rate_limit_error',    // 429
  ],
  nonRetryableErrors: [
    'authentication_error',
    'invalid_request_error',
  ],
};

async function callClaudeWithRetry(
  client: Anthropic,
  params: Anthropic.MessageCreateParams,
  attempt = 1
): Promise<Anthropic.Message> {
  try {
    return await client.messages.create(params);
  } catch (err: any) {
    const errorType = err?.error?.type ?? err?.status;

    if (RETRY_CONFIG.nonRetryableErrors.includes(errorType)) {
      throw err; // Do not retry
    }

    if (attempt > RETRY_CONFIG.maxRetries) {
      throw new Error(`Claude API failed after ${RETRY_CONFIG.maxRetries} retries: ${err.message}`);
    }

    // Exponential backoff with jitter
    const delay = Math.min(
      RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 1_000,
      RETRY_CONFIG.maxDelayMs
    );

    logger.warn(`Claude API retry ${attempt}/${RETRY_CONFIG.maxRetries} in ${delay}ms`, {
      error: errorType,
      model: params.model,
    });

    await new Promise(r => setTimeout(r, delay));
    return callClaudeWithRetry(client, params, attempt + 1);
  }
}
```

### 4.5 Cost Estimation per Agent per Month

Assumptions: CEA Queretaro has ~400,000 accounts, ~50,000 active WhatsApp users, ~500 calls/day.

| Agent | Model | Est. Invocations/Month | Avg Tokens/Invocation | Monthly Tokens | Est. Cost (USD) |
|-------|-------|----------------------|----------------------|----------------|----------------|
| Voice AI | Sonnet | 15,000 calls | 3,000 in + 1,000 out | 60M total | ~$270 |
| WhatsApp CX | Sonnet | 30,000 conversations | 2,000 in + 800 out | 84M total | ~$380 |
| Billing Engine | Haiku | 400,000 invoices | 800 in + 400 out | 480M total | ~$120 |
| Anomaly Detection | Haiku | 400,000 readings | 500 in + 200 out | 280M total | ~$70 |
| Collections | Sonnet | 20,000 accounts/mo | 1,500 in + 600 out | 42M total | ~$190 |
| Field Workforce | Haiku | 5,000 orders | 600 in + 300 out | 4.5M total | ~$2 |
| Fraud Detection | Sonnet | 2,000 analyses | 2,500 in + 1,000 out | 7M total | ~$32 |
| Regulatory | Haiku | 10 reports | 3,000 in + 2,000 out | 50K total | ~$0.02 |
| **TOTAL** | | | | | **~$1,064/mo** |

With prompt caching (estimated 70% average cache hit): **~$650/month**.

**Note:** Prices based on published Claude API pricing as of Feb 2026. Sonnet: $3/M input, $15/M output. Haiku: $0.25/M input, $1.25/M output. Cache read tokens at 10% of input price.

---

## 5. ML/Analytics Components

### 5.1 Anomaly Detection Rules (Statistical + ML)

```typescript
// src/modules/meters/anomaly-detector.ts

interface AnomalyResult {
  detected: boolean;
  type: 'CONSUMO_ALTO' | 'CONSUMO_CERO' | 'CONSUMO_NEGATIVO' | 'PATRON_IRREGULAR' | 'CLUSTER_ZONA' | 'NONE';
  confidence: number;
  reasoning: string;
}

// Statistical rules (fast, no ML required)
function applyStatisticalRules(
  currentReading: number,
  history: number[],
  sectorAvg: number
): AnomalyResult[] {
  const results: AnomalyResult[] = [];
  const avg = history.reduce((a, b) => a + b, 0) / history.length;
  const stdDev = Math.sqrt(history.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / history.length);

  // Rule 1: High consumption (> 3x average)
  if (currentReading > avg * 3) {
    results.push({
      detected: true,
      type: 'CONSUMO_ALTO',
      confidence: Math.min(0.5 + (currentReading / avg - 3) * 0.1, 0.95),
      reasoning: `Consumo ${currentReading}m3 es ${(currentReading/avg).toFixed(1)}x el promedio de ${avg.toFixed(1)}m3`,
    });
  }

  // Rule 2: Zero consumption (consecutive)
  if (currentReading === 0 && history[0] > 0) {
    results.push({
      detected: true,
      type: 'CONSUMO_CERO',
      confidence: 0.6,
      reasoning: 'Consumo cero con consumo previo positivo',
    });
  }

  // Rule 3: Negative consumption
  if (currentReading < 0) {
    results.push({
      detected: true,
      type: 'CONSUMO_NEGATIVO',
      confidence: 0.95,
      reasoning: 'Lectura actual menor que lectura anterior',
    });
  }

  // Rule 4: Seasonal anomaly (> 2 sigma from same-month historical)
  if (Math.abs(currentReading - avg) > 2 * stdDev) {
    results.push({
      detected: true,
      type: 'PATRON_IRREGULAR',
      confidence: 0.7,
      reasoning: `Consumo devia ${((currentReading - avg) / stdDev).toFixed(1)} desviaciones estandar`,
    });
  }

  // Rule 5: Neighbor comparison (> 5x sector average)
  if (currentReading > sectorAvg * 5) {
    results.push({
      detected: true,
      type: 'CONSUMO_ALTO',
      confidence: 0.8,
      reasoning: `Consumo ${(currentReading/sectorAvg).toFixed(1)}x el promedio del sector`,
    });
  }

  return results;
}
```

### 5.2 Collections Scoring Model

```typescript
// src/modules/delinquency/collection-scorer.ts

interface CollectionFeatures {
  payment_history_last_12_months: number;  // % on-time payments (0-1)
  days_past_due: number;
  total_debt_amount: number;               // MXN
  number_of_unpaid_invoices: number;
  account_age_years: number;
  toma_type: 'domestico' | 'comercial' | 'industrial' | 'gobierno';
  previous_payment_plans: number;
  vulnerability_flag: boolean;
  sector_delinquency_rate: number;         // 0-1
}

interface CollectionScoreResult {
  probability_of_payment_within_30_days: number;
  risk_tier: 'low' | 'medium' | 'high' | 'vulnerable';
  recommended_sequence: string;
}

// Weighted logistic scoring model
// Initial weights are heuristic; will be trained on historical data in Phase 3
function scoreAccount(features: CollectionFeatures): CollectionScoreResult {
  // Vulnerability override
  if (features.vulnerability_flag) {
    return {
      probability_of_payment_within_30_days: 0.3,
      risk_tier: 'vulnerable',
      recommended_sequence: 'vulnerable',
    };
  }

  // Feature weights (to be calibrated via logistic regression on historical data)
  const weights = {
    payment_history: 0.30,         // Most predictive
    days_past_due: -0.20,          // More days = lower probability
    debt_amount: -0.10,            // Higher debt = lower probability
    unpaid_count: -0.10,
    account_age: 0.10,             // Older accounts more likely to pay
    toma_type: 0.05,               // Commercial/government slightly more reliable
    prev_plans: -0.05,             // Repeat offenders less likely
    sector_rate: -0.10,            // High delinquency sector = contagion risk
  };

  // Normalize features to 0-1 scale
  const normalized = {
    payment_history: features.payment_history_last_12_months,
    days_past_due: Math.min(features.days_past_due / 180, 1),
    debt_amount: Math.min(features.total_debt_amount / 10000, 1),
    unpaid_count: Math.min(features.number_of_unpaid_invoices / 6, 1),
    account_age: Math.min(features.account_age_years / 10, 1),
    toma_type: features.toma_type === 'gobierno' ? 0.9 : features.toma_type === 'comercial' ? 0.7 : 0.5,
    prev_plans: Math.min(features.previous_payment_plans / 3, 1),
    sector_rate: features.sector_delinquency_rate,
  };

  // Linear combination -> sigmoid
  const z =
    weights.payment_history * normalized.payment_history +
    weights.days_past_due * normalized.days_past_due +
    weights.debt_amount * normalized.debt_amount +
    weights.unpaid_count * normalized.unpaid_count +
    weights.account_age * normalized.account_age +
    weights.toma_type * normalized.toma_type +
    weights.prev_plans * normalized.prev_plans +
    weights.sector_rate * normalized.sector_rate +
    0.3; // bias

  const probability = 1 / (1 + Math.exp(-z * 5)); // Sigmoid with scaling

  // Tier classification
  let risk_tier: 'low' | 'medium' | 'high';
  let recommended_sequence: string;

  if (probability > 0.7) {
    risk_tier = 'low';
    recommended_sequence = 'low_risk';
  } else if (probability > 0.3) {
    risk_tier = 'medium';
    recommended_sequence = 'medium_risk';
  } else {
    risk_tier = 'high';
    recommended_sequence = 'high_risk';
  }

  return { probability_of_payment_within_30_days: probability, risk_tier, recommended_sequence };
}
```

### 5.3 Fraud Detection Analysis

```sql
-- Geospatial clustering query (PostGIS)
-- Find clusters of anomalous readings within 200m radius
SELECT
  ST_ClusterDBSCAN(t.location, eps := 200, minpoints := 3) OVER() AS cluster_id,
  t.id AS toma_id,
  t.contract_id,
  mr.consumption,
  fc.case_number
FROM tomas t
JOIN meter_readings mr ON mr.toma_id = t.id
LEFT JOIN fraud_cases fc ON fc.toma_id = t.id
WHERE t.tenant_id = $1
  AND mr.created_at > NOW() - INTERVAL '6 months'
  AND (mr.anomaly_type IS NOT NULL OR fc.id IS NOT NULL)
ORDER BY cluster_id;
```

### 5.4 Consumption Forecast Model

```typescript
// src/modules/meters/consumption-forecast.ts

// Simple seasonal decomposition + trend for consumption estimation
// Used when no reading is available for a billing period
async function forecastConsumption(
  tomaId: string,
  targetMonth: number,
  targetYear: number
): Promise<{ estimated_m3: number; confidence: number; method: string }> {

  // Method 1: Same month historical average (preferred)
  const sameMonthReadings = await db.execute(sql`
    SELECT consumption FROM meter_readings
    WHERE toma_id = ${tomaId}
      AND EXTRACT(MONTH FROM reading_date) = ${targetMonth}
      AND consumption > 0
    ORDER BY reading_date DESC LIMIT 3
  `);

  if (sameMonthReadings.rows.length >= 2) {
    const avg = sameMonthReadings.rows.reduce((s: number, r: any) => s + r.consumption, 0) / sameMonthReadings.rows.length;
    return { estimated_m3: Math.round(avg * 10) / 10, confidence: 0.8, method: 'seasonal_average' };
  }

  // Method 2: Last 6 readings average
  const recentReadings = await db.execute(sql`
    SELECT consumption FROM meter_readings
    WHERE toma_id = ${tomaId} AND consumption > 0
    ORDER BY reading_date DESC LIMIT 6
  `);

  if (recentReadings.rows.length >= 3) {
    const avg = recentReadings.rows.reduce((s: number, r: any) => s + r.consumption, 0) / recentReadings.rows.length;
    return { estimated_m3: Math.round(avg * 10) / 10, confidence: 0.6, method: 'recent_average' };
  }

  // Method 3: Sector average for same toma type
  const sectorAvg = await db.execute(sql`
    SELECT AVG(mr.consumption) as avg_consumption
    FROM meter_readings mr
    JOIN tomas t ON t.id = mr.toma_id
    WHERE t.sector_id = (SELECT sector_id FROM tomas WHERE id = ${tomaId})
      AND t.toma_type = (SELECT toma_type FROM tomas WHERE id = ${tomaId})
      AND mr.consumption > 0
      AND mr.reading_date > NOW() - INTERVAL '6 months'
  `);

  if (sectorAvg.rows[0]?.avg_consumption) {
    return { estimated_m3: Math.round(sectorAvg.rows[0].avg_consumption * 10) / 10, confidence: 0.4, method: 'sector_average' };
  }

  // Method 4: Minimum for tariff category (last resort)
  return { estimated_m3: 10, confidence: 0.2, method: 'minimum_fallback' };
}
```

### 5.5 pgvector Embedding Generation

```typescript
// src/agents/memory.ts (embedding-related functions)

// Table for agent semantic memory
// CREATE TABLE agent_memories (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   tenant_id UUID NOT NULL,
//   agent_slug VARCHAR(50) NOT NULL,
//   session_id VARCHAR(100),
//   content TEXT NOT NULL,
//   metadata JSONB DEFAULT '{}',
//   embedding VECTOR(1536) NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT now()
// );
// CREATE INDEX idx_memories_embedding ON agent_memories USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

// Use cases for embeddings:
// 1. WhatsApp CX: Search past conversations for similar issues and resolutions
// 2. Voice AI: Find similar past calls to improve response quality
// 3. Fraud Detection: Semantic similarity between fraud case descriptions
// 4. Contacts: Auto-classify incoming contacts by comparing to resolved ones

async function storeAndEmbedInteraction(
  agentSlug: string,
  tenantId: string,
  sessionId: string,
  content: string,
  metadata: Record<string, any>
): Promise<void> {
  const embedding = await generateEmbedding(content);
  await db.execute(sql`
    INSERT INTO agent_memories (tenant_id, agent_slug, session_id, content, metadata, embedding)
    VALUES (${tenantId}, ${agentSlug}, ${sessionId}, ${content}, ${JSON.stringify(metadata)}::jsonb, ${JSON.stringify(embedding)}::vector)
  `);
}
```

---

## 6. Sprint-by-Sprint Development Plan

### Implementation Order Rationale

Agents are ordered by: (1) foundational dependencies, (2) business value, (3) complexity.

```
Phase 1 (Q1-Q2 2026): Foundation agents — immediate citizen-facing value
  Sprint 1-2:  Agent base infrastructure (registry, triggers, memory, event bus)
  Sprint 3-4:  Billing Engine agent (highest volume, immediate ROI)
  Sprint 5-6:  WhatsApp CX agent (citizen-facing, 60% resolution target)
  Sprint 7-8:  Voice AI agent (call center replacement)

Phase 2 (Q3-Q4 2026): Core business intelligence
  Sprint 9-10:  Anomaly Detection agent (depends on meter data pipeline)
  Sprint 11-12: Field Workforce agent (depends on work order system)
  Sprint 13-14: Collections Intelligence agent (depends on billing + payments)

Phase 3 (Q1-Q2 2027): Advanced intelligence
  Sprint 15-16: Fraud Detection agent (depends on anomaly detection + historical data)
  Sprint 17-18: Regulatory Compliance agent (depends on all data being in SUPRA)

Phase 4 (Q3-Q4 2027): Optimization
  Sprint 19-20: ML model training on production data, scoring model calibration
  Sprint 21-22: Consumption forecast, tariff optimization agents
```

### Sprint Detail

#### Sprint 1-2: Agent Infrastructure (Weeks 1-4)

| Task | Deliverable | Test |
|------|------------|------|
| Implement `SUPRAAgent` interface and `BaseAgent` class | `src/agents/types.ts`, `src/agents/base-agent.ts` | Unit tests for agentic loop |
| Build Agent Registry | `src/agents/registry.ts` | Register/discover/healthcheck tests |
| Build Trigger System (event, schedule, webhook) | `src/agents/trigger-system.ts` | Event -> agent invocation test |
| Build Memory Store (Redis + pgvector) | `src/agents/memory.ts` | Store/retrieve/semantic search tests |
| Create `agent_memories` table + pgvector index | `db/migrations/xxx-agent-memories.sql` | SQL migration test |
| Token budget tracker | `src/agents/token-budget.ts` | Budget limit enforcement test |
| Error handling + retry logic | `src/agents/error-handling.ts` | Retry with backoff test |
| Agent health dashboard endpoint | `GET /api/v1/agents/health` | Health check all agents |

**Milestone:** `BaseAgent` can invoke Claude, call tools, track tokens, retry on failure.

#### Sprint 3-4: Billing Engine Agent (Weeks 5-8)

| Task | Deliverable | Test |
|------|------------|------|
| Implement `BillingEngineAgent` extending `BaseAgent` | `src/agents/billing-engine/agent.ts` | Invoke with mock reading |
| Implement 8 billing tools | `src/agents/billing-engine/tools.ts` | Each tool with mock data |
| Wire `reading.billing_ready` event trigger | Event bus -> BillingEngine | Integration test |
| CFDI stamping via Finkok sandbox | `src/integrations/finkok/` | Stamp + cancel test |
| PDF generation pipeline | Handlebars template + Puppeteer | Generate 10 test PDFs |
| n8n billing-pipeline workflow | `n8n/workflows/billing-pipeline.json` | End-to-end workflow test |
| Batch catch-up (2 AM cron) | Schedule trigger test | Process 1000 missed readings |

**Milestone:** A meter reading event generates a complete CFDI-stamped invoice delivered via WhatsApp.

#### Sprint 5-6: WhatsApp CX Agent (Weeks 9-12)

| Task | Deliverable | Test |
|------|------------|------|
| Implement `WhatsAppCXAgent` | `src/agents/whatsapp-cx/agent.ts` | 30 conversation scenarios |
| WhatsApp Business API integration | `src/integrations/whatsapp/` | Send/receive messages |
| Chatwoot/AGORA webhook handler | `src/integrations/chatwoot/` | Message routing test |
| 10 WhatsApp tools | `src/agents/whatsapp-cx/tools.ts` | Each tool individually |
| Submit 5 WhatsApp templates to Meta | Pre-approved templates | Template approval tracking |
| Escalation to human agent flow | AGORA assignment | Escalation test |
| n8n whatsapp-handler workflow | `n8n/workflows/whatsapp-handler.json` | End-to-end test |

**Milestone:** Citizen sends WhatsApp message -> AI resolves balance inquiry or escalates to human.

#### Sprint 7-8: Voice AI Agent (Weeks 13-16)

| Task | Deliverable | Test |
|------|------------|------|
| Implement `VoiceAIAgent` | `src/agents/voice-ai/agent.ts` | 20 call scenarios |
| Twilio Programmable Voice integration | `src/integrations/twilio/` | Inbound call handling |
| TwiML response generation | Speech -> text -> Claude -> TwiML | Voice round-trip test |
| 10 Voice tools | `src/agents/voice-ai/tools.ts` | Each tool individually |
| Transfer to human flow | Twilio conference/transfer | Transfer test |
| Outbound call capability | For collections agent | Schedule + dial test |

**Milestone:** Citizen calls CEA number -> AI answers in Mexican Spanish -> resolves query or transfers.

#### Sprint 9-10: Anomaly Detection Agent (Weeks 17-20)

| Task | Deliverable | Test |
|------|------------|------|
| Statistical detection rules | `src/modules/meters/anomaly-detector.ts` | 10K synthetic readings |
| Implement `AnomalyDetectionAgent` | `src/agents/anomaly-detection/agent.ts` | Rule + ML hybrid test |
| Wire `reading.received` event | Event bus integration | Real-time detection test |
| Fraud case creation flow | Anomaly -> fraud case | Integration test |
| Work order creation for meter checks | Anomaly -> work order | Integration test |

**Milestone:** Every meter reading is analyzed in <500ms; high-confidence anomalies auto-create fraud cases.

#### Sprint 11-12: Field Workforce Agent (Weeks 21-24)

| Task | Deliverable | Test |
|------|------------|------|
| Implement `FieldWorkforceAgent` | `src/agents/field-workforce/agent.ts` | 100 order assignment |
| Google Maps Directions integration | `src/integrations/google-maps/` | Route optimization test |
| Auto-assignment algorithm | Skill + location + load | Fairness test |
| Morning route optimization (6 AM cron) | Schedule trigger | 10 technician routes |

**Milestone:** Work orders auto-assigned to nearest qualified technician with optimized daily route.

#### Sprint 13-14: Collections Intelligence Agent (Weeks 25-28)

| Task | Deliverable | Test |
|------|------------|------|
| Collection scoring model | `src/modules/delinquency/collection-scorer.ts` | Backtest on historical data |
| Implement `CollectionsAgent` | `src/agents/collections/agent.ts` | Daily review test |
| 4 collection sequences | `src/agents/collections/sequences.ts` | Sequence execution test |
| Vulnerability protection | No auto-corte for vulnerable | Compliance test |
| n8n delinquency-orchestration | `n8n/workflows/delinquency-orchestration.json` | End-to-end test |

**Milestone:** Past-due accounts scored, stratified, and auto-contacted via optimal channel/sequence.

#### Sprint 15-16: Fraud Detection Agent (Weeks 29-32)

| Task | Deliverable | Test |
|------|------------|------|
| 5 analysis methods | `src/agents/fraud-detection/ml-pipeline.ts` | Each method individually |
| Geospatial clustering (PostGIS) | SQL query + agent tool | Cluster detection test |
| Implement `FraudDetectionAgent` | `src/agents/fraud-detection/agent.ts` | Historical validation |
| Weekly deep scan (Sunday 3 AM) | Schedule trigger | Full scan test |

**Milestone:** AI identifies fraud patterns with >70% precision; weekly scan covers all 400K accounts.

#### Sprint 17-18: Regulatory Compliance Agent (Weeks 33-36)

| Task | Deliverable | Test |
|------|------------|------|
| 5 report templates | `src/agents/regulatory/report-templates.ts` | Template rendering test |
| Implement `RegulatoryAgent` | `src/agents/regulatory/agent.ts` | 12 months of test reports |
| CONAGUA format compliance | Official template matching | Format validation |
| Monthly cron trigger | Schedule trigger | Trigger + generation test |

**Milestone:** All required regulatory reports auto-generated monthly with <5% manual intervention.

---

## Appendix A: Database Table for Agent Memory

```sql
CREATE TABLE agent_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  agent_slug VARCHAR(50) NOT NULL,
  session_id VARCHAR(100),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(1536) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_memories_agent ON agent_memories(tenant_id, agent_slug, created_at DESC);
CREATE INDEX idx_memories_embedding ON agent_memories USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

## Appendix B: Agent Event Types

```typescript
// Events emitted BY agents (for monitoring and audit)
const AGENT_EVENTS = {
  'agent.voice_ai.invoked':          { call_sid, duration_ms, resolved, tokens_used },
  'agent.whatsapp_cx.invoked':       { conversation_id, resolved, escalated, tokens_used },
  'agent.billing_engine.invoked':    { invoice_id, contract_id, total, cfdi_stamped, tokens_used },
  'agent.anomaly_detection.invoked': { reading_id, anomaly_detected, anomaly_type, confidence },
  'agent.collections.invoked':       { accounts_reviewed, actions_executed, tokens_used },
  'agent.field_workforce.invoked':   { order_id, assigned_to, route_optimized },
  'agent.fraud_detection.invoked':   { cases_opened, analyses_run, tokens_used },
  'agent.regulatory.invoked':        { reports_generated, reports_incomplete, tokens_used },
};
```

## Appendix C: Environment Variables for AI Agents

```bash
# Claude API
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_SONNET_MODEL=claude-sonnet-4-20250514
CLAUDE_HAIKU_MODEL=claude-haiku-4-5-20251001

# OpenAI (embeddings only)
OPENAI_API_KEY=sk-...
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Twilio (Voice AI)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+52...
TWILIO_VOICE_WEBHOOK_URL=https://api.supra.water/api/v1/voice/incoming

# WhatsApp Business API
WHATSAPP_API_URL=https://waba.360dialog.io/v1
WHATSAPP_API_KEY=...
WHATSAPP_PHONE_NUMBER_ID=...

# n8n
N8N_WEBHOOK_BASE_URL=https://n8n.supra.water
N8N_API_KEY=...

# Token Budgets (override defaults)
TOKEN_BUDGET_DAILY_VOICE_AI=2000000
TOKEN_BUDGET_DAILY_WHATSAPP_CX=3000000
TOKEN_BUDGET_DAILY_BILLING_ENGINE=1000000
```
