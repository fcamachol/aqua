# Aquasis WSDL - Debt Management (InterfazGenericaGestionDeudaWS)

## Service Info

| Field | Value |
|-------|-------|
| **Service Name** | `InterfazGenericaGestionDeudaWSBeanSEIImplService` |
| **Endpoint** | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaGestionDeudaWS` |
| **Namespace** | `http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/` |
| **Rails Proxy** | `/api/v1/cea/soap/InterfazGenericaGestionDeudaWS` |

---

## Operations Summary

| Operation | Description | Implemented |
|-----------|-------------|:-----------:|
| `getDeuda` | Get debt summary by identifier | Yes |
| `getDeudaContrato` | Get debt for a specific contract | No |
| `getDeudaContratoBloqueoCobro` | Get debt with collection block info | No |
| `getDeudaTotalConFacturas` | Get total debt with invoice breakdown | No |
| `getContratoPorContratoConDeuda` | Get contract debt by contract number | No |
| `getContratosPorNifconDeuda` | Get contracts with debt by NIF | No |
| `getImpagadosContrato` | Get unpaid invoices for a contract | No |
| `getDocumentoPago` | Get payment document (PDF) | No |
| `getDocumentoPagoXML` | Get payment document (XML) | No |
| `avisarPago` | Notify a payment | No |
| `cobrarReferencia` | Collect payment by reference | No |
| `cobrarReferenciaFrmPago` | Collect payment with payment form | No |
| `cancelarReferencia` | Cancel a payment reference | No |

---

## Operations

### 1. getDeuda

**Description:** Get debt summary by identifier type (contract, NIF, etc.).

**Status:** Implemented in `cea.js`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tipoIdentificador` | string | Yes | Identifier type |
| `valor` | string | Yes | Identifier value |
| `explotacion` | int | Yes | Exploitation/branch code |
| `idioma` | string | Yes | Language code (e.g. `es`) |

#### Response: `resultadoGetDeuda`

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Error code and description |
| `deuda` | `deuda` | Debt details object |
| `reultado` | `resultadoDTO` | Duplicate result (typo in WSDL) |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:getDeuda>
      <tipoIdentificador>CONTRATO</tipoIdentificador>
      <valor>442761</valor>
      <explotacion>8</explotacion>
      <idioma>es</idioma>
    </int:getDeuda>
  </soapenv:Body>
</soapenv:Envelope>
```

---

### 2. getDeudaContrato

**Description:** Get debt for a specific contract with detailed breakdown.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tipoIdentificador` | string | No | Identifier type |
| `valor` | string | No | Identifier value |
| `explotacion` | int | No | Exploitation code |
| `idioma` | string | No | Language code |

#### Response: `resultadoGetDeudaContrato`

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Error code and description |
| `deudaContrato` | `deudaContrato` | Contract debt details |
| `reultado` | `resultadoDTO` | Duplicate result |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:getDeudaContrato>
      <tipoIdentificador>CONTRATO</tipoIdentificador>
      <valor>442761</valor>
      <explotacion>8</explotacion>
      <idioma>es</idioma>
    </int:getDeudaContrato>
  </soapenv:Body>
</soapenv:Envelope>
```

---

### 3. getDeudaContratoBloqueoCobro

**Description:** Get debt with collection block status for a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `tipoIdentificador` | string | No | Identifier type |
| `valor` | string | No | Identifier value |
| `explotacion` | int | No | Exploitation code |
| `idioma` | string | No | Language code |

#### Response: `resultadoGetDeudaContratoBloqueo`

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Error code and description |
| `deudaContratoBloqueoCobro` | `deudaContratoBloqueoCobro` | Debt with block info |
| `reultado` | `resultadoDTO` | Duplicate result |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:getDeudaContratoBloqueoCobro>
      <tipoIdentificador>CONTRATO</tipoIdentificador>
      <valor>442761</valor>
      <explotacion>8</explotacion>
      <idioma>es</idioma>
    </int:getDeudaContratoBloqueoCobro>
  </soapenv:Body>
</soapenv:Envelope>
```

---

### 4. getDeudaTotalConFacturas

**Description:** Get total debt with full invoice breakdown for a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | int | No | Contract number |
| `referenciaCatastral` | string | No | Cadastral reference |
| `explotacion` | int | No | Exploitation code |
| `idioma` | string | No | Language code |

#### Response: `resultadoGetDeudaConFacturas`

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Error code and description |
| `deudaTotalFacturas` | `deudaTotalFacturas` | Total debt with invoices |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:getDeudaTotalConFacturas>
      <contrato>442761</contrato>
      <referenciaCatastral></referenciaCatastral>
      <explotacion>8</explotacion>
      <idioma>es</idioma>
    </int:getDeudaTotalConFacturas>
  </soapenv:Body>
</soapenv:Envelope>
```

---

### 5. getContratoPorContratoConDeuda

**Description:** Get contract details with debt by contract number.

**Status:** Not implemented

#### Input Parameters (entradaContratoPorContratoDeudaDTO)

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | int | No | Contract number |
| `explotacion` | int | No | Exploitation code |
| `idioma` | string | No | Language code |
| `sociedad` | string | No | Company/society code |

#### Response: `resultadoContratoPorContratoDeudaDTO`

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited result |
| `aviso` | `avisoDTO` | Warning info |
| `codigoError` | int | Error code |
| `contrato` | `contratoDeudaDTO` | Contract with debt details |
| `descripcionError` | string | Error description |
| `procesoImpagadoSN` | boolean | Whether unpaid process exists |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:getContratoPorContratoConDeuda>
      <entrada>
        <contrato>442761</contrato>
        <explotacion>8</explotacion>
        <idioma>es</idioma>
        <sociedad></sociedad>
      </entrada>
    </int:getContratoPorContratoConDeuda>
  </soapenv:Body>
</soapenv:Envelope>
```

---

### 6. getContratosPorNifconDeuda

**Description:** Get all contracts with debt for a given NIF (tax ID).

**Status:** Not implemented

#### Input Parameters (entradaContratosPorNIFDeudaDTO)

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `idioma` | string | No | Language code |
| `nif` | string | No | NIF (tax identification) |
| `sociedadGestora` | string | No | Managing company |

#### Response: `resultadoContratosPorNIFDeudaDTO`

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited result |
| `avisos` | `avisoDTO[]` | Warning list |
| `codigoError` | int | Error code |
| `contratos` | `contratoDeudaDTO[]` | List of contracts with debt |
| `descripcionError` | string | Error description |
| `procesoImpagadoSN` | boolean | Whether unpaid process exists |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:getContratosPorNifconDeuda>
      <entrada>
        <idioma>es</idioma>
        <nif>XAXX010101000</nif>
        <sociedadGestora></sociedadGestora>
      </entrada>
    </int:getContratosPorNifconDeuda>
  </soapenv:Body>
</soapenv:Envelope>
```

---

### 7. getImpagadosContrato

**Description:** Get unpaid invoices and payment installments for a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | int | Yes | Contract number |
| `nif` | string | Yes | NIF (tax identification) |
| `idioma` | string | Yes | Language code |

#### Response: `impagadosContratoDTO`

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited result |
| `avisos` | `avisoDTO[]` | Warning list |
| `facturasPendientes` | `facturasPendientesDTO[]` | Pending invoices |
| `plazosPagoPendientes` | `plazosPagoPendientesDTO[]` | Pending payment installments |
| `saldoCuentaDTO` | `saldoCuentaDTO` | Account balance |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:getImpagadosContrato>
      <contrato>442761</contrato>
      <nif>XAXX010101000</nif>
      <idioma>es</idioma>
    </int:getImpagadosContrato>
  </soapenv:Body>
</soapenv:Envelope>
```

---

### 8. getDocumentoPago

**Description:** Generate a payment document (PDF) for pending invoices.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | int | Yes | Contract number |
| `nif` | string | Yes | NIF |
| `idioma` | string | Yes | Language code |
| `docs` | `documentosImpresionDTO` | Yes | Documents to include |

#### Response: `documentoDeudaPdteDTO`

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited result |
| `pdf` | base64Binary | PDF document |
| `rafagaPago` | string | Payment burst code |
| `referencia` | string | Payment reference |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:getDocumentoPago>
      <contrato>442761</contrato>
      <nif>XAXX010101000</nif>
      <idioma>es</idioma>
      <docs>
        <facturasPendientes>
          <!-- facturasPendientesDTO elements -->
        </facturasPendientes>
        <plazosPagoPendientes>
          <!-- plazosPagoPendientesDTO elements -->
        </plazosPagoPendientes>
      </docs>
    </int:getDocumentoPago>
  </soapenv:Body>
</soapenv:Envelope>
```

---

### 9. getDocumentoPagoXML

**Description:** Generate a payment document in XML format.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `contrato` | int | No | Contract number |
| `nif` | string | No | NIF |
| `idioma` | string | No | Language code |
| `docs` | `documentosImpresionDTO` | No | Documents to include |

#### Response: `documentoXMLDeudaPdteDTO`

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited result |
| `rafagaPago` | string | Payment burst code |
| `referencia` | string | Payment reference |
| `XML` | string | XML document content |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:getDocumentoPagoXML>
      <contrato>442761</contrato>
      <nif>XAXX010101000</nif>
      <idioma>es</idioma>
      <docs>
        <facturasPendientes/>
        <plazosPagoPendientes/>
      </docs>
    </int:getDocumentoPagoXML>
  </soapenv:Body>
</soapenv:Envelope>
```

---

### 10. avisarPago

**Description:** Notify the system of a payment made.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `documentoPago` | string | Yes | Payment document reference |
| `entidad` | int | Yes | Entity/bank code |
| `importe` | decimal | Yes | Amount paid |
| `idioma` | string | Yes | Language code |

#### Response: `resultadoDTO`

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | int | Error code (0 = success) |
| `descripcionError` | string | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:avisarPago>
      <documentoPago>REF123456</documentoPago>
      <entidad>1234</entidad>
      <importe>500.00</importe>
      <idioma>es</idioma>
    </int:avisarPago>
  </soapenv:Body>
</soapenv:Envelope>
```

---

### 11. cobrarReferencia

**Description:** Collect payment for a given reference.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `referencia` | string | Yes | Payment reference |
| `importe` | decimal | No | Amount to collect |
| `datosCobro` | `datosCobroDTO` | Yes | Collection data |
| `idioma` | string | No | Language code |

#### Response: `resultadoDTO`

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | int | Error code (0 = success) |
| `descripcionError` | string | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:cobrarReferencia>
      <referencia>REF123456</referencia>
      <importe>500.00</importe>
      <datosCobro>
        <banco>1234</banco>
        <cajero>ATM001</cajero>
        <comercio>SHOP001</comercio>
        <fechaPago>2026-02-11</fechaPago>
        <nif>XAXX010101000</nif>
        <tarjeta></tarjeta>
        <terminal>T001</terminal>
        <ticket>TKT001</ticket>
      </datosCobro>
      <idioma>es</idioma>
    </int:cobrarReferencia>
  </soapenv:Body>
</soapenv:Envelope>
```

---

### 12. cobrarReferenciaFrmPago

**Description:** Collect payment with payment form details (extends cobrarReferencia with cash/card indicator).

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `referencia` | string | Yes | Payment reference |
| `importe` | decimal | No | Amount to collect |
| `datosCobro` | `datosCobroFrmPagoDTO` | Yes | Collection data with payment form |
| `idioma` | string | No | Language code |

#### Response: `resultadoDTO`

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | int | Error code (0 = success) |
| `descripcionError` | string | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:cobrarReferenciaFrmPago>
      <referencia>REF123456</referencia>
      <importe>500.00</importe>
      <datosCobro>
        <banco>1234</banco>
        <cajero>ATM001</cajero>
        <comercio>SHOP001</comercio>
        <fechaPago>2026-02-11</fechaPago>
        <nif>XAXX010101000</nif>
        <tarjeta></tarjeta>
        <terminal>T001</terminal>
        <ticket>TKT001</ticket>
        <efectivoTarjeta>1</efectivoTarjeta>
      </datosCobro>
      <idioma>es</idioma>
    </int:cobrarReferenciaFrmPago>
  </soapenv:Body>
</soapenv:Envelope>
```

---

### 13. cancelarReferencia

**Description:** Cancel a payment reference.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|:--------:|-------------|
| `referencia` | string | Yes | Payment reference to cancel |
| `idioma` | string | Yes | Language code |

#### Response: `resultadoDTO`

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | int | Error code (0 = success) |
| `descripcionError` | string | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:cancelarReferencia>
      <referencia>REF123456</referencia>
      <idioma>es</idioma>
    </int:cancelarReferencia>
  </soapenv:Body>
</soapenv:Envelope>
```

---

## Complex Types (DTOs)

### resultadoDTO

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | int | Error code (0 = success) |
| `descripcionError` | string | Error description |

### deuda

| Field | Type | Description |
|-------|------|-------------|
| `ciclosAnteriores` | int | Previous cycles count |
| `ciclosTotales` | int | Total cycles count |
| `cuentaCatastral` | string | Cadastral account |
| `deuda` | decimal | Debt amount |
| `deudaComision` | decimal | Commission debt |
| `deudaTotal` | decimal | Total debt |
| `direccion` | string | Address |
| `documentoPago` | string | Payment document reference |
| `documentoPagoAnterior` | string | Previous payment document |
| `explotacion` | int | Exploitation code |
| `mensaje` | `mensaje[]` | Messages |
| `nombreCliente` | string | Customer name |
| `saldoAnterior` | decimal | Previous balance |
| `saldoAnteriorComision` | decimal | Previous commission balance |
| `saldoAnteriorTotal` | decimal | Previous total balance |

### deudaContrato

| Field | Type | Description |
|-------|------|-------------|
| `cuentaCatastral` | string | Cadastral account |
| `deuda` | decimal | Debt amount |
| `direccion` | string | Address |
| `explotacion` | int | Exploitation code |
| `mensaje` | `mensaje[]` | Messages |
| `nombreCliente` | string | Customer name |

### deudaContratoBloqueoCobro

| Field | Type | Description |
|-------|------|-------------|
| `bloquearCobro` | boolean | Whether collection is blocked |
| `cuentaCatastral` | string | Cadastral account |
| `deuda` | decimal | Debt amount |
| `direccion` | string | Address |
| `explotacion` | int | Exploitation code |
| `mensaje` | `mensaje[]` | Messages |
| `nombreCliente` | string | Customer name |

### deudaTotalFacturas

| Field | Type | Description |
|-------|------|-------------|
| `cantidadFacturas` | int | Number of invoices |
| `contrato` | int | Contract number |
| `cuentaCatastral` | string | Cadastral account |
| `deudaTotal` | decimal | Total debt |
| `explotacion` | short | Exploitation code |
| `facturas` | `facturasDeuda` | Invoice list container |
| `nombreCliente` | string | Customer name |

### facturasDeuda

| Field | Type | Description |
|-------|------|-------------|
| `factura` | `datosFacturaDeuda[]` | Invoice details |

### datosFacturaDeuda

| Field | Type | Description |
|-------|------|-------------|
| `ciclo` | string | Billing cycle |
| `codigoEstado` | short | Status code |
| `codigoTipoFactura` | short | Invoice type code |
| `estado` | string | Status description |
| `fechaVencimiento` | string | Due date |
| `importeTotal` | decimal | Total amount |
| `numFactura` | string | Invoice number |
| `referenciaPago` | string | Payment reference |
| `tipoFactura` | string | Invoice type description |

### contratoDeudaDTO

| Field | Type | Description |
|-------|------|-------------|
| `cliente` | string | Customer name |
| `contrato` | string | Contract number |
| `direccion` | string | Address |
| `facturas` | `facturasPendientesDTO[]` | Pending invoices |
| `importe` | decimal | Amount |
| `localidad` | string | Location |
| `nif` | string | NIF |
| `plazos` | `plazosPagoPendientesDTO[]` | Payment installments |
| `procesoImpagadoSN` | boolean | Unpaid process flag |

### facturasPendientesDTO

| Field | Type | Description |
|-------|------|-------------|
| `anyo` | short | Year |
| `ciclo` | int | Billing cycle |
| `cliente` | int | Customer ID |
| `cobConj` | string | Joint collection flag |
| `contrato` | int | Contract number |
| `estado` | short | Status code |
| `factura` | string | Invoice number |
| `fechaCobro` | string | Collection date |
| `fechaEmision` | string | Issue date |
| `fechaFin` | string | End date |
| `fechaInicio` | string | Start date |
| `fechaVencimiento` | string | Due date |
| `firmada` | short | Signed flag |
| `importe` | decimal | Amount |
| `importeTotal` | decimal | Total amount |
| `impuestos` | decimal | Taxes |
| `origen` | short | Origin code |
| `otros` | decimal | Other charges |
| `periodo` | string | Period |
| `procesoImpagadoSN` | boolean | Unpaid process flag |
| `rafaga` | string | Burst code |
| `recargo` | decimal | Surcharge |
| `referencia` | string | Payment reference |
| `tipoCobro` | string | Collection type |
| `URL` | string | URL |

### plazosPagoPendientesDTO

| Field | Type | Description |
|-------|------|-------------|
| `contrato` | int | Contract number |
| `fechaPrevista` | string | Expected date |
| `formaPago` | string | Payment form |
| `gestion` | int | Management code |
| `idPlazo` | int | Installment ID |
| `importe` | decimal | Amount |

### saldoCuentaDTO

| Field | Type | Description |
|-------|------|-------------|
| `saldoBloqueado` | decimal | Blocked balance |
| `saldoCompensar` | decimal | Compensating balance |
| `saldoDisponible` | decimal | Available balance |
| `saldoTotal` | decimal | Total balance |

### datosCobroDTO

| Field | Type | Description |
|-------|------|-------------|
| `banco` | short | Bank code |
| `cajero` | string | ATM/cashier ID |
| `comercio` | string | Commerce/shop ID |
| `fechaPago` | string | Payment date |
| `nif` | string | NIF |
| `tarjeta` | string | Card number |
| `terminal` | string | Terminal ID |
| `ticket` | string | Ticket number |

### datosCobroFrmPagoDTO (extends datosCobroDTO)

| Field | Type | Description |
|-------|------|-------------|
| *(all fields from datosCobroDTO)* | | |
| `efectivoTarjeta` | short | Cash (0) or Card (1) indicator |

### documentosImpresionDTO

| Field | Type | Description |
|-------|------|-------------|
| `facturasPendientes` | `facturasPendientesDTO[]` | Pending invoices to include |
| `plazosPagoPendientes` | `plazosPagoPendientesDTO[]` | Pending installments to include |

### mensaje

| Field | Type | Description |
|-------|------|-------------|
| `codigoMensaje` | int | Message code |
| `descripcionMensaje` | string | Message description |

### avisoDTO

| Field | Type | Description |
|-------|------|-------------|
| `codigoWarning` | int | Warning code |
| `descripcionWarning` | string | Warning description |
