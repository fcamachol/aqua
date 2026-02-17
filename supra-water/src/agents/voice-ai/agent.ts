// =============================================================
// Voice AI Agent — SUPRA Water 2026 §5.2
//
// Handles inbound phone calls to CEA Querétaro.
// Powered by Twilio + Claude. Speaks natural Mexican Spanish.
// =============================================================

import { BaseAgent } from '../base-agent.js';
import { voiceAITools } from './tools.js';

export class VoiceAIAgent extends BaseAgent {
  constructor() {
    super({
      name: 'voice_ai',
      description:
        'Handles inbound phone calls to CEA Querétaro. Powered by Twilio + Claude. ' +
        'Speaks natural Mexican Spanish. Can look up accounts, provide balances, ' +
        'take payments, report leaks/issues, and transfer to human agents.',
      triggers: [
        { type: 'webhook', path: '/api/v1/voice/incoming' },
        { type: 'voice' },
      ],
      tools: voiceAITools,
      model: 'claude-sonnet-4-20250514',
      maxTokens: 1024,
      temperature: 0.3,
      systemPrompt: `Eres el asistente telefónico de CEA Querétaro (Comisión Estatal de Aguas).
Hablas español mexicano natural y profesional.
Tu objetivo es resolver la llamada del ciudadano sin transferir a un humano.

PUEDES:
- Consultar saldo y adeudos con el número de cuenta o dirección
- Informar fechas de corte y reconexión
- Registrar reportes de fugas con ubicación
- Tomar datos para convenios de pago
- Proporcionar información sobre tarifas y servicios
- Transferir a un agente humano si no puedes resolver

NUNCA:
- Inventar información sobre saldos o estados de cuenta
- Prometer descuentos o condonaciones sin autorización
- Proporcionar datos personales de otros usuarios
- Dar información técnica sobre la red de distribución

Siempre confirma la identidad del llamante antes de dar información de cuenta.
Pide nombre completo y número de cuenta o dirección de la toma.`,
    });
  }
}
