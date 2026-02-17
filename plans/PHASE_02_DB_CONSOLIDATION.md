# Phase 2: History & Lookup Consolidation

**Project:** AquaCIS Modernization -- CEA Queretaro
**Phase:** 2 of 10
**Timeline:** Months 2-4 (8 weeks / 4 sprints)
**Target:** Reduce table count from ~1,470 to ~1,150 (~320 tables eliminated)
**Risk Level:** MEDIUM
**Prerequisite:** Phase 1 (Emergency DB Cleanup) fully completed and validated

---

## 1. Phase Overview

### 1.1 Goal

Consolidate 230+ mirrored `his*` (history) tables and 80+ `tipo*`/`estado*` lookup tables using two JSONB-based unified tables:

1. **`audit_log`** -- Replaces 120-150 low-volume history tables with a single partitioned audit table using JSONB diff tracking.
2. **`domain_value`** -- Replaces 26 pure two-column `tipo*` tables + 15 simple `estado*` tables with a single polymorphic lookup table.

High-value history tables (18 tables with regulatory/compliance requirements) and complex configuration tables (12 tables with 10+ meaningful columns) are retained as dedicated tables with structural improvements.

### 1.2 Key Metrics

| Metric | Before | After | Reduction |
|--------|--------|-------|-----------|
| History tables (`his*`) | 230 | ~88 | ~142 eliminated |
| Lookup tables (`tipo*`, `estado*`) | 80 + 9 | 12 + 2 | ~75 eliminated |
| Junction tables | 10 | 1 | 9 eliminated |
| **Total tables eliminated** | -- | -- | **~320** |
| Estimated table count | ~1,470 | ~1,150 | ~22% reduction |

### 1.3 Team

| Role | Count | Responsibility |
|------|-------|----------------|
| DBA Lead | 1 | Schema design, partitioning, trigger functions, migration scripts |
| DBA | 1 | Migration execution, data validation, backward-compatible views |
| Backend Developer | 2 | Application code updates (AQUASIS SOAP endpoints, stored procedures) |
| QA Engineer | 1 | Regression testing, data integrity validation |
| Project Manager | 1 | Coordination, risk tracking, stakeholder communication |

### 1.4 Prerequisites

- [ ] Phase 1 complete: temporary tables cleaned, table count at ~1,470
- [ ] Full database backup taken and verified (point-in-time recovery tested)
- [ ] Development/staging environment mirrors production schema
- [ ] AQUASIS application code repository accessible to backend developers
- [ ] Change management approval for schema modifications
- [ ] Monitoring dashboards configured for query performance baselines

---

## 2. Sprint 1 (Weeks 1-2): Unified Audit Log Design & Pilot

**Sprint Goal:** Design and deploy the `audit_log` table with generic trigger function. Validate on 5 pilot `his*` tables.

### 2.1 Tasks

| ID | Task | Assignee | Effort (h) | Dependencies | Acceptance Criteria |
|----|------|----------|------------|--------------|---------------------|
| P2-S1-01 | Design `audit_log` table with JSONB diff columns, partitioned by `al_changed_at` (monthly ranges) | DBA Lead | 8 | None | Table DDL reviewed; includes `al_id`, `al_table_name`, `al_record_key`, `al_operation` (I/U/D), `al_old_data`, `al_new_data`, `al_changed_fields`, `al_sesid`, `al_user_id`, `al_changed_at`, `al_expid`; partitioned by RANGE on `al_changed_at` |
| P2-S1-02 | Create 24 months of forward partitions using pg_partman | DBA Lead | 4 | P2-S1-01 | Partitions `audit_log_2026_03` through `audit_log_2028_02` created; pg_partman configured for auto-creation |
| P2-S1-03 | Create indexes: composite on `(al_table_name, al_record_key, al_changed_at)`, user index on `(al_user_id, al_changed_at)`, GIN index on `al_changed_fields` | DBA Lead | 4 | P2-S1-01 | All 3 indexes created; EXPLAIN plans show index usage for typical queries |
| P2-S1-04 | Implement `fn_audit_trigger()` -- generic AFTER trigger function supporting INSERT/UPDATE/DELETE with JSONB diff for updates | DBA Lead | 12 | P2-S1-01 | Function handles I/U/D operations; UPDATE captures only changed fields in `al_changed_fields`; uses `current_setting('app.current_user', true)` for user tracking; passes PK column name via `TG_ARGV[0]` |
| P2-S1-05 | Write unit tests for `fn_audit_trigger()` covering INSERT, UPDATE (single field, multi-field), DELETE, NULL handling, and JSONB edge cases | QA | 12 | P2-S1-04 | Test suite covers 6+ scenarios; all pass on staging |
| P2-S1-06 | Inventory all 230 `his*` tables: classify as Tier 1 (low-volume, migrate to audit_log) or Tier 2 (high-volume, keep dedicated). Cross-reference with A8 analysis | DBA | 16 | None | Spreadsheet with table name, column count, estimated row count, change frequency, tier classification, and justification for each |
| P2-S1-07 | Select 5 pilot tables from Tier 1 for initial migration: `histipooficina`, `histipocatcalle`, `histipocorreo`, `histipositcalle`, `histipositver` | DBA Lead | 2 | P2-S1-06 | 5 tables selected; all have <100 historical rows; base tables identified |
| P2-S1-08 | Write migration script for pilot: backfill existing `his*` data into `audit_log`, attach triggers to base tables | DBA | 12 | P2-S1-04, P2-S1-07 | Migration script tested on staging; row counts match; no data loss |
| P2-S1-09 | Execute pilot migration on staging environment | DBA | 4 | P2-S1-08 | 5 pilot tables migrated; triggers firing correctly; backward-compatible views created |
| P2-S1-10 | Validate pilot: compare query results from `his*` tables vs `audit_log` views for all 5 pilots | QA | 8 | P2-S1-09 | 100% data parity confirmed; query performance within 20% of original |
| P2-S1-11 | Document migration runbook: step-by-step procedure for migrating any `his*` table to `audit_log` | DBA Lead | 4 | P2-S1-09 | Runbook reviewed by team; includes rollback steps |

**Sprint 1 Total: ~86 hours**

### 2.2 Deliverables

- `audit_log` table deployed on staging (partitioned, indexed)
- `fn_audit_trigger()` function tested and documented
- 5 pilot `his*` tables migrated with backward-compatible views
- Tier 1/Tier 2 classification spreadsheet for all 230 `his*` tables
- Migration runbook

---

## 3. Sprint 2 (Weeks 3-4): History Migration Wave 1

**Sprint Goal:** Migrate 60-80 low-volume `his*` tables to `audit_log` in production. These are the simplest candidates with the lowest risk.

### 3.1 Tasks

| ID | Task | Assignee | Effort (h) | Dependencies | Acceptance Criteria |
|----|------|----------|------------|--------------|---------------------|
| P2-S2-01 | Prepare batch migration scripts for 44 `histipo*` tables (history of lookup/config tables): `histipobonif`, `histipocsc`, `histipodocumento`, `histipoelem`, `histipolicver`, `histipomensaj`, `histipooficina`, `histiporegulf`, `histiporelps`, `histiposoci`, `histiposubcon`, `histiposucsif`, `histiposumin`, `histipotarifa`, `histipounidad`, `histipovarbonif`, `histipovariable`, `histipovia`, `histipfactura`, `histipfraude`, `histipasiento`, `histipocptocobro`, `histipoconcep`, and remaining 21 | DBA | 20 | Sprint 1 complete | Scripts generated for all 44 tables; each script follows runbook template |
| P2-S2-02 | Prepare batch migration scripts for 8 geographic/address `his*` tables: `hisdirec`, `hiscalle`, `hisnomcalle`, `hisbarrio`, `hislocalidad`, `hispoblacion`, `hislineadistrib`, `hiselemestruc` | DBA | 8 | Sprint 1 complete | Scripts generated for all 8 tables |
| P2-S2-03 | Prepare batch migration scripts for 8 user/security `his*` tables: `hisusuario`, `hisusuexplo`, `hisusuoficina`, `hisusuperfil`, `hisusupermiso`, `hisususociedad`, `hisperfil`, `hispermisos` | DBA | 8 | Sprint 1 complete | Scripts generated for all 8 tables |
| P2-S2-04 | Execute Wave 1 migration -- Batch A (22 `histipo*` tables) on production during maintenance window | DBA Lead | 8 | P2-S2-01 | 22 tables backfilled into `audit_log`; triggers attached to base tables; row counts verified |
| P2-S2-05 | Execute Wave 1 migration -- Batch B (22 `histipo*` tables) on production during maintenance window | DBA Lead | 8 | P2-S2-04 | Remaining 22 histipo* tables migrated; row counts verified |
| P2-S2-06 | Execute Wave 1 migration -- Batch C (geographic + user tables, 16 tables) on production | DBA Lead | 6 | P2-S2-02, P2-S2-03 | 16 tables migrated; triggers attached |
| P2-S2-07 | Create backward-compatible views for all 60 migrated tables | DBA | 16 | P2-S2-04, P2-S2-05, P2-S2-06 | Each dropped `his*` table has a corresponding view that returns identical column names and types via JSONB extraction |
| P2-S2-08 | Verify data integrity: row count comparison, spot-check 10% of records per table, validate JSONB content | QA | 16 | P2-S2-07 | Integrity report with 0 discrepancies; signed off by DBA Lead |
| P2-S2-09 | Update AQUASIS application stored procedures that directly reference migrated `his*` tables (if any) | Backend Dev | 12 | P2-S2-07 | All stored procedures compile; no references to dropped `his*` tables |
| P2-S2-10 | Run AQUASIS regression test suite against staging with migrated tables | QA | 12 | P2-S2-09 | All existing tests pass; no new failures |
| P2-S2-11 | Drop 60 migrated `his*` tables from production (after 1-week observation period with views) | DBA Lead | 4 | P2-S2-08, P2-S2-10 | Tables dropped; views remain as compatibility layer; no application errors in monitoring |

**Sprint 2 Total: ~118 hours**

### 3.2 Deliverables

- 60 `his*` tables migrated to `audit_log` and dropped
- 60 backward-compatible views created
- Updated stored procedures (if applicable)
- Data integrity verification report
- Production monitoring confirms zero regression

---

## 4. Sprint 3 (Weeks 5-6): History Migration Wave 2 + Lookup Design

**Sprint Goal:** Migrate remaining 60-70 low-volume `his*` tables to `audit_log`. Begin design of `domain_value` lookup consolidation.

### 4.1 Tasks

| ID | Task | Assignee | Effort (h) | Dependencies | Acceptance Criteria |
|----|------|----------|------------|--------------|---------------------|
| P2-S3-01 | Prepare batch migration scripts for 28 exploitation config `his*` tables: `hisexplotipvar`, `hisexploestim`, `hisexploperiodic`, `hisexplociclinc`, `hisexplosocpro`, `hisexplosocemi`, `hisexplotloc`, `hisexplotxtcnt`, `hisexplotxtfunc`, `hisexptipdocumento`, `hisexptipsubdoccontr`, `hisexpgestofi`, `hisexpintervalido`, `hisexplcentdist`, `hisexploclausula`, `hisexplomensaje`, `hisexplomotorden`, `hisexploperiodo`, `hisexplorapro`, `hisexpccobro`, `hisexpctafrmpago`, `hisexpservcentral`, `hisexplotiposubrog`, `hisexpvertido`, `hisexsubcontra`, `hispolnegexp`, `hisexpedrecobro`, and remaining | DBA | 14 | Sprint 2 complete | Scripts for all 28 tables generated and tested on staging |
| P2-S3-02 | Prepare batch migration scripts for remaining ~42 miscellaneous low-volume `his*` tables (financial, communication, configuration, fraud) | DBA | 16 | Sprint 2 complete | Scripts for all remaining Tier 1 tables generated |
| P2-S3-03 | Execute Wave 2 migration -- Batch A (28 exploitation config tables) on production | DBA Lead | 8 | P2-S3-01 | All 28 tables backfilled; triggers attached; row counts verified |
| P2-S3-04 | Execute Wave 2 migration -- Batch B (remaining ~42 tables) on production | DBA Lead | 12 | P2-S3-02 | All remaining Tier 1 tables migrated |
| P2-S3-05 | Create backward-compatible views for all ~70 Wave 2 tables | DBA | 16 | P2-S3-03, P2-S3-04 | Views created; column names and types match original `his*` tables |
| P2-S3-06 | Verify data integrity for Wave 2: row counts, spot checks, JSONB validation | QA | 12 | P2-S3-05 | Integrity report with 0 discrepancies |
| P2-S3-07 | Structural improvements on 18 retained high-value `his*` tables: add `hst_operation CHAR(1)` column (I/U/D), add `hst_id BIGSERIAL` primary key, add composite index on `(entity_pk, hsthora DESC)` | DBA Lead | 16 | None | All 18 tables updated; indexes created; no data loss |
| P2-S3-08 | Design `domain_value` table: schema with `dv_id`, `dv_domain`, `dv_code`, `dv_txtid`, `dv_description`, `dv_sort_order`, `dv_is_active`, `dv_extra_json` JSONB, `dv_expid`, audit columns | DBA Lead | 8 | None | DDL reviewed; includes unique constraint on `(dv_domain, dv_code)`, GIN index on `dv_extra_json` |
| P2-S3-09 | Identify and confirm 26 pure two-column `tipo*` tables for immediate consolidation: `tipocatcalle`, `tipocorreo`, `tipooperacion`, `tipositcalle`, `tipositver`, `tipotarifasocial`, `tipoqueja`, `tipoindem`, `tippersautoriz`, `tipcontmtr`, `tipofacturaext`, `estadofraude`, `estadosjuicios`, `tipoalarmatel`, `tipoatencion`, `tipoesttec`, `tipogestcobro`, `tipoincide`, `tiposervicio`, `tiposubrogacion`, `estadossicer`, `estadomotrec`, `tipocsc`, `tiporecface`, `tipvalvula`, `tipocontador` | DBA | 8 | None | All 26 tables confirmed to have <=4 columns; FK dependencies mapped; no complex business logic |
| P2-S3-10 | Design `domain_value_link` junction table for consolidating 10 link/junction `tipo*` tables | DBA Lead | 4 | P2-S3-08 | DDL reviewed; composite PK on `(dvl_link_type, dvl_source_domain, dvl_source_code, dvl_target_domain, dvl_target_code)` |
| P2-S3-11 | Drop Wave 2 `his*` tables from production (after observation period) | DBA Lead | 4 | P2-S3-06 | Tables dropped; views remain; monitoring confirms zero errors |
| P2-S3-12 | Update application code referencing Wave 2 `his*` tables | Backend Dev | 12 | P2-S3-05 | All references updated to use views or `audit_log` directly |

**Sprint 3 Total: ~130 hours**

### 4.2 Deliverables

- Remaining ~70 Tier 1 `his*` tables migrated and dropped
- 18 high-value `his*` tables improved with PK, operation type, indexes
- `domain_value` table designed and reviewed
- `domain_value_link` table designed
- 26 simple `tipo*` tables confirmed for Sprint 4 consolidation

---

## 5. Sprint 4 (Weeks 7-8): Lookup Consolidation

**Sprint Goal:** Migrate 26 simple `tipo*` tables and 15 simple extended tables to `domain_value`. Consolidate 10 junction tables into `domain_value_link`. Verify full application compatibility.

### 5.1 Tasks

| ID | Task | Assignee | Effort (h) | Dependencies | Acceptance Criteria |
|----|------|----------|------------|--------------|---------------------|
| P2-S4-01 | Deploy `domain_value` and `domain_value_link` tables to production | DBA Lead | 4 | P2-S3-08, P2-S3-10 | Tables created with indexes and constraints; pg_partman not needed (single table) |
| P2-S4-02 | Write `migrate_tipo_to_domain()` helper function for automated data migration from `tipo*` tables to `domain_value` | DBA | 8 | P2-S4-01 | Function accepts source table name, domain name, code column, txtid column; handles ON CONFLICT; returns row count |
| P2-S4-03 | Migrate 26 pure two-column `tipo*` tables to `domain_value` | DBA | 12 | P2-S4-02 | All 26 tables data migrated; `dv_domain` set to uppercase table name (e.g., `TIPO_CATCALLE`); row counts match |
| P2-S4-04 | Migrate 15 simple extended `tipo*`/`estado*` tables to `domain_value` using `dv_extra_json` for extra columns: `tipolicver`, `tipocptocobro`, `tipooficina`, `tiposoci`, `tiposobre`, `tipotarifa`, `tipoelem`, `tipfraude`, `tipgesdeud`, `tipimpues`, `tiposubcon`, `tipoobs`, `estfirmaelectronica`, `estopeplatfirma`, `estpersautoriz` | DBA | 16 | P2-S4-02 | All 15 tables migrated; extra columns stored in `dv_extra_json` JSONB; row counts match |
| P2-S4-05 | Migrate 10 junction/link `tipo*` tables to `domain_value_link`: `tipoactsucsif`, `tipoenvfac`, `tipoordenperf`, `tipptoservtao`, `tipovarepi`, `tipoviaaca`, `tipliqsoc`, `tipfacgasrec`, `tipfichtao`, `tipobonifdoc` | DBA | 8 | P2-S4-01 | All 10 link tables migrated; relationship integrity preserved |
| P2-S4-06 | Create backward-compatible views for all 51 migrated lookup tables (26 + 15 + 10) | DBA | 20 | P2-S4-03, P2-S4-04, P2-S4-05 | Each view returns original column names and types; SELECT queries against views produce identical results to original tables |
| P2-S4-07 | Update AQUASIS stored procedures and SOAP endpoints referencing migrated `tipo*`/`estado*` tables | Backend Dev 1 | 20 | P2-S4-06 | All references updated; application compiles without errors |
| P2-S4-08 | Update AQUASIS WSDL service layer for affected lookups (tipo/estado endpoints) | Backend Dev 2 | 16 | P2-S4-06 | WSDL contracts unchanged; responses identical for consumers |
| P2-S4-09 | Verify 12 complex configuration tables left untouched: `tipocontratcn` (37 cols), `tiposolaco` (29 cols), `tipodocumento` (22 cols), `tipobonif` (21 cols), `tiporegulf` (17 cols), `tipomensaj` (15 cols), `tipovariable` (14 cols), `tiposumin` (12 cols), `tipounidad` (11 cols), `tipoconcep` (11 cols), `tipoorden` (10 cols), `tipasiento` (10 cols) | QA | 4 | None | All 12 tables confirmed unchanged; no missing FK references |
| P2-S4-10 | Full regression test: run AQUASIS test suite against production-like environment with all Phase 2 changes | QA | 16 | P2-S4-07, P2-S4-08 | All tests pass; performance benchmarks within 15% of baseline |
| P2-S4-11 | Drop 51 migrated `tipo*`/`estado*`/junction tables from production (after 1-week observation) | DBA Lead | 4 | P2-S4-10 | Tables dropped; views remain; monitoring confirms zero errors for 48 hours |
| P2-S4-12 | Performance benchmarking: compare query latency for top 20 lookup queries before/after consolidation | DBA Lead | 8 | P2-S4-11 | Benchmark report; all queries within 20% of pre-migration latency; GIN index utilization confirmed |
| P2-S4-13 | Document final state: updated ERD, table inventory, `domain_value` domain registry, `audit_log` table registry | DBA | 8 | P2-S4-11 | Documentation reviewed and approved; domain registry lists all migrated domains |
| P2-S4-14 | Clean up migration helper functions (`migrate_tipo_to_domain`, `migrate_history_to_audit_log`) | DBA | 2 | P2-S4-11 | Functions dropped from production |

**Sprint 4 Total: ~146 hours**

### 5.2 Deliverables

- 26 simple `tipo*` tables consolidated into `domain_value`
- 15 extended `tipo*`/`estado*` tables consolidated into `domain_value`
- 10 junction tables consolidated into `domain_value_link`
- 51 backward-compatible views created
- 12 complex configuration tables verified untouched
- Application code updated and regression-tested
- Performance benchmark report
- Final documentation and domain registry

---

## 6. Risk Register

### Sprint 1 Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `fn_audit_trigger()` performance overhead on high-throughput tables | Medium | High | Pilot on low-volume tables only; benchmark trigger overhead; use `SECURITY DEFINER` to avoid permission checks per row |
| JSONB serialization fails for custom PostgreSQL types | Low | Medium | Test `to_jsonb()` on all column types in pilot tables; add explicit casts for `NUMERIC`, `TIMESTAMP` edge cases |
| pg_partman not installed on production | Low | High | Verify pg_partman availability in Sprint 0; fall back to manual partition creation script if unavailable |

### Sprint 2 Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Backward-compatible views miss column type casting (e.g., `NUMERIC(5,0)` vs `TEXT`) | Medium | Medium | Template each view with explicit casts matching original DDL; validate with `pg_typeof()` comparisons |
| Application code directly references `his*` table names in dynamic SQL | Medium | High | Grep AQUASIS codebase for all `his*` references before dropping tables; maintain views indefinitely if needed |
| Data migration takes longer than maintenance window | Low | High | Batch migrations in groups of 10-15 tables; each batch independently committed and verifiable |

### Sprint 3 Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Adding `hst_id BIGSERIAL` to 18 high-value tables causes table rewrite and downtime | Medium | High | Use `ALTER TABLE ... ADD COLUMN` which is instant for nullable columns; populate via background job; add NOT NULL constraint after backfill |
| Exploitation config tables have undocumented cross-references | Medium | Medium | Map all FK relationships in Sprint 1 inventory; test on staging before production |
| `domain_value` design does not accommodate all `dv_extra_json` patterns | Low | Medium | Review all 15 extended tables' extra columns during design; prototype JSONB queries |

### Sprint 4 Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AQUASIS SOAP endpoints break due to changed underlying table structure | High | High | Views absorb change; but verify WSDL contract tests pass; keep views as permanent compatibility layer |
| FK constraints from other tables reference `tipo*` tables being dropped | Medium | High | Run `pg_depend` and `information_schema.referential_constraints` scan before dropping; update FKs to reference `domain_value` or keep views with `INSTEAD OF` triggers |
| `domain_value` GIN index bloat under write load | Low | Medium | Monitor index size; schedule periodic `REINDEX CONCURRENTLY` if needed |
| Junction table migration loses multi-column relationship semantics | Medium | Medium | Validate all link relationships with JOIN queries before and after migration; keep original tables as backup for 2 weeks |

---

## 7. Definition of Done

### Phase-Level Acceptance Criteria

- [ ] `audit_log` table deployed, partitioned, and receiving live audit data
- [ ] 120-150 low-volume `his*` tables migrated to `audit_log` and dropped from production
- [ ] 18 high-value `his*` tables retained with structural improvements (PK, operation type, indexes)
- [ ] `domain_value` table deployed with all 41 lookup domains populated
- [ ] `domain_value_link` table deployed with 10 junction table relationships
- [ ] 51 `tipo*`/`estado*`/junction tables migrated and dropped from production
- [ ] All dropped tables have backward-compatible views in place
- [ ] Total table count reduced from ~1,470 to ~1,150 (verified via `information_schema.tables` count)
- [ ] AQUASIS regression test suite passes at 100%
- [ ] No application errors in production monitoring for 48 hours post-deployment
- [ ] Query performance benchmarks within 20% of pre-migration baselines
- [ ] All migration documentation and domain registries completed and reviewed

### Per-Sprint Exit Criteria

- All tasks in sprint marked complete
- Data integrity verification report signed off by DBA Lead
- QA regression tests pass
- No P1/P2 incidents in production related to Phase 2 changes
- Sprint retrospective completed and documented

---

## 8. Rollback Plan

### 8.1 Pre-Migration Safety

Before each migration batch:
1. Take a named snapshot/backup: `pg_dump --schema=cf_quere_pro --table=<his_table> -Fc > his_<table>_backup.dump`
2. Record exact row counts for source and target
3. Verify backward-compatible view returns identical results

### 8.2 Rollback Procedures

**Level 1 -- View Rollback (minutes):**
If a view is incorrect, drop and recreate from the original table (still present during observation period):
```sql
DROP VIEW IF EXISTS <view_name>;
-- Original table still exists during observation period
```

**Level 2 -- Table Restore (minutes to hours):**
If a `his*` table was dropped prematurely:
```sql
-- Restore from dump
pg_restore -d cf_quere_pro -t <his_table> his_<table>_backup.dump
-- Remove trigger from base table
DROP TRIGGER IF EXISTS trg_audit_<base_table> ON <base_table>;
```

**Level 3 -- Full Audit Log Restore (hours):**
If `audit_log` data is corrupted or trigger function has a defect:
```sql
-- Disable all audit triggers
SELECT format('ALTER TABLE %I DISABLE TRIGGER trg_audit_%I;', tablename, tablename)
FROM pg_tables WHERE schemaname = 'cf_quere_pro';
-- Restore original his* tables from backup
-- Re-enable original application history logic
```

**Level 4 -- Full Phase Rollback (hours to 1 day):**
Restore entire schema from pre-Phase 2 backup:
```sql
pg_restore --clean --if-exists -d cf_quere_pro pre_phase2_full_backup.dump
```

### 8.3 Rollback Decision Matrix

| Condition | Action | Decision Maker |
|-----------|--------|---------------|
| Single view returns wrong data | Level 1: Fix view | DBA |
| Multiple views affected, data intact in `audit_log` | Level 1: Fix views in batch | DBA Lead |
| Data missing from `audit_log` after migration | Level 2: Restore source table, re-migrate | DBA Lead |
| Trigger function causing performance degradation | Level 3: Disable triggers, investigate | DBA Lead + PM |
| Widespread application failures | Level 4: Full rollback | PM + Stakeholders |

---

## 9. Dependencies

### 9.1 Upstream Dependencies

| Dependency | Required By | Status |
|------------|------------|--------|
| Phase 1 complete (table count at ~1,470) | Sprint 1 start | Pending |
| pg_partman extension available | P2-S1-02 | Verify |
| Production maintenance windows scheduled (4 windows, 2h each) | Sprints 2-4 | Pending |
| AQUASIS source code access | Sprints 2-4 | Pending |
| Staging environment parity with production | Sprint 1 | Pending |

### 9.2 Downstream Dependencies

| This Phase Enables | Affected Phase |
|-------------------|----------------|
| Clean schema for FK constraint addition | Phase 3 (Structural Fixes) |
| Reduced table count for migration tooling | Phase 4 (API Integration) |
| `audit_log` table available for new modules | Phase 6 (Microservices) |
| `domain_value` as centralized lookup for API responses | Phase 5 (SOAP to REST) |

### 9.3 Application Code Changes Required

| Area | Change | Sprint | Effort |
|------|--------|--------|--------|
| Stored procedures referencing `his*` tables | Update to use `audit_log` views or direct queries | 2, 3 | Included in sprint estimates |
| SOAP endpoints returning lookup data | Update to query `domain_value` via views | 4 | Included in sprint estimates |
| Batch jobs writing to `his*` tables | Replace with trigger-based audit capture | 2, 3 | Included in sprint estimates |
| Admin UI for lookup management | Update to manage `domain_value` rows by domain | 4 | 16h (not included -- may be deferred) |

---

## 10. Staffing & Effort Summary

### 10.1 Per-Role Effort

| Role | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 | Total |
|------|----------|----------|----------|----------|-------|
| DBA Lead | 34h | 26h | 32h | 18h | **110h** |
| DBA | 28h | 44h | 38h | 50h | **160h** |
| Backend Dev (x2) | 0h | 12h | 12h | 36h | **60h** |
| QA | 20h | 28h | 16h | 20h | **84h** |
| PM (overhead, ~10%) | 4h | 8h | 8h | 8h | **28h** |
| **Sprint Total** | **86h** | **118h** | **130h** | **146h** | **480h** |

### 10.2 Calendar Timeline

| Sprint | Weeks | Key Milestone |
|--------|-------|---------------|
| Sprint 1 | Weeks 1-2 (Month 2) | `audit_log` deployed; 5 pilots migrated |
| Sprint 2 | Weeks 3-4 (Month 2-3) | 60 `his*` tables migrated and dropped |
| Sprint 3 | Weeks 5-6 (Month 3) | Remaining `his*` migrated; `domain_value` designed |
| Sprint 4 | Weeks 7-8 (Month 3-4) | Lookup consolidation complete; ~1,150 tables |

### 10.3 Key Assumptions

- Maintenance windows of 2 hours are available bi-weekly (Saturday nights)
- DBA Lead and DBA are full-time dedicated to this phase
- Backend developers are 50% allocated (shared with other project work)
- QA engineer is 50% allocated
- No major schema changes from other teams during Phase 2
