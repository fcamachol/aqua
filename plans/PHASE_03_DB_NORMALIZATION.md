# Phase 3: Structural Fixes & Schema Normalization

> **Version**: 1.0
> **Date**: 2026-02-16
> **Phase Duration**: Months 4-8 (20 weeks / 10 sprints)
> **Database**: cf_quere_pro (CEA Queretaro Water Utility)
> **PostgreSQL Target**: 14+ with PostGIS, pgcrypto, btree_gist extensions
> **Prerequisite Phases**: Phase 1 (Emergency Cleanup), Phase 2 (History & Lookup Consolidation)
> **Risk Level**: HIGH -- This is the highest-risk phase of the entire optimization program

---

## 1. Phase Overview

### 1.1 Goal

Transform the AquaCIS database from a structurally unsound schema (~1,150 tables post-Phase 2) into a properly normalized, type-safe, referentially-intact database (~230 tables). This phase addresses the most deeply embedded technical debt: plaintext passwords, 250+ char(1) boolean columns, missing FK constraints, VARCHAR GPS coordinates, the 350-column god table (`explotacion`), the 105-column `contrato` table, and 25+ dead Spain-specific regional tables.

### 1.2 Target Outcomes

| Metric | Before (Post-Phase 2) | After (Post-Phase 3) | Improvement |
|--------|----------------------|---------------------|-------------|
| Table count | ~1,150 | ~230 | 80% reduction |
| Security vulnerabilities | 6+ plaintext password columns | 0 plaintext, all bcrypt | Critical fix |
| Boolean columns using char(1) | 250+ | 0 | Type safety |
| FK constraints | 0 | Full coverage across all domains | Referential integrity |
| Max columns per table | 350 (explotacion) | ~60 | Maintainability |
| GIS data type | VARCHAR(30) | PostGIS geometry(Point, 4326) | Spatial query support |
| Spain dead tables | 25+ | 0 | Schema cleanup |

### 1.3 Team

| Role | Headcount | Responsibilities |
|------|-----------|-----------------|
| **DBA Lead** | 1 | Migration script authoring, FK audit, partitioning, performance tuning |
| **Backend Developer 1** | 1 | Password hashing migration, boolean conversion, ORM/Hibernate entity updates |
| **Backend Developer 2** | 1 | God table decomposition, backward-compatible views, application query migration |
| **QA Engineer** | 1 | Regression testing, data integrity validation, performance benchmarking |
| **Solutions Architect** | 0.5 (shared) | Schema review, decomposition decisions, risk arbitration |

### 1.4 Prerequisites

- [ ] Phase 1 (Emergency Cleanup) completed and validated -- table count reduced to ~1,474
- [ ] Phase 2 (History & Lookup Consolidation) completed -- table count reduced to ~1,150
- [ ] Full database backup (pg_dump + WAL archival) taken immediately before Phase 3 start
- [ ] Staging environment provisioned with production-equivalent data volume
- [ ] Written confirmation from Aqualia ERP team regarding Spain-specific table removal
- [ ] Application codebase inventory: all SQL queries, Hibernate mappings, and stored procedures cataloged
- [ ] Maintenance windows scheduled: 2-hour windows for Sprints 1-2 (security), 4-hour windows for Sprints 5-8 (god table decomposition)
- [ ] Performance baseline metrics captured (query planning time, autovacuum cycle, pg_dump time, cache hit ratio)

---

## 2. Sprint 1-2 (Weeks 1-4): Security & Type Fixes

**Sprint Goal**: Eliminate all plaintext passwords, convert all char(1) S/N booleans to native PostgreSQL boolean, convert VARCHAR GPS to PostGIS geometry, and remove Spain-specific dead tables.

### 2.1 Replace Plaintext Passwords with bcrypt Hashing

**Context**: Six columns across three tables store passwords in cleartext (findings from A1, A3). This is a critical security vulnerability -- any database read access exposes all user credentials.

#### Task P3-001: Install pgcrypto extension

| Field | Value |
|-------|-------|
| **ID** | P3-001 |
| **Description** | Install pgcrypto extension to enable bcrypt password hashing via `crypt()` and `gen_salt()` functions |
| **Assignee** | DBA Lead |
| **Effort** | 1 hour |
| **Dependencies** | None |
| **Acceptance Criteria** | `SELECT crypt('test', gen_salt('bf', 10))` returns a valid bcrypt hash on both production and staging |

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

#### Task P3-002: Hash cliente.cliwebpass

| Field | Value |
|-------|-------|
| **ID** | P3-002 |
| **Description** | Migrate `cliente.cliwebpass` (varchar 10, plaintext) to bcrypt hash. Add new column, hash existing values, drop old column, rename. This is irreversible -- coordinate user communication for password resets. |
| **Assignee** | Backend Developer 1 |
| **Effort** | 8 hours |
| **Dependencies** | P3-001 |
| **Acceptance Criteria** | (1) No plaintext passwords remain in `cliente`. (2) `cliwebpass` column contains bcrypt hashes. (3) Application login validates via `crypt(input, stored_hash) = stored_hash`. (4) Users with NULL/empty passwords are unaffected. |

```sql
-- Step 1: Add hash column
ALTER TABLE cliente ADD COLUMN cliwebpass_hash VARCHAR(255);

-- Step 2: Hash existing passwords
UPDATE cliente SET cliwebpass_hash = crypt(cliwebpass, gen_salt('bf', 10))
WHERE cliwebpass IS NOT NULL AND cliwebpass != '';

-- Step 3: Drop old column and rename (after app code updated)
ALTER TABLE cliente DROP COLUMN cliwebpass;
ALTER TABLE cliente RENAME COLUMN cliwebpass_hash TO cliwebpass;
```

#### Task P3-003: Hash persona.prspassweb

| Field | Value |
|-------|-------|
| **ID** | P3-003 |
| **Description** | Migrate `persona.prspassweb` (varchar 10, plaintext) to bcrypt hash. Same pattern as P3-002. |
| **Assignee** | Backend Developer 1 |
| **Effort** | 6 hours |
| **Dependencies** | P3-001 |
| **Acceptance Criteria** | (1) No plaintext passwords remain in `persona`. (2) Column contains bcrypt hashes. (3) Application login validates correctly. |

```sql
ALTER TABLE persona ADD COLUMN prspassweb_hash VARCHAR(255);
UPDATE persona SET prspassweb_hash = crypt(prspassweb, gen_salt('bf', 10))
WHERE prspassweb IS NOT NULL AND prspassweb != '';
ALTER TABLE persona DROP COLUMN prspassweb;
ALTER TABLE persona RENAME COLUMN prspassweb_hash TO prspassweb;
```

#### Task P3-004: Migrate sociedad credentials to vault table

| Field | Value |
|-------|-------|
| **ID** | P3-004 |
| **Description** | Extract `sociedad` credential columns (`socpwdsms`, `socpwdcert`, `socpwdfirma`, `soctokenacua`) into a dedicated `sociedad_credentials` table with encrypted storage. These are service/API credentials, not user passwords, so they need reversible encryption rather than hashing. |
| **Assignee** | Backend Developer 1 |
| **Effort** | 12 hours |
| **Dependencies** | P3-001 |
| **Acceptance Criteria** | (1) `sociedad_credentials` table created with encrypted columns. (2) Original columns dropped from `sociedad`. (3) Application reads credentials from new table. (4) No plaintext credentials visible via SQL SELECT. |

```sql
CREATE TABLE sociedad_credentials (
    soc_id       NUMERIC(10,0) PRIMARY KEY REFERENCES sociedad(socprsid),
    sms_pass     VARCHAR(255),   -- encrypted at application level
    cert_pass    VARCHAR(255),   -- encrypted at application level
    firma_pass   VARCHAR(255),   -- encrypted at application level
    api_token    VARCHAR(255),   -- encrypted at application level
    updated_at   TIMESTAMPTZ DEFAULT now()
);

-- Populate from existing columns
INSERT INTO sociedad_credentials (soc_id, sms_pass, cert_pass, firma_pass, api_token)
SELECT socprsid, socpwdsms, socpwdcert, socpwdfirma, soctokenacua
FROM sociedad
WHERE socpwdsms IS NOT NULL
   OR socpwdcert IS NOT NULL
   OR socpwdfirma IS NOT NULL
   OR soctokenacua IS NOT NULL;

-- Drop old columns (after app migration)
ALTER TABLE sociedad DROP COLUMN socpwdsms;
ALTER TABLE sociedad DROP COLUMN socpwdcert;
ALTER TABLE sociedad DROP COLUMN socpwdfirma;
ALTER TABLE sociedad DROP COLUMN soctokenacua;
```

#### Task P3-005: Update application password verification logic

| Field | Value |
|-------|-------|
| **ID** | P3-005 |
| **Description** | Update all application authentication code to use bcrypt comparison (`crypt(input, stored_hash) = stored_hash`) instead of plaintext equality. Update sociedad credential access to read from `sociedad_credentials` with application-level decryption. |
| **Assignee** | Backend Developer 1 |
| **Effort** | 16 hours |
| **Dependencies** | P3-002, P3-003, P3-004 |
| **Acceptance Criteria** | (1) Login flow works end-to-end with bcrypt. (2) Password reset flow creates bcrypt hashes. (3) No SQL query anywhere compares plaintext passwords. (4) Sociedad API integrations work with new credential table. |

### 2.2 Convert 250+ char(1) S/N Columns to Boolean

**Context**: Over 250 columns across core tables use `char(1)` with values `'S'`/`'N'` (Spanish si/no) instead of PostgreSQL native boolean. This wastes storage, prevents proper indexing, allows invalid values, and confuses ORM mappings.

#### Task P3-006: Generate boolean conversion inventory

| Field | Value |
|-------|-------|
| **ID** | P3-006 |
| **Description** | Query all tables for `char(1)` columns with default `'S'::bpchar` or `'N'::bpchar`. Produce a CSV inventory: `table_name, column_name, default_value, null_count, distinct_values, row_count`. Prioritize by table: explotacion (~180 cols), contrato (~15), ptoserv (~12), sociedad (~8), facturacio (~5). |
| **Assignee** | DBA Lead |
| **Effort** | 4 hours |
| **Dependencies** | None |
| **Acceptance Criteria** | Complete inventory CSV with 250+ entries, validated distinct values (confirm only S/N/NULL, flag any Y/N/X outliers). |

```sql
SELECT
    c.table_name,
    c.column_name,
    c.column_default,
    c.is_nullable
FROM information_schema.columns c
WHERE c.table_schema = 'cf_quere_pro'
  AND c.data_type = 'character'
  AND c.character_maximum_length = 1
  AND (c.column_default LIKE '%S%' OR c.column_default LIKE '%N%')
ORDER BY c.table_name, c.column_name;
```

#### Task P3-007: Create boolean migration script with sync triggers

| Field | Value |
|-------|-------|
| **ID** | P3-007 |
| **Description** | For each char(1) S/N column, generate a migration script that: (1) adds a `_bool` boolean column, (2) populates it from the char(1) column, (3) creates a sync trigger to keep both columns in sync during transition, (4) after app migration, drops the old column and renames. Process in batches by table, starting with non-critical tables for validation. |
| **Assignee** | DBA Lead |
| **Effort** | 24 hours |
| **Dependencies** | P3-006 |
| **Acceptance Criteria** | (1) Generated migration script covers all 250+ columns. (2) Sync triggers maintain bidirectional consistency. (3) Script tested on staging for top-5 tables (explotacion, contrato, ptoserv, sociedad, facturacio). |

**Migration pattern per column** (example: `contrato.cnttsnformal`):

```sql
-- Step 1: Add boolean column
ALTER TABLE contrato ADD COLUMN cnttsnformal_bool BOOLEAN
    DEFAULT FALSE;

-- Step 2: Populate from char(1)
UPDATE contrato SET cnttsnformal_bool = (cnttsnformal = 'S');

-- Step 3: Sync trigger for transition period
CREATE OR REPLACE FUNCTION fn_sync_bool_cnttsnformal()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cnttsnformal IS DISTINCT FROM OLD.cnttsnformal THEN
        NEW.cnttsnformal_bool := (NEW.cnttsnformal = 'S');
    ELSIF NEW.cnttsnformal_bool IS DISTINCT FROM OLD.cnttsnformal_bool THEN
        NEW.cnttsnformal := CASE WHEN NEW.cnttsnformal_bool THEN 'S' ELSE 'N' END;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_bool_cnttsnformal
    BEFORE UPDATE ON contrato
    FOR EACH ROW EXECUTE FUNCTION fn_sync_bool_cnttsnformal();

-- Step 4: After app code migrated, drop old column
ALTER TABLE contrato DROP COLUMN cnttsnformal;
ALTER TABLE contrato RENAME COLUMN cnttsnformal_bool TO cnttsnformal;
DROP TRIGGER trg_sync_bool_cnttsnformal ON contrato;
DROP FUNCTION fn_sync_bool_cnttsnformal();
```

#### Task P3-008: Execute boolean conversion on explotacion (~180 columns)

| Field | Value |
|-------|-------|
| **ID** | P3-008 |
| **Description** | Execute the boolean migration script on `explotacion` table. This is the highest-volume conversion (approximately 180 char(1) columns). Execute during maintenance window. The explotacion table is low-row-count (typically < 100 rows per exploitation unit) so the migration itself is fast, but the column count makes it complex. |
| **Assignee** | DBA Lead |
| **Effort** | 8 hours |
| **Dependencies** | P3-007 |
| **Acceptance Criteria** | (1) All ~180 char(1) S/N columns on explotacion have corresponding `_bool` columns. (2) Sync triggers active. (3) No data loss verified by spot-checking 10 random columns. |

#### Task P3-009: Execute boolean conversion on remaining tables

| Field | Value |
|-------|-------|
| **ID** | P3-009 |
| **Description** | Execute the boolean migration script on `contrato` (~15 cols), `ptoserv` (~12 cols), `sociedad` (~8 cols), `facturacio` (~5 cols), and all remaining tables with char(1) S/N columns. |
| **Assignee** | DBA Lead |
| **Effort** | 12 hours |
| **Dependencies** | P3-007 |
| **Acceptance Criteria** | (1) All 250+ char(1) S/N columns across the database have boolean equivalents. (2) Sync triggers active on all tables. (3) Application regression tests pass. |

#### Task P3-010: Update application code for boolean columns

| Field | Value |
|-------|-------|
| **ID** | P3-010 |
| **Description** | Update Hibernate/JPA entity mappings, SQL queries, and stored procedures to use boolean columns instead of char(1) S/N. Coordinate with ORM team to update all `@Column` annotations. After all code migrated, execute Step 4 (drop old columns, rename, drop triggers). |
| **Assignee** | Backend Developer 1 |
| **Effort** | 40 hours |
| **Dependencies** | P3-008, P3-009 |
| **Acceptance Criteria** | (1) No application code references char(1) S/N columns. (2) All sync triggers dropped. (3) All old char(1) columns dropped. (4) Full regression test suite passes. |

### 2.3 Create Backward-Compatible Views for Boolean Conversion

#### Task P3-011: Create transition views for boolean columns

| Field | Value |
|-------|-------|
| **ID** | P3-011 |
| **Description** | Create views that present boolean columns as char(1) S/N for any legacy reporting or external integrations that cannot be updated immediately. Views should be named `v_<table>_legacy` and expose the original column names with `CASE WHEN bool_col THEN 'S' ELSE 'N' END` expressions. |
| **Assignee** | DBA Lead |
| **Effort** | 8 hours |
| **Dependencies** | P3-008, P3-009 |
| **Acceptance Criteria** | (1) Legacy views exist for explotacion, contrato, ptoserv, sociedad, facturacio. (2) Views return identical data to pre-migration state. (3) Views are documented with deprecation timeline. |

### 2.4 Convert VARCHAR GPS to PostGIS Geometry

**Context**: The `geolocalizacion` table stores latitude and longitude as `varchar(30)` columns (`geoloclat`, `geoloclong`). This prevents all spatial queries, distance calculations, and GIS integration (A4 finding).

#### Task P3-012: Install PostGIS extension

| Field | Value |
|-------|-------|
| **ID** | P3-012 |
| **Description** | Install PostGIS extension on production and staging databases. Verify spatial function availability. |
| **Assignee** | DBA Lead |
| **Effort** | 2 hours |
| **Dependencies** | None |
| **Acceptance Criteria** | `SELECT PostGIS_Version()` returns valid version on both environments. |

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

#### Task P3-013: Add geometry column and migrate GPS data

| Field | Value |
|-------|-------|
| **ID** | P3-013 |
| **Description** | Add a `geom` column of type `geometry(Point, 4326)` to `geolocalizacion`. Populate from existing varchar columns, filtering invalid/non-numeric values. Create GIST spatial index. Verify coordinate system standardization (WGS84). |
| **Assignee** | DBA Lead |
| **Effort** | 8 hours |
| **Dependencies** | P3-012 |
| **Acceptance Criteria** | (1) `geom` column populated for all rows with valid lat/long. (2) Spatial index created. (3) Invalid coordinates logged (not silently dropped). (4) `SELECT ST_AsText(geom) FROM geolocalizacion LIMIT 5` returns valid WKT. |

```sql
-- Add geometry column
ALTER TABLE geolocalizacion ADD COLUMN geom geometry(Point, 4326);

-- Populate from varchar columns (with validation)
UPDATE geolocalizacion
SET geom = ST_SetSRID(
    ST_MakePoint(geoloclong::double precision, geoloclat::double precision),
    4326)
WHERE geoloclong IS NOT NULL
  AND geoloclat IS NOT NULL
  AND geoloclong ~ '^-?\d+\.?\d*$'
  AND geoloclat ~ '^-?\d+\.?\d*$';

-- Log invalid coordinates
CREATE TABLE migration_log_gps_invalid AS
SELECT geolocalid, geoloclat, geoloclong, 'Invalid coordinate format' AS reason
FROM geolocalizacion
WHERE geom IS NULL
  AND (geoloclat IS NOT NULL OR geoloclong IS NOT NULL);

-- Create spatial index
CREATE INDEX idx_geolocalizacion_geom ON geolocalizacion USING GIST (geom);
```

#### Task P3-014: Update GIS queries to use PostGIS functions

| Field | Value |
|-------|-------|
| **ID** | P3-014 |
| **Description** | Update all application GIS queries to use PostGIS spatial functions (`ST_Distance`, `ST_Within`, `ST_DWithin`, `ST_Intersects`) instead of varchar-based coordinate comparisons. Update GIS layer integrations. |
| **Assignee** | Backend Developer 2 |
| **Effort** | 16 hours |
| **Dependencies** | P3-013 |
| **Acceptance Criteria** | (1) All GIS queries use PostGIS functions. (2) No query references `geoloclat`/`geoloclong` as varchar for spatial operations. (3) GIS map layer renders correctly. |

### 2.5 Remove Spain-Specific Dead Tables

**Context**: 25+ Spanish regional liquidation tables (`liqanubaleares`, `liqcobgalicia`, `liqanumurcia`, etc.) exist in the Mexican deployment. These tables serve no function and are expected to be empty (Phase 5 Spain Regional Evaluation audit).

#### Task P3-015: Validate Spain tables are empty and unreferenced

| Field | Value |
|-------|-------|
| **ID** | P3-015 |
| **Description** | Execute Phase 5 Spain Regional Evaluation script (`phase5_spain_regional_evaluation.sql`): verify all 25+ tables are empty, check for FK references, check for view/function references. Document any non-empty tables or references for review. |
| **Assignee** | DBA Lead |
| **Effort** | 4 hours |
| **Dependencies** | None |
| **Acceptance Criteria** | (1) Evaluation report generated. (2) All tables confirmed empty OR non-empty tables documented with escalation plan. (3) No FK references found. (4) No view/function references found. |

#### Task P3-016: Obtain Aqualia ERP team confirmation

| Field | Value |
|-------|-------|
| **ID** | P3-016 |
| **Description** | Send evaluation report to Aqualia ERP team. Obtain written confirmation that Spain-specific tables are not referenced by the framework codebase (even if unused in Mexico). If confirmation is denied or delayed, proceed with schema isolation fallback (P3-017). |
| **Assignee** | Solutions Architect |
| **Effort** | 4 hours (plus waiting time) |
| **Dependencies** | P3-015 |
| **Acceptance Criteria** | Written confirmation email/ticket from Aqualia ERP team, OR documented decision to use schema isolation. |

#### Task P3-017: Remove or isolate Spain tables

| Field | Value |
|-------|-------|
| **ID** | P3-017 |
| **Description** | If Aqualia confirms: DROP all 25+ Spain-specific tables. If Aqualia does not confirm or is delayed: move tables to `spain_legacy` schema and remove from default search_path. |
| **Assignee** | DBA Lead |
| **Effort** | 4 hours |
| **Dependencies** | P3-016 |
| **Acceptance Criteria** | (1) Tables either dropped or moved to `spain_legacy` schema. (2) No application errors from missing table references. (3) Post-validation query confirms table count reduction. |

**Option A: Drop (with Aqualia confirmation)**
```sql
BEGIN;
-- Baleares (5 tables)
DROP TABLE IF EXISTS cf_quere_pro.liqanubaleares CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcobbalear CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcobpobbalear CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqdetanubalear CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqdetpobbalear CASCADE;
-- Galicia (8 tables)
DROP TABLE IF EXISTS cf_quere_pro.liqanugalicia CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcobgalicia CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqdetanugalic CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqaacfacgali CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqdatfacgali CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcarfacgali CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqdetfacgali CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqautocuadgali CASCADE;
-- Murcia (4 tables)
DROP TABLE IF EXISTS cf_quere_pro.liqanumurcia CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcobmurcia CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqdsimurcia CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcuadmurcia CASCADE;
-- Catalunya (6 tables)
DROP TABLE IF EXISTS cf_quere_pro.liqcobcat CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcieanucat CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcieabocat CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqbloqcat CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcobpostcat CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqdetvolcat CASCADE;
-- Cantabria (1 table)
DROP TABLE IF EXISTS cf_quere_pro.liqautocuadcanta CASCADE;
-- Extremadura (1 table)
DROP TABLE IF EXISTS cf_quere_pro.liqautocuadextr CASCADE;
-- Pais Vasco (1 table)
DROP TABLE IF EXISTS cf_quere_pro.varbonifpvasco CASCADE;
COMMIT;
```

**Option B: Schema isolation (without Aqualia confirmation)**
```sql
CREATE SCHEMA IF NOT EXISTS spain_legacy;
ALTER TABLE liqanubaleares SET SCHEMA spain_legacy;
-- ... repeat for all 25+ tables
-- Remove from default search_path
ALTER DATABASE cf_quere_pro SET search_path TO cf_quere_pro, public;
```

### 2.6 Fix Double Precision for Monetary Values

#### Task P3-018: Convert linfactura monetary columns to NUMERIC

| Field | Value |
|-------|-------|
| **ID** | P3-018 |
| **Description** | Convert `linfactura.linfprefij`, `linfactura.linfprepro`, and `linfactura.linfaccant` from `double precision` to `numeric(18,6)` / `numeric(18,3)`. Double precision causes floating-point rounding errors in financial calculations (A2 finding). |
| **Assignee** | DBA Lead |
| **Effort** | 4 hours |
| **Dependencies** | None |
| **Acceptance Criteria** | (1) Columns converted to NUMERIC. (2) No data truncation (verify with before/after SUM comparison). (3) Billing calculations produce identical results. |

```sql
-- Verify no data loss before conversion
SELECT
    SUM(linfprefij) AS sum_prefij_before,
    SUM(linfprepro) AS sum_prepro_before,
    SUM(linfaccant) AS sum_accant_before
FROM linfactura;

ALTER TABLE linfactura ALTER COLUMN linfprefij TYPE numeric(18,6);
ALTER TABLE linfactura ALTER COLUMN linfprepro TYPE numeric(18,6);
ALTER TABLE linfactura ALTER COLUMN linfaccant TYPE numeric(18,3);

-- Verify after conversion
SELECT
    SUM(linfprefij) AS sum_prefij_after,
    SUM(linfprepro) AS sum_prepro_after,
    SUM(linfaccant) AS sum_accant_after
FROM linfactura;
```

### Sprint 1-2 Summary

| Task ID | Description | Assignee | Effort (hrs) | Dependencies |
|---------|-------------|----------|-------------|-------------|
| P3-001 | Install pgcrypto extension | DBA Lead | 1 | -- |
| P3-002 | Hash cliente.cliwebpass | Backend Dev 1 | 8 | P3-001 |
| P3-003 | Hash persona.prspassweb | Backend Dev 1 | 6 | P3-001 |
| P3-004 | Migrate sociedad credentials to vault table | Backend Dev 1 | 12 | P3-001 |
| P3-005 | Update app password verification logic | Backend Dev 1 | 16 | P3-002, P3-003, P3-004 |
| P3-006 | Generate boolean conversion inventory | DBA Lead | 4 | -- |
| P3-007 | Create boolean migration script with sync triggers | DBA Lead | 24 | P3-006 |
| P3-008 | Execute boolean conversion on explotacion | DBA Lead | 8 | P3-007 |
| P3-009 | Execute boolean conversion on remaining tables | DBA Lead | 12 | P3-007 |
| P3-010 | Update app code for boolean columns | Backend Dev 1 | 40 | P3-008, P3-009 |
| P3-011 | Create transition views for boolean columns | DBA Lead | 8 | P3-008, P3-009 |
| P3-012 | Install PostGIS extension | DBA Lead | 2 | -- |
| P3-013 | Add geometry column and migrate GPS data | DBA Lead | 8 | P3-012 |
| P3-014 | Update GIS queries to use PostGIS | Backend Dev 2 | 16 | P3-013 |
| P3-015 | Validate Spain tables are empty/unreferenced | DBA Lead | 4 | -- |
| P3-016 | Obtain Aqualia ERP team confirmation | Architect | 4 | P3-015 |
| P3-017 | Remove or isolate Spain tables | DBA Lead | 4 | P3-016 |
| P3-018 | Fix double precision monetary columns | DBA Lead | 4 | -- |
| | **Sprint 1-2 Total** | | **181 hours** | |

---

## 3. Sprint 3-4 (Weeks 5-8): FK Constraint Implementation

**Sprint Goal**: Audit all implied relationships across core tables and add FK constraints in dependency order, establishing referential integrity across the entire schema for the first time.

**Context**: The AquaCIS database has zero FK constraints (findings from A1, A2, A3, A4, A6, A7). All referential integrity is enforced at the application level, making the database vulnerable to orphan records, inconsistent deletions, and data corruption.

### 3.1 Audit Implied Relationships

#### Task P3-019: Catalog all implied FK relationships

| Field | Value |
|-------|-------|
| **ID** | P3-019 |
| **Description** | Audit the entire schema to catalog all implied FK relationships by analyzing: (1) column naming conventions (e.g., `cnttexpid` -> `explotacion.expid`), (2) Hibernate mapping files, (3) JOIN patterns in application queries, (4) domain knowledge from A1-A9 reports. Produce a dependency graph showing table relationships and constraint order. |
| **Assignee** | DBA Lead |
| **Effort** | 24 hours |
| **Dependencies** | None |
| **Acceptance Criteria** | (1) Complete FK relationship catalog with 200+ entries. (2) Dependency graph showing constraint creation order. (3) Each entry specifies: parent table, parent column, child table, child column, cascade rule recommendation. |

**Known core relationships** (from A1, A3 analysis):

| Parent Table | Parent Column | Child Table | Child Column | Cascade Rule |
|-------------|--------------|------------|-------------|-------------|
| `explotacion` | `expid` | `contrato` | `cnttexpid` | RESTRICT |
| `explotacion` | `expid` | `ptoserv` | `ptosexpid` | RESTRICT |
| `explotacion` | `expid` | `factura` | `facexpid` | RESTRICT |
| `persona` | `prsid` | `cliente` | `cliid` | RESTRICT |
| `cliente` | `cliid` | `contrato` | `cnttcliid` | RESTRICT |
| `contrato` | `cnttnum` | `factura` | `faccnttnum` | RESTRICT |
| `persona` | `prsid` | `contrato` | `cnttfprsid` | RESTRICT |
| `persona` | `prsid` | `contrato` | `cnttcprsid` | SET NULL |
| `persona` | `prsid` | `contrato` | `cntttpropid` | SET NULL |
| `persona` | `prsid` | `contrato` | `cnttinquid` | SET NULL |
| `ptoserv` | `ptosid` | `contrato` | `cnttptosid` | RESTRICT |
| `direccion` | `dirid` | `ptoserv` | `ptosdirid` | RESTRICT |
| `persona` | `prsid` | `personadir` | `pdprsid` | CASCADE |
| `direccion` | `dirid` | `personadir` | `pddirid` | RESTRICT |
| `persona` | `prsid` | `personatel` | `prtlprsid` | CASCADE |
| `persona` | `prsid` | `sociedad` | `socprsid` | RESTRICT |
| `facturacio` | `ftoid` | `factura` | `facftoid` | RESTRICT |
| `sociedad` | `socprsid` | `factura` | `facsocemi` | RESTRICT |
| `sociedad` | `socprsid` | `factura` | `facsocpro` | RESTRICT |

### 3.2 Detect and Handle Orphan Records

#### Task P3-020: Run orphan record detection queries

| Field | Value |
|-------|-------|
| **ID** | P3-020 |
| **Description** | For each implied FK relationship, run a LEFT JOIN / NOT EXISTS query to detect orphan records in the child table (rows referencing non-existent parent records). Log all orphans to `migration_log_orphans` table with table name, column name, orphan value, and row count. |
| **Assignee** | DBA Lead |
| **Effort** | 16 hours |
| **Dependencies** | P3-019 |
| **Acceptance Criteria** | (1) Orphan detection queries executed for all 200+ relationships. (2) `migration_log_orphans` table populated. (3) Summary report showing orphan count per relationship. |

```sql
CREATE TABLE migration_log_orphans (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    child_table VARCHAR(63) NOT NULL,
    child_col   VARCHAR(63) NOT NULL,
    parent_table VARCHAR(63) NOT NULL,
    parent_col  VARCHAR(63) NOT NULL,
    orphan_value TEXT,
    orphan_count BIGINT,
    detected_at TIMESTAMPTZ DEFAULT now(),
    resolution  VARCHAR(20) -- 'FIXED', 'ARCHIVED', 'NULLED', 'IGNORED'
);

-- Example: detect contrato rows referencing non-existent explotacion
INSERT INTO migration_log_orphans (child_table, child_col, parent_table, parent_col, orphan_value, orphan_count)
SELECT 'contrato', 'cnttexpid', 'explotacion', 'expid',
       cnttexpid::text, count(*)
FROM contrato c
WHERE NOT EXISTS (SELECT 1 FROM explotacion e WHERE e.expid = c.cnttexpid)
  AND c.cnttexpid IS NOT NULL
GROUP BY cnttexpid;
```

#### Task P3-021: Fix or archive orphan records

| Field | Value |
|-------|-------|
| **ID** | P3-021 |
| **Description** | For each set of orphan records found in P3-020, apply the appropriate resolution: (1) Fix: update FK value to valid parent. (2) Null: set FK column to NULL (for optional relationships). (3) Archive: move to `orphan_archive` schema for investigation. (4) Ignore: document exception and skip FK constraint for that relationship. |
| **Assignee** | DBA Lead + Solutions Architect |
| **Effort** | 24 hours |
| **Dependencies** | P3-020 |
| **Acceptance Criteria** | (1) All orphan records resolved (zero orphans for all relationships that will have FK constraints). (2) Resolution logged in `migration_log_orphans.resolution` column. (3) Archived records accessible in `orphan_archive` schema. |

```sql
CREATE SCHEMA IF NOT EXISTS orphan_archive;

-- Example: archive orphaned contrato rows
CREATE TABLE orphan_archive.contrato_orphaned_expid AS
SELECT * FROM contrato
WHERE NOT EXISTS (SELECT 1 FROM explotacion e WHERE e.expid = contrato.cnttexpid)
  AND cnttexpid IS NOT NULL;

-- Null out the orphaned FK (for optional relationships)
UPDATE contrato SET cnttcprsid = NULL
WHERE cnttcprsid IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM persona p WHERE p.prsid = contrato.cnttcprsid);
```

### 3.3 Add FK Constraints in Dependency Order

#### Task P3-022: Add FK constraints to reference/leaf tables first

| Field | Value |
|-------|-------|
| **ID** | P3-022 |
| **Description** | Add FK constraints starting from tables with no outbound FKs (pure reference tables like `idioma`, `zona`, `tipocontrato`, `tipoptoserv`, `emplazto`), then tables with only reference-table FKs, working up the dependency graph. This ensures parent tables are constrained before child tables attempt to reference them. |
| **Assignee** | DBA Lead |
| **Effort** | 16 hours |
| **Dependencies** | P3-021 |
| **Acceptance Criteria** | (1) All reference table FKs created without error. (2) Constraint validation passes (no deferred constraints in invalid state). |

```sql
-- Layer 0: Pure reference tables (no outbound FKs)
-- idioma, zona, tipocontrato, tipoptoserv, emplazto, etc.
-- No FKs to add TO these tables, but other tables will reference them.

-- Layer 1: Core entity tables
ALTER TABLE sociedad ADD CONSTRAINT fk_sociedad_persona
    FOREIGN KEY (socprsid) REFERENCES persona(prsid) ON DELETE RESTRICT;

ALTER TABLE cliente ADD CONSTRAINT fk_cliente_persona
    FOREIGN KEY (cliid) REFERENCES persona(prsid) ON DELETE RESTRICT;

-- Layer 2: Service/location tables
ALTER TABLE ptoserv ADD CONSTRAINT fk_ptoserv_direccion
    FOREIGN KEY (ptosdirid) REFERENCES direccion(dirid) ON DELETE RESTRICT;

ALTER TABLE ptoserv ADD CONSTRAINT fk_ptoserv_explotacion
    FOREIGN KEY (ptosexpid) REFERENCES explotacion(expid) ON DELETE RESTRICT;

ALTER TABLE ptoserv ADD CONSTRAINT fk_ptoserv_zona
    FOREIGN KEY (ptoszonid) REFERENCES zona(zoncodigo) ON DELETE RESTRICT;
```

#### Task P3-023: Add FK constraints to core business tables

| Field | Value |
|-------|-------|
| **ID** | P3-023 |
| **Description** | Add FK constraints to the core business tables: `contrato` (15+ FKs), `factura` (7+ FKs), `facturable`, `linfactura`, `movccontrato`, `polizacontrato`. These are the most complex tables with the most relationships. |
| **Assignee** | DBA Lead |
| **Effort** | 16 hours |
| **Dependencies** | P3-022 |
| **Acceptance Criteria** | (1) All core business table FKs created. (2) `contrato` has all 15+ FK constraints active. (3) `factura` has all 7+ FK constraints active. (4) Billing pipeline referential integrity verified. |

```sql
-- contrato FKs
ALTER TABLE contrato ADD CONSTRAINT fk_contrato_explotacion
    FOREIGN KEY (cnttexpid) REFERENCES explotacion(expid) ON DELETE RESTRICT;

ALTER TABLE contrato ADD CONSTRAINT fk_contrato_cliente
    FOREIGN KEY (cnttcliid) REFERENCES cliente(cliid) ON DELETE RESTRICT;

ALTER TABLE contrato ADD CONSTRAINT fk_contrato_ptoserv
    FOREIGN KEY (cnttptosid) REFERENCES ptoserv(ptosid) ON DELETE RESTRICT;

ALTER TABLE contrato ADD CONSTRAINT fk_contrato_persona_billing
    FOREIGN KEY (cnttfprsid) REFERENCES persona(prsid) ON DELETE RESTRICT;

ALTER TABLE contrato ADD CONSTRAINT fk_contrato_persona_corresp
    FOREIGN KEY (cnttcprsid) REFERENCES persona(prsid) ON DELETE SET NULL;

ALTER TABLE contrato ADD CONSTRAINT fk_contrato_persona_owner
    FOREIGN KEY (cntttpropid) REFERENCES persona(prsid) ON DELETE SET NULL;

ALTER TABLE contrato ADD CONSTRAINT fk_contrato_persona_tenant
    FOREIGN KEY (cnttinquid) REFERENCES persona(prsid) ON DELETE SET NULL;

-- factura FKs
ALTER TABLE factura ADD CONSTRAINT fk_factura_facturacio
    FOREIGN KEY (facftoid) REFERENCES facturacio(ftoid) ON DELETE RESTRICT;

ALTER TABLE factura ADD CONSTRAINT fk_factura_contrato
    FOREIGN KEY (faccnttnum) REFERENCES contrato(cnttnum) ON DELETE RESTRICT;

ALTER TABLE factura ADD CONSTRAINT fk_factura_cliente
    FOREIGN KEY (faccliid) REFERENCES cliente(cliid) ON DELETE RESTRICT;

ALTER TABLE factura ADD CONSTRAINT fk_factura_explotacion
    FOREIGN KEY (facexpid) REFERENCES explotacion(expid) ON DELETE RESTRICT;

ALTER TABLE factura ADD CONSTRAINT fk_factura_sociedad_emi
    FOREIGN KEY (facsocemi) REFERENCES sociedad(socprsid) ON DELETE RESTRICT;

ALTER TABLE factura ADD CONSTRAINT fk_factura_sociedad_pro
    FOREIGN KEY (facsocpro) REFERENCES sociedad(socprsid) ON DELETE RESTRICT;
```

#### Task P3-024: Add FK constraints to remaining domain tables

| Field | Value |
|-------|-------|
| **ID** | P3-024 |
| **Description** | Add FK constraints to all remaining domain tables: infrastructure (`acometida`, `servicio`, `contador`), collections (`movccontrato`, `deuda`), work orders (`lote`, `ordentrabajo`), person-related (`personadir`, `personatel`, `personacnae`), and all other tables with implied relationships. |
| **Assignee** | DBA Lead |
| **Effort** | 16 hours |
| **Dependencies** | P3-023 |
| **Acceptance Criteria** | (1) All identified FK relationships have constraints. (2) Zero orphan records across all constrained relationships. (3) Constraint count matches relationship catalog from P3-019. |

#### Task P3-025: Implement cascading rules per relationship type

| Field | Value |
|-------|-------|
| **ID** | P3-025 |
| **Description** | Review and set appropriate cascade rules for each FK constraint: `RESTRICT` for business-critical references (contract->explotacion, factura->contrato), `CASCADE` for ownership relationships (persona->personadir, persona->personatel), `SET NULL` for optional references (contrato->persona correspondence). Document each decision. |
| **Assignee** | DBA Lead + Solutions Architect |
| **Effort** | 8 hours |
| **Dependencies** | P3-024 |
| **Acceptance Criteria** | (1) Cascade rule documentation complete for all FK constraints. (2) Each rule justified with business rationale. (3) No CASCADE on business-critical deletion paths. |

**Cascade rule guidelines**:

| Relationship Type | Rule | Rationale |
|------------------|------|-----------|
| Contract -> Explotacion | RESTRICT | Cannot delete an exploitation unit with active contracts |
| Factura -> Contrato | RESTRICT | Cannot delete a contract with invoices |
| Persona -> PersonaDir | CASCADE | Deleting a person removes their address links |
| Persona -> PersonaTel | CASCADE | Deleting a person removes their phone records |
| Contrato -> Persona (correspondence) | SET NULL | Removing a correspondence person should not delete the contract |
| Contrato -> Persona (tenant) | SET NULL | Removing a tenant should not delete the contract |
| Contrato -> Persona (billing) | RESTRICT | Cannot delete the billing person for an active contract |

### Sprint 3-4 Summary

| Task ID | Description | Assignee | Effort (hrs) | Dependencies |
|---------|-------------|----------|-------------|-------------|
| P3-019 | Catalog all implied FK relationships | DBA Lead | 24 | -- |
| P3-020 | Run orphan record detection queries | DBA Lead | 16 | P3-019 |
| P3-021 | Fix or archive orphan records | DBA Lead + Architect | 24 | P3-020 |
| P3-022 | Add FK constraints to reference tables | DBA Lead | 16 | P3-021 |
| P3-023 | Add FK constraints to core business tables | DBA Lead | 16 | P3-022 |
| P3-024 | Add FK constraints to remaining domain tables | DBA Lead | 16 | P3-023 |
| P3-025 | Implement cascading rules per relationship | DBA Lead + Architect | 8 | P3-024 |
| | **Sprint 3-4 Total** | | **120 hours** | |

---

## 4. Sprint 5-8 (Weeks 9-16): God Table Decomposition

**Sprint Goal**: Decompose the 350-column `explotacion` god table into 10-14 domain-specific extension tables, extract embedded roles and configuration from the 105-column `contrato` table, and normalize scattered contact information in the `persona` domain.

**Context**: The `explotacion` table conflates 15 distinct functional domains into a single monolithic entity (A1 Section 5). The `contrato` table mixes lifecycle, billing, notifications, GDPR, and fiscal concerns (A1, A3). Contact information is scattered across 5+ locations (A3). These are the most impactful structural changes in the entire optimization program.

### 4.1 Decompose explotacion (350 cols -> 10-14 domain tables)

**Decomposition Strategy**: Use 1:1 extension tables sharing the PK `expid`. Each extension table owns a functional domain. A backward-compatible view `v_explotacion_full` JOINs all tables to preserve existing application behavior during migration.

#### Task P3-026: Design explotacion decomposition schema

| Field | Value |
|-------|-------|
| **ID** | P3-026 |
| **Description** | Finalize the column-to-table mapping for all 350 explotacion columns. Assign each column to exactly one domain table. Produce DDL for all new tables. Review with Solutions Architect. |
| **Assignee** | DBA Lead + Solutions Architect |
| **Effort** | 16 hours |
| **Dependencies** | None |
| **Acceptance Criteria** | (1) All 350 columns assigned to exactly one domain table. (2) DDL reviewed and approved. (3) No column left unmapped. (4) Domain boundaries documented with justification. |

**Proposed decomposition**:

| # | Proposed Table | Column Count | Domain | Priority |
|---|---------------|-------------|--------|----------|
| 1 | `explotacion` (core identity) | ~10 | Identity, dates, org structure, language, audit | HIGH |
| 2 | `explotacion_billing` | ~45 | Billing cycle, invoice generation, simulation, prefactura | HIGH |
| 3 | `explotacion_collections` | ~35 | Debt management, surcharges, grace periods, interest rates | HIGH |
| 4 | `explotacion_metering` | ~25 | Meter estimation rules, tolerance thresholds, reading config | HIGH |
| 5 | `explotacion_notifications` | ~25 | SMS, email, multimedia, auto-notification preferences | MEDIUM |
| 6 | `explotacion_cutoff` | ~20 | Disconnection rules, valve management, seasonal rules | MEDIUM |
| 7 | `explotacion_workorders` | ~20 | Lot generation, in-situ operations, operator rules | MEDIUM |
| 8 | `explotacion_digital` | ~20 | Platform integration, biometric, URL configuration | MEDIUM |
| 9 | `explotacion_remittance` | ~15 | Bank integration, SEPA, remittance timing | MEDIUM |
| 10 | `explotacion_gdpr` | ~15 | LOPD, RGPD, data sensitivity, audit flags | MEDIUM |
| 11 | `explotacion_fiscal` | ~10 | Tax exemptions, CFDI, VAT rules | LOW |
| 12 | `explotacion_quality` | ~10 | Complaints, inspection thresholds | LOW |
| 13 | `explotacion_gis` | ~8 | Map service, coordinate config, GIS flags | LOW |
| 14 | `explotacion_bonification` | ~8 | Subsidy assignment, social bonus rules | LOW |

**Core identity table** (retained as `explotacion`):
```sql
-- After decomposition, explotacion retains only identity columns
-- expid, expdescri, expfecha, expcodigo, expfecbaja, expregimen,
-- expelsid, expidiid, expsocgest, exphstusu, exphsthora
```

#### Task P3-027: Create explotacion extension tables (HIGH priority)

| Field | Value |
|-------|-------|
| **ID** | P3-027 |
| **Description** | Create the 4 HIGH-priority extension tables: `explotacion_billing`, `explotacion_collections`, `explotacion_metering`, and `explotacion_notifications`. Each table has `expid` as PK with FK to `explotacion(expid)`. Include audit columns (`hstusu`, `hsthora`). |
| **Assignee** | DBA Lead |
| **Effort** | 16 hours |
| **Dependencies** | P3-026 |
| **Acceptance Criteria** | (1) All 4 tables created with correct columns. (2) FK constraints to explotacion(expid). (3) Column types match original explotacion columns exactly. |

```sql
-- Example: explotacion_billing
CREATE TABLE explotacion_billing (
    expid           NUMERIC(5,0) PRIMARY KEY REFERENCES explotacion(expid),
    expdiasvencfact NUMERIC(5,0),
    expmaxmensfact  NUMERIC(5,0),
    expsncrearfact  BOOLEAN DEFAULT false,  -- converted from char(1)
    -- ... all ~45 billing columns
    hstusu          VARCHAR(10),
    hsthora         TIMESTAMPTZ DEFAULT now()
);
```

#### Task P3-028: Create explotacion extension tables (MEDIUM priority)

| Field | Value |
|-------|-------|
| **ID** | P3-028 |
| **Description** | Create the 6 MEDIUM-priority extension tables: `explotacion_cutoff`, `explotacion_workorders`, `explotacion_digital`, `explotacion_remittance`, `explotacion_gdpr`, and `explotacion_notifications`. |
| **Assignee** | DBA Lead |
| **Effort** | 12 hours |
| **Dependencies** | P3-026 |
| **Acceptance Criteria** | (1) All 6 tables created. (2) FK constraints active. (3) Column types match originals. |

#### Task P3-029: Create explotacion extension tables (LOW priority)

| Field | Value |
|-------|-------|
| **ID** | P3-029 |
| **Description** | Create the 4 LOW-priority extension tables: `explotacion_fiscal`, `explotacion_quality`, `explotacion_gis`, `explotacion_bonification`. |
| **Assignee** | DBA Lead |
| **Effort** | 8 hours |
| **Dependencies** | P3-026 |
| **Acceptance Criteria** | (1) All 4 tables created. (2) FK constraints active. (3) Column types match originals. |

#### Task P3-030: Populate explotacion extension tables from source

| Field | Value |
|-------|-------|
| **ID** | P3-030 |
| **Description** | Populate all 14 extension tables using `INSERT INTO ... SELECT` from the current monolithic `explotacion` table. Verify row counts match across all tables. Execute during maintenance window. |
| **Assignee** | DBA Lead |
| **Effort** | 8 hours |
| **Dependencies** | P3-027, P3-028, P3-029 |
| **Acceptance Criteria** | (1) All extension tables populated. (2) Row count in each extension table equals row count in explotacion. (3) Spot-check 10 random rows across 5 tables to verify data integrity. |

```sql
-- Example: populate billing extension
INSERT INTO explotacion_billing (expid, expdiasvencfact, expmaxmensfact, ...)
SELECT expid, expdiasvencfact, expmaxmensfact, ...
FROM explotacion;

-- Verify row counts
SELECT 'explotacion' AS tbl, count(*) FROM explotacion
UNION ALL
SELECT 'explotacion_billing', count(*) FROM explotacion_billing
UNION ALL
SELECT 'explotacion_collections', count(*) FROM explotacion_collections
-- ... all extension tables
;
```

#### Task P3-031: Create backward-compatible view v_explotacion_full

| Field | Value |
|-------|-------|
| **ID** | P3-031 |
| **Description** | Create a view `v_explotacion_full` that JOINs the core `explotacion` table with all 14 extension tables using `LEFT JOIN ... USING (expid)`. This view presents the identical column set as the original 350-column table, enabling zero-downtime application migration. |
| **Assignee** | DBA Lead |
| **Effort** | 8 hours |
| **Dependencies** | P3-030 |
| **Acceptance Criteria** | (1) View created with all 350 original columns. (2) `SELECT * FROM v_explotacion_full` returns identical results to `SELECT * FROM explotacion` (pre-decomposition). (3) View is updatable via INSTEAD OF triggers for write operations. |

```sql
CREATE OR REPLACE VIEW v_explotacion_full AS
SELECT
    e.*,
    b.expdiasvencfact, b.expmaxmensfact, b.expsncrearfact, -- billing cols
    c.expdiasgracia, c.exprecargo, c.expinteres,            -- collections cols
    m.exptolerancia, m.expmaxestim,                          -- metering cols
    n.expsms, n.expemail,                                    -- notification cols
    cu.expcorte, cu.expvalvula,                              -- cutoff cols
    w.explote, w.expinsitu,                                  -- workorder cols
    d.expurl, d.expbiometric,                                -- digital cols
    r.expsepa, r.expremesa,                                  -- remittance cols
    g.explopd, g.exprgpd,                                    -- gdpr cols
    f.expcfdi, f.expiva,                                     -- fiscal cols
    q.expqueja, q.expinspeccion,                             -- quality cols
    gi.expmapa, gi.expcoord,                                 -- gis cols
    bo.expsubsidio, bo.expbono                               -- bonification cols
FROM explotacion e
LEFT JOIN explotacion_billing b USING (expid)
LEFT JOIN explotacion_collections c USING (expid)
LEFT JOIN explotacion_metering m USING (expid)
LEFT JOIN explotacion_notifications n USING (expid)
LEFT JOIN explotacion_cutoff cu USING (expid)
LEFT JOIN explotacion_workorders w USING (expid)
LEFT JOIN explotacion_digital d USING (expid)
LEFT JOIN explotacion_remittance r USING (expid)
LEFT JOIN explotacion_gdpr g USING (expid)
LEFT JOIN explotacion_fiscal f USING (expid)
LEFT JOIN explotacion_quality q USING (expid)
LEFT JOIN explotacion_gis gi USING (expid)
LEFT JOIN explotacion_bonification bo USING (expid)
;

-- INSTEAD OF trigger for backward-compatible writes
CREATE OR REPLACE FUNCTION fn_v_explotacion_full_iud()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        UPDATE explotacion SET ... WHERE expid = NEW.expid;
        UPDATE explotacion_billing SET ... WHERE expid = NEW.expid;
        -- ... all extension tables
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO explotacion VALUES (...);
        INSERT INTO explotacion_billing VALUES (...);
        -- ... all extension tables
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Delete from extension tables first (FK order)
        DELETE FROM explotacion_billing WHERE expid = OLD.expid;
        -- ... all extension tables
        DELETE FROM explotacion WHERE expid = OLD.expid;
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_v_explotacion_full_iud
    INSTEAD OF INSERT OR UPDATE OR DELETE ON v_explotacion_full
    FOR EACH ROW EXECUTE FUNCTION fn_v_explotacion_full_iud();
```

#### Task P3-032: Drop decomposed columns from core explotacion

| Field | Value |
|-------|-------|
| **ID** | P3-032 |
| **Description** | After application migration is verified complete (all code uses either extension tables directly or the `v_explotacion_full` view), drop the decomposed columns from the core `explotacion` table. This reduces the core table from 350 to ~10 columns. Execute only after full regression testing. |
| **Assignee** | DBA Lead |
| **Effort** | 8 hours |
| **Dependencies** | P3-031, application migration verified |
| **Acceptance Criteria** | (1) Core `explotacion` has ~10 columns. (2) `v_explotacion_full` still returns all 350 columns correctly. (3) No application errors. (4) Billing cycle completes successfully. |

### 4.2 Extract contrato Embedded Roles and Config

#### Task P3-033: Design contrato decomposition schema

| Field | Value |
|-------|-------|
| **ID** | P3-033 |
| **Description** | Finalize column-to-table mapping for `contrato` (105 columns). Decompose into: `contrato` (core ~30 cols), `contrato_billing_config` (~15 cols), `contrato_notification` (~10 cols), `contrato_fiscal` (~8 cols), `contrato_compliance` (~6 cols). |
| **Assignee** | DBA Lead + Solutions Architect |
| **Effort** | 8 hours |
| **Dependencies** | None |
| **Acceptance Criteria** | (1) All 105 columns assigned. (2) DDL reviewed and approved. (3) Domain boundaries match A1/A3 findings. |

**Decomposition**:

| Target Table | Extracted Columns | Benefit |
|-------------|-------------------|---------|
| `contrato` (core) | ~30 cols: identity, state, parties, dates | Reduced lock contention |
| `contrato_billing_config` | ~15 cols: invoice type, copies, exemption, payment terms | Independent billing config changes |
| `contrato_notification` | ~10 cols: mail, SMS, push preferences, mobile, notification persons | Notification-only updates |
| `contrato_fiscal` | ~8 cols: CFDI pagador, receptor, fiscal, comprador | Mexico-specific fiscal roles |
| `contrato_compliance` | ~6 cols: GDPR anonymization, block, fraud, theft flags | Compliance isolation |

#### Task P3-034: Create contrato extension tables and populate

| Field | Value |
|-------|-------|
| **ID** | P3-034 |
| **Description** | Create 4 extension tables (`contrato_billing_config`, `contrato_notification`, `contrato_fiscal`, `contrato_compliance`), populate from existing `contrato`, verify row counts, create backward-compatible view `v_contrato_full`. |
| **Assignee** | DBA Lead |
| **Effort** | 16 hours |
| **Dependencies** | P3-033 |
| **Acceptance Criteria** | (1) All 4 extension tables created and populated. (2) Row counts match. (3) `v_contrato_full` returns identical results to original `contrato`. |

#### Task P3-035: Normalize contrato notification addresses (1NF fix)

| Field | Value |
|-------|-------|
| **ID** | P3-035 |
| **Description** | Replace the repeating notification columns (`cnttnotifprsid1`/`cnttnotifnumdir1`/`cnttnotifprsid2`/`cnttnotifnumdir2`) with a proper `contrato_notificacion` junction table. This fixes the 1NF violation identified in A1. |
| **Assignee** | Backend Developer 2 |
| **Effort** | 12 hours |
| **Dependencies** | P3-034 |
| **Acceptance Criteria** | (1) `contrato_notificacion` table created with composite PK. (2) Existing notification data migrated. (3) Notification queries return same results. (4) Application updated to use new table. |

```sql
CREATE TABLE contrato_notificacion (
    cn_cnttnum    NUMERIC(10,0) NOT NULL REFERENCES contrato(cnttnum),
    cn_seq        INTEGER NOT NULL,
    cn_prsid      NUMERIC(10,0) NOT NULL REFERENCES persona(prsid),
    cn_numdir     NUMERIC(5,0),
    cn_tipo       VARCHAR(10),        -- 'PRINCIPAL', 'SECUNDARIO'
    cn_activo     BOOLEAN DEFAULT true,
    PRIMARY KEY (cn_cnttnum, cn_seq)
);

-- Migrate existing data
INSERT INTO contrato_notificacion (cn_cnttnum, cn_seq, cn_prsid, cn_numdir, cn_tipo)
SELECT cnttnum, 1, cnttnotifprsid1, cnttnotifnumdir1, 'PRINCIPAL'
FROM contrato
WHERE cnttnotifprsid1 IS NOT NULL
UNION ALL
SELECT cnttnum, 2, cnttnotifprsid2, cnttnotifnumdir2, 'SECUNDARIO'
FROM contrato
WHERE cnttnotifprsid2 IS NOT NULL;
```

### 4.3 Normalize persona Contact Information

#### Task P3-036: Consolidate inline phones into personatel

| Field | Value |
|-------|-------|
| **ID** | P3-036 |
| **Description** | Migrate the 4 inline phone columns from `persona` (`prstelef`, `prstelef2`, `prstelef3`, `prstelef4`) plus `prsfax` into the existing `personatel` table. This consolidates 5+ scattered contact locations (A3 finding) into a single, normalized phone table. |
| **Assignee** | Backend Developer 2 |
| **Effort** | 12 hours |
| **Dependencies** | None |
| **Acceptance Criteria** | (1) All non-null inline phones migrated to `personatel`. (2) No duplicate entries created. (3) Phone types correctly assigned (FIJO, MOVIL, FAX). (4) Original columns can be dropped after app migration. |

```sql
-- Deduplicate: only insert if phone not already in personatel
INSERT INTO personatel (prtlprsid, prtltelefono, prtltipo, prtlautorizado)
SELECT prsid, prstelef, 'FIJO', 'S' FROM persona
WHERE prstelef IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM personatel pt
      WHERE pt.prtlprsid = persona.prsid AND pt.prtltelefono = persona.prstelef
  )
UNION ALL
SELECT prsid, prstelef2, 'FIJO', 'S' FROM persona
WHERE prstelef2 IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM personatel pt
      WHERE pt.prtlprsid = persona.prsid AND pt.prtltelefono = persona.prstelef2
  )
UNION ALL
SELECT prsid, prstelef3, 'MOVIL', 'S' FROM persona
WHERE prstelef3 IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM personatel pt
      WHERE pt.prtlprsid = persona.prsid AND pt.prtltelefono = persona.prstelef3
  )
UNION ALL
SELECT prsid, prstelef4, 'MOVIL', 'S' FROM persona
WHERE prstelef4 IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM personatel pt
      WHERE pt.prtlprsid = persona.prsid AND pt.prtltelefono = persona.prstelef4
  );
```

#### Task P3-037: Create personaemail entity

| Field | Value |
|-------|-------|
| **ID** | P3-037 |
| **Description** | Create a `personaemail` table to store email addresses. AquaCIS currently has no dedicated email entity (critical gap from A3). Populate from any existing email data found in webcliente or application logs. |
| **Assignee** | Backend Developer 2 |
| **Effort** | 8 hours |
| **Dependencies** | None |
| **Acceptance Criteria** | (1) `personaemail` table created with FK to persona. (2) Supports multiple email types (PERSONAL, TRABAJO, FACTURACION). (3) Includes verification and active flags. (4) Existing email data migrated. |

```sql
CREATE TABLE personaemail (
    pe_id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pe_prsid      NUMERIC(10,0) NOT NULL REFERENCES persona(prsid),
    pe_email      VARCHAR(255) NOT NULL,
    pe_tipo       VARCHAR(20) NOT NULL,   -- 'PERSONAL', 'TRABAJO', 'FACTURACION'
    pe_verificado BOOLEAN DEFAULT false,
    pe_principal  BOOLEAN DEFAULT false,
    pe_activo     BOOLEAN DEFAULT true,
    pe_hstusu     VARCHAR(10),
    pe_hsthora    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_personaemail_prsid ON personaemail(pe_prsid);
CREATE UNIQUE INDEX uidx_personaemail_email ON personaemail(pe_prsid, pe_email);
```

#### Task P3-038: Add temporal exclusion constraints for tariffs

| Field | Value |
|-------|-------|
| **ID** | P3-038 |
| **Description** | Install btree_gist extension and add exclusion constraints to tariff tables (`aplictarif`) to prevent overlapping validity periods. This implements proper temporal/versioning patterns. |
| **Assignee** | DBA Lead |
| **Effort** | 4 hours |
| **Dependencies** | None |
| **Acceptance Criteria** | (1) btree_gist extension installed. (2) Exclusion constraint active on `aplictarif`. (3) Attempt to insert overlapping tariff period correctly rejected. |

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE aplictarif ADD CONSTRAINT excl_aplictarif_validity
    EXCLUDE USING gist (
        aptexpid WITH =,
        aptcptoid WITH =,
        apttarid WITH =,
        daterange(aptfecapl, aptfecfin, '[)') WITH &&
    );
```

#### Task P3-039: Migrate application code for god table decomposition

| Field | Value |
|-------|-------|
| **ID** | P3-039 |
| **Description** | Update all application code that directly queries `explotacion` and `contrato` to use either the decomposed tables or the backward-compatible views. Update Hibernate entity mappings. Priority order: (1) billing pipeline, (2) meter reading, (3) customer management, (4) reporting. |
| **Assignee** | Backend Developer 1 + Backend Developer 2 |
| **Effort** | 80 hours |
| **Dependencies** | P3-031, P3-034 |
| **Acceptance Criteria** | (1) No direct SELECT * FROM explotacion (350 cols) in application code. (2) Billing cycle completes with decomposed tables. (3) All CRUD operations work through views or new tables. (4) Full regression test passes. |

### Sprint 5-8 Summary

| Task ID | Description | Assignee | Effort (hrs) | Dependencies |
|---------|-------------|----------|-------------|-------------|
| P3-026 | Design explotacion decomposition schema | DBA Lead + Architect | 16 | -- |
| P3-027 | Create HIGH-priority extension tables | DBA Lead | 16 | P3-026 |
| P3-028 | Create MEDIUM-priority extension tables | DBA Lead | 12 | P3-026 |
| P3-029 | Create LOW-priority extension tables | DBA Lead | 8 | P3-026 |
| P3-030 | Populate extension tables from source | DBA Lead | 8 | P3-027, P3-028, P3-029 |
| P3-031 | Create v_explotacion_full view | DBA Lead | 8 | P3-030 |
| P3-032 | Drop decomposed columns from core explotacion | DBA Lead | 8 | P3-031 |
| P3-033 | Design contrato decomposition schema | DBA Lead + Architect | 8 | -- |
| P3-034 | Create contrato extension tables and populate | DBA Lead | 16 | P3-033 |
| P3-035 | Normalize contrato notification addresses | Backend Dev 2 | 12 | P3-034 |
| P3-036 | Consolidate inline phones into personatel | Backend Dev 2 | 12 | -- |
| P3-037 | Create personaemail entity | Backend Dev 2 | 8 | -- |
| P3-038 | Add temporal exclusion constraints | DBA Lead | 4 | -- |
| P3-039 | Migrate app code for god table decomposition | Backend Dev 1 + 2 | 80 | P3-031, P3-034 |
| | **Sprint 5-8 Total** | | **216 hours** | |

---

## 5. Sprint 9-10 (Weeks 17-20): Performance & Validation

**Sprint Goal**: Replace GIS cache tables with materialized views, implement partitioning for high-volume tables, run full regression testing, and capture performance benchmarks.

### 5.1 Replace GIS Cache Tables with Materialized Views

#### Task P3-040: Create materialized views to replace vgis_* tables

| Field | Value |
|-------|-------|
| **ID** | P3-040 |
| **Description** | Replace 25 `vgis_*` and `vgiss_*` manually-maintained denormalized cache tables with auto-refreshing materialized views. Consolidate 13 per-municipality padron tables into 1 materialized view with municipality column. |
| **Assignee** | DBA Lead |
| **Effort** | 24 hours |
| **Dependencies** | P3-023 (FK constraints needed for reliable JOINs) |
| **Acceptance Criteria** | (1) All 25 GIS cache tables replaced by materialized views. (2) Data matches original tables. (3) Backward-compatible views created for each original GIS table name. (4) Original cache tables retained for 30 days as backup. |

```sql
-- Consolidate 13 per-municipality tables into 1 materialized view
CREATE MATERIALIZED VIEW mv_gis_padron_usuarios AS
SELECT c.cnttnum, c.cnttcliid, c.cnttptosid, c.cnttestado,
       p.prsid, p.prsnomcpto, p.prsnif,
       ps.ptosid, ps.ptosdirid,
       d.dirid, d.dirtexto, d.dirmunicipio AS municipio
FROM contrato c
JOIN cliente cl ON c.cnttcliid = cl.cliid
JOIN persona p ON cl.cliid = p.prsid
JOIN ptoserv ps ON c.cnttptosid = ps.ptosid
JOIN direccion d ON ps.ptosdirid = d.dirid
WHERE c.cnttestado IN (1, 2);

CREATE UNIQUE INDEX uidx_mv_gis_padron ON mv_gis_padron_usuarios (cnttnum);
CREATE INDEX idx_mv_gis_padron_muni ON mv_gis_padron_usuarios (municipio);

-- Backward-compatible views per municipality
CREATE VIEW vw_gis_pad_usu_queretaro AS
SELECT * FROM mv_gis_padron_usuarios WHERE municipio = 'QUERETARO';
CREATE VIEW vw_gis_pad_usu_corregidora AS
SELECT * FROM mv_gis_padron_usuarios WHERE municipio = 'CORREGIDORA';
-- ... for all 13 municipalities

-- Replace vgis_abonadosacometida
CREATE MATERIALIZED VIEW mv_gis_abonadosacometida AS
SELECT c.cnttnum, c.cnttcliid, c.cnttptosid,
       ps.ptosdirid, a.acoid, a.acoestado,
       a.acomatcod, a.acocalimm, a.acolong,
       d.dirtexto
FROM contrato c
JOIN ptoserv ps ON c.cnttptosid = ps.ptosid
JOIN servicio s ON ps.ptosid = s.serptosid
JOIN acometida a ON s.seracoid = a.acoid
JOIN direccion d ON ps.ptosdirid = d.dirid
WHERE c.cnttestado IN (1, 2);

CREATE UNIQUE INDEX uidx_mv_gis_abonados ON mv_gis_abonadosacometida (cnttnum);
```

#### Task P3-041: Implement pg_cron refresh schedules

| Field | Value |
|-------|-------|
| **ID** | P3-041 |
| **Description** | Install pg_cron extension and configure automated refresh schedules for all materialized views. Create `mv_refresh_log` monitoring table to track refresh health. |
| **Assignee** | DBA Lead |
| **Effort** | 8 hours |
| **Dependencies** | P3-040 |
| **Acceptance Criteria** | (1) pg_cron installed and running. (2) All materialized views have refresh schedules. (3) `mv_refresh_log` records successful refreshes. (4) Alert mechanism for failed refreshes documented. |

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- GIS views: refresh daily at 2 AM
SELECT cron.schedule('refresh_gis_padron', '0 2 * * *',
    $$REFRESH MATERIALIZED VIEW CONCURRENTLY mv_gis_padron_usuarios$$);

SELECT cron.schedule('refresh_gis_abonados', '15 2 * * *',
    $$REFRESH MATERIALIZED VIEW CONCURRENTLY mv_gis_abonadosacometida$$);

-- Monitor refresh health
CREATE TABLE mv_refresh_log (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    view_name   VARCHAR(63) NOT NULL,
    started_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    row_count   BIGINT,
    duration_ms BIGINT,
    status      VARCHAR(10) DEFAULT 'running'
);
```

#### Task P3-042: Drop original GIS cache tables

| Field | Value |
|-------|-------|
| **ID** | P3-042 |
| **Description** | After 30-day validation period, drop the original 25 `vgis_*` and `vgiss_*` cache tables. Verify materialized views continue to serve all GIS layer queries correctly. |
| **Assignee** | DBA Lead |
| **Effort** | 4 hours |
| **Dependencies** | P3-040, P3-041 (+ 30-day validation) |
| **Acceptance Criteria** | (1) All 25 original cache tables dropped. (2) GIS layer fully functional with materialized views. (3) Table count reduced by 25. |

### 5.2 Add Partitioning for High-Volume Tables

#### Task P3-043: Implement table partitioning for factura

| Field | Value |
|-------|-------|
| **ID** | P3-043 |
| **Description** | Partition the `factura` table by billing date (`facfecfact`) using range partitioning by year. Requires table recreation during extended maintenance window. Create partitions for historical years plus 2 future years. |
| **Assignee** | DBA Lead |
| **Effort** | 16 hours |
| **Dependencies** | P3-023 (FK constraints must be in place) |
| **Acceptance Criteria** | (1) `factura` partitioned by year. (2) All historical data migrated to correct partitions. (3) All FK constraints preserved. (4) All indexes recreated on partitions. (5) Billing queries performance equal or better. |

```sql
-- Create partitioned table
CREATE TABLE factura_partitioned (
    LIKE factura INCLUDING ALL
) PARTITION BY RANGE (facfecfact);

-- Create partitions
CREATE TABLE factura_2023 PARTITION OF factura_partitioned
    FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
CREATE TABLE factura_2024 PARTITION OF factura_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE factura_2025 PARTITION OF factura_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE factura_2026 PARTITION OF factura_partitioned
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
CREATE TABLE factura_2027 PARTITION OF factura_partitioned
    FOR VALUES FROM ('2027-01-01') TO ('2028-01-01');
CREATE TABLE factura_default PARTITION OF factura_partitioned DEFAULT;

-- Migrate data (during maintenance window)
INSERT INTO factura_partitioned SELECT * FROM factura;

-- Swap tables
ALTER TABLE factura RENAME TO factura_old;
ALTER TABLE factura_partitioned RENAME TO factura;

-- Retain old table for 30 days
```

#### Task P3-044: Implement partitioning for audit_log

| Field | Value |
|-------|-------|
| **ID** | P3-044 |
| **Description** | Partition the `audit_log` table (created in Phase 2) by month for efficient retention management and query performance. |
| **Assignee** | DBA Lead |
| **Effort** | 8 hours |
| **Dependencies** | Phase 2 complete |
| **Acceptance Criteria** | (1) `audit_log` partitioned by month. (2) Auto-partition creation for future months. (3) Retention policy: drop partitions older than 24 months. |

### 5.3 Full Regression Testing

#### Task P3-045: Execute full application regression test suite

| Field | Value |
|-------|-------|
| **ID** | P3-045 |
| **Description** | Execute the complete application regression test suite against the post-Phase 3 database. Focus areas: (1) billing cycle end-to-end, (2) contract CRUD, (3) customer management, (4) meter reading workflow, (5) report generation, (6) GIS layer, (7) web portal login (bcrypt). Document all failures. |
| **Assignee** | QA Engineer |
| **Effort** | 40 hours |
| **Dependencies** | All P3 tasks |
| **Acceptance Criteria** | (1) 100% of critical billing tests pass. (2) 100% of authentication tests pass. (3) 95%+ of all regression tests pass. (4) Any failures documented with root cause analysis. |

#### Task P3-046: Data integrity validation

| Field | Value |
|-------|-------|
| **ID** | P3-046 |
| **Description** | Run comprehensive data integrity checks: (1) no broken views, (2) no orphaned FK references, (3) table count matches target, (4) row counts match pre-migration baselines, (5) billing totals match pre-migration, (6) all FK constraints valid. |
| **Assignee** | QA Engineer |
| **Effort** | 16 hours |
| **Dependencies** | All P3 tasks |
| **Acceptance Criteria** | (1) Zero broken views. (2) Zero orphan FK references. (3) Table count within 5% of target (~230). (4) Financial totals match exactly. |

```sql
-- Validation queries (run after every sprint):

-- 1. No broken views
DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN SELECT schemaname, viewname FROM pg_views WHERE schemaname = 'cf_quere_pro'
    LOOP
        BEGIN
            EXECUTE format('SELECT 1 FROM %I.%I LIMIT 0', r.schemaname, r.viewname);
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING 'BROKEN VIEW: %.%: %', r.schemaname, r.viewname, SQLERRM;
        END;
    END LOOP;
END $$;

-- 2. No orphaned FK references
SELECT conrelid::regclass AS table_name,
       confrelid::regclass AS referenced_table,
       conname AS constraint_name
FROM pg_constraint
WHERE contype = 'f'
  AND NOT EXISTS (SELECT 1 FROM pg_class WHERE oid = confrelid);

-- 3. Table count
SELECT count(*) as table_count FROM pg_tables WHERE schemaname = 'cf_quere_pro';

-- 4. Core billing smoke test
SELECT count(*) FROM factura WHERE facfecfact >= current_date - interval '30 days';
SELECT count(*) FROM contrato WHERE cnttestado = 1;
SELECT count(*) FROM persona WHERE prsid IS NOT NULL;
```

### 5.4 Performance Benchmarks

#### Task P3-047: Capture performance benchmarks

| Field | Value |
|-------|-------|
| **ID** | P3-047 |
| **Description** | Capture before/after performance metrics and compare against Phase 2 baseline. Metrics: table count, pg_dump schema time, ANALYZE time, average query planning time (pg_stat_statements), autovacuum completion time, connection startup time, pg_class row count, shared buffer cache hit ratio. |
| **Assignee** | QA Engineer + DBA Lead |
| **Effort** | 8 hours |
| **Dependencies** | All P3 tasks |
| **Acceptance Criteria** | (1) All metrics captured in `performance_benchmark` table. (2) Query planning time improved by 3-5x vs. pre-optimization baseline. (3) Autovacuum cycle time reduced by 70%+. (4) pg_dump schema time reduced by 90%+. |

```sql
CREATE TABLE IF NOT EXISTS performance_benchmark (
    pb_id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pb_phase      VARCHAR(20) NOT NULL,
    pb_metric     VARCHAR(100) NOT NULL,
    pb_value      NUMERIC(18,2),
    pb_unit       VARCHAR(20),
    pb_measured_at TIMESTAMPTZ DEFAULT now()
);

-- Capture Phase 3 metrics
INSERT INTO performance_benchmark (pb_phase, pb_metric, pb_value, pb_unit)
SELECT 'PHASE_3_AFTER', 'total_tables', count(*), 'tables'
FROM pg_tables WHERE schemaname = 'cf_quere_pro';

INSERT INTO performance_benchmark (pb_phase, pb_metric, pb_value, pb_unit)
SELECT 'PHASE_3_AFTER', 'pg_class_rows', count(*), 'rows'
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'cf_quere_pro';

INSERT INTO performance_benchmark (pb_phase, pb_metric, pb_value, pb_unit)
SELECT 'PHASE_3_AFTER', 'fk_constraint_count', count(*), 'constraints'
FROM pg_constraint WHERE contype = 'f';
```

### Sprint 9-10 Summary

| Task ID | Description | Assignee | Effort (hrs) | Dependencies |
|---------|-------------|----------|-------------|-------------|
| P3-040 | Create materialized views for GIS caches | DBA Lead | 24 | P3-023 |
| P3-041 | Implement pg_cron refresh schedules | DBA Lead | 8 | P3-040 |
| P3-042 | Drop original GIS cache tables | DBA Lead | 4 | P3-040, P3-041 |
| P3-043 | Partition factura by billing date | DBA Lead | 16 | P3-023 |
| P3-044 | Partition audit_log by month | DBA Lead | 8 | Phase 2 |
| P3-045 | Full regression testing | QA Engineer | 40 | All P3 |
| P3-046 | Data integrity validation | QA Engineer | 16 | All P3 |
| P3-047 | Performance benchmarks | QA + DBA | 8 | All P3 |
| | **Sprint 9-10 Total** | | **124 hours** | |

---

## 6. Risk Register

**Phase 3 is the highest-risk phase** of the entire optimization program. It modifies core table structures, alters authentication mechanisms, and decomposes the two most-accessed tables in the system.

| Risk ID | Risk Description | Probability | Severity | Impact | Mitigation | Owner |
|---------|-----------------|-------------|----------|--------|------------|-------|
| R3-001 | Password hashing breaks authentication for all users | LOW | CRITICAL | All web/portal users locked out | (1) Test on staging with production data. (2) Have rollback script ready (restore from backup). (3) Coordinate user communication for password resets. (4) Deploy during off-peak hours. | Backend Dev 1 |
| R3-002 | Boolean conversion breaks billing calculation logic | MEDIUM | HIGH | Incorrect invoices generated | (1) Sync triggers maintain both columns during transition. (2) Full billing cycle test in staging. (3) Instant rollback by reverting to char(1) columns. | DBA Lead |
| R3-003 | explotacion decomposition breaks billing pipeline | LOW | CRITICAL | Billing process fails completely | (1) v_explotacion_full view provides 100% backward compatibility. (2) INSTEAD OF triggers handle writes. (3) Shadow-write to both old and new tables during transition. (4) Decomposed columns not dropped until full validation. | DBA Lead |
| R3-004 | FK constraint validation discovers massive orphan data | MEDIUM | MEDIUM | Significant data cleanup needed, delays schedule | (1) Run orphan detection in Sprint 1 as discovery task. (2) Budget extra time for data cleanup. (3) Escalation path for business-decision orphans. | DBA Lead |
| R3-005 | Spain table removal crashes Aqualia ERP framework | LOW-MED | CRITICAL | Application framework error, potential data corruption | (1) Never drop without written Aqualia confirmation. (2) Schema isolation fallback (move to spain_legacy schema). (3) Keep tables in search_path if needed. | Architect |
| R3-006 | PostGIS extension conflicts with existing database configuration | LOW | MEDIUM | Spatial queries unavailable | (1) Test extension installation on staging first. (2) Verify PostgreSQL version compatibility. (3) Fallback: keep varchar columns alongside geometry. | DBA Lead |
| R3-007 | Application code still references dropped explotacion columns | MEDIUM | HIGH | Runtime errors in production | (1) v_explotacion_full maintained indefinitely. (2) Column drop only after exhaustive code search. (3) Grep entire codebase for column names before drop. | Backend Dev 2 |
| R3-008 | Materialized view refresh fails during billing cycle | MEDIUM | MEDIUM | GIS layer shows stale data | (1) mv_refresh_log monitoring. (2) pg_cron alerting on failure. (3) Manual refresh procedure documented. (4) Original cache tables retained 30 days. | DBA Lead |
| R3-009 | Table partitioning migration causes extended downtime | LOW | HIGH | Billing operations offline for hours | (1) Schedule during extended maintenance window. (2) pg_dump backup before partition migration. (3) Parallel data copy strategy. (4) Tested on staging with production data volume. | DBA Lead |
| R3-010 | ORM/Hibernate mapping conflicts after schema changes | HIGH | MEDIUM | Application errors for unmapped columns | (1) Backward-compatible views cover all transition periods. (2) Hibernate mappings updated in parallel with schema changes. (3) Shadow deployment for testing. | Backend Dev 1 |

---

## 7. Definition of Done

Phase 3 is considered complete when ALL of the following criteria are met:

### Security
- [ ] Zero plaintext passwords remain in the database (cliente, persona, sociedad)
- [ ] All password verification uses bcrypt comparison
- [ ] Sociedad API credentials stored in dedicated vault table with application-level encryption

### Type Safety
- [ ] Zero char(1) S/N boolean columns remain (all 250+ converted to native boolean)
- [ ] All sync triggers removed after application migration
- [ ] GPS coordinates stored as PostGIS geometry(Point, 4326)
- [ ] Monetary values use NUMERIC, not double precision

### Referential Integrity
- [ ] FK constraints active across all domain tables (200+ constraints)
- [ ] Zero orphan records across all constrained relationships
- [ ] Cascade rules documented and appropriate per relationship type
- [ ] Temporal exclusion constraints active on tariff tables

### Normalization
- [ ] explotacion decomposed from 350 columns to ~10 core columns + 14 extension tables
- [ ] contrato decomposed from 105 columns to ~30 core columns + 4 extension tables
- [ ] Notification addresses normalized (1NF violation fixed)
- [ ] Contact information consolidated in personatel + personaemail
- [ ] v_explotacion_full and v_contrato_full views active and returning correct data

### Performance
- [ ] 25 GIS cache tables replaced with materialized views
- [ ] pg_cron refresh schedules active and monitored
- [ ] factura partitioned by billing date
- [ ] audit_log partitioned by month
- [ ] Table count at or near target (~230)

### Quality
- [ ] 100% critical billing regression tests pass
- [ ] 100% authentication tests pass
- [ ] 95%+ all regression tests pass
- [ ] Performance benchmarks captured and meeting targets
- [ ] Spain-specific tables removed or isolated

### Documentation
- [ ] All FK relationships documented with cascade rules
- [ ] explotacion decomposition mapping documented
- [ ] Migration runbook updated for each sprint
- [ ] Rollback procedures tested

---

## 8. Rollback Plan

Each sprint has an independent rollback strategy leveraging the view abstraction layer. No sprint requires full database restoration unless catastrophic failure occurs.

### Sprint 1-2 Rollback (Security & Type Fixes)

| Change | Rollback Method | Recovery Time | Data Loss |
|--------|----------------|---------------|-----------|
| Password hashing (P3-002, P3-003) | **Not reversible** -- bcrypt hashing is one-way. Rollback = restore from backup + force password resets. | 2-4 hours | Users must reset passwords |
| Boolean conversion (P3-007-P3-009) | Drop `_bool` columns, remove sync triggers. Original char(1) columns untouched during transition. | Minutes | Zero |
| PostGIS migration (P3-013) | Drop `geom` column. Original varchar columns retained. | Minutes | Zero |
| Spain table removal (P3-017) | If schema isolation used: restore search_path. If dropped: restore from pg_dump. | Minutes / 1 hour | Zero |
| Monetary type fix (P3-018) | ALTER COLUMN back to double precision. | Minutes | Potential rounding differences |

**Critical note on password rollback**: Because bcrypt hashing is irreversible, the password migration (P3-002, P3-003) is the single point of no return in Sprint 1-2. Mitigation: take a targeted backup of just the password columns before hashing.

```sql
-- Pre-migration password backup (execute before P3-002/P3-003)
CREATE TABLE migration_backup_passwords AS
SELECT cliid, cliwebpass FROM cliente WHERE cliwebpass IS NOT NULL;
CREATE TABLE migration_backup_persona_passwords AS
SELECT prsid, prspassweb FROM persona WHERE prspassweb IS NOT NULL;
-- These backup tables should be encrypted or access-restricted
-- Drop after 30-day validation period
```

### Sprint 3-4 Rollback (FK Constraints)

| Change | Rollback Method | Recovery Time | Data Loss |
|--------|----------------|---------------|-----------|
| FK constraints (P3-022-P3-024) | `ALTER TABLE ... DROP CONSTRAINT ...` for each FK. Constraints are metadata-only. | Minutes | Zero |
| Orphan cleanup (P3-021) | Restore from `orphan_archive` schema. | Minutes | Zero |

### Sprint 5-8 Rollback (God Table Decomposition)

| Change | Rollback Method | Recovery Time | Data Loss |
|--------|----------------|---------------|-----------|
| explotacion decomposition | `v_explotacion_full` view remains operational. Application continues using view. Extension tables can be dropped if needed. Original columns not yet dropped (dropped in P3-032 only after full validation). | Minutes (view switch) | Zero |
| contrato decomposition | Same pattern -- `v_contrato_full` view provides full backward compatibility. | Minutes | Zero |
| Contact normalization | Original persona phone columns retained during transition. | Minutes | Zero |

### Sprint 9-10 Rollback (Performance & Validation)

| Change | Rollback Method | Recovery Time | Data Loss |
|--------|----------------|---------------|-----------|
| Materialized views (P3-040) | Drop materialized views. Original vgis_* cache tables retained for 30 days. | Minutes | Zero |
| Table partitioning (P3-043) | `factura_old` retained. Rename back. | 1 hour | Zero |

### Full Phase Rollback (Catastrophic)

If all else fails, restore from the full pg_dump backup taken at Phase 3 start. Recovery time: 2-4 hours depending on database size. Data loss: all changes since backup.

---

## 9. Application Impact

### 9.1 ORM/Code Changes Required Per Sprint

| Sprint | Component | Change Required | Effort | Blocking? |
|--------|-----------|----------------|--------|-----------|
| **1-2** | Authentication module | Replace `WHERE cliwebpass = :input` with `WHERE cliwebpass = crypt(:input, cliwebpass)` | 16 hrs | YES -- login breaks without this |
| **1-2** | All entity classes | Update `@Column` annotations for boolean fields. Change Java `char` to `boolean`. | 40 hrs | NO -- sync triggers cover transition |
| **1-2** | GIS module | Update coordinate queries to use `ST_Distance()`, `ST_DWithin()` instead of varchar math | 16 hrs | NO -- varchar columns retained |
| **1-2** | Sociedad service | Update credential access to read from `sociedad_credentials` table | 8 hrs | YES -- API integrations break |
| **3-4** | Data access layer | No immediate changes. FK constraints are transparent to application code. | 0 hrs | NO |
| **3-4** | Error handling | Add handling for FK violation exceptions (23503) in INSERT/UPDATE/DELETE operations | 8 hrs | NO -- but improves UX |
| **5-8** | Explotacion entity | Option A: Remap to decomposed tables. Option B: Remap to `v_explotacion_full` view. | 40 hrs (A) / 4 hrs (B) | NO -- view covers |
| **5-8** | Contrato entity | Same options as explotacion. | 24 hrs (A) / 4 hrs (B) | NO -- view covers |
| **5-8** | Notification module | Update to use `contrato_notificacion` table instead of inline columns | 12 hrs | NO -- view covers |
| **5-8** | Contact module | Update to use `personatel` for all phone lookups, `personaemail` for email | 16 hrs | NO -- inline columns retained |
| **9-10** | GIS layer | Update to read from materialized views (or use backward-compatible named views) | 8 hrs | NO -- named views cover |
| **9-10** | Operations dashboard | Add pg_cron job monitoring, materialized view refresh status | 8 hrs | NO |

### 9.2 Hibernate/JPA Mapping Strategy

The AQUASIS application uses Hibernate/JPA entity mappings. The recommended migration strategy:

1. **Phase A (immediate)**: Point Hibernate entities at backward-compatible views (`v_explotacion_full`, `v_contrato_full`). This requires minimal code changes -- only the `@Table` annotation changes.

2. **Phase B (gradual)**: Create new entity classes for decomposed tables (`ExplotacionBilling`, `ExplotacionCollections`, etc.). Migrate application code module by module to use domain-specific entities.

3. **Phase C (cleanup)**: Remove legacy entity classes. Drop backward-compatible views. This is optional and can be deferred indefinitely.

### 9.3 API Compatibility

External APIs (AQUASIS SOAP services) must maintain backward compatibility:
- SOAP service responses that expose explotacion/contrato data should use the backward-compatible views
- No WSDL changes required during Phase 3
- Internal service implementations can gradually migrate to decomposed tables

---

## 10. Staffing & Resource Plan

### 10.1 Team Allocation by Sprint

| Role | Sprint 1-2 | Sprint 3-4 | Sprint 5-8 | Sprint 9-10 | Total Hours |
|------|-----------|-----------|-----------|------------|------------|
| **DBA Lead** | 79 hrs | 120 hrs | 92 hrs | 68 hrs | 359 hrs |
| **Backend Dev 1** | 82 hrs | 0 hrs | 40 hrs | 0 hrs | 122 hrs |
| **Backend Dev 2** | 16 hrs | 0 hrs | 124 hrs | 0 hrs | 140 hrs |
| **QA Engineer** | 0 hrs | 0 hrs | 0 hrs | 104 hrs | 104 hrs |
| **Solutions Architect** | 4 hrs | 8 hrs | 24 hrs | 0 hrs | 36 hrs |
| **Total per Sprint** | 181 hrs | 128 hrs | 280 hrs | 172 hrs | **761 hrs** |

### 10.2 Critical Path

The critical path through Phase 3 is:

```
P3-001 (pgcrypto) -> P3-002/003 (password hashing) -> P3-005 (app auth update)
        |
        +-> P3-006 (bool inventory) -> P3-007 (bool script) -> P3-008/009 (bool migration) -> P3-010 (app update)
        |
P3-019 (FK audit) -> P3-020 (orphan detection) -> P3-021 (orphan fix) -> P3-022-024 (FK constraints)
        |
P3-026 (explotacion design) -> P3-027-029 (create tables) -> P3-030 (populate) -> P3-031 (view) -> P3-039 (app migration)
        |
P3-033 (contrato design) -> P3-034 (create tables) -> P3-035 (normalize)
        |
All above -> P3-045/046 (regression/validation) -> P3-047 (benchmarks)
```

The **longest path** runs through the explotacion decomposition (Sprint 5-8) followed by regression testing (Sprint 9-10). This is the schedule driver for the entire phase.

### 10.3 External Dependencies

| Dependency | Owner | Required By | Risk if Delayed |
|-----------|-------|------------|----------------|
| Aqualia ERP team confirmation (Spain tables) | Aqualia | Sprint 1-2 (P3-016) | Use schema isolation fallback -- no schedule impact |
| Application code freeze for auth migration | Dev team | Sprint 1-2 (P3-005) | Password rollback needed -- HIGH risk |
| Staging environment with production data | Infrastructure | Sprint 1 start | Cannot begin Phase 3 -- BLOCKING |
| Maintenance windows (2-4 hours) | Operations | Each sprint | Delays individual migrations |
| ORM team availability for entity updates | Dev team | Sprint 5-8 (P3-039) | Use view-based fallback -- no schedule impact |

---

## Appendix A: Full Task Index

| Task ID | Sprint | Description | Assignee | Effort (hrs) | Dependencies |
|---------|--------|-------------|----------|-------------|-------------|
| P3-001 | 1-2 | Install pgcrypto extension | DBA Lead | 1 | -- |
| P3-002 | 1-2 | Hash cliente.cliwebpass | Backend Dev 1 | 8 | P3-001 |
| P3-003 | 1-2 | Hash persona.prspassweb | Backend Dev 1 | 6 | P3-001 |
| P3-004 | 1-2 | Migrate sociedad credentials to vault | Backend Dev 1 | 12 | P3-001 |
| P3-005 | 1-2 | Update app password verification | Backend Dev 1 | 16 | P3-002, P3-003, P3-004 |
| P3-006 | 1-2 | Generate boolean conversion inventory | DBA Lead | 4 | -- |
| P3-007 | 1-2 | Create boolean migration script | DBA Lead | 24 | P3-006 |
| P3-008 | 1-2 | Boolean conversion: explotacion | DBA Lead | 8 | P3-007 |
| P3-009 | 1-2 | Boolean conversion: remaining tables | DBA Lead | 12 | P3-007 |
| P3-010 | 1-2 | Update app code for booleans | Backend Dev 1 | 40 | P3-008, P3-009 |
| P3-011 | 1-2 | Create legacy transition views | DBA Lead | 8 | P3-008, P3-009 |
| P3-012 | 1-2 | Install PostGIS extension | DBA Lead | 2 | -- |
| P3-013 | 1-2 | Migrate GPS to PostGIS geometry | DBA Lead | 8 | P3-012 |
| P3-014 | 1-2 | Update GIS queries for PostGIS | Backend Dev 2 | 16 | P3-013 |
| P3-015 | 1-2 | Validate Spain tables empty/unreferenced | DBA Lead | 4 | -- |
| P3-016 | 1-2 | Obtain Aqualia confirmation | Architect | 4 | P3-015 |
| P3-017 | 1-2 | Remove/isolate Spain tables | DBA Lead | 4 | P3-016 |
| P3-018 | 1-2 | Fix monetary double precision | DBA Lead | 4 | -- |
| P3-019 | 3-4 | Catalog all FK relationships | DBA Lead | 24 | -- |
| P3-020 | 3-4 | Orphan record detection | DBA Lead | 16 | P3-019 |
| P3-021 | 3-4 | Fix/archive orphan records | DBA + Architect | 24 | P3-020 |
| P3-022 | 3-4 | FK constraints: reference tables | DBA Lead | 16 | P3-021 |
| P3-023 | 3-4 | FK constraints: core business tables | DBA Lead | 16 | P3-022 |
| P3-024 | 3-4 | FK constraints: remaining tables | DBA Lead | 16 | P3-023 |
| P3-025 | 3-4 | Cascade rules per relationship | DBA + Architect | 8 | P3-024 |
| P3-026 | 5-8 | Design explotacion decomposition | DBA + Architect | 16 | -- |
| P3-027 | 5-8 | Create HIGH-priority extension tables | DBA Lead | 16 | P3-026 |
| P3-028 | 5-8 | Create MEDIUM-priority extension tables | DBA Lead | 12 | P3-026 |
| P3-029 | 5-8 | Create LOW-priority extension tables | DBA Lead | 8 | P3-026 |
| P3-030 | 5-8 | Populate extension tables | DBA Lead | 8 | P3-027, P3-028, P3-029 |
| P3-031 | 5-8 | Create v_explotacion_full view | DBA Lead | 8 | P3-030 |
| P3-032 | 5-8 | Drop decomposed columns from explotacion | DBA Lead | 8 | P3-031 |
| P3-033 | 5-8 | Design contrato decomposition | DBA + Architect | 8 | -- |
| P3-034 | 5-8 | Create contrato extension tables | DBA Lead | 16 | P3-033 |
| P3-035 | 5-8 | Normalize notification addresses | Backend Dev 2 | 12 | P3-034 |
| P3-036 | 5-8 | Consolidate phones into personatel | Backend Dev 2 | 12 | -- |
| P3-037 | 5-8 | Create personaemail entity | Backend Dev 2 | 8 | -- |
| P3-038 | 5-8 | Temporal exclusion constraints | DBA Lead | 4 | -- |
| P3-039 | 5-8 | App code migration for decomposition | Backend Dev 1+2 | 80 | P3-031, P3-034 |
| P3-040 | 9-10 | Materialized views for GIS caches | DBA Lead | 24 | P3-023 |
| P3-041 | 9-10 | pg_cron refresh schedules | DBA Lead | 8 | P3-040 |
| P3-042 | 9-10 | Drop original GIS cache tables | DBA Lead | 4 | P3-040, P3-041 |
| P3-043 | 9-10 | Partition factura by date | DBA Lead | 16 | P3-023 |
| P3-044 | 9-10 | Partition audit_log by month | DBA Lead | 8 | Phase 2 |
| P3-045 | 9-10 | Full regression testing | QA Engineer | 40 | All P3 |
| P3-046 | 9-10 | Data integrity validation | QA Engineer | 16 | All P3 |
| P3-047 | 9-10 | Performance benchmarks | QA + DBA | 8 | All P3 |
| | | **PHASE 3 TOTAL** | | **761 hours** | |
