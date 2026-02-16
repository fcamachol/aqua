# Aquasis Order Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all Aquasis SOAP 500 errors for work orders and add a resync UI for orders that failed to link.

**Architecture:** Three SOAP envelope fixes in `cea.js`, one new DB column for exploitation code, and UI changes in OrderDetails + OrdersList to surface errors and allow resync.

**Tech Stack:** Vue 3 Composition API, Rails 7, HTTParty SOAP proxy, Tailwind CSS

---

### Task 1: Fix `crearOrdenTrabajo` — Add WS-Security Headers

**Files:**
- Modify: `app/javascript/dashboard/api/cea.js:454-480`

**Step 1: Add WS-Security headers to crearOrdenTrabajo**

Replace lines 454-480 with the same WS-Security pattern used by `resolveOT` (line 487). The envelope needs `xmlns:wsse` and `xmlns:wsu` namespace declarations and the `<wsse:Security>` header block.

```javascript
export const crearOrdenTrabajo = async data => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
   <soapenv:Header>
    <wsse:Security mustUnderstand="1">
        <wsse:UsernameToken wsu:Id="UsernameToken-${xmlEscape(CEA_API_USERNAME)}">
          <wsse:Username>${xmlEscape(CEA_API_USERNAME)}</wsse:Username>
          <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${xmlEscape(CEA_API_PASSWORD)}</wsse:Password>
        </wsse:UsernameToken>
      </wsse:Security>
  </soapenv:Header>
   <soapenv:Body>
      <int:crearOrdenTrabajo>
         <idioma>es</idioma>
         <ordenTrabajo>
            <tipoOrden>${xmlEscape(data.tipoOrden)}</tipoOrden>
            <motivoOrden>${xmlEscape(data.motivoOrden)}</motivoOrden>
            <fechaCreacionOrden>${xmlEscape(data.fechaCreacionOrden)}</fechaCreacionOrden>
            <numContrato>${xmlEscape(data.numContrato)}</numContrato>
            <idPtoServicio>${xmlEscape(data.idPtoServicio)}</idPtoServicio>
            <fechaEstimdaFin>${xmlEscape(data.fechaEstimdaFin)}</fechaEstimdaFin>
            <observaciones>${xmlEscape(data.observaciones)}</observaciones>
       <codigoObsCambCont></codigoObsCambCont>
            <codigoReparacion>${xmlEscape(data.codigoReparacion)}</codigoReparacion>
            <anyoExpediente>${xmlEscape(data.anyoExpediente)}</anyoExpediente>
       <numeroExpediente></numeroExpediente>
            <instalaValvulaPaso>0</instalaValvulaPaso>
         </ordenTrabajo>
         <enCurso>0</enCurso>
      </int:crearOrdenTrabajo>
   </soapenv:Body>
</soapenv:Envelope>`;

  return sendSoapRequest(CEA_SOAP_WORKORDER_URL, '', xml);
};
```

**Step 2: Commit**

```
feat(aquasis): add WS-Security headers to crearOrdenTrabajo
```

---

### Task 2: Fix `refreshData` — Add `operationalSiteID` and fix `otClassID`

**Files:**
- Modify: `app/javascript/dashboard/api/cea.js:403-438`

**Step 1: Update refreshData and refreshDataJson signatures**

The `operationalSiteID` must be padded to 4 digits (contract `explotacion=8` → `"0008"`). Add the parameter and pad it inside the function. Change `otClassID` from `0` to `1`.

Replace lines 403-438:

```javascript
/**
 * Refresh/query a single work order's full details from Aquasis
 * @param {string} orderCode - Order origin ID (e.g., 'O4514415')
 * @param {string} operationalSiteID - Exploitation code (e.g., '8' — will be padded to '0008')
 * @returns {Promise<Document>} XML document with full OT data
 */
export const refreshData = async (orderCode, operationalSiteID = '') => {
  const paddedSiteID = operationalSiteID
    ? String(operationalSiteID).padStart(4, '0')
    : '';
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:refreshData>
         <otRequest>
            <operationalSiteID>${xmlEscape(paddedSiteID)}</operationalSiteID>
            <otClassID>1</otClassID>
            <otOriginID>${xmlEscape(orderCode)}</otOriginID>
            <language>es</language>
         </otRequest>
      </int:refreshData>
   </soapenv:Body>
</soapenv:Envelope>`;

  return sendSoapRequest(CEA_SOAP_WORKORDER_URL, '', xml);
};

/**
 * Refresh/query a single work order's full details as JSON
 * @param {string} orderCode - Order origin ID (e.g., 'O4514415')
 * @param {string} operationalSiteID - Exploitation code (e.g., '8')
 * @returns {Promise<any>} JSON object with otData, clientData, otElements, otReadings, otCustomerUnpaidBills, otCustomerDebt, otComments
 */
export const refreshDataJson = async (orderCode, operationalSiteID = '') => {
  const xmlDoc = await refreshData(orderCode, operationalSiteID);
  const returnElement =
    xmlDoc.getElementsByTagName('return')[0] ||
    xmlDoc.getElementsByTagName('refreshDataReturn')[0] ||
    xmlDoc.getElementsByTagName('refreshDataResponse')[0];
  if (returnElement) return xmlToJson(returnElement);
  return xmlToJson(xmlDoc);
};
```

**Step 2: Commit**

```
fix(aquasis): add operationalSiteID to refreshData and fix otClassID
```

---

### Task 3: Add `aquasis_exploitation_code` DB Column + Backend Plumbing

**Files:**
- Create: `db/migrate/20260213060000_add_aquasis_exploitation_code_to_service_orders.rb`
- Modify: `app/controllers/api/v1/accounts/tickets_controller.rb:283-295` — add `:aquasis_exploitation_code` to permitted params
- Modify: `app/controllers/api/v1/accounts/service_orders_controller.rb:91-93` — add `:aquasis_exploitation_code` to permitted params
- Modify: `app/views/api/v1/accounts/service_orders/_service_order.json.jbuilder:13` — add field + add `contract_number` to ticket block

**Step 1: Create migration**

```ruby
class AddAquasisExploitationCodeToServiceOrders < ActiveRecord::Migration[7.1]
  def change
    add_column :service_orders, :aquasis_exploitation_code, :string
  end
end
```

**Step 2: Add to tickets_controller permitted params**

In `app/controllers/api/v1/accounts/tickets_controller.rb:283-295`, add `:aquasis_exploitation_code` to the `service_order_params` method:

```ruby
def service_order_params
  params.require(:service_order).permit(
    :order_type,
    :reason,
    :request_date,
    :observations,
    :repair_code,
    :service_order_reason_id,
    :order_type_record_id,
    :repair_code_record_id,
    :order_motive_id,
    :aquasis_order_id,
    :order_class,
    :aquasis_exploitation_code
  )
end
```

**Step 3: Add to service_orders_controller permitted params**

In `app/controllers/api/v1/accounts/service_orders_controller.rb:91-93`:

```ruby
def service_order_params
  params.require(:service_order).permit(:status, :observations, :aquasis_order_id, :aquasis_exploitation_code)
end
```

**Step 4: Add to jbuilder + add contract_number to ticket block**

In `app/views/api/v1/accounts/service_orders/_service_order.json.jbuilder`, add after line 13 (`json.aquasis_order_id`):

```ruby
json.aquasis_exploitation_code service_order.aquasis_exploitation_code
```

And in the ticket block (line 49-57), add `contract_number`:

```ruby
if service_order.ticket.present?
  json.ticket do
    json.id service_order.ticket.id
    json.display_id service_order.ticket.display_id
    json.folio service_order.ticket.folio
    json.title service_order.ticket.title
    json.status service_order.ticket.status
    json.contract_number service_order.ticket.contract_number
  end
end
```

**Step 5: Run migration**

```bash
eval "$(rbenv init -)" && bundle exec rails db:migrate
```

**Step 6: Commit**

```
feat(orders): add aquasis_exploitation_code column and expose in API
```

---

### Task 4: Save Exploitation Code During Order Creation

**Files:**
- Modify: `app/javascript/dashboard/routes/dashboard/tickets/GenerateOrderModal.vue:167-246`

**Step 1: Extract explotacion from contract detail and return it alongside aquasisOrderId**

Change `createAquasisOrder` to also extract and return the exploitation code from the contract detail response. Change the return value from a plain string to an object `{ aquasisOrderId, exploitationCode }`.

In the `createAquasisOrder` function (line 167), add a variable to capture explotacion:

After line 174 (`const contractDetail = await consultaDetalleContratoJson(contractNum);`), add:

```javascript
    const explotacion =
      contractDetail?.GenericoContratoDTO?.contrato?.explotacion ||
      contractDetail?.contrato?.explotacion ||
      '';
```

Change the function to return an object. After line 242 (`return returnEl.textContent?.trim() || null;`), the full return pattern becomes returning `{ aquasisOrderId, exploitationCode }` instead of just the ID string.

Replace the full function with:

```javascript
const createAquasisOrder = async () => {
  const contractNum = contractNumber.value?.trim();
  if (!contractNum) return { aquasisOrderId: null, exploitationCode: '' };

  // Step 1: Fetch contract detail to get meter serial and explotacion
  let idPtoServicio = '';
  let explotacion = '';
  try {
    const contractDetail = await consultaDetalleContratoJson(contractNum);
    explotacion =
      contractDetail?.GenericoContratoDTO?.contrato?.explotacion ||
      contractDetail?.contrato?.explotacion ||
      '';
    const meterSerial =
      contractDetail?.GenericoContratoDTO?.contrato?.numeroContador ||
      contractDetail?.contrato?.numeroContador ||
      '';

    if (meterSerial) {
      const meterXml = await getPuntoServicioPorContador(
        meterSerial,
        'WSGESTIONDEUDA'
      );
      const meterReturn = meterXml.getElementsByTagName(
        'getPuntoServicioPorContadorReturn'
      )[0];
      if (meterReturn) {
        const meterJson = xmlToJson(meterReturn);
        idPtoServicio =
          meterJson?.puntosServicioContadorDTO?.PuntosServicioContadorDTO
            ?.puntoServicioDTO?.PuntoServicioDTO?.id || '';
      }
    }
  } catch (error) {
    console.error('Error fetching idPtoServicio:', error);
  }

  // Step 2: Build payload and call crearOrdenTrabajo
  const selectedOt = orderTypes.value.find(
    item => item.id === selectedOrderTypeId.value
  );
  const selectedOm = effectiveOrderMotives.value.find(
    item => item.id === selectedOrderMotiveId.value
  );
  const selectedRc = subcategoryRepairCodes.value.find(
    r => r.id === selectedRepairCodeId.value
  );

  const payload = {
    tipoOrden: selectedOt?.code || '',
    motivoOrden: selectedOm?.code || '',
    fechaCreacionOrden: new Date(requestDate.value).toISOString(),
    numContrato: contractNum,
    idPtoServicio,
    fechaEstimdaFin: new Date(requestDate.value).toISOString(),
    observaciones: observations.value || '',
    codigoReparacion: selectedRc?.code || '',
    anyoExpediente: String(new Date().getFullYear()),
  };

  const xmlDoc = await crearOrdenTrabajo(payload);

  // Step 3: Parse the response to extract the order number
  const returnEl =
    xmlDoc.getElementsByTagName('return')[0] ||
    xmlDoc.getElementsByTagName('crearOrdenTrabajoReturn')[0] ||
    xmlDoc.getElementsByTagName('crearOrdenTrabajoResponse')[0];

  let aquasisOrderId = null;
  if (returnEl) {
    if (returnEl.children && returnEl.children.length > 0) {
      const json = xmlToJson(returnEl);
      aquasisOrderId =
        json?.numOrden ||
        json?.ordenTrabajo ||
        returnEl.textContent?.trim() ||
        null;
    } else {
      aquasisOrderId = returnEl.textContent?.trim() || null;
    }
  }

  return { aquasisOrderId, exploitationCode: explotacion };
};
```

**Step 2: Update handleSubmit to use the new return shape**

In `handleSubmit` (line 264), update the caller to destructure the result and pass `exploitationCode` to the local order creation:

Replace the Aquasis creation block (lines 271-281) with:

```javascript
    let aquasisOrderId = null;
    let exploitationCode = '';
    let aquasisWarning = false;

    if (contractNumber.value?.trim()) {
      try {
        const result = await createAquasisOrder();
        aquasisOrderId = result.aquasisOrderId;
        exploitationCode = result.exploitationCode;
      } catch (error) {
        console.error('Error creating Aquasis order:', error);
        aquasisWarning = true;
      }
    }
```

Then in the `orderData` object (after line 297 where `repair_code_record_id` is set), add:

```javascript
    if (aquasisOrderId) {
      orderData.aquasis_order_id = aquasisOrderId;
    }

    if (exploitationCode) {
      orderData.aquasis_exploitation_code = exploitationCode;
    }
```

(Replace the existing `if (aquasisOrderId)` block at lines 299-301.)

**Step 3: Commit**

```
feat(orders): save exploitation code during Aquasis order creation
```

---

### Task 5: Pass Exploitation Code to refreshData in OrderDetails

**Files:**
- Modify: `app/javascript/dashboard/routes/dashboard/orders/OrderDetails.vue:119-131`

**Step 1: Update fetchAquasisData to pass exploitation code**

Replace lines 119-131:

```javascript
const fetchAquasisData = async () => {
  if (!order.value?.aquasis_order_id) return;
  try {
    isLoadingAquasis.value = true;
    aquasisError.value = null;
    aquasisData.value = await refreshDataJson(
      order.value.aquasis_order_id,
      order.value.aquasis_exploitation_code || ''
    );
  } catch (error) {
    console.error('Error fetching Aquasis data:', error);
    aquasisError.value = error.message || 'Error al obtener datos de Aquasis';
  } finally {
    isLoadingAquasis.value = false;
  }
};
```

Note: Also changed `aquasisError.value` to use `error.message` (the SOAP error detail) instead of a generic string, so users can see the actual Aquasis error.

**Step 2: Commit**

```
fix(orders): pass exploitation code to refreshData in OrderDetails
```

---

### Task 6: Add Resync UI to OrderDetails

**Files:**
- Modify: `app/javascript/dashboard/routes/dashboard/orders/OrderDetails.vue`

**Step 1: Add imports for Aquasis API functions**

At the top of `<script setup>` (after line 7), add the CEA imports:

```javascript
import {
  refreshDataJson,
  crearOrdenTrabajo,
  consultaDetalleContratoJson,
  getPuntoServicioPorContador,
  referenceWorkOrderAquacis,
  xmlToJson,
} from 'dashboard/api/cea';
```

And remove the old single import on line 7:
```javascript
// REMOVE: import { refreshDataJson } from 'dashboard/api/cea';
```

**Step 2: Add resync state refs**

After `const aquasisError = ref(null);` (line 28), add:

```javascript
const isResyncing = ref(false);
const resyncError = ref(null);
```

**Step 3: Add resync function**

After the `fetchAquasisData` function (after the closing of that function), add:

```javascript
const resyncAquasis = async () => {
  const contractNum = order.value?.ticket?.contract_number;
  if (!contractNum) {
    resyncError.value =
      'No se puede sincronizar: el ticket no tiene contrato asociado';
    return;
  }

  try {
    isResyncing.value = true;
    resyncError.value = null;

    // Step 1: Fetch contract detail
    const contractDetail = await consultaDetalleContratoJson(contractNum);
    const explotacion =
      contractDetail?.GenericoContratoDTO?.contrato?.explotacion ||
      contractDetail?.contrato?.explotacion ||
      '';
    const meterSerial =
      contractDetail?.GenericoContratoDTO?.contrato?.numeroContador ||
      contractDetail?.contrato?.numeroContador ||
      '';

    // Step 2: Get service point from meter
    let idPtoServicio = '';
    if (meterSerial) {
      const meterXml = await getPuntoServicioPorContador(
        meterSerial,
        'WSGESTIONDEUDA'
      );
      const meterReturn = meterXml.getElementsByTagName(
        'getPuntoServicioPorContadorReturn'
      )[0];
      if (meterReturn) {
        const meterJson = xmlToJson(meterReturn);
        idPtoServicio =
          meterJson?.puntosServicioContadorDTO?.PuntosServicioContadorDTO
            ?.puntoServicioDTO?.PuntoServicioDTO?.id || '';
      }
    }

    // Step 3: Create order in Aquasis
    const payload = {
      tipoOrden: order.value.order_type_record?.code || '',
      motivoOrden: order.value.order_motive?.code || '',
      fechaCreacionOrden: new Date(order.value.request_date).toISOString(),
      numContrato: contractNum,
      idPtoServicio,
      fechaEstimdaFin: new Date(order.value.request_date).toISOString(),
      observaciones: order.value.observations || '',
      codigoReparacion: order.value.repair_code_record?.code || '',
      anyoExpediente: String(
        new Date(order.value.created_at).getFullYear()
      ),
    };

    const xmlDoc = await crearOrdenTrabajo(payload);

    // Step 4: Parse aquasis order ID from response
    const returnEl =
      xmlDoc.getElementsByTagName('return')[0] ||
      xmlDoc.getElementsByTagName('crearOrdenTrabajoReturn')[0] ||
      xmlDoc.getElementsByTagName('crearOrdenTrabajoResponse')[0];

    let aquasisOrderId = null;
    if (returnEl) {
      if (returnEl.children && returnEl.children.length > 0) {
        const json = xmlToJson(returnEl);
        aquasisOrderId =
          json?.numOrden ||
          json?.ordenTrabajo ||
          returnEl.textContent?.trim() ||
          null;
      } else {
        aquasisOrderId = returnEl.textContent?.trim() || null;
      }
    }

    if (!aquasisOrderId) {
      resyncError.value = 'Aquasis no devolvio un ID de orden';
      return;
    }

    // Step 5: Update local order with aquasis data
    await ServiceOrdersAPI.update(order.value.id, {
      aquasis_order_id: aquasisOrderId,
      aquasis_exploitation_code: explotacion,
    });

    // Step 6: Link to CEA case
    const caseId =
      order.value.ticket?.custom_attributes?.caso_sn ||
      order.value.ticket?.custom_attributes?.sys_id;
    if (caseId) {
      try {
        await referenceWorkOrderAquacis(caseId, aquasisOrderId);
      } catch (linkError) {
        console.error('Error linking Aquasis order to case:', linkError);
      }
    }

    // Step 7: Refresh order and Aquasis data
    await fetchOrder();
    fetchAquasisData();
  } catch (error) {
    console.error('Error resyncing Aquasis:', error);
    resyncError.value = error.message || 'Error al sincronizar con Aquasis';
  } finally {
    isResyncing.value = false;
  }
};
```

**Step 4: Add warning banner + resync button in the template**

In the template, after the `<!-- Content -->` div opening (after line 277 `<div class="flex-1 overflow-auto p-4">`), add the warning banner BEFORE the "Order Information" section:

```html
        <!-- Aquasis Sync Warning -->
        <div
          v-if="!order.aquasis_order_id"
          class="mb-6 p-4 rounded-lg border border-n-amber-7 bg-n-amber-3"
        >
          <div class="flex items-start gap-3">
            <span class="i-lucide-alert-triangle text-n-amber-11 text-lg mt-0.5 shrink-0" />
            <div class="flex-1">
              <p class="text-sm font-medium text-n-amber-11">
                Esta orden no esta vinculada a Aquasis
              </p>
              <p v-if="resyncError" class="text-sm text-n-ruby-11 mt-1">
                {{ resyncError }}
              </p>
              <Button
                class="mt-2"
                variant="outline"
                size="xs"
                icon="i-lucide-refresh-cw"
                :is-loading="isResyncing"
                label="Reintentar sincronizacion con Aquasis"
                @click="resyncAquasis"
              />
            </div>
          </div>
        </div>
```

Also, move the existing `aquasisError` banner (lines 402-408) OUTSIDE the `v-if="aquasisData && order.aquasis_order_id"` template block so it shows even when aquasisData is null. Place it right after the new sync warning banner:

```html
        <!-- Aquasis Data Error -->
        <div
          v-if="aquasisError && order.aquasis_order_id"
          class="mb-6 p-3 rounded-lg bg-n-ruby-3 text-n-ruby-11 text-sm"
        >
          {{ aquasisError }}
        </div>
```

Remove the duplicate error div from inside the `<template v-if="aquasisData && order.aquasis_order_id">` block (lines 402-408).

**Step 5: Expose ticket custom_attributes in jbuilder for resync case linking**

In `app/views/api/v1/accounts/service_orders/_service_order.json.jbuilder`, add `custom_attributes` to the ticket block:

```ruby
if service_order.ticket.present?
  json.ticket do
    json.id service_order.ticket.id
    json.display_id service_order.ticket.display_id
    json.folio service_order.ticket.folio
    json.title service_order.ticket.title
    json.status service_order.ticket.status
    json.contract_number service_order.ticket.contract_number
    json.custom_attributes service_order.ticket.custom_attributes
  end
end
```

**Step 6: Commit**

```
feat(orders): add Aquasis resync button and error display in OrderDetails
```

---

### Task 7: Add Warning Icon to OrdersList for Unsynced Orders

**Files:**
- Modify: `app/javascript/dashboard/routes/dashboard/orders/OrdersList.vue:447-455`

**Step 1: Replace the Aquasis ID cell content**

Replace lines 447-455 (the `<td>` for aquasis_order_id) with:

```html
            <td class="py-3 px-2 text-sm">
              <span
                v-if="order.aquasis_order_id"
                class="font-mono text-n-brand"
              >
                {{ order.aquasis_order_id }}
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 text-n-amber-11"
                title="No vinculada a Aquasis"
              >
                <span class="i-lucide-alert-triangle text-xs" />
                Sin vincular
              </span>
            </td>
```

**Step 2: Commit**

```
feat(orders): show warning icon for unsynced orders in list view
```

---

### Task 8: Final Verification

**Step 1: Lint JavaScript**

```bash
pnpm eslint app/javascript/dashboard/api/cea.js app/javascript/dashboard/routes/dashboard/orders/OrderDetails.vue app/javascript/dashboard/routes/dashboard/orders/OrdersList.vue app/javascript/dashboard/routes/dashboard/tickets/GenerateOrderModal.vue
```

**Step 2: Lint Ruby**

```bash
eval "$(rbenv init -)" && bundle exec rubocop app/controllers/api/v1/accounts/tickets_controller.rb app/controllers/api/v1/accounts/service_orders_controller.rb app/views/api/v1/accounts/service_orders/_service_order.json.jbuilder
```

**Step 3: Fix any lint issues and commit**

```
chore: fix lint issues from Aquasis order fixes
```
