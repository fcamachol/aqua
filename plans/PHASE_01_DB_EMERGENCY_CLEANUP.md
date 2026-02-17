# Phase 1: Emergency Database Cleanup

> **Version**: 1.0
> **Date**: 2026-02-16
> **Database**: cf_quere_pro (CEA Queretaro Water Utility)
> **PostgreSQL**: 14+
> **Phase Duration**: 8 weeks (Months 1-2)
> **Target**: 4,114 tables -> ~1,470 tables (64% reduction)
> **Risk Level**: LOW (transient/staging tables only)

---

## 1. Phase Overview

### 1.1 Goal

Eliminate 2,643+ table-per-process instances (`tmp_deuda_*`, `aux_varscreditored_*`, `tmpbb_*`), persistent staging tables, backup artifacts, report temp tables, and Spain-specific dead tables. Replace table-per-process patterns with consolidated tables using a `proceso_id` discriminator column. Fix the `tmpbb` column mismatch bug identified in report A9.

### 1.2 Timeline

| Sprint | Weeks | Focus |
|--------|-------|-------|
| Sprint 1 | 1-2 | Preparation and Safety |
| Sprint 2 | 3-4 | tmp_deuda_* Elimination (2,144 tables) |
| Sprint 3 | 5-6 | aux_varscreditored_* and tmpbb_* Elimination (499 tables) |
| Sprint 4 | 7-8 | Validation, Monitoring, and Prevention |

### 1.3 Team

| Role | Responsibility | Allocation |
|------|---------------|------------|
| DBA Lead | Script execution, backup/restore, catalog maintenance, monitoring | Full-time |
| Backend Developer | Application code patches, AQUASIS framework modifications | Full-time |
| QA Engineer | Smoke testing, billing pipeline validation, regression testing | 50% Sprint 1-3, Full-time Sprint 4 |

### 1.4 Prerequisites

Before starting Sprint 1:

1. Read access to production `cf_quere_pro` database confirmed
2. Maintenance window schedule approved (2-4 hours for Sprints 2-3)
3. PostgreSQL superuser or schema-owner credentials available
4. Disk space for `pg_dump` backup (estimate current DB size + 20% headroom)
5. AQUASIS application source code access for patching table-creation logic
6. Staging/dev environment that mirrors production schema for pre-testing all scripts
7. Communication plan for billing team (no billing runs during maintenance windows)
8. Monitoring dashboards accessible (pg_stat_activity, catalog sizes, vacuum stats)

---

## 2. Sprint 1 (Weeks 1-2): Preparation and Safety

**Goal**: Establish baseline measurements, create safety nets, fix known bugs in cleanup scripts, and validate all scripts on staging environment.

### Tasks

#### P1-S1-01: Run Pre-Cleanup Inventory

| Field | Value |
|-------|-------|
| **ID** | P1-S1-01 |
| **Description** | Execute `pre_cleanup_inventory.sql` on production to capture baseline state. This creates the `audit_inventory` schema with `table_snapshot` and `fk_snapshot` tables. Save output of all 6 query sections to a timestamped file. |
| **Assignee** | DBA Lead |
| **Effort** | 2 hours |
| **Dependencies** | None |
| **Acceptance Criteria** | `audit_inventory.table_snapshot` populated with all 4,114 tables. CSV export of summary-by-category saved. Confirm `tmp_deuda_*` count = 2,144, `aux_varscreditored_*` count = ~477, `tmpbb_*` count = 22. |

#### P1-S1-02: Full Database Backup

| Field | Value |
|-------|-------|
| **ID** | P1-S1-02 |
| **Description** | Execute full `pg_dump` backup of `cf_quere_pro` in custom format. Store on separate volume with verified checksum. Test restore on staging environment. |
| **Assignee** | DBA Lead |
| **Effort** | 4 hours (dump + verify + test restore) |
| **Dependencies** | None |
| **Acceptance Criteria** | `pg_dump -Fc cf_quere_pro > backup_pre_phase1.dump` completes without errors. `pg_restore --list backup_pre_phase1.dump` returns full TOC. Test restore on staging succeeds. SHA-256 checksum documented. |

**Backup command:**
```bash
pg_dump -Fc -v -d cf_quere_pro -f /backup/backup_pre_phase1_$(date +%Y%m%d).dump 2>&1 | tee /backup/backup_log_$(date +%Y%m%d).txt
sha256sum /backup/backup_pre_phase1_$(date +%Y%m%d).dump > /backup/backup_pre_phase1_$(date +%Y%m%d).sha256
```

#### P1-S1-03: Create Rollback Scripts

| Field | Value |
|-------|-------|
| **ID** | P1-S1-03 |
| **Description** | Generate DDL-only dump of all tables targeted for deletion so they can be recreated if needed. Export `pg_dump --schema-only` for each table family pattern. Also export row counts per table to identify any that contained data. |
| **Assignee** | DBA Lead |
| **Effort** | 4 hours |
| **Dependencies** | P1-S1-01 |
| **Acceptance Criteria** | `rollback_tmp_deuda.sql`, `rollback_aux_vars.sql`, `rollback_tmpbb.sql`, `rollback_staging.sql` files generated. Each can recreate tables via `\i` in psql. Any tables with `est_row_count > 0` are flagged for data export. |

**Generation approach:**
```sql
-- Generate rollback DDL for tmp_deuda_* tables
SELECT format('CREATE TABLE cf_quere_pro.%I (LIKE cf_quere_pro.tmp_deuda_1779865 INCLUDING ALL);',
              table_name)
FROM information_schema.tables
WHERE table_schema = 'cf_quere_pro'
  AND table_name ~ '^tmp_deuda_\d+$'
ORDER BY table_name;
```

#### P1-S1-04: Set Up Monitoring Baseline

| Field | Value |
|-------|-------|
| **ID** | P1-S1-04 |
| **Description** | Capture before-state metrics for comparison after cleanup: pg_class row count, pg_attribute row count, total catalog size, autovacuum cycle times, average query planning time (from pg_stat_statements if available), pg_dump schema-only time. |
| **Assignee** | DBA Lead |
| **Effort** | 3 hours |
| **Dependencies** | None |
| **Acceptance Criteria** | Baseline metrics document created with all values recorded. |

**Monitoring queries:**
```sql
-- Catalog sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(oid))
FROM pg_class WHERE relname IN ('pg_class', 'pg_attribute', 'pg_statistic', 'pg_depend');

-- Catalog row counts
SELECT 'pg_class' AS catalog, count(*) FROM pg_class
UNION ALL
SELECT 'pg_attribute', count(*) FROM pg_attribute
UNION ALL
SELECT 'pg_statistic', count(*) FROM pg_statistic
UNION ALL
SELECT 'pg_depend', count(*) FROM pg_depend;

-- Schema dump time (run from shell, record elapsed time)
-- time pg_dump --schema-only cf_quere_pro > /dev/null

-- Autovacuum stats
SELECT relname, last_autovacuum, last_autoanalyze, autovacuum_count
FROM pg_stat_user_tables
WHERE schemaname = 'cf_quere_pro'
ORDER BY autovacuum_count DESC LIMIT 20;
```

#### P1-S1-05: Fix tmpbb Column Mismatch Bug

| Field | Value |
|-------|-------|
| **ID** | P1-S1-05 |
| **Description** | The existing `phase1_drop_transient_tables.sql` defines a replacement `tmpbb` table with 15 columns (`bbid`, `bbexpid`, `bbcptoid`, `bbtconid`, etc.) that do NOT match the actual `tmpbb_*` table structure. Actual tables have 14 columns: `bbfbleid`, `bbsbid`, `bbcnttnum`, `bbaplicacion`, `bbfecini`, `bbfecfin`, `bbvardel`, `bbexpdid`, `bbcptodel`, `bbtariddel`, `bbctponew`, `bbtaridnew`, `bbfecfinbonif`, `bbfecinitar`. Update the script to use the correct column names and types. |
| **Assignee** | Backend Developer |
| **Effort** | 3 hours |
| **Dependencies** | P1-S1-01 (to verify actual column names on live DB) |
| **Acceptance Criteria** | Updated `tmpbb` replacement table DDL matches actual `tmpbb_*` column names exactly. Verified by comparing `\d tmpbb_NNNNNNN` output on production against the corrected DDL. Script updated in `phase1_drop_transient_tables.sql`. |

**Corrected DDL:**
```sql
CREATE TABLE IF NOT EXISTS cf_quere_pro.tmpbb (
    proceso_id    BIGINT       NOT NULL,
    bbfbleid      NUMERIC(10,0),
    bbsbid        NUMERIC(10,0),
    bbcnttnum     NUMERIC(10,0) NOT NULL,
    bbaplicacion  NUMERIC(5,0),
    bbfecini      DATE,
    bbfecfin      DATE,
    bbvardel      NUMERIC(10,0),
    bbexpdid      NUMERIC(5,0),
    bbcptodel     NUMERIC(10,0),
    bbtariddel    NUMERIC(10,0),
    bbctponew     NUMERIC(10,0),
    bbtaridnew    NUMERIC(10,0),
    bbfecfinbonif DATE,
    bbfecinitar   DATE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT pk_tmpbb PRIMARY KEY (proceso_id, bbcnttnum)
);
CREATE INDEX IF NOT EXISTS idx_tmpbb_proceso ON cf_quere_pro.tmpbb (proceso_id);
```

#### P1-S1-06: Validate All Scripts on Staging

| Field | Value |
|-------|-------|
| **ID** | P1-S1-06 |
| **Description** | Restore the production backup to a staging environment and execute the complete Phase 1 script set (with corrected tmpbb DDL). Verify table counts before/after, confirm no errors, time each step, and run billing pipeline smoke test. |
| **Assignee** | DBA Lead + QA Engineer |
| **Effort** | 8 hours |
| **Dependencies** | P1-S1-02, P1-S1-03, P1-S1-05 |
| **Acceptance Criteria** | All scripts complete without errors on staging. Table count drops by expected amount. Consolidated tables (`tmp_deuda`, `aux_varscreditored`, `tmpbb`) created with correct columns. No orphaned FK references found. Billing pipeline smoke test passes on staging. |

#### P1-S1-07: Identify Tables with Active Data

| Field | Value |
|-------|-------|
| **ID** | P1-S1-07 |
| **Description** | Query each table family for non-empty instances. Any `tmp_deuda_*`, `aux_varscreditored_*`, or `tmpbb_*` tables with rows > 0 may represent in-flight processes. These must be migrated before dropping. Also verify `tmp_gestordocumental` has no pending documents, and `tmpses` has no active sessions. |
| **Assignee** | DBA Lead |
| **Effort** | 4 hours |
| **Dependencies** | P1-S1-01 |
| **Acceptance Criteria** | List of non-empty transient tables documented with row counts. Migration plan for any tables with data. Confirmed: `tmp_gestordocumental` row count, `tmpses` active session count. |

**Discovery query:**
```sql
-- Find non-empty tmp_deuda_* tables
DO $$
DECLARE r RECORD; cnt BIGINT;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables
           WHERE schemaname = 'cf_quere_pro' AND tablename ~ '^tmp_deuda_\d+$'
  LOOP
    EXECUTE format('SELECT count(*) FROM cf_quere_pro.%I', r.tablename) INTO cnt;
    IF cnt > 0 THEN
      RAISE NOTICE 'NON-EMPTY: % has % rows', r.tablename, cnt;
    END IF;
  END LOOP;
END $$;

-- Check pending documents
SELECT count(*) AS pending_docs FROM cf_quere_pro.tmp_gestordocumental;

-- Check active sessions
SELECT count(*) AS active_sessions FROM cf_quere_pro.tmpses;
```

#### P1-S1-08: Schedule Maintenance Windows

| Field | Value |
|-------|-------|
| **ID** | P1-S1-08 |
| **Description** | Coordinate with operations team to schedule two 4-hour maintenance windows: one for Sprint 2 (tmp_deuda_* drops), one for Sprint 3 (aux_varscreditored_* and tmpbb_* drops). Windows must be during off-peak hours when no billing runs are scheduled. Notify billing team 1 week in advance. |
| **Assignee** | DBA Lead |
| **Effort** | 2 hours |
| **Dependencies** | None |
| **Acceptance Criteria** | Two maintenance windows confirmed on calendar. Billing team acknowledged no runs during windows. Change management tickets filed. |

### Sprint 1 Total Effort: 30 hours

---

## 3. Sprint 2 (Weeks 3-4): tmp_deuda_* Elimination

**Goal**: Replace 2,144 `tmp_deuda_*` tables with a single consolidated `tmp_deuda` table. Drop all individual instances.

### Tasks

#### P1-S2-01: Create Consolidated tmp_deuda Table

| Field | Value |
|-------|-------|
| **ID** | P1-S2-01 |
| **Description** | Create the consolidated `tmp_deuda` table with `proceso_id` discriminator column. Add primary key on `(proceso_id, faccnttnum)` and index on `proceso_id`. Run during maintenance window. |
| **Assignee** | DBA Lead |
| **Effort** | 1 hour |
| **Dependencies** | P1-S1-06 (staging validation) |
| **Acceptance Criteria** | Table `cf_quere_pro.tmp_deuda` exists with 6 columns: `proceso_id`, `importe`, `numfacturas`, `facsocemi`, `faccnttnum`, `created_at`. Index `idx_tmp_deuda_proceso` exists. Test INSERT/SELECT/DELETE succeeds. |

**DDL:**
```sql
CREATE TABLE IF NOT EXISTS cf_quere_pro.tmp_deuda (
    proceso_id  BIGINT       NOT NULL,
    importe     NUMERIC(18,2),
    numfacturas NUMERIC(10,0),
    facsocemi   NUMERIC(10,0),
    faccnttnum  NUMERIC(10,0),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT pk_tmp_deuda PRIMARY KEY (proceso_id, faccnttnum)
);
CREATE INDEX IF NOT EXISTS idx_tmp_deuda_proceso
    ON cf_quere_pro.tmp_deuda (proceso_id);
COMMENT ON TABLE cf_quere_pro.tmp_deuda IS
    'Consolidated temp debt table. Replaces 2,144 individual tmp_deuda_NNNNNNN tables. '
    'Rows partitioned by proceso_id.';
```

#### P1-S2-02: Migrate Active tmp_deuda_* Data

| Field | Value |
|-------|-------|
| **ID** | P1-S2-02 |
| **Description** | For any `tmp_deuda_*` tables identified as non-empty in P1-S1-07, migrate their data into the consolidated `tmp_deuda` table. Extract the process ID from the table name suffix and use it as `proceso_id`. |
| **Assignee** | DBA Lead |
| **Effort** | 2 hours |
| **Dependencies** | P1-S2-01, P1-S1-07 |
| **Acceptance Criteria** | All rows from non-empty `tmp_deuda_*` tables present in consolidated `tmp_deuda` with correct `proceso_id`. Row count in consolidated table matches sum of source rows. |

**Migration script:**
```sql
DO $$
DECLARE r RECORD; proc_id BIGINT; migrated INT := 0;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables
           WHERE schemaname = 'cf_quere_pro' AND tablename ~ '^tmp_deuda_\d+$'
  LOOP
    proc_id := substring(r.tablename from 'tmp_deuda_(\d+)')::BIGINT;
    EXECUTE format(
      'INSERT INTO cf_quere_pro.tmp_deuda (proceso_id, importe, numfacturas, facsocemi, faccnttnum)
       SELECT %s, importe, numfacturas, facsocemi, faccnttnum FROM cf_quere_pro.%I',
      proc_id, r.tablename
    );
    GET DIAGNOSTICS migrated = ROW_COUNT;
    IF migrated > 0 THEN
      RAISE NOTICE 'Migrated % rows from %', migrated, r.tablename;
    END IF;
  END LOOP;
END $$;
```

#### P1-S2-03: Drop tmp_deuda_* Tables in Batches

| Field | Value |
|-------|-------|
| **ID** | P1-S2-03 |
| **Description** | Drop all 2,144 `tmp_deuda_*` tables in batches of 100 with interim `CHECKPOINT` calls to avoid long locks and WAL pressure. Log progress. Execute during maintenance window with no active billing processes. |
| **Assignee** | DBA Lead |
| **Effort** | 3 hours (execution + monitoring) |
| **Dependencies** | P1-S2-02 |
| **Acceptance Criteria** | Zero `tmp_deuda_*` tables remain. Query `SELECT count(*) FROM pg_tables WHERE schemaname = 'cf_quere_pro' AND tablename ~ '^tmp_deuda_\d+$'` returns 0. |

**Batch drop script:**
```sql
DO $$
DECLARE
    tbl_name TEXT;
    drop_count INT := 0;
    batch_size INT := 100;
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

        IF drop_count % batch_size = 0 THEN
            RAISE NOTICE 'Dropped % tmp_deuda tables so far at %', drop_count, now();
        END IF;
    END LOOP;

    RAISE NOTICE 'Completed: Dropped % tmp_deuda_* tables at %', drop_count, now();
END $$;

-- Run CHECKPOINT after batch drop to flush WAL
CHECKPOINT;
```

#### P1-S2-04: Intermediate Catalog Vacuum

| Field | Value |
|-------|-------|
| **ID** | P1-S2-04 |
| **Description** | After dropping 2,144 tables, the catalog tables (`pg_class`, `pg_attribute`, `pg_statistic`, `pg_depend`) retain dead rows. Run `VACUUM` on these catalog tables to reclaim space and keep subsequent operations fast. |
| **Assignee** | DBA Lead |
| **Effort** | 1 hour |
| **Dependencies** | P1-S2-03 |
| **Acceptance Criteria** | Catalog VACUUM completes without errors. `pg_class` row count reduced by approximately 2,144. |

```sql
VACUUM pg_class;
VACUUM pg_attribute;
VACUUM pg_statistic;
VACUUM pg_depend;
ANALYZE pg_class;
ANALYZE pg_attribute;
```

#### P1-S2-05: Sprint 2 Verification

| Field | Value |
|-------|-------|
| **ID** | P1-S2-05 |
| **Description** | Verify Sprint 2 results: no `tmp_deuda_*` tables remain, consolidated table is functional, total table count decreased by ~2,144, no application errors in logs. |
| **Assignee** | QA Engineer |
| **Effort** | 2 hours |
| **Dependencies** | P1-S2-04 |
| **Acceptance Criteria** | All verification queries pass (see below). Application logs show no table-not-found errors. |

**Verification queries:**
```sql
-- No tmp_deuda_* tables remain
SELECT count(*) AS remaining FROM pg_tables
WHERE schemaname = 'cf_quere_pro' AND tablename ~ '^tmp_deuda_\d+$';
-- Expected: 0

-- Consolidated table exists and is functional
INSERT INTO cf_quere_pro.tmp_deuda (proceso_id, importe, numfacturas, facsocemi, faccnttnum)
VALUES (999999, 100.00, 1, 1, 1);
SELECT * FROM cf_quere_pro.tmp_deuda WHERE proceso_id = 999999;
DELETE FROM cf_quere_pro.tmp_deuda WHERE proceso_id = 999999;

-- Current total table count
SELECT count(*) AS total_tables FROM pg_tables WHERE schemaname = 'cf_quere_pro';
-- Expected: ~1,970 (4,114 - 2,144)
```

### Sprint 2 Total Effort: 9 hours

---

## 4. Sprint 3 (Weeks 5-6): aux_varscreditored_* and tmpbb_* Elimination

**Goal**: Eliminate 477 `aux_varscreditored_*` tables, 22 `tmpbb_*` tables, 25+ Spain-specific dead tables, and remaining staging/artifact tables.

### Tasks

#### P1-S3-01: Create Consolidated aux_varscreditored Table

| Field | Value |
|-------|-------|
| **ID** | P1-S3-01 |
| **Description** | Create the consolidated `aux_varscreditored` table with `proceso_id` discriminator column. Add primary key on `(proceso_id, cnttnum)` and index on `proceso_id`. |
| **Assignee** | DBA Lead |
| **Effort** | 1 hour |
| **Dependencies** | P1-S2-05 (Sprint 2 verified) |
| **Acceptance Criteria** | Table `cf_quere_pro.aux_varscreditored` exists with 5 columns. Index and comment applied. |

**DDL:**
```sql
CREATE TABLE IF NOT EXISTS cf_quere_pro.aux_varscreditored (
    proceso_id     BIGINT       NOT NULL,
    cnttnum        NUMERIC(10,0) NOT NULL,
    impvariable    NUMERIC(18,2),
    impvaranterior NUMERIC(18,2),
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT pk_aux_varscreditored PRIMARY KEY (proceso_id, cnttnum)
);
CREATE INDEX IF NOT EXISTS idx_aux_varscreditored_proceso
    ON cf_quere_pro.aux_varscreditored (proceso_id);
COMMENT ON TABLE cf_quere_pro.aux_varscreditored IS
    'Consolidated credit variable staging table. Replaces ~477 individual '
    'aux_varscreditored_NNNNNNN tables. Partitioned by proceso_id.';
```

#### P1-S3-02: Migrate Active aux_varscreditored_* Data

| Field | Value |
|-------|-------|
| **ID** | P1-S3-02 |
| **Description** | Migrate any non-empty `aux_varscreditored_*` tables into the consolidated table. Same pattern as P1-S2-02. |
| **Assignee** | DBA Lead |
| **Effort** | 1 hour |
| **Dependencies** | P1-S3-01, P1-S1-07 |
| **Acceptance Criteria** | All data from non-empty source tables present in consolidated table with correct `proceso_id`. |

#### P1-S3-03: Drop aux_varscreditored_* Tables in Batches

| Field | Value |
|-------|-------|
| **ID** | P1-S3-03 |
| **Description** | Drop all ~477 `aux_varscreditored_*` tables in batches of 100. Log progress. Execute during maintenance window. |
| **Assignee** | DBA Lead |
| **Effort** | 2 hours |
| **Dependencies** | P1-S3-02 |
| **Acceptance Criteria** | Zero `aux_varscreditored_*` tables remain. |

**Batch drop script:**
```sql
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
CHECKPOINT;
```

#### P1-S3-04: Create Consolidated tmpbb Table (Corrected Schema)

| Field | Value |
|-------|-------|
| **ID** | P1-S3-04 |
| **Description** | Create the corrected consolidated `tmpbb` table using the actual column names from `tmpbb_*` tables (NOT the incorrect names from the original Phase 1 script). This addresses the critical bug found in report A9. |
| **Assignee** | DBA Lead |
| **Effort** | 1 hour |
| **Dependencies** | P1-S1-05 (bug fix completed) |
| **Acceptance Criteria** | Table `cf_quere_pro.tmpbb` has 16 columns matching actual `tmpbb_*` structure: `proceso_id`, `bbfbleid`, `bbsbid`, `bbcnttnum`, `bbaplicacion`, `bbfecini`, `bbfecfin`, `bbvardel`, `bbexpdid`, `bbcptodel`, `bbtariddel`, `bbctponew`, `bbtaridnew`, `bbfecfinbonif`, `bbfecinitar`, `created_at`. PK on `(proceso_id, bbcnttnum)`. |

**DDL (corrected):**
```sql
CREATE TABLE IF NOT EXISTS cf_quere_pro.tmpbb (
    proceso_id    BIGINT       NOT NULL,
    bbfbleid      NUMERIC(10,0),
    bbsbid        NUMERIC(10,0),
    bbcnttnum     NUMERIC(10,0) NOT NULL,
    bbaplicacion  NUMERIC(5,0),
    bbfecini      DATE,
    bbfecfin      DATE,
    bbvardel      NUMERIC(10,0),
    bbexpdid      NUMERIC(5,0),
    bbcptodel     NUMERIC(10,0),
    bbtariddel    NUMERIC(10,0),
    bbctponew     NUMERIC(10,0),
    bbtaridnew    NUMERIC(10,0),
    bbfecfinbonif DATE,
    bbfecinitar   DATE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT pk_tmpbb PRIMARY KEY (proceso_id, bbcnttnum)
);
CREATE INDEX IF NOT EXISTS idx_tmpbb_proceso ON cf_quere_pro.tmpbb (proceso_id);
COMMENT ON TABLE cf_quere_pro.tmpbb IS
    'Consolidated temp bajabonificacion table. Replaces 22 individual '
    'tmpbb_NNNNNNN tables. Uses CORRECTED column names from actual tmpbb_* tables. '
    'See A9 report for original bug details.';
```

#### P1-S3-05: Migrate Active tmpbb_* Data and Drop Tables

| Field | Value |
|-------|-------|
| **ID** | P1-S3-05 |
| **Description** | Migrate any non-empty `tmpbb_*` data into the consolidated table. Then drop all 22 `tmpbb_*` tables. |
| **Assignee** | DBA Lead |
| **Effort** | 1 hour |
| **Dependencies** | P1-S3-04 |
| **Acceptance Criteria** | Zero `tmpbb_*` tables remain. Consolidated `tmpbb` contains all migrated data. |

**Migration and drop:**
```sql
-- Migrate
DO $$
DECLARE r RECORD; proc_id BIGINT; migrated INT := 0;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables
           WHERE schemaname = 'cf_quere_pro' AND tablename ~ '^tmpbb_\d+$'
  LOOP
    proc_id := substring(r.tablename from 'tmpbb_(\d+)')::BIGINT;
    EXECUTE format(
      'INSERT INTO cf_quere_pro.tmpbb (proceso_id, bbfbleid, bbsbid, bbcnttnum, bbaplicacion,
        bbfecini, bbfecfin, bbvardel, bbexpdid, bbcptodel, bbtariddel, bbctponew,
        bbtaridnew, bbfecfinbonif, bbfecinitar)
       SELECT %s, bbfbleid, bbsbid, bbcnttnum, bbaplicacion, bbfecini, bbfecfin,
              bbvardel, bbexpdid, bbcptodel, bbtariddel, bbctponew, bbtaridnew,
              bbfecfinbonif, bbfecinitar
       FROM cf_quere_pro.%I',
      proc_id, r.tablename
    );
    GET DIAGNOSTICS migrated = ROW_COUNT;
    IF migrated > 0 THEN
      RAISE NOTICE 'Migrated % rows from %', migrated, r.tablename;
    END IF;
  END LOOP;
END $$;

-- Drop
DO $$
DECLARE tbl_name TEXT; drop_count INT := 0;
BEGIN
  FOR tbl_name IN
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'cf_quere_pro' AND table_name ~ '^tmpbb_\d+'
  LOOP
    EXECUTE format('DROP TABLE IF EXISTS cf_quere_pro.%I CASCADE', tbl_name);
    drop_count := drop_count + 1;
  END LOOP;
  RAISE NOTICE 'Dropped % tmpbb_* tables', drop_count;
END $$;
```

#### P1-S3-06: Drop Spain-Specific Dead Tables

| Field | Value |
|-------|-------|
| **ID** | P1-S3-06 |
| **Description** | Drop 25+ Spain-specific regional tables that serve no purpose in the CEA Queretaro (Mexico) deployment. These include tables for Baleares, Galicia, Murcia, Catalunya, Cantabria, Extremadura, and Pais Vasco regions. Do NOT drop generic `liq*` tables used for Mexican reporting. |
| **Assignee** | DBA Lead |
| **Effort** | 3 hours |
| **Dependencies** | P1-S1-07 (verified empty), P1-S1-06 (tested on staging) |
| **Acceptance Criteria** | All 25+ Spain-specific tables dropped. Generic `liq*` tables (`liqanual`, `liqanutmtr`, `liqbloquetramo`, etc.) remain intact. No application errors after drop. |

**Drop script:**
```sql
BEGIN;

-- Verify all are empty first
DO $$
DECLARE r RECORD; cnt BIGINT;
BEGIN
  FOR r IN VALUES
    ('liqanubaleares'), ('liqcobbalear'), ('liqcobpobbalear'),
    ('liqdetanubalear'), ('liqdetpobbalear'),
    ('liqanugalicia'), ('liqcobgalicia'), ('liqdetanugalic'),
    ('liqaacfacgali'), ('liqdatfacgali'), ('liqcarfacgali'),
    ('liqdetfacgali'), ('liqautocuadgali'),
    ('liqanumurcia'), ('liqcobmurcia'), ('liqdsimurcia'), ('liqcuadmurcia'),
    ('liqcobcat'), ('liqcieanucat'), ('liqcieabocat'),
    ('liqbloqcat'), ('liqcobpostcat'), ('liqdetvolcat'),
    ('liqautocuadcanta'), ('liqautocuadextr'), ('varbonifpvasco')
  LOOP
    EXECUTE format('SELECT count(*) FROM cf_quere_pro.%I', r.column1) INTO cnt;
    IF cnt > 0 THEN
      RAISE EXCEPTION 'Table % has % rows -- ABORTING', r.column1, cnt;
    END IF;
  END LOOP;
  RAISE NOTICE 'All Spain-specific tables verified empty';
END $$;

-- Drop after verification
DROP TABLE IF EXISTS cf_quere_pro.liqanubaleares CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcobbalear CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcobpobbalear CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqdetanubalear CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqdetpobbalear CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqanugalicia CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcobgalicia CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqdetanugalic CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqaacfacgali CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqdatfacgali CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcarfacgali CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqdetfacgali CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqautocuadgali CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqanumurcia CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcobmurcia CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqdsimurcia CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcuadmurcia CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcobcat CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcieanucat CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcieabocat CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqbloqcat CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqcobpostcat CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqdetvolcat CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqautocuadcanta CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.liqautocuadextr CASCADE;
DROP TABLE IF EXISTS cf_quere_pro.varbonifpvasco CASCADE;

COMMIT;
```

**WARNING**: Drop Spain-specific tables only after confirming with Aqualia ERP team or after verifying on staging that the application starts and functions without them. The A9 report rates this as HIGH risk due to potential ORM entity mappings.

#### P1-S3-07: Drop Persistent Staging and Artifact Tables

| Field | Value |
|-------|-------|
| **ID** | P1-S3-07 |
| **Description** | Drop remaining persistent staging tables (`tmpcntt`, `tmpcrr`, `tmpfac`, `tmpimpufact`, `tmplin`, `tmplinprecsubcon`, `tmpgeo`, `tmpmejdiaremcal`, `tmpses`, `tmpsesevtcliente`, `tmpsesmonproccanc`, `tmp_gestordocumental`, `contratos_aplicacion_anticipo_masivo_tmp`, `tablastmp`), backup artifacts (`zz_backupexpedsif`, `zz_backuphisexpedsif`, `imagenmigradas`), report temp tables (`tmtr*` family), and CFDI staging tables. |
| **Assignee** | DBA Lead |
| **Effort** | 2 hours |
| **Dependencies** | P1-S1-07 (verified safe to drop) |
| **Acceptance Criteria** | All staging/artifact/report-temp tables dropped. `tablastmp` dropped last (it tracks temp tables). |

**Pre-drop safety checks:**
```sql
-- Verify no active sessions in tmpses
SELECT count(*) FROM cf_quere_pro.tmpses;
-- Verify no pending documents
SELECT count(*) FROM cf_quere_pro.tmp_gestordocumental;
```

**Drop script:** Use Steps 2-5 from `phase1_drop_transient_tables.sql` (already implemented).

#### P1-S3-08: Sprint 3 Catalog Vacuum

| Field | Value |
|-------|-------|
| **ID** | P1-S3-08 |
| **Description** | After all Sprint 3 drops, run VACUUM FULL on catalog tables to reclaim space from dropped table metadata. |
| **Assignee** | DBA Lead |
| **Effort** | 2 hours |
| **Dependencies** | P1-S3-03, P1-S3-05, P1-S3-06, P1-S3-07 |
| **Acceptance Criteria** | VACUUM FULL completes on `pg_class`, `pg_attribute`, `pg_statistic`, `pg_depend`. ANALYZE run on all four. |

```sql
VACUUM FULL pg_class;
VACUUM FULL pg_attribute;
VACUUM FULL pg_statistic;
VACUUM FULL pg_depend;
ANALYZE pg_class;
ANALYZE pg_attribute;
```

### Sprint 3 Total Effort: 13 hours

---

## 5. Sprint 4 (Weeks 7-8): Validation and Monitoring

**Goal**: Verify all cleanup results, benchmark performance improvements, patch the application to prevent re-creation, and document results.

### Tasks

#### P1-S4-01: Run Full Verification Queries

| Field | Value |
|-------|-------|
| **ID** | P1-S4-01 |
| **Description** | Execute comprehensive verification to confirm all expected tables are gone, consolidated tables are functional, and no unintended tables were dropped. |
| **Assignee** | DBA Lead |
| **Effort** | 3 hours |
| **Dependencies** | P1-S3-08 |
| **Acceptance Criteria** | All verification queries pass. Total table count is ~1,470 (within 5% tolerance). |

**Verification suite:**
```sql
-- 1. No transient pattern tables remain
SELECT
    CASE
        WHEN tablename ~ '^tmp_deuda_\d+'         THEN 'tmp_deuda_*'
        WHEN tablename ~ '^aux_varscreditored_\d+' THEN 'aux_varscreditored_*'
        WHEN tablename ~ '^tmpbb_\d+'              THEN 'tmpbb_*'
    END AS pattern,
    count(*) AS remaining
FROM pg_tables
WHERE schemaname = 'cf_quere_pro'
  AND (tablename ~ '^tmp_deuda_\d+'
       OR tablename ~ '^aux_varscreditored_\d+'
       OR tablename ~ '^tmpbb_\d+')
GROUP BY 1;
-- Expected: 0 rows returned

-- 2. Consolidated tables exist and have correct column counts
SELECT table_name, count(*) AS col_count
FROM information_schema.columns
WHERE table_schema = 'cf_quere_pro'
  AND table_name IN ('tmp_deuda', 'aux_varscreditored', 'tmpbb')
GROUP BY table_name;
-- Expected: tmp_deuda=6, aux_varscreditored=5, tmpbb=16

-- 3. Total table count
SELECT count(*) AS total_tables
FROM pg_tables WHERE schemaname = 'cf_quere_pro';
-- Expected: ~1,470

-- 4. No staging/artifact tables remain
SELECT tablename FROM pg_tables
WHERE schemaname = 'cf_quere_pro'
  AND tablename IN ('tmpcntt','tmpcrr','tmpfac','tmpimpufact','tmplin',
    'tmplinprecsubcon','tmpgeo','tmpmejdiaremcal','tmpses','tmpsesevtcliente',
    'tmpsesmonproccanc','tmp_gestordocumental','tablastmp',
    'zz_backupexpedsif','zz_backuphisexpedsif','imagenmigradas');
-- Expected: 0 rows

-- 5. Run post-cleanup inventory
-- Re-run pre_cleanup_inventory.sql but store in audit_inventory.table_snapshot_post
```

#### P1-S4-02: Performance Benchmarks (Before/After)

| Field | Value |
|-------|-------|
| **ID** | P1-S4-02 |
| **Description** | Compare key performance metrics against Sprint 1 baselines. Measure catalog size, query planning time, autovacuum cycle time, and pg_dump schema-only time. |
| **Assignee** | DBA Lead |
| **Effort** | 4 hours |
| **Dependencies** | P1-S4-01, P1-S1-04 (baseline) |
| **Acceptance Criteria** | Documented before/after comparison showing improvements. Expected: pg_class reduced by ~2,643 rows, pg_attribute reduced by ~10,000+ rows, pg_dump schema time reduced significantly. |

**Benchmark queries:**
```sql
-- Catalog row counts (compare to P1-S1-04 baseline)
SELECT 'pg_class' AS catalog, count(*) FROM pg_class
UNION ALL SELECT 'pg_attribute', count(*) FROM pg_attribute
UNION ALL SELECT 'pg_statistic', count(*) FROM pg_statistic
UNION ALL SELECT 'pg_depend', count(*) FROM pg_depend;

-- Catalog sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(oid))
FROM pg_class WHERE relname IN ('pg_class', 'pg_attribute', 'pg_statistic', 'pg_depend');

-- Query planning time test (run EXPLAIN on a representative query, compare plan time)
EXPLAIN (ANALYZE, TIMING)
SELECT c.*, p.* FROM cf_quere_pro.contrato c
JOIN cf_quere_pro.persona p ON c.cnttprsid = p.prsid
WHERE c.cnttnum = 12345;
```

**Shell benchmark:**
```bash
# Schema dump time (compare to Sprint 1 baseline)
time pg_dump --schema-only cf_quere_pro > /dev/null
```

#### P1-S4-03: Application Smoke Testing

| Field | Value |
|-------|-------|
| **ID** | P1-S4-03 |
| **Description** | Execute full billing pipeline smoke test on the cleaned-up database. Test: create billing run, process invoices, run collection session, verify reports generate. Confirm no "table not found" errors in application logs. |
| **Assignee** | QA Engineer |
| **Effort** | 8 hours |
| **Dependencies** | P1-S4-01 |
| **Acceptance Criteria** | Billing pipeline completes end-to-end. No SQL errors in application logs. No references to dropped `tmp_deuda_*`, `aux_varscreditored_*`, or `tmpbb_*` tables. New billing runs use consolidated tables (if application patched) or create new numbered tables (if not yet patched). |

**Test scenarios:**
1. Create a new billing run (`facturacio`) -- verify it completes
2. Run a collection session (`gescartera`) -- verify it completes
3. Run credit variable recalculation -- verify it completes
4. Generate standard reports -- verify no errors
5. Check application logs for any SQL exceptions
6. Verify AQUASIS web application loads all pages without errors

#### P1-S4-04: Patch tarea.tredroptablastemporales Default

| Field | Value |
|-------|-------|
| **ID** | P1-S4-04 |
| **Description** | Update the `tarea.tredroptablastemporales` column default from 0 to 1 so that the AQUASIS framework auto-cleans temporary tables after process completion. This prevents re-accumulation of table-per-process instances. Also update all existing rows where `tredroptablastemporales = 0`. |
| **Assignee** | Backend Developer |
| **Effort** | 2 hours |
| **Dependencies** | P1-S4-03 (smoke test passed) |
| **Acceptance Criteria** | `ALTER TABLE cf_quere_pro.tarea ALTER COLUMN tredroptablastemporales SET DEFAULT 1` executed. All existing rows updated. Next billing run auto-cleans its temp table. |

```sql
-- Change default
ALTER TABLE cf_quere_pro.tarea
    ALTER COLUMN tredroptablastemporales SET DEFAULT 1;

-- Update existing rows
UPDATE cf_quere_pro.tarea
SET tredroptablastemporales = 1
WHERE tredroptablastemporales = 0;

-- Verify
SELECT tredroptablastemporales, count(*)
FROM cf_quere_pro.tarea
GROUP BY tredroptablastemporales;
```

#### P1-S4-05: Patch Application Table-Creation Logic

| Field | Value |
|-------|-------|
| **ID** | P1-S4-05 |
| **Description** | Modify the AQUASIS application code to use consolidated tables instead of creating new `tmp_deuda_<ID>` / `aux_varscreditored_<ID>` / `tmpbb_<ID>` tables. The application must: (1) INSERT into consolidated table with `proceso_id` instead of CREATE TABLE, (2) SELECT with `WHERE proceso_id = <ID>` instead of querying individual tables, (3) DELETE rows with `WHERE proceso_id = <ID>` instead of DROP TABLE. |
| **Assignee** | Backend Developer |
| **Effort** | 16 hours |
| **Dependencies** | P1-S4-04 |
| **Acceptance Criteria** | Application code no longer contains `CREATE TABLE tmp_deuda_`, `CREATE TABLE aux_varscreditored_`, or `CREATE TABLE tmpbb_` statements. Integration test confirms billing run uses consolidated tables. Code deployed to staging and tested. |

**Application changes required:**
1. `INSERT INTO tmp_deuda (proceso_id, ...) VALUES (<ID>, ...)` instead of `CREATE TABLE tmp_deuda_<ID>`
2. `SELECT FROM tmp_deuda WHERE proceso_id = <ID>` instead of `SELECT FROM tmp_deuda_<ID>`
3. `DELETE FROM tmp_deuda WHERE proceso_id = <ID>` instead of `DROP TABLE tmp_deuda_<ID>`
4. Same pattern for `aux_varscreditored` and `tmpbb`

#### P1-S4-06: Document Results

| Field | Value |
|-------|-------|
| **ID** | P1-S4-06 |
| **Description** | Create Phase 1 completion report documenting: tables before/after, performance metrics before/after, issues encountered, rollbacks performed (if any), lessons learned, and recommendations for Phase 2. |
| **Assignee** | DBA Lead |
| **Effort** | 4 hours |
| **Dependencies** | P1-S4-02, P1-S4-03 |
| **Acceptance Criteria** | Document created with all sections complete. Before/after metrics table included. Signed off by team lead. |

#### P1-S4-07: Set Up Re-Accumulation Monitoring

| Field | Value |
|-------|-------|
| **ID** | P1-S4-07 |
| **Description** | Create a monitoring query/cron job that alerts if new `tmp_deuda_*`, `aux_varscreditored_*`, or `tmpbb_*` tables appear. This catches any un-patched code paths that still create per-process tables. |
| **Assignee** | DBA Lead |
| **Effort** | 2 hours |
| **Dependencies** | P1-S4-04 |
| **Acceptance Criteria** | Monitoring script runs daily. Alerts if any table matching `^(tmp_deuda|aux_varscreditored|tmpbb)_\d+` exists. |

**Monitoring script (add to cron):**
```sql
-- re_accumulation_check.sql
DO $$
DECLARE cnt INT;
BEGIN
  SELECT count(*) INTO cnt FROM pg_tables
  WHERE schemaname = 'cf_quere_pro'
    AND (tablename ~ '^tmp_deuda_\d+'
         OR tablename ~ '^aux_varscreditored_\d+'
         OR tablename ~ '^tmpbb_\d+');
  IF cnt > 0 THEN
    RAISE WARNING 'ALERT: % table-per-process tables detected. Application patch may be incomplete.', cnt;
  END IF;
END $$;
```

### Sprint 4 Total Effort: 39 hours

---

## 6. Risk Register

### Sprint 1 Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| R1 | Backup takes too long or exceeds disk space | Low | High | Pre-check disk space. Use `pg_dump -Fc` (compressed). Have secondary backup target ready. |
| R2 | Staging environment differs from production | Medium | Medium | Run `SELECT version()` and schema diff on both. Use same PostgreSQL version on staging. |
| R3 | Non-empty transient tables contain in-flight process data | Low | High | Run P1-S1-07 discovery query. Coordinate with billing team to ensure no active processes. |

### Sprint 2 Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| R4 | Dropping 2,144 tables causes long locks or WAL pressure | Medium | Medium | Drop in batches of 100 with CHECKPOINT. Execute during maintenance window. Monitor `pg_stat_activity` for blocking. |
| R5 | Active billing process references a table being dropped | Low | Critical | Verify no active processes before starting. Use `CASCADE` to handle any dependent views. Check `pg_locks` before each batch. |
| R6 | Application crashes when consolidated table not recognized | Medium | High | Create consolidated table BEFORE dropping any individual tables. Test on staging first. |

### Sprint 3 Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| R7 | Spain-specific table drop causes ORM initialization failure | High | High | Test on staging first. Drop in a separate transaction with immediate application restart test. Have rollback scripts ready. Consider deferring to Phase 5 if risk too high. |
| R8 | tmp_gestordocumental contains pending binary documents | Low | High | Check row count before dropping. Export any documents found. |
| R9 | tmpses has active sessions that lose state | Low | Medium | Check for active sessions. Schedule drop after all sessions expire. |

### Sprint 4 Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| R10 | Application patch incomplete -- some code paths still create per-process tables | High | Medium | Set `tredroptablastemporales = 1` as safety net so framework auto-cleans. Deploy monitoring to catch re-accumulation. |
| R11 | Performance benchmarks show no improvement | Low | Low | VACUUM FULL catalog tables. If still no improvement, check for other catalog bloat sources (views, indexes). |

---

## 7. Definition of Done

Phase 1 is complete when ALL of the following are true:

- [ ] **Table count**: `cf_quere_pro` schema contains <= 1,500 tables (down from 4,114)
- [ ] **Zero transient tables**: No tables matching `^tmp_deuda_\d+`, `^aux_varscreditored_\d+`, or `^tmpbb_\d+` exist
- [ ] **Consolidated tables**: `tmp_deuda`, `aux_varscreditored`, and `tmpbb` exist with correct columns and are functional (INSERT/SELECT/DELETE tested)
- [ ] **tmpbb bug fixed**: Consolidated `tmpbb` uses actual column names (`bbfbleid`, `bbsbid`, etc.), NOT the incorrect names from the original script
- [ ] **Catalog vacuumed**: `VACUUM FULL` completed on `pg_class`, `pg_attribute`, `pg_statistic`, `pg_depend`
- [ ] **No data loss**: All data from non-empty transient tables migrated to consolidated tables
- [ ] **Application functional**: Billing pipeline smoke test passes end-to-end
- [ ] **No application errors**: No SQL "table not found" errors in application logs for 48 hours post-cleanup
- [ ] **Re-accumulation prevention**: `tarea.tredroptablastemporales` defaults to 1 for all rows
- [ ] **Monitoring active**: Daily re-accumulation check script deployed and running
- [ ] **Performance documented**: Before/after metrics comparison completed and filed
- [ ] **Rollback tested**: Rollback scripts verified on staging (can recreate dropped tables if needed)
- [ ] **Stakeholder sign-off**: DBA Lead, Backend Dev, and QA Engineer sign off on completion report

---

## 8. Rollback Plan

### 8.1 Full Rollback (restore entire database)

If catastrophic issues are discovered, restore from the full backup taken in P1-S1-02:

```bash
# Stop application
systemctl stop aquasis

# Restore from backup
pg_restore -d cf_quere_pro --clean --if-exists /backup/backup_pre_phase1_YYYYMMDD.dump

# Verify
psql -d cf_quere_pro -c "SELECT count(*) FROM pg_tables WHERE schemaname = 'cf_quere_pro';"
# Expected: 4,114

# Restart application
systemctl start aquasis
```

**Recovery time**: 1-3 hours depending on database size.

### 8.2 Partial Rollback -- Recreate Individual Table Family

If only one table family needs to be restored (e.g., a specific `tmp_deuda_*` table):

```bash
# Restore specific tables from backup
pg_restore -d cf_quere_pro --table="tmp_deuda_1779865" /backup/backup_pre_phase1_YYYYMMDD.dump
```

### 8.3 Rollback by Sprint

| Sprint | Rollback Method | Time |
|--------|----------------|------|
| Sprint 2 (tmp_deuda_*) | Restore from DDL rollback scripts + migrate data back from consolidated table | 2-4 hours |
| Sprint 3 (aux_vars/tmpbb/Spain) | Restore from DDL rollback scripts | 1-2 hours |
| Sprint 4 (app patch) | Revert application code changes via git revert. Reset `tredroptablastemporales` to 0 | 30 minutes |

### 8.4 Rollback Decision Criteria

Trigger a rollback if:
- Billing pipeline fails to complete after cleanup
- Application cannot start after Spain-specific table drop
- Data loss is confirmed (rows existed in a dropped table with no migration)
- More than 3 critical application errors in 24 hours post-cleanup

---

## 9. Dependencies

### External Dependencies

| Dependency | Required For | Status |
|-----------|-------------|--------|
| Aqualia ERP team confirmation | Dropping Spain-specific tables (P1-S3-06) | PENDING -- request early |
| Billing team schedule | Maintenance windows (P1-S1-08) | PENDING |
| AQUASIS source code access | Application patches (P1-S4-05) | PENDING |
| Staging environment | Script validation (P1-S1-06) | PENDING |

### Internal Dependencies (Task Graph)

```
P1-S1-01 (Inventory) ────> P1-S1-03 (Rollback scripts)
                      ────> P1-S1-07 (Identify data)
                      ────> P1-S1-05 (Fix tmpbb bug)
P1-S1-02 (Backup)    ────> P1-S1-06 (Staging validation)
P1-S1-05 (tmpbb fix) ────> P1-S1-06 (Staging validation)
P1-S1-06 (Staging)   ────> P1-S2-01 (Create tmp_deuda)
P1-S1-07 (Data check) ──> P1-S2-02 (Migrate data)
P1-S2-01 ──> P1-S2-02 ──> P1-S2-03 ──> P1-S2-04 ──> P1-S2-05
P1-S2-05 ──> P1-S3-01 ──> P1-S3-02 ──> P1-S3-03
P1-S1-05 ──> P1-S3-04 ──> P1-S3-05
P1-S3-03/05/06/07 ──> P1-S3-08 (Catalog vacuum)
P1-S3-08 ──> P1-S4-01 ──> P1-S4-02
P1-S4-01 ──> P1-S4-03 (Smoke test)
P1-S4-03 ──> P1-S4-04 (tredroptablastemporales)
P1-S4-04 ──> P1-S4-05 (App patch)
P1-S4-02/03 ──> P1-S4-06 (Document)
P1-S4-04 ──> P1-S4-07 (Monitoring)
```

### What Must Be True Before Starting

1. Production database credentials available with DDL permissions
2. Backup storage with sufficient space allocated
3. Staging environment provisioned and accessible
4. No major billing runs scheduled during first week
5. Team members allocated and available for the full 8-week sprint cycle
6. Change management approval obtained

---

## 10. Staffing

### Required Roles

| Role | Person | Weeks | Hours/Week | Total Hours |
|------|--------|-------|------------|-------------|
| **DBA Lead** | TBD | 1-8 | 40 | ~45 hours of task work + overhead |
| **Backend Developer** | TBD | 1-2, 7-8 | 40 | ~21 hours of task work + overhead |
| **QA Engineer** | TBD | 1-2 (50%), 7-8 (100%) | 20-40 | ~10 hours of task work + overhead |

### Responsibilities by Role

**DBA Lead:**
- Execute all inventory, backup, and monitoring queries
- Run all DROP and CREATE TABLE scripts
- Perform catalog vacuum operations
- Own rollback procedures
- Create performance benchmark reports

**Backend Developer:**
- Fix tmpbb column mismatch bug in Phase 1 script
- Patch AQUASIS application code to use consolidated tables
- Update `tarea.tredroptablastemporales` default
- Review all SQL scripts for correctness

**QA Engineer:**
- Validate scripts on staging environment
- Execute billing pipeline smoke tests
- Monitor application logs for errors post-cleanup
- Verify acceptance criteria for each sprint

---

## Appendix A: Total Effort Summary

| Sprint | Focus | Effort (hours) |
|--------|-------|----------------|
| Sprint 1 | Preparation and Safety | 30 |
| Sprint 2 | tmp_deuda_* Elimination | 9 |
| Sprint 3 | aux_varscreditored_*, tmpbb_*, Spain tables | 13 |
| Sprint 4 | Validation, Patching, Documentation | 39 |
| **Total** | | **91 hours** |

## Appendix B: Expected Table Count Progression

| Milestone | Tables | Reduction |
|-----------|--------|-----------|
| Start | 4,114 | -- |
| After Sprint 2 (tmp_deuda_* dropped) | ~1,970 | -2,144 |
| After Sprint 3 (aux_vars/tmpbb/Spain/staging dropped) | ~1,440 | -530 |
| Final (after verification) | ~1,440-1,470 | **64-65% total reduction** |

## Appendix C: Files Referenced

| File | Purpose |
|------|---------|
| `db_audit/phase1_drop_transient_tables.sql` | Existing cleanup scripts (contains tmpbb bug) |
| `db_audit/pre_cleanup_inventory.sql` | Baseline inventory queries |
| `reports/DATABASE_OPTIMIZATION_PLAN.md` | Overall optimization plan |
| `reports/division-a/A9-antipatterns-analysis.md` | Anti-pattern analysis (source of tmpbb bug finding) |
