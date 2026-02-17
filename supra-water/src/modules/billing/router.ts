/**
 * Billing Router — SUPRA Water 2026
 *
 * REST endpoints for invoice generation, listing, PDF/XML download,
 * CFDI cancellation, and credit notes.
 */

import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { tenantMiddleware } from '../../middleware/tenant.js';
import type { AuthenticatedRequest, ApiResponse, PaginatedResponse } from '../../types/index.js';
import {
  generateInvoiceSchema,
  listInvoicesSchema,
  invoiceIdSchema,
  cancelInvoiceSchema,
  creditNoteSchema,
} from './validators.js';
import {
  generateInvoice,
  getInvoice,
  listInvoices,
  cancelInvoiceById,
  generateCreditNote,
  getInvoicePDF,
  getInvoiceXML,
} from './service.js';

export const billingRouter = Router();

// All billing routes require authentication and tenant context
billingRouter.use(authenticate);
billingRouter.use(tenantMiddleware);

// ─── POST /invoices/generate ────────────────────────────────────
// Generate invoice for a contract/reading
billingRouter.post(
  '/invoices/generate',
  requireRole('admin', 'operator', 'super_admin'),
  async (req, res, next) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const input = generateInvoiceSchema.parse(req.body);
      const invoice = await generateInvoice(authReq.tenantId, input, authReq.user.userId);

      const body: ApiResponse<typeof invoice> = {
        success: true,
        data: invoice,
      };
      res.status(201).json(body);
    } catch (err) {
      next(err);
    }
  },
);

// ─── GET /invoices ──────────────────────────────────────────────
// List invoices (paginated, filterable)
billingRouter.get(
  '/invoices',
  requireRole('admin', 'operator', 'cashier', 'super_admin', 'customer'),
  async (req, res, next) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const filters = listInvoicesSchema.parse(req.query);
      const result = await listInvoices(authReq.tenantId, filters);

      const body: PaginatedResponse<(typeof result.data)[number]> = {
        success: true,
        data: result.data,
        pagination: result.pagination,
      };
      res.json(body);
    } catch (err) {
      next(err);
    }
  },
);

// ─── GET /invoices/:id ──────────────────────────────────────────
// Get invoice detail with line items
billingRouter.get(
  '/invoices/:id',
  requireRole('admin', 'operator', 'cashier', 'super_admin', 'customer'),
  async (req, res, next) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = invoiceIdSchema.parse(req.params);
      const invoice = await getInvoice(authReq.tenantId, id);

      const body: ApiResponse<typeof invoice> = {
        success: true,
        data: invoice,
      };
      res.json(body);
    } catch (err) {
      next(err);
    }
  },
);

// ─── GET /invoices/:id/pdf ──────────────────────────────────────
// Download invoice PDF
billingRouter.get(
  '/invoices/:id/pdf',
  requireRole('admin', 'operator', 'cashier', 'super_admin', 'customer'),
  async (req, res, next) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = invoiceIdSchema.parse(req.params);
      const pdfBuffer = await getInvoicePDF(authReq.tenantId, id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="recibo-${id}.pdf"`);
      res.send(pdfBuffer);
    } catch (err) {
      next(err);
    }
  },
);

// ─── GET /invoices/:id/xml ──────────────────────────────────────
// Download CFDI XML
billingRouter.get(
  '/invoices/:id/xml',
  requireRole('admin', 'operator', 'super_admin'),
  async (req, res, next) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = invoiceIdSchema.parse(req.params);
      const xml = await getInvoiceXML(authReq.tenantId, id);

      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', `attachment; filename="cfdi-${id}.xml"`);
      res.send(xml);
    } catch (err) {
      next(err);
    }
  },
);

// ─── POST /invoices/:id/cancel ──────────────────────────────────
// Cancel CFDI
billingRouter.post(
  '/invoices/:id/cancel',
  requireRole('admin', 'super_admin'),
  async (req, res, next) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = invoiceIdSchema.parse(req.params);
      const input = cancelInvoiceSchema.parse(req.body);
      const invoice = await cancelInvoiceById(authReq.tenantId, id, input, authReq.user.userId);

      const body: ApiResponse<typeof invoice> = {
        success: true,
        data: invoice,
      };
      res.json(body);
    } catch (err) {
      next(err);
    }
  },
);

// ─── POST /invoices/:id/credit-note ────────────────────────────
// Generate credit note (nota de credito)
billingRouter.post(
  '/invoices/:id/credit-note',
  requireRole('admin', 'super_admin'),
  async (req, res, next) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = invoiceIdSchema.parse(req.params);
      const input = creditNoteSchema.parse(req.body);
      const creditNote = await generateCreditNote(authReq.tenantId, id, input, authReq.user.userId);

      const body: ApiResponse<typeof creditNote> = {
        success: true,
        data: creditNote,
      };
      res.status(201).json(body);
    } catch (err) {
      next(err);
    }
  },
);
