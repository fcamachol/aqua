-- =============================================================================
-- PHASE 3: DOMAIN VALUE CONSOLIDATION
-- Database: cf_quere_pro (CEA Queretaro)
-- Risk: MEDIUM
-- Expected tables eliminated: ~35-40
--
-- PREREQUISITES:
--   1. Phases 1-2 completed successfully
--   2. Full database backup taken
--   3. Application code updated to use domain_value table for simple lookups
--   4. Regression testing completed on affected screens
-- =============================================================================

-- =============================================
-- STEP 1: Create the generic domain_value table
-- Replaces 35-40 simple (id + text_id) lookup tables
-- =============================================

BEGIN;

CREATE TABLE IF NOT EXISTS cf_quere_pro.domain_value (
    dv_id           SERIAL       PRIMARY KEY,
    dv_domain       VARCHAR(50)  NOT NULL,  -- e.g. 'tipobonif', 'tipocsc', 'tipomensaj'
    dv_code         VARCHAR(20)  NOT NULL,  -- the original cod/id value
    dv_txtid        NUMERIC(10,0),          -- FK to text/description table
    dv_description  VARCHAR(500),           -- denormalized description for convenience
    dv_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    dv_sort_order   INTEGER      DEFAULT 0,
    dv_extra_json   JSONB,                  -- for tipo* tables with 1-2 extra columns
    dv_hstusu       VARCHAR(10),
    dv_hsthora      TIMESTAMP    NOT NULL DEFAULT now(),
    UNIQUE (dv_domain, dv_code)
);

CREATE INDEX IF NOT EXISTS idx_domain_value_domain
    ON cf_quere_pro.domain_value (dv_domain);

CREATE INDEX IF NOT EXISTS idx_domain_value_domain_code
    ON cf_quere_pro.domain_value (dv_domain, dv_code);

COMMENT ON TABLE cf_quere_pro.domain_value IS
    'Consolidated lookup/domain value table. Replaces simple tipo* and estado* tables '
    'that had only (id, text_id) or (id, text_id, 1-2 extra columns). '
    'Domain column identifies the original table source.';

COMMIT;

-- =============================================
-- STEP 2: Identify candidate tipo* tables (simple structure)
-- Only migrate tables with <= 4 functional columns
-- Keep tables with 5+ functional columns as-is
-- =============================================

-- Discovery query: find simple tipo* tables
SELECT
    t.table_name,
    count(c.column_name) AS col_count,
    string_agg(c.column_name, ', ' ORDER BY c.ordinal_position) AS columns
FROM information_schema.tables t
JOIN information_schema.columns c
    ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE t.table_schema = 'cf_quere_pro'
  AND t.table_name ~ '^tipo'
  AND t.table_type = 'BASE TABLE'
GROUP BY t.table_name
HAVING count(c.column_name) <= 4
ORDER BY count(c.column_name), t.table_name;

-- =============================================
-- STEP 3: Migrate simple tipo* tables
-- Template for each table (repeat per table)
-- =============================================

-- Generic migration function
CREATE OR REPLACE FUNCTION cf_quere_pro.migrate_tipo_to_domain(
    p_source_table TEXT,
    p_domain_name TEXT,
    p_code_column TEXT,
    p_txtid_column TEXT DEFAULT NULL,
    p_desc_column TEXT DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
    v_sql TEXT;
BEGIN
    -- Verify source table exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'cf_quere_pro' AND table_name = p_source_table
    ) THEN
        RAISE WARNING 'Source table % does not exist, skipping', p_source_table;
        RETURN 0;
    END IF;

    -- Build dynamic INSERT
    v_sql := format(
        'INSERT INTO cf_quere_pro.domain_value (dv_domain, dv_code, dv_txtid, dv_description) '
        'SELECT %L, %I::TEXT, %s, %s '
        'FROM cf_quere_pro.%I '
        'ON CONFLICT (dv_domain, dv_code) DO NOTHING',
        p_domain_name,
        p_code_column,
        COALESCE(p_txtid_column, 'NULL'),
        COALESCE('(' || p_desc_column || ')::TEXT', 'NULL'),
        p_source_table
    );

    EXECUTE v_sql;
    GET DIAGNOSTICS v_count = ROW_COUNT;

    RAISE NOTICE 'Migrated % rows from % to domain_value (domain=%)',
        v_count, p_source_table, p_domain_name;

    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- STEP 4: Execute migrations for known simple tipo* tables
-- Uncomment and customize each migration call
-- =============================================

BEGIN;

-- Example migrations (customize column names per actual table structure):
-- Each tipo* table typically has: tipXXXcod (code), tipXXXtxtid (text ref)

-- SELECT cf_quere_pro.migrate_tipo_to_domain('tipobonif',    'tipobonif',    'tbnid',     'tbntxtid');
-- SELECT cf_quere_pro.migrate_tipo_to_domain('tipocsc',      'tipocsc',      'tcscid',    'tcsctxtid');
-- SELECT cf_quere_pro.migrate_tipo_to_domain('tipomensaj',   'tipomensaj',   'tmjid',     'tmjtxtid');
-- SELECT cf_quere_pro.migrate_tipo_to_domain('tipocarta',    'tipocarta',    'tcrtid',    'tcrttxtid');
-- SELECT cf_quere_pro.migrate_tipo_to_domain('tipodocum',    'tipodocum',    'tdcid',     'tdctxtid');
-- SELECT cf_quere_pro.migrate_tipo_to_domain('tipoimpues',   'tipoimpues',   'timid',     'timtxtid');
-- SELECT cf_quere_pro.migrate_tipo_to_domain('tipoliquid',   'tipoliquid',   'tlqid',     'tlqtxtid');
-- SELECT cf_quere_pro.migrate_tipo_to_domain('tipomovim',    'tipomovim',    'tmvid',     'tmvtxtid');
-- SELECT cf_quere_pro.migrate_tipo_to_domain('tiponif',      'tiponif',      'tnfid',     'tnftxtid');
-- SELECT cf_quere_pro.migrate_tipo_to_domain('tipoobs',      'tipoobs',      'tobid',     'tobtxtid');
-- SELECT cf_quere_pro.migrate_tipo_to_domain('tipopago',     'tipopago',     'tpgid',     'tpgtxtid');
-- SELECT cf_quere_pro.migrate_tipo_to_domain('tiporecla',    'tiporecla',    'trcid',     'trctxtid');
-- SELECT cf_quere_pro.migrate_tipo_to_domain('tiposancion',  'tiposancion',  'tsncid',    'tsnctxtid');
-- SELECT cf_quere_pro.migrate_tipo_to_domain('tipotarifa',   'tipotarifa',   'ttrid',     'ttrtxtid');
-- SELECT cf_quere_pro.migrate_tipo_to_domain('tipovarian',   'tipovarian',   'tvrid',     'tvrtxtid');

-- Verify migration counts
SELECT dv_domain, count(*) AS row_count
FROM cf_quere_pro.domain_value
GROUP BY dv_domain
ORDER BY dv_domain;

COMMIT;

-- =============================================
-- STEP 5: Create backward-compatible views
-- Allows existing queries to continue working during transition
-- =============================================

-- Template for creating compatibility views:
-- CREATE OR REPLACE VIEW cf_quere_pro.tipobonif AS
-- SELECT
--     dv_code::NUMERIC(5,0) AS tbnid,
--     dv_txtid AS tbntxtid
-- FROM cf_quere_pro.domain_value
-- WHERE dv_domain = 'tipobonif';

-- =============================================
-- STEP 6: Drop source tipo* tables
-- Only after application code is updated and tested
-- =============================================

-- Template (uncomment after validation):
-- DROP TABLE IF EXISTS cf_quere_pro.tipobonif CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.tipocsc CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.tipomensaj CASCADE;
-- ... etc

-- =============================================
-- STEP 7: Cleanup
-- =============================================

-- Drop the migration helper function when no longer needed
-- DROP FUNCTION IF EXISTS cf_quere_pro.migrate_tipo_to_domain;

-- =============================================
-- POST-PHASE 3 VALIDATION
-- =============================================

SELECT 'PHASE 3 COMPLETE' AS status;

-- Count migrated domains
SELECT count(DISTINCT dv_domain) AS domains_migrated,
       count(*) AS total_values
FROM cf_quere_pro.domain_value;

-- Remaining tipo* tables (should only be complex ones with 5+ columns)
SELECT table_name, col_count
FROM (
    SELECT t.table_name, count(c.column_name) AS col_count
    FROM information_schema.tables t
    JOIN information_schema.columns c
        ON t.table_name = c.table_name AND t.table_schema = c.table_schema
    WHERE t.table_schema = 'cf_quere_pro'
      AND t.table_name ~ '^tipo'
      AND t.table_type = 'BASE TABLE'
    GROUP BY t.table_name
) sub
ORDER BY col_count DESC, table_name;

SELECT count(*) AS total_tables_after_phase3
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_type = 'BASE TABLE';
