# Notion Documentation Completion Plan

## Problem
The Readings and Contracts Notion sub-pages have many operations condensed into grouped summary tables instead of full individual operation details. Each operation should have its own section with:
- Description
- Input Parameters table
- Response table
- SOAP Request example

## Pages to Update

### Page 1: Readings & Client Portal Service
- **Notion ID:** `30431d87-6243-819c-850b-fdef406b2aa1`
- **Source file:** `/home/fcamacholombardo/AGORA-5/docs/aquasis-wsdl-readings.md`
- **Total operations:** 47 (9 implemented, 38 not implemented)

**Operations with full details (DONE):** 1, 2, 3, 4, 5, 6, 17, 18, 19, 20, 21, 31, 32, 33, 41

**Operations grouped into summary tables (MISSING full details):**
- Operations 7-8: cambiarUrl... (virtual office URL operations) - have params, missing SOAP examples
- Operation 9: getActuaciones - has params, missing SOAP example
- Operations 10-16: Banking & Geographic Lookups (getAgencias, getBanco, getBancosPorDescripcion, getBancoPorExplotacionCodigo, getBancosPorExplotacionDescripcion, getCallesPorPatron, getComunidadesDePais) - grouped summary only
- Operations 22-30: Contract & Address Lookups (getContrato, getContratoPorDatosGenerales, getContratosPorDatosGenerales, getContratosPorNif, getContratosPorNie_crn, getDomicilio, getDomiciliosContratados, getDomiciliosPendientesContratar, getFactura) - grouped summary only
- Operations 34-40: Readings, Geographic & Banking (getLecturasParaGraficas, getLocalidadesDePoblacion, getNumeroCuentaBancaria, getPaises, getPoblacionesDeProvincia, getProvincia, getProvinciasDeComunidad) - grouped summary only
- Operations 42-47: Tariffs, Holders & Messages (getTarifasVigente, getTitularPorContrato, getTitularPorNif, getTitularPorNie_crn, getTitulares, getUltimoMensaje) - grouped summary only

**Strategy:** Create sub-page "Operations Detail - Complete Reference" under the Readings page with full details for all grouped operations (ops 7-16, 22-30, 34-40, 42-47).

### Page 2: Contracts Service
- **Notion ID:** `30431d87-6243-8155-9053-eec424ae6481`
- **Source file:** `/home/fcamacholombardo/AGORA-5/docs/aquasis-wsdl-contracts.md`
- **Total operations:** 53 (4 SOAP + 3 REST implemented)

**Operations with full details (DONE):** 1, 2, 3, 17, 18, 31

**Operations grouped into summary tables (MISSING full details):**
- Operations 4-9: Contract History & Documentation (consultaDocumentacionContrato, consultaDocumentacionTramite, consultaHistoricoActuacionesContrato, consultaHistoricoConsumoContrato, consultaHistoricoDomiciliacion, consultaLiquidacionTramite) - grouped summary only
- Operations 10-16: Invoice Counts, Service Orders & Client Lookups (countFacturasContrato, crearOrdenServicio, esPSContratable, esTitular, getCierresByIdsContrato, getClienteListByExplotacion, getConsumos) - grouped summary only
- Operations 19-22: Contract & Invoice Lookups (getContratosByNumFactNumContrato, getExplotacionesUsuario, getFacturaE, getFacturas) - grouped summary only
- Operations 23-30: Invoice & Print Operations (getFacturasContrato, getFacturasContratoReferencia, getFacturasPorCondiciones, getIDPersonaContrato, getImpresionesLocalesPendientes, getMotivosOrden, getPDFImpresionLocalPendiente, getPdfDocumentoFactura) - grouped summary only
- Operations 32-38: PDF, Person & Contact Operations (getPdfMandato, getPersonaList, getTiposOrden, getValidacionVerFactura, recuperaFacturasByIds, recuperaOrdenesServicio, registrarContactoManual) - grouped summary only
- Operations 39-43: Supply & Service Requests (solicitudAcometida, solicitudActivacionFacturaOnline, solicitudAltaServiAlerta, solicitudAltaSuministro, solicitudBajaSuministro) - grouped summary only
- Operations 44-53: Modification & Bulk Requests (solicitudCambioDomiciliacionBancaria through solicitudSubrogacionContrato) - grouped summary only

**Strategy:** Create sub-page "Operations Detail - Complete Reference" under the Contracts page with full details for all grouped operations (ops 4-16, 19-30, 32-53).

### Pages Already Complete (no changes needed)
- **Meters Service** (`30431d87-6243-81dc-8ea3-e574ec77bb69`) - 4 operations, all fully detailed
- **Debt Management Service** (`30431d87-6243-81c0-b6a1-f4a3c6b86f88`) - 13 operations, all fully detailed
- **Work Orders Service** (`30431d87-6243-8160-84fb-f994b01e683d`) - 9 operations, all fully detailed

## Execution Strategy

### Constraint
Subagents CANNOT use MCP (Notion) tools due to permission restrictions. Subagents also cannot write files.

### Approach
1. **Agent 1 (Readings):** Read source file `aquasis-wsdl-readings.md`, extract all operations that are missing full details (7-16, 22-30, 34-40, 42-47), convert each to Notion-flavored markdown, return the converted content
2. **Agent 2 (Contracts Part A):** Read source file `aquasis-wsdl-contracts.md`, extract operations 4-30, convert to Notion-flavored markdown, return content
3. **Agent 3 (Contracts Part B):** Read source file `aquasis-wsdl-contracts.md`, extract operations 32-53, convert to Notion-flavored markdown, return content
4. **Main thread:** Take agent outputs and create Notion sub-pages using MCP tools

### Notion Markdown Conversion Rules
- All markdown tables → XML `<table header-row="true">` format
- Status "**Implemented**" → `<span color="green">**Implemented**</span>`
- Status "Schema only" → `<span color="orange">**Schema only**</span>`
- Code blocks stay as ` ```xml ... ``` `
- Square brackets in text → `\[` and `\]` (NOT inside code blocks, links, or table td tags)
- Page titles NOT included as H1 in content
- Wide tables use `fit-page-width="true"` attribute

## Progress Tracking

- [x] Agent 1: Readings operations conversion
- [x] Agent 2: Contracts operations A (4-30) conversion
- [x] Agent 3: Contracts operations B (32-53) conversion
- [x] Create Notion sub-page: Readings Complete Reference (ID: `30431d87-6243-812e-9785-df32a15939d3`)
- [x] Create Notion sub-page: Contracts Part A (4-30) (ID: `30431d87-6243-81d5-adb1-d0b0488dabf8`)
- [x] Create Notion sub-page: Contracts Part B (32-53) (ID: `30431d87-6243-818e-a2e6-ebf4411b5d31`)
