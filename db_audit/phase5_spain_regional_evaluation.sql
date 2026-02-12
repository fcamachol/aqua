-- =============================================================================
-- PHASE 5: SPAIN REGIONAL TABLE EVALUATION
-- Database: cf_quere_pro (CEA Queretaro)
-- Risk: HIGH
-- Expected tables eliminated: ~25 (IF confirmed safe by Aqualia ERP team)
--
-- PREREQUISITES:
--   1. Phases 1-4 completed successfully
--   2. Written confirmation from Aqualia ERP team that these tables are NOT
--      required by the framework (even if unused in Mexico)
--   3. Full database backup taken
--   4. Application regression testing in staging environment
--
-- IMPORTANT: Do NOT execute this phase without explicit Aqualia confirmation.
-- The Aqualia ERP framework may reference these tables in its codebase even
-- if they contain no data for the Mexican deployment.
-- =============================================================================

-- =============================================
-- STEP 1: ANALYSIS - Inventory all Spain-specific tables
-- Run this to produce the evaluation report
-- =============================================

-- List all liq* tables with row counts and sizes
SELECT
    t.table_name,
    pg_stat_get_live_tuples(c.oid) AS est_rows,
    pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size,
    (SELECT count(*) FROM information_schema.columns col
     WHERE col.table_schema = t.table_schema AND col.table_name = t.table_name) AS columns,
    CASE
        WHEN t.table_name ~ 'balear'  THEN 'Baleares'
        WHEN t.table_name ~ 'galicia|galic|gali' THEN 'Galicia'
        WHEN t.table_name ~ 'murcia'  THEN 'Murcia'
        WHEN t.table_name ~ 'cat'     THEN 'Catalunya'
        WHEN t.table_name ~ 'canta'   THEN 'Cantabria'
        WHEN t.table_name ~ 'extr'    THEN 'Extremadura'
        WHEN t.table_name ~ 'pvasco'  THEN 'Pais Vasco'
        ELSE 'Other'
    END AS spanish_region
FROM information_schema.tables t
JOIN pg_class c ON c.relname = t.table_name
JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = t.table_schema
WHERE t.table_schema = 'cf_quere_pro'
  AND t.table_type = 'BASE TABLE'
  AND (
      t.table_name ~ 'balear'
      OR t.table_name ~ 'galicia|galic|gali'
      OR t.table_name ~ 'murcia'
      OR t.table_name ~ 'cat$|cat[^a-z]'
      OR t.table_name ~ 'canta'
      OR t.table_name ~ 'extr'
      OR t.table_name ~ 'pvasco'
  )
ORDER BY spanish_region, t.table_name;

-- =============================================
-- STEP 2: Check for FK references TO these tables
-- If any FK exists, the table is referenced and cannot be dropped
-- =============================================

SELECT
    ccu.table_name AS spain_table,
    tc.table_name AS referenced_by,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'cf_quere_pro'
  AND ccu.table_name IN (
      -- Baleares
      'liqanubaleares', 'liqcobbalear', 'liqcobpobbalear',
      'liqdetanubalear', 'liqdetpobbalear',
      -- Galicia
      'liqanugalicia', 'liqcobgalicia',
      'liqdetanugalic', 'liqaacfacgali', 'liqdatfacgali',
      'liqcarfacgali', 'liqdetfacgali', 'liqautocuadgali',
      -- Murcia
      'liqanumurcia', 'liqcobmurcia', 'liqdsimurcia', 'liqcuadmurcia',
      -- Catalunya
      'liqcobcat', 'liqcieanucat', 'liqcieabocat',
      'liqbloqcat', 'liqcobpostcat', 'liqdetvolcat',
      -- Cantabria
      'liqautocuadcanta',
      -- Extremadura
      'liqautocuadextr',
      -- Pais Vasco
      'varbonifpvasco'
  );

-- =============================================
-- STEP 3: Check for view/function references
-- =============================================

SELECT 'Views referencing Spain tables' AS check_type,
       v.table_name AS view_name,
       unnest(ARRAY[
           'liqanubaleares', 'liqcobbalear', 'liqanugalicia', 'liqcobgalicia',
           'liqanumurcia', 'liqcobmurcia', 'liqcobcat', 'varbonifpvasco'
       ]) AS spain_table
FROM information_schema.views v
WHERE v.table_schema = 'cf_quere_pro'
  AND v.view_definition SIMILAR TO '%(liqanu|liqcob|liqdet|liqcie|liqbloq|liqds|liqcuad|liqaac|liqdat|liqcar|liqautocuad|varbonif)%';

SELECT 'Functions referencing Spain tables' AS check_type,
       p.proname AS function_name
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'cf_quere_pro'
  AND pg_get_functiondef(p.oid) SIMILAR TO '%(liqanu|liqcob|liqdet|liqcie|liqbloq|liqds|liqcuad|liqaac|liqdat|liqcar|liqautocuad|varbonif)%';

-- =============================================
-- STEP 4: Verify all tables are empty (expected for Mexican deployment)
-- =============================================

DO $$
DECLARE
    spain_tables TEXT[] := ARRAY[
        'liqanubaleares', 'liqcobbalear', 'liqcobpobbalear',
        'liqdetanubalear', 'liqdetpobbalear',
        'liqanugalicia', 'liqcobgalicia', 'liqdetanugalic',
        'liqaacfacgali', 'liqdatfacgali', 'liqcarfacgali',
        'liqdetfacgali', 'liqautocuadgali',
        'liqanumurcia', 'liqcobmurcia', 'liqdsimurcia', 'liqcuadmurcia',
        'liqcobcat', 'liqcieanucat', 'liqcieabocat',
        'liqbloqcat', 'liqcobpostcat', 'liqdetvolcat',
        'liqautocuadcanta', 'liqautocuadextr',
        'varbonifpvasco'
    ];
    tbl TEXT;
    cnt BIGINT;
BEGIN
    FOREACH tbl IN ARRAY spain_tables LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'cf_quere_pro' AND table_name = tbl
        ) THEN
            EXECUTE format('SELECT count(*) FROM cf_quere_pro.%I', tbl) INTO cnt;
            IF cnt > 0 THEN
                RAISE WARNING 'TABLE % HAS % ROWS - DO NOT DROP WITHOUT REVIEW', tbl, cnt;
            ELSE
                RAISE NOTICE '%: empty (safe candidate)', tbl;
            END IF;
        ELSE
            RAISE NOTICE '%: does not exist (already removed?)', tbl;
        END IF;
    END LOOP;
END $$;

-- =============================================
-- STEP 5: DROP Spain-specific tables
-- ONLY execute after Aqualia ERP team confirmation
-- ONLY if all tables are empty and have no FK references
-- =============================================

-- UNCOMMENT ONLY AFTER AQUALIA CONFIRMATION:

-- BEGIN;

-- -- Baleares
-- DROP TABLE IF EXISTS cf_quere_pro.liqanubaleares CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqcobbalear CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqcobpobbalear CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqdetanubalear CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqdetpobbalear CASCADE;

-- -- Galicia
-- DROP TABLE IF EXISTS cf_quere_pro.liqanugalicia CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqcobgalicia CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqdetanugalic CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqaacfacgali CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqdatfacgali CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqcarfacgali CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqdetfacgali CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqautocuadgali CASCADE;

-- -- Murcia
-- DROP TABLE IF EXISTS cf_quere_pro.liqanumurcia CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqcobmurcia CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqdsimurcia CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqcuadmurcia CASCADE;

-- -- Catalunya
-- DROP TABLE IF EXISTS cf_quere_pro.liqcobcat CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqcieanucat CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqcieabocat CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqbloqcat CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqcobpostcat CASCADE;
-- DROP TABLE IF EXISTS cf_quere_pro.liqdetvolcat CASCADE;

-- -- Cantabria
-- DROP TABLE IF EXISTS cf_quere_pro.liqautocuadcanta CASCADE;

-- -- Extremadura
-- DROP TABLE IF EXISTS cf_quere_pro.liqautocuadextr CASCADE;

-- -- Pais Vasco
-- DROP TABLE IF EXISTS cf_quere_pro.varbonifpvasco CASCADE;

-- COMMIT;

-- =============================================
-- POST-PHASE 5 VALIDATION
-- =============================================

SELECT 'PHASE 5 ANALYSIS COMPLETE' AS status;

-- Remaining liq* tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_name LIKE 'liq%'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Final total
SELECT count(*) AS total_tables_final
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_type = 'BASE TABLE';

-- Compare with original inventory
SELECT
    'Original count' AS state,
    count(*) AS tables
FROM audit_inventory.table_snapshot
WHERE schema_name = 'cf_quere_pro'

UNION ALL

SELECT
    'Final count',
    count(*)
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_type = 'BASE TABLE';
