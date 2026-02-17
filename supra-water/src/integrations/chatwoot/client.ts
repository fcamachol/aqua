// =============================================================
// Chatwoot (AGORA) CRM Client — SUPRA Water 2026 §7
// Integration with Chatwoot for omnichannel CX management
// =============================================================

export interface ChatwootConfig {
  /** Chatwoot instance URL (e.g. https://agora.cea.gob.mx) */
  baseUrl: string;
  /** API access token (user or agent bot token) */
  apiToken: string;
  /** Default account ID */
  accountId: number;
  maxRetries?: number;
  timeoutMs?: number;
}

// ---- Contact Types ----

export interface CreateContactInput {
  name: string;
  email?: string;
  phone_number?: string;  // +52 format
  identifier?: string;    // External ID (e.g. SUPRA person_id)
  custom_attributes?: Record<string, string | number | boolean>;
}

export interface UpdateContactInput {
  name?: string;
  email?: string;
  phone_number?: string;
  custom_attributes?: Record<string, string | number | boolean>;
}

export interface ChatwootContact {
  id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
  identifier: string | null;
  custom_attributes: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ---- Conversation Types ----

export interface CreateConversationInput {
  /** Source ID (channel) */
  source_id?: string;
  inbox_id: number;
  contact_id: number;
  status?: 'open' | 'resolved' | 'pending';
  assignee_id?: number;
  team_id?: number;
  custom_attributes?: Record<string, string | number | boolean>;
  message?: {
    content: string;
    message_type?: 'incoming' | 'outgoing';
  };
}

export interface ChatwootConversation {
  id: number;
  inbox_id: number;
  contact: ChatwootContact;
  status: 'open' | 'resolved' | 'pending';
  assignee?: { id: number; name: string; email: string };
  team?: { id: number; name: string };
  custom_attributes: Record<string, unknown>;
  created_at: number;
  updated_at: number;
}

// ---- Message Types ----

export interface SendMessageInput {
  content: string;
  message_type?: 'incoming' | 'outgoing';
  private?: boolean;
  content_type?: 'text' | 'input_select' | 'cards' | 'form';
  content_attributes?: Record<string, unknown>;
}

export interface ChatwootMessage {
  id: number;
  content: string;
  message_type: number;
  content_type: string;
  private: boolean;
  sender?: { id: number; name: string; type: string };
  created_at: number;
}

// ---- Agent Handoff ----

export interface HandoffInput {
  conversationId: number;
  /** Team ID to assign to (e.g. soporte-tecnico, facturacion) */
  teamId?: number;
  /** Specific agent ID to assign */
  agentId?: number;
  /** Context message for the human agent (sent as private note) */
  contextNote: string;
}

// ---- Webhook Types ----

export type ChatwootWebhookEvent =
  | 'message_created'
  | 'message_updated'
  | 'conversation_created'
  | 'conversation_status_changed'
  | 'conversation_updated'
  | 'contact_created'
  | 'contact_updated'
  | 'webwidget_triggered';

export interface ChatwootWebhookPayload {
  event: ChatwootWebhookEvent;
  id?: number;
  account: { id: number };
  content?: string;
  content_type?: string;
  message_type?: string;
  conversation?: ChatwootConversation;
  contact?: ChatwootContact;
  sender?: { id: number; name: string; type: string };
  created_at?: string;
}

// ---- Client ----

export class ChatwootClient {
  private readonly baseUrl: string;
  private readonly apiToken: string;
  private readonly accountId: number;
  private readonly maxRetries: number;
  private readonly timeoutMs: number;

  constructor(config: ChatwootConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.apiToken = config.apiToken;
    this.accountId = config.accountId;
    this.maxRetries = config.maxRetries ?? 3;
    this.timeoutMs = config.timeoutMs ?? 15_000;
  }

  // ---- Contacts ----

  async createContact(input: CreateContactInput): Promise<ChatwootContact> {
    const data = await this.request<{ payload: { contact: ChatwootContact } }>(
      'POST',
      `/api/v1/accounts/${this.accountId}/contacts`,
      input,
    );
    return data.payload.contact;
  }

  async updateContact(
    contactId: number,
    input: UpdateContactInput,
  ): Promise<ChatwootContact> {
    return this.request<ChatwootContact>(
      'PUT',
      `/api/v1/accounts/${this.accountId}/contacts/${contactId}`,
      input,
    );
  }

  async searchContact(query: string): Promise<ChatwootContact[]> {
    const data = await this.request<{ payload: ChatwootContact[] }>(
      'GET',
      `/api/v1/accounts/${this.accountId}/contacts/search?q=${encodeURIComponent(query)}`,
    );
    return data.payload;
  }

  // ---- Conversations ----

  async createConversation(
    input: CreateConversationInput,
  ): Promise<ChatwootConversation> {
    return this.request<ChatwootConversation>(
      'POST',
      `/api/v1/accounts/${this.accountId}/conversations`,
      input,
    );
  }

  async getConversation(conversationId: number): Promise<ChatwootConversation> {
    return this.request<ChatwootConversation>(
      'GET',
      `/api/v1/accounts/${this.accountId}/conversations/${conversationId}`,
    );
  }

  // ---- Messages ----

  async sendMessage(
    conversationId: number,
    input: SendMessageInput,
  ): Promise<ChatwootMessage> {
    return this.request<ChatwootMessage>(
      'POST',
      `/api/v1/accounts/${this.accountId}/conversations/${conversationId}/messages`,
      input,
    );
  }

  // ---- Agent Handoff ----

  /**
   * Transfer a conversation from AI bot to a human agent.
   * Sends a private note with context, then assigns to team/agent.
   */
  async handoffToHuman(input: HandoffInput): Promise<void> {
    // Send private note with AI conversation context
    await this.sendMessage(input.conversationId, {
      content: input.contextNote,
      message_type: 'outgoing',
      private: true,
      content_type: 'text',
    });

    // Assign to team or specific agent
    const assignPayload: Record<string, unknown> = {};
    if (input.teamId) assignPayload.team_id = input.teamId;
    if (input.agentId) assignPayload.assignee_id = input.agentId;

    if (Object.keys(assignPayload).length > 0) {
      await this.request(
        'POST',
        `/api/v1/accounts/${this.accountId}/conversations/${input.conversationId}/assignments`,
        assignPayload,
      );
    }
  }

  // ---- Internal ----

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
        console.log(`[chatwoot] Retry ${attempt}/${this.maxRetries} for ${method} ${path}`);
      }

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);

        const url = `${this.baseUrl}${path}`;
        const options: RequestInit = {
          method,
          headers: {
            api_access_token: this.apiToken,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        };

        if (body && method !== 'GET') {
          options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        clearTimeout(timer);

        console.log(`[chatwoot] ${method} ${path} -> ${response.status}`);

        if (!response.ok) {
          const text = await response.text();
          if (response.status === 429 || response.status >= 500) {
            lastError = new Error(`Chatwoot ${response.status}: ${text.substring(0, 200)}`);
            continue;
          }
          throw new Error(`Chatwoot API error ${response.status}: ${text.substring(0, 500)}`);
        }

        const json = await response.json();
        return json as T;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (lastError.name === 'AbortError') {
          lastError = new Error(`Chatwoot request timed out after ${this.timeoutMs}ms`);
          continue;
        }
        if (lastError.message.includes('Chatwoot API error')) throw lastError;
        continue;
      }
    }

    throw lastError ?? new Error('Chatwoot request failed after all retries');
  }
}
