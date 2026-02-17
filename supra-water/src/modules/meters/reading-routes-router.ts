/**
 * Reading Routes Router — SUPRA Water 2026
 *
 * REST endpoints for route optimization, listing, capturista assignment,
 * and workload stats for the graph-based reading route system.
 */

import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';
import {
  optimizeRoutesSchema,
  listRoutesQuerySchema,
  routeIdSchema,
  assignRouteSchema,
  routeAssignmentParamsSchema,
  updateAssignmentSchema,
  zoneIdSchema,
} from './reading-routes-validators.js';
import * as readingRoutesService from './reading-routes-service.js';

export const readingRoutesRouter = Router();

// All reading-routes require authentication and tenant context
readingRoutesRouter.use(authenticate);
readingRoutesRouter.use(tenantMiddleware);

// ─── POST /reading-routes/optimize ─────────────────────────────
// Trigger route optimization for a zone/billing period
readingRoutesRouter.post(
  '/optimize',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = optimizeRoutesSchema.parse(req.body);
      const result = await readingRoutesService.optimizeRoutes(req.tenantId!, input);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
);

// ─── GET /reading-routes ───────────────────────────────────────
// List routes with optional filters (zone, period, status)
readingRoutesRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = listRoutesQuerySchema.parse(req.query);
      const { data, total } = await readingRoutesService.listRoutes(req.tenantId!, filters);
      res.json({
        success: true,
        data,
        pagination: {
          page: filters.page,
          pageSize: filters.limit,
          total,
          totalPages: Math.ceil(total / filters.limit),
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// ─── GET /reading-routes/stats/:zoneId ────────────────────────
// Workload balance stats across routes in a zone
// NOTE: Registered before /:id to avoid "stats" matching the :id param
readingRoutesRouter.get(
  '/stats/:zoneId',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { zoneId } = zoneIdSchema.parse(req.params);
      const stats = await readingRoutesService.getZoneStats(req.tenantId!, zoneId);
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  },
);

// ─── GET /reading-routes/:id ──────────────────────────────────
// Get single route with nodes in walk order
readingRoutesRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = routeIdSchema.parse(req.params);
      const route = await readingRoutesService.getRouteById(req.tenantId!, id);
      res.json({ success: true, data: route });
    } catch (err) {
      next(err);
    }
  },
);

// ─── GET /reading-routes/:id/nodes ────────────────────────────
// Ordered stops for capturista app (lightweight response)
readingRoutesRouter.get(
  '/:id/nodes',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = routeIdSchema.parse(req.params);
      const nodes = await readingRoutesService.getRouteNodes(req.tenantId!, id);
      res.json({ success: true, data: nodes });
    } catch (err) {
      next(err);
    }
  },
);

// ─── GET /reading-routes/:id/edges ────────────────────────────
// Edge data for map visualization
readingRoutesRouter.get(
  '/:id/edges',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = routeIdSchema.parse(req.params);
      const edges = await readingRoutesService.getRouteEdges(req.tenantId!, id);
      res.json({ success: true, data: edges });
    } catch (err) {
      next(err);
    }
  },
);

// ─── POST /reading-routes/:id/assign ──────────────────────────
// Assign capturista to route
readingRoutesRouter.post(
  '/:id/assign',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = routeIdSchema.parse(req.params);
      const input = assignRouteSchema.parse(req.body);
      const assignment = await readingRoutesService.assignRoute(req.tenantId!, id, input);
      res.status(201).json({ success: true, data: assignment });
    } catch (err) {
      next(err);
    }
  },
);

// ─── PATCH /reading-routes/:id/assignments/:aid ───────────────
// Update assignment status/progress
readingRoutesRouter.patch(
  '/:id/assignments/:aid',
  requireRole('admin', 'operator', 'reader', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, aid } = routeAssignmentParamsSchema.parse(req.params);
      const input = updateAssignmentSchema.parse(req.body);
      const assignment = await readingRoutesService.updateAssignment(req.tenantId!, id, aid, input);
      res.json({ success: true, data: assignment });
    } catch (err) {
      next(err);
    }
  },
);

