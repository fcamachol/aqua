// =============================================================
// Collections Intelligence Agent — SUPRA Water 2026 §5.2
//
// Predicts which accounts will become delinquent.
// Selects optimal collection strategy per account.
// Automates reminder sequences via preferred channel.
// =============================================================

import { BaseAgent } from '../base-agent.js';
import type { AgentTool } from '../../types/agents.js';
import { db } from '../../config/database.js';
import { calculateScore, type ScoringFeatures } from './scoring-model.js';
import { getNextStep, getPendingSteps, COLLECTION_SEQUENCES } from './sequences.js';

const collectionsTools: AgentTool[] = [
  {
    name: 'get_delinquent_accounts',
    description: 'Obtener cuentas con facturas vencidas para análisis de cobranza.',
    parameters: [
      { name: 'min_days_past_due', type: 'number', description: 'Mínimo de días vencidos', required: false },
      { name: 'limit', type: 'number', description: 'Máximo de cuentas a retornar', required: false },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `SELECT c.id as contract_id, c.contract_number, p.first_name, p.last_name,
                     SUM(i.total) as total_debt,
                     COUNT(i.id) as unpaid_count,
                     MIN(i.due_date) as oldest_due_date,
                     EXTRACT(DAY FROM NOW() - MIN(i.due_date)) as days_past_due
              FROM invoices i
              JOIN contracts c ON i.contract_id = c.id
              JOIN persons p ON c.person_id = p.id
              WHERE i.tenant_id = $1 AND i.status = 'past_due'
                AND EXTRACT(DAY FROM NOW() - i.due_date) >= $2
              GROUP BY c.id, c.contract_number, p.first_name, p.last_name
              ORDER BY total_debt DESC
              LIMIT $3`,
        args: [context.tenantId, params.min_days_past_due ?? 1, params.limit ?? 100],
      });
      return { success: true, data: rows };
    },
  },

  {
    name: 'get_scoring_features',
    description: 'Obtener features de scoring para un contrato específico.',
    parameters: [
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: true },
    ],
    async execute(params, context) {
      // Payment history
      const payHistory = await db.execute({
        sql: `SELECT COUNT(*) FILTER (WHERE p.payment_date <= i.due_date) as on_time,
                     COUNT(*) as total
              FROM invoices i
              LEFT JOIN payments p ON p.invoice_id = i.id
              WHERE i.contract_id = $1 AND i.tenant_id = $2
                AND i.created_at >= NOW() - INTERVAL '12 months'`,
        args: [params.contract_id, context.tenantId],
      });

      // Account info
      const acctInfo = await db.execute({
        sql: `SELECT c.created_at, t.toma_type, c.vulnerability_flag,
                     (SELECT COUNT(*) FROM payment_plans pp WHERE pp.contract_id = c.id) as payment_plans
              FROM contracts c
              JOIN tomas t ON c.toma_id = t.id
              WHERE c.id = $1 AND c.tenant_id = $2`,
        args: [params.contract_id, context.tenantId],
      });

      // Debt info
      const debtInfo = await db.execute({
        sql: `SELECT SUM(total) as total_debt, COUNT(*) as unpaid_count,
                     EXTRACT(DAY FROM NOW() - MIN(due_date)) as days_past_due
              FROM invoices
              WHERE contract_id = $1 AND tenant_id = $2 AND status = 'past_due'`,
        args: [params.contract_id, context.tenantId],
      });

      // Sector delinquency rate
      const sectorRate = await db.execute({
        sql: `SELECT
                COUNT(*) FILTER (WHERE i.status = 'past_due')::float / GREATEST(COUNT(*), 1) as rate
              FROM invoices i
              JOIN contracts c2 ON i.contract_id = c2.id
              JOIN tomas t2 ON c2.toma_id = t2.id
              WHERE t2.sector = (SELECT t.sector FROM contracts c JOIN tomas t ON c.toma_id = t.id WHERE c.id = $1)
                AND i.tenant_id = $2
                AND i.created_at >= NOW() - INTERVAL '3 months'`,
        args: [params.contract_id, context.tenantId],
      });

      const onTime = Number((payHistory[0] as any)?.on_time ?? 0);
      const total = Number((payHistory[0] as any)?.total ?? 1);
      const acct = acctInfo[0] as any;
      const debt = debtInfo[0] as any;

      const features: ScoringFeatures = {
        payment_history_last_12_months: total > 0 ? onTime / total : 0.5,
        days_past_due: Number(debt?.days_past_due ?? 0),
        total_debt_amount: Number(debt?.total_debt ?? 0),
        number_of_unpaid_invoices: Number(debt?.unpaid_count ?? 0),
        account_age_years: acct?.created_at
          ? (Date.now() - new Date(acct.created_at).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
          : 1,
        toma_type: acct?.toma_type ?? 'domestica',
        previous_payment_plans: Number(acct?.payment_plans ?? 0),
        vulnerability_flag: acct?.vulnerability_flag ?? false,
        sector_delinquency_rate: Number((sectorRate[0] as any)?.rate ?? 0.1),
      };

      return { success: true, data: features };
    },
  },

  {
    name: 'score_account',
    description: 'Calcular probabilidad de pago y clasificar en tier de riesgo.',
    parameters: [
      { name: 'features', type: 'object', description: 'Features de scoring', required: true },
    ],
    async execute(params, _context) {
      const result = calculateScore(params.features as unknown as ScoringFeatures);
      return { success: true, data: result };
    },
  },

  {
    name: 'get_collection_sequence',
    description: 'Obtener la secuencia de cobranza para un tier de riesgo.',
    parameters: [
      { name: 'risk_tier', type: 'string', description: 'Tier de riesgo', required: true, enum: ['low_risk', 'medium_risk', 'high_risk', 'vulnerable'] },
    ],
    async execute(params, _context) {
      const tier = params.risk_tier as keyof typeof COLLECTION_SEQUENCES;
      return { success: true, data: COLLECTION_SEQUENCES[tier] };
    },
  },

  {
    name: 'get_next_collection_action',
    description: 'Obtener la siguiente acción de cobranza pendiente para un contrato.',
    parameters: [
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: true },
      { name: 'risk_tier', type: 'string', description: 'Tier de riesgo', required: true },
    ],
    async execute(params, context) {
      // Get the delinquency procedure
      const proc = await db.execute({
        sql: `SELECT id, started_at, completed_actions
              FROM delinquency_procedures
              WHERE contract_id = $1 AND tenant_id = $2 AND status = 'active'
              ORDER BY started_at DESC LIMIT 1`,
        args: [params.contract_id, context.tenantId],
      });

      if (proc.length === 0) {
        return { success: true, data: { action: 'start_procedure', message: 'No hay procedimiento activo' } };
      }

      const procedure = proc[0] as any;
      const daysSinceStart = Math.floor(
        (Date.now() - new Date(procedure.started_at).getTime()) / (24 * 60 * 60 * 1000),
      );
      const completed = procedure.completed_actions ?? [];

      const pending = getPendingSteps(
        params.risk_tier as any,
        daysSinceStart,
        completed,
      );

      return { success: true, data: { pending_steps: pending, days_since_start: daysSinceStart } };
    },
  },

  {
    name: 'execute_collection_action',
    description: 'Ejecutar una acción de cobranza (enviar SMS, WhatsApp, programar llamada, etc.).',
    parameters: [
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: true },
      { name: 'action', type: 'string', description: 'Acción a ejecutar', required: true },
      { name: 'channel', type: 'string', description: 'Canal de comunicación', required: true },
      { name: 'template', type: 'string', description: 'Plantilla a usar', required: false },
    ],
    async execute(params, context) {
      // Record the action execution
      await db.execute({
        sql: `UPDATE delinquency_procedures
              SET completed_actions = array_append(COALESCE(completed_actions, '{}'), $1),
                  updated_at = NOW()
              WHERE contract_id = $2 AND tenant_id = $3 AND status = 'active'`,
        args: [params.action, params.contract_id, context.tenantId],
      });

      // In production, this would dispatch to the appropriate channel
      return {
        success: true,
        data: {
          action: params.action,
          channel: params.channel,
          status: 'dispatched',
          contract_id: params.contract_id,
        },
      };
    },
  },

  {
    name: 'start_delinquency_procedure',
    description: 'Iniciar un procedimiento de cobranza para un contrato.',
    parameters: [
      { name: 'contract_id', type: 'string', description: 'ID del contrato', required: true },
      { name: 'risk_tier', type: 'string', description: 'Tier de riesgo', required: true },
      { name: 'total_debt', type: 'number', description: 'Deuda total', required: true },
    ],
    async execute(params, context) {
      const rows = await db.execute({
        sql: `INSERT INTO delinquency_procedures (tenant_id, contract_id, risk_tier, total_debt, status, started_at)
              VALUES ($1, $2, $3, $4, 'active', NOW())
              ON CONFLICT (tenant_id, contract_id)
                WHERE status = 'active'
                DO UPDATE SET risk_tier = $3, total_debt = $4, updated_at = NOW()
              RETURNING id`,
        args: [context.tenantId, params.contract_id, params.risk_tier, params.total_debt],
      });
      return { success: true, data: { procedure_id: rows[0]?.id } };
    },
  },
];

export class CollectionsAgent extends BaseAgent {
  constructor() {
    super({
      name: 'collections_intelligence',
      description:
        'Predicts which accounts will become delinquent. Selects optimal collection ' +
        'strategy per account. Automates reminder sequences via preferred channel.',
      triggers: [
        { type: 'event', eventType: 'invoice.past_due' },
        { type: 'schedule', cron: '0 8 * * 1-5' },
      ],
      tools: collectionsTools,
      model: 'claude-sonnet-4-20250514',
      maxTokens: 2048,
      temperature: 0.1,
      systemPrompt: `Eres el agente de cobranza inteligente de CEA Querétaro.
Tu objetivo es maximizar la recuperación de cartera vencida con el mínimo impacto en la relación con el ciudadano.

PROCESO:
1. Identificar cuentas con adeudo vencido
2. Para cada cuenta, obtener features de scoring
3. Calcular probabilidad de pago y clasificar en tier de riesgo
4. Determinar la siguiente acción de cobranza según la secuencia del tier
5. Ejecutar la acción correspondiente

TIERS DE RIESGO:
- low_risk (score > 0.7): Recordatorios suaves → SMS, WhatsApp, email
- medium_risk (0.3-0.7): Seguimiento persistente → WhatsApp, llamada AI, carta, corte
- high_risk (< 0.3): Cobranza agresiva → Llamada, carta, corte rápido
- vulnerable: Manejo sensible → Tarifa social, agente humano, visita domiciliaria

REGLAS CRÍTICAS:
- NUNCA programar corte automático para cuentas vulnerables
- Respetar la secuencia de días entre acciones
- No ejecutar la misma acción dos veces
- Registrar cada acción para auditoría
- Si la cuenta paga durante la secuencia, detener automáticamente`,
    });
  }
}
