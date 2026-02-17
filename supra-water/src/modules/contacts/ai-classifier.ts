import Anthropic from '@anthropic-ai/sdk';
import { env } from '../../config/env.js';

// =============================================================
// AI Contact Classifier — Claude Haiku stub
// Classifies incoming contacts into category, subcategory, and
// priority. Suggests an action for the agent.
// =============================================================

export interface ClassificationResult {
  category: string;
  subcategory: string;
  priority: 'urgente' | 'alta' | 'normal' | 'baja';
  suggested_action: string;
  confidence: number;
}

const SYSTEM_PROMPT = `You are a contact classification system for a Mexican water utility (organismo operador de agua).
Given a customer contact description, classify it into:

Categories: facturacion, servicio, medidor, calidad_agua, presion, fuga, drenaje, toma, contrato, pago, otro
Subcategories depend on the category, e.g.:
  - facturacion: cobro_excesivo, no_recibio_recibo, error_lectura, ajuste
  - servicio: sin_agua, baja_presion, horario_tandeo, corte_injustificado
  - medidor: falla, cambio, lectura_incorrecta, instalacion
  - calidad_agua: turbia, olor, sabor, contaminacion
  - fuga: via_publica, domicilio, toma, red_principal

Priority rules:
  - urgente: fuga en via publica, contaminacion, sin agua >24h
  - alta: fuga en domicilio, sin agua <24h, corte injustificado
  - normal: quejas de facturacion, solicitudes de cambio
  - baja: consultas, sugerencias, felicitaciones

Respond ONLY with valid JSON:
{"category":"...","subcategory":"...","priority":"...","suggested_action":"...","confidence":0.95}`;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required for AI classification');
    }
    client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return client;
}

/**
 * Classify a contact description using Claude Haiku.
 * Falls back to rule-based classification if API is unavailable.
 */
export async function classifyContact(
  description: string,
  contactType: string,
): Promise<ClassificationResult> {
  try {
    const anthropic = getClient();

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Contact type: ${contactType}\nDescription: ${description}`,
        },
      ],
    });

    const text =
      message.content[0].type === 'text' ? message.content[0].text : '';
    const result = JSON.parse(text) as ClassificationResult;

    // Validate confidence is in range
    result.confidence = Math.max(0, Math.min(1, result.confidence));

    return result;
  } catch {
    // Fallback to rule-based classification
    return ruleBasedClassification(description, contactType);
  }
}

/**
 * Simple rule-based fallback when AI is unavailable.
 */
function ruleBasedClassification(
  description: string,
  contactType: string,
): ClassificationResult {
  const lower = description.toLowerCase();

  // Keyword-based category detection
  if (lower.includes('fuga') || lower.includes('leak')) {
    const isPublic =
      lower.includes('calle') ||
      lower.includes('via publica') ||
      lower.includes('banqueta');
    return {
      category: 'fuga',
      subcategory: isPublic ? 'via_publica' : 'domicilio',
      priority: isPublic ? 'urgente' : 'alta',
      suggested_action: isPublic
        ? 'Crear orden de reparacion urgente'
        : 'Programar inspeccion',
      confidence: 0.6,
    };
  }

  if (lower.includes('sin agua') || lower.includes('no hay agua') || lower.includes('no llega agua')) {
    return {
      category: 'servicio',
      subcategory: 'sin_agua',
      priority: 'alta',
      suggested_action: 'Verificar zona de tandeo y crear orden si aplica',
      confidence: 0.6,
    };
  }

  if (lower.includes('factura') || lower.includes('recibo') || lower.includes('cobro')) {
    return {
      category: 'facturacion',
      subcategory: lower.includes('excesivo') || lower.includes('alto')
        ? 'cobro_excesivo'
        : 'ajuste',
      priority: 'normal',
      suggested_action: 'Revisar historial de consumo y lecturas',
      confidence: 0.5,
    };
  }

  if (lower.includes('medidor') || lower.includes('metro')) {
    return {
      category: 'medidor',
      subcategory: lower.includes('cambio') || lower.includes('reemplaz')
        ? 'cambio'
        : 'falla',
      priority: 'normal',
      suggested_action: 'Programar inspeccion de medidor',
      confidence: 0.5,
    };
  }

  // Default
  const priorityMap: Record<string, ClassificationResult['priority']> = {
    queja: 'normal',
    reclamo: 'alta',
    reporte_fuga: 'urgente',
    solicitud: 'normal',
    consulta: 'baja',
    felicitacion: 'baja',
    sugerencia: 'baja',
    informacion: 'baja',
  };

  return {
    category: 'otro',
    subcategory: contactType,
    priority: priorityMap[contactType] ?? 'normal',
    suggested_action: 'Revisar y asignar a departamento correspondiente',
    confidence: 0.3,
  };
}
