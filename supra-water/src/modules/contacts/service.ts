import { db } from '../../config/database.js';
import { emitEvent } from '../../events/publisher.js';
import type { DomainEvent } from '../../events/types.js';
import { classifyContact } from './ai-classifier.js';
import type {
  CreateContactInput,
  ListContactsInput,
  UpdateContactInput,
  EscalateContactInput,
} from './validators.js';

// =============================================================
// Contacts & Complaints Service
// =============================================================

interface Contact {
  id: string;
  tenant_id: string;
  person_id: string | null;
  contract_id: string | null;
  toma_id: string | null;
  contact_type: string;
  category: string | null;
  subcategory: string | null;
  subject: string;
  description: string;
  channel: string;
  channel_conversation_id: string | null;
  assigned_to: string | null;
  department: string | null;
  priority: string;
  status: string;
  resolution: string | null;
  resolved_at: string | null;
  resolution_satisfaction: number | null;
  ai_classification: unknown | null;
  ai_auto_resolved: boolean;
  sentiment_score: number | null;
  sla_due_at: string | null;
  sla_breached: boolean;
  work_order_ids: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// SLA deadlines by contact type and priority (in hours)
const SLA_HOURS: Record<string, Record<string, number>> = {
  reporte_fuga:  { urgente: 2, alta: 4, normal: 8, baja: 24 },
  queja:         { urgente: 4, alta: 8, normal: 24, baja: 48 },
  reclamo:       { urgente: 4, alta: 8, normal: 24, baja: 48 },
  solicitud:     { urgente: 8, alta: 24, normal: 48, baja: 72 },
  consulta:      { urgente: 4, alta: 8, normal: 24, baja: 48 },
  felicitacion:  { urgente: 48, alta: 48, normal: 72, baja: 72 },
  sugerencia:    { urgente: 24, alta: 48, normal: 72, baja: 72 },
  informacion:   { urgente: 4, alta: 8, normal: 24, baja: 48 },
};

function calculateSlaDueAt(contactType: string, priority: string): string {
  const hours = SLA_HOURS[contactType]?.[priority] ?? 24;
  const due = new Date(Date.now() + hours * 60 * 60 * 1000);
  return due.toISOString();
}

/**
 * Create a new contact/complaint.
 * Runs AI classification and sets SLA deadline.
 */
export async function createContact(
  tenantId: string,
  input: CreateContactInput,
  metadata?: Record<string, unknown>,
): Promise<Contact> {
  // Run AI classification
  let aiClassification = null;
  let category = input.category ?? null;
  let subcategory = input.subcategory ?? null;
  let priority = input.priority;

  try {
    const classification = await classifyContact(input.description, input.contact_type);
    aiClassification = classification;
    // Use AI category/subcategory if not provided by caller
    if (!category) category = classification.category;
    if (!subcategory) subcategory = classification.subcategory;
    // Upgrade priority if AI detects urgency (but never downgrade)
    const priorityRank = { urgente: 0, alta: 1, normal: 2, baja: 3 };
    if (priorityRank[classification.priority] < priorityRank[priority]) {
      priority = classification.priority;
    }
  } catch {
    // AI classification is optional — continue without it
  }

  const slaDueAt = calculateSlaDueAt(input.contact_type, priority);

  const rows = await db.execute({
    sql: `
      INSERT INTO contacts (
        tenant_id, person_id, contract_id, toma_id,
        contact_type, category, subcategory, subject, description,
        channel, channel_conversation_id,
        priority, sla_due_at,
        ai_classification, notes
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8, $9,
        $10, $11,
        $12, $13,
        $14, $15
      )
      RETURNING *
    `,
    args: [
      tenantId,
      input.person_id ?? null,
      input.contract_id ?? null,
      input.toma_id ?? null,
      input.contact_type,
      category,
      subcategory,
      input.subject,
      input.description,
      input.channel,
      input.channel_conversation_id ?? null,
      priority,
      slaDueAt,
      aiClassification ? JSON.stringify(aiClassification) : null,
      input.notes ?? null,
    ],
  });

  const contact = (rows as unknown as Contact[])[0];

  const event: DomainEvent<'contact.created'> = {
    type: 'contact.created',
    aggregate_type: 'contact',
    aggregate_id: contact.id,
    tenant_id: tenantId,
    payload: {
      contact_id: contact.id,
      contact_type: contact.contact_type,
      channel: contact.channel,
    },
    metadata,
  };
  await emitEvent(event);

  return contact;
}

/**
 * List contacts with filtering and pagination.
 */
export async function listContacts(
  tenantId: string,
  input: ListContactsInput,
): Promise<{ data: Contact[]; total: number }> {
  const conditions: string[] = ['c.tenant_id = $1'];
  const args: unknown[] = [tenantId];
  let paramIdx = 2;

  if (input.status) {
    conditions.push(`c.status = $${paramIdx++}`);
    args.push(input.status);
  }
  if (input.contact_type) {
    conditions.push(`c.contact_type = $${paramIdx++}`);
    args.push(input.contact_type);
  }
  if (input.channel) {
    conditions.push(`c.channel = $${paramIdx++}`);
    args.push(input.channel);
  }
  if (input.priority) {
    conditions.push(`c.priority = $${paramIdx++}`);
    args.push(input.priority);
  }
  if (input.person_id) {
    conditions.push(`c.person_id = $${paramIdx++}`);
    args.push(input.person_id);
  }
  if (input.contract_id) {
    conditions.push(`c.contract_id = $${paramIdx++}`);
    args.push(input.contract_id);
  }
  if (input.assigned_to) {
    conditions.push(`c.assigned_to = $${paramIdx++}`);
    args.push(input.assigned_to);
  }
  if (input.sla_breached !== undefined) {
    conditions.push(`c.sla_breached = $${paramIdx++}`);
    args.push(input.sla_breached);
  }
  if (input.from_date) {
    conditions.push(`c.created_at >= $${paramIdx++}`);
    args.push(input.from_date);
  }
  if (input.to_date) {
    conditions.push(`c.created_at <= $${paramIdx++}`);
    args.push(input.to_date);
  }

  const where = conditions.join(' AND ');
  const offset = (input.page - 1) * input.page_size;

  const countRows = await db.execute({
    sql: `SELECT COUNT(*)::int AS total FROM contacts c WHERE ${where}`,
    args,
  });
  const total = (countRows as unknown as Array<{ total: number }>)[0]?.total ?? 0;

  const dataRows = await db.execute({
    sql: `
      SELECT c.* FROM contacts c
      WHERE ${where}
      ORDER BY
        CASE c.priority
          WHEN 'urgente' THEN 1 WHEN 'alta' THEN 2
          WHEN 'normal' THEN 3 WHEN 'baja' THEN 4
        END,
        c.created_at DESC
      LIMIT $${paramIdx++} OFFSET $${paramIdx++}
    `,
    args: [...args, input.page_size, offset],
  });

  return { data: dataRows as unknown as Contact[], total };
}

/**
 * Update/resolve a contact.
 */
export async function updateContact(
  tenantId: string,
  contactId: string,
  input: UpdateContactInput,
  metadata?: Record<string, unknown>,
): Promise<Contact> {
  const sets: string[] = ['updated_at = NOW()'];
  const args: unknown[] = [];
  let paramIdx = 1;

  if (input.status !== undefined) {
    sets.push(`status = $${paramIdx++}`);
    args.push(input.status);
    if (input.status === 'resuelto' || input.status === 'cerrado') {
      sets.push('resolved_at = NOW()');
    }
  }
  if (input.assigned_to !== undefined) {
    sets.push(`assigned_to = $${paramIdx++}`);
    args.push(input.assigned_to);
  }
  if (input.department !== undefined) {
    sets.push(`department = $${paramIdx++}`);
    args.push(input.department);
  }
  if (input.priority !== undefined) {
    sets.push(`priority = $${paramIdx++}`);
    args.push(input.priority);
  }
  if (input.category !== undefined) {
    sets.push(`category = $${paramIdx++}`);
    args.push(input.category);
  }
  if (input.subcategory !== undefined) {
    sets.push(`subcategory = $${paramIdx++}`);
    args.push(input.subcategory);
  }
  if (input.resolution !== undefined) {
    sets.push(`resolution = $${paramIdx++}`);
    args.push(input.resolution);
  }
  if (input.resolution_satisfaction !== undefined) {
    sets.push(`resolution_satisfaction = $${paramIdx++}`);
    args.push(input.resolution_satisfaction);
  }
  if (input.notes !== undefined) {
    sets.push(`notes = $${paramIdx++}`);
    args.push(input.notes);
  }

  const rows = await db.execute({
    sql: `
      UPDATE contacts
      SET ${sets.join(', ')}
      WHERE id = $${paramIdx++} AND tenant_id = $${paramIdx++}
      RETURNING *
    `,
    args: [...args, contactId, tenantId],
  });

  const contact = (rows as unknown as Contact[])[0];
  if (!contact) {
    const err = new Error('Not Found');
    err.name = 'NotFoundError';
    throw err;
  }

  if (input.status === 'resuelto' || input.status === 'cerrado') {
    const event: DomainEvent<'contact.resolved'> = {
      type: 'contact.resolved',
      aggregate_type: 'contact',
      aggregate_id: contactId,
      tenant_id: tenantId,
      payload: {
        contact_id: contactId,
        resolution: input.resolution ?? 'closed',
      },
      metadata,
    };
    await emitEvent(event);
  }

  return contact;
}

/**
 * Escalate a contact to a department.
 */
export async function escalateContact(
  tenantId: string,
  contactId: string,
  input: EscalateContactInput,
  metadata?: Record<string, unknown>,
): Promise<Contact> {
  const rows = await db.execute({
    sql: `
      UPDATE contacts
      SET
        status = 'escalado',
        department = $1,
        assigned_to = $2,
        notes = COALESCE(notes, '') || E'\n[Escalado] ' || $3,
        updated_at = NOW()
      WHERE id = $4 AND tenant_id = $5
      RETURNING *
    `,
    args: [
      input.department,
      input.assigned_to ?? null,
      input.reason,
      contactId,
      tenantId,
    ],
  });

  const contact = (rows as unknown as Contact[])[0];
  if (!contact) {
    const err = new Error('Not Found');
    err.name = 'NotFoundError';
    throw err;
  }

  return contact;
}
