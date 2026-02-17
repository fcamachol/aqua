---
name: new-ai-agent
description: Create a new SUPRA Water AI agent with system prompt, tool definitions, n8n workflow, and conversation tests
---

# New AI Agent

Create a new AI agent for the SUPRA Water 2026 platform. Agents are Claude-powered assistants that handle specific domains of the Mexican water utility operation.

## Step 1: Gather Requirements

Ask the user:
- Agent name — must be one of the 8 standard agents or a new specialized sub-agent:
  - `voice_ai` — Phone IVR and voice interactions (ElevenLabs)
  - `whatsapp_cx` — WhatsApp customer service
  - `billing_engine` — Invoice generation, payment processing
  - `anomaly_detection` — Consumption anomalies, leak detection
  - `collections_intelligence` — Debt collection strategy, payment plans
  - `field_workforce` — Work order management, technician dispatch
  - `fraud_detection` — Meter tampering, illegal connections
  - `regulatory_compliance` — CONAGUA reporting, NOM compliance
- Purpose — what specific problems does this agent solve?
- Trigger type — how is the agent activated?
  - `webhook` — HTTP request from external system
  - `whatsapp` — Incoming WhatsApp message via Twilio/360dialog
  - `voice` — Incoming phone call via Twilio + ElevenLabs
  - `event` — Domain event from the event bus (BullMQ)
  - `schedule` — Cron-based periodic execution
- Model selection:
  - `claude-sonnet-4-20250514` — Complex reasoning, multi-step workflows, report generation
  - `claude-haiku-3-20250414` — Classification, routing, simple Q&A, high-volume

## Step 2: Create the Agent Files

### `src/agents/{name}/system-prompt.md`

Write the system prompt in Mexican Spanish following these conventions:

```markdown
# {Agent Display Name}

Eres {agent_name}, un asistente de inteligencia artificial de SUPRA Water,
el sistema de gestion de agua de {tenant_name}.

## Tu Rol

{Describe the agent's role and responsibilities clearly}

## PUEDES

- {List specific capabilities the agent has}
- {Each capability should be concrete and actionable}
- Consultar saldos y estados de cuenta
- Registrar reportes de fuga o falta de agua
- Generar ordenes de trabajo

## NUNCA

- {List things the agent must NEVER do}
- Compartir informacion de un usuario con otro usuario
- Modificar saldos o facturas directamente
- Dar informacion personal sin verificacion de identidad
- Prometer descuentos o condonaciones no autorizados
- Inventar informacion que no tienes disponible

## Verificacion de Identidad

Antes de proporcionar CUALQUIER informacion de cuenta, DEBES verificar la identidad:

1. Solicitar numero de cuenta (cuenta_contrato) O numero de toma
2. Solicitar nombre del titular
3. Verificar que coincidan en el sistema usando la herramienta `verificar_identidad`
4. Si no coinciden, pedir que acudan a oficinas con identificacion oficial

## Formato de Respuestas

- Usa un tono profesional pero amigable
- Tutea al usuario (usa "tu" en lugar de "usted") a menos que el usuario use "usted"
- Usa pesos mexicanos (MXN) con formato $1,234.56
- Fechas en formato dd/mm/yyyy
- Siempre confirma las acciones antes de ejecutarlas

## Escalacion

Escala a un agente humano cuando:
- El usuario lo solicita explicitamente
- No puedes resolver el problema despues de 3 intentos
- Se detecta una situacion de emergencia (fuga mayor, contaminacion)
- El usuario muestra frustracion extrema
- Se requiere una decision que excede tu autoridad
```

### `src/agents/{name}/tools.ts`

```typescript
import { z } from 'zod';

// Tool definition interface
interface AgentTool {
  name: string;
  description: string;
  parameters: z.ZodSchema;
  execute: (params: unknown, context: AgentContext) => Promise<unknown>;
}

interface AgentContext {
  tenantId: string;
  userId?: string;
  conversationId: string;
  channel: 'whatsapp' | 'voice' | 'web' | 'api';
}

// Tool: Verify customer identity
export const verificarIdentidad: AgentTool = {
  name: 'verificar_identidad',
  description: 'Verifica la identidad de un usuario buscando su cuenta y nombre en el sistema',
  parameters: z.object({
    cuenta_contrato: z.string().optional().describe('Numero de cuenta o contrato del usuario'),
    numero_toma: z.string().optional().describe('Numero de toma de agua'),
    nombre_titular: z.string().describe('Nombre del titular de la cuenta'),
  }),
  execute: async (params, context) => {
    // Implementation: Query the padron_usuarios table
    // Return: { verified: boolean, account_data?: {...} }
    throw new Error('Not implemented');
  },
};

// Tool: Query account balance
export const consultarSaldo: AgentTool = {
  name: 'consultar_saldo',
  description: 'Consulta el saldo actual y adeudos de una cuenta',
  parameters: z.object({
    cuenta_contrato: z.string().describe('Numero de cuenta del usuario verificado'),
  }),
  execute: async (params, context) => {
    // Implementation: Query facturas and adeudos tables
    // Return: { saldo_actual, adeudo_total, facturas_pendientes[] }
    throw new Error('Not implemented');
  },
};

// Add more domain-specific tools below:
// - consultar_historial_consumo
// - registrar_reporte
// - generar_orden_trabajo
// - consultar_estado_orden
// - solicitar_convenio_pago

// Export all tools as an array
export const tools: AgentTool[] = [
  verificarIdentidad,
  consultarSaldo,
  // Add all tools here
];
```

### `src/agents/{name}/config.ts`

```typescript
import { z } from 'zod';

export const agentConfigSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  description: z.string(),
  model: z.enum([
    'claude-sonnet-4-20250514',
    'claude-haiku-3-20250414',
  ]),
  temperature: z.number().min(0).max(1).default(0.3),
  maxTokens: z.number().default(4096),
  triggers: z.array(z.object({
    type: z.enum(['webhook', 'whatsapp', 'voice', 'event', 'schedule']),
    config: z.record(z.unknown()),
  })),
  escalation: z.object({
    maxAttempts: z.number().default(3),
    escalateTo: z.enum(['human_agent', 'supervisor', 'manager']).default('human_agent'),
    emergencyKeywords: z.array(z.string()),
  }),
  rateLimit: z.object({
    maxConversationsPerMinute: z.number().default(100),
    maxTokensPerConversation: z.number().default(50000),
  }),
});

export const agentConfig = agentConfigSchema.parse({
  name: '{name}',
  displayName: '{Agent Display Name}',
  description: '{Agent purpose description}',
  model: 'claude-sonnet-4-20250514', // or claude-haiku-3-20250414 for high-volume
  temperature: 0.3,
  maxTokens: 4096,
  triggers: [
    {
      type: '{trigger_type}',
      config: {
        // Trigger-specific configuration
      },
    },
  ],
  escalation: {
    maxAttempts: 3,
    escalateTo: 'human_agent',
    emergencyKeywords: [
      'fuga', 'inundacion', 'contaminacion', 'emergencia',
      'peligro', 'urgente', 'demanda', 'abogado',
    ],
  },
  rateLimit: {
    maxConversationsPerMinute: 100,
    maxTokensPerConversation: 50000,
  },
});

export type AgentConfig = z.infer<typeof agentConfigSchema>;
```

### `src/agents/{name}/workflow.json`

Create an n8n workflow definition:

```json
{
  "name": "SUPRA - {Agent Display Name}",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "/agents/{name}/invoke",
        "responseMode": "responseNode"
      },
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "model": "claude-sonnet-4-20250514",
        "systemPrompt": "={{ $json.system_prompt }}",
        "messages": "={{ $json.messages }}",
        "tools": "={{ $json.tools }}",
        "temperature": 0.3,
        "maxTokens": 4096
      },
      "name": "Claude Agent",
      "type": "n8n-nodes-base.anthropic",
      "position": [500, 300]
    },
    {
      "parameters": {
        "functionCode": "// Process tool calls and route to appropriate handlers\nconst toolCalls = $input.item.json.tool_calls;\nfor (const call of toolCalls) {\n  // Execute tool and return result\n}\nreturn items;"
      },
      "name": "Tool Router",
      "type": "n8n-nodes-base.function",
      "position": [750, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json.response }}"
      },
      "name": "Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [1000, 300]
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [
        [{ "node": "Claude Agent", "type": "main", "index": 0 }]
      ]
    },
    "Claude Agent": {
      "main": [
        [{ "node": "Tool Router", "type": "main", "index": 0 }]
      ]
    },
    "Tool Router": {
      "main": [
        [{ "node": "Response", "type": "main", "index": 0 }]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  },
  "tags": ["supra", "ai-agent", "{domain}"]
}
```

### `src/agents/{name}/tests/conversations.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { AgentTestHarness } from '../../test/agent-harness';
import { agentConfig } from '../config';
import { tools } from '../tools';

describe('{Agent Display Name} - Conversation Tests', () => {
  const harness = new AgentTestHarness(agentConfig, tools);

  describe('Happy Path', () => {
    it('should handle a standard customer inquiry', async () => {
      const result = await harness.runConversation([
        { role: 'user', content: 'Hola, quiero consultar mi saldo' },
        // Agent should ask for account number
        { role: 'user', content: 'Mi cuenta es 12345678' },
        // Agent should ask for name verification
        { role: 'user', content: 'Juan Perez Garcia' },
        // Agent should verify identity and return balance
      ]);

      expect(result.toolCalls).toContainEqual(
        expect.objectContaining({ name: 'verificar_identidad' })
      );
      expect(result.toolCalls).toContainEqual(
        expect.objectContaining({ name: 'consultar_saldo' })
      );
      expect(result.finalResponse).toContain('$');
    });
  });

  describe('Identity Verification', () => {
    it('should require identity verification before sharing account info', async () => {
      const result = await harness.runConversation([
        { role: 'user', content: 'Dame el saldo de la cuenta 12345678' },
      ]);

      // Agent should NOT call consultar_saldo without verification
      expect(result.toolCalls.find(t => t.name === 'consultar_saldo')).toBeUndefined();
      // Agent should ask for name verification
      expect(result.finalResponse).toMatch(/nombre|titular|verificar/i);
    });

    it('should deny access when identity does not match', async () => {
      const result = await harness.runConversation([
        { role: 'user', content: 'Quiero ver mi saldo, cuenta 12345678' },
        { role: 'user', content: 'Pedro Lopez Martinez' },
        // Mock verificar_identidad returns { verified: false }
      ]);

      expect(result.finalResponse).toMatch(/no coincide|oficinas|identificacion/i);
    });
  });

  describe('Escalation', () => {
    it('should escalate when user requests a human agent', async () => {
      const result = await harness.runConversation([
        { role: 'user', content: 'Quiero hablar con un humano' },
      ]);

      expect(result.escalated).toBe(true);
    });

    it('should escalate on emergency keywords', async () => {
      const result = await harness.runConversation([
        { role: 'user', content: 'Hay una fuga enorme de agua en mi calle, es una emergencia!' },
      ]);

      expect(result.escalated).toBe(true);
      expect(result.escalationReason).toMatch(/emergencia|fuga/i);
    });

    it('should escalate after max failed attempts', async () => {
      const result = await harness.runConversation([
        { role: 'user', content: 'No funciona mi medidor' },
        { role: 'user', content: 'Ya te dije que no funciona' },
        { role: 'user', content: 'Sigue sin funcionar, no me ayudas' },
      ]);

      // After 3 failed resolution attempts
      expect(result.escalated).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle messages in Spanglish gracefully', async () => {
      const result = await harness.runConversation([
        { role: 'user', content: 'Hey, necesito check mi balance de agua please' },
      ]);

      expect(result.finalResponse).toBeDefined();
      // Should respond in Spanish
    });

    it('should handle empty or very short messages', async () => {
      const result = await harness.runConversation([
        { role: 'user', content: 'hola' },
      ]);

      expect(result.finalResponse).toBeDefined();
      expect(result.finalResponse.length).toBeGreaterThan(10);
    });

    it('should refuse out-of-scope requests', async () => {
      const result = await harness.runConversation([
        { role: 'user', content: 'Puedes ayudarme con mi tarea de matematicas?' },
      ]);

      expect(result.finalResponse).toMatch(/agua|servicio|SUPRA/i);
    });
  });
});
```

## Step 3: Verify and Remind

After generating all files:

1. Replace all `{name}` and `{Agent Display Name}` placeholders
2. Implement the tool `execute` functions with real database queries
3. Add domain-specific tools relevant to the agent's purpose
4. Review the system prompt with a native Mexican Spanish speaker
5. Import the n8n workflow JSON into the n8n instance
6. Run conversation tests: `npx vitest run src/agents/{name}/tests/`
7. Test with real WhatsApp/voice interactions in staging
8. Monitor conversation logs for unexpected escalations or failures

## Agent Architecture Notes

- All agents share a common conversation storage in PostgreSQL (table: `conversations`)
- Tool calls are logged for audit and debugging (table: `agent_tool_calls`)
- Each conversation is scoped to a `tenant_id` and `channel`
- Agents can invoke other agents via the event bus for cross-domain tasks
- Rate limiting is enforced at the gateway level per tenant
