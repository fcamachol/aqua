# Aquasis Order Creation Fixes - Design

## Problem

All SOAP calls to `InterfazGenericaOrdenesServicioWS` return 500 Internal Server Error. Three distinct bugs:

1. **`refreshData`** — Missing required `operationalSiteID` field and wrong `otClassID`. Aquasis returns: "Parametro explotacion no informado"
2. **`crearOrdenTrabajo`** — Missing WS-Security authentication headers. Aquasis returns: `java.lang.NullPointerException`
3. **No resync UI** — When Aquasis order creation fails, no way to retry or see the error

## Fix 1: refreshData SOAP Request

**File:** `app/javascript/dashboard/api/cea.js`

- Add `operationalSiteID` parameter (padded to 4 digits with leading zeros)
- Change `otClassID` from `0` to `1` (valid work order class)
- Update function signature: `refreshData(orderCode)` → `refreshData(orderCode, operationalSiteID)`

## Fix 2: crearOrdenTrabajo WS-Security Headers

**File:** `app/javascript/dashboard/api/cea.js`

- Add `wsse:Security` header with `UsernameToken` (same pattern as `resolveOT`, `informarVisita`)

## Fix 3: Store Exploitation Code

**New migration:** Add `aquasis_exploitation_code` string column to `service_orders`

**Files:**
- New migration file
- `app/models/service_order.rb` — no changes needed (no validation)
- `app/controllers/api/v1/accounts/tickets_controller.rb` — permit new param
- `app/controllers/api/v1/accounts/service_orders_controller.rb` — permit new param for update
- `app/views/api/v1/accounts/service_orders/_service_order.json.jbuilder` — expose field
- `app/javascript/dashboard/routes/dashboard/tickets/GenerateOrderModal.vue` — save exploitation code from contract detail
- `app/javascript/dashboard/routes/dashboard/orders/OrderDetails.vue` — pass exploitation to refreshData

## Fix 4: Resync Button + Error Display

**Files:**
- `app/javascript/dashboard/routes/dashboard/orders/OrderDetails.vue` — warning banner + resync button when `aquasis_order_id` is null
- `app/javascript/dashboard/routes/dashboard/orders/OrdersList.vue` — warning icon on unsynced rows
- `app/javascript/dashboard/api/serviceOrders.js` — add resync endpoint call (PATCH with new aquasis_order_id)

**Resync flow:**
1. Get contract number from order's ticket
2. Retry full Aquasis creation (contract detail → meter → service point → crearOrdenTrabajo)
3. On success: update order's `aquasis_order_id` and `aquasis_exploitation_code`
4. On failure: show specific Aquasis error message
