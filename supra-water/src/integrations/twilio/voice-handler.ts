// =============================================================
// Voice AI Call Handler — SUPRA Water 2026 §5.2
// Twilio + Claude for CEA Queretaro call center
// =============================================================

import type { Request, Response } from 'express';
import { buildTwiML, type TwiMLNode, type IncomingCallWebhook, type TwilioClient } from './client.js';

// ---- Configuration ----

export interface VoiceHandlerConfig {
  /** Base URL for webhooks (e.g. https://api.supra.water/cea-qro/v1) */
  webhookBaseUrl: string;
  /** Twilio client for signature verification */
  twilioClient: TwilioClient;
  /** Handler for AI conversation turns */
  onConversationTurn: (input: ConversationTurnInput) => Promise<ConversationTurnResult>;
  /** Handler for tool calls from the AI */
  onToolCall: (callSid: string, tool: ToolCall) => Promise<ToolCallResult>;
  /** Handler for transfer to human */
  onTransferToHuman: (callSid: string, reason: string) => Promise<TransferTarget>;
  /** Greeting message in Spanish */
  greetingMessage?: string;
  /** Max seconds to wait for speech input */
  speechTimeout?: number;
  /** Language for speech recognition */
  language?: string;
}

// ---- Types ----

export interface ConversationTurnInput {
  callSid: string;
  callerPhone: string;
  speechResult: string;
  confidence: number;
  conversationHistory: ConversationMessage[];
}

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ConversationTurnResult {
  response: string;
  toolCalls?: ToolCall[];
  shouldTransfer?: boolean;
  transferReason?: string;
  shouldEndCall?: boolean;
}

export interface ToolCall {
  name: string;
  input: Record<string, unknown>;
}

export interface ToolCallResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface TransferTarget {
  type: 'phone' | 'sip' | 'queue';
  destination: string;
  announceMessage?: string;
}

// ---- In-Memory Conversation Store ----

const conversations = new Map<string, {
  history: ConversationMessage[];
  callerPhone: string;
  startedAt: number;
}>();

// Clean up old conversations every 30 minutes
setInterval(() => {
  const cutoff = Date.now() - 60 * 60 * 1000; // 1 hour
  for (const [sid, conv] of conversations) {
    if (conv.startedAt < cutoff) conversations.delete(sid);
  }
}, 30 * 60 * 1000);

// ---- Voice Handler Factory ----

const DEFAULT_GREETING =
  'Bienvenido a la Comision Estatal de Aguas de Queretaro. ' +
  'Soy el asistente virtual. En que puedo ayudarle?';

/**
 * Create Express route handlers for Twilio voice webhooks.
 *
 * @example
 * const voice = createVoiceHandler({
 *   webhookBaseUrl: 'https://api.supra.water/cea-qro/v1',
 *   twilioClient,
 *   onConversationTurn: async (input) => {
 *     // Call Claude API with conversation history
 *     return { response: 'Su saldo es de $385.50 pesos.' };
 *   },
 *   onToolCall: async (callSid, tool) => {
 *     // Execute tool (lookup_account, get_balance, etc.)
 *     return { success: true, data: { balance: 385.50 } };
 *   },
 *   onTransferToHuman: async (callSid, reason) => {
 *     return { type: 'queue', destination: 'soporte-general' };
 *   },
 * });
 *
 * router.post('/voice/incoming', voice.incoming);
 * router.post('/voice/gather', voice.gather);
 * router.post('/voice/status', voice.status);
 */
export function createVoiceHandler(config: VoiceHandlerConfig) {
  const greeting = config.greetingMessage ?? DEFAULT_GREETING;
  const speechTimeout = config.speechTimeout ?? 3;
  const language = config.language ?? 'es-MX';

  return {
    /**
     * POST /voice/incoming — Handle new inbound call.
     * Returns TwiML that greets the caller and starts gathering speech.
     */
    incoming(req: Request, res: Response): void {
      const webhook = req.body as IncomingCallWebhook;

      console.log(
        `[voice] Incoming call: ${webhook.CallSid} from ${webhook.From}`,
      );

      // Initialize conversation
      conversations.set(webhook.CallSid, {
        history: [
          {
            role: 'system',
            content:
              'Eres el asistente telefonico de CEA Queretaro. ' +
              'Hablas espanol mexicano natural y profesional. ' +
              'Resuelve la llamada sin transferir a humano cuando sea posible.',
          },
        ],
        callerPhone: webhook.From,
        startedAt: Date.now(),
      });

      const twiml = buildTwiML([
        {
          tag: 'Say',
          attrs: { language, voice: 'Polly.Mia-Neural' },
          children: [greeting],
        },
        {
          tag: 'Gather',
          attrs: {
            input: 'speech',
            action: `${config.webhookBaseUrl}/voice/gather`,
            method: 'POST',
            language,
            speechTimeout: String(speechTimeout),
            speechModel: 'phone_call',
          },
        },
        // Fallback if no input
        {
          tag: 'Say',
          attrs: { language, voice: 'Polly.Mia-Neural' },
          children: ['No escuche su respuesta. Por favor intente de nuevo.'],
        },
        {
          tag: 'Redirect',
          attrs: { method: 'POST' },
          children: [`${config.webhookBaseUrl}/voice/incoming`],
        },
      ]);

      res.type('text/xml').send(twiml);
    },

    /**
     * POST /voice/gather — Process speech input and respond.
     */
    async gather(req: Request, res: Response): Promise<void> {
      const body = req.body as Record<string, string>;
      const callSid = body.CallSid;
      const speechResult = body.SpeechResult ?? '';
      const confidence = parseFloat(body.Confidence ?? '0');

      console.log(
        `[voice] Speech from ${callSid}: "${speechResult}" (confidence: ${confidence})`,
      );

      const conversation = conversations.get(callSid);
      if (!conversation) {
        // Conversation expired, restart
        const twiml = buildTwiML([
          {
            tag: 'Say',
            attrs: { language, voice: 'Polly.Mia-Neural' },
            children: ['Disculpe, hubo un problema. Permitame reconectar.'],
          },
          {
            tag: 'Redirect',
            attrs: { method: 'POST' },
            children: [`${config.webhookBaseUrl}/voice/incoming`],
          },
        ]);
        res.type('text/xml').send(twiml);
        return;
      }

      // Add user message to history
      conversation.history.push({ role: 'user', content: speechResult });

      try {
        // Get AI response
        const turnResult = await config.onConversationTurn({
          callSid,
          callerPhone: conversation.callerPhone,
          speechResult,
          confidence,
          conversationHistory: conversation.history,
        });

        // Execute any tool calls
        if (turnResult.toolCalls) {
          for (const tool of turnResult.toolCalls) {
            await config.onToolCall(callSid, tool);
          }
        }

        // Transfer to human agent
        if (turnResult.shouldTransfer && turnResult.transferReason) {
          const target = await config.onTransferToHuman(callSid, turnResult.transferReason);

          const nodes: TwiMLNode[] = [];

          if (target.announceMessage) {
            nodes.push({
              tag: 'Say',
              attrs: { language, voice: 'Polly.Mia-Neural' },
              children: [target.announceMessage],
            });
          }

          nodes.push({
            tag: 'Say',
            attrs: { language, voice: 'Polly.Mia-Neural' },
            children: [turnResult.response],
          });

          if (target.type === 'phone') {
            nodes.push({
              tag: 'Dial',
              children: [target.destination],
            });
          } else if (target.type === 'queue') {
            nodes.push({
              tag: 'Dial',
              children: [{ tag: 'Queue', children: [target.destination] }],
            });
          } else if (target.type === 'sip') {
            nodes.push({
              tag: 'Dial',
              children: [{ tag: 'Sip', children: [target.destination] }],
            });
          }

          conversations.delete(callSid);
          res.type('text/xml').send(buildTwiML(nodes));
          return;
        }

        // End call
        if (turnResult.shouldEndCall) {
          const twiml = buildTwiML([
            {
              tag: 'Say',
              attrs: { language, voice: 'Polly.Mia-Neural' },
              children: [turnResult.response],
            },
            { tag: 'Hangup' },
          ]);

          conversations.delete(callSid);
          res.type('text/xml').send(twiml);
          return;
        }

        // Normal response — speak and gather next input
        conversation.history.push({ role: 'assistant', content: turnResult.response });

        const twiml = buildTwiML([
          {
            tag: 'Say',
            attrs: { language, voice: 'Polly.Mia-Neural' },
            children: [turnResult.response],
          },
          {
            tag: 'Gather',
            attrs: {
              input: 'speech',
              action: `${config.webhookBaseUrl}/voice/gather`,
              method: 'POST',
              language,
              speechTimeout: String(speechTimeout),
              speechModel: 'phone_call',
            },
          },
          // Fallback
          {
            tag: 'Say',
            attrs: { language, voice: 'Polly.Mia-Neural' },
            children: ['Sigo aqui. En que mas puedo ayudarle?'],
          },
          {
            tag: 'Gather',
            attrs: {
              input: 'speech',
              action: `${config.webhookBaseUrl}/voice/gather`,
              method: 'POST',
              language,
              speechTimeout: String(speechTimeout),
              speechModel: 'phone_call',
            },
          },
        ]);

        res.type('text/xml').send(twiml);
      } catch (err) {
        console.error(`[voice] Error processing turn for ${callSid}:`, err);

        const twiml = buildTwiML([
          {
            tag: 'Say',
            attrs: { language, voice: 'Polly.Mia-Neural' },
            children: [
              'Disculpe, tuve un problema tecnico. Permitame transferirle con un agente.',
            ],
          },
          {
            tag: 'Dial',
            children: [{ tag: 'Queue', children: ['soporte-general'] }],
          },
        ]);

        conversations.delete(callSid);
        res.type('text/xml').send(twiml);
      }
    },

    /**
     * POST /voice/status — Call status callback.
     */
    status(req: Request, res: Response): void {
      const body = req.body as Record<string, string>;
      console.log(
        `[voice] Call ${body.CallSid} status: ${body.CallStatus}` +
          (body.CallDuration ? ` (${body.CallDuration}s)` : ''),
      );

      // Clean up conversation when call ends
      if (['completed', 'busy', 'no-answer', 'canceled', 'failed'].includes(body.CallStatus)) {
        conversations.delete(body.CallSid);
      }

      res.status(204).send();
    },
  };
}
