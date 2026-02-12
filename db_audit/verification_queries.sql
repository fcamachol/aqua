-- =============================================================================
-- VERIFICATION QUERIES
-- Database: cf_quere_pro (CEA Queretaro)
-- Purpose: Pre-drop safety checks and post-cleanup validation
-- Run BEFORE each phase and AFTER to confirm results
-- =============================================================================

-- #############################################################################
-- SECTION A: PRE-DROP SAFETY CHECKS (Run before dropping ANY table)
-- #############################################################################

-- -----------------------------------------------------------------------------
-- A1. Check if a table has foreign key references pointing TO it
-- Replace '<TABLE_NAME>' with the target table
-- If this returns rows, the table CANNOT be safely dropped
-- -----------------------------------------------------------------------------
SELECT
    tc.table_schema,
    tc.table_name       AS referencing_table,
    kcu.column_name     AS referencing_column,
    ccu.table_name      AS referenced_table,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_name = '<TABLE_NAME>'
  AND ccu.table_schema = 'cf_quere_pro';

-- -----------------------------------------------------------------------------
-- A2. Check if a table has foreign key references FROM it (outgoing)
-- -----------------------------------------------------------------------------
SELECT
    tc.table_name       AS source_table,
    kcu.column_name     AS fk_column,
    ccu.table_name      AS referenced_table,
    ccu.column_name     AS referenced_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = '<TABLE_NAME>'
  AND tc.table_schema = 'cf_quere_pro';

-- -----------------------------------------------------------------------------
-- A3. Check row count before dropping (exact count for small tables)
-- -----------------------------------------------------------------------------
-- SELECT count(*) FROM cf_quere_pro.<TABLE_NAME>;

-- -----------------------------------------------------------------------------
-- A4. Check if table is referenced in any view definitions
-- -----------------------------------------------------------------------------
SELECT
    v.table_schema,
    v.table_name AS view_name,
    v.view_definition
FROM information_schema.views v
WHERE v.table_schema IN ('cf_quere_pro', 'public')
  AND v.view_definition LIKE '%<TABLE_NAME>%';

-- -----------------------------------------------------------------------------
-- A5. Check if table is referenced in any function/procedure bodies
-- -----------------------------------------------------------------------------
SELECT
    n.nspname AS schema,
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname IN ('cf_quere_pro', 'public')
  AND pg_get_functiondef(p.oid) LIKE '%<TABLE_NAME>%';

-- -----------------------------------------------------------------------------
-- A6. Check if table is referenced in any trigger definitions
-- -----------------------------------------------------------------------------
SELECT
    tg.tgname AS trigger_name,
    c.relname AS table_name,
    p.proname AS function_name
FROM pg_trigger tg
JOIN pg_class c ON c.oid = tg.tgrelid
JOIN pg_proc p ON p.oid = tg.tgfoid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'cf_quere_pro'
  AND pg_get_functiondef(p.oid) LIKE '%<TABLE_NAME>%';


-- #############################################################################
-- SECTION B: BATCH SAFETY CHECKS FOR PHASE 1 (Transient tables)
-- #############################################################################

-- -----------------------------------------------------------------------------
-- B1. Verify ALL tmp_deuda_* tables have identical structure (4 columns)
-- Any table with different structure needs manual review
-- -----------------------------------------------------------------------------
SELECT
    t.table_name,
    count(c.column_name) AS col_count,
    string_agg(c.column_name, ', ' ORDER BY c.ordinal_position) AS columns
FROM information_schema.tables t
JOIN information_schema.columns c
    ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE t.table_schema = 'cf_quere_pro'
  AND t.table_name ~ '^tmp_deuda_\d+'
GROUP BY t.table_name
HAVING count(c.column_name) <> 4
   OR string_agg(c.column_name, ', ' ORDER BY c.ordinal_position)
      <> 'faccnttnum, facsocemi, importe, numfacturas';

-- -----------------------------------------------------------------------------
-- B2. Verify ALL aux_varscreditored_* tables have identical structure (3 cols)
-- -----------------------------------------------------------------------------
SELECT
    t.table_name,
    count(c.column_name) AS col_count,
    string_agg(c.column_name, ', ' ORDER BY c.ordinal_position) AS columns
FROM information_schema.tables t
JOIN information_schema.columns c
    ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE t.table_schema = 'cf_quere_pro'
  AND t.table_name ~ '^aux_varscreditored_\d+'
GROUP BY t.table_name
HAVING count(c.column_name) <> 3
   OR string_agg(c.column_name, ', ' ORDER BY c.ordinal_position)
      <> 'cnttnum, impvaranterior, impvariable';

-- -----------------------------------------------------------------------------
-- B3. Verify ALL tmpbb_* tables have identical structure (14 cols)
-- -----------------------------------------------------------------------------
SELECT
    t.table_name,
    count(c.column_name) AS col_count
FROM information_schema.tables t
JOIN information_schema.columns c
    ON t.table_name = c.table_name AND t.table_schema = c.table_schema
WHERE t.table_schema = 'cf_quere_pro'
  AND t.table_name ~ '^tmpbb_\d+'
GROUP BY t.table_name
HAVING count(c.column_name) <> 14;

-- -----------------------------------------------------------------------------
-- B4. Sample row counts for transient tables (check if truly stale)
-- Run a random sample of 10 tables from each pattern
-- -----------------------------------------------------------------------------
DO $$
DECLARE
    tbl TEXT;
    cnt BIGINT;
BEGIN
    RAISE NOTICE '--- Sample tmp_deuda_* row counts ---';
    FOR tbl IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'cf_quere_pro'
          AND table_name ~ '^tmp_deuda_\d+'
        ORDER BY random()
        LIMIT 10
    LOOP
        EXECUTE format('SELECT count(*) FROM cf_quere_pro.%I', tbl) INTO cnt;
        RAISE NOTICE '%: % rows', tbl, cnt;
    END LOOP;

    RAISE NOTICE '--- Sample aux_varscreditored_* row counts ---';
    FOR tbl IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'cf_quere_pro'
          AND table_name ~ '^aux_varscreditored_\d+'
        ORDER BY random()
        LIMIT 10
    LOOP
        EXECUTE format('SELECT count(*) FROM cf_quere_pro.%I', tbl) INTO cnt;
        RAISE NOTICE '%: % rows', tbl, cnt;
    END LOOP;
END $$;


-- #############################################################################
-- SECTION C: POST-CLEANUP VALIDATION
-- #############################################################################

-- -----------------------------------------------------------------------------
-- C1. Overall table count (compare with pre-cleanup snapshot)
-- -----------------------------------------------------------------------------
SELECT
    table_schema,
    count(*) AS table_count
FROM information_schema.tables
WHERE table_schema IN ('cf_quere_pro', 'aux_migracion', 'public')
  AND table_type = 'BASE TABLE'
GROUP BY table_schema
ORDER BY table_schema;

-- -----------------------------------------------------------------------------
-- C2. Verify no orphaned foreign keys remain
-- (FK references to tables that no longer exist)
-- -----------------------------------------------------------------------------
SELECT
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    ccu.table_name AS references_table
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'cf_quere_pro'
  AND NOT EXISTS (
      SELECT 1
      FROM information_schema.tables t
      WHERE t.table_schema = ccu.table_schema
        AND t.table_name = ccu.table_name
  );

-- -----------------------------------------------------------------------------
-- C3. Verify replacement tables were created correctly
-- -----------------------------------------------------------------------------

-- Check consolidated tmp_deuda replacement
SELECT 'tmp_deuda_consolidated' AS check_table,
       EXISTS (
           SELECT 1 FROM information_schema.tables
           WHERE table_schema = 'cf_quere_pro'
             AND table_name = 'tmp_deuda'
       ) AS exists;

-- Check consolidated aux_varscreditored replacement
SELECT 'aux_varscreditored_consolidated' AS check_table,
       EXISTS (
           SELECT 1 FROM information_schema.tables
           WHERE table_schema = 'cf_quere_pro'
             AND table_name = 'aux_varscreditored'
       ) AS exists;

-- Check consolidated tmpbb replacement
SELECT 'tmpbb_consolidated' AS check_table,
       EXISTS (
           SELECT 1 FROM information_schema.tables
           WHERE table_schema = 'cf_quere_pro'
             AND table_name = 'tmpbb'
       ) AS exists;

-- -----------------------------------------------------------------------------
-- C4. Verify transient table patterns are gone
-- -----------------------------------------------------------------------------
SELECT 'Remaining tmp_deuda_*' AS pattern,
       count(*) AS remaining
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_name ~ '^tmp_deuda_\d+'

UNION ALL

SELECT 'Remaining aux_varscreditored_*',
       count(*)
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_name ~ '^aux_varscreditored_\d+'

UNION ALL

SELECT 'Remaining tmpbb_*',
       count(*)
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_name ~ '^tmpbb_\d+';

-- -----------------------------------------------------------------------------
-- C5. Compare table count delta per phase
-- (Uses audit_inventory.table_snapshot from pre_cleanup_inventory.sql)
-- -----------------------------------------------------------------------------
SELECT
    'Before cleanup' AS state,
    count(*) AS total_tables
FROM audit_inventory.table_snapshot
WHERE schema_name = 'cf_quere_pro'

UNION ALL

SELECT
    'After cleanup',
    count(*)
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_type = 'BASE TABLE';

-- -----------------------------------------------------------------------------
-- C6. Verify no broken views after cleanup
-- -----------------------------------------------------------------------------
DO $$
DECLARE
    v RECORD;
BEGIN
    FOR v IN
        SELECT table_schema, table_name
        FROM information_schema.views
        WHERE table_schema IN ('cf_quere_pro', 'public')
    LOOP
        BEGIN
            EXECUTE format('SELECT 1 FROM %I.%I LIMIT 0', v.table_schema, v.table_name);
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'Broken view: %.% - %', v.table_schema, v.table_name, SQLERRM;
        END;
    END LOOP;
    RAISE NOTICE 'View validation complete.';
END $$;
