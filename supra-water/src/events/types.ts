// =============================================================
// Domain Event Types — SUPRA Water 2026 §6.2
// =============================================================

// ---- Contract Events ----

export interface ContractRequestedPayload {
  contract_id: string;
  person_id: string;
  toma_id: string;
}

export interface ContractCreatedPayload {
  contract_id: string;
  contract_number: string;
}

export interface ContractActivatedPayload {
  contract_id: string;
}

export interface ContractTerminatedPayload {
  contract_id: string;
  reason: string;
}

export interface ContractTitularChangedPayload {
  contract_id: string;
  old_person_id: string;
  new_person_id: string;
}

// ---- Reading Events ----

export interface ReadingReceivedPayload {
  reading_id: string;
  meter_id: string;
  toma_id: string;
  consumption: number;
}

export interface ReadingAnomalyDetectedPayload {
  reading_id: string;
  anomaly_type: string;
  confidence: number;
}

export interface ReadingBillingReadyPayload {
  reading_id: string;
  contract_id: string;
}

// ---- Billing Events ----

export interface InvoiceGeneratedPayload {
  invoice_id: string;
  contract_id: string;
  total: number;
}

export interface InvoiceStampedPayload {
  invoice_id: string;
  folio_fiscal: string;
}

export interface InvoiceDeliveredPayload {
  invoice_id: string;
  channel: string;
}

export interface InvoicePastDuePayload {
  invoice_id: string;
  days_past_due: number;
}

// ---- Payment Events ----

export interface PaymentReceivedPayload {
  payment_id: string;
  invoice_id: string;
  amount: number;
}

export interface PaymentBouncedPayload {
  payment_id: string;
  reason: string;
}

export interface PaymentReconciledPayload {
  payment_ids: string[];
}

// ---- Delinquency Events ----

export interface DelinquencyStartedPayload {
  procedure_id: string;
  contract_id: string;
  total_debt: number;
}

export interface DelinquencyStepExecutedPayload {
  procedure_id: string;
  step: string;
  action: string;
}

export interface DelinquencyResolvedPayload {
  procedure_id: string;
  resolution_type: string;
}

// ---- Work Order Events ----

export interface WorkOrderCreatedPayload {
  order_id: string;
  order_type: string;
  toma_id: string;
}

export interface WorkOrderAssignedPayload {
  order_id: string;
  assigned_to: string;
}

export interface WorkOrderCompletedPayload {
  order_id: string;
  result: string;
}

// ---- Contact Events ----

export interface ContactCreatedPayload {
  contact_id: string;
  contact_type: string;
  channel: string;
}

export interface ContactResolvedPayload {
  contact_id: string;
  resolution: string;
}

// ---- Fraud Events ----

export interface FraudCaseOpenedPayload {
  case_id: string;
  toma_id: string;
  detection_source: string;
}

export interface FraudConfirmedPayload {
  case_id: string;
  fraud_type: string;
}

// ---- Route Events ----

export interface RouteOptimizedPayload {
  graphIds: string[];
  zoneId: string;
  billingPeriodId: string;
  totalRoutes: number;
  totalNodes: number;
  totalDistanceM: number;
  optimizationMethod: string;
}

export interface RouteAssignedPayload {
  assignmentId: string;
  graphId: string;
  userId: string;
  billingPeriodId: string;
  readingsTotal: number;
}

export interface RouteStartedPayload {
  assignmentId: string;
  graphId: string;
  userId: string;
  startedAt: Date;
}

export interface RouteCompletedPayload {
  assignmentId: string;
  graphId: string;
  userId: string;
  completedAt: Date;
  readingsCompleted: number;
  durationMin: number;
}

// ---- Communication Events ----

export interface NotificationSentPayload {
  communication_id: string;
  channel: string;
  person_id: string;
}

export interface NotificationDeliveredPayload {
  communication_id: string;
}

export interface NotificationFailedPayload {
  communication_id: string;
  error: string;
}

// =============================================================
// Event Type → Payload Mapping
// =============================================================

export interface DomainEventMap {
  'contract.requested': ContractRequestedPayload;
  'contract.created': ContractCreatedPayload;
  'contract.activated': ContractActivatedPayload;
  'contract.terminated': ContractTerminatedPayload;
  'contract.titular_changed': ContractTitularChangedPayload;

  'reading.received': ReadingReceivedPayload;
  'reading.anomaly_detected': ReadingAnomalyDetectedPayload;
  'reading.billing_ready': ReadingBillingReadyPayload;

  'invoice.generated': InvoiceGeneratedPayload;
  'invoice.stamped': InvoiceStampedPayload;
  'invoice.delivered': InvoiceDeliveredPayload;
  'invoice.past_due': InvoicePastDuePayload;

  'payment.received': PaymentReceivedPayload;
  'payment.bounced': PaymentBouncedPayload;
  'payment.reconciled': PaymentReconciledPayload;

  'delinquency.started': DelinquencyStartedPayload;
  'delinquency.step_executed': DelinquencyStepExecutedPayload;
  'delinquency.resolved': DelinquencyResolvedPayload;

  'work_order.created': WorkOrderCreatedPayload;
  'work_order.assigned': WorkOrderAssignedPayload;
  'work_order.completed': WorkOrderCompletedPayload;

  'route.optimized': RouteOptimizedPayload;
  'route.assigned': RouteAssignedPayload;
  'route.started': RouteStartedPayload;
  'route.completed': RouteCompletedPayload;

  'contact.created': ContactCreatedPayload;
  'contact.resolved': ContactResolvedPayload;

  'fraud.case_opened': FraudCaseOpenedPayload;
  'fraud.confirmed': FraudConfirmedPayload;

  'notification.sent': NotificationSentPayload;
  'notification.delivered': NotificationDeliveredPayload;
  'notification.failed': NotificationFailedPayload;
}

export type DomainEventType = keyof DomainEventMap;

// =============================================================
// Core Event Envelope
// =============================================================

export interface DomainEvent<T extends DomainEventType = DomainEventType> {
  id?: string;
  type: T;
  aggregate_type: string;
  aggregate_id: string;
  tenant_id: string;
  payload: DomainEventMap[T];
  metadata?: Record<string, unknown>;
  created_at?: string;
}

// Handler function signature
export type EventHandler<T extends DomainEventType = DomainEventType> = (
  event: DomainEvent<T>,
) => Promise<void>;

// Aggregate type extracted from event type (e.g. "contract.created" → "contract")
export function aggregateTypeFromEvent(eventType: DomainEventType): string {
  return eventType.split('.')[0];
}
