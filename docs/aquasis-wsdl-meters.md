# Aquasis Meters WSDL - InterfazGenericaContadoresWS

## Service Information

| Property | Value |
|----------|-------|
| **Service Name** | InterfazGenericaContadoresWSBeanSEIImplService |
| **Port** | InterfazGenericaContadoresWSBeanSEIImplPort |
| **Endpoint URL** | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContadoresWS` |
| **Target Namespace** | `http://interfazgenericacontadores.occamcxf.occam.agbar.com/` |
| **Imported Namespace** | `http://InterfazGenericaContratacion.DTOs.occamWS.ejb.negocio.occam.agbar.com` |
| **Binding Style** | Document/Literal |
| **Transport** | SOAP over HTTP |

## Operations Summary

| # | Operation | SOAPAction | Description | Status |
|---|-----------|------------|-------------|--------|
| 1 | `actualizarContador` | `actualizarContador` | Update meter data | Not implemented |
| 2 | `getCambiosContadorDeContrato` | `getCambiosContadorDeContrato` | Get meter change history for a contract | Not implemented |
| 3 | `getContador` | `getContador` | Get meter details by serial number | Not implemented |
| 4 | `getPuntoServicioPorContador` | `getPuntoServicioPorContador` | Get service points by meter serial | **Implemented** |

---

## Operations Detail

### 1. actualizarContador

Update meter data (brand, model, caliber, manufacturing year) for a given serial number.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `serialNumber` | `string` | Yes | Meter serial number |
| `contadorDTO` | `actualizarContadorDTO` | Yes | Updated meter data |

#### `actualizarContadorDTO`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `anoFabricacion` | `short` | No | Manufacturing year |
| `calibre` | `short` | No | Caliber (mm) |
| `marca` | `string` | No | Brand |
| `modelo` | `string` | No | Model |
| `numeroSerie` | `string` | No | New serial number |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `resultadoDTO` | Operation result |

#### `resultadoDTO`

| Field | Type | Description |
|-------|------|-------------|
| `mensajes[]` | `mensajeError[]` | Array of error messages |
| `resultado` | `string` | Result status |

#### `mensajeError`

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `string` | Error code |
| `descripcion` | `string` | Error description |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericacontadores.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:actualizarContador>
         <serialNumber>10005237</serialNumber>
         <contadorDTO>
            <anoFabricacion>2020</anoFabricacion>
            <calibre>15</calibre>
            <marca>ITRON</marca>
            <modelo>FLODIS</modelo>
         </contadorDTO>
      </int:actualizarContador>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 2. getCambiosContadorDeContrato

Get the history of meter changes (installations/removals) for a specific contract.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idContrato` | `int` | Yes | Contract number |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `cambiosContadorDTO` | Meter changes and result |

#### `cambiosContadorDTO`

| Field | Type | Description |
|-------|------|-------------|
| `cambiosContador[]` | `cambioContadorDTO[]` | Array of meter changes |
| `resultado` | `resultadoDTO` | Operation result |

#### `cambioContadorDTO`

| Field | Type | Description |
|-------|------|-------------|
| `calibre` | `int` | Meter caliber |
| `contador` | `string` | Meter serial number |
| `contratista` | `string` | Contractor name |
| `contrato` | `int` | Contract number |
| `direccionPuntoServicio` | `string` | Service point address |
| `emplazamiento` | `string` | Emplacement |
| `externo` | `string` | External indicator |
| `fechaCambioContador` | `dateTime` | Change date |
| `fechaInstalContador` | `dateTime` | Installation date |
| `horaCambioContador` | `string` | Change time |
| `localidad` | `string` | City/town |
| `observacion` | `string` | Observations |
| `telefonoContrato` | `string` | Contract phone |
| `zona` | `string` | Zone |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericacontadores.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:getCambiosContadorDeContrato>
         <idContrato>442761</idContrato>
         <idioma>es</idioma>
      </int:getCambiosContadorDeContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 3. getContador

Get full details of a meter by its serial number.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `serialNumber` | `string` | Yes | Meter serial number |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `resultadoContadorDTO` | Meter data and result |

#### `resultadoContadorDTO`

| Field | Type | Description |
|-------|------|-------------|
| `contador` | `contadorDTO` | Meter details |
| `resultado` | `resultadoDTO` | Operation result |

#### `contadorDTO`

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
| `idSegundaEsfera` | `int` | Second dial ID |
| `marca` | `string` | Brand |
| `modelo` | `string` | Model |
| `numeroSerie` | `string` | Serial number |
| `propiedadCliente` | `string` | Customer-owned indicator |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericacontadores.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:getContador>
         <serialNumber>10005237</serialNumber>
      </int:getContador>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 4. getPuntoServicioPorContador

Get service point information for one or more meter serial numbers. Returns the full service point data including address, contracts, meters, readings, and orders.

**Status:** **Implemented** in `cea.js` as `getPuntoServicioPorContador(listaNumSerieContador, usuario, idioma, opciones)`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `listaNumSerieContador` | `string[]` | Yes | Array of meter serial numbers |
| `usuario` | `string` | Yes | User identifier |
| `idioma` | `string` | Yes | Language code (e.g., `es`) |
| `opciones` | `string` | Yes | Options string |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `getPuntoServicioPorContadorReturn` | `ListaPuntosServicioContadorDTO` | Service points and result |

#### `ListaPuntosServicioContadorDTO`

| Field | Type | Description |
|-------|------|-------------|
| `puntosServicioContadorDTO` | `ArrayOfPuntosServicioContadorDTO` | Service points per meter |
| `resultado` | `ResultadoDTO` | Operation result (from Contracts namespace) |

#### `PuntosServicioContadorDTO`

| Field | Type | Description |
|-------|------|-------------|
| `numSerieContador` | `string` | Meter serial number |
| `puntoServicioDTO` | `ArrayOfPuntoServicioDTO` | Service points for this meter |
| `codigoResultado` | `string` | Result code for this meter |

#### `PuntoServicioDTO`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | **Service point ID** (used as `idPtoServicio` in `crearOrdenTrabajo`) |
| `direccionPS` | `DireccionPSDTO` | Service point address |
| `descEstructuraTecnica` | `string` | Technical structure description |
| `codigoExplotacion` | `string` | Exploitation code |
| `descExplotacion` | `string` | Exploitation description |
| `codigoZona` | `string` | Zone code |
| `codigoLibreta` | `short` | Booklet code |
| `descEmplazamiento` | `string` | Emplacement description |
| `codigoRecorrido` | `long` | Route code |
| `tipoSuministro` | `string` | Supply type |
| `obsAlLector` | `string` | Reader observations |
| `idEstadoPuntoServicio` | `short` | Service point status ID |
| `estadoPuntoServicio` | `string` | Service point status |
| `formaDeSuministro` | `string` | Supply form |
| `servicio` | `int` | Service ID |
| `filaBateria` | `short` | Battery row |
| `columnaBateria` | `short` | Battery column |
| `contadorComunitario` | `string` | Community meter |
| `cortePosible` | `string` | Cut possible |
| `procesoContratacion` | `int` | Contracting process |
| `llaves` | `short` | Keys |
| `tipoPuntoservicio` | `string` | Service point type |
| `desHabitado` | `string` | Uninhabited indicator |
| `numBocasIncendio` | `short` | Fire hydrant count |
| `numMangueras` | `short` | Hose count |
| `fechaCorte` | `string` | Cut date |
| `calibreAlternativo` | `short` | Alternative caliber |
| `motivoBaja` | `string` | Deactivation reason |
| `licencia2AOcupacion` | `string` | Occupancy license |
| `fechaLic2AOcupacion` | `string` | Occupancy license date |
| `refCatastral` | `string` | Cadastral reference |
| `snCortadoPorDeuda` | `string` | Cut for debt |
| `snCortadoPorVencimientoContrato` | `string` | Cut for contract expiry |
| `snCortadoPeticionManual` | `string` | Cut by manual request |
| `fechaCreacion` | `string` | Creation date |
| `idSector` | `short` | Sector ID |
| `descSector` | `string` | Sector description |
| `idSubSector` | `int` | Sub-sector ID |
| `descSubSector` | `string` | Sub-sector description |
| `puntoEstrategico` | `string` | Strategic point |
| `observaciones` | `ArrayOfObservacionesDTO` | Observations |
| `contratos` | `ArrayOfContratoAcometidaDTO` | Contracts at this point |
| `contadores` | `ArrayOfContadoresDTO` | Meters at this point |
| `lecturas` | `ArrayOfLecturasDTO` | Readings at this point |
| `ordenes` | `ArrayOfOrdenesDTO` | Orders at this point |

#### `DireccionPSDTO`

| Field | Type | Description |
|-------|------|-------------|
| `dirTexto` | `string` | Full address text |
| `idCalle` | `int` | Street ID |
| `finca` | `int` | Building number |
| `puerta` | `string` | Door |
| `planta` | `string` | Floor |
| `escalera` | `string` | Stairway |
| `bloque` | `string` | Block |
| `complementoFinca` | `string` | Building complement |
| `poblacion` | `string` | City/town |
| `codigoPostal` | `string` | Postal code |
| `coordenadaX` | `string` | X coordinate |
| `coordenadaY` | `string` | Y coordinate |

#### `ContratoAcometidaDTO`

| Field | Type | Description |
|-------|------|-------------|
| `cnttnum` | `int` | Contract number |
| `nombre` | `string` | Contract holder name |
| `dirtexto` | `string` | Address text |
| `cnttestadoId` | `short` | Contract status ID |
| `cnttestado` | `string` | Contract status |
| `fechaAltaPoliza` | `string` | Policy start date |
| `fechaBajaPoliza` | `string` | Policy end date |
| `idUso` | `int` | Usage ID |
| `descUso` | `string` | Usage description |
| `idPeriodicidad` | `int` | Periodicity ID |
| `descPeriodicidad` | `string` | Periodicity description |

#### `ContadoresDTO`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | Meter ID |
| `idMarca` | `short` | Brand ID |
| `idModelo` | `short` | Model ID |
| `marca` | `string` | Brand name |
| `modelo` | `string` | Model name |
| `calibre` | `short` | Caliber |
| `numeroSerie` | `string` | Serial number |
| `fechaInstalacionContador` | `string` | Installation date |
| `fechaBajaContador` | `string` | Removal date |
| `contEstadoId` | `short` | Status ID |
| `estadoContador` | `string` | Status description |
| `annoFabricacion` | `short` | Manufacturing year |
| `propiedadDeCliente` | `string` | Customer-owned |
| `tienePrecintoSuspension` | `string` | Has suspension seal |
| `fechaPrecintoSuspension` | `string` | Suspension seal date |
| `fechaDesprecintoSuspension` | `string` | Unseal date |
| `tienePrecintoSeguridad` | `string` | Has security seal |
| `snTelelectura` | `string` | Remote reading |
| `moduloComunicacion` | `string` | Communication module |

#### `LecturasDTO`

| Field | Type | Description |
|-------|------|-------------|
| `periodo` | `string` | Period |
| `periodicidad` | `string` | Periodicity |
| `contrato` | `int` | Contract number |
| `esfera` | `short` | Dial |
| `fechaLectura` | `string` | Reading date |
| `lectura` | `int` | Reading value |
| `consumo` | `int` | Consumption |
| `origen` | `string` | Origin |
| `observacion` | `string` | Observation |
| `estado` | `string` | Status |
| `dias` | `int` | Days |
| `ajusteEstimado` | `int` | Estimated adjustment |
| `ajuste` | `int` | Adjustment |
| `saldoBolsa` | `int` | Bag balance |
| `otrosAjustes` | `int` | Other adjustments |
| `snCartel` | `string` | Sign indicator |
| `metodoEst` | `string` | Estimation method |

#### `OrdenesDTO`

| Field | Type | Description |
|-------|------|-------------|
| `fecha` | `string` | Date |
| `estado` | `string` | Status |
| `tipo` | `string` | Type |
| `motivoCreacion` | `string` | Creation reason |

#### `ObservacionesDTO`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `int` | Observation ID |
| `fecha` | `string` | Date |
| `textObservacion` | `string` | Observation text |
| `usuario` | `string` | User |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericacontadores.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:getPuntoServicioPorContador>
         <listaNumSerieContador>10005237</listaNumSerieContador>
         <usuario>AGORA</usuario>
         <idioma>es</idioma>
         <opciones></opciones>
      </int:getPuntoServicioPorContador>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## Shared Complex Types (from Contracts Namespace)

These types are imported from `http://InterfazGenericaContratacion.DTOs.occamWS.ejb.negocio.occam.agbar.com`:

### ResultadoDTO

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |
