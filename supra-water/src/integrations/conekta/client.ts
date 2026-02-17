// =============================================================
// Conekta Payment Gateway Client — SUPRA Water 2026 §7.2
// OXXO references, card charges, webhooks, refunds
// =============================================================

export interface ConektaConfig {
  apiKey: string;          // Private API key
  apiVersion?: string;     // Default: '2.0.0'
  baseUrl?: string;
  locale?: string;         // Default: 'es'
  maxRetries?: number;
  timeoutMs?: number;
}

// ---- OXXO Payment ----

export interface CreateOxxoInput {
  /** Unique order reference (e.g. invoice ID) */
  orderId: string;
  /** Customer name */
  customerName: string;
  /** Customer email */
  customerEmail: string;
  /** Customer phone (+52...) */
  customerPhone?: string;
  /** Amount in MXN centavos (e.g. 38550 = $385.50) */
  amountCentavos: number;
  /** Description shown on OXXO receipt */
  description: string;
  /** Expiration in days from now (default: 30) */
  expirationDays?: number;
}

export interface OxxoPaymentResult {
  orderId: string;
  chargeId: string;
  reference: string;    // OXXO barcode reference number
  barcodeUrl: string;   // URL to barcode image
  expiresAt: string;    // ISO date
  amount: number;       // Amount in centavos
  status: 'pending_payment';
}

// ---- Card Payment ----

export interface CreateCardChargeInput {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amountCentavos: number;
  description: string;
  /** Conekta token from frontend tokenization */
  tokenId: string;
  /** Enable 3D Secure (recommended for MX) */
  require3ds?: boolean;
  /** Return URL after 3D Secure challenge */
  returnUrl?: string;
}

export interface CardChargeResult {
  orderId: string;
  chargeId: string;
  status: 'paid' | 'pending_payment' | 'declined';
  authCode?: string;
  last4?: string;
  brand?: string;
  /** 3D Secure redirect URL (if require3ds=true and challenge needed) */
  redirectUrl?: string;
}

// ---- Webhook Types ----

export type ConektaWebhookEvent =
  | 'charge.paid'
  | 'charge.expired'
  | 'charge.declined'
  | 'charge.refunded'
  | 'charge.created'
  | 'order.paid'
  | 'order.expired'
  | 'order.canceled';

export interface ConektaWebhookPayload {
  id: string;
  type: ConektaWebhookEvent;
  created_at: number;
  data: {
    object: ConektaOrder;
  };
  livemode: boolean;
}

export interface ConektaOrder {
  id: string;
  metadata: Record<string, string>;
  amount: number;
  currency: string;
  payment_status: string;
  charges: {
    data: Array<{
      id: string;
      status: string;
      payment_method: {
        type: string;
        reference?: string;
        barcode_url?: string;
        expires_at?: string;
        auth_code?: string;
        last4?: string;
        brand?: string;
      };
      amount: number;
    }>;
  };
  customer_info: {
    name: string;
    email: string;
    phone?: string;
  };
}

// ---- Refund ----

export interface RefundInput {
  orderId: string;
  amountCentavos: number;
  reason: string;
}

export interface RefundResult {
  id: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'refunded';
  createdAt: string;
}

// ---- Client ----

export class ConektaClient {
  private readonly apiKey: string;
  private readonly apiVersion: string;
  private readonly baseUrl: string;
  private readonly locale: string;
  private readonly maxRetries: number;
  private readonly timeoutMs: number;

  constructor(config: ConektaConfig) {
    this.apiKey = config.apiKey;
    this.apiVersion = config.apiVersion ?? '2.0.0';
    this.baseUrl = config.baseUrl ?? 'https://api.conekta.io';
    this.locale = config.locale ?? 'es';
    this.maxRetries = config.maxRetries ?? 3;
    this.timeoutMs = config.timeoutMs ?? 20_000;
  }

  /**
   * Create an OXXO payment reference.
   */
  async createOxxoPayment(input: CreateOxxoInput): Promise<OxxoPaymentResult> {
    const expiresAt = Math.floor(Date.now() / 1000) + (input.expirationDays ?? 30) * 86400;

    const body = {
      currency: 'MXN',
      metadata: { order_id: input.orderId },
      line_items: [
        {
          name: input.description,
          unit_price: input.amountCentavos,
          quantity: 1,
        },
      ],
      customer_info: {
        name: input.customerName,
        email: input.customerEmail,
        phone: input.customerPhone,
      },
      charges: [
        {
          payment_method: {
            type: 'oxxo_cash',
            expires_at: expiresAt,
          },
        },
      ],
    };

    const order = await this.request<ConektaOrder>('POST', '/orders', body);
    const charge = order.charges.data[0];

    return {
      orderId: order.id,
      chargeId: charge.id,
      reference: charge.payment_method.reference ?? '',
      barcodeUrl: charge.payment_method.barcode_url ?? '',
      expiresAt: new Date(expiresAt * 1000).toISOString(),
      amount: charge.amount,
      status: 'pending_payment',
    };
  }

  /**
   * Create a card charge (tokenized, optionally with 3D Secure).
   */
  async createCardCharge(input: CreateCardChargeInput): Promise<CardChargeResult> {
    const charge: Record<string, unknown> = {
      payment_method: {
        type: 'card',
        token_id: input.tokenId,
      },
    };

    if (input.require3ds !== false) {
      (charge.payment_method as Record<string, unknown>).monthly_installments = undefined;
    }

    const body: Record<string, unknown> = {
      currency: 'MXN',
      metadata: { order_id: input.orderId },
      line_items: [
        {
          name: input.description,
          unit_price: input.amountCentavos,
          quantity: 1,
        },
      ],
      customer_info: {
        name: input.customerName,
        email: input.customerEmail,
        phone: input.customerPhone,
      },
      charges: [charge],
    };

    if (input.require3ds !== false && input.returnUrl) {
      body.three_ds = {
        redirect_url: input.returnUrl,
      };
    }

    const order = await this.request<ConektaOrder>('POST', '/orders', body);
    const chargeData = order.charges.data[0];

    return {
      orderId: order.id,
      chargeId: chargeData.id,
      status: chargeData.status as CardChargeResult['status'],
      authCode: chargeData.payment_method.auth_code,
      last4: chargeData.payment_method.last4,
      brand: chargeData.payment_method.brand,
    };
  }

  /**
   * Refund a charge (full or partial).
   */
  async refund(input: RefundInput): Promise<RefundResult> {
    const body = {
      amount: input.amountCentavos,
      reason: input.reason,
    };

    const data = await this.request<{
      id: string;
      amount: number;
      status: string;
      created_at: number;
    }>('POST', `/orders/${input.orderId}/refunds`, body);

    return {
      id: data.id,
      orderId: input.orderId,
      amount: data.amount,
      status: data.status as 'pending' | 'refunded',
      createdAt: new Date(data.created_at * 1000).toISOString(),
    };
  }

  /**
   * Verify a Conekta webhook signature.
   */
  static verifyWebhookSignature(
    rawBody: string | Buffer,
    signature: string,
    privateKey: string,
  ): boolean {
    const { createHmac, timingSafeEqual } = require('node:crypto') as typeof import('node:crypto');
    const expected = createHmac('sha256', privateKey)
      .update(rawBody)
      .digest('hex');

    try {
      return timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected),
      );
    } catch {
      return false;
    }
  }

  /**
   * Parse a webhook payload into a typed event.
   */
  static parseWebhook(body: Record<string, unknown>): ConektaWebhookPayload {
    return body as unknown as ConektaWebhookPayload;
  }

  // ---- Internal ----

  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>,
  ): Promise<T> {
    let lastError: Error | null = null;
    const authHeader =
      'Basic ' + Buffer.from(`${this.apiKey}:`).toString('base64');

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 10_000);
        await new Promise((r) => setTimeout(r, delay + Math.random() * delay * 0.1));
        console.log(`[conekta] Retry ${attempt}/${this.maxRetries} for ${method} ${path}`);
      }

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);

        const url = `${this.baseUrl}${path}`;
        const response = await fetch(url, {
          method,
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
            Accept: `application/vnd.conekta-v${this.apiVersion}+json`,
            'Accept-Language': this.locale,
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timer);

        const json = await response.json() as Record<string, unknown>;

        console.log(`[conekta] ${method} ${path} -> ${response.status}`);

        if (!response.ok) {
          if (response.status === 429 || response.status >= 500) {
            lastError = new Error(`Conekta ${response.status}: ${JSON.stringify(json)}`);
            continue;
          }
          throw new Error(
            `Conekta API error ${response.status}: ${JSON.stringify(json)}`,
          );
        }

        return json as T;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (lastError.name === 'AbortError') {
          lastError = new Error(`Conekta request timed out after ${this.timeoutMs}ms`);
          continue;
        }
        if (lastError.message.includes('Conekta API error')) throw lastError;
        continue;
      }
    }

    throw lastError ?? new Error('Conekta request failed after all retries');
  }
}
