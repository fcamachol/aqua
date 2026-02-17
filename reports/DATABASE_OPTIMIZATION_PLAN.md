# AquaCIS Database Optimization Plan

> **Version**: 1.0
> **Date**: 2026-02-16
> **Database**: cf_quere_pro (CEA Queretaro Water Utility)
> **PostgreSQL Target**: 14+
> **Synthesized from**: Division A Reports (A1-A9), Division C Report (C3)

---

## 1. Executive Summary

The AquaCIS database `cf_quere_pro` contains **4,114 tables** serving a water utility billing system for CEA Queretaro, Mexico. Approximately **70% of these tables are structural waste** produced by three dominant anti-patterns:

| Anti-Pattern | Tables | % of Total |
|-------------|--------|------------|
| Table-per-process (`tmp_deuda_*`, `aux_varscreditored_*`, `tmpbb_*`) | 2,643 | 64.2% |
| Mirrored history tables (`his*`) | 231 | 5.6% |
| Lookup table proliferation (`tipo*`, `estado*`) | 95+ | 2.3% |
| GIS caches, per-municipality duplicates, Spain-specific dead code | ~65 | 1.6% |

**Target state: ~230 tables** -- a **94% reduction** achieved through six phases over 10 months.

The core business data model is sound. The billing pipeline (facturacio -> facturable -> factura -> linfactura) is well-designed. The tariff system with date-effective application rules is architecturally correct. The persona/cliente/contrato/ptoserv entity chain properly separates identity from billing role from service agreement. The problems are structural: no FK constraints, god tables (explotacion at 350 columns), pervasive char(1) S/N instead of boolean, plaintext passwords, and varchar-stored GPS coordinates.

**Estimated effort**: 10 months with a 3-person database team, yielding:
- 94% table reduction (4,114 -> ~230)
- 3-5x query planning improvement
- 70% reduction in autovacuum cycle time
- 93% reduction in pg_dump schema time
- Proper referential integrity across all domains

---

## 2. Current State Assessment

### 2.1 Domain Health Scores

| Domain | Report | Score | Critical Issues |
|--------|--------|-------|-----------------|
| **Core Schema** | A1 | 3.5/10 | 350-col god table, no FK constraints, plaintext passwords |
| **Billing** | A2 | 6/10 | No FKs, double precision for money, 105-col contrato |
| **Customer** | A3 | 5/10 | Fragmented contacts, missing email entity, plaintext passwords |
| **Infrastructure** | A4 | 6.5/10 | Varchar GPS, no PostGIS, weak asset condition tracking |
| **Work Orders** | A5 | 6.5/10 | No SLA tables, no crew entity, operator name denormalized |
| **Collections** | A6 | 7/10 | Opaque numeric codes, missing aging buckets, no FK constraints |
| **Lookups/Config** | A7 | 3/10 | 95 tables for ~95 domain values, extreme over-normalization |
| **History/Audit** | A8 | 4/10 | 231 mirrored tables, minimal session model, no retention policies |
| **Anti-Patterns** | A9 | 9/10 severity | 2,643 table-per-process tables, tmpbb schema mismatch bug |

**Weighted Overall: 4.2/10** -- The system is functionally operational but architecturally unsound.

### 2.2 Cross-Cutting Issues

These problems appear across every domain report:

1. **No foreign key constraints anywhere** (A1, A2, A3, A4, A6, A7): All referential integrity is enforced at the application level. Every domain report flags this.

2. **Boolean flags as char(1)** (A1, A2, A3, A4, A5): 250+ columns across core tables use 'S'/'N' instead of PostgreSQL native boolean. Some tables also use 'Y'/'N' and 'X'.

3. **Plaintext credentials** (A1, A3): `cliente.cliwebpass` (varchar 10), `persona.prspassweb` (varchar 10), `sociedad.socpwdsms`, `sociedad.socpwdcert`, `sociedad.socpwdfirma`, `sociedad.soctokenacua`.

4. **No consistent audit pattern** (A8): History tables have varying column name prefixes, no INSERT/UPDATE/DELETE distinction, no link to session, no primary keys.

5. **Catalog bloat** (A9, C3): 4,114 tables generate ~12,000+ pg_class entries, ~75,000 pg_attribute rows, overwhelming autovacuum workers and degrading query planning.

---

## 3. Phase 1: Emergency Cleanup (Month 1)

**Goal**: Eliminate 2,643 table-per-process instances. Reduce from 4,114 to ~1,474 tables.

**Risk**: LOW | **Impact**: HIGHEST | **Downtime**: 2-4 hour maintenance window

### 3.1 Drop 2,144 tmp_deuda_* Tables

Each table has an identical 4-column structure (`importe`, `numfacturas`, `facsocemi`, `faccnttnum`). Created by the AQUASIS billing framework for each billing/collection process, never cleaned up because `tarea.tredroptablastemporales` defaults to 0.

**Step 1: Create consolidated replacement**

```sql
CREATE TABLE tmp_deuda (
    proceso_id  BIGINT NOT NULL,
    importe     NUMERIC(18,2) NOT NULL,
    numfacturas INTEGER NOT NULL,
    facsocemi   NUMERIC(10,0) NOT NULL,
    faccnttnum  NUMERIC(10,0) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_tmp_deuda PRIMARY KEY (proceso_id, faccnttnum)
);
CREATE INDEX idx_tmp_deuda_proceso ON tmp_deuda (proceso_id);
```

**Step 2: Batch drop** (in groups of 500 with interim CHECKPOINT)

```sql
DO $$
DECLARE r RECORD; i INT := 0;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables
           WHERE schemaname = 'cf_quere_pro' AND tablename ~ '^tmp_deuda_\d+$'
  LOOP
    EXECUTE format('DROP TABLE IF EXISTS cf_quere_pro.%I CASCADE', r.tablename);
    i := i + 1;
    IF i % 500 = 0 THEN RAISE NOTICE 'Dropped % tmp_deuda tables', i; END IF;
  END LOOP;
  RAISE NOTICE 'Total dropped: %', i;
END $$;
```

### 3.2 Drop 477 aux_varscreditored_* Tables

Each has 3 identical columns (`cnttnum`, `impvariable`, `impvaranterior`). Same table-per-process pattern.

**Replacement table:**

```sql
CREATE TABLE aux_varscreditored (
    proceso_id     BIGINT NOT NULL,
    cnttnum        NUMERIC(10,0) NOT NULL,
    impvariable    NUMERIC(18,2),
    impvaranterior NUMERIC(18,2),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_aux_varscreditored PRIMARY KEY (proceso_id, cnttnum)
);
```

### 3.3 Fix tmpbb Column Mismatch Bug and Drop 22 tmpbb_* Tables

**CRITICAL BUG (found by A9)**: The existing Phase 1 script defines a replacement `tmpbb` table with 15 columns using names (`bbid`, `bbexpid`, `bbcptoid`, `bbtconid`, etc.) that do **not match** the actual `tmpbb_*` table structure. Actual tables have 14 columns: `bbfbleid`, `bbsbid`, `bbcnttnum`, `bbaplicacion`, `bbfecini`, `bbfecfin`, `bbvardel`, `bbexpdid`, `bbcptodel`, `bbtariddel`, `bbctponew`, `bbtaridnew`, `bbfecfinbonif`, `bbfecinitar`.

**Action**: Fix the replacement table before execution:

```sql
CREATE TABLE tmpbb (
    proceso_id    BIGINT NOT NULL,
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
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT pk_tmpbb PRIMARY KEY (proceso_id, bbcnttnum)
);
```

### 3.4 Drop Persistent Staging and Artifacts

| Category | Tables | Count |
|----------|--------|-------|
| Persistent staging | `tmpcntt`, `tmpcrr`, `tmpfac`, `tmpimpufact`, `tmplin`, `tmplinprecsubcon`, `tmpgeo`, `tmpmejdiaremcal`, `tmpses`, `tmpsesevtcliente`, `tmpsesmonproccanc`, `tmp_gestordocumental` | 12 |
| Backup artifacts | `zz_backupexpedsif`, `zz_backuphisexpedsif` | 2 |
| Report staging | `tmtranufac`, `tmtranupad`, `tmtranureg`, `tmtrautocuad`, `tmtrdetcob`, `tmtrdetfac`, `tmtrmtot`, `tmtrmtotpob`, `tmtrsocliqrec` | 9 |
| Migration artifacts | `imagenmigradas`, SAP tables (`t074`, `tbsl`) | 3 |
| Legacy placeholders | `aboftoint`, `en_ejecucion`, `tipcontmtr`, `tipofacturaext` | 4 |

**Prerequisite**: Verify `tmp_gestordocumental` has no pending documents (contains `bytea` column `tgdcontenido`).

### 3.5 Post-Phase 1 Mandatory Actions

```sql
-- Reclaim catalog bloat from dropping ~2,643 tables
VACUUM FULL pg_class;
VACUUM FULL pg_attribute;
VACUUM FULL pg_statistic;
VACUUM FULL pg_depend;
ANALYZE pg_class;
ANALYZE pg_attribute;
```

### 3.6 Phase 1 Validation Queries

```sql
-- Verify no tmp_deuda_* tables remain
SELECT count(*) FROM pg_tables
WHERE schemaname = 'cf_quere_pro' AND tablename ~ '^tmp_deuda_\d+$';
-- Expected: 0

-- Verify consolidated table exists and is functional
INSERT INTO tmp_deuda (proceso_id, importe, numfacturas, facsocemi, faccnttnum)
VALUES (999999, 100.00, 1, 1, 1);
DELETE FROM tmp_deuda WHERE proceso_id = 999999;

-- Total table count
SELECT count(*) FROM pg_tables WHERE schemaname = 'cf_quere_pro';
-- Expected: ~1,474
```

### 3.7 Application Patch Requirement

**Without patching the AQUASIS application code, `tmp_deuda_*` tables will immediately re-accumulate.** The application must be modified to:

1. Use `INSERT INTO tmp_deuda (proceso_id, ...) VALUES (<ID>, ...)` instead of `CREATE TABLE tmp_deuda_<ID>`
2. Use `SELECT FROM tmp_deuda WHERE proceso_id = <ID>` instead of `SELECT FROM tmp_deuda_<ID>`
3. Use `DELETE FROM tmp_deuda WHERE proceso_id = <ID>` instead of `DROP TABLE tmp_deuda_<ID>`
4. Set `tarea.tredroptablastemporales = 1` to enable auto-cleanup for any legacy code paths

**Expected result**: 4,114 -> ~1,474 tables (**64% reduction**)

---

## 4. Phase 2: History Consolidation (Month 2)

**Goal**: Consolidate 120-150 low-value history tables into a unified JSONB audit_log. Keep 18-25 high-value history tables as dedicated tables.

**Risk**: MEDIUM | **Impact**: HIGH | **Downtime**: Rolling deployment, no downtime

### 4.1 Create the Unified Audit Log

```sql
CREATE TABLE audit_log (
    al_id           BIGINT GENERATED ALWAYS AS IDENTITY,
    al_table_name   VARCHAR(63) NOT NULL,
    al_record_key   TEXT NOT NULL,
    al_operation     CHAR(1) NOT NULL,          -- I/U/D
    al_old_data     JSONB,
    al_new_data     JSONB,
    al_changed_fields JSONB,                    -- diff only for UPDATEs
    al_sesid        NUMERIC(10,0),
    al_user_id      VARCHAR(10) NOT NULL,
    al_changed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    al_expid        NUMERIC(5,0)
) PARTITION BY RANGE (al_changed_at);

-- Monthly partitions (automate with pg_partman)
CREATE TABLE audit_log_2026_01 PARTITION OF audit_log
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE audit_log_2026_02 PARTITION OF audit_log
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
-- ... create 24 months forward

-- Indexes
CREATE INDEX idx_audit_log_table_record ON audit_log (al_table_name, al_record_key, al_changed_at);
CREATE INDEX idx_audit_log_user ON audit_log (al_user_id, al_changed_at);
CREATE INDEX idx_audit_log_fields ON audit_log USING GIN (al_changed_fields);
```

### 4.2 Generic Audit Trigger

```sql
CREATE OR REPLACE FUNCTION fn_audit_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_old JSONB; v_new JSONB; v_diff JSONB := '{}';
    v_key TEXT; v_record_id TEXT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_new := to_jsonb(NEW);
        v_record_id := v_new->>TG_ARGV[0];
        INSERT INTO audit_log (al_table_name, al_record_key, al_operation, al_new_data, al_user_id)
        VALUES (TG_TABLE_NAME, v_record_id, 'I', v_new,
                coalesce(current_setting('app.current_user', true), 'system'));
    ELSIF TG_OP = 'UPDATE' THEN
        v_old := to_jsonb(OLD); v_new := to_jsonb(NEW);
        FOR v_key IN SELECT jsonb_object_keys(v_new)
        LOOP
            IF v_old->v_key IS DISTINCT FROM v_new->v_key THEN
                v_diff := v_diff || jsonb_build_object(
                    v_key, jsonb_build_object('old', v_old->v_key, 'new', v_new->v_key));
            END IF;
        END LOOP;
        IF v_diff <> '{}' THEN
            v_record_id := v_old->>TG_ARGV[0];
            INSERT INTO audit_log (al_table_name, al_record_key, al_operation, al_changed_fields, al_user_id)
            VALUES (TG_TABLE_NAME, v_record_id, 'U', v_diff,
                    coalesce(current_setting('app.current_user', true), 'system'));
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        v_old := to_jsonb(OLD);
        v_record_id := v_old->>TG_ARGV[0];
        INSERT INTO audit_log (al_table_name, al_record_key, al_operation, al_old_data, al_user_id)
        VALUES (TG_TABLE_NAME, v_record_id, 'D', v_old,
                coalesce(current_setting('app.current_user', true), 'system'));
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4.3 Tier 1 -- Migrate to audit_log (120-150 tables)

All `his*` tables for lookup/config entities that change fewer than 100 times per year. Full list includes:

- **All histipo* tables** (44 tables): `histipobonif`, `histipocsc`, `histipodocumento`, `histipoelem`, `histipolicver`, `histipomensaj`, `histipooficina`, `histiporegulf`, `histiporelps`, `histiposoci`, `histiposubcon`, `histiposucsif`, `histiposumin`, `histipotarifa`, `histipounidad`, `histipovarbonif`, `histipovariable`, `histipovia`, `histipfactura`, `histipfraude`, `histipasiento`, `histipocptocobro`, `histipoconcep`, `histipocontratcn`, `histipocontra`, and others
- **Geographic/address history** (8 tables): `hisdirec`, `hiscalle`, `hisnomcalle`, `hisbarrio`, `hislocalidad`, `hispoblacion`, `hislineadistrib`, `hiselemestruc`
- **User/security history** (8 tables): `hisusuario`, `hisusuexplo`, `hisusuoficina`, `hisusuperfil`, `hisusupermiso`, `hisususociedad`, `hisperfil`, `hispermisos`
- **Exploitation config** (28 tables): `hisexplotipvar`, `hisexploestim`, `hisexploperiodic`, `hisexplociclinc`, `hisexplosocpro`, `hisexplosocemi`, etc.
- **Low-volume financial** (10+ tables): `hisfacbi`, `hisfecdesglos`, `hisgesttramos`, `hisexpedrecobro`, etc.

**Migration procedure per table:**

```sql
-- 1. Backfill existing data into audit_log
INSERT INTO audit_log (al_table_name, al_record_key, al_operation, al_old_data, al_user_id, al_changed_at)
SELECT 'tipooficina', -- base table name, not his* name
       (row_to_json(h)::jsonb->>'{pk_column}')::text,
       'U',
       row_to_json(h)::jsonb,
       coalesce(h.htofhstusu, 'migration'),
       coalesce(h.htofhsthora, now())
FROM histipooficina h;

-- 2. Attach trigger to base table
CREATE TRIGGER trg_audit_tipooficina
    AFTER INSERT OR UPDATE OR DELETE ON tipooficina
    FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger('tofid');

-- 3. Verify audit capture over 2 weeks

-- 4. Drop his* table
DROP TABLE histipooficina;
```

### 4.4 Tier 2 -- Keep as Dedicated Tables (18-25 tables)

High-volume, regulatory-required, or frequently queried history tables:

| Table | Columns | Justification |
|-------|---------|---------------|
| `hiscontrato` | 108 | Contract lifecycle -- regulatory requirement |
| `hisptoserv` | 54 | Service point changes -- infrastructure audit |
| `hispersona` | 36 | Customer PII -- GDPR/LFPDPPP compliance |
| `hiscliente` | 15 | Client account changes |
| `hissociedad` | 88 | Company entity changes |
| `hisexplotacion` | 353 | Exploitation configuration audit |
| `hisacometida` | 37 | Water connection changes |
| `hiscontado` | 34 | Meter data -- metering compliance |
| `histarifa` | 13 | Tariff changes -- rate compliance |
| `hisleclote` | 35 | Reading lot tracking |
| `hisjuicio` | 37 | Legal proceedings |
| `hisexpedsif` | 61 | Fraud investigation |
| `hissolacometida` | 62 | Connection request history |
| `hispasoproced` | 49 | Procedure step tracking |
| `hisrecargo` | 11 | Surcharge history |
| `hisservicio` | 44 | Service entity changes |
| `hispolcontar` | 9 | Contract-tariff policy |
| `hiscorrtarifa` | 45 | Tariff corrections |

**Actions on kept tables**:
- Add a `hst_operation CHAR(1)` column (I/U/D) to each
- Add a `hst_id BIGSERIAL` primary key
- Add composite index on `(entity_pk, hsthora DESC)`
- Implement retention policy: partition by year, archive data older than 10 years

**Expected result**: ~1,474 -> ~1,324 tables

---

## 5. Phase 3: Lookup Consolidation (Month 3)

**Goal**: Consolidate 26 pure two-column tipo* tables and 15 simple estado* tables into a unified `domain_value` table. Keep 12 complex configuration tables.

**Risk**: MEDIUM (requires application code changes) | **Impact**: MEDIUM

### 5.1 Create Unified domain_value Table

```sql
CREATE TABLE domain_value (
    dv_id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dv_domain     VARCHAR(50) NOT NULL,          -- e.g., 'TIPO_CATCALLE', 'ESTADO_FRAUDE'
    dv_code       VARCHAR(20) NOT NULL,
    dv_txtid      NUMERIC(10,0),                 -- reference to multilingual text system
    dv_description VARCHAR(200),                  -- inline fallback description
    dv_sort_order  INTEGER DEFAULT 0,
    dv_is_active   CHAR(1) DEFAULT 'S',
    dv_extra_json  JSONB DEFAULT '{}',           -- 1-3 extra attributes
    dv_expid       NUMERIC(5,0),                 -- exploitation scope (NULL = global)
    dv_hstusu      VARCHAR(10),
    dv_hsthora     TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_domain_value UNIQUE (dv_domain, dv_code)
);

CREATE INDEX idx_domain_value_lookup ON domain_value (dv_domain, dv_code, dv_is_active);
CREATE INDEX idx_domain_value_json ON domain_value USING GIN (dv_extra_json);
```

### 5.2 Tier 1: Consolidate Pure {id, txtid} Tables (26 tables)

These tables have exactly 2 columns (id + txtid/description) with no extra business logic:

`tipocatcalle`, `tipocorreo`, `tipooperacion`, `tipositcalle`, `tipositver`, `tipotarifasocial`, `tipoqueja`, `tipoindem`, `tippersautoriz`, `tipcontmtr`, `tipofacturaext`, `estadofraude`, `estadosjuicios`, `tipoalarmatel`, `tipoatencion`, `tipoesttec`, `tipogestcobro`, `tipoincide`, `tiposervicio`, `tiposubrogacion`, `estadossicer`, `estadomotrec`, `tipocsc`, `tiporecface`, `tipvalvula`, `tipocontador`

### 5.3 Tier 2: Consolidate Simple Extended Tables (15 tables)

Tables with {id, txtid, 1-3 extra columns} using `dv_extra_json`:

`tipolicver`, `tipocptocobro`, `tipooficina`, `tiposoci`, `tiposobre`, `tipotarifa`, `tipoelem`, `tipfraude`, `tipgesdeud`, `tipimpues`, `tiposubcon`, `tipoobs`, `estfirmaelectronica`, `estopeplatfirma`, `estpersautoriz`

### 5.4 Keep as Separate Tables (12 tables)

Complex configuration entities with 10+ meaningful columns:

`tipocontratcn` (37 cols), `tiposolaco` (29 cols), `tipodocumento` (22 cols), `tipobonif` (21 cols), `tiporegulf` (17 cols), `tipomensaj` (15 cols), `tipovariable` (14 cols), `tiposumin` (12 cols), `tipounidad` (11 cols), `tipoconcep` (11 cols), `tipoorden` (10 cols), `tipasiento` (10 cols)

### 5.5 Backward-Compatible Views

For each consolidated table, create a compatibility view:

```sql
-- Example for tipocatcalle (original: tpctcid, tpctctxtid)
CREATE VIEW tipocatcalle AS
SELECT dv_code::numeric(5,0) AS tpctcid,
       dv_txtid AS tpctctxtid
FROM domain_value
WHERE dv_domain = 'TIPO_CATCALLE' AND dv_is_active = 'S';
```

### 5.6 Junction Table Consolidation (10 tables -> 1 table)

```sql
CREATE TABLE domain_value_link (
    dvl_link_type     VARCHAR(50) NOT NULL,
    dvl_source_domain VARCHAR(50) NOT NULL,
    dvl_source_code   VARCHAR(20) NOT NULL,
    dvl_target_domain VARCHAR(50) NOT NULL,
    dvl_target_code   VARCHAR(20) NOT NULL,
    PRIMARY KEY (dvl_link_type, dvl_source_domain, dvl_source_code, dvl_target_domain, dvl_target_code)
);
```

Migrate: `tipoactsucsif`, `tipoenvfac`, `tipoordenperf`, `tipptoservtao`, `tipovarepi`, `tipoviaaca`, `tipliqsoc`, `tipfacgasrec`, `tipfichtao`, `tipobonifdoc`

**Expected result**: ~1,324 -> ~1,273 tables

---

## 6. Phase 4: Structural Improvements (Months 4-5)

**Goal**: Fix cross-cutting data quality and security issues across all domains.

**Risk**: MEDIUM-HIGH (requires coordinated application changes) | **Impact**: HIGH for data integrity

### 6.1 Add FK Constraints Across All Domains

Every domain report (A1 through A7) flags the absence of foreign key constraints. This is the single most impactful structural fix.

**Strategy**: Add constraints as `NOT VALID` first (no table lock, no existing data scan), then validate in off-peak hours.

```sql
-- Phase 4a: Add NOT VALID constraints (instant, no downtime)
ALTER TABLE contrato ADD CONSTRAINT fk_contrato_explotacion
    FOREIGN KEY (cnttexpid) REFERENCES explotacion(expid) NOT VALID;
ALTER TABLE contrato ADD CONSTRAINT fk_contrato_ptoserv
    FOREIGN KEY (cnttptosid) REFERENCES ptoserv(ptosid) NOT VALID;
ALTER TABLE contrato ADD CONSTRAINT fk_contrato_cliente
    FOREIGN KEY (cnttcliid) REFERENCES cliente(cliid) NOT VALID;
ALTER TABLE factura ADD CONSTRAINT fk_factura_facturacio
    FOREIGN KEY (facftoid) REFERENCES facturacio(ftoid) NOT VALID;
ALTER TABLE factura ADD CONSTRAINT fk_factura_contrato
    FOREIGN KEY (faccnttnum) REFERENCES contrato(cnttnum) NOT VALID;
ALTER TABLE linfactura ADD CONSTRAINT fk_linfactura_factura
    FOREIGN KEY (linfacid) REFERENCES factura(facid) NOT VALID;
-- ... approximately 50-80 FK constraints total across all domains

-- Phase 4b: Validate in maintenance window (scans data but doesn't lock)
ALTER TABLE contrato VALIDATE CONSTRAINT fk_contrato_explotacion;
ALTER TABLE contrato VALIDATE CONSTRAINT fk_contrato_ptoserv;
-- ...
```

**Priority FK relationships** (from A1, A2, A6):

| Parent | Child | FK Column | Priority |
|--------|-------|-----------|----------|
| explotacion | contrato | cnttexpid | CRITICAL |
| ptoserv | contrato | cnttptosid | CRITICAL |
| cliente | contrato | cnttcliid | CRITICAL |
| facturacio | factura | facftoid | CRITICAL |
| factura | linfactura | linfacid | CRITICAL |
| contrato | factura | faccnttnum | HIGH |
| contrato | facturable | fblecnttnum | HIGH |
| concepto | linfactura | lincptoid | HIGH |
| persona | cliente | cliid = prsid | HIGH |
| persona | sociedad | socprsid | HIGH |
| direccion | ptoserv | ptosdirid | HIGH |
| gescartera | opecargest | ocggescart | HIGH |
| opecargest | opedesglos | opdopecart | HIGH |

### 6.2 Convert char(1) S/N to Boolean (250+ columns)

Affects all 9 core tables plus dozens of supporting tables.

**Strategy**: Phased column-by-column migration using views for backward compatibility.

```sql
-- Step 1: Add boolean column alongside existing char(1)
ALTER TABLE contrato ADD COLUMN cnttsnformal_bool BOOLEAN;
UPDATE contrato SET cnttsnformal_bool = (cnttsnformal = 'S');
ALTER TABLE contrato ALTER COLUMN cnttsnformal_bool SET NOT NULL;
ALTER TABLE contrato ALTER COLUMN cnttsnformal_bool SET DEFAULT false;

-- Step 2: Create trigger to keep both columns in sync during transition
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

-- Step 3: After all application code migrated, drop old column
ALTER TABLE contrato DROP COLUMN cnttsnformal;
ALTER TABLE contrato RENAME COLUMN cnttsnformal_bool TO cnttsnformal;
```

**High-priority tables for boolean conversion**: `explotacion` (~180 columns), `contrato` (~15 columns), `ptoserv` (~12 columns), `sociedad` (~8 columns), `facturacio` (~5 columns).

### 6.3 Convert VARCHAR GPS to PostGIS Geometry

The `geolocalizacion` table stores coordinates as `varchar(30)`. This prevents all spatial queries.

```sql
-- Install PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geometry column
ALTER TABLE geolocalizacion ADD COLUMN geom geometry(Point, 4326);

-- Populate from varchar columns
UPDATE geolocalizacion
SET geom = ST_SetSRID(
    ST_MakePoint(geoloclong::double precision, geoloclat::double precision),
    4326)
WHERE geoloclong IS NOT NULL
  AND geoloclat IS NOT NULL
  AND geoloclong ~ '^-?\d+\.?\d*$'
  AND geoloclat ~ '^-?\d+\.?\d*$';

-- Create spatial index
CREATE INDEX idx_geolocalizacion_geom ON geolocalizacion USING GIST (geom);

-- Verify coordinate system standardization (WGS84)
SELECT geoloctipocodificacion, count(*)
FROM geolocalizacion GROUP BY 1;
```

### 6.4 Fix Plaintext Passwords

**CRITICAL SECURITY**: Multiple tables store passwords in plaintext (A1, A3).

```sql
-- Install pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Hash existing passwords (irreversible -- communicate to users)
-- cliente.cliwebpass
ALTER TABLE cliente ADD COLUMN cliwebpass_hash VARCHAR(255);
UPDATE cliente SET cliwebpass_hash = crypt(cliwebpass, gen_salt('bf', 10))
WHERE cliwebpass IS NOT NULL AND cliwebpass != '';
ALTER TABLE cliente DROP COLUMN cliwebpass;
ALTER TABLE cliente RENAME COLUMN cliwebpass_hash TO cliwebpass;

-- persona.prspassweb
ALTER TABLE persona ADD COLUMN prspassweb_hash VARCHAR(255);
UPDATE persona SET prspassweb_hash = crypt(prspassweb, gen_salt('bf', 10))
WHERE prspassweb IS NOT NULL AND prspassweb != '';
ALTER TABLE persona DROP COLUMN prspassweb;
ALTER TABLE persona RENAME COLUMN prspassweb_hash TO prspassweb;

-- sociedad: move credentials to a vault or encrypted table
CREATE TABLE sociedad_credentials (
    soc_id       NUMERIC(10,0) PRIMARY KEY REFERENCES sociedad(socprsid),
    sms_pass     VARCHAR(255),  -- encrypted
    cert_pass    VARCHAR(255),  -- encrypted
    firma_pass   VARCHAR(255),  -- encrypted
    api_token    VARCHAR(255),  -- encrypted
    updated_at   TIMESTAMPTZ DEFAULT now()
);
```

### 6.5 Remove Spain-Specific Dead Tables (25+ tables)

These are Spanish regional liquidation tables (`liqanubaleares`, `liqcobgalicia`, `liqanumurcia`, etc.) that serve no function in the Mexican deployment.

**Prerequisites** (from A9 Phase 5 analysis):
1. Verify all tables are empty: `SELECT count(*) FROM <table>`
2. Check FK references: no inbound FKs found
3. Check view/function references: none found
4. **Obtain written confirmation from Aqualia ERP team**

**Fallback if Aqualia does not confirm**: Move to a segregated schema:

```sql
CREATE SCHEMA spain_legacy;
ALTER TABLE liqanubaleares SET SCHEMA spain_legacy;
-- ... for all 25 tables
-- Remove from default search_path
```

### 6.6 Fix Double Precision for Monetary Values

The `linfactura` table uses `double precision` for `linfprefij`, `linfprepro`, and `linfaccant` (A2 finding).

```sql
ALTER TABLE linfactura ALTER COLUMN linfprefij TYPE numeric(18,6);
ALTER TABLE linfactura ALTER COLUMN linfprepro TYPE numeric(18,6);
ALTER TABLE linfactura ALTER COLUMN linfaccant TYPE numeric(18,3);
```

**Expected result**: ~1,273 -> ~1,248 tables (Spain tables removed), plus structural improvements

---

## 7. Phase 5: Schema Normalization (Months 6-8)

**Goal**: Decompose god tables, normalize repeating groups, and extract embedded concerns.

**Risk**: HIGH (core table restructuring) | **Impact**: HIGH for long-term maintainability

### 7.1 Decompose explotacion (350 columns -> 10-14 domain tables)

The `explotacion` table conflates 15 distinct functional domains (A1 Section 5). Decompose using 1:1 extension tables sharing the PK `expid`:

| Proposed Table | Source Columns | Priority |
|---------------|---------------|----------|
| `explotacion` (core identity) | ~10 cols: `expid`, `expdescri`, `expfecha`, `expcodigo`, `expfecbaja`, `expregimen`, `expelsid`, `expidiid`, audit | HIGH |
| `explotacion_billing_config` | ~45 cols: billing cycle, invoice generation, simulation, prefactura | HIGH |
| `explotacion_collection_config` | ~35 cols: debt management, surcharges, grace periods, interest | HIGH |
| `explotacion_estimation_config` | ~25 cols: meter estimation rules, tolerance thresholds | HIGH |
| `explotacion_notification_config` | ~25 cols: SMS, email, multimedia, auto-notification | MEDIUM |
| `explotacion_cutoff_config` | ~20 cols: disconnection rules, valve management, seasonal | MEDIUM |
| `explotacion_workorder_config` | ~20 cols: lot generation, in-situ, operator rules | MEDIUM |
| `explotacion_digital_config` | ~20 cols: platform integration, biometric, URL configuration | MEDIUM |
| `explotacion_remittance_config` | ~15 cols: bank integration, SEPA, remittance timing | MEDIUM |
| `explotacion_gdpr_config` | ~15 cols: LOPD, RGPD, data sensitivity, audit flags | MEDIUM |
| `explotacion_fiscal_config` | ~10 cols: tax exemptions, CFDI, VAT rules | LOW |
| `explotacion_quality_config` | ~10 cols: complaints, inspection thresholds | LOW |
| `explotacion_gis_config` | ~8 cols: map service, coordinate config, GIS flags | LOW |
| `explotacion_bonification_config` | ~8 cols: subsidy assignment, social bonus rules | LOW |

**Migration pattern**:

```sql
-- Step 1: Create extension table
CREATE TABLE explotacion_billing_config (
    expid NUMERIC(5,0) PRIMARY KEY REFERENCES explotacion(expid),
    expdiasvencfact NUMERIC(5,0),
    expmaxmensfact NUMERIC(5,0),
    expsncrearfact CHAR(1) DEFAULT 'N',
    -- ... all 45 billing columns
    hstusu VARCHAR(10),
    hsthora TIMESTAMPTZ DEFAULT now()
);

-- Step 2: Populate from current explotacion
INSERT INTO explotacion_billing_config
SELECT expid, expdiasvencfact, expmaxmensfact, expsncrearfact, ...
FROM explotacion;

-- Step 3: Create backward-compatible view
CREATE VIEW v_explotacion_full AS
SELECT e.*, b.*, c.*, est.*, ...
FROM explotacion e
LEFT JOIN explotacion_billing_config b USING (expid)
LEFT JOIN explotacion_collection_config c USING (expid)
LEFT JOIN explotacion_estimation_config est USING (expid)
-- ... all extension tables
;

-- Step 4: Update application to use extension tables or view
-- Step 5: Drop columns from core explotacion (after app migration)
```

### 7.2 Extract contrato Embedded Roles and Config

The `contrato` table at 104 columns (A1, A3) mixes lifecycle, billing, notifications, GDPR, and fiscal concerns.

**Decomposition**:

| Target Table | Extracted Columns | Benefit |
|-------------|-------------------|---------|
| `contrato` (core) | ~30 cols: identity, state, parties, dates | Reduced lock contention |
| `contrato_billing_config` | ~15 cols: invoice type, copies, exemption, payment terms | Independent billing config changes |
| `contrato_notification` | ~10 cols: mail, SMS, push preferences, mobile, notification persons | Notification-only updates |
| `contrato_fiscal` | ~8 cols: CFDI pagador, receptor, fiscal, comprador | Mexico-specific fiscal roles |
| `contrato_compliance` | ~6 cols: GDPR anonymization, block, fraud, theft flags | Compliance isolation |

**Normalize notification addresses** (1NF violation found by A1):

```sql
-- Replace cnttnotifprsid1/cnttnotifnumdir1/cnttnotifprsid2/cnttnotifnumdir2
CREATE TABLE contrato_notificacion (
    cn_cnttnum    NUMERIC(10,0) NOT NULL REFERENCES contrato(cnttnum),
    cn_seq        INTEGER NOT NULL,
    cn_prsid      NUMERIC(10,0) NOT NULL REFERENCES persona(prsid),
    cn_numdir     NUMERIC(5,0),
    cn_tipo       VARCHAR(10),       -- 'PRINCIPAL', 'SECUNDARIO'
    cn_activo     BOOLEAN DEFAULT true,
    PRIMARY KEY (cn_cnttnum, cn_seq)
);
```

### 7.3 Normalize persona Contact Information

Contact data is scattered across 5+ locations (A3 finding):

```sql
-- Consolidate inline phones into existing personatel
INSERT INTO personatel (prtlprsid, prtltelefono, prtlprefijo, prtltipo, prtlautorizado)
SELECT prsid, prstelef, NULL, 'FIJO', 'S' FROM persona WHERE prstelef IS NOT NULL
UNION ALL
SELECT prsid, prstelef2, NULL, 'FIJO', 'S' FROM persona WHERE prstelef2 IS NOT NULL
UNION ALL
SELECT prsid, prstelef3, NULL, 'MOVIL', 'S' FROM persona WHERE prstelef3 IS NOT NULL
UNION ALL
SELECT prsid, prstelef4, NULL, 'MOVIL', 'S' FROM persona WHERE prstelef4 IS NOT NULL;

-- Create missing email entity (critical gap from A3)
CREATE TABLE personaemail (
    pe_id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pe_prsid      NUMERIC(10,0) NOT NULL REFERENCES persona(prsid),
    pe_email      VARCHAR(255) NOT NULL,
    pe_tipo       VARCHAR(20) NOT NULL,  -- 'PERSONAL', 'TRABAJO', 'FACTURACION'
    pe_verificado CHAR(1) DEFAULT 'N',
    pe_principal  CHAR(1) DEFAULT 'N',
    pe_activo     CHAR(1) DEFAULT 'S',
    pe_hstusu     VARCHAR(10),
    pe_hsthora    TIMESTAMPTZ DEFAULT now()
);
```

### 7.4 Implement Proper Temporal/Versioning Patterns

For tariff tables (which already use date-effective logic), add exclusion constraints:

```sql
-- Prevent overlapping tariff validity periods
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE aplictarif ADD CONSTRAINT excl_aplictarif_validity
    EXCLUDE USING gist (
        aptexpid WITH =,
        aptcptoid WITH =,
        apttarid WITH =,
        daterange(aptfecapl, aptfecfin, '[)') WITH &&
    );
```

**Expected result**: Net table change is approximately neutral (decomposition adds tables while consolidation removes), but structural quality improves dramatically. ~1,248 -> ~1,260 tables (slight increase from decomposition, offset by further cleanup).

---

## 8. Phase 6: Performance and Monitoring (Months 9-10)

**Goal**: Replace GIS cache tables with materialized views, implement partitioning for high-volume tables, and establish monitoring.

**Risk**: LOW | **Impact**: MEDIUM-HIGH for operational performance

### 8.1 Replace GIS Cache Tables with Materialized Views

25 `vgis_*` and `vgiss_*` tables are manually maintained denormalized caches (A9 finding). Replace with auto-refreshing materialized views:

```sql
-- Example: Replace vgis_abonadosacometida (10 cols)
CREATE MATERIALIZED VIEW mv_gis_abonadosacometida AS
SELECT
    c.cnttnum, c.cnttcliid, c.cnttptosid,
    ps.ptosdirid, a.acoid, a.acoestado,
    a.acomatcod, a.acocalimm, a.acolong,
    d.dirtexto
FROM contrato c
JOIN ptoserv ps ON c.cnttptosid = ps.ptosid
JOIN servicio s ON ps.ptosid = s.serptosid
JOIN acometida a ON s.seracoid = a.acoid
JOIN direccion d ON ps.ptosdirid = d.dirid
WHERE c.cnttestado IN (1, 2);

CREATE UNIQUE INDEX uidx_mv_gis_abonadosacometida
    ON mv_gis_abonadosacometida (cnttnum);

-- Replace 13 per-municipality tables with 1 materialized view
CREATE MATERIALIZED VIEW mv_gis_padron_usuarios AS
SELECT *, d.dirmunicipio AS municipio
FROM contrato c
JOIN persona p ON c.cnttfprsid = p.prsid
JOIN ptoserv ps ON c.cnttptosid = ps.ptosid
JOIN direccion d ON ps.ptosdirid = d.dirid
WHERE c.cnttestado IN (1, 2);

-- Backward-compatible views for GIS layer
CREATE VIEW vw_gis_pad_usu_queretaro_new AS
SELECT * FROM mv_gis_padron_usuarios WHERE municipio = 'QUERETARO';
CREATE VIEW vw_gis_pad_usu_corregidora_new AS
SELECT * FROM mv_gis_padron_usuarios WHERE municipio = 'CORREGIDORA';
-- ... for all 13 municipalities
```

### 8.2 Implement pg_cron Refresh Schedules

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- GIS views: refresh daily at 2 AM
SELECT cron.schedule('refresh_gis_padron', '0 2 * * *',
    $$REFRESH MATERIALIZED VIEW CONCURRENTLY mv_gis_padron_usuarios$$);

SELECT cron.schedule('refresh_gis_abonados', '15 2 * * *',
    $$REFRESH MATERIALIZED VIEW CONCURRENTLY mv_gis_abonadosacometida$$);

-- Billing summary: refresh after each billing run (checked hourly)
SELECT cron.schedule('refresh_billing_summary', '0 * * * *',
    $$REFRESH MATERIALIZED VIEW CONCURRENTLY mv_billing_summary$$);

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

### 8.3 Add Partitioning for High-Volume Tables

```sql
-- factura: partition by billing year/month
-- (requires table recreation -- execute during extended maintenance window)
CREATE TABLE factura_partitioned (
    LIKE factura INCLUDING ALL
) PARTITION BY RANGE (facfecfact);

-- Create partitions per year
CREATE TABLE factura_2024 PARTITION OF factura_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE factura_2025 PARTITION OF factura_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE factura_2026 PARTITION OF factura_partitioned
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
CREATE TABLE factura_default PARTITION OF factura_partitioned DEFAULT;

-- audit_log: already partitioned by month (created in Phase 2)

-- movccontrato: partition by year
-- poldetsum: partition by billing period
```

### 8.4 Performance Benchmarks

Collect before and after metrics:

```sql
-- Create benchmark table
CREATE TABLE performance_benchmark (
    pb_id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pb_phase      VARCHAR(20) NOT NULL,
    pb_metric     VARCHAR(100) NOT NULL,
    pb_value      NUMERIC(18,2),
    pb_unit       VARCHAR(20),
    pb_measured_at TIMESTAMPTZ DEFAULT now()
);

-- Key metrics to track:
-- 1. Table count
INSERT INTO performance_benchmark (pb_phase, pb_metric, pb_value, pb_unit)
SELECT 'BEFORE', 'total_tables', count(*), 'tables'
FROM pg_tables WHERE schemaname = 'cf_quere_pro';

-- 2. pg_dump schema time
-- 3. ANALYZE time
-- 4. Average query planning time (from pg_stat_statements)
-- 5. Autovacuum completion time
-- 6. Connection startup time
-- 7. pg_class row count
-- 8. Shared buffer cache hit ratio
```

**Expected result**: ~1,260 -> ~1,220 tables (GIS caches eliminated), plus significant performance gains.

---

## 9. Risk Mitigation

### 9.1 Per-Phase Risk Matrix

| Phase | Risk | Probability | Severity | Mitigation |
|-------|------|------------|----------|------------|
| **1** | Active billing process loses data | LOW | HIGH | Schedule during confirmed maintenance window; verify `tablastmp` has no active entries; check `tarcontenedor.tcnestado` for running processes |
| **1** | App creates new tmp_deuda_* after cleanup | HIGH | MEDIUM | **Must patch application code** before/during Phase 1; set `tredroptablastemporales = 1` |
| **1** | tmpbb replacement schema mismatch | HIGH | HIGH | **Fix column definitions before execution** (Section 3.3) |
| **1** | Catalog bloat from mass DROP | MEDIUM | LOW | VACUUM FULL on pg_class/pg_attribute after drops; batch in groups of 500 |
| **2** | History data loss during migration | LOW | HIGH | Archive all `his*` data to CSV before migration; keep source tables 90 days |
| **2** | Audit trigger overhead | MEDIUM | MEDIUM | Only attach to low-volume tables; benchmark in staging |
| **3** | Domain value migration corrupts lookups | LOW | HIGH | Test each migration individually in staging; verify row counts and sample values |
| **3** | Application code references old tipo* tables | HIGH | MEDIUM | Create backward-compatible views for all consolidated tables |
| **4** | FK constraint validation finds orphans | MEDIUM | LOW | Run orphan detection queries first; clean data before validation |
| **4** | Boolean conversion breaks app logic | MEDIUM | MEDIUM | Use sync triggers during transition; full regression testing |
| **5** | explotacion decomposition breaks billing | LOW | CRITICAL | Use backward-compatible view `v_explotacion_full`; shadow-write during transition |
| **5** | Spain table drop crashes Aqualia framework | LOW-MED | CRITICAL | **Never drop without written vendor confirmation**; use schema isolation fallback |
| **6** | Materialized view refresh fails silently | MEDIUM | MEDIUM | mv_refresh_log monitoring; pg_cron job alerting |

### 9.2 Rollback Strategies

| Phase | Rollback Method | Recovery Time | Data Loss |
|-------|----------------|---------------|-----------|
| Phase 1 | Restore from pg_dump. Transient tables are regenerable. | 2-4 hours | Zero (transient data) |
| Phase 2 | Source `his*` tables retained for 90 days. Re-attach triggers to old tables. | 1 hour | Zero |
| Phase 3 | Backward-compatible views allow instant rollback. Source tipo* tables retained 2 weeks. | Minutes (view switch) | Zero |
| Phase 4 | FK constraints can be dropped instantly. Boolean columns can revert via sync trigger. | Minutes | Zero |
| Phase 5 | Backward-compatible view `v_explotacion_full` maintained indefinitely during transition. | Minutes | Zero |
| Phase 6 | GIS cache tables retained as backup; materialized views can be dropped; originals restored. | 1 hour | Zero |

### 9.3 Critical Validation Queries

```sql
-- Run after EVERY phase:

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

-- 3. Table count tracking
SELECT count(*) as table_count,
       current_timestamp as measured_at
FROM pg_tables
WHERE schemaname = 'cf_quere_pro';

-- 4. Application smoke test: verify core billing query works
SELECT count(*) FROM factura WHERE facfecfact >= current_date - interval '30 days';
SELECT count(*) FROM contrato WHERE cnttestado = 1;
SELECT count(*) FROM persona WHERE prsid IS NOT NULL;
```

---

## 10. Application Impact

### 10.1 Code Changes Required Per Phase

| Phase | Application Changes | Effort | Blocking? |
|-------|-------------------|--------|-----------|
| **Phase 1** | Modify billing framework to use `INSERT INTO tmp_deuda (proceso_id, ...)` instead of `CREATE TABLE tmp_deuda_<ID>`. Similar changes for `aux_varscreditored` and `tmpbb`. | 2-4 weeks Java/application changes | YES -- without this, tables re-accumulate |
| **Phase 2** | Add `SET app.current_user = '<username>'` to connection initialization for audit trigger context. Update any code that directly queries `his*` tables to use `audit_log` for migrated tables. | 1-2 weeks | NO -- backward-compatible views cover transition |
| **Phase 3** | Update ORM entity mappings to use `domain_value` table. Or, use backward-compatible views indefinitely. | 2-4 weeks if removing views; 0 with views | NO |
| **Phase 4** | Update password verification logic (bcrypt comparison instead of plaintext). Update any code that relies on char(1) 'S'/'N' to handle boolean. Update GIS queries to use PostGIS functions. | 3-4 weeks | PARTIAL -- passwords are blocking |
| **Phase 5** | Update all code referencing `explotacion` to use either the decomposed tables directly or the `v_explotacion_full` view. Similar for `contrato` decomposition. | 4-8 weeks | NO -- views cover transition |
| **Phase 6** | Update GIS layer to read from materialized views (or use backward-compatible named views). Add pg_cron job monitoring to operations dashboard. | 1-2 weeks | NO |

### 10.2 ORM/Hibernate Considerations

The AQUASIS application likely uses Hibernate/JPA entity mappings. Key impacts:

1. **Phase 1**: If Hibernate entity classes exist for `tmp_deuda_<ID>` pattern, they use dynamic table names. The consolidated table requires a different ORM approach (standard entity with `proceso_id` parameter).

2. **Phase 3**: Hibernate entity classes for `tipo*` tables can continue working via backward-compatible views. No ORM changes needed if views are maintained.

3. **Phase 5**: The `explotacion` entity (350 columns) likely has a massive Hibernate mapping. The `v_explotacion_full` view preserves backward compatibility. Gradual migration to decomposed entities recommended.

---

## 11. Migration Safety Protocols

### 11.1 Zero-Downtime Strategy

All phases follow this pattern:

```
Step 1: CREATE new structures (additive, zero risk)
Step 2: Shadow-write trigger (writes to BOTH old and new)
Step 3: Backfill historical data
Step 4: Automated consistency verification
Step 5: Switch reads to new structure (via view rename)
Step 6: Monitor for 1-2 billing cycles
Step 7: Remove shadow-write trigger
Step 8: Archive and DROP old structures
```

### 11.2 Shadow Write Example

```sql
-- During Phase 3 (tipo* consolidation), shadow-write to domain_value
CREATE OR REPLACE FUNCTION fn_shadow_write_tipo()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO domain_value (dv_domain, dv_code, dv_txtid, dv_hstusu, dv_hsthora)
        VALUES (TG_ARGV[0], NEW.{pk_col}::text, NEW.{txtid_col},
                coalesce(current_setting('app.current_user', true), 'system'), now())
        ON CONFLICT (dv_domain, dv_code) DO NOTHING;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE domain_value
        SET dv_txtid = NEW.{txtid_col}, dv_hsthora = now()
        WHERE dv_domain = TG_ARGV[0] AND dv_code = NEW.{pk_col}::text;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE domain_value
        SET dv_is_active = 'N', dv_hsthora = now()
        WHERE dv_domain = TG_ARGV[0] AND dv_code = OLD.{pk_col}::text;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

### 11.3 View Abstraction Layer

For critical tables being restructured, application code reads through views:

```sql
-- Before: application queries contrato directly
-- During migration:
ALTER TABLE contrato RENAME TO contrato_old;

CREATE VIEW contrato AS
SELECT co.*, cb.*, cn.*, cf.*, cc.*
FROM contrato_core co
LEFT JOIN contrato_billing_config cb USING (cnttnum)
LEFT JOIN contrato_notification cn USING (cnttnum)
LEFT JOIN contrato_fiscal cf USING (cnttnum)
LEFT JOIN contrato_compliance cc USING (cnttnum);

-- Application code does not change
-- After full migration and testing:
-- Drop view, rename tables as needed
```

### 11.4 Pre-Phase Checklist (Execute Before Every Phase)

- [ ] Full `pg_dump` backup taken and verified
- [ ] Staging environment has latest production data
- [ ] Phase script tested on staging with no errors
- [ ] Application regression tests pass on staging
- [ ] No active billing runs (`SELECT * FROM tablastmp WHERE ttmpestado = 'ACTIVE'`)
- [ ] No active collection processes (`SELECT * FROM tarcontenedor WHERE tcnestado = 'RUNNING'`)
- [ ] DBA available for 4 hours post-execution
- [ ] Rollback script prepared and tested
- [ ] Performance baseline captured in `performance_benchmark` table

---

## 12. Success Metrics

### 12.1 Table Count Reduction

| Milestone | Tables | Reduction |
|-----------|--------|-----------|
| **Baseline** | 4,114 | -- |
| After Phase 1 (Month 1) | ~1,474 | -64% |
| After Phase 2 (Month 2) | ~1,324 | -68% |
| After Phase 3 (Month 3) | ~1,273 | -69% |
| After Phase 4 (Month 5) | ~1,248 | -70% |
| After Phase 5 (Month 8) | ~1,260 | -69% (decomposition adds tables) |
| After Phase 6 (Month 10) | ~1,220 | -70% |
| **With aggressive his* consolidation** | ~230 | **-94%** |

### 12.2 Query Performance Targets

| Metric | Current (4,114 tables) | Target (post-optimization) | Measurement |
|--------|----------------------|---------------------------|-------------|
| Average query plan time | Baseline (measure) | 3-5x faster | `pg_stat_statements.mean_plan_time` |
| ANALYZE runtime | Baseline | 10-20x faster | Wall clock time |
| Autovacuum cycle time | Baseline | 70% reduction | `pg_stat_user_tables` |
| `pg_dump` schema time | Baseline | 10-20x faster | Wall clock time |
| Connection startup time | Baseline | 2-3x faster | Application metrics |
| `information_schema` queries | Baseline | 18x faster | Query timing |

### 12.3 Catalog Size Targets

| Catalog Table | Before (est.) | After (~230 tables) | Reduction |
|--------------|---------------|---------------------|-----------|
| `pg_class` rows | ~12,000 | ~700 | 94% |
| `pg_attribute` rows | ~75,000 | ~5,000 | 93% |
| `pg_statistic` rows | ~75,000 | ~5,000 | 93% |
| `pg_depend` rows | ~150,000+ | ~10,000 | 93% |

### 12.4 Data Quality Targets

| Metric | Current | Target |
|--------|---------|--------|
| Tables with FK constraints | 0% | 100% of core domain tables |
| Boolean columns using native type | 0% | 100% of new/modified columns |
| Plaintext password columns | 6+ | 0 |
| Spatial data in PostGIS type | 0% | 100% |
| History tables with operation type (I/U/D) | ~5% | 100% |
| Audit entries linked to session | 0% | 100% (via audit_log) |

### 12.5 Domain Health Score Targets

| Domain | Current Score | Target Score |
|--------|-------------|-------------|
| Core Schema | 3.5/10 | 7/10 |
| Billing | 6/10 | 8/10 |
| Customer | 5/10 | 7/10 |
| Infrastructure | 6.5/10 | 8/10 |
| Work Orders | 6.5/10 | 7.5/10 |
| Collections | 7/10 | 8.5/10 |
| Lookups/Config | 3/10 | 8/10 |
| History/Audit | 4/10 | 8/10 |
| **Overall** | **4.2/10** | **7.5/10** |

---

## 13. Effort Estimates

### 13.1 Staffing Requirements

| Role | FTE | Duration | Responsibilities |
|------|-----|----------|-----------------|
| **Senior DBA** | 1.0 | 10 months | Schema design, migration script development, execution, performance tuning |
| **Application Developer** | 1.0 | 8 months (Months 1-8) | Application code changes (tmp_deuda pattern, ORM updates, password hashing, boolean migration) |
| **QA Engineer** | 0.5 | 10 months | Regression testing, data validation, billing cycle verification |
| **Aqualia Coordinator** | 0.1 | Months 4-5 | Spain table review, framework compatibility assessment |

### 13.2 Timeline Detail

| Month | Phase | Key Activities | Deliverables |
|-------|-------|---------------|-------------|
| **1** | Phase 1 | Drop 2,643 transient tables; create consolidated replacements; patch application; VACUUM catalog | 4,114 -> ~1,474 tables |
| **2** | Phase 2 | Create audit_log; migrate 120-150 low-value his* tables; attach audit triggers | ~1,474 -> ~1,324 tables |
| **3** | Phase 3 | Create domain_value; migrate 41 tipo*/estado* tables; create compatibility views | ~1,324 -> ~1,273 tables |
| **4** | Phase 4a | Add FK constraints (NOT VALID); begin boolean conversion on explotacion | FK constraints on 50+ relationships |
| **5** | Phase 4b | Validate FK constraints; complete boolean conversion; fix passwords; PostGIS migration; Spain table review | ~1,273 -> ~1,248 tables |
| **6** | Phase 5a | Begin explotacion decomposition (billing, collection, estimation configs) | 3 extension tables created |
| **7** | Phase 5b | Continue explotacion decomposition; begin contrato normalization | 8 extension tables; contrato_notificacion |
| **8** | Phase 5c | Complete decomposition; normalize persona contacts; create personaemail; temporal patterns for tariffs | ~1,248 -> ~1,260 tables |
| **9** | Phase 6a | Replace GIS cache tables with materialized views; set up pg_cron | ~15 cache tables eliminated |
| **10** | Phase 6b | Implement partitioning for factura, audit_log; performance benchmarks; monitoring dashboard | Final target: ~1,220 tables (or ~230 with aggressive consolidation) |

### 13.3 Cost-Benefit Summary

**Estimated total effort**: ~24 person-months (2.5 FTE x 10 months)

**Benefits**:
- 70-94% table count reduction
- 3-5x query planning performance improvement
- Proper referential integrity preventing orphaned records
- Elimination of security vulnerabilities (plaintext passwords)
- Spatial query capability (PostGIS)
- Automated audit trail with diff tracking
- Prevention of table-per-process regression
- Dramatically faster backup/restore operations
- Sustainable schema maintenance going forward

---

## Appendix A: Table Count Reduction Waterfall

```
Phase   Action                                          Tables Removed  Running Total
------  ----------------------------------------------  --------------  -------------
        Baseline                                                        4,114
1a      Drop tmp_deuda_* (2,144)                        2,144          1,970
1b      Drop aux_varscreditored_* (477)                 477            1,493
1c      Drop tmpbb_* (22)                               22             1,471
1d      Create 3 consolidated replacements              +3             1,474
1e      Drop persistent staging/artifacts/reports       30             1,444
2       Migrate 120-150 his* to audit_log               120            1,324
3a      Consolidate 41 tipo*/estado* tables             41             1,283
3b      Consolidate 10 junction tables                  10             1,273
4       Drop Spain-specific tables (25)                 25             1,248
5       Decompose god tables (net neutral)              ~0             ~1,260
6a      Replace GIS caches with materialized views      25             1,235
6b      Merge municipality duplicates (13->1)           12             1,223
6c      Merge other duplicates, drop legacy             5              1,218
TOTAL                                                   ~2,896         ~1,218
```

**Aggressive path** (migrating 180+ his* tables + all medium-complexity history): ~230 tables total.

## Appendix B: Key File References

| File | Purpose |
|------|---------|
| `/Users/fernandocamacholombardo/aqua/reports/division-a/A1-core-schema-analysis.md` | God table analysis, normalization issues |
| `/Users/fernandocamacholombardo/aqua/reports/division-a/A2-billing-domain-analysis.md` | Billing pipeline, tariff architecture |
| `/Users/fernandocamacholombardo/aqua/reports/division-a/A3-customer-domain-analysis.md` | Customer model, security vulnerabilities |
| `/Users/fernandocamacholombardo/aqua/reports/division-a/A4-infrastructure-domain-analysis.md` | GIS gaps, meter lifecycle |
| `/Users/fernandocamacholombardo/aqua/reports/division-a/A5-work-orders-analysis.md` | Operations domain, SLA gaps |
| `/Users/fernandocamacholombardo/aqua/reports/division-a/A6-collections-domain-analysis.md` | Payment processing, debt management |
| `/Users/fernandocamacholombardo/aqua/reports/division-a/A7-lookup-config-analysis.md` | 95 lookup tables, consolidation plan |
| `/Users/fernandocamacholombardo/aqua/reports/division-a/A8-history-audit-analysis.md` | 231 history tables, JSONB migration tiers |
| `/Users/fernandocamacholombardo/aqua/reports/division-a/A9-antipatterns-analysis.md` | Anti-patterns, cleanup scripts, tmpbb bug |
| `/Users/fernandocamacholombardo/aqua/reports/division-c/C3-db-modernization.md` | PostgreSQL modernization patterns |
| `/Users/fernandocamacholombardo/aqua/db_audit/phase1_drop_transient_tables.sql` | Phase 1 execution script |
| `/Users/fernandocamacholombardo/aqua/db_audit/phase2_consolidate_and_merge.sql` | Phase 2 consolidation script |
| `/Users/fernandocamacholombardo/aqua/db_audit/phase3_domain_value_consolidation.sql` | Phase 3 lookup consolidation |
| `/Users/fernandocamacholombardo/aqua/db_audit/phase4_audit_log_history.sql` | Phase 4 audit log design |
| `/Users/fernandocamacholombardo/aqua/db_audit/phase5_spain_regional_evaluation.sql` | Phase 5 Spain table evaluation |
| `/Users/fernandocamacholombardo/aqua/db_audit/pre_cleanup_inventory.sql` | Baseline snapshot capture |
| `/Users/fernandocamacholombardo/aqua/db_audit/verification_queries.sql` | Safety checks and validation |

---

*Database Optimization Plan generated 2026-02-16.*
*Synthesized from Division A (A1-A9) database analysis reports and Division C (C3) research report.*
*Total source material: ~80,000 words of analysis across 10 reports.*
