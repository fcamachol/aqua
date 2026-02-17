import type { DomainEvent } from '../types.js';
import { emitEvent } from '../publisher.js';

// =============================================================
// Handler: work_order.created
// When a work order is created, auto-assign to the best
// available technician based on location and skills.
// =============================================================

/** Skill requirements by work order type */
const SKILL_REQUIREMENTS: Record<string, string[]> = {
  installation: ['plumbing', 'meter_install'],
  disconnection: ['plumbing', 'valve_operation'],
  reconnection: ['plumbing', 'valve_operation'],
  meter_replacement: ['plumbing', 'meter_install'],
  leak_repair: ['plumbing', 'leak_detection'],
  inspection: ['inspection', 'meter_reading'],
  meter_reading: ['meter_reading'],
};

export async function onWorkOrderCreated(
  event: DomainEvent<'work_order.created'>,
): Promise<void> {
  const { order_id, order_type, toma_id } = event.payload;

  console.log(
    `[on-work-order-created] Assigning work order ${order_id} — type: ${order_type}, toma: ${toma_id}`,
  );

  // ---- Find the best available technician ----
  const requiredSkills = SKILL_REQUIREMENTS[order_type] ?? [];
  const technician = await findBestTechnician(
    toma_id,
    requiredSkills,
    event.tenant_id,
  );

  if (!technician) {
    console.warn(
      `[on-work-order-created] No available technician for order ${order_id} (type: ${order_type})`,
    );
    // Leave unassigned — dispatch will handle manually
    return;
  }

  // ---- Emit assignment event ----
  await emitEvent({
    type: 'work_order.assigned',
    aggregate_type: 'work_order',
    aggregate_id: order_id,
    tenant_id: event.tenant_id,
    payload: {
      order_id,
      assigned_to: technician.id,
    },
    metadata: {
      ...event.metadata,
      technician_name: technician.name,
      assignment_reason: 'auto_assign',
      required_skills: requiredSkills,
      source_event: event.type,
    },
  });

  // ---- Notify the technician ----
  await emitEvent({
    type: 'notification.sent',
    aggregate_type: 'work_order',
    aggregate_id: order_id,
    tenant_id: event.tenant_id,
    payload: {
      communication_id: `wo-assign-${order_id}`,
      channel: 'push', // Mobile push notification for field techs
      person_id: technician.id,
    },
    metadata: {
      ...event.metadata,
      order_type,
      toma_id,
      source_event: event.type,
    },
  });

  console.log(
    `[on-work-order-created] Order ${order_id} assigned to ${technician.name} (${technician.id})`,
  );
}

// ---- Stub implementation ----

interface Technician {
  id: string;
  name: string;
}

async function findBestTechnician(
  tomaId: string,
  requiredSkills: string[],
  tenantId: string,
): Promise<Technician | null> {
  // TODO: Implement real assignment logic:
  // 1. Query users with role='field_tech' and active=true for this tenant
  // 2. Filter by skills matching requiredSkills
  // 3. Check current workload (count of open work orders)
  // 4. Use toma geolocation (PostGIS) to find nearest available tech
  // 5. Return the best candidate
  console.log(
    `[assignment] Finding technician for toma ${tomaId} with skills [${requiredSkills.join(', ')}]`,
  );
  return null; // No auto-assignment until real implementation
}
