// =============================================================
// WhatsApp Message Handler — SUPRA Water 2026
//
// Receives messages from WhatsApp webhook, routes to agent,
// manages conversation state, sends replies via WhatsApp API.
// =============================================================

import crypto from 'node:crypto';
import { redis } from '../../config/redis.js';
import type { AgentContext, ConversationMessage } from '../../types/agents.js';
import { agentRegistry } from '../registry.js';

const CONVERSATION_TTL = 60 * 60; // 1 hour conversation memory
const CONVERSATION_PREFIX = 'wa:conv:';

// ─── Incoming WhatsApp Message ──────────────────────────────

export interface WhatsAppIncomingMessage {
  from: string;        // Phone number (e.g. "524421234567")
  body: string;        // Message text
  messageId: string;   // WhatsApp message ID
  timestamp: string;
  tenantId: string;
  profileName?: string;
}

// ─── WhatsApp Reply ─────────────────────────────────────────

export interface WhatsAppReply {
  to: string;
  body: string;
  action?: 'escalate' | 'transfer';
  metadata?: Record<string, unknown>;
}

// ─── Conversation State ─────────────────────────────────────

interface ConversationState {
  conversationId: string;
  messages: ConversationMessage[];
  contractId?: string;
  accountNumber?: string;
  lastActivity: string;
}

async function getConversation(phone: string, tenantId: string): Promise<ConversationState> {
  const key = `${CONVERSATION_PREFIX}${tenantId}:${phone}`;
  const raw = await redis.get(key);
  if (raw) {
    return JSON.parse(raw);
  }
  return {
    conversationId: crypto.randomUUID(),
    messages: [],
    lastActivity: new Date().toISOString(),
  };
}

async function saveConversation(phone: string, tenantId: string, state: ConversationState): Promise<void> {
  const key = `${CONVERSATION_PREFIX}${tenantId}:${phone}`;
  state.lastActivity = new Date().toISOString();

  // Keep last 20 messages to avoid unbounded growth
  if (state.messages.length > 20) {
    state.messages = state.messages.slice(-20);
  }

  await redis.setex(key, CONVERSATION_TTL, JSON.stringify(state));
}

// ─── Main Handler ───────────────────────────────────────────

/**
 * Process an incoming WhatsApp message:
 * 1. Load conversation state from Redis
 * 2. Route to WhatsApp CX agent
 * 3. Get response from Claude
 * 4. Save conversation state
 * 5. Return reply to send via WhatsApp API
 */
export async function handleWhatsAppMessage(
  message: WhatsAppIncomingMessage,
): Promise<WhatsAppReply> {
  const agent = agentRegistry.get('whatsapp_cx');
  if (!agent) {
    return {
      to: message.from,
      body: 'Lo sentimos, el servicio no está disponible en este momento. Por favor intente más tarde.',
    };
  }

  // Load conversation history
  const conversation = await getConversation(message.from, message.tenantId);

  const context: AgentContext = {
    tenantId: message.tenantId,
    correlationId: crypto.randomUUID(),
    conversationId: conversation.conversationId,
    channel: 'whatsapp',
    metadata: {
      phone: message.from,
      profileName: message.profileName,
      messageId: message.messageId,
    },
  };

  // Run agent
  const result = await agent.run(
    message.body,
    context,
    conversation.messages,
  );

  // Update conversation history
  conversation.messages.push({
    role: 'user',
    content: message.body,
    timestamp: message.timestamp,
  });
  conversation.messages.push({
    role: 'assistant',
    content: result.response,
    toolCalls: result.toolCalls,
    timestamp: new Date().toISOString(),
  });

  await saveConversation(message.from, message.tenantId, conversation);

  // Check if agent wants to escalate
  const escalateCall = result.toolCalls.find(
    (tc) => tc.toolName === 'escalate_to_human' && tc.result.success,
  );

  return {
    to: message.from,
    body: result.response,
    action: escalateCall ? 'escalate' : undefined,
    metadata: escalateCall ? (escalateCall.result.data as Record<string, unknown>) : undefined,
  };
}
