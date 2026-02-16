# Aquasis Integration - Service Order Creation

## Overview

When a service order is created from a ticket in AGORA, the system calls the CEA Aquasis SOAP API to create a corresponding work order in the external system. The returned order number (e.g., `O4514415`) is stored locally and linked back to the CEA case via the REST API.

## Architecture

```
AGORA (Vue frontend)
  │
  ├─ 1. consultaDetalleContrato ──► Aquasis SOAP (Contracts WS)
  │     └─ extracts: numeroContador (meter serial)
  │
  ├─ 2. getPuntoServicioPorContador ──► Aquasis SOAP (Meters WS)
  │     └─ extracts: idPtoServicio (service point ID)
  │
  ├─ 3. crearOrdenTrabajo ──► Aquasis SOAP (Work Orders WS)
  │     └─ returns: order number (e.g., O4514415)
  │
  ├─ 4. createServiceOrder ──► AGORA Rails API
  │     └─ stores: local record with aquasis_order_id
  │
  └─ 5. referenceWorkOrderAquacis ──► CEA REST API
        └─ links: aquasis order to CEA case
```

All SOAP calls are proxied through Rails at `/api/v1/cea/soap/:service` to avoid CORS issues.

## SOAP Endpoints

| Service | Rails Proxy Path | Aquasis URL |
|---------|-----------------|-------------|
| Contracts | `/api/v1/cea/soap/InterfazGenericaContratacionWS` | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContratacionWS` |
| Work Orders | `/api/v1/cea/soap/InterfazGenericaOrdenesServicioWS` | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaOrdenesServicioWS` |
| Meters | `/api/v1/cea/soap/InterfazGenericaContadoresWS` | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContadoresWS` |

REST endpoint: `https://appcea.ceaqueretaro.gob.mx/ceadevws/` (proxied at `/api/v1/cea/rest`)

---

## Step-by-Step Flow

### Step 1: Get Contract Detail

**Purpose:** Retrieve the meter serial number (`numeroContador`) for the contract.

**Endpoint:** `InterfazGenericaContratacionWS` / `consultaDetalleContrato`

**Request:**
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

**Response (key fields):**
```xml
<consultaDetalleContratoReturn>
  <GenericoContratoDTO>
    <contrato>
      <numeroContrato>442761</numeroContrato>
      <explotacion>8</explotacion>
      <numeroContador>10005237</numeroContador>        <!-- NEEDED -->
      <titular>GOMEZ FAJARDO, J. PUEBLITO</titular>
    </contrato>
    <puntoSuministro>
      <provincia>HUIMILPAN</provincia>
      <municipio>LA CEJA</municipio>
      <calle>REFORMA</calle>
      <numero>0</numero>
      <listaDeContadores>
        <ContratoContadorDTO>
          <numeroSerie>10005237</numeroSerie>
          <estadoContador>1</estadoContador>
        </ContratoContadorDTO>
      </listaDeContadores>
    </puntoSuministro>
    <datosPersonales>
      <titular>GOMEZ FAJARDO, J. PUEBLITO</titular>
      <cifNif>XAXX010101000</cifNif>
    </datosPersonales>
  </GenericoContratoDTO>
</consultaDetalleContratoReturn>
```

**Key extraction path (JS):**
```js
contractDetail.GenericoContratoDTO.contrato.numeroContador  // "10005237"
```

> **Note:** `puntoSuministro` does NOT contain `idPtoServicio`. It must be looked up via the meters endpoint.

---

### Step 2: Get Service Point ID from Meter

**Purpose:** Resolve the meter serial number to a service point ID (`idPtoServicio`), which is required by `crearOrdenTrabajo`.

**Endpoint:** `InterfazGenericaContadoresWS` / `getPuntoServicioPorContador`

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericacontadores.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:getPuntoServicioPorContador>
      <listaNumSerieContador>10005237</listaNumSerieContador>
      <usuario>WSGESTIONDEUDA</usuario>
      <idioma>es</idioma>
      <opciones></opciones>
    </int:getPuntoServicioPorContador>
  </soapenv:Body>
</soapenv:Envelope>
```

**Response (key fields):**
```xml
<getPuntoServicioPorContadorReturn>
  <puntosServicioContadorDTO>
    <PuntosServicioContadorDTO>
      <numSerieContador>10005237</numSerieContador>
      <puntoServicioDTO>
        <PuntoServicioDTO>
          <id>632744</id>                               <!-- THIS IS idPtoServicio -->
          <direccionPS>
            <dirTexto>REFORMA SN,COLONIA HUIMILPAN ( LA CEJA )</dirTexto>
          </direccionPS>
          <codigoExplotacion>8</codigoExplotacion>
          <descExplotacion>HUIMILPAN</descExplotacion>
          <estadoPuntoServicio>CONTRATADO</estadoPuntoServicio>
        </PuntoServicioDTO>
      </puntoServicioDTO>
      <codigoResultado>200</codigoResultado>
    </PuntosServicioContadorDTO>
  </puntosServicioContadorDTO>
  <resultado>
    <codigoError>0</codigoError>
    <descripcionError>OK</descripcionError>
  </resultado>
</getPuntoServicioPorContadorReturn>
```

**Key extraction path (JS):**
```js
meterJson.puntosServicioContadorDTO
  .PuntosServicioContadorDTO
  .puntoServicioDTO
  .PuntoServicioDTO
  .id  // "632744"
```

---

### Step 3: Create Work Order in Aquasis

**Purpose:** Create the actual work order in Aquasis. Returns the order number.

**Endpoint:** `InterfazGenericaOrdenesServicioWS` / `crearOrdenTrabajo`

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
  <soapenv:Header/>
  <soapenv:Body>
    <int:crearOrdenTrabajo>
      <idioma>es</idioma>
      <ordenTrabajo>
        <tipoOrden>23</tipoOrden>
        <motivoOrden>15</motivoOrden>
        <fechaCreacionOrden>2026-02-11T12:00:00.000-06:00</fechaCreacionOrden>
        <numContrato>442761</numContrato>
        <idPtoServicio>632744</idPtoServicio>
        <fechaEstimdaFin>2026-02-11T12:00:00.000-06:00</fechaEstimdaFin>
        <observaciones>TEST - prueba de integracion desde AGORA</observaciones>
        <codigoObsCambCont></codigoObsCambCont>
        <codigoReparacion>01</codigoReparacion>
        <anyoExpediente>2026</anyoExpediente>
        <numeroExpediente></numeroExpediente>
        <instalaValvulaPaso>0</instalaValvulaPaso>
      </ordenTrabajo>
      <enCurso>0</enCurso>
    </int:crearOrdenTrabajo>
  </soapenv:Body>
</soapenv:Envelope>
```

**Response (success):**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ns2:crearOrdenTrabajoResponse
        xmlns:ns2="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
      <return>O4514415</return>
    </ns2:crearOrdenTrabajoResponse>
  </soap:Body>
</soap:Envelope>
```

**Response (error - missing idPtoServicio):**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <soap:Fault>
      <faultcode>soap:Server</faultcode>
      <faultstring>java.lang.NullPointerException</faultstring>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>
```

**Key extraction (JS):**
```js
const returnEl = xmlDoc.getElementsByTagName('return')[0];
const aquasisOrderId = returnEl.textContent.trim();  // "O4514415"
```

### Required Fields

| Field | Source | Example | Required |
|-------|--------|---------|----------|
| `tipoOrden` | CEA lookup `order_types.code` | `23` | Yes |
| `motivoOrden` | CEA lookup `order_motives.code` | `15` | Yes |
| `fechaCreacionOrden` | Form: request date (ISO) | `2026-02-11T12:00:00.000-06:00` | Yes |
| `numContrato` | Ticket `contract_number` | `442761` | Yes |
| `idPtoServicio` | Step 2 result | `632744` | **Yes (causes NullPointerException if empty)** |
| `fechaEstimdaFin` | Same as creation date | `2026-02-11T12:00:00.000-06:00` | Yes |
| `observaciones` | Form: observations text | Free text | No |
| `codigoReparacion` | CEA lookup `repair_codes.code` | `01` | Yes (default `01`) |
| `anyoExpediente` | Current year | `2026` | Yes |
| `codigoObsCambCont` | Not used | Empty | No |
| `numeroExpediente` | Not used | Empty | No |
| `instalaValvulaPaso` | Always `0` | `0` | Yes |

### Available Order Types (from DB)

| Code | Description |
|------|-------------|
| `6` | Reposicion de suministro |
| `21` | Trabajos genericos |
| `23` | Revision de instalacion |
| `32` | Orden de Reparacion |
| `33` | Reponer contador |

### Available Order Motives (from DB)

| Code | Description |
|------|-------------|
| `15` | Revision de instalacion |
| `41` | Reconexion de servicio |
| `50` | Suspension de servicio |
| `52` | Reparacion de fuga o averia |
| `61` | Reposicion de suministro |

---

### Step 4: Create Local Service Order

Standard AGORA API call to persist the record with the Aquasis order ID.

**Endpoint:** `POST /api/v1/accounts/:account_id/tickets/:ticket_id/create_service_order`

**Payload:**
```json
{
  "service_order": {
    "order_type": "23 - Revision de instalacion",
    "order_type_record_id": 5,
    "order_motive_id": 3,
    "request_date": "2026-02-11",
    "observations": "Test observations",
    "reason": "Test description",
    "repair_code": "01 - Default",
    "repair_code_record_id": 1,
    "aquasis_order_id": "O4514415"
  }
}
```

---

### Step 5: Link Aquasis Order to CEA Case

**Purpose:** Inform CEA's case management system that an Aquasis work order has been created for this case.

**Endpoint:** `PUT /api/v1/cea/rest` (proxied to `https://appcea.ceaqueretaro.gob.mx/ceadevws/`)

**Payload:**
```json
{
  "evento": "asigna_orden_aquacis",
  "data": {
    "sys_id": "<case_id_from_ticket_metadata>",
    "orden_aquacis": "O4514415",
    "caso_sn": "",
    "sn_code": "",
    "sn_notes": ""
  }
}
```

**Source of `sys_id`:** Retrieved from `ticket.custom_attributes.caso_sn` or `ticket.custom_attributes.sys_id` or `ticket.metadata.caso_sn` or `ticket.metadata.sys_id`.

> **Note:** This step is skipped if the ticket has no `caso_sn`/`sys_id` in its metadata.

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| No `contract_number` on ticket | Skip Aquasis entirely, create local order only |
| Contract detail fetch fails | Skip `idPtoServicio` lookup, attempt order creation anyway (will likely fail) |
| Meter lookup fails | `idPtoServicio` will be empty, order creation will fail with NullPointerException |
| `crearOrdenTrabajo` fails | Create local order **without** `aquasis_order_id`, show warning: "Orden local creada pero no se pudo registrar en Aquasis" |
| `referenceWorkOrderAquacis` fails | Logged to console, does not block the flow |
| No `caso_sn`/`sys_id` on ticket | Step 5 is skipped silently |

---

## Frontend Code Location

| File | Purpose |
|------|---------|
| `app/javascript/dashboard/api/cea.js` | All SOAP/REST API functions |
| `app/javascript/dashboard/routes/dashboard/tickets/GenerateOrderModal.vue` | Order creation modal with Aquasis integration |
| `app/javascript/dashboard/routes/dashboard/tickets/TicketDetails.vue` | Displays Aquasis order ID badge on service orders |
| `app/javascript/dashboard/routes/dashboard/orders/OrdersList.vue` | Aquasis ID column in orders table |

## Backend Code Location

| File | Purpose |
|------|---------|
| `app/controllers/api/v1/cea_proxy_controller.rb` | Rails SOAP/REST proxy to CEA |
| `app/controllers/api/v1/accounts/tickets_controller.rb` | `create_service_order` action, accepts `aquasis_order_id` |
| `app/controllers/api/v1/accounts/service_orders_controller.rb` | Update/search with `aquasis_order_id` |
| `app/views/api/v1/accounts/service_orders/_service_order.json.jbuilder` | Serializes `aquasis_order_id` |
| `db/migrate/20260211000001_add_aquasis_order_id_to_service_orders.rb` | Adds column + index |

## Test Verification (2026-02-11)

Tested from inside the `whisper-api_agora` container against production Aquasis endpoints:

1. `consultaDetalleContrato(442761)` - returned contract with meter `10005237`
2. `getPuntoServicioPorContador(10005237)` - returned service point ID `632744`
3. `crearOrdenTrabajo` with `idPtoServicio=632744` - **returned `O4514415`**
4. `crearOrdenTrabajo` with empty `idPtoServicio` - failed with `NullPointerException`
