import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  decimal,
  integer,
  date,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { tenants } from './tenants.js';
import { invoices } from './invoices.js';
import { contracts } from './contracts.js';
import { persons } from './persons.js';
import { users } from './users.js';
import { offices } from './tenants.js';

// =============================================================
// PAYMENTS (PAGOS)
// =============================================================

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),

    // What is being paid
    invoiceId: uuid('invoice_id')
      .notNull()
      .references(() => invoices.id),
    contractId: uuid('contract_id')
      .notNull()
      .references(() => contracts.id),
    personId: uuid('person_id')
      .notNull()
      .references(() => persons.id),

    // Payment details
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    paymentDate: timestamp('payment_date', { withTimezone: true }).notNull(),
    paymentMethod: varchar('payment_method', { length: 30 }).notNull(),

    // Transaction details
    transactionReference: varchar('transaction_reference', { length: 100 }),
    authorizationCode: varchar('authorization_code', { length: 50 }),
    bankName: varchar('bank_name', { length: 100 }),
    terminalId: varchar('terminal_id', { length: 50 }),

    // Status
    status: varchar('status', { length: 20 }).notNull().default('applied'),
    reversalDate: timestamp('reversal_date', { withTimezone: true }),
    reversalReason: varchar('reversal_reason', { length: 200 }),

    // Reconciliation
    reconciled: boolean('reconciled').default(false),
    reconciliationDate: date('reconciliation_date'),
    batchId: varchar('batch_id', { length: 50 }),

    // Receipt
    receiptNumber: varchar('receipt_number', { length: 30 }),
    receiptUrl: varchar('receipt_url', { length: 500 }),

    // Source
    channel: varchar('channel', { length: 20 }).notNull(),
    cashierUserId: uuid('cashier_user_id').references(() => users.id),
    officeId: uuid('office_id').references(() => offices.id),

    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_payments_invoice').on(table.tenantId, table.invoiceId),
    index('idx_payments_contract').on(table.tenantId, table.contractId),
    index('idx_payments_date').on(table.tenantId, table.paymentDate),
  ],
);

// =============================================================
// PAYMENT PLANS (CONVENIOS DE PAGO)
// =============================================================

export const paymentPlans = pgTable('payment_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id),
  contractId: uuid('contract_id')
    .notNull()
    .references(() => contracts.id),
  personId: uuid('person_id')
    .notNull()
    .references(() => persons.id),

  totalDebt: decimal('total_debt', { precision: 12, scale: 2 }).notNull(),
  downPayment: decimal('down_payment', { precision: 12, scale: 2 }).default('0'),
  remainingBalance: decimal('remaining_balance', { precision: 12, scale: 2 }).notNull(),
  numberOfInstallments: integer('number_of_installments').notNull(),
  interestRate: decimal('interest_rate', { precision: 5, scale: 4 }).default('0'),
  installmentAmount: decimal('installment_amount', { precision: 12, scale: 2 }).notNull(),

  status: varchar('status', { length: 20 }).default('activo'),

  startDate: date('start_date').notNull(),
  nextPaymentDate: date('next_payment_date'),
  agreementDocumentUrl: varchar('agreement_document_url', { length: 500 }),

  invoiceIds: uuid('invoice_ids').array().notNull(),
  installments: jsonb('installments').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
