# A3 - Customer Domain Analysis: AquaCIS Water Utility Database

**Analyst:** Agent A3 (db-customer-domain)
**Date:** 2026-02-16
**Scope:** Customer lifecycle tables -- persona, cliente, contrato, direccion, sociedad and related entities
**Database:** PostgreSQL schema `cf_quere_pro` (CEA Queretaro)

---

## Executive Summary

The AquaCIS customer domain implements a **four-tier entity model**: `persona` (person) -> `cliente` (client account) -> `contrato` (contract/service agreement) -> `ptoserv` (supply point), with `direccion` (address) serving as a shared reference entity and `sociedad` (organization/company) representing the operating utility entity.

This is a **Spanish-origin CIS product** (likely Aqualia/FCC Aqualia lineage) adapted for Mexican water utility operations at CEA Queretaro. The architecture separates identity (persona) from billing role (cliente) from service agreement (contrato), which is conceptually sound for water utility operations but introduces significant complexity.

Key findings:
- The persona-cliente separation enables multi-role support (a person can be payer, holder, owner) but relies on fragile numeric foreign keys without proper referential integrity documentation
- The contract table (`contrato`) is **massively wide at 105 columns**, mixing lifecycle state, billing preferences, GDPR flags, notification settings, and fiscal configuration into a single flat structure
- Address normalization is **partially implemented** -- structured fields exist alongside free-text fallbacks (`dirtexto`, `dircaltxt`)
- Contact information is **scattered across at least 5 locations**: `persona.prstelef*`, `personatel`, `personadir.pdtelefono`, `contrato.cnttnotifmovil`, and `webcliente`
- GDPR compliance has been bolted on via `rgpd_*` shadow tables and anonymization flags, indicating post-hoc regulatory adaptation
- The system lacks a dedicated email entity, modern customer communication preferences, and a unified interaction history

**Customer Domain Health Score: 5/10**

The data model is functionally complete for core water utility billing but shows significant accumulated technical debt, denormalization, and missing modern CRM capabilities.

---

## Entity Relationship Analysis

### Core Entity Chain

```
sociedad (utility org)
    |
    v
persona (identity) ---> personadir (person-address link) ---> direccion (address)
    |                                                              ^
    v                                                              |
cliente (billing account) ---> contrato (service contract) ---> ptoserv (supply point)
                                   |                               |
                                   +--- contratoprod (products)    +--- acometida (connection)
                                   +--- contratodeuda (debt)       |
                                   +--- movccontrato (movements)   +--- direccion (address)
                                   +--- contratoweb (web access)
```

### Key Relationships (FK Patterns)

| Parent | Child | FK Column(s) | Relationship |
|--------|-------|-------------|-------------|
| `persona` | `cliente` | `cliid` = `prsid` | 1:1 (shared PK -- cliente IS a persona) |
| `cliente` | `contrato` | `cnttcliid` -> `cliid` | 1:N (one client, many contracts) |
| `persona` | `contrato.cnttfprsid` | billing person | N:1 (invoice-to person) |
| `persona` | `contrato.cnttcprsid` | correspondence person | N:1 (mail-to person) |
| `persona` | `contrato.cntttpropid` | owner person | N:1 (property owner) |
| `persona` | `contrato.cnttinquid` | tenant person | N:1 (tenant/occupant) |
| `ptoserv` | `contrato` | `cnttptosid` -> `ptosid` | N:1 (supply point serves contracts) |
| `direccion` | `ptoserv` | `ptosdirid` -> `dirid` | N:1 (address for supply point) |
| `persona` | `personadir` | `pdprsid` -> `prsid` | 1:N (person has many addresses) |
| `direccion` | `personadir` | `pddirid` -> `dirid` | N:1 (address reference) |
| `persona` | `sociedad` | `socprsid` -> `prsid` | 1:1 (org IS a persona) |
| `persona` | `personatel` | `prtlprsid` -> `prsid` | 1:N (phone numbers) |

### Critical Design Pattern: Shared Primary Key

The `cliente.cliid` and `persona.prsid` appear to share the same identifier space -- a client IS a person with additional billing attributes. This is confirmed by the `sociedad.socprsid` pattern where an organization is also a persona. This "table-per-subtype" inheritance pattern means:

- Every `cliente` row has a corresponding `persona` row with the same ID
- Every `sociedad` row has a corresponding `persona` row with the same ID
- The `persona` table is the **identity root** for all actors in the system

---

## Person Model (persona)

### Structure Analysis

**Table:** `persona` -- 37 columns

| Category | Columns | Notes |
|----------|---------|-------|
| **Identity** | `prsid`, `prsnif`, `prsnifnum`, `prscodextran` | NIF = tax ID (RFC in Mexico); `prsnifnum` is numeric extraction for search |
| **Name** | `prsnombre`, `prspriapel`, `prssegapel`, `prsnomcpto` | First name + two surnames (Spanish naming); `prsnomcpto` = computed full name (203 chars) |
| **Contact (inline)** | `prstelef`, `prstelef2`, `prstelef3`, `prstelef4`, `prsfax` | 5 phone slots directly on persona -- denormalized |
| **Demographics** | `prsfecnac`, `prsjubilad`, `prsjuridic`, `prspaiscodigo` | Birth date, retired flag, legal-entity flag, country |
| **Web access** | `prspassweb` | Plaintext password (10 chars max) -- **CRITICAL SECURITY ISSUE** |
| **Fiscal** | `prstxtdirfisc` | Free-text fiscal address (150 chars) -- not linked to `direccion` |
| **GDPR** | `prsrgpdanonim`, `prsbloqrgpd` | Anonymization and blocking flags |
| **Phone review** | `prsfecrevfijo`, `prsinteraccionfijo`, `prsfecrevmovil`, `prsinteraccionmovil` | Landline/mobile review tracking |
| **Audit** | `prshstusu`, `prshsthora`, `prsfeccrea`, `prsofiid` | Last modifier, timestamp, creation date, office |
| **Classification** | `prsrcuid`, `prsupd`, `prsidicodigo` | Unknown code, update flag, language code |
| **Portal flags** | `prsfiporcli`, `prsmvporcli` | Landline/mobile provided by client flags |
| **Manager** | `prsgestor` | Account manager name (free text, 120 chars) |

### Identification Patterns

1. **Primary ID:** `prsid` (numeric 10-digit) -- system-generated surrogate key
2. **Tax ID:** `prsnif` (varchar 15) -- stores RFC (Registro Federal de Contribuyentes) in Mexico context
3. **Numeric tax ID:** `prsnifnum` (numeric 15) -- numeric extraction for fast lookups
4. **Foreign citizen ID:** `prscodextran` (varchar 12) -- for non-national identification
5. **No email as identifier** -- email is not stored on the persona table at all

### Deduplication Capability

**Weak.** The system relies on:
- `prsnif` for tax-ID-based matching (nullable, so not universally available)
- Name fields for fuzzy matching (no standardization columns)
- `prsnifnum` suggests a numeric duplicate check was added later
- `rgpd_persona` table has `prsid` -> `prsid_new` mapping, indicating a persona merge/dedup mechanism exists for GDPR compliance but was retrofitted

### Satellite Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `personadir` | Person-address links (M:N) | `pdprsid`, `pdnumdir`, `pddirid`, `pddirdefec` (default flag) |
| `personatel` | Extended phone numbers | `prtlprsid`, `prtltelefono`, `prtlprefijo`, `prtlautorizado` |
| `personacnae` | Economic activity codes | `pcnprsid`, `pcncnaecod` (CNAE = industry classification) |
| `personaiae` | Tax activity codes | `piaeprsid`, `piaesec`, `piaeepi` |
| `hispersona` | History/audit trail | Full snapshot of persona at change time |
| `hispersonadir` | Address link history | Denormalized with computed text fields |
| `hispersonatel` | Phone history | Tracks modifications to phone records |
| `vpersona` | View (read-only) | Simplified persona view for reporting |

### Contact Information Storage Pattern

Contact data is fragmented across multiple locations:

```
persona.prstelef        -- phone 1 (inline)
persona.prstelef2       -- phone 2 (inline)
persona.prstelef3       -- phone 3 (inline)
persona.prstelef4       -- phone 4 (inline)
persona.prsfax          -- fax (inline)
personatel.prtltelefono -- extended phone list (normalized, with prefix)
personadir.pdtelefono   -- phone at a specific address
contrato.cnttnotifmovil -- mobile for contract notifications
webcliente.webemail     -- email for web portal
```

**No unified email entity exists.** Email addresses appear only in:
- `webcliente.webemail` (portal registration)
- `hiscomemail.hiscmeemail` (communication history)
- `sociedad.socemailremi` / `socremiemailaddress` (sender addresses for the organization)
- Various notification address references on `contrato`

---

## Contract Model (contrato)

### Structure Overview

**Table:** `contrato` -- 105 columns (one of the widest tables in the system)

This is the **central operational entity** of the CIS. A contract represents a water/sewer service agreement between a client and the utility at a specific supply point.

### Key Attributes by Category

| Category | Columns | Description |
|----------|---------|-------------|
| **Identity** | `cnttnum`, `cnttexpid` | Contract number + exploitation/branch ID (composite key) |
| **Linkages** | `cnttcliid`, `cnttptosid` | Client ID, supply point ID |
| **Contract type** | `cntttctcod`, `cnttsnformal` | Type code, formal/informal flag |
| **State** | `cnttestado`, `cnttfcaduci` | Status code, expiration date |
| **Billing person** | `cnttfprsid`, `cnttfnumdir` | Invoice-to person ID + address number |
| **Correspondence** | `cnttcprsid`, `cnttcnumdir` | Mail-to person ID + address number |
| **Owner/Tenant** | `cntttpropid`, `cnttinquid`, `cnttproinq` | Property owner, tenant, owner-or-tenant flag |
| **Usage** | `cnttusocod`, `cnttactivid`, `cnttcateid` | Use code, activity, category |
| **Billing config** | `cntttipfact`, `cnttnumcopias`, `cnttexenfac`, `cnttrepfac`, `cntttipenvfact` | Invoice type, copies, exemption, reprint, delivery method |
| **Debt mgmt** | `cnttscobid`, `cntttipgesd`, `cnttdiasvto`, `cnttdiaslimpago`, `cnttsaldobloq` | Collection set, debt type, due days, grace period, blocked balance |
| **Notifications** | `cnttsnnotifmail`, `cnttsnnotifsms`, `cnttsnnotifpush`, `cnttnotifmovil`, `cnttnotifprsid1/2`, `cnttnotifnumdir1/2` | Multi-channel notification preferences (mail, SMS, push) |
| **Fraud** | `cnttsnfraude`, `cnttsnlisrob` | Fraud flag, theft list flag |
| **Fiscal (CFDI)** | `cnttcpagador`, `cnttcreceptor`, `cnttcfiscal`, `cnttccomprador` | Mexican CFDI invoice roles |
| **GDPR** | `cnttrgpdanonim`, `cnttbloqrgpd` | Anonymization and blocking |
| **Web/Portal** | `cntttoken`, `cnttpermpubl` | Access token, publication permission |
| **Audit** | `cntthstusu`, `cntthsthora` | Last user, last timestamp |
| **References** | `cnttrefant`, `cnttrefext`, `cnttboletin` | Legacy reference, external reference, bulletin |

### Contract Lifecycle States

The `cnttestado` column (numeric 5,0) encodes the contract state. While the specific lookup values are not in the provided data, standard AquaCIS states include:

1. **Creation** -- New contract linked to supply point and client
2. **Active** -- Billing and service active
3. **Suspended** -- Temporary service interruption (via `cnttcortep` cut flag)
4. **Terminated/Closed** -- Contract ended (via `cnttfcaduci` expiration date)

The `cnttsnformal` flag distinguishes **formal contracts** (signed agreement) from **informal/provisional** arrangements.

### Contract Lifecycle Tracking

| Mechanism | Table | Purpose |
|-----------|-------|---------|
| Current state | `contrato.cnttestado` | Active contract record |
| History snapshots | `hiscontrato` (108 columns) | Full row copy on every change |
| Financial movements | `movccontrato` | Balance changes, payments, charges |
| Debt tracking | `contratodeuda` | Aggregated debt amounts |
| Product subscriptions | `contratoprod` | Services attached to contract |
| Web portal link | `contratoweb` | Client-contract web access mapping |
| GDPR shadow | `rgpd_contrato` | Pre-anonymization data preservation |

### Person Roles on Contract

A single contract references **up to 8 different persona IDs**:

| Column | Role |
|--------|------|
| `cnttcliid` | Client (billing account holder) |
| `cnttfprsid` | Invoice recipient person |
| `cnttcprsid` | Correspondence recipient person |
| `cntttpropid` | Property owner |
| `cnttinquid` | Tenant/occupant |
| `cnttpcnprsid` | CNAE-linked person |
| `cnttotroprsid` | "Other" person |
| `cnttfspprsid` | Unknown role (possibly service point person) |
| `cnttnotifprsid1` | Notification recipient 1 |
| `cnttnotifprsid2` | Notification recipient 2 |

This is an unusually high number of person references for a water contract and suggests the system was designed for complex multi-party arrangements (common in Spanish/European utility regulation).

---

## Address Model (direccion)

### Structure

**Table:** `direccion` -- 23 columns

| Component | Column | Type | Notes |
|-----------|--------|------|-------|
| **ID** | `dirid` | numeric(10) | Surrogate key |
| **Type** | `dirtipo` | numeric(5) | Address type classification |
| **Street ref** | `dircalid` | numeric(10) | FK to `calle` table (nullable) |
| **Street text** | `dircaltxt` | varchar(36) | Free-text street name fallback |
| **Number** | `dirnumdes` | numeric(10) | Street number |
| **Parity** | `dirparimp` | numeric(5) | Odd/even side of street |
| **Building** | `dirfinca` | numeric(10) | Property/building ID |
| **Block** | `dirbloque` | char(4) | Block identifier |
| **Stairway** | `direscal` | char(4) | Staircase |
| **Floor** | `dirplanta` | char(4) | Floor/level |
| **Door** | `dirpuerta` | char(4) | Door/unit |
| **Portal** | `dirportal` | char(2) | Portal/entrance |
| **Supplement** | `dircomplem` | varchar(40) | Additional address text |
| **Full text** | `dirtexto` | varchar(150) | Denormalized full address text |
| **Locality** | `dirlocid` | numeric(10) | FK to `localidad` -> `poblacion` |
| **Postal code** | `dircodpost` | varchar(10) | Postal/ZIP code |
| **Kilometer** | `dirkilometro` | numeric(5,1) | Road kilometer marker |
| **Geolocation** | `dirgeolocid` | numeric(10) | FK to `geolocalizacion` |
| **Duplicate** | `dirduplicado` | char(1) | Duplicate address flag |
| **Manager** | `dirgestor` | varchar(120) | Account manager |
| **Audit** | `dirhstusu`, `dirhsthora` | | Standard audit columns |

### Address Hierarchy

```
direccion (address)
    |-- dircalid --> calle (street segment)
    |-- dirlocid --> localidad (locality/neighborhood)
    |                   |-- locpobid --> poblacion (municipality/city)
    |                                      |-- pobproid --> provincia (state)
    |-- dirgeolocid --> geolocalizacion (GPS coordinates)
```

### Geocoding Capability

The `geolocalizacion` table provides:
- `geoloclong` / `geoloclat` (varchar 30) -- coordinates stored as text (not native geographic type)
- `geolocaltitud` -- altitude
- `geoloctipogps` -- GPS device type
- `geoloctipocodificacion` -- geocoding method (manual, GPS, derived)
- `geolocfechacaptura` -- capture timestamp
- `geolocorigen` -- data origin

**Limitation:** Coordinates are stored as `varchar(30)` rather than PostgreSQL's native `point`, `geometry`, or `geography` types, preventing spatial queries without casting.

### Address Linking Pattern

Addresses connect to entities through bridge tables:

| Link | Table | Key Columns |
|------|-------|-------------|
| Person -> Address | `personadir` | `pdprsid`, `pdnumdir`, `pddirid` |
| Supply Point -> Address | `ptoserv.ptosdirid` | Direct FK |
| Connection -> Address | `acometida.acodirid` | Direct FK |
| Contract -> Address | Via person refs (`cnttfprsid`/`cnttfnumdir`) | Indirect through personadir |
| Auxiliary codes | `codauxdir` | Block/stairway/floor/door code lookups |

### Normalization Quality Assessment

**Mixed.** The address model has both structured and unstructured elements:

- **Good:** Hierarchical street -> locality -> municipality chain via `calle` -> `localidad` -> `poblacion`
- **Good:** Separate geolocation entity with metadata
- **Bad:** `dirtexto` (full address text) duplicates structured data -- likely used for display/search
- **Bad:** `dircaltxt` (street text) is a fallback when `dircalid` (street FK) is null -- dual representation
- **Bad:** `persona.prstxtdirfisc` stores fiscal address as free text, bypassing the entire address model
- **Bad:** `codauxdir` encodes whether block/stairway/floor/door fields are used, rather than letting NULL handle absence

---

## Organization Model (sociedad)

### Structure

**Table:** `sociedad` -- 77 columns

The `sociedad` table represents the **operating company** (the water utility itself or its business units), NOT customer organizations. It is linked to `persona` via `socprsid`, meaning each sociedad IS a persona in the system.

### Key Functional Areas

| Area | Columns | Purpose |
|------|---------|---------|
| **Identity** | `socprsid`, `soccodigo`, `socdescri`, `soccodunico` | Person link, 4-char code, name, unique code |
| **Type** | `soctsocid`, `socsngestora` | Society type, managing-company flag |
| **Billing config** | `socdiasdb`, `socsnremdef`, `soctipagruimp` | Days for direct debit, default remittance, invoice grouping |
| **SAP integration** | `soccodmansap`, `soccodsocsap` | SAP mandant and company codes |
| **Payment terminal** | `soctipoterm`, `socnumcomer`, `socnumterm`, `socpwdterm`, `soclimvalapte` | POS terminal configuration |
| **CFDI (Mexican invoicing)** | `soccfdcompr`, `soccfdversion`, `soccfdpago`, `soccfdcondpago`, `soccfdpobid`, `soccfdregimen` | Mexican electronic invoice configuration |
| **Communications** | `socususms`, `socpwdsms`, `socsmsremi`, `socemailremi`, `socremiemailaddress` | SMS/email sender credentials |
| **Digital certificates** | `socaliascert`, `socpwdcert`, `socnomfirma` | Digital signing certificate |
| **GDPR/Privacy** | `socdirlopd`, `socnomdpo`, `socmaildpo`, `soctelfdpo` | Data protection officer details |
| **Virtual office** | `socurlofivirtual`, `socsnactfacov`, `socurllogo` | Online portal configuration |
| **Audit** | `sochstusu`, `sochsthora` | Standard audit trail |

### User-Society Mapping

**Table:** `ususociedad` -- Maps system users to societies they can access:
- `ususuid` (varchar 10) -- User ID
- `ussocid` (numeric 10) -- Society ID

This enables **multi-company operations** where a single AquaCIS instance serves multiple operating entities.

### Important Distinction

`sociedad` is NOT a customer organization table. There is **no dedicated table for business/corporate customers**. Instead:
- A corporate customer is a `persona` with `prsjuridic = 'S'` (juridical person flag)
- Their industry codes are in `personacnae` and `personaiae`
- The `cnaesoc` table links CNAE codes to personas within a society context

This means corporate customer attributes (registration number, legal representative, parent company) have no dedicated storage.

---

## Data Quality Issues

### 1. Security Vulnerabilities

| Issue | Location | Severity |
|-------|----------|----------|
| **Plaintext passwords** | `persona.prspassweb` (varchar 10) | CRITICAL |
| **Plaintext passwords** | `webcliente.webpass` (varchar 10) | CRITICAL |
| **Plaintext web credentials** | `cliente.cliwebuser`/`cliwebpass` | CRITICAL |
| **SMS credentials in DB** | `sociedad.socususms`/`socpwdsms` | HIGH |
| **Certificate passwords** | `sociedad.socpwdcert` | HIGH |
| **Terminal passwords** | `sociedad.socpwdterm` | HIGH |

### 2. Denormalization Problems

| Issue | Details |
|-------|---------|
| **Inline phones on persona** | 5 phone columns (`prstelef` through `prsfax`) duplicate `personatel` normalized table |
| **Computed name column** | `persona.prsnomcpto` (203 chars) duplicates concatenation of name fields |
| **Address text fallbacks** | `direccion.dirtexto` and `dircaltxt` duplicate structured address data |
| **Fiscal address as text** | `persona.prstxtdirfisc` bypasses the entire `direccion` model |
| **History tables are full copies** | `hiscontrato` (108 cols), `hispersona` (36 cols) are complete row snapshots rather than change-log entries |

### 3. Naming Inconsistencies

| Pattern | Examples | Problem |
|---------|----------|---------|
| **Prefix collision** | `prstelef` vs `prtltelefono` | Different abbreviation conventions for same entity |
| **Mixed language** | `cnttsnfraude` (Spanish) vs `cntttoken` (English) | Inconsistent language in column names |
| **Inconsistent abbreviation** | `cntthstusu` vs `prshstusu` vs `sochstusu` | Same concept (`historial_usuario`) with varying prefixes |
| **Boolean encoding** | `'S'`/`'N'` (Spanish) vs `'Y'`/`'N'` (English) vs `'X'` (undefined) | At least 3 boolean conventions |
| **Type ambiguity** | `clitipo` (char 1) on cliente vs `cnttestado` (numeric 5) on contrato | States encoded as both char and numeric |

### 4. Missing Constraints

| Issue | Impact |
|-------|--------|
| **No documented foreign keys** | The schema dump shows column types but no FK constraints -- relationships exist only by naming convention |
| **Nullable critical fields** | `persona.prsnombre` (first name) is nullable; `persona.prsnif` (tax ID) is nullable |
| **No unique constraints visible** | `prsnif` should be unique per active persona but this is not enforced at schema level |
| **No check constraints** | Boolean char(1) fields accept any character, not just 'S'/'N' |
| **Wide NULL tolerance** | `contrato` has 40+ nullable columns including critical relationship fields like `cntttpropid`, `cnttinquid` |

### 5. Structural Issues

| Issue | Details |
|-------|---------|
| **Mega-table anti-pattern** | `contrato` at 105 columns should be decomposed into contract-core, contract-billing, contract-notifications, contract-fiscal |
| **Sociedad overload** | 77 columns mixing identity, billing, communications, security, and configuration |
| **No email entity** | Email addresses exist only as scattered varchar fields, never as a first-class entity |
| **Coordinate storage** | Lat/long stored as `varchar(30)` instead of native PostGIS types |
| **Temporal data gaps** | No `valid_from`/`valid_to` on most entities -- state changes captured only in `his*` snapshot tables |

---

## Customer 360 Gap Analysis

### What Exists

| Capability | Status | Tables |
|------------|--------|--------|
| Basic identity | Present | `persona` |
| Multiple addresses | Present | `personadir` -> `direccion` |
| Phone numbers | Present (fragmented) | `persona`, `personatel` |
| Service contracts | Present | `contrato`, `contratoprod` |
| Billing history | Present | `movccontrato`, `contratodeuda` |
| Communication history | Partial | `hiscomemail`, `hiscomsms` |
| Web portal access | Present | `webcliente`, `contratoweb` |
| Debt/collection status | Present | `contratodeuda`, `gescartera` |
| Supply point details | Present | `ptoserv`, `acometida` |
| Contract history | Present | `hiscontrato` |
| GDPR compliance | Present (retrofitted) | `rgpd_*` tables |

### What Is Missing

| Capability | Gap | Impact |
|------------|-----|--------|
| **Unified email storage** | No email entity; emails scattered or absent | Cannot reliably contact customers digitally |
| **Customer interactions log** | No `interaccion` or CRM-style activity table | No unified view of calls, visits, complaints timeline |
| **Customer segmentation** | Only `cnttusocod` (use code) and `cnttactivid` (activity) | Cannot do behavioral segmentation |
| **Consent management** | Only `cnttpermpubl` and basic GDPR flags | No granular consent per channel or purpose |
| **Customer satisfaction** | `cnttencuestas` is just a flag, no survey data model | No NPS/CSAT tracking |
| **Household/premises model** | No entity linking multiple contracts at same property | Cannot compute household-level metrics |
| **Customer value/risk scoring** | No scoring tables | No automated prioritization |
| **Document management** | `ptoservdoc` exists but no customer-level document store | Cannot attach contracts, IDs, correspondence to customer |
| **Payment methods** | Only bank reference (`contremabo`) and remittance (`contratoremesa`) | No credit card, digital wallet support |
| **Social media / digital channels** | Only `sociedad.soctwitter` (for the utility, not customers) | No customer social handles |
| **Customer lifecycle events** | No event-sourcing table | Cannot replay customer journey |
| **Multi-language support** | `prsidicodigo` on persona but no translated content model | Limited multilingual capability |
| **Relationship mapping** | No table linking personas to each other (spouse, guardian, representative) | Cannot model customer relationships |
| **Vulnerability/special needs** | Only `prsjubilad` (retired flag) | Cannot flag vulnerable customers (disabled, elderly, low-income) beyond retirement |

---

## Recommendations

### CRITICAL Priority

| # | Recommendation | Rating | Effort | Impact |
|---|---------------|--------|--------|--------|
| 1 | **Eliminate plaintext passwords** -- Hash all passwords in `persona.prspassweb`, `webcliente.webpass`, `cliente.cliwebuser/pass` using bcrypt/argon2. Increase column size to 255+ chars. | **HIGH** | Medium | Security compliance |
| 2 | **Add formal foreign key constraints** -- Define FK constraints for all documented relationships (persona->cliente, contrato->cliente, contrato->ptoserv, etc.) | **HIGH** | Medium | Data integrity |
| 3 | **Create unified email entity** -- New `personaemail` table with `prsid`, `email`, `tipo`, `verificado`, `snactivo`, mirroring `personatel` pattern | **HIGH** | Low | Communication capability |

### HIGH Priority

| # | Recommendation | Rating | Effort | Impact |
|---|---------------|--------|--------|--------|
| 4 | **Decompose contrato table** -- Split 105-column table into: `contrato_core` (identity, state, parties), `contrato_billing` (fiscal, invoice prefs), `contrato_notif` (notification channels), `contrato_config` (flags, thresholds) | **HIGH** | High | Maintainability |
| 5 | **Consolidate phone storage** -- Deprecate inline `persona.prstelef*` columns; migrate all data to `personatel`; add `tipo` (mobile/landline/fax) classification | **HIGH** | Medium | Data consistency |
| 6 | **Implement PostGIS** -- Convert `geolocalizacion` lat/long from varchar to `geometry(Point, 4326)` to enable spatial queries for service area analysis | **HIGH** | Medium | Analytics capability |
| 7 | **Create customer interaction log** -- New `interaccion_cliente` table logging all touchpoints (calls, visits, portal sessions, SMS, emails) with timestamps and outcomes | **HIGH** | Medium | Customer service quality |

### MEDIUM Priority

| # | Recommendation | Rating | Effort | Impact |
|---|---------------|--------|--------|--------|
| 8 | **Normalize boolean conventions** -- Standardize on `'S'`/`'N'` (Spanish) or migrate to native `boolean` type across all tables | **MEDIUM** | High | Code consistency |
| 9 | **Add temporal validity** -- Add `vigente_desde`/`vigente_hasta` columns to `personadir`, `contratoprod`, and key reference data for point-in-time queries | **MEDIUM** | Medium | Historical accuracy |
| 10 | **Create corporate customer model** -- Add `empresa` table for business customers with legal representative, registration number, parent company, sector classification beyond CNAE | **MEDIUM** | Medium | B2B capability |
| 11 | **Implement consent management** -- New `consentimiento` table with persona, channel, purpose, grant_date, revoke_date to replace scattered permission flags | **MEDIUM** | Medium | Regulatory compliance |
| 12 | **Add customer deduplication index** -- Create composite unique index on `(prsnif, prspaiscodigo)` where `prsnif IS NOT NULL` to prevent duplicate tax ID registration | **MEDIUM** | Low | Data quality |

### LOW Priority

| # | Recommendation | Rating | Effort | Impact |
|---|---------------|--------|--------|--------|
| 13 | **Replace history snapshot tables** -- Migrate from full-row `his*` copies to event-sourcing or CDC (Change Data Capture) pattern to reduce storage and improve queryability | **LOW** | High | Storage efficiency |
| 14 | **Standardize column naming** -- Adopt consistent prefix convention (e.g., always 4-char table abbreviation + descriptive name) across all customer domain tables | **LOW** | Very High | Developer experience |
| 15 | **Create customer 360 materialized view** -- Build `mv_customer_360` combining persona + cliente + active contracts + addresses + contact info + debt status for CRM use cases | **LOW** | Medium | Reporting capability |
| 16 | **Add vulnerability tracking** -- Extend persona or create `persona_vulnerabilidad` table for disability, age-related, economic vulnerability, medical dependency on water service | **LOW** | Low | Social responsibility compliance |

---

## Customer Domain Health Score: 5/10

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Data Model Design** | 5/10 | Sound conceptual model (persona/cliente/contrato separation) but massive denormalization and mega-tables |
| **Data Integrity** | 4/10 | No visible FK constraints, wide NULL tolerance, plaintext passwords |
| **Normalization** | 5/10 | Address hierarchy is good; phone/email/contact data is fragmented |
| **Completeness** | 5/10 | Core billing lifecycle covered; missing email entity, interaction log, customer value |
| **Security** | 2/10 | Plaintext passwords in multiple tables, credentials stored in DB |
| **Regulatory Readiness** | 5/10 | GDPR tables added retroactively; basic anonymization present; consent management missing |
| **Analytics Readiness** | 4/10 | No customer segmentation, no scoring, varchar coordinates, no household model |
| **Extensibility** | 6/10 | History tables exist; `personatel`/`personadir` satellite pattern is extensible |
| **Modern CRM Capability** | 3/10 | No interaction log, no omnichannel preferences, no journey tracking |
| **Documentation** | 6/10 | Column naming is self-describing (with Spanish knowledge); no inline comments in schema |

**Overall: 5/10** -- Functionally adequate for legacy water billing operations but requires significant modernization for digital customer experience, regulatory compliance, and analytics use cases.

---

## Appendix: Table Inventory

### Core Customer Tables

| Table | Columns | Purpose |
|-------|---------|---------|
| `persona` | 37 | Person/entity identity root |
| `cliente` | 22 | Billing account attributes |
| `contrato` | 105 | Service contract (widest in domain) |
| `direccion` | 23 | Physical address |
| `sociedad` | 77 | Operating company/utility entity |
| `ptoserv` | 55 | Supply point (service delivery location) |

### Satellite/Bridge Tables

| Table | Purpose |
|-------|---------|
| `personadir` | Person-to-address link (M:N with default flag) |
| `personatel` | Normalized phone number list |
| `personacnae` | Person economic activity codes |
| `personaiae` | Person tax activity codes |
| `contratoprod` | Contract product subscriptions |
| `contratodeuda` | Contract debt summary |
| `contratoremesa` | Contract bank remittance data |
| `contratoweb` | Contract web portal access |
| `movccontrato` | Contract balance movements |
| `webcliente` | Web client credentials |
| `ususociedad` | User-to-society access mapping |
| `contratosbeneficioacueducto` | Aqueduct benefit program tracking |

### History Tables

| Table | Tracks |
|-------|--------|
| `hiscliente` | Client attribute changes |
| `hiscontrato` | Contract changes (108 cols) |
| `hiscontratoprod` | Product subscription changes |
| `hispersona` | Person identity changes |
| `hispersonadir` | Address link changes |
| `hispersonatel` | Phone number changes |
| `hissociedad` | Society configuration changes |

### GDPR Tables

| Table | Purpose |
|-------|---------|
| `rgpd_contrato` | Contract data pre-anonymization snapshot |
| `rgpd_contrato_personas` | Person-to-contract mapping for GDPR processing |
| `rgpd_persona` | Persona merge/replacement tracking |

### Lookup/Type Tables

| Table | Purpose |
|-------|---------|
| `tipcliente` | Client type classification |
| `calle` | Street reference data |
| `localidad` | Locality/neighborhood |
| `poblacion` | Municipality/city |
| `geolocalizacion` | GPS coordinates |
| `codauxdir` | Address component codes |
| `actividad` | Activity/sector classification |
| `cnae` / `cnaesoc` | Economic activity codes |
| `acometida` | Physical water connection |

### Views

| View | Purpose |
|------|---------|
| `vcontrato` | Denormalized contract view with person/address text |
| `vpersona` | Simplified person view |
