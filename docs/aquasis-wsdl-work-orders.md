# Aquasis Work Orders WSDL - InterfazGenericaOrdenesServicioWS

## Service Information

| Property | Value |
|----------|-------|
| **Service Name** | InterfazGenericaOrdenesServicioWSBeanSEIImplService |
| **Port** | InterfazGenericaOrdenesServicioWSBeanSEIImplPort |
| **Endpoint URL** | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaOrdenesServicioWS` |
| **Target Namespace** | `http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/` |
| **Fault Namespace** | `http://www.aqualogy.net/xf/ws` |
| **Binding Style** | Document/Literal |
| **Transport** | SOAP over HTTP |

## Operations Summary

| # | Operation | SOAPAction | Description | Status |
|---|-----------|------------|-------------|--------|
| 1 | `crearOrdenExterna` | `crearOrdenExterna` | Create an external work order | Not implemented |
| 2 | `crearOrdenTrabajo` | `crearOrdenTrabajo` | Create a standard work order | **Implemented** |
| 3 | `getCalibres` | `getCalibres` | Get meter caliber catalog | Not implemented |
| 4 | `getDocumentoOrdenTrabajo` | `getDocumentoOrdenTrabajo` | Get work order as PDF document | Not implemented |
| 5 | `getMarcasYModelos` | `getMarcasYModelos` | Get meter brands and models catalog | Not implemented |
| 6 | `informarVisita` | `informarVisita` | Report a visit to a work order | **Implemented** |
| 7 | `multipleRefreshData` | `multipleRefreshData` | Query multiple work orders at once | Not implemented |
| 8 | `refreshData` | `refreshData` | Query a single work order's full details | Not implemented |
| 9 | `resolveOT` | `resolveOT` | Resolve/close a work order | **Implemented** |

---

## Operations Detail

### 1. crearOrdenExterna

Create an external work order (from an external SGO system). Returns an order ID and creation status.

**Fault:** `AquaCISWSAplicationException`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `codIdioma` | `string` | No | Language code |
| `ordenTrabajo` | `OrdenTrabajoExternaDTO` | No | External work order data |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `peticionOrdenExternaDTO` | Result with order ID |

#### `peticionOrdenExternaDTO` (extends `genericoDTO`)

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `resultadoDTO` | Inherited - operation result |
| `idOrden` | `int` | Created order ID |
| `ordenCreada` | `boolean` | Whether the order was created |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:crearOrdenExterna>
         <codIdioma>es</codIdioma>
         <ordenTrabajo>
            <datos>
               <explotacionSGO>01</explotacionSGO>
               <idExplotacion>1</idExplotacion>
               <fechaCreacion>2026-02-11T00:00:00</fechaCreacion>
               <estado>1</estado>
               <idPtoServicio>632744</idPtoServicio>
               <numContrato>442761</numContrato>
               <numContador>10005237</numContador>
               <idSGO>EXT-001</idSGO>
               <tipoOrden>1</tipoOrden>
               <motivoNoResolucion></motivoNoResolucion>
               <telelectura>false</telelectura>
            </datos>
            <direccion>
               <idPoblacion>1</idPoblacion>
               <idLocalidad>1</idLocalidad>
               <idCalle>1</idCalle>
               <numero>10</numero>
               <textoDireccion>Calle ejemplo 10</textoDireccion>
            </direccion>
         </ordenTrabajo>
      </int:crearOrdenExterna>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 2. crearOrdenTrabajo

Create a standard work order in Aquasis. Returns the order code (e.g., `O4514415`).

**Fault:** `AquaCISWSAplicationException`

**Status:** **Implemented** in `cea.js` as `crearOrdenTrabajo(data)`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idioma` | `string` | No | Language code (e.g., `es`) |
| `ordenTrabajo` | `OrdenTrabajoDTO` | No | Work order data |
| `enCurso` | `boolean` | Yes | Whether order is in progress |
| `visitaOrden` | `VisitaOrdenDTO` | No | Visit data |
| `ordenRelacionada` | `OrdenRelacionadaDTO` | No | Related order data |
| `idGOT` | `string` | No | GOT identifier |

#### `OrdenTrabajoDTO`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tipoOrden` | `short` | Yes | Order type ID |
| `motivoOrden` | `short` | Yes | Order reason ID |
| `fechaCreacionOrden` | `dateTime` | Yes | Creation date |
| `numContrato` | `int` | Yes | Contract number |
| `idPtoServicio` | `int` | Yes | **Service point ID (REQUIRED - NullPointerException if empty)** |
| `fechaEstimdaFin` | `dateTime` | Yes | Estimated end date |
| `observaciones` | `string` | No | Observations/notes |
| `codigoObsCambCont` | `string` | No | Meter change observation code |
| `codigoReparacion` | `string` | No | Repair code |
| `anyoExpediente` | `short` | Yes | File year |
| `numeroExpediente` | `string` | No | File number |
| `instalaValvulaPaso` | `boolean` | Yes | Install stop valve |
| `geolocalization` | `Geolocalization` | No | GPS coordinates |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `string` | Order code (e.g., `O4514415`) |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:crearOrdenTrabajo>
         <idioma>es</idioma>
         <ordenTrabajo>
            <tipoOrden>1</tipoOrden>
            <motivoOrden>100</motivoOrden>
            <fechaCreacionOrden>2026-02-11T12:00:00</fechaCreacionOrden>
            <numContrato>442761</numContrato>
            <idPtoServicio>632744</idPtoServicio>
            <fechaEstimdaFin>2026-02-18T12:00:00</fechaEstimdaFin>
            <observaciones>Test order</observaciones>
            <codigoObsCambCont></codigoObsCambCont>
            <codigoReparacion></codigoReparacion>
            <anyoExpediente>2026</anyoExpediente>
            <numeroExpediente></numeroExpediente>
            <instalaValvulaPaso>0</instalaValvulaPaso>
         </ordenTrabajo>
         <enCurso>0</enCurso>
      </int:crearOrdenTrabajo>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 3. getCalibres

Get the catalog of meter calibers (diameters). Returns a list of `CalibreDTO` objects.

**Fault:** `AquaCISWSAplicationException`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idioma` | `string` | No | Language code |
| `fechaDesde` | `dateTime` | Yes | Filter: only calibers modified since this date |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return[]` | `CalibreDTO[]` | Array of caliber records |

#### `CalibreDTO`

| Field | Type | Description |
|-------|------|-------------|
| `calibmm` | `int` | Caliber in millimeters |
| `calibequpul` | `string` | Caliber equivalent in inches |
| `calibhstusu` | `string` | Last modification user |
| `calibhsthora` | `dateTime` | Last modification timestamp |
| `calibbaja` | `boolean` | Whether the caliber is deactivated |
| `calibcodspde` | `string` | SPDE code |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:getCalibres>
         <idioma>es</idioma>
         <fechaDesde>2020-01-01T00:00:00</fechaDesde>
      </int:getCalibres>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 4. getDocumentoOrdenTrabajo

Get one or more work orders as a PDF document (base64 encoded). Can include custom observations per order.

**Fault:** `ServiceException`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ordenes` | `arrayOfOrdenObservacionesDTO` | No | Orders to include in the PDF |

#### `arrayOfOrdenObservacionesDTO`

| Field | Type | Description |
|-------|------|-------------|
| `orden[]` | `ordenObservacionesDTO[]` | Array of order+observations |

#### `ordenObservacionesDTO`

| Field | Type | Description |
|-------|------|-------------|
| `codOrden` | `string` | Order code (e.g., `O4514415`) |
| `observaciones` | `arrayOfObservacionesDTO` | Observations to print |

#### `arrayOfObservacionesDTO`

| Field | Type | Description |
|-------|------|-------------|
| `observacion[]` | `string[]` | Array of observation strings |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `DocumentoImpresionPendienteDTO` | PDF document and result |

#### `DocumentoImpresionPendienteDTO`

| Field | Type | Description |
|-------|------|-------------|
| `resultado` | `ResultadoDTO` | Operation result (codigoError, descripcionError) |
| `pdf` | `base64Binary` | PDF document content |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:getDocumentoOrdenTrabajo>
         <ordenes>
            <orden>
               <codOrden>O4514415</codOrden>
               <observaciones>
                  <observacion>Custom note for this order</observacion>
               </observaciones>
            </orden>
         </ordenes>
      </int:getDocumentoOrdenTrabajo>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 5. getMarcasYModelos

Get the catalog of meter brands and models. Returns a list of brands, each containing their models.

**Fault:** `AquaCISWSAplicationException`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `idioma` | `string` | No | Language code |
| `fechaDesde` | `dateTime` | Yes | Filter: only brands/models modified since this date |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return[]` | `MarcaDTO[]` | Array of brand records |

#### `MarcaDTO`

| Field | Type | Description |
|-------|------|-------------|
| `marcid` | `int` | Brand ID |
| `marcdesc` | `string` | Brand description |
| `marchstusu` | `string` | Last modification user |
| `marchsthora` | `dateTime` | Last modification timestamp |
| `marcbaja` | `boolean` | Whether the brand is deactivated |
| `codigosSPDE[]` | `CodigoSPDEDTO[]` | SPDE codes |
| `modelos[]` | `ModeloDTO[]` | Array of models for this brand |

#### `ModeloDTO`

| Field | Type | Description |
|-------|------|-------------|
| `modbaja` | `boolean` | Whether model is deactivated |
| `modid` | `int` | Model ID |
| `moddesc` | `string` | Model description |
| `modtipesf` | `string` | Sphere type |
| `moddigit` | `int` | Number of digits |
| `modtcnid` | `int` | Technology ID |
| `modtcndesc` | `string` | Technology description |
| `modhstusu` | `string` | Last modification user |
| `modhsthora` | `dateTime` | Last modification timestamp |
| `codigosSPDE[]` | `CodigoSPDEDTO[]` | SPDE codes |

#### `CodigoSPDEDTO`

| Field | Type | Description |
|-------|------|-------------|
| `spdecodigo` | `string` | SPDE code |
| `spdedesde` | `short` | Valid from (year) |
| `spdehasta` | `short` | Valid until (year) |
| `spdeactivo` | `boolean` | Whether active |
| `spdehstusu` | `string` | Last modification user |
| `spdehsthora` | `dateTime` | Last modification timestamp |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:getMarcasYModelos>
         <idioma>es</idioma>
         <fechaDesde>2020-01-01T00:00:00</fechaDesde>
      </int:getMarcasYModelos>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 6. informarVisita

Report a visit to a work order. Returns the visit ID.

**Fault:** `ServiceException`

**Status:** **Implemented** in `cea.js` as `informarVisita(data)`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `string` | No | Visit ID (for updates) |
| `codOrden` | `string` | No | Order code (e.g., `O4514415`) |
| `fechaVisita` | `dateTime` | Yes | Visit date |
| `resultado` | `boolean` | Yes | Visit result (true=successful) |
| `idOperario` | `string` | Yes | Operator ID |
| `nombreOperario` | `string` | Yes | Operator name |
| `cifContratista` | `string` | Yes | Contractor tax ID |
| `nombreContratista` | `string` | Yes | Contractor name |
| `codIncidencia` | `short` | Yes | Incident code |
| `descIncidencia` | `string` | Yes | Incident description |
| `observaciones` | `string` | No | Observations |
| `aResponsable` | `ContactoVisitaDTO` | No | Responsible contact |

#### `ContactoVisitaDTO`

| Field | Type | Description |
|-------|------|-------------|
| `codVinculacion` | `string` | Link code |
| `idDocFirma` | `string` | Signature document ID |
| `personaVisita` | `PersonaVisitaDTO` | Person present at visit |

#### `PersonaVisitaDTO`

| Field | Type | Description |
|-------|------|-------------|
| `nombre` | `string` | First name |
| `apellido1` | `string` | First surname |
| `apellido2` | `string` | Second surname |
| `telefono` | `string` | Phone number |
| `nif` | `string` | Tax ID (NIF) |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `int` | Visit ID |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:informarVisita>
         <id></id>
         <codOrden>O4514415</codOrden>
         <fechaVisita>2026-02-11T10:00:00</fechaVisita>
         <resultado>true</resultado>
         <idOperario>OP001</idOperario>
         <nombreOperario>Juan Perez</nombreOperario>
         <cifContratista>ABC123</cifContratista>
         <nombreContratista>Contratista SA</nombreContratista>
         <codIncidencia>0</codIncidencia>
         <descIncidencia>Sin incidencia</descIncidencia>
         <observaciones>Visita exitosa</observaciones>
         <aResponsable>
            <codVinculacion></codVinculacion>
            <idDocFirma></idDocFirma>
            <personaVisita>
               <nombre>Maria</nombre>
               <apellido1>Garcia</apellido1>
               <apellido2>Lopez</apellido2>
               <telefono>4421234567</telefono>
               <nif>GALO800101ABC</nif>
            </personaVisita>
         </aResponsable>
      </int:informarVisita>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 7. multipleRefreshData

Query multiple work orders at once. Returns an array of `OTMass` objects, each containing the full order data or an error.

**Fault:** `ServiceException`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `otRequest[]` | `OTRequest[]` | No | Array of order query requests |

#### `OTRequest`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `operationalSiteID` | `string` | No | Operational site ID |
| `installationID` | `string` | No | Installation ID |
| `systemOrigin` | `string` | No | System of origin |
| `otClassID` | `int` | Yes | Order class ID |
| `otOriginID` | `string` | No | Order origin ID (the order code, e.g., `O4514415`) |
| `otGotID` | `string` | No | GOT ID |
| `language` | `string` | No | Language code |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return[]` | `OTMass[]` | Array of order results |

#### `OTMass`

| Field | Type | Description |
|-------|------|-------------|
| `ot` | `OT` | Full order data (null if error) |
| `error` | `error` | Error details (null if success) |

See [OT Complex Type](#ot) for the full order structure.

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:multipleRefreshData>
         <otRequest>
            <otClassID>0</otClassID>
            <otOriginID>O4514415</otOriginID>
            <language>es</language>
         </otRequest>
         <otRequest>
            <otClassID>0</otClassID>
            <otOriginID>O4514416</otOriginID>
            <language>es</language>
         </otRequest>
      </int:multipleRefreshData>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 8. refreshData

Query a single work order's full details. Returns the complete `OT` object with order data, client data, elements, readings, unpaid bills, debt, and comments.

**Fault:** `ServiceException`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `otRequest` | `OTRequest` | No | Order query request |

See `OTRequest` fields in [multipleRefreshData](#7-multiplerefreshdata).

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `OT` | Full order data |

See [OT Complex Type](#ot) for the full order structure.

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:refreshData>
         <otRequest>
            <otClassID>0</otClassID>
            <otOriginID>O4514415</otOriginID>
            <language>es</language>
         </otRequest>
      </int:refreshData>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### 9. resolveOT

Resolve/close a work order. Includes resolution data, meter elements installed/retired, equipment changes, and visit comments.

**Fault:** `ServiceException`

**Status:** **Implemented** in `cea.js` as `resolveOT(data)`

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `otResolution` | `OTResolution` | Yes | Resolution data |

#### `OTResolution`

| Field | Type | Description |
|-------|------|-------------|
| `otResolutionData` | `OTResolutionData` | Resolution metadata |
| `otResolutionElements[]` | `OTResolutionElement[]` | Meter elements installed/retired |
| `otResolutionEquipments[]` | `OTResolutionEquipment[]` | Equipment changes |
| `vistitComments[]` | `VisitComment[]` | Visit comments |

#### `OTResolutionData`

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
| `transmitterInstalled` | `boolean` | Whether transmitter was installed |
| `language` | `string` | Language |
| `suspensionLevel` | `short` | Suspension level |
| `geolocalization` | `Geolocalization` | GPS coordinates |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `return` | `boolean` | Whether resolution was successful |

#### Example SOAP Request

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:resolveOT>
         <otResolution>
            <otResolutionData>
               <operationalSiteID>01</operationalSiteID>
               <installationID></installationID>
               <systemOrigin></systemOrigin>
               <otClass>0</otClass>
               <otOrigin>O4514415</otOrigin>
               <endDateOt>2026-02-11T16:00:00</endDateOt>
               <endLastTaskOt>2026-02-11T16:00:00</endLastTaskOt>
               <finalSolution>01</finalSolution>
               <nonExecutionMotive></nonExecutionMotive>
               <solutionDescription>Order resolved</solutionDescription>
               <executorIdentifier>OP001</executorIdentifier>
               <executorName>Juan Perez</executorName>
               <companyExecutorIdentifier></companyExecutorIdentifier>
               <companyExecutorName></companyExecutorName>
               <transmitterInstalled>false</transmitterInstalled>
               <language>es</language>
               <suspensionLevel>0</suspensionLevel>
            </otResolutionData>
            <otResolutionElements>
               <installedOrRetired>true</installedOrRetired>
               <meterDial>5</meterDial>
               <serialNumber>10005237</serialNumber>
               <key>0</key>
               <batteryRow>0</batteryRow>
               <batteryColumn>0</batteryColumn>
               <dateReading>2026-02-11T16:00:00</dateReading>
               <readingRegister>1234.0</readingRegister>
               <valveRetention>false</valveRetention>
            </otResolutionElements>
         </otResolution>
      </int:resolveOT>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## Complex Types Reference

### OT

The main work order object returned by `refreshData` and `multipleRefreshData`.

| Field | Type | Description |
|-------|------|-------------|
| `otData` | `OTData` | Order metadata and address |
| `clientData` | `ClientData` | Client contact info |
| `otElements[]` | `OTElement[]` | Meter elements |
| `otReadings[]` | `OTReading[]` | Recent readings |
| `otCustomerUnpaidBills[]` | `OTCustUnpaidBill[]` | Unpaid bills |
| `otCustomerDebt` | `OTCustomerDebt` | Debt summary |
| `otComments[]` | `OTComment[]` | Order comments |

### OTData

| Field | Type | Description |
|-------|------|-------------|
| `operationalSiteID` | `string` | Operational site ID |
| `installationID` | `string` | Installation ID |
| `systemOrigin` | `string` | System of origin |
| `otClassID` | `int` | Order class ID |
| `otOriginID` | `string` | Order code (e.g., `O4514415`) |
| `createDate` | `dateTime` | Creation date |
| `requestDate` | `dateTime` | Request date |
| `otTypeID` | `string` | Order type ID |
| `location` | `string` | Location |
| `streetType` | `string` | Street type |
| `streetCode` | `string` | Street code |
| `streetName` | `string` | Street name |
| `streetNumber` | `int` | Street number |
| `blockHouse` | `string` | Block |
| `ladder` | `string` | Stairway |
| `floor` | `string` | Floor |
| `door` | `string` | Door |
| `postalCode` | `string` | Postal code |
| `addressComplement` | `string` | Address complement |
| `originMotiveDescription` | `string` | Origin motive description |
| `customerContract` | `string` | Customer contract |
| `element` | `string` | Element |
| `classElement` | `string` | Element class |
| `elementComment` | `string` | Element comment |
| `key` | `int` | Key |
| `emplacement` | `string` | Emplacement |
| `geographicalCriterion` | `string` | Geographical criterion |
| `hydraulicCriterion` | `string` | Hydraulic criterion |
| `readingArea` | `string` | Reading area |
| `remoteMeterReading` | `boolean` | Remote meter reading |
| `originalLotNumber` | `string` | Original lot number |
| `completeAddress` | `string` | Full formatted address |
| `duplicate` | `string` | Duplicate indicator |
| `gate` | `string` | Gate |
| `km` | `decimal` | Kilometer |
| `supplyPointId` | `int` | Supply point ID |
| `district` | `string` | District |
| `motiveCC` | `string` | CC motive |
| `systemOriginCreationUser` | `string` | Creation user |
| `geolocalization` | `Geolocalization` | GPS coordinates |
| `suspensionLevel` | `string` | Suspension level |
| `debtType` | `string` | Debt type |
| `replacementInvoice` | `string` | Replacement invoice |
| `remoteMeterReadingProposal` | `boolean` | Remote reading proposal |
| `typeRemoteMeterProposal` | `short` | Remote meter proposal type |
| `typeRemoteMeter` | `short` | Remote meter type |

### ClientData

| Field | Type | Description |
|-------|------|-------------|
| `customerComments` | `string` | Customer comments |
| `clientNotify` | `boolean` | Whether to notify client |
| `customerType` | `string` | Customer type |
| `customerCiteFrom` | `dateTime` | Appointment from |
| `customerCiteUntil` | `dateTime` | Appointment until |
| `contactName` | `string` | Contact name |
| `contactAddress` | `string` | Contact address |
| `contactTelephone1` | `long` | Phone 1 |
| `contactTelephone2` | `long` | Phone 2 |

### OTElement

| Field | Type | Description |
|-------|------|-------------|
| `emplacement` | `string` | Emplacement |
| `manufacturedYear` | `int` | Year manufactured |
| `key` | `int` | Key |
| `classElement` | `string` | Element class |
| `classElementDescription` | `string` | Element class description |
| `originalElementIdentifier` | `string` | Original element ID |
| `originalElementDescription` | `string` | Original element description |
| `meterDial` | `int` | Meter dial digits |
| `meterBrandID` | `string` | Meter brand ID |
| `meterModel` | `string` | Meter model |
| `meterGauge` | `string` | Meter gauge |
| `serialNumber` | `string` | Serial number |
| `communicationModule` | `string` | Communication module |
| `installationDate` | `dateTime` | Installation date |
| `batteryRow` | `int` | Battery row |
| `batteryColumn` | `int` | Battery column |
| `supplyConnectionID` | `string` | Supply connection ID |
| `supplyConnectionMaterialCode` | `string` | Material code |
| `supplyConnectionMaterialDescription` | `string` | Material description |
| `supplyConnectionLength` | `decimal` | Connection length |
| `valveRetention` | `boolean` | Valve retention |
| `remoteMeterReadingInstalled` | `boolean` | Remote reading installed |
| `estimatedMaxConsumption` | `decimal` | Estimated max consumption |
| `estimatedMinConsumption` | `decimal` | Estimated min consumption |
| `equipment` | `OTEquipment` | Equipment details |
| `supplyType` | `short` | Supply type |
| `isIntegrated` | `boolean` | Whether integrated |

### OTReading

| Field | Type | Description |
|-------|------|-------------|
| `serialNumber` | `string` | Meter serial number |
| `dial` | `int` | Dial digits |
| `yearPeriod` | `string` | Year/period |
| `readingDate` | `dateTime` | Reading date |
| `readingRegister` | `decimal` | Reading value |
| `classReading` | `string` | Reading class |
| `consumed` | `decimal` | Consumption |
| `observationsReading` | `string` | Observations |
| `isBilled` | `boolean` | Whether billed |

### OTCustUnpaidBill

| Field | Type | Description |
|-------|------|-------------|
| `reclaimed` | `boolean` | Whether reclaimed |
| `statusBill` | `string` | Bill status |
| `yearPeriod` | `string` | Year/period |
| `billImport` | `decimal` | Bill amount |

### OTCustomerDebt

| Field | Type | Description |
|-------|------|-------------|
| `reclaimedBills` | `int` | Number of reclaimed bills |
| `initialYearPeriodReclaimed` | `string` | First reclaimed period |
| `finalYearPeriodReclaimed` | `string` | Last reclaimed period |
| `customerTotalDebt` | `decimal` | Total debt amount |
| `amountReplacementSupply` | `decimal` | Replacement supply amount |
| `amountGivenToAccount` | `decimal` | Amount given to account |

### OTComment

| Field | Type | Description |
|-------|------|-------------|
| `dateTimeComment` | `string` | Comment date/time |
| `textComment` | `string` | Comment text |
| `idComment` | `string` | Comment ID |
| `creationUser` | `string` | Creation user |

### OTResolutionElement

| Field | Type | Description |
|-------|------|-------------|
| `installedOrRetired` | `boolean` | true=installed, false=retired |
| `meterDial` | `int` | Meter dial digits |
| `meterBrandID` | `string` | Brand ID |
| `meterModel` | `string` | Model |
| `meterGauge` | `string` | Gauge |
| `serialNumber` | `string` | Serial number |
| `communicationModule` | `string` | Communication module |
| `manufacturedYear` | `int` | Year manufactured |
| `installationDate` | `dateTime` | Installation date |
| `emplacement` | `string` | Emplacement |
| `key` | `int` | Key |
| `batteryRow` | `int` | Battery row |
| `batteryColumn` | `int` | Battery column |
| `dateReading` | `dateTime` | Reading date |
| `readingRegister` | `decimal` | Reading value |
| `executorIdentifier` | `string` | Executor ID |
| `executorName` | `string` | Executor name |
| `valveRetention` | `boolean` | Valve retention |
| `meterInPlace` | `string` | Meter in place |
| `companyExecutorIdentifier` | `string` | Company executor ID |
| `companyExecutorName` | `string` | Company executor name |
| `isSPDE` | `boolean` | Is SPDE |
| `isIntegrated` | `boolean` | Is integrated |

### OTResolutionEquipment

| Field | Type | Description |
|-------|------|-------------|
| `installedOrRetired` | `boolean` | true=installed, false=retired |
| `equipmentType` | `short` | Equipment type |
| `initialIndexReading` | `decimal` | Initial reading |
| `dateInitialIndexReading` | `dateTime` | Initial reading date |
| `equipmentVHF` | `EquipmentVHF` | VHF equipment details |
| `equipmentIMETER` | `EquipmentIMETER` | iMeter details |
| `equipmentBusVHF` | `EquipmentBusVHF` | BusVHF details |
| `equipmentLoRaWAN` | `EquipmentLoRaWAN` | LoRaWAN details |
| `equipmentBusNBIOT` | `EquipmentBusNBIOT` | BusNBIOT details |

### OTEquipment

| Field | Type | Description |
|-------|------|-------------|
| `typeEquipment` | `int` | Equipment type |
| `installationDate` | `dateTime` | Installation date |
| `oTVHFTechnology` | `OTVHFTechnology` | VHF technology |
| `oTIMeterTechnology` | `OTIMeterTechnology` | iMeter technology |
| `oTBusVHFTechnology` | `OTBusVHFTechnology` | BusVHF technology |
| `oTLoRaWANTechnology` | `OTLoRaWANTechnology` | LoRaWAN technology |
| `oTBusNBIOTTechnology` | `OTBusNBIOTTechnology` | BusNBIOT technology |

### Geolocalization

| Field | Type | Description |
|-------|------|-------------|
| `longitude` | `string` | Longitude |
| `latitude` | `string` | Latitude |
| `coordinatesType` | `short` | Coordinates type |
| `codificationType` | `short` | Codification type |
| `captureDate` | `dateTime` | Capture date |

### VisitComment

| Field | Type | Description |
|-------|------|-------------|
| `visitOrComment` | `boolean` | true=visit, false=comment |
| `dateTimeVisitComment` | `dateTime` | Date/time |
| `failedVisit` | `boolean` | Whether visit failed |
| `observationType` | `string` | Observation type |
| `textComment` | `string` | Comment text |
| `executorIdentifier` | `string` | Executor ID |
| `executorName` | `string` | Executor name |
| `companyExecutorIdentifier` | `string` | Company executor ID |
| `companyExecutorName` | `string` | Company executor name |

### resultadoDTO (lowercase)

Used by `genericoDTO` / `peticionOrdenExternaDTO` (inherited `resultado` field).

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `int` | Error code (0 = success) |
| `descripcionError` | `string` | Error description |

### ResultadoDTO (PascalCase)

Used by `DocumentoImpresionPendienteDTO` (the `resultado` field inside `getDocumentoOrdenTrabajo` response). Note the `codigoError` type difference from the lowercase variant.

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `string` | Error code |
| `descripcionError` | `string` | Error description |

### OrdenTrabajoExternaDTO

Input DTO for `crearOrdenExterna`. Contains order data, address, resolution elements, equipment, and visits.

| Field | Type | Description |
|-------|------|-------------|
| `datos` | `OrdenExternaDTO` | External order data |
| `direccion` | `DireccionOrdenExternaDTO` | Order address |
| `resolucion[]` | `OTResolutionElement[]` | Resolution elements |
| `equipo[]` | `OTResolutionEquipment[]` | Equipment changes |
| `visita[]` | `VisitaOrdenExternaDTO[]` | Visit records |

### OrdenExternaDTO

Core data fields for an external work order.

| Field | Type | Description |
|-------|------|-------------|
| `explotacionSGO` | `string` | SGO exploitation code |
| `idExplotacion` | `short` | Exploitation ID |
| `fechaCreacion` | `dateTime` | Creation date |
| `estado` | `short` | Order status |
| `idPtoServicio` | `int` | Service point ID |
| `numContrato` | `int` | Contract number |
| `numContador` | `string` | Meter number |
| `idSGO` | `string` | SGO identifier |
| `tipoOrden` | `short` | Order type |
| `motivoNoResolucion` | `string` | Non-resolution motive |
| `telelectura` | `boolean` | Remote reading |
| `suspensionLevel` | `short` | Suspension level |
| `geolocalization` | `Geolocalization` | GPS coordinates |
| `motivoCambioContador` | `string` | Meter change motive |

### DireccionOrdenExternaDTO

Address data for an external work order.

| Field | Type | Description |
|-------|------|-------------|
| `idPoblacion` | `int` | Town/city ID |
| `idLocalidad` | `int` | Locality ID |
| `idCalle` | `int` | Street ID |
| `numero` | `int` | Street number |
| `textoDireccion` | `string` | Address text |

### VisitaOrdenExternaDTO

Visit record for an external work order.

| Field | Type | Description |
|-------|------|-------------|
| `fechaVisita` | `dateTime` | Visit date |
| `nifOperario` | `string` | Operator tax ID |
| `nombreOperario` | `string` | Operator name |
| `nombreContratista` | `string` | Contractor name |
| `codIncidencia` | `short` | Incident code |
| `observaciones` | `string` | Observations |
| `contactoVisita` | `ContactoVisitaDTO` | Visit contact |

### VisitaOrdenDTO

Visit data used in `crearOrdenTrabajo`.

| Field | Type | Description |
|-------|------|-------------|
| `fechaCita` | `dateTime` | Appointment date |
| `idFranjaHoraria` | `string` | Time slot ID |
| `fechaVisita` | `dateTime` | Visit date |
| `idOperario` | `string` | Operator ID |
| `nombreOperario` | `string` | Operator name |
| `cifContratista` | `string` | Contractor tax ID |
| `nombreContratista` | `string` | Contractor name |
| `idIncidenciaVisita` | `short` | Visit incident ID |
| `descIncidencia` | `string` | Incident description |
| `visitaRealizada` | `boolean` | Whether visit was performed |
| `obsIncidenciaOtros` | `string` | Other incident observations |
| `distrito` | `string` | District |
| `contactoVisitaOrden` | `ContactoVisitaDTO` | Visit contact |

### OrdenRelacionadaDTO

Related order data used in `crearOrdenTrabajo`.

| Field | Type | Description |
|-------|------|-------------|
| `tipoRelacionOrden` | `short` | Relation type |
| `codigoOrdenRelacionada` | `string` | Related order code |

### EquipmentVHF

VHF equipment details for `OTResolutionEquipment`.

| Field | Type | Description |
|-------|------|-------------|
| `vhfPreassembled` | `boolean` | Whether preassembled |
| `vhfNumber` | `string` | VHF number |
| `vhfEquipmentModel` | `int` | Equipment model ID |
| `vhfPulseWeight` | `int` | Pulse weight |
| `vhfMeterPulseWeight` | `float` | Meter pulse weight |

### EquipmentIMETER

iMeter equipment details for `OTResolutionEquipment`.

| Field | Type | Description |
|-------|------|-------------|
| `iMeterNumber` | `string` | iMeter number |
| `iMeterOptions` | `int` | Options |
| `iMeterEquipmentModel` | `int` | Equipment model ID |
| `iMeterPulseWeight` | `int` | Pulse weight |

### EquipmentBusVHF

BusVHF equipment details for `OTResolutionEquipment`.

| Field | Type | Description |
|-------|------|-------------|
| `busVHFumberSerie` | `string` | BusVHF serial number (note: typo in WSDL) |

### EquipmentLoRaWAN

LoRaWAN equipment details for `OTResolutionEquipment`.

| Field | Type | Description |
|-------|------|-------------|
| `loRaWANPreAssembled` | `boolean` | Whether preassembled |
| `loRaWANModelEmisor` | `int` | Emitter model ID |
| `loRaWANPulseWeight` | `int` | Pulse weight |
| `loRaWANMeterPulseWeight` | `float` | Meter pulse weight |
| `loRaWANEquipmentBrand` | `string` | Equipment brand |
| `loRaWANEquipmentModel` | `string` | Equipment model |
| `loRaWANAdditionalKey` | `string` | Additional key |

### EquipmentBusNBIOT

BusNBIOT equipment details for `OTResolutionEquipment`.

| Field | Type | Description |
|-------|------|-------------|
| `busNBIOTNumber` | `string` | BusNBIOT number |

### OTVHFTechnology

VHF technology details for `OTEquipment` (read-side).

| Field | Type | Description |
|-------|------|-------------|
| `number` | `string` | VHF number |
| `pulseWeight` | `int` | Pulse weight |
| `model` | `int` | Model ID |
| `preAssembled` | `boolean` | Whether preassembled |
| `meterPulseWeight` | `float` | Meter pulse weight |

### OTIMeterTechnology

iMeter technology details for `OTEquipment` (read-side).

| Field | Type | Description |
|-------|------|-------------|
| `number` | `string` | iMeter number |
| `pulseWeight` | `int` | Pulse weight |
| `options` | `int` | Options |
| `model` | `int` | Model ID |

### OTBusVHFTechnology

BusVHF technology details for `OTEquipment` (read-side).

| Field | Type | Description |
|-------|------|-------------|
| `busVHFNumber` | `string` | BusVHF number |

### OTLoRaWANTechnology

LoRaWAN technology details for `OTEquipment` (read-side).

| Field | Type | Description |
|-------|------|-------------|
| `preAssembled` | `boolean` | Whether preassembled |
| `modelEmisor` | `int` | Emitter model ID |
| `pulseWeight` | `int` | Pulse weight |
| `meterPulseWeight` | `float` | Meter pulse weight |
| `equipmentBrand` | `string` | Equipment brand |
| `equipmentModel` | `string` | Equipment model |
| `additionalKey` | `string` | Additional key |

### OTBusNBIOTTechnology

BusNBIOT technology details for `OTEquipment` (read-side).

| Field | Type | Description |
|-------|------|-------------|
| `busNBIOTNumber` | `string` | BusNBIOT number |

### error

| Field | Type | Description |
|-------|------|-------------|
| `codigoError` | `string` | Error code |
| `descripcionError` | `string` | Error description |
| `identificador` | `string` | Identifier |

### AquaCISWSAplicationException

| Field | Type | Description |
|-------|------|-------------|
| `code` | `string` | Error code |
| `message` | `string` | Error message |
| `variables[]` | `string[]` | Error variables |
| `level` | `string` | Error level |

### FaultInfo (ServiceException)

Namespace: `http://www.aqualogy.net/xf/ws`

| Field | Type | Description |
|-------|------|-------------|
| `code` | `string` | Fault code |
| `type` | `Type` | Fault type enum: `PARAM_VALIDATION`, `BUSINESS`, `RUNTIME`, `TIMEOUT`, `PROCESSING`, `ERROR`, `OTHER` |
| `message` | `string` | Fault message |
