# A6 - Collections & Financial Domain Analysis

## AquaCIS (CEA Queretaro) - Payment Processing, Debt Management, and Portfolio Collections

---

## Executive Summary

The AquaCIS collections domain is a mature, deeply integrated financial subsystem built around the Spanish water utility framework (OCCAM/Agbar lineage). It encompasses end-to-end payment processing from reference generation through multi-channel collection, debt tracking at the contract level, portfolio management with escalation workflows, and payment plan facilities. The domain spans approximately 30+ core tables with a well-defined three-tier architecture: **gescartera** (portfolio management header) orchestrates **opecargest** (collection operations), which are detailed through **opedesglos** (payment breakdowns). Financial movements are tracked via **movccontrato** (contract-level movements) and balanced against **contratodeuda** (contract debt snapshots). The **referencia** table enables multi-channel payment acceptance through banks and convenience stores (OXXO, 7-Eleven, etc.).

Key strengths include the multi-channel payment reference system with SOAP API exposure, the detailed payment breakdown tracking with full audit trails, and the portfolio-based collection management with escalation support. Weaknesses include heavy reliance on numeric codes without self-documenting enumerations, the absence of explicit payment plan installment schedules (beyond planpago header), and limited built-in analytics for aging and write-off management.

**Collections Domain Health Score: 7/10**

---

## 1. Payment Flow: End-to-End Payment Processing

### 1.1 Flow Architecture

The payment flow follows a hierarchical chain:

```
referencia (payment reference generated)
    |
    v
gescartera (portfolio management session created)
    |
    v
opecargest (collection operation recorded)
    |
    v
opedesglos (payment breakdown/detail line)
    |
    v
opefacamort (invoice amortization linkage)
    |
    v
factura (invoice state updated)
    |
    v
movccontrato (contract financial movement posted)
    |
    v
contratodeuda (contract debt snapshot updated)
```

### 1.2 Payment Reference Generation

Payments begin with the creation of a **referencia** record:

| Column | Purpose |
|--------|---------|
| `refid` | Unique reference identifier (PK, numeric 10) |
| `refnumfac` | Invoice number (varchar 18) |
| `refpolnum` | Policy/contract number (numeric 10) |
| `refgesid` | Link to gescartera management session |
| `refocgid` | Link to opecargest collection operation |
| `refimporte` | Payment amount (numeric 18,2) |
| `reffcrea` | Creation date |
| `reffeclimitec` | Payment expiration date |
| `refreferencia` | External reference string (varchar 25) -- the barcode/reference number |
| `refrafaga` | Burst/batch identifier (varchar 46) -- used for bank file reconciliation |
| `refformato` | Format code (default 57, aligning with CSB57 bank standard) |
| `refsnblosalban` | Block bank payment flag (char 1, default 'N') |
| `refcomban` | Bank commission (numeric 18,2, default 0) |
| `refsnfactura` | Indicates if linked to invoice (default 'S') |
| `refreldeuda` | Relationship to debt record |
| `refmccid` | Link to movccontrato when payment applied |
| `refmcciddev` | Link to movccontrato for reversals/returns |
| `refocdev` | Link to opecargest for return operations |

The **referfact** bridge table links references to invoices (`reffrefid` -> `refffacid`), enabling a single reference to cover multiple invoices or a single invoice.

The **referplazo** table links references to payment plan installments (`refprefid` -> `refpopdid`), connecting references to specific opedesglos payment breakdown records.

### 1.3 Payment Collection Operation

When a payment is collected, the system creates entries in the portfolio hierarchy:

**gescartera** (Portfolio Management Header):
| Column | Purpose |
|--------|---------|
| `gscid` | Portfolio session ID (PK) |
| `gsctipo` | Portfolio type code |
| `gscdescri` | Description (char 50) |
| `gsccondcrea` | Creation conditions (varchar 1000) |
| `gscnumdom` | Direct debit count |
| `gsctermina` | Session terminated flag (char 1) |
| `gschoraterm` | Termination timestamp |
| `gscnapuntescsb` | Number of CSB (bank file) entries |
| `gscimportecsb` | Total CSB import amount |
| `gscrecobro` | Re-collection flag (char 1, default 'N') |
| `gscgestorrecobro` | Re-collection manager reference |
| `gscnumplazos` | Number of installments (numeric 5, default 0) |
| `gscsocord` | Ordering entity |
| `gsctiporeme` | Remittance type |
| `gscimpcobanucsb` | Collected CSB amount to be annulled |

**opecargest** (Collection Operation):
| Column | Purpose |
|--------|---------|
| `ocgid` | Operation ID (PK) |
| `ocggescart` | FK to gescartera.gscid |
| `ocgoperaci` | Operation type code |
| `ocgviacomu` | Communication channel (char 2) |
| `ocghora` | Operation time |
| `ocgasiento` | Accounting entry reference |
| `ocgimperr` | Error amount (numeric 18,2) |
| `ocgpctinteres` | Interest percentage |
| `ocgimpinteres` | Interest amount |
| `ocgsnrecargo` | Surcharge flag (default 'S') |
| `ocgfecvto` | Due date |
| `ocgsnarchiv` | Archived flag (default 'N') |
| `ocgusuiddef` / `ocgfechadef` / `ocgofiiddef` | Definitive user/date/office |
| `ocgusuidprov` / `ocgfechaprov` / `ocgofiidprov` | Provisional user/date/office |
| `ococgidcobro` | Related collection operation ID |

**opedesglos** (Payment Breakdown Detail):
| Column | Purpose |
|--------|---------|
| `opdid` | Detail ID (PK) |
| `opdopecart` | FK to opecargest.ocgid |
| `opdcanal` | Payment channel (char 1) |
| `opdfrmpago` | Payment form code (FK to formapago) |
| `opdimporte` | Amount (numeric 18,2) |
| `opdsescrea` | Creation session ID |
| `opdsespago` | Payment session ID |
| `opdageid` | Agent/cashier ID |
| `opdbanco` | Bank code |
| `opdreferen` | External reference (varchar 61) |
| `opdfecopeb` | Bank operation date |
| `opdfecprev` | Scheduled date |
| `opdasiento` | Accounting entry |
| `opdtipopecaja` | Cash register operation type |
| `opdsnpropio` | Own payment flag (default 'S') |
| `opdsnintereses` | Interest included flag (default 'N') |
| `opdopdiddevol` | Return/reversal detail ID |
| `opdnumcta` | Account number (varchar 18) |
| `opdfecchec` | Check date |
| `opdnciclo` | Billing cycle |
| `opdnumremesas` | Remittance count (default 0) |
| `opdcuotadev` | Return installment number |
| `opdnumcuota` | Installment number |
| `opdavisovenccuocp` | Installment expiry notice (default 'N') |
| `opdimporteorig` | Original amount |
| `opdopdidorig` | Original detail ID |
| `opdopdiddevolfict` | Fictitious return detail ID |

### 1.4 Multi-Channel Payment Support

The `formapago` table defines payment methods:
- `fmpcanal` (char 1): Payment channel (e.g., 'C' for cash window, 'B' for bank, 'D' for direct debit)
- `fmpid`: Payment form identifier
- `fmpsncompcaj`: Cash register receipt flag
- `fmpsngasto`: Expense flag
- `fmpclave`: SAT payment method key (Mexican tax compliance)
- `fmpccbanc`: Bank accounting code

The `opedesglos.opdcanal` field mirrors this channel classification, while `opdfrmpago` links to the specific payment form.

### 1.5 Invoice Amortization

The **opefacamort** bridge table connects collection operations to invoices:
- `ofaocgid` -> FK to opecargest (the collection operation)
- `ofafacid` -> FK to factura (the invoice being paid)
- `ofaocgidamor` -> Amortization operation ID
- `ofaestantfac` -> Previous invoice state (before payment)

The **opedesfac** table provides an alternative linkage between payment details and invoices:
- `opdfopdid` -> FK to opedesglos
- `opdffacid` -> FK to factura

---

## 2. Debt Management

### 2.1 Contract Debt Tracking (contratodeuda)

The **contratodeuda** table maintains a snapshot of each contract's financial position:

| Column | Purpose |
|--------|---------|
| `cntdid` | Debt record ID (PK) |
| `cntdnum` | Contract number (FK to contrato) |
| `cntdfcambio` | Date of last change |
| `cntddeudaint` | Internal/unbilled debt amount (numeric 18,2) |
| `cntddeudanoint` | Non-internal/external debt (numeric 18,2) |
| `cntddeudafac` | Invoiced debt (numeric 18,2) |
| `cntdsaldo` | Current balance/saldo (numeric 18,2) |
| `cntdintdem` | Interest on arrears (numeric 18,2) |
| `cntdnumciclo` | Billing cycle number |
| `cntdobserv` | Observations (varchar 100) |
| `cntdsocprop` | Owning entity (sociedad propietaria) |

This design separates debt into three categories:
1. **Internal debt** (`cntddeudaint`): Pre-billing amounts not yet invoiced
2. **Non-internal debt** (`cntddeudanoint`): External charges, fees
3. **Invoiced debt** (`cntddeudafac`): Formally billed amounts

The `cntdsaldo` field represents the net balance after payments, while `cntdintdem` tracks accrued default interest.

### 2.2 Contract Financial Movements (movccontrato)

Every financial change on a contract is recorded in **movccontrato**:

| Column | Purpose |
|--------|---------|
| `mccid` | Movement ID (PK) |
| `mcctmcid` | Movement type code |
| `mcccntnum` | Contract number |
| `mccimporte` | Amount (numeric 18,2) |
| `mccdesc` | Description (varchar 100) |
| `mccfechahora` | Timestamp (default CURRENT_TIMESTAMP) |
| `mccfacid` | Related invoice ID |
| `mccopdid` | Related opedesglos detail ID |
| `mcchstusu` | User (default 'Conversion') |
| `mccftoid` | Related facturacio (billing) ID |
| `mccsntratado` | Processed flag (char 1, default 'N') |
| `mccsaldoact` | Current balance after movement |
| `mccsaldoant` | Balance before movement |
| `mccgesid` | Related gescartera session ID |
| `mccporcivaant` | Previous IVA (VAT) percentage |
| `mccsaldopdteant` | Previous pending balance |
| `mcctipodesctoant` | Previous discount type |

The `mccsaldoact` / `mccsaldoant` pair provides a running balance audit trail, enabling reconstruction of the full financial history of any contract.

### 2.3 Temporary Debt (deudatmp)

The **deudatmp** table serves as a staging/cache for debt calculations:

| Column | Purpose |
|--------|---------|
| `deuexpid` | Exploitation/branch ID |
| `deucnttnum` | Contract number |
| `deuminfecf` | Minimum invoice date |
| `deuimporte` | Total debt amount |
| `deuciclos` | Number of billing cycles in debt |
| `deucicloscorte` | Cycles qualifying for disconnection |
| `deucicloslecturas` | Cycles with meter readings |
| `deufeccarga` | Load/calculation date |

This table is used for batch debt assessment processes, particularly for generating disconnection candidate lists based on `deucicloscorte`.

### 2.4 Debt Management Type (conttipogestdeuda)

Links contracts to their debt management type:
- `ctgdcnttnum` -> Contract number
- `ctgdgestion` -> Management session ID
- `ctgdtipogesdeuda` -> Debt management type code

### 2.5 SOAP API for Debt Queries

The `debt.wsdl` service exposes critical debt operations:
- **getDeuda**: Query total debt by identifier type (contract, NIF, cadastral reference)
- **getDeudaContrato**: Get contract-specific debt detail
- **getDeudaTotalConFacturas**: Get total debt with individual invoice breakdown
- **getImpagadosContrato**: Get unpaid invoices for a contract
- **getContratoPorContratoConDeuda**: Find contracts with debt
- **getContratosPorNifconDeuda**: Find all contracts for a taxpayer ID with outstanding debt

The debt DTO returns: `deuda`, `deudaComision`, `deudaTotal`, `saldoAnterior`, `saldoAnteriorComision`, `saldoAnteriorTotal`, `ciclosAnteriores`, `ciclosTotales`, and `documentoPago`.

---

## 3. Collection Workflow: Portfolio Management and Escalation

### 3.1 Portfolio Lifecycle

The **gescartera** table manages collection portfolios (batches of payment operations). A typical lifecycle:

1. **Creation**: A portfolio session is created with `gsctipo` defining its nature (direct debit, manual collection, bank remittance, re-collection)
2. **Population**: Collection operations (`opecargest`) are linked via `ocggescart`
3. **Processing**: Operations are processed with provisional entries (`ocgusuidprov`, `ocgfechaprov`)
4. **Confirmation**: Definitive entries are stamped (`ocgusuiddef`, `ocgfechadef`)
5. **Termination**: `gsctermina` is set, `gschoraterm` records completion

### 3.2 Bank Remittance (Direct Debit) Flow

For domiciliated (direct debit) payments:

1. **contratoremesa** tracks the remittance per contract:
   - `cntrcnttnum`: Contract
   - `cntrimporte`: Remittance amount
   - `cntrfecenvio`: Submission date
   - `cntrfecvto`: Due date
   - `cntrreferencia`: Reference number

2. **plazosremesa** links remittance operations to payment details:
   - `plrocgid` -> opecargest
   - `plropdid` -> opedesglos

3. **devolremesa** tracks bank returns (rejected direct debits):
   - `drocgiddev`: Return operation ID
   - `drocgidcob`: Original collection operation ID
   - `drnumdevol`: Return sequence number
   - `drimporte`: Return amount

4. **relcsb19** / **relcsb19plr** link to CSB19 bank file records (Spanish bank file standard):
   - `r19emisor`: Issuer code
   - `r19cobid`: Collection ID
   - `r19gesid` / `r19ocgid`: Link to gescartera/opecargest

5. **refmsepa** handles SEPA mandate references:
   - `refmref`: SEPA mandate reference string
   - `refmsnmigrada`: Migration flag
   - `refmfecfirma` / `refmfeccancel`: Signature and cancellation dates
   - `refmfecultrem`: Last remittance date

### 3.3 Surcharges and Recargos

The **recargo** table manages late payment surcharges:

| Column | Purpose |
|--------|---------|
| `rcgid` | Surcharge ID |
| `rcgfacid` | FK to factura |
| `rcggesid` | FK to gescartera (portfolio session that generated it) |
| `rcgpctrec` | Surcharge percentage |
| `rcgimporte` | Surcharge amount |
| `rcgestado` | State code |
| `rcgsnintdem` | Is this a default interest charge? |
| `rcgocgid` | FK to opecargest |

The **movrecargo** table tracks surcharge movements:
- `mrcgrcgid` -> FK to recargo
- `mrcgimporte` -> Movement amount
- `mrcgocgid` -> FK to opecargest (payment operation)

### 3.4 Disconnection Escalation (nivelcorte)

The **nivelcorte** table defines service disconnection levels:
- `nconivel`: Disconnection level number
- `ncodesctxtid`: Description text ID
- `ncocanttpvid`: Meter type for disconnection
- `ncofacttpvid`: Invoice type for disconnection

This links to **orden** (work orders) via `ordnconivel` to create disconnection orders when collection escalation reaches the appropriate level.

### 3.5 Third-Party Collection (gestcobro)

The **gestcobro** table manages external collection agencies:

| Column | Purpose |
|--------|---------|
| `gcobprsid` | Person/entity ID (the collection agency) |
| `gcobexpid` | Exploitation ID |
| `gcobtgcid` | Collection manager type |
| `gcobdiasplazo` | Days allowed for collection |
| `gcobcomision` | Commission percentage |
| `gcobforaplicom` | Commission calculation method |
| `gcobcomalta` | Registration commission |
| `gcobcombaja` | De-registration commission |

The **gesttramos** table defines commission tiers:
- `gsttlimite`: Debt threshold limit
- `gsttcomision`: Commission rate for that tier

### 3.6 Failed/Written-Off Accounts (gesfallidos)

The **gesfallidos** table manages write-off tracking:

| Column | Purpose |
|--------|---------|
| `gesfid` | Write-off ID |
| `gesfordid` | Related work order ID |
| `gesffecinicio` | Start date |
| `gesffecfin` | Actual end date |
| `gesffecespfin` | Expected end date |
| `gesfsnfalltot` | Total write-off flag (char 1) |

The **gesllamada** table tracks collection call attempts:
- `gesllgesfid`: FK to gesfallidos
- `gesllnumero`: Call sequence number
- `gesllfecha` / `gesllhora`: Call date/time
- `gesllcontacto`: Contact result code
- `gesllcontobs` / `gesllobs`: Contact notes / general observations

### 3.7 Collection Operation Linkages

- **opecargestcea**: Links secondary operations to primary ones (`opcsecundaria` -> `opcprincipal`)
- **opecargestcon**: Adds accounting dates to operations (`occfechacontable`)
- **opecarrec**: Links return operations to original operations (`ocropedot` -> `ocroperec`)
- **opecartera**: Defines operation types (`ocaid`, `ocatxtid`, `ocatipasie`)

---

## 4. Payment References: Multi-Channel Payment Enablement

### 4.1 Reference Generation

The **referencia** table serves as the cornerstone of multi-channel payment acceptance. Each reference record encodes:

1. **Payment identity**: `refreferencia` (varchar 25) -- the barcode/string printed on bills
2. **Amount**: `refimporte` -- the expected payment amount
3. **Expiration**: `reffeclimitec` -- after this date, the reference expires
4. **Format**: `refformato` (default 57) -- aligns with CSB57 Spanish bank file standard
5. **Bank commission**: `refcomban` -- commission for bank-mediated payments
6. **Payment burst**: `refrafaga` (varchar 46) -- batch identifier for bank file processing

### 4.2 Bank Payment Integration

The CSB (Cuaderno de la Superbancaria) integration is visible through:

- **relcsb19**: Maps CSB19 (direct debit) records to internal gescartera/opecargest records
- **relcsb57**: Maps CSB57 (payment reference) records with year/issuer/burst identifiers
- **refmsepa**: Manages SEPA direct debit mandates

The `refrafaga` field on referencia enables matching incoming bank payment files to expected payments.

### 4.3 SOAP API for Payment Operations

The `debt.wsdl` service exposes:

- **cobrarReferencia**: Collect payment against a reference with standard payment data
- **cobrarReferenciaFrmPago**: Collect payment with specific payment form data
- **cancelarReferencia**: Cancel/void an existing payment reference
- **avisarPago**: Notify the system of an incoming payment (pre-posting)
- **getDocumentoPago**: Generate payment document by contract or NIF
- **getDocumentoPagoXML**: Generate payment document in XML format

The `datosCobroDTO` structure supports channel, office, user, date, session, and payment form specification.

### 4.4 Convenience Store / Third-Party Payments

The reference system supports external payment channels:
- References with `refformato` encode payment data into barcodes readable at convenience stores (OXXO, 7-Eleven)
- The `refsnblosalban` flag can block specific references from bank acceptance
- The `refcomban` field tracks the commission charged by each channel

---

## 5. Reconciliation: Financial Reconciliation Patterns

### 5.1 Session-Based Reconciliation

The **sesion** table provides the reconciliation anchor:
- `sesid`: Session identifier
- `sesusuid`: User performing operations
- `sesofiid`: Office identifier
- `sesfecha`: Session date

Every payment operation references sessions via `opedesglos.opdsescrea` (creation session) and `opdsespago` (payment session), enabling:
- Daily cash reconciliation per cashier (`opdageid`)
- Session-based batching of payments
- Office-level financial closing

### 5.2 Accounting Entry Trail

Multiple tables carry `asiento` (accounting entry) references:
- `opecargest.ocgasiento`: Portfolio-level accounting entry
- `opedesglos.opdasiento`: Detail-level accounting entry
- These map to the general ledger system

### 5.3 Accounting Date Tracking

The **opecargestcon** and **opedesgloscon** tables add accounting dates independent of operational dates:
- `occfechacontable` / `odcfechacontable`: The date the transaction hits the general ledger

This separation allows operational and accounting dates to differ (e.g., weekend payments posted Monday).

### 5.4 Balance Validation

The `movccontrato` table provides running balance verification:
- `mccsaldoant` (balance before) + `mccimporte` should yield `mccsaldoact` (balance after)
- This enables reconciliation checks at the contract level

### 5.5 Favorable Balance Management

The **contratos_saldo_favor_ws** table manages credit balances (overpayments):
- Links `contrato` to `gescartera`, `opecargest`, `opedesglos`
- Tracks `importe_pago`, `facimporte`, `facestado`
- The `bandera` field controls processing status

The **contratos_aplicacion_anticipo_masivo** table manages bulk advance payment applications:
- `id_contrato`, `id_operacion_cartera`, `id_gestion_cartera`, `id_mov_contrato`
- Enables batch application of prepayments against future invoices

---

## 6. Payment Plans and Arrangements

### 6.1 Plan Structure (planpago)

The **planpago** table defines payment arrangements:

| Column | Purpose |
|--------|---------|
| `plpid` | Plan ID (numeric 19 -- note: very large range) |
| `plpcnttnum` | Contract number |
| `plpfeccrea` | Creation date |
| `plpfecultima` | Last payment date |
| `plpfecfin` | Plan end date |
| `plpimpbase` | Base debt amount |
| `plpincremento` | Interest/increment percentage |
| `plpimporte` | Total plan amount |
| `plpfeccuota` | Next installment date |
| `plpcuota` | Installment amount |
| `plpnumdev` | Number of returned/bounced payments |
| `plpfecmodifgl` | GL modification date |
| `plpfecfinprov` | Provisional end date |
| `plprenovado` | Renewal flag (default 'N') |
| `plpmotnorenova` | Non-renewal reason code |
| `plpsndocadhesion` | Adhesion document flag |
| `plpsndocregula` | Regularization document flag |
| `plpsndoccancela` | Cancellation document flag |
| `plpsncuotasad` | Additional installments flag |
| `plpimportdeuda` | Original debt amount |
| `plpperiodoimp` | Period description (varchar 200) |

### 6.2 Installment Tracking

Payment plan installments are tracked through:
- `opedesglos.opdnumcuota`: Installment number within a payment plan
- `opedesglos.opdcuotadev`: Returned installment reference
- `opedesglos.opdavisovenccuocp`: Expiration warning flag for installments
- `gescartera.gscnumplazos`: Number of planned installments in the portfolio

### 6.3 Plan Renewal and Cancellation

The plan lifecycle includes:
- `plprenovado` / `plpmotnorenova`: Renewal tracking with reason codes for non-renewal
- `plpnumdev`: Returned payment counter (auto-cancellation trigger)
- `plpsndoccancela`: Formal cancellation documentation flag
- `plpfecfinprov` vs `plpfecfin`: Provisional vs actual end dates for plan extensions

### 6.4 Bonification/Discount Programs

The **bonificada** table tracks discount arrangements:
- `bnfprsid`: Person/entity ID receiving the discount
- `bnfcobrnom`: Nominal collection flag
- `bnfplazo`: Discount term/period
- Used for social tariff or vulnerability programs

### 6.5 Aqueduct Benefit Program

The **contratosbeneficioacueducto** table is a CEA Queretaro-specific subsidy:
- `contrato`, `saldobeneficioactual`: Contract and current benefit balance
- `zona`, `explotacion`, `tipo_contrato`, `tipo_servicio`: Classification
- `estatusbeneficio`: Benefit status
- `id_gescartera`, `id_opecargest`, `id_opedesglos`, `id_movccontrato`: Full linkage to payment chain

---

## 7. Write-Off and Adjustment Handling

### 7.1 Invoice Adjustments

The **ajustefact** table records billing corrections:
- `ajfcntid`: Contract reference
- `ajfpocidfrom` / `ajfpocidto`: Original and corrected billing period references
- `ajfusuid` / `ajfdate`: User and date of adjustment

### 7.2 Commercial Adjustment Control

The **control_ajuste_comercial** table provides structured adjustment management:
- `contrato`: Affected contract
- `saldo_variable`: Variable adjustment balance
- `saldo_pendiente`: Pending adjustment balance
- `tipo_variable`: Adjustment category

The **control_ajuste_comercial_bitacora** audit table tracks:
- `saldo_aplicado`: Applied adjustment amount
- `periodo_fact`, `zona_fact`, `anio_fact`: Billing period details
- `usuario_factura` / `usuario_cargavariable`: Separation of billing vs adjustment users

### 7.3 Write-Off Management (gesfallidos)

As described in Section 3.6, gesfallidos manages the write-off lifecycle with:
- Planned vs actual resolution dates
- Total vs partial write-off flags (`gesfsnfalltot`)
- Collection call history tracking via gesllamada

### 7.4 Collection Concept Points (cptocobro)

The **cptocobro** table defines collection concepts:
- `ctcpocid`: Billing period reference
- `ctctccid`: Collection concept type
- `ctcorigen`: Origin code
- `ctcopeblo` / `ctcopecob`: Block and collection operation IDs
- `ctcplazocob`: Collection deadline

The **cptocobrocobrado** table records collected amounts per concept.

---

## 8. Integration Points

### 8.1 Connection to Billing Domain

| Integration | Mechanism |
|-------------|-----------|
| Invoice linkage | `opecargest` -> `opefacamort` -> `factura` |
| Payment detail to invoice | `opedesglos` -> `opedesfac` -> `factura` |
| Billing period | `movccontrato.mccftoid` -> `facturacio` |
| Contract debt | `contratodeuda.cntdnum` -> `contrato` |
| Reference to invoice | `referencia.refnumfac` / `referfact` -> `factura` |

### 8.2 Connection to Customer Domain

| Integration | Mechanism |
|-------------|-----------|
| Contract owner | `factura.faccliid` -> persona (client) |
| Debt by NIF | `getContratosPorNifconDeuda` SOAP operation |
| Collection agency | `gestcobro.gcobprsid` -> persona |
| SEPA mandate | `refmsepa.refmprsid` -> persona |
| Web customer | `contratoweb.cntwcliid` -> persona web client |

### 8.3 Connection to Work Order Domain

| Integration | Mechanism |
|-------------|-----------|
| Disconnection orders | `orden.ordnconivel` -> `nivelcorte` |
| Collection-triggered orders | `orden.ordgesid` -> `gescartera` |
| Write-off linked orders | `gesfallidos.gesfordid` -> `orden` |
| Reconnection flow | `ordenanucob` links orders to collection sessions |

### 8.4 Connection to Accounting

| Integration | Mechanism |
|-------------|-----------|
| General ledger | `opecargest.ocgasiento` / `opedesglos.opdasiento` |
| Accounting dates | `opecargestcon.occfechacontable` / `opedesgloscon.odcfechacontable` |
| Cash operations | `opedesglos.opdtipopecaja` |

### 8.5 External System Integration

| Integration | Mechanism |
|-------------|-----------|
| Bank files (CSB19) | `relcsb19` / `relcsb19plr` |
| Bank files (CSB57) | `relcsb57` / `referencia.refrafaga` |
| SEPA mandates | `refmsepa` / `refmsepaant` |
| SOAP web services | `debt.wsdl` - cobrarReferencia, getDeuda, etc. |
| CFD/CFDI (Mexican e-invoicing) | `cobropdtecfd` |
| SAT payment methods | `formapagosat` |

---

## 9. Recommendations

### HIGH Priority

1. **Add explicit enumeration tables for numeric codes** (HIGH)
   - Tables like `movccontrato.mcctmcid`, `opecargest.ocgoperaci`, `opedesglos.opdcanal`, and `factura.facestado` use opaque numeric codes with no accompanying lookup/catalog table visible in the schema. This makes the system extremely difficult to maintain and audit. Create catalog tables or at minimum document all code values.

2. **Implement aging analysis infrastructure** (HIGH)
   - While `deudatmp` provides batch-calculated aging data, there is no dedicated aging bucket table (30/60/90/120+ days). The system relies on `deuciclos` and `deucicloscorte` but lacks date-based aging. For regulatory reporting and collections optimization, a proper aging framework is needed.

3. **Add referential integrity constraints** (HIGH)
   - Many FK relationships appear to be enforced by application logic rather than database constraints (e.g., `movccontrato.mccfacid` -> `factura.facid` has no visible FK constraint, `referencia.refocgid` -> `opecargest.ocgid` similarly). Adding database-level constraints would prevent orphaned records and data integrity issues.

4. **Consolidate payment reconciliation** (HIGH)
   - The current reconciliation relies on matching sessions, accounting entries, and running balances across multiple tables. There is no single reconciliation status table. Create a unified reconciliation tracking mechanism to flag unmatched transactions.

### MEDIUM Priority

5. **Improve payment plan installment tracking** (MEDIUM)
   - The `planpago` table stores only header-level data. Individual installment schedules are implied through `opedesglos.opdnumcuota` but there is no dedicated installment schedule table with expected dates and amounts. This makes it difficult to proactively manage upcoming due dates and forecast cash flows.

6. **Add audit logging for debt modifications** (MEDIUM)
   - While `movccontrato` provides a movement trail, there is no explicit audit log for changes to `contratodeuda`. Direct modifications to the debt snapshot table would be undetectable. Implement triggers or a dedicated audit table.

7. **Modernize bank integration beyond CSB format** (MEDIUM)
   - The CSB19/CSB57 standards are legacy Spanish bank file formats. While `refmsepa` indicates some modernization toward SEPA, the core reference system still defaults to `refformato = 57`. Consider adding support for modern API-based bank integrations and real-time payment notifications.

8. **Enhance write-off workflow** (MEDIUM)
   - The `gesfallidos` table is minimal (8 columns). There is no write-off approval workflow, recovery tracking after write-off, or regulatory reporting support. The `gesllamada` call logging is tied to gesfallidos but lacks escalation triggers.

### LOW Priority

9. **Document collection portfolio types** (LOW)
   - The `gescartera.gsctipo` and `opecartera.ocaid` define portfolio types, but their meanings are encoded as numeric IDs. Create a reference document or expand the schema with human-readable descriptions.

10. **Add payment channel analytics support** (LOW)
    - The `opedesglos.opdcanal` and `formapago.fmpcanal` fields enable channel analysis, but there are no pre-built views or materialized tables for payment channel reporting. This data is valuable for optimizing collection strategies.

11. **Consolidate the advance payment / credit balance tables** (LOW)
    - Both `contratos_saldo_favor_ws` and `contratos_aplicacion_anticipo_masivo` (plus its `_tmp` variant) handle credit balances, suggesting the feature evolved organically. Consolidate into a single, clean credit management subsystem.

---

## 10. Collections Domain Health Score: 7/10

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Data Model Completeness** | 7/10 | Core payment flow is well-modeled; installment schedules and aging analysis are gaps |
| **Referential Integrity** | 5/10 | Many FK relationships appear application-enforced, not DB-enforced |
| **Audit Trail** | 8/10 | movccontrato provides excellent running balance tracking; contratodeuda lacks direct audit |
| **Multi-Channel Support** | 9/10 | Strong reference-based system supporting bank, cash, convenience store, web, and SEPA |
| **Reconciliation** | 6/10 | Session-based with accounting entry links, but no unified reconciliation dashboard/table |
| **Escalation Workflow** | 7/10 | nivelcorte + gesfallidos + gesllamada provide a workable escalation path |
| **Payment Plans** | 6/10 | Header-only plan tracking; missing installment-level schedule table |
| **API Integration** | 8/10 | SOAP WSDL provides comprehensive debt and payment operations |
| **Write-Off Management** | 5/10 | Minimal structure; no approval workflow or recovery tracking |
| **Documentation/Self-Description** | 4/10 | Heavy use of opaque numeric codes without catalog tables |

**Overall: 7/10** -- A functional, production-proven collections system with strong payment processing and multi-channel capabilities, but with significant technical debt in referential integrity, self-documentation, and modern analytics support.

---

*Report generated: 2026-02-16*
*Source files analyzed: chunk_ijlmno.md, chunk_pqrs.md, chunk_efg.md, chunk_bcd.md, chunk_a.md, debt.wsdl*
*Agent: A6 (db-collections)*
