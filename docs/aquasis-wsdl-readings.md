# Aquasis Readings & Receipts WSDL - InterfazOficinaVirtualClientesWS

## Service Information

| Property | Value |
|----------|-------|
| **Service Name** | InterfazOficinaVirtualClientesWSService |
| **Port** | InterfazOficinaVirtualClientesWS |
| **Endpoint URL** | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazOficinaVirtualClientesWS` |
| **Target Namespace** | `http://occamWS.ejb.negocio.occam.agbar.com` |
| **Rails Proxy** | `/api/v1/cea/soap/InterfazOficinaVirtualClientesWS` |
| **Binding Style** | Document/Literal |
| **Transport** | SOAP over HTTP |

---

## Operations Summary

| # | Operation | Description | Status |
|---|-----------|-------------|--------|
| 1 | `cambiarDireccionCorrespondencia` | Change correspondence address | Not implemented |
| 2 | `cambiarDomiciliacionBancaria` | Change bank domiciliation | Not implemented |
| 3 | `cambiarEmailNotificacionPersona` | Change notification email | **Implemented** |
| 4 | `cambiarMovilNotificacionContrato` | Change mobile notification for contract | Not implemented |
| 5 | `cambiarPersonaNotificacionContrato` | Change notification person for contract | **Implemented** |
| 6 | `cambiarTipoFacturaContrato` | Change invoice type for contract | **Implemented** |
| 7 | `cambiarUrlOficinaVirtualExplotacion` | Change virtual office URL for exploitation | Not implemented |
| 8 | `cambiarUrlOficinaVirtualSociedad` | Change virtual office URL for company | Not implemented |
| 9 | `getActuaciones` | Get actions/interventions for a contract | Not implemented |
| 10 | `getAgencias` | Get bank agencies by bank code | Not implemented |
| 11 | `getBanco` | Get bank by code | Not implemented |
| 12 | `getBancosPorDescripcion` | Get banks by description | Not implemented |
| 13 | `getBancoPorExplotacionCodigo` | Get bank by exploitation and code | Not implemented |
| 14 | `getBancosPorExplotacionDescripcion` | Get banks by exploitation and description | Not implemented |
| 15 | `getCallesPorPatron` | Get streets by name pattern | Not implemented |
| 16 | `getComunidadesDePais` | Get communities/regions by country | Not implemented |
| 17 | `getConceptoConTarifasDeContrato` | Get concepts with tariffs for a contract | Not implemented |
| 18 | `getConceptoConTarifasDeFactura` | Get concepts with tariffs for an invoice | Not implemented |
| 19 | `getConceptos` | Get billing concepts for an exploitation | **Implemented** |
| 20 | `getConsumos` | Get consumption data for a contract | **Implemented** |
| 21 | `getConsumosParaGraficas` | Get consumption data for charts | **Implemented** |
| 22 | `getContrato` | Get contract details | Not implemented |
| 23 | `getContratoPorDatosGenerales` | Get contract by address details | Not implemented |
| 24 | `getContratosPorDatosGenerales` | Get contracts by address details | Not implemented |
| 25 | `getContratosPorNif` | Get contracts by NIF (tax ID) | Not implemented |
| 26 | `getContratosPorNie_crn` | Get contracts by NIE/CRN | Not implemented |
| 27 | `getDomicilio` | Get domicile for a contract | Not implemented |
| 28 | `getDomiciliosContratados` | Get contracted domiciles | Not implemented |
| 29 | `getDomiciliosPendientesContratar` | Get domiciles pending contract | Not implemented |
| 30 | `getFactura` | Get single invoice detail | Not implemented |
| 31 | `getFacturas` | Get invoices list for a contract | **Implemented** |
| 32 | `getIdiomaExplotacion` | Get language for an exploitation | Not implemented |
| 33 | `getLecturas` | Get meter readings for a contract | **Implemented** |
| 34 | `getLecturasParaGraficas` | Get readings for chart display | Not implemented |
| 35 | `getLocalidadesDePoblacion` | Get localities by town/city | Not implemented |
| 36 | `getNumeroCuentaBancaria` | Get bank account number for a contract | Not implemented |
| 37 | `getPaises` | Get countries list | Not implemented |
| 38 | `getPoblacionesDeProvincia` | Get towns by province | Not implemented |
| 39 | `getProvincia` | Get provinces by country | Not implemented |
| 40 | `getProvinciasDeComunidad` | Get provinces by community | Not implemented |
| 41 | `getTarifaDeAguaPorContrato` | Get water rate for a contract | **Implemented** |
| 42 | `getTarifasVigente` | Get current tariffs | Not implemented |
| 43 | `getTitularPorContrato` | Get holder by contract | Not implemented |
| 44 | `getTitularPorNif` | Get holder by NIF | Not implemented |
| 45 | `getTitularPorNie_crn` | Get holder by NIE/CRN | Not implemented |
| 46 | `getTitulares` | Search holders by multiple criteria | Not implemented |
| 47 | `getUltimoMensaje` | Get last message for a contract | Not implemented |

---

## Operations Detail

### 1. cambiarDireccionCorrespondencia

Change the correspondence address for a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
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

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `string` | Operation result |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:cambiarDireccionCorrespondencia>
         <contrato>442761</contrato>
         <textoDireccion>Av. Principal 123</textoDireccion>
         <localidadId>1</localidadId>
         <calleId>1234</calleId>
         <numFinca>10</numFinca>
         <complementoFinca>A</complementoFinca>
         <bloque>1</bloque>
         <escalera>A</escalera>
         <codigoPostal>76000</codigoPostal>
         <telefono>4421234567</telefono>
         <codigoOficina>01</codigoOficina>
         <usuario>AGORA</usuario>
      </occ:cambiarDireccionCorrespondencia>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 2. cambiarDomiciliacionBancaria

Change the bank direct debit details for a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
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

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `string` | Operation result |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:cambiarDomiciliacionBancaria>
         <contrato>442761</contrato>
         <codigoBanco>0049</codigoBanco>
         <codigoAgencia>0001</codigoAgencia>
         <cuenta>1234567890</cuenta>
         <digitoControl>12</digitoControl>
         <tipoPersona>F</tipoPersona>
         <nombreTitular>Juan</nombreTitular>
         <ape1Titular>Perez</ape1Titular>
         <ape2Titular>Lopez</ape2Titular>
         <nif>XAXX010101000</nif>
         <codigoOficina>01</codigoOficina>
         <usuario>AGORA</usuario>
         <idioma>es</idioma>
      </occ:cambiarDomiciliacionBancaria>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 3. cambiarEmailNotificacionPersona

Change the notification email address for a person associated with a contract. Hardcodes `atencionDe` to `ChatBot` in cea.js.

**Status:** **Implemented** in `cea.js` as `cambiarEmailNotificacionPersona(nif, nombre, apellido1, apellido2, contrato, emailAntiguo, emailNuevo, codigoOficina, usuario)`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nif` | `string` | Yes | Tax identification number (NIF) |
| `nombre` | `string` | Yes | First name |
| `apellido1` | `string` | Yes | First surname |
| `apellido2` | `string` | Yes | Second surname |
| `contrato` | `int` | Yes | Contract number |
| `emailAntigo` | `string` | Yes | Old email address (note: typo in WSDL) |
| `emailNuevo` | `string` | Yes | New email address |
| `atencionDe` | `string` | Yes | Attention of (hardcoded to `ChatBot`) |
| `codigoOficina` | `short` | Yes | Office code |
| `usuario` | `string` | Yes | User identifier |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `int` | Result code |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:cambiarEmailNotificacionPersona>
      <nif>XAXX010101000</nif>
      <nombre>Juan</nombre>
      <apellido1>Perez</apellido1>
      <apellido2>Lopez</apellido2>
      <contrato>442761</contrato>
      <emailAntigo>old@example.com</emailAntigo>
      <emailNuevo>new@example.com</emailNuevo>
         <atencionDe>ChatBot</atencionDe>
         <codigoOficina>01</codigoOficina>
         <usuario>AGORA</usuario>
      </occ:cambiarEmailNotificacionPersona>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 4. cambiarMovilNotificacionContrato

Change the mobile notification number for a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contrato` | `int` | Yes | Contract number |
| `nif` | `string` | Yes | Tax ID |
| `movil` | `long` | Yes | Mobile number |
| `usuario` | `string` | Yes | User identifier |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `short` | Result code |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:cambiarMovilNotificacionContrato>
         <contrato>442761</contrato>
         <nif>XAXX010101000</nif>
         <movil>4421234567</movil>
         <usuario>AGORA</usuario>
      </occ:cambiarMovilNotificacionContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 5. cambiarPersonaNotificacionContrato

Change the notification person for a contract. **Requires WS-Security authentication.**

**Status:** **Implemented** in `cea.js` as `cambiarPersonaNotificacionContrato(contrato, nif, email1, email2, usuario)`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contrato` | `int` | Yes | Contract number |
| `nif` | `string` | Yes | Tax identification number (NIF) |
| `email1` | `string` | Yes | Primary email |
| `email2` | `string` | No | Secondary email |
| `usuario` | `string` | Yes | User identifier |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `short` | Result code |

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
      <occ:cambiarPersonaNotificacionContrato>
         <contrato>442761</contrato>
         <nif>XAXX010101000</nif>
         <email1>user@example.com</email1>
         <email2></email2>
         <usuario>AGORA</usuario>
      </occ:cambiarPersonaNotificacionContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 6. cambiarTipoFacturaContrato

Change the invoice type for a contract. **Requires WS-Security authentication.**

**Status:** **Implemented** in `cea.js` as `cambiarTipoFacturaContrato(contrato, nif, tipoFactura, usuario)`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contrato` | `int` | Yes | Contract number |
| `nif` | `string` | Yes | Tax identification number (NIF) |
| `tipoFactura` | `short` | Yes | Invoice type code |
| `usuario` | `string` | Yes | User identifier (default: `0000004874`) |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `short` | Result code |

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
      <occ:cambiarTipoFacturaContrato>
         <contrato>442761</contrato>
         <nif>XAXX010101000</nif>
         <tipoFactura>1</tipoFactura>
         <usuario>0000004874</usuario>
      </occ:cambiarTipoFacturaContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 7. cambiarUrlOficinaVirtualExplotacion

Change the virtual office URL for an exploitation.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `urlOficnaVirtual` | `string` | Yes | Virtual office URL |
| `usuario` | `string` | Yes | User identifier |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `short` | Result code |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:cambiarUrlOficinaVirtualExplotacion>
         <explotacion>08</explotacion>
         <urlOficnaVirtual>https://oficinavirtual.example.com</urlOficnaVirtual>
         <usuario>AGORA</usuario>
      </occ:cambiarUrlOficinaVirtualExplotacion>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 8. cambiarUrlOficinaVirtualSociedad

Change the virtual office URL for a company/society.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sociedad` | `int` | Yes | Society/company code |
| `urlOficnaVirtual` | `string` | Yes | Virtual office URL |
| `usuario` | `string` | Yes | User identifier |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `short` | Result code |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:cambiarUrlOficinaVirtualSociedad>
         <sociedad>01</sociedad>
         <urlOficnaVirtual>https://oficinavirtual.example.com</urlOficnaVirtual>
         <usuario>AGORA</usuario>
      </occ:cambiarUrlOficinaVirtualSociedad>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 9. getActuaciones

Get actions/interventions performed on a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `contrato` | `int` | Yes | Contract number |
| `idioma` | `string` | Yes | Language code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Actuacion[]` | Array of actions |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getActuaciones>
         <explotacion>08</explotacion>
         <contrato>442761</contrato>
         <idioma>es</idioma>
      </occ:getActuaciones>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 10. getAgencias

Get bank agencies by bank code.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `codBanco` | `short` | Yes | Bank code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Agencia[]` | Array of agencies |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getAgencias>
         <codBanco>0049</codBanco>
      </occ:getAgencias>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 11. getBanco

Get bank details by code.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `codBanco` | `short` | Yes | Bank code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Banco` | Bank data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getBanco>
         <codBanco>0049</codBanco>
      </occ:getBanco>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 12. getBancosPorDescripcion

Get banks by description/name search.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `descBanco` | `string` | Yes | Bank description pattern |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Banco[]` | Array of banks |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getBancosPorDescripcion>
         <descBanco>SANTANDER</descBanco>
      </occ:getBancosPorDescripcion>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 13. getBancoPorExplotacionCodigo

Get bank by exploitation and bank code.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `codBanco` | `short` | Yes | Bank code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Banco` | Bank data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getBancoPorExplotacionCodigo>
         <explotacion>08</explotacion>
         <codBanco>0049</codBanco>
      </occ:getBancoPorExplotacionCodigo>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 14. getBancosPorExplotacionDescripcion

Get banks by exploitation and description.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `descBanco` | `string` | Yes | Bank description pattern |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Banco[]` | Array of banks |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getBancosPorExplotacionDescripcion>
         <explotacion>08</explotacion>
         <descBanco>SANTANDER</descBanco>
      </occ:getBancosPorExplotacionDescripcion>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 15. getCallesPorPatron

Get streets matching a name pattern.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idExplotacion` | `short` | Yes | Exploitation ID |
| `patron` | `string` | Yes | Street name pattern |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Calle[]` | Array of streets |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getCallesPorPatron>
         <idExplotacion>08</idExplotacion>
         <patron>PRINCIPAL</patron>
      </occ:getCallesPorPatron>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 16. getComunidadesDePais

Get communities/regions by country.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idPais` | `int` | Yes | Country ID |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Comunidad[]` | Array of communities |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getComunidadesDePais>
         <idPais>1</idPais>
      </occ:getComunidadesDePais>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 17. getConceptoConTarifasDeContrato

Get billing concepts with associated tariffs for a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `contrato` | `int` | Yes | Contract number |
| `idioma` | `string` | Yes | Language code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `ConceptoConTarifasFacturadas[]` | Concepts with tariffs |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getConceptoConTarifasDeContrato>
         <explotacion>08</explotacion>
         <contrato>442761</contrato>
         <idioma>es</idioma>
      </occ:getConceptoConTarifasDeContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 18. getConceptoConTarifasDeFactura

Get billing concepts with associated tariffs for a specific invoice.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `contrato` | `int` | Yes | Contract number |
| `numFactura` | `string` | Yes | Invoice number |
| `idioma` | `string` | Yes | Language code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `ConceptoConTarifasFacturadas[]` | Concepts with tariffs |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getConceptoConTarifasDeFactura>
         <explotacion>08</explotacion>
         <contrato>442761</contrato>
         <numFactura>100001</numFactura>
         <idioma>es</idioma>
      </occ:getConceptoConTarifasDeFactura>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 19. getConceptos

Get billing concepts for a given exploitation.

**Status:** **Implemented** in `cea.js` as `getConceptos(explotacion, idioma)`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code (zero-padded to 2 digits) |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Concepto[]` | Array of billing concepts |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getConceptos>
         <explotacion>08</explotacion>
         <idioma>es</idioma>
      </occ:getConceptos>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 20. getConsumos

Get consumption data for a contract. Pads exploitation code with leading zeros. **Requires WS-Security authentication.**

**Status:** **Implemented** in `cea.js` as `getConsumos(explotacion, contrato, idioma)`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code (zero-padded to 2 digits) |
| `contrato` | `int` | Yes | Contract number |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Consumo[]` | Array of consumption records |

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
      <occ:getConsumos>
      <explotacion>08</explotacion>
      <contrato>442761</contrato>
      <idioma>es</idioma>
      </occ:getConsumos>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 21. getConsumosParaGraficas

Get consumption data formatted for chart visualization.

**Status:** **Implemented** in `cea.js` as `getConsumosParaGraficas(explotacion, contrato, idioma)`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `contrato` | `int` | Yes | Contract number |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Consumo[]` | Array of consumption records for charts |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getConsumosParaGraficas>
         <explotacion>08</explotacion>
         <contrato>442761</contrato>
         <idioma>es</idioma>
      </occ:getConsumosParaGraficas>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 22. getContrato

Get contract details by exploitation and contract number.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `contrato` | `long` | Yes | Contract number |
| `idioma` | `string` | Yes | Language code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Contrato` | Contract data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getContrato>
         <explotacion>08</explotacion>
         <contrato>442761</contrato>
         <idioma>es</idioma>
      </occ:getContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 23. getContratoPorDatosGenerales

Get a contract by address details (single result).

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `codCalle` | `int` | Yes | Street code |
| `numeroFinca` | `int` | Yes | Building number |
| `bloque` | `string` | No | Block |
| `escalera` | `string` | No | Stairway |
| `planta` | `string` | No | Floor |
| `puerta` | `string` | No | Door |
| `idioma` | `string` | Yes | Language code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Contrato` | Contract data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getContratoPorDatosGenerales>
         <explotacion>08</explotacion>
         <codCalle>1234</codCalle>
         <numeroFinca>10</numeroFinca>
         <bloque></bloque>
         <escalera></escalera>
         <planta></planta>
         <puerta></puerta>
         <idioma>es</idioma>
      </occ:getContratoPorDatosGenerales>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 24. getContratosPorDatosGenerales

Get contracts by address details (multiple results).

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `codCalle` | `int` | Yes | Street code |
| `numeroFinca` | `int` | Yes | Building number |
| `bloque` | `string` | No | Block |
| `escalera` | `string` | No | Stairway |
| `planta` | `string` | No | Floor |
| `puerta` | `string` | No | Door |
| `idioma` | `string` | Yes | Language code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Contrato[]` | Array of contracts |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getContratosPorDatosGenerales>
         <explotacion>08</explotacion>
         <codCalle>1234</codCalle>
         <numeroFinca>10</numeroFinca>
         <bloque></bloque>
         <escalera></escalera>
         <planta></planta>
         <puerta></puerta>
         <idioma>es</idioma>
      </occ:getContratosPorDatosGenerales>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 25. getContratosPorNif

Get contracts by NIF (tax identification number).

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nif` | `string` | Yes | Tax ID (NIF) |
| `idioma` | `string` | Yes | Language code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Contrato[]` | Array of contracts |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getContratosPorNif>
         <nif>XAXX010101000</nif>
         <idioma>es</idioma>
      </occ:getContratosPorNif>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 26. getContratosPorNie_crn

Get contracts by NIE or CRN number.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nie_crn` | `string` | Yes | NIE/CRN number |
| `idioma` | `string` | Yes | Language code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Contrato[]` | Array of contracts |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getContratosPorNie_crn>
         <nie_crn>CRN123456</nie_crn>
         <idioma>es</idioma>
      </occ:getContratosPorNie_crn>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 27. getDomicilio

Get domicile/address for a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `codContrato` | `int` | Yes | Contract code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Domicilio` | Domicile data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getDomicilio>
         <explotacion>08</explotacion>
         <codContrato>442761</codContrato>
      </occ:getDomicilio>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 28. getDomiciliosContratados

Get contracted domiciles at a given address.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `codCalle` | `int` | Yes | Street code |
| `numeroFinca` | `int` | Yes | Building number |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Domicilio[]` | Array of domiciles |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getDomiciliosContratados>
         <explotacion>08</explotacion>
         <codCalle>1234</codCalle>
         <numeroFinca>10</numeroFinca>
      </occ:getDomiciliosContratados>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 29. getDomiciliosPendientesContratar

Get domiciles pending contract at a given address.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `codCalle` | `int` | Yes | Street code |
| `numeroFinca` | `int` | Yes | Building number |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Domicilio[]` | Array of domiciles |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getDomiciliosPendientesContratar>
         <explotacion>08</explotacion>
         <codCalle>1234</codCalle>
         <numeroFinca>10</numeroFinca>
      </occ:getDomiciliosPendientesContratar>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 30. getFactura

Get a single invoice detail.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `numeroFactura` | `string` | Yes | Invoice number |
| `idioma` | `string` | Yes | Language code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Factura` | Invoice data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getFactura>
         <explotacion>08</explotacion>
         <numeroFactura>100001</numeroFactura>
         <idioma>es</idioma>
      </occ:getFactura>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 31. getFacturas

Get the list of invoices for a contract. **Requires WS-Security authentication.**

**Status:** **Implemented** in `cea.js` as `getFacturas(explotacion, contrato, idioma)` and `getFacturasJson()`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `contrato` | `int` | Yes | Contract number |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Factura[]` | Array of invoices |

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
      <occ:getFacturas>
         <explotacion>08</explotacion>
         <contrato>442761</contrato>
         <idioma>es</idioma>
      </occ:getFacturas>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 32. getIdiomaExplotacion

Get the configured language for an exploitation.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `string` | Language code |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getIdiomaExplotacion>
         <explotacion>08</explotacion>
      </occ:getIdiomaExplotacion>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 33. getLecturas

Get meter readings for a contract. **Requires WS-Security authentication.**

**Status:** **Implemented** in `cea.js` as `getLecturas(explotacion, contrato, idioma)`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation/branch code |
| `contrato` | `int` | Yes | Contract number |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Lectura[]` | Array of meter readings |

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
      <occ:getLecturas>
      <explotacion>08</explotacion>
      <contrato>442761</contrato>
      <idioma>es</idioma>
      </occ:getLecturas>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 34. getLecturasParaGraficas

Get meter readings formatted for chart display.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `contrato` | `int` | Yes | Contract number |
| `idioma` | `string` | Yes | Language code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Lectura[]` | Array of readings for charts |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getLecturasParaGraficas>
         <explotacion>08</explotacion>
         <contrato>442761</contrato>
         <idioma>es</idioma>
      </occ:getLecturasParaGraficas>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 35. getLocalidadesDePoblacion

Get localities/neighborhoods by town/city.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idPoblacion` | `int` | Yes | Town/city ID |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Localidad[]` | Array of localities |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getLocalidadesDePoblacion>
         <idPoblacion>1</idPoblacion>
      </occ:getLocalidadesDePoblacion>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 36. getNumeroCuentaBancaria

Get bank account numbers for a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `contrato` | `int` | Yes | Contract number |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `NumeroCuentaBancaria[]` | Array of bank accounts |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getNumeroCuentaBancaria>
         <explotacion>08</explotacion>
         <contrato>442761</contrato>
      </occ:getNumeroCuentaBancaria>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 37. getPaises

Get the list of countries. No input parameters.

**Status:** Not implemented

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Pais[]` | Array of countries |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getPaises/>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 38. getPoblacionesDeProvincia

Get towns/cities by province.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idProvincia` | `int` | Yes | Province ID |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Poblacion[]` | Array of towns |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getPoblacionesDeProvincia>
         <idProvincia>1</idProvincia>
      </occ:getPoblacionesDeProvincia>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 39. getProvincia

Get provinces by country.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idPais` | `int` | Yes | Country ID |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Provincia[]` | Array of provinces |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getProvincia>
         <idPais>1</idPais>
      </occ:getProvincia>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 40. getProvinciasDeComunidad

Get provinces by community/region.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idComunidad` | `int` | Yes | Community ID |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Provincia[]` | Array of provinces |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getProvinciasDeComunidad>
         <idComunidad>1</idComunidad>
      </occ:getProvinciasDeComunidad>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 41. getTarifaDeAguaPorContrato

Get the water rate/tariff for a specific contract.

**Status:** **Implemented** in `cea.js` as `getTarifaDeAguaPorContrato(explotacion, contrato, idioma)` and `getTarifaDeAguaPorContratoJson()`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code (zero-padded to 2 digits) |
| `contrato` | `int` | Yes | Contract number |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Tarifa` | Water tariff data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getTarifaDeAguaPorContrato>
         <explotacion>08</explotacion>
         <contrato>442761</contrato>
         <idioma>es</idioma>
      </occ:getTarifaDeAguaPorContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 42. getTarifasVigente

Get currently active tariffs by exploitation and concept type.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `tipoConcepto` | `IDShortShort` | Yes | Concept type |
| `idioma` | `string` | Yes | Language code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Tarifa[]` | Array of tariffs |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getTarifasVigente>
         <explotacion>08</explotacion>
         <tipoConcepto>AGUA</tipoConcepto>
         <idioma>es</idioma>
      </occ:getTarifasVigente>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 43. getTitularPorContrato

Get contract holder by exploitation and contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `contrato` | `long` | Yes | Contract number |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Titular` | Holder data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getTitularPorContrato>
         <explotacion>08</explotacion>
         <contrato>442761</contrato>
      </occ:getTitularPorContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 44. getTitularPorNif

Get contract holder by NIF.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nif` | `string` | Yes | Tax ID (NIF) |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Titular` | Holder data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getTitularPorNif>
         <nif>XAXX010101000</nif>
      </occ:getTitularPorNif>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 45. getTitularPorNie_crn

Get contract holder by NIE/CRN.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `nie_crn` | `string` | Yes | NIE/CRN number |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Titular` | Holder data |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getTitularPorNie_crn>
         <nie_crn>CRN123456</nie_crn>
      </occ:getTitularPorNie_crn>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 46. getTitulares

Search contract holders by multiple criteria.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | No | Exploitation code |
| `nif` | `string` | No | Tax ID |
| `nombre` | `string` | No | Name |
| `apellido1` | `string` | No | First surname |
| `apellido2` | `string` | No | Second surname |
| `domicilio` | `string` | No | Address |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `Titular[]` | Array of holders |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getTitulares>
         <explotacion>08</explotacion>
         <nif>XAXX010101000</nif>
         <nombre>Juan</nombre>
         <apellido1>Perez</apellido1>
         <apellido2>Lopez</apellido2>
         <domicilio>Av. Principal 123</domicilio>
      </occ:getTitulares>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 47. getUltimoMensaje

Get the last message/notification for a contract.

**Status:** Not implemented

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `explotacion` | `short` | Yes | Exploitation code |
| `contrato` | `int` | Yes | Contract number |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `string` | Last message text |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getUltimoMensaje>
         <explotacion>08</explotacion>
         <contrato>442761</contrato>
      </occ:getUltimoMensaje>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## Complex Types

### Consumo

| Field | Type | Description |
|-------|------|-------------|
| `estimado` | `boolean` | Whether estimated |
| `año` | `short` | Year |
| `metrosCubicos` | `int` | Cubic meters |
| `periodicidad` | `string` | Periodicity |
| `periodo` | `string` | Period |
| `fechaLectura` | `string` | Reading date |
| `consumos` | `ElementoConsumo[]` | Consumption elements |
| `variablesDeCiclo` | `Variable[]` | Cycle variables |

### ElementoConsumo

| Field | Type | Description |
|-------|------|-------------|
| `observacion` | `string` | Observation |
| `origen` | `string` | Origin |
| `tipo` | `string` | Type |
| `estimado` | `boolean` | Whether estimated |
| `fecha` | `string` | Date |
| `m3` | `int` | Cubic meters |

### Lectura

| Field | Type | Description |
|-------|------|-------------|
| `año` | `short` | Year |
| `estimado` | `boolean` | Whether estimated |
| `metrosCubicos` | `int` | Cubic meters |
| `periodicidad` | `string` | Periodicity |
| `periodo` | `string` | Period |
| `fechaLectura` | `string` | Reading date |
| `lecturas` | `ElementoLectura[]` | Reading elements |
| `variablesDeCiclo` | `Variable[]` | Cycle variables |

### ElementoLectura

| Field | Type | Description |
|-------|------|-------------|
| `observacion` | `string` | Observation |
| `origen` | `string` | Origin |
| `tipo` | `string` | Type |
| `fecha` | `string` | Date |
| `m3` | `int` | Cubic meters |

### Tarifa

| Field | Type | Description |
|-------|------|-------------|
| `codigo` | `IDShortShortShort` | Tariff code |
| `descripcion` | `string` | Description |
| `publicacion` | `Publicacion` | Publication info |
| `subconceptos` | `Subconcepto[]` | Sub-concepts |
| `variablesContratos` | `Variable[]` | Contract variables |
| `variablesPuntoServicio` | `Variable[]` | Service point variables |

### Concepto

| Field | Type | Description |
|-------|------|-------------|
| `codigoConcepto` | `IDShortShort` | Concept code |
| `descripcionConcepto` | `string` | Description |
| `organismoPropietario` | `string` | Owner organism |
| `conceptoPeriodico` | `boolean` | Whether periodic |
| `importe` | `decimal` | Amount |

### ConceptoConTarifasFacturadas

| Field | Type | Description |
|-------|------|-------------|
| `concepto` | `Concepto` | Billing concept |
| `tarifasFacturadas` | `Tarifa[]` | Associated tariffs |

### Factura

| Field | Type | Description |
|-------|------|-------------|
| `conceptosCobrados` | `Concepto[]` | Charged concepts |
| `contrato` | `int` | Contract number |
| `fechaCobro` | `string` | Collection date |
| `importeTotal` | `decimal` | Total amount |
| `numero` | `string` | Invoice number |
| `tipoCobro` | `string` | Collection type |
| `año` | `short` | Year |
| `fechaEmision` | `string` | Issue date |
| `periodo` | `short` | Period |
| `idDocumentoFactura` | `string` | Document ID |
| `tipoDocumento` | `short` | Document type |
| `origenFactura` | `string` | Invoice origin |
| `estado` | `short` | Status code |

### Contrato

| Field | Type | Description |
|-------|------|-------------|
| `ampliacionDireccion` | `string` | Address extension |
| `calibreContador` | `short` | Meter caliber |
| `codigoGrupoFacturacion` | `string` | Billing group code |
| `codigoPostalCorrespondencia` | `string` | Correspondence postal code |
| `descripcionGrupoFacturacion` | `string` | Billing group description |
| `domicilioCorrespondencia` | `string` | Correspondence address |
| `explotacion` | `string` | Exploitation code |
| `fechaAlta` | `string` | Start date |
| `fechaBaja` | `string` | End date |
| `fechaInstalacionContador` | `string` | Meter installation date |
| `marcaContador` | `string` | Meter brand |
| `nifTitularDomiciliacionBancaria` | `string` | Bank holder NIF |
| `nifTitularDomicilioNotificaciones` | `string` | Notification holder NIF |
| `numero` | `int` | Contract number |
| `numeroContador` | `string` | Meter number |
| `numeroViviendas` | `short` | Number of dwellings |
| `paisCorrespondencia` | `string` | Correspondence country |
| `periodicidad` | `string` | Periodicity |
| `periodicidadID` | `short` | Periodicity ID |
| `poblacionCorrespondencia` | `string` | Correspondence city |
| `provinciaCorrespondencia` | `string` | Correspondence province |
| `situacionContador` | `string` | Meter location |
| `telefonoCorrespondencia` | `string` | Correspondence phone |
| `tipoCobro` | `string` | Collection type |
| `tipoContador` | `string` | Meter type |
| `tipoDomicilioNotificaciones` | `string` | Notification address type |
| `zona` | `string` | Zone |
| `titularCorrespondencia` | `Titular` | Correspondence holder |
| `uso` | `string` | Usage type |
| `explotacionID` | `short` | Exploitation ID |
| `sntelelectura` | `boolean` | Remote reading enabled |
| `moduloComunicacion` | `string` | Communication module |

### Titular

| Field | Type | Description |
|-------|------|-------------|
| `apellido1` | `string` | First surname |
| `apellido2` | `string` | Second surname |
| `EMail` | `string` | Email address |
| `nie_crn` | `string` | NIE/CRN |
| `fax` | `string` | Fax number |
| `nif` | `string` | Tax ID (NIF) |
| `nombre` | `string` | Name |
| `telefono` | `string` | Phone number |

### Domicilio

| Field | Type | Description |
|-------|------|-------------|
| `bloque` | `string` | Block |
| `domicilioSuministro` | `string` | Supply address |
| `escalera` | `string` | Stairway |
| `calle` | `Calle` | Street data |
| `numeroFinca` | `int` | Building number |
| `planta` | `string` | Floor |
| `provincia` | `string` | Province |
| `puerta` | `string` | Door |
| `contrato` | `int` | Contract number |
| `idExplotacion` | `short` | Exploitation ID |
| `localidad` | `string` | Locality |

### Calle

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | Street ID |
| `nombre` | `string` | Street name |
| `tipoVia` | `string` | Street type |

### Banco

| Field | Type | Description |
|-------|------|-------------|
| `id` | `short` | Bank ID |
| `nombre` | `string` | Bank name |

### Agencia

| Field | Type | Description |
|-------|------|-------------|
| `codigo` | `IDShortShort` | Agency code |
| `codigoPostal` | `string` | Postal code |
| `direccion` | `string` | Address |
| `fax` | `decimal` | Fax |
| `localidad` | `string` | Locality |
| `nombre` | `string` | Name |
| `telefono` | `decimal` | Phone |

### NumeroCuentaBancaria

| Field | Type | Description |
|-------|------|-------------|
| `agencia` | `Agencia` | Agency data |
| `banco` | `Banco` | Bank data |
| `cuenta` | `string` | Account number |
| `digitoControl` | `string` | Control digit |
| `fechaAlta` | `string` | Start date |
| `fechaBaja` | `string` | End date |
| `nombreUsuarioCuenta` | `string` | Account holder name |

### Actuacion

| Field | Type | Description |
|-------|------|-------------|
| `fechaActuacion` | `string` | Action date |
| `motivoActuacion` | `string` | Action motive |
| `tipoActuacion` | `string` | Action type |

### Subconcepto

| Field | Type | Description |
|-------|------|-------------|
| `correctoresAplicables` | `Corrector[]` | Applicable correctors |
| `descripcion` | `string` | Description |
| `variables` | `Variable[]` | Variables |

### Corrector

| Field | Type | Description |
|-------|------|-------------|
| `descripcion` | `string` | Description |

### Variable

| Field | Type | Description |
|-------|------|-------------|
| `descripcion` | `string` | Description |
| `valor` | `anyType` | Value |
| `id` | `short` | ID |

### Publicacion

| Field | Type | Description |
|-------|------|-------------|
| `fechaPublicacion` | `string` | Publication date |
| `textoPublicacion` | `string` | Publication text |

### IDShortShort

| Field | Type | Description |
|-------|------|-------------|
| `id1Short` | `short` | First ID component |
| `id2Short` | `short` | Second ID component |

### IDShortShortShort

| Field | Type | Description |
|-------|------|-------------|
| `id1Short` | `short` | First ID component |
| `id2Short` | `short` | Second ID component |
| `id3Short` | `short` | Third ID component |

### Localidad

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | Locality ID |
| `nombre` | `string` | Locality name |

### Provincia

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | Province ID |
| `nombre` | `string` | Province name |

### Poblacion

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | Town ID |
| `nombre` | `string` | Town name |

### Pais

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | Country ID |
| `nombre` | `string` | Country name |

### Comunidad

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | Community ID |
| `nombre` | `string` | Community name |
