# Database Audit: cf_quere_pro (CEA Queretaro Water Utility)

> **Generated**: 2026-02-11
> **Host**: aquacis-cf-bdr.ceaqueretaro.gob.mx
> **Database**: cf_quere_pro
> **Source**: `/db_mapping/` (DATABASE_MAP.md + 8 chunk files)

## Context

The PostgreSQL database `cf_quere_pro` powers the AQUASIS commercial water management system for CEA Queretaro. It currently has **4,114 total tables** (1,970 unique + 2,144 tmp_deuda copies) across 3 schemas (`cf_quere_pro`, `aux_migracion`, `public`). This audit identifies unnecessary tables, ranks the most important ones, and proposes a consolidation roadmap.

---

## Part 1: MOST IMPORTANT TABLES (Tiered Ranking)

### TIER 1 -- CRITICAL (System stops without these)

| # | Table | Cols | Purpose |
|---|-------|------|---------|
| 1 | **explotacion** | 350 | Configuration master for the entire system. Every table references `expid`. Contains all billing rules, thresholds, integration settings. |
| 2 | **contrato** | 105 | Central hub -- service agreement between customer and utility. Every billing, payment, reading, and work order references a contract. |
| 3 | **persona** | 37 | Universal identity master for individuals and legal entities. Customers, employees, contractors are all personas. |
| 4 | **ptoserv** | 55 | Physical service point -- the location where water is delivered. Links infrastructure to the commercial system. |
| 5 | **factura** | 20 | Invoice header. Every monetary transaction starts here. Required for CFDI (Mexican electronic invoicing). |
| 6 | **facturable** | 59 | Invoice detail/consumption record. Line-by-line billing breakdown with meter readings and tariff calculations. |
| 7 | **cliente** | 22 | Customer commercial profile. Links persona to web access, fiscal centers, CFDI preferences. |
| 8 | **direccion** | 23 | Universal address table. Every physical location (service points, persons, offices) references this. |
| 9 | **sociedad** | 77 | Legal/commercial entity config. Defines who issues bills, manages contracts, handles collections. |

### TIER 2 -- ESSENTIAL (Major functionality breaks)

| # | Table | Cols | Purpose |
|---|-------|------|---------|
| 10 | **facturacio** | 28 | Billing batch controller. Orchestrates billing runs producing thousands of invoices. |
| 11 | **opecargest** | 24 | Payment operation master. Records every cash/bank/transfer payment. |
| 12 | **opedesglos** | 27 | Payment breakdown detail. Maps payments to specific invoices. |
| 13 | **gescartera** | 18 | Collection batch manager. Groups payment operations for reconciliation. |
| 14 | **contador** | 30 | Water meter master. Meter calibration, serial numbers, installation data. |
| 15 | **poldetsum** | 30 | Meter reading detail. Current/previous readings, consumption, observation codes. |
| 16 | **polcontar** | 8 | Contract-tariff assignment. Defines what concepts/tariffs apply to each contract. |
| 17 | **servicio** | 43 | Physical service connection record. Links pipes to service points and meters. |
| 18 | **acometida** | 35 | Physical water connection pipe from network to service point. Infrastructure data. |
| 19 | **orden** | 44 | Work order system. All field activities (installations, repairs, cutoffs). |
| 20 | **concepto** | 28 | Billing concept definitions (water, sewerage, meter rental, fixed fees). |
| 21 | **movccontrato** | 17 | Contract financial ledger. Every charge, payment, and adjustment. |
| 22 | **referencia** | 23 | Payment reference numbers for bank/OXXO payments (primary payment channel in Mexico). |
| 23 | **linfactura** | 19 | Invoice line items with tariff-resolved amounts. |
| 24 | **sesion** | 4 | Audit trail anchor. Referenced by every transactional process. |
| 25 | **gestreclam** | 22 | Claims/reclamation management. Customer disputes and regulatory compliance. |

### TIER 3 -- IMPORTANT (Features degrade)

| # | Table | Cols | Purpose |
|---|-------|------|---------|
| 26 | **tarifa** | 13 | Rate schedule structure. Determines pricing per consumption unit. |
| 27 | **zona** | 11 | Geographic/operational zones. Organizes reading routes and billing cycles. |
| 28 | **usuario** | 19 | System users. Authentication and audit trail identification. |
| 29 | **oficina** | 21 | Branch offices. Multi-location reporting and access control. |
| 30 | **lote** | 26 | Reading/billing lots. Organizes meter reading campaigns by zone. |
| 31 | **impufact** | 8 | Tax line items. Required for CFDI compliance. |
| 32 | **expedsif** | 64 | Fraud investigation system. Revenue recovery from illegal connections. |
| 33 | **personadir** | 13 | Person-address pivot. Multiple addresses per person. |
| 34 | **contratodeuda** | 11 | Contract debt tracking. Collection priority management. |
| 35 | **observac** | 23 | Meter reading anomaly codes. Controls exception handling. |
| 36 | **aplictarif** | 10 | Historical tariff application records. Retrospective billing. |
| 37 | **equipo** | 21 | Smart meter/AMR equipment. Remote reading management. |
| 38 | **variable** | 13 | Dynamic contract data. Custom fields and variable-based tariff calculations. |

### TIER 4 -- SUPPORTING (Nice to have)

Lookup tables and reference data: `tipoconcep`, `tipcliente`, `tipfactura`, `tipoorden`, `perfil`, `permisos`, `localidad`, `nomcalle`, `banco`, `formapago`, `impuesto`, `periodic`, `periodo`, `padron`, `tipobonif`, `comcarta`, `comdeudor`, `gestcobro`, `fianza`, `calibre`, `usoserv`.

### TIER 5 -- PERIPHERAL (Could survive without)

Accounting integration (`asiento`, `apunte`, `arqueo`), denormalized report tables (`infocobro`, `infolecturas`), image storage (`imagen`), version tracking (`version`), organizational lookups (`departamen`, `barrio`).

---

## Part 2: UNNECESSARY TABLES (Candidates for Removal)

### Category A: Table-Per-Value Anti-Pattern (~2,643 tables)

The single biggest problem. The application creates a new physical table per process/session instead of inserting rows into a shared table.

| Pattern | Count | Columns | Action |
|---------|-------|---------|--------|
| `tmp_deuda_XXXXXXX` | 2,144 | 4 (importe, numfacturas, facsocemi, faccnttnum) | **DROP ALL**, replace with 1 table + proceso_id |
| `aux_varscreditored_XXXXXXX` | ~477 | 3 (cnttnum, impvariable, impvaranterior) | **DROP ALL**, replace with 1 table + proceso_id |
| `tmpbb_XXXXXXX` | 22 | 14 (mirrors bajabonificacion) | **DROP ALL**, replace with 1 table + proceso_id |

**Risk: LOW** -- Transient work tables. No persistent business logic depends on physical names.

### Category B: Persistent Staging/Temp Tables (~14 tables)

| Table | Cols | Action | Risk |
|-------|------|--------|------|
| tmpcntt | 7 | DROP | LOW |
| tmpcrr | 18 | DROP | LOW |
| tmpfac | 20 | DROP | LOW |
| tmpimpufact | 8 | DROP | LOW |
| tmplin | 19 | DROP | LOW |
| tmplinprecsubcon | 12 | DROP | LOW |
| tmpgeo | 7 | DROP | LOW |
| tmpmejdiaremcal | 3 | DROP | LOW |
| tmpses | 9 | DROP (verify no active sessions) | MED |
| tmpsesevtcliente | 11 | DROP | MED |
| tmpsesmonproccanc | - | DROP | MED |
| tmp_gestordocumental | 11 | DROP (verify no pending docs) | MED |
| contratos_aplicacion_anticipo_masivo_tmp | - | DROP | LOW |
| tablastmp | 6 | DROP (after all other tmp cleanup) | LOW |

### Category C: Backup/Migration Artifacts (~4 tables)

| Table | Action | Risk |
|-------|--------|------|
| zz_backupexpedsif | ARCHIVE then DROP | LOW |
| zz_backuphisexpedsif | ARCHIVE then DROP | LOW |
| aux_migracion.apunte_maria | DROP (one-time migration artifact) | LOW |
| imagenmigradas | DROP (migration tracking) | LOW |

### Category D: Region-Specific Tables Irrelevant to Mexico (~25+ tables)

Spanish autonomous community tables unused in Queretaro:

- `liqanubaleares`, `liqanugalicia`, `liqanumurcia`
- `liqcobbalear`, `liqcobgalicia`, `liqcobmurcia`, `liqcobcat`
- `liqcobpobbalear`, `liqdetanubalear`, `liqdetanugalic`, `liqdetpobbalear`
- `liqdsimurcia`, `liqcuadmurcia`
- `liqcieanucat`, `liqcieabocat`, `liqbloqcat`, `liqcobpostcat`, `liqdetvolcat`
- `liqaacfacgali`, `liqdatfacgali`, `liqcarfacgali`, `liqdetfacgali`
- `liqautocuadgali`, `liqautocuadcanta`, `liqautocuadextr`
- `varbonifpvasco`

**Risk: HIGH** -- Must verify with Aqualia ERP whether required by the framework.

### Category E: Per-Municipality Duplicate Views (13 --> 1)

13 identical 50-column `vw_gis_pad_usu_*_new` tables (one per municipality):
amealco, cadereyta, colon, corregidora, ezequiel_montes, huimilpan, jalpan, marques, pedro_escobedo, pinal, queretaro, santa_rosa, tequisquiapan.

**Action**: Merge into 1 table with `municipio` column.

### Category F: GIS Cache/Materialized Views (~25 tables)

`vgis_*` and `vgiss_*` tables caching data regenerable from source tables:
vgis_abonadosacometida, vgis_aboncierre, vgis_acometidas, vgis_acometidas2, vgis_acometidas_calle, vgis_acometidas_tecnica, vgis_callejero, vgis_callespoblacion, vgis_consumoabonado, vgis_consumoacometida, vgis_consumopunto, vgis_nomcalle, vgis_ptoservacometida, vgis_servacometida, vgiss_abonados, vgiss_acometidas, vgiss_calles, vgiss_cartasenv, vgiss_consumfact, vgiss_consumreg, vgiss_explotacion, vgiss_faccobrada, vgiss_lectuacom, vgiss_tpconcepto, vw_gis_sectorizacion.

**Action**: Replace with proper PostgreSQL materialized views with refresh schedules.

### Category G: Merge Candidates (~8 tables)

| Tables to Merge | Into | Savings |
|-----------------|------|---------|
| bitacora_beneficio_350 + bitacora_beneficio_500 | bitacora_beneficio + tipo column | -1 |
| camemitido + cameqemitido | cambio_emitido + tipo column | -1 |
| bolsacambi* + bolsacambioequipo* (4 tables) | single table + tipo | -2 |
| ingresoscfdi + ingresoscfdi2 | single table | -1 |
| cnae + cnae_resp | single table | -1 |
| vw_gis_inspecciones_old | DROP (replaced by current version) | -1 |

### Category H: Legacy/Placeholder Tables (~6 tables)

| Table | Issue | Action |
|-------|-------|--------|
| aboftoint | 1 column, no clear purpose | DROP |
| en_ejecucion | 1 column process lock | Replace with app-level locking |
| tipcontmtr | 1 column, incomplete | DROP |
| t074 | SAP-style legacy naming | ARCHIVE then DROP |
| tbsl | SAP-style legacy naming | ARCHIVE then DROP |
| xra_contadores | Import staging artifact | ARCHIVE then DROP |

---

## Part 3: STRUCTURAL PROBLEMS

### Problem 1: History Table Explosion (230 his* tables)

Every operational table has a `his*` counterpart. ~80 of these are for simple lookup tables that rarely change (e.g., `histipobonif`, `histipocsc`, `histipomensaj`).

**Recommendation**: Replace his* tables for lookup/reference tables with a generic `audit_log` table using JSONB. Keep dedicated his* tables only for high-volume entities (contrato, factura, ptoserv, persona, sociedad, explotacion). **Potential savings: 100-180 tables**.

### Problem 2: Lookup Table Proliferation (65 tipo* tables)

35-40 simple (id + text_id) lookup tables could be consolidated into a generic `domain_value` table. Keep specialized tipo* tables with 5+ functional columns.

### Problem 3: Report Temp Tables (tmtr* family, ~9 tables)

tmtranufac, tmtranupad, tmtranureg, tmtrautocuad, tmtrdetcob, tmtrdetfac, tmtrmtot, tmtrmtotpob, tmtrsocliqrec -- all regenerable report staging.

### Problem 4: CFDI Staging Tables (~3 tables)

ingresoscfdi_SAT, ingresoscfdi_detecno, ingresosDepInterno -- import staging that should use proper ETL patterns.

---

## Part 4: SUMMARY SCORECARD

| Category | Current | Removable | After Cleanup |
|----------|---------|-----------|---------------|
| Table-per-value (tmp_deuda, aux_vars, tmpbb) | 2,643 | **2,640** | 3 |
| Persistent temp/staging | ~14 | ~14 | 0 |
| Backup/migration artifacts | ~4 | ~4 | 0 |
| Spain-specific regional tables | ~25 | ~25 | 0 |
| Per-municipality duplicates | 13 | 12 | 1 |
| GIS cache tables | ~25 | ~25 | 0 (views) |
| Merge candidates | ~8 | ~7 | ~4 |
| Legacy/placeholder | ~6 | ~6 | 0 |
| History tables (his*) | 230 | ~100-180 | 50-130 |
| Simple lookup tables | ~40 | ~35-40 | 1 (domain_value) |
| Report temp (tmtr*) | ~9 | ~9 | 0 |
| CFDI staging | ~3 | ~3 | 0 |
| **TOTAL REMOVABLE** | | **~2,880-2,960** | |
| **Remaining tables** | 4,114 | | **~1,150-1,230** |

With aggressive his* and tipo* consolidation, the database could reach **~300-400 tables** (90-92% reduction).

---

## Part 5: EXECUTION PHASES

| Phase | Risk | Tables Eliminated | Script |
|-------|------|-------------------|--------|
| 1 - Drop transient tables | LOW | ~2,650 | `phase1_drop_transient_tables.sql` |
| 2 - Consolidate views & merges | LOW-MED | ~50 | `phase2_consolidate_and_merge.sql` |
| 3 - Domain value consolidation | MEDIUM | ~40 | `phase3_domain_value_consolidation.sql` |
| 4 - Audit log for history tables | MED-HIGH | ~100-180 | `phase4_audit_log_history.sql` |
| 5 - Spain regional evaluation | HIGH | ~25 | `phase5_spain_regional_evaluation.sql` |

See individual SQL scripts in `db_audit/` for executable code.
See `verification_queries.sql` for pre/post-cleanup validation.
See `pre_cleanup_inventory.sql` for baseline snapshot.

---

## Verification Checklist

1. Cross-reference chunk files in `db_mapping/` against recommendations
2. Run `SELECT count(*) FROM information_schema.tables WHERE table_schema = 'cf_quere_pro'` to confirm current table count
3. For each tmp_deuda/aux_varscreditored table, verify empty or stale: `SELECT count(*) FROM tmp_deuda_1779865`
4. Before dropping any table, verify zero FK references: `SELECT * FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_name = '<target>'`
5. Check application source code for hardcoded table name references
