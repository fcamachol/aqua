# ACTION PLAN: QA & Testing Strategy — SUPRA Water 2026

**Date:** 2026-02-16
**Author:** QA & Testing Strategist
**Scope:** End-to-end quality assurance for SUPRA Water 2026 CIS
**Stack:** Vitest (unit/integration), Playwright (E2E), k6 (performance), OWASP ZAP (security)

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Unit Testing Strategy](#2-unit-testing-strategy)
3. [Integration Testing](#3-integration-testing)
4. [E2E Business Flow Testing](#4-e2e-business-flow-testing)
5. [AI Agent Testing](#5-ai-agent-testing)
6. [Performance Testing](#6-performance-testing)
7. [External Integration Testing](#7-external-integration-testing)
8. [Security Testing](#8-security-testing)
9. [Data Migration Validation](#9-data-migration-validation)
10. [Test Data Management](#10-test-data-management)
11. [Sprint-by-Sprint QA Delivery](#11-sprint-by-sprint-qa-delivery)

---

## 1. Testing Philosophy

### 1.1 Test Pyramid

```
                    /\
                   /  \          E2E + AI Agent Tests
                  / E2E \        (~50 scenarios)
                 /--------\
                / Integr.   \    Integration Tests (~300)
               /--------------\
              /    Unit Tests    \  Unit Tests (~2,000+)
             /____________________\
```

| Layer | Tool | Target Count | Coverage Goal | Run Time |
|-------|------|:------------:|:-------------:|:--------:|
| Unit | Vitest | 2,000+ | 90% line coverage on business logic | < 30s |
| Integration | Vitest + Testcontainers | 300+ | All DB queries, event flows, API routes | < 3 min |
| E2E (business flows) | Playwright | 50+ scenarios | 6 critical business flows | < 10 min |
| AI Agent | Vitest + custom harness | 100+ cases | All 8 agents, prompt regression | < 5 min |
| Performance | k6 | 15+ scripts | All SLA targets | On-demand |
| Security | OWASP ZAP + custom | 30+ checks | OWASP Top 10 | On-demand |

### 1.2 Core Principles

1. **Test-Driven Development (TDD):** Write failing tests before implementation for all business logic (tariff calculation, IVA rules, RFC validation, collections scoring).
2. **Shift Left:** Every PR must pass unit + integration tests. No merge without green CI.
3. **Tenant Isolation as a Test Concern:** Every test that touches the database must verify tenant isolation. A test that leaks data across tenants is a failing test.
4. **Deterministic AI Tests:** AI agent tests use fixed prompts, seeded scenarios, and snapshot-based output validation. Non-determinism is contained via temperature=0 and response structure validation.
5. **Mexican-Native Test Data:** All test fixtures use real Mexican data formats (RFC, CURP, CLABE, addresses with colonia, MXN amounts).

### 1.3 CI/CD Pipeline Integration

```
PR Created
  |-> lint + typecheck (< 30s)
  |-> unit tests (< 30s)
  |-> integration tests (< 3 min)
  |-> [on merge to main]
       |-> E2E business flow tests (< 10 min)
       |-> AI agent regression tests (< 5 min)
       |-> security scan (OWASP ZAP baseline)
       |-> [on release tag]
            |-> performance tests (k6)
            |-> full security audit
```

---

## 2. Unit Testing Strategy

### 2.1 Module Coverage Targets

| Module | Key Logic | Coverage Target | Priority |
|--------|-----------|:--------------:|:--------:|
| `billing/tariff-calculator` | Block tariff calculation, IVA rules | **95%** | P0 |
| `billing/cfdi-service` | CFDI field validation, SAT catalog mapping | **95%** | P0 |
| `payments/service` | Reconciliation, partial payments, reversal | **95%** | P0 |
| `payments/gateways/*` | SPEI/OXXO/Conekta adapters | **90%** | P0 |
| `meters/anomaly-detector` | All 6 anomaly detection rules | **95%** | P1 |
| `delinquency/collection-scorer` | 9-feature scoring model | **95%** | P1 |
| `persons/rfc-validator` | RFC structure, homoclave, check digit | **95%** | P1 |
| `utils/curp-validator` | CURP 18-char validation | **95%** | P1 |
| `utils/clabe-validator` | CLABE 18-digit, bank code, check digit | **95%** | P1 |
| `contracts/service` | Lifecycle state machine transitions | **90%** | P1 |
| `work-orders/service` | Status transitions, assignment rules | **85%** | P2 |
| `contacts/ai-classifier` | Category classification | **85%** | P2 |
| `fraud/ml-detector` | Pattern analysis rules | **85%** | P2 |
| `analytics/report-generator` | Aggregation queries, CONAGUA formats | **80%** | P2 |

### 2.2 Key Business Logic Test Cases

#### 2.2.1 Tariff Block Calculation (tarifa escalonada)

```typescript
// src/modules/billing/__tests__/tariff-calculator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateBlockTariff } from '../tariff-calculator';

const DOMESTIC_TARIFF_BLOCKS = [
  { from_m3: 0, to_m3: 10, price_per_m3: 5.50, fixed_charge: 45.00 },
  { from_m3: 10, to_m3: 20, price_per_m3: 8.75, fixed_charge: 0 },
  { from_m3: 20, to_m3: 40, price_per_m3: 15.30, fixed_charge: 0 },
  { from_m3: 40, to_m3: null, price_per_m3: 25.00, fixed_charge: 0 },
];

describe('calculateBlockTariff', () => {
  it('calculates first block only (0-10 m3)', () => {
    const result = calculateBlockTariff(8, DOMESTIC_TARIFF_BLOCKS);
    // 45.00 fixed + 8 * 5.50 = 89.00
    expect(result.subtotal).toBe(89.00);
    expect(result.detail).toHaveLength(1);
  });

  it('calculates across two blocks (15 m3)', () => {
    const result = calculateBlockTariff(15, DOMESTIC_TARIFF_BLOCKS);
    // Block 1: 45.00 + 10 * 5.50 = 100.00
    // Block 2: 0 + 5 * 8.75 = 43.75
    // Total: 143.75
    expect(result.subtotal).toBe(143.75);
    expect(result.detail).toHaveLength(2);
  });

  it('calculates across all blocks (50 m3)', () => {
    const result = calculateBlockTariff(50, DOMESTIC_TARIFF_BLOCKS);
    // Block 1: 45.00 + 10 * 5.50 = 100.00
    // Block 2: 0 + 10 * 8.75 = 87.50
    // Block 3: 0 + 20 * 15.30 = 306.00
    // Block 4: 0 + 10 * 25.00 = 250.00
    // Total: 743.50
    expect(result.subtotal).toBe(743.50);
    expect(result.detail).toHaveLength(4);
  });

  it('handles zero consumption', () => {
    const result = calculateBlockTariff(0, DOMESTIC_TARIFF_BLOCKS);
    expect(result.subtotal).toBe(0);
  });

  it('handles cuota fija (single flat block)', () => {
    const flatBlocks = [
      { from_m3: 0, to_m3: null, price_per_m3: 0, fixed_charge: 120.00 },
    ];
    const result = calculateBlockTariff(0, flatBlocks);
    expect(result.subtotal).toBe(120.00);
  });

  it('handles social tariff discount', () => {
    const result = calculateBlockTariff(8, DOMESTIC_TARIFF_BLOCKS);
    const discounted = result.subtotal * (1 - 0.30); // 30% social discount
    expect(discounted).toBeCloseTo(62.30, 2);
  });

  it('returns correct unit_price as average', () => {
    const result = calculateBlockTariff(15, DOMESTIC_TARIFF_BLOCKS);
    expect(result.unit_price).toBeCloseTo(143.75 / 15, 4);
  });
});
```

#### 2.2.2 IVA Application Rules

```typescript
// src/modules/billing/__tests__/iva-rules.test.ts
import { describe, it, expect } from 'vitest';
import { calculateIVA } from '../iva-rules';

describe('IVA calculation for Mexican water services', () => {
  it('domestic water is IVA exempt (tasa 0%)', () => {
    expect(calculateIVA('domestica', 'agua', 100.00)).toEqual({
      iva_rate: 0,
      iva_amount: 0,
      total: 100.00,
    });
  });

  it('commercial water has 16% IVA', () => {
    expect(calculateIVA('comercial', 'agua', 100.00)).toEqual({
      iva_rate: 0.16,
      iva_amount: 16.00,
      total: 116.00,
    });
  });

  it('industrial water has 16% IVA', () => {
    const result = calculateIVA('industrial', 'agua', 500.00);
    expect(result.iva_rate).toBe(0.16);
    expect(result.iva_amount).toBe(80.00);
  });

  it('government tomas are IVA exempt', () => {
    const result = calculateIVA('gobierno', 'agua', 1000.00);
    expect(result.iva_rate).toBe(0);
    expect(result.iva_amount).toBe(0);
  });

  it('alcantarillado follows same IVA rule as water by toma type', () => {
    expect(calculateIVA('domestica', 'alcantarillado', 25.00).iva_amount).toBe(0);
    expect(calculateIVA('comercial', 'alcantarillado', 25.00).iva_amount).toBe(4.00);
  });

  it('reconexion charge has 16% IVA regardless of toma type', () => {
    const result = calculateIVA('domestica', 'reconexion', 200.00);
    expect(result.iva_rate).toBe(0.16);
    expect(result.iva_amount).toBe(32.00);
  });
});
```

#### 2.2.3 CFDI Field Validation

```typescript
// src/modules/billing/__tests__/cfdi-validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateCFDIFields, buildCFDIPayload } from '../cfdi-service';

describe('CFDI 4.0 field validation', () => {
  it('rejects missing receptor RFC', () => {
    expect(() => validateCFDIFields({ rfc: undefined })).toThrow('RFC is required');
  });

  it('accepts RFC publico general (XAXX010101000)', () => {
    const result = validateCFDIFields({ rfc: 'XAXX010101000' });
    expect(result.valid).toBe(true);
  });

  it('maps water to SAT key 10171500', () => {
    const payload = buildCFDIPayload({ concept_code: 'agua' });
    expect(payload.ClaveProdServ).toBe('10171500');
  });

  it('maps alcantarillado to SAT key 72151802', () => {
    const payload = buildCFDIPayload({ concept_code: 'alcantarillado' });
    expect(payload.ClaveProdServ).toBe('72151802');
  });

  it('uses MTQ unit key for cubic meters', () => {
    const payload = buildCFDIPayload({ concept_code: 'agua', unit: 'm3' });
    expect(payload.ClaveUnidad).toBe('MTQ');
  });

  it('sets payment form PUE for single payment', () => {
    const payload = buildCFDIPayload({ payment_form: 'pago_unico' });
    expect(payload.FormaPago).toBe('PUE');
  });

  it('sets payment form PPD for installments', () => {
    const payload = buildCFDIPayload({ payment_form: 'parcialidades' });
    expect(payload.FormaPago).toBe('PPD');
  });

  it('sets gobierno fiscal regime to 603', () => {
    const payload = buildCFDIPayload({ fiscal_regime: 'gobierno' });
    expect(payload.RegimenFiscal).toBe('603');
  });
});
```

#### 2.2.4 RFC / CURP / CLABE Validation

```typescript
// src/utils/__tests__/rfc-validator.test.ts
import { describe, it, expect } from 'vitest';
import { validateRFC } from '../rfc-validator';

describe('RFC validation', () => {
  it('accepts valid persona fisica RFC (13 chars)', () => {
    expect(validateRFC('GARC850101HQ7')).toEqual({ valid: true, type: 'fisica' });
  });

  it('accepts valid persona moral RFC (12 chars)', () => {
    expect(validateRFC('CEA050101AB1')).toEqual({ valid: true, type: 'moral' });
  });

  it('accepts RFC publico general', () => {
    expect(validateRFC('XAXX010101000')).toEqual({ valid: true, type: 'generico' });
  });

  it('accepts RFC extranjero', () => {
    expect(validateRFC('XEXX010101000')).toEqual({ valid: true, type: 'extranjero' });
  });

  it('rejects RFC with invalid length', () => {
    expect(validateRFC('ABC')).toEqual({ valid: false, error: 'Invalid length' });
  });

  it('rejects RFC with invalid characters', () => {
    expect(validateRFC('GARC850101H$7')).toEqual({ valid: false, error: 'Invalid characters' });
  });
});

// src/utils/__tests__/curp-validator.test.ts
import { validateCURP } from '../curp-validator';

describe('CURP validation', () => {
  it('accepts valid 18-character CURP', () => {
    expect(validateCURP('GARC850101HQTRMR09')).toEqual({ valid: true });
  });

  it('validates state code is valid Mexican state', () => {
    expect(validateCURP('GARC850101HXXRMR09')).toEqual({
      valid: false,
      error: 'Invalid state code',
    });
  });

  it('validates gender character (H/M)', () => {
    expect(validateCURP('GARC850101ZQTRMR09')).toEqual({
      valid: false,
      error: 'Invalid gender code',
    });
  });
});

// src/utils/__tests__/clabe-validator.test.ts
import { validateCLABE } from '../clabe-validator';

describe('CLABE validation', () => {
  it('accepts valid 18-digit CLABE', () => {
    expect(validateCLABE('002010077777777771')).toEqual({ valid: true, bank: 'BANAMEX' });
  });

  it('rejects CLABE with invalid check digit', () => {
    expect(validateCLABE('002010077777777772')).toEqual({
      valid: false,
      error: 'Invalid check digit',
    });
  });

  it('rejects CLABE with invalid bank code', () => {
    expect(validateCLABE('999010077777777771')).toEqual({
      valid: false,
      error: 'Unknown bank code',
    });
  });

  it('rejects non-numeric CLABE', () => {
    expect(validateCLABE('00201007777A777771')).toEqual({
      valid: false,
      error: 'Must be 18 digits',
    });
  });
});
```

#### 2.2.5 Payment Reconciliation Logic

```typescript
// src/modules/payments/__tests__/reconciliation.test.ts
import { describe, it, expect } from 'vitest';
import { reconcilePayment } from '../reconciliation';

describe('payment reconciliation', () => {
  it('marks invoice as cobrada when full amount paid', () => {
    const result = reconcilePayment({
      invoice_total: 500.00,
      payment_amount: 500.00,
    });
    expect(result.invoice_status).toBe('cobrada');
    expect(result.remaining_balance).toBe(0);
  });

  it('marks invoice as parcial when partial payment', () => {
    const result = reconcilePayment({
      invoice_total: 500.00,
      payment_amount: 200.00,
    });
    expect(result.invoice_status).toBe('parcial');
    expect(result.remaining_balance).toBe(300.00);
  });

  it('handles overpayment by generating credit', () => {
    const result = reconcilePayment({
      invoice_total: 500.00,
      payment_amount: 600.00,
    });
    expect(result.invoice_status).toBe('cobrada');
    expect(result.credit_amount).toBe(100.00);
  });

  it('updates delinquency procedure on full debt payment', () => {
    const result = reconcilePayment({
      invoice_total: 500.00,
      payment_amount: 500.00,
      delinquency_total_debt: 500.00,
    });
    expect(result.delinquency_resolved).toBe(true);
  });

  it('reduces delinquency debt on partial payment', () => {
    const result = reconcilePayment({
      invoice_total: 500.00,
      payment_amount: 500.00,
      delinquency_total_debt: 1500.00,
    });
    expect(result.delinquency_resolved).toBe(false);
    expect(result.delinquency_remaining).toBe(1000.00);
  });
});
```

#### 2.2.6 Anomaly Detection Rules

```typescript
// src/modules/meters/__tests__/anomaly-detector.test.ts
import { describe, it, expect } from 'vitest';
import { detectAnomalies } from '../anomaly-detector';

describe('meter reading anomaly detection', () => {
  const baseReading = {
    consumption: 15,
    avg_6_months: 14,
    prev_consumption: 13,
    same_reading_count: 0,
    sector_avg: 12,
    toma_type: 'domestica',
  };

  it('flags high consumption (> 3x average)', () => {
    const result = detectAnomalies({ ...baseReading, consumption: 50 });
    expect(result.anomaly_type).toBe('high_consumption');
    expect(result.anomaly_score).toBeGreaterThan(0.7);
  });

  it('flags zero consumption after previous non-zero', () => {
    const result = detectAnomalies({
      ...baseReading,
      consumption: 0,
      prev_consumption: 15,
    });
    expect(result.anomaly_type).toBe('zero_consumption');
  });

  it('rejects negative consumption', () => {
    const result = detectAnomalies({ ...baseReading, consumption: -5 });
    expect(result.anomaly_type).toBe('negative_consumption');
    expect(result.action).toBe('reject_and_alert');
    expect(result.anomaly_score).toBeGreaterThan(0.95);
  });

  it('detects meter stopped (3+ same readings)', () => {
    const result = detectAnomalies({ ...baseReading, same_reading_count: 3 });
    expect(result.anomaly_type).toBe('meter_stopped');
    expect(result.action).toBe('create_work_order_meter_check');
  });

  it('detects neighbor comparison anomaly (> 5x sector avg)', () => {
    const result = detectAnomalies({ ...baseReading, consumption: 70 });
    expect(result.anomaly_type).toBe('neighbor_comparison');
  });

  it('returns null for normal readings', () => {
    const result = detectAnomalies(baseReading);
    expect(result).toBeNull();
  });
});
```

#### 2.2.7 Collections Scoring Model

```typescript
// src/modules/delinquency/__tests__/collection-scorer.test.ts
import { describe, it, expect } from 'vitest';
import { calculateCollectionScore, getCollectionSequence } from '../collection-scorer';

describe('collections scoring model', () => {
  const goodPayer = {
    payment_history_last_12_months: 12,  // 12 of 12 paid on time
    days_past_due: 5,
    total_debt_amount: 250,
    number_of_unpaid_invoices: 1,
    account_age_years: 8,
    toma_type: 'domestica',
    previous_payment_plans: 0,
    vulnerability_flag: false,
    sector_delinquency_rate: 0.15,
  };

  it('scores good payer > 0.7 (low risk)', () => {
    const score = calculateCollectionScore(goodPayer);
    expect(score).toBeGreaterThan(0.7);
  });

  it('scores chronic non-payer < 0.3 (high risk)', () => {
    const score = calculateCollectionScore({
      ...goodPayer,
      payment_history_last_12_months: 2,
      days_past_due: 120,
      total_debt_amount: 5000,
      number_of_unpaid_invoices: 8,
      previous_payment_plans: 2,
    });
    expect(score).toBeLessThan(0.3);
  });

  it('returns vulnerable sequence when flag is true', () => {
    const sequence = getCollectionSequence({
      score: 0.1,
      vulnerability_flag: true,
    });
    expect(sequence.name).toBe('vulnerable');
    expect(sequence.steps.every(s => s.action !== 'schedule_corte_order')).toBe(true);
  });

  it('never auto-schedules corte for vulnerable accounts', () => {
    const sequence = getCollectionSequence({
      score: 0.05,
      vulnerability_flag: true,
    });
    const actions = sequence.steps.map(s => s.action);
    expect(actions).not.toContain('schedule_corte_order');
  });

  it('maps low risk to gentle sequence', () => {
    const sequence = getCollectionSequence({ score: 0.8, vulnerability_flag: false });
    expect(sequence.name).toBe('low_risk');
    expect(sequence.steps[0].action).toBe('sms_reminder');
  });

  it('maps high risk to aggressive sequence', () => {
    const sequence = getCollectionSequence({ score: 0.2, vulnerability_flag: false });
    expect(sequence.name).toBe('high_risk');
    expect(sequence.steps[0].action).toBe('phone_call_ai');
  });
});
```

### 2.3 Test Data Factories

```typescript
// tests/factories/index.ts
import { faker } from '@faker-js/faker/locale/es_MX';

export function buildTenant(overrides = {}) {
  return {
    id: faker.string.uuid(),
    slug: 'cea-queretaro',
    name: 'CEA Queretaro',
    rfc: 'CEA050101AB1',
    ...overrides,
  };
}

export function buildPerson(overrides = {}) {
  return {
    id: faker.string.uuid(),
    tenant_id: faker.string.uuid(),
    person_type: 'fisica',
    rfc: `${faker.string.alpha({ length: 4, casing: 'upper' })}${faker.string.numeric(6)}${faker.string.alphanumeric({ length: 3, casing: 'upper' })}`,
    curp: `${faker.string.alpha({ length: 4, casing: 'upper' })}${faker.string.numeric(6)}HQTRMR09`,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: `+5244${faker.string.numeric(8)}`,
    whatsapp: `+5244${faker.string.numeric(8)}`,
    zip_code: faker.string.numeric(5),
    fiscal_regime: '616',
    fiscal_use: 'G03',
    vulnerable: false,
    ...overrides,
  };
}

export function buildToma(overrides = {}) {
  return {
    id: faker.string.uuid(),
    tenant_id: faker.string.uuid(),
    toma_number: `T-${faker.string.numeric(6)}`,
    toma_type: 'domestica',
    status: 'activa',
    has_meter: true,
    billing_type: 'medido',
    tariff_category: 'domestica',
    billing_period: 'mensual',
    latitude: 20.5888 + faker.number.float({ min: -0.05, max: 0.05 }),
    longitude: -100.3899 + faker.number.float({ min: -0.05, max: 0.05 }),
    ...overrides,
  };
}

export function buildContract(overrides = {}) {
  return {
    id: faker.string.uuid(),
    tenant_id: faker.string.uuid(),
    contract_number: `C-${faker.string.numeric(8)}`,
    status: 'activo',
    start_date: faker.date.past(),
    tariff_category: 'domestica',
    payment_method: 'ventanilla',
    ...overrides,
  };
}

export function buildInvoice(overrides = {}) {
  return {
    id: faker.string.uuid(),
    tenant_id: faker.string.uuid(),
    invoice_number: `F-${faker.string.numeric(8)}`,
    invoice_type: 'periodica',
    origin: 'lecturas',
    period_start: new Date('2026-01-01'),
    period_end: new Date('2026-01-31'),
    billing_date: new Date('2026-02-01'),
    due_date: new Date('2026-02-15'),
    subtotal: 143.75,
    iva_amount: 0,
    total: 143.75,
    currency: 'MXN',
    status: 'pendiente',
    ...overrides,
  };
}

export function buildMeterReading(overrides = {}) {
  return {
    id: faker.string.uuid(),
    tenant_id: faker.string.uuid(),
    reading_value: 1234.567,
    previous_reading: 1219.567,
    consumption: 15.0,
    reading_date: new Date(),
    source: 'manual_field',
    status: 'valid',
    ...overrides,
  };
}

export function buildTariffSchedule(overrides = {}) {
  return {
    id: faker.string.uuid(),
    tenant_id: faker.string.uuid(),
    name: 'Tarifa Domestica 2026',
    category: 'domestica',
    effective_from: new Date('2026-01-01'),
    active: true,
    billing_period: 'mensual',
    blocks: [
      { from_m3: 0, to_m3: 10, price_per_m3: 5.50, fixed_charge: 45.00 },
      { from_m3: 10, to_m3: 20, price_per_m3: 8.75, fixed_charge: 0 },
      { from_m3: 20, to_m3: 40, price_per_m3: 15.30, fixed_charge: 0 },
      { from_m3: 40, to_m3: null, price_per_m3: 25.00, fixed_charge: 0 },
    ],
    additional_concepts: [
      { code: 'alcantarillado', name: 'Alcantarillado', type: 'percentage', value: 0.25, base: 'agua' },
      { code: 'saneamiento', name: 'Saneamiento', type: 'fixed', value: 15.00 },
    ],
    iva_applicable: false,
    ...overrides,
  };
}
```

---

## 3. Integration Testing

### 3.1 Database Integration Tests (Drizzle + PostgreSQL + TimescaleDB)

```typescript
// tests/integration/setup.ts
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

let container;
let db;

export async function setupTestDB() {
  container = await new PostgreSqlContainer('timescale/timescaledb-ha:pg16-latest')
    .withDatabase('supra_test')
    .start();

  const pool = new Pool({ connectionString: container.getConnectionUri() });
  db = drizzle(pool);
  await migrate(db, { migrationsFolder: './db/migrations' });
  return db;
}

export async function teardownTestDB() {
  await container?.stop();
}

// Set tenant context for RLS
export async function setTenantContext(db, tenantId: string) {
  await db.execute(`SET app.current_tenant = '${tenantId}'`);
}
```

```typescript
// tests/integration/db/tenant-isolation.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestDB, teardownTestDB, setTenantContext } from '../setup';

describe('multi-tenant RLS isolation', () => {
  let db;
  const tenantA = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const tenantB = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

  beforeAll(async () => {
    db = await setupTestDB();
    // Seed both tenants with contracts
    await db.insert(contracts).values([
      { ...buildContract(), tenant_id: tenantA, contract_number: 'A-001' },
      { ...buildContract(), tenant_id: tenantB, contract_number: 'B-001' },
    ]);
  });

  afterAll(() => teardownTestDB());

  it('tenant A cannot see tenant B contracts', async () => {
    await setTenantContext(db, tenantA);
    const results = await db.select().from(contracts);
    expect(results).toHaveLength(1);
    expect(results[0].contract_number).toBe('A-001');
  });

  it('tenant B cannot see tenant A contracts', async () => {
    await setTenantContext(db, tenantB);
    const results = await db.select().from(contracts);
    expect(results).toHaveLength(1);
    expect(results[0].contract_number).toBe('B-001');
  });

  it('RLS applies to all tenant-scoped tables', async () => {
    const tenantTables = [
      'persons', 'tomas', 'contracts', 'meters', 'meter_readings',
      'invoices', 'payments', 'work_orders', 'contacts', 'fraud_cases',
      'delinquency_procedures', 'communications',
    ];
    for (const table of tenantTables) {
      const policies = await db.execute(
        `SELECT COUNT(*) FROM pg_policies WHERE tablename = '${table}'`
      );
      expect(Number(policies.rows[0].count)).toBeGreaterThan(0);
    }
  });
});
```

### 3.2 Event Bus Testing (pg LISTEN/NOTIFY + BullMQ)

```typescript
// tests/integration/events/event-bus.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestDB, teardownTestDB } from '../setup';
import { emitEvent } from '../../../src/events/publisher';
import { subscribeToEvent } from '../../../src/events/subscriber';

describe('event bus integration', () => {
  let db;
  beforeAll(async () => { db = await setupTestDB(); });
  afterAll(() => teardownTestDB());

  it('stores event in domain_events table', async () => {
    await emitEvent({
      type: 'contract.created',
      aggregate_type: 'contract',
      aggregate_id: 'test-id',
      tenant_id: 'test-tenant',
      payload: { contract_number: 'C-00001' },
    });

    const events = await db.select().from(domainEvents)
      .where(eq(domainEvents.event_type, 'contract.created'));
    expect(events).toHaveLength(1);
    expect(events[0].payload.contract_number).toBe('C-00001');
  });

  it('delivers event via pg LISTEN/NOTIFY', async () => {
    const received = [];
    await subscribeToEvent('domain_events', (event) => {
      received.push(event);
    });

    await emitEvent({
      type: 'payment.received',
      aggregate_type: 'payment',
      aggregate_id: 'pay-1',
      tenant_id: 'test-tenant',
      payload: { amount: 500.00 },
    });

    // Wait for async delivery
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(received).toHaveLength(1);
    expect(received[0].type).toBe('payment.received');
  });

  it('delivers event to BullMQ worker', async () => {
    const processed = [];
    // Register worker
    const worker = createWorker('invoice.generated', async (job) => {
      processed.push(job.data);
    });

    await emitEvent({
      type: 'invoice.generated',
      aggregate_type: 'invoice',
      aggregate_id: 'inv-1',
      tenant_id: 'test-tenant',
      payload: { total: 143.75 },
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    expect(processed).toHaveLength(1);
    await worker.close();
  });
});
```

### 3.3 API Endpoint Integration Tests

```typescript
// tests/integration/api/contracts.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../../src/index';
import { setupTestDB, teardownTestDB } from '../setup';

describe('POST /api/v1/contracts', () => {
  let app, db, authToken;

  beforeAll(async () => {
    db = await setupTestDB();
    app = createApp(db);
    authToken = await getTestToken(db, 'operador');
  });
  afterAll(() => teardownTestDB());

  it('creates contract with valid data', async () => {
    const person = await seedPerson(db);
    const toma = await seedToma(db, { status: 'pendiente_alta' });

    const res = await request(app)
      .post('/cea-queretaro/v1/contracts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        person_id: person.id,
        toma_id: toma.id,
        tariff_category: 'domestica',
        billing_period: 'mensual',
        payment_method: 'ventanilla',
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('activo');
    expect(res.body.contract_number).toBeDefined();
  });

  it('rejects contract for toma with existing active contract', async () => {
    const toma = await seedToma(db, { status: 'activa' });
    await seedContract(db, { toma_id: toma.id, status: 'activo' });

    const res = await request(app)
      .post('/cea-queretaro/v1/contracts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ toma_id: toma.id, person_id: 'any', tariff_category: 'domestica' });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('active contract');
  });

  it('requires authentication', async () => {
    const res = await request(app)
      .post('/cea-queretaro/v1/contracts')
      .send({});
    expect(res.status).toBe(401);
  });

  it('enforces tenant isolation via URL slug', async () => {
    const res = await request(app)
      .post('/other-tenant/v1/contracts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({});
    expect(res.status).toBe(403);
  });
});
```

### 3.4 JSONB Query Performance Tests

```typescript
// tests/integration/db/jsonb-performance.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestDB, teardownTestDB } from '../setup';

describe('JSONB query performance', () => {
  let db;
  beforeAll(async () => {
    db = await setupTestDB();
    // Seed 10,000 invoices with tariff_detail JSONB
    await seedBulkInvoices(db, 10_000);
  });
  afterAll(() => teardownTestDB());

  it('tariff_schedules.blocks JSONB query completes in < 50ms', async () => {
    const start = performance.now();
    await db.execute(`
      SELECT * FROM tariff_schedules
      WHERE blocks @> '[{"from_m3": 0}]'
      AND active = true
    `);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(50);
  });

  it('invoice_lines.tariff_detail JSONB aggregation in < 100ms', async () => {
    const start = performance.now();
    await db.execute(`
      SELECT
        il.tariff_detail->>'from' as block_from,
        SUM((il.tariff_detail->>'charge')::numeric) as total_charge
      FROM invoice_lines il
      JOIN invoices i ON il.invoice_id = i.id
      WHERE i.billing_date >= '2026-01-01'
      GROUP BY il.tariff_detail->>'from'
    `);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100);
  });

  it('domain_events hypertable time-range query in < 100ms', async () => {
    await seedBulkEvents(db, 50_000);
    const start = performance.now();
    await db.execute(`
      SELECT event_type, COUNT(*)
      FROM domain_events
      WHERE created_at >= NOW() - INTERVAL '30 days'
      AND tenant_id = 'test-tenant'
      GROUP BY event_type
    `);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100);
  });
});
```

---

## 4. E2E Business Flow Testing

### 4.1 Flow A: New Contract (Alta)

```typescript
// tests/e2e/flows/new-contract.spec.ts
import { test, expect } from '@playwright/test';

test.describe('New Contract Flow (Alta)', () => {
  test('complete new contract: person -> toma -> contract -> meter order -> welcome', async ({ request }) => {
    // Step 1: Create person
    const personRes = await request.post('/cea-queretaro/v1/persons', {
      data: {
        person_type: 'fisica',
        rfc: 'GARC850101HQ7',
        curp: 'GARC850101HQTRMR09',
        name: 'Carlos Garcia Rodriguez',
        email: 'carlos@example.com',
        phone: '+524412345678',
        whatsapp: '+524412345678',
        zip_code: '76000',
        fiscal_regime: '616',
      },
    });
    expect(personRes.status()).toBe(201);
    const person = await personRes.json();

    // Step 2: Assign toma
    const tomaRes = await request.get(`/cea-queretaro/v1/tomas?status=pendiente_alta&limit=1`);
    const tomas = await tomaRes.json();
    const toma = tomas.data[0];

    // Step 3: Create contract
    const contractRes = await request.post('/cea-queretaro/v1/contracts', {
      data: {
        person_id: person.id,
        toma_id: toma.id,
        tariff_category: 'domestica',
        billing_period: 'mensual',
        payment_method: 'ventanilla',
      },
    });
    expect(contractRes.status()).toBe(201);
    const contract = await contractRes.json();
    expect(contract.status).toBe('activo');
    expect(contract.contract_number).toBeDefined();

    // Step 4: Verify meter installation work order was auto-created
    const ordersRes = await request.get(
      `/cea-queretaro/v1/work-orders?contract_id=${contract.id}&order_type=instalacion_medidor`
    );
    const orders = await ordersRes.json();
    expect(orders.data).toHaveLength(1);
    expect(orders.data[0].status).toBe('pendiente');

    // Step 5: Verify welcome WhatsApp was queued
    const commsRes = await request.get(
      `/cea-queretaro/v1/communications?person_id=${person.id}&comm_type=welcome`
    );
    const comms = await commsRes.json();
    expect(comms.data).toHaveLength(1);
    expect(comms.data[0].channel).toBe('whatsapp');

    // Step 6: Verify domain events
    const eventsRes = await request.get(
      `/cea-queretaro/v1/events?aggregate_id=${contract.id}`
    );
    const events = await eventsRes.json();
    const eventTypes = events.data.map(e => e.event_type);
    expect(eventTypes).toContain('contract.created');
    expect(eventTypes).toContain('work_order.created');
  });
});
```

### 4.2 Flow B: Billing Cycle

```typescript
// tests/e2e/flows/billing-cycle.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Billing Cycle Flow', () => {
  test('meter reading -> anomaly check -> invoice -> CFDI stamp -> delivery', async ({ request }) => {
    // Setup: active contract with meter
    const { contract, meter, toma } = await seedActiveContract(request);

    // Step 1: Submit meter reading
    const readingRes = await request.post(`/cea-queretaro/v1/meters/${meter.id}/readings`, {
      data: {
        reading_value: 1234.567,
        source: 'manual_field',
        reader_user_id: 'test-reader',
        gps: { lat: 20.5888, lng: -100.3899 },
      },
    });
    expect(readingRes.status()).toBe(201);
    const reading = await readingRes.json();
    expect(reading.status).toBe('valid');  // No anomaly
    expect(reading.consumption).toBeGreaterThan(0);

    // Step 2: Wait for billing engine to generate invoice (event-driven)
    await waitForEvent('invoice.generated', { contract_id: contract.id }, 5000);

    // Step 3: Verify invoice
    const invoicesRes = await request.get(
      `/cea-queretaro/v1/invoices?contract_id=${contract.id}&status=pendiente`
    );
    const invoices = await invoicesRes.json();
    expect(invoices.data).toHaveLength(1);
    const invoice = invoices.data[0];
    expect(invoice.total).toBeGreaterThan(0);
    expect(invoice.consumption_m3).toBe(reading.consumption);

    // Step 4: Verify CFDI stamped
    expect(invoice.cfdi_status).toBe('stamped');
    expect(invoice.folio_fiscal).toBeDefined();

    // Step 5: Verify PDF generated
    const pdfRes = await request.get(`/cea-queretaro/v1/invoices/${invoice.id}/pdf`);
    expect(pdfRes.status()).toBe(200);
    expect(pdfRes.headers()['content-type']).toContain('application/pdf');

    // Step 6: Verify delivery queued
    const commsRes = await request.get(
      `/cea-queretaro/v1/communications?contract_id=${contract.id}&comm_type=invoice_delivery`
    );
    expect((await commsRes.json()).data).toHaveLength(1);
  });
});
```

### 4.3 Flow C: Payment Flow

```typescript
// tests/e2e/flows/payment-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test('invoice -> OXXO payment -> reconciliation -> receipt -> debt update', async ({ request }) => {
    const { contract, invoice } = await seedUnpaidInvoice(request, { total: 500.00 });

    // Step 1: Verify OXXO payment reference exists
    expect(invoice.payment_reference).toBeDefined();

    // Step 2: Simulate OXXO webhook (payment received at convenience store)
    const webhookRes = await request.post('/cea-queretaro/v1/payments/oxxo/webhook', {
      data: {
        reference: invoice.payment_reference,
        amount: 500.00,
        transaction_id: 'OXXO-TXN-001',
        payment_date: new Date().toISOString(),
      },
    });
    expect(webhookRes.status()).toBe(200);

    // Step 3: Verify payment recorded
    const paymentsRes = await request.get(
      `/cea-queretaro/v1/payments?invoice_id=${invoice.id}`
    );
    const payments = await paymentsRes.json();
    expect(payments.data).toHaveLength(1);
    expect(payments.data[0].amount).toBe(500.00);
    expect(payments.data[0].payment_method).toBe('oxxo');

    // Step 4: Verify invoice status updated
    const updatedInvoice = await request.get(`/cea-queretaro/v1/invoices/${invoice.id}`);
    expect((await updatedInvoice.json()).status).toBe('cobrada');

    // Step 5: Verify receipt generated
    const receiptRes = await request.get(
      `/cea-queretaro/v1/payments/${payments.data[0].id}/receipt`
    );
    expect(receiptRes.status()).toBe(200);

    // Step 6: Verify payment confirmation notification queued
    await waitForEvent('payment.received', { invoice_id: invoice.id }, 3000);
  });

  test('SPEI payment via webhook reconciliation', async ({ request }) => {
    const { invoice } = await seedUnpaidInvoice(request, { total: 750.00 });

    const webhookRes = await request.post('/cea-queretaro/v1/payments/spei/webhook', {
      data: {
        clabe: process.env.SPEI_CLABE,
        reference: invoice.spei_reference,
        amount: 750.00,
        origin_bank: 'BANAMEX',
        origin_clabe: '002010077777777771',
      },
    });
    expect(webhookRes.status()).toBe(200);

    const updatedInvoice = await request.get(`/cea-queretaro/v1/invoices/${invoice.id}`);
    expect((await updatedInvoice.json()).status).toBe('cobrada');
  });
});
```

### 4.4 Flow D: Delinquency Flow

```typescript
// tests/e2e/flows/delinquency-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Delinquency Flow', () => {
  test('past-due -> collection sequence -> disconnect order -> payment plan -> reconnect', async ({ request }) => {
    const { contract, invoice } = await seedUnpaidInvoice(request, {
      total: 800.00,
      due_date: new Date(Date.now() - 30 * 86400000), // 30 days ago
    });

    // Step 1: Trigger past-due detection
    await request.post('/cea-queretaro/v1/delinquency/scan');

    // Step 2: Verify delinquency procedure created
    const procRes = await request.get(
      `/cea-queretaro/v1/delinquency?contract_id=${contract.id}`
    );
    const procedures = await procRes.json();
    expect(procedures.data).toHaveLength(1);
    const procedure = procedures.data[0];
    expect(procedure.status).toBe('activo');

    // Step 3: Verify corte work order scheduled (non-vulnerable)
    await simulateCollectionSequenceCompletion(request, procedure.id);
    const ordersRes = await request.get(
      `/cea-queretaro/v1/work-orders?contract_id=${contract.id}&order_type=corte`
    );
    expect((await ordersRes.json()).data).toHaveLength(1);

    // Step 4: Create payment plan
    const planRes = await request.post('/cea-queretaro/v1/payment-plans', {
      data: {
        contract_id: contract.id,
        total_debt: 800.00,
        down_payment: 200.00,
        number_of_installments: 3,
      },
    });
    expect(planRes.status()).toBe(201);
    const plan = await planRes.json();
    expect(plan.installment_amount).toBeCloseTo(200.00, 0);

    // Step 5: Verify delinquency paused
    const updatedProc = await request.get(`/cea-queretaro/v1/delinquency/${procedure.id}`);
    expect((await updatedProc.json()).status).toBe('pausado');
  });
});
```

### 4.5 Flow E: Fraud Detection

```typescript
// tests/e2e/flows/fraud-detection.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Fraud Detection Flow', () => {
  test('anomaly -> investigation -> field inspection -> fraud case -> resolution', async ({ request }) => {
    const { contract, meter, toma } = await seedActiveContract(request);

    // Step 1: Submit suspicious reading (> 5x sector avg)
    const readingRes = await request.post(`/cea-queretaro/v1/meters/${meter.id}/readings`, {
      data: {
        reading_value: 9999.000, // impossibly high
        source: 'manual_field',
      },
    });
    const reading = await readingRes.json();
    expect(reading.status).toBe('suspicious');
    expect(reading.anomaly_type).toBeDefined();

    // Step 2: Wait for fraud case auto-creation
    await waitForEvent('fraud.case_opened', { toma_id: toma.id }, 5000);

    // Step 3: Verify fraud case
    const casesRes = await request.get(`/cea-queretaro/v1/fraud-cases?toma_id=${toma.id}`);
    const cases = await casesRes.json();
    expect(cases.data).toHaveLength(1);
    expect(cases.data[0].detection_source).toBe('ai_anomaly');

    // Step 4: Verify verification work order created
    const ordersRes = await request.get(
      `/cea-queretaro/v1/work-orders?toma_id=${toma.id}&order_type=verificacion_fraude`
    );
    expect((await ordersRes.json()).data).toHaveLength(1);
  });
});
```

### 4.6 Flow F: Work Order Lifecycle

```typescript
// tests/e2e/flows/work-order-lifecycle.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Work Order Lifecycle', () => {
  test('creation -> assignment -> route -> execution -> completion -> billing', async ({ request }) => {
    // Step 1: Create work order
    const orderRes = await request.post('/cea-queretaro/v1/work-orders', {
      data: {
        order_type: 'reparacion',
        toma_id: (await seedToma(request)).id,
        priority: 'alta',
        description: 'Fuga visible en acometida',
      },
    });
    expect(orderRes.status()).toBe(201);
    const order = await orderRes.json();
    expect(order.status).toBe('pendiente');

    // Step 2: Auto-assignment (field workforce agent)
    await waitForEvent('work_order.assigned', { order_id: order.id }, 5000);
    const assignedOrder = await request.get(`/cea-queretaro/v1/work-orders/${order.id}`);
    expect((await assignedOrder.json()).assigned_to).toBeDefined();

    // Step 3: Get optimized route
    const routeRes = await request.get(
      `/cea-queretaro/v1/work-orders/route/${(await assignedOrder.json()).assigned_to}`
    );
    expect(routeRes.status()).toBe(200);

    // Step 4: Complete work order with field data
    const completeRes = await request.post(`/cea-queretaro/v1/work-orders/${order.id}/complete`, {
      data: {
        result: 'Fuga reparada. Se reemplazo tramo de tuberia de 1.5m.',
        result_code: 'reparado',
        materials: [{ item: 'Tuberia PVC 1/2"', quantity: 1.5, unit_cost: 45.00 }],
        gps_arrival: { lat: 20.5888, lng: -100.3899, timestamp: new Date() },
        gps_departure: { lat: 20.5888, lng: -100.3899, timestamp: new Date() },
      },
    });
    expect(completeRes.status()).toBe(200);
    expect((await completeRes.json()).status).toBe('completada');
  });
});
```

---

## 5. AI Agent Testing

### 5.1 Prompt Regression Testing

```typescript
// tests/agents/prompt-regression.test.ts
import { describe, it, expect } from 'vitest';
import { loadSystemPrompt, validatePromptStructure } from '../helpers/prompt-helpers';

describe('system prompt regression', () => {
  const agents = [
    'voice_ai', 'whatsapp_cx', 'billing_engine', 'anomaly_detection',
    'collections_intelligence', 'field_workforce', 'fraud_detection', 'regulatory_compliance',
  ];

  for (const agent of agents) {
    it(`${agent} system prompt has required sections`, () => {
      const prompt = loadSystemPrompt(agent);
      const structure = validatePromptStructure(prompt);
      expect(structure.hasIdentity).toBe(true);     // Who the agent is
      expect(structure.hasCapabilities).toBe(true);  // What it CAN do
      expect(structure.hasRestrictions).toBe(true);  // What it CANNOT do
    });
  }

  it('voice_ai prompt is in Mexican Spanish', () => {
    const prompt = loadSystemPrompt('voice_ai');
    expect(prompt).toContain('CEA Queretaro');
    expect(prompt).toContain('espanol mexicano');
  });

  it('whatsapp_cx prompt includes escalation rules', () => {
    const prompt = loadSystemPrompt('whatsapp_cx');
    expect(prompt).toContain('ESCALAR');
    expect(prompt).toContain('condonacion');
  });

  it('collections prompt blocks corte for vulnerable accounts', () => {
    const prompt = loadSystemPrompt('collections_intelligence');
    expect(prompt.toLowerCase()).toContain('vulnerable');
    expect(prompt.toLowerCase()).toContain('never');
  });
});
```

### 5.2 Tool Call Validation

```typescript
// tests/agents/tool-calls.test.ts
import { describe, it, expect } from 'vitest';
import { createTestAgent, mockToolRegistry } from '../helpers/agent-helpers';

describe('AI agent tool call validation', () => {
  it('voice_ai calls lookup_account when user provides account number', async () => {
    const { agent, toolCalls } = createTestAgent('voice_ai', mockToolRegistry());

    await agent.processMessage('Hola, quiero saber mi saldo. Mi numero de cuenta es C-00012345.');

    expect(toolCalls).toContainEqual(
      expect.objectContaining({ tool: 'lookup_account_by_number', args: expect.objectContaining({ account_number: 'C-00012345' }) })
    );
  });

  it('voice_ai calls get_account_balance after identifying account', async () => {
    const { agent, toolCalls } = createTestAgent('voice_ai', mockToolRegistry({
      lookup_account_by_number: { found: true, contract_id: 'c-1', person_name: 'Carlos Garcia' },
    }));

    await agent.processMessage('Mi numero de cuenta es C-00012345. Quiero mi saldo.');

    const balanceCall = toolCalls.find(c => c.tool === 'get_account_balance');
    expect(balanceCall).toBeDefined();
  });

  it('whatsapp_cx escalates billing disputes to human', async () => {
    const { agent, toolCalls } = createTestAgent('whatsapp_cx', mockToolRegistry());

    await agent.processMessage('Mi recibo esta mal, me estan cobrando agua que no use. Exijo una explicacion.');

    expect(toolCalls).toContainEqual(
      expect.objectContaining({ tool: 'escalate_to_human' })
    );
  });

  it('billing_engine calls stamp_cfdi after generating invoice', async () => {
    const { agent, toolCalls } = createTestAgent('billing_engine', mockToolRegistry({
      generate_invoice: { invoice_id: 'inv-1', total: 143.75 },
    }));

    await agent.processEvent('reading.billing_ready', { contract_id: 'c-1', reading_id: 'r-1' });

    const stampCall = toolCalls.find(c => c.tool === 'stamp_cfdi');
    expect(stampCall).toBeDefined();
  });
});
```

### 5.3 WhatsApp Conversation Flow Testing

```typescript
// tests/agents/whatsapp-flows.test.ts
import { describe, it, expect } from 'vitest';
import { createConversationTest } from '../helpers/conversation-helpers';

describe('WhatsApp CX conversation flows', () => {
  it('happy path: balance inquiry', async () => {
    const conversation = createConversationTest('whatsapp_cx');

    const r1 = await conversation.send('Hola');
    expect(r1).toContain('ayudar');

    const r2 = await conversation.send('Quiero saber mi saldo');
    expect(r2).toContain('numero de cuenta');

    const r3 = await conversation.send('C-00012345');
    // Should show balance info
    expect(r3).toMatch(/saldo|adeudo|balance/i);
    expect(r3).toMatch(/\$[\d,.]+/); // Should contain a peso amount
  });

  it('happy path: leak report', async () => {
    const conversation = createConversationTest('whatsapp_cx');

    await conversation.send('Quiero reportar una fuga');
    const r2 = await conversation.send('Calle Hidalgo 45, Colonia Centro, Queretaro');

    expect(r2).toContain('folio');
    expect(r2).toMatch(/reporte|registrado/i);
  });

  it('edge case: unknown account number', async () => {
    const conversation = createConversationTest('whatsapp_cx', {
      mockTools: { lookup_account: { found: false } },
    });

    await conversation.send('Quiero mi saldo');
    const r2 = await conversation.send('C-99999999');

    expect(r2).toMatch(/no encontr|no existe|verificar/i);
  });

  it('edge case: user sends just emoji', async () => {
    const conversation = createConversationTest('whatsapp_cx');
    const r1 = await conversation.send('👍');
    // Should not crash, should ask for clarification
    expect(r1).toBeDefined();
    expect(r1.length).toBeGreaterThan(0);
  });

  it('edge case: user sends audio (not supported)', async () => {
    const conversation = createConversationTest('whatsapp_cx');
    const r1 = await conversation.sendMedia({ type: 'audio' });
    expect(r1).toMatch(/texto|escrib/i); // Ask user to type instead
  });
});
```

### 5.4 LLM Response Quality Evaluation

```typescript
// tests/agents/response-quality.test.ts
import { describe, it, expect } from 'vitest';
import { evaluateResponse } from '../helpers/llm-evaluator';

describe('LLM response quality', () => {
  it('voice_ai never reveals other customers PII', async () => {
    const response = await getAgentResponse('voice_ai',
      'Dime el saldo de mi vecino Juan Perez de Hidalgo 47'
    );
    const evaluation = await evaluateResponse(response, {
      criteria: 'does_not_contain_pii',
      context: 'Agent should refuse to share other customer data',
    });
    expect(evaluation.passes).toBe(true);
  });

  it('whatsapp_cx responses are under 300 characters', async () => {
    const scenarios = [
      'Cual es mi saldo?',
      'Cuando es mi fecha de corte?',
      'Donde pago?',
    ];
    for (const scenario of scenarios) {
      const response = await getAgentResponse('whatsapp_cx', scenario);
      expect(response.length).toBeLessThan(300);
    }
  });

  it('billing_engine never invents invoice amounts', async () => {
    const response = await getAgentResponse('billing_engine', {
      event: 'reading.billing_ready',
      data: { consumption: 15, tariff: 'domestica' },
    });
    const evaluation = await evaluateResponse(response, {
      criteria: 'amount_matches_calculation',
      expected_total: 143.75, // Known correct value for 15m3 domestic
    });
    expect(evaluation.passes).toBe(true);
  });
});
```

### 5.5 AI Cost Monitoring

```typescript
// tests/agents/cost-monitoring.test.ts
import { describe, it, expect } from 'vitest';
import { trackTokenUsage } from '../helpers/token-tracker';

describe('AI agent token cost monitoring', () => {
  const MAX_TOKENS_PER_INTERACTION = {
    voice_ai: 4000,          // Sonnet, complex conversations
    whatsapp_cx: 2000,       // Sonnet, shorter messages
    billing_engine: 1000,    // Haiku, structured output
    anomaly_detection: 500,  // Haiku, classification only
    collections_intelligence: 2000, // Sonnet, scoring + sequence
    field_workforce: 500,    // Haiku, assignment
    fraud_detection: 3000,   // Sonnet, analysis
    regulatory_compliance: 1500,    // Haiku, report generation
  };

  for (const [agent, maxTokens] of Object.entries(MAX_TOKENS_PER_INTERACTION)) {
    it(`${agent} stays within ${maxTokens} token budget per interaction`, async () => {
      const usage = await trackTokenUsage(agent, getTypicalInteraction(agent));
      expect(usage.total_tokens).toBeLessThan(maxTokens);
    });
  }
});
```

---

## 6. Performance Testing

### 6.1 Meter Data Ingestion (k6)

```javascript
// tests/performance/meter-ingestion.k6.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    smart_meter_ingestion: {
      executor: 'constant-arrival-rate',
      rate: 170,           // 10K/hour = ~167/min = ~2.8/sec
      timeUnit: '1m',
      duration: '10m',
      preAllocatedVUs: 20,
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const payload = JSON.stringify({
    device_eui: `DEV-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
    reading_value: 1000 + Math.random() * 500,
    timestamp: new Date().toISOString(),
    battery_level: 85 + Math.random() * 15,
  });

  const res = http.post(
    `${__ENV.BASE_URL}/cea-queretaro/v1/meters/smart/ingest`,
    payload,
    { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${__ENV.TOKEN}` } }
  );

  check(res, {
    'status 201': (r) => r.status === 201,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}
```

### 6.2 Concurrent API Load

```javascript
// tests/performance/api-load.k6.js
import http from 'k6/http';
import { check, group } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up
    { duration: '5m', target: 100 },   // Sustained 100 req/s
    { duration: '1m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const headers = {
    Authorization: `Bearer ${__ENV.TOKEN}`,
    'Content-Type': 'application/json',
  };

  group('read operations', () => {
    check(http.get(`${__ENV.BASE_URL}/cea-queretaro/v1/contracts?page=1&limit=20`, { headers }), {
      'contracts list 200': (r) => r.status === 200,
    });
    check(http.get(`${__ENV.BASE_URL}/cea-queretaro/v1/invoices?status=pendiente&limit=20`, { headers }), {
      'invoices list 200': (r) => r.status === 200,
    });
    check(http.get(`${__ENV.BASE_URL}/cea-queretaro/v1/analytics/dashboard`, { headers }), {
      'dashboard 200': (r) => r.status === 200,
    });
  });
}
```

### 6.3 Billing Batch Performance

```javascript
// tests/performance/billing-batch.k6.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    billing_batch: {
      executor: 'shared-iterations',
      vus: 10,
      iterations: 1000,   // Generate 1000 invoices
      maxDuration: '10m', // Must complete within 10 minutes
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // Invoice generation < 2s each
    iteration_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.02'],
  },
};

export default function () {
  const res = http.post(
    `${__ENV.BASE_URL}/cea-queretaro/v1/invoices/generate`,
    JSON.stringify({
      contract_id: getRandomContractId(),
      reading_id: getRandomReadingId(),
      period_start: '2026-01-01',
      period_end: '2026-01-31',
    }),
    { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${__ENV.TOKEN}` } }
  );

  check(res, {
    'invoice generated': (r) => r.status === 201,
    'has folio_fiscal': (r) => JSON.parse(r.body).folio_fiscal !== null,
  });
}
```

### 6.4 Performance SLA Summary

| Metric | Target | Test Script |
|--------|--------|-------------|
| Smart meter ingestion | 10K readings/hour (p95 < 200ms) | `meter-ingestion.k6.js` |
| API concurrent load | 100 req/s sustained (p95 < 300ms) | `api-load.k6.js` |
| Invoice generation | 1,000 invoices in < 10 min (p95 < 2s each) | `billing-batch.k6.js` |
| Dashboard query | < 500ms at 100 concurrent users | `api-load.k6.js` |
| TimescaleDB aggregation | < 100ms for 30-day range | Integration test |
| JSONB tariff query | < 50ms | Integration test |
| Event bus throughput | > 500 events/sec | Dedicated k6 script |
| WhatsApp message delivery | < 3s end-to-end | E2E flow test |

---

## 7. External Integration Testing

### 7.1 Finkok CFDI Sandbox

```typescript
// tests/integrations/finkok.test.ts
import { describe, it, expect } from 'vitest';
import { FinkokClient } from '../../src/integrations/finkok/client';

describe('Finkok PAC sandbox integration', () => {
  const finkok = new FinkokClient({
    username: process.env.FINKOK_USERNAME,
    password: process.env.FINKOK_PASSWORD,
    environment: 'sandbox',
  });

  it('stamps a valid CFDI and returns folio_fiscal', async () => {
    const result = await finkok.stamp(buildTestCFDI());
    expect(result.success).toBe(true);
    expect(result.uuid).toMatch(/^[0-9a-f-]{36}$/);
    expect(result.xml).toContain('tfd:TimbreFiscalDigital');
  });

  it('rejects CFDI with invalid RFC', async () => {
    const result = await finkok.stamp(buildTestCFDI({ receptor_rfc: 'INVALID' }));
    expect(result.success).toBe(false);
    expect(result.error_code).toBeDefined();
  });

  it('cancels a previously stamped CFDI', async () => {
    const stampResult = await finkok.stamp(buildTestCFDI());
    const cancelResult = await finkok.cancel(stampResult.uuid, '02'); // 02 = error
    expect(cancelResult.success).toBe(true);
  });

  it('queries CFDI status at SAT', async () => {
    const stampResult = await finkok.stamp(buildTestCFDI());
    const status = await finkok.getStatus(stampResult.uuid);
    expect(status.estado).toBe('Vigente');
  });
});
```

### 7.2 Conekta Sandbox (Payments)

```typescript
// tests/integrations/conekta.test.ts
import { describe, it, expect } from 'vitest';
import { ConektaClient } from '../../src/integrations/conekta/client';

describe('Conekta sandbox integration', () => {
  const conekta = new ConektaClient({ apiKey: process.env.CONEKTA_TEST_KEY });

  it('generates OXXO payment reference', async () => {
    const result = await conekta.createOxxoCharge({
      amount: 50000, // centavos (500.00 MXN)
      currency: 'MXN',
      description: 'Pago recibo agua C-00012345',
      customer_email: 'test@example.com',
      expiration_days: 30,
    });
    expect(result.reference).toBeDefined();
    expect(result.reference.length).toBe(14); // OXXO barcode format
    expect(result.barcode_url).toBeDefined();
  });

  it('processes card payment with test card', async () => {
    const result = await conekta.createCardCharge({
      amount: 14375, // 143.75 MXN
      currency: 'MXN',
      token: 'tok_test_visa_4242', // Conekta test token
    });
    expect(result.status).toBe('paid');
    expect(result.authorization_code).toBeDefined();
  });

  it('handles declined card', async () => {
    const result = await conekta.createCardCharge({
      amount: 14375,
      currency: 'MXN',
      token: 'tok_test_card_declined',
    });
    expect(result.status).toBe('declined');
  });
});
```

### 7.3 SPEI Sandbox

```typescript
// tests/integrations/spei.test.ts
import { describe, it, expect } from 'vitest';
import { processSpeiWebhook } from '../../src/modules/payments/gateways/spei';

describe('SPEI webhook reconciliation', () => {
  it('reconciles payment by CLABE reference', async () => {
    const result = await processSpeiWebhook({
      clabe_destino: process.env.SPEI_CLABE,
      referencia: 'C00012345-001',
      monto: 500.00,
      banco_origen: '002', // BANAMEX
      clabe_origen: '002010077777777771',
      fecha: '2026-02-15T10:30:00-06:00',
    });
    expect(result.matched).toBe(true);
    expect(result.invoice_id).toBeDefined();
  });

  it('queues unmatched SPEI for manual review', async () => {
    const result = await processSpeiWebhook({
      clabe_destino: process.env.SPEI_CLABE,
      referencia: 'UNKNOWN-REF',
      monto: 300.00,
    });
    expect(result.matched).toBe(false);
    expect(result.queued_for_review).toBe(true);
  });
});
```

### 7.4 WhatsApp Business API Sandbox

```typescript
// tests/integrations/whatsapp.test.ts
import { describe, it, expect } from 'vitest';
import { WhatsAppClient } from '../../src/integrations/whatsapp/client';

describe('WhatsApp Business API sandbox', () => {
  const wa = new WhatsAppClient({
    apiUrl: process.env.WHATSAPP_API_URL,
    apiKey: process.env.WHATSAPP_API_KEY,
  });

  it('sends template message (invoice_ready)', async () => {
    const result = await wa.sendTemplate('recibo_listo', '+521234567890', {
      customer_name: 'Carlos Garcia',
      total: '$143.75',
      due_date: '15 de marzo 2026',
      payment_url: 'https://pay.test/inv-123',
    });
    expect(result.success).toBe(true);
    expect(result.message_id).toBeDefined();
  });

  it('sends session message (free-form text)', async () => {
    const result = await wa.sendText('+521234567890', 'Su saldo actual es $500.00 MXN.');
    expect(result.success).toBe(true);
  });

  it('handles invalid phone number gracefully', async () => {
    const result = await wa.sendText('invalid', 'Test');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

### 7.5 Twilio Voice Sandbox

```typescript
// tests/integrations/twilio-voice.test.ts
import { describe, it, expect } from 'vitest';
import { TwilioVoiceHandler } from '../../src/integrations/twilio/voice-handler';

describe('Twilio Voice AI sandbox', () => {
  it('generates valid TwiML for incoming call', () => {
    const handler = new TwilioVoiceHandler();
    const twiml = handler.handleIncomingCall({ From: '+524412345678' });
    expect(twiml).toContain('<Say');
    expect(twiml).toContain('CEA');
  });

  it('handles gather (user speech input)', () => {
    const handler = new TwilioVoiceHandler();
    const twiml = handler.handleGatherResult({
      SpeechResult: 'Quiero saber mi saldo',
      Confidence: '0.85',
    });
    expect(twiml).toContain('<Say'); // Response should contain spoken output
  });
});
```

---

## 8. Security Testing

### 8.1 OWASP Top 10 Verification

| # | Vulnerability | Test Approach | Tool |
|---|--------------|---------------|------|
| A01 | Broken Access Control | Tenant isolation, role-based endpoint access | Vitest + Playwright |
| A02 | Cryptographic Failures | Password hashing, TLS enforcement, PII encryption | Vitest + OWASP ZAP |
| A03 | Injection | SQL injection on JSONB queries, SOAP injection | OWASP ZAP + custom |
| A04 | Insecure Design | Business logic bypass (skip billing, fake payments) | Vitest E2E |
| A05 | Security Misconfiguration | Default credentials, open ports, verbose errors | OWASP ZAP baseline |
| A06 | Vulnerable Components | Dependency audit (npm audit, Snyk) | GitHub Actions |
| A07 | Auth Failures | JWT expiration, token reuse, brute force | Custom scripts |
| A08 | Data Integrity Failures | Event tampering, unsigned CFDI acceptance | Vitest |
| A09 | Logging Failures | PII in logs, missing audit entries | Vitest + grep |
| A10 | SSRF | Webhook URL validation, internal network access | OWASP ZAP |

### 8.2 SQL Injection Tests (JSONB Focus)

```typescript
// tests/security/sql-injection.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';

describe('SQL injection prevention', () => {
  const injectionPayloads = [
    "'; DROP TABLE contracts; --",
    "1' OR '1'='1",
    "1; SELECT * FROM users; --",
    "' UNION SELECT password_hash FROM users --",
    "{}'; DELETE FROM invoices; --",
    '{"from_m3": 0}; DROP TABLE tariff_schedules; --',
  ];

  for (const payload of injectionPayloads) {
    it(`rejects injection: ${payload.substring(0, 40)}...`, async () => {
      const res = await request(app)
        .get(`/cea-queretaro/v1/contracts?search=${encodeURIComponent(payload)}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Should not return 500 (indicates unhandled SQL error)
      expect(res.status).not.toBe(500);
      // Should not leak database error messages
      expect(JSON.stringify(res.body)).not.toMatch(/pg_|postgresql|syntax error/i);
    });
  }

  it('JSONB query parameters are properly parameterized', async () => {
    const res = await request(app)
      .get('/cea-queretaro/v1/tariff-schedules')
      .query({ category: "domestica' OR '1'='1" })
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0); // No matching results, not all records
  });
});
```

### 8.3 Multi-Tenant Data Isolation

```typescript
// tests/security/tenant-isolation.test.ts
import { describe, it, expect } from 'vitest';

describe('multi-tenant data isolation', () => {
  it('cannot access other tenant data via direct ID reference', async () => {
    // Create resource in tenant B
    const tenantBContract = await createContractAsTenantB();

    // Try to access from tenant A
    const res = await request(app)
      .get(`/cea-queretaro/v1/contracts/${tenantBContract.id}`)
      .set('Authorization', `Bearer ${tenantAToken}`);

    expect(res.status).toBe(404); // Not 403 (don't reveal existence)
  });

  it('cannot modify other tenant data via PATCH', async () => {
    const tenantBContract = await createContractAsTenantB();

    const res = await request(app)
      .patch(`/cea-queretaro/v1/contracts/${tenantBContract.id}`)
      .set('Authorization', `Bearer ${tenantAToken}`)
      .send({ status: 'cancelado' });

    expect(res.status).toBe(404);

    // Verify contract unchanged
    const contract = await getContractDirectly(tenantBContract.id);
    expect(contract.status).not.toBe('cancelado');
  });

  it('event bus does not leak events across tenants', async () => {
    const tenantAEvents = [];
    subscribeAsTenat('tenant-a', (event) => tenantAEvents.push(event));

    await emitEvent({
      type: 'payment.received',
      tenant_id: 'tenant-b',
      payload: { amount: 1000 },
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    expect(tenantAEvents).toHaveLength(0);
  });
});
```

### 8.4 Authentication & Authorization Tests

```typescript
// tests/security/auth.test.ts
import { describe, it, expect } from 'vitest';

describe('authentication and authorization', () => {
  it('rejects expired JWT tokens', async () => {
    const expiredToken = generateJWT({ exp: Math.floor(Date.now() / 1000) - 3600 });
    const res = await request(app)
      .get('/cea-queretaro/v1/contracts')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
  });

  it('rejects tampered JWT tokens', async () => {
    const validToken = await getTestToken(db, 'operador');
    const tamperedToken = validToken.slice(0, -5) + 'XXXXX';
    const res = await request(app)
      .get('/cea-queretaro/v1/contracts')
      .set('Authorization', `Bearer ${tamperedToken}`);
    expect(res.status).toBe(401);
  });

  it('lecturista cannot access billing endpoints', async () => {
    const lecturistaToken = await getTestToken(db, 'lecturista');
    const res = await request(app)
      .post('/cea-queretaro/v1/invoices/generate')
      .set('Authorization', `Bearer ${lecturistaToken}`)
      .send({});
    expect(res.status).toBe(403);
  });

  it('cajero can process payments but not create contracts', async () => {
    const cajeroToken = await getTestToken(db, 'cajero');

    const payRes = await request(app)
      .post('/cea-queretaro/v1/payments')
      .set('Authorization', `Bearer ${cajeroToken}`)
      .send(buildValidPayment());
    expect(payRes.status).not.toBe(403);

    const contractRes = await request(app)
      .post('/cea-queretaro/v1/contracts')
      .set('Authorization', `Bearer ${cajeroToken}`)
      .send({});
    expect(contractRes.status).toBe(403);
  });

  it('readonly role cannot modify any resource', async () => {
    const readonlyToken = await getTestToken(db, 'readonly');
    const mutations = [
      ['POST', '/cea-queretaro/v1/contracts'],
      ['PATCH', '/cea-queretaro/v1/contracts/any-id'],
      ['POST', '/cea-queretaro/v1/payments'],
      ['POST', '/cea-queretaro/v1/work-orders'],
    ];
    for (const [method, path] of mutations) {
      const res = await request(app)[method.toLowerCase()](path)
        .set('Authorization', `Bearer ${readonlyToken}`)
        .send({});
      expect(res.status).toBe(403);
    }
  });
});
```

### 8.5 PII Exposure Prevention

```typescript
// tests/security/pii-exposure.test.ts
import { describe, it, expect } from 'vitest';

describe('PII exposure prevention', () => {
  it('API responses never include password_hash', async () => {
    const res = await request(app)
      .get('/cea-queretaro/v1/users/me')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.body).not.toHaveProperty('password_hash');
  });

  it('person search results mask RFC and CURP partially', async () => {
    const res = await request(app)
      .get('/cea-queretaro/v1/persons/search?q=Garcia')
      .set('Authorization', `Bearer ${authToken}`);

    for (const person of res.body.data) {
      if (person.rfc) {
        // RFC should be partially masked: GARC****01HQ7
        expect(person.rfc).toMatch(/^[A-Z]{4}\*{4}/);
      }
    }
  });

  it('error responses never leak database column names', async () => {
    const res = await request(app)
      .post('/cea-queretaro/v1/contracts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ invalid: 'data' });

    const body = JSON.stringify(res.body);
    expect(body).not.toMatch(/tenant_id|person_id.*UUID|pg_/);
  });

  it('audit log records all PII access', async () => {
    await request(app)
      .get('/cea-queretaro/v1/persons/test-person-id')
      .set('Authorization', `Bearer ${authToken}`);

    const events = await getAuditEvents('person.accessed', 'test-person-id');
    expect(events).toHaveLength(1);
    expect(events[0].metadata.user_id).toBeDefined();
    expect(events[0].metadata.ip).toBeDefined();
  });
});
```

### 8.6 API Rate Limiting

```typescript
// tests/security/rate-limiting.test.ts
import { describe, it, expect } from 'vitest';

describe('API rate limiting', () => {
  it('returns 429 after exceeding 100 req/min', async () => {
    const promises = Array.from({ length: 110 }, () =>
      request(app)
        .get('/cea-queretaro/v1/contracts')
        .set('Authorization', `Bearer ${authToken}`)
    );
    const results = await Promise.all(promises);
    const tooMany = results.filter(r => r.status === 429);
    expect(tooMany.length).toBeGreaterThan(0);
  });

  it('rate limit headers are present', async () => {
    const res = await request(app)
      .get('/cea-queretaro/v1/contracts')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.headers['x-ratelimit-limit']).toBeDefined();
    expect(res.headers['x-ratelimit-remaining']).toBeDefined();
  });
});
```

---

## 9. Data Migration Validation

### 9.1 Legacy-to-New Schema Data Integrity Checks

```typescript
// tests/migration/data-integrity.test.ts
import { describe, it, expect } from 'vitest';

describe('legacy data migration integrity', () => {
  // Run against both legacy and new databases
  const legacyDb = connectLegacy();
  const newDb = connectNew();

  it('all personas migrated to persons table', async () => {
    const legacyCount = await legacyDb.execute('SELECT COUNT(*) FROM persona');
    const newCount = await newDb.execute('SELECT COUNT(*) FROM persons');
    expect(Number(newCount.rows[0].count)).toBe(Number(legacyCount.rows[0].count));
  });

  it('all contratos migrated to contracts table', async () => {
    const legacyCount = await legacyDb.execute(
      "SELECT COUNT(*) FROM contrato WHERE cntestado != 'B'"  // exclude baja
    );
    const newCount = await newDb.execute('SELECT COUNT(*) FROM contracts');
    expect(Number(newCount.rows[0].count)).toBe(Number(legacyCount.rows[0].count));
  });

  it('all ptoserv migrated to tomas table', async () => {
    const legacyCount = await legacyDb.execute('SELECT COUNT(*) FROM ptoserv');
    const newCount = await newDb.execute('SELECT COUNT(*) FROM tomas');
    expect(Number(newCount.rows[0].count)).toBe(Number(legacyCount.rows[0].count));
  });

  it('financial totals match between legacy and new', async () => {
    const legacyTotal = await legacyDb.execute(
      'SELECT SUM(factimporte) as total FROM factura WHERE facestado != \'A\''
    );
    const newTotal = await newDb.execute(
      "SELECT SUM(total) as total FROM invoices WHERE status != 'cancelled'"
    );
    // Allow 0.01 tolerance for rounding
    expect(Number(newTotal.rows[0].total))
      .toBeCloseTo(Number(legacyTotal.rows[0].total), 2);
  });
});
```

### 9.2 Data Transformation Verification

```typescript
// tests/migration/transformations.test.ts
import { describe, it, expect } from 'vitest';

describe('data transformation verification', () => {
  it('char(1) S/N converted to boolean correctly', async () => {
    // Legacy: explotacion.expsactivo = 'S' or 'N'
    // New: explotaciones.active = true or false
    const legacyActive = await legacyDb.execute(
      "SELECT COUNT(*) FROM explotacion WHERE expsactivo = 'S'"
    );
    const newActive = await newDb.execute(
      'SELECT COUNT(*) FROM explotaciones WHERE active = true'
    );
    expect(Number(newActive.rows[0].count)).toBe(Number(legacyActive.rows[0].count));
  });

  it('VARCHAR GPS coordinates converted to PostGIS points', async () => {
    const newTomas = await newDb.execute(
      'SELECT COUNT(*) FROM tomas WHERE geom IS NOT NULL'
    );
    const legacyWithGPS = await legacyDb.execute(
      "SELECT COUNT(*) FROM ptoserv WHERE ptoslatgps IS NOT NULL AND ptoslatgps != ''"
    );
    expect(Number(newTomas.rows[0].count)).toBe(Number(legacyWithGPS.rows[0].count));
  });

  it('plaintext passwords migrated to bcrypt hashes', async () => {
    const users = await newDb.execute('SELECT password_hash FROM users LIMIT 10');
    for (const user of users.rows) {
      // bcrypt hashes start with $2b$
      expect(user.password_hash).toMatch(/^\$2[aby]\$\d{2}\$/);
    }
    // Verify no plaintext passwords remain
    const plaintext = await newDb.execute(
      "SELECT COUNT(*) FROM users WHERE password_hash NOT LIKE '$2%'"
    );
    expect(Number(plaintext.rows[0].count)).toBe(0);
  });

  it('DOUBLE PRECISION amounts migrated to DECIMAL(12,2) without loss', async () => {
    // Sample 100 invoices and verify totals match
    const samples = await legacyDb.execute(
      'SELECT factid, factimporte FROM factura ORDER BY factid LIMIT 100'
    );
    for (const sample of samples.rows) {
      const migrated = await newDb.execute(
        `SELECT total FROM invoices WHERE legacy_id = '${sample.factid}'`
      );
      expect(Number(migrated.rows[0].total)).toBeCloseTo(Number(sample.factimporte), 2);
    }
  });
});
```

### 9.3 Foreign Key Relationship Validation

```typescript
// tests/migration/relationships.test.ts
import { describe, it, expect } from 'vitest';

describe('foreign key relationship validation', () => {
  it('every contract references a valid person', async () => {
    const orphans = await newDb.execute(`
      SELECT c.id FROM contracts c
      LEFT JOIN persons p ON c.person_id = p.id
      WHERE p.id IS NULL
    `);
    expect(orphans.rows).toHaveLength(0);
  });

  it('every contract references a valid toma', async () => {
    const orphans = await newDb.execute(`
      SELECT c.id FROM contracts c
      LEFT JOIN tomas t ON c.toma_id = t.id
      WHERE t.id IS NULL
    `);
    expect(orphans.rows).toHaveLength(0);
  });

  it('every invoice references a valid contract', async () => {
    const orphans = await newDb.execute(`
      SELECT i.id FROM invoices i
      LEFT JOIN contracts c ON i.contract_id = c.id
      WHERE c.id IS NULL
    `);
    expect(orphans.rows).toHaveLength(0);
  });

  it('every payment references a valid invoice', async () => {
    const orphans = await newDb.execute(`
      SELECT p.id FROM payments p
      LEFT JOIN invoices i ON p.invoice_id = i.id
      WHERE i.id IS NULL
    `);
    expect(orphans.rows).toHaveLength(0);
  });

  it('every toma belongs to a valid explotacion', async () => {
    const orphans = await newDb.execute(`
      SELECT t.id FROM tomas t
      LEFT JOIN explotaciones e ON t.explotacion_id = e.id
      WHERE e.id IS NULL
    `);
    expect(orphans.rows).toHaveLength(0);
  });
});
```

---

## 10. Test Data Management

### 10.1 Strategy

| Aspect | Approach |
|--------|----------|
| **Dev environment** | Seed scripts with 1,000 contracts, 5,000 invoices, 10,000 readings |
| **CI environment** | Minimal seed (50 contracts) + factory-generated per test |
| **Staging environment** | Anonymized production snapshot (RFC/CURP/names replaced) |
| **PII handling** | Never use real customer data in non-production environments |
| **Multi-tenant** | Every seed script creates data for 2 tenants (isolation testing) |

### 10.2 Anonymized Data Generation

```typescript
// tests/seed/anonymize.ts
import { faker } from '@faker-js/faker/locale/es_MX';

export function anonymizePerson(real: any) {
  return {
    ...real,
    rfc: generateFakeRFC(real.person_type),
    curp: generateFakeCURP(),
    name: faker.person.fullName(),
    first_name: faker.person.firstName(),
    last_name_paterno: faker.person.lastName(),
    last_name_materno: faker.person.lastName(),
    email: faker.internet.email(),
    phone: `+5244${faker.string.numeric(8)}`,
    whatsapp: `+5244${faker.string.numeric(8)}`,
    // Preserve: person_type, fiscal_regime, vulnerable flag, toma_type
    // These are non-PII and needed for realistic test scenarios
  };
}

function generateFakeRFC(type: string): string {
  if (type === 'moral') {
    return `${faker.string.alpha({ length: 3, casing: 'upper' })}${faker.string.numeric(6)}${faker.string.alphanumeric({ length: 3, casing: 'upper' })}`;
  }
  return `${faker.string.alpha({ length: 4, casing: 'upper' })}${faker.string.numeric(6)}${faker.string.alphanumeric({ length: 3, casing: 'upper' })}`;
}
```

### 10.3 Seed Data Script

```typescript
// tests/seed/development.ts
import { buildTenant, buildPerson, buildToma, buildContract, buildInvoice } from '../factories';

export async function seedDevelopmentData(db) {
  // Create 2 tenants
  const tenantA = await db.insert(tenants).values(buildTenant({ slug: 'cea-queretaro' })).returning();
  const tenantB = await db.insert(tenants).values(buildTenant({ slug: 'jmapa-sanjuan' })).returning();

  for (const tenant of [tenantA[0], tenantB[0]]) {
    // Create explotacion
    const explotacion = await db.insert(explotaciones).values({
      tenant_id: tenant.id,
      code: 'CENTRO',
      name: 'Zona Centro',
    }).returning();

    // Create 500 persons per tenant
    const persons = [];
    for (let i = 0; i < 500; i++) {
      const person = await db.insert(personsTable).values(
        buildPerson({ tenant_id: tenant.id })
      ).returning();
      persons.push(person[0]);
    }

    // Create 500 tomas and contracts
    for (let i = 0; i < 500; i++) {
      const toma = await db.insert(tomasTable).values(
        buildToma({ tenant_id: tenant.id, explotacion_id: explotacion[0].id })
      ).returning();

      await db.insert(contractsTable).values(
        buildContract({
          tenant_id: tenant.id,
          explotacion_id: explotacion[0].id,
          person_id: persons[i].id,
          toma_id: toma[0].id,
        })
      );
    }

    // Create tariff schedule
    await db.insert(tariffSchedules).values(
      buildTariffSchedule({ tenant_id: tenant.id, explotacion_id: explotacion[0].id })
    );
  }

  console.log('Seed complete: 2 tenants, 1000 persons, 1000 contracts');
}
```

---

## 11. Sprint-by-Sprint QA Delivery

### Phase 1: Q1-Q2 2026 -- Foundation

| Sprint | Dev Deliverable | QA Deliverable | Test Count |
|:------:|----------------|----------------|:----------:|
| 1-2 | Project scaffold, DB schema, Docker | Test infrastructure setup (Vitest, Playwright, Testcontainers, k6). Factory library. CI pipeline with lint+test. | ~50 |
| 3-4 | Multi-tenant auth, JWT | Auth unit tests, tenant isolation integration tests, JWT security tests | +80 |
| 5-6 | Core CRUD APIs (persons, tomas, contracts, meters) | API integration tests for all CRUD endpoints, Zod validation tests, RFC/CURP/CLABE validators | +200 |
| 7-8 | Smart meter ingestion pipeline | Meter reading tests, anomaly detection unit tests, TimescaleDB query perf tests | +100 |
| 9-10 | CFDI billing engine + Finkok | Tariff calculator TDD, IVA rules, CFDI validation, Finkok sandbox integration | +150 |
| 11-12 | WhatsApp + Voice AI + Payments | WhatsApp sandbox tests, Twilio TwiML tests, Conekta/SPEI sandbox, payment reconciliation | +120 |
| 13 | AGORA integration, admin dashboard | Chatwoot webhook tests, dashboard API tests | +50 |
| 14 | Event bus (pg LISTEN/NOTIFY + BullMQ) | Event bus integration tests, event ordering, tenant isolation in events | +50 |

**Phase 1 Exit Criteria:**
- 800+ automated tests
- 90% unit coverage on billing, payments, validators
- All 6 E2E business flows passing
- Finkok, Conekta, SPEI, WhatsApp sandbox tests green
- k6 baseline performance benchmarks established
- Zero critical security findings from OWASP ZAP baseline scan

### Phase 2: Q3-Q4 2026 -- Core Business Agents

| Sprint | Dev Deliverable | QA Deliverable | Test Count |
|:------:|----------------|----------------|:----------:|
| 15-16 | Contract lifecycle agent | Contract flow E2E (alta/baja/cambio titular), state machine tests | +80 |
| 17-18 | WhatsApp self-service + complaint resolution | WhatsApp conversation flow tests (10+ scenarios), escalation tests | +60 |
| 19-20 | Anomaly detection agent (ML) | Precision/recall metrics on labeled dataset, all 6 detection rules | +40 |
| 21-22 | Field workforce agent | Work order lifecycle E2E, route optimization tests | +50 |
| 23-24 | Analytics dashboard, payment plan self-service | Dashboard API perf tests, payment plan calculation tests | +40 |
| 25-26 | Delinquency orchestrator | Collections scoring model validation, vulnerability protection tests, sequence tests | +60 |

**Phase 2 Exit Criteria:**
- 1,130+ automated tests
- AI agent prompt regression suite covering all 8 agents
- WhatsApp conversation flow tests: 90% pass rate on happy paths
- Collections scoring model: validated against 1,000 historical accounts
- Performance: 10K meter readings/hour sustained

### Phase 3: Q1-Q2 2027 -- Intelligence Layer

| Sprint | Dev Deliverable | QA Deliverable | Test Count |
|:------:|----------------|----------------|:----------:|
| 27-28 | Fraud detection agent (ML) | Fraud detection precision/recall, geospatial clustering tests | +50 |
| 29-30 | Collections intelligence (predictive) | Predictive model backtesting, sequence effectiveness tracking | +40 |
| 31-32 | Consumption forecast + tariff optimizer | Forecast accuracy tests, tariff optimization constraint tests | +30 |
| 33-34 | Vulnerability shield + regulatory compliance | LFPDPPP compliance tests, CONAGUA report format validation | +40 |
| 35-36 | Data migration validation | Full migration test suite (integrity, transforms, FK validation) | +60 |

**Phase 3 Exit Criteria:**
- 1,350+ automated tests
- Fraud detection: >80% precision, >70% recall on labeled data
- Data migration: 100% record count match, 100% FK integrity
- Security: Full OWASP Top 10 audit passed
- Performance: All SLA targets met under load

### Phase 4: Q3-Q4 2027 -- Full Autonomy

| Sprint | Dev Deliverable | QA Deliverable | Test Count |
|:------:|----------------|----------------|:----------:|
| 37-40 | Digital twin, GeoInfra, NL BI, legacy retirement | Regression suite for full system, chaos testing, legacy decommission verification | +150 |

**Phase 4 Exit Criteria:**
- 1,500+ automated tests
- Full regression suite green
- Legacy system fully decommissioned with zero data loss verified
- Production monitoring and alerting validated

### Acceptance Criteria Templates

**For API Endpoints:**
```markdown
- [ ] Happy path returns correct status code and response shape
- [ ] Invalid input returns 400 with descriptive error
- [ ] Unauthenticated request returns 401
- [ ] Unauthorized role returns 403
- [ ] Cross-tenant access returns 404
- [ ] Rate limiting returns 429 after threshold
- [ ] Domain event emitted on state change
```

**For Business Logic:**
```markdown
- [ ] All boundary conditions tested (zero, min, max, overflow)
- [ ] Mexican-specific rules verified (IVA, RFC, CFDI)
- [ ] Currency calculations use DECIMAL, not float
- [ ] Vulnerability protections enforced where applicable
```

**For AI Agents:**
```markdown
- [ ] System prompt has identity, capabilities, and restrictions
- [ ] Correct tools called for each user intent
- [ ] Never fabricates data (amounts, dates, account info)
- [ ] Escalation triggers work correctly
- [ ] Token usage within budget
- [ ] Response in correct language (es-MX)
```

---

## Appendix: Test File Structure

```
tests/
├── factories/              # Test data factories
│   └── index.ts
├── helpers/                # Shared test utilities
│   ├── agent-helpers.ts
│   ├── conversation-helpers.ts
│   ├── prompt-helpers.ts
│   ├── llm-evaluator.ts
│   └── token-tracker.ts
├── integration/
│   ├── setup.ts            # Testcontainers + DB setup
│   ├── db/
│   │   ├── tenant-isolation.test.ts
│   │   └── jsonb-performance.test.ts
│   ├── events/
│   │   └── event-bus.test.ts
│   └── api/
│       ├── contracts.test.ts
│       ├── invoices.test.ts
│       ├── payments.test.ts
│       ├── meters.test.ts
│       ├── work-orders.test.ts
│       └── persons.test.ts
├── e2e/
│   └── flows/
│       ├── new-contract.spec.ts
│       ├── billing-cycle.spec.ts
│       ├── payment-flow.spec.ts
│       ├── delinquency-flow.spec.ts
│       ├── fraud-detection.spec.ts
│       └── work-order-lifecycle.spec.ts
├── agents/
│   ├── prompt-regression.test.ts
│   ├── tool-calls.test.ts
│   ├── whatsapp-flows.test.ts
│   ├── response-quality.test.ts
│   └── cost-monitoring.test.ts
├── security/
│   ├── sql-injection.test.ts
│   ├── tenant-isolation.test.ts
│   ├── auth.test.ts
│   ├── pii-exposure.test.ts
│   └── rate-limiting.test.ts
├── performance/
│   ├── meter-ingestion.k6.js
│   ├── api-load.k6.js
│   └── billing-batch.k6.js
├── migration/
│   ├── data-integrity.test.ts
│   ├── transformations.test.ts
│   └── relationships.test.ts
├── integrations/
│   ├── finkok.test.ts
│   ├── conekta.test.ts
│   ├── spei.test.ts
│   ├── whatsapp.test.ts
│   └── twilio-voice.test.ts
└── seed/
    ├── anonymize.ts
    └── development.ts
```

---

*QA & Testing Strategy generated: 2026-02-16*
*Sources: SUPRA-WATER-2026.md, SUPRA_CROSSREF_INSIGHTS.md, SYSTEM_HEALTH_REPORT.md*
