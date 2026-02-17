// =============================================================
// Twilio Integration Client — SUPRA Water 2026 §5.2 / §7
// Programmable Voice + SMS for Mexican water utilities
// =============================================================

import crypto from 'node:crypto';

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;      // +52XXXXXXXXXX
  baseUrl?: string;
  maxRetries?: number;
  timeoutMs?: number;
}

// ---- TwiML Builder ----

export interface TwiMLNode {
  tag: string;
  attrs?: Record<string, string>;
  children?: Array<TwiMLNode | string>;
}

/**
 * Build TwiML XML from a tree of nodes.
 */
export function buildTwiML(nodes: TwiMLNode[]): string {
  function render(node: TwiMLNode | string): string {
    if (typeof node === 'string') return escapeXml(node);

    const attrs = node.attrs
      ? Object.entries(node.attrs)
          .map(([k, v]) => ` ${k}="${escapeXml(v)}"`)
          .join('')
      : '';

    if (!node.children || node.children.length === 0) {
      return `<${node.tag}${attrs}/>`;
    }

    const inner = node.children.map(render).join('');
    return `<${node.tag}${attrs}>${inner}</${node.tag}>`;
  }

  const body = nodes.map(render).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><Response>${body}</Response>`;
}

// ---- SMS Types ----

export interface SendSMSInput {
  to: string;        // +52 phone number
  body: string;      // Message body (max 1600 chars)
  statusCallback?: string; // Webhook URL for delivery status
}

export interface SMSResponse {
  sid: string;
  status: string;
  to: string;
  from: string;
  dateCreated: string;
}

// ---- Voice Types ----

export interface IncomingCallWebhook {
  CallSid: string;
  AccountSid: string;
  From: string;
  To: string;
  CallStatus: 'ringing' | 'in-progress' | 'completed' | 'busy' | 'no-answer' | 'canceled' | 'failed';
  Direction: 'inbound' | 'outbound-api' | 'outbound-dial';
  CallerCity?: string;
  CallerState?: string;
  CallerCountry?: string;
}

export interface CallStatusWebhook {
  CallSid: string;
  CallStatus: string;
  CallDuration?: string;
  RecordingUrl?: string;
  RecordingSid?: string;
}

// ---- Client ----

export class TwilioClient {
  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly phoneNumber: string;
  private readonly baseUrl: string;
  private readonly maxRetries: number;
  private readonly timeoutMs: number;

  constructor(config: TwilioConfig) {
    this.accountSid = config.accountSid;
    this.authToken = config.authToken;
    this.phoneNumber = config.phoneNumber;
    this.baseUrl = config.baseUrl ?? 'https://api.twilio.com/2010-04-01';
    this.maxRetries = config.maxRetries ?? 3;
    this.timeoutMs = config.timeoutMs ?? 15_000;
  }

  /**
   * Send an SMS notification.
   */
  async sendSMS(input: SendSMSInput): Promise<SMSResponse> {
    const params = new URLSearchParams({
      To: normalizeMexicanPhone(input.to),
      From: this.phoneNumber,
      Body: input.body,
    });

    if (input.statusCallback) {
      params.set('StatusCallback', input.statusCallback);
    }

    const data = await this.request<SMSResponse>(
      'POST',
      `/Accounts/${this.accountSid}/Messages.json`,
      params.toString(),
      'application/x-www-form-urlencoded',
    );

    return data;
  }

  /**
   * Initiate an outbound call with TwiML.
   */
  async makeCall(input: {
    to: string;
    twimlUrl?: string;
    twiml?: string;
    statusCallback?: string;
  }): Promise<{ callSid: string; status: string }> {
    const params = new URLSearchParams({
      To: normalizeMexicanPhone(input.to),
      From: this.phoneNumber,
    });

    if (input.twimlUrl) {
      params.set('Url', input.twimlUrl);
    } else if (input.twiml) {
      params.set('Twiml', input.twiml);
    }

    if (input.statusCallback) {
      params.set('StatusCallback', input.statusCallback);
    }

    const data = await this.request<{ sid: string; status: string }>(
      'POST',
      `/Accounts/${this.accountSid}/Calls.json`,
      params.toString(),
      'application/x-www-form-urlencoded',
    );

    return { callSid: data.sid, status: data.status };
  }

  /**
   * Validate an incoming Twilio webhook signature.
   */
  validateWebhookSignature(
    requestUrl: string,
    params: Record<string, string>,
    signature: string,
  ): boolean {
    // Sort params and concatenate key+value
    const data =
      requestUrl +
      Object.keys(params)
        .sort()
        .map((key) => key + params[key])
        .join('');

    const expected = crypto
      .createHmac('sha1', this.authToken)
      .update(data)
      .digest('base64');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    );
  }

  // ---- Internal ----

  private async request<T>(
    method: string,
    path: string,
    body?: string,
    contentType?: string,
  ): Promise<T> {
    let lastError: Error | null = null;
    const authHeader =
      'Basic ' + Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 10_000);
        await new Promise((r) => setTimeout(r, delay + Math.random() * delay * 0.1));
        console.log(`[twilio] Retry ${attempt}/${this.maxRetries} for ${method} ${path}`);
      }

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);

        const url = `${this.baseUrl}${path}`;
        const response = await fetch(url, {
          method,
          headers: {
            Authorization: authHeader,
            'Content-Type': contentType ?? 'application/json',
          },
          body,
          signal: controller.signal,
        });

        clearTimeout(timer);

        const json = await response.json() as Record<string, unknown>;

        console.log(`[twilio] ${method} ${path} -> ${response.status}`);

        if (!response.ok) {
          if (response.status === 429 || response.status >= 500) {
            lastError = new Error(`Twilio ${response.status}: ${JSON.stringify(json)}`);
            continue;
          }
          throw new Error(
            `Twilio API error ${response.status}: ${JSON.stringify(json)}`,
          );
        }

        return json as T;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (lastError.name === 'AbortError') {
          lastError = new Error(`Twilio request timed out after ${this.timeoutMs}ms`);
          continue;
        }
        if (lastError.message.includes('Twilio API error')) throw lastError;
        continue;
      }
    }

    throw lastError ?? new Error('Twilio request failed after all retries');
  }
}

// ---- Helpers ----

/**
 * Normalize a Mexican phone number to E.164 format (+52...).
 */
export function normalizeMexicanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  // Already has country code
  if (digits.startsWith('52') && digits.length === 12) {
    return `+${digits}`;
  }

  // 10-digit local number
  if (digits.length === 10) {
    return `+52${digits}`;
  }

  // Already in +52 format
  if (phone.startsWith('+52')) {
    return phone;
  }

  return `+${digits}`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
