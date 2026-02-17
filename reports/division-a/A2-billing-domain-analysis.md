# A2 - Billing Domain Analysis: AquaCIS Water Utility Database

**Analyst:** Agent A2 (db-billing-domain)
**Date:** 2026-02-16
**Schema:** `cf_quere_pro`
**Scope:** Complete billing pipeline from meter reading to invoice generation and accounting integration

---

## Executive Summary

The AquaCIS billing domain implements a full-cycle water utility billing pipeline spanning meter reading ingestion, consumption calculation, tariff application, invoice generation, line-item detail, tax computation, and accounting integration. The architecture follows a **multi-entity billing model** designed for concession-based water utilities (CEA Queretaro), where multiple operating companies (`sociedad`) can emit and own billing under a single database instance.

The core billing flow is anchored by seven primary tables: `facturacio` (billing batch/session), `facturable` (billable consumption record), `factura` (invoice header), `linfactura` (invoice line items), `concepto` (billing concepts/charge types), `tarifa` (rate definitions), `aplictarif` (tariff application rules), and `polcontar` (contract-level tariff overrides). Supporting structures include `tipotarifa` (tariff types), `tipovariable` (parametric variables for rate computation), `fbletarif` (per-facturable tariff snapshot), `impuesto`/`impufact`/`aplicimpues` (tax framework), `lote` (meter reading batches), and `contrato` (the subscriber contract that ties everything together).

**Key Strengths:** The model handles complex multi-tier volumetric pricing, supports both fixed and proportional charges, separates billing concepts from tariff rates cleanly, and provides a robust audit trail through session tracking and history tables. The `facturable` table is an exceptionally well-designed intermediate record that captures all consumption details before pricing.

**Key Weaknesses:** The `contrato` table is severely denormalized (105 columns), the `facturable` table has 59 columns with duplicated validation/non-validation column pairs, there are no explicit foreign key constraints visible in the DDL, text descriptions are indirected through `txtid` numeric references (multi-language pattern) making ad-hoc querying difficult, and the `polcontar` contract-level tariff override pattern creates a parallel pricing path that can diverge from the standard `aplictarif` rules.

**Billing Domain Health Score: 6/10** -- The domain is functionally complete and well-structured at the conceptual level, but suffers from significant denormalization in key tables, lacks visible referential integrity constraints, and has evolved organically to accumulate redundant columns (especially the `val`-suffixed validation columns throughout `facturable` and related tables).

---

## Billing Cycle Flow

The complete billing cycle in AquaCIS proceeds through seven stages:

### Stage 1: Meter Reading Collection (lote -> poldetsum/polhissum)

Meter readings are organized into reading batches (`lote`) tied to geographic zones, periods, and reading schedules. Each lote record references:
- `lotplecexpid` -- the exploitation/operating unit
- `lotpleczonid` -- the geographic zone
- `lotplecanno` / `lotplecperiid` / `lotplecpernum` -- the billing year, period, and period number
- `lottipo` -- batch type (regular, re-read, etc.)
- `lotestado` -- batch state (created, emitted, closed)

Individual meter readings land in `poldetsum` (detailed reading records) with fields for:
- `detpocid` -- links to the service point/contract reading position
- `detesfera` -- meter dial/register number
- `detlectura` -- the actual reading value
- `detconsumo` -- calculated consumption
- `detoriid` -- reading origin code (manual, telemetry, estimated)
- `detobscod` -- observation code from field reader
- `dettipo` -- reading type flag

Historical readings are stored in `polhissum` for audit and trend analysis.

### Stage 2: Billing Batch Creation (facturacio)

A billing run is represented by the `facturacio` table (28 columns). This is the **batch header** that groups all invoices generated in a single billing session:

| Key Column | Purpose |
|-----------|---------|
| `ftoid` | Unique billing batch ID (PK) |
| `ftoorigen` | Origin type of the billing run |
| `ftoopera` | Operation type code |
| `ftomtfcod` | Billing motive code (links to `motfactura`) |
| `ftodesc` | Batch description |
| `ftosesid` | Session ID for audit |
| `ftofeccrea` | Creation date |
| `ftoestado` | Batch state (in progress, completed, archived) |
| `ftofecfact` | Invoice date assigned to all invoices in batch |
| `ftofeciva` | Tax effective date |
| `ftoexpid` | Exploitation/operating unit |
| `ftozonid` | Zone filter (nullable -- can bill all zones) |
| `ftoanno` / `ftoperiid` / `ftopernum` | Billing year, period, period number |
| `ftosnsimula` | Simulation flag ('S'/'N') -- allows dry-run billing |
| `ftofcontab` | Accounting date |
| `ftoviafac` | Invoice delivery channel |
| `ftosnarchiv` | Archived flag |
| `ftomodal` | Billing modality |

The `facturacio` record is the orchestrator: it defines WHAT is being billed (period, zone), WHEN (dates), and HOW (motive, modality). The `ftosnsimula` flag is noteworthy -- it allows complete simulation billing without posting.

### Stage 3: Billable Record Generation (facturable)

For each contract in the billing scope, the system generates a `facturable` record (59 columns). This is the **consumption-to-billing bridge** -- the single most data-rich table in the billing pipeline:

| Key Column | Purpose |
|-----------|---------|
| `fbleid` | Unique facturable ID (PK) |
| `fblepocid` | Reading position/service point ID |
| `fbleftoid` | Links to parent billing batch (`facturacio.ftoid`) |
| `fblefecant` / `fblelecant` | Previous reading date/value |
| `fblefecact` / `fblelecact` | Current reading date/value |
| `fblediaslec` | Days between readings |
| `fbleconsum` | Total consumption (m3) |
| `fbleconsreg` | Regular consumption |
| `fbleconsest` | Estimated consumption |
| `fbleconsrep` | Replacement consumption |
| `fbleconsotr` | Other consumption adjustments |
| `fblecontid` | Meter/counter ID |
| `fblecalib1` / `fblecalib2` | Meter caliber (mm) -- affects fixed charges |
| `fbletsumid` | Type of supply point |
| `fbleexento` | Tax-exempt flag |
| `fbleusocod` | Usage code (residential, commercial, industrial) |
| `fblefperini` / `fblefperfin` | Billing period start/end dates |
| `fblecnttnum` | Contract number |
| `fblesndesha` | Uninhabited flag |
| `fblesnbancario` | Bank direct debit flag |
| `fblesnjubilad` | Pensioner/retired flag (social tariff indicator) |

**Validation columns** (suffixed with `val`): The table contains a parallel set of columns (`fblefecantval`, `fblediaslecval`, `fblelecval`, `fblepocidvalant`, `fbleconsumval`, etc.) that appear to store **validated/corrected** values alongside the original raw values. This is a common pattern in Spanish utility CIS systems where validation can override readings without losing the original data.

### Stage 4: Tariff Application (fbletarif + aplictarif + tarifa + polcontar)

Once the facturable record exists, the system determines which tariffs apply. This involves a multi-level lookup:

**4a. Standard tariff assignment (`aplictarif`)**

The `aplictarif` table (10 columns) defines which tariff rates are in effect for which concepts:

| Key Column | Purpose |
|-----------|---------|
| `aptexpid` | Exploitation/unit |
| `aptcptoid` | Concept ID (links to `concepto`) |
| `apttarid` | Tariff type ID (links to `tipotarifa`) |
| `aptfecapl` | Tariff effective date |
| `aptfecfin` | Tariff end date (nullable = still active) |
| `aptpubid` | Publication/gazette reference |
| `aptaplifecini` | Application start date |

This is a **date-effective** tariff assignment: for a given concept + exploitation, the active tariff is the one where the billing date falls within `aptfecapl` to `aptfecfin`.

**4b. Contract-level tariff overrides (`polcontar`)**

The `polcontar` table (8 columns) allows per-contract tariff overrides:

| Key Column | Purpose |
|-----------|---------|
| `pctexpid` | Exploitation |
| `pctcptoid` | Concept ID |
| `pctttarid` | Tariff type ID |
| `pctcnttnum` | Contract number |
| `pctfecini` / `pctfecfin` | Effective date range |

When a contract has a `polcontar` entry, it overrides the standard `aplictarif` assignment for that concept. This supports special pricing agreements, large-consumer contracts, or social tariffs applied at the individual contract level.

**4c. Per-facturable tariff snapshot (`fbletarif`)**

The `fbletarif` table (20 columns) captures the **actual tariff that was applied** to each facturable record at billing time:

| Key Column | Purpose |
|-----------|---------|
| `fbltfbleid` | Links to `facturable.fbleid` |
| `fbltsocpro` / `fbltsocemi` | Owner/emitter society |
| `fbltcptoid` | Concept |
| `fbltttarid` | Tariff type applied |
| `fbltfecapl` | Tariff effective date used |
| `fbltpctfecini` / `fbltpctfecfin` | Contract tariff period (from `polcontar`) |
| `fbltflecini` / `fbltflecfin` | Reading dates used |
| `fbltdiaslec` | Days for reading-proportional calculation |
| `fbltfctlec` | Proportionality factor (reading days / standard days) |
| `fbltfperini` / `fbltfperfin` | Billing period dates |
| `fbltdiasper` | Period days |
| `fbltfctper` | Period proportionality factor |

This is an excellent design -- it freezes the tariff parameters at billing time, providing full auditability even if tariffs change later.

### Stage 5: Invoice Generation (factura)

The `factura` table (20 columns) is the **invoice header**:

| Key Column | Purpose |
|-----------|---------|
| `facid` | Invoice ID (PK) |
| `facftoid` | Links to billing batch (`facturacio.ftoid`) |
| `facsocemi` | Emitting society |
| `facsocpro` | Owning/property society |
| `facpocid` | Service point / reading position |
| `faccliid` | Client/customer ID |
| `facestado` | Invoice state (issued, paid, cancelled, etc.) |
| `facfecfact` | Invoice date |
| `facnumfac` | Invoice number (char 18 -- formatted string) |
| `facimporte` | Total amount (numeric 18,2) |
| `facimpuest` | Total tax amount |
| `facfecvto` | Due date |
| `facfecprem` | Early payment date (nullable) |
| `facdotmoro` | Delinquency provision level |
| `facclinif` | Customer tax ID (denormalized from client) |
| `facexpid` | Exploitation |
| `facdcfaid` | Document configuration ID |
| `faccnttnum` | Contract number |
| `factipgesd` | Debt management type |
| `facvtoori` | Original due date (before extensions) |

**Key observation:** `facclinif` is a denormalized copy of the customer NIF/tax ID. While this aids reporting, it creates a maintenance risk if customer data changes.

### Stage 6: Invoice Line Items (linfactura)

The `linfactura` table (19 columns) contains individual charge lines:

| Key Column | Purpose |
|-----------|---------|
| `linfacid` | Links to `factura.facid` |
| `linfacnlin` | Line number within invoice |
| `linexpid` | Exploitation |
| `lincptoid` | Concept ID (links to `concepto`) |
| `linttarid` | Tariff type applied |
| `linfecapli` | Tariff effective date |
| `linscptoid` | Sub-concept ID (tier/tramo identifier) |
| `lintralim` | Tier limit (m3 threshold for tiered pricing) |
| `lincaltra` | Tier calculation code |
| `lincalibmm` | Meter caliber (mm) -- for caliber-based fixed charges |
| `linpmvtpvid` | Parameter/variable type for pricing |
| `linunitpvid` | Unit variable type |
| `linfaccant` | Quantity/volume billed (double precision) |
| `linfprefij` | Fixed price/rate (double precision) |
| `linfprepro` | Proportional price/rate (double precision) |
| `linfacimpo` | Line amount (numeric 18,2) |
| `linfacimpu` | Tax rate applied (numeric 5,4) |
| `linimpreg` | Regulatory/regional tax amount |
| `linexeimp` | Tax exempt flag |

**The pricing formula implied is:**
```
linfacimpo = (linfaccant * linfprepro) + linfprefij
```
Where `linfaccant` is the billable quantity (consumption in m3 or units), `linfprepro` is the proportional/variable rate, and `linfprefij` is the fixed component. Each tier of a tiered tariff generates a separate `linfactura` row with its own `linscptoid` and `lintralim`.

### Stage 7: Tax Computation (impufact + aplicimpues)

Tax is applied through:
- `impuesto` -- tax type definitions (IVA/VAT, regional taxes)
- `aplicimpues` -- tax rate application with date-effective validity (`apifecini`/`apifecfin`, `apivalor` as the rate)
- `impufact` -- per-invoice tax breakdown records linking invoice (`ipafacid`), tax type (`ipatipo`), concept (`ipatconid`), and amounts

---

## Table Analysis

### Primary Billing Tables

#### `facturacio` -- Billing Batch/Session
- **Purpose:** Groups all invoices from a single billing run
- **Columns:** 28
- **Key relationships:** Referenced by `factura.facftoid` and `facturable.fbleftoid`
- **Notable:** Contains simulation flag (`ftosnsimula`), archive management (`ftosnarchiv`, `ftofarchiv`), and electronic invoice state (`ftoestadoface`)

#### `facturable` -- Billable Consumption Record
- **Purpose:** Bridge between meter readings and invoicing; captures all billing-relevant data at the time of billing
- **Columns:** 59 (heaviest table in billing domain)
- **Key relationships:** Links to `facturacio` via `fbleftoid`, to contract via `fblecnttnum`, to reading position via `fblepocid`
- **Notable:** Contains dual-column pattern (raw + validated) for consumption, readings, and dates. Contains social/demographic flags (`fblesnjubilad`, `fblesnbancario`) that affect tariff selection

#### `factura` -- Invoice Header
- **Purpose:** Represents a single customer invoice
- **Columns:** 20
- **Key relationships:** Child of `facturacio` via `facftoid`; parent of `linfactura` via `facid`; links to contract via `faccnttnum`, client via `faccliid`
- **Notable:** Denormalized `facclinif` (customer tax ID). Has both `facfecvto` (due date) and `facvtoori` (original due date) suggesting due date modifications

#### `linfactura` -- Invoice Line Items
- **Purpose:** Individual charge lines on an invoice, one per concept/tier
- **Columns:** 19
- **Key relationships:** Child of `factura` via `linfacid`; links to `concepto` via `lincptoid`, to `tipotarifa` via `linttarid`
- **Notable:** Uses `double precision` for prices (`linfprefij`, `linfprepro`) and quantity (`linfaccant`) but `numeric(18,2)` for the resulting amount (`linfacimpo`). This type inconsistency is a precision risk.

#### `concepto` -- Billing Concepts/Charge Types
- **Purpose:** Master catalog of billable concepts (water supply, sewerage, meter rental, fixed charges, etc.)
- **Columns:** 28
- **Key relationships:** Referenced by `linfactura.lincptoid`, `aplictarif.aptcptoid`, `polcontar.pctcptoid`
- **Notable columns:**
  - `cptoorigen` -- concept origin (regular billing, re-billing, etc.)
  - `cptosnfacalt` / `cptosnfacbaj` -- flags for billing on service connection/disconnection
  - `cptosnimptar` / `cptosnimpsub` / `cptosnimpreg` -- flags controlling which tax types apply
  - `cptodevclte` -- flag for customer refund concepts
  - `cptocompdeuda` -- debt composition flag
  - `cptotratam` -- treatment code (how to calculate this concept)
  - `cptotiposub` / `cptosocsub` -- subrogation type/society
  - `cptosnfacunavez` -- one-time charge flag

#### `tarifa` -- Tariff Rate Definitions
- **Purpose:** Master tariff configuration linking concepts to tariff types and pricing formats
- **Columns:** 13
- **Key relationships:** References `concepto` via `tarconceid`, `tipotarifa` via `tartiptid`
- **Notable columns:**
  - `tarfmtcod` -- pricing format code (fixed, tiered, proportional, etc.)
  - `tarvigente` -- active flag
  - `tarsnapliper` -- period-proportional application flag
  - `tarsnadelfto` -- auto-delete from billing batch flag
  - `tarsngesbonif` -- manages bonus/discount flag
  - `tarvarimporte` -- variable amount type
  - `tartiptarsoc` -- social tariff type link

#### `aplictarif` -- Tariff Application Rules
- **Purpose:** Date-effective assignment of tariff types to concepts within exploitations
- **Columns:** 10
- **Key relationships:** Links `concepto` and `tipotarifa` with date ranges, within an exploitation
- **Notable:** Publication reference (`aptpubid`) links to official tariff gazette/approval

#### `polcontar` -- Contract-Level Tariff Overrides
- **Purpose:** Allows individual contracts to override the standard tariff for specific concepts
- **Columns:** 8
- **Key relationships:** Links contract (`pctcnttnum`), concept (`pctcptoid`), tariff type (`pctttarid`) with date range
- **Notable:** Simple but powerful override mechanism. The date range (`pctfecini`/`pctfecfin`) allows temporary special pricing

### Supporting Billing Tables

#### `tipotarifa` -- Tariff Type Catalog
- **Purpose:** Lookup table for tariff type classifications
- **Columns:** 6
- **Key column:** `tiptid` (PK), `tipttxtid` (description via text table), `tiptrcuid` (revenue category), `tipvarid` (linked variable type)

#### `tipovariable` -- Parametric Variable Types
- **Purpose:** Defines variables used in tariff calculations (meter caliber, number of dwellings, usage type, etc.)
- **Columns:** 14
- **Notable:** Contains operation definition (`tpvoperacion`, `tpvoperando1`, `tpvoperando2`) suggesting calculated/derived variables. The `tpvorigen` field indicates where the variable value comes from

#### `fbletarif` -- Facturable Tariff Snapshot
- **Purpose:** Freezes the exact tariff parameters applied to each facturable at billing time
- **Columns:** 20
- **Key relationships:** Links to `facturable` via `fbltfbleid`
- **Notable:** Contains proportionality factors (`fbltfctlec`, `fbltfctper`) for pro-rata calculations

#### `fblevars` -- Facturable Variable Values
- **Purpose:** Stores the actual values of parametric variables for each facturable
- **Columns:** 8
- **Key relationships:** Links to `facturable` via `fblvfbleid`, to `tipovariable` via `fblvtpvid`
- **Notable:** Polymorphic value storage (numeric, char, date, boolean columns)

#### `concimpag` -- Concept-Tariff Tax Assignment
- **Purpose:** Links concepts and tariffs to their applicable tax subconcepts
- **Columns:** 6
- **Key relationships:** Bridges `concepto`, `tipotarifa`, and tax subconcepts

#### `motfactura` -- Billing Motive Catalog
- **Purpose:** Classifies the reason for a billing run (regular billing, re-billing, fraud, etc.)
- **Columns:** 13
- **Notable:** Contains flags for manual billing (`mtfsnmanual`), fraud (`mtfsnfraude`), cancellation (`mtfsnbajas`)

#### `errorfac` -- Billing Error Log
- **Purpose:** Captures errors during billing batch processing
- **Columns:** 4
- **Key relationships:** Links to `facturacio` via `erfftoid`, contract via `erfcnttnum`

#### `linfactxt` -- Invoice Line Text
- **Purpose:** Additional descriptive text for invoice lines (separate from the numeric charge data)
- **Columns:** 3
- **Key relationships:** Links to `factura` via `lftxtfacid`, line via `lftfacnlin`

#### `fbleproforma` -- Pro-forma Facturable Records
- **Purpose:** Links facturable records to grouped/consolidated billing for multi-contract customers
- **Columns:** 3
- **Key relationships:** Links facturable to main contract (`fbprfcnttppal`) with grouping description

#### `contrato` -- Customer Contract
- **Purpose:** The central subscriber record linking customer, service point, billing parameters, and usage classification
- **Columns:** 105 (severely denormalized)
- **Key billing columns:** `cnttusocod` (usage), `cntttipfact` (invoice type), `cnttexenfac` (billing exempt), `cnttrepfac` (re-billing flag), `cnttdiasvto` (payment terms), `cnttumbral` (consumption threshold), `cntttipgesd` (debt management type)

#### `publiconc` -- Tariff Publication/Gazette
- **Purpose:** Records official tariff publications and approval dates
- **Columns:** 8
- **Key relationships:** Referenced by `aplictarif.aptpubid`

#### `agrconcepto` -- Concept Grouping
- **Purpose:** Groups billing concepts for reporting and display
- **Columns:** 3
- **Notable:** `agcconcagua` flag identifies water-specific concept groups

---

## Tariff Structure

### Tariff Architecture

The tariff system uses a four-level hierarchy:

```
tipotarifa (tariff type catalog)
    |
    v
tarifa (tariff definition per concept)
    |
    v
aplictarif (date-effective tariff application rules)
    |
    v
polcontar (per-contract overrides -- optional)
```

### Tariff Types (`tipotarifa`)
- Identified by `tiptid`
- Linked to a revenue category (`tiptrcuid`)
- Can reference a variable type (`tipvarid`) for parametric pricing
- Social tariff types (`tipotarifasocial`) provide a separate catalog for subsidized rates

### Rate Definitions (`tarifa`)
- Each tariff record binds a concept (`tarconceid`) to a tariff type (`tartiptid`)
- The `tarfmtcod` (format code) determines the calculation method:
  - Fixed charges (cuota fija)
  - Tiered/block volumetric charges (tramos)
  - Proportional charges
  - Mixed fixed + variable
- `tarsnapliper` flag indicates whether the charge is prorated by billing period length
- `tarsngesbonif` enables bonus/discount management for the tariff

### Tariff Application (`aplictarif`)
- Maps concept + tariff type to date ranges within an exploitation
- Supports overlapping tariff versions through date-effective logic
- `aptpubid` links to the official gazette publication (`publiconc`) that authorized the rate

### Contract-Level Overrides (`polcontar`)
- Allows individual contracts to use a different tariff type for specific concepts
- Date-bounded (`pctfecini`/`pctfecfin`)
- Priority: `polcontar` overrides `aplictarif` when present for a contract/concept/date combination

### Tariff Variables (`tipovariable` + `fblevars`)
- Variables like meter caliber, number of dwellings, usage category can modify tariff calculations
- `tipovariable` defines the variable metadata (data type, origin, calculation formula)
- `fblevars` stores the actual values at billing time for each facturable
- Supports numeric, character, date, and boolean value types (polymorphic storage)

### Tiered Pricing (Block Tariffs)
- Implemented through multiple `linfactura` rows per concept
- Each tier identified by `linscptoid` (sub-concept) and `lintralim` (volume threshold)
- The `lincaltra` code indicates the tier calculation method
- Tiers are applied sequentially: first N m3 at rate 1, next M m3 at rate 2, etc.

### Pro-Rata Calculations
- The `fbletarif` table stores proportionality factors:
  - `fbltfctlec` = reading days / standard reading cycle days
  - `fbltfctper` = billing period days / standard period days
- These factors scale both fixed and variable charges for partial periods

---

## Invoice Generation

### Invoice Creation Flow

1. **Billing batch** (`facturacio`) is created with scope parameters (zone, period, motive)
2. For each contract in scope:
   a. A `facturable` record is created with consumption data from `poldetsum`/`polhissum`
   b. Applicable tariffs are determined via `aplictarif` + `polcontar` and captured in `fbletarif`
   c. Variable values are captured in `fblevars`
3. For each facturable, a `factura` header is created
4. For each applicable concept/tariff combination:
   a. One or more `linfactura` rows are generated (one per tier for tiered pricing)
   b. The line amount is calculated: `linfacimpo = (linfaccant * linfprepro) + linfprefij`
5. Tax records are created in `impufact`
6. The `factura.facimporte` and `factura.facimpuest` are updated with totals

### Invoice-Facturable Relationship

Each `factura` links to a `facturacio` batch via `facftoid`. The `facturable` also links to the same batch. The connection between a specific `factura` and its `facturable` is through the shared `facftoid` and `facpocid`/`fblecnttnum` (contract number). This indirect linkage (rather than a direct FK from factura to facturable) is a design weakness -- it relies on matching business keys rather than a direct reference.

### Invoice Corrections (`polcorrect`)

The `polcorrect` table (24 columns) handles billing corrections/adjustments:
- Links corrections to a specific invoice batch (`pcorftoid`)
- Contains both fixed and proportional price overrides (`pcorprefij`, `pcorprepro`, `pcorimpfij`, `pcorimppro`)
- Supports partial corrections (`pcorparcial`)
- Flags for zero-consumption corrections (`pcornocons`)
- Tax exemption overrides (`pcorexesub`, `pcorexeimp`)

### Invoice Document Management

- `facturaexml` stores XML representations of electronic invoices
- `condocfact` manages invoice document delivery/distribution
- `errorfac` captures billing errors per batch/contract
- `linfactxt` provides supplementary text for invoice lines
- `expedfact` links invoices to administrative expedients

---

## Accounting Integration

### Accounting Entry Generation

The billing system integrates with accounting through several mechanisms:

#### Accounting Session (`asiento` + `apunte`)
- `asiento` represents an accounting journal entry with type (`asntipo`), date (`asnfecha`), origin (`asnorigen`), and session reference (`asnsesion`)
- `apunte` represents individual debit/credit lines within a journal entry:
  - `apndh` -- debit ('D') or credit ('H') indicator
  - `apncuenta` -- account code
  - `apnimporte` -- amount
  - `apnindiva` / `apnpctjiva` -- VAT indicator and percentage
  - `apnbase` -- tax base amount
  - `apnactcont` -- accounting activity code

#### Account Configuration (`cuentacont` + `socopecuent`)
- `cuentacont` defines accounting accounts with VAT handling rules (`ccindiva`, `ccsniva`, `cccueniva`)
- `socopecuent` maps operation types to accounts per society, enabling different GL mappings for different operating companies

#### Billing-to-Accounting Bridge
- The `facturacio.ftofcontab` (accounting date) determines when the billing batch posts to accounting
- The `tipasiento` table defines journal entry types with debit/credit direction (`tasdh`) and document class (`tasclsdoc`)
- Each billing concept can generate specific accounting entries based on the concept's configuration

#### Financial Reconciliation (`arqueo` + `arqueocomp`)
- `arqueo` provides period-end reconciliation with breakdown by: invoiced, re-invoiced, credited, collected, returned, transferred, amortized, and balance amounts
- `arqueocomp` extends reconciliation with payment plan details, deposits, and surcharges
- Both tables include count columns (e.g., `arqnfactura`, `arqncobrado`) alongside amount columns for cross-validation

#### Annual Liquidation Tables
- `liqanual` and region-specific variants (`liqanubaleares`, `liqanucat`, `liqanugalicia`, etc.) handle annual tax/regulatory settlements
- These suggest the system operates across multiple regulatory jurisdictions

---

## Issues Found

### CRITICAL Issues

1. **No visible foreign key constraints.** None of the table definitions show explicit FK constraints. All referential integrity appears to be enforced at the application level only. This means:
   - Orphaned records can exist (invoices without billing batches, line items without invoices)
   - Cascading deletes/updates are not database-enforced
   - Data integrity depends entirely on application code correctness

2. **Double precision for monetary calculations.** `linfactura.linfprefij`, `linfactura.linfprepro`, and `linfactura.linfaccant` use `double precision` (IEEE 754 floating point), while `linfactura.linfacimpo` uses `numeric(18,2)`. Floating-point arithmetic can introduce rounding errors in financial calculations. This is a known anti-pattern in financial systems.

3. **No direct facturable-to-factura FK.** The relationship between `facturable` and `factura` is indirect (both reference `facturacio.ftoid` and share business keys). This makes it difficult to trace a specific invoice back to its consumption record without complex joins.

### HIGH Severity Issues

4. **`contrato` table has 105 columns.** This table is a classic "God table" anti-pattern. It contains billing parameters, customer contact info, notification preferences, GDPR flags, fraud indicators, and workflow state all in one structure. This makes the table a bottleneck for locking, indexing, and maintenance.

5. **`facturable` dual-column pattern.** The table contains pairs of columns (e.g., `fbleconsum`/`fbleconsumval`, `fbleconsest`/`fbleconsestval`, `fblefecant`/`fblefecantval`) totaling 59 columns. This pattern should be normalized into a separate validation table with a status flag.

6. **Column naming inconsistency.** Column `feblefeccamb` in `facturable` (column 54) breaks the `fble` prefix convention (uses `feble` instead). This suggests a typo that was never corrected, which affects automated code generation and querying.

7. **Missing column sequence.** `contrato` jumps from column 103 to column 105 (no column 104). `expedsif` jumps from 46 to 49. This suggests columns were dropped but ordinal positions were not resequenced, creating confusion in documentation and potentially in data migration.

### MEDIUM Severity Issues

8. **Text indirection everywhere.** Nearly all descriptive text is stored as `txtid` numeric references to a centralized `tabladesc`/`tablatext` system. While this supports multi-language, it makes ad-hoc querying extremely difficult and requires joins for even basic data exploration.

9. **Denormalized customer NIF in `factura`.** `facclinif` duplicates data from the customer/person table. If a customer's tax ID changes (e.g., corporate restructuring), historical invoices could show stale data -- or the denormalized field could be incorrectly updated.

10. **Polymorphic value storage in `fblevars`.** The table uses `fblvvalnum`, `fblvvalchar`, `fblvvalfec`, `fblvvalbool` to store different data types. Only one is populated per row. This EAV (Entity-Attribute-Value) pattern makes type safety impossible at the database level.

11. **`periodo` table is minimal.** With only 2 columns (`perperiid`, `pernumero`), it provides no description, no date range, and no link to the calendar. Period semantics must be entirely application-managed.

12. **Inconsistent precision.** Amounts use `numeric(18,2)` in `factura` and `linfactura` but `numeric(10,2)` in some liquidation tables (`liqanutmtr`). Tax rates use `numeric(5,4)` in `linfactura` but `numeric(5,4)` in `aplicimpues` (consistent, but the precision may be insufficient for some jurisdictions).

### LOW Severity Issues

13. **Audit columns inconsistently named.** Most tables use `hstusu`/`hsthora` for audit, but some use `sesid` for session tracking. The `facturacio` table has both `ftosesid` and `ftofeccrea` but no `hstusu`/`hsthora` pair.

14. **Boolean flags as `character(1)`.** All boolean flags use `character(1)` with 'S'/'N' values rather than PostgreSQL's native `boolean` type. While this is a common pattern in legacy Spanish enterprise software, it wastes storage and prevents native boolean indexing.

15. **`errorfac` has minimal structure.** With only 4 columns and a VARCHAR(500) text field, it provides no error categorization, severity levels, or structured error codes.

---

## Recommendations

### HIGH Priority

| # | Recommendation | Rationale |
|---|---------------|-----------|
| H1 | **Add foreign key constraints** on all billing tables, at minimum: `factura.facftoid -> facturacio.ftoid`, `linfactura.linfacid -> factura.facid`, `facturable.fbleftoid -> facturacio.ftoid`, `aplictarif -> concepto`, `aplictarif -> tipotarifa` | Prevents orphaned records and enables database-level referential integrity. Can be added as `NOT VALID` initially to avoid blocking existing data. |
| H2 | **Replace `double precision` with `numeric`** in `linfactura` for `linfprefij`, `linfprepro`, and `linfaccant` | Eliminates floating-point rounding errors in financial calculations. Use `numeric(18,6)` for rates and `numeric(18,3)` for quantities. |
| H3 | **Add a direct FK from `factura` to `facturable`** (e.g., `facfbleid -> facturable.fbleid`) | Enables direct traceability from invoice to consumption record without relying on business key matching. |
| H4 | **Decompose `contrato` (105 columns)** into: `contrato_core` (identity, state), `contrato_billing` (billing params), `contrato_notification` (contact prefs), `contrato_compliance` (GDPR, fraud flags) | Reduces lock contention, improves maintainability, enables independent evolution of each concern. |

### MEDIUM Priority

| # | Recommendation | Rationale |
|---|---------------|-----------|
| M1 | **Normalize `facturable` validation columns** into a `facturable_validacion` table with columns: `fbleid`, `field_name`, `original_value`, `validated_value`, `validation_date` | Reduces facturable from 59 to ~35 columns, eliminates column naming duplication, makes validation history queryable. |
| M2 | **Enrich `periodo` table** with `fecini`, `fecfin`, `descripcion`, `anualidad`, `tipo_periodo` columns | Enables date-range queries against periods, reduces application-level period logic, supports reporting. |
| M3 | **Create structured error table** to replace `errorfac` with: error code, severity, category, concept reference, suggested resolution | Enables automated error triage, trending, and monitoring dashboards. |
| M4 | **Fix column naming inconsistencies** (`feblefeccamb` -> `fblefeccamb`) and document missing ordinals | Prevents bugs in code generators and ORM mappings. |

### LOW Priority

| # | Recommendation | Rationale |
|---|---------------|-----------|
| L1 | **Migrate boolean flags from `character(1)` to native `boolean`** | Better PostgreSQL integration, smaller storage, native index support. Requires application-layer changes. |
| L2 | **Create billing concept description views** that pre-join `txtid` references | Simplifies ad-hoc querying and reporting without changing the multi-language architecture. |
| L3 | **Standardize audit columns** across all billing tables to a consistent pattern (`created_by`, `created_at`, `modified_by`, `modified_at`, `session_id`) | Enables uniform audit queries and compliance reporting. |
| L4 | **Add CHECK constraints** for state columns (`facestado`, `ftoestado`, `lotestado`) and flag columns | Prevents invalid states at database level. |

---

## Billing Domain Health Score: 6/10

### Justification

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Completeness** | 8/10 | Full billing lifecycle is modeled: readings -> consumption -> tariffs -> invoices -> line items -> taxes -> accounting. Corrections, simulations, and multi-entity billing are all supported. |
| **Normalization** | 4/10 | `contrato` (105 cols) and `facturable` (59 cols) are severely denormalized. Dual raw/validated column pattern adds unnecessary width. However, the core concept/tariff/line-item structure is well-normalized. |
| **Referential Integrity** | 2/10 | No visible FK constraints anywhere. All integrity is application-enforced, creating significant risk of data inconsistency. |
| **Data Type Correctness** | 5/10 | Mixed use of `double precision` and `numeric` for financial data is a critical flaw. Boolean-as-char is wasteful. Text indirection adds complexity. |
| **Auditability** | 7/10 | The `fbletarif` snapshot pattern is excellent. Session tracking (`sesid`, `hstusu`, `hsthora`) is widespread. `polhissum` maintains reading history. The simulation flag on `facturacio` is well-designed. |
| **Extensibility** | 7/10 | The `tipovariable`/`fblevars` system allows parametric tariff extensions without schema changes. The concept/tariff separation supports new charge types. The multi-society model supports organizational changes. |
| **Maintainability** | 5/10 | Cryptic 3-character column prefixes (inherited from Spanish CIS convention) make tables hard to read. Missing ordinals and naming inconsistencies create confusion. The text indirection system adds join complexity to every query. |

**Overall: 6/10** -- The billing domain is functionally rich and architecturally sound at the conceptual level, but implementation-level issues (missing constraints, type inconsistencies, denormalization) create real operational risks. The most urgent improvements are adding FK constraints, fixing monetary data types, and decomposing the largest tables.

---

## Appendix: Table Inventory

| Table | Columns | Role in Billing |
|-------|---------|----------------|
| `facturacio` | 28 | Billing batch/session |
| `facturable` | 59 | Billable consumption record |
| `factura` | 20 | Invoice header |
| `linfactura` | 19 | Invoice line items |
| `concepto` | 28 | Billing concept catalog |
| `tarifa` | 13 | Tariff rate definitions |
| `aplictarif` | 10 | Tariff application rules |
| `polcontar` | 8 | Contract tariff overrides |
| `tipotarifa` | 6 | Tariff type catalog |
| `tipovariable` | 14 | Parametric variable definitions |
| `fbletarif` | 20 | Per-facturable tariff snapshot |
| `fblevars` | 8 | Per-facturable variable values |
| `fbleproforma` | 3 | Pro-forma grouping |
| `linfactxt` | 3 | Invoice line text |
| `impuesto` | 3 | Tax type definitions |
| `impufact` | 8 | Per-invoice tax records |
| `aplicimpues` | 9 | Tax rate application rules |
| `concimpag` | 6 | Concept-tariff tax mapping |
| `motfactura` | 13 | Billing motive catalog |
| `errorfac` | 4 | Billing error log |
| `polcorrect` | 24 | Billing corrections |
| `contrato` | 105 | Customer contract (anchor entity) |
| `lote` | 26 | Meter reading batches |
| `poldetsum` | 30 | Detailed meter readings |
| `polhissum` | 33 | Historical meter readings |
| `periodo` | 2 | Billing period reference |
| `publiconc` | 8 | Tariff publication records |
| `sociedad` | 84 | Operating company/society |
| `asiento` | 13 | Accounting journal entries |
| `apunte` | 25 | Journal entry lines |
| `cuentacont` | 22 | Accounting accounts |
| `arqueo` | 30 | Financial reconciliation |
| `agrconcepto` | 3 | Concept grouping |
| `facturaexml` | 3 | Electronic invoice XML |
| `facturadorext` | 2 | External billing system reference |
| `tipocontra` | 19 | Contract type catalog (legacy) |
| `tipocontratcn` | 32 | Contract type catalog (new) |

**Total billing domain tables analyzed: 37**
**Total columns across billing domain: ~750+**
