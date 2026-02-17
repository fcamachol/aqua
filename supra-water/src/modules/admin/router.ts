import { Router } from 'express';
import { z } from 'zod';
import { requireRole } from '../../middleware/auth.js';
import * as tenantService from './tenant-service.js';
import * as userService from './user-service.js';
import * as tariffService from './tariff-service.js';
import type { AuthenticatedRequest } from '../../types/index.js';

// =============================================================
// Admin Router — requires 'admin' role
// =============================================================

const router = Router();
router.use(requireRole('admin'));

// ─── Tenant Management ─────────────────────────────────────────

router.get('/tenant', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const tenant = await tenantService.getTenant(authReq.tenantId);
    if (!tenant) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Tenant not found', correlationId: authReq.correlationId } });
      return;
    }
    res.json({ success: true, data: tenant });
  } catch (err) { next(err); }
});

router.patch('/tenant', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = updateTenantSchema.parse(req.body);
    const tenant = await tenantService.updateTenant(authReq.tenantId, input);
    if (!tenant) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Tenant not found', correlationId: authReq.correlationId } });
      return;
    }
    res.json({ success: true, data: tenant });
  } catch (err) { next(err); }
});

// ─── User Management ───────────────────────────────────────────

router.post('/users', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = createUserSchema.parse(req.body);
    const user = await userService.createUser({ ...input, tenantId: authReq.tenantId });
    res.status(201).json({ success: true, data: user });
  } catch (err) { next(err); }
});

router.get('/users', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const query = listUsersSchema.parse(req.query);
    const result = await userService.listUsers({ ...query, tenantId: authReq.tenantId });
    res.json({
      success: true,
      data: result.data,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total: result.total,
        totalPages: Math.ceil(result.total / query.pageSize),
      },
    });
  } catch (err) { next(err); }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = uuidParamSchema.parse(req.params);
    const user = await userService.getUserById(authReq.tenantId, id);
    if (!user) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found', correlationId: authReq.correlationId } });
      return;
    }
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

router.patch('/users/:id', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = uuidParamSchema.parse(req.params);
    const input = updateUserSchema.parse(req.body);
    const user = await userService.updateUser(authReq.tenantId, id, input);
    if (!user) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found', correlationId: authReq.correlationId } });
      return;
    }
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

router.delete('/users/:id', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = uuidParamSchema.parse(req.params);
    const user = await userService.deactivateUser(authReq.tenantId, id);
    if (!user) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found', correlationId: authReq.correlationId } });
      return;
    }
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

// ─── Tariff Management ─────────────────────────────────────────

router.post('/tariffs', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = createTariffSchema.parse(req.body);
    const tariff = await tariffService.createTariffSchedule({ ...input, tenantId: authReq.tenantId });
    res.status(201).json({ success: true, data: tariff });
  } catch (err) { next(err); }
});

router.get('/tariffs', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { category, activeOnly } = listTariffsSchema.parse(req.query);
    const data = await tariffService.listTariffSchedules(authReq.tenantId, { category, activeOnly });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.patch('/tariffs/:id', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { id } = uuidParamSchema.parse(req.params);
    const input = updateTariffSchema.parse(req.body);
    const tariff = await tariffService.updateTariffSchedule(authReq.tenantId, id, input);
    if (!tariff) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Tariff not found', correlationId: authReq.correlationId } });
      return;
    }
    res.json({ success: true, data: tariff });
  } catch (err) { next(err); }
});

// ─── System Config (tenant config shorthand) ───────────────────

router.get('/config', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const tenant = await tenantService.getTenant(authReq.tenantId);
    if (!tenant) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Tenant not found', correlationId: authReq.correlationId } });
      return;
    }
    res.json({ success: true, data: tenant.config });
  } catch (err) { next(err); }
});

router.patch('/config', async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const config = req.body;
    const tenant = await tenantService.updateTenant(authReq.tenantId, { config });
    if (!tenant) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Tenant not found', correlationId: authReq.correlationId } });
      return;
    }
    res.json({ success: true, data: tenant.config });
  } catch (err) { next(err); }
});

export { router as adminRouter };

// =============================================================
// Zod Schemas
// =============================================================

const ROLES = [
  'admin', 'supervisor', 'operador', 'lecturista',
  'cajero', 'atencion_cliente', 'tecnico', 'auditor', 'readonly',
] as const;

const uuidParamSchema = z.object({ id: z.string().uuid() });

const updateTenantSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  rfc: z.string().max(13).optional(),
  fiscalName: z.string().max(300).optional(),
  fiscalAddress: z.record(z.unknown()).optional(),
  config: z.record(z.unknown()).optional(),
});

const createUserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(200),
  role: z.enum(ROLES),
  permissions: z.array(z.unknown()).optional(),
  explotacionIds: z.array(z.string().uuid()).optional(),
  officeIds: z.array(z.string().uuid()).optional(),
});

const updateUserSchema = z.object({
  email: z.string().email().max(255).optional(),
  name: z.string().min(1).max(200).optional(),
  role: z.enum(ROLES).optional(),
  permissions: z.array(z.unknown()).optional(),
  explotacionIds: z.array(z.string().uuid()).optional(),
  officeIds: z.array(z.string().uuid()).optional(),
  active: z.boolean().optional(),
});

const listUsersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  role: z.enum(ROLES).optional(),
  active: z.preprocess((v) => (v === 'true' ? true : v === 'false' ? false : undefined), z.boolean().optional()),
  search: z.string().max(200).optional(),
});

const CATEGORIES = [
  'domestica', 'comercial', 'industrial', 'gobierno', 'mixta', 'rural',
] as const;

const tariffBlockSchema = z.object({
  from_m3: z.number().min(0),
  to_m3: z.number().min(0).nullable(),
  price_per_m3: z.number().min(0),
  fixed_charge: z.number().min(0),
});

const additionalConceptSchema = z.object({
  code: z.string(),
  name: z.string(),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().min(0),
  base: z.string().optional(),
});

const createTariffSchema = z.object({
  explotacionId: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  category: z.enum(CATEGORIES),
  effectiveFrom: z.string(),
  effectiveUntil: z.string().optional(),
  billingPeriod: z.enum(['mensual', 'bimestral', 'trimestral']),
  blocks: z.array(tariffBlockSchema).min(1),
  additionalConcepts: z.array(additionalConceptSchema).optional(),
  ivaApplicable: z.boolean().optional(),
  socialDiscountPct: z.string().optional(),
  approvedBy: z.string().max(200).optional(),
  approvalDate: z.string().optional(),
  gazetteReference: z.string().max(100).optional(),
});

const updateTariffSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  effectiveUntil: z.string().optional(),
  active: z.boolean().optional(),
  blocks: z.array(tariffBlockSchema).min(1).optional(),
  additionalConcepts: z.array(additionalConceptSchema).optional(),
  ivaApplicable: z.boolean().optional(),
  socialDiscountPct: z.string().optional(),
  approvedBy: z.string().max(200).optional(),
  approvalDate: z.string().optional(),
  gazetteReference: z.string().max(100).optional(),
});

const listTariffsSchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  activeOnly: z.preprocess((v) => v !== 'false', z.boolean().default(true)),
});
