# Aquasis API - Technical Documentation

> Complete API reference for the Aquasis water utility management platform — CEA Queretaro

---

## Overview

Aquasis is the commercial management platform for CEA Queretaro, providing APIs for water utility operations including contract management, billing, meter management, customer services, debt management, and field work orders.

The platform exposes **5 core API services** with a total of **126 operations**:

| Service | Operations | Integrated | Domain |
|---------|:----------:|:----------:|--------|
| Contracts Service | 53 | 4 | Contract lifecycle, invoicing, and customer processes |
| Debt Management Service | 13 | 1 | Debt queries, payment processing, and collection |
| Meters Service | 4 | 1 | Meter data, changes, and service point lookups |
| Readings & Client Portal Service | 47 | 8 | Readings, consumption, invoices, tariffs, and customer data |
| Work Orders Service | 9 | 3 | Field work order creation, visits, and resolution |

### Status Legend

- **Integrated** — Fully connected and operational in the AGORA platform
- **Available** — API endpoint ready for integration
- **Schema Defined** — Interface specification complete, pending implementation

---

## Authentication

Certain operations require **WS-Security authentication** using username/password tokens. Operations requiring authentication are explicitly marked in their respective sections.

Authenticated requests must include security headers with valid credentials provided by CEA Queretaro.

---

## 1. Contracts Service

**Service:** `InterfazGenericaContratacionWS`

| Property | Value |
|----------|-------|
| **Endpoint** | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContratacionWS` |
| **Rails Proxy** | `/api/v1/cea/soap/InterfazGenericaContratacionWS` |
| **Protocol** | Document/Literal Binding |

### Operations Summary

| # | Operation | Description | Status |
|---|-----------|-------------|--------|
| 1 | `cambiarDomicilioNotificaciones` | Change notification address | Available |
| 2 | `cambiarSenasCobroBancarias` | Change bank payment details | Available |
| 3 | `consultaDetalleContrato` | Get full contract detail | **Integrated** |
| 4 | `consultaDocumentacionContrato` | Get contract documentation | Available |
| 5 | `consultaDocumentacionTramite` | Get process documentation | Available |
| 6 | `consultaHistoricoActuacionesContrato` | Get contract action history | Available |
| 7 | `consultaHistoricoConsumoContrato` | Get contract consumption history | Available |
| 8 | `consultaHistoricoDomiciliacion` | Get direct debit history | Available |
| 9 | `consultaLiquidacionTramite` | Get process settlement details | Available |
| 10 | `countFacturasContrato` | Count invoices for a contract | Available |
| 11 | `crearOrdenServicio` | Create a service order | Available |
| 12 | `esPSContratable` | Check if service point is contractable | Available |
| 13 | `esTitular` | Verify if person is contract holder | Available |
| 14 | `getCierresByIdsContrato` | Get contract closure data | Available |
| 15 | `getClienteListByExplotacion` | Get client list by exploitation | Available |
| 16 | `getConsumos` | Get consumption records | Available |
| 17 | `getContrato` | Get contract info with options | **Integrated** |
| 18 | `getContratos` | Search contracts with filters (requires auth) | **Integrated** |
| 19 | `getContratosByNumFactNumContrato` | Get contracts by invoice/contract number | Available |
| 20 | `getExplotacionesUsuario` | Get user exploitations | Available |
| 21 | `getFacturaE` | Get electronic invoice | Available |
| 22 | `getFacturas` | Get invoices by criteria | Available |
| 23 | `getFacturasContrato` | Get invoices for a contract | Available |
| 24 | `getFacturasContratoReferencia` | Get invoice references for a contract | Available |
| 25 | `getFacturasPorCondiciones` | Advanced invoice filtering | Available |
| 26 | `getIDPersonaContrato` | Get customer ID for a contract | Available |
| 27 | `getImpresionesLocalesPendientes` | Get pending local prints | Available |
| 28 | `getMotivosOrden` | Get service order reason catalog | Available |
| 29 | `getPDFImpresionLocalPendiente` | Get pending local print as PDF | Available |
| 30 | `getPdfDocumentoFactura` | Get invoice document as PDF | Available |
| 31 | `getPdfFactura` | Get invoice PDF (requires auth) | **Integrated** |
| 32 | `getPdfMandato` | Get direct debit mandate PDF | Available |
| 33 | `getPersonaList` | Get persons list | Available |
| 34 | `getTiposOrden` | Get service order type catalog | Available |
| 35 | `getValidacionVerFactura` | Validate invoice viewing | Available |
| 36 | `recuperaFacturasByIds` | Retrieve invoices by IDs | Available |
| 37 | `recuperaOrdenesServicio` | Retrieve service orders | Available |
| 38 | `registrarContactoManual` | Register a manual contact | Available |
| 39 | `solicitudAcometida` | Request a service connection | Schema Defined |
| 40 | `solicitudActivacionFacturaOnline` | Request online invoice activation | Available |
| 41 | `solicitudAltaServiAlerta` | Request alert service enrollment | Available |
| 42 | `solicitudAltaSuministro` | Request new supply | Schema Defined |
| 43 | `solicitudBajaSuministro` | Request supply termination | Schema Defined |
| 44 | `solicitudCambioDomiciliacionBancaria` | Request bank domiciliation change | Available |
| 45 | `solicitudCambioDomicilioNotificaciones` | Request notification address change | Available |
| 46 | `solicitudCambioTitularContrato` | Request contract holder change | Schema Defined |
| 47 | `solicitudFacturaEnQuejaActiva` | Request invoice with active complaint | Available |
| 48 | `solicitudFacturasMasiva` | Bulk invoice request | Available |
| 49 | `solicitudIntroduccionLectura` | Submit meter reading | Available |
| 50 | `solicitudIntroduccionLecturaIVR` | IVR meter reading submission | Available |
| 51 | `solicitudModificacionDatosPersonales` | Request personal data modification | Available |
| 52 | `solicitudModificacionServiAlertaMasiva` | Bulk alert service modification | Available |
| 53 | `solicitudSubrogacionContrato` | Request contract subrogation | Schema Defined |

### Integrated Operations Detail

#### consultaDetalleContrato

Get full contract detail by contract number and language.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `numeroContrato` | `int[]` | Yes | Contract number(s) |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

**Response:** Array of `GenericoContratoDTO` objects containing contract data, supply point information, personal data, and payment data.

---

#### getContrato

Get contract information with configurable options.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| Contract identifiers | various | Yes | Contract lookup criteria |
| Options | various | No | Response customization flags |

**Response:** Detailed contract information object.

---

#### getContratos

Search contracts with filters. **Requires WS-Security authentication.**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| Search filters | various | Yes | Criteria for contract search |

**Response:** List of matching contracts.

---

#### getPdfFactura

Get invoice PDF as base64-encoded document. **Requires WS-Security authentication.**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| Invoice identifiers | various | Yes | Invoice lookup criteria |

**Response:** Base64-encoded PDF document.

---

### Available Operations Detail

#### cambiarDomicilioNotificaciones

Change the notification address for one or more contracts.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `numeroContrato` | `int[]` | Yes | Array of contract numbers |
| `direccion` | `DireccionNotificacionDTO` | Yes | Notification address |
| `poblacion` | `int` | Yes | Town/city ID |
| `provincia` | `int` | Yes | Province ID |
| `codigoPostal` | `string` | Yes | Postal code |
| `comunidad` | `int` | Yes | Community/region ID |
| `localidad` | `int` | Yes | Locality ID |
| `tlf` | `string` | Yes | Phone number |

**Response:** `ResultadoDTO` — `codigoError` (int, 0 = success), `descripcionError` (string)

---

#### cambiarSenasCobroBancarias

Change bank payment method details for one or more contracts.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `numeroContrato` | `int[]` | Yes | Array of contract numbers |
| `canalCobro` | `string` | Yes | Collection channel |
| `codBanco` | `short` | Yes | Bank code |
| `codAgencia` | `short` | Yes | Agency code |
| `digitoControl` | `string` | Yes | Control digit |
| `numeroCuenta` | `string` | Yes | Account number |
| `cuentaIBAN` | `string` | Yes | IBAN account number |
| `senyasTitular` | `boolean` | Yes | Account holder is contract holder |
| `nifCuenta` | `string` | Yes | Account holder tax ID |
| `nombre` | `string` | Yes | Account holder first name |
| `apellido1` | `string` | Yes | First surname |
| `apellido2` | `string` | Yes | Second surname |
| `tipoPersona` | `short` | Yes | Person type code |
| `viaComunicacion` | `string` | Yes | Communication channel |
| `idSolicitante` | `int` | Yes | Requester ID |
| `idioma` | `string` | Yes | Language code |

**Response:** `ResultadoDTO`

---

#### consultaHistoricoActuacionesContrato

Get the history of actions performed on a contract.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `numeroContrato` | `int` | Yes | Contract number |
| `fechaInicio` | `string` | Yes | Start date filter |
| `fechaFin` | `string` | Yes | End date filter |
| `registroInicial` | `int` | Yes | Starting record (pagination) |
| `registroTotal` | `int` | Yes | Records per page |

**Response:** `ActuacionesDTO` — Historical action records with error codes.

---

#### consultaHistoricoConsumoContrato

Get historical consumption data for a contract.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `numeroContrato` | `int` | Yes | Contract number |
| `fechaInicio` | `string` | Yes | Start date filter |
| `fechaFin` | `string` | Yes | End date filter |
| `registroInicial` | `int` | Yes | Starting record (pagination) |
| `registroTotal` | `int` | Yes | Records per page |
| `idioma` | `string` | Yes | Language code |

**Response:** `HistoricoConsumoDTO` — Historical consumption records.

---

#### crearOrdenServicio

Create a service order in Aquasis.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `numeroContrato` | `int` | Yes | Contract number |
| `tipoOrden` | `short` | Yes | Service order type ID |
| `motivoOrden` | `short` | Yes | Service order reason ID |
| `login` | `string` | Yes | User login |
| `idioma` | `string` | Yes | Language code |

**Response:** `OrdenServicioDTO` — `codigoError`, `descripcionError`, `idOrdenServicio` (created order ID).

---

#### countFacturasContrato

Count the number of invoices for a contract within a date range.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `numeroContrato` | `int` | Yes | Contract number |
| `fechaInicio` | `string` | Yes | Start date |
| `fechaFin` | `string` | Yes | End date |

**Response:** Integer count of invoices.

---

## 2. Debt Management Service

**Service:** `InterfazGenericaGestionDeudaWS`

| Property | Value |
|----------|-------|
| **Endpoint** | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaGestionDeudaWS` |
| **Rails Proxy** | `/api/v1/cea/soap/InterfazGenericaGestionDeudaWS` |

### Operations Summary

| # | Operation | Description | Status |
|---|-----------|-------------|--------|
| 1 | `getDeuda` | Get debt summary by identifier | **Integrated** |
| 2 | `getDeudaContrato` | Get debt for a specific contract | Available |
| 3 | `getDeudaContratoBloqueoCobro` | Get debt with collection block info | Available |
| 4 | `getDeudaTotalConFacturas` | Get total debt with invoice breakdown | Available |
| 5 | `getContratoPorContratoConDeuda` | Get contract debt by contract number | Available |
| 6 | `getContratosPorNifconDeuda` | Get contracts with debt by NIF | Available |
| 7 | `getImpagadosContrato` | Get unpaid invoices for a contract | Available |
| 8 | `getDocumentoPago` | Get payment document (PDF) | Available |
| 9 | `getDocumentoPagoXML` | Get payment document (XML) | Available |
| 10 | `avisarPago` | Notify a payment | Available |
| 11 | `cobrarReferencia` | Collect payment by reference | Available |
| 12 | `cobrarReferenciaFrmPago` | Collect payment with payment form | Available |
| 13 | `cancelarReferencia` | Cancel a payment reference | Available |

### Integrated Operations Detail

#### getDeuda

Get debt summary by identifier type (contract, NIF, etc.).

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tipoIdentificador` | `string` | Yes | Identifier type (e.g., `CONTRATO`) |
| `valor` | `string` | Yes | Identifier value |
| `explotacion` | `int` | Yes | Exploitation/branch code |
| `idioma` | `string` | Yes | Language code |

**Response:** `resultadoDTO` (error code/description) + `deuda` (debt details object).

---

### Available Operations Detail

#### getDeudaContrato

Get debt for a specific contract with detailed breakdown.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tipoIdentificador` | `string` | No | Identifier type |
| `valor` | `string` | No | Identifier value |
| `explotacion` | `int` | No | Exploitation code |
| `idioma` | `string` | No | Language code |

**Response:** `resultadoDTO` + `deudaContrato` (contract debt details).

---

#### getDeudaTotalConFacturas

Get total debt with full invoice breakdown for a contract.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | `int` | No | Contract number |
| `referenciaCatastral` | `string` | No | Cadastral reference |
| `explotacion` | `int` | No | Exploitation code |
| `idioma` | `string` | No | Language code |

**Response:** `resultadoDTO` + `deudaTotalFacturas` (total debt with invoices).

---

#### getContratoPorContratoConDeuda

Get contract details with debt by contract number.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | `int` | No | Contract number |
| `explotacion` | `int` | No | Exploitation code |
| `idioma` | `string` | No | Language code |
| `sociedad` | `string` | No | Company/society code |

**Response:** `resultadoDTO` + `avisoDTO` (warnings) + `contratoDeudaDTO` (contract with debt) + `procesoImpagadoSN` (unpaid process flag).

---

#### getContratosPorNifconDeuda

Get all contracts with debt for a given NIF (tax ID).

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `idioma` | `string` | No | Language code |
| `nif` | `string` | No | Tax identification number |
| `sociedadGestora` | `string` | No | Managing company |

**Response:** `resultadoDTO` + `avisoDTO[]` (warnings) + `contratoDeudaDTO[]` (contracts with debt) + `procesoImpagadoSN`.

---

#### getImpagadosContrato

Get unpaid invoices and payment installments for a contract.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | `int` | Yes | Contract number |
| `nif` | `string` | Yes | Tax identification |
| `idioma` | `string` | Yes | Language code |

**Response:** `facturasPendientes` (pending invoices), `plazosPagoPendientes` (pending installments), `saldoCuentaDTO` (account balance).

---

#### getDocumentoPago

Generate a payment document (PDF) for pending invoices.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | `int` | Yes | Contract number |
| `nif` | `string` | Yes | Tax ID |
| `idioma` | `string` | Yes | Language code |
| `docs` | `documentosImpresionDTO` | Yes | Documents to include |

**Response:** `resultadoDTO` + `pdf` (base64 PDF) + `rafagaPago` (payment burst) + `referencia` (payment reference).

---

#### avisarPago

Notify the system of a payment made.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `documentoPago` | `string` | Yes | Payment document reference |
| `entidad` | `int` | Yes | Entity/bank code |
| `importe` | `decimal` | Yes | Amount paid |
| `idioma` | `string` | Yes | Language code |

**Response:** `resultadoDTO`

---

#### cobrarReferencia

Collect payment for a given reference.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `referencia` | `string` | Yes | Payment reference |
| `importe` | `decimal` | No | Amount to collect |
| `datosCobro` | `datosCobroDTO` | Yes | Collection data (banco, cajero, comercio, fechaPago, nif, tarjeta, terminal, ticket) |
| `idioma` | `string` | No | Language code |

**Response:** `resultadoDTO`

---

#### cancelarReferencia

Cancel a payment reference.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `referencia` | `string` | Yes | Payment reference to cancel |
| `idioma` | `string` | Yes | Language code |

**Response:** `resultadoDTO`

---

## 3. Meters Service

**Service:** `InterfazGenericaContadoresWS`

| Property | Value |
|----------|-------|
| **Endpoint** | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContadoresWS` |

### Operations Summary

| # | Operation | Description | Status |
|---|-----------|-------------|--------|
| 1 | `actualizarContador` | Update meter data | Available |
| 2 | `getCambiosContadorDeContrato` | Get meter change history for a contract | Available |
| 3 | `getContador` | Get meter details by serial number | Available |
| 4 | `getPuntoServicioPorContador` | Get service points by meter serial | **Integrated** |

### Integrated Operations Detail

#### getPuntoServicioPorContador

Get service point information for one or more meter serial numbers. Returns the full service point data including address, contracts, meters, readings, and orders.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `listaNumSerieContador` | `string[]` | Yes | Array of meter serial numbers |
| `usuario` | `string` | Yes | User identifier |
| `idioma` | `string` | Yes | Language code |
| `opciones` | `string` | Yes | Options string |

**Response:** `ListaPuntosServicioContadorDTO` containing service points per meter.

> **Important:** The service point ID (`id`) returned by this operation is **required** for creating work orders via `crearOrdenTrabajo` in the Work Orders Service (`idPtoServicio` parameter). A missing service point ID will cause a `NullPointerException`.

**PuntoServicioDTO fields include:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | Service point ID (used as `idPtoServicio`) |
| `direccionPS` | `DireccionPSDTO` | Service point address |
| `codigoExplotacion` | `string` | Exploitation code |
| `tipoSuministro` | `string` | Supply type |
| `estadoPuntoServicio` | `string` | Service point status |
| `refCatastral` | `string` | Cadastral reference |
| `contratos` | `ContratoAcometidaDTO[]` | Contracts at this point |
| `contadores` | `ContadoresDTO[]` | Meters at this point |
| `lecturas` | `LecturasDTO[]` | Readings at this point |
| `ordenes` | `OrdenesDTO[]` | Orders at this point |

---

### Available Operations Detail

#### actualizarContador

Update meter data (brand, model, caliber, manufacturing year) for a given serial number.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `serialNumber` | `string` | Yes | Meter serial number |
| `contadorDTO.anoFabricacion` | `short` | No | Manufacturing year |
| `contadorDTO.calibre` | `short` | No | Caliber (mm) |
| `contadorDTO.marca` | `string` | No | Brand |
| `contadorDTO.modelo` | `string` | No | Model |
| `contadorDTO.numeroSerie` | `string` | No | New serial number |

**Response:** `resultadoDTO` with mensajes (error messages array) and resultado (status).

---

#### getCambiosContadorDeContrato

Get the history of meter changes (installations/removals) for a contract.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `idContrato` | `int` | Yes | Contract number |
| `idioma` | `string` | Yes | Language code |

**Response:** Array of `cambioContadorDTO`:

| Field | Type | Description |
|-------|------|-------------|
| `calibre` | `int` | Meter caliber |
| `contador` | `string` | Meter serial number |
| `contratista` | `string` | Contractor name |
| `contrato` | `int` | Contract number |
| `direccionPuntoServicio` | `string` | Service point address |
| `fechaCambioContador` | `dateTime` | Change date |
| `fechaInstalContador` | `dateTime` | Installation date |
| `observacion` | `string` | Observations |

---

#### getContador

Get full details of a meter by its serial number.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `serialNumber` | `string` | Yes | Meter serial number |

**Response:** `contadorDTO`:

| Field | Type | Description |
|-------|------|-------------|
| `anoFabricacion` | `short` | Manufacturing year |
| `averiado` | `string` | Damaged indicator |
| `calibre` | `short` | Caliber (mm) |
| `esfera` | `short` | Dial digits |
| `estadoContador` | `short` | Meter status code |
| `fechaInstalacion` | `string` | Installation date |
| `fechaRetirada` | `string` | Removal date |
| `idContador` | `int` | Meter ID |
| `idPuntoServicio` | `int` | Service point ID |
| `marca` | `string` | Brand |
| `modelo` | `string` | Model |
| `numeroSerie` | `string` | Serial number |
| `propiedadCliente` | `string` | Customer-owned indicator |

---

## 4. Readings & Client Portal Service

**Service:** `InterfazOficinaVirtualClientesWS`

| Property | Value |
|----------|-------|
| **Endpoint** | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazOficinaVirtualClientesWS` |
| **Rails Proxy** | `/api/v1/cea/soap/InterfazOficinaVirtualClientesWS` |

### Operations Summary

| # | Operation | Description | Status |
|---|-----------|-------------|--------|
| 1 | `cambiarDireccionCorrespondencia` | Change correspondence address | Available |
| 2 | `cambiarDomiciliacionBancaria` | Change bank domiciliation | Available |
| 3 | `cambiarEmailNotificacionPersona` | Change notification email | **Integrated** |
| 4 | `cambiarMovilNotificacionContrato` | Change mobile notification | Available |
| 5 | `cambiarPersonaNotificacionContrato` | Change notification person (requires auth) | **Integrated** |
| 6 | `cambiarTipoFacturaContrato` | Change invoice type (requires auth) | **Integrated** |
| 7 | `cambiarUrlOficinaVirtualExplotacion` | Change virtual office URL | Available |
| 8 | `cambiarUrlOficinaVirtualSociedad` | Change virtual office URL (company) | Available |
| 9 | `getActuaciones` | Get actions/interventions | Available |
| 10 | `getAgencias` | Get bank agencies | Available |
| 11 | `getBanco` | Get bank by code | Available |
| 12 | `getBancosPorDescripcion` | Get banks by description | Available |
| 13 | `getBancoPorExplotacionCodigo` | Get bank by exploitation and code | Available |
| 14 | `getBancosPorExplotacionDescripcion` | Get banks by exploitation and description | Available |
| 15 | `getCallesPorPatron` | Get streets by name pattern | Available |
| 16 | `getComunidadesDePais` | Get communities by country | Available |
| 17 | `getConceptoConTarifasDeContrato` | Get concepts with tariffs for contract | Available |
| 18 | `getConceptoConTarifasDeFactura` | Get concepts with tariffs for invoice | Available |
| 19 | `getConceptos` | Get billing concepts | **Integrated** |
| 20 | `getConsumos` | Get consumption data | **Integrated** |
| 21 | `getConsumosParaGraficas` | Get consumption for charts | **Integrated** |
| 22 | `getContrato` | Get contract details | Available |
| 23 | `getContratoPorDatosGenerales` | Get contract by address | Available |
| 24 | `getContratosPorDatosGenerales` | Get contracts by address | Available |
| 25 | `getContratosPorNif` | Get contracts by NIF | Available |
| 26 | `getContratosPorNie_crn` | Get contracts by NIE/CRN | Available |
| 27 | `getDomicilio` | Get domicile for contract | Available |
| 28 | `getDomiciliosContratados` | Get contracted domiciles | Available |
| 29 | `getDomiciliosPendientesContratar` | Get pending domiciles | Available |
| 30 | `getFactura` | Get single invoice detail | Available |
| 31 | `getFacturas` | Get invoices for contract | **Integrated** |
| 32 | `getIdiomaExplotacion` | Get language for exploitation | Available |
| 33 | `getLecturas` | Get meter readings | **Integrated** |
| 34 | `getLecturasParaGraficas` | Get readings for charts | Available |
| 35 | `getLocalidadesDePoblacion` | Get localities by town | Available |
| 36 | `getNumeroCuentaBancaria` | Get bank account for contract | Available |
| 37 | `getPaises` | Get countries list | Available |
| 38 | `getPoblacionesDeProvincia` | Get towns by province | Available |
| 39 | `getProvincia` | Get provinces by country | Available |
| 40 | `getProvinciasDeComunidad` | Get provinces by community | Available |
| 41 | `getTarifaDeAguaPorContrato` | Get water rate for contract | **Integrated** |
| 42 | `getTarifasVigente` | Get current tariffs | Available |
| 43 | `getTitularPorContrato` | Get holder by contract | Available |
| 44 | `getTitularPorNif` | Get holder by NIF | Available |
| 45 | `getTitularPorNie_crn` | Get holder by NIE/CRN | Available |
| 46 | `getTitulares` | Search holders by criteria | Available |
| 47 | `getUltimoMensaje` | Get last message for contract | Available |

### Integrated Operations Detail

#### cambiarEmailNotificacionPersona

Change the notification email address for a person associated with a contract.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `nif` | `string` | Yes | Tax identification number |
| `nombre` | `string` | Yes | First name |
| `apellido1` | `string` | Yes | First surname |
| `apellido2` | `string` | Yes | Second surname |
| `contrato` | `int` | Yes | Contract number |
| `emailAntigo` | `string` | Yes | Old email address |
| `emailNuevo` | `string` | Yes | New email address |
| `atencionDe` | `string` | Yes | Attention of (hardcoded to `ChatBot`) |
| `codigoOficina` | `short` | Yes | Office code |
| `usuario` | `string` | Yes | User identifier |

**Response:** `int` — Result code.

---

#### cambiarPersonaNotificacionContrato

Change the notification person for a contract. **Requires WS-Security authentication.**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | `int` | Yes | Contract number |
| `nif` | `string` | Yes | Tax identification number |
| `email1` | `string` | Yes | Primary email |
| `email2` | `string` | No | Secondary email |
| `usuario` | `string` | Yes | User identifier |

**Response:** `short` — Result code.

---

#### cambiarTipoFacturaContrato

Change the invoice type for a contract. **Requires WS-Security authentication.**

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | `int` | Yes | Contract number |
| `nif` | `string` | Yes | Tax identification number |
| `tipoFactura` | `short` | Yes | Invoice type code |
| `usuario` | `string` | Yes | User identifier (default: `0000004874`) |

**Response:** `short` — Result code.

---

#### getConceptos

Get billing concepts for an exploitation.

---

#### getConsumos

Get consumption data for a contract.

---

#### getConsumosParaGraficas

Get consumption data formatted for chart display.

---

#### getFacturas

Get invoices list for a contract.

---

#### getLecturas

Get meter readings for a contract.

---

#### getTarifaDeAguaPorContrato

Get the water rate applied to a contract.

---

### Available Operations Detail

#### cambiarDireccionCorrespondencia

Change the correspondence address for a contract.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | `int` | Yes | Contract number |
| `textoDireccion` | `string` | No | Address text |
| `localidadId` | `int` | No | Locality ID |
| `calleId` | `int` | No | Street ID |
| `numFinca` | `int` | No | Building number |
| `complementoFinca` | `string` | No | Building complement |
| `bloque` | `string` | No | Block |
| `escalera` | `string` | No | Stairway |
| `codigoPostal` | `string` | No | Postal code |
| `telefono` | `long` | No | Phone number |
| `codigoOficina` | `short` | No | Office code |
| `usuario` | `string` | No | User identifier |

**Response:** `string` — Operation result.

---

#### cambiarDomiciliacionBancaria

Change the bank direct debit details for a contract.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | `int` | Yes | Contract number |
| `codigoBanco` | `string` | Yes | Bank code |
| `codigoAgencia` | `string` | Yes | Agency code |
| `cuenta` | `string` | Yes | Account number |
| `digitoControl` | `string` | Yes | Control digit |
| `tipoPersona` | `string` | No | Person type |
| `nombreTitular` | `string` | No | Account holder name |
| `ape1Titular` | `string` | No | First surname |
| `ape2Titular` | `string` | No | Second surname |
| `nif` | `string` | No | Tax ID |
| `codigoOficina` | `short` | No | Office code |
| `usuario` | `string` | No | User identifier |
| `idioma` | `string` | No | Language code |

**Response:** `string` — Operation result.

---

## 5. Work Orders Service

**Service:** `InterfazGenericaOrdenesServicioWS`

| Property | Value |
|----------|-------|
| **Endpoint** | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaOrdenesServicioWS` |

### Operations Summary

| # | Operation | Description | Status |
|---|-----------|-------------|--------|
| 1 | `crearOrdenExterna` | Create an external work order | Available |
| 2 | `crearOrdenTrabajo` | Create a standard work order | **Integrated** |
| 3 | `getCalibres` | Get meter caliber catalog | Available |
| 4 | `getDocumentoOrdenTrabajo` | Get work order as PDF | Available |
| 5 | `getMarcasYModelos` | Get meter brands and models catalog | Available |
| 6 | `informarVisita` | Report a visit to a work order | **Integrated** |
| 7 | `multipleRefreshData` | Query multiple work orders | Available |
| 8 | `refreshData` | Query single work order details | Available |
| 9 | `resolveOT` | Resolve/close a work order | **Integrated** |

### Integrated Operations Detail

#### crearOrdenTrabajo

Create a standard work order in Aquasis. Returns the order code (e.g., `O4514415`).

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `idioma` | `string` | No | Language code |
| `enCurso` | `boolean` | Yes | Whether order is in progress |

**OrdenTrabajoDTO:**

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `tipoOrden` | `short` | Yes | Order type ID |
| `motivoOrden` | `short` | Yes | Order reason ID |
| `fechaCreacionOrden` | `dateTime` | Yes | Creation date |
| `numContrato` | `int` | Yes | Contract number |
| `idPtoServicio` | `int` | **Yes** | **Service point ID (REQUIRED)** |
| `fechaEstimdaFin` | `dateTime` | Yes | Estimated end date |
| `observaciones` | `string` | No | Observations/notes |
| `codigoObsCambCont` | `string` | No | Meter change observation code |
| `codigoReparacion` | `string` | No | Repair code |
| `anyoExpediente` | `short` | Yes | File year |
| `numeroExpediente` | `string` | No | File number |
| `instalaValvulaPaso` | `boolean` | Yes | Install stop valve |
| `geolocalization` | `Geolocalization` | No | GPS coordinates |

> **Critical:** `idPtoServicio` is mandatory. Use `getPuntoServicioPorContador` from the Meters Service to obtain the service point ID. Omitting this value will cause a server error.

**Response:** `string` — Order code (e.g., `O4514415`).

---

#### informarVisita

Report a visit to a work order. Returns the visit ID.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `id` | `string` | No | Visit ID (for updates) |
| `codOrden` | `string` | No | Order code (e.g., `O4514415`) |
| `fechaVisita` | `dateTime` | Yes | Visit date |
| `resultado` | `boolean` | Yes | Visit result (true = successful) |
| `idOperario` | `string` | Yes | Operator ID |
| `nombreOperario` | `string` | Yes | Operator name |
| `cifContratista` | `string` | Yes | Contractor tax ID |
| `nombreContratista` | `string` | Yes | Contractor name |
| `codIncidencia` | `short` | Yes | Incident code |
| `descIncidencia` | `string` | Yes | Incident description |
| `observaciones` | `string` | No | Observations |
| `aResponsable` | `ContactoVisitaDTO` | No | Responsible contact |

**ContactoVisitaDTO:**

| Field | Type | Description |
|-------|------|-------------|
| `codVinculacion` | `string` | Link code |
| `idDocFirma` | `string` | Signature document ID |
| `personaVisita.nombre` | `string` | First name |
| `personaVisita.apellido1` | `string` | First surname |
| `personaVisita.apellido2` | `string` | Second surname |
| `personaVisita.telefono` | `string` | Phone number |
| `personaVisita.nif` | `string` | Tax ID |

**Response:** `int` — Visit ID.

---

#### resolveOT

Resolve/close a work order. Includes resolution data, meter elements installed/retired, equipment changes, and visit comments.

**OTResolution:**

| Field | Type | Description |
|-------|------|-------------|
| `otResolutionData` | `OTResolutionData` | Resolution metadata |
| `otResolutionElements[]` | `OTResolutionElement[]` | Meter elements installed/retired |
| `otResolutionEquipments[]` | `OTResolutionEquipment[]` | Equipment changes |
| `vistitComments[]` | `VisitComment[]` | Visit comments |

**OTResolutionData:**

| Field | Type | Description |
|-------|------|-------------|
| `operationalSiteID` | `string` | Operational site ID |
| `installationID` | `string` | Installation ID |
| `systemOrigin` | `string` | System of origin |
| `otClass` | `int` | Order class |
| `otOrigin` | `string` | Order origin (code) |
| `endDateOt` | `dateTime` | Order end date |
| `endLastTaskOt` | `dateTime` | Last task end date |
| `finalSolution` | `string` | Final solution code |
| `nonExecutionMotive` | `string` | Non-execution motive |
| `solutionDescription` | `string` | Solution description |
| `executorIdentifier` | `string` | Executor ID |
| `executorName` | `string` | Executor name |
| `companyExecutorIdentifier` | `string` | Company executor ID |
| `companyExecutorName` | `string` | Company executor name |
| `transmitterInstalled` | `boolean` | Transmitter installed flag |
| `language` | `string` | Language code |
| `suspensionLevel` | `short` | Suspension level |
| `geolocalization` | `Geolocalization` | GPS coordinates |

**Response:** Resolution confirmation.

---

### Available Operations Detail

#### crearOrdenExterna

Create an external work order (from an external SGO system).

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `codIdioma` | `string` | No | Language code |
| `ordenTrabajo` | `OrdenTrabajoExternaDTO` | No | External work order data |

**Response:** `peticionOrdenExternaDTO` — `idOrden` (created order ID), `ordenCreada` (boolean).

---

#### getCalibres

Get the catalog of meter calibers (diameters).

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `idioma` | `string` | No | Language code |
| `fechaDesde` | `dateTime` | Yes | Filter: only calibers modified since this date |

**Response:** Array of `CalibreDTO`:

| Field | Type | Description |
|-------|------|-------------|
| `calibmm` | `int` | Caliber in millimeters |
| `calibequpul` | `string` | Caliber equivalent in inches |
| `calibbaja` | `boolean` | Whether deactivated |

---

#### getDocumentoOrdenTrabajo

Get one or more work orders as a PDF document (base64 encoded).

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `ordenes[].codOrden` | `string` | Yes | Order code |
| `ordenes[].observaciones[]` | `string[]` | No | Observations to print |

**Response:** `DocumentoImpresionPendienteDTO` — `resultado` (ResultadoDTO) + `pdf` (base64 PDF).

---

#### getMarcasYModelos

Get the catalog of meter brands and models.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `idioma` | `string` | No | Language code |
| `fechaDesde` | `dateTime` | Yes | Filter: only modified since this date |

**Response:** Array of `MarcaDTO`:

| Field | Type | Description |
|-------|------|-------------|
| `marcid` | `int` | Brand ID |
| `marcdesc` | `string` | Brand description |
| `marcbaja` | `boolean` | Whether deactivated |
| `modelos[]` | `ModeloDTO[]` | Models for this brand |

**ModeloDTO:**

| Field | Type | Description |
|-------|------|-------------|
| `modid` | `int` | Model ID |
| `moddesc` | `string` | Model description |
| `moddigit` | `int` | Number of digits |
| `modtcndesc` | `string` | Technology description |
| `modbaja` | `boolean` | Whether deactivated |

---

#### multipleRefreshData

Query multiple work orders at once.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `otRequest[].otClassID` | `int` | Yes | Order class ID |
| `otRequest[].otOriginID` | `string` | No | Order code (e.g., `O4514415`) |
| `otRequest[].language` | `string` | No | Language code |

**Response:** Array of `OTMass` — each with `ot` (full order data) or `error` (error details).

---

#### refreshData

Query a single work order's full details. Returns the complete order object with client data, elements, readings, unpaid bills, debt, and comments.

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `otRequest.otClassID` | `int` | Yes | Order class ID |
| `otRequest.otOriginID` | `string` | No | Order code |
| `otRequest.language` | `string` | No | Language code |

**Response:** `OT` — Full order data object.

---

## Common Data Types

### ResultadoDTO

Standard response pattern across all services:

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (`0` = success) |
| `descripcionError` | `string` | Error description |

### Conventions

- All dates use **ISO 8601** format (`dateTime`)
- Language parameter: typically `es` for Spanish
- Contract numbers are the **primary identifier** across all services

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────┐
│                    AGORA Platform                     │
│                                                       │
│  Rails Proxy: /api/v1/cea/soap/{ServiceName}         │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│              Aquasis API Gateway                       │
│     aquacis-cf.ceaqueretaro.gob.mx/Comercial         │
├──────────────┬───────────┬──────────┬────────────────┤
│  Contracts   │   Debt    │  Meters  │   Readings     │
│  Service     │  Service  │  Service │   & Portal     │
│  (53 ops)    │  (13 ops) │  (4 ops) │   (47 ops)     │
├──────────────┴───────────┴──────────┴────────────────┤
│                 Work Orders Service                    │
│                      (9 ops)                          │
└──────────────────────────────────────────────────────┘
```

### Cross-Service Dependencies

1. **Meters → Work Orders:** The service point ID from `getPuntoServicioPorContador` is required by `crearOrdenTrabajo`
2. **Contracts → All Services:** Contract numbers are used as primary identifiers across all service boundaries
3. **Work Orders lifecycle:** `crearOrdenTrabajo` → `informarVisita` → `resolveOT`

---

*Last updated: February 2026*
