# A8: History and Audit Layer Analysis - AquaCIS Database

**Agent:** A8 (db-history-audit)
**Database:** cf_quere_pro (CEA Queretaro)
**Date:** 2026-02-16
**Source Files:** `db_mapping/chunk_h.md` (231 tables), `db_mapping/chunk_pqrs.md` (sesion table), `db_audit/phase4_audit_log_history.sql`

---

## Executive Summary

The AquaCIS database employs a **mirrored-table history pattern** with 230 dedicated `his*` tables plus 1 non-prefixed history table (`hub`), totaling 231 tables in the H-chunk. These history tables represent **5.6% of the total 4,114 tables** in the system. Every history table follows a consistent convention: mirror the base table's columns and append `hstusu` (user) and `hsthora` (timestamp) audit columns.

This approach, while transparent and query-friendly, creates massive structural duplication. The existing Phase 4 audit plan (in `phase4_audit_log_history.sql`) already proposes consolidating low-change lookup tables into a JSONB-based `audit_log` table, targeting 100-180 table eliminations. Our analysis validates this direction and identifies specific tables for each migration tier.

The session model (`sesion` table) is minimal -- only 4 columns -- providing basic user/office/date tracking without IP addresses, actions, or durations. This is a significant gap for modern audit requirements.

**Audit Layer Health Score: 4/10** -- Functional but architecturally dated, with excessive structural overhead and gaps in session tracking.

---

## 1. History Table Census

### 1.1 Total Count

| Metric | Count |
|--------|-------|
| Total `his*` tables in chunk_h.md | 230 |
| Additional non-his history tables (hub) | 1 |
| **Total history tables** | **231** |
| Total tables in database | 4,114 |
| History tables as % of total | 5.6% |

### 1.2 Categorization by Business Domain

| Domain | Count | Key Tables | Description |
|--------|-------|------------|-------------|
| **Explotacion (Utility Operations)** | 28 | `hisexplotacion` (353 cols!), `hisexplotipvar`, `hisexploestim`, `hisexploperiodic`, `hisexplociclinc`, `hisexplosocpro`, `hisexplosocemi`, `hisexplotloc`, `hisexplotxtcnt`, `hisexplotxtfunc`, `hisexptipdocumento`, `hisexptipsubdoccontr`, `hisexpgestofi`, `hisexpintervalido`, `hisexplcentdist`, `hisexploclausula`, `hisexplomensaje`, `hisexplomotorden`, `hisexploperiodo`, `hisexplorapro`, `hisexpccobro`, `hisexpctafrmpago`, `hisexpservcentral`, `hisexplotiposubrog`, `hisexpvertido`, `hisexsubcontra`, `hispolnegexp`, `hisexpedrecobro` | Configuration and operational parameters for water utility exploitations |
| **Contrato (Contracts)** | 16 | `hiscontrato` (108 cols), `hiscontratoprod`, `hiscontreten`, `hiscontgcob`, `hiscontpersautoriz`, `hiscontpersautgest`, `hisconccontrptos`, `hisconctipocontra`, `histipocontra`, `histipocontratcn`, `hisclascontra`, `hisdoctipocontra`, `hisgrupovarcontra`, `hisviatipocontra`, `histipovarcontra`, `hisexsubcontra` | Contract lifecycle, types, classifications |
| **Tarifa (Tariffs/Pricing)** | 13 | `histarifa`, `hisaplictarif`, `hisperiaplictarif`, `hiscorrtarifa`, `hiscorrsubcto`, `hispreccal`, `hisprecsubcon`, `hisprecsubdvng`, `hisprectracal`, `hisprectramos`, `hispreotrc`, `hisconsuvalfac`, `hisliqtarifmd101` | Tariff structures, corrections, pricing tiers |
| **Punto de Servicio (Service Points)** | 8 | `hisptoserv` (54 cols), `hisptoservsecun`, `hisptoserclau`, `hisrelacionps`, `hisnivelcritptoserv`, `hisacometida` (37 cols), `hiscierreacometida`, `hisrevacometida` | Physical service points and connections |
| **Persona (People/Customers)** | 7 | `hispersona` (36 cols), `hispersonadir`, `hispersonatel`, `hiscliente` (15 cols), `hisbonific`, `hissolbonif`, `hissolicitudaca` | Customer master data and related entities |
| **Sociedad (Company/Society)** | 9 | `hissociedad` (88 cols), `hissochub`, `hissocflujofirma`, `hissocfpcuent`, `hissocopecuent`, `hisofisocgest`, `hisexplosocemi`, `hisexplosocpro`, `hisdivnegocio` | Company entities and organizational structure |
| **Facturacion (Billing)** | 10 | `hisfactura`, `hisfacbi`, `hisconcepto` (31 cols), `hisapliccpto`, `hisaplicimpues`, `hismotfactura`, `hiscptomotfact`, `hisnumfactura`, `hispubliconc`, `hisdefimpreso` (47 cols) | Invoicing, concepts, taxes |
| **Lectura/Contador (Meters/Readings)** | 10 | `hiscontado` (34 cols), `hisleclote` (35 cols), `hislecloterech`, `hislibreta`, `hisplanleclib`, `hisconcentrador`, `hismagnitud`, `hismodestimac`, `histramoestim`, `hispartlectfact` | Meter management, reading lots |
| **Cobro/Deuda (Collections/Debt)** | 8 | `hisgestcobro`, `hisgesttramos`, `hisrecargo`, `hisexpedrecobro`, `hissencob`, `hisregulfact`, `hisjuicio` (37 cols), `hisliqtipotamer` | Debt management, surcharges, legal actions |
| **Orden/Gestion (Work Orders)** | 7 | `hisgesrecl`, `hisgestreccprov`, `hispasoproced` (49 cols), `hispasoproccp`, `hiscondpasoproced`, `hisaltpasoproced`, `hisprcdrecla` | Work orders, procedures, claims |
| **Comunicaciones** | 4 | `hiscomemail` (27 cols), `hiscomsms` (26 cols), `hisconmensaje` (31 cols), `histipomensaj` | Email, SMS, message templates |
| **Geografi/a/Direccion** | 8 | `hisdirec` (27 cols), `hiscalle`, `hisnomcalle`, `hisbarrio`, `hislocalidad`, `hispoblacion`, `hislineadistrib`, `hiselemestruc` | Addresses, streets, neighborhoods, localities |
| **Usuarios/Seguridad** | 8 | `hisusuario` (18 cols), `hisusuexplo`, `hisusuoficina`, `hisusuperfil`, `hisusupermiso`, `hisususociedad`, `hisperfil`, `hispermisos` | User management, profiles, permissions |
| **Configuracion/Lookup** | 44 | `histipobonif`, `histipocsc`, `histipodocumento`, `histipoelem`, `histipolicver`, `histipomensaj`, `histipooficina`, `histiporegulf`, `histiporelps`, `histiposoci`, `histiposubcon`, `histiposucsif`, `histiposumin`, `histipotarifa`, `histipounidad`, `histipovarbonif`, `histipovariable`, `histipovia`, `histipfactura`, `histipfraude`, `histipasiento`, `histipocptocobro`, `histipoconcep`, `hisoficina`, `hisnormativa`, `hisobsaccion`, `hisobservac`, `hisobspermiso`, `hisbolpubtar`, `hisclaveconta`, `hiscuentacont`, `hiscuentasesp`, `hiscuendestin`, `hisctabangest`, `hisbancogestor`, `hisemisordefimp`, `hisemisorventban`, `hiscentroadmin`, `hisfrmpagoban`, `hisprefacext`, `hispresremesa`, `hisserverprops`, `histraduccion`, `hiscierre` | Lookup tables, configuration, type definitions |
| **Fraude/Inspeccion (Fraud)** | 5 | `hisexpedsif` (61 cols), `hisorifraude`, `hismotnooftofraude`, `histipfraude`, `hisprcdlotinsfrau` | Fraud investigation and inspection |
| **Otros** | 15 | `hisaccesos`, `hisactsucsif`, `hisagrcontar`, `hisaolimiteconsumo`, `hisasignpolnegusoexp`, `hisconsuin`, `hiscsc`, `hisestexpesif`, `hisextracto`, `hisfecdesglos`, `hisficherosborrados`, `hisfirmaelectronica`, `hisimpvalfac`, `hisimpvalfacact`, `hisrefmsepa` | Miscellaneous |

---

## 2. Pattern Analysis

### 2.1 Universal Audit Columns

Every history table follows a consistent audit stamp pattern with two columns:

| Column Pattern | Type | Purpose |
|---------------|------|---------|
| `*hstusu` | `character varying(10)` | Username who made the change |
| `*hsthora` | `timestamp without time zone` | Timestamp of the change |

The prefix varies per table (e.g., `hacchstusu`/`hacchsthora` in `hisaccesos`, `hcntthstusu`/`hcntthsthora` in `hiscontrato`), following abbreviated column naming derived from the table name.

### 2.2 Structure Patterns

**Pattern 1: Full Mirror (majority)** -- The history table contains all columns from the base table plus the audit stamp. Examples:
- `hiscontrato` (108 columns) mirrors `contrato`
- `hisexplotacion` (353 columns) mirrors `explotacion`
- `hispersona` (36 columns) mirrors `persona`
- `hissociedad` (88 columns) mirrors `sociedad`

**Pattern 2: Minimal Audit** -- Only key identifiers plus audit stamp. Examples:
- `hisaccesos`: 4 columns (`hacchstusu`, `hacchsthora`, `hacctipo`, `haccobjid`)
- `hisfactura`: 4 columns (`hfacid`, `hfacfecvto`, `hfachstusu`, `hfachsthora`)
- `hisfacbi`: 3 columns (`hfbifacid`, `hfbifeccamb`, `hfbiestcamb`)

**Pattern 3: Extended Mirror** -- Base columns plus additional tracking columns. Examples:
- `hismovccontra`: Adds `hmccsaldoact`, `hmccsaldoant` (before/after values)
- `hispolcontar`: Adds `hpcthstmodif` (modification type flag)
- `hisvariable`: Adds `hvarhstmodif` (modification type flag, `M` default)

**Pattern 4: Operation-specific** -- Used by high-volume entities to log specific operations:
- `histpfaccnt`: Logs contract billing type changes with `htfacciocod` (action code) and `htfcanal` (channel)
- `histmptx`: Transaction processing history with undo parameters (`txparamsundo`)

### 2.3 Inconsistencies Identified

1. **Column naming is not uniform**: Prefixes are derived from abbreviated table names, making cross-table queries difficult. E.g., `hacchstusu` vs `hcntthstusu` vs `hphstusu`.
2. **No operation type column**: Most tables lack an INSERT/UPDATE/DELETE indicator. Only a handful use `hstmodif` (e.g., `hispolcontar`).
3. **No primary key on most history tables**: History rows are purely append-only with no sequence or surrogate key, making deduplication difficult.
4. **Nullable defaults vary**: Some `hstusu` default to `' '`, others to `'CONVERSION'`, `'Conversion'`, or `NULL`, or `USER` -- inconsistent migration artifacts.
5. **Timestamp handling inconsistent**: Some use `CURRENT_TIMESTAMP` default, others `NULL`, some have no default at all.
6. **Missing foreign keys to sesion**: No `sesid` reference in history tables to link to the user session context.

---

## 3. Storage Impact

### 3.1 Estimated Overhead of Mirrored-Table Approach

The mirrored-table pattern creates near 1:1 structural duplication:

| Metric | Value |
|--------|-------|
| Total columns across 230 his* tables | ~4,800+ |
| Average columns per his* table | ~21 |
| Largest table: `hisexplotacion` | 353 columns |
| Second largest: `hiscontrato` | 108 columns |
| Third largest: `hissociedad` | 88 columns |
| Tables with >30 columns | ~25 |
| Tables with <10 columns | ~80 |

### 3.2 Storage Duplication Categories

| Category | Table Count | Est. Column Total | Storage Impact |
|----------|------------|-------------------|----------------|
| **Config/Lookup tables** (low-change) | ~90 | ~600 | LOW volume, HIGH structural waste |
| **Master data** (medium-change) | ~50 | ~1,200 | MEDIUM volume, MEDIUM waste |
| **Transactional** (high-change) | ~40 | ~2,000 | HIGH volume, justified overhead |
| **Rarely-used** (near-zero changes) | ~50 | ~400 | VERY LOW volume, pure waste |

### 3.3 Key Observation

For a configuration table like `histipooficina` (7 columns, maybe 20 rows ever changed), maintaining a dedicated history table with its own schema, catalog entry, and backup overhead is disproportionate. The Phase 4 `audit_log` with JSONB is the correct modernization approach for these.

For high-volume tables like `hiscontrato` or `hisptoserv`, the mirrored-table approach provides query performance advantages (typed columns, indexable, no JSONB unpacking), so dedicated tables remain justified.

---

## 4. High-Value vs Low-Value History Tables

### 4.1 HIGH-VALUE: Keep as Dedicated Tables (18 tables)

These tables track mission-critical business entities with high query frequency and regulatory importance:

| Table | Columns | Justification |
|-------|---------|---------------|
| `hiscontrato` | 108 | Contract lifecycle -- regulatory requirement for water utility |
| `hisptoserv` | 54 | Service point changes -- physical infrastructure audit trail |
| `hispersona` | 36 | Customer PII changes -- GDPR/privacy compliance |
| `hiscliente` | 15 | Client account changes |
| `hissociedad` | 88 | Company entity changes |
| `hisexplotacion` | 353 | Exploitation configuration -- operational parameter audit |
| `hisacometida` | 37 | Water connection changes -- infrastructure audit |
| `hiscontado` | 34 | Meter data changes -- metering compliance |
| `hisdirec` | 27 | Address changes -- customer communication integrity |
| `hispolcontar` | 9 | Contract-tariff policy changes -- billing accuracy |
| `histarifa` | 13 | Tariff application changes -- rate compliance |
| `hisservicio` | 44 | Service entity changes |
| `hisleclote` | 35 | Reading lot tracking -- metering integrity |
| `hisjuicio` | 37 | Legal proceedings -- litigation trail |
| `hisexpedsif` | 61 | Fraud investigation -- legal/compliance |
| `hissolacometida` | 62 | Connection request history |
| `hispasoproced` | 49 | Procedure step tracking |
| `hisrecargo` | 11 | Surcharge history -- financial audit |

### 4.2 MEDIUM-VALUE: Consider Consolidation (40-50 tables)

Tables tracking moderately important entities that could remain separate but would benefit from standardization:

- `hiscorrtarifa` (45 cols) -- tariff corrections
- `hisprecsubcon` (large) -- pricing sub-concepts
- `hisconcepto` (31 cols) -- billing concept changes
- `hisconmensaje` (31 cols) -- messaging configuration
- `hisdefimpreso` (47 cols) -- print definition history
- `hiscomemail` (27 cols) -- email communication log
- `hiscomsms` (26 cols) -- SMS communication log
- `hisregulfact` (18 cols) -- billing regularization
- `hisgestcobro` (10 cols) -- collections management
- `hissolbonif` (21 cols) -- discount request history

### 4.3 LOW-VALUE: Migrate to audit_log (120-150 tables)

Lookup/configuration tables that change rarely (0-10 times per year). Examples:

| Table | Columns | Base Entity |
|-------|---------|-------------|
| `histipobonif` | 23 | Discount type definitions |
| `histipocsc` | 7 | CSC type definitions |
| `histipomensaj` | 16 | Message type definitions |
| `histipooficina` | 7 | Office type definitions |
| `histipoelem` | 4 | Element type definitions |
| `histipolicver` | 6 | License type definitions |
| `histipovia` | 7 | Road type definitions |
| `histipfactura` | 7 | Invoice type definitions |
| `histipfraude` | 7 | Fraud type definitions |
| `hisnivestruc` | 4 | Structure level definitions |
| `hisbarrio` | 6 | Neighborhood definitions |
| `hislocalidad` | 8 | Locality definitions |
| `hispoblacion` | 6 | Population definitions |
| `hiscentroadmin` | 7 | Admin center definitions |
| `hiselemestruc` | 8 | Structure element definitions |
| `hisnormativa` | 8 | Regulation definitions |
| `histipasiento` | 10 | Accounting entry types |
| `hisresnotacuse` | 6 | Acknowledgment types |
| `hisofisocgest` | 6 | Office-society management |
| `hisactsucsif` | 6 | SIF succession types |
| `hisagrcontar` | 5 | Contract grouping |
| ... and ~100 more | | |

---

## 5. Session Model

### 5.1 `sesion` Table Structure

```
sesion (4 columns)
  sesid      numeric(10)     NOT NULL  -- Session ID (PK)
  sesusuid   varchar(10)     NOT NULL  -- User ID
  sesofiid   numeric(5)      NOT NULL  -- Office ID
  sesfecha   date            NOT NULL  -- Session date
```

### 5.2 Analysis

The session model is **extremely minimal**:

| Feature | Present? | Notes |
|---------|----------|-------|
| Session ID | YES | `sesid` -- sequential numeric |
| User identification | YES | `sesusuid` -- links to `usuario` table |
| Office/location | YES | `sesofiid` -- which office the user logged in from |
| Session date | YES | `sesfecha` -- date only, not timestamp |
| Login time | NO | Only date, not time |
| Logout time | NO | Cannot calculate session duration |
| IP address | NO | No network audit trail |
| User agent / device | NO | No device tracking |
| Session status | NO | No active/expired/terminated status |
| Actions performed | NO | No activity log linked to session |
| Application module | NO | No tracking of which module was used |

### 5.3 Gaps

1. **No link from his* tables to sesion**: History tables capture `hstusu` (user) and `hsthora` (timestamp) but do not reference `sesid`. This makes it impossible to correlate changes to a specific login session.
2. **Date-only granularity**: `sesfecha` is a `date` not `timestamp`, losing intra-day precision.
3. **No logout tracking**: Cannot determine if a session was still active when a change was made.
4. **No IP/device audit**: Insufficient for cybersecurity compliance or forensic investigations.

---

## 6. JSONB Migration Plan

### 6.1 Migration Tiers

The Phase 4 plan (`phase4_audit_log_history.sql`) already defines the target architecture:

```sql
CREATE TABLE audit_log (
    al_id           BIGSERIAL PRIMARY KEY,
    al_table_name   VARCHAR(100) NOT NULL,
    al_record_key   TEXT NOT NULL,
    al_operation     VARCHAR(10) NOT NULL,   -- INSERT, UPDATE, DELETE
    al_old_data     JSONB,
    al_new_data     JSONB,
    al_changed_cols TEXT[],
    al_sesid        NUMERIC(10,0),
    al_hstusu       VARCHAR(10),
    al_hsthora      TIMESTAMP NOT NULL DEFAULT now(),
    al_expid        NUMERIC(5,0)
);
```

### 6.2 Tier 1: Immediate JSONB Migration (120-150 tables)

**Criteria:** Lookup/configuration tables with <10 columns and low change frequency.

**Estimated reduction:** 120-150 tables eliminated, replaced by rows in `audit_log`.

**Example migrations:**
```sql
-- These are already identified in phase4:
SELECT migrate_history_to_audit_log('histipobonif');
SELECT migrate_history_to_audit_log('histipocsc');
SELECT migrate_history_to_audit_log('histipomensaj');
SELECT migrate_history_to_audit_log('histipocarta');
SELECT migrate_history_to_audit_log('histipoobs');
```

**Full Tier 1 candidate list** (all config/lookup `his*` tables with <=15 columns):

`hisaccesos`, `hisactsucsif`, `hisagrcontar`, `hisaoliconsumo`, `hisasignpolnegusoexp`, `hisbancogestor`, `hisbarrio`, `hisbolpubtar`, `hisbonific`, `hiscalle`, `hiscausaborefac`, `hiscentroadmin`, `hisclascontra`, `hisclaveconta`, `hisconctipocontra`, `hisconcentrador`, `hiscptomotfact`, `hiscsc`, `hiscuendestin`, `hiscuentasesp`, `hisdefimpaplic`, `hisdefimpcptos`, `hisdoctipocontra`, `hiselemestruc`, `hisemisordefimp`, `hisemisorventban`, `hisestexpesif`, `hisexpccobro`, `hisexpctafrmpago`, `hisexpedrecobro`, `hisexpgestofi`, `hisexpintervalido`, `hisexplcentdist`, `hisexploclausula`, `hisexplomensaje`, `hisexplomotorden`, `hisexploperiodic`, `hisexplorapro`, `hisexpservcentral`, `hisexptipsubdoccontr`, `hisexplotiposubrog`, `hisexsubcontra`, `hisfacbi`, `hisfecdesglos`, `hisficherosborrados`, `hisfrmpagoban`, `hisgesttramos`, `hisgrupovarcontra`, `hisimpvalfac`, `hisimpvalfacact`, `hisliqblotramtar`, `hisliqtarifmd101`, `hismagnitud`, `hismodestimac`, `hismotbajacontra`, `hismotnoftofraude`, `hisnivelcritptoserv`, `hisnivestruc`, `hisnomcalle`, `hisnormativa`, `hisnumfactura`, `hisobspermiso`, `hisofisocgest`, `hisorifraude`, `hispadron`, `hispartlectfact`, `hisperiaplictarif`, `hisperiodic`, `hispermisos`, `hisplanleclib`, `hispoblacion`, `hispolclaus`, `hisprefacext`, `hispresremesa`, `hisptoserclau`, `hispubliconc`, `hisqmotreclam`, `hisqtplgrecl`, `hisqtxtcomunica`, `hisrefmsepa`, `hisresnotacuse`, `hisrevacometida`, `hisrutadalttpdoc`, `hissechidraulico`, `hisserverprops`, `hissocfpcuent`, `hissochub`, `hissocopecuent`, `histcscsustcu`, `histipasiento`, `histipfactura`, `histipfraude`, `histipobonif`, `histipobonifdoc`, `histipoconcep`, `histipocptocobro`, `histipocsc`, `histipodocumento`, `histipoelem`, `histipolicver`, `histipomensaj`, `histipooficina`, `histiporegulf`, `histiporelps`, `histiposoci`, `histiposubcon`, `histiposucsif`, `histiposumin`, `histipotarifa`, `histipounidad`, `histipovarbonif`, `histipovarcontra`, `histipovariable`, `histipovia`, `histpcontacto`, `histpimpusoc`, `histpofccquipu`, `histraduccion`, `histramoestim`, `hisusuexplo`, `hisusuoficina`, `hisusuperfil`, `hisusupermiso`, `hisususociedad`, `hisviatipocontra`, `hiscontgcob`

### 6.3 Tier 2: JSONB Diff Migration (30-40 tables)

**Criteria:** Medium-complexity tables (15-40 columns) with moderate change frequency.

For these tables, store only the changed columns as JSONB diff rather than full row copies:

```json
{
  "old": {"hcnttestado": 1, "hcnttcortep": "N"},
  "new": {"hcnttestado": 2, "hcnttcortep": "S"},
  "changed": ["hcnttestado", "hcnttcortep"]
}
```

**Candidates:** `hiscorrsubcto`, `hismotfactura`, `hiscontpersautoriz`, `hiscontpersautgest`, `hispersonatel`, `hislineadistrib`, `hisliqbloquetramo`, `hisgestcobro`, `hisgestreccprov`, `hiscontratoprod`, `hiscontreten`, `hismovccontra`, `hisgesrecl`, `hissocflujofirma`, `hissolacoestec`, `hissolbonif`, `hisfirmaelectronica`, `hisexpvertido`, `hisextracto`, `histpfaccnt`, `hisconsuin`, `hisapliccpto`, `hisaplicimpues`, `hisaplictarif`, `hisobsaccion`, `hisprecmulvar`, `hisptoservsecun`

### 6.4 Tier 3: Keep Dedicated (18-25 tables)

**Criteria:** High-volume transactional tables or those with regulatory requirements for typed, indexed queries.

Already identified in Phase 4 plan:
`hiscontrato`, `hisptoserv`, `hispersona`, `hissociedad`, `hisexplotacion`, `hisservicio`, `hisacometida`, `hiscontado`, `histarifa`, `hisleclote`, `hisjuicio`, `hisexpedsif`, `hissolacometida`, `hispasoproced`, `hisrecargo`, `hisdirec`, `hisoficina`, `hiscorrtarifa`, `hisdefimpreso`

### 6.5 Estimated Storage Reduction

| Phase | Tables Eliminated | Est. Size Reduction |
|-------|------------------|-------------------|
| Tier 1 (JSONB full row) | ~120 | 60-70% of history storage for these tables |
| Tier 2 (JSONB diff) | ~30 | 80-90% reduction (only changed columns stored) |
| Tier 3 (keep) | ~18-25 | 0% (but add partitioning for performance) |
| **Overall** | **~150** | **Estimated 40-50% total history storage reduction** |

---

## 7. Modern Audit Architecture Alternatives

### 7.1 Event Sourcing

**Approach:** Store immutable domain events (e.g., `ContractStatusChanged`, `MeterReadingRecorded`) instead of row snapshots.

**Pros:**
- Natural fit for CIS workflow events (contract creation, billing, meter readings)
- Enables event replay and temporal queries
- Smaller storage footprint (only event payload, not full row)

**Cons:**
- Requires significant application rewrite
- Needs event schema versioning
- Complex replay logic for current-state reconstruction

**Recommendation:** NOT suitable for near-term migration. Consider for next-generation CIS platform.

### 7.2 Change Data Capture (CDC)

**Approach:** Use PostgreSQL logical replication or tools like Debezium to capture WAL changes.

**Pros:**
- Zero application code changes
- Captures all changes including direct SQL
- Can stream to analytics/data lake
- Does not impact application performance

**Cons:**
- WAL-level capture is generic, not business-aware
- Requires CDC infrastructure (Kafka, Debezium)
- Storage can grow rapidly without retention policies

**Recommendation:** MEDIUM priority. Ideal complement to the JSONB audit_log for capturing changes that bypass the application layer.

### 7.3 PostgreSQL Temporal Tables (SQL:2011)

**Approach:** Use `FOR SYSTEM_TIME` / `FOR BUSINESS_TIME` temporal queries with period columns.

**Pros:**
- SQL standard approach
- Built-in point-in-time queries
- No application code changes for read queries

**Cons:**
- Limited native support in PostgreSQL (requires extensions like `temporal_tables`)
- Needs schema changes to base tables (add `valid_from`/`valid_to`)
- Not fully standardized in PostgreSQL ecosystem

**Recommendation:** LOW priority. Monitor PostgreSQL temporal table support evolution. The `hisvariable` table with `hvarfecini`/`hvarfecfin` already implements a manual version of this pattern.

### 7.4 Trigger-Based JSONB Audit (Phase 4 Approach)

**Approach:** Generic trigger function captures changes as JSONB into centralized `audit_log` table.

**Pros:**
- Already designed in `phase4_audit_log_history.sql`
- Minimal application changes (redirect writes)
- Flexible schema (JSONB accommodates any table structure)
- Centralized querying

**Cons:**
- JSONB queries slower than typed columns for high-volume tables
- Trigger overhead on every DML operation
- Needs GIN indexes for JSONB path queries

**Recommendation:** HIGH priority. This is the right near-term approach. The existing Phase 4 plan is well-designed.

---

## 8. Temporal Data Patterns

### 8.1 Effective Dating

Several history tables already implement effective-dating patterns:

| Table | Date Columns | Pattern |
|-------|-------------|---------|
| `hisaplictarif` | `haptfecapl`, `haptfecfin` | Tariff application validity period |
| `hisapliccpto` | `hapcfecini`, `hapcfecfin` | Concept application period |
| `hisaplicimpues` | `hapifecini`, `hapifecfin` | Tax application period |
| `hispolcontar` | `hpctfecini`, `hpctfecfin` | Contract-tariff policy period |
| `hisexpintervalido` | `heivfecini`, `heivfecfin` | Valid interval period |
| `hisexpservcentral` | `hescfechaini`, `hescfechafin` | Central service period |
| `hisvariable` | `hvarfecini`, `hvarfecfin` | Variable value validity |
| `hissolbonif` | `hsbfecini`, `hsbfecfin` | Discount validity period |
| `hisrelacionps` | `hrpsfecini`, `hrpsfecfin` | Service point relationship period |

### 8.2 Point-in-Time Query Support

The current architecture supports point-in-time reconstruction through `hsthora` timestamps, but this requires scanning all rows for a given entity and ordering by timestamp. There is no efficient mechanism for "show me the state of contrato X as of date Y" without full-table scanning.

**Gap:** No composite indexes on `(entity_id, hsthora DESC)` are documented in the mapping files. These would be critical for point-in-time queries.

---

## 9. Compliance Considerations

### 9.1 Mexican Water Utility Regulations

As a CEA (Comision Estatal de Aguas) Queretaro system, the following regulatory requirements likely drive history retention:

| Requirement | Relevant Tables | Retention Period |
|-------------|----------------|-----------------|
| **Tariff change audit trail** | `histarifa`, `hiscorrtarifa`, `hisprecsubcon`, `hisprectramos` | Indefinite -- rate cases require historical justification |
| **Customer billing disputes** | `hisfactura`, `hisregulfact`, `hisrecargo` | 5+ years -- statute of limitations for billing disputes |
| **Meter accuracy records** | `hiscontado`, `hisleclote` | Life of meter + 5 years |
| **Contract lifecycle** | `hiscontrato`, `hisptoserv` | Life of contract + 10 years |
| **Fraud investigations** | `hisexpedsif`, `hisjuicio` | Duration of proceedings + statute of limitations |
| **Customer data changes (privacy)** | `hispersona`, `hispersonadir`, `hispersonatel` | Subject to LFPDPPP (Mexico's data protection law) |
| **Financial audit trail** | `hismovccontra`, `hiscuentacont` | SAT requirements -- 5 years minimum |
| **Infrastructure changes** | `hisacometida`, `hisservicio`, `hisptoserv` | Life of infrastructure asset |

### 9.2 Data Protection (LFPDPPP)

Mexico's Federal Law on Protection of Personal Data (LFPDPPP) requires:
- Audit trail of who accessed/modified personal data
- Right to erasure (conflicting with audit retention)
- The `hcnttrgpdanonim` column in `hiscontrato` and `hprgpdanonim` in `hispersona` suggest GDPR-style anonymization flags already exist

### 9.3 Retention Policy Gaps

No retention policies or automated purge mechanisms are documented. The `his*` tables appear to grow indefinitely. For a 20+ year old system, this means:
- History tables may contain more rows than base tables by orders of magnitude
- Storage costs grow linearly with time
- Query performance degrades without partitioning

---

## 10. Recommendations

### HIGH Priority

| # | Recommendation | Impact | Effort |
|---|---------------|--------|--------|
| H1 | **Execute Phase 4 Tier 1 migration**: Consolidate ~120 lookup/config `his*` tables into `audit_log` with JSONB | Eliminates ~120 tables, reduces catalog bloat by 3% | Medium -- migration function already exists |
| H2 | **Add `sesid` to `audit_log`**: Link all audit entries to the session that created them | Enables session-correlated audit analysis | Low |
| H3 | **Enrich `sesion` table**: Add `sestimestamp` (full timestamp), `sesip` (IP address), `seslogout` (logout time), `sesstatus` (active/expired) | Addresses critical audit gaps | Medium |
| H4 | **Add partition strategy for `audit_log`**: Range partition by `al_hsthora` (monthly) | Prevents audit_log from becoming a performance bottleneck | Medium |
| H5 | **Standardize `hstmodif` column**: Add operation type (I/U/D) to all remaining `his*` tables | Enables filtering history by operation type | Medium |

### MEDIUM Priority

| # | Recommendation | Impact | Effort |
|---|---------------|--------|--------|
| M1 | **Implement retention policies**: Define TTL per history table category (5yr, 10yr, indefinite) | Controls storage growth | Medium |
| M2 | **Add composite indexes**: Create `(entity_id, hsthora DESC)` indexes on high-value `his*` tables | Enables efficient point-in-time queries | Low |
| M3 | **Implement Tier 2 JSONB diff**: Migrate 30-40 medium-complexity tables to diff-only JSONB storage | 80-90% storage reduction for these tables | High |
| M4 | **Add CDC pipeline**: Deploy Debezium/logical replication for real-time change capture to analytics | Enables real-time audit analytics without application changes | High |
| M5 | **Standardize column naming**: During migration, normalize audit column names to `al_user`/`al_timestamp` | Simplifies cross-table audit queries | Medium |

### LOW Priority

| # | Recommendation | Impact | Effort |
|---|---------------|--------|--------|
| L1 | **Evaluate temporal table extensions**: Test `temporal_tables` extension for PostgreSQL | Future-proofs point-in-time query capabilities | Low |
| L2 | **Archive old history data**: Move pre-2020 history data to cold storage (separate tablespace or external) | Reduces active database size | Medium |
| L3 | **Document LFPDPPP retention requirements**: Formalize data retention policies per table | Compliance documentation | Low |
| L4 | **Add primary keys to remaining `his*` tables**: Ensure all history tables have a surrogate key for deduplication | Data integrity improvement | Medium |

---

## 11. Audit Layer Health Score

| Dimension | Score (1-10) | Notes |
|-----------|-------------|-------|
| **Completeness** | 8 | Nearly every base entity has a history table |
| **Consistency** | 5 | `hstusu`/`hsthora` pattern is universal, but naming prefixes vary wildly |
| **Efficiency** | 2 | Full-row mirroring for 230 tables is extremely wasteful for config tables |
| **Session Tracking** | 2 | Minimal 4-column `sesion` table with date-only granularity |
| **Query Performance** | 3 | No documented indexes on history tables; no partitioning |
| **Compliance** | 5 | Data is captured but retention policies are absent |
| **Modernization Readiness** | 6 | Phase 4 plan is well-designed and ready for execution |
| **Temporal Support** | 4 | Some tables have `fecini`/`fecfin` but no systematic temporal pattern |
| **Operation Tracking** | 3 | Most tables lack INSERT/UPDATE/DELETE distinction |
| **Storage Management** | 2 | No partitioning, no archival, no retention policies |

**Overall Health Score: 4/10**

The audit layer is comprehensive in coverage (every important entity has history tracking) but architecturally dated. The Phase 4 migration plan represents the right modernization path. Executing it would improve the score to approximately 6-7/10 by eliminating structural waste and centralizing audit data. Further improvements (CDC, enriched sessions, temporal support) would push toward 8-9/10.

---

## Appendix: Complete his* Table Listing (230 tables)

<details>
<summary>Click to expand full table list</summary>

1. hisaccesos (4 cols)
2. hisacometida (37 cols)
3. hisactsucsif (6 cols)
4. hisagrcontar (5 cols)
5. hisaltpasoproced (13 cols)
6. hisaolimiteconsumo (12 cols)
7. hisapliccpto (12 cols)
8. hisaplicimpues (9 cols)
9. hisaplictarif (10 cols)
10. hisasignpolnegusoexp (8 cols)
11. hisbancogestor (20 cols)
12. hisbarrio (6 cols)
13. hisbolpubtar (6 cols)
14. hisbonific (5 cols)
15. hiscalle (7 cols)
16. hiscausaborefac (10 cols)
17. hiscentroadmin (7 cols)
18. hiscierre (18 cols)
19. hiscierreacometida (8 cols)
20. hisclascontra (8 cols)
21. hisclaveconta (8 cols)
22. hiscliente (15 cols)
23. hiscomemail (27 cols)
24. hiscomsms (26 cols)
25. hisconccontrptos (10 cols)
26. hisconcentrador (5 cols)
27. hisconcepto (31 cols)
28. hisconctipocontra (8 cols)
29. hiscondpasoproced (9 cols)
30. hisconmensaje (31 cols)
31. hisconsuin (15 cols)
32. hisconsuvalfac (10 cols)
33. hiscontado (34 cols)
34. hiscontgcob (7 cols)
35. hiscontpersautgest (9 cols)
36. hiscontpersautoriz (12 cols)
37. hiscontrato (108 cols)
38. hiscontratoprod (13 cols)
39. hiscontreten (17 cols)
40. hiscorrsubcto (12 cols)
41. hiscorrtarifa (45 cols)
42. hiscptomotfact (6 cols)
43. hiscsc (7 cols)
44. hisctabangest (14 cols)
45. hiscuendestin (9 cols)
46. hiscuentacont (33 cols)
47. hiscuentasesp (9 cols)
48. hisdefimpaplic (6 cols)
49. hisdefimpcptos (5 cols)
50. hisdefimpreso (47 cols)
51. hisdirec (27 cols)
52. hisdivnegocio (26 cols)
53. hisdoctipocontra (7 cols)
54. hiselemestruc (8 cols)
55. hisemisordefimp (9 cols)
56. hisemisorventban (9 cols)
57. hisestexpesif (5 cols)
58. hisexpccobro (10 cols)
59. hisexpctafrmpago (11 cols)
60. hisexpedrecobro (7 cols)
61. hisexpedsif (61 cols)
62. hisexpgestofi (8 cols)
63. hisexpintervalido (9 cols)
64. hisexplcentdist (7 cols)
65. hisexplociclinc (31 cols)
66. hisexploclausula (6 cols)
67. hisexploestim (26 cols)
68. hisexplomensaje (6 cols)
69. hisexplomotorden (12 cols)
70. hisexploperiodic (12 cols)
71. hisexploperiodo (10 cols)
72. hisexplorapro (9 cols)
73. hisexplosocemi (22 cols)
74. hisexplosocpro (31 cols)
75. hisexplotacion (353 cols)
76. hisexplotiposubrog (6 cols)
77. hisexplotipvar (15 cols)
78. hisexplotloc (13 cols)
79. hisexplotxtcnt (9 cols)
80. hisexplotxtfunc (9 cols)
81. hisexpservcentral (9 cols)
82. hisexptipdocumento (29 cols)
83. hisexptipsubdoccontr (7 cols)
84. hisexpvertido (29 cols)
85. hisexsubcontra (7 cols)
86. hisextracto (4 cols)
87. hisfacbi (3 cols)
88. hisfactura (4 cols)
89. hisfecdesglos (5 cols)
90. hisficherosborrados (3 cols)
91. hisfirmaelectronica (10 cols)
92. hisfrmpagoban (10 cols)
93. hisgesrecl (9 cols)
94. hisgestcobro (10 cols)
95. hisgestreccprov (11 cols)
96. hisgesttramos (8 cols)
97. hisgrupovarcontra (7 cols)
98. hisimpvalfac (9 cols)
99. hisimpvalfacact (9 cols)
100. hisjuicio (37 cols)
101. hisleclote (35 cols)
102. hislecloterech (35 cols)
103. hislibreta (19 cols)
104. hislicexpver (14 cols)
105. hislineadistrib (7 cols)
106. hisliqbloquetramo (7 cols)
107. hisliqblotramtar (5 cols)
108. hisliqtarifmd101 (6 cols)
109. hisliqtipotamer (23 cols)
110. hislocalidad (8 cols)
111. hismagnitud (8 cols)
112. hismodestimac (10 cols)
113. hismotbajacontra (10 cols)
114. hismotfactura (15 cols)
115. hismotnoftofraude (6 cols)
116. hismovccontra (11 cols)
117. hisnivelcritptoserv (7 cols)
118. hisnivestruc (4 cols)
119. hisnomcalle (10 cols)
120. hisnormativa (8 cols)
121. hisnumfactura (8 cols)
122. hisobsaccion (20 cols)
123. hisobservac (25 cols)
124. hisobspermiso (15 cols)
125. hisoficina (29 cols)
126. hisofisocgest (6 cols)
127. hisorifraude (6 cols)
128. hispadron (11 cols)
129. hisparfunaca (23 cols)
130. hispartlectfact (8 cols)
131. hispasoproccp (14 cols)
132. hispasoproced (49 cols)
133. hisperfil (9 cols)
134. hisperiaplictarif (11 cols)
135. hisperiodic (8 cols)
136. hispermisos (6 cols)
137. hispersona (36 cols)
138. hispersonadir (17 cols)
139. hispersonatel (10 cols)
140. hisplanleclib (16 cols)
141. hispoblacion (6 cols)
142. hispolclaus (6 cols)
143. hispolcontar (9 cols)
144. hispolcorrect (25 cols)
145. hispolnegexp (varies)
146. hisprcdlotinsfrau (varies)
147. hisprcdpclaus (varies)
148. hisprcdpdocs (varies)
149. hisprcdreccprov (varies)
150. hisprcdrecla (varies)
151. hispreccal (varies)
152. hisprecmulvar (varies)
153. hisprecsubcon (varies)
154. hisprecsubdvng (varies)
155. hisprectracal (varies)
156. hisprectramos (15 cols)
157. hisprefacext (7 cols)
158. hispreotrc (11 cols)
159. hispresremesa (7 cols)
160. hisptoserclau (6 cols)
161. hisptoserv (54 cols)
162. hisptoservsecun (10 cols)
163. hispubliconc (8 cols)
164. hisqmotreclam (7 cols)
165. hisqtplgrecl (11 cols)
166. hisqtxtcomunica (6 cols)
167. hisrecargo (11 cols)
168. hisrefmsepa (11 cols)
169. hisregulfact (18 cols)
170. hisrelacionps (27 cols)
171. hisresnotacuse (6 cols)
172. hisrevacometida (11 cols)
173. hisrutadalttpdoc (10 cols)
174. hissechidraulico (7 cols)
175. hissencob (17 cols)
176. hisserverprops (9 cols)
177. hisservicio (44 cols)
178. hissocflujofirma (12 cols)
179. hissocfpcuent (10 cols)
180. hissochub (9 cols)
181. hissociedad (88 cols)
182. hissocopecuent (6 cols)
183. hissolacoestec (14 cols)
184. hissolacometida (62 cols)
185. hissolbonif (21 cols)
186. hissolicitudaca (42 cols)
187. histarifa (13 cols)
188. histcscsustcu (7 cols)
189. histipasiento (10 cols)
190. histipfactura (7 cols)
191. histipfraude (7 cols)
192. histipobonif (23 cols)
193. histipobonifdoc (6 cols)
194. histipoconcep (13 cols)
195. histipocontra (19 cols)
196. histipocontratcn (39 cols)
197. histipocptocobro (6 cols)
198. histipocsc (7 cols)
199. histipodocumento (23 cols)
200. histipoelem (4 cols)
201. histipolicver (6 cols)
202. histipomensaj (16 cols)
203. histipooficina (7 cols)
204. histiporegulf (19 cols)
205. histiporelps (varies)
206. histiposoci (varies)
207. histiposubcon (varies)
208. histiposucsif (varies)
209. histiposumin (varies)
210. histipotarifa (varies)
211. histipounidad (varies)
212. histipovarbonif (varies)
213. histipovarcontra (7 cols)
214. histipovariable (17 cols)
215. histipovia (7 cols)
216. histmptx (11 cols)
217. histpcontacto (6 cols)
218. histpfaccnt (7 cols)
219. histpimpusoc (6 cols)
220. histpofccquipu (5 cols)
221. histraduccion (7 cols)
222. histramoestim (9 cols)
223. hisusuario (18 cols)
224. hisusuexplo (5 cols)
225. hisusuoficina (5 cols)
226. hisusuperfil (5 cols)
227. hisusupermiso (7 cols)
228. hisususociedad (5 cols)
229. hisvariable (14 cols)
230. hisviatipocontra (24 cols)

</details>

---

*Report generated by Agent A8 (db-history-audit) on 2026-02-16*
