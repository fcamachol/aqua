-- =============================================================================
-- PHASE 1: DROP TRANSIENT TABLES
-- Database: cf_quere_pro (CEA Queretaro)
-- Risk: LOW
-- Expected tables eliminated: ~2,650
--
-- PREREQUISITES:
--   1. Run pre_cleanup_inventory.sql to capture baseline
--   2. Run verification_queries.sql Section B to confirm structure
--   3. Ensure no active billing/payment processes are running
--   4. Take a full database backup: pg_dump cf_quere_pro > backup_pre_phase1.sql
-- =============================================================================

BEGIN;

-- =============================================
-- STEP 1A: Create consolidated replacement tables FIRST
-- (so the application has somewhere to write)
-- =============================================

-- Consolidated tmp_deuda (replaces 2,144 individual tables)
CREATE TABLE IF NOT EXISTS cf_quere_pro.tmp_deuda (
    proceso_id  BIGINT       NOT NULL,  -- replaces the per-table suffix number
    importe     NUMERIC(18,2),
    numfacturas NUMERIC(10,0),
    facsocemi   NUMERIC(10,0),
    faccnttnum  NUMERIC(10,0),
    created_at  TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tmp_deuda_proceso
    ON cf_quere_pro.tmp_deuda (proceso_id);

COMMENT ON TABLE cf_quere_pro.tmp_deuda IS
    'Consolidated temp debt table. Replaces 2,144 individual tmp_deuda_NNNNNNN tables. '
    'Each former table is now rows partitioned by proceso_id.';

-- Consolidated aux_varscreditored (replaces ~477 individual tables)
CREATE TABLE IF NOT EXISTS cf_quere_pro.aux_varscreditored (
    proceso_id    BIGINT       NOT NULL,
    cnttnum       NUMERIC(10,0),
    impvariable   NUMERIC(18,2),
    impvaranterior NUMERIC(18,2),
    created_at    TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aux_varscreditored_proceso
    ON cf_quere_pro.aux_varscreditored (proceso_id);

COMMENT ON TABLE cf_quere_pro.aux_varscreditored IS
    'Consolidated credit variable staging table. Replaces ~477 individual '
    'aux_varscreditored_NNNNNNN tables. Partitioned by proceso_id.';

-- Consolidated tmpbb (replaces 22 individual tables)
-- Structure mirrors bajabonificacion (14 columns)
CREATE TABLE IF NOT EXISTS cf_quere_pro.tmpbb (
    proceso_id      BIGINT       NOT NULL,
    bbid            NUMERIC(10,0),
    bbexpid         NUMERIC(5,0),
    bbcnttnum       NUMERIC(10,0),
    bbcptoid        NUMERIC(5,0),
    bbtconid        NUMERIC(5,0),
    bbfecini        DATE,
    bbfecfin        DATE,
    bbimporte       NUMERIC(18,2),
    bbtipbonif      NUMERIC(5,0),
    bbfacidfact     NUMERIC(10,0),
    bbhstusu        CHARACTER VARYING(10),
    bbhsthora       TIMESTAMP,
    bbsesid         NUMERIC(10,0),
    bbobsid         NUMERIC(10,0),
    created_at      TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tmpbb_proceso
    ON cf_quere_pro.tmpbb (proceso_id);

COMMENT ON TABLE cf_quere_pro.tmpbb IS
    'Consolidated temp bajabonificacion table. Replaces 22 individual '
    'tmpbb_NNNNNNN tables. Partitioned by proceso_id.';

COMMIT;

-- =============================================
-- STEP 1B: DROP all tmp_deuda_* numbered tables
-- Uses dynamic SQL to handle 2,144 tables
-- =============================================

DO $$
DECLARE
    tbl_name TEXT;
    drop_count INT := 0;
BEGIN
    RAISE NOTICE 'Starting DROP of tmp_deuda_* tables at %', now();

    FOR tbl_name IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'cf_quere_pro'
          AND table_name ~ '^tmp_deuda_\d+'
        ORDER BY table_name
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS cf_quere_pro.%I CASCADE', tbl_name);
        drop_count := drop_count + 1;

        -- Progress logging every 500 tables
        IF drop_count % 500 = 0 THEN
            RAISE NOTICE 'Dropped % tmp_deuda tables so far...', drop_count;
        END IF;
    END LOOP;

    RAISE NOTICE 'Completed: Dropped % tmp_deuda_* tables', drop_count;
END $$;

-- =============================================
-- STEP 1C: DROP all aux_varscreditored_* numbered tables
-- =============================================

DO $$
DECLARE
    tbl_name TEXT;
    drop_count INT := 0;
BEGIN
    RAISE NOTICE 'Starting DROP of aux_varscreditored_* tables at %', now();

    FOR tbl_name IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'cf_quere_pro'
          AND table_name ~ '^aux_varscreditored_\d+'
        ORDER BY table_name
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS cf_quere_pro.%I CASCADE', tbl_name);
        drop_count := drop_count + 1;

        IF drop_count % 100 = 0 THEN
            RAISE NOTICE 'Dropped % aux_varscreditored tables so far...', drop_count;
        END IF;
    END LOOP;

    RAISE NOTICE 'Completed: Dropped % aux_varscreditored_* tables', drop_count;
END $$;

-- =============================================
-- STEP 1D: DROP all tmpbb_* numbered tables
-- =============================================

DO $$
DECLARE
    tbl_name TEXT;
    drop_count INT := 0;
BEGIN
    RAISE NOTICE 'Starting DROP of tmpbb_* tables at %', now();

    FOR tbl_name IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'cf_quere_pro'
          AND table_name ~ '^tmpbb_\d+'
        ORDER BY table_name
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS cf_quere_pro.%I CASCADE', tbl_name);
        drop_count := drop_count + 1;
    END LOOP;

    RAISE NOTICE 'Completed: Dropped % tmpbb_* tables', drop_count;
END $$;

-- =============================================
-- STEP 2: DROP persistent staging/temp tables
-- =============================================

BEGIN;

-- LOW risk staging tables (no active session dependency)
DROP TABLE IF EXISTS cf_quere_pro.tmpcntt CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmpcrr CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmpfac CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmpimpufact CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmplin CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmplinprecsubcon CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmpgeo CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmpmejdiaremcal CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.contratos_aplicacion_anticipo_masivo_tmp CASCADE;

-- MEDIUM risk: verify no active sessions before dropping
-- Check: SELECT count(*) FROM cf_quere_pro.tmpses WHERE tmpses_estado = 'ACTIVA';
DROP TABLE IF EXISTS cf_quere_pro.tmpses CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmpsesevtcliente CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmpsesmonproccanc CASCADE;

-- Verify no pending documents: SELECT count(*) FROM cf_quere_pro.tmp_gestordocumental;
DROP TABLE IF EXISTS cf_quere_pro.tmp_gestordocumental CASCADE;

-- Drop the temp table tracker LAST (after all other temps are gone)
DROP TABLE IF EXISTS cf_quere_pro.tablastmp CASCADE;

COMMIT;

-- =============================================
-- STEP 3: DROP backup/migration artifacts
-- =============================================

BEGIN;

-- Archive data before dropping (optional - uncomment to export first)
-- COPY cf_quere_pro.zz_backupexpedsif    TO '/tmp/archive_zz_backupexpedsif.csv' CSV HEADER;
-- COPY cf_quere_pro.zz_backuphisexpedsif TO '/tmp/archive_zz_backuphisexpedsif.csv' CSV HEADER;

DROP TABLE IF EXISTS cf_quere_pro.zz_backupexpedsif CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.zz_backuphisexpedsif CASCADE;
DROP TABLE IF EXISTS aux_migracion.apunte_maria CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.imagenmigradas CASCADE;

COMMIT;

-- =============================================
-- STEP 4: DROP report temp tables (tmtr* family)
-- =============================================

BEGIN;

DROP TABLE IF EXISTS cf_quere_pro.tmtranufac CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmtranupad CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmtranureg CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmtrautocuad CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmtrdetcob CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmtrdetfac CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmtrmtot CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmtrmtotpob CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tmtrsocliqrec CASCADE;

COMMIT;

-- =============================================
-- STEP 5: DROP CFDI staging tables
-- =============================================

BEGIN;

DROP TABLE IF EXISTS cf_quere_pro.ingresoscfdi_SAT CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.ingresoscfdi_detecno CASCADE;
DROP TABLE IF EXISTS cf_quere_pro."ingresosDepInterno" CASCADE;

COMMIT;

-- =============================================
-- POST-PHASE 1 VALIDATION
-- =============================================

SELECT 'PHASE 1 COMPLETE' AS status;

-- Verify transient patterns are gone
SELECT
    CASE
        WHEN table_name ~ '^tmp_deuda_\d+'           THEN 'tmp_deuda_*'
        WHEN table_name ~ '^aux_varscreditored_\d+'   THEN 'aux_varscreditored_*'
        WHEN table_name ~ '^tmpbb_\d+'                THEN 'tmpbb_*'
    END AS pattern,
    count(*) AS remaining
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND (table_name ~ '^tmp_deuda_\d+'
       OR table_name ~ '^aux_varscreditored_\d+'
       OR table_name ~ '^tmpbb_\d+')
GROUP BY 1;

-- New total table count
SELECT count(*) AS total_tables_after_phase1
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_type = 'BASE TABLE';

-- Verify replacement tables exist
SELECT table_name, 'EXISTS' AS status
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_name IN ('tmp_deuda', 'aux_varscreditored', 'tmpbb');
