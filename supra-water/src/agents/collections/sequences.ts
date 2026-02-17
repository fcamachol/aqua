// =============================================================
// Collection Sequences — SUPRA Water 2026 §5.2
//
// Timed action steps per risk tier.
// =============================================================

import type { RiskTier } from './scoring-model.js';

export interface CollectionStep {
  day: number;
  action: string;
  channel: 'sms' | 'whatsapp' | 'phone_ai' | 'phone_human' | 'email' | 'letter' | 'in_person' | 'system';
  description: string;
  template?: string;
}

export const COLLECTION_SEQUENCES: Record<RiskTier, CollectionStep[]> = {
  // Score > 0.7 — likely to pay with gentle reminders
  low_risk: [
    {
      day: 1,
      action: 'sms_reminder',
      channel: 'sms',
      description: 'SMS recordatorio de pago pendiente',
      template: 'sms_payment_reminder',
    },
    {
      day: 5,
      action: 'whatsapp_reminder_with_payment_link',
      channel: 'whatsapp',
      description: 'WhatsApp con enlace de pago directo',
      template: 'wa_payment_link',
    },
    {
      day: 15,
      action: 'email_formal_notice',
      channel: 'email',
      description: 'Correo formal de aviso de adeudo',
      template: 'email_formal_notice',
    },
  ],

  // Score 0.3-0.7 — needs more persistent follow-up
  medium_risk: [
    {
      day: 1,
      action: 'whatsapp_reminder_with_payment_link',
      channel: 'whatsapp',
      description: 'WhatsApp con enlace de pago',
      template: 'wa_payment_link',
    },
    {
      day: 3,
      action: 'phone_call_ai',
      channel: 'phone_ai',
      description: 'Llamada automatizada con Voice AI',
      template: 'voice_collection_reminder',
    },
    {
      day: 7,
      action: 'whatsapp_warning_corte',
      channel: 'whatsapp',
      description: 'WhatsApp con aviso de posible corte de servicio',
      template: 'wa_corte_warning',
    },
    {
      day: 14,
      action: 'formal_letter',
      channel: 'letter',
      description: 'Carta formal de requerimiento de pago',
      template: 'letter_formal_demand',
    },
    {
      day: 21,
      action: 'schedule_corte_order',
      channel: 'system',
      description: 'Programar orden de corte de servicio',
    },
  ],

  // Score < 0.3 — aggressive collection needed
  high_risk: [
    {
      day: 1,
      action: 'phone_call_ai',
      channel: 'phone_ai',
      description: 'Llamada automatizada inmediata',
      template: 'voice_collection_urgent',
    },
    {
      day: 3,
      action: 'whatsapp_warning_corte',
      channel: 'whatsapp',
      description: 'WhatsApp con aviso de corte inminente',
      template: 'wa_corte_warning',
    },
    {
      day: 7,
      action: 'formal_letter',
      channel: 'letter',
      description: 'Carta formal de requerimiento urgente',
      template: 'letter_urgent_demand',
    },
    {
      day: 10,
      action: 'schedule_corte_order',
      channel: 'system',
      description: 'Programar orden de corte de servicio',
    },
  ],

  // vulnerability_flag = true — sensitive handling, NEVER auto-corte
  vulnerable: [
    {
      day: 1,
      action: 'whatsapp_social_tariff_offer',
      channel: 'whatsapp',
      description: 'WhatsApp ofreciendo tarifa social y opciones de pago',
      template: 'wa_social_tariff_offer',
    },
    {
      day: 7,
      action: 'phone_call_human_agent',
      channel: 'phone_human',
      description: 'Llamada de agente humano para ofrecer convenio',
    },
    {
      day: 14,
      action: 'in_person_visit',
      channel: 'in_person',
      description: 'Visita domiciliaria para evaluación social',
    },
    // NEVER auto-schedule corte for vulnerable accounts
  ],
};

/**
 * Get the next pending step in a collection sequence.
 */
export function getNextStep(
  riskTier: RiskTier,
  daysSinceStart: number,
  completedActions: string[],
): CollectionStep | null {
  const sequence = COLLECTION_SEQUENCES[riskTier];

  for (const step of sequence) {
    if (daysSinceStart >= step.day && !completedActions.includes(step.action)) {
      return step;
    }
  }

  return null;
}

/**
 * Get all pending steps that should have been executed by now.
 */
export function getPendingSteps(
  riskTier: RiskTier,
  daysSinceStart: number,
  completedActions: string[],
): CollectionStep[] {
  const sequence = COLLECTION_SEQUENCES[riskTier];
  return sequence.filter(
    (step) => daysSinceStart >= step.day && !completedActions.includes(step.action),
  );
}
