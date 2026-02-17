---
name: soap-to-rest
description: Migrate an Aquasis SOAP operation to REST using the strangler fig pattern for SUPRA Water
---

# SOAP to REST Migration (Strangler Fig Pattern)

Migrate an Aquasis legacy SOAP operation to a modern REST endpoint for SUPRA Water 2026. Uses the strangler fig pattern: the new REST endpoint wraps the old SOAP call, allowing gradual migration.

## Step 1: Gather Requirements

Ask the user:
- SOAP service name (e.g., `contracts`, `debt`, `meters`, `readings`, `work-orders`)
- SOAP operation name (e.g., `GetContractByAccount`, `GetDebtSummary`, `GetMeterReadings`)
- Target REST endpoint (e.g., `GET /api/v1/tomas/:cuentaContrato`)
- Is there already a SUPRA database table that can serve this data directly?

## Step 2: Read the WSDL Documentation

Before writing any code, read the relevant WSDL documentation to understand the SOAP operation's request/response structure:

- `docs/aquasis-wsdl-contracts.md` — Contract/toma SOAP services
- `docs/aquasis-wsdl-debt.md` — Debt/adeudo SOAP services
- `docs/aquasis-wsdl-meters.md` — Meter/medidor SOAP services
- `docs/aquasis-wsdl-readings.md` — Reading/lectura SOAP services
- `docs/aquasis-wsdl-work-orders.md` — Work order/orden de trabajo SOAP services
- `docs/aquasis-api-documentation.md` — General Aquasis API reference
- `docs/CEA_API_REFERENCE.md` — CEA Queretaro API reference
- `docs/aquasis-integration.md` — Integration patterns and authentication

Read the relevant file to extract:
- The SOAP endpoint URL pattern
- Request XML structure (input parameters)
- Response XML structure (output fields)
- Authentication requirements (typically WS-Security or Basic Auth)
- Any known quirks or edge cases documented

## Step 3: Create the SOAP Adapter

### `src/adapters/aquasis/{service}/{operation}.adapter.ts`

```typescript
import { config } from '../../../config';
import { logger } from '../../../logger';

/**
 * SOAP Adapter: {ServiceName}.{OperationName}
 *
 * Legacy endpoint: https://aquacis-cf.ceaqueretaro.gob.mx/{ServicePath}
 * WSDL: docs/aquasis-wsdl-{service}.md
 *
 * SOAP Field Mapping:
 * ┌──────────────────────────┬────────────────────────┐
 * │ SOAP Field               │ SUPRA Field            │
 * ├──────────────────────────┼────────────────────────┤
 * │ {SoapField1}             │ {supraField1}          │
 * │ {SoapField2}             │ {supraField2}          │
 * │ ...                      │ ...                    │
 * └──────────────────────────┴────────────────────────┘
 */

interface SoapRequestParams {
  // Define input parameters matching the SOAP operation
}

interface SoapRawResponse {
  // Define the raw XML-parsed response structure
}

export class {Operation}Adapter {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = config.AQUASIS_BASE_URL ?? 'https://aquacis-cf.ceaqueretaro.gob.mx';
    this.timeout = config.AQUASIS_TIMEOUT ?? 30_000;
  }

  /**
   * Call the legacy SOAP operation
   */
  async execute(params: SoapRequestParams): Promise<SoapRawResponse> {
    const soapEnvelope = this.buildSoapEnvelope(params);

    logger.debug({ operation: '{OperationName}', params }, 'Calling Aquasis SOAP service');

    const startTime = Date.now();

    try {
      const response = await fetch(`${this.baseUrl}/{ServicePath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          'SOAPAction': '{SOAPAction}',
          // Add auth headers as needed (Basic Auth or WS-Security)
          ...(config.AQUASIS_USERNAME && {
            'Authorization': `Basic ${Buffer.from(
              `${config.AQUASIS_USERNAME}:${config.AQUASIS_PASSWORD}`
            ).toString('base64')}`,
          }),
        },
        body: soapEnvelope,
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`SOAP request failed with status ${response.status}`);
      }

      const xmlText = await response.text();
      const parsed = this.parseSoapResponse(xmlText);

      const duration = Date.now() - startTime;
      logger.info({ operation: '{OperationName}', duration }, 'Aquasis SOAP call completed');

      return parsed;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(
        { operation: '{OperationName}', duration, error },
        'Aquasis SOAP call failed'
      );
      throw error;
    }
  }

  private buildSoapEnvelope(params: SoapRequestParams): string {
    return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:aq="http://aquasis.ceaqueretaro.gob.mx/">
  <soap:Header>
    <!-- Add WS-Security headers if required -->
  </soap:Header>
  <soap:Body>
    <aq:{OperationName}>
      <!-- Map params to SOAP XML elements -->
    </aq:{OperationName}>
  </soap:Body>
</soap:Envelope>`;
  }

  private parseSoapResponse(xmlText: string): SoapRawResponse {
    // Parse the SOAP XML response
    // Use a lightweight XML parser or regex for simple responses
    // For complex responses, consider using 'fast-xml-parser'
    throw new Error('Not implemented — parse the SOAP response XML');
  }
}

export const {operation}Adapter = new {Operation}Adapter();
```

### `src/adapters/aquasis/{service}/{operation}.mapper.ts`

```typescript
/**
 * Data Mapper: {ServiceName}.{OperationName}
 *
 * Transforms data between Aquasis SOAP format and SUPRA REST format.
 *
 * Direction: SOAP Response → SUPRA JSON
 *
 * Mapping Details:
 * - {SoapField1} (string) → {supraField1} (string): {description}
 * - {SoapField2} (decimal) → {supraField2} (number): {description}
 * - {SoapDateField} (dd/MM/yyyy) → {supraDateField} (ISO 8601): Date format conversion
 * - {SoapAmountField} (string "1234.56") → {supraAmountField} (number): Parse to float, amounts in MXN
 * - {SoapStatusField} ("A"/"I") → {supraStatusField} ("active"/"inactive"): Status enum mapping
 */

import type { SoapRawResponse } from './{operation}.adapter';

// SUPRA REST response type
export interface {Resource}RestResponse {
  id: string;
  tenantId: string;
  // Map all fields from the SOAP response to clean REST types
  // Use camelCase for field names
  // Use ISO 8601 for dates
  // Use numbers for amounts (not strings)
  createdAt: string;
  updatedAt: string;
}

// Status mapping from SOAP codes to SUPRA enums
const STATUS_MAP: Record<string, string> = {
  'A': 'active',
  'I': 'inactive',
  'S': 'suspended',
  'C': 'cancelled',
  // Add all status codes from the WSDL documentation
};

/**
 * Transform SOAP response to SUPRA REST format
 */
export function mapSoapToRest(
  soapResponse: SoapRawResponse,
  tenantId: string,
): {Resource}RestResponse {
  return {
    id: soapResponse.{SoapIdField} ?? crypto.randomUUID(),
    tenantId,

    // Field mappings:
    // {field}: parseSoapValue(soapResponse.{SoapField}),

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Transform SUPRA REST request to SOAP request parameters (for write operations)
 */
export function mapRestToSoap(restInput: Partial<{Resource}RestResponse>): Record<string, string> {
  return {
    // Map REST fields back to SOAP parameter names
    // {SoapField}: String(restInput.{supraField}),
  };
}

// Helper: Parse Aquasis date format (dd/MM/yyyy or dd/MM/yyyy HH:mm:ss) to ISO 8601
function parseAquasisDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;

  // Handle dd/MM/yyyy format
  const parts = dateStr.split(/[/ :]/);
  if (parts.length >= 3) {
    const [day, month, year, hours, minutes, seconds] = parts;
    const iso = `${year}-${month!.padStart(2, '0')}-${day!.padStart(2, '0')}`;
    if (hours) {
      return `${iso}T${hours.padStart(2, '0')}:${(minutes ?? '00').padStart(2, '0')}:${(seconds ?? '00').padStart(2, '0')}.000Z`;
    }
    return `${iso}T00:00:00.000Z`;
  }

  return dateStr;
}

// Helper: Parse Aquasis amount string to number
function parseAquasisAmount(amountStr: string | null | undefined): number {
  if (!amountStr) return 0;
  const cleaned = amountStr.replace(/[,$]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// Helper: Map SOAP status code to SUPRA enum
function mapStatus(soapStatus: string | null | undefined): string {
  return STATUS_MAP[soapStatus ?? ''] ?? 'unknown';
}
```

### `src/adapters/aquasis/{service}/{operation}.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { {operation}Adapter } from './{operation}.adapter';
import { mapSoapToRest, mapRestToSoap } from './{operation}.mapper';

// Mock SOAP response XML (copy realistic structure from WSDL docs)
const MOCK_SOAP_RESPONSE = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <{OperationName}Response xmlns="http://aquasis.ceaqueretaro.gob.mx/">
      <{OperationName}Result>
        <!-- Paste a realistic mock response from the WSDL documentation -->
      </{OperationName}Result>
    </{OperationName}Response>
  </soap:Body>
</soap:Envelope>`;

describe('{Operation} Adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('SOAP Client', () => {
    it('should build correct SOAP envelope', () => {
      // Test that the envelope XML is well-formed and contains the right parameters
    });

    it('should handle successful SOAP response', async () => {
      // Mock the fetch call
      vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(MOCK_SOAP_RESPONSE, {
          status: 200,
          headers: { 'Content-Type': 'text/xml' },
        })
      );

      const result = await {operation}Adapter.execute({
        // Test input params
      });

      expect(result).toBeDefined();
      // Assert specific fields from the parsed response
    });

    it('should handle SOAP fault response', async () => {
      const faultXml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <soap:Fault>
      <faultcode>soap:Server</faultcode>
      <faultstring>Account not found</faultstring>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>`;

      vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(faultXml, { status: 200, headers: { 'Content-Type': 'text/xml' } })
      );

      await expect({operation}Adapter.execute({ /* params */ }))
        .rejects.toThrow();
    });

    it('should handle network timeout', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValueOnce(
        new DOMException('The operation was aborted', 'AbortError')
      );

      await expect({operation}Adapter.execute({ /* params */ }))
        .rejects.toThrow();
    });

    it('should handle HTTP error responses', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response('Internal Server Error', { status: 500 })
      );

      await expect({operation}Adapter.execute({ /* params */ }))
        .rejects.toThrow('SOAP request failed with status 500');
    });
  });

  describe('Data Mapper', () => {
    const tenantId = '550e8400-e29b-41d4-a716-446655440000';

    it('should map SOAP response to REST format', () => {
      const soapData = {
        // Realistic mock data matching WSDL response structure
      };

      const result = mapSoapToRest(soapData, tenantId);

      expect(result.tenantId).toBe(tenantId);
      // Assert field-by-field mapping
    });

    it('should handle null/missing SOAP fields gracefully', () => {
      const soapData = {
        // Sparse data with nulls/undefined
      };

      const result = mapSoapToRest(soapData, tenantId);

      // Should not throw, should provide sensible defaults
      expect(result).toBeDefined();
    });

    it('should correctly parse Aquasis date format', () => {
      const soapData = {
        // Include a date field in dd/MM/yyyy format
      };

      const result = mapSoapToRest(soapData, tenantId);

      // Date should be in ISO 8601 format
      // expect(result.{dateField}).toBe('2025-03-15T00:00:00.000Z');
    });

    it('should correctly parse amount strings to numbers', () => {
      const soapData = {
        // Include an amount like "1,234.56" or "$1234.56"
      };

      const result = mapSoapToRest(soapData, tenantId);

      // Amount should be a number
      // expect(result.{amountField}).toBe(1234.56);
    });

    it('should map SOAP status codes to SUPRA enums', () => {
      // Test each status code mapping
    });
  });
});
```

## Step 4: Create the REST Endpoint with Feature Flag

### Integrate into the service router

In the appropriate route file, add the strangler fig endpoint:

```typescript
import { Router } from 'express';
import { {operation}Adapter } from '../adapters/aquasis/{service}/{operation}.adapter';
import { mapSoapToRest } from '../adapters/aquasis/{service}/{operation}.mapper';
import { {resource}Service } from '../services/{resource}.service';
import { config } from '../config';

const router = Router();

/**
 * Strangler Fig: {REST endpoint}
 *
 * Feature flag: USE_DIRECT_DB_{OPERATION}
 * - false (default): Calls Aquasis SOAP and transforms response
 * - true: Queries SUPRA database directly (use when migration is complete)
 */
router.get('/{path}', async (req, res, next) => {
  try {
    const tenantId = req.auth!.tenantId;
    const useDirectDb = config.USE_DIRECT_DB_{OPERATION} ?? false;

    let data;

    if (useDirectDb) {
      // New path: Direct database query (SUPRA native)
      data = await {resource}Service.findByX(tenantId, req.params.x);
    } else {
      // Legacy path: SOAP adapter (strangler fig)
      const soapResponse = await {operation}Adapter.execute({
        // Map request params to SOAP params
      });
      data = mapSoapToRest(soapResponse, tenantId);
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});
```

### Add the feature flag to the service config

In `src/config.ts`, add:

```typescript
// Feature flags for strangler fig migration
USE_DIRECT_DB_{OPERATION}: z.coerce.boolean().default(false),
```

## Step 5: Verify and Remind

After generating all files:

1. Replace all placeholders (`{service}`, `{operation}`, `{Resource}`, etc.)
2. Read the actual WSDL documentation to fill in:
   - The exact SOAP endpoint URL
   - The SOAPAction header value
   - Request parameter names and types
   - Response field names and types
   - The complete field mapping table
3. Implement the XML parser in the adapter (consider using `fast-xml-parser`)
4. Fill in realistic mock SOAP responses in the tests
5. Run the tests: `npx vitest run src/adapters/aquasis/{service}/{operation}.test.ts`
6. Test against the real Aquasis endpoint in staging (not production)
7. Document the migration status in `docs/aquasis-integration.md`

## Migration Checklist

For each SOAP operation being migrated:

- [ ] WSDL documentation reviewed and understood
- [ ] SOAP adapter created and tested with mocked responses
- [ ] Data mapper handles all field types (dates, amounts, statuses, nulls)
- [ ] REST endpoint created with feature flag
- [ ] Integration test passes against staging Aquasis endpoint
- [ ] SUPRA database table exists for the equivalent data
- [ ] Direct DB service method implemented
- [ ] Feature flag tested in both modes (SOAP and direct DB)
- [ ] Performance comparison: SOAP vs direct DB
- [ ] Feature flag flipped to direct DB in staging
- [ ] Monitoring confirms no regressions
- [ ] Feature flag flipped to direct DB in production
- [ ] SOAP adapter marked as deprecated (but not removed yet)

## Reference Documents

- `docs/CEA_API_REFERENCE.md` — CEA Queretaro general API reference
- `docs/aquasis-wsdl-contracts.md` — Contract/toma operations
- `docs/aquasis-wsdl-debt.md` — Debt/adeudo operations
- `docs/aquasis-wsdl-meters.md` — Meter/medidor operations
- `docs/aquasis-wsdl-readings.md` — Reading/lectura operations
- `docs/aquasis-wsdl-work-orders.md` — Work order operations
- `docs/aquasis-integration.md` — Integration patterns
- `docs/contracts.wsdl` — Raw WSDL for contracts service
- `docs/debt.wsdl` — Raw WSDL for debt service
- `docs/meters.wsdl` — Raw WSDL for meters service
- `docs/readings.wsdl` — Raw WSDL for readings service
- `docs/work-orders.wsdl` — Raw WSDL for work orders service
