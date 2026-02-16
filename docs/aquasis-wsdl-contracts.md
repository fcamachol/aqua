# Aquasis Contracts WSDL - InterfazGenericaContratacionWS

## Service Information

| Property | Value |
|----------|-------|
| **Service Name** | InterfazGenericaContratacionWSService |
| **Endpoint URL** | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContratacionWS` |
| **Target Namespace** | `http://occamWS.ejb.negocio.occam.agbar.com` |
| **DTO Namespace** | `http://InterfazGenericaContratacion.DTOs.occamWS.ejb.negocio.occam.agbar.com` |
| **Rails Proxy** | `/api/v1/cea/soap/InterfazGenericaContratacionWS` |
| **Binding Style** | Document/Literal |
| **Transport** | SOAP over HTTP |

---

## Operations Summary

| # | Operation | Description | Status |
|---|-----------|-------------|--------|
| 1 | `cambiarDomicilioNotificaciones` | Change notification address | Not implemented |
| 2 | `cambiarSenasCobroBancarias` | Change bank payment details | Not implemented |
| 3 | `consultaDetalleContrato` | Get full contract detail | **Implemented** |
| 4 | `consultaDocumentacionContrato` | Get contract documentation | Not implemented |
| 5 | `consultaDocumentacionTramite` | Get process documentation | Not implemented |
| 6 | `consultaHistoricoActuacionesContrato` | Get contract action history | Not implemented |
| 7 | `consultaHistoricoConsumoContrato` | Get contract consumption history | Not implemented |
| 8 | `consultaHistoricoDomiciliacion` | Get direct debit history | Not implemented |
| 9 | `consultaLiquidacionTramite` | Get process settlement details | Not implemented |
| 10 | `countFacturasContrato` | Count invoices for a contract | Not implemented |
| 11 | `crearOrdenServicio` | Create a service order | Not implemented |
| 12 | `esPSContratable` | Check if service point is contractable | Not implemented |
| 13 | `esTitular` | Verify if person is contract holder | Not implemented |
| 14 | `getCierresByIdsContrato` | Get contract closure data | Not implemented |
| 15 | `getClienteListByExplotacion` | Get client list by exploitation | Not implemented |
| 16 | `getConsumos` | Get consumption records | Not implemented |
| 17 | `getContrato` | Get contract info with options | **Implemented** |
| 18 | `getContratos` | Search contracts with filters (WS-Security) | **Implemented** |
| 19 | `getContratosByNumFactNumContrato` | Get contracts by invoice/contract number | Not implemented |
| 20 | `getExplotacionesUsuario` | Get user exploitations | Not implemented |
| 21 | `getFacturaE` | Get electronic invoice | Not implemented |
| 22 | `getFacturas` | Get invoices by criteria | Not implemented |
| 23 | `getFacturasContrato` | Get invoices for a contract | Not implemented |
| 24 | `getFacturasContratoReferencia` | Get invoice references for a contract | Not implemented |
| 25 | `getFacturasPorCondiciones` | Advanced invoice filtering | Not implemented |
| 26 | `getIDPersonaContrato` | Get customer ID for a contract | Not implemented |
| 27 | `getImpresionesLocalesPendientes` | Get pending local prints | Not implemented |
| 28 | `getMotivosOrden` | Get service order reason catalog | Not implemented |
| 29 | `getPDFImpresionLocalPendiente` | Get pending local print as PDF | Not implemented |
| 30 | `getPdfDocumentoFactura` | Get invoice document as PDF | Not implemented |
| 31 | `getPdfFactura` | Get invoice PDF as base64 (WS-Security) | **Implemented** |
| 32 | `getPdfMandato` | Get direct debit mandate PDF | Not implemented |
| 33 | `getPersonaList` | Get persons list | Not implemented |
| 34 | `getTiposOrden` | Get service order type catalog | Not implemented |
| 35 | `getValidacionVerFactura` | Validate invoice viewing | Not implemented |
| 36 | `recuperaFacturasByIds` | Retrieve invoices by IDs | Not implemented |
| 37 | `recuperaOrdenesServicio` | Retrieve service orders | Not implemented |
| 38 | `registrarContactoManual` | Register a manual contact | Not implemented |
| 39 | `solicitudAcometida` | Request a service connection | Schema only |
| 40 | `solicitudActivacionFacturaOnline` | Request online invoice activation | Not implemented |
| 41 | `solicitudAltaServiAlerta` | Request alert service enrollment | Not implemented |
| 42 | `solicitudAltaSuministro` | Request new supply | Schema only |
| 43 | `solicitudBajaSuministro` | Request supply termination | Schema only |
| 44 | `solicitudCambioDomiciliacionBancaria` | Request bank domiciliation change | Not implemented |
| 45 | `solicitudCambioDomicilioNotificaciones` | Request notification address change | Not implemented |
| 46 | `solicitudCambioTitularContrato` | Request contract holder change | Schema only |
| 47 | `solicitudFacturaEnQuejaActiva` | Request invoice with active complaint | Not implemented |
| 48 | `solicitudFacturasMasiva` | Bulk invoice request | Not implemented |
| 49 | `solicitudIntroduccionLectura` | Submit meter reading | Not implemented |
| 50 | `solicitudIntroduccionLecturaIVR` | IVR meter reading submission | Not implemented |
| 51 | `solicitudModificacionDatosPersonales` | Request personal data modification | Not implemented |
| 52 | `solicitudModificacionServiAlertaMasiva` | Bulk alert service modification | Not implemented |
| 53 | `solicitudSubrogacionContrato` | Request contract subrogation | Schema only |

---

## Operations Detail

### 1. cambiarDomicilioNotificaciones

Change the notification address for one or more contracts.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `ArrayOf_xsd_nillable_int` | Yes | Array of contract numbers |
| `direccion` | `DireccionNotificacionDTO` | Yes | Notification address DTO |
| `poblacion` | `int` | Yes | Town/city ID |
| `provincia` | `int` | Yes | Province ID |
| `codigoPostal` | `string` | Yes | Postal code |
| `comunidad` | `int` | Yes | Community/region ID |
| `localidad` | `int` | Yes | Locality ID |
| `tlf` | `string` | Yes | Phone number |

#### Response: `cambiarDomicilioNotificacionesReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com"
                  xmlns:dto="http://InterfazGenericaContratacion.DTOs.occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:cambiarDomicilioNotificaciones>
         <numeroContrato>
            <int>442761</int>
         </numeroContrato>
         <direccion>
            <!-- DireccionNotificacionDTO fields -->
         </direccion>
         <poblacion>1</poblacion>
         <provincia>1</provincia>
         <codigoPostal>76000</codigoPostal>
         <comunidad>1</comunidad>
         <localidad>1</localidad>
         <tlf>4421234567</tlf>
      </occ:cambiarDomicilioNotificaciones>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 2. cambiarSenasCobroBancarias

Change bank payment method details for one or more contracts.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `ArrayOf_xsd_nillable_int` | Yes | Array of contract numbers |
| `canalCobro` | `string` | Yes | Collection channel |
| `codBanco` | `short` | Yes | Bank code |
| `codAgencia` | `short` | Yes | Agency code |
| `digitoControl` | `string` | Yes | Control digit |
| `numeroCuenta` | `string` | Yes | Account number |
| `cuentaIBAN` | `string` | Yes | IBAN account number |
| `senyasTitular` | `boolean` | Yes | Whether account holder is same as contract holder |
| `nifCuenta` | `string` | Yes | Account holder's tax ID |
| `nombre` | `string` | Yes | Account holder first name |
| `apellido1` | `string` | Yes | Account holder first surname |
| `apellido2` | `string` | Yes | Account holder second surname |
| `tipoPersona` | `short` | Yes | Person type code |
| `viaComunicacion` | `string` | Yes | Communication channel |
| `idSolicitante` | `int` | Yes | Requester ID |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response: `cambiarSenasCobroBancariasReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:cambiarSenasCobroBancarias>
         <numeroContrato>
            <int>442761</int>
         </numeroContrato>
         <canalCobro>BANCO</canalCobro>
         <codBanco>1</codBanco>
         <codAgencia>1</codAgencia>
         <digitoControl>12</digitoControl>
         <numeroCuenta>1234567890</numeroCuenta>
         <cuentaIBAN></cuentaIBAN>
         <senyasTitular>true</senyasTitular>
         <nifCuenta>XAXX010101000</nifCuenta>
         <nombre>Juan</nombre>
         <apellido1>Perez</apellido1>
         <apellido2>Lopez</apellido2>
         <tipoPersona>1</tipoPersona>
         <viaComunicacion></viaComunicacion>
         <idSolicitante>0</idSolicitante>
         <idioma>es</idioma>
      </occ:cambiarSenasCobroBancarias>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 3. consultaDetalleContrato

Get full contract detail by contract number and language.

**Status:** **Implemented** in `cea.js` as `consultaDetalleContrato(numeroContrato, idioma)` and `consultaDetalleContratoJson()`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `int[]` | Yes | Contract number(s) (maxOccurs=unbounded) |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response: `consultaDetalleContratoReturn` (`ArrayOf_tns2_nillable_GenericoContratoDTO`)

Array of `GenericoContratoDTO` objects containing contract, supply point, personal data, payment data, and result.

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:consultaDetalleContrato>
      <numeroContrato>442761</numeroContrato>
      <idioma>es</idioma>
      </occ:consultaDetalleContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 4. consultaDocumentacionContrato

Get documentation associated with a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `int` | Yes | Contract number |

#### Response: `consultaDocumentacionContratoReturn` (`DocumentosDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| *(DocumentosDTO fields)* | various | Contract documentation data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:consultaDocumentacionContrato>
         <numeroContrato>442761</numeroContrato>
      </occ:consultaDocumentacionContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 5. consultaDocumentacionTramite

Get documentation for a specific process/procedure.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation ID |
| `numeroContrato` | `int` | Yes | Contract number |
| `codigoTramite` | `string` | Yes | Process/procedure code |
| `puntoSuministro` | `PuntoSuministroDTO` | Yes | Supply point DTO |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response: `consultaDocumentacionTramiteReturn` (`DocumentacionDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| *(DocumentacionDTO fields)* | various | Process documentation data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com"
                  xmlns:dto="http://InterfazGenericaContratacion.DTOs.occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:consultaDocumentacionTramite>
         <explotacion>8</explotacion>
         <numeroContrato>442761</numeroContrato>
         <codigoTramite>ALTA</codigoTramite>
         <puntoSuministro>
            <!-- PuntoSuministroDTO fields -->
         </puntoSuministro>
         <idioma>es</idioma>
      </occ:consultaDocumentacionTramite>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 6. consultaHistoricoActuacionesContrato

Get the history of actions performed on a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `int` | Yes | Contract number |
| `fechaInicio` | `string` | Yes | Start date filter |
| `fechaFin` | `string` | Yes | End date filter |
| `registroInicial` | `int` | Yes | Starting record for pagination |
| `registroTotal` | `int` | Yes | Total records per page |

#### Response: `consultaHistoricoActuacionesContratoReturn` (`ActuacionesDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| *(ActuacionesDTO fields)* | various | Historical action records |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:consultaHistoricoActuacionesContrato>
         <numeroContrato>442761</numeroContrato>
         <fechaInicio>2023-01-01</fechaInicio>
         <fechaFin>2023-12-31</fechaFin>
         <registroInicial>0</registroInicial>
         <registroTotal>100</registroTotal>
      </occ:consultaHistoricoActuacionesContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 7. consultaHistoricoConsumoContrato

Get historical consumption data for a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `int` | Yes | Contract number |
| `fechaInicio` | `string` | Yes | Start date filter |
| `fechaFin` | `string` | Yes | End date filter |
| `registroInicial` | `int` | Yes | Starting record for pagination |
| `registroTotal` | `int` | Yes | Total records per page |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response: `consultaHistoricoConsumoContratoReturn` (`HistoricoConsumoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| *(HistoricoConsumoDTO fields)* | various | Historical consumption records |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:consultaHistoricoConsumoContrato>
         <numeroContrato>442761</numeroContrato>
         <fechaInicio>2023-01-01</fechaInicio>
         <fechaFin>2023-12-31</fechaFin>
         <registroInicial>0</registroInicial>
         <registroTotal>100</registroTotal>
         <idioma>es</idioma>
      </occ:consultaHistoricoConsumoContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 8. consultaHistoricoDomiciliacion

Get direct debit/domiciliation history for a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `int` | Yes | Contract number |
| `fechaInicio` | `string` | Yes | Start date filter |
| `fechaFin` | `string` | Yes | End date filter |
| `registroInicial` | `int` | Yes | Starting record for pagination |
| `registroTotal` | `int` | Yes | Total records per page |

#### Response: `consultaHistoricoDomiciliacionReturn` (`HistoricoDomiciliacionesDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| *(HistoricoDomiciliacionesDTO fields)* | various | Direct debit history entries |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:consultaHistoricoDomiciliacion>
         <numeroContrato>442761</numeroContrato>
         <fechaInicio>2023-01-01</fechaInicio>
         <fechaFin>2023-12-31</fechaFin>
         <registroInicial>0</registroInicial>
         <registroTotal>100</registroTotal>
      </occ:consultaHistoricoDomiciliacion>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 9. consultaLiquidacionTramite

Get settlement details for a process/procedure.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation ID |
| `numeroContrato` | `int` | Yes | Contract number |
| `codigoTramite` | `string` | Yes | Process/procedure code |
| `lectura` | `int` | Yes | Meter reading value |
| `fechaLectura` | `string` | Yes | Reading date |

#### Response: `consultaLiquidacionTramiteReturn` (`DesglosesDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| *(DesglosesDTO fields)* | various | Settlement/breakdown details |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:consultaLiquidacionTramite>
         <explotacion>8</explotacion>
         <numeroContrato>442761</numeroContrato>
         <codigoTramite>ALTA</codigoTramite>
         <lectura>12345</lectura>
         <fechaLectura>2023-06-15</fechaLectura>
      </occ:consultaLiquidacionTramite>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 10. countFacturasContrato

Count the number of invoices for a contract within a date range.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `int` | Yes | Contract number |
| `fechaInicio` | `string` | Yes | Start date filter |
| `fechaFin` | `string` | Yes | End date filter |

#### Response: `countFacturasContratoReturn` (`xs:int`)

Returns a raw integer count of invoices.

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:countFacturasContrato>
         <numeroContrato>442761</numeroContrato>
         <fechaInicio>2023-01-01</fechaInicio>
         <fechaFin>2023-12-31</fechaFin>
      </occ:countFacturasContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 11. crearOrdenServicio

Create a service order in Aquasis.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `int` | Yes | Contract number |
| `tipoOrden` | `short` | Yes | Service order type ID |
| `motivoOrden` | `short` | Yes | Service order reason/motive ID |
| `login` | `string` | Yes | User login |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response: `crearOrdenServicioReturn` (`OrdenServicioDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| `idOrdenServicio` | `int` | Created service order ID |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:crearOrdenServicio>
         <numeroContrato>442761</numeroContrato>
         <tipoOrden>1</tipoOrden>
         <motivoOrden>10</motivoOrden>
         <login>admin</login>
         <idioma>es</idioma>
      </occ:crearOrdenServicio>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 12. esPSContratable

Check whether a service point is available for contracting.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `puntoSum` | `PuntoSuministroDTO` | Yes | Supply point DTO |

#### Response: `esPSContratableReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com"
                  xmlns:dto="http://InterfazGenericaContratacion.DTOs.occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:esPSContratable>
         <puntoSum>
            <!-- PuntoSuministroDTO fields -->
         </puntoSum>
      </occ:esPSContratable>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 13. esTitular

Verify if a person is the holder of a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `documento` | `string` | Yes | Document/tax ID of the person to verify |
| `numeroContrato` | `int` | Yes | Contract number |

#### Response: `esTitularReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:esTitular>
         <documento>XAXX010101000</documento>
         <numeroContrato>442761</numeroContrato>
      </occ:esTitular>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 14. getCierresByIdsContrato

Get contract closure data by contract IDs.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contrato` | `int[]` | Yes | Array of contract IDs (maxOccurs=unbounded) |

#### Response: `getCierresByIdsContratoReturn` (`CortesDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(CortesDTO fields)* | various | Contract closure/cut-off records |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getCierresByIdsContrato>
         <contrato>442761</contrato>
         <contrato>442762</contrato>
      </occ:getCierresByIdsContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 15. getClienteListByExplotacion

Get a list of clients for a given exploitation.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation ID |
| `nombre` | `string` | Yes | First name filter |
| `primerApellido` | `string` | Yes | First surname filter |
| `segundoApellido` | `string` | Yes | Second surname filter |
| `numeroDocumento` | `string` | Yes | Document number filter |
| `codExtranjero` | `string` | Yes | Foreign code filter |
| `registroInicial` | `int` | Yes | Starting record for pagination |
| `registroTotal` | `int` | Yes | Total records per page |

#### Response: `getClienteListByExplotacionReturn` (`PersonasDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| *(PersonasDTO fields)* | various | List of persons/clients |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getClienteListByExplotacion>
         <explotacion>8</explotacion>
         <nombre></nombre>
         <primerApellido></primerApellido>
         <segundoApellido></segundoApellido>
         <numeroDocumento>XAXX010101000</numeroDocumento>
         <codExtranjero></codExtranjero>
         <registroInicial>0</registroInicial>
         <registroTotal>100</registroTotal>
      </occ:getClienteListByExplotacion>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 16. getConsumos

Get detailed consumption records.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numContrato` | `int` | Yes | Contract number |
| `periodos` | `string` | Yes | Periods filter |
| `numPer` | `int` | Yes | Number of periods |
| `ejercicio_str` | `string` | Yes | Fiscal year filter |
| `periodo_str` | `string` | Yes | Period string filter |
| `periodicidad_str` | `string` | Yes | Periodicity filter |
| `tipoCiclo_str` | `string` | Yes | Cycle type filter |
| `estadoCiclo_str` | `string` | Yes | Cycle status filter |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |
| `opciones` | `string` | Yes | Options string |

#### Response: `getConsumosReturn` (`ArrayOf_tns2_nillable_HistoricoSuministroDTO`)

Array of `HistoricoSuministroDTO` objects with consumption history.

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getConsumos>
         <numContrato>442761</numContrato>
         <periodos></periodos>
         <numPer>0</numPer>
         <ejercicio_str></ejercicio_str>
         <periodo_str></periodo_str>
         <periodicidad_str></periodicidad_str>
         <tipoCiclo_str></tipoCiclo_str>
         <estadoCiclo_str></estadoCiclo_str>
         <idioma>es</idioma>
         <opciones></opciones>
      </occ:getConsumos>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 17. getContrato

Get contract information with language and options parameters.

**Status:** **Implemented** in `cea.js` as `getContrato(numContrato, idioma, opciones)`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numContrato` | `int` | Yes | Contract number |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |
| `opciones` | `string` | No | Options string (default: empty) |

#### Response: `getContratoReturn` (`ContratoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| *(ContratoDTO fields)* | various | Contract detail (see Complex Types) |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getContrato>
      <numContrato>442761</numContrato>
      <idioma>es</idioma>
      <opciones></opciones>
      </occ:getContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 18. getContratos

Search contracts with multiple filter criteria. **Requires WS-Security authentication.**

**Status:** **Implemented** in `cea.js` as `getContratos(numeroContrato, actividad, actividadSectorial, uso, cnaeDesde, cnaeHasta, estados)`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `int` | No | Contract number filter |
| `actividad` | `short` | No | Activity filter |
| `actividadSectorial` | `short` | No | Sector activity filter |
| `uso` | `short` | No | Usage filter |
| `cnaeDesde` | `int` | No | CNAE range start |
| `cnaeHasta` | `int` | No | CNAE range end |
| `estados` | `ArrayOf_xsd_nillable_string` | No | Array of status codes to filter |

#### Response: `getContratosReturn` (`ContratosDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| *(ContratosDTO fields)* | various | Matching contracts |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com"
                  xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                  xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
   <soapenv:Header>
    <wsse:Security mustUnderstand="1">
        <wsse:UsernameToken wsu:Id="UsernameToken-USERNAME">
          <wsse:Username>USERNAME</wsse:Username>
          <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">PASSWORD</wsse:Password>
        </wsse:UsernameToken>
      </wsse:Security>
  </soapenv:Header>
   <soapenv:Body>
      <occ:getContratos>
         <numeroContrato>442761</numeroContrato>
         <actividad></actividad>
         <actividadSectorial></actividadSectorial>
         <uso></uso>
         <cnaeDesde></cnaeDesde>
         <cnaeHasta></cnaeHasta>
         <estados>
            <string>ALTA</string>
         </estados>
      </occ:getContratos>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 19. getContratosByNumFactNumContrato

Get contracts by invoice number or contract number.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numFactura` | `string` | Yes | Invoice number filter |
| `numContrato` | `int` | Yes | Contract number filter |

#### Response: `getContratosByNumFactNumContratoReturn` (`ContratoIVRDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(ContratoIVRDTO fields)* | various | Contract data for IVR |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getContratosByNumFactNumContrato>
         <numFactura></numFactura>
         <numContrato>442761</numContrato>
      </occ:getContratosByNumFactNumContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 20. getExplotacionesUsuario

Get the list of exploitations accessible to a user.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `usuario` | `string` | Yes | Username |

#### Response: `getExplotacionesUsuarioReturn` (`ExplotacionesDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| *(ExplotacionesDTO fields)* | various | List of user exploitations |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getExplotacionesUsuario>
         <usuario>admin</usuario>
      </occ:getExplotacionesUsuario>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 21. getFacturaE

Get an electronic invoice in XML format.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numFactura` | `string` | Yes | Invoice number |
| `numContrato` | `int` | Yes | Contract number |

#### Response: `getFacturaEReturn` (`XmlFacturaDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(XmlFacturaDTO fields)* | various | Electronic invoice XML data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getFacturaE>
         <numFactura>000120231000049814</numFactura>
         <numContrato>442761</numContrato>
      </occ:getFacturaE>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 22. getFacturas

Get invoices by multiple criteria.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation ID |
| `numeroCliente` | `int` | Yes | Client number |
| `numeroFactura` | `string` | Yes | Invoice number filter |
| `numeroContrato` | `int` | Yes | Contract number filter |
| `fechaInicio` | `string` | Yes | Start date filter |
| `fechaFin` | `string` | Yes | End date filter |

#### Response: `getFacturasReturn` (`FacturasDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| *(FacturasDTO fields)* | various | List of invoices |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getFacturas>
         <explotacion>8</explotacion>
         <numeroCliente>0</numeroCliente>
         <numeroFactura></numeroFactura>
         <numeroContrato>442761</numeroContrato>
         <fechaInicio>2023-01-01</fechaInicio>
         <fechaFin>2023-12-31</fechaFin>
      </occ:getFacturas>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 23. getFacturasContrato

Get invoices for a specific contract with pagination.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `int` | Yes | Contract number |
| `fechaInicio` | `string` | Yes | Start date filter |
| `fechaFin` | `string` | Yes | End date filter |
| `registroInicial` | `int` | Yes | Starting record for pagination |
| `registroTotal` | `int` | Yes | Total records per page |

#### Response: `getFacturasContratoReturn` (`FacturasDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| *(FacturasDTO fields)* | various | List of invoices |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getFacturasContrato>
         <numeroContrato>442761</numeroContrato>
         <fechaInicio>2023-01-01</fechaInicio>
         <fechaFin>2023-12-31</fechaFin>
         <registroInicial>0</registroInicial>
         <registroTotal>100</registroTotal>
      </occ:getFacturasContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 24. getFacturasContratoReferencia

Get invoice references for a contract with pagination.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `int` | Yes | Contract number |
| `fechaInicio` | `string` | Yes | Start date filter |
| `fechaFin` | `string` | Yes | End date filter |
| `registroInicial` | `int` | Yes | Starting record for pagination |
| `registroTotal` | `int` | Yes | Total records per page |

#### Response: `getFacturasContratoReferenciaReturn` (`FacturasReferenciaDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| *(FacturasReferenciaDTO fields)* | various | Invoice reference data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getFacturasContratoReferencia>
         <numeroContrato>442761</numeroContrato>
         <fechaInicio>2023-01-01</fechaInicio>
         <fechaFin>2023-12-31</fechaFin>
         <registroInicial>0</registroInicial>
         <registroTotal>100</registroTotal>
      </occ:getFacturasContratoReferencia>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 25. getFacturasPorCondiciones

Advanced invoice filtering with multiple conditions.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idPersona` | `int` | Yes | Person/customer ID |
| `numContratos` | `int[]` | Yes | Array of contract numbers (maxOccurs=unbounded) |
| `nifs` | `string[]` | Yes | Array of tax IDs (maxOccurs=unbounded) |
| `fechaDesde` | `string` | Yes | Start date filter |
| `fechaHasta` | `string` | Yes | End date filter |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |
| `vinculados` | `boolean` | Yes | Include linked contracts |

#### Response: `getFacturasPorCondicionesReturn` (`FacturasResponseDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(FacturasResponseDTO fields)* | various | Filtered invoices |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getFacturasPorCondiciones>
         <idPersona>12345</idPersona>
         <numContratos>442761</numContratos>
         <nifs>XAXX010101000</nifs>
         <fechaDesde>2023-01-01</fechaDesde>
         <fechaHasta>2023-12-31</fechaHasta>
         <idioma>es</idioma>
         <vinculados>false</vinculados>
      </occ:getFacturasPorCondiciones>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 26. getIDPersonaContrato

Get the customer/person ID associated with a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `int` | Yes | Contract number |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response: `getIDPersonaContratoReturn` (`IDPersonaContratoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(IDPersonaContratoDTO fields)* | various | Person/customer ID data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getIDPersonaContrato>
         <numeroContrato>442761</numeroContrato>
         <idioma>es</idioma>
      </occ:getIDPersonaContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 27. getImpresionesLocalesPendientes

Get a list of pending local print jobs.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idPersona` | `int` | Yes | Person/customer ID |
| `estado` | `int` | Yes | Print job status filter |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response: `getImpresionesLocalesPendientesReturn` (`ImpresionesPendientesDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(ImpresionesPendientesDTO fields)* | various | Pending print jobs |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getImpresionesLocalesPendientes>
         <idPersona>12345</idPersona>
         <estado>0</estado>
         <idioma>es</idioma>
      </occ:getImpresionesLocalesPendientes>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 28. getMotivosOrden

Get the catalog of service order reasons/motives.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation ID |
| `tipoOrden` | `short` | Yes | Service order type ID |
| `login` | `string` | Yes | User login |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response: `getMotivosOrdenReturn` (`ListaMotivosCreacionOrdenDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(ListaMotivosCreacionOrdenDTO fields)* | various | List of order reasons/motives |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getMotivosOrden>
         <explotacion>8</explotacion>
         <tipoOrden>1</tipoOrden>
         <login>admin</login>
         <idioma>es</idioma>
      </occ:getMotivosOrden>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 29. getPDFImpresionLocalPendiente

Get a pending local print as a PDF document.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idPersona` | `int` | Yes | Person/customer ID |
| `codTrabajo` | `int` | Yes | Print job code |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response: `getPDFImpresionLocalPendienteReturn` (`DocumentoImpresionPendienteDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(DocumentoImpresionPendienteDTO fields)* | various | Print document data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getPDFImpresionLocalPendiente>
         <idPersona>12345</idPersona>
         <codTrabajo>1001</codTrabajo>
         <idioma>es</idioma>
      </occ:getPDFImpresionLocalPendiente>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 30. getPdfDocumentoFactura

Get an invoice document as a PDF.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `documentoFactura` | `int` | Yes | Invoice document ID |
| `origenFacturacion` | `short` | Yes | Billing origin code |

#### Response: `getPdfDocumentoFacturaReturn` (`PdfFacturaDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(PdfFacturaDTO fields)* | various | PDF invoice data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getPdfDocumentoFactura>
         <documentoFactura>12345</documentoFactura>
         <origenFacturacion>1</origenFacturacion>
      </occ:getPdfDocumentoFactura>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 31. getPdfFactura

Get an invoice PDF as a base64-encoded string. **Requires WS-Security authentication.**

**Status:** **Implemented** in `cea.js` as `getPdfFactura(numFactura, numContrato)`, with helper functions `getPdfFacturaBase64()`, `getPdfFacturaBlob()`, and `downloadPdfFactura()`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numFactura` | `string` | Yes | Invoice number (e.g., `000120231000049814`) |
| `numContrato` | `int` | Yes | Contract number (e.g., `442761`) |

#### Response: `getPdfFacturaReturn` (`PdfFacturaDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(PdfFacturaDTO fields)* | various | PDF invoice data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com"
                  xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
                  xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
   <soapenv:Header>
      <wsse:Security mustUnderstand="1">
        <wsse:UsernameToken wsu:Id="UsernameToken-USERNAME">
          <wsse:Username>USERNAME</wsse:Username>
          <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">PASSWORD</wsse:Password>
        </wsse:UsernameToken>
      </wsse:Security>
   </soapenv:Header>
   <soapenv:Body>
      <occ:getPdfFactura>
         <numFactura>000120231000049814</numFactura>
         <numContrato>442761</numContrato>
      </occ:getPdfFactura>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 32. getPdfMandato

Get a direct debit mandate document as PDF.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `referenciaMandato` | `int` | Yes | Mandate reference ID |
| `numContrato` | `int` | Yes | Contract number |

#### Response: `getPdfMandatoReturn` (`PdfReferenciaMandatoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(PdfReferenciaMandatoDTO fields)* | various | PDF mandate data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getPdfMandato>
         <referenciaMandato>12345</referenciaMandato>
         <numContrato>442761</numContrato>
      </occ:getPdfMandato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 33. getPersonaList

Get a list of persons/customers with filters and pagination.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nombre` | `string` | Yes | First name filter |
| `primerApellido` | `string` | Yes | First surname filter |
| `segundoApellido` | `string` | Yes | Second surname filter |
| `numeroDocumento` | `string` | Yes | Document number filter |
| `codExtranjero` | `string` | Yes | Foreign code filter |
| `telefono` | `long` | Yes | Phone number filter |
| `registroPagina` | `int` | Yes | Records per page |
| `pagina` | `int` | Yes | Page number |

#### Response: `getPersonaListReturn` (`PersonasDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
| *(PersonasDTO fields)* | various | List of persons |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getPersonaList>
         <nombre></nombre>
         <primerApellido></primerApellido>
         <segundoApellido></segundoApellido>
         <numeroDocumento>XAXX010101000</numeroDocumento>
         <codExtranjero></codExtranjero>
         <telefono>0</telefono>
         <registroPagina>100</registroPagina>
         <pagina>1</pagina>
      </occ:getPersonaList>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 34. getTiposOrden

Get the catalog of service order types.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation ID |
| `login` | `string` | Yes | User login |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response: `getTiposOrdenReturn` (`ListaTiposOrdenDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(ListaTiposOrdenDTO fields)* | various | List of service order types |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getTiposOrden>
         <explotacion>8</explotacion>
         <login>admin</login>
         <idioma>es</idioma>
      </occ:getTiposOrden>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 35. getValidacionVerFactura

Validate whether an invoice can be viewed.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idDocumentoFactura` | `int` | Yes | Invoice document ID |
| `token` | `string` | Yes | Validation token |

#### Response: `getValidacionVerFacturaReturn` (`PdfFacturaDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(PdfFacturaDTO fields)* | various | PDF invoice data (if valid) |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getValidacionVerFactura>
         <idDocumentoFactura>12345</idDocumentoFactura>
         <token>abc123token</token>
      </occ:getValidacionVerFactura>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 36. recuperaFacturasByIds

Retrieve invoices by their IDs with pagination.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idFacturas` | `ArrayOf_xsd_nillable_int` | Yes | Array of invoice IDs |
| `registroInicial` | `int` | Yes | Starting record for pagination |
| `registroTotal` | `int` | Yes | Total records per page |

#### Response: `recuperaFacturasByIdsReturn` (`FacturaIdDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(FacturaIdDTO fields)* | various | Retrieved invoices data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:recuperaFacturasByIds>
         <idFacturas>
            <int>1001</int>
            <int>1002</int>
         </idFacturas>
         <registroInicial>0</registroInicial>
         <registroTotal>100</registroTotal>
      </occ:recuperaFacturasByIds>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 37. recuperaOrdenesServicio

Retrieve service orders by their IDs.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idOrdenes` | `ArrayOf_xsd_nillable_int` | Yes | Array of service order IDs |

#### Response: `recuperaOrdenesServicioReturn` (`OrdenesServicioDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(OrdenesServicioDTO fields)* | various | Service orders data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:recuperaOrdenesServicio>
         <idOrdenes>
            <int>5001</int>
            <int>5002</int>
         </idOrdenes>
      </occ:recuperaOrdenesServicio>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 38. registrarContactoManual

Register a manual customer contact.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `motivo` | `int` | Yes | Contact motive/reason ID |
| `via` | `string` | Yes | Contact channel/method |
| `idExplotacion` | `short` | Yes | Exploitation ID |
| `idCliente` | `int` | Yes | Client ID |
| `idPersonaCto` | `int` | Yes | Contact person ID |
| `idContrato` | `int` | Yes | Contract ID |
| `esEntrada` | `boolean` | Yes | Whether incoming contact |

#### Response: `registrarContactoManualReturn` (`RegistrarContactoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| *(RegistrarContactoDTO fields)* | various | Registered contact data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:registrarContactoManual>
         <motivo>1</motivo>
         <via>TELEFONO</via>
         <idExplotacion>8</idExplotacion>
         <idCliente>12345</idCliente>
         <idPersonaCto>12345</idPersonaCto>
         <idContrato>442761</idContrato>
         <esEntrada>true</esEntrada>
      </occ:registrarContactoManual>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 39. solicitudAcometida

Request a new service connection (water hook-up).

**Status:** Schema only — has XSD element definitions but is NOT exposed in the WSDL portType (cannot be called as a SOAP operation)

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation ID |
| `puntoAcometida` | `PuntoAcometidaDTO` | Yes | Connection point DTO |
| `solicitante` | `SolicitanteDTO` | Yes | Requester DTO |
| `abonado` | `NuevoTitularDTO` | Yes | Subscriber/holder DTO |
| `contrato` | `NuevoContratoAltaDTO` | Yes | New contract DTO |

#### Response: `solicitudAcometidaReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com"
                  xmlns:dto="http://InterfazGenericaContratacion.DTOs.occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudAcometida>
         <explotacion>8</explotacion>
         <puntoAcometida>
            <!-- PuntoAcometidaDTO fields -->
         </puntoAcometida>
         <solicitante>
            <!-- SolicitanteDTO fields -->
         </solicitante>
         <abonado>
            <!-- NuevoTitularDTO fields -->
         </abonado>
         <contrato>
            <!-- NuevoContratoAltaDTO fields -->
         </contrato>
      </occ:solicitudAcometida>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 40. solicitudActivacionFacturaOnline

Request activation/deactivation of online invoice delivery for one or more contracts.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `ArrayOf_xsd_nillable_int` | Yes | Array of contract numbers |
| `facturaOnline` | `boolean` | Yes | Whether to activate online invoicing |

#### Response: `solicitudActivacionFacturaOnlineReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudActivacionFacturaOnline>
         <numeroContrato>
            <int>442761</int>
         </numeroContrato>
         <facturaOnline>true</facturaOnline>
      </occ:solicitudActivacionFacturaOnline>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 41. solicitudAltaServiAlerta

Enroll a contract in alert service notifications.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contrato` | `int` | Yes | Contract number |
| `telefonoMovil` | `string` | Yes | Mobile phone number for alerts |

#### Response: `solicitudAltaServiAlertaReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudAltaServiAlerta>
         <contrato>442761</contrato>
         <telefonoMovil>4421234567</telefonoMovil>
      </occ:solicitudAltaServiAlerta>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 42. solicitudAltaSuministro

Request a new water supply contract.

**Status:** Schema only — has XSD element definitions but is NOT exposed in the WSDL portType (cannot be called as a SOAP operation)

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation ID |
| `puntoSuministro` | `PuntoSuministroDTO` | Yes | Supply point DTO |
| `solicitante` | `SolicitanteDTO` | Yes | Requester DTO |
| `nuevoTitular` | `NuevoTitularDTO` | Yes | New holder DTO |
| `nuevoContratoAlta` | `NuevoContratoAltaDTO` | Yes | New contract DTO |

#### Response: `solicitudAltaSuministroReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com"
                  xmlns:dto="http://InterfazGenericaContratacion.DTOs.occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudAltaSuministro>
         <explotacion>8</explotacion>
         <puntoSuministro>
            <!-- PuntoSuministroDTO fields -->
         </puntoSuministro>
         <solicitante>
            <!-- SolicitanteDTO fields -->
         </solicitante>
         <nuevoTitular>
            <!-- NuevoTitularDTO fields -->
         </nuevoTitular>
         <nuevoContratoAlta>
            <!-- NuevoContratoAltaDTO fields -->
         </nuevoContratoAlta>
      </occ:solicitudAltaSuministro>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 43. solicitudBajaSuministro

Request termination of a water supply contract.

**Status:** Schema only — has XSD element definitions but is NOT exposed in the WSDL portType (cannot be called as a SOAP operation)

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation ID |
| `numeroContrato` | `int` | Yes | Contract number |
| `bajaSuministro` | `BajaSuministroDTO` | Yes | Supply termination DTO |

#### Response: `solicitudBajaSuministroReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com"
                  xmlns:dto="http://InterfazGenericaContratacion.DTOs.occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudBajaSuministro>
         <explotacion>8</explotacion>
         <numeroContrato>442761</numeroContrato>
         <bajaSuministro>
            <!-- BajaSuministroDTO fields -->
         </bajaSuministro>
      </occ:solicitudBajaSuministro>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 44. solicitudCambioDomiciliacionBancaria

Request a change of bank domiciliation/direct debit details for one or more contracts.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `ArrayOf_xsd_nillable_int` | Yes | Array of contract numbers |
| `banco` | `string` | Yes | Bank code |
| `sucursal` | `string` | Yes | Branch/agency code |
| `digitoControl` | `string` | Yes | Control digit |
| `numeroCuenta` | `string` | Yes | Account number |
| `nifCuenta` | `string` | Yes | Account holder's tax ID |
| `nombre` | `string` | Yes | Account holder first name |
| `apellido1` | `string` | Yes | Account holder first surname |
| `apellido2` | `string` | Yes | Account holder second surname |
| `tipoPersona` | `string` | Yes | Person type |

#### Response: `solicitudCambioDomiciliacionBancariaReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudCambioDomiciliacionBancaria>
         <numeroContrato>
            <int>442761</int>
         </numeroContrato>
         <banco>0049</banco>
         <sucursal>0001</sucursal>
         <digitoControl>12</digitoControl>
         <numeroCuenta>1234567890</numeroCuenta>
         <nifCuenta>XAXX010101000</nifCuenta>
         <nombre>Juan</nombre>
         <apellido1>Perez</apellido1>
         <apellido2>Lopez</apellido2>
         <tipoPersona>F</tipoPersona>
      </occ:solicitudCambioDomiciliacionBancaria>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 45. solicitudCambioDomicilioNotificaciones

Request a change of notification address for one or more contracts.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `ArrayOf_xsd_nillable_int` | Yes | Array of contract numbers |
| `direccion` | `string` | Yes | Address text |
| `poblacion` | `int` | Yes | Town/city ID |
| `provincia` | `int` | Yes | Province ID |
| `codigoPostal` | `string` | Yes | Postal code |
| `comunidad` | `int` | Yes | Community/region ID |
| `localidad` | `int` | Yes | Locality ID |
| `tlf` | `long` | Yes | Phone number |

#### Response: `solicitudCambioDomicilioNotificacionesReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudCambioDomicilioNotificaciones>
         <numeroContrato>
            <int>442761</int>
         </numeroContrato>
         <direccion>Calle Nueva 456</direccion>
         <poblacion>1</poblacion>
         <provincia>1</provincia>
         <codigoPostal>76000</codigoPostal>
         <comunidad>1</comunidad>
         <localidad>1</localidad>
         <tlf>4421234567</tlf>
      </occ:solicitudCambioDomicilioNotificaciones>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 46. solicitudCambioTitularContrato

Request a change of contract holder/owner.

**Status:** Schema only — has XSD element definitions but is NOT exposed in the WSDL portType (cannot be called as a SOAP operation)

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation ID |
| `numeroContrato` | `int` | Yes | Contract number |
| `solicitante` | `SolicitanteDTO` | Yes | Requester DTO |
| `nuevoTitular` | `NuevoTitularDTO` | Yes | New holder DTO |
| `nuevoContrato` | `NuevoContratoDTO` | Yes | New contract data DTO |

#### Response: `solicitudCambioTitularContratoReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com"
                  xmlns:dto="http://InterfazGenericaContratacion.DTOs.occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudCambioTitularContrato>
         <explotacion>8</explotacion>
         <numeroContrato>442761</numeroContrato>
         <solicitante>
            <!-- SolicitanteDTO fields -->
         </solicitante>
         <nuevoTitular>
            <!-- NuevoTitularDTO fields -->
         </nuevoTitular>
         <nuevoContrato>
            <!-- NuevoContratoDTO fields -->
         </nuevoContrato>
      </occ:solicitudCambioTitularContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 47. solicitudFacturaEnQuejaActiva

Request an invoice that has an active complaint.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroFactura` | `string` | Yes | Invoice number |

#### Response: `solicitudFacturaEnQuejaActivaReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudFacturaEnQuejaActiva>
         <numeroFactura>000120231000049814</numeroFactura>
      </occ:solicitudFacturaEnQuejaActiva>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 48. solicitudFacturasMasiva

Bulk invoice request for multiple contracts/periods.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idPersona` | `int` | No | Person/customer ID |
| `idContratos` | `int[]` | No | Array of contract IDs (maxOccurs=unbounded) |
| `nifs` | `string[]` | No | Array of tax IDs (maxOccurs=unbounded) |
| `fechaDesde` | `string` | No | Start date filter |
| `fechaHasta` | `string` | No | End date filter |
| `descripcionTrabajo` | `string` | No | Job description |
| `idioma` | `string` | No | Language code (e.g., `es`) |
| `email` | `string` | No | Email for delivery |
| `vinculados` | `boolean` | No | Include linked contracts |

#### Response: `solicitudFacturasMasivaReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudFacturasMasiva>
         <idPersona>12345</idPersona>
         <idContratos>442761</idContratos>
         <idContratos>442762</idContratos>
         <nifs>XAXX010101000</nifs>
         <fechaDesde>2023-01-01</fechaDesde>
         <fechaHasta>2023-12-31</fechaHasta>
         <descripcionTrabajo>Solicitud masiva</descripcionTrabajo>
         <idioma>es</idioma>
         <email>usuario@ejemplo.com</email>
         <vinculados>false</vinculados>
      </occ:solicitudFacturasMasiva>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 49. solicitudIntroduccionLectura

Submit a meter reading (non-IVR version).

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `int` | Yes | Contract number |
| `lecturaContador1` | `int` | Yes | Meter 1 reading value |
| `lecturaContador2` | `int` | Yes | Meter 2 reading value |
| `fechaActual` | `string` | Yes | Current date |

#### Response: `solicitudIntroduccionLecturaReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudIntroduccionLectura>
         <numeroContrato>442761</numeroContrato>
         <lecturaContador1>12345</lecturaContador1>
         <lecturaContador2>0</lecturaContador2>
         <fechaActual>2023-06-15</fechaActual>
      </occ:solicitudIntroduccionLectura>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 50. solicitudIntroduccionLecturaIVR

Submit a meter reading via IVR (Interactive Voice Response).

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `int` | Yes | Contract number |
| `lecturaContador1` | `int` | Yes | Meter 1 reading value |
| `lecturaContador2` | `int` | Yes | Meter 2 reading value |
| `fechaActual` | `string` | Yes | Current date |

#### Response: `solicitudIntroduccionLecturaIVRReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudIntroduccionLecturaIVR>
         <numeroContrato>442761</numeroContrato>
         <lecturaContador1>12345</lecturaContador1>
         <lecturaContador2>0</lecturaContador2>
         <fechaActual>2023-06-15</fechaActual>
      </occ:solicitudIntroduccionLecturaIVR>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 51. solicitudModificacionDatosPersonales

Request modification of personal/customer data for one or more contracts.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numeroContrato` | `ArrayOf_xsd_nillable_int` | Yes | Array of contract numbers |
| `nombre` | `string` | Yes | First name |
| `apellido1` | `string` | Yes | First surname |
| `apellido2` | `string` | Yes | Second surname |
| `razonSocial` | `string` | Yes | Company name |
| `email` | `string` | Yes | Email address |
| `telefono1` | `long` | Yes | Primary phone number |
| `telefono2` | `long` | Yes | Secondary phone number |
| `idiomaFacturas` | `string` | Yes | Invoice language |
| `servicioNotificaciones` | `string` | Yes | Notification service type |
| `nombreUsuarioOV` | `string` | Yes | Virtual office username |
| `fecha` | `dateTime` | Yes | Request date |
| `vinculado` | `boolean` | Yes | Whether linked |
| `adminFincas` | `boolean` | Yes | Whether property manager |
| `entorno` | `string` | Yes | Environment |
| `tipoTramite` | `string` | Yes | Process type |
| `idUsuarioOV` | `int` | Yes | Virtual office user ID |
| `idSociedadOV` | `int` | Yes | Virtual office company ID |

#### Response: `solicitudModificacionDatosPersonalesReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudModificacionDatosPersonales>
         <numeroContrato>
            <int>442761</int>
         </numeroContrato>
         <nombre>Juan</nombre>
         <apellido1>Perez</apellido1>
         <apellido2>Lopez</apellido2>
         <razonSocial></razonSocial>
         <email>juan.perez@ejemplo.com</email>
         <telefono1>4421234567</telefono1>
         <telefono2>0</telefono2>
         <idiomaFacturas>es</idiomaFacturas>
         <servicioNotificaciones></servicioNotificaciones>
         <nombreUsuarioOV></nombreUsuarioOV>
         <fecha>2023-06-15T00:00:00</fecha>
         <vinculado>false</vinculado>
         <adminFincas>false</adminFincas>
         <entorno></entorno>
         <tipoTramite></tipoTramite>
         <idUsuarioOV>0</idUsuarioOV>
         <idSociedadOV>0</idSociedadOV>
      </occ:solicitudModificacionDatosPersonales>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 52. solicitudModificacionServiAlertaMasiva

Bulk modification of alert service subscriptions.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contratos` | `int[]` | Yes | Array of contract numbers (maxOccurs=unbounded) |
| `telefonoMovil` | `string` | Yes | Mobile phone number |
| `esAlta` | `string` | Yes | Whether enrollment ("S") or cancellation ("N") |

#### Response: `solicitudModificacionServiAlertaMasivaReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudModificacionServiAlertaMasiva>
         <contratos>442761</contratos>
         <contratos>442762</contratos>
         <telefonoMovil>4421234567</telefonoMovil>
         <esAlta>S</esAlta>
      </occ:solicitudModificacionServiAlertaMasiva>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 53. solicitudSubrogacionContrato

Request contract subrogation (transfer to new owner).

**Status:** Schema only — has XSD element definitions but is NOT exposed in the WSDL portType (cannot be called as a SOAP operation)

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation ID |
| `numeroContrato` | `int` | Yes | Contract number |
| `numeroContador` | `int` | Yes | Meter number |
| `lecturaContador` | `int` | Yes | Meter reading value |
| `fechaLectura` | `string` | Yes | Reading date |
| `fechaVisita` | `string` | Yes | Visit date |
| `horaVisita` | `string` | Yes | Visit time |
| `telefonoContacto` | `long` | Yes | Contact phone number |

#### Response: `solicitudSubrogacionContratoReturn` (`ResultadoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:solicitudSubrogacionContrato>
         <explotacion>8</explotacion>
         <numeroContrato>442761</numeroContrato>
         <numeroContador>100001</numeroContador>
         <lecturaContador>12345</lecturaContador>
         <fechaLectura>2023-06-15</fechaLectura>
         <fechaVisita>2023-06-20</fechaVisita>
         <horaVisita>10:00</horaVisita>
         <telefonoContacto>4421234567</telefonoContacto>
      </occ:solicitudSubrogacionContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## Complex Types (DTOs)

### ResultadoDTO

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

### GenericoContratoDTO

| Field | Type | Description |
|-------|------|-------------|
| `contrato` | `DetalleContratoDTO` | Contract detail |
| `puntoSuministro` | `PuntoSuministroDTO` | Supply point |
| `datosPersonales` | `DatosPersonalesDTO` | Personal data |
| `datosPago` | `DatosPagoDTO` | Payment data |
| `resultado` | `ResultadoDTO` | Operation result |

### ContratoDTO

| Field | Type | Description |
|-------|------|-------------|
| `numeroContrato` | `int` | Contract number |
| `idExplotacion` | `short` | Exploitation ID |
| `idPuntoServicio` | `int` | Service point ID |
| `cliente` | `ClienteDTO` | Customer data |
| `idTipoContratacion` | `short` | Contract type ID |
| `contratoFormal` | `boolean` | Whether formal contract |
| `estadoContrato` | `short` | Contract status code |
| `fechaCaducidad` | `dateTime` | Expiration date |
| `segnasDeCobro` | `SegnasDeCobroDTO` | Payment method details |
| `direccionFacturacion` | `PersonaDireccionDTO` | Billing address |
| `codigoUso` | `short` | Usage code |
| `tipoFactura` | `short` | Invoice type |
| `tienePlanPago` | `string` | Has payment plan |
| `historicoTiposFactura` | array | Invoice type history |
| `email1` | `string` | Email address |
| `notificacionMail` | `boolean` | Email notification enabled |

### FacturaDTO

| Field | Type | Description |
|-------|------|-------------|
| `numeroContrato` | `string` | Contract number |
| `idFactura` | `int` | Invoice ID |
| `numeroFactura` | `string` | Invoice number |
| `fechaEmision` | `dateTime` | Issue date |
| `importeEuros` | `decimal` | Amount |
| `tipoCobro` | `string` | Collection type |
| `periodo` | `string` | Period |
| `estado` | `short` | Status code |
| `tipoFactura` | `short` | Invoice type |
| `docArchivado` | `boolean` | Whether archived |

### PersonaDTO

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | Person ID |
| `nombre` | `string` | First name |
| `primerApellido` | `string` | First surname |
| `nif` | `string` | Tax ID (NIF) |
| `juridica` | `boolean` | Whether legal entity |
| `claveWeb` | `string` | Web password |
| `direcciones` | `PersonaDireccionDTO[]` | Addresses |

### PersonaDireccionDTO

| Field | Type | Description |
|-------|------|-------------|
| `numeroDireccion` | `short` | Address number |
| `defecto` | `boolean` | Whether default address |
| `idSesion` | `int` | Session ID |
| `telefono` | `string` | Phone number |
| `alaAtencion` | `string` | Attention of |
| `direccion` | `DireccionDTO` | Address details |

### SegnasDeCobroDTO

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | Payment method ID |
| `activa` | `boolean` | Whether active |
| `numeroDeCuenta` | `string` | Account number |
| `banco` | `short` | Bank code |
| `canalCobroId` | `string` | Collection channel ID |
| `cuentaIBAN` | `string` | IBAN account |
| `referenciaMandato` | `int` | Mandate reference |

### ClienteDTO

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | Client ID |
| `tipoCliente` | `string` | Client type |
| `persona` | `PersonaDTO` | Person data |
| `usuarioWeb` | `string` | Web username |
| `passwordWeb` | `string` | Web password |
| `numConexionesWeb` | `int` | Number of web connections |
| `ultimaConexionWeb` | `dateTime` | Last web connection |
| `cambiarPassword` | `boolean` | Whether password change required |
| `listaContratos` | `ArrayOf_xsd_nillable_int` | Contract IDs array |

### PuntoSuministroDTO

| Field | Type | Description |
|-------|------|-------------|
| `provincia` | `string` | Province |
| `municipio` | `string` | Municipality |
| `calle` | `string` | Street |
| `numero` | `string` | Number |
| `bloque` | `string` | Block |
| `escalera` | `string` | Stairway |
| `planta` | `string` | Floor |
| `puerta` | `string` | Door |
| `edificio` | `string` | Building |

### HistoricoSuministroDTO

| Field | Type | Description |
|-------|------|-------------|
| `numeroContrato` | `int` | Contract number |
| `lectura` | `int` | Reading value |
| `consumo` | `int` | Consumption |
| `fechaLectura` | `dateTime` | Reading date |
| `estadoCicloContrato` | `short` | Cycle status |
| `idPeriodicidad` | `short` | Periodicity ID |

### DireccionNotificacionDTO

Complex type for notification address used in `cambiarDomicilioNotificaciones`.

### DocumentosDTO

Response type for `consultaDocumentacionContrato` containing contract documentation.

### DocumentacionDTO

Response type for `consultaDocumentacionTramite` containing process documentation.

### ActuacionesDTO

Response type for `consultaHistoricoActuacionesContrato` containing action history with pagination.

### HistoricoConsumoDTO

Response type for `consultaHistoricoConsumoContrato` containing consumption history with pagination.

### HistoricoDomiciliacionesDTO

Response type for `consultaHistoricoDomiciliacion` containing direct debit history with pagination.

### DesglosesDTO

Response type for `consultaLiquidacionTramite` containing settlement breakdowns.

### OrdenServicioDTO

Response type for `crearOrdenServicio` containing created service order data including `idOrdenServicio`.

### ContratosDTO

Response type for `getContratos` containing a list of contracts.

### ContratoIVRDTO

Response type for `getContratosByNumFactNumContrato` containing contract data for IVR.

### ExplotacionesDTO

Response type for `getExplotacionesUsuario` containing exploitation list.

### XmlFacturaDTO

Response type for `getFacturaE` containing electronic invoice XML data.

### FacturasDTO

Response type for `getFacturas`, `getFacturasContrato` containing invoice lists with pagination.

### FacturasReferenciaDTO

Response type for `getFacturasContratoReferencia` containing invoice references.

### FacturasResponseDTO

Response type for `getFacturasPorCondiciones` containing filtered invoices.

### IDPersonaContratoDTO

Response type for `getIDPersonaContrato` containing person-contract ID mapping.

### ImpresionesPendientesDTO

Response type for `getImpresionesLocalesPendientes` containing pending print jobs.

### DocumentoImpresionPendienteDTO

Response type for `getPDFImpresionLocalPendiente` containing print document data.

### ListaMotivosCreacionOrdenDTO

Response type for `getMotivosOrden` containing service order motive catalog.

### ListaTiposOrdenDTO

Response type for `getTiposOrden` containing service order type catalog.

### PdfFacturaDTO

Response type for `getPdfDocumentoFactura`, `getPdfFactura`, `getValidacionVerFactura` containing PDF invoice data.

### PdfReferenciaMandatoDTO

Response type for `getPdfMandato` containing PDF mandate data.

### PersonasDTO

Response type for `getClienteListByExplotacion`, `getPersonaList` containing person lists.

### FacturaIdDTO

Response type for `recuperaFacturasByIds` containing invoices retrieved by ID.

### OrdenesServicioDTO

Response type for `recuperaOrdenesServicio` containing service orders.

### RegistrarContactoDTO

Response type for `registrarContactoManual` containing registered contact data.

### CortesDTO

Response type for `getCierresByIdsContrato` containing contract closure/cut-off data.

### SolicitanteDTO

Complex type for requester data used in `solicitudAcometida`, `solicitudAltaSuministro`, `solicitudCambioTitularContrato`.

### NuevoTitularDTO

Complex type for new holder data used in `solicitudAcometida`, `solicitudAltaSuministro`, `solicitudCambioTitularContrato`.

### NuevoContratoDTO

Complex type for new contract data used in `solicitudCambioTitularContrato`.

### NuevoContratoAltaDTO

Complex type for new contract enrollment data used in `solicitudAcometida`, `solicitudAltaSuministro`.

### PuntoAcometidaDTO

Complex type for connection point data used in `solicitudAcometida`.

### BajaSuministroDTO

Complex type for supply termination data used in `solicitudBajaSuministro`.

---

## Appendix: CEA REST API

These REST endpoints are used alongside the SOAP services for case management integration.

### Base URL

| Property | Value |
|----------|-------|
| **Production URL** | `https://appcea.ceaqueretaro.gob.mx/ceadevws/` |
| **Rails Proxy** | `/api/v1/cea/rest` |
| **HTTP Method** | PUT |
| **Content-Type** | `application/json` |

### 1. updateCaseToClosed (terminar_reporte_caso)

Close/terminate a case report.

**Status:** **Implemented** in `cea.js` as `updateCaseToClosed(caseId, code, note)`

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `evento` | `string` | Yes | Event type: `terminar_reporte_caso` |
| `data.caso_sn` | `string` | Yes | ServiceNow case ID |
| `data.sn_code` | `string` | Yes | Status code |
| `data.sn_notes` | `string` | Yes | Notes |
| `data.sys_id` | `string` | No | System ID (empty) |
| `data.orden_aquacis` | `string` | No | Aquasis order ID (empty) |

#### Example Request

```json
{
  "evento": "terminar_reporte_caso",
  "data": {
    "caso_sn": "CS0012345",
    "sn_code": "resolved",
    "sn_notes": "Issue resolved",
    "sys_id": "",
    "orden_aquacis": ""
  }
}
```

### 2. referenceWorkOrderAquacis (asigna_orden_aquacis)

Link an Aquasis work order to a case.

**Status:** **Implemented** in `cea.js` as `referenceWorkOrderAquacis(caseId, workOrderId)`

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `evento` | `string` | Yes | Event type: `asigna_orden_aquacis` |
| `data.sys_id` | `string` | Yes | Case system ID |
| `data.orden_aquacis` | `string` | Yes | Aquasis work order ID |
| `data.caso_sn` | `string` | No | Case ID (empty) |
| `data.sn_code` | `string` | No | Status code (empty) |
| `data.sn_notes` | `string` | No | Notes (empty) |

#### Example Request

```json
{
  "evento": "asigna_orden_aquacis",
  "data": {
    "sys_id": "abc123def456",
    "orden_aquacis": "O4514415",
    "caso_sn": "",
    "sn_code": "",
    "sn_notes": ""
  }
}
```

### 3. updateCaseToCancelled (anular_reporte_caso)

Cancel/annul a case report.

**Status:** **Implemented** in `cea.js` as `updateCaseToCancelled(caseId)`

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `evento` | `string` | Yes | Event type: `anular_reporte_caso` |
| `data.caso_sn` | `string` | Yes | ServiceNow case ID |
| `data.sys_id` | `string` | No | System ID (empty) |
| `data.orden_aquacis` | `string` | No | Aquasis order ID (empty) |
| `data.sn_code` | `string` | No | Status code (empty) |
| `data.sn_notes` | `string` | No | Notes (empty) |

#### Example Request

```json
{
  "evento": "anular_reporte_caso",
  "data": {
    "caso_sn": "CS0012345",
    "sys_id": "",
    "orden_aquacis": "",
    "sn_code": "",
    "sn_notes": ""
  }
}
```
