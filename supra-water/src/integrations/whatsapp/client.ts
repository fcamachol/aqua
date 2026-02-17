// =============================================================
// WhatsApp Business API Client — SUPRA Water 2026 §7.3
// Supports 360dialog / Meta Cloud API
// =============================================================

export interface WhatsAppConfig {
  apiUrl: string;          // e.g. https://waba.360dialog.io/v1 or https://graph.facebook.com/v21.0
  apiKey: string;          // D-360 API key or Meta permanent token
  phoneNumberId: string;   // WhatsApp business phone number ID
  maxRetries?: number;
  timeoutMs?: number;
}

// ---- Message Types ----

export interface TemplateParameter {
  type: 'text' | 'currency' | 'date_time' | 'image' | 'document';
  text?: string;
  currency?: { fallback_value: string; code: string; amount_1000: number };
  date_time?: { fallback_value: string };
  image?: { link: string };
  document?: { link: string; filename: string };
}

export interface TemplateComponent {
  type: 'header' | 'body' | 'button';
  sub_type?: 'url' | 'quick_reply';
  index?: number;
  parameters: TemplateParameter[];
}

export interface TemplateMessage {
  to: string;
  template: {
    name: string;
    language: { code: string };
    components: TemplateComponent[];
  };
}

export interface TextMessage {
  to: string;
  type: 'text';
  text: { body: string; preview_url?: boolean };
}

export interface ImageMessage {
  to: string;
  type: 'image';
  image: { link?: string; id?: string; caption?: string };
}

export interface DocumentMessage {
  to: string;
  type: 'document';
  document: { link?: string; id?: string; filename?: string; caption?: string };
}

export interface InteractiveButton {
  type: 'reply';
  reply: { id: string; title: string };
}

export interface InteractiveMessage {
  to: string;
  type: 'interactive';
  interactive: {
    type: 'button' | 'list';
    header?: { type: 'text'; text: string };
    body: { text: string };
    footer?: { text: string };
    action: {
      buttons?: InteractiveButton[];
      button?: string;
      sections?: Array<{
        title: string;
        rows: Array<{ id: string; title: string; description?: string }>;
      }>;
    };
  };
}

export type SessionMessage = TextMessage | ImageMessage | DocumentMessage | InteractiveMessage;

// ---- Response Types ----

export interface SendMessageResponse {
  messaging_product: 'whatsapp';
  contacts: Array<{ input: string; wa_id: string }>;
  messages: Array<{ id: string }>;
}

// ---- Webhook Types ----

export interface WebhookEntry {
  id: string;
  changes: WebhookChange[];
}

export interface WebhookChange {
  value: {
    messaging_product: 'whatsapp';
    metadata: { display_phone_number: string; phone_number_id: string };
    contacts?: Array<{ profile: { name: string }; wa_id: string }>;
    messages?: IncomingMessage[];
    statuses?: DeliveryStatus[];
  };
  field: string;
}

export interface IncomingMessage {
  from: string;
  id: string;
  timestamp: string;
  type: 'text' | 'image' | 'document' | 'location' | 'interactive' | 'button';
  text?: { body: string };
  image?: { id: string; mime_type: string; sha256: string; caption?: string };
  document?: { id: string; mime_type: string; sha256: string; filename: string };
  location?: { latitude: number; longitude: number; name?: string; address?: string };
  interactive?: { type: string; button_reply?: { id: string; title: string }; list_reply?: { id: string; title: string } };
  button?: { text: string; payload: string };
  context?: { from: string; id: string };
}

export interface DeliveryStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id: string;
  errors?: Array<{ code: number; title: string; message: string }>;
}

// ---- Client ----

export class WhatsAppClient {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly phoneNumberId: string;
  private readonly maxRetries: number;
  private readonly timeoutMs: number;

  constructor(config: WhatsAppConfig) {
    this.apiUrl = config.apiUrl.replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.phoneNumberId = config.phoneNumberId;
    this.maxRetries = config.maxRetries ?? 3;
    this.timeoutMs = config.timeoutMs ?? 15_000;
  }

  /**
   * Send a pre-approved template message.
   */
  async sendTemplate(message: TemplateMessage): Promise<SendMessageResponse> {
    return this.sendMessage({
      messaging_product: 'whatsapp',
      to: message.to,
      type: 'template',
      template: message.template,
    });
  }

  /**
   * Send a session message (within 24h window).
   */
  async sendSessionMessage(message: SessionMessage): Promise<SendMessageResponse> {
    const payload: Record<string, unknown> = {
      messaging_product: 'whatsapp',
      to: message.to,
      type: message.type,
    };

    if (message.type === 'text') payload.text = message.text;
    else if (message.type === 'image') payload.image = message.image;
    else if (message.type === 'document') payload.document = message.document;
    else if (message.type === 'interactive') payload.interactive = message.interactive;

    return this.sendMessage(payload);
  }

  /**
   * Mark a message as read.
   */
  async markAsRead(messageId: string): Promise<void> {
    await this.request('POST', `/${this.phoneNumberId}/messages`, {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    });
  }

  // ---- Internal ----

  private async sendMessage(payload: Record<string, unknown>): Promise<SendMessageResponse> {
    const data = await this.request<SendMessageResponse>(
      'POST',
      `/${this.phoneNumberId}/messages`,
      payload,
    );
    return data;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>,
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 10_000);
        await new Promise((r) => setTimeout(r, delay + Math.random() * delay * 0.1));
        console.log(`[whatsapp] Retry ${attempt}/${this.maxRetries} for ${method} ${path}`);
      }

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);

        const url = `${this.apiUrl}${path}`;
        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timer);

        const json = await response.json() as Record<string, unknown>;

        console.log(
          `[whatsapp] ${method} ${path} -> ${response.status}`,
        );

        if (!response.ok) {
          // Rate limited — retry
          if (response.status === 429) {
            lastError = new Error(`Rate limited: ${JSON.stringify(json)}`);
            continue;
          }
          // Server error — retry
          if (response.status >= 500) {
            lastError = new Error(`Server error ${response.status}: ${JSON.stringify(json)}`);
            continue;
          }
          throw new Error(
            `WhatsApp API error ${response.status}: ${JSON.stringify(json)}`,
          );
        }

        return json as T;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (lastError.name === 'AbortError') {
          lastError = new Error(`Request timed out after ${this.timeoutMs}ms`);
          continue;
        }
        // Non-retryable client errors
        if (lastError.message.includes('WhatsApp API error')) {
          throw lastError;
        }
        continue;
      }
    }

    throw lastError ?? new Error('WhatsApp request failed after all retries');
  }
}

// ---- Webhook Parsing ----

/**
 * Parse a WhatsApp webhook payload into structured entries.
 */
export function parseWebhookPayload(body: Record<string, unknown>): WebhookEntry[] {
  const entries = (body.entry ?? []) as WebhookEntry[];
  return entries;
}

/**
 * Extract incoming messages from webhook entries.
 */
export function extractMessages(entries: WebhookEntry[]): Array<{
  from: string;
  profileName: string;
  message: IncomingMessage;
  phoneNumberId: string;
}> {
  const results: Array<{
    from: string;
    profileName: string;
    message: IncomingMessage;
    phoneNumberId: string;
  }> = [];

  for (const entry of entries) {
    for (const change of entry.changes) {
      const value = change.value;
      if (!value.messages) continue;

      const contactMap = new Map<string, string>();
      for (const contact of value.contacts ?? []) {
        contactMap.set(contact.wa_id, contact.profile.name);
      }

      for (const msg of value.messages) {
        results.push({
          from: msg.from,
          profileName: contactMap.get(msg.from) ?? '',
          message: msg,
          phoneNumberId: value.metadata.phone_number_id,
        });
      }
    }
  }

  return results;
}

/**
 * Extract delivery statuses from webhook entries.
 */
export function extractStatuses(entries: WebhookEntry[]): DeliveryStatus[] {
  const statuses: DeliveryStatus[] = [];

  for (const entry of entries) {
    for (const change of entry.changes) {
      if (change.value.statuses) {
        statuses.push(...change.value.statuses);
      }
    }
  }

  return statuses;
}
