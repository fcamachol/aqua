---
name: new-endpoint
description: Scaffold a new REST API endpoint with router, handler, Zod validation, service layer, and tests for SUPRA Water
---

# New REST API Endpoint

Scaffold a complete REST API endpoint for the SUPRA Water 2026 system (Express.js 5, TypeScript strict, Zod validation, Drizzle ORM).

## Step 1: Gather Requirements

Ask the user:
- Resource name (e.g., `lecturas`, `medidores`, `facturas`, `tomas`)
- HTTP method and path (e.g., `GET /api/v1/lecturas`, `POST /api/v1/tomas/:tomaId/lecturas`)
- Purpose — what does this endpoint do?
- Does it require query parameters, path parameters, or a request body?
- Does a mutation (POST/PUT/PATCH/DELETE) need to emit a domain event?

## Step 2: Create the Zod Schemas

Create `src/schemas/{resource}.schema.ts`:

```typescript
import { z } from 'zod';

// Path parameters (if any)
export const {Resource}ParamsSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
});

// Query parameters (for GET list endpoints)
export const {Resource}QuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['created_at', 'updated_at']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
  // Add resource-specific filters here
});

// Request body (for POST/PUT/PATCH)
export const Create{Resource}Schema = z.object({
  // Define required and optional fields
  // Use Mexican water utility domain naming
});

export const Update{Resource}Schema = Create{Resource}Schema.partial();

// Response schema
export const {Resource}ResponseSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  // Domain fields
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Standard API response wrapper
export const {Resource}ApiResponseSchema = z.object({
  success: z.literal(true),
  data: {Resource}ResponseSchema, // or z.array() for lists
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).optional(),
});

// Type exports
export type {Resource}Params = z.infer<typeof {Resource}ParamsSchema>;
export type {Resource}Query = z.infer<typeof {Resource}QuerySchema>;
export type Create{Resource}Input = z.infer<typeof Create{Resource}Schema>;
export type Update{Resource}Input = z.infer<typeof Update{Resource}Schema>;
export type {Resource}Response = z.infer<typeof {Resource}ResponseSchema>;
```

## Step 3: Create the Service Layer

Create `src/services/{resource}.service.ts`:

```typescript
import { eq, and, desc, asc, sql, count } from 'drizzle-orm';
import { db } from '../db';
import { {resource}Table } from '../db/schema';
import type { Create{Resource}Input, Update{Resource}Input, {Resource}Query } from '../schemas/{resource}.schema';
import { eventBus } from '../events';
import { AppError } from '../middleware/error-handler';

export class {Resource}Service {
  async findAll(tenantId: string, query: {Resource}Query) {
    const { page, limit, sort, order } = query;
    const offset = (page - 1) * limit;

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from({resource}Table)
        .where(eq({resource}Table.tenantId, tenantId))
        .orderBy(order === 'desc' ? desc({resource}Table[sort]) : asc({resource}Table[sort]))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: count() })
        .from({resource}Table)
        .where(eq({resource}Table.tenantId, tenantId)),
    ]);

    return {
      data: items,
      meta: {
        page,
        limit,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / limit),
      },
    };
  }

  async findById(tenantId: string, id: string) {
    const [item] = await db
      .select()
      .from({resource}Table)
      .where(and(eq({resource}Table.tenantId, tenantId), eq({resource}Table.id, id)));

    if (!item) {
      throw new AppError(404, '{Resource} not found');
    }

    return item;
  }

  async create(tenantId: string, input: Create{Resource}Input) {
    const [item] = await db
      .insert({resource}Table)
      .values({ ...input, tenantId })
      .returning();

    eventBus.emit('{resource}.created', { tenantId, {resource}: item });

    return item;
  }

  async update(tenantId: string, id: string, input: Update{Resource}Input) {
    const [item] = await db
      .update({resource}Table)
      .set({ ...input, updatedAt: new Date() })
      .where(and(eq({resource}Table.tenantId, tenantId), eq({resource}Table.id, id)))
      .returning();

    if (!item) {
      throw new AppError(404, '{Resource} not found');
    }

    eventBus.emit('{resource}.updated', { tenantId, {resource}: item });

    return item;
  }

  async delete(tenantId: string, id: string) {
    const [item] = await db
      .delete({resource}Table)
      .where(and(eq({resource}Table.tenantId, tenantId), eq({resource}Table.id, id)))
      .returning();

    if (!item) {
      throw new AppError(404, '{Resource} not found');
    }

    eventBus.emit('{resource}.deleted', { tenantId, id });

    return item;
  }
}

export const {resource}Service = new {Resource}Service();
```

## Step 4: Create the Handler

Create `src/handlers/{resource}.handler.ts`:

```typescript
import type { Request, Response, NextFunction } from 'express';
import { {resource}Service } from '../services/{resource}.service';
import {
  {Resource}ParamsSchema,
  {Resource}QuerySchema,
  Create{Resource}Schema,
  Update{Resource}Schema,
} from '../schemas/{resource}.schema';

export class {Resource}Handler {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.auth!.tenantId; // Extracted from JWT by auth middleware
      const query = {Resource}QuerySchema.parse(req.query);
      const result = await {resource}Service.findAll(tenantId, query);

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.auth!.tenantId;
      const { id } = {Resource}ParamsSchema.parse(req.params);
      const data = await {resource}Service.findById(tenantId, id);

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.auth!.tenantId;
      const input = Create{Resource}Schema.parse(req.body);
      const data = await {resource}Service.create(tenantId, input);

      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.auth!.tenantId;
      const { id } = {Resource}ParamsSchema.parse(req.params);
      const input = Update{Resource}Schema.parse(req.body);
      const data = await {resource}Service.update(tenantId, id, input);

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = req.auth!.tenantId;
      const { id } = {Resource}ParamsSchema.parse(req.params);
      const data = await {resource}Service.delete(tenantId, id);

      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

export const {resource}Handler = new {Resource}Handler();
```

## Step 5: Create the Router

Create `src/routes/{resource}.routes.ts`:

```typescript
import { Router } from 'express';
import { {resource}Handler } from '../handlers/{resource}.handler';
import { authenticate } from '../middleware/auth';
import { requireTenant } from '../middleware/tenant';

const router = Router();

// All routes require authentication and tenant context
router.use(authenticate, requireTenant);

router.get('/', (req, res, next) => {resource}Handler.list(req, res, next));
router.get('/:id', (req, res, next) => {resource}Handler.getById(req, res, next));
router.post('/', (req, res, next) => {resource}Handler.create(req, res, next));
router.put('/:id', (req, res, next) => {resource}Handler.update(req, res, next));
router.delete('/:id', (req, res, next) => {resource}Handler.delete(req, res, next));

export default router;
```

Then register the router in the main app or router index:
```typescript
// In src/routes/index.ts or src/app.ts
import {resource}Routes from './{resource}.routes';
app.use('/api/v1/{resource}', {resource}Routes);
```

## Step 6: Create the Tests

Create `src/routes/{resource}.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { db } from '../db';
import { {resource}Table } from '../db/schema';
import { createTestTenant, createTestToken, cleanupTestData } from '../test/helpers';

describe('{Resource} API', () => {
  let tenantId: string;
  let authToken: string;

  beforeAll(async () => {
    tenantId = await createTestTenant();
    authToken = createTestToken({ tenantId });
  });

  afterAll(async () => {
    await cleanupTestData(tenantId);
  });

  describe('POST /api/v1/{resource}', () => {
    it('should create a new {resource}', async () => {
      const res = await request(app)
        .post('/api/v1/{resource}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Valid input fields
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.tenantId).toBe(tenantId);
    });

    it('should reject invalid input with 400', async () => {
      const res = await request(app)
        .post('/api/v1/{resource}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject unauthenticated requests with 401', async () => {
      const res = await request(app)
        .post('/api/v1/{resource}')
        .send({});

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/{resource}', () => {
    it('should return paginated list scoped to tenant', async () => {
      const res = await request(app)
        .get('/api/v1/{resource}')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.page).toBe(1);
    });
  });

  describe('GET /api/v1/{resource}/:id', () => {
    it('should return a single {resource} by id', async () => {
      // First create one
      const created = await request(app)
        .post('/api/v1/{resource}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ /* valid input */ });

      const res = await request(app)
        .get(`/api/v1/{resource}/${created.body.data.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(created.body.data.id);
    });

    it('should return 404 for non-existent id', async () => {
      const res = await request(app)
        .get('/api/v1/{resource}/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/v1/{resource}/:id', () => {
    it('should update an existing {resource}', async () => {
      // Create then update
      const created = await request(app)
        .post('/api/v1/{resource}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ /* valid input */ });

      const res = await request(app)
        .put(`/api/v1/{resource}/${created.body.data.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ /* updated fields */ });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('DELETE /api/v1/{resource}/:id', () => {
    it('should delete an existing {resource}', async () => {
      const created = await request(app)
        .post('/api/v1/{resource}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ /* valid input */ });

      const res = await request(app)
        .delete(`/api/v1/{resource}/${created.body.data.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe('Tenant isolation', () => {
    it('should not allow access to another tenant resources', async () => {
      const otherTenantId = await createTestTenant();
      const otherToken = createTestToken({ tenantId: otherTenantId });

      // Create with tenant A
      const created = await request(app)
        .post('/api/v1/{resource}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ /* valid input */ });

      // Try to access with tenant B
      const res = await request(app)
        .get(`/api/v1/{resource}/${created.body.data.id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.status).toBe(404);
    });
  });
});
```

## Step 7: Verify and Remind

After generating all files:

1. Replace all `{resource}` / `{Resource}` placeholders with actual names
2. Fill in domain-specific schema fields in the Zod schemas
3. Register the route in `src/routes/index.ts` or `src/app.ts`
4. Verify imports resolve correctly
5. Run the tests: `npx vitest run src/routes/{resource}.test.ts`
6. Check TypeScript compilation: `npx tsc --noEmit`

## Standard Response Format

All endpoints MUST return this shape:

```typescript
// Success (single item)
{ success: true, data: { ... } }

// Success (list with pagination)
{ success: true, data: [ ... ], meta: { page, limit, total, totalPages } }

// Error
{ success: false, error: { code: string, message: string, details?: any } }
```
