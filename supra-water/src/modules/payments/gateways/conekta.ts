import { env } from '../../../config/env.js';
import type { CreateChargeInput } from '../validators.js';

const CONEKTA_BASE = 'https://api.conekta.io';

interface ConektaHeaders {
  'Content-Type': string;
  Accept: string;
  Authorization: string;
}

function conektaHeaders(): ConektaHeaders {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/vnd.conekta-v2.2.0+json',
    Authorization: `Bearer ${env.CONEKTA_PRIVATE_KEY}`,
  };
}

// ---- Types ----

export interface ConektaChargeResult {
  order_id: string;
  charge_id: string;
  status: 'paid' | 'pending_payment' | 'declined' | 'expired';
  amount_cents: number;
  currency: string;
  last4?: string;
  brand?: string;
  three_d_secure_url?: string;
}

export interface ConektaRefundResult {
  refund_id: string;
  status: string;
  amount_cents: number;
}

// ---- Card Charge ----

/**
 * Create a card charge via Conekta.
 * Supports tokenized cards and 3D Secure.
 * All amounts are in MXN.
 */
export async function createCharge(input: CreateChargeInput): Promise<ConektaChargeResult> {
  const amountCents = Math.round(input.amount * 100);

  const body: Record<string, any> = {
    currency: 'MXN',
    customer_info: {
      name: input.customer_name || 'Cliente SUPRA',
      email: input.customer_email || 'noreply@supra.water',
    },
    line_items: [
      {
        name: `Pago de servicio de agua - Factura`,
        unit_price: amountCents,
        quantity: 1,
      },
    ],
    charges: [
      {
        payment_method: {
          type: 'card',
          token_id: input.token_id,
        },
        amount: amountCents,
      },
    ],
    metadata: {
      invoice_id: input.invoice_id,
      source: 'supra-water',
    },
  };

  // Enable 3D Secure if requested
  if (input.three_d_secure) {
    body.charges[0].payment_method.monthly_installments = undefined;
    body.pre_authorize = false;
    body.three_ds = { mode: 'smart' };
  }

  const response = await fetch(`${CONEKTA_BASE}/orders`, {
    method: 'POST',
    headers: conektaHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Conekta charge failed: ${error}`);
  }

  const order = (await response.json()) as any;
  const charge = order.charges?.data?.[0];

  const result: ConektaChargeResult = {
    order_id: order.id,
    charge_id: charge?.id ?? '',
    status: mapConektaStatus(order.payment_status),
    amount_cents: amountCents,
    currency: 'MXN',
    last4: charge?.payment_method?.last4,
    brand: charge?.payment_method?.brand,
  };

  // If 3D Secure is required, the charge will return a redirect URL
  if (charge?.payment_method?.auth_code === undefined && order.checkout?.url) {
    result.three_d_secure_url = order.checkout.url;
    result.status = 'pending_payment';
  }

  return result;
}

// ---- Refund ----

/**
 * Refund a Conekta order (full or partial).
 */
export async function refundCharge(
  conektaOrderId: string,
  amountCents?: number,
  reason?: string,
): Promise<ConektaRefundResult> {
  const body: Record<string, any> = {
    reason: reason || 'Reembolso solicitado',
  };
  if (amountCents) {
    body.amount = amountCents;
  }

  const response = await fetch(`${CONEKTA_BASE}/orders/${conektaOrderId}/refunds`, {
    method: 'POST',
    headers: conektaHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Conekta refund failed: ${error}`);
  }

  const refund = (await response.json()) as any;
  return {
    refund_id: refund.id,
    status: refund.status ?? 'pending',
    amount_cents: refund.amount ?? amountCents ?? 0,
  };
}

// ---- Webhook Signature Verification ----

/**
 * Verify Conekta webhook signature.
 * Uses HMAC-SHA256 with the private key.
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
): Promise<boolean> {
  const key = env.CONEKTA_PRIVATE_KEY;
  if (!key) return false;

  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(payload));
  const digest = Buffer.from(sig).toString('hex');
  return digest === signature;
}

// ---- Helpers ----

function mapConektaStatus(
  paymentStatus: string,
): 'paid' | 'pending_payment' | 'declined' | 'expired' {
  switch (paymentStatus) {
    case 'paid':
      return 'paid';
    case 'pending_payment':
      return 'pending_payment';
    case 'declined':
    case 'failed':
      return 'declined';
    case 'expired':
      return 'expired';
    default:
      return 'pending_payment';
  }
}
