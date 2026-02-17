// =============================================================
// WhatsApp Webhook Handler — SUPRA Water 2026 §7.3
// =============================================================

import type { Request, Response } from 'express';
import crypto from 'node:crypto';
import {
  parseWebhookPayload,
  extractMessages,
  extractStatuses,
  type IncomingMessage,
  type DeliveryStatus,
} from './client.js';

export interface WhatsAppWebhookConfig {
  /** Meta app secret for signature verification */
  appSecret: string;
  /** Webhook verify token (set during webhook registration) */
  verifyToken: string;
  /** Handler for incoming messages */
  onMessage: (event: IncomingMessageEvent) => Promise<void>;
  /** Handler for delivery/read receipts */
  onStatus?: (status: DeliveryStatus) => Promise<void>;
}

export interface IncomingMessageEvent {
  from: string;
  profileName: string;
  message: IncomingMessage;
  phoneNumberId: string;
  /** Parsed content for common message types */
  parsed: ParsedContent;
}

export type ParsedContent =
  | { type: 'text'; body: string }
  | { type: 'location'; latitude: number; longitude: number; name?: string; address?: string }
  | { type: 'image'; mediaId: string; caption?: string; mimeType: string }
  | { type: 'interactive'; replyId: string; replyTitle: string }
  | { type: 'unknown'; rawType: string };

/**
 * Create Express handlers for the WhatsApp webhook endpoint.
 *
 * @example
 * const webhook = createWhatsAppWebhook({
 *   appSecret: env.WHATSAPP_APP_SECRET,
 *   verifyToken: env.WHATSAPP_VERIFY_TOKEN,
 *   onMessage: async (event) => {
 *     // Route to WhatsApp CX agent
 *   },
 *   onStatus: async (status) => {
 *     // Update delivery tracking
 *   },
 * });
 *
 * router.get('/webhook/whatsapp', webhook.verify);
 * router.post('/webhook/whatsapp', webhook.handle);
 */
export function createWhatsAppWebhook(config: WhatsAppWebhookConfig) {
  return {
    /**
     * GET handler — Meta webhook verification challenge.
     */
    verify(req: Request, res: Response): void {
      const mode = req.query['hub.mode'] as string | undefined;
      const token = req.query['hub.verify_token'] as string | undefined;
      const challenge = req.query['hub.challenge'] as string | undefined;

      if (mode === 'subscribe' && token === config.verifyToken) {
        console.log('[whatsapp-webhook] Verification successful');
        res.status(200).send(challenge);
        return;
      }

      console.warn('[whatsapp-webhook] Verification failed: invalid token');
      res.status(403).send('Forbidden');
    },

    /**
     * POST handler — Incoming messages and status updates.
     */
    async handle(req: Request, res: Response): Promise<void> {
      // Verify signature
      if (!verifySignature(req, config.appSecret)) {
        console.warn('[whatsapp-webhook] Invalid signature');
        res.status(401).send('Invalid signature');
        return;
      }

      // Acknowledge immediately (Meta expects 200 within 20s)
      res.status(200).send('OK');

      try {
        const body = req.body as Record<string, unknown>;
        const entries = parseWebhookPayload(body);

        // Process incoming messages
        const messages = extractMessages(entries);
        for (const msg of messages) {
          const parsed = parseContent(msg.message);
          await config.onMessage({
            from: msg.from,
            profileName: msg.profileName,
            message: msg.message,
            phoneNumberId: msg.phoneNumberId,
            parsed,
          });
        }

        // Process delivery/read statuses
        if (config.onStatus) {
          const statuses = extractStatuses(entries);
          for (const status of statuses) {
            await config.onStatus(status);
          }
        }
      } catch (err) {
        console.error('[whatsapp-webhook] Processing error:', err);
      }
    },
  };
}

// ---- Signature Verification ----

/**
 * Verify the X-Hub-Signature-256 header from Meta.
 */
function verifySignature(req: Request, appSecret: string): boolean {
  const signature = req.headers['x-hub-signature-256'] as string | undefined;
  if (!signature) return false;

  const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
  if (!rawBody) {
    console.warn('[whatsapp-webhook] rawBody not available for signature verification');
    return false;
  }

  const expected = 'sha256=' + crypto
    .createHmac('sha256', appSecret)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );
}

// ---- Content Parsing ----

function parseContent(msg: IncomingMessage): ParsedContent {
  switch (msg.type) {
    case 'text':
      return { type: 'text', body: msg.text?.body ?? '' };

    case 'location':
      return {
        type: 'location',
        latitude: msg.location?.latitude ?? 0,
        longitude: msg.location?.longitude ?? 0,
        name: msg.location?.name,
        address: msg.location?.address,
      };

    case 'image':
      return {
        type: 'image',
        mediaId: msg.image?.id ?? '',
        caption: msg.image?.caption,
        mimeType: msg.image?.mime_type ?? 'image/jpeg',
      };

    case 'interactive':
      return {
        type: 'interactive',
        replyId: msg.interactive?.button_reply?.id ?? msg.interactive?.list_reply?.id ?? '',
        replyTitle: msg.interactive?.button_reply?.title ?? msg.interactive?.list_reply?.title ?? '',
      };

    case 'button':
      return {
        type: 'interactive',
        replyId: msg.button?.payload ?? '',
        replyTitle: msg.button?.text ?? '',
      };

    default:
      return { type: 'unknown', rawType: msg.type };
  }
}
