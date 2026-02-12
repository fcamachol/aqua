-- =============================================================================
-- PHASE 4: AUDIT LOG FOR HISTORY TABLES
-- Database: cf_quere_pro (CEA Queretaro)
-- Risk: MEDIUM-HIGH
-- Expected tables eliminated: ~100-180
--
-- PREREQUISITES:
--   1. Phases 1-3 completed successfully
--   2. Full database backup taken
--   3. Identify which his* tables are for lookup/reference (low-change)
--      vs. high-volume transactional tables
--   4. Application code updated to write to audit_log instead of his* tables
--   5. Extensive regression testing completed
-- =============================================================================

-- =============================================
-- STEP 1: Create the generic audit_log table
-- Replaces his* tables for low-change lookup/reference tables
-- =============================================

BEGIN;

CREATE TABLE IF NOT EXISTS cf_quere_pro.audit_log (
    al_id           BIGSERIAL    PRIMARY KEY,
    al_table_name   VARCHAR(100) NOT NULL,      -- original table name (e.g. 'tipobonif')
    al_record_key   TEXT         NOT NULL,       -- primary key value(s) of changed record
    al_operation     VARCHAR(10)  NOT NULL,       -- INSERT, UPDATE, DELETE
    al_old_data     JSONB,                       -- previous row state (NULL for INSERT)
    al_new_data     JSONB,                       -- new row state (NULL for DELETE)
    al_changed_cols TEXT[],                      -- list of columns that changed
    al_sesid        NUMERIC(10,0),               -- session ID (from sesion table)
    al_hstusu       VARCHAR(10),                 -- user who made the change
    al_hsthora      TIMESTAMP    NOT NULL DEFAULT now(),
    al_expid        NUMERIC(5,0)                 -- exploitation ID for partitioning
);

-- Partitioned index for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_log_table_ts
    ON cf_quere_pro.audit_log (al_table_name, al_hsthora DESC);

CREATE INDEX IF NOT EXISTS idx_audit_log_record
    ON cf_quere_pro.audit_log (al_table_name, al_record_key);

CREATE INDEX IF NOT EXISTS idx_audit_log_user
    ON cf_quere_pro.audit_log (al_hstusu, al_hsthora DESC);

COMMENT ON TABLE cf_quere_pro.audit_log IS
    'Generic audit log replacing his* tables for low-change lookup/reference tables. '
    'Stores change history as JSONB. High-volume entities (contrato, factura, ptoserv, '
    'persona, sociedad, explotacion) keep their dedicated his* tables.';

COMMIT;

-- =============================================
-- STEP 2: Create generic trigger function for audit logging
-- =============================================

CREATE OR REPLACE FUNCTION cf_quere_pro.fn_audit_log_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_old_data JSONB;
    v_new_data JSONB;
    v_changed  TEXT[];
    v_key      TEXT;
    v_user     TEXT;
BEGIN
    -- Get user from session context or current_user
    v_user := COALESCE(current_setting('app.current_user', true), current_user);

    IF TG_OP = 'DELETE' THEN
        v_old_data := to_jsonb(OLD);
        v_key := OLD::TEXT;  -- Will be overridden per-table

        INSERT INTO cf_quere_pro.audit_log
            (al_table_name, al_record_key, al_operation, al_old_data, al_hstusu)
        VALUES
            (TG_TABLE_NAME, v_key, 'DELETE', v_old_data, v_user);

        RETURN OLD;

    ELSIF TG_OP = 'UPDATE' THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
        v_key := NEW::TEXT;

        -- Identify changed columns
        SELECT array_agg(key)
        INTO v_changed
        FROM jsonb_each(v_new_data) n
        WHERE n.value IS DISTINCT FROM (v_old_data -> n.key);

        INSERT INTO cf_quere_pro.audit_log
            (al_table_name, al_record_key, al_operation, al_old_data, al_new_data, al_changed_cols, al_hstusu)
        VALUES
            (TG_TABLE_NAME, v_key, 'UPDATE', v_old_data, v_new_data, v_changed, v_user);

        RETURN NEW;

    ELSIF TG_OP = 'INSERT' THEN
        v_new_data := to_jsonb(NEW);
        v_key := NEW::TEXT;

        INSERT INTO cf_quere_pro.audit_log
            (al_table_name, al_record_key, al_operation, al_new_data, al_hstusu)
        VALUES
            (TG_TABLE_NAME, v_key, 'INSERT', v_new_data, v_user);

        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- STEP 3: Identify his* tables eligible for replacement
-- KEEP dedicated his* tables for high-volume entities
-- REPLACE his* tables for low-change lookup/reference tables
-- =============================================

-- Tables to KEEP (high-volume, complex history):
-- hiscontrato, hisfactura, hisfacturable, hisptoserv, hispersona,
-- hissociedad, hisexplotacion, hisservicio, hisacometida, hiscontador,
-- hisorden, hisopecargest, hislote, hispoldetsum, hiscliente

-- Discovery: find his* tables for simple lookup tables
SELECT
    h.table_name AS history_table,
    REPLACE(h.table_name, 'his', '') AS source_table,
    count(c.column_name) AS his_cols,
    (SELECT count(*) FROM information_schema.columns c2
     WHERE c2.table_schema = 'cf_quere_pro'
       AND c2.table_name = REPLACE(h.table_name, 'his', '')) AS source_cols
FROM information_schema.tables h
JOIN information_schema.columns c
    ON h.table_name = c.table_name AND h.table_schema = c.table_schema
WHERE h.table_schema = 'cf_quere_pro'
  AND h.table_name ~ '^his'
  AND h.table_type = 'BASE TABLE'
  -- Exclude high-volume entities
  AND h.table_name NOT IN (
      'hiscontrato', 'hisfactura', 'hisfacturable', 'hisptoserv', 'hispersona',
      'hissociedad', 'hisexplotacion', 'hisservicio', 'hisacometida', 'hiscontador',
      'hisorden', 'hisopecargest', 'hislote', 'hispoldetsum', 'hiscliente',
      'hisdireccion', 'hisreferencia', 'hismovccontrato', 'histarifa'
  )
GROUP BY h.table_name
ORDER BY count(c.column_name), h.table_name;

-- =============================================
-- STEP 4: Migrate historical data from his* to audit_log
-- Generic migration function
-- =============================================

CREATE OR REPLACE FUNCTION cf_quere_pro.migrate_history_to_audit_log(
    p_his_table TEXT,
    p_source_table TEXT DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
    v_source TEXT;
BEGIN
    v_source := COALESCE(p_source_table, REPLACE(p_his_table, 'his', ''));

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'cf_quere_pro' AND table_name = p_his_table
    ) THEN
        RAISE WARNING 'History table % does not exist, skipping', p_his_table;
        RETURN 0;
    END IF;

    -- Migrate all rows as UPDATE operations with full row as new_data
    EXECUTE format(
        'INSERT INTO cf_quere_pro.audit_log '
        '(al_table_name, al_record_key, al_operation, al_new_data, al_hstusu, al_hsthora) '
        'SELECT %L, '
        '       row_number() OVER ()::TEXT, '
        '       ''HISTORY'', '
        '       to_jsonb(t.*), '
        '       COALESCE(t.%I, ''migration''), '
        '       COALESCE(t.%I, now()) '
        'FROM cf_quere_pro.%I t',
        v_source,
        -- Try common column names for user/timestamp
        CASE WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'cf_quere_pro' AND table_name = p_his_table
              AND column_name LIKE '%hstusu'
        ) THEN (
            SELECT column_name FROM information_schema.columns
            WHERE table_schema = 'cf_quere_pro' AND table_name = p_his_table
              AND column_name LIKE '%hstusu' LIMIT 1
        ) ELSE 'al_hstusu' END,
        CASE WHEN EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'cf_quere_pro' AND table_name = p_his_table
              AND column_name LIKE '%hsthora'
        ) THEN (
            SELECT column_name FROM information_schema.columns
            WHERE table_schema = 'cf_quere_pro' AND table_name = p_his_table
              AND column_name LIKE '%hsthora' LIMIT 1
        ) ELSE 'al_hsthora' END,
        p_his_table
    );

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RAISE NOTICE 'Migrated % history rows from % to audit_log (source=%)',
        v_count, p_his_table, v_source;

    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- STEP 5: Execute migrations (uncomment per table after testing)
-- =============================================

-- Example migrations for low-change his* tables:
-- SELECT cf_quere_pro.migrate_history_to_audit_log('histipobonif');
-- SELECT cf_quere_pro.migrate_history_to_audit_log('histipocsc');
-- SELECT cf_quere_pro.migrate_history_to_audit_log('histipomensaj');
-- SELECT cf_quere_pro.migrate_history_to_audit_log('histipocarta');
-- SELECT cf_quere_pro.migrate_history_to_audit_log('histipoobs');
-- ... add more as identified in Step 3

-- =============================================
-- STEP 6: Attach audit triggers to source tables
-- (replaces the his* insert mechanism)
-- =============================================

-- Template for attaching trigger to each source table:
-- CREATE TRIGGER trg_audit_tipobonif
--     AFTER INSERT OR UPDATE OR DELETE ON cf_quere_pro.tipobonif
--     FOR EACH ROW EXECUTE FUNCTION cf_quere_pro.fn_audit_log_trigger();

-- =============================================
-- STEP 7: Drop migrated his* tables
-- Only after triggers are attached and tested
-- =============================================

-- Template (uncomment after validation):
-- DROP TABLE IF EXISTS cf_quere_pro.histipobonif CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.histipocsc CASCADE;
-- ... etc

-- =============================================
-- STEP 8: Add partitioning for audit_log performance
-- (Optional, recommended for production)
-- =============================================

-- Consider range partitioning by al_hsthora (monthly)
-- or list partitioning by al_table_name for hot tables

-- =============================================
-- POST-PHASE 4 VALIDATION
-- =============================================

SELECT 'PHASE 4 COMPLETE' AS status;

-- Audit log statistics
SELECT al_table_name, count(*) AS rows, min(al_hsthora), max(al_hsthora)
FROM cf_quere_pro.audit_log
GROUP BY al_table_name
ORDER BY count(*) DESC;

-- Remaining his* tables (should only be high-volume ones)
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_name ~ '^his'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

SELECT count(*) AS total_tables_after_phase4
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_type = 'BASE TABLE';

-- Cleanup migration function
-- DROP FUNCTION IF EXISTS cf_quere_pro.migrate_history_to_audit_log;
