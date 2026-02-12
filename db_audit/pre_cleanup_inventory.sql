-- =============================================================================
-- PRE-CLEANUP INVENTORY SNAPSHOT
-- Database: cf_quere_pro (CEA Queretaro)
-- Purpose: Capture baseline state BEFORE any cleanup operations
-- Run this FIRST, save output to a file for comparison after cleanup
-- =============================================================================

-- Create inventory schema to store snapshots
CREATE SCHEMA IF NOT EXISTS audit_inventory;

-- -----------------------------------------------------------------------------
-- 1. Full table inventory with row counts (estimated via pg_stat)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS audit_inventory.table_snapshot;

CREATE TABLE audit_inventory.table_snapshot AS
SELECT
    now()                                          AS snapshot_ts,
    n.nspname                                      AS schema_name,
    c.relname                                      AS table_name,
    c.relkind                                      AS table_kind,  -- 'r'=table, 'v'=view, 'm'=matview
    pg_stat_get_live_tuples(c.oid)                 AS est_row_count,
    pg_total_relation_size(c.oid)                  AS total_bytes,
    pg_size_pretty(pg_total_relation_size(c.oid))  AS total_size,
    (SELECT count(*)
     FROM information_schema.columns col
     WHERE col.table_schema = n.nspname
       AND col.table_name = c.relname)             AS column_count
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname IN ('cf_quere_pro', 'aux_migracion', 'public')
  AND c.relkind IN ('r', 'v', 'm')
ORDER BY n.nspname, c.relname;

-- -----------------------------------------------------------------------------
-- 2. Summary by category (pattern matching)
-- -----------------------------------------------------------------------------
SELECT 'SUMMARY BY CATEGORY' AS section;

SELECT
    CASE
        WHEN table_name ~ '^tmp_deuda_\d+'           THEN 'A1: tmp_deuda_*'
        WHEN table_name ~ '^aux_varscreditored_\d+'   THEN 'A2: aux_varscreditored_*'
        WHEN table_name ~ '^tmpbb_\d+'                THEN 'A3: tmpbb_*'
        WHEN table_name ~ '^tmp'                      THEN 'B: Named tmp* staging'
        WHEN table_name ~ '^zz_backup'                THEN 'C: Backup artifacts'
        WHEN table_name ~ '^liq'                      THEN 'D: Liquidation (Spain?)'
        WHEN table_name ~ '^vw_gis_pad_usu_'          THEN 'E: Per-municipality GIS'
        WHEN table_name ~ '^vgis[s]?_'                THEN 'F: GIS cache tables'
        WHEN table_name ~ '^his'                      THEN 'History tables (his*)'
        WHEN table_name ~ '^tipo'                     THEN 'Lookup tables (tipo*)'
        WHEN table_name ~ '^tmtr'                     THEN 'Report temp (tmtr*)'
        ELSE 'Core/Other'
    END AS category,
    count(*)                                        AS table_count,
    pg_size_pretty(sum(total_bytes))                AS total_size,
    sum(est_row_count)                              AS total_est_rows
FROM audit_inventory.table_snapshot
WHERE schema_name = 'cf_quere_pro'
GROUP BY 1
ORDER BY table_count DESC;

-- -----------------------------------------------------------------------------
-- 3. Overall stats
-- -----------------------------------------------------------------------------
SELECT 'OVERALL STATS' AS section;

SELECT
    count(*)                                                   AS total_tables,
    pg_size_pretty(sum(total_bytes))                            AS total_db_size,
    count(*) FILTER (WHERE table_name ~ '^tmp_deuda_\d+')      AS tmp_deuda_count,
    count(*) FILTER (WHERE table_name ~ '^aux_varscreditored')  AS aux_vars_count,
    count(*) FILTER (WHERE table_name ~ '^tmpbb_\d+')           AS tmpbb_count,
    count(*) FILTER (WHERE table_name ~ '^his')                 AS history_count,
    count(*) FILTER (WHERE table_name ~ '^tipo')                AS tipo_count
FROM audit_inventory.table_snapshot
WHERE schema_name = 'cf_quere_pro';

-- -----------------------------------------------------------------------------
-- 4. Foreign key dependency map for all tables
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS audit_inventory.fk_snapshot;

CREATE TABLE audit_inventory.fk_snapshot AS
SELECT
    tc.table_schema,
    tc.table_name       AS source_table,
    kcu.column_name     AS source_column,
    ccu.table_schema    AS target_schema,
    ccu.table_name      AS target_table,
    ccu.column_name     AS target_column,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema IN ('cf_quere_pro', 'aux_migracion', 'public');

-- -----------------------------------------------------------------------------
-- 5. Tables with zero rows (safe to drop candidates)
-- -----------------------------------------------------------------------------
SELECT 'EMPTY TABLES' AS section;

SELECT schema_name, table_name, column_count
FROM audit_inventory.table_snapshot
WHERE est_row_count = 0
  AND schema_name = 'cf_quere_pro'
  AND table_name NOT LIKE 'tmp_deuda_%'
  AND table_name NOT LIKE 'aux_varscreditored_%'
  AND table_name NOT LIKE 'tmpbb_%'
ORDER BY table_name;

-- -----------------------------------------------------------------------------
-- 6. Largest tables by size (potential optimization targets)
-- -----------------------------------------------------------------------------
SELECT 'TOP 50 LARGEST TABLES' AS section;

SELECT schema_name, table_name, total_size, est_row_count, column_count
FROM audit_inventory.table_snapshot
WHERE schema_name = 'cf_quere_pro'
ORDER BY total_bytes DESC
LIMIT 50;

SELECT 'Inventory snapshot complete. Results stored in audit_inventory schema.' AS status;
