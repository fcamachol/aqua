// =============================================================
// AI Agent Type Definitions — SUPRA Water 2026 §5.1
// =============================================================

import type { DomainEventType } from '../events/types.js';

// ─── Trigger Types ──────────────────────────────────────────

export type AgentTrigger =
  | { type: 'event'; eventType: DomainEventType | string }
  | { type: 'schedule'; cron: string }
  | { type: 'webhook'; path: string }
  | { type: 'whatsapp'; pattern?: RegExp }
  | { type: 'voice'; intent?: string }
  | { type: 'manual'; ui_button: string };

// ─── Tool Types ─────────────────────────────────────────────

export interface AgentToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  enum?: string[];
}

export interface AgentTool {
  name: string;
  description: string;
  parameters: AgentToolParameter[];
  execute: (params: Record<string, unknown>, context: AgentContext) => Promise<ToolResult>;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

// ─── Agent Config ───────────────────────────────────────────

export type AgentModel = 'claude-sonnet-4-20250514' | 'claude-haiku-4-5-20251001';

export interface AgentConfig {
  name: string;
  description: string;
  triggers: AgentTrigger[];
  tools: AgentTool[];
  systemPrompt: string;
  model: AgentModel;
  maxTokens: number;
  temperature: number;
}

// ─── Conversation Context ───────────────────────────────────

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: ToolCallRecord[];
  timestamp: string;
}

export interface ToolCallRecord {
  toolName: string;
  input: Record<string, unknown>;
  result: ToolResult;
}

export interface AgentContext {
  tenantId: string;
  correlationId: string;
  conversationId?: string;
  userId?: string;
  channel?: 'voice' | 'whatsapp' | 'web' | 'system';
  metadata?: Record<string, unknown>;
}

export interface ConversationContext extends AgentContext {
  messages: ConversationMessage[];
}

// ─── Agent Health ───────────────────────────────────────────

export interface AgentHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastActivity?: string;
  totalInvocations: number;
  errorCount: number;
  avgLatencyMs: number;
}
