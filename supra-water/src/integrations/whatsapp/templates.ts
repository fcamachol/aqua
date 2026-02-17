// =============================================================
// WhatsApp Message Templates — SUPRA Water 2026 §7.3
// Pre-approved templates for Meta Business verification
// =============================================================

import type { TemplateComponent, TemplateMessage } from './client.js';

// ---- Template Definitions ----

export interface TemplateDefinition {
  name: string;
  language: string;
  components: Array<{
    type: 'header' | 'body' | 'button';
    sub_type?: 'url' | 'quick_reply';
    parameterNames: string[];
  }>;
}

export const TEMPLATES = {
  /**
   * recibo_listo — Invoice ready notification
   * Body: {{customer_name}}, tu recibo de agua esta listo.
   *        Total: ${{total}} MXN. Fecha limite: {{due_date}}.
   * Button: Pagar ahora -> {{payment_url}}
   */
  recibo_listo: {
    name: 'recibo_listo',
    language: 'es_MX',
    components: [
      { type: 'body' as const, parameterNames: ['customer_name', 'total', 'due_date'] },
      { type: 'button' as const, sub_type: 'url' as const, parameterNames: ['payment_url'] },
    ],
  },

  /**
   * recordatorio_pago — Payment reminder
   * Body: {{customer_name}}, tienes un adeudo de ${{debt_amount}} MXN
   *        con {{days_past_due}} dias de atraso.
   * Button: Pagar ahora -> {{payment_url}}
   */
  recordatorio_pago: {
    name: 'recordatorio_pago',
    language: 'es_MX',
    components: [
      { type: 'body' as const, parameterNames: ['customer_name', 'debt_amount', 'days_past_due'] },
      { type: 'button' as const, sub_type: 'url' as const, parameterNames: ['payment_url'] },
    ],
  },

  /**
   * pago_confirmado — Payment confirmed
   * Body: {{customer_name}}, tu pago de ${{amount}} MXN ha sido confirmado.
   *        Numero de recibo: {{receipt_number}}.
   */
  pago_confirmado: {
    name: 'pago_confirmado',
    language: 'es_MX',
    components: [
      { type: 'body' as const, parameterNames: ['customer_name', 'amount', 'receipt_number'] },
    ],
  },

  /**
   * reporte_fuga_recibido — Leak report received
   * Body: {{customer_name}}, tu reporte de fuga ha sido registrado.
   *        Folio: {{folio}}. Tiempo estimado de respuesta: {{estimated_response}}.
   */
  reporte_fuga_recibido: {
    name: 'reporte_fuga_recibido',
    language: 'es_MX',
    components: [
      { type: 'body' as const, parameterNames: ['customer_name', 'folio', 'estimated_response'] },
    ],
  },

  /**
   * aviso_corte — Service cut warning
   * Body: {{customer_name}}, tu servicio de agua sera suspendido
   *        por adeudo de ${{debt_amount}} MXN. Fecha de corte: {{cut_date}}.
   * Button: Pagar ahora -> {{payment_url}}
   */
  aviso_corte: {
    name: 'aviso_corte',
    language: 'es_MX',
    components: [
      { type: 'body' as const, parameterNames: ['customer_name', 'debt_amount', 'cut_date'] },
      { type: 'button' as const, sub_type: 'url' as const, parameterNames: ['payment_url'] },
    ],
  },
} satisfies Record<string, TemplateDefinition>;

export type TemplateName = keyof typeof TEMPLATES;

// ---- Template Builder ----

type TemplateParams = {
  recibo_listo: { customer_name: string; total: string; due_date: string; payment_url: string };
  recordatorio_pago: { customer_name: string; debt_amount: string; days_past_due: string; payment_url: string };
  pago_confirmado: { customer_name: string; amount: string; receipt_number: string };
  reporte_fuga_recibido: { customer_name: string; folio: string; estimated_response: string };
  aviso_corte: { customer_name: string; debt_amount: string; cut_date: string; payment_url: string };
};

/**
 * Build a fully typed WhatsApp template message ready to send.
 *
 * @example
 * const msg = buildTemplateMessage('recibo_listo', '+525551234567', {
 *   customer_name: 'Juan Perez',
 *   total: '385.50',
 *   due_date: '15/03/2026',
 *   payment_url: 'https://pago.cea.gob.mx/r/ABC123',
 * });
 * await whatsapp.sendTemplate(msg);
 */
export function buildTemplateMessage<T extends TemplateName>(
  templateName: T,
  to: string,
  params: TemplateParams[T],
): TemplateMessage {
  const def = TEMPLATES[templateName];

  const components: TemplateComponent[] = def.components.map((comp, index) => {
    const parameters = comp.parameterNames.map((paramName) => ({
      type: 'text' as const,
      text: (params as Record<string, string>)[paramName],
    }));

    return {
      type: comp.type,
      sub_type: comp.sub_type,
      index: comp.type === 'button' ? 0 : undefined,
      parameters,
    };
  });

  return {
    to,
    template: {
      name: def.name,
      language: { code: def.language },
      components,
    },
  };
}
