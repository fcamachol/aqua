# A4 - Infrastructure Domain Analysis
## AquaCIS Physical Infrastructure Data Model

**Agent:** A4 (db-infrastructure)
**Date:** 2026-02-16
**Scope:** Physical asset tables -- ptoserv, acometida, servicio, contador, equipo, zona, lote, and related supporting tables
**Schema:** cf_quere_pro

---

## Executive Summary

The AquaCIS physical infrastructure model follows the Aqualia/Aguas de Valencia (AquaCIS) enterprise pattern, structuring the water distribution network around a layered hierarchy: **zona** (geographic zones) > **libreta** (route books) > **ptoserv** (service points) > **servicio** (services) > **acometida** (connections) > **contador** (meters). This is a mature, production-grade model with 55 columns on the core `ptoserv` table alone, supporting meter reading logistics, disconnection management, fraud detection, and billing integration.

The model excels at meter lifecycle tracking and reading logistics -- its primary design purpose as a CIS. However, it shows notable gaps in modern GIS integration (coordinates stored as varchar strings, no spatial types), condition-based asset management, and predictive maintenance tracking. The system is firmly a **commercial/billing infrastructure model**, not a full engineering asset management system.

**Infrastructure Domain Health Score: 6.5 / 10**

The score reflects a strong commercial operational model with robust meter and service point tracking, offset by the absence of native spatial data types, limited condition assessment capabilities, no depreciation or asset valuation tracking, and minimal network topology representation.

---

## 1. Service Point Model

### 1.1 Core Structure: `ptoserv` (55 columns)

The service point (`ptoserv`) is the **central node** of the entire physical infrastructure model. It represents the physical location where water service is delivered, and virtually every other infrastructure entity references it.

**Key identity and location columns:**
| Column | Type | Purpose |
|--------|------|---------|
| `ptosid` | numeric(10) | Primary key -- unique service point identifier |
| `ptosdirid` | numeric(10) | FK to `direccion` -- physical address |
| `ptostetid` | numeric(5) | FK to text table for descriptions |
| `ptosexpid` | numeric(5) | Exploitation/business unit ID |
| `ptoszonid` | character(3) | FK to `zona` -- geographic zone assignment |
| `ptoslibcod` | numeric(5) | FK to `libreta` -- reading route book |
| `ptosemplid` | character(2) | FK to `emplazto` -- meter placement type |
| `ptoscodrec` | numeric(14) | Routing/reading order code (14-digit) |
| `ptosservid` | numeric(10) | FK to `servicio` -- linked service record |

**Operational state columns:**
| Column | Type | Purpose |
|--------|------|---------|
| `ptosestado` | numeric(5) | Service point state (active, inactive, cut off, etc.) |
| `ptostipsum` | numeric(5) | FK to `tiposumin` -- supply type (water, sewer, etc.) |
| `ptosfsucod` | numeric(5) | Supply source code |
| `ptosconcom` | character(1) | Community meter flag (S/N) |
| `ptocortpos` | character(1) | Cut-off possible flag |
| `ptossncontrat` | character(1) | Under contract flag (default 'S') |
| `ptosllaves` | numeric(5) | Number of keys/valves |
| `ptosllavecerrada` | character(1) | Valve closed indicator (default 'N') |
| `ptosvalvret` | character(1) | Return valve present |

**Fraud and compliance columns:**
| Column | Type | Purpose |
|--------|------|---------|
| `ptosposfraude` | character(1) | Possible fraud flag (default 'N') |
| `ptosestrategico` | character(1) | Strategic customer flag (default 'N') |
| `ptosnnoaccess` | character(1) | No access flag (default 'N') |
| `ptosnmalest` | character(1) | Bad condition flag (default 'N') |
| `ptosnoinsemisor` | character(1) | No transmitter installed |

**Disconnection management columns:**
| Column | Type | Purpose |
|--------|------|---------|
| `ptossncortdeud` | character(1) | Cut off for debt (default 'N') |
| `ptossncortprov` | character(1) | Provisional cut off (default 'N') |
| `ptossncortman` | character(1) | Manual cut off (default 'N') |
| `ptosfeccorte` | date | Cut-off date |
| `ptosfecreac` | date | Reactivation date |
| `ptosndesha` | character(1) | Uninhabited flag (default 'N') |

**Caliber and metering columns:**
| Column | Type | Purpose |
|--------|------|---------|
| `ptoscalcontra1` | numeric(5) | Contracted caliber 1 |
| `ptoscalcontra2` | numeric(5) | Contracted caliber 2 |
| `ptosaltcalimm` | numeric(5) | Alternate caliber (mm) |
| `ptosmtbcid` | numeric(5) | Meter battery count ID |
| `ptosnbocas` | numeric(5) | Number of taps/outlets |
| `ptosnmang` | numeric(5) | Number of hoses |

**Batch/batch-route columns:**
| Column | Type | Purpose |
|--------|------|---------|
| `ptosfilbat` | numeric(5) | Batch row number |
| `ptoscolbat` | numeric(5) | Batch column number |

### 1.2 Supporting Service Point Tables

**`ptoserclau` -- Service Point Classification/Tags:**
Links service points to classification codes (`pscclauid`) with temporal validity via session references (`pscsesalt`, `pscsesbaj`). Enables tagging service points with multiple concurrent classifications.

**`ptoservdoc` -- Service Point Documents:**
Associates documents (`psddconid`) with service points. Lightweight junction table for attaching scanned permits, photos, or contracts.

**`ptoservsecun` -- Secondary Service Points:**
Represents hierarchical relationships between service points (parent/child). Key columns:
- `pssptosid` / `pssrpsid`: Parent and child service point IDs
- `psscoefrep`: Distribution coefficient (numeric 6,3) for apportioning consumption
- `pssfecini` / `pssfecfin`: Temporal validity window
- `psssnrecibir`: Whether the secondary point receives bills (default 'S')
- `psstipovariableps`: Variable type for the secondary point

This supports **community meter decomposition** -- a single physical meter serving multiple units with consumption split by coefficients.

**`ptoscoment` -- Service Point Comments:**
Timestamped comment log with operator tracking. Contains reading observation codes (`ptcobscod`), action codes (`ptcacccod`), and remote reading flags (`ptcsntelelec`).

**`ptosbajlec` -- Service Points Below Reading Threshold:**
Tracks service points flagged during reading campaigns as below threshold. Links lot code (`pbllotcod`), contractor (`pblcontcod`), and operator (`pbloperid`).

**`hisptoserv` -- Service Point History (54 columns):**
Full audit trail mirror of `ptoserv`, capturing every state change with user/timestamp tracking (`hptoshstusu`, `hptoshsthora`). This is a complete snapshot-based history table.

**`hisptoserclau` -- Classification History:**
Temporal history of classification tag assignments and removals.

### 1.3 Service Point Architecture Assessment

The service point model is **well-designed for commercial operations**:
- The 14-digit `ptoscodrec` provides fine-grained reading route ordering
- Batch coordinates (`ptosfilbat`, `ptoscolbat`) enable grid-based physical mapping
- Three separate cut-off flags (`cortdeud`, `cortprov`, `cortman`) distinguish debt, provisional, and manual disconnections
- The `ptoservsecun` table with distribution coefficients handles community meter apportionment
- Comprehensive history tracking via `hisptoserv`

**Weaknesses:**
- No native GIS coordinates on `ptoserv` itself -- geographic location is derived through `direccion` > `dirgeolocid` > `geolocalizacion`
- The `ptosnmalest` ("bad condition") flag is a single boolean -- no structured condition scoring

---

## 2. Meter Management

### 2.1 Core Table: `contador` (30 columns)

The `contador` table represents the physical water meter device.

**Identity columns:**
| Column | Type | Purpose |
|--------|------|---------|
| `contid` | numeric(10) | Primary key -- meter internal ID |
| `contnumero` | character varying(12) | Physical serial number on the meter |
| `contdirid` | numeric(10) | FK to `direccion` -- installation address |
| `contmarcid` | numeric(5) | FK to `marcacont` -- manufacturer |
| `contmodid` | numeric(5) | FK to `modelcont` -- model |
| `contcalimm` | numeric(5) | FK to `calibre` -- meter caliber in mm |

**Lifecycle columns:**
| Column | Type | Purpose |
|--------|------|---------|
| `contfecins` | date | Installation date |
| `contfecbaj` | date | Removal/decommission date |
| `contestado` | numeric(5) | State code (active, removed, faulty, etc.) |
| `contanofab` | numeric(5) | Year of manufacture |
| `contsnprop` | character(1) | Utility-owned flag (S/N) |
| `contaveria` | character(1) | Faulty/broken flag (S/N) |

**Metering characteristics:**
| Column | Type | Purpose |
|--------|------|---------|
| `contnumesf` | numeric(5) | Number of dial faces/spheres |
| `contsegeid` | numeric(10) | Second sphere/dial ID |
| `contmodcomunic` | character varying(20) | Communication module type |
| `contsistelec` | numeric(5) | Tele-reading system ID |
| `contelec` | character(1) | Tele-reading enabled (default 'N') |
| `conttipotelec` | numeric(5) | Tele-reading technology type |
| `contsnactivarov` | character(1) | Activated OV flag (default 'N') |
| `contpdtemdm` | character(1) | Pending MDM sync (default 'N') |

**Precinct seal columns:**
| Column | Type | Purpose |
|--------|------|---------|
| `contprecsusp` | character(1) | Precinct seal suspended |
| `contnumprecsusp` | character(10) | Seal suspension number |
| `contfecprecsusp` | date | Seal suspension date |
| `contfecdprecsusp` | date | Seal suspension end date |
| `contprecseg` | character(1) | Secondary seal |
| `contnumprecseg` | character(10) | Secondary seal number |

### 2.2 Meter Lifecycle Support Tables

**`marcacont` -- Meter Manufacturers:**
Lookup with `marcid`, `marcdesc` (20 chars), active/inactive flag (`marcbaja`), and RCU grouping code (`marcrcuid`).

**`modelcont` -- Meter Models (11 columns):**
Links brand to model with technical specifications:
- `modtipesf` (character 2): Dial type
- `moddigit` (numeric 5): Number of digits
- `modtcnid`: FK to `tipocontador` -- meter type classification
- `modsntelecintegrada`: Integrated tele-reading flag
- `modtipotelec`: Tele-reading technology type

**`calibre` -- Meter Calibers:**
Simple lookup table with `calimm` (caliber in mm), `calieqpul` (equivalent in inches), and active flag.

**`modcontcali` -- Model/Caliber/Flow Rates:**
Cross-reference linking manufacturer (`mccmarcid`), model (`mccmodid`), and caliber (`mcccalimm`) with flow rate (`mcccaudal`) and pulse weight (`mccpulso`). Essential for consumption calculation validation.

**`tipocontador` -- Meter Types:**
Classification of meter types with `tcntplote` flag (lot type for reading campaigns) and `tcntipo` (type category).

**`contmodlec` -- Meter Reading Modality:**
Tracks changes in how a meter is read over time:
- `cmlcontid`: FK to `contador`
- `cmlfecini` / `cmlfecfin`: Validity period
- `cmlmodalidad`: Reading modality code (manual, tele-reading, etc.)

**`hiscontado` -- Meter History (34 columns):**
Complete snapshot-based audit trail of meter state. Includes denormalized brand/model descriptions (`hccmarcdesc`, `hccmoddesc`) and address text (`hccdirtexto`) for point-in-time reconstruction.

### 2.3 Meter-Reading Integration

The reading system operates through **lote** (reading lots/batches), which organize meters into reading campaigns:

**`lote` -- Reading Lots (26 columns):**
| Column | Type | Purpose |
|--------|------|---------|
| `lotcod` | character(12) | Primary key -- lot code (12-char structured) |
| `lotplecexpid` | numeric(5) | Exploitation ID |
| `lotpleczonid` | character(3) | Zone ID |
| `lotpleclibcod` | numeric(5) | Route book code |
| `lotplecanno` | numeric(5) | Year |
| `lotplecperiid` | numeric(5) | Period ID |
| `lottipo` | character(1) | Lot type (reading, billing, etc.) |
| `lotnumero` | numeric(5) | Sequence number |
| `lotestado` | numeric(5) | Lot state |
| `lotnumabo` | numeric(5) | Number of subscribers in lot |
| `lotnumctde` | numeric(5) | Number of meters to read |
| `lotnumctdi` | numeric(5) | Meters not read count |
| `lotreppda` | character(1) | PDA/mobile replenishment (default 'N') |
| `lotsntelelec` | character(1) | Tele-reading lot (default 'N') |
| `lotcontsinlectura` | numeric(5) | Meters without reading count |
| `lotcontlecfuermargen` | numeric(5) | Readings outside margin count |

**`lotecamb` -- Meter Replacement Lots:**
Organizes meter replacement campaigns with routing codes (`ltccodrecd`, `ltccodrech`), emission dates, and communication dates. Links to `pcsid` for work order integration.

**`lotpetcam` -- Meter Replacement Requests:**
Individual meter replacement requests within a lot, tracking:
- Service point (`lpetptosid`) and meter (`lpetconid`)
- Priority (`lpetpriori`)
- Number of dials (`lpetnumesf`)
- State tracking (`lpetestado`)

**`infolecturas` -- Reading Information View/Materialized Table:**
Denormalized reading summary per contract/meter with zone description, address text, caliber, placement type, observer notes, and previous period readings. This appears to be a reporting/operational view.

### 2.4 Meter Lifecycle Assessment

The meter lifecycle model covers:
1. **Procurement**: Manufacturer, model, caliber, year of manufacture
2. **Installation**: Installation date, placement type, address
3. **Operation**: Reading modality tracking, tele-reading integration, seal management
4. **Replacement**: Lot-based replacement campaigns, old/new meter tracking via `orden`
5. **Removal**: Decommission date, state tracking
6. **History**: Full snapshot audit trail

**What is well-handled:**
- Complete manufacturer/model/caliber reference hierarchy
- Tele-reading integration with MDM (Meter Data Management) system flags
- Seal/precinct management for regulatory compliance
- Lot-based reading campaign logistics
- Replacement campaign workflow

**What is missing:**
- No metrological test/verification result storage
- No age-based replacement policy enforcement columns
- No degradation or accuracy tracking over time
- No direct link between meter and GIS location (must go through `direccion`)

---

## 3. Connection Model (Acometida)

### 3.1 Core Table: `acometida` (35 columns)

The `acometida` represents the physical pipe connection from the distribution main to the customer premises.

**Identity and location:**
| Column | Type | Purpose |
|--------|------|---------|
| `acoid` | numeric(10) | Primary key |
| `acodirid` | numeric(10) | FK to `direccion` -- address |
| `acoexpid` | numeric(5) | Exploitation/business unit |
| `acoptosid` | numeric(10) | FK to `ptoserv` -- linked service point |

**Physical characteristics:**
| Column | Type | Purpose |
|--------|------|---------|
| `acomatcod` | character(4) | FK to `material` -- pipe material code |
| `acotipvalc` | character(4) | Valve type code |
| `acocalmat` | numeric(5) | Material caliber |
| `acocalval` | numeric(5) | Valve caliber |
| `acocalimm` | numeric(5) | Caliber in mm (primary) |
| `acocalimm2` | numeric(5) | Secondary caliber in mm |
| `acolong` | double precision | Pipe length |
| `acocaudal` | numeric(6,2) | Flow rate |
| `acopresmin` | numeric(6,2) | Minimum pressure |
| `acopresmax` | numeric(6,2) | Maximum pressure |
| `aconumviv` | numeric(5) | Number of dwellings served |

**Lifecycle columns:**
| Column | Type | Purpose |
|--------|------|---------|
| `acofecins` | date | Installation date (NOT NULL) |
| `acofectap` | date | Capping/closing date |
| `acoestado` | numeric(5) | State code |
| `acotipo` | numeric(5) | Connection type |
| `acosndig` | character(1) | Digital/modern connection flag |

**Network topology references:**
| Column | Type | Purpose |
|--------|------|---------|
| `acoschid` | numeric(5) | FK to `sechidraulico` -- hydraulic sector |
| `acosshid` | numeric(10) | FK to `subsechidra` -- hydraulic sub-sector |
| `acoacoidprov` | numeric(10) | Provisional connection reference (self-FK) |
| `acorvaid` | numeric(10) | Network valve reference |

**PEP references (work orders/projects):**
| Column | Type | Purpose |
|--------|------|---------|
| `acopep` | character varying(15) | Project element code |
| `acopepreno` | character varying(15) | Renovation PEP code |
| `acopeptapo` | character varying(15) | Capping PEP code |

### 3.2 Connection History: `hisacometida` (37 columns)

Full audit trail with all `acometida` fields prefixed with `haco`, plus:
- `hacodireccion` (varchar 110): Denormalized address text at time of change
- `hacoindunif`: Unification indicator

### 3.3 Hydraulic Sector Organization

**`sechidraulico` -- Hydraulic Sectors:**
| Column | Type | Purpose |
|--------|------|---------|
| `schid` | numeric(5) | Sector ID |
| `schdesc` | character varying(50) | Description |
| `schexpid` | numeric(5) | Exploitation ID |
| `schsngestint` | character(1) | Internal management flag |
| `schcodgis` | character varying(50) | GIS system cross-reference code |

**`subsechidra` -- Hydraulic Sub-sectors:**
| Column | Type | Purpose |
|--------|------|---------|
| `sshid` | numeric(10) | Sub-sector ID |
| `sshdesc` | character varying(50) | Description |
| `sshexpid` | numeric(5) | Exploitation ID |
| `sshcodgis` | character varying(50) | GIS system cross-reference code |

Both tables include `codgis` columns, establishing that the system expects GIS integration through external reference codes rather than native spatial data.

### 3.4 Connection to Service Hierarchy

**`servicio` -- Service Record (43 columns):**
The `servicio` table sits between `acometida` and `ptoserv`, representing the contractual/logical service instance:

| Column | Type | Purpose |
|--------|------|---------|
| `serid` | numeric(10) | Primary key |
| `serdirid` | numeric(10) | FK to `direccion` |
| `seracoid` | numeric(10) | FK to `acometida` -- physical connection |
| `serptosid` | numeric(10) | FK to `ptoserv` -- service point |
| `serconid` | numeric(10) | FK to `contador` -- associated meter |
| `serproext` / `serproint` | numeric(5) | External/internal property numbers |
| `seredif` | character varying(25) | Building identifier |
| `seraport` | double precision | Contribution/apportionment factor |
| `serindced` | character(1) | Ceded indicator |
| `sercorte` | character(1) | Cut-off state |
| `sersnactivo` | character(1) | Active flag |
| `sertipo` | numeric(5) | Service type |
| `sernumviv` | numeric(10) | Number of dwellings |
| `sertelec` | character(1) | Tele-reading flag (default 'N') |
| `serllaves` | numeric(5) | Number of keys |

The `servicio` table therefore creates the critical relationship chain:

```
contrato (contract) --> ptoserv (service point) --> servicio (service) --> acometida (connection) --> contador (meter)
```

### 3.5 Connection Model Assessment

**Strengths:**
- Physical pipe attributes are well-modeled (material, caliber, length, pressure range, flow rate)
- Hydraulic sector/sub-sector hierarchy provides network segmentation
- GIS cross-reference codes on hydraulic sectors
- PEP (project element) codes link connections to capital projects
- Provisional connection tracking (`acoacoidprov`) supports phased construction
- Comprehensive history tracking

**Weaknesses:**
- No pipe condition assessment fields (age-based deterioration, leak history, soil conditions)
- No upstream/downstream network topology (connection does not reference which main it connects to)
- Material code is 4-character code with no apparent vintage/grade distinction
- Pressure values are static fields, not linked to real-time monitoring

---

## 4. Equipment Tracking

### 4.1 Core Table: `equipo` (21 columns)

The `equipo` table tracks **tele-reading equipment** -- electronic modules attached to meters, not general infrastructure equipment.

| Column | Type | Purpose |
|--------|------|---------|
| `eqid` | numeric(10) | Primary key |
| `eqtecno` | numeric(5) | Technology type |
| `eqpremontado` | character(1) | Pre-mounted flag (default 'N') |
| `eqvmodelo` | numeric(10) | FK to `modelequip` -- equipment model |
| `eqpesopulso` | numeric(10) | Pulse weight |
| `eqvhfmodulo` | character varying(16) | VHF module serial number |
| `eqimeterequipo` | character varying(15) | iMeter equipment ID |
| `eqimeteroptions` | numeric(10) | iMeter options code |
| `eqbusserie` | character varying(7) | Bus serial number |
| `eqinstalado` | character(1) | Installed flag (default 'N') |
| `eqlectinicial` | numeric(10) | Initial reading at installation |
| `eqfechainstala` | timestamp | Installation date/time |
| `eqpulsoemi` | numeric(5,1) | Emitted pulse value |
| `eqlwmodulo` | character varying(50) | LoRaWAN module ID |
| `eqmarcatelec` | numeric(5) | FK to `marcaequipotelec` -- tele-reading brand |
| `eqmodeltelec` | numeric(5) | FK to `modelequipotelec` -- tele-reading model |
| `eqclaveadic` | character varying(50) | Additional key/code |
| `eqbusnbiotserie` | character varying(50) | NB-IoT bus serial |
| `eqsndeportado` | character(1) | Deported/relocated flag |

### 4.2 Equipment Reference Tables

**`marcaequipotelec` -- Tele-reading Equipment Brands:**
Simple lookup with `marceqtlid`, description, and active flag.

**`modelequipotelec` -- Tele-reading Equipment Models (9 columns):**
Links brand to model with technology type (`modeqtltiptelec`), deported flag, and regex validation pattern (`modeqtlvalregex`) for serial number format validation.

**`modelequip` -- Equipment Models:**
Generic equipment model with description, options code, and pulse emission value.

**`marmodeq` -- Brand/Model/Equipment Cross-Reference:**
Links `marcacont` brand, `modelcont` model, `calibre`, and specific `equipo` record. This is the junction that connects a physical meter to its electronic module.

### 4.3 Equipment Tracking Assessment

The `equipo` table is **narrowly focused on tele-reading modules** (VHF, LoRaWAN, NB-IoT, iMeter). It does not serve as a general-purpose asset register. Key observations:

- **Multi-protocol support**: VHF (`eqvhfmodulo`), LoRaWAN (`eqlwmodulo`), NB-IoT (`eqbusnbiotserie`) -- evidence of technology evolution
- **No general equipment tracking**: Pumps, valves, hydrants, tanks are not tracked in this table
- **No maintenance scheduling**: No columns for next service date, warranty expiry, or maintenance intervals
- **No condition tracking**: No degradation score or battery level fields
- **Missing asset cost/value**: No purchase cost, depreciation, or replacement value

---

## 5. Geographic Organization

### 5.1 Zone Model: `zona` (11 columns)

| Column | Type | Purpose |
|--------|------|---------|
| `zonexpid` | numeric(5) | Exploitation/business unit (composite PK) |
| `zonid` | character(3) | Zone code (composite PK) -- 3-char alphanumeric |
| `zonperid` | numeric(5) | Period ID for billing cycle |
| `zondescrip` | character varying(30) | Zone description |
| `zoncontcod` | numeric(5) | Contractor code for the zone |
| `zonsnmpaa` | character(1) | Allow advance readings (default 'S') |
| `zonsnpa` | character(1) | Allow PA process (default 'N') |
| `zonsnpua` | character(1) | Allow PUA process (default 'S') |
| `zonsnactiva` | character(1) | Active flag (default 'S') |
| `zonsncerautfto` | character(1) | Auto-close photo flag (default 'N') |
| `zonsnple` | character varying(1) | PLE flag (default 'N') |

### 5.2 Route Organization: `libreta` (19 columns)

The `libreta` (route book) is the operational subdivision within a zone:

| Column | Type | Purpose |
|--------|------|---------|
| `libexpid` | numeric(5) | Exploitation ID (composite PK) |
| `libzonid` | character(3) | Zone ID (composite PK) |
| `libcod` | numeric(5) | Book code (composite PK) |
| `libdesc` | character varying(50) | Description |
| `libsnrep` | character(1) | Replenishment flag |
| `libnabolot` | numeric(5) | Subscribers per lot |
| `libmulabob` | numeric(5) | Multiple subscriber count |
| `libdiasgenlot` | numeric(5) | Days to generate lot |
| `libcascoid` | numeric(5) | Cascade ordering ID |
| `libbateria` | numeric(5) | Battery position (number of batteries) |
| `libnobateria` | numeric(5) | Non-battery count |
| `libcerrados` | numeric(5) | Closed/sealed count |
| `libnumjorn` | numeric(5) | Number of working days (default 1) |
| `libcoefcorr` | numeric(5,3) | Correction coefficient |
| `libsnestimnl` | character(1) | Non-reading estimation flag |

### 5.3 Geographic Hierarchy

The complete geographic/operational hierarchy is:

```
Exploitation (expid)
  +-- Zona (zonid, 3-char)
       +-- Libreta (libcod, route book)
            +-- Ptoserv (ptoscodrec, 14-digit reading order)
                 +-- Servicio
                      +-- Acometida (acoschid -> sechidraulico)
                           +-- Subsechidra (hydraulic sub-sector)
```

This is primarily an **operational/reading-campaign hierarchy** rather than a physical network topology. The zone/book/route structure is designed to optimize meter reading logistics.

### 5.4 Address and Geolocation

**`direccion` -- Address (23 columns):**
Structured address with street (`dircalid` FK to `calle`), building number (`dirfinca`), block/staircase/floor/door (`dirbloque`/`direscal`/`dirplanta`/`dirpuerta`), postal code, locality, and full text representation (`dirtexto`).

Critical for GIS: `dirgeolocid` (numeric 10) -- FK to `geolocalizacion`.

**`geolocalizacion` -- Geolocation (8 columns):**
| Column | Type | Purpose |
|--------|------|---------|
| `geolocid` | numeric(10) | Primary key |
| `geoloclong` | character varying(30) | Longitude (stored as string!) |
| `geoloclat` | character varying(30) | Latitude (stored as string!) |
| `geolocaltitud` | character varying(30) | Altitude (stored as string!) |
| `geoloctipogps` | numeric(5) | GPS type code |
| `geoloctipocodificacion` | numeric(5) | Encoding type (coordinate system) |
| `geolocfechacaptura` | timestamp | Capture date/time |
| `geolocorigen` | numeric(5) | Origin/source (default 1) |

### 5.5 Geographic Model Assessment

**Strengths:**
- Clean zone/book/route hierarchy for operational logistics
- Contractor assignment per zone enables outsourced reading
- Period assignment per zone supports billing cycle management
- Address model is well-structured with Spanish cadastral conventions

**Critical weaknesses:**
- **Coordinates stored as VARCHAR(30)**: Not using PostGIS `geometry` or `geography` types despite running on PostgreSQL. This prevents spatial queries, proximity searches, and map rendering directly from the database
- **Encoding ambiguity**: `geoloctipocodificacion` suggests multiple coordinate systems may be mixed (WGS84, UTM, etc.) without standardization
- **Altitude as string**: Cannot perform elevation-based analysis
- **No spatial indexing**: Without geometry types, no GiST/SP-GiST indexes for spatial queries
- **No service area polygons**: Zones are code-based, not polygon-based -- cannot perform point-in-polygon analysis

---

## 6. Asset Lifecycle Gaps

### 6.1 What Exists

| Lifecycle Phase | Coverage | Tables |
|----------------|----------|--------|
| Procurement/Specification | Partial | `marcacont`, `modelcont`, `calibre`, `modcontcali` |
| Installation | Good | `contfecins`, `acofecins`, `eqfechainstala` |
| Operation | Good | `contestado`, `acoestado`, `ptosestado` |
| Reading/Monitoring | Excellent | `lote`, `infolecturas`, `contmodlec` |
| Replacement | Good | `lotecamb`, `lotpetcam`, `orden` |
| Removal | Basic | `contfecbaj`, `acofectap` |
| History/Audit | Excellent | `hiscontado`, `hisacometida`, `hisptoserv` |

### 6.2 What is Missing

| Gap | Impact | Severity |
|-----|--------|----------|
| **Condition assessment scoring** | Cannot prioritize replacement based on asset health | HIGH |
| **Maintenance work history** | No record of repairs, cleaning, or preventive maintenance per asset | HIGH |
| **Asset valuation/depreciation** | Cannot calculate asset book value or replacement cost | MEDIUM |
| **Failure mode tracking** | No structured failure cause classification | MEDIUM |
| **Warranty management** | No warranty start/end dates, claim tracking | MEDIUM |
| **Metrological testing** | No meter accuracy test results over time | MEDIUM |
| **Pipe condition grading** | No corrosion, leak rate, or soil condition per connection | HIGH |
| **Preventive maintenance scheduling** | No planned maintenance intervals or triggers | HIGH |
| **Asset photographs** | `ptosfecfoto` date exists but no photo storage/reference | LOW |
| **Network topology (graph)** | No upstream/downstream pipe connectivity | MEDIUM |
| **Real-time telemetry** | Static pressure fields, no time-series sensor data integration | LOW |
| **Environmental/regulatory compliance** | No lead pipe, asbestos, or water quality tracking | MEDIUM |

---

## 7. Integration Points

### 7.1 Infrastructure to Billing

The primary integration path is:

```
ptoserv.ptosid --> contrato.cnttptosid (contract references service point)
contrato.cntttctcod --> tipocontratcn (contract type)
contrato.cnttusocod --> uso (usage type)
ptoserv.ptostipsum --> tiposumin (supply type affects tariff)
calibretarifa links caliber to tariff rates
```

The `contrato` table (68 columns) directly references `ptoserv` via `cnttptosid`, creating the commercial-to-physical bridge. Billing needs service point state (`ptosestado`), cut-off status, and supply type.

### 7.2 Infrastructure to Meter Reading

```
zona.zonid --> libreta.libzonid --> ptoserv.ptoszonid + ptoslibcod
ptoserv.ptoscodrec (14-digit route code for reading order)
lote organized by zone/book/period
infolecturas provides denormalized reading context
```

### 7.3 Infrastructure to Work Orders

The `orden` table (44 columns) is the work order system:
- `ordptosid` --> FK to `ptoserv`
- `ordcontvie` / `ordcontnue` --> Old/new meter IDs for replacements
- `ordlecvie1/2` / `ordlecnue1/2` --> Old/new readings at replacement
- `ordtpoid` --> FK to `tipoorden` (order type)
- `ordmvoid` --> Movement/action type
- `ordestado` --> Order state
- `ordemplidvie/nue`, `ordfilbatvie/nue`, `ordcolbatvie/nue` --> Old/new placement coordinates
- `ordtipofraude` --> Fraud type (when relevant)

Supporting tables:
- `ordenestad` -- Order state history
- `ordenvisit` -- Visit scheduling with date/time windows
- `ordenrel` -- Parent/child order relationships
- `ordenreapertura` -- Reopening/reactivation orders

### 7.4 Infrastructure to Customer

```
contrato.cnttcliid --> cliente (customer)
contrato.cnttfprsid / cnttcprsid --> persona (fiscal/contact persons)
contpersautoriz --> authorized persons per contract
contpersautgest --> authorized management persons
```

### 7.5 Infrastructure to Fraud Detection

```
ptoserv.ptosposfraude (possible fraud flag)
contrato.cnttsnfraude (fraud flag on contract)
loteinspeccionfrau (fraud inspection lots -- 41 columns, highly detailed)
orden.ordtipofraude (fraud type on work orders)
estadofraude (fraud state lookup)
```

The fraud detection integration is notably sophisticated, with `loteinspeccionfrau` supporting complex selection criteria including hydraulic sectors, consumption patterns, meter age, and geographic targeting.

### 7.6 Infrastructure to Complaints/Claims

```
orden --> queja/reclamacion (through work order linkage)
contprocrecl --> links contracts to complaint processes
ptoserv comments (ptoscoment) can flag issues
```

---

## 8. Recommendations

### HIGH Priority

**H1. Implement PostGIS Spatial Data Types**
Replace `geolocalizacion.geoloclong/geoloclat` (varchar) with PostGIS `geometry(Point, 4326)` column. This single change would enable:
- Spatial indexing (GiST) for proximity queries
- Service area polygon boundaries for zones
- Distance calculations for leak detection correlation
- Map-based visualization directly from the database
- Estimated effort: Moderate (schema migration + application layer changes)

**H2. Add Structured Condition Assessment**
Create an `asset_condition` table to replace the binary `ptosnmalest` flag:
- Asset type (meter, connection, service point)
- Condition score (1-5 or 1-10)
- Assessment date
- Inspector ID
- Defect classification codes
- Photo references
- Next assessment due date

**H3. Implement Maintenance History Tracking**
Create a `maintenance_event` table linked to all physical assets (ptoserv, acometida, contador):
- Event type (repair, preventive, inspection)
- Date/duration
- Cost
- Parts used
- Outcome/resolution
- Linked work order (`ordid`)

**H4. Add Pipe Condition and Risk Fields to `acometida`**
Extend with:
- Pipe age calculation (currently derivable from `acofecins`)
- Soil corrosivity classification
- Leak history count
- Condition grade
- Last inspection date
- Estimated remaining useful life

### MEDIUM Priority

**M1. Meter Accuracy and Testing Tracking**
Add a `meter_test` table to track:
- Test date
- Test type (laboratory, field)
- Flow rates tested (Q1, Q2, Q3, Q4)
- Error percentages at each flow rate
- Pass/fail determination
- Regulatory certificate reference

**M2. Asset Valuation Module**
Add to `acometida` and `contador`:
- Purchase/installation cost
- Replacement cost estimate
- Depreciation method
- Book value (calculated)
- Useful life (years)

**M3. Network Topology Enhancement**
Add to `acometida`:
- `aco_main_pipe_id` -- FK to distribution main
- `aco_upstream_node` / `aco_downstream_node` -- graph topology
- This would enable hydraulic modeling integration

**M4. Standardize Coordinate System**
Enforce WGS84 (SRID 4326) across all `geolocalizacion` records. The current `geoloctipocodificacion` column suggests mixed systems.

**M5. Environmental Compliance Fields**
Add to `acometida`:
- Lead pipe indicator
- Asbestos content indicator
- Last water quality sample date
- Regulatory compliance status

### LOW Priority

**L1. Photo/Document Management Enhancement**
Expand `ptoservdoc` to include:
- Document type classification
- GPS-tagged photo capture metadata
- Thumbnail storage or external storage references
- Version tracking

**L2. Real-Time Telemetry Integration**
Design a time-series extension (or link to external TSDB) for:
- Continuous pressure readings
- Flow rate monitoring
- Temperature sensors
- Battery levels on tele-reading equipment

**L3. Equipment Generalization**
Extend `equipo` beyond tele-reading modules to track:
- Pressure reducers
- Backflow preventers
- Fire hydrants
- Valves on distribution mains
- Or create a parallel `asset_register` table for general infrastructure

---

## 9. Infrastructure Domain Health Score: 6.5 / 10

| Dimension | Score | Weight | Notes |
|-----------|-------|--------|-------|
| Data model completeness (CIS scope) | 8/10 | 25% | Excellent for commercial operations |
| Asset lifecycle coverage | 6/10 | 20% | Good install/remove, weak maintenance |
| Geographic/GIS capability | 4/10 | 15% | Coordinates exist but as strings, no spatial types |
| Network topology | 3/10 | 10% | Flat connections, no graph structure |
| Meter management depth | 8/10 | 15% | Strong reading logistics, weak metrological testing |
| History/audit trail | 9/10 | 10% | Full snapshot history on all major tables |
| Integration readiness | 7/10 | 5% | Well-connected to billing, work orders, fraud |

**Weighted Score: 6.5 / 10**

The system is an effective **commercial infrastructure manager** -- it knows where meters are, how to read them, how to bill for them, and how to replace them. It is not an **engineering asset management** system -- it does not track asset condition, maintenance history, network hydraulics, or spatial relationships with the rigor required for modern utility asset management (ISO 55000).

---

## Appendix: Key Table Summary

| Table | Columns | Role |
|-------|---------|------|
| `ptoserv` | 55 | Central service point -- physical delivery location |
| `hisptoserv` | 54 | Service point audit history |
| `ptoservsecun` | 10 | Community meter parent/child relationships |
| `ptoserclau` | 6 | Service point classification tags |
| `ptoscoment` | 14 | Timestamped service point comments |
| `servicio` | 43 | Logical service linking connection to service point |
| `acometida` | 35 | Physical pipe connection |
| `hisacometida` | 37 | Connection audit history |
| `contador` | 30 | Water meter device |
| `hiscontado` | 34 | Meter audit history |
| `contmodlec` | 4 | Meter reading modality changes |
| `equipo` | 21 | Tele-reading electronic module |
| `zona` | 11 | Geographic/operational zone |
| `libreta` | 19 | Reading route book within zone |
| `lote` | 26 | Reading campaign lot/batch |
| `lotecamb` | 12 | Meter replacement lot |
| `lotpetcam` | 10 | Individual meter replacement request |
| `contrato` | 68 | Contract (bridge to billing) |
| `orden` | 44 | Work order |
| `direccion` | 23 | Structured physical address |
| `geolocalizacion` | 8 | GPS coordinates (varchar-based) |
| `sechidraulico` | 7 | Hydraulic sector with GIS code |
| `subsechidra` | 4 | Hydraulic sub-sector with GIS code |
| `marcacont` | 6 | Meter manufacturer lookup |
| `modelcont` | 11 | Meter model lookup |
| `calibre` | 6 | Meter caliber lookup |
| `modcontcali` | 5 | Model/caliber/flow cross-reference |
| `material` | 3 | Pipe material lookup |
| `emplazto` | 7 | Meter placement type lookup |
| `tiposumin` | 12 | Supply type lookup |
| `tipocontador` | 4 | Meter type classification |
| `tipoorden` | 11 | Work order type lookup |
