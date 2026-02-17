# Reading Routes Graph-Based Redesign

**Date**: 2026-02-16
**Status**: Approved
**Domain**: Meters / Field Operations

## Problem

The legacy AquaCIS route system uses 6 interlinked tables (zona, libreta, lote, ptoserv, rutadistrib, polapunlec) with a manual 14-digit sequence code (`ptoscodrec`) and no geospatial optimization. Routes are statically defined and workload balancing is manual.

## Goals

1. Minimize walking distance using PostGIS geometry
2. Minimize total time by factoring in access difficulty and service time per stop
3. Maximize readings per day by balancing workload across capturistas
4. Pre-planned routes generated before shift (capturista app is a separate system)

## Approach: Graph-Based Model

Four tables model routes as weighted directed graphs. Optimization runs TSP solvers on the graph to produce ordered walk sequences.

## Schema

### Table 1: `route_graphs` (13 columns)

The master route definition for a zone.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | NO | Primary key |
| `tenant_id` | UUID | NO | FK → tenants |
| `explotacion_id` | UUID | NO | FK → explotaciones |
| `zone_id` | UUID | NO | FK → sectores_hidraulicos |
| `name` | VARCHAR(100) | NO | Route name, e.g. "Zona Centro - Ruta 3" |
| `description` | TEXT | YES | Optional description |
| `status` | VARCHAR(20) | NO | draft, active, archived |
| `optimization_method` | VARCHAR(30) | YES | tsp_nearest, tsp_2opt, dijkstra, manual |
| `total_nodes` | INTEGER | NO | Denormalized count of stops |
| `total_distance_m` | NUMERIC(10,2) | YES | Total optimized walking distance in meters |
| `estimated_duration_min` | INTEGER | YES | Estimated completion time in minutes |
| `created_at` | TIMESTAMPTZ | NO | |
| `updated_at` | TIMESTAMPTZ | NO | |

**Indexes**: `(tenant_id, zone_id, status)`, `(explotacion_id)`

### Table 2: `route_nodes` (13 columns)

Each toma/meter stop on the graph with PostGIS coordinates.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | NO | Primary key |
| `graph_id` | UUID | NO | FK → route_graphs |
| `toma_id` | UUID | NO | FK → tomas |
| `meter_id` | UUID | YES | FK → meters (null if no meter installed) |
| `location` | GEOMETRY(Point, 4326) | NO | PostGIS lat/lng |
| `access_difficulty` | SMALLINT | NO | 1-5 scale (affects time weight) |
| `avg_service_time_min` | NUMERIC(5,2) | NO | Historical average time at this stop |
| `sequence_order` | INTEGER | NO | Optimized visit order |
| `is_entry_point` | BOOLEAN | NO | Start of route |
| `is_exit_point` | BOOLEAN | NO | End of route |
| `notes` | TEXT | YES | Gate codes, dog warnings, access instructions |
| `created_at` | TIMESTAMPTZ | NO | |
| `updated_at` | TIMESTAMPTZ | NO | |

**Indexes**: `(graph_id, sequence_order)`, `(toma_id)`, GIST on `location`

### Table 3: `route_edges` (10 columns)

Walking paths between nodes with distance/time weights.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | NO | Primary key |
| `graph_id` | UUID | NO | FK → route_graphs |
| `from_node_id` | UUID | NO | FK → route_nodes |
| `to_node_id` | UUID | NO | FK → route_nodes |
| `distance_m` | NUMERIC(10,2) | NO | Walking distance in meters |
| `estimated_walk_min` | NUMERIC(5,2) | NO | Time to walk this edge |
| `path_geometry` | GEOMETRY(LineString, 4326) | YES | Actual walking path for map display |
| `is_optimal` | BOOLEAN | NO | Part of the optimized route solution |
| `created_at` | TIMESTAMPTZ | NO | |
| `updated_at` | TIMESTAMPTZ | NO | |

**Indexes**: `(graph_id, is_optimal)`, `(from_node_id)`, `(to_node_id)`, GIST on `path_geometry`

### Table 4: `route_assignments` (12 columns)

Who walks which route for a billing period.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | UUID | NO | Primary key |
| `graph_id` | UUID | NO | FK → route_graphs |
| `user_id` | UUID | NO | FK → users (lecturista role) |
| `billing_period_id` | UUID | NO | FK → billing_periods |
| `assigned_date` | DATE | NO | Date assigned |
| `status` | VARCHAR(20) | NO | pendiente, en_progreso, completada, cancelada |
| `readings_completed` | INTEGER | NO | Progress counter (default 0) |
| `readings_total` | INTEGER | NO | Total expected readings |
| `started_at` | TIMESTAMPTZ | YES | When capturista started |
| `completed_at` | TIMESTAMPTZ | YES | When capturista finished |
| `created_at` | TIMESTAMPTZ | NO | |
| `updated_at` | TIMESTAMPTZ | NO | |

**Indexes**: `(user_id, billing_period_id)`, `(graph_id, billing_period_id)`, `(status)`

## Optimization Logic

Located in `src/modules/meters/route-optimizer.ts`:

1. **Build graph**: Query route_nodes, compute pairwise distances via `ST_Distance`
2. **Weight edges**: `total_weight = distance_m + (access_difficulty * 2 min) + avg_service_time_min`
3. **Solve TSP**: 2-opt heuristic for routes under 500 nodes
4. **Balance workload**: Partition graph into N subgraphs with equal `SUM(estimated_walk_min + avg_service_time_min)`
5. **Persist**: Write optimized `sequence_order` to nodes, mark `is_optimal` on edges

### Optimizer Inputs

| Parameter | Type | Description |
|-----------|------|-------------|
| `zone_id` | UUID | Which sector to optimize |
| `billing_period_id` | UUID | Which period |
| `num_capturistas` | INTEGER | How many routes to create |
| `max_readings_per_route` | INTEGER | Upper bound per capturista |
| `shift_duration_min` | INTEGER | Max working minutes (default 480) |

## API Endpoints

```
POST   /reading-routes/optimize              # Trigger optimization for zone/period
GET    /reading-routes                        # List routes (filter by zone, period, status)
GET    /reading-routes/:id                    # Get route with nodes in walk order
GET    /reading-routes/:id/nodes              # Ordered stops for capturista app
GET    /reading-routes/:id/edges              # Edge data for map visualization
POST   /reading-routes/:id/assign             # Assign capturista to route
PATCH  /reading-routes/:id/assignments/:aid   # Update assignment status
GET    /reading-routes/stats/:zone_id         # Workload balance stats across routes
```

## Drizzle ORM Schema

Located in `src/db/schema/reading-routes.ts`. Uses:
- `pgTable` for table definitions
- `geometry` custom type for PostGIS columns
- Standard UUID, timestamp, and enum patterns from existing schema

## Zod Validators

Located in `src/modules/meters/validators.ts`:
- `createRouteGraphSchema` — validates route creation input
- `optimizeRoutesSchema` — validates optimizer parameters
- `assignRouteSchema` — validates capturista assignment

## Event Bus Integration

Events emitted to the SUPRA event bus:
- `route.optimized` — when optimization completes
- `route.assigned` — when capturista is assigned
- `route.started` — when capturista begins walk
- `route.completed` — when all readings captured

## Legacy Migration

| Legacy Table/Column | New Table/Column | Strategy |
|---------------------|------------------|----------|
| `zona.zonid` | `sectores_hidraulicos.id` | Map zone codes to UUIDs |
| `libreta.libcod` | `route_graphs.id` | One libreta = one route_graph |
| `ptoserv.ptoscodrec` | `route_nodes.sequence_order` | Preserve as initial order, re-optimize |
| `ptoserv.ptosemplid` | `route_assignments.user_id` | Map employee codes to user UUIDs |
| `lote` | `route_assignments` | One lote per period = one assignment |
| No GPS data | `route_nodes.location` | Geocode addresses via batch process |

## Implementation Tasks (10 parallel agents)

1. **Schema agent**: Drizzle ORM schema for 4 tables + PostGIS extensions
2. **Migration agent**: SQL migration file with CREATE TABLE, indexes, constraints
3. **TSP solver agent**: 2-opt TSP algorithm implementation
4. **Workload balancer agent**: Graph partitioning for equal-time routes
5. **Route optimizer service agent**: Orchestrates build → weight → solve → persist
6. **API router agent**: Express routes + Zod validators for all endpoints
7. **Assignment service agent**: Capturista assignment CRUD + status management
8. **PostGIS utilities agent**: ST_Distance helpers, geocoding batch service
9. **Event integration agent**: Event emitters for route lifecycle
10. **Legacy migration agent**: Migration script from zona/libreta/ptoserv to new schema
