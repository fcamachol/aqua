-- =============================================================
-- SUPRA Water 2026 — Reading Routes (Graph-Based Model)
-- Tables: route_graphs, route_nodes, route_edges, route_assignments
-- Depends on: 001-extensions.sql (PostGIS), 002-tables.sql (tenants,
--   explotaciones, sectores_hidraulicos, tomas, meters, users,
--   billing_periods)
-- =============================================================

-- UP MIGRATION
-- =============================================================

-- PostGIS is already enabled in 001-extensions.sql, but ensure it
-- exists in case this migration runs standalone.
CREATE EXTENSION IF NOT EXISTS postgis;

-- =============================================================
-- 1. route_graphs — master route definition per zone
-- =============================================================
CREATE TABLE IF NOT EXISTS route_graphs (
  id                     UUID           NOT NULL DEFAULT gen_random_uuid(),
  tenant_id              UUID           NOT NULL,
  explotacion_id         UUID           NOT NULL,
  zone_id                UUID           NOT NULL,
  name                   VARCHAR(100)   NOT NULL,
  description            TEXT,
  status                 VARCHAR(20)    NOT NULL,
  optimization_method    VARCHAR(30),
  total_nodes            INTEGER        NOT NULL DEFAULT 0,
  total_distance_m       NUMERIC(10,2),
  estimated_duration_min INTEGER,
  created_at             TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ    NOT NULL DEFAULT now(),

  CONSTRAINT pk_route_graphs PRIMARY KEY (id),

  CONSTRAINT chk_route_graphs_status
    CHECK (status IN ('draft', 'active', 'archived')),

  CONSTRAINT chk_route_graphs_optimization_method
    CHECK (optimization_method IN ('tsp_nearest', 'tsp_2opt', 'dijkstra', 'manual')),

  CONSTRAINT fk_route_graphs_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),

  CONSTRAINT fk_route_graphs_explotacion
    FOREIGN KEY (explotacion_id) REFERENCES explotaciones(id),

  CONSTRAINT fk_route_graphs_zone
    FOREIGN KEY (zone_id) REFERENCES sectores_hidraulicos(id)
);

-- =============================================================
-- 2. route_nodes — each toma/meter stop on the graph
-- =============================================================
CREATE TABLE IF NOT EXISTS route_nodes (
  id                    UUID            NOT NULL DEFAULT gen_random_uuid(),
  graph_id              UUID            NOT NULL,
  toma_id               UUID            NOT NULL,
  meter_id              UUID,
  location              GEOMETRY(Point, 4326) NOT NULL,
  access_difficulty     SMALLINT        NOT NULL,
  avg_service_time_min  NUMERIC(5,2)    NOT NULL,
  sequence_order        INTEGER         NOT NULL,
  is_entry_point        BOOLEAN         NOT NULL DEFAULT FALSE,
  is_exit_point         BOOLEAN         NOT NULL DEFAULT FALSE,
  notes                 TEXT,
  created_at            TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ     NOT NULL DEFAULT now(),

  CONSTRAINT pk_route_nodes PRIMARY KEY (id),

  CONSTRAINT fk_route_nodes_graph
    FOREIGN KEY (graph_id) REFERENCES route_graphs(id) ON DELETE CASCADE,

  CONSTRAINT fk_route_nodes_toma
    FOREIGN KEY (toma_id) REFERENCES tomas(id),

  CONSTRAINT fk_route_nodes_meter
    FOREIGN KEY (meter_id) REFERENCES meters(id)
);

-- =============================================================
-- 3. route_edges — walking paths between nodes
-- =============================================================
CREATE TABLE IF NOT EXISTS route_edges (
  id                  UUID            NOT NULL DEFAULT gen_random_uuid(),
  graph_id            UUID            NOT NULL,
  from_node_id        UUID            NOT NULL,
  to_node_id          UUID            NOT NULL,
  distance_m          NUMERIC(10,2)   NOT NULL,
  estimated_walk_min  NUMERIC(5,2)    NOT NULL,
  path_geometry       GEOMETRY(LineString, 4326),
  is_optimal          BOOLEAN         NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),

  CONSTRAINT pk_route_edges PRIMARY KEY (id),

  CONSTRAINT fk_route_edges_graph
    FOREIGN KEY (graph_id) REFERENCES route_graphs(id) ON DELETE CASCADE,

  CONSTRAINT fk_route_edges_from_node
    FOREIGN KEY (from_node_id) REFERENCES route_nodes(id) ON DELETE CASCADE,

  CONSTRAINT fk_route_edges_to_node
    FOREIGN KEY (to_node_id) REFERENCES route_nodes(id) ON DELETE CASCADE
);

-- =============================================================
-- 4. route_assignments — who walks which route per billing period
-- =============================================================
CREATE TABLE IF NOT EXISTS route_assignments (
  id                  UUID            NOT NULL DEFAULT gen_random_uuid(),
  graph_id            UUID            NOT NULL,
  user_id             UUID            NOT NULL,
  billing_period_id   UUID            NOT NULL,
  assigned_date       DATE            NOT NULL,
  status              VARCHAR(20)     NOT NULL DEFAULT 'pendiente',
  readings_completed  INTEGER         NOT NULL DEFAULT 0,
  readings_total      INTEGER         NOT NULL,
  started_at          TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),

  CONSTRAINT pk_route_assignments PRIMARY KEY (id),

  CONSTRAINT chk_route_assignments_status
    CHECK (status IN ('pendiente', 'en_progreso', 'completada', 'cancelada')),

  CONSTRAINT fk_route_assignments_graph
    FOREIGN KEY (graph_id) REFERENCES route_graphs(id) ON DELETE CASCADE,

  CONSTRAINT fk_route_assignments_user
    FOREIGN KEY (user_id) REFERENCES users(id),

  CONSTRAINT fk_route_assignments_billing_period
    FOREIGN KEY (billing_period_id) REFERENCES billing_periods(id)
);

-- =============================================================
-- INDEXES
-- =============================================================

-- route_graphs indexes
CREATE INDEX IF NOT EXISTS idx_route_graphs_tenant_zone_status
  ON route_graphs (tenant_id, zone_id, status);

CREATE INDEX IF NOT EXISTS idx_route_graphs_explotacion
  ON route_graphs (explotacion_id);

-- route_nodes indexes
CREATE INDEX IF NOT EXISTS idx_route_nodes_graph_sequence
  ON route_nodes (graph_id, sequence_order);

CREATE INDEX IF NOT EXISTS idx_route_nodes_toma
  ON route_nodes (toma_id);

CREATE INDEX IF NOT EXISTS idx_route_nodes_location_gist
  ON route_nodes USING GIST (location);

-- route_edges indexes
CREATE INDEX IF NOT EXISTS idx_route_edges_graph_optimal
  ON route_edges (graph_id, is_optimal);

CREATE INDEX IF NOT EXISTS idx_route_edges_from_node
  ON route_edges (from_node_id);

CREATE INDEX IF NOT EXISTS idx_route_edges_to_node
  ON route_edges (to_node_id);

CREATE INDEX IF NOT EXISTS idx_route_edges_path_gist
  ON route_edges USING GIST (path_geometry);

-- route_assignments indexes
CREATE INDEX IF NOT EXISTS idx_route_assignments_user_period
  ON route_assignments (user_id, billing_period_id);

CREATE INDEX IF NOT EXISTS idx_route_assignments_graph_period
  ON route_assignments (graph_id, billing_period_id);

CREATE INDEX IF NOT EXISTS idx_route_assignments_status
  ON route_assignments (status);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================

ALTER TABLE route_graphs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON route_graphs
  USING (tenant_id = current_setting('app.current_tenant')::UUID);

-- route_nodes, route_edges, route_assignments inherit tenant scope
-- via their FK to route_graphs. RLS is applied on route_graphs.

-- =============================================================
-- DOWN MIGRATION
-- =============================================================
-- To rollback, run the following statements in order:
--
-- DROP POLICY IF EXISTS tenant_isolation ON route_graphs;
-- ALTER TABLE route_graphs DISABLE ROW LEVEL SECURITY;
-- DROP TABLE IF EXISTS route_assignments CASCADE;
-- DROP TABLE IF EXISTS route_edges CASCADE;
-- DROP TABLE IF EXISTS route_nodes CASCADE;
-- DROP TABLE IF EXISTS route_graphs CASCADE;
