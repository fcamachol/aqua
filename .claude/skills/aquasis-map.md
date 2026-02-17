---
name: aquasis-map
description: Map an Aquasis SOAP operation to the new SUPRA Water data model
---

# Aquasis SOAP-to-SUPRA Mapping Workflow

When this skill is invoked, guide the user through mapping a legacy Aquasis SOAP web service operation to the new SUPRA Water data model. This produces a complete mapping document, TypeScript interfaces, and a mapper function.

## Step 1: Identify the SOAP Service and Operation

Ask the user which SOAP service and operation to map. The 5 Aquasis WSDL contracts are:

- **ContratacionWS** - Contract and toma (service connection) management
- **MedicionWS** - Meter reading and medidor (meter) operations
- **FacturacionWS** - Billing, factura/recibo generation, tarifa escalonada
- **CobranzaWS** - Payment collection, adeudos (debts), convenios de pago
- **AtencionWS** - Customer service, work orders, cortes/reconexiones

Example operations: `ContratacionWS.obtenerDatosContrato`, `FacturacionWS.generarRecibo`, `CobranzaWS.consultarAdeudos`

## Step 2: Read the WSDL Documentation

Look for the corresponding documentation file in the repository:

- Search for `docs/aquasis-wsdl-*.md` files using glob pattern
- Read the file that corresponds to the selected service
- Extract the operation signature, input message, output message, and any complex types referenced

If the documentation file does not exist, ask the user to provide the WSDL excerpt or describe the operation's fields manually.

## Step 3: Identify All SOAP Request/Response Fields

Parse and list every field from the SOAP operation:

**Request fields:**
- Field name (as it appears in the WSDL)
- XML data type (xsd:string, xsd:int, xsd:decimal, xsd:date, etc.)
- Whether it is required or optional (minOccurs)
- Description/purpose if documented

**Response fields:**
- Same details as above
- Note any nested complex types and flatten them with dot notation (e.g., `datosContrato.direccion.calle`)

## Step 4: Create the Field Mapping Table

For each SOAP field, map it to the SUPRA Water data model:

```
SOAP Field                    | SUPRA Table.Column          | Transformation
------------------------------|-----------------------------|--------------------------
numeroContrato                | contracts.contract_number   | direct (string)
nombreCliente                 | persons.full_name           | trim + uppercase
fechaAlta                     | contracts.created_at        | parse DD/MM/YYYY → ISO 8601
estatusToma                   | tomas.status                | map codes: 'A'→'activa', 'C'→'cortada'
consumoM3                     | readings.consumption_m3     | parse string → decimal
importeTotal                  | invoices.total_amount       | parse string → numeric(12,2)
```

Use the SUPRA Water domain terminology:
- `tomas` - service connections
- `persons` - people/subscribers (padron de usuarios)
- `contracts` - service contracts linking persons to tomas
- `meters` - water meters (medidores)
- `readings` - meter readings (lecturas)
- `invoices` - bills/invoices (facturas/recibos)
- `debts` - outstanding balances (adeudos)
- `payment_plans` - convenios de pago
- `work_orders` - service orders (ordenes de trabajo)

## Step 5: Flag Unmapped Fields (SOAP-side)

Identify SOAP fields that have no direct equivalent in the SUPRA model:

- Fields that are deprecated and no longer needed
- Fields that need a new column added to an existing SUPRA table
- Fields that need an entirely new SUPRA table
- Fields that can be derived or computed from existing SUPRA data

For each, recommend an action: `DROP`, `ADD_COLUMN`, `ADD_TABLE`, or `COMPUTE`.

## Step 6: Flag Unmapped Fields (SUPRA-side)

Identify SUPRA columns that have no source in the SOAP response:

- Columns that require manual data entry during migration
- Columns that have default values
- Columns that are auto-generated (UUIDs, timestamps)
- Columns populated by other services or processes

For each, note the data source: `MANUAL`, `DEFAULT`, `AUTO_GENERATED`, or `OTHER_SERVICE`.

## Step 7: Generate TypeScript Interface for SOAP Response

Create a TypeScript interface that represents the SOAP response structure:

```typescript
/**
 * SOAP response from {ServiceName}.{OperationName}
 * Auto-mapped from Aquasis WSDL
 */
export interface {OperationName}SoapResponse {
  // ... fields with JSDoc comments explaining the source field
}
```

Use appropriate TypeScript types:
- `xsd:string` → `string`
- `xsd:int`, `xsd:integer` → `number`
- `xsd:decimal`, `xsd:float` → `string` (to preserve precision, parse later)
- `xsd:date`, `xsd:dateTime` → `string` (ISO format after transformation)
- `xsd:boolean` → `boolean`
- Optional fields → `field?: type`
- Arrays (maxOccurs="unbounded") → `type[]`

## Step 8: Generate Mapper Function

Create a TypeScript function that transforms the SOAP response to SUPRA format:

```typescript
import { {OperationName}SoapResponse } from './interfaces';

/**
 * Maps {ServiceName}.{OperationName} SOAP response to SUPRA Water model.
 * Generated from Aquasis WSDL mapping.
 */
export function map{OperationName}ToSupra(soap: {OperationName}SoapResponse): {SupraType} {
  return {
    // ... field mappings with transformations
  };
}
```

Include:
- Null/undefined checks for optional fields
- Date format conversions (Aquasis uses DD/MM/YYYY, SUPRA uses ISO 8601)
- Code mapping lookups (status codes, type codes)
- String normalization (trim, case conversion)
- Numeric parsing with proper decimal handling

## Step 9: Save the Mapping Document

Save the complete mapping to `docs/mappings/{service}-{operation}.md` with:

- Header with service name, operation, and date
- The full field mapping table from Step 4
- Unmapped fields from Steps 5 and 6
- The TypeScript interface from Step 7
- The mapper function from Step 8
- Any notes or assumptions made during the mapping process
- Migration considerations and data quality concerns

Create the `docs/mappings/` directory if it does not exist.
