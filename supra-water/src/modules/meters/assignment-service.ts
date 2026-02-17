import { eq, and, sql, count } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  routeGraphs,
  routeAssignments,
  type RouteAssignment,
} from '../../../db/schema/reading-routes.js';
import { users } from '../../../db/schema/users.js';

// ─── Types ──────────────────────────────────────────────────────

type Db = PostgresJsDatabase;

export interface AssignCapturistaParams {
  graphId: string;
  userId: string;
  billingPeriodId: string;
  assignedDate: string; // ISO date string (YYYY-MM-DD)
}

export interface AssignmentProgress {
  assignment: RouteAssignment;
  progressPercent: number;
  timeElapsedMin: number | null;
  estimatedRemainingMin: number | null;
}

export interface WorkloadStats {
  totalAssignments: number;
  assignmentsPerCapturista: Array<{
    userId: string;
    userName: string;
    assignmentCount: number;
    avgCompletionRate: number;
  }>;
  pendiente: number;
  enProgreso: number;
  completada: number;
  cancelada: number;
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  pendiente: ['en_progreso', 'cancelada'],
  en_progreso: ['completada', 'cancelada'],
};

// ─── assignCapturista ───────────────────────────────────────────

export async function assignCapturista(
  db: Db,
  params: AssignCapturistaParams,
): Promise<RouteAssignment> {
  const { graphId, userId, billingPeriodId, assignedDate } = params;

  // 1. Validate that the route exists and is active
  const [route] = await db
    .select({
      id: routeGraphs.id,
      status: routeGraphs.status,
      totalNodes: routeGraphs.totalNodes,
    })
    .from(routeGraphs)
    .where(eq(routeGraphs.id, graphId))
    .limit(1);

  if (!route) {
    throw Object.assign(new Error('Route graph not found'), {
      name: 'NotFoundError',
    });
  }
  if (route.status !== 'active') {
    throw Object.assign(
      new Error(`Route graph is not active (status: ${route.status})`),
      { name: 'ConflictError' },
    );
  }

  // 2. Validate user isn't already assigned to another route for the same period
  const [existing] = await db
    .select({ id: routeAssignments.id })
    .from(routeAssignments)
    .where(
      and(
        eq(routeAssignments.userId, userId),
        eq(routeAssignments.billingPeriodId, billingPeriodId),
        sql`${routeAssignments.status} NOT IN ('completada', 'cancelada')`,
      ),
    )
    .limit(1);

  if (existing) {
    throw Object.assign(
      new Error(
        'User is already assigned to a route for this billing period',
      ),
      { name: 'ConflictError' },
    );
  }

  // 3. Create the assignment
  const [assignment] = await db
    .insert(routeAssignments)
    .values({
      graphId,
      userId,
      billingPeriodId,
      assignedDate,
      status: 'pendiente',
      readingsCompleted: 0,
      readingsTotal: route.totalNodes,
    })
    .returning();

  return assignment;
}

// ─── updateAssignmentStatus ─────────────────────────────────────

export async function updateAssignmentStatus(
  db: Db,
  assignmentId: string,
  newStatus: string,
): Promise<RouteAssignment> {
  // 1. Load current assignment
  const [assignment] = await db
    .select()
    .from(routeAssignments)
    .where(eq(routeAssignments.id, assignmentId))
    .limit(1);

  if (!assignment) {
    throw Object.assign(new Error('Assignment not found'), {
      name: 'NotFoundError',
    });
  }

  // 2. Validate transition
  const allowed = VALID_TRANSITIONS[assignment.status];
  if (!allowed || !allowed.includes(newStatus)) {
    throw Object.assign(
      new Error(
        `Invalid status transition: ${assignment.status} → ${newStatus}`,
      ),
      { name: 'ValidationError' },
    );
  }

  // 3. Additional validation for completada
  if (newStatus === 'completada') {
    if (assignment.readingsCompleted !== assignment.readingsTotal) {
      throw Object.assign(
        new Error(
          `Cannot complete: ${assignment.readingsCompleted}/${assignment.readingsTotal} readings done`,
        ),
        { name: 'ValidationError' },
      );
    }
  }

  // 4. Build update fields
  const now = new Date();
  const updateFields: Partial<Record<string, unknown>> = {
    status: newStatus,
    updatedAt: now,
  };

  if (newStatus === 'en_progreso') {
    updateFields.startedAt = now;
  } else if (newStatus === 'completada') {
    updateFields.completedAt = now;
  }

  const [updated] = await db
    .update(routeAssignments)
    .set(updateFields as any)
    .where(eq(routeAssignments.id, assignmentId))
    .returning();

  return updated;
}

// ─── updateReadingsProgress ─────────────────────────────────────

export async function updateReadingsProgress(
  db: Db,
  assignmentId: string,
  readingsCompleted: number,
): Promise<RouteAssignment> {
  const [assignment] = await db
    .select()
    .from(routeAssignments)
    .where(eq(routeAssignments.id, assignmentId))
    .limit(1);

  if (!assignment) {
    throw Object.assign(new Error('Assignment not found'), {
      name: 'NotFoundError',
    });
  }

  if (readingsCompleted < 0 || readingsCompleted > assignment.readingsTotal) {
    throw Object.assign(
      new Error(
        `Invalid readings count: ${readingsCompleted} (total: ${assignment.readingsTotal})`,
      ),
      { name: 'ValidationError' },
    );
  }

  const [updated] = await db
    .update(routeAssignments)
    .set({
      readingsCompleted,
      updatedAt: new Date(),
    })
    .where(eq(routeAssignments.id, assignmentId))
    .returning();

  return updated;
}

// ─── getAssignmentProgress ──────────────────────────────────────

export async function getAssignmentProgress(
  db: Db,
  assignmentId: string,
): Promise<AssignmentProgress> {
  const [assignment] = await db
    .select()
    .from(routeAssignments)
    .where(eq(routeAssignments.id, assignmentId))
    .limit(1);

  if (!assignment) {
    throw Object.assign(new Error('Assignment not found'), {
      name: 'NotFoundError',
    });
  }

  const progressPercent =
    assignment.readingsTotal > 0
      ? Math.round(
          (assignment.readingsCompleted / assignment.readingsTotal) * 100,
        )
      : 0;

  let timeElapsedMin: number | null = null;
  let estimatedRemainingMin: number | null = null;

  if (assignment.startedAt) {
    const endTime = assignment.completedAt
      ? new Date(assignment.completedAt)
      : new Date();
    const startTime = new Date(assignment.startedAt);
    timeElapsedMin = Math.round(
      (endTime.getTime() - startTime.getTime()) / 60_000,
    );

    // Estimate remaining time based on current pace
    if (
      assignment.readingsCompleted > 0 &&
      !assignment.completedAt
    ) {
      const avgTimePerReading = timeElapsedMin / assignment.readingsCompleted;
      const remaining =
        assignment.readingsTotal - assignment.readingsCompleted;
      estimatedRemainingMin = Math.round(avgTimePerReading * remaining);
    }
  }

  return {
    assignment,
    progressPercent,
    timeElapsedMin,
    estimatedRemainingMin,
  };
}

// ─── listAssignmentsByPeriod ────────────────────────────────────

export async function listAssignmentsByPeriod(
  db: Db,
  billingPeriodId: string,
  opts?: { status?: string },
): Promise<
  Array<
    RouteAssignment & { routeName: string; userName: string; userEmail: string }
  >
> {
  const conditions = [
    eq(routeAssignments.billingPeriodId, billingPeriodId),
  ];

  if (opts?.status) {
    conditions.push(eq(routeAssignments.status, opts.status) as any);
  }

  const rows = await db
    .select({
      id: routeAssignments.id,
      graphId: routeAssignments.graphId,
      userId: routeAssignments.userId,
      billingPeriodId: routeAssignments.billingPeriodId,
      assignedDate: routeAssignments.assignedDate,
      status: routeAssignments.status,
      readingsCompleted: routeAssignments.readingsCompleted,
      readingsTotal: routeAssignments.readingsTotal,
      startedAt: routeAssignments.startedAt,
      completedAt: routeAssignments.completedAt,
      createdAt: routeAssignments.createdAt,
      updatedAt: routeAssignments.updatedAt,
      routeName: routeGraphs.name,
      userName: users.name,
      userEmail: users.email,
    })
    .from(routeAssignments)
    .innerJoin(routeGraphs, eq(routeAssignments.graphId, routeGraphs.id))
    .innerJoin(users, eq(routeAssignments.userId, users.id))
    .where(and(...conditions));

  return rows as any;
}

// ─── listAssignmentsByUser ──────────────────────────────────────

export async function listAssignmentsByUser(
  db: Db,
  userId: string,
  opts?: { billingPeriodId?: string; status?: string },
): Promise<
  Array<RouteAssignment & { routeName: string }>
> {
  const conditions = [eq(routeAssignments.userId, userId)];

  if (opts?.billingPeriodId) {
    conditions.push(
      eq(routeAssignments.billingPeriodId, opts.billingPeriodId) as any,
    );
  }
  if (opts?.status) {
    conditions.push(eq(routeAssignments.status, opts.status) as any);
  }

  const rows = await db
    .select({
      id: routeAssignments.id,
      graphId: routeAssignments.graphId,
      userId: routeAssignments.userId,
      billingPeriodId: routeAssignments.billingPeriodId,
      assignedDate: routeAssignments.assignedDate,
      status: routeAssignments.status,
      readingsCompleted: routeAssignments.readingsCompleted,
      readingsTotal: routeAssignments.readingsTotal,
      startedAt: routeAssignments.startedAt,
      completedAt: routeAssignments.completedAt,
      createdAt: routeAssignments.createdAt,
      updatedAt: routeAssignments.updatedAt,
      routeName: routeGraphs.name,
    })
    .from(routeAssignments)
    .innerJoin(routeGraphs, eq(routeAssignments.graphId, routeGraphs.id))
    .where(and(...conditions));

  return rows as any;
}

// ─── getWorkloadStats ───────────────────────────────────────────

export async function getWorkloadStats(
  db: Db,
  zoneId: string,
  billingPeriodId: string,
): Promise<WorkloadStats> {
  // Get all assignments for routes in this zone for this period
  const assignments = await db
    .select({
      assignmentId: routeAssignments.id,
      userId: routeAssignments.userId,
      userName: users.name,
      status: routeAssignments.status,
      readingsCompleted: routeAssignments.readingsCompleted,
      readingsTotal: routeAssignments.readingsTotal,
    })
    .from(routeAssignments)
    .innerJoin(routeGraphs, eq(routeAssignments.graphId, routeGraphs.id))
    .innerJoin(users, eq(routeAssignments.userId, users.id))
    .where(
      and(
        eq(routeGraphs.zoneId, zoneId),
        eq(routeAssignments.billingPeriodId, billingPeriodId),
      ),
    );

  // Calculate status counts
  let pendiente = 0;
  let enProgreso = 0;
  let completada = 0;
  let cancelada = 0;

  for (const a of assignments) {
    switch (a.status) {
      case 'pendiente':
        pendiente++;
        break;
      case 'en_progreso':
        enProgreso++;
        break;
      case 'completada':
        completada++;
        break;
      case 'cancelada':
        cancelada++;
        break;
    }
  }

  // Group by user for per-capturista stats
  const byUser = new Map<
    string,
    { userName: string; count: number; totalCompleted: number; totalExpected: number }
  >();

  for (const a of assignments) {
    const entry = byUser.get(a.userId) ?? {
      userName: a.userName,
      count: 0,
      totalCompleted: 0,
      totalExpected: 0,
    };
    entry.count++;
    entry.totalCompleted += a.readingsCompleted;
    entry.totalExpected += a.readingsTotal;
    byUser.set(a.userId, entry);
  }

  const assignmentsPerCapturista = Array.from(byUser.entries()).map(
    ([userId, data]) => ({
      userId,
      userName: data.userName,
      assignmentCount: data.count,
      avgCompletionRate:
        data.totalExpected > 0
          ? Math.round((data.totalCompleted / data.totalExpected) * 100)
          : 0,
    }),
  );

  return {
    totalAssignments: assignments.length,
    assignmentsPerCapturista,
    pendiente,
    enProgreso,
    completada,
    cancelada,
  };
}
