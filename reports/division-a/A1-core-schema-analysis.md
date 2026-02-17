# A1 - Core Schema Analysis: AquaCIS Tier 1 Critical Tables

**Agent:** A1 (db-core-schema)
**Date:** 2026-02-16
**Database:** cf_quere_pro (AquaCIS - CEA Queretaro)
**Scope:** explotacion, contrato, persona, ptoserv, factura, facturable, cliente, direccion, sociedad

---

## 1. Executive Summary

The AquaCIS database core schema exhibits a classic **"god table" anti-pattern** centered on the `explotacion` table (350 columns), which conflates organizational configuration, billing rules, notification settings, regulatory compliance, digital platform integrations, and operational parameters into a single monolithic entity. The `contrato` table (104 columns) similarly absorbs billing, notification, GDPR, digital preferences, and customer relationship concerns that belong in separate normalized structures. While the peripheral tables (`persona`, `direccion`, `ptoserv`, `factura`, `facturable`, `cliente`, `sociedad`) are more reasonably sized and follow consistent naming conventions, the overall data model suffers from severe denormalization in the two central tables, inconsistent null patterns, and a naming convention (3-4 character abbreviated prefixes) that sacrifices readability for compactness.

**Overall Data Model Quality Score: 3.5 / 10** (see Section 9 for justification)

---

## 2. Table Profiles

### 2.1 explotacion (350 columns) -- THE GOD TABLE

| Attribute | Value |
|-----------|-------|
| **Column count** | 350 (actual columns numbered 1-351, with gap at 319) |
| **Primary key** | `expid` (numeric 5,0) |
| **Purpose** | Represents an "explotacion" (exploitation/operating unit) -- the top-level organizational entity that configures virtually every aspect of the water utility's operations |
| **Predominant types** | character(1) for S/N flags (~180+ columns), numeric(5,0) for IDs/counts, character varying for text/URLs |
| **Default patterns** | Heavy use of 'N'::bpchar and 'S'::bpchar defaults for boolean-like flags |
| **Audit columns** | `exphstusu` (varchar 10), `exphsthora` (timestamp) |

**Key foreign key references outbound:**
- `expelsid` -> elemestruc (organizational structure)
- `expemisoid` -> emisor (payment issuer)
- `expidiid` -> idioma (language)
- `expsocgest` -> sociedad (managing society, via prsid)
- `expctracod` -> contratista (contractor)
- Various `expsoc*` columns referencing sociedad

### 2.2 contrato (104 columns)

| Attribute | Value |
|-----------|-------|
| **Column count** | 104 (numbered 1-105, gap at 104) |
| **Primary key** | `cnttnum` (numeric 10,0) |
| **Purpose** | The water service contract -- links a customer (cliente) to a service point (ptoserv) within an explotacion |
| **Predominant types** | numeric(10,0) for FKs, character(1) for flags, character varying for text |
| **Audit columns** | `cntthstusu` (varchar 10), `cntthsthora` (timestamp) |

**Key foreign key references outbound:**
- `cnttexpid` -> explotacion.expid
- `cnttptosid` -> ptoserv.ptosid
- `cnttcliid` -> cliente.cliid
- `cntttctcod` -> tipocontrato (contract type)
- `cnttfprsid` -> persona.prsid (billing person)
- `cnttcprsid` -> persona.prsid (correspondence person)
- `cnttscobid` -> subcobro (collection subcategory)
- `cnttpropid` -> persona.prsid (property owner)
- `cnttinquid` -> persona.prsid (tenant)
- `cnttnotifprsid1`, `cnttnotifprsid2` -> persona.prsid (notification contacts)
- `cnttagruid` -> agrucontra (contract grouping)
- `cnttfspprsid` -> persona.prsid (fiscal representative)
- `cnttmailnopapelfprsid` -> persona.prsid (paperless mail person)
- `cnttpcnprsid` -> personacnae

### 2.3 persona (36 columns)

| Attribute | Value |
|-----------|-------|
| **Column count** | 36 (numbered 1-37, gap at 21) |
| **Primary key** | `prsid` (numeric 10) |
| **Purpose** | Natural or legal person (customer, owner, tenant, contact) |
| **Predominant types** | character varying for names/phones, character(1) for flags |
| **Audit columns** | `prshstusu` (varchar 10), `prshsthora` (timestamp) |

**Key columns:**
- `prsnombre` (first name, varchar 40)
- `prspriapel` (first surname, varchar 120, NOT NULL)
- `prssegapel` (second surname, varchar 40)
- `prsnif` (tax ID, varchar 15)
- `prsjuridic` (legal entity flag, char 1)
- `prsjubilad` (retiree flag, char 1)
- `prsnomcpto` (computed full name, varchar 203)
- `prstelef`, `prstelef2`, `prstelef3`, `prstelef4` (4 phone columns!)
- `prsfax` (fax number)
- `prsrgpdanonim` (GDPR anonymization flag)
- `prsbloqrgpd` (GDPR block flag)

**Related tables:**
- `personadir` (person-to-address mapping, 13 cols) -- M:N bridge
- `personatel` (person telephone, 9 cols) -- additional phones
- `personacnae` (person business activity classification)

### 2.4 ptoserv (55 columns)

| Attribute | Value |
|-----------|-------|
| **Column count** | 55 |
| **Primary key** | `ptosid` (numeric 10) |
| **Purpose** | Service point -- the physical location where water service is delivered (punto de servicio) |
| **Predominant types** | numeric for IDs, character(1) for flags |
| **Audit columns** | `ptoshstusu` (varchar 10), `ptoshsthora` (timestamp) |

**Key foreign key references outbound:**
- `ptosdirid` -> direccion.dirid (address)
- `ptostetid` -> tipoestructura (structure type)
- `ptosexpid` -> explotacion.expid
- `ptoszonid` -> zona (zone code, char 3)
- `ptosservid` -> servicio (service reference)
- `ptostpsid` -> tipoptoserv (service point type)
- `ptosmtbcid` -> motbajacuota (reason for fee reduction)

**Notable columns:**
- `ptosestado` (status)
- `ptossncortdeud`, `ptossncortprov`, `ptossncortman` (cut-off flags: debt, provisional, manual)
- `ptosposfraude` (possible fraud flag)
- `ptosestrategico` (strategic flag)
- `ptosllavecerrada` (locked valve flag)

### 2.5 factura (20 columns)

| Attribute | Value |
|-----------|-------|
| **Column count** | 20 |
| **Primary key** | `facid` (numeric 10,0) |
| **Purpose** | Invoice/bill -- the actual billing document issued to a customer |
| **Audit columns** | None explicit (relies on facturacio for session tracking) |

**Key foreign key references outbound:**
- `facftoid` -> facturacio.ftoid (billing batch/run)
- `facsocemi` -> sociedad (emitting society)
- `facsocpro` -> sociedad (owning society)
- `facpocid` -> polizacontrato (policy/contract linkage)
- `faccliid` -> cliente.cliid
- `facexpid` -> explotacion.expid
- `faccnttnum` -> contrato.cnttnum
- `facdcfaid` -> docucfd (CFDI fiscal document, Mexico-specific)

**Notable columns:**
- `facestado` (invoice state)
- `facfecfact` (invoice date)
- `facnumfac` (invoice number, char 18)
- `facimporte` (amount, numeric 18,2)
- `facimpuest` (tax, numeric 18,2)
- `facfecvto` (due date)
- `facclinif` (customer NIF -- denormalized from persona!)
- `factipgesd` (debt management type)

### 2.6 facturable (59 columns)

| Attribute | Value |
|-----------|-------|
| **Column count** | 59 |
| **Primary key** | `fbleid` (numeric 10,0) |
| **Purpose** | Billable unit -- represents a metered consumption record that can be invoiced. Contains meter readings, consumption calculations, and validation data |
| **Audit columns** | None explicit |

**Key foreign key references outbound:**
- `fblepocid` -> polizacontrato (policy/contract link)
- `fbleftoid` -> facturacio.ftoid (billing batch)
- `fblecontid` -> contador (meter)
- `fbletsumid` -> tiposuministro (supply type)
- `fblecnttnum` -> contrato.cnttnum

**Notable column groups:**
- Meter readings: `fblelecant`, `fblelecact`, `fblelecan2`, `fblelecac2` (previous/current, primary/secondary)
- Consumption: `fbleconsum`, `fbleconsreg`, `fbleconsest`, `fbleconsrep`, `fbleconsotr` (total, regular, estimated, replaced, other)
- Validation variants: `fbleconsumval`, `fbleconsregval`, `fbleconsestval`, `fbleconsrepval`, `fbleconsotrval`
- Date ranges: `fblefecant`, `fblefecact`, `fblefperini`, `fblefperfin`
- Flags: `fbleleido`, `fblecortad`, `fblesnconcom`, `fbleexento`

### 2.7 cliente (22 columns)

| Attribute | Value |
|-----------|-------|
| **Column count** | 22 |
| **Primary key** | `cliid` (numeric 10,0) |
| **Purpose** | Customer account entity -- represents a billing account, distinct from persona (the actual person/entity) |
| **Audit columns** | `clihstusu` (varchar 10), `clihsthora` (timestamp) |

**Notable columns:**
- `clitipo` (customer type, char 1)
- `cliwebuser`, `cliwebpass` (web credentials -- **SECURITY CONCERN: plaintext password, varchar 10**)
- `cliwebconn`, `cliwebultc` (web connection count and last connection)
- `cliindblk` (block indicator)
- `clicenfis`, `clicenpag`, `clicenrecp`, `clicencomp` (fiscal center, payment center, receipt center, buyer center)
- `cliusocfdi` (CFDI usage code, Mexico fiscal)
- `cliregfiscal` (fiscal regime)

### 2.8 direccion (23 columns)

| Attribute | Value |
|-----------|-------|
| **Column count** | 23 |
| **Primary key** | `dirid` (numeric 10,0) |
| **Purpose** | Physical address -- reusable address entity linked to persons via personadir and to service points via ptoserv |
| **Audit columns** | `dirhstusu` (varchar 10), `dirhsthora` (timestamp) |

**Key columns:**
- `dirtipo` (address type)
- `dircalid` (street/calle ID, FK to calle table)
- `dirparimp` (par/impar -- even/odd numbering)
- `dirnumdes` (door number)
- `dirfinca` (property number)
- `dirbloque`, `direscal`, `dirplanta`, `dirpuerta` (block, staircase, floor, door)
- `dircomplem` (complement, varchar 40)
- `dirtexto` (full text address, varchar 150 -- **denormalized**)
- `dirlocid` (locality ID)
- `dircodpost` (postal code, varchar 10)
- `dirgeolocid` (geolocation ID)

### 2.9 sociedad (84 columns)

| Attribute | Value |
|-----------|-------|
| **Column count** | 84 |
| **Primary key** | `socprsid` (numeric 10) -- **IS a persona ID** |
| **Purpose** | Legal society/company entity -- represents the water company or delegated management organizations |
| **Audit columns** | `sochstusu` (varchar 10), `sochsthora` (timestamp) |

**Key columns:**
- `soccodigo` (society code, char 4)
- `socdescri` (description, varchar 50)
- `soctsocid` (society type)
- `socsngestora` (managing society flag)
- `socprsid` references persona.prsid (society IS a persona)
- `socsmsremi`, `socemailremi` (SMS/email sender identity)
- `socususms`, `socpwdsms` (SMS credentials -- **SECURITY CONCERN**)
- `socaliascert`, `socpwdcert` (certificate credentials -- **SECURITY CONCERN**)
- `socusrfirma`, `socpwdfirma` (signing credentials -- **SECURITY CONCERN**)
- `soctokenacua` (API token -- **SECURITY CONCERN**)
- `soccfd*` columns (Mexico CFDI fiscal integration)

---

## 3. Relationship Map

```
                         +------------------+
                         |   explotacion    |
                         |   (350 cols)     |
                         |   PK: expid      |
                         +--------+---------+
                                  |
          +-----------+-----------+-----------+-----------+
          |           |           |           |           |
          v           v           v           v           v
    +-----------+ +--------+ +--------+ +---------+ +----------+
    |  ptoserv  | |contrato| |factura | |sociedad | |facturacio|
    | (55 cols) | |(104col)| |(20 col)| |(84 cols)| | (28 cols)|
    |PK:ptosid  | |PK:cntt | |PK:facid| |PK:socprs| |PK:ftoid  |
    +-----+-----+ +---+----+ +---+----+ +----+----+ +-----+----+
          |            |          |            |           |
          |     +------+------+   |            |           |
          |     |      |      |   |            v           |
          |     v      v      v   |      +---------+       |
          | +------++------++------+     | persona |       |
          | |client||person||person|     | (36 col)|       |
          | |(22c) ||a(bil)||a(cor)|     |PK:prsid |       |
          | |PK:cli||lng)  ||resp) |     +----+----+       |
          | +------++------++------+          |            |
          |                                    |            |
          +-----> direccion <--personadir------+            |
                  (23 cols)    (13 cols)                    |
                  PK:dirid     bridge table                 |
                                                           |
                       facturable <------------------------+
                       (59 cols)
                       PK:fbleid
```

### Primary Relationships (ER)

| Parent | Child | FK Column(s) | Cardinality | Description |
|--------|-------|-------------|-------------|-------------|
| explotacion | contrato | cnttexpid | 1:N | Each contract belongs to one explotacion |
| explotacion | ptoserv | ptosexpid | 1:N | Each service point belongs to one explotacion |
| explotacion | factura | facexpid | 1:N | Each invoice belongs to one explotacion |
| ptoserv | contrato | cnttptosid | 1:N | Each contract is linked to one service point |
| cliente | contrato | cnttcliid | 1:N | Each contract belongs to one customer |
| persona | contrato (billing) | cnttfprsid, cnttfnumdir | 1:N | Billing address person |
| persona | contrato (corresp.) | cnttcprsid, cnttcnumdir | 1:N | Correspondence person |
| persona | contrato (owner) | cnttpropid | 1:N | Property owner |
| persona | contrato (tenant) | cnttinquid | 1:N | Tenant/occupant |
| persona | sociedad | socprsid | 1:1 | Society IS a persona (inheritance pattern) |
| direccion | ptoserv | ptosdirid | 1:N | Service point has one physical address |
| persona | personadir | pdprsid | 1:N | Person has multiple addresses |
| direccion | personadir | pddirid | 1:N | Address linked to multiple persons |
| contrato | factura | faccnttnum | 1:N | Each invoice belongs to one contract |
| cliente | factura | faccliid | 1:N | Each invoice belongs to one customer |
| sociedad | factura (emitter) | facsocemi | 1:N | Emitting society |
| sociedad | factura (owner) | facsocpro | 1:N | Property/owning society |
| facturacio | factura | facftoid | 1:N | Billing run produces invoices |
| facturacio | facturable | fbleftoid | 1:N | Billing run produces billable records |
| contrato | facturable | fblecnttnum | 1:N | Contract has billable records |

### Implied/Indirect Relationships

- **cliente -> persona**: Not directly via FK in the tables shown, but `cliente` is effectively a role wrapper around `persona`. The bridge is through `contrato` which holds both `cnttcliid` and multiple `prsid` references.
- **explotacion -> sociedad**: `expsocgest` (managing society), `expsocpremcp`, `expsocpropdeudaprop`, `expsoctratdato`, etc. Multiple sociedad references from explotacion.
- **contrato -> contrato (self)**: `cnttrefmid` (reference to another contract), plus `cnttagruid` for contract groupings.

---

## 4. Normalization Issues

### 4.1 CRITICAL -- explotacion God Table (Severity: CRITICAL)

The `explotacion` table at 350 columns violates **1NF through 3NF** in multiple dimensions:

**Problem:** A single row contains configuration for at least **15 distinct functional domains** mixed together (detailed analysis in Section 5).

**Impact:**
- Any change to any configuration domain requires locking the entire row
- Queries that need only billing config must scan or fetch all 350 columns
- Schema evolution is extremely fragile -- adding any new feature means adding columns here
- ORM mapping is impractical at this width

### 4.2 HIGH -- Denormalized Customer NIF in factura

| Table | Column | Issue |
|-------|--------|-------|
| factura | `facclinif` (char 15) | Customer tax ID duplicated from persona.prsnif |

**Why it matters:** If a customer's NIF changes (correction), historical invoices retain the old value -- which may be intentional for audit, but there is no explicit indication this is a deliberate snapshot vs. a denormalization error.

### 4.3 HIGH -- Multiple Phone Columns in persona

| Columns | Issue |
|---------|-------|
| `prstelef`, `prstelef2`, `prstelef3`, `prstelef4`, `prsfax` | 5 phone/fax columns inline |

**Why it matters:** The `personatel` table already exists as a proper normalized phone repository (with `prtltelefono`, `prtlprefijo`, `prtlautorizado`). The inline columns are redundant and create dual sources of truth.

### 4.4 HIGH -- Repeated Notification Addresses in contrato

| Columns | Issue |
|---------|-------|
| `cnttnotifprsid1`, `cnttnotifnumdir1`, `cnttnotifprsid2`, `cnttnotifnumdir2` | Hardcoded to exactly 2 notification addresses |

**Why it matters:** This is a repeating group (violates 1NF). Should be a separate `contrato_notificacion` table supporting N notification addresses.

### 4.5 MEDIUM -- Boolean Flags as character(1) Instead of boolean

Across all tables, boolean values are stored as `character(1)` with values 'S'/'N' (Si/No) instead of PostgreSQL's native `boolean` type. Examples:

- `explotacion`: ~180+ columns like `expsnperiodificar`, `expsncalrecargo`, `expsncontdup`, etc.
- `contrato`: `cnttsnformal`, `cnttsnfraude`, `cnttsnnotifmail`, `cnttsnnotifsms`, etc.
- `ptoserv`: `ptosndesha`, `ptossncortdeud`, `ptosposfraude`, etc.

**Impact:** Wastes storage, prevents boolean indexing optimizations, and requires casting in queries.

### 4.6 MEDIUM -- Inconsistent Null Patterns

Many columns that logically should be NOT NULL are nullable, and vice versa:

- `persona.prsnombre` (first name) is **nullable** -- a person without a name?
- `direccion.dircalid` (street ID) is **nullable** -- an address without a street?
- `ptoserv.ptoszonid` (zone) is **nullable** -- a service point without a zone?
- `contrato.cnttcateid` (category) is **nullable**

### 4.7 MEDIUM -- Plaintext Credentials in cliente and sociedad

| Table | Column(s) | Issue |
|-------|-----------|-------|
| cliente | `cliwebpass` (varchar 10) | Web password stored in plain text, max 10 chars |
| sociedad | `socpwdsms` (varchar 200) | SMS service password |
| sociedad | `socpwdcert` (varchar 100) | Certificate password |
| sociedad | `socpwdfirma` (varchar 90) | Digital signing password |
| sociedad | `soctokenacua` (varchar 65) | API token |

**Severity: HIGH from security perspective.** Passwords should be hashed; tokens should be in a vault or encrypted column.

### 4.8 MEDIUM -- dirtexto Denormalization in direccion

The `dirtexto` column (varchar 150) appears to be a pre-computed text representation of the structured address components (`dircalid`, `dirnumdes`, `dirbloque`, `direscal`, `dirplanta`, `dirpuerta`, `dircomplem`). This creates a synchronization risk.

### 4.9 LOW -- Numeric Column Numbering Gaps

Both `contrato` and `explotacion` have gaps in their column numbering (contrato skips #104, explotacion skips #319). This suggests columns were dropped at some point but the schema was not re-sequenced.

### 4.10 LOW -- Inconsistent Type Precision

- `contrato.cnttnumsecpedido` is `double precision` (53-bit float) -- unusual for a sequence/order number that should be integer or numeric.
- Some ID columns use `numeric(5,0)` while others use `numeric(10,0)` with no apparent naming distinction.

---

## 5. God Table Analysis: explotacion (350 columns)

### 5.1 Domain Decomposition

After analyzing all 350 columns, the following distinct functional domains are mixed into this single table:

#### Domain 1: Core Identity (est. 10 columns)
Columns: `expid`, `expdescri`, `expfecha`, `expcodigo`, `expfecbaja`, `expregimen`, `expelsid`, `expidiid`, `exphstusu`, `exphsthora`

*Purpose:* Basic identification of the operating unit.

#### Domain 2: Billing Configuration (est. 45 columns)
Columns including: `expdiasvencfact`, `expmaxmensfact`, `expsncrearfact`, `expsnprefact`, `expsnaceptfact`, `expsngendoc`, `expsngenefact`, `expanorefacaut`, `expdescserv1`, `expdescserv2`, `expsndeufact`, `expexclfact`, `expcobrocpfac`, `expsnfaceprop`, `expsnfactrepoauto`, `expcptofactdifrepo`, `expexclfactsubr`, `expsnvarfacturado`, `expsnexcfacqueja`, `expvarredondeofto`, `expexcfaclecest`, `expexcfacobsfug`, `expobsexcfac`, `expmotivosfto`, `expnumdiacrefact`, `expnumdiaprefact`, `expnumdiagenmens`, `expnumdiaacepfact`, `expnumdiagendoc`, `expnumdiagenefact`, and more.

#### Domain 3: Meter Reading / Estimation (est. 25 columns)
Columns including: `expestimnl`, `expbolsaest`, `expmaxestim`, `expsnestimarcontador`, `expsnconsvalidoini`, `expestimnlval`, `expsnestnolei`, `expnumdiaestlei`, `expestimarnmeses`, `expnotalect`, `expsnmodleccont`, `expcconscero`, `expcntnvm3cons`, `expcntnvantig`, `expm3promanual`, `expm3ptoe`, and related.

#### Domain 4: Collection / Debt Management (est. 35 columns)
Columns including: `expcobpprop`, `expnplazoscp`, `expdiasvtolimpag`, `expplazoretdeuda`, `expplazoretsindeuda`, `expsncaldemoracobro`, `expporcdemora`, `expvardemora`, `expdiasintdem`, `expciclosrefcobro`, `expintfracccp`, `expvarintfracc`, `expcobprimerplazo`, `expsnusarsaldo`, `expsnusarsaldoant`, `expsnnousarsaldeu`, `expsnrecfianza`, `expdiasavideu`, `expmaxdeuda12gotas`, `expmaxfacimp12gotas`, `expsnservdeuda`, `expdoccortedeuda`, `expordencortedeuda`, `expsnplazosintdemora`, `exppormaxintfrac`, `expcadrafpago`, `expcadrafpagocp`, and more.

#### Domain 5: Remittance / Bank Domiciliation (est. 15 columns)
Columns including: `exprembloq`, `expplazoemrem`, `expplazotpdia`, `expfremesa`, `expplazoemremsinp`, `expdiasnuevaremesa`, `expdiamesreme`, `expnumdiarem`, `expsnenvsicer`, `expmotivoscomunica`, `expsncomunilotecamb`, `expsnlotecambauto`, `expnumdevcancel`.

#### Domain 6: Notification / Communication (est. 25 columns)
Columns including: `expsnnotmultimedia`, `expnotifauto`, `expnotxhoras`, `expnotxmin`, `expnotxminanu`, `expsnenvobslecser`, `expsnenvordgestor`, `expsnsmsbienv`, `expremisms`, `expremimail`, `exppernotifind`, `expdirenvcont`, `expsngenmens`, and more.

#### Domain 7: Digital / Platform Integration (est. 20 columns)
Columns including: `expsndigital`, `expsnbiom`, `expsnacortarurl`, `expidplataf`, `expsnwaterc`, `expsndrop`, `expsncertdig`, `expdigfluid`, `expbiofluid`, `expcerfluid`, `expsistregest`, `expanregest`, `expurlpago`, `expurlofivirtual`, `expurllogo`, `expidsocdm`, `expmarcasoc`.

#### Domain 8: Work Order / Operations (est. 20 columns)
Columns including: `expgestord`, `expsninsitu`, `expsnoperarsoloot`, `expsngestopergot`, `expsncontinstbajlot`, `exptipcambcont`, `expdiaslotcamb`, `expsnloteauto`, `expformlote`, `expsnarchivarlote`, `expsngendocacept`, `expsngendocrecap`, `expdifminhorprev`, `expdifmininiobra`, `expperprohini`, `expperprohfin`, `expprohminant`.

#### Domain 9: Cut-off / Suspension Rules (est. 20 columns)
Columns including: `expdiascortesum`, `exppresdiascorsum`, `expsncortevisperas`, `expsnllavecerrada`, `expmesescllave`, `expmesesmaxcllave`, `expobsexccllave`, `expzonascllave`, `exptippuntexccllave`, `exptipcliexccllave`, `expdiasexccllave`, `expsncorteprovapr`.

#### Domain 10: Regulatory / GDPR / LOPD (est. 15 columns)
Columns including: `expnolopd`, `expencsuezlopd`, `expsnrblergpd`, `expsndatossensible`, `expdatossensibles`, `expimprimpconsent`, `expagprodatostxtid`, `expwebagprodatos`, `expsoctratdato`, `expsnauditoria`, `expsnauditoriaext`.

#### Domain 11: Complaints / Quality (est. 10 columns)
Columns including: `expsncofactrecla`, `expsninfextrareclam`, `expsnexcfacqueja`, `expxcientoinc`.

#### Domain 12: Tax / Fiscal Configuration (est. 10 columns)
Columns including: `expjexentxtid`, `expjnosujtxtid`, `exptipvar`, `expnummeses`, `expsntimbrarabonos`.

#### Domain 13: Bonification / Subsidy (est. 8 columns)
Columns including: `expsnasigbonif`, `expsocayuprovapr`, `expcobejeprovapr`, `expofiayuntejec`.

#### Domain 14: GIS / Geolocation (est. 8 columns)
Columns including: `expsnsecgis`, `expservmapgisid`, `expgeoorden`, `expgeoconf`, `expcoordporce`, `expcoordcopia`, `expsnnoconsecutivos`.

#### Domain 15: Miscellaneous / Legacy (est. ~85 remaining columns)
Various configuration flags that don't cleanly fit other categories, including counter-related settings, padron generation, insurance/judicial, and many single-purpose flags added over time.

### 5.2 Decomposition Recommendation

The 350-column `explotacion` table should be decomposed into the following normalized tables:

| Proposed Table | Source Columns | Priority |
|---------------|---------------|----------|
| `explotacion` (core) | ~10 columns | HIGH |
| `explotacion_billing_config` | ~45 columns | HIGH |
| `explotacion_collection_config` | ~35 columns | HIGH |
| `explotacion_estimation_config` | ~25 columns | HIGH |
| `explotacion_notification_config` | ~25 columns | MEDIUM |
| `explotacion_cutoff_config` | ~20 columns | MEDIUM |
| `explotacion_workorder_config` | ~20 columns | MEDIUM |
| `explotacion_digital_config` | ~20 columns | MEDIUM |
| `explotacion_remittance_config` | ~15 columns | MEDIUM |
| `explotacion_gdpr_config` | ~15 columns | MEDIUM |
| `explotacion_fiscal_config` | ~10 columns | LOW |
| `explotacion_quality_config` | ~10 columns | LOW |
| `explotacion_gis_config` | ~8 columns | LOW |
| `explotacion_bonification_config` | ~8 columns | LOW |

All child tables would share the PK `expid` as both PK and FK (1:1 relationship pattern).

---

## 6. Additional Structural Observations

### 6.1 Naming Convention Analysis

The database uses a consistent but highly abbreviated naming convention:
- **Table names:** Full Spanish words, lowercase, no underscores (e.g., `explotacion`, `ptoserv`, `facturacio`)
- **Column prefixes:** 2-4 character abbreviation of the table name (e.g., `exp*` for explotacion, `cntt*` for contrato, `prs*` for persona, `ptos*` for ptoserv, `fac*` for factura, `fble*` for facturable, `cli*` for cliente, `dir*` for direccion, `soc*` for sociedad)
- **Suffix patterns:**
  - `*id` = primary key or foreign key
  - `*sn*` = boolean flag (si/no)
  - `*fec*` = date
  - `*desc*` / `*des*` = description
  - `*cod*` = code
  - `*txt*` / `*txtid` = text reference (FK to a translations table)
  - `*hstusu`, `*hsthora` = audit username and timestamp

**Assessment:** The convention is internally consistent but severely impacts readability. Column names like `expsncaldemoracobro` or `expsnplazosintdemora` are difficult to parse without domain knowledge.

### 6.2 Text Internationalization Pattern

Many tables reference `*txtid` columns pointing to a centralized text/translation table (e.g., `expcptofiltxtid`, `expcptofinltxtid`). This is a standard i18n pattern (table-per-language or EAV text storage), which is appropriate for a multi-language system.

### 6.3 The facturacio-factura-facturable Triad

The billing pipeline has a clear three-tier structure:
1. **facturacio** (billing batch/run) -- 28 columns, contains metadata about a billing execution
2. **factura** (invoice) -- 20 columns, the actual bill
3. **facturable** (billable record) -- 59 columns, the consumption detail

This is a well-designed pattern. However, `facturable` at 59 columns is also accumulating complexity, with validation variants of every consumption column (e.g., `fbleconsum` / `fbleconsumval`, `fbleconsreg` / `fbleconsregval`), suggesting a before/after validation state is stored inline rather than in a separate audit/validation table.

### 6.4 The persona-cliente-sociedad Triangle

The data model uses an interesting pattern:
- **persona** is the base entity for any natural or legal person
- **cliente** is a billing account wrapper (does NOT directly contain a prsid -- linked via contrato)
- **sociedad** uses `socprsid` as its PK, making it a specialization/subtype of persona

This is a valid single-table inheritance pattern for sociedad, but the disconnection between cliente and persona (linked only through contrato) means you cannot directly query "which person is this customer" without joining through contrato.

---

## 7. Recommendations

### Priority: HIGH

| # | Recommendation | Rationale |
|---|---------------|-----------|
| H1 | **Decompose `explotacion` into 10-14 domain-specific config tables** | 350 columns is unmaintainable. Each domain (billing, collection, estimation, notification, etc.) should be a separate table with 1:1 FK to core explotacion |
| H2 | **Encrypt or hash all credential columns** | `cliwebpass`, `socpwdsms`, `socpwdcert`, `socpwdfirma`, `soctokenacua` are stored in plaintext. Use pgcrypto or application-level hashing |
| H3 | **Normalize contrato notification addresses** | Replace `cnttnotifprsid1/2` + `cnttnotifnumdir1/2` with a `contrato_notificacion` table |
| H4 | **Remove redundant phone columns from persona** | Consolidate `prstelef`, `prstelef2`, `prstelef3`, `prstelef4`, `prsfax` into the existing `personatel` table |
| H5 | **Add explicit FK constraints** | The schema appears to rely on naming conventions for FK relationships rather than database-enforced constraints (no REFERENCES clauses visible in the DDL) |

### Priority: MEDIUM

| # | Recommendation | Rationale |
|---|---------------|-----------|
| M1 | **Convert character(1) S/N flags to native boolean** | ~250+ columns across core tables use char(1) instead of PostgreSQL boolean |
| M2 | **Normalize facturable validation columns** | The ~10 `*val` suffix columns in facturable should be a separate `facturable_validation` table or use a before/after record pattern |
| M3 | **Add direct persona FK to cliente** | Currently persona and cliente are only linked through contrato, making customer-person lookups require a join through the contract |
| M4 | **Reduce contrato column count** | Extract GDPR flags (`cnttrgpdanonim`, `cnttbloqrgpd`), digital preferences (`cntttipenvfact`, `cnttsnenvefacmdia`, `cntttoken`), and payment roles (`cnttcpagador`, `cnttcreceptor`, `cnttcfiscal`, `cnttccomprador`) into separate tables |
| M5 | **Standardize nullable semantics** | Audit all nullable columns -- `persona.prsnombre` should be NOT NULL; `direccion.dircalid` should be NOT NULL when `dirtipo` indicates a structured address |

### Priority: LOW

| # | Recommendation | Rationale |
|---|---------------|-----------|
| L1 | **Standardize ID column precision** | Decide between numeric(5,0) and numeric(10,0) for different entity scales and document the convention |
| L2 | **Remove `dirtexto` denormalization** | Or explicitly mark it as a materialized/cached column with a trigger to keep it synchronized |
| L3 | **Fix `cnttnumsecpedido` type** | Change from `double precision` to `numeric` or `bigint` for an order sequence number |
| L4 | **Consider column naming reform** | While drastic, transitioning to more readable column names (e.g., `exp_billing_days_due` instead of `expdiasvencfact`) would dramatically improve developer experience |
| L5 | **Eliminate column numbering gaps** | Cosmetic but indicates dropped columns that may have orphaned references |

---

## 8. Cross-Table Pattern Summary

| Pattern | Tables Affected | Severity |
|---------|----------------|----------|
| God table (>100 cols) | explotacion (350), contrato (104), sociedad (84) | CRITICAL |
| Plaintext credentials | cliente, sociedad | HIGH |
| Denormalized data | factura.facclinif, direccion.dirtexto | MEDIUM |
| Repeating groups (1NF violation) | contrato (notif 1/2), persona (telef 1-4) | HIGH |
| Boolean as char(1) | All 9 core tables | MEDIUM |
| Missing FK constraints | All tables (convention-based only) | HIGH |
| Inconsistent nullability | persona, direccion, ptoserv | MEDIUM |
| i18n via txtid FKs | explotacion, sociedad, and many others | OK (good pattern) |
| Audit trail (hstusu/hsthora) | 7 of 9 core tables (missing in factura, facturable) | LOW |

---

## 9. Data Model Quality Score

**Score: 3.5 / 10**

| Criterion | Score | Weight | Justification |
|-----------|-------|--------|---------------|
| Normalization | 2/10 | 25% | explotacion (350 cols) is a textbook god table; contrato (104 cols) also overloaded; repeating groups in persona and contrato |
| Naming consistency | 6/10 | 15% | Internally consistent prefix convention, but extremely abbreviated and hard to read |
| Type safety | 4/10 | 15% | Pervasive use of char(1) instead of boolean; double precision for sequence numbers; plaintext password fields |
| Referential integrity | 3/10 | 20% | No visible FK constraints in DDL; relationships are convention-based only |
| Security | 2/10 | 10% | Multiple plaintext password/token columns across cliente and sociedad |
| Maintainability | 3/10 | 15% | 350-column tables are extremely difficult to maintain, document, or evolve; column gaps suggest ad-hoc evolution |

**Weighted Score:** (2*0.25) + (6*0.15) + (4*0.15) + (3*0.20) + (2*0.10) + (3*0.15) = 0.50 + 0.90 + 0.60 + 0.60 + 0.20 + 0.45 = **3.25 -> rounded to 3.5/10**

---

## 10. Source Files Referenced

- `/Users/fernandocamacholombardo/aqua/db_mapping/DATABASE_MAP.md` -- Master table of contents
- `/Users/fernandocamacholombardo/aqua/db_mapping/chunk_a.md` -- Tables A* (528 tables)
- `/Users/fernandocamacholombardo/aqua/db_mapping/chunk_bcd.md` -- Tables B*, C*, D* (254 tables)
- `/Users/fernandocamacholombardo/aqua/db_mapping/chunk_efg.md` -- Tables E*, F*, G* (165 tables)
- `/Users/fernandocamacholombardo/aqua/db_mapping/chunk_pqrs.md` -- Tables P*, Q*, R*, S* (294 tables)
