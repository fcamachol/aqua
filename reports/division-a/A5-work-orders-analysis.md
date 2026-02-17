# A5 - Work Orders & Operations Domain Analysis

## Executive Summary

The AquaCIS operations domain manages the full lifecycle of field work orders, customer claims/debt management, and fraud investigation through three primary entity clusters: **orden** (work orders, 44 columns), **gestreclam** (claims management, 22 columns), and **expedsif** (fraud investigation, 64 columns). The work order system is well-structured with clear lifecycle states tracked in `ordenestad`, visit scheduling in `ordenvisit`, and integration with an external SGO system via API. The fraud investigation module (`expedsif`) is the most complex single entity in this domain with 64 columns covering detection, liquidation, legal proceedings, and workflow tracking. Claims management follows a process-step paradigm through `gestreclam` linked to the `proceso`/`pasoproced` workflow engine. Overall, the domain is mature but exhibits moderate coupling, limited explicit SLA enforcement at the database level, and some gaps in crew/resource assignment granularity.

**Operations Domain Health Score: 6.5 / 10**

---

## 1. Work Order Lifecycle

### 1.1 Core Entity: `orden` (44 columns)

The `orden` table is the central work order entity. Key columns and their roles in the lifecycle:

| Column | Type | Role |
|--------|------|------|
| `ordid` | numeric(10) PK | Unique work order identifier |
| `ordtpoid` | numeric(5) NOT NULL | Order type (FK to `tipoorden.tpoid`) |
| `ordptosid` | numeric(10) NOT NULL | Service point (physical location of work) |
| `ordpccid` | numeric(10) | Collection management link |
| `ordgesid` | numeric(10) | Claims management link (FK to `gestreclam.gesid`) |
| `ordpolnum` | numeric(10) | Policy/account number |
| `ordmvoid` | numeric(5) NOT NULL | Order motive/reason (FK to `motordenes.mvoid`) |
| `ordestado` | numeric(5) NOT NULL | Current state code |
| `ordseqestado` | numeric(5) NOT NULL, default 1 | State sequence counter |
| `ordfecestfin` | date | Estimated completion date |
| `ordoficina` | numeric(5) NOT NULL, default 0 | Office originating the order |
| `ordgotid` | varchar(36) | External GOT/SGO system identifier (UUID format) |
| `ordsnexterna` | char(1) NOT NULL, default 'N' | Flag: external order (from SGO) |
| `ordrefexterna` | varchar(15) | External reference number |
| `ordtipofraude` | numeric(5) | Fraud type link (FK to `tipfraude`) |
| `ordfactrep` | char(1) NOT NULL | Repair invoice flag |
| `ordtrepid` | numeric(5) | Repair type |
| `ordexpany` | numeric(5) | File/expedition year |
| `ordexpnum` | varchar(20) | File/expedition number |
| `ordhstusu` | varchar(10) NOT NULL | Audit: last user |
| `ordhsthora` | timestamp NOT NULL, default NOW | Audit: last timestamp |

### 1.2 Lifecycle Flow

```
[Creation] --> [Assignment] --> [Visit Scheduled] --> [Visit Executed] --> [Resolution] --> [Closed]
     |              |                                        |                  |
     |              +-- ordestado changes tracked            |                  |
     |                  in ordenestad                        |                  |
     |                                                      |                  |
     +-- Via API: crearOrdenTrabajo                         |                  |
     +-- Via API: crearOrdenExterna (SGO)                   |                  |
     +-- Manual creation (mvosnmanual='S')                  |                  |
                                                            |                  |
                                            informarVisita API          resolveOT API
                                            (ordenvisit record)     (final solution, elements,
                                                                     equipment changes)
```

**Stage 1 - Creation:**
- Work orders are created internally or via `crearOrdenTrabajo` API (returns code like `O4514415`).
- External orders from SGO use `crearOrdenExterna` API, setting `ordsnexterna='S'` and populating `ordgotid` with the external UUID.
- Required inputs: `tipoOrden`, `motivoOrden`, `idPtoServicio`, `numContrato`, `fechaEstimadaFin`.
- Motives defined in `motordenes` table, constrained by order type via `motordenes.mvotpoid`.

**Stage 2 - Assignment:**
- The operator/contractor is referenced indirectly through visit assignment.
- `ordoficina` designates the responsible office.
- `contratist` table holds contractor details (`ctracod`, `ctradesc`, `ctrasnpropio` for in-house vs external).

**Stage 3 - Visit Scheduling & Execution:**
- `ordenvisit` tracks scheduled visits with appointment windows:
  - `orvfeccita` / `orvhorcitd` / `orvhorcith`: appointment date and time range
  - `orvfecvisi` / `orvhorvisi`: actual visit date/time
  - `orvcontcod`: contractor code performing the visit
  - `orvoperid`: specific operator/technician ID
  - `orvcontcod` references `contratist.ctracod`; `orvoperid` references `operleccam.olcoperid`

**Stage 4 - Resolution:**
- `resolveOT` API captures: final solution code, non-execution motive, executor details, meter elements installed/retired, equipment changes, geolocation.
- Old/new meter readings tracked: `ordlecvie1/2` (old meter), `ordlecnue1/2` (new meter).
- Old/new meter identifiers: `ordcontvie` (old counter ID), `ordcontnue` (new counter ID).
- Battery position: `ordfilbatvie/ordcolbatvie` (old), `ordfilbatnue/ordcolbatnue` (new).
- Observation code: `ordobscod` (FK to `observac.obscod`).

**Stage 5 - Closure & Reopening:**
- State finalization tracked via `ordestado` and `ordseqestado`.
- `ordenreapertura` table manages reopenings with date ranges (`oreafecini`, `oreafecfin`) and variable/concept links.

### 1.3 State History: `ordenestad`

Every state transition is logged:

| Column | Type | Role |
|--------|------|------|
| `oreordid` | numeric(10) | Order FK |
| `oreestado` | numeric(5) | State code reached |
| `oreoficina` | numeric(5) | Office recording the change |
| `orehstusu` | varchar(10) | User making the change |
| `orehsthora` | timestamp | Timestamp of change |
| `oreseqestado` | numeric(5) | Sequence number |

This provides a full audit trail of all state transitions per work order.

### 1.4 Related Work Orders: `ordenrel`

| Column | Type | Role |
|--------|------|------|
| `ordrelp` | numeric(10) | Parent order ID |
| `ordrelh` | numeric(10) | Child/related order ID |
| `ordreltip` | numeric(5) | Relationship type code |

Enables parent-child and dependency relationships between orders.

### 1.5 Annulment of Collections: `ordenanucob`

| Column | Type | Role |
|--------|------|------|
| `oracgscid` | numeric(10) | Collection management ID (FK to `gescartera.gscid`) |
| `oracordid` | numeric(10) | Order ID |
| `oracestado` | numeric(5) | State |

Links work orders to collection annulment processes.

---

## 2. Order Classification

### 2.1 Order Types: `tipoorden`

| Column | Type | Role |
|--------|------|------|
| `tpoid` | numeric(5) PK | Type identifier |
| `tpotxtid` | numeric(10) | Multilingual text descriptor |
| `tposninscon` | char(1), default 'N' | Requires meter installation |
| `tpoorigen` | numeric(5), default 1 | Origin classification |
| `tposnformpropio` | char(1), default 'N' | Has custom form |
| `tpoprioridad` | char(1) | Priority level (single character) |
| `tposncontrat` | char(1) | Requires contract |
| `tponumlect` | numeric(5) | Number of readings expected |
| `tpovalnhc` | char(1), default 'N' | Validate no-habitual consumption |
| `tposnmasivo` | char(1), default 'N' | Mass/bulk order flag |

**Key observations:**
- Priority (`tpoprioridad`) is a single character field -- likely A/B/C or H/M/L classification.
- The `tposninscon` flag identifies meter installation orders.
- `tposnmasivo` supports bulk/mass order generation (e.g., scheduled replacement campaigns).

### 2.2 Order Type Permissions: `tipoordenperf`

| Column | Type | Role |
|--------|------|------|
| `topftpoid` | numeric(5) | Order type FK |
| `topfperfid` | numeric(5) | User profile FK |

Controls which user profiles can create which order types.

### 2.3 Order Motives: `motordenes`

| Column | Type | Role |
|--------|------|------|
| `mvoid` | numeric(5) PK | Motive identifier |
| `mvotpoid` | numeric(5) | Order type FK (motive belongs to a type) |
| `mvotxtid` | numeric(10) | Text descriptor |
| `mvosnmanual` | char(1), default 'N' | Can be created manually |
| `mvosnmotfactext` | char(1), default 'N' | Related to external billing motive |
| `mvosnordext` | char(1), default 'N' | External order motive |
| `mvotetid` | numeric(5) | Related entity type |
| `mvoorigen` | char(1) | Origin code |

Motives are bound to specific order types (`mvotpoid`), providing a two-level classification: Type > Motive.

### 2.4 Service Point Types: `tipoptosrv`

| Column | Type | Role |
|--------|------|------|
| `tpsid` | numeric(5) PK | Service point type |
| `tpsusocod` | numeric(5) | Usage code (residential, commercial, etc.) |
| `tpsorden` | numeric(5) | Display order |
| `tpstiposerv` | numeric(5), default 1 | Service type (water, sewer, etc.) |
| `tpssncortpos` | char(1), default 'S' | Allows disconnection |

---

## 3. Claims Management: `gestreclam`

### 3.1 Core Entity (22 columns)

| Column | Type | Role |
|--------|------|------|
| `gesid` | numeric(10) PK | Claim identifier |
| `gesdescri` | varchar(30) | Short description |
| `gesproceso` | numeric(10) NOT NULL | Process FK (FK to `proceso.procid`) |
| `gespaso` | numeric(10) NOT NULL | Current step FK (FK to `pasoproced.pasid`) |
| `gessesini` | numeric(10) NOT NULL | Initial session FK (FK to `sesion.sesid`) |
| `gesfvento` | date NOT NULL | Due/expiry date |
| `gesestado` | numeric(5) NOT NULL | Current state |
| `gesfeccart` | date | Letter/notice date |
| `gesresid` | numeric(10) | Resolution FK |
| `gespcsid` | numeric(10) | Process session FK |
| `gessnnecaprob` | char(1), default 'N' | Requires approval |
| `gesfecaprob` | timestamp | Approval date |
| `gessncanccambd` | char(1), default 'N' | Cancellation by change of ownership |
| `gesaprobada` | char(1), default 'N' | Approved flag |
| `gesnoaprobada` | char(1), default 'N' | Not approved flag |
| `gessocprops` | varchar(100) | Society/property proposals |
| `gesmotfacts` | varchar(256) | Billing motive text |
| `gesidant` | numeric(10) | Previous claim FK (for chain/escalation) |
| `gesidorig` | numeric(10) | Original claim FK |
| `gesappid` | numeric(10) | Application/source ID |

### 3.2 Claims Workflow Architecture

Claims follow a **process-step model** powered by two core tables:

**`proceso`** (process definition):
- `procid`: Process identifier
- `procnametxtid` / `procdesctxtid`: Name and description text references
- `procvisible`: Whether visible in UI
- `procelimperiodica`: Periodic elimination flag

**`pasoproced`** (step definition, 50 columns):
- Defines each step in a collection/claims process with rich configuration:
  - `pasid` PK, `pasprocedi` (process FK), `pasposicio` (position/sequence)
  - `pasduracio`: Duration in days (SLA tracking at step level)
  - `pastiporde`: Order type to generate at this step
  - `pasmotorde`: Order motive to use
  - `pasvigente`: Whether step is active
  - `pasnecaprob`: Requires approval (char 'S'/'N')
  - `pasfacrecla`: Step involves invoice reclamation
  - `pascanccambd`: Cancellation on ownership change
  - `pasintdemora`: Applies late interest
  - `pasporcrec`: Surcharge percentage
  - `passndercob`: Collection rights flag
  - `pastipodias`: Type of days (calendar/business)
  - `pasformfcorte`: Disconnection form
  - `passigpaso`: Next step FK (explicit workflow chaining)
  - `pasaplsignoaprob`: Next step if NOT approved
  - `pasaplsigaprob`: Next step if approved
  - `pastipogesdeuda`: Debt management type at this step
  - `paspasomaestro`: Master step reference
  - `pasconsum` / `pasnoconsum`: Consumption/no-consumption conditions
  - `pasimpdeuda`: Debt amount threshold

**Workflow pattern:** Each step can branch based on approval (`pasaplsigaprob` vs `pasaplsignoaprob`) and chains to the next step (`passigpaso`). Steps can automatically generate work orders (`pastiporde` + `pasmotorde`) and apply surcharges (`pasporcrec`).

### 3.3 Claims Variables: `gestreclvar`

| Column | Type | Role |
|--------|------|------|
| `grvgesid` | numeric(10) | Claim FK |
| `grvcnttnum` | numeric(10) | Contract number |
| `grvvarid` | numeric(10) | Variable definition FK |
| `grvsnborrar` | char(1) | Delete flag |
| `grvvalor` | varchar(20) | Variable value |

Allows flexible key-value data attachment to claims.

### 3.4 Provisional Claims: `gestreccprov`

| Column | Type | Role |
|--------|------|------|
| `gespid` | numeric(10) PK | Provisional claim ID |
| `gespprppid` | numeric(10) | Related proposal |
| `gesppaspid` | numeric(5) | Step FK |
| `gesporigen` | char(1) | Origin code |
| `gespsesini` | numeric(10) | Session |
| `gespfvento` | date | Due date |
| `gespestado` | numeric(5) | State |
| `gespresid` | numeric(10) | Resolution |

Provisional claims serve as a staging area before formal claims are created.

### 3.5 Customer Complaints: `quejas`

| Column | Type | Role |
|--------|------|------|
| `quejid` | varchar(15) PK | Complaint identifier (string format) |
| `quejpolnum` | numeric(10) | Policy/account number |
| `quejestado` | numeric(5) | State |
| `quejtipo` | numeric(5) | Complaint type (FK to `tipoqueja.tqueid`) |
| `quejsubtip` | numeric(5) | Sub-type |
| `quejcausa` | numeric(5) | Cause code |
| `quejfecha` | date | Creation date |
| `quejfecfin` | date | End date |
| `quejfecres` | date | Resolution date |
| `quejobserv` | varchar(35) | Observations |
| `quejgestor` | varchar(35) | Assigned manager |

Complaint types defined in `tipoqueja` (`tqueid`, `tquedesc`). The `quejas` table is simpler than `gestreclam` -- it serves as a lightweight complaint register (possibly from a CRM or call center), while `gestreclam` handles formal debt/billing reclamation workflows.

### 3.6 Collection Management Integration

The `gescartera` table (18 columns) manages collection portfolios:
- `gscid` PK linked to `orden.ordgscid`
- `gsctipo`: Collection type
- `gsctermina`: Completion flag
- `gscnumdom`: Number of direct debits
- `gscrecobro` / `gscgestorrecobro`: Recovery and assigned recovery agent

The `gestcobro` table manages collection management entities linked to persons and configurations:
- `gcobprsid`: Person FK
- `gcobexpid`: Expedition FK
- `gcobtgcid`: Collection type
- `gcobdiasplazo`: Days of grace
- `gcobcomision` / `gcobcomalta` / `gcobcombaja`: Commission structures

**`gestionfac`** links specific invoices to collections (`gfafactura` to `gfagestion`).

---

## 4. Fraud Investigation: `expedsif`

### 4.1 Core Entity (64 columns)

The `expedsif` table is the most complex entity in the operations domain. Key column groups:

**Identification & Location:**
| Column | Type | Role |
|--------|------|------|
| `exsid` | numeric(10) PK | Investigation case identifier |
| `exsexpid` | numeric(5) NOT NULL | Expedition type FK |
| `exsdirecio` | numeric(10) NOT NULL | Address FK |
| `exspolnum` | numeric(10) | Policy/account number |
| `exspersona` | numeric(10) | Person under investigation |
| `exsnumcont` | varchar(12) | Meter number |

**Classification:**
| Column | Type | Role |
|--------|------|------|
| `exsorifraid` | numeric(5) NOT NULL | Fraud origin (FK to `orifraude`) |
| `exstipfraid` | numeric(5) | Fraud type (FK to `tipfraude`) |
| `exssnreincidente` | char(1) | Repeat offender flag |
| `exsinfraccion` | varchar(16) | Infraction code |

**Status & Workflow:**
| Column | Type | Role |
|--------|------|------|
| `exsestado` | numeric(5) NOT NULL | Current investigation state (FK to `estadofraude`) |
| `exsestadoant` | numeric(5) | Previous state |
| `exsnumact` | numeric(5) NOT NULL | Current action number |
| `exsfsigins` | date | Inspection follow-up date |
| `exsfinspec` | date NOT NULL | Inspection end date |
| `exsfentradaworkflow` | date | Workflow entry date |
| `exsfsalidaworkflow` | date | Workflow exit date |
| `exsfaperturaalegacion` | date | Allegation opening date |
| `exsfcierrealegacion` | date | Allegation closing date |
| `exsfeccamest` | date, default CURRENT_DATE | State change date |
| `exsfeccadest` | date | State expiry date |
| `exsestadoblq` | char(1), default 'N' | State blocked flag |
| `exsreabierto` | char(1), default 'N' | Reopened flag |

**Financial/Liquidation:**
| Column | Type | Role |
|--------|------|------|
| `exsimporte` | numeric(18,2) | Assessed amount |
| `exscaudal` | numeric(18,2) | Flow rate (for volume estimation) |
| `exshoras` | numeric(18,2) | Hours (for volume estimation) |
| `exsdescuentom3` | numeric(10) | Discounted cubic meters |
| `exsfechainiliq` | date | Liquidation start date |
| `exsfechafinliq` | date | Liquidation end date |
| `exsimportesimulacion` | numeric(18,2) | Simulation amount |
| `exsimportesifconsim` | numeric(18,2) | SIF amount with simulation |
| `exsimportesifvarsim` | numeric(18,2) | SIF variable simulation amount |

**Assignment:**
| Column | Type | Role |
|--------|------|------|
| `exscontcod` | numeric(5) | Contractor code (FK to `contratist`) |
| `exsoperid` | numeric(5) | Operator ID (FK to `operleccam`) |
| `exsoperari` | varchar(30) | Operator name (denormalized) |
| `exssnpropi` | char(1) NOT NULL | Own property flag |
| `exssnaseso` | char(1) NOT NULL | Advisory flag |
| `exsusuidaper` | varchar(10) NOT NULL | User who opened the case |
| `exsfechaaper` | date NOT NULL | Opening date |
| `exsusuidsol` | varchar(10) | Requesting user |
| `exsfechasol` | date | Request date |
| `exsofiidaper` | numeric(5) NOT NULL | Opening office |
| `exsofiidsol` | numeric(5) | Requesting office |

**Enforcement:**
| Column | Type | Role |
|--------|------|------|
| `exssncorte` | char(1), default 'N' | Disconnection ordered |
| `exsfecprevcorte` | date | Planned disconnection date |
| `exsmotnofto` | numeric(5) | Non-photo motive (FK to `motnoftofraude`) |
| `exssnbonosocial` | char(1), default 'N' | Social bonus flag (vulnerable customer) |
| `exssnctoficticio` | char(1), default 'N' | Fictitious account flag |
| `exsdatospolicia` | varchar(500) | Police report data |
| `exsjuid` | numeric(10) | Legal proceedings FK |

### 4.2 Fraud Classification Tables

**`orifraude`** (fraud origin):
- `orifraid` PK, `orifratxtid` text reference
- Sources: field inspection, tip-off, consumption anomaly, etc.

**`tipfraude`** (fraud type):
- `tipfraid` PK, `tipfratxtid` text reference
- `tipclandes` char(1), default 'N': Clandestine connection flag
- Types: meter tampering, bypassed connection, unauthorized reconnection, etc.

**`estadofraude`** (fraud investigation states):
- `efrcod` PK, `efrtxtid` text reference
- States: opened, under investigation, allegation phase, liquidated, closed, etc.

**`motnoftofraude`** (reasons for missing photo evidence):
- `mnffid` PK, `mnfftxtid` text reference

### 4.3 Investigation Events: `sucesosif`

| Column | Type | Role |
|--------|------|------|
| `susid` | numeric(10) PK | Event identifier |
| `susexpid` | numeric(10) | Investigation case FK |
| `sustpsuces` | numeric(5) | Event type (FK to `tiposucsif`) |
| `susfsuceso` | date | Event date |
| `sustexto` | varchar(250) | Event description text |
| `susaccion1` / `susaccion2` | numeric(5) | Action codes (FK to `actsucsif`) |
| `susnumacci` | numeric(5) | Action sequence number |
| `suspdf` | bytea | Attached PDF document |
| `sususuidses` | varchar(10) | User in session |
| `susfechases` | date | Session date |
| `susofiid` | numeric(5) | Office |

Event types defined in `tiposucsif` (`tssifid`, `tssiftipo`, `tssiftxtid`).
Action types defined in `actsucsif` (`acssifid`, `acssiftxtid`).
Type-action mapping in `tipoactsucsif` (`tacssiftipid`, `tacssifactid`).

### 4.4 Financial Linkages

**`facexpsif`** (invoices linked to investigation):
- `fesfacid`: Invoice FK
- `fesexsid`: Investigation case FK

**`rdeudasif`** (debt summary per investigation):
- `rdssusid`: Event FK
- `rdsrecibos`: Number of receipts
- `rdsdeuda`: Total debt amount
- `rdsm3estim`: Estimated cubic meters
- `rdscuotas`: Installments
- `rdsfactura`: Invoice amount

**`expfactcnt`** (investigation-contract-invoice facts):
- `efcexpid`: Expedition type, `efccnttnum`: Contract number

### 4.5 Investigation History: `hisexpedsif` and `hisestexpesif`

**`hisexpedsif`** mirrors `expedsif` columns as a full snapshot history table (28+ columns matching the main entity).

**`hisestexpesif`** tracks state transitions:
- `heexexsid`: Case FK
- `heexefrcod`: State code reached
- `heexfechacambio`: Change timestamp
- `heexusuid`: User who made the change

### 4.6 Investigation Workflow Summary

```
[Detection]            [Opening]           [Investigation]         [Allegation]
 orifraude    -->    exsusuidaper    -->    sucesosif events   -->  exsfaperturaalegacion
 (tip, anomaly,      exsfechaaper          exsnumact tracking      exsfcierrealegacion
  inspection)         exsofiidaper

      [Liquidation]            [Enforcement]           [Resolution/Closure]
  --> exsfechainiliq    -->    exssncorte='S'    -->    exsestado = closed
      exsfechafinliq           exsfecprevcorte         exsfsalidaworkflow
      exsimporte               exsjuid (legal)         hisestexpesif logged
      exscaudal * exshoras
```

---

## 5. Resource Assignment

### 5.1 Contractor Management: `contratist`

| Column | Type | Role |
|--------|------|------|
| `ctracod` | numeric(5) PK | Contractor code |
| `ctradesc` | varchar(80) | Contractor description/name |
| `ctrawebuser` / `ctrawebpass` | varchar | Web portal credentials |
| `ctrasnpropio` | char(1), default 'S' | In-house ('S') vs. external ('N') |
| `ctradiasplazo` | numeric(5) | Default deadline in days |

### 5.2 Operators/Technicians: `operleccam`

| Column | Type | Role |
|--------|------|------|
| `olccontcod` | numeric(5) | Contractor FK (composite PK) |
| `olcoperid` | numeric(5) | Operator ID within contractor (composite PK) |
| `olcnombre` | varchar(80) | Operator name |
| `olcnif` | varchar(15) | Tax ID |
| `olcusuid` | varchar(10) | Linked system user |
| `olcsnlector` | char(1), default 'N' | Is a meter reader |
| `olcusurid` | numeric(10) | User reference ID |

Operators are scoped within contractors (`olccontcod` + `olcoperid` composite key). The `olcsnlector` flag distinguishes meter readers from general technicians.

### 5.3 Assignment Patterns

- **Work orders** (`orden`): Assignment is indirect via visits (`ordenvisit.orvcontcod` + `orvoperid`).
- **Fraud investigations** (`expedsif`): Direct assignment via `exscontcod` + `exsoperid`, plus denormalized `exsoperari` name.
- **Equipment change requests** (`bolsacambioequipo`): Tracked via visit records (`bolsacambioequipovisit.bceqvcontcod` + `bceqvoperid`).

### 5.4 Resource Assignment Gaps

- **No crew/team entity**: There is no database-level concept of a crew, brigade, or team. Assignments are to individual operators within contractors.
- **No capacity/availability model**: No scheduling table tracks operator availability, work hours, or capacity.
- **No skill matrix**: No relationship between operator competencies and order types.
- **Geographic assignment**: Districts (`orddistrito`) and streets (`orddistcalle`) provide geographic zones, but there is no operator-to-zone assignment table.

---

## 6. SLA/Performance Tracking

### 6.1 Available SLA Indicators

| Metric | Source | Completeness |
|--------|--------|:------------:|
| Estimated completion date | `orden.ordfecestfin` | Available per order |
| Step duration (days) | `pasoproced.pasduracio` | Available per process step |
| Day type (calendar/business) | `pasoproced.pastipodias` | Available |
| Claim due date | `gestreclam.gesfvento` | Available per claim |
| State change timestamps | `ordenestad.orehsthora` | Full audit trail |
| Visit appointment vs actual | `ordenvisit.orvfeccita` vs `orvfecvisi` | Available |
| Contractor default deadline | `contratist.ctradiasplazo` | Available per contractor |
| Fraud workflow dates | `expedsif.exsfentradaworkflow` / `exsfsalidaworkflow` | Available |
| Fraud state expiry | `expedsif.exsfeccadest` | Available |
| Complaint resolution date | `quejas.quejfecres` vs `quejfecha` | Available |

### 6.2 SLA Gaps

- **No explicit SLA table**: There is no dedicated SLA definition table mapping order types to expected completion times. Step-level `pasduracio` exists only for claims processes, not for generic work orders.
- **No SLA violation tracking**: No table records SLA breaches or escalation events. Violations would need to be computed from timestamps at query time.
- **No performance dashboards data**: No pre-aggregated KPI tables for response times, completion rates, or first-time fix rates.
- **Visit punctuality**: Appointment and actual times exist in `ordenvisit`, but no computed lateness metric is stored.
- **Fraud investigation SLA**: Workflow entry/exit dates are tracked, but no configurable target duration per fraud type or state.

---

## 7. Cross-Domain Integration

### 7.1 Integration Map

```
                    +------------------+
                    |    orden (WO)    |
                    +--------+---------+
                             |
        +----------+---------+---------+----------+----------+
        |          |         |         |          |          |
  tipoorden   motordenes  ptosrv   contrato  gestreclam  expedsif
  (type)      (motive)    (svc pt) (acct)    (claims)    (fraud)
        |          |         |         |          |          |
  tipoordenperf    |     contador   poliza    proceso    orifraude
  (permissions)    |     (meter)   (policy)  pasoproced  tipfraude
                   |         |                            estadofraude
                   |    bolsacambio                       sucesosif
                   |    equipo
                   |
              oficina
              contratist
              operleccam
```

### 7.2 Meter/Counter Domain

- `orden.ordcontvie` / `ordcontnue`: Old and new meter references during changes.
- `orden.ordlecvie1/2` / `ordlecnue1/2`: Old and new meter readings (dual register support).
- `orden.ordemplidvie/nue`: Meter brand identifiers.
- `orden.ordfilbatvie/nue` + `ordcolbatvie/nue`: Battery position coordinates in meter panels.
- `bolsacambioequipo`: Equipment change queue with priority, visit scheduling, and GOT integration (`cameqgotid`).
- `observac.obscod` linked via `orden.ordobscod`: Observation codes for meter change reasons.

### 7.3 Billing Domain

- `orden.ordgesid` links to `gestreclam.gesid`: Work orders can originate from billing claims.
- `orden.ordgscid` links to `gescartera.gscid`: Work orders tied to collection portfolio actions.
- `gestreclam.gesproceso` / `gespaso` drives step-based billing actions (surcharges, interest, disconnection).
- `facexpsif`: Invoice-to-fraud-investigation linkage.
- `gestionfac`: Invoice-to-collection-management linkage.
- `recargo`: Surcharge records linked to claims (`rcggesid`).

### 7.4 Customer/Person Domain

- `expedsif.exspersona`: Person under investigation.
- `expedsif.exspolnum` / `exsnpolnum`: Policy number (old and new).
- `quejas.quejpolnum`: Complaint linked to policy.
- `gestreclam` links to contracts via `gestreclvar.grvcnttnum`.

### 7.5 Geographic/Address Domain

- `orden.ordptosid`: Service point (physical location with address).
- `expedsif.exsdirecio`: Address of investigated location.
- `orddistrito` / `orddistcalle`: District and street order distribution.

### 7.6 External System Integration

- **SGO/GOT System**: External work order management system linked via `orden.ordgotid` (UUID), `ordsnexterna`, `ordrefexterna`. The `crearOrdenExterna` API creates orders from the external SGO. `bolsacambioequipo.cameqgotid` also uses GOT UUIDs.
- **ServiceNow CRM**: The `referenceWorkOrderAquacis` API (`asigna_orden_aquacis` event) links Aquasis work order IDs (e.g., `O4514415`) to ServiceNow cases. The `terminar_reporte_caso` and `anular_reporte_caso` events synchronize case resolution/cancellation.
- **GIS Integration**: `gisenvio` (35 columns) and `gisenvioep` manage geographic data exchange with GIS systems, including service point coordinates, addresses, and meter information.

---

## 8. Recommendations

### HIGH Priority

1. **Create an explicit SLA definition table** -- Currently, no dedicated table maps order types or process steps to target completion times. A `sla_definition` table with fields for `order_type_id`, `target_hours`, `escalation_threshold`, and `priority_multiplier` would enable automated SLA monitoring and alerting. Without this, SLA compliance is only measurable retroactively through ad-hoc queries.

2. **Add SLA violation/escalation tracking** -- No mechanism exists to record SLA breaches in real time. A `sla_violation` table tracking the order ID, expected completion, actual completion, breach duration, and escalation actions would provide operational visibility and enable proactive management.

3. **Implement a crew/team entity** -- The system assigns work to individual operators within contractors but has no concept of teams, crews, or brigades. For field operations this is a significant gap. A `crew` table linking multiple `operleccam` records with a leader, vehicle assignment, and skill set would improve dispatch efficiency.

4. **Normalize operator names in expedsif** -- The `exsoperari` column stores the operator name as a denormalized varchar(30) alongside the `exsoperid` FK. This creates data inconsistency risk. The name should be resolved from `operleccam.olcnombre` at query time.

### MEDIUM Priority

5. **Add geographic zone-to-operator mapping** -- Districts (`orddistrito`) exist but have no linkage to operators or contractors. A zone assignment table would enable geographic routing of work orders.

6. **Enrich the priority model** -- `tipoorden.tpoprioridad` is a single character field with no associated table defining priority levels, response time targets, or color coding. A `prioridad` lookup table with SLA parameters would strengthen this.

7. **Add operator capacity/availability model** -- No table tracks operator work hours, shift patterns, or current workload. This limits the ability to implement intelligent dispatch.

8. **Consolidate complaint tracking** -- `quejas` (lightweight complaints) and `gestreclam` (formal claims) operate independently. Consider adding a linking FK between them or unifying into a single escalation path from complaint to formal claim.

9. **Add first-time fix rate tracking** -- The `ordenvisit` table records multiple visits per order, but no computed metric identifies orders resolved on the first visit. A `first_visit_resolution` flag on `orden` would enable this KPI.

### LOW Priority

10. **Archive/partition `ordenestad` and `hisexpedsif`** -- These audit/history tables will grow indefinitely. Consider time-based partitioning for query performance on recent data while retaining historical records.

11. **Document the state machine** -- The `ordestado` values in `orden` and `exsestado` values in `expedsif` represent state machines, but the valid transitions are not defined at the database level. A `state_transition` configuration table would make the business rules explicit and enforceable.

12. **Standardize external reference formats** -- `ordgotid` uses UUID (varchar 36), while `ordrefexterna` uses varchar(15), and `quejas.quejid` uses varchar(15). Consider standardizing external reference formats across the system.

13. **Add structured observation/notes** -- `orden.ordobsid` references an observation record, but the API's `resolveOT` returns a `solutionDescription` free-text field. Consider structured resolution codes alongside free text for better analytics.

---

## 9. Operations Domain Health Score

| Dimension | Score | Assessment |
|-----------|:-----:|------------|
| Data model completeness | 7/10 | Core entities well-defined; 44-col order and 64-col fraud tables are comprehensive |
| Lifecycle coverage | 7/10 | Full create-to-close workflow with state history; reopening supported |
| Classification depth | 7/10 | Two-level type/motive system; fraud has origin/type/state |
| Resource management | 4/10 | Basic contractor/operator model; no crews, capacity, or geographic routing |
| SLA enforcement | 3/10 | Timestamps exist but no SLA definitions, violation tracking, or alerting |
| Cross-domain integration | 8/10 | Strong links to meters, billing, customers, GIS, and external systems |
| Audit trail | 8/10 | State history tables for both orders and fraud; user/timestamp on all entities |
| API maturity | 7/10 | Key lifecycle operations exposed (create, visit, resolve) with SGO and CRM integration |
| Workflow engine | 7/10 | Claims process/step model with branching, approval, and auto-generation |
| Fraud investigation depth | 8/10 | Comprehensive 64-column model with events, financials, legal, and workflow tracking |

**Overall Domain Health Score: 6.5 / 10**

The score reflects a mature data model with strong audit and integration capabilities, but significant gaps in resource management (4/10) and SLA enforcement (3/10) that are critical for operational excellence in a field services context. Addressing the HIGH priority recommendations would raise this score to approximately 8/10.

---

*Report generated: 2026-02-16*
*Source files: `chunk_ijlmno.md`, `chunk_efg.md`, `chunk_pqrs.md`, `chunk_t.md`, `chunk_bcd.md`, `chunk_a.md`, `chunk_h.md`, `aquasis-api-documentation.md`, `aquasis-wsdl-contracts.md`*
