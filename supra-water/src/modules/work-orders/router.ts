import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';
import {
  CreateWorkOrderSchema,
  ListWorkOrdersSchema,
  UpdateWorkOrderSchema,
  CompleteWorkOrderSchema,
  WorkOrderIdSchema,
  RouteParamsSchema,
} from './validators.js';
import {
  createWorkOrder,
  listWorkOrders,
  updateWorkOrder,
  completeWorkOrder,
  getTechnicianRoute,
} from './service.js';

const router = Router();

// All routes require authentication and tenant context
router.use(authenticate, tenantMiddleware);

// POST /work-orders — Create work order
router.post(
  '/',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateWorkOrderSchema.parse(req.body);
      const order = await createWorkOrder(req.tenantId!, input, {
        userId: req.user!.userId,
        correlationId: req.correlationId,
      });
      res.status(201).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },
);

// GET /work-orders — List work orders
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = ListWorkOrdersSchema.parse(req.query);
      const { data, total } = await listWorkOrders(req.tenantId!, input);
      res.json({
        success: true,
        data,
        pagination: {
          page: input.page,
          pageSize: input.page_size,
          total,
          totalPages: Math.ceil(total / input.page_size),
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

// GET /work-orders/route/:user_id — Get optimized route for technician
router.get(
  '/route/:user_id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = RouteParamsSchema.parse(req.params);
      const route = await getTechnicianRoute(req.tenantId!, user_id);
      res.json({ success: true, data: route });
    } catch (err) {
      next(err);
    }
  },
);

// PATCH /work-orders/:id — Update work order
router.patch(
  '/:id',
  requireRole('admin', 'operator', 'field_tech', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = WorkOrderIdSchema.parse(req.params);
      const input = UpdateWorkOrderSchema.parse(req.body);
      const order = await updateWorkOrder(req.tenantId!, id, input, {
        userId: req.user!.userId,
        correlationId: req.correlationId,
      });
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },
);

// POST /work-orders/:id/complete — Complete with field data
router.post(
  '/:id/complete',
  requireRole('admin', 'operator', 'field_tech', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = WorkOrderIdSchema.parse(req.params);
      const input = CompleteWorkOrderSchema.parse(req.body);
      const order = await completeWorkOrder(req.tenantId!, id, input, {
        userId: req.user!.userId,
        correlationId: req.correlationId,
      });
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
