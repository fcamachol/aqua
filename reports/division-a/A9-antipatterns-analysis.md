# A9: Structural Anti-Patterns and Technical Debt Analysis

> **Agent**: A9 (db-antipatterns)
> **Database**: cf_quere_pro (CEA Queretaro / AQUASIS)
> **Date**: 2026-02-16
> **Source files**: `db_audit/DATABASE_AUDIT.md`, `db_mapping/DATABASE_MAP.md`, phase 1-5 SQL scripts, pre-cleanup inventory, verification queries

---

## Executive Summary

The AquaCIS database `cf_quere_pro` carries a **Technical Debt Severity Score of 9 out of 10** (critical). Of the 4,114 tables in the database, approximately **2,880 to 2,960 are unnecessary** -- meaning roughly 70% of the database catalog is structural waste. The single most damaging pattern is the "table-per-process" anti-pattern, where the application creates a new physical table for each billing or credit-adjustment process run, rather than inserting rows into a shared table with a discriminator column. This has produced 2,144 identical `tmp_deuda_*` tables and 477 identical `aux_varscreditored_*` tables. Combined with Spain-specific dead code, orphaned GIS caches, duplicated municipality views, and excessive lookup/history table proliferation, the database suffers from severe PostgreSQL catalog bloat that degrades planning time, vacuum efficiency, and overall operational stability.

The existing cleanup SQL scripts (phases 1 through 5) are well-structured, appropriately sequenced, and incorporate safety guards. However, several gaps exist: Phase 2 leaves the bulk of GIS cache tables unaddressed, Phase 3 migrations are entirely commented out, Phase 4 has an incomplete `v_key` extraction pattern, and Phase 5 correctly defers to Aqualia but lacks a fallback strategy. With disciplined execution, the database can be reduced to approximately **1,150 to 1,230 tables** after the five defined phases, or potentially **300 to 400 tables** with aggressive history and lookup consolidation.

---

## Anti-Pattern Inventory

### 1. tmp_deuda_* -- Table-Per-Process Anti-Pattern

| Attribute | Value |
|-----------|-------|
| **Count** | 2,144 tables |
| **Structure** | 4 columns each: `importe` (numeric 18,2), `numfacturas` (int), `facsocemi` (int), `faccnttnum` (int) |
| **Pattern** | `tmp_deuda_NNNNNNN` where NNNNNNN is a process/session ID |
| **Schema** | cf_quere_pro |
| **Risk to drop** | LOW |

**Root Cause Analysis**: The AQUASIS application framework (developed by Aqualia, Spain) uses a design pattern where each billing collection batch creates its own temporary debt-calculation table. The numeric suffix corresponds to an internal process ID (likely from the `tarea`/`tarcontenedor` task scheduling system -- column `tredroptablastemporales` in the `tarea` table explicitly references temporary table cleanup, confirming this is a known framework behavior). The `tablastmp` table (6 columns: `ttmpid`, `ttmporigen`, `ttmpobs`, `ttmpestado`, `ttmptreid`, `ttmpfecha`) acts as a registry that tracks these dynamically-created tables.

**Why 2,144?**: CEA Queretaro runs billing cycles for 13 municipalities across multiple zones and periods. Over years of operation, each billing batch (`facturacio`) and each collection session (`gescartera`) spawns one or more `tmp_deuda_*` tables. With no automated cleanup (the `tredroptablastemporales` field defaults to 0, meaning "do not auto-drop"), these tables accumulate indefinitely. The numeric range of suffixes (e.g., 1779865 through the 3-million range for `aux_varscreditored_*`) suggests these IDs come from a global sequence, meaning roughly 2,144 separate billing/debt calculation processes have been run over the system's lifetime.

**Impact**:
- Each table adds an entry to `pg_class`, `pg_attribute` (4 columns x 2,144 = 8,576 attribute rows), `pg_statistic`, and other catalog tables
- Estimated catalog bloat: ~50,000+ rows of unnecessary catalog data
- Every `ANALYZE`, catalog scan, and `information_schema` query must traverse these entries
- Connection startup and query planning are slowed by catalog cache pressure

**Correct Alternative**: A single `tmp_deuda` table with a `proceso_id` column, as defined in `phase1_drop_transient_tables.sql` (line 22-36). The replacement table adds `proceso_id BIGINT NOT NULL` and `created_at TIMESTAMP` columns, indexed on `proceso_id`.

---

### 2. aux_varscreditored_* -- Credit Variable Staging Anti-Pattern

| Attribute | Value |
|-----------|-------|
| **Count** | ~477 tables |
| **Structure** | 3 columns each: `cnttnum` (numeric 10,0), `impvariable` (numeric 18,2), `impvaranterior` (numeric 18,2) |
| **Pattern** | `aux_varscreditored_NNNNNNN` where NNNNNNN is a process ID |
| **Schema** | cf_quere_pro |
| **Risk to drop** | LOW |

**Root Cause Analysis**: These tables support the credit re-calculation process. When the system recalculates variable-rate charges for contracts (`contrato`), it stages the old and new variable amounts (`impvariable` vs. `impvaranterior`) per contract number (`cnttnum`) in a dedicated table. The suffix numbers (e.g., 3018531-3018566 visible in the DATABASE_MAP) are in the 3-million range, confirming they share the same global sequence as `tmp_deuda_*` but represent a different process type -- likely tied to the `variable` table (13 columns, contract-level dynamic data) and tariff recalculation runs.

**Impact**: Same catalog bloat pattern as `tmp_deuda_*`. With 477 tables x 3 columns = 1,431 unnecessary `pg_attribute` entries.

**Correct Alternative**: Single `aux_varscreditored` table with `proceso_id`, as defined in `phase1_drop_transient_tables.sql` (lines 39-52).

---

### 3. tmpbb_* -- Bonus/Subsidy Removal Staging Anti-Pattern

| Attribute | Value |
|-----------|-------|
| **Count** | 22 tables |
| **Structure** | 14 columns each (mirrors `bajabonificacion` table structure) |
| **Pattern** | `tmpbb_NNNNNNN` |
| **Schema** | cf_quere_pro |
| **Risk to drop** | LOW |

**Root Cause Analysis**: These tables stage data for the bulk removal of subsidies/bonuses (`bajabonificacion`). The 14-column structure includes: `bbfbleid`, `bbsbid`, `bbcnttnum`, `bbaplicacion`, `bbfecini`, `bbfecfin`, `bbvardel`, `bbexpdid`, `bbcptodel`, `bbtariddel`, `bbctponew`, `bbtaridnew`, `bbfecfinbonif`, `bbfecinitar`. This is a less-frequent process than billing (22 tables vs 2,144), confirming that subsidy reviews happen periodically rather than per billing cycle.

**Note on Phase 1 Script Discrepancy**: The `phase1_drop_transient_tables.sql` replacement `tmpbb` table (lines 56-80) defines 15 columns with different column names than those found in the actual `tmpbb_*` tables documented in `chunk_t.md`. The Phase 1 script uses `bbid, bbexpid, bbcnttnum, bbcptoid, bbtconid, bbfecini, bbfecfin, bbimporte, bbtipbonif, bbfacidfact, bbhstusu, bbhsthora, bbsesid, bbobsid` while the actual tables have `bbfbleid, bbsbid, bbcnttnum, bbaplicacion, bbfecini, bbfecfin, bbvardel, bbexpdid, bbcptodel, bbtariddel, bbctponew, bbtaridnew, bbfecfinbonif, bbfecinitar`. **This is a critical gap -- the replacement table schema does not match the actual tables.**

---

### 4. Spain-Specific Regional Tables -- Dead Code from Framework Origin

| Attribute | Value |
|-----------|-------|
| **Count** | 25+ tables |
| **Spanish Regions Represented** | Baleares (5), Galicia (8), Murcia (4), Catalunya (6), Cantabria (1), Extremadura (1), Pais Vasco (1) |
| **Risk to drop** | HIGH (framework dependency) |

**Full Inventory by Region**:

| Region | Tables | Column Counts |
|--------|--------|---------------|
| **Baleares** | `liqanubaleares` (6), `liqcobbalear` (6), `liqcobpobbalear` (10), `liqdetanubalear` (8), `liqdetpobbalear` (10) | 5 tables |
| **Galicia** | `liqanugalicia` (6), `liqcobgalicia` (10+), `liqdetanugalic` (13+), `liqaacfacgali`, `liqdatfacgali`, `liqcarfacgali`, `liqdetfacgali` (10), `liqautocuadgali` (6) | 8 tables |
| **Murcia** | `liqanumurcia` (6), `liqcobmurcia` (11+), `liqdsimurcia`, `liqcuadmurcia` | 4 tables |
| **Catalunya** | `liqcobcat` (6), `liqcieanucat` (8+), `liqcieabocat` (8+), `liqbloqcat` (6), `liqcobpostcat` (10+), `liqdetvolcat` (10+) | 6 tables |
| **Cantabria** | `liqautocuadcanta` (16) | 1 table |
| **Extremadura** | `liqautocuadextr` (16) | 1 table |
| **Pais Vasco** | `varbonifpvasco` | 1 table |

**Root Cause Analysis**: AQUASIS was developed by Aqualia (a Spanish water utility company) for deployment across Spain's autonomous communities. Each region has distinct regulatory requirements for liquidation reporting (`liq*` prefix = "liquidacion"). These tables implement region-specific financial settlement calculations mandated by Spanish water regulation. When the platform was deployed in Mexico (CEA Queretaro), these tables were included as part of the framework installation but serve no functional purpose in the Mexican regulatory context.

**Why HIGH Risk**: The Aqualia ERP framework codebase likely contains Java class mappings (ORM entities), stored procedures, or view definitions that reference these tables. Even if the tables are empty and never populated in Mexico, dropping them could cause:
- ORM initialization failures if Hibernate/JPA entity classes reference them
- Application startup crashes if `CREATE TABLE IF NOT EXISTS` checks are part of bootstrap
- Stored procedure compilation errors if any `liq*` functions reference them

The `phase5_spain_regional_evaluation.sql` script correctly requires explicit written confirmation from the Aqualia ERP team before dropping. The script includes FK reference checks, view/function dependency scans, and empty-table verification.

**Additional Context**: There are also non-region-specific `liq*` tables that ARE used in Mexico: `liqanual` (8 cols), `liqanutmtr` (12 cols), `liqbloquetramo` (7 cols), `liqblotramtar` (5 cols), `liqcantadet` (21 cols), `liqcantatot` (5+), `liqcobant` (7+), `liqcobfac` (7+), `liqdetanu` (14+). These must NOT be dropped -- they represent the generic liquidation framework used for Mexican reporting.

---

### 5. GIS Cache Tables -- Stale Denormalized Snapshots

| Attribute | Value |
|-----------|-------|
| **Count** | ~25 tables (14 `vgis_*` + 11 `vgiss_*`) |
| **Total columns** | ~180+ across all tables |
| **Risk to drop** | MEDIUM |

**Full Inventory**:

| Table | Columns | Apparent Purpose |
|-------|---------|-----------------|
| `vgis_abonadosacometida` | 10 | Subscriber-to-connection mapping for GIS |
| `vgis_aboncierre` | 2 | Subscriber service cutoff status |
| `vgis_acometidas` | 13 | Connection infrastructure data |
| `vgis_acometidas2` | 13 | Duplicate of above (version?) |
| `vgis_acometidas_calle` | 3 | Connection-street mapping |
| `vgis_acometidas_tecnica` | 13 | Technical connection details |
| `vgis_callejero` | 6 | Street directory |
| `vgis_callespoblacion` | 3 | Street-municipality mapping |
| `vgis_consumoabonado` | 8 | Subscriber consumption for GIS display |
| `vgis_consumoacometida` | 5 | Connection-level consumption |
| `vgis_consumopunto` | 15 | Service point consumption |
| `vgis_nomcalle` | 2 | Street names |
| `vgis_ptoservacometida` | 7 | Service point-connection join |
| `vgis_servacometida` | 3 | Service-connection join |
| `vgiss_abonados` | 35 | Full subscriber detail for GIS |
| `vgiss_acometidas` | 9 | Connection summary for GIS |
| `vgiss_calles` | 4 | Street summary |
| `vgiss_cartasenv` | 6 | Sent correspondence for GIS |
| `vgiss_consumfact` | 7 | Billed consumption for GIS |
| `vgiss_consumreg` | 7 | Registered consumption for GIS |
| `vgiss_explotacion` | 6 | Exploitation summary |
| `vgiss_faccobrada` | 30 | Collected invoices for GIS |
| `vgiss_lectuacom` | 9 | Meter readings for GIS |
| `vgiss_tpconcepto` | 3 | Billing concept types for GIS |
| `vw_gis_sectorizacion` | - | Network sectorization for GIS |

**Root Cause Analysis**: These are denormalized cache tables that flatten data from multiple source tables (`contrato`, `acometida`, `ptoserv`, `servicio`, `factura`, `poldetsum`, etc.) into pre-joined structures that a GIS layer (likely ArcGIS or QGIS) can consume efficiently. The `vgis_` prefix appears to be the first generation, and `vgiss_` the second generation (note the double-s). The existence of `vgis_acometidas` and `vgis_acometidas2` (both 13 columns) confirms uncontrolled version proliferation.

**Impact**:
- Unknown staleness -- no `last_refreshed` column or refresh mechanism is visible
- Data can diverge from source tables, causing GIS map display errors
- Each table requires separate vacuum and analyze cycles
- The `vgiss_faccobrada` table alone has 30 columns of denormalized invoice data

**Correct Alternative**: Replace with PostgreSQL materialized views with `REFRESH MATERIALIZED VIEW CONCURRENTLY` on a schedule. The Phase 2 script acknowledges this (lines 152-167) but only drops 2 of the 25 tables (`vw_gis_inspecciones_old` and `vw_gis_sectorizacion`), leaving **23 GIS cache tables unaddressed**.

---

### 6. Per-Municipality Duplicate Views

| Attribute | Value |
|-----------|-------|
| **Count** | 13 tables (one per municipality) |
| **Structure** | ~50 columns each (identical across all 13) |
| **Pattern** | `vw_gis_pad_usu_<municipality>_new` |
| **Municipalities** | amealco, cadereyta, colon, corregidora, ezequiel_montes, huimilpan, jalpan, marques, pedro_escobedo, pinal, queretaro, santa_rosa, tequisquiapan |
| **Risk to drop** | LOW-MEDIUM |

**Root Cause Analysis**: These were created to provide municipality-filtered datasets for the GIS integration layer. Rather than using a single view/table with a `WHERE municipio = ?` clause, the system created 13 separate tables with physically partitioned data. This is a common anti-pattern in systems that lack parameterized view support or where the consuming GIS tool required distinct table names per data layer.

**Impact**: 13 x 50 = 650 catalog column entries for what should be a single 51-column table. Data synchronization across 13 tables is fragile.

**Correct Alternative**: The Phase 2 script (lines 17-141) properly merges into a single `vw_gis_pad_usu` table with a `municipio` discriminator column and includes row-count verification. This is well-implemented.

---

### 7. Persistent Staging and Temp Tables

| Attribute | Value |
|-----------|-------|
| **Count** | ~14 tables |
| **Risk to drop** | LOW to MEDIUM |

**Inventory**: `tmpcntt` (7), `tmpcrr` (18), `tmpfac` (20), `tmpimpufact` (8), `tmplin` (19), `tmplinprecsubcon` (12), `tmpgeo` (7), `tmpmejdiaremcal` (3), `tmpses` (9), `tmpsesevtcliente` (11), `tmpsesmonproccanc` (-), `tmp_gestordocumental` (11, contains `bytea` binary data), `contratos_aplicacion_anticipo_masivo_tmp` (-), `tablastmp` (6).

**Root Cause**: Named staging tables used during billing runs (`tmpfac`, `tmplin`, `tmpimpufact` mirror `factura`, `linfactura`, `impufact`), session management (`tmpses`), and document management (`tmp_gestordocumental` stores actual binary documents). These persist between runs because the application does not clean up after successful completion.

**Special risk**: `tmp_gestordocumental` contains `bytea` content (column `tgdcontenido`). Must verify no pending documents exist before dropping.

---

### 8. Backup and Migration Artifacts

| Attribute | Value |
|-----------|-------|
| **Count** | ~4 tables |
| **Risk to drop** | LOW |

`zz_backupexpedsif`, `zz_backuphisexpedsif` (backups of the fraud investigation system), `aux_migracion.apunte_maria` (one-time accounting migration artifact in separate schema), `imagenmigradas` (image migration tracking).

---

### 9. Report Temp Tables (tmtr* family)

| Attribute | Value |
|-----------|-------|
| **Count** | ~9 tables |
| **Risk to drop** | LOW |

`tmtranufac`, `tmtranupad`, `tmtranureg`, `tmtrautocuad`, `tmtrdetcob`, `tmtrdetfac`, `tmtrmtot`, `tmtrmtotpob`, `tmtrsocliqrec` -- all staging tables for the regulatory liquidation reporting system. Regenerable on each report run.

---

### 10. Merge Candidates and Legacy Objects

| Attribute | Value |
|-----------|-------|
| **Merge candidates** | ~8 tables (yields ~6 fewer tables after merging) |
| **Legacy placeholders** | ~6 tables |
| **Risk** | LOW to MEDIUM |

**Merge candidates**:
- `bitacora_beneficio_350` + `bitacora_beneficio_500` --> `bitacora_beneficio` + `tipo` column
- `camemitido` + `cameqemitido` --> `cambio_emitido` + `tipo` column
- `bolsacambi*` + `bolsacambioequipo*` (4 tables) --> 1 table + `tipo` column
- `ingresoscfdi` + `ingresoscfdi2` --> single table
- `cnae` + `cnae_resp` --> single table
- `vw_gis_inspecciones_old` --> DROP (replaced by current version)

**Legacy placeholders**:
- `aboftoint` (1 column, no clear purpose)
- `en_ejecucion` (1 column process lock -- should use advisory locks)
- `tipcontmtr` (1 column, incomplete)
- `t074` (SAP-style naming: `ktopl`, `koart`, `umskz`, `hkont`, `skont`, `ebene` -- German SAP accounting table structure)
- `tbsl` (SAP-style naming)
- `xra_contadores` (meter import staging)

---

## PostgreSQL Impact Assessment

### Catalog Bloat

| Catalog Table | Estimated Extra Rows from Anti-Patterns | Impact |
|---------------|---------------------------------------|--------|
| `pg_class` | ~2,880 unnecessary entries (one per table) | Slows all DDL, `information_schema` queries, `pg_dump` |
| `pg_attribute` | ~12,000+ unnecessary entries (avg 4.2 cols x 2,880 tables) | Bloats column-level catalog; impacts query planner column lookups |
| `pg_statistic` | ~12,000+ entries (one per column) | ANALYZE must update all; wastes autovacuum cycles |
| `pg_depend` | ~15,000+ entries (constraints, indexes, sequences) | Dependency resolution for any DDL becomes slow |
| `pg_stat_user_tables` | ~2,880 entries | Stats collector must track all tables; bloats `pg_stat_activity` |

### Autovacuum and Maintenance Impact

- **Autovacuum worker saturation**: With 4,114 tables, the default `autovacuum_max_workers` (3) must cycle through all tables. Even empty `tmp_deuda_*` tables consume worker scheduling time.
- **ANALYZE overhead**: `pg_stat_user_tables.last_analyze` must be tracked for each table. Auto-analyze triggering evaluates all 4,114 tables.
- **Catalog table bloat**: The catalog tables themselves (`pg_class`, `pg_attribute`) grow beyond what fits in `shared_buffers`, forcing disk I/O for catalog lookups.
- **`pg_dump` duration**: Backing up the database must enumerate all 4,114 tables, their schemas, constraints, and indexes. Even with `--exclude-table-data`, the schema dump is massive.

### Query Planning Impact

- **Planning time**: PostgreSQL's planner caches catalog data in `CatCache`. With 4,114 tables, the cache hit ratio drops, especially for queries using `information_schema` or system catalog joins.
- **Connection startup**: Each new connection loads basic catalog metadata. More tables = longer connection initialization.
- **ORM overhead**: If the application uses Hibernate or similar ORM, entity scanning at startup iterates over all tables, extending application boot time.

### Estimated Performance Improvement After Cleanup

| Metric | Before | After Phase 1 | After All Phases |
|--------|--------|---------------|-----------------|
| Table count | 4,114 | ~1,470 | ~1,150-1,230 |
| `pg_class` entries (approx) | 4,114+ | ~1,470 | ~1,200 |
| `pg_dump` schema time | Baseline | ~60-65% reduction | ~70% reduction |
| Autovacuum cycle time | Baseline | ~60% reduction | ~70% reduction |
| Catalog cache pressure | HIGH | MODERATE | LOW |

---

## Cleanup Script Review

### Phase 1: `phase1_drop_transient_tables.sql`

**Rating**: 8/10 -- Well-structured, safe, nearly complete

**Strengths**:
- Creates replacement tables BEFORE dropping originals (lines 14-82)
- Uses `IF NOT EXISTS` for idempotency
- Dynamic SQL loop with progress logging every 500/100 tables
- `CASCADE` on all drops for safety
- Post-phase validation queries included
- Proper transaction wrapping (BEGIN/COMMIT) for replacement table creation

**Gaps and Risks**:
1. **tmpbb replacement schema mismatch** (CRITICAL): The replacement `tmpbb` table (lines 56-80) has 15 columns with names that do not match the actual 14-column structure found in `tmpbb_*` tables (per `chunk_t.md` line 1668-1688). The script uses `bbid, bbexpid, bbcnttnum, bbcptoid, bbtconid` while actual tables have `bbfbleid, bbsbid, bbcnttnum, bbaplicacion, bbfecini`. This means the application code writing to the replacement will fail or write incorrect data.
2. **No data migration**: The script drops all `tmp_deuda_*` tables without first checking if any contain data that is part of an in-progress billing run. The verification queries script (Section B4) provides sampling, but this is not enforced as a prerequisite gate in Phase 1.
3. **Transaction scope for drops**: The `DO $$ ... $$` blocks for mass drops are not wrapped in explicit transactions. In PostgreSQL, each `DROP TABLE` within a `DO` block auto-commits if outside a transaction. This means a failure midway through dropping 2,144 tables would leave the database in a partially-cleaned state. Recommendation: wrap in `BEGIN...COMMIT` or accept idempotent re-runs.
4. **`tablastmp` dropped without verifying registry**: The `tablastmp` table tracks temp tables, but it is dropped (line 196) without verifying the registry is consistent with the actual temp tables remaining.
5. **No VACUUM FULL after mass drops**: After dropping 2,643 tables, the catalog tables themselves will have massive bloat. A `VACUUM FULL pg_class; VACUUM FULL pg_attribute;` should follow Phase 1.

### Phase 2: `phase2_consolidate_and_merge.sql`

**Rating**: 6/10 -- Good structure but incomplete GIS handling

**Strengths**:
- Municipality view consolidation is thorough with row-count verification (lines 91-123)
- `LIKE ... INCLUDING ALL` correctly copies constraints and indexes
- Merge patterns use existence checks before data migration
- Backward-compatible naming (ingresoscfdi_merged renamed to ingresoscfdi)

**Gaps and Risks**:
1. **23 of 25 GIS cache tables untouched**: Only `vw_gis_inspecciones_old` and `vw_gis_sectorizacion` are dropped (lines 169-173). The remaining 23 `vgis_*`/`vgiss_*` tables are acknowledged but not acted upon. The script states "The actual materialized view definitions require application-level knowledge" (line 166), which is correct but leaves a significant gap.
2. **`LIKE` clause column ordering**: Using `LIKE cf_quere_pro.vw_gis_pad_usu_queretaro_new INCLUDING ALL` assumes the Queretaro table exists and represents the canonical structure. If it differs from other municipality tables, data migration will fail silently.
3. **Queretaro source not dropped**: Line 139 comments out dropping the queretaro source table, leaving 1 redundant table. The script should drop all 13 after verification.
4. **`bolsacambi*` merge missing**: The audit document identifies 4 `bolsacambi*` tables as merge candidates, but Phase 2 does not include them.
5. **No application code update enforcement**: The merges change table names (e.g., `camemitido` --> `cambio_emitido`), but there is no compatibility view to support existing queries during transition.

### Phase 3: `phase3_domain_value_consolidation.sql`

**Rating**: 5/10 -- Good framework, but entirely unexecuted

**Strengths**:
- Generic `domain_value` table design is sound (lines 21-44)
- UNIQUE constraint on `(dv_domain, dv_code)` prevents duplicates
- `dv_extra_json JSONB` column handles edge-case tipo* tables with 1-2 extra columns
- Migration helper function with dynamic SQL and conflict handling (lines 75-116)
- Backward-compatible view template provided (lines 157-163)

**Gaps and Risks**:
1. **All migration calls are commented out** (lines 128-143): Not a single tipo* table is actually migrated. This makes Phase 3 a template, not an executable script.
2. **No DROP statements active**: The tipo* table drops (lines 170-173) are all commented out.
3. **Application dependency unknown**: Phase 3 explicitly requires "Application code updated to use domain_value table for simple lookups" (prerequisite 3), but there is no way to verify this without access to the Java/application source code.
4. **Migration function column name guessing**: The `migrate_tipo_to_domain` function requires explicit column names (`p_code_column`, `p_txtid_column`) per table. Each of the ~35-40 tipo* tables has different column naming conventions (e.g., `tbnid`/`tbntxtid` for tipobonif, `tcscid`/`tcsctxtid` for tipocsc). Getting any wrong will cause silent data corruption or migration failure.
5. **No rollback mechanism**: Once data is migrated and source tables dropped, there is no reverse migration function provided.

### Phase 4: `phase4_audit_log_history.sql`

**Rating**: 6/10 -- Solid design, implementation concerns

**Strengths**:
- JSONB-based audit log is a modern, correct approach (lines 23-51)
- Generic trigger function handles INSERT/UPDATE/DELETE (lines 58-113)
- Changed-column detection using `jsonb_each` comparison (lines 87-90)
- Clear separation of high-volume (keep) vs. low-volume (migrate) history tables
- Discovery query to identify candidates (lines 127-148)

**Gaps and Risks**:
1. **`v_key` extraction is broken**: Lines 73, 83, and 100 use `OLD::TEXT` or `NEW::TEXT` as the record key. This converts the entire row to a text representation, not just the primary key. For a lookup table with 4 columns, this produces a string like `(1,"some text",2,3)` rather than just `1`. The `al_record_key` should extract the actual PK column value.
2. **JSONB storage costs**: For high-traffic tables, storing full `OLD` and `NEW` row states as JSONB can rapidly consume disk space. The script suggests partitioning (line 252) but provides no implementation.
3. **All migration and drop statements are commented out** (lines 220-245): Same as Phase 3 -- this is a template.
4. **Missing `CONCURRENTLY` for index creation**: The three indexes on `audit_log` are created inline, which will lock the table. For a table expected to grow large, concurrent index creation should be used.
5. **Trigger function does not extract session/exploitation context**: The function uses `current_setting('app.current_user', true)` but does not extract `sesid` or `expid`, leaving those audit_log columns always NULL.

### Phase 5: `phase5_spain_regional_evaluation.sql`

**Rating**: 7/10 -- Appropriately cautious, good analysis queries

**Strengths**:
- All DROP statements are commented out with clear "ONLY AFTER AQUALIA CONFIRMATION" gates
- Region classification regex in the analysis query (lines 37-40)
- FK reference check for all 26 Spain tables (lines 62-91)
- View and function reference scanning (lines 97-112)
- Per-table empty-check loop with WARNING for non-empty tables (lines 118-150)

**Gaps and Risks**:
1. **Missing tables in inventory**: The script lists 26 tables but the regex patterns (line 50: `cat$|cat[^a-z]`) could match non-Spain tables like `liqcobfac` (generic, used in Mexico). The regex should be more specific.
2. **No ORM/Java class check**: Even if no SQL-level references exist, Hibernate entity mappings can reference tables. The script cannot detect this.
3. **No fallback strategy**: If Aqualia never confirms, these 25 tables stay forever. The script should suggest a "namespace isolation" alternative (e.g., `ALTER TABLE ... SET SCHEMA spain_legacy`).
4. **Additional Spain-adjacent tables not listed**: `liqcantadet` (21 cols, contains Cantabria-specific field names like `lcd*`), `liqcantatot`, and `liqliqanumurc` may also be Spain-specific but are not in the drop list.

### Pre-Cleanup Inventory: `pre_cleanup_inventory.sql`

**Rating**: 9/10 -- Excellent baseline capture

**Strengths**:
- Creates a dedicated `audit_inventory` schema for snapshots
- Captures estimated row counts via `pg_stat_get_live_tuples`
- Records physical sizes via `pg_total_relation_size`
- Category classification using regex pattern matching
- FK dependency snapshot for safe-drop verification
- Empty table identification
- Top 50 largest tables report

**Minor gap**: Does not capture index count per table, which would help quantify the full catalog footprint.

### Verification Queries: `verification_queries.sql`

**Rating**: 8/10 -- Comprehensive safety net

**Strengths**:
- Individual table safety checks (FK in, FK out, row count, view references, function references, trigger references)
- Batch structure verification for all three transient patterns
- Sample row-count spot checks with random sampling
- Post-cleanup orphan FK detection
- Broken view detection loop

**Minor gap**: Section A5 uses `LIKE '%<TABLE_NAME>%'` which can produce false positives for short table names. Should use word-boundary matching.

---

## Risk Matrix

| Risk | Probability | Severity | Impact Description | Mitigation |
|------|------------|----------|-------------------|------------|
| **Active billing process loses data during Phase 1 drop** | LOW | HIGH | If a billing batch is mid-execution and writing to a `tmp_deuda_NNNNNNN` table that gets dropped, that billing run fails and invoices are lost | Schedule Phase 1 during confirmed maintenance window; verify `tablastmp` has no active entries; check `tarcontenedor.tcnestado` for running processes |
| **Application creates new tmp_deuda_* after Phase 1** | HIGH | MEDIUM | The application code still uses `CREATE TABLE tmp_deuda_<id>` pattern; new tables will reappear immediately after cleanup | **Must patch application code** to use consolidated `tmp_deuda` table with `proceso_id` before or immediately after Phase 1 |
| **tmpbb replacement schema mismatch causes insert failures** | HIGH | HIGH | Application writes to consolidated `tmpbb` using old column names, hits column-not-found errors | Fix Phase 1 script to match actual `tmpbb_*` column structure before execution |
| **GIS layer breaks after municipality view consolidation** | MEDIUM | MEDIUM | GIS software configured to read `vw_gis_pad_usu_queretaro_new` will fail on missing table | Create backward-compatible views: `CREATE VIEW vw_gis_pad_usu_queretaro_new AS SELECT * FROM vw_gis_pad_usu WHERE municipio = 'QUERETARO'` |
| **Spain table drop causes Aqualia framework crash** | LOW-MED | CRITICAL | ORM entity initialization fails, application refuses to start | Never execute Phase 5 without written Aqualia confirmation; alternative: move to `spain_legacy` schema |
| **Catalog bloat from mass DROP causes temp issues** | MEDIUM | LOW | Dropping 2,643 tables in one session creates massive WAL volume and catalog dead tuples | Run `VACUUM FULL` on `pg_class`, `pg_attribute` after Phase 1; batch drops in groups of 500 with interim checkpoints |
| **Domain value migration corrupts lookup data** | LOW | HIGH | Incorrect column mapping in Phase 3 migration inserts wrong codes | Test each migration individually in staging; verify row counts and sample values; keep source tables until application is verified |
| **Audit log trigger overhead slows transactions** | MEDIUM | MEDIUM | JSONB serialization on every INSERT/UPDATE/DELETE adds latency to lookup table writes | Only attach triggers to low-volume tables; benchmark trigger overhead in staging |
| **History data loss during Phase 4** | LOW | HIGH | If migration query has bugs, historical audit trail is lost | Archive `his*` table data to CSV before migration; keep source tables for 90 days after |

---

## Cleanup Execution Plan

### Recommended Order and Dependencies

```
Week 1: PREPARATION
  [1] Run pre_cleanup_inventory.sql (baseline snapshot)
  [2] Run verification_queries.sql Section B (structure verification)
  [3] Take full pg_dump backup
  [4] Fix tmpbb replacement schema in Phase 1 script
  [5] Verify no active processes (tablastmp, tarcontenedor)

Week 2: PHASE 1 (LOW RISK) -- Maintenance window: 2-4 hours
  [6] Execute phase1_drop_transient_tables.sql Step 1A (create replacements)
  [7] Execute Steps 1B, 1C, 1D (drop tmp_deuda_*, aux_varscreditored_*, tmpbb_*)
      --> Batch in groups of 500; monitor WAL size
  [8] Execute Step 2 (persistent staging tables)
  [9] Execute Steps 3, 4, 5 (backup artifacts, report temps, CFDI staging)
  [10] Run VACUUM FULL on pg_class, pg_attribute, pg_statistic
  [11] Run post-phase validation queries
  [12] Verify application functions correctly with consolidated tables
  --> Expected result: ~1,470 tables remaining (down from 4,114)

Week 3-4: PHASE 2 (LOW-MEDIUM RISK) -- Maintenance window: 1-2 hours
  [13] Execute municipality view consolidation (Step 1)
  [14] Create backward-compatible views for GIS layer
  [15] Test GIS integration thoroughly
  [16] Execute merge operations (Steps 3-4)
  [17] Validate merged data with row-count checks
  --> Expected result: ~1,410-1,420 tables remaining

Week 5-8: PHASE 3 (MEDIUM RISK) -- Requires application code changes
  [18] Deploy application code changes for domain_value table
  [19] Test tipo* table reads via domain_value in staging
  [20] Execute migrations one domain at a time
  [21] Create backward-compatible views
  [22] Run regression tests
  [23] Drop source tipo* tables only after 2-week burn-in
  --> Expected result: ~1,370-1,380 tables remaining

Week 9-16: PHASE 4 (MEDIUM-HIGH RISK) -- Requires application code changes
  [24] Deploy audit trigger code changes
  [25] Identify low-volume his* tables (run discovery query)
  [26] Migrate history data to audit_log one table at a time
  [27] Attach audit triggers to source tables
  [28] Verify audit trail integrity over 2-week burn-in
  [29] Drop migrated his* tables
  --> Expected result: ~1,190-1,280 tables remaining

Week 17+: PHASE 5 (HIGH RISK) -- Requires Aqualia confirmation
  [30] Submit table list to Aqualia ERP team for review
  [31] Wait for written confirmation
  [32] Run all analysis queries from Phase 5
  [33] Execute drops only for confirmed-safe tables
  --> Expected result: ~1,150-1,230 tables remaining
```

### Rollback Strategy

| Phase | Rollback Method | RPO |
|-------|----------------|-----|
| Phase 1 | Restore from pg_dump. Transient tables have no persistent business value. | Zero data loss (transient data is regenerable) |
| Phase 2 | Restore specific tables from pg_dump. Merged data preserved in consolidated tables. | Zero data loss if backup taken |
| Phase 3 | Backward-compatible views allow instant rollback to old table names. Source tables kept for 2 weeks. | Zero data loss |
| Phase 4 | History data archived to audit_log (JSONB). Source his* tables kept for 90 days. | Zero data loss |
| Phase 5 | Tables are empty in Mexican deployment; no data to lose. Re-create from Aqualia DDL scripts if needed. | Zero data loss |

---

## Table Count Reduction Estimate

| Phase | Action | Tables Removed | Running Total |
|-------|--------|---------------|---------------|
| **Baseline** | - | - | **4,114** |
| **Phase 1** | Drop tmp_deuda_* (2,144), aux_varscreditored_* (477), tmpbb_* (22), persistent tmp (14), backup/migration (4), report tmp (9), CFDI staging (3) | **~2,673** | **~1,441** |
| _Phase 1 adds_ | Create 3 replacement tables | +3 | **~1,444** |
| **Phase 2** | Merge municipality views (12), drop GIS caches (2), merge duplicates (6), drop legacy (5) | **~25** | **~1,419** |
| _Phase 2 adds_ | Create 4 consolidated tables | +4 | **~1,423** |
| **Phase 3** | Consolidate tipo* tables (~35-40) | **~35-40** | **~1,383-1,388** |
| _Phase 3 adds_ | Create 1 domain_value table | +1 | **~1,384-1,389** |
| **Phase 4** | Consolidate his* tables (~100-180) | **~100-180** | **~1,204-1,289** |
| _Phase 4 adds_ | Create 1 audit_log table | +1 | **~1,205-1,290** |
| **Phase 5** | Drop Spain tables (~25) | **~25** | **~1,180-1,265** |
| **FINAL ESTIMATED RANGE** | | | **~1,150-1,230** |

With aggressive Phase 4 execution (migrating 180 his* tables), the lower bound approaches ~1,150 tables -- a **72% reduction** from 4,114.

---

## Recommendations

### HIGH Priority

| # | Recommendation | Effort | Expected Reduction |
|---|---------------|--------|-------------------|
| H1 | **Execute Phase 1 immediately** -- Drop all 2,643 table-per-process instances. This is the single highest-impact action with lowest risk. | 1 day (includes backup, execution, validation) | 2,643 tables |
| H2 | **Fix tmpbb replacement table schema** before Phase 1 execution. The current column definitions in `phase1_drop_transient_tables.sql` do not match actual `tmpbb_*` table structures. | 2 hours | Prevents post-cleanup failures |
| H3 | **Patch application to stop creating table-per-process tables**. Without this, `tmp_deuda_*` tables will immediately re-accumulate after Phase 1. The `tarea` table's `tredroptablastemporales` field should be set to auto-cleanup, and the application should be modified to use the consolidated tables. | 2-4 weeks (Java code change) | Prevents recurrence |
| H4 | **Run VACUUM FULL on catalog tables** after Phase 1. Dropping 2,643 tables creates massive dead tuples in `pg_class` and `pg_attribute`. | 1 hour (requires downtime) | Catalog performance recovery |
| H5 | **Create backward-compatible GIS views** before Phase 2 municipality consolidation. Each `vw_gis_pad_usu_<muni>_new` should get a compatibility view pointing to the consolidated table with a WHERE filter. | 4 hours | Prevents GIS layer breakage |

### MEDIUM Priority

| # | Recommendation | Effort | Expected Reduction |
|---|---------------|--------|-------------------|
| M1 | **Convert GIS cache tables to materialized views** (23 remaining `vgis_*`/`vgiss_*` tables). Requires identifying the source queries for each table, likely from the application code or existing stored procedures. | 2-3 weeks | 23 tables replaced with auto-refreshing views |
| M2 | **Implement Phase 3 domain_value consolidation** for simple tipo* tables. Start with the smallest/simplest tables (2-3 column tipo* tables) and expand. | 4-6 weeks (includes app changes) | 35-40 tables |
| M3 | **Implement Phase 4 audit log** for low-change history tables. Prioritize his* tables for tipo* tables (which will already be migrated to domain_value in Phase 3). | 6-8 weeks | 100-180 tables |
| M4 | **Add `created_at` and `last_accessed` tracking** to all new consolidated tables. This enables future stale-data cleanup automation. | 1 week | Prevents future accumulation |
| M5 | **Implement advisory locking** to replace `en_ejecucion` table (1-column process lock). Use `pg_advisory_lock()` / `pg_advisory_unlock()`. | 1 day | 1 table + better concurrency |

### LOW Priority

| # | Recommendation | Effort | Expected Reduction |
|---|---------------|--------|-------------------|
| L1 | **Submit Spain table list to Aqualia** and begin Phase 5 evaluation. Even if they take months to respond, the request should be initiated now. | 1 day to draft request | 25 tables (pending approval) |
| L2 | **Archive `t074` and `tbsl` (SAP tables)** to CSV and document their original purpose. These appear to be remnants from a SAP integration that is no longer active. | 2 hours | 2 tables |
| L3 | **Consolidate `vgis_acometidas` and `vgis_acometidas2`** (both 13 columns, likely version duplicates). | 1 hour | 1 table |
| L4 | **Implement table count monitoring** via a scheduled job that records `SELECT count(*) FROM information_schema.tables` daily. Alert if count increases by more than 10 in a day (indicating table-per-process regression). | 2 hours | Prevention |
| L5 | **Consider partitioning `audit_log` by month** once Phase 4 is active. JSONB rows from 230 source tables will grow quickly. | 1-2 days | Performance maintenance |

---

## Technical Debt Severity Score

| Dimension | Score (1-10) | Rationale |
|-----------|-------------|-----------|
| **Catalog bloat severity** | 10 | 70% of all tables are structural waste. PostgreSQL catalog tables are carrying 2,880+ unnecessary entries. |
| **Operational risk** | 7 | The bloat degrades maintenance operations but does not cause outright failures. The database functions despite the debt. |
| **Recurrence risk** | 9 | Without application code changes, `tmp_deuda_*` tables will re-accumulate at a rate of ~100-200/month based on billing cycles. |
| **Cleanup difficulty** | 4 | Phase 1 (the bulk of the problem) is LOW risk. Phases 3-5 require more effort but are well-documented. |
| **Business impact** | 6 | Backup times, autovacuum efficiency, and connection setup are all degraded, but billing and payments continue to function. |
| **Documentation quality** | 8 | The existing audit and SQL scripts are thorough, well-commented, and properly sequenced. |

### **Overall Technical Debt Severity: 9/10 (Critical)**

The score is driven primarily by the sheer volume of waste (2,643 tables from the table-per-process anti-pattern alone) and the high recurrence risk if the application code is not patched. The saving grace is that the cleanup plan is well-documented and the highest-impact phase (Phase 1) carries the lowest risk. Executing Phase 1 alone would immediately reduce the severity to approximately 5/10.

---

## Appendix: Key File References

| File | Path | Purpose |
|------|------|---------|
| Database Audit | `/Users/fernandocamacholombardo/aqua/db_audit/DATABASE_AUDIT.md` | Master audit document with tier rankings and category analysis |
| Phase 1 Script | `/Users/fernandocamacholombardo/aqua/db_audit/phase1_drop_transient_tables.sql` | Drop 2,643 transient tables |
| Phase 2 Script | `/Users/fernandocamacholombardo/aqua/db_audit/phase2_consolidate_and_merge.sql` | Municipality views and merge operations |
| Phase 3 Script | `/Users/fernandocamacholombardo/aqua/db_audit/phase3_domain_value_consolidation.sql` | tipo* table consolidation template |
| Phase 4 Script | `/Users/fernandocamacholombardo/aqua/db_audit/phase4_audit_log_history.sql` | his* table audit log replacement |
| Phase 5 Script | `/Users/fernandocamacholombardo/aqua/db_audit/phase5_spain_regional_evaluation.sql` | Spain regional table evaluation |
| Pre-Cleanup Inventory | `/Users/fernandocamacholombardo/aqua/db_audit/pre_cleanup_inventory.sql` | Baseline snapshot capture |
| Verification Queries | `/Users/fernandocamacholombardo/aqua/db_audit/verification_queries.sql` | Safety checks and post-cleanup validation |
| Database Map | `/Users/fernandocamacholombardo/aqua/db_mapping/DATABASE_MAP.md` | Full table/column inventory |
| T-tables Chunk | `/Users/fernandocamacholombardo/aqua/db_mapping/chunk_t.md` | tmp_deuda_*, tmpbb_*, tablastmp structures |
| LIQ-tables Chunk | `/Users/fernandocamacholombardo/aqua/db_mapping/chunk_ijlmno.md` | Spain regional liq* table structures |
