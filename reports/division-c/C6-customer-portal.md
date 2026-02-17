# C6 - Modern Citizen Engagement Platform for Water Utilities

## Research Report: CEA Queretaro / AGORA Platform

**Division:** C - Customer Experience & Digital Engagement
**Agent:** C6 - research-customer-portal
**Date:** 2026-02-16
**Classification:** Strategic Research

---

## Executive Summary

CEA Queretaro operates the AGORA omnichannel citizen engagement platform, built on a Ruby on Rails 7 backend with a Vue.js 3 frontend. The platform already provides substantial capabilities in unified communications, AI-powered assistance (Maria AI Agent), and multi-channel engagement across web chat, WhatsApp, SMS, email, voice, and social media. The AquaCIS commercial management system (Aquasis) provides backend operations for contracts, billing, meters, debt management, readings, and work orders via SOAP/REST APIs.

However, significant gaps remain in the customer-facing self-service experience. The current integration exposes only 17 of 126 available Aquasis API operations. Critical missing components include: a dedicated customer self-service portal for account management, native mobile/PWA applications, a Mexican payment gateway ecosystem (SPEI, CoDi, OXXO/convenience store payments), proactive consumption alerting, digital identity verification (INE/CURP), and formal WCAG accessibility compliance for Mexican government standards.

This report analyzes best practices across eight dimensions of modern utility customer engagement and provides a gap analysis against AGORA's current capabilities, with prioritized recommendations for CEA Queretaro's digital transformation roadmap.

**Customer Engagement Maturity Score: 5/10** - Strong communication infrastructure with Maria AI and omnichannel support, but lacking self-service depth, payment integration, mobile strategy, and proactive engagement capabilities.

---

## 1. Self-Service Portal Best Practices

### Industry Landscape

Modern water utility customer portals have evolved from simple bill-view websites into comprehensive self-service ecosystems. Leading platforms (Oracle Utilities Customer Cloud Service, SAP Utilities, Itron's Consumer Engagement, WaterSmart, Dropcountr) provide citizens 24/7 access to their accounts with minimal agent intervention. The benchmark autonomous resolution rate for tier-1 utilities is 70-85% of all customer inquiries handled digitally without human contact.

### Feature Checklist for Water Utility Customer Portals

#### Tier 1 - Essential (Must-Have)

| Feature | Description | AGORA Status |
|---------|-------------|:------------:|
| Account Dashboard | Unified view of account balance, last bill, next due date, consumption summary | Not available |
| Bill View & Download | Current and historical bills in PDF, with line-item detail | Partial (API available: `getPdfFactura`, `getFacturasContrato`) |
| Online Payment | Pay bills via credit/debit card, bank transfer | Not available |
| Consumption History | Monthly/weekly consumption charts and tables | Partial (API available: `getConsumosParaGraficas`) |
| Account Profile Management | Update contact info, notification preferences, email | Partial (API available: `cambiarEmailNotificacionPersona`) |
| Service Request Submission | Report leaks, request inspections, submit complaints | Available via AGORA ticketing |
| Outage Notifications | View current outages affecting service address | Not available |
| Paperless Billing Enrollment | Opt into electronic billing | Partial (API available: `solicitudActivacionFacturaOnline`) |

#### Tier 2 - Enhanced (Differentiating)

| Feature | Description | AGORA Status |
|---------|-------------|:------------:|
| Consumption Alerts | Custom thresholds for high-use notifications | Not available |
| Leak Detection Alerts | AI-driven anomaly detection on consumption patterns | Not available |
| Payment Plans | Set up installment plans for overdue balances | Not available (API available: `cobrarReferencia`, `cobrarReferenciaFrmPago`) |
| Auto-Pay Enrollment | Recurring automatic payments via bank/card | Not available (API available: `cambiarSenasCobroBancarias`) |
| Meter Reading Submission | Self-report meter readings | Not available (API available: `solicitudIntroduccionLectura`) |
| Service Start/Stop | Request new service or termination online | Not available (APIs schema-defined: `solicitudAltaSuministro`, `solicitudBajaSuministro`) |
| Water Usage Comparison | Compare usage to neighborhood averages, similar homes | Not available |
| Document Upload | Upload identification, contracts, or dispute evidence | Available via AGORA |
| Multi-Contract Management | Single login managing multiple service addresses | Not available |

#### Tier 3 - Advanced (Best-in-Class)

| Feature | Description | AGORA Status |
|---------|-------------|:------------:|
| Budget Billing | Equal monthly payments based on projected annual usage | Not available |
| Water Conservation Tips | Personalized recommendations based on consumption patterns | Not available |
| Smart Home Integration | Connect IoT devices (smart water meters, leak sensors) | Not available |
| Real-Time Consumption | Live usage monitoring via AMI/smart meter data | Not available |
| Carbon/Water Footprint | Environmental impact dashboard | Not available |
| Predictive Billing | AI-generated bill estimate before invoice cycle | Not available |
| Community Engagement | Water conservation challenges, leaderboards | Not available |

### Best-in-Class Reference Implementations

1. **DC Water (Washington, D.C.)** - MyDCWater portal with full self-service, AMI integration, real-time consumption, and proactive leak alerts
2. **Singapore PUB** - Smart Water Meter Programme with 15-minute consumption granularity, mobile app with usage analytics
3. **Thames Water (UK)** - MyAccount with budgeting tools, consumption comparison, and integrated payment plans
4. **SABESP (Sao Paulo, Brazil)** - Agencia Virtual with digital contract management, self-reading submission, and CFDI-equivalent digital invoicing
5. **Aguas de Barcelona (Aigues de Barcelona)** - Relevant as Aquasis originates from the Agbar/OCCAM ecosystem; their portal includes full digital contract lifecycle management

### Architecture Recommendation

```
                    +---------------------------+
                    |   Customer Self-Service    |
                    |      Portal (Vue 3)        |
                    +---------------------------+
                              |
                    +---------------------------+
                    |   AGORA API Gateway        |
                    |   (Rails 7 Backend)        |
                    +---------------------------+
                     /          |           \
          +---------+   +-----------+   +----------+
          | Aquasis |   |  Payment  |   |   Push   |
          |  SOAP   |   |  Gateway  |   | Notif.   |
          |  APIs   |   |  (SPEI/   |   | Engine   |
          | (126    |   |  CoDi/    |   | (FCM/    |
          |  ops)   |   |  Cards)   |   |  APNS)   |
          +---------+   +-----------+   +----------+
```

---

## 2. Mobile Strategy: Native vs PWA Analysis

### Context: CEA Queretaro Customer Demographics

CEA Queretaro serves the state of Queretaro, Mexico, with a population of approximately 2.4 million. Key mobile usage characteristics in the Mexican market:

- **Smartphone penetration:** ~78% of the Mexican population (2025), predominantly Android (~75-80% market share vs ~20% iOS)
- **Prepaid vs postpaid mobile:** ~60% prepaid, meaning data budgets are constrained
- **WhatsApp dominance:** >90% of Mexican smartphone users actively use WhatsApp
- **App fatigue:** Mexican users install an average of 30-40 apps but actively use only 8-10 monthly
- **Internet connectivity:** Urban areas have strong 4G/5G; rural Queretaro communities may have intermittent connectivity

### Comparison Matrix

| Criterion | Native App (iOS + Android) | Progressive Web App (PWA) | Recommendation |
|-----------|:------------------------:|:-------------------------:|:--------------:|
| **Development Cost** | HIGH - Separate codebases (or React Native/Flutter) | LOW - Single Vue.js codebase | PWA |
| **Time to Market** | 6-9 months | 2-4 months | PWA |
| **Maintenance Cost** | HIGH - Dual platform updates, app store submissions | LOW - Single deployment | PWA |
| **App Store Discovery** | Better discoverability via search | No app store presence (but installable) | Native |
| **Push Notifications** | Full support (iOS + Android) | Full Android, iOS 16.4+ Safari support | Tie |
| **Offline Capability** | Excellent with local storage | Good with Service Workers + IndexedDB | Tie |
| **Performance** | Superior for complex animations | Adequate for utility portal use case | Tie |
| **Device APIs** | Full access (camera for meter photos, GPS, NFC for CoDi) | Camera (good), GPS (good), NFC (limited) | Native (for NFC/CoDi) |
| **Update Distribution** | App store review delays (1-7 days) | Instant deployment | PWA |
| **Install Friction** | High - requires store download | Low - "Add to Home Screen" prompt | PWA |
| **Data Usage** | App download: 20-80MB | Initial load: 2-5MB | PWA |
| **Target Demographics** | All segments | Better for data-constrained users | PWA |
| **WhatsApp Integration** | Deep linking available | Deep linking available | Tie |

### Recommendation: PWA-First Strategy with Future Native Enhancement

**Phase 1 (Months 1-4): Progressive Web App**
- Build the customer portal as a PWA using Vue.js 3 (leveraging existing AGORA frontend stack)
- Implement Service Worker for offline bill viewing and consumption history caching
- Add "Add to Home Screen" prompt with custom install banner
- Implement push notifications via Web Push API (works on Android immediately, iOS 16.4+)
- Optimize for slow networks: lazy loading, image compression, skeleton screens
- Estimated effort: 2-3 developers, 3-4 months

**Phase 2 (Months 6-12): Native Companion App (Optional)**
- Only if user adoption metrics justify it (target: >30% monthly active users)
- Use framework like Capacitor (from Ionic team) to wrap Vue.js PWA in native shell
- Add native-only features: NFC for CoDi payments, camera for meter reading OCR, biometric authentication
- Estimated effort: 1-2 additional developers, 4-6 months

### Offline Capability Design

```
+--------------------------------------------------+
|              PWA Offline Architecture              |
+--------------------------------------------------+
|                                                    |
|  Service Worker                                    |
|  +----------------------------------------------+  |
|  | Cache Strategy: Stale-While-Revalidate       |  |
|  | - App shell (HTML, CSS, JS) -> Cache First   |  |
|  | - API responses -> Network First w/ fallback |  |
|  | - Static assets -> Cache First               |  |
|  +----------------------------------------------+  |
|                                                    |
|  IndexedDB (Dexie.js)                             |
|  +----------------------------------------------+  |
|  | Cached Data:                                  |  |
|  | - Last 12 months consumption history          |  |
|  | - Last 6 bills (metadata + PDF blob)          |  |
|  | - Account profile                             |  |
|  | - Pending service requests (queue for sync)   |  |
|  | - Notification preferences                    |  |
|  +----------------------------------------------+  |
|                                                    |
|  Background Sync API                              |
|  +----------------------------------------------+  |
|  | Queued Actions (synced when online):           |  |
|  | - Meter reading submissions                   |  |
|  | - Service request creation                    |  |
|  | - Payment confirmations                       |  |
|  | - Profile updates                             |  |
|  +----------------------------------------------+  |
|                                                    |
+--------------------------------------------------+
```

---

## 3. AI-Powered Customer Service

### Current State: Maria AI Agent

AGORA already features "Maria," an LLM-powered AI agent with impressive documented capabilities:
- Natural language understanding with colloquialism handling
- Multi-step problem solving with autonomous workflow navigation
- System integration with government backends
- Document processing for citizen-uploaded files
- Multilingual support with automatic language detection
- Seamless handoff to human agents with full context preservation
- Multi-agent framework supporting specialized agents per department

### Gap Analysis for Water Utility Use Cases

While Maria's architecture is robust, the following water-utility-specific capabilities need to be developed:

#### Water Utility Chatbot Intent Library

| Intent Category | Specific Intents | Implementation Complexity |
|-----------------|-----------------|:-------------------------:|
| **Account Inquiry** | Check balance, view last bill, payment due date, payment history | LOW - map to `getDeuda`, `getFacturasContrato` |
| **Consumption** | View current consumption, compare to previous periods, explain high bill | MEDIUM - map to `getConsumos`, `getConsumosParaGraficas` + analytics |
| **Payments** | Make payment, set up autopay, confirm payment received, request receipt | HIGH - requires payment gateway integration |
| **Service Requests** | Report leak, request inspection, schedule meter replacement | LOW - already integrated via `crearOrdenTrabajo` |
| **Contract Management** | Change holder name, update address, request connection/disconnection | MEDIUM - APIs schema-defined but not integrated |
| **Outage/Supply** | Is there an outage in my area? When will supply resume? | HIGH - requires real-time operations integration |
| **Tariff Information** | What is my rate? How is my bill calculated? What are the charges? | MEDIUM - map to `getTarifaDeAguaPorContrato`, `getConceptos` |
| **Billing Disputes** | My bill seems too high, I want to dispute a charge | MEDIUM - workflow + `solicitudFacturaEnQuejaActiva` |
| **Water Quality** | Is my water safe? What is the hardness? Latest test results? | LOW - FAQ/knowledge base driven |
| **Conservation** | How can I reduce usage? What rebates are available? | LOW - knowledge base + personalized tips |

#### Recommended Chatbot Architecture for CEA

```
+---------------------------------------------------------------+
|                    MARIA - Water Utility Agent                  |
+---------------------------------------------------------------+
|                                                                 |
|  Intent Recognition Layer                                       |
|  +-----------------------------------------------------------+  |
|  | LLM Classification (Claude/GPT) + Fallback Rule Engine    |  |
|  | - Account & Billing intents                                |  |
|  | - Service Request intents                                  |  |
|  | - Informational intents                                    |  |
|  | - Transactional intents (payments, contract changes)       |  |
|  +-----------------------------------------------------------+  |
|                                                                 |
|  Identity Verification Layer                                    |
|  +-----------------------------------------------------------+  |
|  | Pre-Transaction Auth:                                      |  |
|  | 1. Contract number + Registered phone/email (low security) |  |
|  | 2. Contract + last payment amount/date (medium security)   |  |
|  | 3. Contract + INE/CURP + OTP via SMS (high security)       |  |
|  +-----------------------------------------------------------+  |
|                                                                 |
|  Aquasis Integration Layer (Action Functions / Tools)           |
|  +-----------------------------------------------------------+  |
|  | consultaDetalleContrato -> Account overview                |  |
|  | getDeuda / getDeudaContrato -> Balance & debt info         |  |
|  | getConsumos / getConsumosParaGraficas -> Consumption data  |  |
|  | getFacturasContrato / getPdfFactura -> Invoice access      |  |
|  | getLecturas -> Reading history                             |  |
|  | getTarifaDeAguaPorContrato -> Rate information             |  |
|  | crearOrdenTrabajo -> Service request creation              |  |
|  | solicitudIntroduccionLectura -> Self-reading submission    |  |
|  | cambiarEmailNotificacionPersona -> Profile updates         |  |
|  +-----------------------------------------------------------+  |
|                                                                 |
|  Response Generation Layer                                      |
|  +-----------------------------------------------------------+  |
|  | - LLM-generated natural language responses in Spanish      |  |
|  | - Structured data formatting (tables, charts via cards)    |  |
|  | - Action confirmation flows with user verification         |  |
|  | - Escalation triggers (sentiment analysis, complexity)     |  |
|  +-----------------------------------------------------------+  |
|                                                                 |
+---------------------------------------------------------------+
```

#### Key Performance Metrics to Target

| Metric | Current (Estimated) | Target |
|--------|:-------------------:|:------:|
| Autonomous resolution rate | Unknown | 65-75% |
| Average first response time | <3 sec (Maria) | <3 sec |
| Intent recognition accuracy | Unknown | >92% |
| Customer satisfaction (CSAT) | Unknown | >85% |
| Containment rate (no human escalation) | Unknown | 70% |
| Average conversation duration | Unknown | <4 minutes |
| Successful transaction completion | Unknown | >80% |

### WhatsApp-First Chatbot Strategy

Given that >90% of Mexican smartphone users are on WhatsApp, the AI chatbot should be optimized for WhatsApp as the primary channel:

1. **Interactive Message Templates**: Use WhatsApp's structured buttons, list messages, and quick replies
2. **Rich Media**: Send bill PDFs, consumption charts as images, location maps for service points
3. **Payment Links**: WhatsApp Business API supports embedded payment links
4. **Proactive Outreach**: Pre-approved template messages for bill reminders, outage alerts
5. **Catalog Integration**: Display available services as WhatsApp product catalog items
6. **Flow API**: Use WhatsApp Flows for multi-step forms (service requests, contract changes)

---

## 4. Notification Engine: Proactive Communication Platform

### Current State

AGORA supports:
- Web push notifications for mobile agents
- WhatsApp template messages for proactive outreach
- SMS two-way communication
- Email with IMAP/SMTP integration
- Proactive messaging campaigns (web chat)

However, there is no evidence of a structured notification engine specifically designed for water utility customer communications (consumption alerts, bill reminders, outage notifications, etc.).

### Notification Engine Architecture

```
+------------------------------------------------------------------+
|                  NOTIFICATION ENGINE                               |
+------------------------------------------------------------------+
|                                                                    |
|  Event Sources                                                     |
|  +--------------------------------------------------------------+  |
|  | Aquasis Events:                                               |  |
|  | - Invoice generated (billing cycle)                           |  |
|  | - Payment received                                            |  |
|  | - Payment overdue                                             |  |
|  | - Meter reading scheduled                                     |  |
|  | - Consumption anomaly detected                                |  |
|  | - Service order status change                                 |  |
|  |                                                               |  |
|  | Operations Events:                                            |  |
|  | - Planned maintenance (sector/zone)                           |  |
|  | - Emergency outage                                            |  |
|  | - Water quality alert                                         |  |
|  | - Service restoration                                         |  |
|  |                                                               |  |
|  | Customer Events:                                              |  |
|  | - Consumption threshold exceeded (user-defined)               |  |
|  | - Budget alert (approaching estimated bill amount)            |  |
|  | - Possible leak detection (unusual continuous flow)           |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  Notification Rules Engine (Sidekiq + Redis)                       |
|  +--------------------------------------------------------------+  |
|  | Rule Evaluation:                                              |  |
|  | - Customer preference matching (channel, frequency, time)     |  |
|  | - Deduplication (no repeat within cooldown window)            |  |
|  | - Priority classification (CRITICAL/HIGH/MEDIUM/LOW)          |  |
|  | - Template selection (language, channel format)               |  |
|  | - Throttling (max N notifications per customer per day)       |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  Channel Router                                                    |
|  +--------------------------------------------------------------+  |
|  | Priority Cascade:                                             |  |
|  | CRITICAL: SMS + WhatsApp + Push + Email (all channels)       |  |
|  | HIGH:     WhatsApp (primary) + Push + Email                  |  |
|  | MEDIUM:   WhatsApp (primary) || Email                        |  |
|  | LOW:      Email only || In-app notification                  |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  Delivery Tracking                                                 |
|  +--------------------------------------------------------------+  |
|  | - Delivery status per channel (sent/delivered/read/failed)   |  |
|  | - Fallback logic (if WhatsApp fails -> SMS -> Email)         |  |
|  | - Analytics: open rates, click rates, opt-out rates          |  |
|  | - Compliance: opt-in/opt-out management per LFPDPPP          |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

### Notification Types and Templates

| Notification Type | Priority | Channels | Frequency | Template Example (Spanish) |
|-------------------|:--------:|----------|:---------:|---------------------------|
| Bill Ready | HIGH | WhatsApp, Email, Push | Monthly | "Tu recibo de agua de [MES] esta listo. Monto: $[AMOUNT]. Vence: [DATE]. Paga aqui: [LINK]" |
| Payment Reminder (3 days before) | MEDIUM | WhatsApp, Push | Monthly | "Recordatorio: Tu pago de agua vence en 3 dias. Monto: $[AMOUNT]. Paga en linea: [LINK]" |
| Payment Overdue | HIGH | WhatsApp, SMS, Email | Weekly (max 3) | "Tu pago de agua esta vencido. Evita recargos pagando hoy: $[AMOUNT]. [LINK]" |
| Payment Confirmed | LOW | WhatsApp, Email | Per event | "Pago recibido por $[AMOUNT] para contrato [CONTRACT]. Gracias." |
| High Consumption Alert | HIGH | WhatsApp, Push | When detected | "Alerta: Tu consumo de agua este mes ([X] m3) es [Y]% mayor al promedio. Revisa posibles fugas." |
| Possible Leak Detection | CRITICAL | WhatsApp, SMS, Push | When detected | "ALERTA: Detectamos consumo inusual continuo en tu servicio. Posible fuga. Revisa tu instalacion o llama al [PHONE]." |
| Planned Maintenance | MEDIUM | WhatsApp, Email | 48h + 24h before | "Aviso: Mantenimiento programado en tu zona el [DATE] de [TIME]-[TIME]. Podria haber baja presion o corte temporal." |
| Emergency Outage | CRITICAL | SMS, WhatsApp, Push | Per event | "AVISO: Corte de agua en tu zona por emergencia. Estamos trabajando. Estimacion: [TIME]. Actualizaciones: [LINK]" |
| Service Restored | HIGH | WhatsApp, Push | Per event | "Servicio de agua restaurado en tu zona. Si aun tienes problemas, contactanos: [LINK]" |
| Meter Reading Scheduled | LOW | WhatsApp, Email | Bi-monthly | "El lecturista visitara tu zona entre [DATE1] y [DATE2]. Asegurate de que tu medidor sea accesible." |
| Service Order Update | MEDIUM | WhatsApp, Push | Per status change | "Actualizacion: Tu solicitud [ORDER_ID] cambio a estado: [STATUS]. [DETAILS_LINK]" |
| Conservation Tips | LOW | Email | Monthly | Personalized water-saving recommendations based on consumption profile |

### Customer Preference Management

Customers should be able to configure:
- **Channel preference**: Primary (WhatsApp/SMS/Email) and secondary channels
- **Notification types**: Opt in/out per notification category
- **Quiet hours**: No notifications between configured times (e.g., 10pm-7am except CRITICAL)
- **Consumption alert thresholds**: Custom m3 or percentage thresholds
- **Language preference**: Spanish (primary), indigenous languages (future)
- **Contact method for household members**: Allow multiple contacts per contract

---

## 5. Payment Integration: Mexican Payment Ecosystem

### Overview of Mexican Digital Payment Landscape

Mexico's payment ecosystem has undergone rapid digitalization, accelerated by Banco de Mexico's regulatory initiatives and COVID-19 adoption shifts. For CEA Queretaro, the payment integration must support the full spectrum of how Mexicans pay, from digital-first to cash-dependent populations.

### Payment Methods Technical Guide

#### 5.1 SPEI (Sistema de Pagos Electronicos Interbancarios)

| Attribute | Detail |
|-----------|--------|
| **Operator** | Banco de Mexico (Banxico) |
| **Type** | Real-time interbank transfer |
| **Settlement** | Near-instant (seconds to minutes) |
| **Availability** | 24/7/365 (since Nov 2019) |
| **Cost per transaction** | $0.40-3.50 MXN (varies by bank) |
| **Integration approach** | Through banking partner or PSP (Payment Service Provider) |
| **CLABE requirement** | CEA needs designated CLABE(s) for collections |
| **Reconciliation** | Via SPEI reference number (7 digits) mapped to contract number |

**Technical Integration:**
- CEA Queretaro would obtain a CLABE (Clave Bancaria Estandarizada - 18-digit account number)
- Generate unique SPEI references per invoice/contract
- Receive payment confirmations via banking API or batch file reconciliation
- PSP partners: Conekta, OpenPay (BBVA), Stripe Mexico, STP (Sistema de Transferencias y Pagos)

**Architecture Pattern:**
```
Customer -> SPEI Transfer (from banking app) -> CEA CLABE
                                                    |
                                              Webhook/API
                                                    |
                                              Payment Engine
                                                    |
                                    Aquasis (avisarPago / cobrarReferencia)
```

#### 5.2 CoDi / DiMo (Cobro Digital / Dinero Movil)

| Attribute | Detail |
|-----------|--------|
| **Operator** | Banxico (CoDi rebranded as DiMo in 2023) |
| **Type** | QR code and NFC-based instant payments |
| **Settlement** | Real-time via SPEI infrastructure |
| **Cost** | Free for payer and merchant (government mandate) |
| **Availability** | 24/7/365 |
| **Adoption** | Low (~2-3 million registered users), but growing |
| **Integration** | Via banking partner or authorized PSP |

**Technical Integration:**
- Generate dynamic QR codes per invoice (encode: amount, reference, merchant ID)
- QR format: EMVCo standard, compatible with banking apps
- NFC: Requires native app capability (not available in PWA)
- CEA generates QR at bill issuance, embeddable in portal, WhatsApp messages, and printed bills
- Payment confirmation same as SPEI (via reference)

#### 5.3 Credit/Debit Cards

| Attribute | Detail |
|-----------|--------|
| **Card networks** | Visa, Mastercard (dominant), American Express (limited) |
| **Card penetration** | ~40 million debit cards, ~30 million credit cards in Mexico |
| **Key processors** | Conekta, OpenPay, Stripe Mexico, Mercado Pago, PayPal Mexico |
| **3D Secure** | Required by Banxico regulation for online card payments |
| **Recurring payments** | Supported via tokenization (card-on-file) |

**Recommended PSP for CEA Queretaro:**

| PSP | Strengths | Pricing (approx.) | Government Experience |
|-----|-----------|-------------------|:---------------------:|
| **Conekta** | Mexican-native, OXXO/SPEI/card, excellent API, CFDI integration | 2.9% + $2.50 MXN per card txn | Yes |
| **OpenPay (BBVA)** | Bank-grade, SPEI native, good recurring payment support | 2.9% + $2.50 MXN per card txn | Yes |
| **Stripe Mexico** | Global standard, excellent developer experience, webhook reliability | 3.6% + $3.00 MXN per card txn | Limited |
| **Mercado Pago** | Highest consumer trust, installment payments (MSI), QR integration | 3.49% + variable | Limited |

**Recommendation:** Conekta as primary PSP due to native Mexican payment method coverage, competitive pricing, and government sector experience.

#### 5.4 Convenience Store Payments (OXXO, 7-Eleven, etc.)

| Attribute | Detail |
|-----------|--------|
| **Primary network** | OXXO Pay (>20,000 locations), also 7-Eleven, Farmacias del Ahorro |
| **Target demographic** | Unbanked/underbanked population, cash-dependent users |
| **Settlement time** | 24-72 hours (not real-time) |
| **Maximum amount** | $10,000 MXN per transaction (OXXO) |
| **Integration** | Via PSP (Conekta provides OXXO Pay natively) |

**Flow:**
1. Customer requests payment reference in portal/chatbot/WhatsApp
2. System generates barcode/reference number via Conekta OXXO Pay API
3. Customer takes reference to OXXO, pays in cash
4. OXXO sends confirmation to Conekta -> webhook to CEA -> Aquasis `avisarPago`
5. Payment reflected in customer account within 24-48 hours

This is critical for CEA Queretaro as a significant portion of the population remains cash-dependent.

#### 5.5 Digital Wallets

| Wallet | Integration | Notes |
|--------|-------------|-------|
| **Mercado Pago** | Via Mercado Pago API or Conekta | Highest e-wallet adoption in Mexico |
| **PayPal Mexico** | PayPal Checkout SDK | Strong among e-commerce users |
| **Rappi Pay** | Limited API | Growing among younger demographics |
| **Apple Pay / Google Pay** | Via Stripe or Conekta tokenization | Limited but growing |

#### 5.6 Domiciliacion Bancaria (Direct Debit / Auto-Pay)

| Attribute | Detail |
|-----------|--------|
| **Type** | Recurring automatic bank debit |
| **Standard** | Banxico domiciliacion rules |
| **Integration** | Via banking partner agreement |
| **Existing API** | Aquasis `cambiarSenasCobroBancarias` (change bank details) |
| **Setup flow** | Customer provides CLABE + authorization mandate |

### Payment Integration Architecture

```
+------------------------------------------------------------------+
|                    PAYMENT GATEWAY LAYER                           |
+------------------------------------------------------------------+
|                                                                    |
|  Payment Orchestrator (Rails)                                      |
|  +--------------------------------------------------------------+  |
|  | - Unified payment creation API                                |  |
|  | - Payment method routing                                      |  |
|  | - Idempotency keys for duplicate prevention                   |  |
|  | - Retry logic with exponential backoff                        |  |
|  | - Audit trail (every payment attempt logged)                  |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  PSP Adapters                                                      |
|  +--------------------------------------------------------------+  |
|  | Conekta Adapter:                                              |  |
|  |   - Card payments (Visa/MC/Amex) with 3D Secure             |  |
|  |   - OXXO Pay (barcode generation)                            |  |
|  |   - SPEI references                                          |  |
|  |   - Recurring payments (tokenized cards)                     |  |
|  |                                                               |  |
|  | STP Adapter (optional):                                       |  |
|  |   - Direct SPEI integration                                  |  |
|  |   - CoDi/DiMo QR generation                                  |  |
|  |                                                               |  |
|  | Banking Partner Adapter:                                      |  |
|  |   - Domiciliacion bancaria management                        |  |
|  |   - Batch payment processing                                 |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  Webhook Receiver                                                  |
|  +--------------------------------------------------------------+  |
|  | - Payment confirmation processing                             |  |
|  | - Signature verification per PSP                              |  |
|  | - Aquasis notification (avisarPago / cobrarReferencia)        |  |
|  | - Customer notification trigger                               |  |
|  | - Reconciliation record creation                              |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  CFDI Integration                                                  |
|  +--------------------------------------------------------------+  |
|  | - SAT-compliant digital tax receipts                          |  |
|  | - Auto-generation on payment confirmation                     |  |
|  | - PAC (Proveedor Autorizado de Certificacion) integration     |  |
|  | - XML + PDF generation and delivery                           |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

### Reconciliation Strategy

```
Daily Reconciliation Process:
1. Pull payment records from Conekta/PSP (API + webhook data)
2. Match against Aquasis invoices via reference number
3. For matched payments: call Aquasis avisarPago
4. For unmatched: flag for manual review
5. Generate daily reconciliation report
6. Alert on discrepancies (missing webhooks, duplicate payments)
```

---

## 6. Digital Identity: INE/CURP/eSignature Integration

### Mexican Digital Identity Ecosystem

#### 6.1 INE (Instituto Nacional Electoral) Credential

| Attribute | Detail |
|-----------|--------|
| **Issuer** | Instituto Nacional Electoral |
| **Coverage** | ~93 million registered voters (practically universal adult ID) |
| **Key data** | Full name, address, birthdate, CURP, voter key, photo, OCR line |
| **Digital verification** | INE provides API for credential validation via public/private partnerships |
| **OCR capability** | Machine-readable zone (MRZ) on back of credential |
| **QR code** | Modern INE credentials include QR code with encrypted data |

**Integration Approach for CEA:**
1. **OCR Scanning**: Use OCR (Tesseract, Google Vision API, or specialized Mexican ID OCR like Mati/Metamap) to extract data from INE photos
2. **QR Code Validation**: Decode the QR code on modern INE credentials using the INE validation service
3. **INE Verification API**: Through authorized integrators (Metamap, formerly Mati; Truora; Konfio; Naat.tech) validate that the INE is genuine and active
4. **Liveness Check**: Combine with selfie-based liveness detection to prevent fraud

#### 6.2 CURP (Clave Unica de Registro de Poblacion)

| Attribute | Detail |
|-----------|--------|
| **Issuer** | RENAPO (Registro Nacional de Poblacion) |
| **Format** | 18-character alphanumeric code |
| **Coverage** | Universal for Mexican citizens and residents |
| **Verification API** | RENAPO provides CURP validation web service |
| **Integration** | CURP validation API is publicly accessible (consultas.curp.gob.mx) |

**Integration Approach:**
- Validate CURP format algorithmically (checksum validation)
- Query RENAPO web service to confirm CURP exists and retrieve registered data
- Cross-reference CURP data with Aquasis contract holder information (NIF field)
- Note: In Aquasis, the `cifNif` field already stores identification (e.g., `XAXX010101000` shown in contract responses), which can be correlated with CURP

#### 6.3 e.firma / FIEL (Firma Electronica Avanzada)

| Attribute | Detail |
|-----------|--------|
| **Issuer** | SAT (Servicio de Administracion Tributaria) |
| **Type** | PKI-based digital certificate |
| **Format** | .cer (certificate) + .key (private key) files |
| **Use cases** | Legally binding digital signatures, tax filings |
| **Penetration** | ~15-20 million active certificates (primarily businesses) |

**Assessment for CEA:** e.firma is overly complex for typical citizen interactions. Not recommended as primary authentication mechanism due to low consumer adoption. Reserve for high-value transactions (contract transfers, legal disputes).

#### 6.4 Recommended Digital Identity Flow

```
+------------------------------------------------------------------+
|              CITIZEN IDENTITY VERIFICATION FLOW                    |
+------------------------------------------------------------------+
|                                                                    |
|  Level 1: Basic Verification (Account Inquiry)                     |
|  +--------------------------------------------------------------+  |
|  | - Contract number + registered phone number                   |  |
|  | - OTP sent via SMS to registered number                       |  |
|  | - Sufficient for: balance check, consumption view, bill PDF   |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  Level 2: Enhanced Verification (Account Changes)                  |
|  +--------------------------------------------------------------+  |
|  | - Level 1 + CURP validation against RENAPO                   |  |
|  | - Cross-reference with Aquasis contract holder data           |  |
|  | - Sufficient for: email change, notification preferences,     |  |
|  |   meter reading submission, service requests                  |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  Level 3: Full Identity Verification (Contract Transactions)       |
|  +--------------------------------------------------------------+  |
|  | - Level 2 + INE photo upload with OCR extraction              |  |
|  | - INE validation via authorized verifier (Metamap/Truora)     |  |
|  | - Liveness detection (selfie matching)                        |  |
|  | - Sufficient for: contract transfer, new service request,     |  |
|  |   payment plan enrollment, legal disputes                     |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
|  Level 4: Legal Signature (Contracts & Legal Documents)            |
|  +--------------------------------------------------------------+  |
|  | - Level 3 + NOM-151 compliant digital signature               |  |
|  | - Timestamped by authorized PSC (Prestador de Servicios       |  |
|  |   de Certificacion)                                           |  |
|  | - Options: Mifiel, Weetrust, Docusign Mexico                 |  |
|  | - Sufficient for: contract signing, mandate authorization,    |  |
|  |   formal complaints                                           |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

#### NOM-151 Compliance for Digital Signatures

Mexico's NOM-151-SCFI standard governs the conservation and digitization of documents. For CEA Queretaro, any digital signature process must:
- Use a PSC (Prestador de Servicios de Certificacion) authorized by the Ministry of Economy
- Apply a timestamp via a TSA (Time Stamping Authority)
- Generate a "constancia de conservacion" (conservation certificate) for legal validity
- Store original + signed document in compliance with data retention requirements

**Recommended eSignature Provider:** Mifiel (Mexican-native, NOM-151 compliant, government-experienced, REST API)

---

## 7. Accessibility Requirements

### Mexican Legal Framework for Digital Accessibility

#### Applicable Laws and Standards

| Framework | Scope | Requirements |
|-----------|-------|-------------|
| **Ley General para la Inclusion de las Personas con Discapacidad** | National law (2011, amended) | Mandates accessibility in government services including digital |
| **Ley Federal de Telecomunicaciones y Radiodifusion (2014)** | Telecom regulation | Requires accessible ICT services |
| **NOM-034-SCT2** | Transportation accessibility standard | Indirectly informs digital standards |
| **WCAG 2.1 AA** | International standard (W3C) | De facto standard adopted by Mexican government digital services |
| **Estrategia Digital Nacional** | Government digital policy | Requires accessible digital government services |
| **CONAPRED** | Anti-discrimination body | Enforces non-discrimination in service delivery |

#### AGORA Current State

The AGORA documentation states the web chat widget is "Accessibility compliant (WCAG 2.1)" and the frontend uses Tailwind CSS with "accessibility standards (WCAG 2.1 AA)." However, this likely refers to the agent-facing interface, not a citizen-facing self-service portal.

#### WCAG 2.1 AA Compliance Checklist for CEA Portal

| Principle | Requirement | Implementation Notes |
|-----------|-------------|---------------------|
| **Perceivable** | Text alternatives for all non-text content | Alt text for consumption charts, meaningful chart descriptions |
| **Perceivable** | Captions/alternatives for multimedia | Video tutorials need Spanish captions |
| **Perceivable** | Content adaptable to different presentations | Responsive design, support for screen readers |
| **Perceivable** | Sufficient color contrast (4.5:1 for text, 3:1 for large text) | Audit all UI components against WCAG contrast ratios |
| **Operable** | All functionality accessible via keyboard | Tab navigation, focus indicators, skip links |
| **Operable** | Sufficient time for users to read/interact | No auto-timeout without warning, extendable sessions |
| **Operable** | No content that causes seizures (no flashing) | Avoid auto-playing animations |
| **Operable** | Clear navigation, findability | Breadcrumbs, consistent navigation, search |
| **Understandable** | Readable text content | Plain Spanish (avoid technical jargon), reading level appropriate |
| **Understandable** | Predictable web page behavior | Consistent UI patterns, no unexpected context changes |
| **Understandable** | Input assistance (error prevention/correction) | Clear form validation, error messages in context |
| **Robust** | Compatible with assistive technologies | Semantic HTML, ARIA attributes, screen reader testing |

#### Mexico-Specific Accessibility Considerations

1. **Language clarity**: Use plain Spanish (lenguaje ciudadano) per Secretaria de la Funcion Publica guidelines. Avoid bureaucratic terminology.
2. **Indigenous language support**: Queretaro has Otomi-speaking populations. Consider future internationalization support.
3. **Low literacy support**: Use visual indicators (icons, color coding) alongside text for key information like balance and due dates.
4. **Feature phone fallback**: Ensure critical flows (payment, outage reporting) work via SMS/USSD for non-smartphone users.
5. **Senior citizen considerations**: Large tap targets (minimum 44x44px), high contrast mode, simplified navigation option.

#### Testing Strategy

| Method | Tool/Approach | Frequency |
|--------|--------------|:---------:|
| Automated scanning | axe-core, Lighthouse, Pa11y | Every build (CI/CD) |
| Screen reader testing | NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android) | Monthly |
| Keyboard navigation audit | Manual testing | Per release |
| Color contrast audit | Colour Contrast Analyser | Per design change |
| User testing with disabled persons | Partner with Mexican disability organizations | Quarterly |
| Plain language review | Readability analysis tools + CONAPRED guidelines | Per content change |

---

## 8. Multi-Channel Architecture: Unified Engagement Platform

### Current AGORA Multi-Channel Capabilities

AGORA already provides an excellent foundation for multi-channel engagement:

| Channel | Status | Capability Level |
|---------|:------:|:----------------:|
| Web Chat Widget | Active | Full |
| Email | Active | Full |
| WhatsApp Business API | Active | Full |
| SMS | Active | Full |
| Telegram | Active | Full |
| Facebook Messenger | Active | Full |
| Instagram DM | Active | Full |
| Twitter/X DM | Active | Full |
| Voice (VoIP) | Active | Full |
| API Channel | Active | Full |
| Customer Self-Service Portal | Missing | None |
| Mobile App (PWA/Native) | Missing | None |
| IVR (Interactive Voice Response) | Partial | Basic |
| USSD (Feature phones) | Missing | None |
| In-Person (Kiosk) | Missing | None |

### Unified Experience Architecture

```
+------------------------------------------------------------------+
|            UNIFIED CITIZEN ENGAGEMENT PLATFORM                     |
+------------------------------------------------------------------+
|                                                                    |
|  Citizen-Facing Channels                                           |
|  +------+  +-------+  +-----+  +-------+  +-----+  +---------+   |
|  | Web  |  |WhatsApp|  | SMS |  | Email |  |Voice|  |  Mobile |   |
|  |Portal|  |  Bot   |  | Bot |  | Auto  |  | IVR |  |  PWA   |   |
|  +--+---+  +---+---+   +-+---+  +---+---+  +--+--+  +---+---+   |
|     |          |          |          |         |          |        |
|  +--v----------v----------v----------v---------v----------v---+   |
|  |                                                             |   |
|  |              AGORA UNIFIED INBOX / ROUTING                  |   |
|  |                                                             |   |
|  |  +------------------+  +-------------------+                |   |
|  |  | Maria AI Engine  |  | Routing Engine    |                |   |
|  |  | - Auto-resolve   |  | - Skills-based    |                |   |
|  |  | - Classify       |  | - Load balance    |                |   |
|  |  | - Escalate       |  | - Priority queue  |                |   |
|  |  +------------------+  +-------------------+                |   |
|  |                                                             |   |
|  +-----+-----------------------------------------------+------+   |
|        |                                               |           |
|  +-----v-----------+                          +--------v-------+   |
|  | Aquasis Backend  |                          | Notification   |   |
|  | (126 SOAP/REST   |                          | Engine         |   |
|  |  operations)     |                          | (Proactive     |   |
|  |                  |                          |  outreach)     |   |
|  +------------------+                          +----------------+   |
|                                                                    |
+------------------------------------------------------------------+
```

### Channel-Specific Design Principles

#### Web Portal
- Full self-service capabilities (all Tier 1 + Tier 2 features)
- Dashboard-centric UX with consumption visualization
- Responsive design (mobile-first)
- Spanish language primary, accessible design

#### WhatsApp (Primary Mobile Channel)
- Conversational interface via Maria AI
- Quick actions: check balance, pay bill, report issue
- Rich messages: bill PDFs, consumption charts, QR payment codes
- Template-based proactive notifications
- WhatsApp Flows for structured data entry

#### SMS (Fallback / Universal)
- Short-code based interaction (keyword commands)
- Bill inquiry: "SALDO [CONTRACT_NUMBER]"
- Payment confirmation broadcasts
- Emergency outage alerts
- USSD gateway for feature phone users

#### Voice / IVR
- Automated voice menu for common inquiries
- Integration with Maria AI for natural language IVR
- Agent transfer with full context from AI interaction
- ElevenLabs voice integration (as indicated by existing `ELEVENLABS_VOICE_SETUP.md` in docs)

#### In-Person (Future)
- Self-service kiosks at CEA offices and partner locations
- QR code scanning for bill payment
- INE scanning for identity verification
- Receipt printing

### Cross-Channel Context Preservation

A critical requirement is maintaining citizen context across channels. If a citizen starts an inquiry on WhatsApp and later calls or visits the portal, the agent (human or AI) must have full interaction history.

AGORA's unified inbox already provides this for agent-assisted interactions. The extension needed is:
1. **Citizen profile unification**: Link all channel identities (phone number, email, contract number) to a single citizen record
2. **Self-service session persistence**: Portal and PWA sessions linked to the same citizen profile
3. **Cross-channel handoff**: "Continue on WhatsApp" button in portal, "View in portal" links in WhatsApp messages
4. **Interaction timeline**: Complete chronological view of all touchpoints across all channels

---

## 9. AGORA Gap Analysis

### Current Capabilities Assessment

| Capability Area | Current State | Gap Severity |
|----------------|---------------|:------------:|
| **Omnichannel Communication** | Excellent - 10+ channels supported with unified inbox | LOW |
| **AI/Chatbot (Maria)** | Strong architecture, needs water-utility-specific training | MEDIUM |
| **Agent Workspace** | Comprehensive - routing, collaboration, SLA tracking | LOW |
| **Knowledge Base** | Available but needs CEA-specific content | MEDIUM |
| **Analytics/Reporting** | Strong - dashboards, CSAT, custom reports | LOW |
| **Aquasis Integration** | Partial - 17 of 126 operations integrated | HIGH |
| **Customer Self-Service Portal** | Not available | CRITICAL |
| **Mobile App (PWA/Native)** | Not available | HIGH |
| **Payment Integration** | Not available (only Stripe for basic payments) | CRITICAL |
| **Proactive Notifications** | Basic capability, no structured notification engine | HIGH |
| **Digital Identity (INE/CURP)** | Not available | HIGH |
| **eSignature (NOM-151)** | Not available | MEDIUM |
| **Consumption Analytics** | APIs available but no citizen-facing dashboard | HIGH |
| **Outage Management** | Not available | HIGH |
| **Accessibility (WCAG)** | Claimed for agent UI, unverified for citizen-facing | MEDIUM |
| **CFDI/Tax Receipt Integration** | Not available | MEDIUM |
| **IVR Enhancement** | Basic VoIP, no AI-powered IVR | MEDIUM |
| **Kiosk/In-Person Digital** | Not available | LOW |

### Aquasis API Integration Gap Detail

Of 126 available Aquasis operations, only 17 are currently integrated. The following unintegrated operations are critical for a customer self-service portal:

| Priority | Operation | Service | Use Case |
|:--------:|-----------|---------|----------|
| CRITICAL | `getDeudaContrato` | Debt | Detailed debt breakdown per contract |
| CRITICAL | `getDeudaTotalConFacturas` | Debt | Total debt with invoice details |
| CRITICAL | `avisarPago` | Debt | Payment notification to Aquasis |
| CRITICAL | `cobrarReferencia` | Debt | Process payment by reference |
| HIGH | `getFacturasContrato` | Contracts | Invoice history for customers |
| HIGH | `getFacturaE` | Contracts | Electronic invoice (CFDI) |
| HIGH | `solicitudIntroduccionLectura` | Readings | Customer meter reading submission |
| HIGH | `getImpagadosContrato` | Debt | Unpaid invoices list |
| HIGH | `getDocumentoPago` | Debt | Payment document/slip generation |
| HIGH | `solicitudActivacionFacturaOnline` | Contracts | Paperless billing enrollment |
| MEDIUM | `cambiarSenasCobroBancarias` | Contracts | Auto-pay setup |
| MEDIUM | `solicitudCambioDomicilioNotificaciones` | Contracts | Address change |
| MEDIUM | `solicitudAltaServiAlerta` | Contracts | Alert service enrollment |
| MEDIUM | `esTitular` | Contracts | Identity verification support |
| MEDIUM | `getIDPersonaContrato` | Contracts | Customer ID retrieval |
| LOW | `solicitudAltaSuministro` | Contracts | New service request (schema only) |
| LOW | `solicitudBajaSuministro` | Contracts | Service termination (schema only) |
| LOW | `solicitudCambioTitularContrato` | Contracts | Contract transfer (schema only) |

---

## 10. Recommendations

### Priority Tier: CRITICAL

| # | Recommendation | Priority | Effort | Impact | Timeline |
|---|---------------|:--------:|:------:|:------:|:--------:|
| 1 | **Build Customer Self-Service Portal (Vue.js 3 PWA)** | CRITICAL | HIGH | HIGH | Months 1-4 |
|   | Develop a citizen-facing portal as a PWA using the existing Vue.js 3 stack. Include account dashboard, bill view/download, consumption history with charts, and service request submission. Integrate with Aquasis APIs for contract detail, debt, consumption, and invoices. | | | | |
| 2 | **Integrate Mexican Payment Gateway (Conekta)** | CRITICAL | HIGH | HIGH | Months 2-5 |
|   | Implement Conekta as the primary PSP to support card payments (Visa/MC with 3D Secure), OXXO Pay (cash), and SPEI transfers. Build payment orchestration layer in Rails with webhook processing, reconciliation, and Aquasis `avisarPago`/`cobrarReferencia` integration. | | | | |

### Priority Tier: HIGH

| # | Recommendation | Priority | Effort | Impact | Timeline |
|---|---------------|:--------:|:------:|:------:|:--------:|
| 3 | **Expand Aquasis API Integration** (from 17 to 40+ operations) | HIGH | MEDIUM | HIGH | Months 1-6 |
|   | Prioritize: `getDeudaContrato`, `getDeudaTotalConFacturas`, `avisarPago`, `cobrarReferencia`, `getFacturasContrato`, `getFacturaE`, `solicitudIntroduccionLectura`, `getImpagadosContrato`, `getDocumentoPago`. Create Rails service objects for each. | | | | |
| 4 | **Build Proactive Notification Engine** | HIGH | MEDIUM | HIGH | Months 3-5 |
|   | Implement event-driven notification system using Sidekiq + Redis. Support bill ready, payment reminders, overdue alerts, consumption anomalies, outage notifications. Route through WhatsApp (primary), SMS, email, push. Include customer preference management. | | | | |
| 5 | **Train Maria AI for Water Utility Intents** | HIGH | MEDIUM | HIGH | Months 2-4 |
|   | Develop water-utility-specific intent library for Maria AI agent. Map intents to Aquasis API functions. Implement identity verification levels. Prioritize: balance inquiry, bill explanation, payment processing, service request creation, consumption queries. | | | | |
| 6 | **Implement Digital Identity Verification (INE/CURP)** | HIGH | MEDIUM | MEDIUM | Months 4-6 |
|   | Integrate CURP validation via RENAPO API. Implement INE OCR + validation via Metamap or Truora. Build 3-level identity verification flow. Required for self-service contract changes and payment setup. | | | | |

### Priority Tier: MEDIUM

| # | Recommendation | Priority | Effort | Impact | Timeline |
|---|---------------|:--------:|:------:|:------:|:--------:|
| 7 | **Implement NOM-151 Compliant eSignature** | MEDIUM | LOW | MEDIUM | Months 5-7 |
|   | Integrate Mifiel for digital signature on contracts, mandates, and formal documents. Required for contract transfers, auto-pay mandates, and legal dispute processes. | | | | |
| 8 | **WCAG 2.1 AA Accessibility Audit & Remediation** | MEDIUM | MEDIUM | MEDIUM | Months 3-5 |
|   | Conduct comprehensive accessibility audit of citizen-facing interfaces. Implement axe-core in CI/CD pipeline. Fix identified issues. Conduct user testing with disabled persons. Implement plain Spanish language guidelines. | | | | |
| 9 | **CFDI Integration for Payment Receipts** | MEDIUM | LOW | MEDIUM | Months 5-6 |
|   | Integrate with PAC (Proveedor Autorizado de Certificacion) for SAT-compliant digital tax receipts. Auto-generate CFDI on payment confirmation. Deliver via portal and WhatsApp. | | | | |
| 10 | **WhatsApp Flows for Structured Interactions** | MEDIUM | LOW | HIGH | Months 3-4 |
|   | Implement WhatsApp Flows (Meta's form-based interaction feature) for service requests, meter reading submission, payment initiation, and contract information updates. Reduces friction compared to free-text chatbot interaction. | | | | |
| 11 | **Consumption Analytics Dashboard** | MEDIUM | MEDIUM | MEDIUM | Months 4-6 |
|   | Build citizen-facing consumption analytics with historical charts, peer comparison, trend analysis, and conservation recommendations. Use `getConsumosParaGraficas` API data. Implement anomaly detection for leak alerts. | | | | |

### Priority Tier: LOW

| # | Recommendation | Priority | Effort | Impact | Timeline |
|---|---------------|:--------:|:------:|:------:|:--------:|
| 12 | **AI-Powered IVR with ElevenLabs** | LOW | MEDIUM | LOW | Months 6-8 |
|   | Enhance voice channel with natural language IVR powered by Maria AI + ElevenLabs voice synthesis. Allow phone-based account inquiry, payment, and service requests. | | | | |
| 13 | **CoDi/DiMo QR Payment Integration** | LOW | LOW | LOW | Months 7-9 |
|   | Generate dynamic QR codes per invoice for CoDi/DiMo payment scanning. Low priority due to limited adoption, but minimal implementation effort. | | | | |
| 14 | **Self-Service Kiosk Application** | LOW | HIGH | LOW | Months 9-12 |
|   | Develop kiosk mode for CEA offices with INE scanning, bill payment, and receipt printing. Repurpose PWA portal with kiosk-specific UX. | | | | |
| 15 | **Native Mobile App (Capacitor wrapper)** | LOW | MEDIUM | MEDIUM | Months 8-12 |
|   | Wrap PWA in Capacitor native shell for app store presence. Add NFC for CoDi, biometric auth, and enhanced push notifications. Only pursue if PWA adoption metrics justify. | | | | |

---

## 11. Customer Engagement Maturity Score

### Scoring Framework (1-10 Scale)

| Dimension | Weight | Current Score | Target Score (12 months) | Notes |
|-----------|:------:|:-------------:|:------------------------:|-------|
| Multi-Channel Presence | 15% | 8/10 | 9/10 | Excellent channel coverage; missing self-service portal and PWA |
| Self-Service Capability | 20% | 2/10 | 7/10 | Critical gap - no customer portal |
| AI/Automation | 15% | 6/10 | 8/10 | Maria framework strong, needs utility-specific training |
| Payment Integration | 15% | 1/10 | 7/10 | Critical gap - no Mexican payment ecosystem |
| Proactive Engagement | 10% | 3/10 | 7/10 | Basic capability exists, no structured notification engine |
| Digital Identity & Security | 10% | 3/10 | 7/10 | No INE/CURP, no eSignature |
| Accessibility & Inclusion | 10% | 4/10 | 7/10 | WCAG claimed but unverified for citizen-facing |
| Data & Analytics (Citizen) | 5% | 2/10 | 6/10 | APIs available, no citizen-facing analytics |

### Composite Score

**Current: 5.0 / 10** (Weighted average)

Breakdown:
- (0.15 x 8) + (0.20 x 2) + (0.15 x 6) + (0.15 x 1) + (0.10 x 3) + (0.10 x 3) + (0.10 x 4) + (0.05 x 2)
- = 1.20 + 0.40 + 0.90 + 0.15 + 0.30 + 0.30 + 0.40 + 0.10
- = **3.75 / 10** (precise weighted score)

**Revised Assessment: 3.75/10 (rounded to 4/10)**

The initial estimate of 5/10 was generous. The weighted analysis reveals that while AGORA's communication infrastructure is strong (8/10), the critical citizen-facing capabilities (self-service, payments, proactive engagement) are severely underdeveloped, pulling the composite score to approximately 4/10.

**12-Month Target: 7.2 / 10** (achievable with execution of CRITICAL and HIGH recommendations)

### Maturity Level Classification

| Level | Score | Description | CEA Status |
|-------|:-----:|-------------|:----------:|
| Level 1: Reactive | 1-2 | Phone/in-person only, no digital | Past |
| Level 2: Basic Digital | 3-4 | Website + some digital channels, no self-service | **CURRENT** |
| Level 3: Multi-Channel | 5-6 | Multiple channels with basic self-service | Target Q3 2026 |
| Level 4: Omnichannel | 7-8 | Unified experience with proactive engagement | Target Q1 2027 |
| Level 5: Predictive | 9-10 | AI-driven, predictive, personalized engagement | Long-term vision |

---

## Appendix A: Technology Stack Alignment

All recommended technologies align with AGORA's existing stack:

| Component | Existing Stack | Recommended Addition | Compatibility |
|-----------|---------------|---------------------|:-------------:|
| Frontend | Vue.js 3 + Tailwind + Vite | PWA (Service Worker, IndexedDB) | Native |
| Backend | Ruby on Rails 7 | Payment service objects, notification engine | Native |
| Database | PostgreSQL 15+ | Payment/notification tables | Native |
| Cache/Queue | Redis 7+ + Sidekiq | Notification job processing | Native |
| AI | LLM Integration Layer (OpenAI/Anthropic) | Water utility intent training | Native |
| Search | OpenSearch + pgvector | Knowledge base expansion | Native |
| Infra | Docker + Kubernetes | No changes needed | Native |
| New: PSP | Stripe (basic) | Conekta (Mexican payments) | API integration |
| New: Identity | None | Metamap/Truora + RENAPO | API integration |
| New: eSignature | None | Mifiel | API integration |
| New: CFDI | None | PAC integration (Facturapi/Finkok) | API integration |

## Appendix B: Estimated Implementation Budget

| Phase | Duration | Team Size | Key Deliverables |
|-------|:--------:|:---------:|------------------|
| Phase 1: Foundation | Months 1-3 | 4-5 devs | Customer portal PWA (MVP), expanded Aquasis integration (15+ new operations), Conekta payment integration |
| Phase 2: Intelligence | Months 3-6 | 3-4 devs | Maria water utility training, notification engine, INE/CURP verification, WCAG audit |
| Phase 3: Enhancement | Months 6-9 | 2-3 devs | eSignature, CFDI, WhatsApp Flows, consumption analytics, IVR enhancement |
| Phase 4: Optimization | Months 9-12 | 2 devs | Native app wrapper (optional), CoDi, kiosk mode, peer comparison features |

---

*Report prepared by Agent C6 (research-customer-portal)*
*Division C - Customer Experience & Digital Engagement*
*Date: 2026-02-16*
