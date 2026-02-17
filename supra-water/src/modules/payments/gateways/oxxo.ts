import { env } from '../../../config/env.js';
import dayjs from 'dayjs';
import type { OxxoWebhookInput } from '../validators.js';

// OXXO config per §7.2
const OXXO_CONFIG = {
  provider: 'conekta' as const,
  reference_format: 'barcode_128' as const,
  expiration_days: 30,
  webhook_url: '/api/v1/payments/oxxo/webhook',
};

interface OxxoChargeResult {
  conekta_order_id: string;
  barcode_url: string;
  reference: string;
  expires_at: string;
  amount_cents: number;
}

/**
 * Generate an OXXO barcode payment reference via Conekta.
 * Creates a Conekta order with OXXO as the payment method.
 */
export async function generateOxxoReference(params: {
  invoiceId: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  description: string;
}): Promise<OxxoChargeResult> {
  const amountCents = Math.round(params.amount * 100);
  const expiresAt = dayjs().add(OXXO_CONFIG.expiration_days, 'day').unix();

  const response = await fetch('https://api.conekta.io/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.conekta-v2.2.0+json',
      Authorization: `Bearer ${env.CONEKTA_PRIVATE_KEY}`,
    },
    body: JSON.stringify({
      currency: 'MXN',
      customer_info: {
        name: params.customerName,
        email: params.customerEmail || 'noreply@supra.water',
      },
      line_items: [
        {
          name: params.description,
          unit_price: amountCents,
          quantity: 1,
        },
      ],
      charges: [
        {
          payment_method: {
            type: 'oxxo_cash',
            expires_at: expiresAt,
          },
          amount: amountCents,
        },
      ],
      metadata: {
        invoice_id: params.invoiceId,
        source: 'supra-water',
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Conekta OXXO order failed: ${error}`);
  }

  const order = (await response.json()) as any;
  const charge = order.charges?.data?.[0];
  const paymentMethod = charge?.payment_method;

  return {
    conekta_order_id: order.id,
    barcode_url: paymentMethod?.barcode_url ?? '',
    reference: paymentMethod?.reference ?? '',
    expires_at: dayjs.unix(expiresAt).toISOString(),
    amount_cents: amountCents,
  };
}

/**
 * Parse a Conekta OXXO payment webhook.
 * Extracts payment details from the webhook event.
 */
export function parseOxxoWebhook(data: OxxoWebhookInput): {
  conektaOrderId: string;
  reference: string;
  amountCents: number;
  status: string;
  paidAt: string | null;
} {
  const obj = data.data.object;
  return {
    conektaOrderId: obj.id,
    reference: obj.payment_method.reference,
    amountCents: obj.amount,
    status: obj.status,
    paidAt: obj.paid_at ? dayjs.unix(obj.paid_at).toISOString() : null,
  };
}

/**
 * Check if an OXXO reference has expired.
 */
export function isOxxoExpired(expiresAt: string): boolean {
  return dayjs().isAfter(dayjs(expiresAt));
}

export { OXXO_CONFIG };
