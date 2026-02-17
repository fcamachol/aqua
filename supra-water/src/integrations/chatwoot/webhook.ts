// =============================================================
// Chatwoot (AGORA) Webhook Handler — SUPRA Water 2026 §7
// =============================================================

import type { Request, Response } from 'express';
import type {
  ChatwootWebhookPayload,
  ChatwootWebhookEvent,
  ChatwootConversation,
  ChatwootContact,
} from './client.js';

export interface ChatwootWebhookConfig {
  /** Secret token for webhook signature verification (set in Chatwoot admin) */
  webhookToken?: string;
  /** Handler for new incoming messages from customers */
  onNewMessage?: (event: NewMessageEvent) => Promise<void>;
  /** Handler for conversation assignment changes */
  onConversationAssigned?: (event: ConversationAssignedEvent) => Promise<void>;
  /** Handler for conversation status changes */
  onConversationStatusChanged?: (event: ConversationStatusEvent) => Promise<void>;
  /** Handler for new contacts */
  onContactCreated?: (contact: ChatwootContact) => Promise<void>;
}

export interface NewMessageEvent {
  messageId: number;
  content: string;
  contentType: string;
  messageType: string;
  conversation: ChatwootConversation;
  sender: { id: number; name: string; type: string };
  accountId: number;
}

export interface ConversationAssignedEvent {
  conversation: ChatwootConversation;
  assignee: { id: number; name: string } | null;
  accountId: number;
}

export interface ConversationStatusEvent {
  conversation: ChatwootConversation;
  status: string;
  accountId: number;
}

/**
 * Create Express handler for Chatwoot AGORA webhooks.
 *
 * @example
 * const webhook = createChatwootWebhook({
 *   webhookToken: env.CHATWOOT_WEBHOOK_TOKEN,
 *   onNewMessage: async (event) => {
 *     // Route to WhatsApp CX agent if from customer
 *     if (event.sender.type === 'contact') {
 *       await routeToAgent(event);
 *     }
 *   },
 *   onConversationStatusChanged: async (event) => {
 *     console.log(`Conversation ${event.conversation.id} -> ${event.status}`);
 *   },
 * });
 *
 * router.post('/webhook/chatwoot', webhook);
 */
export function createChatwootWebhook(config: ChatwootWebhookConfig) {
  return async function handleChatwootWebhook(
    req: Request,
    res: Response,
  ): Promise<void> {
    // Verify token if configured
    if (config.webhookToken) {
      const token = req.headers['x-chatwoot-signature'] as string | undefined;
      if (token !== config.webhookToken) {
        console.warn('[chatwoot-webhook] Invalid webhook token');
        res.status(401).send('Unauthorized');
        return;
      }
    }

    // Acknowledge immediately
    res.status(200).send('OK');

    try {
      const payload = req.body as ChatwootWebhookPayload;
      const event = payload.event;

      console.log(
        `[chatwoot-webhook] Event: ${event}` +
          (payload.conversation ? ` conversation=${payload.conversation.id}` : ''),
      );

      switch (event) {
        case 'message_created': {
          if (config.onNewMessage && payload.conversation && payload.sender) {
            await config.onNewMessage({
              messageId: payload.id ?? 0,
              content: payload.content ?? '',
              contentType: payload.content_type ?? 'text',
              messageType: payload.message_type ?? 'incoming',
              conversation: payload.conversation,
              sender: payload.sender,
              accountId: payload.account.id,
            });
          }
          break;
        }

        case 'conversation_status_changed': {
          if (config.onConversationStatusChanged && payload.conversation) {
            await config.onConversationStatusChanged({
              conversation: payload.conversation,
              status: payload.conversation.status,
              accountId: payload.account.id,
            });
          }
          break;
        }

        case 'conversation_updated': {
          if (config.onConversationAssigned && payload.conversation) {
            await config.onConversationAssigned({
              conversation: payload.conversation,
              assignee: payload.conversation.assignee ?? null,
              accountId: payload.account.id,
            });
          }
          break;
        }

        case 'contact_created': {
          if (config.onContactCreated && payload.contact) {
            await config.onContactCreated(payload.contact);
          }
          break;
        }

        default:
          console.log(`[chatwoot-webhook] Unhandled event: ${event}`);
      }
    } catch (err) {
      console.error('[chatwoot-webhook] Processing error:', err);
    }
  };
}
