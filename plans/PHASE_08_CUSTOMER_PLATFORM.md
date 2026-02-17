# Phase 8: Customer Engagement Platform

**Timeline:** Months 14-22 (Sprints 1-14, 28 weeks)
**Goal:** Deliver a full customer self-service portal, WhatsApp chatbot, mobile experience, digital identity verification, proactive notification engine, and online service request system for CEA Queretaro's 2.4 million citizens.
**Prerequisite Phases:** Phase 5 (API Modernization) for REST endpoints, Phase 6 (Microservices) for scalable backend, Phase 7 (Billing Engine) for billing and payment data models.

---

## 1. Phase Overview

### Objective

Transform CEA Queretaro's customer engagement from agent-dependent interactions (current maturity: 4-5/10) to a comprehensive digital self-service ecosystem (target maturity: 7.2/10). The platform will enable citizens to manage their water accounts, pay bills, receive proactive notifications, and interact with an AI-powered WhatsApp chatbot -- all without visiting a CEA office.

### Strategic Context

- **AGORA Platform:** CEA operates the AGORA omnichannel citizen engagement platform (Vue 3 frontend, Rails 7 backend) with Maria AI Agent. Currently integrates 17 of 126 Aquasis SOAP API operations (13.5% coverage). The `InterfazOficinaVirtualClientesWS` exposes 47 customer-facing operations with only 8 integrated (17%).
- **Market Realities:** Mexico has 78% smartphone penetration (75-80% Android), 90%+ WhatsApp adoption, 60% prepaid mobile plans with constrained data budgets, and significant app fatigue (30-40 installed, 8-10 actively used).
- **Regulatory:** Mexican government digital accessibility standards require WCAG 2.1 AA compliance. CFDI (Comprobante Fiscal Digital por Internet) digital invoicing compliance is mandatory for payment receipts.
- **Payment Ecosystem:** Mexico's payment landscape includes SPEI (bank transfers), CoDi (QR-based contactless), OXXO/convenience store cash payments (~50,000 locations), and credit/debit cards with 3D Secure. Conekta is the recommended aggregator supporting all four methods.

### Timeline Summary

| Sprint | Weeks | Deliverable |
|--------|-------|-------------|
| 1-3 | 1-6 | Customer Self-Service Portal (PWA) |
| 4-6 | 7-12 | Online Payments Integration |
| 7-9 | 13-18 | WhatsApp Chatbot |
| 10-12 | 19-24 | Digital Identity & Notifications |
| 13-14 | 25-28 | Service Requests & Accessibility |

### Team

| Role | Count | Responsibility |
|------|-------|----------------|
| Frontend Lead | 1 | PWA architecture, Vue 3 component library, performance |
| Vue.js Developers | 2 | Portal UI, dashboard components, offline support |
| UX/UI Designer | 1 | User research, wireframes, accessibility, design system |
| Backend Developer (Rails) | 1 | AGORA API gateway, Aquasis integration (shared with Phase 5/6) |
| Chatbot Specialist | 1 | WhatsApp Business API, Maria AI intent library, NLU tuning |
| Payment Integration Engineer | 1 | Conekta gateway, SPEI/CoDi/OXXO integrations, PCI compliance |
| QA Engineer | 1 | Cross-browser/device testing, accessibility audits |
| Product Owner | 0.5 | Backlog prioritization, stakeholder alignment (shared) |

**Total:** 8.5 FTEs dedicated to Phase 8

---

## 2. Sprint 1-3 (Weeks 1-6): Customer Self-Service Portal

### Objective

Build a Progressive Web App (PWA) on the existing AGORA Vue 3 stack that gives citizens 24/7 access to their water account information: balance, consumption history, bills, and payment history.

### Architecture

The portal extends the existing AGORA Vue 3 frontend with a new customer-facing application. It communicates through the AGORA Rails 7 API gateway, which proxies requests to Aquasis SOAP services.

```
+----------------------------------+
|   Customer Portal (Vue 3 PWA)    |
|   - Pinia state management       |
|   - Vue Router (hash mode)       |
|   - Workbox service worker       |
|   - IndexedDB via Dexie.js       |
+----------------------------------+
              |
+----------------------------------+
|   AGORA API Gateway (Rails 7)    |
|   - REST endpoints               |
|   - WS-Security proxy            |
|   - Session/JWT auth             |
|   - Rate limiting                |
+----------------------------------+
              |
+----------------------------------+
|   Aquasis SOAP Services          |
|   - InterfazOficinaVirtualWS     |
|   - 47 operations                |
+----------------------------------+
```

### Sprint 1 (Weeks 1-2): Foundation & Account Dashboard

**Backend Tasks:**
- [ ] Integrate `getContrato` and `getContratosPorNif` operations into AGORA Rails API for contract lookup
- [ ] Integrate `getTitularPorContrato` for account holder retrieval
- [ ] Integrate `getDeuda` / `getDeudaContrato` for balance and debt information
- [ ] Create REST endpoints: `GET /api/v1/portal/account`, `GET /api/v1/portal/balance`
- [ ] Implement JWT-based portal authentication (contract number + email/phone verification)

**Frontend Tasks:**
- [ ] Scaffold Vue 3 PWA project (Vite, Pinia, Vue Router, Tailwind CSS)
- [ ] Create responsive layout shell (header, sidebar/bottom nav, main content)
- [ ] Build login/authentication flow (contract number + verification code)
- [ ] Build Account Dashboard component:
  - Current balance with due date indicator (overdue highlighted in red)
  - Last bill summary (amount, period, date)
  - Consumption trend sparkline (last 6 months)
  - Quick action buttons (Pay Now, View Bill, Report Issue)
- [ ] Configure Workbox service worker with app-shell caching strategy

**Acceptance Criteria:**
- User can log in with contract number and receive a verification code
- Dashboard displays real-time balance from `getDeuda` API
- Page loads in under 3 seconds on a 3G connection
- App shell is cached for offline access

### Sprint 2 (Weeks 3-4): Bills & Consumption History

**Backend Tasks:**
- [ ] Integrate `getFacturasContrato` for invoice listing (already partially integrated)
- [ ] Integrate `getPdfFactura` for PDF bill download (already partially integrated)
- [ ] Integrate `getConsumosParaGraficas` for chart-ready consumption data (already integrated)
- [ ] Integrate `getLecturasParaGraficas` for reading chart data
- [ ] Create REST endpoints: `GET /api/v1/portal/bills`, `GET /api/v1/portal/bills/:id/pdf`, `GET /api/v1/portal/consumption`
- [ ] Implement server-side pagination for bill history (Aquasis returns unpaginated arrays)

**Frontend Tasks:**
- [ ] Build Bill List component with filtering by date range and status (paid/unpaid)
- [ ] Build Bill Detail component with line-item breakdown using `getConceptoConTarifasDeFactura`
- [ ] Implement PDF bill download and in-browser PDF viewer
- [ ] Build Consumption History component:
  - Monthly bar chart (Chart.js or Apache ECharts) showing cubic meters
  - Comparison overlay (current vs. previous year)
  - Data table view toggle
  - Period selector (3 months, 6 months, 12 months, custom range)
- [ ] Cache last 6 bills and 12 months of consumption data in IndexedDB for offline viewing

**Acceptance Criteria:**
- User can view, filter, and download bills as PDF
- Consumption chart renders with accurate historical data
- Offline mode displays cached bills and consumption data with "Last updated" timestamp

### Sprint 3 (Weeks 5-6): Payment History & Profile

**Backend Tasks:**
- [ ] Integrate `cobrarReferencia` and `cobrarReferenciaFrmPago` for payment reference data
- [ ] Integrate `cambiarEmailNotificacionPersona` for profile email updates (already integrated)
- [ ] Integrate `cambiarMovilNotificacionContrato` for mobile notification number changes
- [ ] Integrate `getDomicilio` for service address display
- [ ] Create REST endpoints: `GET /api/v1/portal/payments`, `PUT /api/v1/portal/profile`

**Frontend Tasks:**
- [ ] Build Payment History component:
  - List of all payments with date, amount, method, and confirmation number
  - Filter by date range and payment method
  - Export to CSV
- [ ] Build Profile Management component:
  - Contact information display and edit (email, phone)
  - Service address display (read-only, from `getDomicilio`)
  - Notification preferences (email, SMS, WhatsApp, push)
  - Paperless billing enrollment toggle (via `solicitudActivacionFacturaOnline`)
  - Language preference (Spanish default)
- [ ] PWA install prompt with custom "Add to Home Screen" banner
- [ ] Performance optimization: lazy loading, skeleton screens, image optimization
- [ ] Lighthouse audit target: Performance >90, Accessibility >90, PWA >90

**Acceptance Criteria:**
- User can view complete payment history
- User can update email and phone, toggle paperless billing
- PWA install prompt appears for eligible users
- Lighthouse scores meet targets

### Key Aquasis API Operations for Sprints 1-3

| Operation | Domain | Sprint | Purpose |
|-----------|--------|--------|---------|
| `getContrato` | Contract | 1 | Contract details |
| `getContratosPorNif` | Contract | 1 | Contract lookup by tax ID |
| `getTitularPorContrato` | Contract | 1 | Account holder info |
| `getDeuda` / `getDeudaContrato` | Billing | 1 | Balance and debt |
| `getFacturasContrato` | Billing | 2 | Invoice listing |
| `getPdfFactura` | Billing | 2 | Bill PDF download |
| `getConsumosParaGraficas` | Consumption | 2 | Chart-ready consumption |
| `getLecturasParaGraficas` | Readings | 2 | Reading chart data |
| `getConceptoConTarifasDeFactura` | Billing | 2 | Bill line-item detail |
| `cobrarReferencia` | Payments | 3 | Payment reference data |
| `getDomicilio` | Contract | 3 | Service address |
| `cambiarMovilNotificacionContrato` | Profile | 3 | Mobile number update |

---

## 3. Sprint 4-6 (Weeks 7-12): Online Payments

### Objective

Integrate Conekta as the payment gateway to enable citizens to pay water bills through credit/debit cards, OXXO cash references, and SPEI bank transfers -- covering 95%+ of Mexican payment preferences.

### Payment Gateway Architecture

```
+---------------------------+
|   Customer Portal (PWA)   |
|   Conekta.js tokenizer    |
+---------------------------+
              |
+---------------------------+          +------------------+
|   AGORA Payment Service   |<-------->|    Conekta API    |
|   (Rails 7)               |          |    (PCI Level 1)  |
|   - Order creation        |          +------------------+
|   - Webhook handler       |                    |
|   - Receipt generation    |          +------------------+
|   - Reconciliation        |          |  SPEI / OXXO /   |
+---------------------------+          |  Card Networks    |
              |                        +------------------+
+---------------------------+
|   Aquasis Billing API     |
|   - cobrarReferencia      |
|   - cambiarSenasCobro     |
+---------------------------+
```

### Sprint 4 (Weeks 7-8): Credit/Debit Card Payments

**Backend Tasks:**
- [ ] Set up Conekta merchant account and API credentials (sandbox + production)
- [ ] Create `PaymentService` in Rails to handle Conekta order lifecycle
- [ ] Implement Conekta webhook endpoint for async payment confirmation
- [ ] Create payment order model: amount, contract, method, status, Conekta order ID, Aquasis reference
- [ ] Integrate card payment flow: tokenize (client-side) -> create charge (server-side) -> confirm -> update Aquasis
- [ ] Implement 3D Secure challenge handling for card authentication
- [ ] Generate CFDI-compliant digital receipt upon successful payment
- [ ] Create REST endpoints: `POST /api/v1/portal/payments/card`, `GET /api/v1/portal/payments/:id/receipt`

**Frontend Tasks:**
- [ ] Build Payment Flow component:
  - Bill selection (pay current bill, pay specific amount, pay full balance)
  - Amount confirmation with itemized breakdown
  - Conekta.js card tokenization form (PCI-compliant, card data never touches our server)
  - 3D Secure iframe/redirect handling
  - Payment processing spinner with timeout handling
  - Success confirmation with receipt download
  - Error handling with retry and alternative payment method suggestion
- [ ] Implement payment amount validation (minimum payment, maximum single transaction limit)

**Acceptance Criteria:**
- User can pay by Visa/Mastercard/AMEX with 3D Secure
- Card data is tokenized client-side (PCI SAQ-A compliance)
- Payment confirmation updates balance in real time
- CFDI digital receipt is generated and downloadable

### Sprint 5 (Weeks 9-10): OXXO & SPEI Payments

**Backend Tasks:**
- [ ] Implement OXXO reference generation via Conekta:
  - Generate barcode reference number
  - Set expiration (72 hours standard)
  - Create printable/shareable payment voucher
- [ ] Implement SPEI reference generation via Conekta:
  - Generate CLABE (Clave Bancaria Estandarizada) for bank transfer
  - Set reference number and beneficiary details
  - Configure expiration window
- [ ] Implement webhook handlers for OXXO and SPEI payment confirmation (async, may take 24-48 hours for OXXO)
- [ ] Create reconciliation job: match incoming Conekta webhooks with pending payment orders
- [ ] Update Aquasis billing status upon payment confirmation via `cobrarReferencia`

**Frontend Tasks:**
- [ ] Build OXXO Payment component:
  - Display barcode reference number in large, scannable format
  - "Share via WhatsApp" button (deep link with reference details)
  - "Save as image" for offline use at OXXO store
  - Expiration countdown timer
  - Instructions in plain Spanish: "Take this reference to any OXXO store and pay in cash"
- [ ] Build SPEI Payment component:
  - Display CLABE number with copy-to-clipboard
  - Display reference number and beneficiary name
  - Bank transfer instructions step-by-step
  - "Open my bank app" deep link suggestions
- [ ] Build Pending Payments tracker:
  - List of OXXO/SPEI references awaiting confirmation
  - Status indicator (pending, confirmed, expired)
  - Push notification when payment is confirmed

**Acceptance Criteria:**
- User can generate OXXO reference and share via WhatsApp
- User can generate SPEI CLABE and copy to clipboard
- Payments are reconciled within 5 minutes of Conekta webhook
- Expired references are clearly marked and re-generation is offered

### Sprint 6 (Weeks 11-12): Auto-Pay & Payment Management

**Backend Tasks:**
- [ ] Integrate `cambiarSenasCobroBancarias` / `cambiarDomiciliacionBancaria` for auto-pay enrollment
- [ ] Implement auto-pay enrollment flow:
  - Store tokenized card reference in Conekta (not raw card data)
  - Create recurring charge schedule aligned with billing cycle
  - Implement pre-charge notification (3 days before)
  - Implement charge retry logic (up to 3 attempts on failure)
- [ ] Create auto-pay management endpoints: `POST /api/v1/portal/autopay/enroll`, `DELETE /api/v1/portal/autopay`, `GET /api/v1/portal/autopay/status`
- [ ] Implement payment receipt email/WhatsApp delivery

**Frontend Tasks:**
- [ ] Build Auto-Pay Enrollment component:
  - Explanation of domiciliacion (recurring charge) in plain Spanish
  - Card selection (use saved card or add new)
  - Authorization confirmation with terms
  - Success confirmation with next charge date
- [ ] Build Auto-Pay Management component:
  - Current auto-pay status and enrolled card (masked)
  - Next scheduled charge date and estimated amount
  - Payment method update
  - Cancel auto-pay with confirmation
- [ ] Build Payment Method management:
  - Save multiple cards via Conekta tokenization
  - Set default payment method
  - Delete saved cards
- [ ] Integrate payment confirmation push notifications

**Acceptance Criteria:**
- User can enroll in auto-pay with a saved card
- Pre-charge notification is sent 3 days before scheduled payment
- User can cancel auto-pay at any time
- Payment receipts are sent via email and optionally WhatsApp

### PCI Compliance Notes

- **PCI SAQ-A:** Card data is tokenized entirely by Conekta.js on the client side. No card data is stored, processed, or transmitted by AGORA servers.
- **Conekta is PCI Level 1 certified**, handling all sensitive payment data.
- **Webhook verification:** All Conekta webhooks are verified using HMAC signatures.
- **Idempotency:** All payment creation requests use idempotency keys to prevent duplicate charges.

---

## 4. Sprint 7-9 (Weeks 13-18): WhatsApp Chatbot

### Objective

Deploy a WhatsApp Business API-powered chatbot that leverages Maria AI to handle the 10 most common customer inquiry categories, enabling balance checks, bill delivery, payment reference generation, and outage notifications directly in WhatsApp.

### Architecture

```
+-------------------+       +--------------------+
|   WhatsApp User   |<----->|  WhatsApp Business |
|   (Citizen)       |       |  API (Cloud API)   |
+-------------------+       +--------------------+
                                      |
                            +--------------------+
                            |  AGORA Webhook     |
                            |  Receiver (Rails)  |
                            +--------------------+
                                      |
                            +--------------------+
                            |  Maria AI Agent    |
                            |  - Intent classify |
                            |  - Identity verify |
                            |  - Action execute  |
                            |  - Response render |
                            +--------------------+
                              /        |        \
                    +---------+  +---------+  +---------+
                    | Aquasis |  | Payment |  | Notif.  |
                    |   API   |  | Service |  | Engine  |
                    +---------+  +---------+  +---------+
```

### Sprint 7 (Weeks 13-14): WhatsApp Business API Setup & Core Intents

**Backend Tasks:**
- [ ] Register WhatsApp Business Account and obtain phone number verification
- [ ] Set up WhatsApp Cloud API webhook endpoint in AGORA Rails
- [ ] Implement message ingestion pipeline: receive -> parse -> route to Maria AI
- [ ] Configure message templates for proactive outreach (pre-approval required by Meta):
  - `bill_reminder` - "Your water bill of ${{amount}} is due on {{date}}"
  - `payment_confirmation` - "Payment of ${{amount}} received. New balance: ${{balance}}"
  - `outage_alert` - "Scheduled maintenance in {{zone}} on {{date}} from {{start}} to {{end}}"
  - `consumption_alert` - "Your water consumption this month is {{percent}}% above your average"
- [ ] Implement conversation session management (WhatsApp 24-hour window rules)

**Maria AI Integration:**
- [ ] Define 10 intent categories for water utility queries:
  1. **Balance Inquiry** - "What do I owe?" / "Cuanto debo?"
  2. **Bill Request** - "Send me my bill" / "Mandame mi recibo"
  3. **Payment Reference** - "I want to pay at OXXO" / "Quiero pagar en OXXO"
  4. **Consumption Check** - "How much water did I use?" / "Cuanto consumi?"
  5. **Outage Information** - "Is there a water outage?" / "Hay corte de agua?"
  6. **Tariff Question** - "How much does water cost?" / "Cuanto cuesta el agua?"
  7. **Service Request** - "I have a leak" / "Tengo una fuga"
  8. **Payment Confirmation** - "Did my payment go through?" / "Ya se registro mi pago?"
  9. **Profile Update** - "Change my email" / "Cambiar mi correo"
  10. **General Information** - "Office hours?" / "Horarios de atencion?"
- [ ] Build intent classification prompt with Mexican Spanish colloquialisms and slang
- [ ] Implement identity verification tiers:
  - **Level 0 (No auth):** General information, office hours, tariff info
  - **Level 1 (Contract only):** Balance inquiry, consumption check
  - **Level 2 (Contract + phone/email):** Bill request, payment reference
  - **Level 3 (Contract + OTP):** Profile updates, service requests

**Acceptance Criteria:**
- WhatsApp messages are received and routed to Maria AI within 2 seconds
- Balance inquiry returns accurate data from Aquasis in a formatted WhatsApp message
- Message templates are approved by Meta for proactive outreach

### Sprint 8 (Weeks 15-16): Transactional Flows & Bill Delivery

**Backend Tasks:**
- [ ] Implement balance inquiry flow:
  - Receive contract number -> verify identity (Level 1) -> call `getDeuda` -> format response
  - WhatsApp interactive message with: current balance, due date, "Pay Now" quick reply
- [ ] Implement bill delivery flow:
  - Verify identity (Level 2) -> call `getPdfFactura` -> send PDF as WhatsApp document
  - Include bill summary in message text: period, amount, due date
- [ ] Implement payment reference generation flow:
  - Present payment method selection (interactive list: Card, OXXO, SPEI)
  - Generate OXXO reference -> send as formatted message with barcode image
  - Generate SPEI CLABE -> send as copyable text message
  - Include "Open portal to pay by card" link
- [ ] Implement consumption check flow:
  - Call `getConsumosParaGraficas` -> render chart as image -> send via WhatsApp
  - Include text summary: current month, previous month, year average
- [ ] Implement outage notification flow:
  - Query active outages by zone/address
  - Format: affected area, estimated restoration time, alternative water supply info

**Frontend Tasks (AGORA Agent Dashboard):**
- [ ] Build WhatsApp conversation view in AGORA agent inbox
- [ ] Display WhatsApp-specific message types (interactive buttons, lists, documents)
- [ ] Show chatbot conversation history with intent tags

**Acceptance Criteria:**
- Citizen can check balance and receive formatted response in under 5 seconds
- Bill PDF is delivered via WhatsApp within 10 seconds
- OXXO reference is generated and displayed with shareable barcode
- Consumption chart image is generated and sent

### Sprint 9 (Weeks 17-18): Human Handoff & Maria AI Refinement

**Backend Tasks:**
- [ ] Implement seamless handoff to human agent:
  - Trigger conditions: explicit request ("hablar con agente"), sentiment detection (frustration/anger), repeated intent failure (3+ unresolved attempts), complex transaction
  - Transfer full conversation context to AGORA agent inbox
  - Notify assigned agent with conversation summary and intent history
  - Maintain WhatsApp session continuity (agent responds via WhatsApp through AGORA)
- [ ] Implement conversation analytics:
  - Intent classification accuracy tracking
  - Containment rate (resolved without human)
  - Average resolution time per intent
  - Customer satisfaction micro-survey (1-5 star rating after resolution)
- [ ] Train Maria AI on water utility domain knowledge:
  - CEA Queretaro-specific FAQs (office locations, hours, contact info)
  - Tariff structure explanation
  - Water quality information
  - Conservation tips personalized by consumption level
  - Complaint handling escalation procedures
- [ ] Implement multi-contract support: "Which contract do you want to check?" flow

**Acceptance Criteria:**
- Handoff to human agent preserves full conversation context
- Containment rate reaches 60%+ on supported intents
- Intent classification accuracy >90% on test dataset
- CSAT micro-survey is sent after resolved conversations

### WhatsApp Business API Key Constraints

- **24-hour messaging window:** After user's last message, free-form responses allowed for 24 hours. After that, only pre-approved templates.
- **Template message limits:** Start at 1,000/day, scaling to 100,000/day based on quality score.
- **Media limits:** Documents up to 100MB, images up to 5MB.
- **Interactive messages:** Up to 3 buttons per message, up to 10 items in list messages.
- **Rate limits:** 80 messages/second per phone number.

---

## 5. Sprint 10-12 (Weeks 19-24): Digital Identity & Notifications

### Objective

Implement a 4-level digital identity verification system using Mexican government IDs (INE/CURP), build a customer registration/onboarding flow, and deploy a proactive notification engine across SMS, email, push, and WhatsApp channels.

### Sprint 10 (Weeks 19-20): Digital Identity Verification

**Identity Verification Architecture:**

```
Level 0: Anonymous        -> General info, FAQ, tariff queries
Level 1: Contract Number  -> Balance, consumption (read-only)
Level 2: Contract + OTP   -> Bills, payments, profile view
Level 3: Contract + INE   -> Profile changes, service requests
Level 4: Contract + INE   -> Contract modifications, legal changes
         + CURP + Selfie     (new connection, name change, transfer)
```

**Backend Tasks:**
- [ ] Implement Level 1 verification: contract number validation against `getContrato`
- [ ] Implement Level 2 verification: OTP delivery via SMS (Twilio/MessageBird) and email, with 6-digit code, 5-minute expiration, 3 attempt limit
- [ ] Implement Level 3 verification (INE):
  - INE (Instituto Nacional Electoral) credential OCR:
    - Front: full name, address, voter key (clave de elector), CURP, birth date
    - Back: CIC (Credencial para Votar con fotografia) number, OCR code
  - Use third-party KYC provider (e.g., Mati/Metamap, Truora, or Veridocid) for:
    - Document authenticity check (hologram detection, MRZ validation)
    - Data extraction via OCR
    - Cross-reference extracted name with `getTitularPorContrato`
  - Store verification status, not identity documents (data minimization)
- [ ] Implement Level 4 verification (INE + CURP + liveness):
  - CURP (Clave Unica de Registro de Poblacion) validation against RENAPO (Registro Nacional de Poblacion) API
  - Liveness detection / selfie-to-INE photo matching via KYC provider
  - Store verification result with confidence score
- [ ] Create identity verification endpoints:
  - `POST /api/v1/portal/identity/verify-otp` (Level 2)
  - `POST /api/v1/portal/identity/verify-ine` (Level 3)
  - `POST /api/v1/portal/identity/verify-full` (Level 4)
  - `GET /api/v1/portal/identity/status`

**Frontend Tasks:**
- [ ] Build OTP verification component (SMS code input with auto-advance)
- [ ] Build INE capture flow:
  - Camera capture with alignment guide overlay
  - Auto-crop and quality check before upload
  - Front and back capture flow
  - Processing indicator with estimated time
  - Result display: verified / manual review needed / rejected
- [ ] Build CURP verification component:
  - CURP input field with format validation (18 characters)
  - Auto-lookup and confirmation of name/date of birth
- [ ] Build selfie capture with liveness check:
  - Face alignment circle overlay
  - Instructions: blink, turn head (anti-spoofing)
  - Match result display

**Acceptance Criteria:**
- Level 2 OTP verification completes in under 30 seconds
- Level 3 INE verification completes in under 2 minutes
- Level 4 full verification completes in under 3 minutes
- False positive rate <1%, false negative rate <5%

### Sprint 11 (Weeks 21-22): Customer Registration & Onboarding

**Backend Tasks:**
- [ ] Create customer registration flow:
  - Step 1: Enter contract number
  - Step 2: Verify ownership (Level 2 OTP to registered phone/email)
  - Step 3: Create portal account (email, password, phone)
  - Step 4: Optional Level 3/4 verification for full access
- [ ] Integrate `getTitularPorContrato`, `getContratosPorNif` for multi-contract linking
- [ ] Implement account recovery: forgot password via OTP, email link
- [ ] Create onboarding API endpoints:
  - `POST /api/v1/portal/register`
  - `POST /api/v1/portal/verify-ownership`
  - `POST /api/v1/portal/link-contract`
  - `POST /api/v1/portal/forgot-password`

**Frontend Tasks:**
- [ ] Build step-by-step registration wizard:
  - Progress indicator (4 steps)
  - Contract number input with format helper
  - OTP verification
  - Account creation form (email, password with strength meter, phone)
  - Success screen with portal tour
- [ ] Build onboarding tour:
  - Highlight key features: dashboard, bills, payments, consumption
  - Skip option for returning users
  - Contextual tooltips on first visit to each section
- [ ] Build multi-contract management:
  - "Add another contract" flow (contract number + OTP verification)
  - Contract switcher in header/nav
  - Aggregate balance view across all contracts

**Acceptance Criteria:**
- Registration completes in under 3 minutes
- Multi-contract linking works for users with multiple service addresses
- Onboarding tour activates on first login

### Sprint 12 (Weeks 23-24): Proactive Notification Engine

**Notification Engine Architecture:**

```
+-----------------------------------------------------+
|              Notification Engine                      |
+-----------------------------------------------------+
|                                                       |
|  Event Sources                                        |
|  +---+  +---+  +---+  +---+  +---+                   |
|  |Bill|  |Pay|  |Out|  |Con|  |Sys|                   |
|  |Gen |  |Due|  |age|  |sum|  |tem|                   |
|  +---+  +---+  +---+  +---+  +---+                   |
|       \    |     |     /    /                          |
|        +---+-----+----+---+                           |
|        | Event Router & Template Engine |              |
|        +-------------------------------+              |
|           /      |       |        \                   |
|     +----+  +----+  +----+  +------+                  |
|     |SMS |  |Email|  |Push|  |WhApp |                 |
|     |Twil|  |Send |  |FCM/|  |Biz  |                 |
|     |io  |  |Grid |  |APNS|  |API  |                 |
|     +----+  +----+  +----+  +------+                  |
|                                                       |
|  Preference Store (per user, per channel, per type)   |
+-----------------------------------------------------+
```

**Backend Tasks:**
- [ ] Create notification event system with event types:
  - `bill_generated` - New bill available
  - `payment_due_reminder` - Bill due in 3 days, 1 day, overdue
  - `payment_received` - Payment confirmed
  - `consumption_alert` - Usage exceeds threshold (configurable: 120%, 150%, 200% of average)
  - `outage_scheduled` - Planned maintenance in user's zone
  - `outage_emergency` - Unplanned outage in user's zone
  - `outage_resolved` - Service restored
  - `autopay_upcoming` - Auto-pay charge in 3 days
  - `autopay_failed` - Auto-pay charge failed
  - `identity_verified` - Identity verification complete
- [ ] Implement channel adapters:
  - **SMS:** Twilio Programmable Messaging (for OTP and critical alerts)
  - **Email:** SendGrid with responsive HTML templates (for bills, receipts, detailed notifications)
  - **Push:** Firebase Cloud Messaging (web push for PWA)
  - **WhatsApp:** Pre-approved template messages via WhatsApp Business API
- [ ] Create notification preference model: user -> channel -> event type -> enabled/disabled
- [ ] Implement notification scheduling (batch send for bill generation, immediate for outages)
- [ ] Create notification log for delivery tracking and debugging
- [ ] Implement rate limiting per user per channel (max 5 SMS/day, 3 push/hour)

**Frontend Tasks:**
- [ ] Build Notification Preferences component:
  - Matrix UI: event types (rows) x channels (columns) with toggles
  - "Quiet hours" setting (no push/SMS between 10pm-7am)
  - Channel verification status (verified phone, verified email)
  - Consumption alert threshold slider (default: 150% of 6-month average)
- [ ] Build Notification Center in portal:
  - Bell icon with unread count badge
  - Dropdown/page with all notifications, grouped by date
  - Mark as read, dismiss, link to relevant section
- [ ] Implement push notification permission request flow with explanation

**Acceptance Criteria:**
- Bill reminder sent via preferred channels 3 days before due date
- Consumption alerts trigger when usage exceeds configured threshold
- Users can manage preferences per channel and per notification type
- Notification delivery rate >95% across all channels

---

## 6. Sprint 13-14 (Weeks 25-28): Service Requests & Accessibility

### Objective

Enable citizens to submit service requests online, track work order progress, and ensure the entire portal meets WCAG 2.1 AA accessibility standards with plain Spanish language.

### Sprint 13 (Weeks 25-26): Online Service Requests

**Backend Tasks:**
- [ ] Integrate `crearOrdenTrabajo` for work order creation (already integrated in AGORA)
- [ ] Integrate `solicitudAltaSuministro` for new connection requests
- [ ] Integrate `solicitudBajaSuministro` for service termination requests
- [ ] Integrate `solicitudIntroduccionLectura` for self-reported meter readings
- [ ] Integrate `getActuaciones` for service intervention history
- [ ] Create REST endpoints:
  - `POST /api/v1/portal/service-requests` (create)
  - `GET /api/v1/portal/service-requests` (list)
  - `GET /api/v1/portal/service-requests/:id` (status)
  - `POST /api/v1/portal/meter-reading` (self-read submission)

**Frontend Tasks:**
- [ ] Build Service Request Submission wizard:
  - Request type selection (report leak, request repair, new connection, meter issue, water quality complaint, general inquiry)
  - Location input (auto-populate from contract address, or map pin for leak reports)
  - Description text area with photo upload (camera or gallery)
  - Priority indicator (emergency leak vs. general request)
  - Confirmation with tracking number
- [ ] Build Work Order Status Tracker:
  - Timeline view: submitted -> assigned -> in progress -> completed
  - Assigned technician info (name, estimated arrival)
  - Status update push notifications
  - Satisfaction survey upon completion
- [ ] Build Self-Read Meter Reading component:
  - Camera capture of meter with OCR suggestion
  - Manual entry with validation (must be >= last reading)
  - Photo evidence upload
  - Confirmation and submission receipt
- [ ] Build Service Request History list with filtering

**Acceptance Criteria:**
- User can submit a service request in under 2 minutes
- Work order status updates are reflected in real time
- Self-reported meter reading is validated against previous reading
- Photo upload works from both camera and gallery

### Sprint 14 (Weeks 27-28): Accessibility & Language Review

**Accessibility Audit (WCAG 2.1 AA):**
- [ ] Color contrast ratios: all text meets 4.5:1 (normal) and 3:1 (large) contrast ratios
- [ ] Keyboard navigation: all interactive elements are reachable and operable via keyboard alone
- [ ] Screen reader compatibility: all images have alt text, form fields have labels, dynamic content has ARIA live regions
- [ ] Focus management: visible focus indicators, logical focus order, focus trapping in modals
- [ ] Motion and animation: respect `prefers-reduced-motion` media query
- [ ] Text sizing: content remains usable at 200% zoom
- [ ] Touch targets: minimum 44x44px touch target size
- [ ] Error identification: form errors are clearly described with suggestions for correction
- [ ] Time limits: no session timeouts shorter than 20 minutes, with warning and extension option

**Plain Spanish Language Review:**
- [ ] Engage professional plain-language editor (Spanish specialization)
- [ ] Review all UI text, error messages, help content, and notifications
- [ ] Replace technical jargon with common Mexican Spanish terms:
  - "domiciliacion bancaria" -> "pago automatico"
  - "suministro" -> "servicio de agua"
  - "explotacion" -> "zona de servicio"
  - "titular" -> "persona responsable de la cuenta"
- [ ] Ensure reading level is appropriate for general public (target: 6th grade reading level)
- [ ] Add contextual help tooltips for unavoidable technical terms

**Senior Citizen Design Considerations:**
- [ ] Implement "Large Text" mode toggle (increases base font size to 18px)
- [ ] Ensure all critical actions have confirmation dialogs (prevent accidental taps)
- [ ] Add clear "Back" and "Home" navigation on every screen
- [ ] Minimize multi-step flows (maximum 4 steps)
- [ ] Provide phone call fallback option on every error screen ("Need help? Call us at...")
- [ ] Test with users aged 60+ in usability sessions

**Testing Tasks:**
- [ ] Run automated accessibility scan (axe-core / pa11y)
- [ ] Manual screen reader testing (NVDA on Windows, VoiceOver on macOS/iOS, TalkBack on Android)
- [ ] Keyboard-only navigation testing on all flows
- [ ] Usability testing with 5+ users across age groups and technical comfort levels
- [ ] Cross-browser testing: Chrome, Safari, Firefox, Samsung Internet (top 4 in Mexico)
- [ ] Device testing: low-end Android (2GB RAM), iPhone SE, tablets

**Acceptance Criteria:**
- Zero WCAG 2.1 AA violations in automated scan
- All critical flows completable with screen reader
- Plain Spanish review complete with all changes implemented
- Usability testing conducted with report and fixes applied

---

## 7. Mobile Strategy

### Recommendation: PWA-First with Capacitor Native Wrapper

Based on CEA Queretaro's customer demographics (78% smartphone penetration, 75-80% Android, constrained data budgets, high app fatigue), the recommended strategy is:

**Phase 8A (Included in this plan): Progressive Web App**
- Build the customer portal as a PWA using Vue 3 + Vite + Workbox
- Install size: 2-5MB (vs. 20-80MB for native app download)
- Works on all modern browsers without app store download
- Service worker for offline bill/consumption viewing
- Web push notifications on Android (full support) and iOS 16.4+ (Safari)
- "Add to Home Screen" prompt with custom install banner

**Phase 8B (Future, conditional on adoption metrics): Capacitor Native Wrapper**
- Trigger: >30% monthly active portal users after 6 months
- Wrap Vue 3 PWA in Capacitor shell for native distribution
- Native-only enhancements:
  - NFC for CoDi contactless payments
  - Camera OCR for meter reading (improved accuracy over web camera API)
  - Biometric authentication (fingerprint/face)
  - Background location for "nearest OXXO" feature
- Distribute via Google Play Store and Apple App Store
- Estimated additional effort: 1-2 developers, 4-6 months

### PWA Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | <1.5s (4G), <3s (3G) | Lighthouse |
| Time to Interactive | <3.5s (4G), <7s (3G) | Lighthouse |
| Lighthouse Performance | >90 | Lighthouse |
| Lighthouse PWA Score | >90 | Lighthouse |
| Service Worker Cache | App shell + last 6 bills | Custom metric |
| Offline Capability | Dashboard, bills, consumption (read-only) | Manual test |
| Install prompt conversion | >15% of eligible visitors | Analytics |

### Offline-First Data Strategy

| Data | Cache Strategy | Storage | Freshness |
|------|---------------|---------|-----------|
| App shell (HTML/CSS/JS) | Cache-first | Cache API | On deployment |
| Account profile | Stale-while-revalidate | IndexedDB | 1 hour |
| Last 6 bills (metadata) | Network-first with fallback | IndexedDB | 24 hours |
| Bill PDFs | Cache on download | IndexedDB (blob) | Permanent |
| 12-month consumption | Stale-while-revalidate | IndexedDB | 6 hours |
| Notifications | Network-first | IndexedDB | 15 minutes |
| Pending service requests | Background sync queue | IndexedDB | On connectivity |

---

## 8. Analytics

### User Behavior Tracking

Implement analytics to measure portal adoption, engagement, and self-service effectiveness.

**Analytics Platform:** Matomo (self-hosted, privacy-compliant, no third-party data sharing -- important for government services).

### Key Metrics Dashboard

**Adoption Metrics:**
- Total registered users (target: 15% of active contracts in Year 1)
- Monthly active users (MAU) and daily active users (DAU)
- Registration funnel: visit -> start registration -> complete registration -> first login
- PWA install rate
- Channel distribution: web browser vs. PWA vs. WhatsApp

**Engagement Metrics:**
- Average session duration
- Pages per session
- Feature usage: bills viewed, payments made, consumption checked, service requests submitted
- Return visit frequency
- Notification engagement rate (open rate, click-through rate)

**Self-Service Metrics:**
- Digital payment adoption rate (target: 30% of payments within 12 months)
- Chatbot containment rate (target: 65-75%)
- Intent resolution success rate per category
- Average time to resolve inquiry (chatbot vs. human agent)
- Office visit reduction (baseline vs. post-launch)
- Call center volume reduction

**Funnel Analysis:**

```
Registration Funnel:
Visit Portal -> View Login (60%) -> Start Registration (25%) ->
Complete OTP (85%) -> Create Account (90%) -> First Dashboard (95%)

Payment Funnel:
View Balance -> Click "Pay Now" (40%) -> Select Method (90%) ->
Enter Details (85%) -> Confirm Payment (92%) -> Success (97%)

Service Request Funnel:
Click "Report Issue" -> Select Type (95%) -> Enter Details (80%) ->
Upload Photo (50%) -> Submit (95%) -> Track Status (60%)
```

**A/B Testing Priorities:**
1. Registration flow: 2-step vs. 4-step wizard
2. Payment method presentation: card-first vs. OXXO-first (optimized for Mexican preference)
3. Dashboard layout: balance-focused vs. consumption-focused
4. WhatsApp chatbot greeting: formal vs. conversational tone
5. Push notification timing: morning vs. evening for bill reminders

---

## 9. Risk Register

| # | Risk | Probability | Impact | Mitigation |
|---|------|:-----------:|:------:|------------|
| R1 | **Low digital adoption among older citizens** | HIGH | HIGH | Senior-friendly design, large text mode, phone fallback on every screen, community education campaigns, paper bill parallel delivery |
| R2 | **Conekta payment gateway downtime** | LOW | HIGH | Implement circuit breaker pattern, show OXXO/SPEI as fallback when card processing is down, display clear error messages with alternative payment instructions |
| R3 | **WhatsApp Business API rate limiting** | MEDIUM | MEDIUM | Start with 1,000 templates/day tier, build quality score gradually, implement message queuing with backpressure, prioritize critical notifications (outage, payment) |
| R4 | **Aquasis SOAP API scalability under portal load** | HIGH | HIGH | Implement caching layer (Redis) for frequently-accessed data (balance, consumption), batch API calls during off-peak hours, set rate limits per user session |
| R5 | **INE/CURP verification service availability** | MEDIUM | MEDIUM | Allow portal use at Level 2 (OTP) for most features, Level 3/4 only for high-security actions, queue verification requests with retry logic |
| R6 | **PCI compliance complexity** | LOW | HIGH | Use Conekta.js tokenization (SAQ-A, simplest PCI scope), never store/process card data server-side, annual PCI self-assessment questionnaire |
| R7 | **Data privacy concerns (INE document handling)** | MEDIUM | HIGH | Store verification results only (not documents), use KYC provider for document processing, implement data retention policy (delete after 30 days), privacy policy disclosure |
| R8 | **WhatsApp 24-hour window constraint** | HIGH | MEDIUM | Pre-approve templates for all proactive notifications, design conversation flows to resolve within single session, re-engagement template message for abandoned conversations |
| R9 | **Offline-first data staleness** | MEDIUM | LOW | Show "Last updated" timestamps on all cached data, auto-refresh on connectivity, clear visual indicator when viewing offline data |
| R10 | **Scope creep: feature requests during development** | HIGH | MEDIUM | Strict sprint goals, product owner gates all additions, maintain "Phase 8B" backlog for non-critical features, two-week sprint cadence with demo and retrospective |
| R11 | **Meta/WhatsApp policy changes** | LOW | HIGH | Abstract WhatsApp integration behind channel adapter interface, maintain SMS as fallback channel, monitor Meta developer changelog weekly |
| R12 | **Concurrent load on portal at billing cycle** | HIGH | MEDIUM | CDN for static assets, auto-scaling for Rails API, pre-generate bill PDFs during off-peak, staggered bill reminder notifications (spread over 3 days) |

---

## 10. Staffing

### Core Team (8.5 FTEs)

| Role | Name/Status | Key Skills Required | Sprint Involvement |
|------|-------------|--------------------|--------------------|
| **Frontend Lead** | To hire | Vue 3, PWA/Workbox, TypeScript, accessibility, performance optimization | Sprints 1-14 |
| **Vue.js Developer 1** | To hire | Vue 3, Pinia, Tailwind CSS, Chart.js, responsive design | Sprints 1-14 |
| **Vue.js Developer 2** | To hire | Vue 3, IndexedDB/Dexie.js, service workers, mobile-first development | Sprints 1-14 |
| **UX/UI Designer** | To hire | Figma, user research, WCAG accessibility, design systems, Mexican market UX | Sprints 1-14 |
| **Backend Developer (Rails)** | Internal (AGORA team) | Rails 7, SOAP/REST APIs, WS-Security, Sidekiq, Redis | Sprints 1-14 |
| **Chatbot Specialist** | To hire | NLU/NLP, WhatsApp Business API, conversation design, Spanish language AI | Sprints 7-14 |
| **Payment Integration Engineer** | To hire | Conekta API, PCI compliance, payment reconciliation, CFDI invoicing | Sprints 4-6 (full), 7-14 (part-time) |
| **QA Engineer** | Internal or hire | Cross-browser testing, accessibility auditing, API testing, Playwright | Sprints 2-14 |
| **Product Owner** | Internal (0.5 FTE) | Water utility domain, stakeholder management, agile backlog grooming | Sprints 1-14 |

### Hiring Timeline

| Week | Hire |
|------|------|
| Phase start - 4 weeks | Frontend Lead, UX/UI Designer (needed from Sprint 1) |
| Phase start - 2 weeks | Vue.js Developers x2 (onboard during Sprint 1) |
| Week 4 | Payment Integration Engineer (prepare for Sprint 4) |
| Week 10 | Chatbot Specialist (prepare for Sprint 7) |
| Week 1 | QA Engineer (ramp during Sprint 1-2) |

### External Dependencies

| Dependency | Provider | Lead Time | Sprint Needed |
|------------|----------|-----------|---------------|
| Conekta merchant account | Conekta | 2-4 weeks | Sprint 4 |
| WhatsApp Business API approval | Meta | 2-6 weeks | Sprint 7 |
| WhatsApp message template approval | Meta | 1-7 days per template | Sprint 7 |
| KYC/Identity verification provider | Metamap/Truora/Veridocid | 2-3 weeks | Sprint 10 |
| SMS provider (Twilio) | Twilio | 1-2 weeks | Sprint 10 |
| Email delivery (SendGrid) | SendGrid | 1 week | Sprint 12 |
| RENAPO CURP validation API | Mexican government | 4-8 weeks (government API access) | Sprint 10 |
| Plain Spanish language editor | Contract hire | 2-3 weeks sourcing | Sprint 14 |

### Knowledge Transfer Requirements

- AGORA platform architecture and codebase walkthrough (2 days)
- Aquasis SOAP API documentation and WS-Security configuration (1 day)
- Maria AI Agent architecture and intent system (1 day for chatbot specialist)
- CEA Queretaro business processes and customer service workflows (1 day)
- Conekta integration documentation and sandbox environment setup (0.5 days)

---

## Appendix A: Definition of Done

A sprint deliverable is "done" when:
1. All acceptance criteria are met
2. Code is reviewed and merged to main branch
3. Unit test coverage >80% for new code
4. Integration tests pass for all API endpoints
5. Accessibility scan shows zero WCAG 2.1 AA violations for new components
6. Performance budgets are met (Lighthouse >90)
7. Documentation updated (API docs, user guides as needed)
8. Product Owner has reviewed and accepted the demo
9. No critical or high-severity bugs remain open

## Appendix B: Key Performance Indicators (Phase 8 Success Metrics)

| KPI | Baseline | 6-Month Target | 12-Month Target |
|-----|----------|----------------|-----------------|
| Customer engagement maturity | 4-5/10 | 6/10 | 7.2/10 |
| Registered portal users | 0 | 15% of contracts | 30% of contracts |
| Digital payment share | 0% | 15% | 30% |
| Chatbot containment rate | N/A | 60% | 75% |
| Office visit reduction | Baseline | -15% | -30% |
| Call center volume reduction | Baseline | -10% | -25% |
| Customer satisfaction (CSAT) | Unknown | >80% | >85% |
| PWA Lighthouse score | N/A | >90 | >95 |
| Notification delivery rate | N/A | >95% | >98% |
| Average portal response time | N/A | <2s | <1.5s |
