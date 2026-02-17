# B2 -- Debt Management API Deep Analysis

**Service:** `InterfazGenericaGestionDeudaWSBeanSEIImplService`
**Endpoint:** `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaGestionDeudaWS`
**Rails Proxy:** `/api/v1/cea/soap/InterfazGenericaGestionDeudaWS`
**WSDL Namespace:** `http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/`
**Protocol:** Document/Literal SOAP Binding
**Date of Analysis:** 2026-02-16

---

## Executive Summary

The Debt Management service (`InterfazGenericaGestionDeudaWS`) is one of the five core SOAP services in the AquaCIS platform operated by CEA Queretaro. It exposes **13 operations** covering debt queries, payment processing, payment reference lifecycle management, and payment document generation. Of these 13 operations, only **1 is integrated** (`getDeuda`), leaving the entire payment execution pipeline -- from unpaid invoice retrieval through reference-based collection to document generation -- completely unconnected from the AGORA platform.

This represents a critical gap. The Debt Management service is the financial nerve center of the CIS: it governs how customers discover what they owe, how payments are initiated and confirmed through bank/store reference codes, how payment receipts are generated, and how payment references are cancelled when necessary. With only the summary debt query integrated, AGORA currently cannot process payments, generate payment documents, or manage the payment reference lifecycle that underpins CEA Queretaro's multi-channel collection strategy (banks, convenience stores, ATMs, card terminals).

The service contains no operations that require WS-Security authentication (unlike the Contracts and Readings services), which simplifies integration considerably. All 13 operations use the same straightforward credential-free SOAP binding, and they share a common error-handling pattern via `resultadoDTO` (codigoError/descripcionError). A notable WSDL quirk is the duplicate `reultado` field (a typo for `resultado`) present in three response types, which must be handled gracefully by any integration layer.

**Integration Readiness Score: 8/10** -- The WSDL contracts are well-defined, the DTO hierarchy is clear, no authentication barriers exist, and the operations follow consistent patterns. The main risks are the `reultado` typo requiring defensive parsing and the financial sensitivity of payment operations demanding thorough error handling and idempotency safeguards.

---

## Operation Inventory

### Operation 1: `getDeuda` -- INTEGRATED

**Category:** Debt Query (Summary)
**Purpose:** Retrieve a debt summary for a customer, identified by type (contract number, NIF/tax ID, etc.). This is the broadest debt query available, returning aggregate amounts rather than individual invoice breakdowns.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tipoIdentificador` | `string` | Yes | Identifier type (e.g., `CONTRATO`, `NIF`) |
| `valor` | `string` | Yes | The identifier value (e.g., `442761`) |
| `explotacion` | `int` | Yes | Exploitation/branch code (e.g., `8` for Huimilpan) |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

**Response DTO:** `resultadoGetDeuda` (extends `genericoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited from `genericoDTO` -- error code and description |
| `deuda` | `deuda` | Debt details object (see below) |
| `reultado` | `resultadoDTO` | **Duplicate result field (WSDL typo)** -- must be handled defensively |

**`deuda` DTO fields:**

| Field | Type | Description |
|-------|------|-------------|
| `ciclosAnteriores` | `int` | Number of previous billing cycles with debt |
| `ciclosTotales` | `int` | Total billing cycles count |
| `cuentaCatastral` | `string` | Cadastral account number |
| `deuda` | `decimal` | Current debt amount (principal) |
| `deudaComision` | `decimal` | Commission/fee debt |
| `deudaTotal` | `decimal` | Total debt (principal + commissions) |
| `direccion` | `string` | Service address |
| `documentoPago` | `string` | Current payment document reference |
| `documentoPagoAnterior` | `string` | Previous payment document reference |
| `explotacion` | `int` | Exploitation code |
| `mensaje` | `mensaje[]` | Array of system messages |
| `nombreCliente` | `string` | Customer name |
| `saldoAnterior` | `decimal` | Previous cycle balance (principal) |
| `saldoAnteriorComision` | `decimal` | Previous cycle balance (commissions) |
| `saldoAnteriorTotal` | `decimal` | Previous cycle total balance |

**Why it was integrated first:** `getDeuda` is the simplest and safest debt operation -- it is read-only, requires minimal input (just an identifier), and provides an immediate, high-value summary that AGORA agents and chatbots can display to customers. It has no financial side effects (no payments are triggered, no references are created), making it ideal for a first integration milestone.

**Current usage context:** Implemented in the frontend (`cea.js`) to display debt summaries when viewing contract details or responding to customer inquiries through the AGORA platform.

---

### Operation 2: `getDeudaContrato`

**Category:** Debt Query (Contract-Level)
**Status:** Not integrated
**Purpose:** Retrieve debt details for a specific contract. Returns a simpler DTO than `getDeuda`, focused on contract-level debt without commission breakdowns or payment document references.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tipoIdentificador` | `string` | No | Identifier type |
| `valor` | `string` | No | Identifier value |
| `explotacion` | `int` | No | Exploitation code |
| `idioma` | `string` | No | Language code |

**Response DTO:** `resultadoGetDeudaContrato` (extends `genericoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited result |
| `deudaContrato` | `deudaContrato` | Contract debt details |
| `reultado` | `resultadoDTO` | **Duplicate result (typo)** |

**`deudaContrato` DTO:**

| Field | Type | Description |
|-------|------|-------------|
| `cuentaCatastral` | `string` | Cadastral account |
| `deuda` | `decimal` | Debt amount |
| `direccion` | `string` | Address |
| `explotacion` | `int` | Exploitation code |
| `mensaje` | `mensaje[]` | Messages |
| `nombreCliente` | `string` | Customer name |

**Analysis:** This is a lighter-weight alternative to `getDeuda`, omitting commission breakdowns and payment document references. Useful for quick contract-level debt checks but largely superseded by the already-integrated `getDeuda` for most use cases.

---

### Operation 3: `getDeudaContratoBloqueoCobro`

**Category:** Debt Query (with Collection Block)
**Status:** Not integrated
**Purpose:** Retrieve debt information along with the `bloquearCobro` flag, which indicates whether collection/payment is blocked for this contract. This is critical for enforcement scenarios (e.g., legal disputes, administrative holds).

**Input Parameters:** Same as `getDeudaContrato` (tipoIdentificador, valor, explotacion, idioma).

**Response DTO:** `resultadoGetDeudaContratoBloqueo` (extends `genericoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited result |
| `deudaContratoBloqueoCobro` | `deudaContratoBloqueoCobro` | Debt with block info |
| `reultado` | `resultadoDTO` | **Duplicate result (typo)** |

**`deudaContratoBloqueoCobro` DTO:**

| Field | Type | Description |
|-------|------|-------------|
| `bloquearCobro` | `boolean` | **Whether collection is blocked** |
| `cuentaCatastral` | `string` | Cadastral account |
| `deuda` | `decimal` | Debt amount |
| `direccion` | `string` | Address |
| `explotacion` | `int` | Exploitation code |
| `mensaje` | `mensaje[]` | Messages |
| `nombreCliente` | `string` | Customer name |

**Analysis:** The `bloquearCobro` flag is the unique value of this operation. Before processing any payment, the system should verify that collection is not blocked. This operation is a prerequisite for safe payment processing.

---

### Operation 4: `getDeudaTotalConFacturas`

**Category:** Debt Query (Invoice-Level Breakdown)
**Status:** Not integrated
**Purpose:** Retrieve total debt with a full breakdown by individual invoice. This is the most detailed debt query, providing per-invoice amounts, due dates, payment references, and status codes.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | `int` | No | Contract number |
| `referenciaCatastral` | `string` | No | Cadastral reference (alternative lookup) |
| `explotacion` | `int` | No | Exploitation code |
| `idioma` | `string` | No | Language code |

**Response DTO:** `resultadoGetDeudaConFacturas` (extends `genericoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited result |
| `deudaTotalFacturas` | `deudaTotalFacturas` | Total debt with invoice list |

**`deudaTotalFacturas` DTO:**

| Field | Type | Description |
|-------|------|-------------|
| `cantidadFacturas` | `int` | Number of invoices |
| `contrato` | `int` | Contract number |
| `cuentaCatastral` | `string` | Cadastral account |
| `deudaTotal` | `decimal` | Total debt amount |
| `explotacion` | `short` | Exploitation code |
| `facturas` | `facturasDeuda` | Container for invoice array |
| `nombreCliente` | `string` | Customer name |

**`datosFacturaDeuda` DTO (per invoice):**

| Field | Type | Description |
|-------|------|-------------|
| `ciclo` | `string` | Billing cycle |
| `codigoEstado` | `short` | Status code |
| `codigoTipoFactura` | `short` | Invoice type code |
| `estado` | `string` | Status description |
| `fechaVencimiento` | `string` | Due date |
| `importeTotal` | `decimal` | Total amount |
| `numFactura` | `string` | Invoice number |
| `referenciaPago` | `string` | **Payment reference for this invoice** |
| `tipoFactura` | `string` | Invoice type description |

**Analysis:** This is the most important unintegrated debt query. The `referenciaPago` field on each invoice is the key that links debt inquiry to the payment execution operations (`cobrarReferencia`, `cobrarReferenciaFrmPago`). Without this operation, the platform cannot present itemized debt to customers or identify which specific invoices to pay.

---

### Operation 5: `getContratoPorContratoConDeuda`

**Category:** Contract+Debt Query (Single Contract)
**Status:** Not integrated
**Purpose:** Retrieve a combined view of contract details and associated debt, including pending invoices and payment installments. Uses a wrapped DTO input pattern (`entradaContratoPorContratoDeudaDTO`).

**Input Parameters (entradaContratoPorContratoDeudaDTO):**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | `int` | No | Contract number |
| `explotacion` | `int` | No | Exploitation code |
| `idioma` | `string` | No | Language code |
| `sociedad` | `string` | No | Company/society code |

**Response DTO:** `resultadoContratoPorContratoDeudaDTO` (extends `genericoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited result |
| `aviso` | `avisoDTO` | Warning information (singular) |
| `codigoError` | `int` | Error code |
| `contrato` | `contratoDeudaDTO` | Contract with debt details |
| `descripcionError` | `string` | Error description |
| `procesoImpagadoSN` | `boolean` | Whether an unpaid process exists |

**`contratoDeudaDTO` DTO:**

| Field | Type | Description |
|-------|------|-------------|
| `cliente` | `string` | Customer name |
| `contrato` | `string` | Contract number |
| `direccion` | `string` | Address |
| `facturas` | `facturasPendientesDTO[]` | Pending invoices (full detail) |
| `importe` | `decimal` | Total amount |
| `localidad` | `string` | Location |
| `nif` | `string` | Tax ID |
| `plazos` | `plazosPagoPendientesDTO[]` | Payment installments |
| `procesoImpagadoSN` | `boolean` | Unpaid process flag |

**Analysis:** This operation provides the richest single-contract debt view, combining contract metadata with pending invoices and payment installments. The `procesoImpagadoSN` flag is particularly valuable -- it indicates whether the contract is already in a collections/unpaid process, which should affect how agents handle the account.

---

### Operation 6: `getContratosPorNifconDeuda`

**Category:** Contract+Debt Query (Multi-Contract by NIF)
**Status:** Not integrated
**Purpose:** Retrieve all contracts with outstanding debt for a given NIF (tax identification number). Essential for a customer-centric view when a person holds multiple water service contracts.

**Input Parameters (entradaContratosPorNIFDeudaDTO):**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `idioma` | `string` | No | Language code |
| `nif` | `string` | No | NIF (e.g., `XAXX010101000`) |
| `sociedadGestora` | `string` | No | Managing company code |

**Response DTO:** `resultadoContratosPorNIFDeudaDTO` (extends `genericoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited result |
| `avisos` | `avisoDTO[]` | Warning list (plural) |
| `codigoError` | `int` | Error code |
| `contratos` | `contratoDeudaDTO[]` | **Array of contracts with debt** |
| `descripcionError` | `string` | Error description |
| `procesoImpagadoSN` | `boolean` | Global unpaid process flag |

**Analysis:** This is the multi-contract counterpart to operation 5. When a customer calls about their debt, agents typically identify them by NIF. This operation returns all their contracts with debt in a single call, including pending invoices and installments per contract. Critical for a holistic customer service view.

---

### Operation 7: `getImpagadosContrato`

**Category:** Unpaid Invoice Management
**Status:** Not integrated
**Purpose:** Retrieve all unpaid invoices and pending payment installments for a contract, along with account balance information. This is the operation that provides the data needed to construct a `documentosImpresionDTO` input for payment document generation (operations 8 and 9).

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | `int` | Yes | Contract number |
| `nif` | `string` | Yes | Tax identification |
| `idioma` | `string` | Yes | Language code |

**Response DTO:** `impagadosContratoDTO` (extends `genericoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited result |
| `avisos` | `avisoDTO[]` | Warnings |
| `facturasPendientes` | `facturasPendientesDTO[]` | Pending invoices |
| `plazosPagoPendientes` | `plazosPagoPendientesDTO[]` | Pending payment installments |
| `saldoCuentaDTO` | `saldoCuentaDTO` | Account balance |

**`facturasPendientesDTO` key fields:**

| Field | Type | Description |
|-------|------|-------------|
| `factura` | `string` | Invoice number |
| `importe` / `importeTotal` | `decimal` | Amount / total amount |
| `impuestos` | `decimal` | Tax amount |
| `recargo` | `decimal` | Surcharge |
| `referencia` | `string` | **Payment reference** |
| `fechaVencimiento` | `string` | Due date |
| `fechaEmision` | `string` | Issue date |
| `estado` | `short` | Status code |
| `procesoImpagadoSN` | `boolean` | In unpaid process |
| `rafaga` | `string` | Burst code |
| `URL` | `string` | URL (potentially for online payment or CFDI) |

**`saldoCuentaDTO` fields:**

| Field | Type | Description |
|-------|------|-------------|
| `saldoBloqueado` | `decimal` | Blocked balance |
| `saldoCompensar` | `decimal` | Compensating balance |
| `saldoDisponible` | `decimal` | Available balance |
| `saldoTotal` | `decimal` | Total balance |

**Analysis:** This is the critical bridge operation between debt inquiry and payment execution. It provides the `facturasPendientesDTO` and `plazosPagoPendientesDTO` arrays that are required as input for `getDocumentoPago` and `getDocumentoPagoXML`. The `saldoCuentaDTO` provides balance information including blocked and compensating amounts, which are essential for accurate financial presentation. The `referencia` field on each pending invoice connects to the `cobrarReferencia` payment execution operations.

---

### Operation 8: `getDocumentoPago`

**Category:** Document Generation (PDF)
**Status:** Not integrated
**Purpose:** Generate a payment document in PDF format for selected pending invoices and/or payment installments. Returns the PDF as base64-encoded binary, along with a payment reference and burst code.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | `int` | Yes | Contract number |
| `nif` | `string` | Yes | Tax ID |
| `idioma` | `string` | Yes | Language code |
| `docs` | `documentosImpresionDTO` | Yes | Documents to include in the payment slip |

**`documentosImpresionDTO`:**

| Field | Type | Description |
|-------|------|-------------|
| `facturasPendientes` | `facturasPendientesDTO[]` | Pending invoices to include |
| `plazosPagoPendientes` | `plazosPagoPendientesDTO[]` | Pending installments to include |

**Response DTO:** `documentoDeudaPdteDTO` (extends `genericoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited result |
| `pdf` | `base64Binary` | **The PDF payment document** |
| `rafagaPago` | `string` | Payment burst code (groups related payments) |
| `referencia` | `string` | **Generated payment reference** |

**Analysis:** This is a high-value operation for customer self-service and agent workflows. The PDF payment document is what customers take to banks or convenience stores (OXXO, 7-Eleven, etc.) to pay their water bills. The operation generates a unique `referencia` (payment reference) that is printed as a barcode on the document and used by the collection points. The `rafagaPago` (burst code) groups multiple invoices into a single payable bundle. Integrating this operation enables AGORA to generate payment slips on demand, email them to customers, or display them in a portal.

---

### Operation 9: `getDocumentoPagoXML`

**Category:** Document Generation (XML)
**Status:** Not integrated
**Purpose:** Generate a payment document in XML format. Same inputs as `getDocumentoPago` but returns structured XML instead of a PDF binary.

**Input Parameters:** Same as `getDocumentoPago` (contrato, nif, idioma, docs).

**Response DTO:** `documentoXMLDeudaPdteDTO` (extends `genericoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited result |
| `rafagaPago` | `string` | Payment burst code |
| `referencia` | `string` | Generated payment reference |
| `XML` | `string` | **XML document content** |

**Analysis:** The XML variant is important for programmatic processing, CFDI (Comprobante Fiscal Digital por Internet) compliance, and integration with accounting/ERP systems. In Mexican tax law, electronic invoices (CFDI) must be in XML format following SAT (Servicio de Administracion Tributaria) specifications. This operation likely produces XML that can be used as the basis for CFDI generation or can be transformed into CFDI-compliant format. Integrating both PDF and XML generation gives maximum flexibility.

---

### Operation 10: `avisarPago`

**Category:** Payment Notification
**Status:** Not integrated
**Purpose:** Notify the AquaCIS system that a payment has been made. This is used when payments are received through external channels (online payment gateways, bank transfers, etc.) and the CIS needs to be informed.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `documentoPago` | `string` | Yes | Payment document reference |
| `entidad` | `int` | Yes | Entity/bank code that processed the payment |
| `importe` | `decimal` | Yes | Amount paid |
| `idioma` | `string` | Yes | Language code |

**Response DTO:** `resultadoDTO`

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

**Analysis:** This is a lightweight payment notification mechanism. Unlike `cobrarReferencia` (which actually processes the collection), `avisarPago` simply informs the system that a payment has been received. It uses the `documentoPago` reference (obtained from the `deuda` DTO via `getDeuda`) rather than the `referencia` used by the cobrar operations. This suggests a two-tier payment model: `avisarPago` for soft notifications (e.g., online payments that will be confirmed later) and `cobrarReferencia` for definitive collection confirmations.

---

### Operation 11: `cobrarReferencia`

**Category:** Payment Collection (Standard)
**Status:** Not integrated
**Purpose:** Execute a payment collection against a specific payment reference. This is the primary operation for recording payments made at collection points (banks, ATMs, stores).

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `referencia` | `string` | Yes | Payment reference (from `getDocumentoPago` or invoice `referencia`) |
| `importe` | `decimal` | No | Amount to collect (optional -- may default to reference amount) |
| `datosCobro` | `datosCobroDTO` | Yes | Collection data |
| `idioma` | `string` | No | Language code |

**`datosCobroDTO`:**

| Field | Type | Description |
|-------|------|-------------|
| `banco` | `short` | Bank code |
| `cajero` | `string` | ATM/cashier identifier |
| `comercio` | `string` | Commerce/shop identifier |
| `fechaPago` | `string` | Payment date |
| `nif` | `string` | Tax ID of payer |
| `tarjeta` | `string` | Card number (if applicable) |
| `terminal` | `string` | Terminal identifier |
| `ticket` | `string` | Ticket/receipt number |

**Response DTO:** `resultadoDTO` (codigoError / descripcionError)

**Analysis:** This is the core payment execution operation. The `datosCobroDTO` captures the full provenance of the payment: which bank, which ATM or cashier, which terminal, what ticket number. This is essential for reconciliation and audit trails. The `importe` field being optional suggests that partial payments may be handled by the system (or that the reference amount is used as default). This operation is critical for any online payment integration, as it is how AGORA would confirm that a customer's payment has been applied.

---

### Operation 12: `cobrarReferenciaFrmPago`

**Category:** Payment Collection (with Payment Form)
**Status:** Not integrated
**Purpose:** Extended version of `cobrarReferencia` that additionally captures whether the payment was made by cash or card via the `efectivoTarjeta` field.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `referencia` | `string` | Yes | Payment reference |
| `importe` | `decimal` | No | Amount to collect |
| `datosCobro` | `datosCobroFrmPagoDTO` | Yes | Extended collection data |
| `idioma` | `string` | No | Language code |

**`datosCobroFrmPagoDTO` (extends `datosCobroDTO`):**

| Field | Type | Description |
|-------|------|-------------|
| *(all fields from `datosCobroDTO`)* | | |
| `efectivoTarjeta` | `short` | Cash (0) or Card (1) indicator |

**Response DTO:** `resultadoDTO`

**Analysis:** This is the preferred operation when the payment channel can distinguish between cash and card payments. For online payments processed through AGORA (which are inherently card-based), the `efectivoTarjeta` flag would always be `1`. For in-person payments at CEA offices, it could be either value. This variant provides better data for financial reporting and reconciliation.

---

### Operation 13: `cancelarReferencia`

**Category:** Reference Management
**Status:** Not integrated
**Purpose:** Cancel a previously generated payment reference, making it invalid for future payment attempts. Essential for reference lifecycle management.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `referencia` | `string` | Yes | Payment reference to cancel |
| `idioma` | `string` | Yes | Language code |

**Response DTO:** `resultadoDTO`

**Analysis:** This operation is the safety valve for the payment reference system. If a payment document is generated but the customer does not pay (or if a reference was created in error), the reference must be cancelled to prevent stale references from cluttering the system or being used for incorrect payments. This is also necessary when regenerating payment documents with updated amounts. Without this operation, orphaned references accumulate in the system.

---

## Integration Status

### The 1 Integrated Operation: `getDeuda`

**Rationale for being the first integration:**

1. **Zero financial risk:** Read-only operation with no side effects. Cannot create payments, modify balances, or generate references.
2. **Immediate value:** Provides the most commonly requested information in customer interactions -- "How much do I owe?"
3. **Simple interface:** Four input parameters, all primitive types, no complex DTOs required.
4. **Flexible lookup:** Supports multiple identifier types (`CONTRATO`, `NIF`, etc.), making it versatile for different query contexts.
5. **Foundation for future integrations:** The `documentoPago` field in the `deuda` response provides the reference needed for `avisarPago`, establishing a data link to payment operations.

**Implementation location:** The `getDeuda` operation is called from `cea.js` in the AGORA frontend, proxied through the Rails backend at `/api/v1/cea/soap/InterfazGenericaGestionDeudaWS`.

### The 12 Unintegrated Operations

All 12 remaining operations have WSDL contracts fully defined and are in "Available" status, meaning the AquaCIS endpoints are live and accessible. No authentication barriers exist. The gap is purely on the AGORA integration side.

---

## Payment Flow Analysis

The Debt Management service implements a complete end-to-end payment lifecycle. The operations map to the following flow:

```
PHASE 1: DEBT DISCOVERY
========================
Customer contacts CEA / visits portal / calls chatbot

  getDeuda -----------------> Summary view: total owed, customer name, address
       |                      (INTEGRATED - provides overview)
       |
  getDeudaContrato ---------> Contract-specific debt amount
       |                      (NOT INTEGRATED - simpler variant)
       |
  getDeudaContratoBloqueoCobro --> Debt + collection block check
       |                          (NOT INTEGRATED - safety check)
       |
  getDeudaTotalConFacturas --> Invoice-level breakdown with referenciaPago per invoice
       |                       (NOT INTEGRATED - itemized view)
       |
  getContratoPorContratoConDeuda --> Contract + debt + pending invoices + installments
       |                            (NOT INTEGRATED - richest single-contract view)
       |
  getContratosPorNifconDeuda ----> All contracts with debt for a person (by NIF)
                                   (NOT INTEGRATED - multi-contract view)


PHASE 2: UNPAID INVOICE RETRIEVAL
===================================
Agent/system identifies what to pay

  getImpagadosContrato ------> Returns facturasPendientesDTO[] + plazosPagoPendientesDTO[]
       |                       + saldoCuentaDTO (blocked/available/compensating balances)
       |                       (NOT INTEGRATED - prerequisite for document generation)
       |
       v

PHASE 3: PAYMENT DOCUMENT GENERATION
======================================
System creates payment slip with reference barcode

  getDocumentoPago ----------> PDF payment document + referencia + rafagaPago
       |                       (NOT INTEGRATED - generates printable payment slip)
       |
  getDocumentoPagoXML -------> XML payment document + referencia + rafagaPago
                                (NOT INTEGRATED - for electronic/CFDI processing)


PHASE 4: PAYMENT EXECUTION
============================
Customer pays at bank/store/online, system records it

  avisarPago ----------------> Soft payment notification (uses documentoPago reference)
       |                       (NOT INTEGRATED - for external payment channels)
       |
  cobrarReferencia ----------> Hard payment collection (uses referencia + datosCobroDTO)
       |                       (NOT INTEGRATED - primary collection operation)
       |
  cobrarReferenciaFrmPago ---> Collection + cash/card flag (uses datosCobroFrmPagoDTO)
                                (NOT INTEGRATED - extended collection with payment form)


PHASE 5: REFERENCE LIFECYCLE
==============================
  cancelarReferencia --------> Invalidate a payment reference
                                (NOT INTEGRATED - cleanup/cancellation)
```

### Data Flow Dependencies

```
getImpagadosContrato
    |
    +--> facturasPendientesDTO[] --+--> getDocumentoPago (as docs.facturasPendientes)
    |                              |         |
    +--> plazosPagoPendientesDTO[] +--> getDocumentoPago (as docs.plazosPagoPendientes)
                                             |
                                             +--> Returns: referencia
                                             |             rafagaPago
                                             |             pdf (base64)
                                             |
                                             +--> referencia is used by:
                                                      cobrarReferencia
                                                      cobrarReferenciaFrmPago
                                                      cancelarReferencia

getDeuda
    |
    +--> deuda.documentoPago -----> avisarPago (as documentoPago parameter)
```

---

## Reference Management

### What is a Payment Reference?

A payment reference (`referencia`) is a unique code generated by AquaCIS that represents a specific set of invoices/installments to be paid. It functions as:

1. **Barcode identifier** -- Printed on payment documents for scanning at banks, ATMs, and convenience stores (OXXO, 7-Eleven)
2. **Transaction key** -- Links a payment transaction back to the specific invoices it covers
3. **Idempotency guard** -- Ensures the same debt is not collected twice
4. **Audit trail anchor** -- Ties collection data (bank, terminal, date, ticket) to specific debts

### Reference Lifecycle

```
CREATION:  getDocumentoPago / getDocumentoPagoXML
              --> Generates new referencia for the selected invoices/installments
              --> Also produces rafagaPago (burst code grouping related invoices)

USAGE:     cobrarReferencia / cobrarReferenciaFrmPago
              --> Payment is applied using the referencia
              --> datosCobroDTO records provenance (bank, terminal, date, etc.)

CANCELLATION: cancelarReferencia
              --> Invalidates the referencia
              --> Required when: payment documents expire, amounts change,
                  customer requests new document, administrative corrections
```

### Reference Sources

References appear in multiple DTOs across the service:

| Source | Field Name | Context |
|--------|------------|---------|
| `deuda` (from `getDeuda`) | `documentoPago` | Current payment document reference |
| `deuda` (from `getDeuda`) | `documentoPagoAnterior` | Previous payment document reference |
| `datosFacturaDeuda` (from `getDeudaTotalConFacturas`) | `referenciaPago` | Per-invoice payment reference |
| `facturasPendientesDTO` (from `getImpagadosContrato`) | `referencia` | Per-pending-invoice payment reference |
| `documentoDeudaPdteDTO` (from `getDocumentoPago`) | `referencia` | Newly generated payment reference |
| `documentoXMLDeudaPdteDTO` (from `getDocumentoPagoXML`) | `referencia` | Newly generated payment reference |

### Burst Code (`rafagaPago`)

The `rafagaPago` field groups multiple invoices into a single payment "burst." When a customer pays multiple invoices at once, they share the same `rafagaPago` code, allowing the system to treat them as a single transaction bundle. This is returned by both `getDocumentoPago` and `getDocumentoPagoXML`.

---

## Document Generation

### Available Document Types

| Operation | Format | Output Field | Use Case |
|-----------|--------|--------------|----------|
| `getDocumentoPago` | PDF (base64Binary) | `pdf` | Physical payment slips for banks/stores, email attachments, portal downloads |
| `getDocumentoPagoXML` | XML (string) | `XML` | Electronic processing, CFDI generation, ERP integration, data transformation |

### Document Generation Workflow

1. **Retrieve unpaid items:** Call `getImpagadosContrato` to get `facturasPendientesDTO[]` and `plazosPagoPendientesDTO[]`
2. **Select items to include:** Agent or customer selects which invoices/installments to pay
3. **Generate document:** Call `getDocumentoPago` or `getDocumentoPagoXML` with the selected items in `documentosImpresionDTO`
4. **Deliver document:** PDF is delivered to customer (email, download, print); XML is processed electronically

### Input Structure for Document Generation

```xml
<docs>
  <facturasPendientes>
    <!-- Each facturasPendientesDTO with all 23 fields -->
    <anyo>2025</anyo>
    <ciclo>6</ciclo>
    <contrato>442761</contrato>
    <factura>F123456</factura>
    <importe>350.00</importe>
    <importeTotal>406.00</importeTotal>
    <impuestos>56.00</impuestos>
    <referencia>REF789</referencia>
    <!-- ... additional fields ... -->
  </facturasPendientes>
  <plazosPagoPendientes>
    <!-- Each plazosPagoPendientesDTO -->
    <contrato>442761</contrato>
    <idPlazo>101</idPlazo>
    <importe>200.00</importe>
    <fechaPrevista>2026-03-15</fechaPrevista>
    <formaPago>EFECTIVO</formaPago>
    <gestion>1</gestion>
  </plazosPagoPendientes>
</docs>
```

### PDF Document Content (Inferred)

The PDF payment document likely contains:
- Customer name and address
- Contract number and cadastral reference
- Itemized list of invoices being paid
- Total amount due
- Payment reference as barcode (for scanning at payment points)
- Due date / expiration date
- CEA Queretaro branding and legal text

---

## CFDI Integration

### Overview

CFDI (Comprobante Fiscal Digital por Internet) is Mexico's mandatory electronic invoicing system, governed by the SAT (Servicio de Administracion Tributaria). All businesses in Mexico, including public utilities like CEA Queretaro, must issue CFDI-compliant invoices for tax purposes.

### How the Debt Management Service Relates to CFDI

The Debt Management service itself does not directly generate CFDI documents, but it provides critical data inputs for the CFDI generation pipeline:

1. **`getDocumentoPagoXML`** -- The XML output from this operation contains structured payment data that can serve as the basis for generating a CFDI "Recibo de Pago" (payment receipt). The XML likely contains the transaction amounts, tax breakdowns, and reference numbers needed for CFDI stamping.

2. **`facturasPendientesDTO`** -- The `impuestos` (taxes), `importe` (base amount), and `importeTotal` (total) fields provide the tax calculation data required by CFDI. The `URL` field on pending invoices may link to an existing CFDI document for the original invoice.

3. **`cobrarReferencia` / `cobrarReferenciaFrmPago`** -- When a payment is processed, a CFDI "Complemento de Pago" (payment complement) should be generated. The `datosCobroDTO` provides the payment provenance data (bank, date, amount) that the CFDI complement requires.

### CFDI Data Mapping

| CFDI Requirement | Source in Debt Management |
|-----------------|---------------------------|
| RFC (Tax ID) | `nif` from `datosCobroDTO` or contract data |
| Invoice Amount | `importeTotal` from `facturasPendientesDTO` |
| Tax Amount | `impuestos` from `facturasPendientesDTO` |
| Payment Date | `fechaPago` from `datosCobroDTO` |
| Payment Method | `efectivoTarjeta` from `datosCobroFrmPagoDTO` (maps to CFDI payment method codes) |
| Payment Reference | `referencia` from payment operations |
| Bank Code | `banco` from `datosCobroDTO` |

### CFDI Integration Gap

The current service does not include operations for:
- Generating CFDI XML with SAT digital stamps (timbrado)
- Retrieving CFDI status or cancellation
- Downloading stamped CFDI PDFs

These capabilities may exist in the Contracts service (which has `getFacturaE` -- electronic invoice retrieval) or in a separate CFDI provider system. The `URL` field in `facturasPendientesDTO` may point to externally hosted CFDI documents.

---

## Error Handling for Financial Operations

### Standard Error Pattern

All 13 operations use the `resultadoDTO` pattern:

```xml
<resultadoDTO>
  <codigoError>0</codigoError>          <!-- 0 = success -->
  <descripcionError>OK</descripcionError>
</resultadoDTO>
```

### WSDL-Defined Exception

The WSDL defines `AquaCISWebServiceException` as the fault type for all operations. This is an empty complex type (`<xs:sequence/>`), meaning the exception itself carries no structured data -- error details must be extracted from the SOAP fault string.

```xml
<soap:Fault>
  <faultcode>soap:Server</faultcode>
  <faultstring>java.lang.NullPointerException</faultstring>
</soap:Fault>
```

### The `reultado` Typo Problem

Three response DTOs contain a duplicate result field misspelled as `reultado` (missing the 's'):
- `resultadoGetDeuda` (response of `getDeuda`)
- `resultadoGetDeudaContrato` (response of `getDeudaContrato`)
- `resultadoGetDeudaContratoBloqueo` (response of `getDeudaContratoBloqueoCobro`)

**Integration requirement:** Any integration code must:
1. Check `resultado` (from inherited `genericoDTO`) first
2. Fall back to `reultado` if the primary field is empty/null
3. Never assume only one error field exists

### Financial Operation Error Handling Recommendations

| Operation | Risk Level | Recommended Safeguards |
|-----------|-----------|----------------------|
| `cobrarReferencia` | **CRITICAL** | Idempotency check (prevent double collection), retry with backoff, transaction logging before and after, amount validation |
| `cobrarReferenciaFrmPago` | **CRITICAL** | Same as above, plus `efectivoTarjeta` validation |
| `avisarPago` | **HIGH** | Duplicate notification guard, amount matching against reference |
| `cancelarReferencia` | **HIGH** | Confirm reference exists and is active before cancellation, prevent cancellation of already-collected references |
| `getDocumentoPago` | **MEDIUM** | Timeout handling (PDF generation may be slow), retry on transient errors, validate returned PDF is not empty |
| `getDocumentoPagoXML` | **MEDIUM** | XML well-formedness validation, timeout handling |
| All `get*` queries | **LOW** | Standard timeout and retry patterns |

### Recommended Error Codes to Handle

Based on the `resultadoDTO` pattern and typical CIS operations:

| Likely `codigoError` | Meaning | Action |
|---------------------|---------|--------|
| `0` | Success | Process normally |
| Non-zero (specific codes unknown) | Operation failure | Log full response, display `descripcionError` to user |
| SOAP Fault | Server-side exception | Log fault string, retry if transient, alert if persistent |
| Empty/null response | Communication failure | Retry with exponential backoff |

---

## Critical Gaps

### Gap 1: No Payment Execution (CRITICAL)

The entire payment pipeline is unintegrated. AGORA can tell a customer how much they owe (via `getDeuda`) but cannot:
- Generate a payment slip for them to pay at a bank/store
- Record a payment made through any channel
- Cancel a stale payment reference

**Impact:** Customer service agents must switch to the legacy AquaCIS interface to process any payment-related action. Online/self-service payment is impossible through AGORA.

### Gap 2: No Invoice-Level Debt Visibility (HIGH)

Without `getDeudaTotalConFacturas` or `getImpagadosContrato`, AGORA cannot show customers which specific invoices are unpaid, their individual amounts, or their due dates. The integrated `getDeuda` only provides aggregate totals.

**Impact:** Agents cannot answer "Which bills am I behind on?" or "How much was my January bill?"

### Gap 3: No Collection Block Awareness (HIGH)

Without `getDeudaContratoBloqueoCobro`, AGORA has no way to detect if a contract's collection is blocked. If payment operations are integrated without this check, payments could be attempted on blocked accounts, leading to errors or incorrect financial postings.

**Impact:** Risk of processing payments on accounts with administrative holds, legal disputes, or other blocks.

### Gap 4: No Multi-Contract Debt View (MEDIUM)

Without `getContratosPorNifconDeuda`, agents cannot quickly see all debts for a customer who has multiple water contracts. They must query each contract individually.

**Impact:** Slower customer service for multi-contract holders, incomplete debt picture.

### Gap 5: No Payment Document Delivery (MEDIUM)

Without `getDocumentoPago`, AGORA cannot generate and email/download payment slips. Customers who want to pay at a bank or store must visit a CEA office to get a payment slip.

**Impact:** Reduced accessibility, higher foot traffic at CEA offices, slower collections.

---

## Integration Priority Ranking

| Rank | Operation | Priority | Rationale |
|------|-----------|----------|-----------|
| 1 | `getImpagadosContrato` | **HIGH** | Prerequisite for document generation and detailed debt view. Returns the `facturasPendientesDTO[]` and `plazosPagoPendientesDTO[]` needed by operations 8 and 9. Also provides `saldoCuentaDTO` for balance visibility. |
| 2 | `getDocumentoPago` | **HIGH** | Generates PDF payment slips with barcoded references. Enables self-service payment document delivery via email/portal. Highest direct customer impact. |
| 3 | `cobrarReferenciaFrmPago` | **HIGH** | Primary payment collection operation (preferred over `cobrarReferencia` because it captures cash/card distinction). Enables online payment processing through AGORA. |
| 4 | `getDeudaTotalConFacturas` | **HIGH** | Provides invoice-level debt breakdown with per-invoice payment references. Critical for itemized billing views and targeted payment selection. |
| 5 | `getDeudaContratoBloqueoCobro` | **HIGH** | Safety check before payment processing. Must be integrated before or alongside payment execution operations to prevent collection on blocked accounts. |
| 6 | `cancelarReferencia` | **HIGH** | Required whenever payment documents are regenerated or expire. Without this, orphaned references accumulate and create reconciliation issues. |
| 7 | `avisarPago` | **MEDIUM** | Payment notification for external channels. Lower priority than `cobrarReferenciaFrmPago` because it is a softer notification mechanism, but needed for complete multi-channel payment support. |
| 8 | `getContratosPorNifconDeuda` | **MEDIUM** | Multi-contract debt view by NIF. Enhances customer service efficiency for multi-property holders. |
| 9 | `getContratoPorContratoConDeuda` | **MEDIUM** | Rich single-contract debt view with pending invoices and installments. Partially overlaps with `getImpagadosContrato` but provides additional contract metadata. |
| 10 | `getDocumentoPagoXML` | **MEDIUM** | XML payment documents for electronic processing and CFDI pipeline. Lower priority than PDF because PDF serves the immediate customer-facing need. |
| 11 | `cobrarReferencia` | **LOW** | Simpler payment collection without cash/card distinction. `cobrarReferenciaFrmPago` supersedes this operation for new integrations, but may be needed for backward compatibility with legacy collection points. |
| 12 | `getDeudaContrato` | **LOW** | Lighter debt query. Largely redundant with the already-integrated `getDeuda`, which provides more information (commissions, payment references, previous balances). |

---

## Recommendations

### Recommendation 1: Integrate the Payment Document Pipeline (HIGH)

**Operations:** `getImpagadosContrato` + `getDocumentoPago`
**Effort:** Medium (2 operations, one complex DTO chain)
**Impact:** Enables AGORA agents and customers to generate payment slips on demand

The highest-impact integration is connecting `getImpagadosContrato` to `getDocumentoPago`. This enables a workflow where:
1. Agent or chatbot queries unpaid invoices for a contract
2. Customer selects which invoices to pay
3. System generates a PDF payment document with barcode
4. Document is emailed or displayed in portal

This workflow is self-contained, read-only (no financial mutation), and directly reduces foot traffic at CEA offices.

### Recommendation 2: Implement Payment Collection with Safety Checks (HIGH)

**Operations:** `getDeudaContratoBloqueoCobro` + `cobrarReferenciaFrmPago` + `cancelarReferencia`
**Effort:** High (financial operations require careful error handling, idempotency, logging)
**Impact:** Enables online payment processing through AGORA

Before processing any payment:
1. Check `bloquearCobro` via `getDeudaContratoBloqueoCobro`
2. If not blocked, process payment via `cobrarReferenciaFrmPago`
3. Provide `cancelarReferencia` for administrative corrections

This must be implemented with transaction logging, idempotency tokens, and comprehensive error handling. Consider a staged rollout: internal agents only first, then customer self-service.

### Recommendation 3: Build Invoice-Level Debt Views (HIGH)

**Operations:** `getDeudaTotalConFacturas`
**Effort:** Low (single read-only operation with well-defined response)
**Impact:** Provides detailed billing information that agents and customers need

Integrate `getDeudaTotalConFacturas` alongside the existing `getDeuda` to provide both summary and detailed views. The per-invoice `referenciaPago` field enables direct links to payment actions.

### Recommendation 4: Enable Multi-Contract Debt Discovery (MEDIUM)

**Operations:** `getContratosPorNifconDeuda` + `getContratoPorContratoConDeuda`
**Effort:** Low-Medium (read-only operations, similar to existing `getDeuda` patterns)
**Impact:** Better customer service for multi-property holders

These operations provide a customer-centric (rather than contract-centric) debt view, which is essential for a modern CIS platform.

### Recommendation 5: Add XML Document Generation for CFDI Pipeline (MEDIUM)

**Operations:** `getDocumentoPagoXML`
**Effort:** Low (mirrors `getDocumentoPago` integration)
**Impact:** Enables electronic invoicing compliance and ERP integration

Integrate `getDocumentoPagoXML` to provide the structured XML data needed for CFDI generation. This should be prioritized if CEA Queretaro's CFDI compliance requires payment receipts generated from AGORA.

### Recommendation 6: Implement External Payment Notification (MEDIUM)

**Operations:** `avisarPago`
**Effort:** Low (simple operation, 4 input parameters)
**Impact:** Enables integration with third-party payment gateways

If AGORA integrates with online payment processors (e.g., BBVA, Banorte, Mercado Pago), those processors need a way to notify AquaCIS when payment is received. `avisarPago` provides this bridge.

### Recommendation 7: Address WSDL Quirks in Integration Layer (LOW)

**Operations:** All operations with `reultado` typo
**Effort:** Low (code-level defensive parsing)
**Impact:** Prevents subtle bugs in error handling

Create a utility function in the integration layer that normalizes the `reultado` / `resultado` duality:

```javascript
function extractResultado(response) {
  return response.resultado || response.reultado || { codigoError: -1, descripcionError: 'No result found' };
}
```

---

## Integration Readiness Score: 8/10

| Criterion | Score | Notes |
|-----------|:-----:|-------|
| WSDL completeness | 9/10 | All 13 operations fully defined with complete type schemas |
| DTO clarity | 8/10 | Well-structured DTOs; `reultado` typo is a minor concern |
| Authentication requirements | 10/10 | No WS-Security required for any Debt Management operation |
| Error handling pattern | 7/10 | Consistent `resultadoDTO` but `AquaCISWebServiceException` is empty; error codes undocumented |
| Cross-service dependencies | 8/10 | Minimal -- mostly self-contained within the debt service; contract numbers from Contracts service are the only external dependency |
| Financial safety concerns | 6/10 | Payment operations need idempotency, double-collection prevention, and block-checking that are not enforced by the API itself |
| Existing integration foundation | 9/10 | `getDeuda` is already integrated, proving the proxy pattern works; SOAP infrastructure is in place |
| Data model consistency | 8/10 | DTOs share common patterns; `facturasPendientesDTO` flows cleanly from queries into document generation |

**Overall: 8/10** -- The service is well-designed for integration. The primary risks are operational (financial safety) rather than technical. The SOAP proxy infrastructure, error handling patterns, and DTO parsing are already proven by the `getDeuda` integration. The main work ahead is implementing the payment execution operations with appropriate financial safeguards.

---

*Analysis performed against WSDL contract at `/Users/fernandocamacholombardo/aqua/docs/debt.wsdl` and analyzed documentation at `/Users/fernandocamacholombardo/aqua/docs/aquasis-wsdl-debt.md`. Cross-referenced with integration status from `/Users/fernandocamacholombardo/aqua/docs/aquasis-integration.md` and full API context from `/Users/fernandocamacholombardo/aqua/docs/aquasis-api-documentation.md`.*
