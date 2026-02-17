import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';
import {
  CreateContactSchema,
  ListContactsSchema,
  UpdateContactSchema,
  EscalateContactSchema,
  ContactIdSchema,
} from './validators.js';
import {
  createContact,
  listContacts,
  updateContact,
  escalateContact,
} from './service.js';

const router = Router();

router.use(authenticate, tenantMiddleware);

// POST /contacts — Create contact/complaint
router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateContactSchema.parse(req.body);
      const contact = await createContact(req.tenantId!, input, {
        userId: req.user!.userId,
        correlationId: req.correlationId,
      });
      res.status(201).json({ success: true, data: contact });
    } catch (err) {
      next(err);
    }
  },
);

// GET /contacts — List contacts
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = ListContactsSchema.parse(req.query);
      const { data, total } = await listContacts(req.tenantId!, input);
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

// PATCH /contacts/:id — Update/resolve contact
router.patch(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = ContactIdSchema.parse(req.params);
      const input = UpdateContactSchema.parse(req.body);
      const contact = await updateContact(req.tenantId!, id, input, {
        userId: req.user!.userId,
        correlationId: req.correlationId,
      });
      res.json({ success: true, data: contact });
    } catch (err) {
      next(err);
    }
  },
);

// POST /contacts/:id/escalate — Escalate to department
router.post(
  '/:id/escalate',
  requireRole('admin', 'operator', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = ContactIdSchema.parse(req.params);
      const input = EscalateContactSchema.parse(req.body);
      const contact = await escalateContact(req.tenantId!, id, input, {
        userId: req.user!.userId,
        correlationId: req.correlationId,
      });
      res.json({ success: true, data: contact });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
