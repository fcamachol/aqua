---
name: new-migration
description: Generate a Drizzle ORM database migration with tenant_id, proper indexes, and rollback support for SUPRA Water
---

# New Database Migration

Generate a Drizzle ORM migration for the SUPRA Water 2026 multi-tenant system (PostgreSQL 16 + TimescaleDB).

## Step 1: Gather Requirements

Ask the user:
- What table(s) to create or modify?
- What columns are needed (name, type, nullable, default)?
- Are there foreign key relationships to other tables?
- Is this a TimescaleDB hypertable (time-series data like lecturas, consumos)?
- Are there geography/geometry columns (e.g., ubicacion_medidor)?
- Are there text columns that need search (e.g., nombre_titular, direccion)?

## Step 2: Generate the Migration File

Create the migration file in `src/db/migrations/` using timestamp naming: `YYYYMMDDHHMMSS_description.ts`.

Use the current date/time for the timestamp prefix. The description should be snake_case (e.g., `20260216143000_create_medidores.ts`).

### Migration file structure:

```typescript
import { sql } from 'drizzle-orm';
import { pgTable, uuid, timestamp, varchar, text, integer, numeric, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';
import type { MigrationMeta } from 'drizzle-orm/migrator';

export async function up(db: any): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS {table_name} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

      -- Domain columns here

      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    -- Indexes
    CREATE INDEX idx_{table}_tenant_id ON {table_name}(tenant_id);
    -- Composite indexes for common queries
    CREATE INDEX idx_{table}_tenant_{column} ON {table_name}(tenant_id, {column});

    -- Updated_at trigger
    CREATE TRIGGER set_{table}_updated_at
      BEFORE UPDATE ON {table_name}
      FOR EACH ROW
      EXECUTE FUNCTION trigger_set_updated_at();
  `);
}

export async function down(db: any): Promise<void> {
  await db.execute(sql`
    DROP TRIGGER IF EXISTS set_{table}_updated_at ON {table_name};
    DROP TABLE IF EXISTS {table_name} CASCADE;
  `);
}
```

### Required patterns for every table:
- `id` — UUID primary key with `gen_random_uuid()`
- `tenant_id` — UUID NOT NULL, FK to `tenants(id)` with ON DELETE CASCADE
- `created_at` — TIMESTAMPTZ NOT NULL DEFAULT now()
- `updated_at` — TIMESTAMPTZ NOT NULL DEFAULT now()
- Updated_at trigger using the shared `trigger_set_updated_at()` function

### Index guidelines:
- Always create a standalone index on `tenant_id`
- Create composite indexes for columns frequently filtered alongside `tenant_id` (e.g., `(tenant_id, cuenta_contrato)`, `(tenant_id, status)`)
- For text search columns (nombre, direccion, etc.), add a GIN trigram index:
  ```sql
  CREATE INDEX idx_{table}_{col}_trgm ON {table_name} USING gin({col} gin_trgm_ops);
  ```
  Ensure the `pg_trgm` extension is enabled.
- For geography/geometry columns, add a GIST index:
  ```sql
  CREATE INDEX idx_{table}_{col}_gist ON {table_name} USING gist({col});
  ```
- For TimescaleDB hypertables, add after CREATE TABLE:
  ```sql
  SELECT create_hypertable('{table_name}', 'created_at', chunk_time_interval => INTERVAL '1 month');
  ```

## Step 3: Add the Drizzle Schema Definition

Create or update the corresponding schema file in `src/db/schema/{table_name}.ts`:

```typescript
import { pgTable, uuid, timestamp, varchar, text, integer, numeric, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { tenants } from './tenants';

export const {tableName} = pgTable('{table_name}', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Domain columns here

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Zod schemas derived from Drizzle
export const insert{TableName}Schema = createInsertSchema({tableName});
export const select{TableName}Schema = createSelectSchema({tableName});
export type {TableName} = typeof {tableName}.$inferSelect;
export type New{TableName} = typeof {tableName}.$inferInsert;
```

Export the new schema from `src/db/schema/index.ts`.

## Step 4: Verify and Remind

After generating the files, remind the user to:

1. Review the generated migration and schema files
2. Run the Drizzle kit to generate the migration SQL:
   ```bash
   npx drizzle-kit generate
   ```
3. Test the migration against a local database:
   ```bash
   npx drizzle-kit migrate
   ```
4. Test the rollback:
   ```bash
   # Run the down migration manually or via a custom script
   ```
5. Verify that the schema in `src/db/schema/` matches the migration
6. If this is a TimescaleDB hypertable, verify the hypertable was created with:
   ```sql
   SELECT * FROM timescaledb_information.hypertables WHERE hypertable_name = '{table_name}';
   ```

## Domain Reference (Mexican Water Utility)

Common table/column naming conventions in this domain:
- `tomas` — water service connections (cuenta_contrato, tipo_toma, diametro)
- `medidores` — water meters (numero_serie, marca, modelo, ubicacion)
- `lecturas` — meter readings (lectura_actual, lectura_anterior, consumo, fecha_lectura)
- `facturas` — invoices/bills (monto_total, fecha_emision, fecha_vencimiento, status_pago)
- `padron_usuarios` — customer registry (nombre_titular, rfc, direccion, colonia, codigo_postal)
- `ordenes_trabajo` — work orders (tipo_orden, prioridad, estado, tecnico_asignado)
- `pagos` — payments (monto, metodo_pago, referencia, fecha_pago)
- `adeudos` — debts/arrears (saldo_vencido, periodo, concepto)
