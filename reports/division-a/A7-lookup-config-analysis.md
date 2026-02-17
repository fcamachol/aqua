# A7 - Lookup & Configuration Table Layer Analysis

## AquaCIS (CEA Queretaro) - PostgreSQL Database Audit
### Agent: A7 (db-lookup-config) | Schema: cf_quere_pro

---

## Executive Summary

The AquaCIS configuration layer suffers from a severe "table-per-value" anti-pattern. The database contains **76 tipo\* (type) tables**, **9 estado\* (status) tables**, **8 obs\* (observation) tables**, and multiple supporting infrastructure tables -- totaling approximately **95+ lookup/configuration tables**. Nearly all of these could be consolidated into a single polymorphic lookup table with a domain discriminator column. The current approach creates massive DDL sprawl, makes schema maintenance expensive, prevents generic UI tooling, and bloats the ORM mapping layer. While most tipo\* tables share a common {id, txtid} pattern (referencing the multilingual text system), there is significant structural inconsistency: some tables have 2 columns, others have 29+. Status (estado\*) tables are structurally identical to tipo\* tables but use a different naming convention, further fragmenting the domain model. The multilingual infrastructure via `tabladesc`, `tablatext`, and `tablas_multiidioma` is present but underutilized, and internationalization readiness is incomplete.

**Configuration Layer Health Score: 3/10** -- Functional but architecturally unsound. Massive consolidation opportunity.

---

## 1. Tipo Table Census

### 1.1 Complete Inventory (76 tables)

The following tables use the `tipo*` or `tip*` naming convention, serving as type/classification lookups:

| # | Table Name | Columns | Primary Pattern | Domain |
|---|-----------|---------|----------------|--------|
| 1 | `tipasiento` | 10 | id + txtid + behavior flags | Accounting entry types |
| 2 | `tipcliente` | 9 | cod + txtid + behavior flags | Client types |
| 3 | `tipcontmtr` | 1 | id only | Meter contract types |
| 4 | `tipfacgasrec` | 2 | id + expid | Invoice expense recovery types |
| 5 | `tipfactura` | 7 | compound key + desc | Invoice types |
| 6 | `tipfichtao` | 3 | expid + soc + tipfich | File types (TAO) |
| 7 | `tipfraude` | 5 | id + txtid + audit | Fraud types |
| 8 | `tipgesdeud` | 5 | cod + txtid + behavior flags | Debt management types |
| 9 | `tipimpues` | 4 | id + impid + txtid | Tax types |
| 10 | `tipliqsoc` | 2 | socid + tliqid | Liquidation-society link |
| 11 | `tipoactsucsif` | 2 | tipid + actid | SIF action types |
| 12 | `tipoalarmatel` | 4 | id + txtid + active flag | Telemetry alarm types |
| 13 | `tipoalarmatelext` | 5 | id + sistema + codigo + txtid | External telemetry alarm types |
| 14 | `tipoatencion` | 4 | id + txtid + flags | Attention types |
| 15 | `tipobonif` | 21 | id + expid + txtid + many fields | Bonus/discount types |
| 16 | `tipobonifdoc` | 6 | tbid + dconid + flags + audit | Bonus document types |
| 17 | `tipocarta` | 4 | id + desc + docum + certif | Letter types |
| 18 | `tipocatcalle` | 2 | id + txtid | Street category types |
| 19 | `tipoconcep` | 11 | id + txtid + behavior flags | Billing concept types |
| 20 | `tipocontador` | 4 | id + txtid + tipo + lote | Meter types |
| 21 | `tipocontra` | 19 | compound key + desc + many fields | Contract types (legacy) |
| 22 | `tipocontratcn` | 37 | id + txtid + many config fields | Contract types (new, 37 cols!) |
| 23 | `tipocorreo` | 2 | tipo + txtid | Mail types |
| 24 | `tipocptocobro` | 4 | id + txtid + audit | Collection point types |
| 25 | `tipocsc` | 5 | id + txtid + tpnif + audit | CSC types |
| 26 | `tipodesctoanticipo` | 5 | id + txtid + config | Advance discount types |
| 27 | `tipodocextfirmaele` | 4 | id + nombre + txtid + active | External doc types for e-signature |
| 28 | `tipodocumento` | 22 | id + tipo + many config fields | Document types |
| 29 | `tipodocxml` | 5 | id + tipo + config | XML document types |
| 30 | `tipoelem` | 4 | cod + descrip + audit | Element types |
| 31 | `tipoenvfac` | 2 | tipfacid + tipenvid | Invoice send type link |
| 32 | `tipoesttec` | 4 | id + txtid + flags | Technical state types |
| 33 | `tipofacturaext` | 1 | id only | External invoice types |
| 34 | `tipogestcobro` | 3 | id + txtid + flag | Collection management types |
| 35 | `tipoincide` | 4 | id + txtid + flags | Incident types |
| 36 | `tipoindem` | 2 | id + desc | Indemnity types |
| 37 | `tipolicver` | 6 | id + txtid + config + audit | Verification license types |
| 38 | `tipoliquidacion` | 8 | id + descrip + many tconid refs | Liquidation types |
| 39 | `tipomccontrato` | 5 | id + entsal + txtid + flags | Contract movement types |
| 40 | `tipomensaj` | 15 | id + txtid + many config fields | Message types |
| 41 | `tipoobs` | 5 | id + descrip + behavior flags | Observation types |
| 42 | `tipooficina` | 6 | id + flags + txtid + audit | Office types |
| 43 | `tipooperacion` | 2 | id + txtid | Operation types |
| 44 | `tipoorden` | 10 | id + txtid + many config flags | Work order types |
| 45 | `tipoordenperf` | 2 | tpoid + perfid | Order type-profile link |
| 46 | `tipoproceso` | 4 | id + procid + funcod + treid | Process types |
| 47 | `tipoptosrv` | 6 | id + usocod + txtid + config | Service point types |
| 48 | `tipoqueja` | 2 | id + desc | Complaint types |
| 49 | `tiporecface` | 3 | id + cod + txtid | Electronic invoice receipt types |
| 50 | `tiporegulf` | 17 | id + desc + many config fields | Regularization types |
| 51 | `tiporelps` | 8 | id + metodo + txtid + config | PS relationship types |
| 52 | `tiposervicio` | 4 | id + txtid + flags | Service types |
| 53 | `tipositadmver` | 4 | cod + txtids + active flag | Admin verification site types |
| 54 | `tipositcalle` | 2 | id + txtid | Street situation types |
| 55 | `tipositver` | 2 | id + txtid | Verification situation types |
| 56 | `tiposobre` | 5 | id + txtid + codext + audit | Envelope types |
| 57 | `tiposoci` | 5 | id + siglas + audit + txtid | Society types |
| 58 | `tiposolaco` | 29 | id + expid + many config fields | Connection request types |
| 59 | `tiposubcon` | 8 | id + txtid + behavior flags + audit | Subconcept types |
| 60 | `tiposubrogacion` | 3 | id + txtid + tipooper | Subrogation types |
| 61 | `tiposucsif` | 5 | id + tipo + txtid + audit | SIF event types |
| 62 | `tiposumin` | 12 | id + txtid + many behavior flags | Supply types |
| 63 | `tipotarifa` | 6 | id + txtid + audit + config | Tariff types |
| 64 | `tipotarifasocial` | 2 | cod + txtid | Social tariff types |
| 65 | `tipotartao` | 3 | expid + tiptariftao + txtid | TAO tariff types |
| 66 | `tipotelelectura` | 8 | id + txtid + config fields | Tele-reading types |
| 67 | `tipounidad` | 11 | id + txtid + config + operations | Unit types |
| 68 | `tipovarbonif` | 5 | tbid + tpvid + valdef + audit | Bonus variable types |
| 69 | `tipovarcom` | 7 | tpdid + tagvar + txtid + flags | Communication variable types |
| 70 | `tipovarcontra` | 7 | tctcod + tpvid + config + audit | Contract variable types |
| 71 | `tipovarepi` | 2 | tpvid + epiid | Variable-epigraph link |
| 72 | `tipovarext` | 3 | tipvarid + flags | External variable types |
| 73 | `tipovariable` | 14 | id + txtid + config + operations | Variable types (master) |
| 74 | `tipovia` | 6 | id + cod + posicion + audit + txtid | Road/street types |
| 75 | `tipoviaaca` | 2 | tviaid + codaca | Road type - ACA link |
| 76 | `tipvalvula` | 3 | cod + indblk + txtid | Valve types |

**Additional tip\* tables with non-standard prefixes:**
- `tippersautoriz` (2 cols) -- Authorized person types
- `tipptoservtao` (3 cols) -- TAO service point types
- `tiprepara` (3 cols) -- Repair types
- `tiprespvisita` (3 cols) -- Visit response types

**Grand Total: 80 tipo/tip tables**

### 1.2 Categorization by Domain

| Domain | Count | Tables |
|--------|-------|--------|
| **Billing & Tariffs** | 12 | `tipotarifa`, `tipotarifasocial`, `tipotartao`, `tipoconcep`, `tipfactura`, `tipfacgasrec`, `tipofacturaext`, `tipoenvfac`, `tipimpues`, `tipoliquidacion`, `tipodesctoanticipo`, `tiporecface` |
| **Contracts & Service** | 10 | `tipocontra`, `tipocontratcn`, `tipcliente`, `tiposervicio`, `tiposumin`, `tipoptosrv`, `tipptoservtao`, `tiposubrogacion`, `tiposolaco`, `tipomccontrato` |
| **Metering & Reading** | 8 | `tipocontador`, `tipcontmtr`, `tipotelelectura`, `tipovariable`, `tipounidad`, `tipoobs`, `tipoalarmatel`, `tipoalarmatelext` |
| **Variables & Config** | 7 | `tipovarcontra`, `tipovarbonif`, `tipovarcom`, `tipovarepi`, `tipovarext`, `tipobonif`, `tipobonifdoc` |
| **Debt & Collections** | 4 | `tipgesdeud`, `tipogestcobro`, `tipocptocobro`, `tiporegulf` |
| **Documents & Letters** | 5 | `tipodocumento`, `tipodocxml`, `tipodocextfirmaele`, `tipocarta`, `tiposobre` |
| **Geography & Streets** | 5 | `tipovia`, `tipoviaaca`, `tipocatcalle`, `tipositcalle`, `tipositver` |
| **Organization** | 5 | `tipooficina`, `tiposoci`, `tipocsc`, `tipooperacion`, `tipoproceso` |
| **Orders & Incidents** | 5 | `tipoorden`, `tipoordenperf`, `tipoincide`, `tipoqueja`, `tiprepara` |
| **Fraud** | 2 | `tipfraude`, `tiposucsif` |
| **Other/Infrastructure** | 7 | `tipasiento`, `tipoesttec`, `tipoindem`, `tipolicver`, `tiporelps`, `tipomensaj`, `tipoatencion` |
| **Link/Junction** | 10 | `tipliqsoc`, `tipoactsucsif`, `tipfichtao`, `tipoenvfac`, `tipoordenperf`, `tipptoservtao`, `tipovarepi`, `tipoviaaca`, `tiprespvisita`, `tippersautoriz` |

---

## 2. Estado Table Census

### 2.1 Complete Inventory (9 tables)

| # | Table Name | Columns | Structure Pattern | Domain |
|---|-----------|---------|------------------|--------|
| 1 | `estadcsb57` | 18 | Transactional -- NOT a lookup | CSB57 bank file processing states |
| 2 | `estadofraude` | 2 | id + txtid | Fraud case statuses |
| 3 | `estadomotrec` | 3 | id + txtid + tiprech | Claim motion statuses |
| 4 | `estadosjuicios` | 2 | id + txtid | Lawsuit statuses |
| 5 | `estadossicer` | 3 | cod + txtid + snactivo | SICER system statuses |
| 6 | `estfirmaelectronica` | 9 | codigo + txtid + behavior flags | E-signature statuses |
| 7 | `estimnogen` | 11 | Transactional -- NOT a lookup | Non-generated estimation log |
| 8 | `estopeplatfirma` | 4 | codigo + descid + flags | E-signature platform operation statuses |
| 9 | `estpersautoriz` | 5 | id + txtid + flags | Authorized person statuses |

**True lookup estado\* tables: 7** (excluding `estadcsb57` and `estimnogen` which are transactional)

### 2.2 Status Pattern Analysis

The true status tables follow a pattern nearly identical to tipo\* tables:
- Core: `{id, txtid}` -- exactly the same as tipo\* minimal pattern
- Extended: Some add `snactivo` (active flag) or behavioral flags
- `estfirmaelectronica` is the most complex with 9 columns including re-send, cancellation, and digital sending flags

**Key Finding**: There is NO structural reason for estado\* tables to exist separately from tipo\* tables. They represent the same concept (domain value lookups) with a different prefix.

---

## 3. Observation Tables (obs\*) Census

| # | Table Name | Columns | Purpose |
|---|-----------|---------|---------|
| 1 | `observac` | 23 | Master reading observation codes -- highly enriched |
| 2 | `obsaccion` | 20 | Actions triggered by observation codes |
| 3 | `obsacomet` | 3 | Connection observation codes (cod + desc + indblk) |
| 4 | `obsfirmaelectronica` | 3 | Observations linked to e-signature |
| 5 | `obsids` | 1 | Observation ID sequence/registry |
| 6 | `obslectao` | 3 | TAO reading observation mappings |
| 7 | `obspermiso` | 15 | Permission flags per observation code per exploitation |
| 8 | `obstext` | 7 | Free-text observations with timestamps |

The `observac` table (23 columns) is the most complex lookup in the system, containing reading observation codes with extensive behavioral configuration (leak detection, meter change triggers, estimation rules, alarm generation). This is a legitimate rich-configuration table, not a simple lookup.

---

## 4. Variable & Configuration Tables

| Table | Columns | Purpose |
|-------|---------|---------|
| `variable` | 13 | Core variable store: polymorphic value (num/char/date/bool) per contract/service point |
| `tipovariable` | 14 | Variable type definitions with calculation configuration |
| `tipounidad` | 11 | Unit type definitions with derived calculation config |
| `tabladesc` | 6 | Multi-language table descriptions (id + idioma + txtid + desc) |
| `tablatext` | 6 | Multi-language text store (id + idioma + txtid + text) |
| `tablas_multiidioma` | 4 | Metadata: which tables/columns support multi-language |
| `traduccion` | 7 | Translation store (tipo + clave + forma + idioma + texto) |

The `variable` table is a well-designed polymorphic value store with `varvalnum`, `varvalchar`, `varvalfec`, `varvalbool` -- demonstrating that the architects understood polymorphic patterns. This makes the tipo\* proliferation even more puzzling.

---

## 5. Anti-Pattern Analysis: Table-per-Value

### 5.1 The Core Problem

The database uses a **"table-per-value" anti-pattern** where each domain classification gets its own physical table. This is the most extreme form of over-normalization.

**Scale of the problem:**
- 80 tipo/tip\* tables
- 7 estado\* lookup tables
- 8 obs\* configuration tables
- Total: **~95 lookup tables** that could potentially be served by 1-3 tables

### 5.2 Tables That Are Pure Lookups (Immediate Consolidation Candidates)

These tables follow the exact `{id, txtid}` pattern with no extra columns, making them trivially consolidatable:

| Table | Columns | Current Structure |
|-------|---------|-------------------|
| `tipocatcalle` | 2 | tpctcid + tpctctxtid |
| `tipocorreo` | 2 | tipctipo + tipcdesctxtid |
| `tipooperacion` | 2 | toperacid + toperatxtid |
| `tipositcalle` | 2 | tpstcid + tpstctxtid |
| `tipositver` | 2 | tsvid + tsvtxtid |
| `tipotarifasocial` | 2 | ttfscod + ttfstxtid |
| `tipoqueja` | 2 | tqueid + tquedesc |
| `tipoindem` | 2 | tinid + tindesc |
| `tippersautoriz` | 2 | tpaid + tpatxtid |
| `estadofraude` | 2 | efrcod + efrtxtid |
| `estadosjuicios` | 2 | esjcod + esjtxtid |
| `tipcontmtr` | 1 | tctconid (just an ID!) |
| `tipofacturaext` | 1 | tpfid (just an ID!) |

**13 tables = 13 rows in a unified lookup table** (one per domain).

### 5.3 Tables with Minimal Extra Columns (Easy Consolidation)

Tables with `{id, txtid, 1-2 extra columns}`:

| Table | Extra Beyond id+txtid | Could Use |
|-------|----------------------|-----------|
| `tipocontador` (4 cols) | tplote, tipo | metadata JSON or extra columns |
| `tipoatencion` (4 cols) | snpresen, snactiva | active flag + 1 attribute |
| `tipoesttec` (4 cols) | snagua, sngestint | 2 boolean flags |
| `tipogestcobro` (3 cols) | concacre flag | 1 flag |
| `tipoincide` (4 cols) | orgint, motnoca | 2 attributes |
| `tipolicver` (6 cols) | mesesflim, snrefer + audit | config + audit |
| `tiposervicio` (4 cols) | sninc, snfreatica | 2 flags |
| `tiposubrogacion` (3 cols) | tipooper | 1 FK reference |
| `estadossicer` (3 cols) | snactivo | 1 active flag |
| `estadomotrec` (3 cols) | tiprech | 1 attribute |
| `tipocsc` (5 cols) | tpnif + audit | 1 attribute + audit |
| `tiporecface` (3 cols) | cod | 1 code |
| `tipvalvula` (3 cols) | indblk + txtid | 1 attribute |

**13 more tables** that could be consolidated using a slightly extended unified lookup schema.

### 5.4 Tables That Are Really Configuration (Keep Separate)

Some tipo\* tables are complex configuration entities, not simple lookups:

| Table | Columns | Why Keep Separate |
|-------|---------|-------------------|
| `tipocontratcn` | 37 | Full contract type configuration with document templates, workflow rules |
| `tiposolaco` | 29 | Connection request configuration with service types, pricing rules |
| `tipodocumento` | 22 | Document type config with templates, channels, signing rules |
| `tipobonif` | 21 | Discount type config with dates, approval rules, tariff modifications |
| `tiporegulf` | 17 | Regularization config with amounts, concepts, message types |
| `tipomensaj` | 15 | Message type config with application, sector, and publication rules |
| `tipovariable` | 14 | Variable type with calculation engine config |
| `tiposumin` | 12 | Supply type with reading, aging, and consumption flags |
| `tipounidad` | 11 | Unit type with derivation/calculation operators |
| `tipoconcep` | 11 | Billing concept type with surcharge and deferral rules |
| `tipoorden` | 10 | Work order type with installation, reading, and mass operation config |
| `tipasiento` | 10 | Accounting entry type config |

**12 tables are legitimately complex** configuration entities that may justify their own tables, though even these could benefit from a common base table with extension tables.

---

## 6. Structure Consistency Analysis

### 6.1 Common Structural Patterns

**Pattern A -- Minimal Lookup (26 tables):**
```
{id numeric(5,0), txtid numeric(10,0)}
```
Pure ID + text reference. Examples: `tipocatcalle`, `tipositver`, `tipocorreo`, `tipooperacion`.

**Pattern B -- Lookup + Audit (18 tables):**
```
{id, txtid, hstusu varchar(10), hsthora timestamp}
```
Adds standard audit trail. Examples: `tipofraude`, `tipoelem`, `tipotarifa`.

**Pattern C -- Lookup + Active Flag (8 tables):**
```
{id, txtid, snactivo char(1)}
```
Adds soft-delete capability. Examples: `tipoalarmatel`, `tipoatencion`, `estadossicer`.

**Pattern D -- Lookup + Exploitation Scope (7 tables):**
```
{id, expid, txtid, ...}
```
Scoped per exploitation/deployment. Examples: `tipobonif`, `tipotartao`, `tiporegulf`.

**Pattern E -- Rich Configuration (12 tables):**
```
{id, txtid, many domain-specific columns}
```
Configuration entities with 10-37 columns. Examples: `tipocontratcn`, `tipodocumento`, `tiposolaco`.

**Pattern F -- Junction/Link (10 tables):**
```
{foreign_key_1, foreign_key_2}
```
Many-to-many links between lookups. Examples: `tipoordenperf`, `tipoenvfac`, `tipovarepi`.

### 6.2 Structural Deviations

1. **Inconsistent ID types**: Most use `numeric(5,0)`, but some use `numeric(10,0)` (e.g., `tipomensaj.tmenid`), and `tipocarta` uses `numeric(5,0)` while `tipocliente` uses `character(1)`.

2. **Mixed description strategy**: Some tables use `txtid` referencing the multi-language text system, others use inline `desc` or `descrip` columns (`tipocarta.tcardesc`, `tipoqueja.tquedesc`, `tipoindem.tindesc`). This breaks the internationalization pattern.

3. **Inconsistent audit columns**: Some tables have `{hstusu, hsthora}`, many do not. No table has `created_at` vs `updated_at` distinction -- just a single timestamp.

4. **Column naming chaos**: Each table invents its own prefix:
   - `tipoconcep` uses `tcon*`
   - `tipocontador` uses `tcn*`
   - `tipocontra` uses `tct*`
   - `tipocontratcn` also uses `tct*` (collision!)
   - `tipocptocobro` uses `tcc*`

5. **Single-column tables**: `tipcontmtr` (1 column) and `tipofacturaext` (1 column) are degenerate -- they serve only as domain constraints with no descriptive data.

---

## 7. Missing Infrastructure

### 7.1 Missing Indexes

Based on the schema definitions, the following concerns exist:

- **No visible primary key declarations** in the DDL exports -- while PK constraints likely exist, the schema dump format does not confirm them.
- **No foreign key constraints visible** linking tipo\* tables to transactional tables that reference them (e.g., no FK from `contrato.tipocont` to `tipocontra.tctcod`).
- **No unique constraints** on natural keys like `observac.obscod` (character(2)) which should be unique.
- **txtid columns lack visible FK constraints** to the `tablatext`/`tabladesc` multilingual text system.

### 7.2 Missing Audit Columns

| Missing Element | Tables Affected |
|----------------|-----------------|
| No `hstusu`/`hsthora` at all | ~26 tables (all minimal 2-column lookups) |
| No `created_at` vs `modified_at` distinction | ALL tables -- single timestamp only |
| No `created_by` vs `modified_by` distinction | ALL tables -- single user field only |
| No `snactivo` (active/soft-delete) flag | ~55 tables lack this |
| No `version` column for optimistic locking | ALL tables |

### 7.3 Missing Constraints

- **CHECK constraints**: Boolean-like `char(1)` columns (S/N values) have no CHECK constraint visible.
- **NOT NULL on descriptions**: Some description fields are nullable, allowing orphan lookups with no label.
- **Cascade rules**: No visible ON DELETE/ON UPDATE rules for FK relationships.

---

## 8. Consolidation Plan

### 8.1 Tier 1: Immediate Consolidation (26 tables -> 1 table)

All pure `{id, txtid}` and `{id, desc}` lookup tables can be immediately consolidated:

**Target table: `lookup_type`**
```sql
CREATE TABLE lookup_type (
    domain        VARCHAR(50)   NOT NULL,  -- e.g., 'TIPO_CATCALLE', 'ESTADO_FRAUDE'
    code          VARCHAR(20)   NOT NULL,  -- the lookup code/id
    txtid         NUMERIC(10,0),           -- reference to multilingual text
    description   VARCHAR(200),            -- inline description (for tables not using txtid)
    sort_order    NUMERIC(5,0)  DEFAULT 0,
    is_active     CHAR(1)       DEFAULT 'S',
    metadata_json JSONB,                   -- for 1-2 extra attributes
    hstusu        VARCHAR(10),
    hsthora       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (domain, code)
);
```

**Tables to migrate:**
`tipocatcalle`, `tipocorreo`, `tipooperacion`, `tipositcalle`, `tipositver`, `tipotarifasocial`, `tipoqueja`, `tipoindem`, `tippersautoriz`, `tipcontmtr`, `tipofacturaext`, `estadofraude`, `estadosjuicios`, `tipocontador`, `tipoatencion`, `tipoesttec`, `tipogestcobro`, `tipoincide`, `tiposervicio`, `tiposubrogacion`, `estadossicer`, `estadomotrec`, `tipocsc`, `tiporecface`, `tipvalvula`, `tipoalarmatel`

### 8.2 Tier 2: Extended Consolidation (15 tables -> same table with metadata)

Tables with `{id, txtid, audit, 1-3 config flags}` using the `metadata_json` column for extra attributes:

`tipolicver`, `tipocptocobro`, `tipooficina`, `tiposoci`, `tiposobre`, `tipotarifa`, `tipoelem`, `tipfraude`, `tipgesdeud`, `tipimpues`, `tipsubcon`, `tipoobs`, `estfirmaelectronica`, `estopeplatfirma`, `estpersautoriz`

### 8.3 Tier 3: Junction Table Consolidation (10 tables -> 1 table)

All link/junction tables between lookup types:

**Target table: `lookup_type_link`**
```sql
CREATE TABLE lookup_type_link (
    link_domain   VARCHAR(50)  NOT NULL,
    source_domain VARCHAR(50)  NOT NULL,
    source_code   VARCHAR(20)  NOT NULL,
    target_domain VARCHAR(50)  NOT NULL,
    target_code   VARCHAR(20)  NOT NULL,
    PRIMARY KEY (link_domain, source_domain, source_code, target_domain, target_code)
);
```

**Tables to migrate:**
`tipoactsucsif`, `tipoenvfac`, `tipoordenperf`, `tipptoservtao`, `tipovarepi`, `tipoviaaca`, `tipliqsoc`, `tipfacgasrec`, `tipfichtao`, `tipobonifdoc`

### 8.4 Tier 4: Keep as Separate Tables (12 tables)

Complex configuration entities (10+ meaningful columns) should remain as separate tables but inherit from a common `lookup_base`:

`tipocontratcn`, `tiposolaco`, `tipodocumento`, `tipobonif`, `tiporegulf`, `tipomensaj`, `tipovariable`, `tiposumin`, `tipounidad`, `tipoconcep`, `tipoorden`, `tipasiento`

---

## 9. Proposed Unified Lookup Architecture

### 9.1 Core Design

```
lookup_domain (domain catalog)
  |
  +-- lookup_value (all simple lookups)
  |     |
  |     +-- lookup_value_link (many-to-many between lookup values)
  |     |
  |     +-- lookup_value_text (multilingual descriptions)
  |
  +-- lookup_value_audit (change history)
```

### 9.2 Schema Definition

```sql
-- Domain registry
CREATE TABLE lookup_domain (
    domain_code   VARCHAR(50)  PRIMARY KEY,
    domain_name   VARCHAR(200) NOT NULL,
    domain_group  VARCHAR(50),             -- 'BILLING', 'CONTRACT', 'METERING', etc.
    is_system     BOOLEAN      DEFAULT FALSE,
    max_code_len  INTEGER      DEFAULT 10,
    allows_custom BOOLEAN      DEFAULT TRUE,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Unified lookup values
CREATE TABLE lookup_value (
    domain_code   VARCHAR(50)  NOT NULL REFERENCES lookup_domain,
    value_code    VARCHAR(20)  NOT NULL,
    display_order INTEGER      DEFAULT 0,
    is_active     BOOLEAN      DEFAULT TRUE,
    valid_from    DATE,
    valid_to      DATE,
    parent_code   VARCHAR(20),             -- hierarchical lookups
    metadata      JSONB,                   -- flexible extra attributes
    expid         NUMERIC(5,0),            -- exploitation scope (nullable = global)
    created_by    VARCHAR(10),
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_by    VARCHAR(10),
    updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (domain_code, value_code)
);

-- Multilingual text (replaces txtid pattern)
CREATE TABLE lookup_value_text (
    domain_code   VARCHAR(50)  NOT NULL,
    value_code    VARCHAR(20)  NOT NULL,
    language_code CHAR(2)      NOT NULL,
    short_text    VARCHAR(50),
    long_text     VARCHAR(500),
    PRIMARY KEY (domain_code, value_code, language_code),
    FOREIGN KEY (domain_code, value_code) REFERENCES lookup_value
);

-- Value-to-value relationships
CREATE TABLE lookup_value_link (
    link_type     VARCHAR(50)  NOT NULL,
    source_domain VARCHAR(50)  NOT NULL,
    source_code   VARCHAR(20)  NOT NULL,
    target_domain VARCHAR(50)  NOT NULL,
    target_code   VARCHAR(20)  NOT NULL,
    metadata      JSONB,
    PRIMARY KEY (link_type, source_domain, source_code, target_domain, target_code)
);

-- Audit trail
CREATE TABLE lookup_value_audit (
    audit_id      BIGSERIAL    PRIMARY KEY,
    domain_code   VARCHAR(50)  NOT NULL,
    value_code    VARCHAR(20)  NOT NULL,
    action        CHAR(1)      NOT NULL,   -- I/U/D
    old_values    JSONB,
    new_values    JSONB,
    changed_by    VARCHAR(10),
    changed_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
```

### 9.3 Migration Impact

| Metric | Current | Proposed |
|--------|---------|----------|
| Number of lookup tables | ~95 | 5 (core) + 12 (complex config) = 17 |
| DDL maintenance surface | 95 CREATE TABLE statements | 17 |
| ORM entity classes needed | 95 | 17 |
| Generic admin UI possible | No (each table needs custom UI) | Yes (domain-driven generic CRUD) |
| Adding a new lookup type | New table + migration + ORM + UI | INSERT into lookup_domain |
| Multilingual coverage | Partial (some use txtid, some inline) | 100% via lookup_value_text |

---

## 10. Internationalization Readiness Assessment

### 10.1 Current State

The system has **partial** i18n infrastructure:

1. **`tabladesc`** (6 cols): Multi-language table descriptions with `tdidicod` (language code).
2. **`tablatext`** (6 cols): Multi-language text store with `ttidicod`.
3. **`tablas_multiidioma`** (4 cols): Metadata registry of which tables/columns support i18n.
4. **`traduccion`** (7 cols): Direct translation store with `trdidicod`.
5. **`idioma`** (5 cols): Language master table.

### 10.2 Gaps

- **~30% of tipo\* tables bypass the txtid system** and use inline `desc`/`descrip` VARCHAR columns instead, making them non-translatable.
- Tables using inline descriptions: `tipocarta.tcardesc`, `tipoqueja.tquedesc`, `tipoindem.tindesc`, `tipocontra.tctdesc`, `tipfactura.tpfdescri`, `tipoliquidacion.tliqdescri`, `tipoelem.tlmdescrip`, `obsacomet.oacodesc`, `tiporegulf.trgdesc`.
- The `idioma` table supports `idicodigo char(2)` which aligns with ISO 639-1, but the system appears to primarily use only `'es'` (Spanish).
- No evidence of runtime locale switching in the schema design.

### 10.3 Readiness Score: 4/10

The infrastructure exists but is inconsistently applied. A unified lookup system would enforce 100% i18n coverage.

---

## 11. Recommendations

### HIGH Priority

| # | Recommendation | Impact | Effort |
|---|---------------|--------|--------|
| H1 | **Create unified `lookup_value` table** and migrate all 26 pure {id, txtid} lookups | Eliminates 26 tables, enables generic tooling | Medium |
| H2 | **Add NOT NULL and CHECK constraints** on all boolean char(1) columns across lookup tables | Data integrity, prevents silent corruption | Low |
| H3 | **Add foreign key constraints** from transactional tables to lookup tables | Referential integrity currently unverified | Medium |
| H4 | **Standardize audit columns** across all lookup tables (created_at/by, updated_at/by) | Compliance, debugging, change tracking | Medium |
| H5 | **Eliminate single-column tables** (`tipcontmtr`, `tipofacturaext`) | These serve no purpose without descriptions | Low |

### MEDIUM Priority

| # | Recommendation | Impact | Effort |
|---|---------------|--------|--------|
| M1 | **Consolidate estado\* into the tipo\* pattern** (or unified lookup) | Removes artificial naming distinction | Low |
| M2 | **Migrate inline desc columns to txtid pattern** for i18n completeness | Full internationalization readiness | Medium |
| M3 | **Add `snactivo` (active flag)** to all lookup tables lacking it | Soft-delete capability, prevents cascade issues | Low |
| M4 | **Create lookup_value_audit trigger** for all lookup changes | Change tracking, rollback capability | Medium |
| M5 | **Standardize ID column types** to `NUMERIC(5,0)` for all lookup PKs | Consistency, prevents implicit casting | Low |
| M6 | **Build generic lookup admin UI** leveraging the unified table | Eliminates per-table maintenance screens | High |

### LOW Priority

| # | Recommendation | Impact | Effort |
|---|---------------|--------|--------|
| L1 | **Add valid_from/valid_to date ranges** to time-sensitive lookups | Temporal data management | Low |
| L2 | **Create lookup domain groups** for navigation/categorization | UX improvement in admin tools | Low |
| L3 | **Add display_order column** to all lookups for consistent UI ordering | Better user experience | Low |
| L4 | **Document the `variable` table polymorphic pattern** and extend to lookups | Knowledge transfer, consistency | Low |
| L5 | **Resolve `tct*` column prefix collision** between `tipocontra` and `tipocontratcn` | Naming clarity, reduces confusion | Low |

---

## 12. Configuration Layer Health Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Structural Consistency** | 3/10 | 6 different patterns, inconsistent naming, mixed description strategies |
| **Normalization Quality** | 2/10 | Extreme over-normalization (80 tables for ~80 domain values) |
| **Referential Integrity** | 3/10 | No visible FK constraints in schema exports |
| **Audit Trail** | 4/10 | Present in ~50% of tables, but no create vs update distinction |
| **Internationalization** | 4/10 | Infrastructure exists but ~30% of tables bypass it |
| **Maintainability** | 2/10 | Adding a new lookup type requires DDL, ORM, and UI changes |
| **Data Quality Controls** | 3/10 | Missing CHECK constraints, nullable descriptions, no active flags |
| **Documentation** | 2/10 | Column names are cryptic abbreviations with no inline comments |

### **Overall Health Score: 3/10**

The configuration layer is functional -- the system operates in production -- but the architecture creates significant maintenance burden, prevents generic tooling, and leaves data integrity largely to application-layer enforcement. The consolidation opportunity is substantial and low-risk, as lookup tables are the safest category of tables to refactor.

---

## Appendix A: Column Prefix Collision Map

| Prefix | Used By | Conflict |
|--------|---------|----------|
| `tct*` | `tipocontra`, `tipocontratcn` | YES - ambiguous |
| `tps*` | `tipoptosrv`, `tiposervicio`, `tiposobre` | YES - 3-way collision |
| `tpa*` | `tipoatencion`, `tippersautoriz` | YES - ambiguous |
| `tcn*` | `tipocontador`, `tarcontenedor` | YES - cross-domain collision |

## Appendix B: Tables With Most Behavioral Flags

These tables embed the most business logic in their structure, indicating they are configuration entities rather than simple lookups:

1. `tipocontratcn` -- 37 columns, 15+ boolean flags controlling contract workflows
2. `tiposolaco` -- 29 columns, controls connection request processing pipeline
3. `observac` -- 23 columns, controls meter reading behavior and alarm triggers
4. `tipodocumento` -- 22 columns, controls document generation, signing, and archival
5. `tipobonif` -- 21 columns, controls discount eligibility and tariff modification rules

---

*Report generated: 2026-02-16*
*Agent: A7 (db-lookup-config)*
*Source files: chunk_t.md, chunk_efg.md, chunk_ijlmno.md, chunk_uvwxz_other.md*
