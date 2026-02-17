import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  decimal,
  integer,
  smallint,
  date,
  index,
  customType,
} from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { tenants, explotaciones } from './tenants.js';
import { sectoresHidraulicos } from './infrastructure.js';
import { tomas } from './tomas.js';
import { meters } from './meters.js';
import { users } from './users.js';

// =============================================================
// PostGIS GEOMETRY custom types for Drizzle ORM
// =============================================================

const geometry = <TType extends string>(
  name: string,
  geometryType: TType,
  srid: number = 4326,
) =>
  customType<{ data: string; driverType: string }>({
    dataType() {
      return `GEOMETRY(${geometryType}, ${srid})`;
    },
    toDriver(value: string) {
      return value;
    },
    fromDriver(value: unknown) {
      return value as string;
    },
  })(name);

// =============================================================
// ROUTE GRAPHS (master route definitions)
// =============================================================

export const routeGraphs = pgTable(
  'route_graphs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    explotacionId: uuid('explotacion_id')
      .notNull()
      .references(() => explotaciones.id),
    zoneId: uuid('zone_id')
      .notNull()
      .references(() => sectoresHidraulicos.id),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 20 }).notNull().default('draft'),
    optimizationMethod: varchar('optimization_method', { length: 30 }),
    totalNodes: integer('total_nodes').notNull().default(0),
    totalDistanceM: decimal('total_distance_m', { precision: 10, scale: 2 }),
    estimatedDurationMin: integer('estimated_duration_min'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_route_graphs_tenant_zone_status').on(
      table.tenantId,
      table.zoneId,
      table.status,
    ),
    index('idx_route_graphs_explotacion').on(table.explotacionId),
  ],
);

// =============================================================
// ROUTE NODES (toma/meter stops on the graph)
// =============================================================

export const routeNodes = pgTable(
  'route_nodes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    graphId: uuid('graph_id')
      .notNull()
      .references(() => routeGraphs.id, { onDelete: 'cascade' }),
    tomaId: uuid('toma_id')
      .notNull()
      .references(() => tomas.id),
    meterId: uuid('meter_id').references(() => meters.id),
    location: geometry('location', 'Point', 4326).notNull(),
    accessDifficulty: smallint('access_difficulty').notNull().default(1),
    avgServiceTimeMin: decimal('avg_service_time_min', { precision: 5, scale: 2 })
      .notNull()
      .default('5.00'),
    sequenceOrder: integer('sequence_order').notNull().default(0),
    isEntryPoint: boolean('is_entry_point').notNull().default(false),
    isExitPoint: boolean('is_exit_point').notNull().default(false),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_route_nodes_graph_sequence').on(table.graphId, table.sequenceOrder),
    index('idx_route_nodes_toma').on(table.tomaId),
    // GIST index on location handled in SQL migration (requires PostGIS operator class)
  ],
);

// =============================================================
// ROUTE EDGES (walking paths between nodes)
// =============================================================

export const routeEdges = pgTable(
  'route_edges',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    graphId: uuid('graph_id')
      .notNull()
      .references(() => routeGraphs.id, { onDelete: 'cascade' }),
    fromNodeId: uuid('from_node_id')
      .notNull()
      .references(() => routeNodes.id, { onDelete: 'cascade' }),
    toNodeId: uuid('to_node_id')
      .notNull()
      .references(() => routeNodes.id, { onDelete: 'cascade' }),
    distanceM: decimal('distance_m', { precision: 10, scale: 2 }).notNull(),
    estimatedWalkMin: decimal('estimated_walk_min', { precision: 5, scale: 2 }).notNull(),
    pathGeometry: geometry('path_geometry', 'LineString', 4326),
    isOptimal: boolean('is_optimal').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_route_edges_graph_optimal').on(table.graphId, table.isOptimal),
    index('idx_route_edges_from_node').on(table.fromNodeId),
    index('idx_route_edges_to_node').on(table.toNodeId),
    // GIST index on path_geometry handled in SQL migration (requires PostGIS operator class)
  ],
);

// =============================================================
// ROUTE ASSIGNMENTS (capturista ↔ route ↔ billing period)
// =============================================================
// Note: billing_period_id FK to billing_periods table will be added
// when that table is created (similar pattern to tomas.meter_id)

export const routeAssignments = pgTable(
  'route_assignments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    graphId: uuid('graph_id')
      .notNull()
      .references(() => routeGraphs.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    billingPeriodId: uuid('billing_period_id').notNull(),
    assignedDate: date('assigned_date').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('pendiente'),
    readingsCompleted: integer('readings_completed').notNull().default(0),
    readingsTotal: integer('readings_total').notNull().default(0),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_route_assignments_user_period').on(table.userId, table.billingPeriodId),
    index('idx_route_assignments_graph_period').on(table.graphId, table.billingPeriodId),
    index('idx_route_assignments_status').on(table.status),
  ],
);

// =============================================================
// INFERRED TYPES
// =============================================================

export type RouteGraph = InferSelectModel<typeof routeGraphs>;
export type NewRouteGraph = InferInsertModel<typeof routeGraphs>;

export type RouteNode = InferSelectModel<typeof routeNodes>;
export type NewRouteNode = InferInsertModel<typeof routeNodes>;

export type RouteEdge = InferSelectModel<typeof routeEdges>;
export type NewRouteEdge = InferInsertModel<typeof routeEdges>;

export type RouteAssignment = InferSelectModel<typeof routeAssignments>;
export type NewRouteAssignment = InferInsertModel<typeof routeAssignments>;
