# Phase 4: API Integration Waves

**Timeline:** Months 1-5 (Weeks 1-20), parallel with database remediation work
**Goal:** Increase SOAP API integration from 17 operations (13.5%) to 90+ operations (71%+ coverage)
**Priority:** CRITICAL -- Revenue collection, customer identification, and self-service capabilities are blocked
**Synthesized from:** Division B (B1-B7) API analysis reports and Integration Roadmap

---

## 1. Phase Overview

### Objective

Systematically integrate the 109 unintegrated AquaCIS SOAP operations across 5 services, delivered in 5 waves of increasing complexity. Each wave unlocks a distinct business capability cluster, starting with the highest-impact gaps (customer identification, debt visibility) and progressing through payments, field operations, self-service, and advanced workflows.

### Current State

| Metric | Value |
|--------|-------|
| Total SOAP operations | 126 across 5 services |
| Integrated today | 17 (13.5%) |
| Available to integrate | 104 |
| Schema-only / blocked | 5 (require CEA server-side enablement) |
| API Coverage Health Score | 3/10 |

### Target State (End of Wave 5)

| Metric | Target |
|--------|--------|
| Integrated operations | 90+ (71%+) |
| Payment processing | 100% of available payment ops |
| Customer identification | NIF, invoice number, address, NIE/CRN |
| Work order visibility | Full lifecycle query + PDF generation |
| Self-service changes | Address, bank, mobile, readings, personal data |
| API Coverage Health Score | 7/10 |

### Timeline

| Wave | Weeks | Focus | Ops Added | Cumulative |
|------|:-----:|-------|:---------:|:----------:|
| Wave 1: Foundation | 1-4 | Customer ID, debt visibility, WO monitoring, meters | ~19 | 36 |
| Wave 2: Payments | 5-8 | Payment processing, references, documents | ~12 | 48 |
| Wave 3: Work Orders + Meters | 9-12 | Field operations, catalogs, invoices, tariffs | ~11 | 59 |
| Wave 4: Self-Service | 13-16 | Address/bank changes, notifications, readings | ~15 | 74 |
| Wave 5: Advanced | 17-20 | Contract lifecycle, bulk ops, catalogs, reporting | ~16+ | 90+ |

### Prerequisites

1. Rails proxy controller (`cea_proxy_controller.rb`) operational and accessible
2. SOAP endpoint connectivity to all 5 AquaCIS services confirmed
3. WS-Security credentials available server-side (not just in frontend `VITE_` vars)
4. Development environment with WSDL access for each service
5. VCR/WebMock test infrastructure for SOAP response recording
6. BUG-2 fix deployed (WS-Security headers on `crearOrdenTrabajo`) -- prerequisite for Wave 1

### Team

| Role | Count | Allocation |
|------|:-----:|-----------|
| Senior Backend Developer (Rails) | 1 | Full-time, all 5 waves |
| Full-Stack Developer (Vue + Rails) | 1 | Full-time, all 5 waves |
| QA Engineer | 0.5 | Part-time, focused on Waves 2 and 4 |
| DevOps Engineer | 0.25 | Part-time, modernization support |

---

## 2. Wave 1: Foundation (Weeks 1-4)

**Goal:** Enable customer identification by NIF, detailed debt visibility with invoice breakdown, work order monitoring after creation, meter detail access, and contract audit trails.

**Business Impact:** Eliminates the two most painful daily friction points: (1) agents need the contract number to start any interaction, and (2) zero visibility into work orders after creation.

**Estimated Effort:** 2-3 developer-weeks

### Week 1: Customer Identification

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W1-01 | `getContratosPorNif` | Readings (InterfazOficinaVirtualClientesWS) | 4h | None | Given a valid NIF, returns all associated contracts. Verify contract list matches known test data. Handle empty results gracefully. |
| W1-02 | `getTitularPorNif` | Readings | 4h | None | Given a valid NIF, returns holder data (name, address, document). Verify response DTO parsing. |
| W1-03 | `getTitulares` | Readings | 4h | None | Multi-criteria search (name, NIF, address). Verify pagination if present. Test with partial matches. |
| W1-04 | `getTitularPorContrato` | Readings | 4h | None | Given exploitation + contract number, returns holder details. Used for identity verification after NIF lookup. |

**Dependency Chain Enabled:**
```
Customer provides NIF
  --> getContratosPorNif(nif) --> returns contract list
    --> getTitularPorContrato(contrato) --> verify identity
      --> consultaDetalleContrato(contrato) [EXISTING] --> full detail
        --> (any downstream operation)
```

### Week 2: Detailed Debt Visibility

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W1-05 | `getDeudaTotalConFacturas` | Debt (InterfazGenericaGestionDeudaWS) | 6h | None | Returns invoice-level debt breakdown with per-invoice `referenciaPago`. Verify individual invoice amounts sum to total. Handle `reultado` typo (BUG-4). |
| W1-06 | `getImpagadosContrato` | Debt | 6h | None (but prerequisite for Wave 2 payment document generation) | Returns `facturasPendientesDTO[]` + `plazosPagoPendientesDTO[]` + `saldoCuentaDTO`. Verify array parsing. Critical data for payment pipeline. |
| W1-07 | `getDeudaContratoBloqueoCobro` | Debt | 4h | Must be available before any payment ops in Wave 2 | Returns `bloquearCobro` boolean. Safety check before payment processing. Handle `reultado` typo (BUG-4). |
| W1-08 | `getContratosPorNifconDeuda` | Debt | 4h | None | Returns all contracts with debt for a NIF. Multi-property holder view. Verify debt amounts per contract. |

**Implementation Note:** Build a normalizer function for the `reultado` typo present in `getDeudaContrato`, `getDeudaContratoBloqueoCobro`, and `getDeudaTotalConFacturas` responses:
```ruby
def extract_resultado(response)
  response[:resultado] || response[:reultado] || { codigo_error: -1, descripcion_error: 'No result found' }
end
```

### Week 3: Work Order Monitoring + Contract History

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W1-09 | `refreshData` | Work Orders (InterfazGenericaOrdenesServicioWS) | 8h | Fix BUG-3: set `otClassID=1`, populate `operationalSiteID` | Returns full order context: meter elements, readings, unpaid bills, customer debt, comments. Verify all sub-objects parse correctly. Test with various order types. |
| W1-10 | `getDocumentoOrdenTrabajo` | Work Orders | 6h | Needs order code from `crearOrdenTrabajo` or `refreshData` | Returns base64 PDF. Handle PascalCase `ResultadoDTO` with `codigoError` as `string` not `int` (BUG-6). Verify PDF is valid and downloadable. |
| W1-11 | `consultaHistoricoActuacionesContrato` | Contracts (InterfazGenericaContratacionWS) | 4h | None | Contract action audit trail. Verify pagination (uses `registroInicial` + `registroTotal`). Test with contracts having 0, 1, and many actions. |
| W1-12 | `getActuaciones` | Readings | 4h | None | Service intervention history per contract. Verify response structure and date ordering. |

**Bug Fixes Required in This Week:**
- BUG-3 (HIGH): `refreshData` -- set `otClassID=1` and populate `operationalSiteID` with exploitation code
- BUG-6 (MEDIUM): `getDocumentoOrdenTrabajo` -- handle `codigoError` as both `string` and `int`

### Week 4: Meter Details + Supplementary Reads

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W1-13 | `getContador` | Meters (InterfazGenericaContadoresWS) | 4h | None (uses meter serial already available via `consultaDetalleContrato`) | Returns meter detail: brand, model, caliber, year, damage flag, installation/removal dates, `idPuntoServicio` (reverse lookup). Only 1 param. Verify all fields parsed. |
| W1-14 | `getCambiosContadorDeContrato` | Meters | 4h | Needs contract number | Meter change history timeline with contractor info. Essential for consumption dispute resolution. Verify chronological ordering. |
| W1-15 | `getContratosByNumFactNumContrato` | Contracts | 4h | None | Find contract by invoice number. Common customer scenario. Returns `ContratoIVRDTO` (simpler DTO). |
| W1-16 | `getContratoPorContratoConDeuda` | Debt | 4h | None | Rich single-contract debt view with pending invoices, installments, `procesoImpagadoSN` flag. |
| W1-17 | `getDeudaContrato` | Debt | 4h | None | Lighter contract-level debt query. Handle `reultado` typo (BUG-4). |

### Wave 1 Outcomes

- Agents can identify any customer by NIF and see all their contracts
- Detailed debt visibility with per-invoice breakdown replaces summary-only view
- Work orders queryable post-creation with full context (meter, readings, debt, comments)
- Work order PDFs generated for field crews and customers
- Meter details and change history accessible
- Contract action audit trails visible
- Customer lookup by invoice number enabled

### Wave 1 Acceptance Criteria

- [ ] All 17 new operations return valid responses in staging environment
- [ ] `getContratosPorNif` resolves > 95% of test NIFs to correct contracts
- [ ] `refreshData` returns complete order data with BUG-3 fix applied
- [ ] `getDocumentoOrdenTrabajo` produces downloadable, valid PDF files
- [ ] `reultado` typo handled transparently across all Debt operations
- [ ] VCR cassettes recorded for all 17 operations
- [ ] Unit tests with > 90% coverage for new integration code
- [ ] No regressions in existing 17 integrated operations

---

## 3. Wave 2: Payments (Weeks 5-8)

**Goal:** Enable end-to-end payment collection from within AGORA. This is the single highest-impact gap: every customer payment inquiry currently requires agents to switch systems.

**Business Impact:** Revenue-critical. Enables agents to generate payment slips, collect payments, notify external payments, and cancel references -- all without leaving AGORA.

**Estimated Effort:** 4-5 developer-weeks

### Week 5: Payment Document Generation

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W2-01 | `getDocumentoPago` | Debt | 8h | Requires `getImpagadosContrato` output (W1-06) | Generates PDF payment slip with barcode reference. Returns `referencia` + `rafagaPago` + base64 PDF. Verify PDF is valid, barcode is scannable, reference matches expected format. |
| W2-02 | `getDocumentoPagoXML` | Debt | 6h | Same dependency chain as W2-01 | XML variant for CFDI pipeline and programmatic processing. Verify XML schema validity. Preserve all fiscal identifiers unchanged. |

**Dependency Chain:**
```
getImpagadosContrato [Wave 1, W1-06]
  --> returns facturasPendientesDTO[] + plazosPagoPendientesDTO[]
    --> Customer/agent selects invoices to pay
      --> getDocumentoPago(contrato, nif, idioma, selectedDocs)
        --> returns: referencia (barcode), rafagaPago, PDF
```

### Week 6: Payment Collection

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W2-03 | `cobrarReferenciaFrmPago` | Debt | 12h | Requires `getDocumentoPago` reference (W2-01) + `getDeudaContratoBloqueoCobro` check (W1-07) | Primary payment collection with cash/card distinction (`efectivoTarjeta`). Verify idempotency token prevents double collection. Verify `bloquearCobro` check is enforced. Log transaction state before AND after SOAP call. |
| W2-04 | `cobrarReferencia` | Debt | 8h | Same as W2-03 (simpler variant) | Standard payment collection without cash/card flag. Backward compatibility. Same safeguards as W2-03. |

**CRITICAL Safeguards (mandatory for both operations):**
1. Always check `bloquearCobro` via `getDeudaContratoBloqueoCobro` before processing
2. Idempotency tokens to prevent double collection
3. Transaction logging before AND after the SOAP call
4. Amount validation against reference amount
5. Staged rollout: internal agents only first, then customer self-service

### Week 7: Payment Notifications + Cancellation

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W2-05 | `avisarPago` | Debt | 6h | Requires `documentoPago` reference from `getDeuda` [EXISTING] | Soft payment notification for external channels (online gateways, bank transfers). Verify notification creates correct record in AquaCIS. |
| W2-06 | `cancelarReferencia` | Debt | 6h | Requires active payment reference | Invalidates a payment reference. Essential for expired documents, changed amounts, erroneous references. Verify reference is no longer usable after cancellation. |

### Week 8: Extended Debt Views + Integration Testing

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W2-07 | `getDeudaContrato` (enhanced) | Debt | 4h | None | Additional debt view already started in W1-17; enhance with UI integration. |
| W2-08 | `getContratoPorContratoConDeuda` (enhanced) | Debt | 4h | None | Rich view already started in W1-16; add debt-focused UI integration. |
| W2-09 | End-to-end payment pipeline testing | -- | 16h | All Wave 2 operations | Full flow: debt query -> document generation -> collection -> cancellation. Error handling hardening for `ResultadoDTO` errors, SOAP faults, network timeouts, partial failures. |

**Complete Payment Flow After Wave 2:**
```
1. getDeuda [EXISTING] --> summary view
2. getDeudaTotalConFacturas [Wave 1] --> invoice breakdown
3. getImpagadosContrato [Wave 1] --> selectable unpaid invoices
4. getDeudaContratoBloqueoCobro [Wave 1] --> safety check
5. getDocumentoPago [Wave 2] --> PDF + reference
6. cobrarReferenciaFrmPago [Wave 2] --> collect payment
   OR avisarPago [Wave 2] --> notify external payment
   OR cancelarReferencia [Wave 2] --> cancel reference
```

**CFDI Integration Notes:**

| CFDI Requirement | Source in Debt Management |
|-----------------|---------------------------|
| RFC (Tax ID) | `nif` from `datosCobroDTO` or contract data |
| Invoice Amount | `importeTotal` from `facturasPendientesDTO` |
| Tax Amount | `impuestos` from `facturasPendientesDTO` |
| Payment Date | `fechaPago` from `datosCobroDTO` |
| Payment Method | `efectivoTarjeta` from `datosCobroFrmPagoDTO` |
| Payment Reference | `referencia` from payment operations |

The `getDocumentoPagoXML` operation produces structured XML for CFDI generation. Never transform or reformat fiscal identifiers (UUID, RFC, serie, folio). Pass CFDI data through unchanged.

### Wave 2 Outcomes

- Complete payment cycle: view debt -> generate payment slip -> collect payment -> cancel if needed
- Revenue-critical capability restored to AGORA
- CFDI data pipeline enabled via XML document generation
- Payment notification for external channels (banks, stores)
- Reference lifecycle management (create, cancel)

### Wave 2 Acceptance Criteria

- [ ] Full payment pipeline executes end-to-end in staging without errors
- [ ] `bloquearCobro` check is enforced before every payment attempt (no bypass possible)
- [ ] Idempotency tokens prevent duplicate payments in concurrent scenarios
- [ ] Transaction logging captures pre- and post-SOAP-call state for every payment
- [ ] Payment PDFs are valid, contain correct barcodes, and match reference amounts
- [ ] `cancelarReferencia` successfully invalidates references (verified by re-query)
- [ ] CFDI XML output preserves all fiscal identifiers unchanged
- [ ] Error rate < 1% on payment operations in staging
- [ ] QA sign-off on full payment flow with edge cases (blocked accounts, expired references, zero-amount)

---

## 4. Wave 3: Work Orders + Meters (Weeks 9-12)

**Goal:** Close the work order visibility gap with batch queries, enable dynamic catalogs, complete invoice management, and add tariff transparency.

**Business Impact:** Replaces hardcoded order type/motive values with dynamic catalogs. Enables dashboard batch loading. Adds "Why is my bill this amount?" capability.

**Estimated Effort:** 3-4 developer-weeks

### Week 9: Work Order Batch Queries + Catalogs

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W3-01 | `multipleRefreshData` | Work Orders | 6h | Reuses OT parsing from `refreshData` (W1-09) | Batch query for dashboard loading and mobile sync. Verify array of OTRequest processes correctly. Test with 1, 5, and 20 orders. |
| W3-02 | `getTiposOrden` | Contracts | 4h | None | Dynamic order type catalog. Replace hardcoded values (6, 21, 23, 32, 33). Verify all order types returned and cacheable. |
| W3-03 | `getMotivosOrden` | Contracts | 4h | Needs `tipoOrden` from W3-02 | Dynamic order motive catalog per order type. Verify motives change based on selected type. |

### Week 10: Invoice Enhancement + Tariffs

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W3-04 | `getFacturasContrato` | Contracts | 6h | None | Paginated invoice list using `registroInicial` + `registroTotal`. Verify pagination behavior at boundaries. |
| W3-05 | `getFactura` | Readings | 4h | None | Single invoice detail drill-down. Verify all invoice fields parsed. |
| W3-06 | `getPdfDocumentoFactura` | Contracts | 4h | None | Alternative invoice PDF by document ID. Verify base64 PDF is valid. |
| W3-07 | `getConceptoConTarifasDeContrato` | Readings | 6h | None | Tariff breakdown per contract. Answers "Why is my bill this amount?" Maps tariff sub-concepts to charges. |
| W3-08 | `getTarifasVigente` | Readings | 4h | None | Full active tariff schedule. Static reference data, cacheable (24h TTL). |

### Week 11: Service Order Management + Identity

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W3-09 | `recuperaOrdenesServicio` | Contracts | 6h | None | Retrieve service orders by IDs. Verify batch retrieval and status fields. |
| W3-10 | `esTitular` | Contracts | 4h | None | Identity verification: 2 params (document + contract number), boolean result. Security enabler for write operations in Waves 4-5. |
| W3-11 | `getLecturasParaGraficas` | Readings | 4h | None | Chart-ready reading data. Completes visualization pair with `getConsumosParaGraficas` [EXISTING]. |

### Week 12: Leverage Existing Data + Consolidation

| Task ID | Activity | Effort | Dependencies | Test Criteria |
|---------|----------|:------:|-------------|--------------|
| W3-12 | Parse full `getPuntoServicioPorContador` response | 8h | None (data already returned by EXISTING integration) | Currently only `id` extracted. Parse and expose: address, zone, sector, cut status (`snCortadoPorDeuda`, `snCortadoPorVencimientoContrato`), geocoordinates (37 fields total). No new API call needed. |
| W3-13 | Build meter-centric search flow | 6h | `getContador` (W1-13) + `getPuntoServicioPorContador` [EXISTING] | Use `getContador` to validate meter serial, then `getPuntoServicioPorContador` to resolve service point. Enables field technicians to search by meter serial instead of contract number. |

### Wave 3 Outcomes

- Work orders fully visible with batch queries for dashboards
- Order type/motive catalogs are dynamic (no more hardcoded values)
- Invoice management comprehensive (list, detail, PDF, tariff breakdown)
- Service point data fully utilized (address, geocoordinates, cut status)
- Meter-based search available for field operations
- Identity verification available as security gate for write operations

### Wave 3 Acceptance Criteria

- [ ] `multipleRefreshData` loads dashboard with 20 orders in < 3 seconds
- [ ] All hardcoded order type/motive values replaced with `getTiposOrden`/`getMotivosOrden` responses
- [ ] Invoice pagination works correctly at boundary conditions
- [ ] Tariff breakdown explains bill amounts with per-concept detail
- [ ] `esTitular` correctly verifies or rejects holder identity
- [ ] Service point data displays address, zone, cut status, and geocoordinates
- [ ] Meter-centric search resolves serial number to full contract/service point context

---

## 5. Wave 4: Self-Service (Weeks 13-16)

**Goal:** Enable agents to process the most common customer change requests without leaving AGORA: address changes, bank detail changes, mobile notifications, meter reading submissions, and personal data modifications.

**Business Impact:** These are the highest-volume customer service requests. Every one currently requires agents to switch to the legacy AquaCIS interface.

**Estimated Effort:** 5-6 developer-weeks

### Week 13: Notification Management + Alternative Lookups

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W4-01 | `cambiarMovilNotificacionContrato` | Readings | 6h | None (WS-Security required) | Mobile notification change. Extends existing email notification pattern. Verify WS-Security headers are included. Test with valid/invalid phone formats. |
| W4-02 | `getUltimoMensaje` | Readings | 4h | None | Latest system message to customer. Simple read. Verify message content and date parsing. |
| W4-03 | `getContrato` (Readings) | Readings | 4h | None | Contract details via Readings service (alternative view, different DTO from Contracts service). |
| W4-04 | `getContratosPorNie_crn` | Readings | 4h | None | Contract lookup by NIE/CRN identifier. Extends customer identification beyond NIF. |
| W4-05 | `getTitularPorNie_crn` | Readings | 4h | None | Holder lookup by NIE/CRN. Complements W4-04. |

### Week 14: Address Changes

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W4-06 | `cambiarDireccionCorrespondencia` | Readings | 10h | May need geographic catalogs (Wave 5) for address validation | Correspondence address change. 12 address component parameters. Verify all required fields enforced. Test with edge cases (missing optional fields, special characters). **Write operation -- requires confirmation UI.** |
| W4-07 | `getDomicilio` | Readings | 4h | None | View current service address. Read-only prerequisite for address change forms. |
| W4-08 | `getContratoPorDatosGenerales` | Readings | 4h | None | Contract lookup by address (single result). |
| W4-09 | `getContratosPorDatosGenerales` | Readings | 6h | None | Multiple contracts at address (multi-unit buildings). |

### Week 15: Banking Changes + Meter Readings

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W4-10 | `cambiarDomiciliacionBancaria` | Readings | 12h | None (but requires PCI-DSS security review) | Bank direct debit change. **High risk -- financial data. Requires additional security review, input validation, and confirmation flow.** Verify bank account format validation. |
| W4-11 | `getNumeroCuentaBancaria` | Readings | 4h | None | View current bank account (read-only, lower risk). Prerequisite for change forms -- shows what will be replaced. |
| W4-12 | `solicitudIntroduccionLectura` | Contracts | 8h | Needs contract number + 4 reading params | Self-service meter reading submission. Write operation with `ResultadoDTO` response. Validate reading is within plausible range. |

### Week 16: Personal Data + Supplementary Operations

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W4-13 | `solicitudModificacionDatosPersonales` | Contracts | 12h | None | Personal data modification request. **17 parameters -- highest complexity write operation.** Requires comprehensive input validation and confirmation flow. |
| W4-14 | `cambiarSenasCobroBancarias` | Contracts | 10h | None | Direct bank details update (Contracts service version). **14 parameters + banking data. Very high risk.** Requires same PCI-DSS review as W4-10. |
| W4-15 | `cambiarDomicilioNotificaciones` | Contracts | 8h | Needs `DireccionNotificacionDTO` | Notification address change (Contracts service version). Complex DTO structure. |
| W4-16 | `getConceptoConTarifasDeFactura` | Readings | 4h | None | Invoice-specific tariff breakdown. Dispute resolution aid. |

### Wave 4 Outcomes

- Agents can process address changes, bank detail changes, and mobile notification updates
- Customer meter reading submission enabled
- Personal data modification available (with authorization controls)
- Alternative customer identification via NIE/CRN
- Invoice-level tariff detail available for dispute resolution

### Wave 4 Acceptance Criteria

- [ ] Address changes persist correctly in AquaCIS (verified by re-query)
- [ ] Bank detail changes include PCI-DSS-compliant input handling and confirmation flow
- [ ] Mobile notification changes follow same pattern as existing email changes
- [ ] Meter reading submissions are validated for plausible range before submission
- [ ] `solicitudModificacionDatosPersonales` validates all 17 parameters before SOAP call
- [ ] All write operations include confirmation UI (no silent mutations)
- [ ] QA sign-off on all write operations with valid, invalid, and edge-case inputs
- [ ] Security review completed for banking operations (W4-10, W4-14)

---

## 6. Wave 5: Advanced (Weeks 17-20)

**Goal:** Fill remaining gaps for near-complete API coverage: contract lifecycle via Contracts WS, bulk operations, catalogs, documentation, and reporting support.

**Business Impact:** Incremental. Completes the long tail of operations. Enables advanced workflows and admin capabilities.

**Estimated Effort:** 4-5 developer-weeks

### Week 17: Contract Lifecycle via Contracts Service

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W5-01 | `crearOrdenServicio` | Contracts | 8h | Investigate relationship with WO service `crearOrdenTrabajo` | Simpler service order creation (5 params vs 12+ for `crearOrdenTrabajo`). Verify it creates valid order in AquaCIS. Document differences from WO service. |
| W5-02 | `esPSContratable` | Contracts | 4h | None | Check if service point can receive new contract. Boolean result. Prerequisite for future contract lifecycle ops. |
| W5-03 | `consultaHistoricoConsumoContrato` | Contracts | 4h | None | Historical consumption via Contracts service (alternative to Readings). Paginated. |
| W5-04 | `registrarContactoManual` | Contracts | 6h | None | Log customer contacts in AquaCIS CRM. 7 parameters. Write operation. |

### Week 18: Invoice Management Completion

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W5-05 | `getFacturasPorCondiciones` | Contracts | 8h | None | Advanced invoice search with multiple filter arrays. Complex but powerful. Verify filter combinations. |
| W5-06 | `recuperaFacturasByIds` | Contracts | 4h | None | Batch invoice retrieval by IDs. Verify batch sizes. |
| W5-07 | `countFacturasContrato` | Contracts | 3h | None | Invoice count for pagination. Returns `xs:int`. |
| W5-08 | `getFacturaE` | Contracts | 6h | None | Electronic invoice XML for CFDI compliance. Base64 XML response. |
| W5-09 | `solicitudActivacionFacturaOnline` | Contracts | 4h | None | Toggle online invoicing. Batch-capable (`ResultadoDTO`). |
| W5-10 | `solicitudFacturaEnQuejaActiva` | Contracts | 3h | None | Invoice complaint flag. Simple write. |

### Week 19: Documentation + Meter Catalogs

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W5-11 | `consultaDocumentacionContrato` | Contracts | 4h | None | Contract document list. Simple read. |
| W5-12 | `consultaDocumentacionTramite` | Contracts | 6h | Needs `PuntoSuministroDTO` | Process documentation retrieval. |
| W5-13 | `consultaLiquidacionTramite` | Contracts | 6h | None | Settlement calculation for processes. |
| W5-14 | `getCalibres` | Work Orders | 4h | None | Meter caliber catalog. Supports incremental sync via `fechaDesde`. Cache locally. |
| W5-15 | `getMarcasYModelos` | Work Orders | 4h | None | Meter brands/models catalog. Nested structure (brands -> models). Cache locally. |
| W5-16 | `actualizarContador` | Meters | 8h | None | Meter metadata correction (brand, model, caliber, year, serial). **Write operation -- requires RBAC.** Fix BUG-5 (resolve `otResolutionElements` constraint). |

### Week 20: Bulk Operations + Reference Data

| Task ID | SOAP Operation | Service | Effort | Dependencies | Test Criteria |
|---------|---------------|---------|:------:|-------------|--------------|
| W5-17 | `crearOrdenExterna` | Work Orders | 8h | Only if SGO integration is needed | External order creation from SGO systems. |
| W5-18 | Geographic catalogs (7 ops) | Readings | 8h (bulk) | None | `getCallesPorPatron`, `getComunidadesDePais`, `getLocalidadesDePoblacion`, `getPaises`, `getPoblacionesDeProvincia`, `getProvincia`, `getProvinciasDeComunidad`. Bulk import to local DB rather than live API calls. Static reference data. |
| W5-19 | Bank reference data (5 ops) | Readings | 6h (bulk) | None | `getAgencias`, `getBanco`, `getBancosPorDescripcion`, `getBancoPorExplotacionCodigo`, `getBancosPorExplotacionDescripcion`. Integrate alongside banking features. |
| W5-20 | Remaining misc operations | Various | 8h | None | `solicitudAltaServiAlerta`, `solicitudModificacionServiAlertaMasiva`, `consultaHistoricoDomiciliacion`, `getCierresByIdsContrato`, `getClienteListByExplotacion`, `getExplotacionesUsuario`, `solicitudCambioDomiciliacionBancaria`, `solicitudCambioDomicilioNotificaciones`, `getIDPersonaContrato`, `getPersonaList`, `getValidacionVerFactura`, `getFacturasContratoReferencia`, `getPdfMandato`, `getDomiciliosContratados`, `getDomiciliosPendientesContratar`. Opportunistic integration. |

### Operations to Skip (Not Relevant to AGORA)

| Operation | Reason |
|-----------|--------|
| `getImpresionesLocalesPendientes` | Local print queue management -- does not fit AGORA use case |
| `getPDFImpresionLocalPendiente` | Same as above |
| `solicitudIntroduccionLecturaIVR` | IVR telephone channel, not AGORA |
| `cambiarUrlOficinaVirtualExplotacion` | Admin config with no customer-facing value |
| `cambiarUrlOficinaVirtualSociedad` | Admin config with no customer-facing value |
| `getIdiomaExplotacion` | Language config for single utility -- already known |

### Schema-Only Operations (BLOCKED -- Require CEA Action)

| Operation | Business Value | Status | Required Action |
|-----------|:-------------:|--------|----------------|
| `solicitudAcometida` | CRITICAL | XSD schema defined but NOT in WSDL portType | Formal request to CEA/Aqualia |
| `solicitudAltaSuministro` | CRITICAL | Cannot be called via SOAP | Formal request to CEA/Aqualia |
| `solicitudBajaSuministro` | CRITICAL | Requires CEA server-side enablement | Formal request to CEA/Aqualia |
| `solicitudCambioTitularContrato` | CRITICAL | Requires CEA server-side enablement | Formal request to CEA/Aqualia |
| `solicitudSubrogacionContrato` | HIGH | Requires CEA server-side enablement | Formal request to CEA/Aqualia |

**Action Required:** Formally engage CEA Queretaro / Aqualia/Agbar to enable these 5 operations. They represent the complete contract lifecycle (new supply, termination, ownership transfer) and are the highest-value blocked capability. Submit written request with business case quantifying revenue impact.

### Wave 5 Outcomes

- Near-complete API coverage for all non-admin, non-schema-only operations
- Full invoice management suite (search, batch, e-invoicing, complaints)
- Meter catalog data for field operations
- Contract documentation and settlement calculations
- Geographic and bank reference data imported locally

### Wave 5 Acceptance Criteria

- [ ] All targeted operations return valid responses in staging
- [ ] Geographic and bank reference data cached locally with sync mechanism
- [ ] E-invoice (CFDI) operations produce valid XML
- [ ] Meter metadata updates work with RBAC controls
- [ ] Formal request submitted to CEA for 5 schema-only operations
- [ ] Total integrated operations count reaches 90+
- [ ] Overall API coverage exceeds 71%

---

## 7. Per-Operation Implementation Pattern

Every operation integration follows this standard template:

### Step 1: WSDL Analysis (1h)
- Extract operation signature from WSDL
- Document input parameters (name, type, required/optional)
- Document response DTO structure (field names, types, nesting)
- Identify known quirks (typos like `reultado`, type mismatches like `codigoError` as string)
- Check WS-Security requirements

### Step 2: Rails Service Object (2-4h)
```ruby
# app/services/aquasis/<service_name>/<operation_name>_service.rb
module Aquasis
  module DebtManagement
    class GetDeudaTotalConFacturasService
      def initialize(contrato:, explotacion:, idioma: 'es')
        @contrato = contrato
        @explotacion = explotacion
        @idioma = idioma
      end

      def call
        response = soap_client.call(:get_deuda_total_con_facturas, message: build_message)
        parse_response(response)
      rescue Savon::SOAPFault => e
        handle_soap_fault(e)
      end

      private

      def build_message
        { contrato: @contrato, explotacion: @explotacion, idioma: @idioma }
      end

      def parse_response(response)
        body = response.body[:get_deuda_total_con_facturas_response]
        resultado = extract_resultado(body)
        raise Aquasis::ServiceError, resultado[:descripcion_error] if error?(resultado)
        transform_dto(body)
      end

      def extract_resultado(body)
        body[:resultado] || body[:reultado] || default_error
      end
    end
  end
end
```

### Step 3: Controller Endpoint (1-2h)
- Add route to `config/routes.rb`
- Create or extend v2 controller action
- Input validation and parameter sanitization
- Response serialization

### Step 4: Tests (2-4h)
- Record VCR cassette from real SOAP response
- Unit test service object with cassette
- Test error scenarios (SOAP fault, network timeout, invalid params)
- Test edge cases (empty results, null fields, typo fields)

### Step 5: Frontend Integration (2-4h)
- Add API call to `aquasis.js` or equivalent
- Wire into Vue component
- Error display and loading states

### Step 6: Documentation (0.5h)
- Update operation inventory with integration status
- Document any quirks discovered during implementation

---

## 8. Testing Strategy

### Unit Tests

- **Scope:** Each service object in isolation
- **Tool:** RSpec + VCR (recorded SOAP responses) + WebMock
- **Coverage target:** > 90% for all new integration code
- **Key scenarios per operation:**
  - Happy path with valid parameters
  - Error response handling (`ResultadoDTO` with error codes)
  - Empty/null response fields
  - WSDL typo handling (`reultado`, `busVHFumberSerie`, `vistitComments`, `emailAntigo`)
  - WS-Security header inclusion (where required)

### Integration Tests

- **Scope:** Full request-response cycle through Rails controller
- **Tool:** RSpec request specs + VCR
- **Key scenarios:**
  - Valid request returns expected JSON structure
  - Invalid parameters return 422 with descriptive error
  - SOAP fault returns 502 with normalized error
  - Timeout returns 504 with retry guidance

### End-to-End Tests (Waves 2 and 4)

- **Scope:** Multi-operation flows (payment pipeline, address change flow)
- **Tool:** RSpec + VCR cassettes chained in sequence
- **Key flows:**
  - Payment: `getDeuda` -> `getImpagadosContrato` -> `getDeudaContratoBloqueoCobro` -> `getDocumentoPago` -> `cobrarReferenciaFrmPago`
  - Address change: `getDomicilio` -> `cambiarDireccionCorrespondencia` -> `getDomicilio` (verify)
  - Customer identification: `getContratosPorNif` -> `getTitularPorContrato` -> `consultaDetalleContrato`

### Regression Tests

- **Scope:** All 17 existing integrated operations
- **Frequency:** Run on every CI build
- **Purpose:** Ensure new integration code does not break existing functionality

### Performance Tests (Pre-Wave 2 Deployment)

- **Payment operations:** Verify < 2 second response time under normal load
- **Batch operations (`multipleRefreshData`):** Verify < 3 seconds for 20 orders
- **Concurrent payment prevention:** Verify idempotency under parallel requests

---

## 9. Risk Register

### Known Bugs Requiring Resolution

| Bug ID | Severity | Operation | Description | Resolution Wave | Workaround |
|--------|:--------:|-----------|-------------|:--------------:|-----------|
| BUG-1 | CRITICAL | `crearOrdenTrabajo` | `NullPointerException` when `idPtoServicio` is empty/missing | Pre-existing (validate before call) | Always call `getPuntoServicioPorContador` first; validate non-null |
| BUG-2 | HIGH | `crearOrdenTrabajo` | Missing WS-Security headers cause 500 error | Pre-Wave 1 | Add WS-Security `UsernameToken` header |
| BUG-3 | HIGH | `refreshData` | Wrong `otClassID` (0 instead of 1) and missing `operationalSiteID` | Wave 1 (W1-09) | Set `otClassID=1`, populate `operationalSiteID` |
| BUG-4 | MEDIUM | Multiple Debt ops | `reultado` typo in response DTOs | Wave 1 | Check `resultado` first, fall back to `reultado` |
| BUG-5 | MEDIUM | `resolveOT` | `otResolutionElements` may require at least one element | Wave 5 (W5-16) | Include minimal element or test constraint |
| BUG-6 | MEDIUM | `getDocumentoOrdenTrabajo` | `codigoError` is `string` not `int` in PascalCase DTO | Wave 1 (W1-10) | Type-aware parsing for both int and string |
| BUG-7 | LOW | `resolveOT` | WSDL typo: `busVHFumberSerie` (should be `busVHFNumberSerie`) | Wave 5 | Use misspelled field name; document permanently |
| BUG-8 | LOW | `resolveOT` | WSDL typo: `vistitComments` (should be `visitComments`) | Wave 5 | Use misspelled field name; document permanently |
| BUG-9 | LOW | `cambiarEmailNotificacionPersona` | WSDL typo: `emailAntigo` (should be `emailAntiguo`) | Wave 4 | Use misspelled field name; already handled in `cea.js` |

### Schema-Only Blockers (5 operations)

| Operation | Business Value | Blocker |
|-----------|:-------------:|---------|
| `solicitudAcometida` | CRITICAL | XSD schema only -- not in WSDL portType |
| `solicitudAltaSuministro` | CRITICAL | Not callable via SOAP |
| `solicitudBajaSuministro` | CRITICAL | Requires CEA server-side enablement |
| `solicitudCambioTitularContrato` | CRITICAL | Requires CEA server-side enablement |
| `solicitudSubrogacionContrato` | HIGH | Requires CEA server-side enablement |

**Mitigation:** Submit formal written request to CEA Queretaro / Aqualia with business case. Plan alternative manual workflows as interim solution.

### Integration Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|:----------:|:------:|-----------|
| R1 | Aquasis endpoint downtime during integration | MEDIUM | HIGH | Circuit breaker (`stoplight` gem). Cache reads. Queue writes via Sidekiq. |
| R2 | Payment double-collection | LOW | CRITICAL | Idempotency tokens. Pre/post transaction logging. `bloquearCobro` check. Staged rollout. |
| R3 | WSDL contract changes without notice | MEDIUM | HIGH | Pin WSDL in VCR cassettes. Nightly schema validation. CEA relationship management. |
| R4 | WS-Security credential rotation | LOW | HIGH | Externalize in Rails `credentials.yml.enc`. Health check endpoint. Alert on 401. |
| R5 | Performance degradation under load | MEDIUM | MEDIUM | Redis caching (catalogs: 24h, contracts: 5min, service points: 1h). Connection pooling. |
| R6 | Schema-only operations remain blocked permanently | HIGH | HIGH | CEA engagement with revenue-impact business case. Alternative manual workflows. |
| R7 | CFDI compliance issues in data transformation | LOW | HIGH | Never transform fiscal identifiers. Pass-through unchanged. Test with SAT validation. |
| R8 | Large base64 payloads causing timeouts | MEDIUM | MEDIUM | 60-second timeout for PDF operations. Stream large responses. |
| R9 | Insufficient testing for financial operations | MEDIUM | HIGH | VCR cassettes from real responses. Separate payment test suite. Canary deployment for Wave 2. |

---

## 10. Definition of Done -- Per-Wave Acceptance Criteria

### All Waves (Common)

- [ ] All targeted operations return valid responses in staging environment
- [ ] VCR cassettes recorded for every new operation
- [ ] Unit test coverage > 90% for new integration code
- [ ] No regressions in existing integrated operations (regression suite passes)
- [ ] Error handling follows normalized pattern (`ResultadoDTO` -> structured error)
- [ ] API documentation updated (operation inventory, parameter docs)
- [ ] Code reviewed and merged to integration branch

### Wave 1: Foundation

- [ ] Customer lookup by NIF resolves to correct contracts in > 95% of test cases
- [ ] Debt detail shows per-invoice breakdown (not just aggregate total)
- [ ] `refreshData` returns complete work order context with BUG-3 fix
- [ ] Work order PDF generation produces valid, downloadable files
- [ ] `reultado` typo handled transparently in all Debt operations
- [ ] Meter detail and change history display correctly

### Wave 2: Payments

- [ ] Full payment pipeline executes end-to-end without errors
- [ ] `bloquearCobro` check cannot be bypassed
- [ ] Idempotency prevents duplicate payments under concurrent load
- [ ] Transaction logging captures pre/post state for every payment
- [ ] Payment PDFs contain valid barcodes matching reference amounts
- [ ] QA sign-off on payment flow with edge cases
- [ ] Staged rollout plan defined (agents-only first)

### Wave 3: Work Orders + Meters

- [ ] All hardcoded order type/motive values replaced with dynamic catalogs
- [ ] Dashboard batch loading completes in < 3 seconds for 20 orders
- [ ] Invoice tariff breakdown explains bill amounts with per-concept detail
- [ ] `esTitular` identity verification ready for Wave 4 write operations
- [ ] Service point data fully parsed and displayed

### Wave 4: Self-Service

- [ ] All write operations include confirmation UI
- [ ] Banking operations pass security review (PCI-DSS considerations)
- [ ] Address changes persist and verify correctly via re-query
- [ ] Meter readings validated for plausible range before submission
- [ ] `solicitudModificacionDatosPersonales` validates all 17 parameters

### Wave 5: Advanced

- [ ] Total integrated operations reach 90+
- [ ] Geographic and bank reference data synced to local DB
- [ ] E-invoice operations produce valid CFDI XML
- [ ] Formal request submitted to CEA for 5 schema-only operations
- [ ] Overall API coverage exceeds 71%

---

## 11. Staffing Plan

### Team Composition

| Role | FTE | Duration | Primary Responsibilities |
|------|:---:|----------|-------------------------|
| Senior Backend Developer (Rails) | 1.0 | 20 weeks (all waves) | BFF architecture, Savon SOAP client, service objects, error handling, caching, circuit breaker |
| Full-Stack Developer (Vue + Rails) | 1.0 | 20 weeks (all waves) | Frontend integration, UI components, feature flags, v1->v2 migration |
| QA Engineer | 0.5 | Waves 2 + 4 (8 weeks) | Payment flow testing, write operation validation, edge case testing, security review support |
| DevOps Engineer | 0.25 | As needed | Redis/caching setup, monitoring dashboards, deployment pipelines, VCR infrastructure |

### Wave-Level Staffing

| Wave | Backend Dev | Full-Stack Dev | QA | DevOps |
|------|:-----------:|:--------------:|:--:|:------:|
| Wave 1 (Wk 1-4) | Full-time | Full-time | -- | 1 week setup |
| Wave 2 (Wk 5-8) | Full-time | Full-time | Part-time (critical) | -- |
| Wave 3 (Wk 9-12) | Full-time | Full-time | -- | -- |
| Wave 4 (Wk 13-16) | Full-time | Full-time | Part-time (critical) | -- |
| Wave 5 (Wk 17-20) | Full-time | Full-time | -- | 1 week monitoring |

### Total Effort Estimate

| Wave | Developer-Weeks | Notes |
|------|:---------------:|-------|
| Wave 1: Foundation | 2-3 | Mostly S-effort read operations with established patterns |
| Wave 2: Payments | 4-5 | Financial operations require careful error handling, idempotency |
| Wave 3: Work Orders + Meters | 3-4 | Mix of reads and catalog integrations |
| Wave 4: Self-Service | 5-6 | Write operations require security review, banking PCI-DSS |
| Wave 5: Advanced | 4-5 | Remaining operations, bulk imports, catalogs |
| **Total** | **18-23** | Parallelizable with 2-3 developers |

---

## Appendix A: Complete Task Index

| Task ID | Operation | Wave | Week | Effort | Service |
|---------|-----------|:----:|:----:|:------:|---------|
| W1-01 | `getContratosPorNif` | 1 | 1 | 4h | Readings |
| W1-02 | `getTitularPorNif` | 1 | 1 | 4h | Readings |
| W1-03 | `getTitulares` | 1 | 1 | 4h | Readings |
| W1-04 | `getTitularPorContrato` | 1 | 1 | 4h | Readings |
| W1-05 | `getDeudaTotalConFacturas` | 1 | 2 | 6h | Debt |
| W1-06 | `getImpagadosContrato` | 1 | 2 | 6h | Debt |
| W1-07 | `getDeudaContratoBloqueoCobro` | 1 | 2 | 4h | Debt |
| W1-08 | `getContratosPorNifconDeuda` | 1 | 2 | 4h | Debt |
| W1-09 | `refreshData` | 1 | 3 | 8h | Work Orders |
| W1-10 | `getDocumentoOrdenTrabajo` | 1 | 3 | 6h | Work Orders |
| W1-11 | `consultaHistoricoActuacionesContrato` | 1 | 3 | 4h | Contracts |
| W1-12 | `getActuaciones` | 1 | 3 | 4h | Readings |
| W1-13 | `getContador` | 1 | 4 | 4h | Meters |
| W1-14 | `getCambiosContadorDeContrato` | 1 | 4 | 4h | Meters |
| W1-15 | `getContratosByNumFactNumContrato` | 1 | 4 | 4h | Contracts |
| W1-16 | `getContratoPorContratoConDeuda` | 1 | 4 | 4h | Debt |
| W1-17 | `getDeudaContrato` | 1 | 4 | 4h | Debt |
| W2-01 | `getDocumentoPago` | 2 | 5 | 8h | Debt |
| W2-02 | `getDocumentoPagoXML` | 2 | 5 | 6h | Debt |
| W2-03 | `cobrarReferenciaFrmPago` | 2 | 6 | 12h | Debt |
| W2-04 | `cobrarReferencia` | 2 | 6 | 8h | Debt |
| W2-05 | `avisarPago` | 2 | 7 | 6h | Debt |
| W2-06 | `cancelarReferencia` | 2 | 7 | 6h | Debt |
| W2-07 | `getDeudaContrato` (enhanced) | 2 | 8 | 4h | Debt |
| W2-08 | `getContratoPorContratoConDeuda` (enhanced) | 2 | 8 | 4h | Debt |
| W2-09 | E2E payment pipeline testing | 2 | 8 | 16h | -- |
| W3-01 | `multipleRefreshData` | 3 | 9 | 6h | Work Orders |
| W3-02 | `getTiposOrden` | 3 | 9 | 4h | Contracts |
| W3-03 | `getMotivosOrden` | 3 | 9 | 4h | Contracts |
| W3-04 | `getFacturasContrato` | 3 | 10 | 6h | Contracts |
| W3-05 | `getFactura` | 3 | 10 | 4h | Readings |
| W3-06 | `getPdfDocumentoFactura` | 3 | 10 | 4h | Contracts |
| W3-07 | `getConceptoConTarifasDeContrato` | 3 | 10 | 6h | Readings |
| W3-08 | `getTarifasVigente` | 3 | 10 | 4h | Readings |
| W3-09 | `recuperaOrdenesServicio` | 3 | 11 | 6h | Contracts |
| W3-10 | `esTitular` | 3 | 11 | 4h | Contracts |
| W3-11 | `getLecturasParaGraficas` | 3 | 11 | 4h | Readings |
| W3-12 | Parse full service point response | 3 | 12 | 8h | -- |
| W3-13 | Build meter-centric search | 3 | 12 | 6h | -- |
| W4-01 | `cambiarMovilNotificacionContrato` | 4 | 13 | 6h | Readings |
| W4-02 | `getUltimoMensaje` | 4 | 13 | 4h | Readings |
| W4-03 | `getContrato` (Readings) | 4 | 13 | 4h | Readings |
| W4-04 | `getContratosPorNie_crn` | 4 | 13 | 4h | Readings |
| W4-05 | `getTitularPorNie_crn` | 4 | 13 | 4h | Readings |
| W4-06 | `cambiarDireccionCorrespondencia` | 4 | 14 | 10h | Readings |
| W4-07 | `getDomicilio` | 4 | 14 | 4h | Readings |
| W4-08 | `getContratoPorDatosGenerales` | 4 | 14 | 4h | Readings |
| W4-09 | `getContratosPorDatosGenerales` | 4 | 14 | 6h | Readings |
| W4-10 | `cambiarDomiciliacionBancaria` | 4 | 15 | 12h | Readings |
| W4-11 | `getNumeroCuentaBancaria` | 4 | 15 | 4h | Readings |
| W4-12 | `solicitudIntroduccionLectura` | 4 | 15 | 8h | Contracts |
| W4-13 | `solicitudModificacionDatosPersonales` | 4 | 16 | 12h | Contracts |
| W4-14 | `cambiarSenasCobroBancarias` | 4 | 16 | 10h | Contracts |
| W4-15 | `cambiarDomicilioNotificaciones` | 4 | 16 | 8h | Contracts |
| W4-16 | `getConceptoConTarifasDeFactura` | 4 | 16 | 4h | Readings |
| W5-01 | `crearOrdenServicio` | 5 | 17 | 8h | Contracts |
| W5-02 | `esPSContratable` | 5 | 17 | 4h | Contracts |
| W5-03 | `consultaHistoricoConsumoContrato` | 5 | 17 | 4h | Contracts |
| W5-04 | `registrarContactoManual` | 5 | 17 | 6h | Contracts |
| W5-05 | `getFacturasPorCondiciones` | 5 | 18 | 8h | Contracts |
| W5-06 | `recuperaFacturasByIds` | 5 | 18 | 4h | Contracts |
| W5-07 | `countFacturasContrato` | 5 | 18 | 3h | Contracts |
| W5-08 | `getFacturaE` | 5 | 18 | 6h | Contracts |
| W5-09 | `solicitudActivacionFacturaOnline` | 5 | 18 | 4h | Contracts |
| W5-10 | `solicitudFacturaEnQuejaActiva` | 5 | 18 | 3h | Contracts |
| W5-11 | `consultaDocumentacionContrato` | 5 | 19 | 4h | Contracts |
| W5-12 | `consultaDocumentacionTramite` | 5 | 19 | 6h | Contracts |
| W5-13 | `consultaLiquidacionTramite` | 5 | 19 | 6h | Contracts |
| W5-14 | `getCalibres` | 5 | 19 | 4h | Work Orders |
| W5-15 | `getMarcasYModelos` | 5 | 19 | 4h | Work Orders |
| W5-16 | `actualizarContador` | 5 | 19 | 8h | Meters |
| W5-17 | `crearOrdenExterna` | 5 | 20 | 8h | Work Orders |
| W5-18 | Geographic catalogs (7 ops) | 5 | 20 | 8h | Readings |
| W5-19 | Bank reference data (5 ops) | 5 | 20 | 6h | Readings |
| W5-20 | Remaining misc operations | 5 | 20 | 8h | Various |

---

*Plan generated 2026-02-16. Synthesized from Integration Roadmap and Division B (B1-B7) API analysis reports.*
