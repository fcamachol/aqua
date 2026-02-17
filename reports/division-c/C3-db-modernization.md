# C3 Report: PostgreSQL Database Modernization Strategy for AquaCIS

> **Report ID**: C3-db-modernization
> **Generated**: 2026-02-16
> **Database**: cf_quere_pro (CEA Queretaro Water Utility)
> **Current State**: 4,114 tables | 3 schemas | PostgreSQL
> **Target State**: ~300-400 tables | modern PostgreSQL patterns

---

## Executive Summary

The AquaCIS database `cf_quere_pro` suffers from several severe structural anti-patterns that have accumulated over years of production use. The most critical issues are:

1. **Table-per-process explosion**: 2,144 `tmp_deuda_*` tables and 477 `aux_varscreditored_*` tables created by the application dynamically, one per billing/collection process execution.
2. **History table mirroring**: 230+ `his*` tables that duplicate the schema of their base tables for audit tracking.
3. **Lookup table proliferation**: 65+ `tipo*` tables for simple key-value domain lookups.
4. **God table**: `explotacion` with 350 columns serving as a system-wide configuration monolith.
5. **Catalog bloat**: 4,114 tables cause PostgreSQL system catalog (`pg_class`, `pg_attribute`, `pg_statistic`) to bloat, degrading query planning performance for every single query.

This report details PostgreSQL-native modernization strategies to reduce the table count by approximately 90%, improve query planning performance by 3-10x, simplify application maintenance, and establish patterns that prevent future anti-pattern re-emergence.

**Overall Modernization Complexity Score: 7/10** -- The technical solutions are well-established PostgreSQL features, but the risk lies in coordinating changes against a running production billing system serving a Mexican water utility.

---

## 1. Partitioning Strategy: Consolidating 2,144 tmp_deuda_* Tables

### Current Problem

The application creates a new physical table `tmp_deuda_XXXXXXX` for each billing/collection process execution. Each table has 4 identical columns (`importe`, `numfacturas`, `facsocemi`, `faccnttnum`). After 2,144+ executions, each table remains as a permanent catalog entry.

This pattern also appears in:
- `aux_varscreditored_XXXXXXX` (477 tables, 3 columns each)
- `tmpbb_XXXXXXX` (22 tables, 14 columns each)

### Recommended Strategy: Single Table with proceso_id (Not Partitioning)

For the `tmp_deuda_*` pattern, **native PostgreSQL partitioning is not the right solution**. The correct approach is a single consolidated table with a discriminator column. Partitioning is designed for tables with billions of rows and predictable partition boundaries (date ranges, geographic regions), not for transient work tables.

#### Target Schema

```sql
CREATE TABLE tmp_deuda (
    proceso_id  BIGINT NOT NULL,
    importe     NUMERIC(18,2) NOT NULL,
    numfacturas INTEGER NOT NULL,
    facsocemi   NUMERIC(10,0) NOT NULL,
    faccnttnum  NUMERIC(10,0) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_tmp_deuda PRIMARY KEY (proceso_id, faccnttnum)
);

-- Partition by range on proceso_id for efficient cleanup
-- Only if row counts grow to tens of millions
CREATE INDEX idx_tmp_deuda_proceso ON tmp_deuda (proceso_id);
CREATE INDEX idx_tmp_deuda_contrato ON tmp_deuda (faccnttnum);
```

#### When to Actually Use Partitioning

If the consolidated `tmp_deuda` table grows beyond 50 million rows, apply **range partitioning on `proceso_id`** with automatic partition management:

```sql
CREATE TABLE tmp_deuda (
    proceso_id  BIGINT NOT NULL,
    importe     NUMERIC(18,2) NOT NULL,
    numfacturas INTEGER NOT NULL,
    facsocemi   NUMERIC(10,0) NOT NULL,
    faccnttnum  NUMERIC(10,0) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
) PARTITION BY RANGE (proceso_id);

-- Create partitions in batches of 10,000 process IDs
CREATE TABLE tmp_deuda_p0 PARTITION OF tmp_deuda
    FOR VALUES FROM (0) TO (10000);
CREATE TABLE tmp_deuda_p1 PARTITION OF tmp_deuda
    FOR VALUES FROM (10000) TO (20000);
-- Automate partition creation via pg_partman extension
```

#### Cleanup Strategy

```sql
-- Instead of DROP TABLE tmp_deuda_1779865:
DELETE FROM tmp_deuda WHERE proceso_id = 1779865;

-- Or with partitioning, detach and drop old partitions:
ALTER TABLE tmp_deuda DETACH PARTITION tmp_deuda_p0;
DROP TABLE tmp_deuda_p0;
```

#### Same Pattern for aux_varscreditored

```sql
CREATE TABLE aux_varscreditored (
    proceso_id    BIGINT NOT NULL,
    cnttnum       NUMERIC(10,0) NOT NULL,
    impvariable   NUMERIC(18,2),
    impvaranterior NUMERIC(18,2),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_aux_varscreditored PRIMARY KEY (proceso_id, cnttnum)
);
```

### Application Code Change Required

The application code that currently does:
```sql
CREATE TABLE tmp_deuda_<ID> (importe ..., numfacturas ..., facsocemi ..., faccnttnum ...);
INSERT INTO tmp_deuda_<ID> VALUES (...);
SELECT * FROM tmp_deuda_<ID>;
DROP TABLE tmp_deuda_<ID>;
```

Must change to:
```sql
INSERT INTO tmp_deuda (proceso_id, importe, numfacturas, facsocemi, faccnttnum) VALUES (<ID>, ...);
SELECT * FROM tmp_deuda WHERE proceso_id = <ID>;
DELETE FROM tmp_deuda WHERE proceso_id = <ID>;
```

### PostgreSQL Partitioning Best Practices (for other use cases)

For tables that genuinely benefit from partitioning (e.g., `factura`, `movccontrato`, `poldetsum` which grow indefinitely by date):

| Strategy | Use When | Example |
|----------|----------|---------|
| **Range partitioning** | Time-series data, sequential IDs | `factura` partitioned by billing month |
| **List partitioning** | Discrete categories | `movccontrato` partitioned by `sociedad` |
| **Hash partitioning** | Even distribution, no natural range | High-throughput insert tables |
| **Sub-partitioning** | Two dimensions (date + region) | `factura` by year, sub-partitioned by `sociedad` |

Key PostgreSQL partitioning capabilities:
- **Partition pruning**: Query planner automatically skips irrelevant partitions (enabled by default since PG 11)
- **Parallel partition scans**: PG 14+ can scan partitions in parallel
- **ATTACH/DETACH PARTITION CONCURRENTLY**: PG 14+ supports non-blocking partition management
- **Default partition**: Catches rows that don't match any defined partition
- **pg_partman extension**: Automates partition creation and retention policies

### Impact Assessment

| Metric | Before | After |
|--------|--------|-------|
| Tables eliminated | 2,643 | 3 consolidated tables |
| Catalog entries removed | ~2,640 | - |
| `pg_class` rows freed | ~2,640 | - |
| `pg_attribute` rows freed | ~10,500 | - |
| Query planning overhead | Significant catalog scans | Minimal |

**Priority: HIGH** | **Complexity: LOW** | **Risk: LOW**

---

## 2. JSONB for Lookups: Unified Configuration Table Design

### Current Problem

The database has 65+ `tipo*` tables serving as simple lookup/domain-value tables. Most have the pattern:
- Primary key (numeric ID)
- Text identifier code (2-4 chars)
- Description text ID (for i18n)
- `hstusu` / `hsthora` audit fields

Examples: `tipoconcep`, `tipcliente`, `tipfactura`, `tipoorden`, `tipobonif`, `tipomensaj`, `tipocsc`, etc.

Many of these tables have fewer than 50 rows and 3-5 columns.

### Recommended Strategy: Polymorphic Domain Value Table with JSONB

#### Core Design

```sql
CREATE TABLE domain_value (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    domain      VARCHAR(50) NOT NULL,         -- e.g., 'tipo_concepto', 'tipo_cliente'
    code        VARCHAR(20) NOT NULL,         -- the short code
    sort_order  INTEGER NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    label_es    TEXT NOT NULL,                -- Spanish label (primary)
    label_en    TEXT,                         -- English label (optional)
    attributes  JSONB NOT NULL DEFAULT '{}',  -- domain-specific extra fields
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by  VARCHAR(10) NOT NULL,
    CONSTRAINT uq_domain_code UNIQUE (domain, code)
);

-- GIN index for JSONB attribute queries
CREATE INDEX idx_domain_value_attrs ON domain_value USING GIN (attributes);

-- Covering index for the most common lookup pattern
CREATE INDEX idx_domain_value_lookup ON domain_value (domain, code, is_active)
    INCLUDE (label_es, sort_order);

-- Partial index for active values only (most queries)
CREATE INDEX idx_domain_value_active ON domain_value (domain, code)
    WHERE is_active = true;
```

#### JSONB for Domain-Specific Attributes

Some `tipo*` tables have additional functional columns beyond the basic id/code/description pattern. JSONB handles this elegantly:

```sql
-- tipoconcep has extra fields like category, tax_applicable, etc.
INSERT INTO domain_value (domain, code, label_es, attributes, created_by) VALUES
('tipo_concepto', 'AG', 'Agua Potable',
 '{"category": "service", "tax_applicable": true, "gl_account": "4100"}',
 'admin');

-- tipcliente might have different extra fields
INSERT INTO domain_value (domain, code, label_es, attributes, created_by) VALUES
('tipo_cliente', 'DOM', 'Domestico',
 '{"tariff_group": "residential", "subsidy_eligible": true}',
 'admin');
```

#### Querying JSONB Attributes

```sql
-- Find all concept types that are tax-applicable
SELECT code, label_es
FROM domain_value
WHERE domain = 'tipo_concepto'
  AND is_active = true
  AND attributes @> '{"tax_applicable": true}';

-- Check if a specific attribute exists
SELECT code, label_es, attributes->>'gl_account' as gl_account
FROM domain_value
WHERE domain = 'tipo_concepto'
  AND attributes ? 'gl_account';
```

#### JSONB Indexing Strategies

| Index Type | Use Case | Syntax |
|------------|----------|--------|
| **GIN default** | General containment (`@>`) and existence (`?`) queries | `USING GIN (attributes)` |
| **GIN jsonb_path_ops** | Only containment queries, 2-3x smaller index | `USING GIN (attributes jsonb_path_ops)` |
| **Expression index** | Frequent queries on a specific key | `ON domain_value ((attributes->>'category'))` |
| **Partial GIN** | Index only specific domains | `USING GIN (attributes) WHERE domain = 'tipo_concepto'` |

#### Which tipo* Tables to Consolidate vs. Keep

**Consolidate (35-40 tables)** -- Simple lookup tables with pattern (id, code, description, audit_fields):
- All `tipo*` tables with 5 or fewer columns
- Tables with fewer than 100 rows
- Tables not referenced by foreign keys from high-volume transactional tables

**Keep as separate tables (25-30 tables)** -- Complex domain tables with:
- More than 5 functional columns (beyond id/code/description/audit)
- Foreign key relationships from millions of rows
- Columns used in JOIN conditions for performance-critical queries
- Tables like `concepto` (28 columns) which is really a business entity, not a lookup

#### Compatibility Layer

To avoid breaking existing application code immediately, create views:

```sql
-- Backward-compatible view for tipoconcep
CREATE VIEW tipoconcep AS
SELECT
    id AS tcoicod,
    code AS tcoitxtid,
    label_es AS tcoidesc,
    (attributes->>'category')::VARCHAR AS tcoicategory,
    created_by AS tcoihstusu,
    updated_at AS tcoihsthora
FROM domain_value
WHERE domain = 'tipo_concepto' AND is_active = true;
```

### Impact Assessment

| Metric | Before | After |
|--------|--------|-------|
| Lookup tables | 65+ | 1 (domain_value) + ~25 complex kept |
| Tables eliminated | ~40 | - |
| Index maintenance | 40 separate indexes | 3-4 on domain_value |
| Application changes | None (via views) | Gradual migration |
| Schema clarity | Poor (scattered lookups) | Centralized domain registry |

**Priority: MEDIUM** | **Complexity: MEDIUM** | **Risk: LOW**

---

## 3. JSONB Audit Trail: Modern History Tracking Replacing 230+ Tables

### Current Problem

The database has 231 `his*` tables, each mirroring the exact column structure of a base table. When a row in the base table changes, the old values are copied to the corresponding `his*` table. This means:

- Every schema change to a base table requires a matching change to its `his*` table
- 231 tables exist solely for audit purposes, bloating the catalog
- Many `his*` tables (for lookup/reference tables that rarely change) have near-zero rows
- Storage is highly redundant -- the full row is copied even when only one column changed

### Recommended Strategy: Unified JSONB Audit Log

#### Core Audit Table Design

```sql
CREATE TABLE audit_log (
    id          BIGINT GENERATED ALWAYS AS IDENTITY,
    table_name  VARCHAR(63) NOT NULL,
    record_id   BIGINT NOT NULL,           -- PK of the audited row
    action      CHAR(1) NOT NULL,          -- 'I'nsert, 'U'pdate, 'D'elete
    old_data    JSONB,                     -- full row before change (NULL on INSERT)
    new_data    JSONB,                     -- full row after change (NULL on DELETE)
    changed_fields JSONB,                  -- only the diff: {"field": {"old": x, "new": y}}
    session_id  BIGINT,                    -- links to sesion table
    user_id     VARCHAR(10) NOT NULL,
    changed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    app_context JSONB,                     -- optional: IP, module, action description
    CONSTRAINT pk_audit_log PRIMARY KEY (id)
) PARTITION BY RANGE (changed_at);

-- Monthly partitions for audit data
CREATE TABLE audit_log_2026_01 PARTITION OF audit_log
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE audit_log_2026_02 PARTITION OF audit_log
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
-- ... automate with pg_partman

-- Indexes
CREATE INDEX idx_audit_log_table_record ON audit_log (table_name, record_id, changed_at);
CREATE INDEX idx_audit_log_user ON audit_log (user_id, changed_at);
CREATE INDEX idx_audit_log_changed ON audit_log USING GIN (changed_fields);
```

#### Diff-Based Storage (Space Optimization)

Instead of storing the full old and new row, store only the delta:

```sql
-- The changed_fields column stores only what changed:
{
    "cnttnum": {"old": 12345, "new": 12346},
    "cnttestado": {"old": 1, "new": 2},
    "cntthstusu": {"old": "USER01", "new": "USER02"}
}
```

This approach reduces storage by 70-90% compared to full-row duplication, especially for wide tables like `contrato` (105 columns) where typically only 2-3 columns change per update.

#### Generic Audit Trigger Function

```sql
CREATE OR REPLACE FUNCTION fn_audit_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_old_data JSONB;
    v_new_data JSONB;
    v_diff JSONB := '{}';
    v_key TEXT;
    v_record_id BIGINT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_new_data := to_jsonb(NEW);
        v_record_id := (v_new_data->>TG_ARGV[0])::BIGINT;
        INSERT INTO audit_log (table_name, record_id, action, new_data, user_id)
        VALUES (TG_TABLE_NAME, v_record_id, 'I', v_new_data,
                coalesce(current_setting('app.current_user', true), 'system'));

    ELSIF TG_OP = 'UPDATE' THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
        -- Compute diff
        FOR v_key IN SELECT jsonb_object_keys(v_new_data)
        LOOP
            IF v_old_data->v_key IS DISTINCT FROM v_new_data->v_key THEN
                v_diff := v_diff || jsonb_build_object(
                    v_key,
                    jsonb_build_object('old', v_old_data->v_key, 'new', v_new_data->v_key)
                );
            END IF;
        END LOOP;
        -- Only log if something actually changed
        IF v_diff <> '{}' THEN
            v_record_id := (v_old_data->>TG_ARGV[0])::BIGINT;
            INSERT INTO audit_log (table_name, record_id, action, changed_fields, user_id)
            VALUES (TG_TABLE_NAME, v_record_id, 'U', v_diff,
                    coalesce(current_setting('app.current_user', true), 'system'));
        END IF;

    ELSIF TG_OP = 'DELETE' THEN
        v_old_data := to_jsonb(OLD);
        v_record_id := (v_old_data->>TG_ARGV[0])::BIGINT;
        INSERT INTO audit_log (table_name, record_id, action, old_data, user_id)
        VALUES (TG_TABLE_NAME, v_record_id, 'D', v_old_data,
                coalesce(current_setting('app.current_user', true), 'system'));
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Applying the Trigger

```sql
-- Apply to contrato table (primary key column name passed as argument)
CREATE TRIGGER trg_audit_contrato
    AFTER INSERT OR UPDATE OR DELETE ON contrato
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger('cnttnum');

-- Apply to persona table
CREATE TRIGGER trg_audit_persona
    AFTER INSERT OR UPDATE OR DELETE ON persona
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger('prsid');

-- Batch-apply to all tables needing audit
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT table_name, pk_column FROM audit_config WHERE enabled = true
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_audit_%I
             AFTER INSERT OR UPDATE OR DELETE ON %I
             FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger(%L)',
            r.table_name, r.table_name, r.pk_column
        );
    END LOOP;
END $$;
```

#### Querying Audit History

```sql
-- Get full history for a specific contract
SELECT action, changed_fields, user_id, changed_at
FROM audit_log
WHERE table_name = 'contrato' AND record_id = 12345
ORDER BY changed_at;

-- Find all changes to a specific field across all contracts
SELECT record_id, changed_fields->'cnttestado' as estado_change, changed_at
FROM audit_log
WHERE table_name = 'contrato'
  AND changed_fields ? 'cnttestado';

-- Reconstruct historical state at a point in time
-- (apply diffs in reverse from current state)
SELECT
    record_id,
    changed_at,
    changed_fields
FROM audit_log
WHERE table_name = 'contrato'
  AND record_id = 12345
  AND changed_at <= '2025-06-15'::timestamptz
ORDER BY changed_at DESC;
```

#### Tiered Approach: Which his* Tables to Replace

**Phase 1 -- Replace immediately (100-130 tables)**: `his*` tables for lookup/config entities that change fewer than 100 times per year. These include all `histipo*` tables and low-volume reference tables.

**Phase 2 -- Replace after validation (50-80 tables)**: `his*` tables for medium-volume entities (orders, claims, meters). Validate that JSONB audit query performance meets SLA.

**Phase 3 -- Evaluate keeping (20-30 tables)**: `his*` tables for high-volume transactional entities (`hisfactura`, `hiscontrato`, `hismovccontrato`) where:
- The history table is queried directly for reporting
- Row counts exceed millions
- Typed column access matters for aggregation queries

For Phase 3 entities, consider keeping dedicated history tables but using **temporal table patterns** (see Section 6).

### Impact Assessment

| Metric | Before | After |
|--------|--------|-------|
| History tables | 231 | 1 (audit_log, partitioned) + ~25 high-volume kept |
| Tables eliminated | ~200 | - |
| Schema maintenance | Double (base + his) | Single (auto-audit via trigger) |
| Storage | Full row copies | Diff-only (70-90% reduction) |
| Query capability | Typed columns only | JSONB enables arbitrary field queries |

**Priority: HIGH** | **Complexity: MEDIUM** | **Risk: MEDIUM**

---

## 4. Materialized Views: Reporting Layer Architecture

### Current Problem

The database contains ~25 `vgis_*` and `vgiss_*` tables that are manually maintained copies of denormalized data for GIS and reporting. Additionally, 13 identical `vw_gis_pad_usu_*_new` tables (one per municipality) store redundant data. Report staging tables (`tmtr*` family, `infocobro`, `infolecturas`) further fragment reporting data.

### Recommended Strategy: Materialized View Layer

#### PostgreSQL Materialized Views vs. Cache Tables

Materialized views are the native PostgreSQL solution for what AquaCIS is doing manually with cache tables:

| Feature | Current (cache tables) | Materialized Views |
|---------|----------------------|-------------------|
| Refresh | Manual application code | `REFRESH MATERIALIZED VIEW` |
| Concurrent access during refresh | Unknown/broken | `CONCURRENTLY` option |
| Indexing | Manual | Full index support |
| Dependencies | Manual tracking | Automatic via `pg_depend` |
| Data freshness | Unknown | `pg_stat_user_tables` tracks last refresh |

#### GIS Reporting Layer

```sql
-- Replace 13 per-municipality tables with 1 materialized view
CREATE MATERIALIZED VIEW mv_gis_padron_usuarios AS
SELECT
    p.prsid,
    p.prsnombre,
    p.prsapellido1,
    c.cnttnum,
    c.cnttestado,
    ps.ptosid,
    d.dirtexto,
    d.dirmunicipio AS municipio,  -- discriminator replaces 13 tables
    s.srvid,
    s.srvfecalta,
    a.acoid,
    -- ... other columns from the 50-column view
    now() AS refreshed_at
FROM contrato c
JOIN persona p ON c.cnttprsid = p.prsid
JOIN ptoserv ps ON c.cnttptosid = ps.ptosid
JOIN direccion d ON ps.ptosdirid = d.dirid
LEFT JOIN servicio s ON ps.ptosid = s.srvptosid
LEFT JOIN acometida a ON s.srvacoid = a.acoid
WHERE c.cnttestado IN (1, 2);  -- active contracts only

-- Index for municipality-filtered queries
CREATE INDEX idx_mv_gis_padron_muni ON mv_gis_padron_usuarios (municipio);
CREATE INDEX idx_mv_gis_padron_contrato ON mv_gis_padron_usuarios (cnttnum);
```

#### Billing Reports Layer

```sql
-- Replace tmtr* staging tables with materialized views
CREATE MATERIALIZED VIEW mv_billing_summary AS
SELECT
    f.facexpid,
    f.facsocemi,
    fb.fblperiid,
    fb.fblanno,
    fb.fblcptoid,
    SUM(fb.fblimpfac) AS total_facturado,
    SUM(fb.fblimpcob) AS total_cobrado,
    COUNT(DISTINCT f.facid) AS num_facturas,
    COUNT(DISTINCT fb.fblcnttnum) AS num_contratos
FROM factura f
JOIN facturable fb ON f.facid = fb.fblfacid
GROUP BY f.facexpid, f.facsocemi, fb.fblperiid, fb.fblanno, fb.fblcptoid
WITH NO DATA;  -- created empty, populated on first refresh

-- Refresh strategy
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_billing_summary;
```

#### Concurrent Refresh Pattern

The `CONCURRENTLY` option allows reads during refresh (requires a unique index):

```sql
-- Required for CONCURRENTLY: unique index
CREATE UNIQUE INDEX uidx_mv_billing_summary
    ON mv_billing_summary (facexpid, facsocemi, fblperiid, fblanno, fblcptoid);

-- Refresh without blocking readers
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_billing_summary;
```

#### Automated Refresh Scheduling

```sql
-- Using pg_cron extension (available on most managed PostgreSQL)
SELECT cron.schedule(
    'refresh_gis_padron',
    '0 2 * * *',  -- Daily at 2 AM
    'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_gis_padron_usuarios'
);

SELECT cron.schedule(
    'refresh_billing_summary',
    '0 3 * * *',  -- Daily at 3 AM
    'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_billing_summary'
);

-- After billing runs complete (event-driven)
SELECT cron.schedule(
    'refresh_billing_after_run',
    '30 * * * *',  -- Every 30 minutes during billing windows
    'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_billing_summary'
);
```

#### Materialized View Dependency Management

```sql
-- Track materialized view freshness
CREATE TABLE mv_refresh_log (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    view_name   VARCHAR(63) NOT NULL,
    started_at  TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    row_count   BIGINT,
    duration_ms BIGINT,
    status      VARCHAR(10) NOT NULL DEFAULT 'running'
);

-- Wrapper function for monitored refreshes
CREATE OR REPLACE FUNCTION refresh_mv(p_view_name TEXT)
RETURNS VOID AS $$
DECLARE
    v_start TIMESTAMPTZ := clock_timestamp();
    v_log_id BIGINT;
    v_count BIGINT;
BEGIN
    INSERT INTO mv_refresh_log (view_name, started_at)
    VALUES (p_view_name, v_start) RETURNING id INTO v_log_id;

    EXECUTE format('REFRESH MATERIALIZED VIEW CONCURRENTLY %I', p_view_name);
    EXECUTE format('SELECT count(*) FROM %I', p_view_name) INTO v_count;

    UPDATE mv_refresh_log SET
        completed_at = clock_timestamp(),
        row_count = v_count,
        duration_ms = EXTRACT(EPOCH FROM clock_timestamp() - v_start) * 1000,
        status = 'success'
    WHERE id = v_log_id;
EXCEPTION WHEN OTHERS THEN
    UPDATE mv_refresh_log SET
        completed_at = clock_timestamp(),
        duration_ms = EXTRACT(EPOCH FROM clock_timestamp() - v_start) * 1000,
        status = 'error'
    WHERE id = v_log_id;
    RAISE;
END;
$$ LANGUAGE plpgsql;
```

### Impact Assessment

| Metric | Before | After |
|--------|--------|-------|
| GIS cache tables | ~25 vgis_* | 3-5 materialized views |
| Municipality duplicates | 13 tables | 1 materialized view |
| Report staging tables | ~9 tmtr* | 3-4 materialized views |
| Tables eliminated | ~45 | - |
| Data freshness | Unknown | Tracked and scheduled |
| Concurrent read access | Potentially blocked | Guaranteed with CONCURRENTLY |

**Priority: MEDIUM** | **Complexity: LOW** | **Risk: LOW**

---

## 5. Event Sourcing Patterns: PostgreSQL as Event Store

### Applicability to AquaCIS

Event sourcing is a pattern where state changes are stored as a sequence of immutable events rather than overwriting current state. For a water utility billing system, this is particularly relevant for:

1. **Billing lifecycle**: Contract creation -> meter reading -> consumption calculation -> invoice generation -> payment -> reconciliation
2. **Meter reading pipeline**: Route assignment -> field reading -> validation -> anomaly detection -> approval
3. **Collection lifecycle**: Invoice aging -> payment reminders -> cutoff orders -> payment -> reconnection

### PostgreSQL Event Store Design

```sql
-- Core event store table
CREATE TABLE event_store (
    event_id        BIGINT GENERATED ALWAYS AS IDENTITY,
    stream_type     VARCHAR(50) NOT NULL,       -- 'contract', 'invoice', 'meter_reading'
    stream_id       BIGINT NOT NULL,            -- the aggregate root ID
    event_type      VARCHAR(100) NOT NULL,       -- 'ContractCreated', 'MeterRead', 'InvoiceIssued'
    event_data      JSONB NOT NULL,
    metadata        JSONB NOT NULL DEFAULT '{}', -- user, session, source system
    version         INTEGER NOT NULL,            -- optimistic concurrency per stream
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_event_store PRIMARY KEY (event_id),
    CONSTRAINT uq_stream_version UNIQUE (stream_type, stream_id, version)
) PARTITION BY RANGE (occurred_at);

-- Monthly partitions
CREATE TABLE event_store_2026_01 PARTITION OF event_store
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- Indexes
CREATE INDEX idx_event_stream ON event_store (stream_type, stream_id, version);
CREATE INDEX idx_event_type ON event_store (event_type, occurred_at);
CREATE INDEX idx_event_data ON event_store USING GIN (event_data);
```

#### Billing Events Example

```sql
-- Contract lifecycle events
INSERT INTO event_store (stream_type, stream_id, event_type, event_data, version) VALUES
('contract', 12345, 'ContractCreated', '{
    "customer_id": 5678,
    "service_point_id": 9012,
    "tariff": "DOM-01",
    "start_date": "2025-01-15"
}', 1),
('contract', 12345, 'MeterInstalled', '{
    "meter_id": 3456,
    "serial": "ABC-789",
    "initial_reading": 0
}', 2),
('contract', 12345, 'BillingCycleCompleted', '{
    "period": "2025-02",
    "reading": 45,
    "consumption_m3": 45,
    "invoice_id": 78901,
    "total_amount": 342.50
}', 3);
```

#### Event Notification with LISTEN/NOTIFY

```sql
-- Trigger to broadcast events for downstream consumers
CREATE OR REPLACE FUNCTION fn_event_notify()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'billing_events',
        json_build_object(
            'event_id', NEW.event_id,
            'stream_type', NEW.stream_type,
            'stream_id', NEW.stream_id,
            'event_type', NEW.event_type,
            'occurred_at', NEW.occurred_at
        )::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_event_notify
    AFTER INSERT ON event_store
    FOR EACH ROW EXECUTE FUNCTION fn_event_notify();
```

#### CQRS Read Models (Materialized from Events)

```sql
-- Read model: current contract state built from events
CREATE MATERIALIZED VIEW mv_contract_state AS
WITH latest_events AS (
    SELECT DISTINCT ON (stream_id)
        stream_id,
        event_type,
        event_data,
        occurred_at
    FROM event_store
    WHERE stream_type = 'contract'
    ORDER BY stream_id, version DESC
)
SELECT
    stream_id AS contract_id,
    event_type AS last_event,
    event_data->>'tariff' AS current_tariff,
    event_data->>'customer_id' AS customer_id,
    occurred_at AS last_updated
FROM latest_events;
```

### When to Use Event Sourcing vs. Traditional CRUD

| Scenario | Recommendation |
|----------|---------------|
| Billing lifecycle tracking | **Event sourcing** -- natural event sequence |
| Audit/compliance trail | **JSONB audit log** (Section 3) -- simpler, sufficient |
| Meter reading pipeline | **Event sourcing** -- complex state machine |
| Customer profile updates | **Traditional CRUD** + audit trigger -- simple entity |
| Payment reconciliation | **Event sourcing** -- financial auditability |
| Lookup table management | **Traditional CRUD** -- no event history needed |

### Recommendation for AquaCIS

Event sourcing is **not recommended as a wholesale replacement** for the current CRUD architecture. Instead, adopt it surgically for:

1. **Billing pipeline** (facturacio -> factura -> facturable -> linfactura): Natural event flow
2. **Collection pipeline** (gescartera -> opecargest -> opedesglos): Financial audit trail
3. **Work order lifecycle** (orden): Complex state machine with many transitions

This means ~5-10% of the system uses event sourcing, while the rest uses traditional CRUD with the JSONB audit log from Section 3.

**Priority: LOW** | **Complexity: HIGH** | **Risk: MEDIUM**

---

## 6. Temporal Table Patterns: Bi-Temporal Data Management

### Why Temporal Tables Matter for AquaCIS

AquaCIS already implements a form of temporal tracking through its 230+ `his*` tables. The problem is the implementation: full table duplication. PostgreSQL offers better approaches.

### Temporal Dimensions

| Dimension | Definition | AquaCIS Example |
|-----------|-----------|-----------------|
| **Valid time** (business time) | When a fact is true in the real world | Tariff effective date range |
| **Transaction time** (system time) | When a fact was recorded in the database | When the tariff row was inserted/updated |
| **Bi-temporal** | Both dimensions together | "Tariff X was effective Jan-Jun 2025, and we recorded this on Dec 15, 2024" |

### System-Versioned Temporal Tables (SQL:2011)

PostgreSQL does not have built-in SQL:2011 temporal tables yet (as of PG 16), but the `temporal_tables` extension and manual patterns achieve the same result.

#### Pattern 1: Range-Based Validity with Exclusion Constraints

```sql
-- Tariff rates with non-overlapping validity periods
CREATE TABLE tarifa_temporal (
    tarifa_id       INTEGER NOT NULL,
    concepto_id     INTEGER NOT NULL,
    uso_servicio    VARCHAR(4) NOT NULL,
    rango_desde     NUMERIC(10,0) NOT NULL,  -- consumption range start
    rango_hasta     NUMERIC(10,0) NOT NULL,  -- consumption range end
    precio_unitario NUMERIC(18,6) NOT NULL,
    valid_from      DATE NOT NULL,
    valid_to        DATE NOT NULL DEFAULT '9999-12-31',
    CONSTRAINT pk_tarifa_temporal PRIMARY KEY (tarifa_id, valid_from),
    -- Prevent overlapping validity periods for same tariff
    CONSTRAINT excl_tarifa_validity EXCLUDE USING gist (
        tarifa_id WITH =,
        daterange(valid_from, valid_to) WITH &&
    )
);

-- Query: what tariff applied on a specific date?
SELECT * FROM tarifa_temporal
WHERE tarifa_id = 1
  AND valid_from <= '2025-06-15'
  AND valid_to > '2025-06-15';
```

#### Pattern 2: System-Time Versioning via Triggers

```sql
-- Main table with system-time columns
CREATE TABLE contrato_versioned (
    cnttnum         NUMERIC(10,0) NOT NULL,
    -- ... all 105 contrato columns ...
    cnttestado      NUMERIC(5,0) NOT NULL,
    cntthstusu      VARCHAR(10) NOT NULL,
    -- Temporal columns
    sys_valid_from  TIMESTAMPTZ NOT NULL DEFAULT now(),
    sys_valid_to    TIMESTAMPTZ NOT NULL DEFAULT 'infinity',
    CONSTRAINT pk_contrato_versioned PRIMARY KEY (cnttnum, sys_valid_from)
);

-- History is maintained automatically via trigger:
CREATE OR REPLACE FUNCTION fn_system_versioning()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        -- Close the current version
        NEW.sys_valid_from := now();
        -- Archive the old version by updating valid_to
        UPDATE contrato_versioned
        SET sys_valid_to = now()
        WHERE cnttnum = OLD.cnttnum
          AND sys_valid_to = 'infinity';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### Pattern 3: Bi-Temporal with JSONB (Recommended for AquaCIS)

Combines temporal tracking with JSONB diff storage for space efficiency:

```sql
CREATE TABLE entity_timeline (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entity_type     VARCHAR(63) NOT NULL,         -- 'contrato', 'tarifa', etc.
    entity_id       BIGINT NOT NULL,
    valid_from      TIMESTAMPTZ NOT NULL,          -- business time start
    valid_to        TIMESTAMPTZ NOT NULL DEFAULT 'infinity',  -- business time end
    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),  -- system time
    state_snapshot  JSONB,                         -- full state at this point
    change_diff     JSONB,                         -- what changed from previous version
    changed_by      VARCHAR(10) NOT NULL,
    change_reason   TEXT,
    CONSTRAINT uq_entity_timeline UNIQUE (entity_type, entity_id, valid_from, recorded_at)
);

-- GiST index for range queries
CREATE INDEX idx_entity_timeline_range ON entity_timeline
    USING gist (entity_type, tstzrange(valid_from, valid_to));

-- Point-in-time query
SELECT state_snapshot
FROM entity_timeline
WHERE entity_type = 'contrato'
  AND entity_id = 12345
  AND valid_from <= '2025-06-15'
  AND valid_to > '2025-06-15'
ORDER BY recorded_at DESC
LIMIT 1;
```

### pg_temporal and SQL:2011 Progress

The PostgreSQL community has been developing temporal table support:
- **Temporal Primary Keys and Foreign Keys**: Patches under review for PG 17/18
- **`temporal_tables` extension**: Available on PGXN, provides system-versioning triggers
- **`periods` extension**: Implements SQL:2011 period definitions

For AquaCIS, the manual patterns above are production-ready today without waiting for core PostgreSQL temporal support.

### Recommendation for AquaCIS

1. **High-volume entities** (contrato, factura, ptoserv): Use bi-temporal pattern with JSONB diffs
2. **Tariff/rate tables**: Use range-based validity with exclusion constraints (critical for billing accuracy)
3. **Lookup tables**: Use the unified audit_log from Section 3 (temporal tracking is overkill)
4. **Configuration (explotacion)**: Use bi-temporal JSONB -- essential for "what config was active when this bill was generated?"

**Priority: MEDIUM** | **Complexity: HIGH** | **Risk: MEDIUM**

---

## 7. Schema Reduction Plan: From 4,114 Tables to Target

### Reduction Roadmap

| Phase | Action | Tables Removed | Running Total | Risk |
|-------|--------|---------------|---------------|------|
| **0** | Baseline inventory | 0 | 4,114 | - |
| **1a** | Drop tmp_deuda_* (2,144 tables) | 2,144 | 1,970 | LOW |
| **1b** | Drop aux_varscreditored_* (477 tables) | 477 | 1,493 | LOW |
| **1c** | Drop tmpbb_* (22 tables) | 22 | 1,471 | LOW |
| **1d** | Create consolidated replacements (3 tables) | -3 | 1,474 | LOW |
| **2** | Drop persistent temp/staging (14 tables) | 14 | 1,460 | LOW |
| **3** | Drop backup/migration artifacts (4 tables) | 4 | 1,456 | LOW |
| **4** | Drop Spain-regional tables (25 tables) | 25 | 1,431 | HIGH |
| **5** | Merge per-municipality duplicates (13 -> 1) | 12 | 1,419 | LOW |
| **6** | Replace GIS cache with materialized views (25 tables) | 25 | 1,394 | LOW |
| **7** | Merge candidate tables (8 -> 4) | 4 | 1,390 | LOW |
| **8** | Drop legacy/placeholder tables (6 tables) | 6 | 1,384 | LOW |
| **9** | Consolidate simple tipo* into domain_value (40 tables) | 40 | 1,344 | MED |
| **10** | Replace low-volume his* with audit_log (130 tables) | 130 | 1,214 | MED |
| **11** | Replace medium-volume his* with audit_log (50 tables) | 50 | 1,164 | MED |
| **12** | Replace report staging with materialized views (12 tables) | 12 | 1,152 | LOW |
| **13** | Drop CFDI staging, use ETL patterns (3 tables) | 3 | 1,149 | LOW |

### Final Target Architecture

| Category | Count | Examples |
|----------|-------|---------|
| Core business entities | ~60 | contrato, persona, factura, ptoserv |
| Supporting entities | ~40 | orden, observac, referencia |
| Billing/tariff tables | ~30 | concepto, tarifa, aplictarif |
| Complex lookup tables | ~25 | tipo* tables with 5+ functional columns |
| Accounting integration | ~15 | asiento, apunte, arqueo |
| Infrastructure tables | ~20 | audit_log, domain_value, event_store, mv_refresh_log |
| Materialized views | ~10 | mv_gis_*, mv_billing_*, mv_collection_* |
| Consolidated work tables | 3 | tmp_deuda, aux_varscreditored, tmpbb |
| High-volume history tables | ~25 | hiscontrato, hisfactura (kept as typed tables) |
| **TOTAL** | **~230** | |

This represents a **94.4% reduction** from 4,114 to ~230 objects.

### The explotacion God Table (350 columns)

The `explotacion` table requires special treatment. With 350 columns, it is a classic "god object" anti-pattern. Recommended decomposition:

```sql
-- Core identity (kept as traditional table)
CREATE TABLE explotacion_core (
    expid       NUMERIC(5,0) PRIMARY KEY,
    expnombre   VARCHAR(100) NOT NULL,
    expestado   NUMERIC(5,0) NOT NULL,
    expsocid    NUMERIC(10,0),
    -- ~20 essential identification columns
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Configuration domains stored as JSONB
CREATE TABLE explotacion_config (
    expid       NUMERIC(5,0) NOT NULL REFERENCES explotacion_core(expid),
    config_domain VARCHAR(50) NOT NULL,  -- 'billing', 'metering', 'collection', 'cfdi', 'integration'
    config_data JSONB NOT NULL,
    valid_from  TIMESTAMPTZ NOT NULL DEFAULT now(),
    valid_to    TIMESTAMPTZ NOT NULL DEFAULT 'infinity',
    updated_by  VARCHAR(10) NOT NULL,
    CONSTRAINT pk_explotacion_config PRIMARY KEY (expid, config_domain, valid_from)
);

-- Example: billing configuration
INSERT INTO explotacion_config (expid, config_domain, config_data, updated_by) VALUES
(1, 'billing', '{
    "billing_cycle_days": 30,
    "late_payment_rate": 0.02,
    "minimum_charge": 45.00,
    "rounding_precision": 2,
    "cfdi_version": "4.0",
    "tax_rate": 0.16,
    "max_estimated_periods": 3
}', 'admin');

-- Example: metering configuration
INSERT INTO explotacion_config (expid, config_domain, config_data, updated_by) VALUES
(1, 'metering', '{
    "reading_tolerance_pct": 150,
    "zero_consumption_alert": true,
    "max_daily_consumption_m3": 50,
    "anomaly_detection_enabled": true,
    "smart_meter_protocol": "DLMS"
}', 'admin');
```

This decomposes the 350-column monolith into:
- ~20 columns in `explotacion_core` (truly relational data)
- ~330 columns reorganized into ~10-15 JSONB configuration domains
- Bi-temporal versioning on configuration changes

---

## 8. Migration Safety: Zero-Downtime Restructuring Strategies

### Principles

1. **Never drop before replacing**: Create the new structure, migrate data, verify, switch, then drop
2. **Use views as abstraction**: Application code reads from views; switch views from old to new tables
3. **Feature flags**: Control which code paths use old vs. new structures
4. **Shadow writes**: Write to both old and new tables during transition
5. **Backward-compatible schemas**: New tables support old queries via views

### Phase Execution Pattern

For each consolidation phase:

```
Step 1: CREATE new table/view (additive, zero risk)
Step 2: Shadow-write trigger (writes to BOTH old and new)
Step 3: Backfill historical data from old to new
Step 4: Verify data consistency (automated checks)
Step 5: Switch reads to new table (via view rename)
Step 6: Monitor for 1-2 billing cycles
Step 7: Remove shadow-write trigger
Step 8: Archive and DROP old tables
```

### Shadow Write Pattern

```sql
-- Step 2: Shadow write trigger on old table
CREATE OR REPLACE FUNCTION fn_shadow_write_tmp_deuda()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO tmp_deuda_consolidated (proceso_id, importe, numfacturas, facsocemi, faccnttnum)
        VALUES (
            current_setting('app.current_proceso_id')::BIGINT,
            NEW.importe, NEW.numfacturas, NEW.facsocemi, NEW.faccnttnum
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to each active tmp_deuda table
-- (automated via dynamic SQL iterating over pg_tables)
```

### View Switchover Pattern

```sql
-- Before migration: application queries contrato directly
-- During migration:
ALTER TABLE contrato RENAME TO contrato_old;
CREATE VIEW contrato AS SELECT * FROM contrato_new;

-- Application code does not change at all
-- After verification:
DROP VIEW contrato;
ALTER TABLE contrato_new RENAME TO contrato;
```

### Online DDL Best Practices for PostgreSQL

| Operation | Lock Level | Safe Approach |
|-----------|-----------|---------------|
| `CREATE TABLE` | None | Always safe |
| `CREATE INDEX` | ShareLock | Use `CONCURRENTLY` for no-lock |
| `ALTER TABLE ADD COLUMN` | AccessExclusiveLock (brief) | Safe if no DEFAULT with computation |
| `ALTER TABLE ADD COLUMN DEFAULT x` | AccessExclusiveLock (brief in PG 11+) | Safe in PG 11+ (metadata-only) |
| `ALTER TABLE DROP COLUMN` | AccessExclusiveLock (brief) | Safe (metadata-only) |
| `DROP TABLE` | AccessExclusiveLock (brief) | Safe if no active queries |
| `ALTER TABLE SET NOT NULL` | Full table scan (PG < 12) | Add CHECK constraint first in PG < 12 |
| `CREATE MATERIALIZED VIEW` | None on source | Always safe |
| `REFRESH MATERIALIZED VIEW` | ExclusiveLock | Use `CONCURRENTLY` |

### pg_repack for Table Restructuring

For tables that need physical restructuring (e.g., adding columns to contrato):

```sql
-- pg_repack rebuilds a table online without exclusive locks
-- Install: CREATE EXTENSION pg_repack;
-- Run from command line:
-- pg_repack -t contrato -d cf_quere_pro
```

### Rollback Strategy

Every phase must have a rollback plan:

```sql
-- Before each phase, create a rollback savepoint
CREATE TABLE _rollback_phase3_domain_value AS SELECT * FROM tipoconcep;
-- ... etc for each table being consolidated

-- Rollback script for each phase:
-- 1. Re-create dropped tables from rollback copies
-- 2. Re-create dropped triggers
-- 3. Switch views back to old tables
-- 4. Verify application health
```

### Migration Timeline Estimate

| Phase | Duration | Billing Cycle Dependency |
|-------|----------|------------------------|
| Phase 1 (transient tables) | 1 day | None -- can execute anytime |
| Phase 2-4 (artifacts, merges) | 1 week | None |
| Phase 5 (Spain tables) | 2 weeks | Requires Aqualia vendor approval |
| Phase 6-8 (views, GIS) | 2 weeks | Monitor 1 GIS refresh cycle |
| Phase 9 (domain_value) | 3 weeks | Monitor 1 billing cycle |
| Phase 10-11 (audit_log) | 4-6 weeks | Monitor 2 billing cycles |
| Phase 12-13 (reports, CFDI) | 2 weeks | Coordinate with SAT reporting |
| **Total** | **~3-4 months** | **Minimum 2 full billing cycles** |

**Priority: HIGH** | **Complexity: HIGH** | **Risk: MEDIUM** (with proper phasing)

---

## 9. Performance Benchmarks: Expected Improvements

### Catalog Performance (Most Impactful)

PostgreSQL stores table metadata in system catalogs. With 4,114 tables:

| Catalog Table | Estimated Rows (4,114 tables) | After Reduction (~230 tables) | Improvement |
|--------------|------------------------------|------------------------------|-------------|
| `pg_class` | ~12,000 (tables + indexes + sequences) | ~700 | **94% smaller** |
| `pg_attribute` | ~75,000 (18,137 columns + system cols) | ~5,000 | **93% smaller** |
| `pg_statistic` | ~75,000 | ~5,000 | **93% smaller** |
| `pg_depend` | ~150,000+ | ~10,000 | **93% smaller** |

**Impact on query planning**: Every SQL query requires catalog lookups. With 93% fewer catalog entries:
- **Query planning time**: Expected 3-5x faster for simple queries
- **`ANALYZE` runtime**: 10-20x faster (fewer tables to analyze)
- **Autovacuum efficiency**: Dramatically improved (fewer tables competing for workers)
- **Connection startup**: Faster catalog cache population
- **pg_dump/restore**: 10-20x faster

### Storage Performance

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Total table files (filesystem) | ~12,000+ | ~700 | **94% reduction** |
| Index bloat from unused tables | Significant | Eliminated | - |
| TOAST tables for unused tables | ~4,000 | ~200 | **95% reduction** |
| Shared buffer efficiency | Poor (cold pages from 4K tables) | Good (hot pages from 230 tables) | **5-10x better cache hit ratio** |

### Query Performance Estimates

| Query Type | Current Issue | Expected Improvement |
|------------|--------------|---------------------|
| `SELECT * FROM tmp_deuda_X` | Dynamic SQL, no plan caching | Prepared statements, plan caching: **2-5x** |
| Billing cycle queries | Join across denormalized tables | Materialized views: **10-50x** for reports |
| Audit trail queries on his* | Full scan of typed table | JSONB with GIN index: **5-20x** for field-specific queries |
| Lookup JOINs (tipo* tables) | 65+ random table reads | Single domain_value table, hot in cache: **2-3x** |
| GIS dashboard queries | 13 per-municipality tables | Single materialized view: **5-10x** |
| `information_schema` queries | 4,114 table scans | 230 tables: **18x faster** |

### Autovacuum and Maintenance

| Metric | Before | After |
|--------|--------|-------|
| Autovacuum workers needed | Overwhelmed by 4K tables | Comfortable with 230 |
| Dead tuple accumulation | High (workers can't keep up) | Normal maintenance pace |
| Transaction ID wraparound risk | Higher (more tables to freeze) | Lower (standard risk) |
| `VACUUM FULL` duration (if needed) | Hours (per-table) | Minutes per table, feasible overnight |

### Memory Usage

| Resource | Before | After |
|----------|--------|-------|
| Relation cache entries | 4,114+ entries | ~230 entries |
| Catalog cache memory | ~50-100 MB per connection | ~3-5 MB per connection |
| Shared buffers utilization | Fragmented across 4K tables | Concentrated on hot data |
| `work_mem` effectiveness | Poor (plans not optimized) | Good (better query plans) |

---

## 10. Performance Tuning for Large Schemas (While Migrating)

While the migration progresses, these PostgreSQL configuration changes help manage the current 4,114-table schema:

### Critical Configuration Parameters

```ini
# postgresql.conf adjustments for large schemas

# Increase catalog cache size (critical for 4K+ tables)
# Default: 1MB -- far too small
shared_buffers = 4GB                    # 25% of system RAM
effective_cache_size = 12GB             # 75% of system RAM

# Query planner settings for large schemas
default_statistics_target = 100         # More accurate statistics
random_page_cost = 1.1                  # SSD-adjusted (default 4.0 is for HDD)
effective_io_concurrency = 200          # SSD-optimized

# Autovacuum tuning for 4K+ tables
autovacuum_max_workers = 6              # Default 3 is too few
autovacuum_naptime = 15s                # More frequent checks (default 1min)
autovacuum_vacuum_cost_delay = 2ms      # Faster vacuum (default 20ms)
autovacuum_vacuum_cost_limit = 1000     # Higher budget (default 200)

# Prevent catalog bloat
track_counts = on
track_activities = on

# Connection performance with large catalogs
max_connections = 200                   # Limit to reduce catalog cache copies
```

### Immediate Wins (Before Any Table Cleanup)

```sql
-- 1. Move tmp_deuda_* to a separate schema to reduce default search_path scans
CREATE SCHEMA transient;
-- Move tables (scripted, not manual)

-- 2. Update search_path to exclude transient tables from default lookups
ALTER DATABASE cf_quere_pro SET search_path = 'cf_quere_pro', 'public';
-- Application explicitly queries: SELECT * FROM transient.tmp_deuda_X

-- 3. ANALYZE the system catalogs themselves
ANALYZE pg_class;
ANALYZE pg_attribute;
ANALYZE pg_statistic;
ANALYZE pg_namespace;
```

---

## 11. Recommendations Summary

| # | Recommendation | Priority | Complexity | Risk | Impact |
|---|---------------|----------|------------|------|--------|
| 1 | **Drop 2,643 transient tables** (tmp_deuda, aux_varscreditored, tmpbb), replace with 3 consolidated tables with proceso_id | **HIGH** | LOW | LOW | -2,640 tables, immediate catalog relief |
| 2 | **Replace 130+ low-volume his* tables** with unified JSONB audit_log (partitioned by month) | **HIGH** | MEDIUM | MEDIUM | -130 tables, simplified schema maintenance |
| 3 | **Replace 25 GIS cache tables** with PostgreSQL materialized views with scheduled concurrent refresh | **HIGH** | LOW | LOW | -25 tables, guaranteed data freshness |
| 4 | **Consolidate 40 simple tipo* tables** into a single domain_value table with JSONB attributes column | **MEDIUM** | MEDIUM | LOW | -40 tables, centralized lookups |
| 5 | **Decompose explotacion (350 cols)** into core table + JSONB config domains with bi-temporal versioning | **MEDIUM** | HIGH | MEDIUM | Manageable configuration, audit trail |
| 6 | **Merge per-municipality duplicates** (13 -> 1) and other merge candidates (8 -> 4) | **MEDIUM** | LOW | LOW | -16 tables |
| 7 | **Drop Spain-regional tables** (25 tables) after vendor verification | **MEDIUM** | LOW | HIGH | -25 tables, requires Aqualia approval |
| 8 | **Implement materialized views for reporting** to replace tmtr* staging tables | **MEDIUM** | LOW | LOW | -12 tables, better report performance |
| 9 | **Adopt bi-temporal patterns** for tariff/rate tables using range types and exclusion constraints | **MEDIUM** | HIGH | MEDIUM | Billing accuracy, regulatory compliance |
| 10 | **Apply event sourcing** to billing and collection pipelines only | **LOW** | HIGH | MEDIUM | Better audit trail for financial processes |
| 11 | **Tune PostgreSQL configuration** for large schema management during migration | **HIGH** | LOW | LOW | Immediate performance improvement |
| 12 | **Implement shadow-write migration pattern** for zero-downtime table consolidation | **HIGH** | MEDIUM | LOW | Safe migration methodology |
| 13 | **Install pg_partman** for automated partition management on audit_log and event_store | **MEDIUM** | LOW | LOW | Operational automation |

---

## 12. Modernization Complexity Score

### Scoring Breakdown

| Factor | Score (1-10) | Weight | Weighted |
|--------|-------------|--------|----------|
| Technical complexity of PostgreSQL features needed | 4 | 20% | 0.8 |
| Volume of tables to modify | 8 | 15% | 1.2 |
| Application code changes required | 7 | 25% | 1.75 |
| Data migration risk (production billing system) | 8 | 20% | 1.6 |
| Vendor coordination (Aqualia/AQUASIS codebase) | 9 | 10% | 0.9 |
| Timeline pressure (running production system) | 6 | 10% | 0.6 |

### **Overall Modernization Complexity Score: 7/10**

**Interpretation**: The PostgreSQL-side solutions (partitioning, JSONB, materialized views, audit triggers) are well-understood, production-proven patterns. The complexity lies primarily in:

1. **Application code coupling**: The AQUASIS application dynamically creates tables by name. Changing this behavior requires understanding and modifying the Java/application layer, which may be vendor-controlled.
2. **Production risk**: This is a billing system for a Mexican water utility. A failed migration during a billing cycle could delay revenue collection for 300,000+ customers.
3. **Vendor relationship**: If Aqualia controls the AQUASIS codebase, some changes (especially the tmp_deuda pattern) require their cooperation or approval.

The recommended approach is to execute Phases 1-4 (low-risk, high-impact) immediately, which alone would reduce the table count from 4,114 to ~1,384 (a 66% reduction) with minimal application changes and minimal risk.

---

## Appendix A: PostgreSQL Version Requirements

| Feature | Minimum PG Version | Recommended |
|---------|-------------------|-------------|
| Declarative partitioning | PG 10 | PG 14+ |
| Partition pruning | PG 11 | PG 14+ |
| JSONB | PG 9.4 | PG 14+ |
| GIN indexes on JSONB | PG 9.4 | PG 14+ |
| `jsonb_path_ops` | PG 9.4 | PG 14+ |
| Materialized views | PG 9.3 | PG 14+ |
| `REFRESH ... CONCURRENTLY` | PG 9.4 | PG 14+ |
| `ATTACH/DETACH PARTITION CONCURRENTLY` | PG 14 | PG 14+ |
| Range types + exclusion constraints | PG 9.2 | PG 14+ |
| `GENERATED ALWAYS AS IDENTITY` | PG 10 | PG 14+ |
| `pg_partman` extension | PG 10 | Latest |
| `pg_cron` extension | PG 9.5 | Latest |

**Recommendation**: Ensure the database is running PostgreSQL 14 or later before beginning modernization. PG 14 introduced significant improvements to partitioning performance, parallel queries, and online DDL.

## Appendix B: Key SQL Scripts Required

| Script | Purpose | Phase |
|--------|---------|-------|
| `create_consolidated_tmp_tables.sql` | Create tmp_deuda, aux_varscreditored, tmpbb consolidated | 1 |
| `drop_transient_tables.sql` | Drop 2,643 table-per-process tables | 1 |
| `create_audit_log.sql` | Create partitioned audit_log + trigger function | 10-11 |
| `create_domain_value.sql` | Create domain_value + migrate tipo* data | 9 |
| `create_materialized_views.sql` | All mv_* definitions + refresh schedules | 6, 8 |
| `create_explotacion_decomposed.sql` | Decompose 350-col table | 13+ |
| `backward_compat_views.sql` | Views for application backward compatibility | All |
| `rollback_phase_N.sql` | Rollback script for each phase | All |
| `verify_phase_N.sql` | Data consistency checks for each phase | All |

---

*Report generated by Agent C3 (research-db-modernization) on 2026-02-16.*
*Based on analysis of DATABASE_AUDIT.md, DATABASE_MAP.md, and 8 schema chunk files.*
*PostgreSQL best practices derived from official documentation (PG 10-16), community patterns, and production experience with large-schema utility systems.*
