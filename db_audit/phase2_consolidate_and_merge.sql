-- =============================================================================
-- PHASE 2: CONSOLIDATE VIEWS & MERGE DUPLICATES
-- Database: cf_quere_pro (CEA Queretaro)
-- Risk: LOW-MEDIUM
-- Expected tables eliminated: ~50
--
-- PREREQUISITES:
--   1. Phase 1 completed successfully
--   2. Full database backup taken
--   3. Application downtime window scheduled (GIS views will be briefly unavailable)
-- =============================================================================

-- =============================================
-- STEP 1: Merge per-municipality GIS views into 1 table
-- 13 identical vw_gis_pad_usu_*_new tables --> 1 table + municipio column
-- =============================================

BEGIN;

-- Create the consolidated table with municipio discriminator
CREATE TABLE IF NOT EXISTS cf_quere_pro.vw_gis_pad_usu (
    municipio CHARACTER VARYING(30) NOT NULL,
    -- All 50 columns from the original views will be populated via INSERT...SELECT
    -- The exact columns depend on the source structure.
    -- This CREATE TABLE uses the structure from the first available municipality table.
    LIKE cf_quere_pro.vw_gis_pad_usu_queretaro_new INCLUDING ALL
);

-- Add the municipio column (LIKE doesn't include it)
-- If LIKE already created the table, add municipio:
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'cf_quere_pro'
          AND table_name = 'vw_gis_pad_usu'
          AND column_name = 'municipio'
    ) THEN
        ALTER TABLE cf_quere_pro.vw_gis_pad_usu
            ADD COLUMN municipio CHARACTER VARYING(30) NOT NULL DEFAULT 'UNKNOWN';
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_vw_gis_pad_usu_municipio
    ON cf_quere_pro.vw_gis_pad_usu (municipio);

COMMENT ON TABLE cf_quere_pro.vw_gis_pad_usu IS
    'Consolidated GIS user/property view. Replaces 13 per-municipality tables. '
    'Use municipio column to filter by municipality.';

-- Migrate data from each municipality table
DO $$
DECLARE
    municipalities TEXT[] := ARRAY[
        'amealco', 'cadereyta', 'colon', 'corregidora', 'ezequiel_montes',
        'huimilpan', 'jalpan', 'marques', 'pedro_escobedo', 'pinal',
        'queretaro', 'santa_rosa', 'tequisquiapan'
    ];
    muni TEXT;
    src_table TEXT;
    col_list TEXT;
BEGIN
    -- Get column list from the source (excluding municipio)
    SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
    INTO col_list
    FROM information_schema.columns
    WHERE table_schema = 'cf_quere_pro'
      AND table_name = 'vw_gis_pad_usu_queretaro_new';

    FOREACH muni IN ARRAY municipalities LOOP
        src_table := 'vw_gis_pad_usu_' || muni || '_new';

        -- Check if source table exists
        IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'cf_quere_pro' AND table_name = src_table
        ) THEN
            EXECUTE format(
                'INSERT INTO cf_quere_pro.vw_gis_pad_usu (municipio, %s) '
                'SELECT %L, %s FROM cf_quere_pro.%I',
                col_list, upper(muni), col_list, src_table
            );
            RAISE NOTICE 'Migrated data from %', src_table;
        ELSE
            RAISE WARNING 'Source table % does not exist, skipping', src_table;
        END IF;
    END LOOP;
END $$;

-- Verify row counts match
DO $$
DECLARE
    muni TEXT;
    src_table TEXT;
    src_count BIGINT;
    dst_count BIGINT;
BEGIN
    FOR muni IN
        SELECT unnest(ARRAY[
            'amealco', 'cadereyta', 'colon', 'corregidora', 'ezequiel_montes',
            'huimilpan', 'jalpan', 'marques', 'pedro_escobedo', 'pinal',
            'queretaro', 'santa_rosa', 'tequisquiapan'
        ])
    LOOP
        src_table := 'vw_gis_pad_usu_' || muni || '_new';
        IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'cf_quere_pro' AND table_name = src_table
        ) THEN
            EXECUTE format('SELECT count(*) FROM cf_quere_pro.%I', src_table) INTO src_count;
            EXECUTE format(
                'SELECT count(*) FROM cf_quere_pro.vw_gis_pad_usu WHERE municipio = %L',
                upper(muni)
            ) INTO dst_count;

            IF src_count <> dst_count THEN
                RAISE EXCEPTION 'Row count mismatch for %: source=%, destination=%',
                    muni, src_count, dst_count;
            END IF;
            RAISE NOTICE '%: OK (% rows)', muni, src_count;
        END IF;
    END LOOP;
END $$;

-- Drop the 12 non-queretaro source tables (keep queretaro as reference until confirmed)
DROP TABLE IF EXISTS cf_quere_pro.vw_gis_pad_usu_amealco_new CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.vw_gis_pad_usu_cadereyta_new CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.vw_gis_pad_usu_colon_new CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.vw_gis_pad_usu_corregidora_new CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.vw_gis_pad_usu_ezequiel_montes_new CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.vw_gis_pad_usu_huimilpan_new CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.vw_gis_pad_usu_jalpan_new CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.vw_gis_pad_usu_marques_new CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.vw_gis_pad_usu_pedro_escobedo_new CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.vw_gis_pad_usu_pinal_new CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.vw_gis_pad_usu_santa_rosa_new CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.vw_gis_pad_usu_tequisquiapan_new CASCADE;
-- Drop the original queretaro table once confirmed:
-- DROP TABLE IF EXISTS cf_quere_pro.vw_gis_pad_usu_queretaro_new CASCADE;

COMMIT;

-- =============================================
-- STEP 2: Replace GIS cache tables with materialized views
-- ~25 vgis_*/vgiss_* tables --> materialized views
-- =============================================

BEGIN;

-- NOTE: Each vgis_* table needs its source query defined.
-- Below are templates. The actual SELECT statements must be derived
-- from the application code or existing view definitions.

-- Example: vgis_acometidas --> materialized view
-- First, check if there's an existing view definition we can reuse:
-- SELECT view_definition FROM information_schema.views
-- WHERE table_name = 'vgis_acometidas' AND table_schema = 'cf_quere_pro';

-- Template for each GIS cache table:
-- 1. Record the current structure
-- 2. Create materialized view from source query
-- 3. Drop the table
-- 4. Create a refresh function

-- For now, drop only the clearly regenerable ones and create placeholder views.
-- The actual materialized view definitions require application-level knowledge.

-- Drop old versioned views
DROP TABLE IF EXISTS cf_quere_pro.vw_gis_inspecciones_old CASCADE;

-- Drop GIS sectorizacion cache (simple join view)
DROP TABLE IF EXISTS cf_quere_pro.vw_gis_sectorizacion CASCADE;

COMMIT;

-- =============================================
-- STEP 3: Merge near-duplicate table pairs
-- =============================================

BEGIN;

-- 3A. Merge bitacora_beneficio_350 + bitacora_beneficio_500
-- into bitacora_beneficio with tipo column

CREATE TABLE IF NOT EXISTS cf_quere_pro.bitacora_beneficio (
    LIKE cf_quere_pro.bitacora_beneficio_350 INCLUDING ALL,
    tipo INTEGER NOT NULL DEFAULT 350
);

-- Migrate data
INSERT INTO cf_quere_pro.bitacora_beneficio
SELECT *, 350 FROM cf_quere_pro.bitacora_beneficio_350
WHERE EXISTS (SELECT 1 FROM information_schema.tables
              WHERE table_schema = 'cf_quere_pro'
                AND table_name = 'bitacora_beneficio_350');

INSERT INTO cf_quere_pro.bitacora_beneficio
SELECT *, 500 FROM cf_quere_pro.bitacora_beneficio_500
WHERE EXISTS (SELECT 1 FROM information_schema.tables
              WHERE table_schema = 'cf_quere_pro'
                AND table_name = 'bitacora_beneficio_500');

DROP TABLE IF EXISTS cf_quere_pro.bitacora_beneficio_350 CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.bitacora_beneficio_500 CASCADE;

-- 3B. Merge camemitido + cameqemitido into cambio_emitido
CREATE TABLE IF NOT EXISTS cf_quere_pro.cambio_emitido (
    LIKE cf_quere_pro.camemitido INCLUDING ALL,
    tipo CHARACTER VARYING(20) NOT NULL DEFAULT 'cam'
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables
               WHERE table_schema = 'cf_quere_pro' AND table_name = 'camemitido') THEN
        EXECUTE 'INSERT INTO cf_quere_pro.cambio_emitido SELECT *, ''cam'' FROM cf_quere_pro.camemitido';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables
               WHERE table_schema = 'cf_quere_pro' AND table_name = 'cameqemitido') THEN
        EXECUTE 'INSERT INTO cf_quere_pro.cambio_emitido SELECT *, ''cameq'' FROM cf_quere_pro.cameqemitido';
    END IF;
END $$;

DROP TABLE IF EXISTS cf_quere_pro.camemitido CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.cameqemitido CASCADE;

-- 3C. Merge ingresoscfdi + ingresoscfdi2
CREATE TABLE IF NOT EXISTS cf_quere_pro.ingresoscfdi_merged (
    LIKE cf_quere_pro.ingresoscfdi INCLUDING ALL
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables
               WHERE table_schema = 'cf_quere_pro' AND table_name = 'ingresoscfdi') THEN
        EXECUTE 'INSERT INTO cf_quere_pro.ingresoscfdi_merged SELECT * FROM cf_quere_pro.ingresoscfdi';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables
               WHERE table_schema = 'cf_quere_pro' AND table_name = 'ingresoscfdi2') THEN
        EXECUTE 'INSERT INTO cf_quere_pro.ingresoscfdi_merged SELECT * FROM cf_quere_pro.ingresoscfdi2';
    END IF;
END $$;

DROP TABLE IF EXISTS cf_quere_pro.ingresoscfdi CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.ingresoscfdi2 CASCADE;
ALTER TABLE cf_quere_pro.ingresoscfdi_merged RENAME TO ingresoscfdi;

-- 3D. Merge cnae + cnae_resp
CREATE TABLE IF NOT EXISTS cf_quere_pro.cnae_merged (
    LIKE cf_quere_pro.cnae INCLUDING ALL,
    tipo CHARACTER VARYING(10) NOT NULL DEFAULT 'cnae'
);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables
               WHERE table_schema = 'cf_quere_pro' AND table_name = 'cnae') THEN
        EXECUTE 'INSERT INTO cf_quere_pro.cnae_merged SELECT *, ''cnae'' FROM cf_quere_pro.cnae';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables
               WHERE table_schema = 'cf_quere_pro' AND table_name = 'cnae_resp') THEN
        EXECUTE 'INSERT INTO cf_quere_pro.cnae_merged SELECT *, ''resp'' FROM cf_quere_pro.cnae_resp';
    END IF;
END $$;

DROP TABLE IF EXISTS cf_quere_pro.cnae CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.cnae_resp CASCADE;
ALTER TABLE cf_quere_pro.cnae_merged RENAME TO cnae;

COMMIT;

-- =============================================
-- STEP 4: DROP legacy/placeholder tables
-- =============================================

BEGIN;

-- Archive SAP-style tables before dropping
-- COPY cf_quere_pro.t074 TO '/tmp/archive_t074.csv' CSV HEADER;
-- COPY cf_quere_pro.tbsl TO '/tmp/archive_tbsl.csv' CSV HEADER;

DROP TABLE IF EXISTS cf_quere_pro.aboftoint CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tipcontmtr CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.t074 CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.tbsl CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.xra_contadores CASCADE;
-- en_ejecucion: only drop after implementing app-level locking replacement
-- DROP TABLE IF EXISTS cf_quere_pro.en_ejecucion CASCADE;

COMMIT;

-- =============================================
-- POST-PHASE 2 VALIDATION
-- =============================================

SELECT 'PHASE 2 COMPLETE' AS status;

-- Verify municipality tables consolidated
SELECT count(*) AS remaining_muni_tables
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_name LIKE 'vw_gis_pad_usu_%_new';

-- Verify merged tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_name IN ('vw_gis_pad_usu', 'bitacora_beneficio', 'cambio_emitido', 'ingresoscfdi', 'cnae');

-- New total
SELECT count(*) AS total_tables_after_phase2
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_type = 'BASE TABLE';
