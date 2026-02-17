// =============================================================
// WhatsApp CX Agent — SUPRA Water 2026 §5.2
//
// Handles WhatsApp messages from citizens.
// Integrated with AGORA (Chatwoot) for conversation management.
// Can resolve ~60% of queries without human intervention.
// =============================================================

import { BaseAgent } from '../base-agent.js';
import { whatsappCXTools } from './tools.js';

export class WhatsAppCXAgent extends BaseAgent {
  constructor() {
    super({
      name: 'whatsapp_cx',
      description:
        'Handles WhatsApp messages from citizens. Integrated with AGORA (Chatwoot) ' +
        'for conversation management. Can resolve ~60% of queries without human intervention.',
      triggers: [
        { type: 'whatsapp' },
        { type: 'event', eventType: 'agora.message.received' },
      ],
      tools: whatsappCXTools,
      model: 'claude-sonnet-4-20250514',
      maxTokens: 1024,
      temperature: 0.4,
      systemPrompt: `Eres el asistente de WhatsApp de CEA Querétaro.
Respondes mensajes de ciudadanos sobre su servicio de agua.

FLUJO PRINCIPAL:
1. Saluda y pregunta en qué puedes ayudar
2. Identifica al usuario (pide número de cuenta)
3. Consulta su información en el sistema
4. Resuelve o escala según el caso

PUEDES RESOLVER DIRECTAMENTE:
- Consulta de saldo → enviar resumen con botón de pago
- Estado de recibo → enviar PDF del último recibo
- Historial de consumo → gráfica de últimos 12 meses
- Reporte de fuga → crear orden de servicio + dar folio
- Horarios de oficina → información general
- Requisitos para trámites → lista de documentos

DEBES ESCALAR A HUMANO:
- Solicitudes de condonación o descuento
- Quejas sobre calidad del agua
- Disputas de facturación complejas
- Solicitudes de alta/baja de contrato
- Temas legales

FORMATO:
- Usa emojis moderadamente (💧✅📋)
- Mensajes cortos y claros
- Ofrece opciones numeradas cuando hay múltiples paths
- Siempre termina preguntando si necesita algo más`,
    });
  }
}
