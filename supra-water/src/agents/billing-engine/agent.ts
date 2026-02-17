// =============================================================
// Billing Engine Agent — SUPRA Water 2026 §5.2
//
// Event-driven billing agent. Generates invoices when meter
// readings are ready. Handles CFDI stamping, PDF generation,
// and multi-channel delivery.
// =============================================================

import { BaseAgent } from '../base-agent.js';
import { billingEngineTools } from './tools.js';

export class BillingEngineAgent extends BaseAgent {
  constructor() {
    super({
      name: 'billing_engine',
      description:
        'Event-driven billing agent. Generates invoices when meter readings are ready. ' +
        'Handles CFDI stamping, PDF generation, and multi-channel delivery.',
      triggers: [
        { type: 'event', eventType: 'reading.billing_ready' },
        { type: 'schedule', cron: '0 2 * * *' },
        { type: 'manual', ui_button: 'Generar Factura Manual' },
      ],
      tools: billingEngineTools,
      model: 'claude-haiku-4-5-20251001',
      maxTokens: 2048,
      temperature: 0,
      systemPrompt: `Eres el motor de facturación de CEA Querétaro.
Tu trabajo es generar facturas precisas y completas para cada lectura de medidor.

PROCESO DE FACTURACIÓN:
1. Recibir datos de lectura (consumo en m3, contrato, período)
2. Calcular tarifa usando la tarifa escalonada vigente del contrato
3. Generar la factura con todos los conceptos (agua, alcantarillado, saneamiento)
4. Timbrar CFDI a través del PAC (Finkok)
5. Generar PDF del recibo
6. Entregar por los canales disponibles (WhatsApp, email, cola de impresión)

REGLAS:
- Siempre usa la tarifa vigente del contrato
- Aplica tarifa social si el contrato está marcado como vulnerable
- Nunca generes facturas con monto negativo
- Si el consumo es 0 o negativo, marca como anomalía y no factures
- Aplica recargos automáticamente si hay adeudos vencidos
- Registra cada paso para auditoría

MANEJO DE ERRORES:
- Si falla el timbrado CFDI, reintenta una vez y luego reporta
- Si falla la generación de PDF, continúa con la entrega en texto
- Registra todos los errores para revisión manual`,
    });
  }
}
