# ACTION PLAN: UX/UI Design -- SUPRA Water 2026

> **Role:** UX/UI Designer
> **Date:** 2026-02-16
> **Scope:** All user-facing interfaces across citizen, operator, and technician touchpoints
> **System:** SUPRA Water 2026 -- AI-first CIS for CEA Queretaro (~400K accounts)
> **Language:** Spanish (MX) only -- all UI, copy, labels, error messages, and AI responses in Mexican Spanish

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Citizen Touchpoints](#2-citizen-touchpoints)
3. [Operator Dashboard (Admin UI)](#3-operator-dashboard-admin-ui)
4. [Technician Mobile App](#4-technician-mobile-app)
5. [Design System](#5-design-system)
6. [Screen Inventory](#6-screen-inventory)
7. [Sprint-by-Sprint Design Delivery](#7-sprint-by-sprint-design-delivery)

---

## 1. Design Philosophy

### 1.1 Agent-First Interaction Model

SUPRA Water 2026 is built on the principle: **"Agent-first, not menu-driven."** This fundamentally changes the UX approach:

- **Citizens** interact primarily through **AI agents** (WhatsApp, Voice AI, web chat). There is no traditional menu-driven citizen portal; the portal is a read-only dashboard for account visibility, while transactions flow through conversational AI.
- **Operators** use a **supervisory dashboard** -- they monitor, configure, and override. The AI acts; the human supervises. The dashboard is designed for oversight, not data entry.
- **Technicians** use a **task-driven mobile app** -- the Field Workforce agent assigns, routes, and tracks. The technician executes, captures, and confirms.

```
TRADITIONAL CIS:                    SUPRA WATER 2026:

  Citizen --> Menu --> Form          Citizen --> AI Agent --> Resolution
  Citizen --> Counter --> Clerk      Citizen --> WhatsApp --> AI --> Resolution
  Citizen --> Phone --> IVR          Citizen --> Phone --> Voice AI --> Resolution

  Operator --> Module --> CRUD       Operator --> Dashboard --> Supervise AI
  Technician --> Paper --> Office    Technician --> Mobile App --> Field Data
```

### 1.2 Three User Types

| User Type | Count | Primary Channel | Digital Literacy | Key Need |
|-----------|-------|----------------|-----------------|----------|
| **Ciudadanos** (Citizens) | ~400,000 accounts | WhatsApp (70%), Phone (20%), Portal (10%) | Low to medium. Many elderly users. WhatsApp-dominant. | Pay bills, check balance, report issues -- fast and simple |
| **Operadores** (Operators) | 200+ staff | Desktop browser (React/Next.js) | Medium to high. Office workers. | Manage contracts, billing, payments, complaints, reports |
| **Tecnicos** (Technicians) | 50+ field crew | Android mobile app | Low to medium. Outdoor use. Gloves, sun, rain. | Complete work orders, capture photos, navigate routes |

### 1.3 Mexican Cultural Considerations

These design decisions are not "nice to have" -- they are critical for adoption in the Queretaro context:

| Factor | Design Implication |
|--------|-------------------|
| **WhatsApp dominance** | WhatsApp is the primary communication channel in Mexico. 93% of smartphone users have it. Design WhatsApp flows as the primary citizen UI, not an afterthought. |
| **Elderly users (adultos mayores)** | Large text options. High contrast mode. Voice AI as primary channel (they can call and speak naturally). Vulnerability flags protect them from automated disconnection. |
| **Low digital literacy** | Numbered option lists in WhatsApp (not free-text menus). Simple language. Confirmation at every step. No jargon -- "Su recibo" not "Su factura CFDI." |
| **Cash-dominant economy** | OXXO payment references with barcodes. Cash payment at kiosks. SPEI references for bank transfers. Do not assume card-on-file. |
| **Trust in government** | CEA branding on every touchpoint. Official tone. No "cute" chatbot personality -- professional and trustworthy. |
| **"Tramite" culture** | Citizens expect a folio number for every request. Always confirm with a tracking number. Always allow status check by folio. |
| **Working hours** | AI agents available 24/7. This is a major value proposition -- no more office-hours-only service. |

### 1.4 Accessibility Requirements

| Requirement | Standard | Implementation |
|-------------|----------|----------------|
| WCAG 2.1 AA compliance | All web interfaces | Tested with axe-core and manual keyboard/screen reader testing |
| Large text mode | Font scaling up to 200% | rem-based typography, no fixed pixel sizes |
| High contrast mode | 4.5:1 minimum contrast ratio (AA) | Alternate CSS theme with increased contrast |
| Keyboard navigation | Full keyboard operability | Focus indicators, skip links, ARIA landmarks |
| Screen reader support | Semantic HTML + ARIA | All interactive elements labeled; live regions for dynamic content |
| Color-blind safe | No information conveyed by color alone | Icons + text labels alongside color indicators |
| Voice AI | Natural language input | Primary channel for low-literacy and visually impaired users |
| Touch targets | Minimum 44x44px | All tappable elements sized for large fingers, especially kiosk and mobile |

### 1.5 Design Principles Summary

```
P1: CONVERSATIONAL OVER NAVIGATIONAL
    Citizens talk to AI, they do not navigate menus.
    Every citizen flow should be completable in WhatsApp.

P2: PROGRESSIVE DISCLOSURE
    Show only what is needed at each step.
    Operator dashboard loads summary first, details on demand.

P3: FORGIVE MISTAKES
    Confirmation dialogs for destructive actions.
    AI re-asks when input is ambiguous.
    "Undo" or "Corregir" always available.

P4: ONE LANGUAGE, ONE LOCALE
    Everything in Spanish (MX). No language switcher.
    Date format: dd/MM/yyyy. Currency: $1,234.56 MXN.
    Decimal separator: punto. Thousands separator: coma.

P5: OFFLINE-CAPABLE
    Technician app works without signal.
    Kiosk survives network interruptions.
    Sync when connectivity returns.

P6: TRUST THROUGH TRANSPARENCY
    Show folio numbers for every request.
    Show processing status at every step.
    Show who (or what agent) handled an interaction.
```

---

## 2. Citizen Touchpoints

### 2.1 WhatsApp Conversations (Primary Channel)

WhatsApp is the primary citizen interaction channel. ~70% of citizen contacts will come through WhatsApp, handled by the WhatsApp CX AI agent integrated with AGORA (Chatwoot).

#### 2.1.1 Message Templates (Pre-Approved by Meta)

These templates must be submitted to Meta for approval 4-6 weeks before go-live. All in `es_MX`.

**Template 1: `recibo_listo` (Invoice Ready)**
```
Hola {{customer_name}},

Su recibo de agua esta listo.

Periodo: {{period}}
Consumo: {{consumption}} m3
Total a pagar: ${{total}} MXN
Fecha limite: {{due_date}}

Pague ahora:
[Pagar recibo]  <-- URL button to payment page

Responda a este mensaje si tiene dudas.

CEA Queretaro
```

**Template 2: `recordatorio_pago` (Payment Reminder)**
```
Hola {{customer_name}},

Le recordamos que tiene un adeudo pendiente.

Monto: ${{debt_amount}} MXN
Dias de atraso: {{days_past_due}}

Evite el corte de servicio pagando hoy:
[Pagar ahora]  <-- URL button

Si ya realizo su pago, ignore este mensaje.

CEA Queretaro
```

**Template 3: `pago_confirmado` (Payment Confirmation)**
```
Hola {{customer_name}},

Hemos recibido su pago.

Monto: ${{amount}} MXN
Folio: {{receipt_number}}
Metodo: {{payment_method}}

Gracias por su pago puntual.

CEA Queretaro
```

**Template 4: `reporte_fuga_recibido` (Leak Report Received)**
```
Hola {{customer_name}},

Hemos registrado su reporte de fuga.

Folio: {{folio}}
Ubicacion: {{location}}
Tiempo estimado de atencion: {{estimated_response}}

Le notificaremos cuando la cuadrilla este en camino.

CEA Queretaro
```

**Template 5: `aviso_corte` (Service Cut Warning)**
```
AVISO IMPORTANTE

Hola {{customer_name}},

Su servicio de agua sera suspendido el {{cut_date}} por adeudo.

Monto adeudado: ${{debt_amount}} MXN

Pague ahora para evitar la suspension:
[Pagar ahora]  <-- URL button

Si necesita un convenio de pago, responda "CONVENIO".

CEA Queretaro
```

**Template 6: `convenio_aprobado` (Payment Plan Approved)**
```
Hola {{customer_name}},

Su convenio de pago ha sido aprobado.

Deuda total: ${{total_debt}} MXN
Parcialidades: {{installments}} pagos de ${{installment_amount}} MXN
Primer pago: {{first_due_date}}

Para ver el detalle de su convenio:
[Ver convenio]  <-- URL button

CEA Queretaro
```

#### 2.1.2 WhatsApp Conversation Flows

**Flow A: Account Lookup + Balance Inquiry**

```
CITIZEN: Hola
AI: Hola, bienvenido a CEA Queretaro. Soy su asistente virtual.

    En que puedo ayudarle?

    1. Consultar saldo
    2. Pagar recibo
    3. Reportar fuga
    4. Estado de tramite
    5. Otro tema

CITIZEN: 1

AI: Para consultar su saldo necesito su numero de cuenta.
    Lo encuentra en la esquina superior derecha de su recibo.

    Cual es su numero de cuenta?

CITIZEN: 12345

AI: Encontre su cuenta:

    Titular: Juan Perez Lopez
    Direccion: Av. Zaragoza 123, Col. Centro

    Es correcta esta cuenta? (Si / No)

CITIZEN: Si

AI: Aqui esta el resumen de su cuenta:

    Estado: Al corriente
    Ultimo recibo: $485.00 MXN (Enero 2026)
    Fecha limite de pago: 28/Feb/2026
    Consumo ultimo periodo: 18 m3

    Que desea hacer?
    1. Pagar ahora
    2. Ver recibo en PDF
    3. Historial de consumo
    4. Regresar al menu

CITIZEN: 2

AI: [Sends invoice PDF as document attachment]

    Aqui tiene su recibo.
    Necesita algo mas?
```

**Flow B: Leak/Issue Reporting**

```
CITIZEN: Quiero reportar una fuga

AI: Vamos a registrar su reporte de fuga.

    Donde se encuentra la fuga?
    1. En la calle (via publica)
    2. En la banqueta
    3. Dentro de mi propiedad
    4. No estoy seguro

CITIZEN: 1

AI: Por favor, compartame la ubicacion:

    Opcion 1: Envie su ubicacion con el clip de WhatsApp (📎 > Ubicacion)
    Opcion 2: Escriba la direccion completa (calle, numero, colonia)

CITIZEN: Calle Madero esquina con Allende, Col. Centro

AI: Direccion registrada: Calle Madero esq. Allende, Col. Centro, Queretaro.

    Puede describir la fuga?
    - Es un chorro grande o goteo?
    - Desde cuando la observo?

    Si tiene foto, por favor enviela.

CITIZEN: Es un chorro que sale de la banqueta, desde ayer
         [Sends photo]

AI: Gracias por su reporte y la foto.

    Su reporte ha sido registrado:

    Folio: REP-2026-04521
    Tipo: Fuga en via publica
    Ubicacion: Calle Madero esq. Allende, Col. Centro
    Prioridad: Alta (chorro activo)
    Tiempo estimado: 4-8 horas

    Le notificaremos cuando la cuadrilla este en camino.

    Necesita algo mas?
```

**Flow C: Payment Plan Request**

```
CITIZEN: CONVENIO

AI: Entiendo que le interesa un convenio de pago.

    Para continuar, necesito su numero de cuenta.
    Cual es su numero de cuenta?

CITIZEN: 67890

AI: Cuenta verificada:
    Titular: Maria Garcia Hernandez

    Su adeudo actual:
    - 3 recibos pendientes
    - Total: $2,450.00 MXN
    - Recibo mas antiguo: Oct 2025

    Opciones de convenio disponibles:

    1. 3 pagos de $816.67 (sin recargos)
    2. 6 pagos de $425.00 (con 2% mensual)
    3. 12 pagos de $220.42 (con 2% mensual)

    Enganche requerido: $245.00 (10%)

    Cual opcion le interesa?

CITIZEN: 1

AI: Convenio seleccionado:
    - Enganche: $245.00 (pagadero hoy)
    - 3 parcialidades de $735.00
    - Sin recargos adicionales
    - Primer pago: 15/Mar/2026

    Para formalizar el convenio necesita:
    - Identificacion oficial (INE/IFE)
    - Comprobante de domicilio

    Desea:
    1. Agendar cita en oficina para formalizar
    2. Iniciar el proceso digital (enviar documentos aqui)
    3. Necesito hablar con un agente

CITIZEN: 2

AI: Para iniciar el proceso digital, por favor envie foto de:

    1. Frente de su INE/IFE
    2. Reverso de su INE/IFE
    3. Comprobante de domicilio reciente (max 3 meses)

    Envie las 3 fotos una por una.
```

**Flow D: Escalation to Human Agent**

```
AI: Entiendo su situacion. Este caso requiere atencion personalizada.

    Lo voy a transferir con un agente de CEA Queretaro.

    Tiempo estimado de espera: 3 minutos

    Mientras espera, le comparto un resumen de su caso
    para que el agente pueda atenderle mas rapido.

    [Agent receives Chatwoot/AGORA handoff with full context:
     - Account number, name, address
     - Conversation history
     - AI classification: "Disputa de facturacion - consumo excesivo"
     - Suggested resolution]

HUMAN AGENT: Hola Maria, soy Carlos de CEA Queretaro.
             Ya tengo el contexto de su consulta sobre
             el consumo excesivo en su recibo de enero.
             Voy a revisar su historial...
```

#### 2.1.3 WhatsApp Edge Cases

| Edge Case | Handling |
|-----------|----------|
| Invalid account number | Re-ask up to 3 times. Offer address-based lookup. Offer to connect with human. |
| Account not found | "No encontramos esa cuenta. Verifique el numero en su recibo. Si no tiene recibo, escriba su direccion completa." |
| Multiple accounts at same address | Show list and ask citizen to select: "Encontramos 2 cuentas en esa direccion: 1) Cuenta 12345 - Juan Perez 2) Cuenta 12346 - Maria Perez. Cual?" |
| Unregistered phone number | First interaction: ask for account number and offer to link phone for future auto-identification. |
| Offensive language | "Entendemos su frustracion. Para poder ayudarle mejor, le pido que mantengamos un tono respetuoso. Como puedo ayudarle?" |
| Off-topic questions | "Soy el asistente de CEA Queretaro y solo puedo ayudarle con temas de agua y saneamiento. Para otros servicios puede comunicarse a 442-XXX-XXXX." |
| 24-hour message window | Use approved templates to re-engage after 24h window closes. Sessions that go inactive get a closing message: "Si necesita mas ayuda, escribanos de nuevo." |
| Message rate limits | Queue outbound messages; do not exceed WhatsApp API rate limits (80 msg/sec). |

### 2.2 Voice AI Conversations (Phone Channel)

For citizens who prefer calling. Primary audience: elderly users, low digital literacy, urgent reports.

#### 2.2.1 Call Flow Diagram

```
                        INCOMING CALL
                             |
                    [Greeting - 3 sec]
         "Bienvenido a CEA Queretaro, Comision Estatal de Aguas."
                             |
                    [AI Agent Activates]
         "Soy su asistente virtual. En que puedo ayudarle?"
                             |
              [Natural language understanding]
                             |
            +--------+------+-------+--------+
            |        |      |       |        |
         Balance   Payment  Leak   Complaint  Other
         inquiry   status   report            |
            |        |      |       |     [Escalate to
            |        |      |       |      human agent]
            |        |      |       |
     [Identification]  [Identification]
     "Me puede dar su numero    |
      de cuenta o direccion?"   |
            |                   |
     [Account lookup]     [Location capture]
            |                   |
     [Provide information] [Create work order]
            |                   |
     [Resolution]          [Confirm folio]
            |                   |
     "Necesita algo mas?"  "Necesita algo mas?"
            |                   |
     +------+------+     +-----+-----+
     |             |     |           |
    Yes           No    Yes         No
     |             |     |           |
  [Restart]   [Farewell] [Restart] [Farewell]
              "Gracias           "Gracias por
               por llamar        reportar.
               a CEA             Estaremos en
               Queretaro.        contacto.
               Buen dia."        Buen dia."
```

#### 2.2.2 Voice AI Design Decisions

| Decision | Rationale |
|----------|-----------|
| **No IVR menu first** | The AI greets directly and listens. No "Presione 1 para..." -- this is what makes it agent-first. |
| **Mexican Spanish TTS** | Use Twilio-supported Mexican Spanish voice. Natural intonation, not robotic. |
| **3-second silence tolerance** | Wait 3 seconds for the caller to speak before prompting again. Elderly callers need time. |
| **Repeat on request** | "Le repito" triggers repetition of the last AI response. |
| **Spell-out for account numbers** | AI reads account numbers digit by digit: "uno-dos-tres-cuatro-cinco." |
| **Escalation triggers** | Transfer to human after: 3 failed identification attempts, explicit request ("quiero hablar con alguien"), detected frustration (raised voice, "no me entiende"), complex dispute. |
| **IVR fallback** | If Claude API is down or latency > 5 seconds, fall back to basic IVR: "1 para consulta de saldo, 2 para reportar fuga, 0 para hablar con un agente." |
| **Call recording** | All calls recorded with upfront notice: "Esta llamada puede ser grabada para mejorar nuestro servicio." Required for quality and legal. |
| **Maximum call duration** | 15 minutes. After 12 min: "Estamos llegando al limite de tiempo. Le puedo ayudar con algo mas antes de terminar?" |

#### 2.2.3 Voice AI Escalation Criteria

```
AUTOMATIC ESCALATION TO HUMAN:
- Citizen explicitly requests human: "quiero hablar con una persona"
- 3 consecutive misunderstood inputs
- Detected emotional distress (prolonged silence after bad news, raised voice)
- Topics: legal disputes, water quality complaints, formal complaints (quejas PROFECO)
- Account with active legal case (fraude/judicial status)
- High-value accounts (gobierno, industrial)

HANDOFF MESSAGE TO HUMAN AGENT:
"Le transfiero con un agente. Un momento por favor."
[Agent receives screen pop with: account info, call transcript, AI classification,
 suggested resolution, caller sentiment score]
```

### 2.3 Citizen Web Portal (PWA)

A Progressive Web App optimized for mobile browsers. Read-heavy, action-light -- citizens come here to check their account, download invoices, and make payments. Major transactions are still handled by AI agents.

#### 2.3.1 Account Dashboard

```
+----------------------------------------------------------+
|  CEA QUERETARO                          [?] Ayuda  Salir  |
+----------------------------------------------------------+
|                                                            |
|  Hola, Juan Perez                        Cuenta: 12345    |
|                                                            |
|  +----------------------+  +---------------------------+   |
|  | SALDO ACTUAL         |  | PROXIMO VENCIMIENTO       |   |
|  |                      |  |                           |   |
|  |   $485.00 MXN        |  |   28/Feb/2026             |   |
|  |   Al corriente       |  |   Faltan 12 dias          |   |
|  |                      |  |                           |   |
|  |  [Pagar ahora]       |  |  [Ver recibo]             |   |
|  +----------------------+  +---------------------------+   |
|                                                            |
|  CONSUMO ULTIMOS 12 MESES                                  |
|  +-----------------------------------------------------+  |
|  | 25|                                                  |  |
|  | 20|     #  #                          #              |  |
|  | 15|  #  #  #  #        #  #  #  #  #  #  #          |  |
|  | 10|  #  #  #  #  #  #  #  #  #  #  #  #  #          |  |
|  |  5|  #  #  #  #  #  #  #  #  #  #  #  #  #          |  |
|  |  0+--+--+--+--+--+--+--+--+--+--+--+--+--+          |  |
|  |   Mar Abr May Jun Jul Ago Sep Oct Nov Dic Ene Feb    |  |
|  | Consumo promedio: 16 m3/mes                          |  |
|  +-----------------------------------------------------+  |
|                                                            |
|  ACCIONES RAPIDAS                                          |
|  +-------------+ +-------------+ +-------------+          |
|  | Historial   | | Enviar      | | Reportar    |          |
|  | de recibos  | | autolectura | | problema    |          |
|  +-------------+ +-------------+ +-------------+          |
|  +-------------+ +-------------+                           |
|  | Mi convenio | | Datos de    |                           |
|  | de pago     | | mi cuenta   |                           |
|  +-------------+ +-------------+                           |
|                                                            |
+----------------------------------------------------------+
|  [Inicio]    [Recibos]    [Pagos]    [Ayuda]              |
+----------------------------------------------------------+
```

#### 2.3.2 Invoice History Screen

```
+----------------------------------------------------------+
|  < Volver          HISTORIAL DE RECIBOS                    |
+----------------------------------------------------------+
|                                                            |
|  Filtrar: [Todos v]  Ano: [2026 v]                        |
|                                                            |
|  +-----------------------------------------------------+  |
|  | Ene 2026          18 m3          $485.00   PENDIENTE |  |
|  | Vence: 28/Feb/2026               [PDF] [Pagar]       |  |
|  +-----------------------------------------------------+  |
|  | Dic 2025          15 m3          $420.00   PAGADO    |  |
|  | Pagado: 15/Ene/2026              [PDF]               |  |
|  +-----------------------------------------------------+  |
|  | Nov 2025          14 m3          $395.00   PAGADO    |  |
|  | Pagado: 10/Dic/2025              [PDF]               |  |
|  +-----------------------------------------------------+  |
|  | Oct 2025          12 m3          $350.00   PAGADO    |  |
|  | Pagado: 08/Nov/2025              [PDF]               |  |
|  +-----------------------------------------------------+  |
|                                                            |
|  [Cargar mas recibos...]                                   |
|                                                            |
+----------------------------------------------------------+
```

#### 2.3.3 Online Payment Flow

```
Step 1: SELECT INVOICE(S)
+----------------------------------------------------------+
|  PAGAR RECIBO                                              |
+----------------------------------------------------------+
|                                                            |
|  Seleccione los recibos a pagar:                           |
|                                                            |
|  [x] Ene 2026 - $485.00                                   |
|  [ ] Dic 2025 - $420.00 (vencido)                         |
|                                                            |
|  Total seleccionado: $485.00 MXN                           |
|                                                            |
|  [Continuar]                                               |
+----------------------------------------------------------+

Step 2: SELECT PAYMENT METHOD
+----------------------------------------------------------+
|  METODO DE PAGO                                            |
+----------------------------------------------------------+
|                                                            |
|  Total a pagar: $485.00 MXN                                |
|                                                            |
|  ( ) Tarjeta de debito o credito                           |
|  ( ) Transferencia SPEI                                    |
|  ( ) Pago en OXXO                                          |
|  ( ) CoDi (QR)                                             |
|                                                            |
|  [Continuar]                                               |
+----------------------------------------------------------+

Step 2a: CARD PAYMENT (via Conekta/Stripe embedded form)
+----------------------------------------------------------+
|  PAGO CON TARJETA                   Total: $485.00 MXN    |
+----------------------------------------------------------+
|                                                            |
|  Numero de tarjeta                                         |
|  [________________________]                                |
|                                                            |
|  Vencimiento        CVV                                    |
|  [MM/AA]            [___]                                  |
|                                                            |
|  Nombre del titular                                        |
|  [________________________]                                |
|                                                            |
|  [Pagar $485.00]                                           |
|                                                            |
|  Pago seguro procesado por Conekta                         |
|  Sus datos estan protegidos.                               |
+----------------------------------------------------------+

Step 2b: SPEI REFERENCE
+----------------------------------------------------------+
|  PAGO POR TRANSFERENCIA SPEI                               |
+----------------------------------------------------------+
|                                                            |
|  Realice una transferencia con estos datos:                 |
|                                                            |
|  Banco: STP                                                |
|  CLABE: 646180XXXX12345001                                 |
|  Beneficiario: CEA Queretaro                               |
|  Referencia: 12345-0126                                    |
|  Monto exacto: $485.00                                     |
|  Concepto: Pago recibo agua                                |
|                                                            |
|  IMPORTANTE: Use el monto exacto y la referencia           |
|  indicada para que su pago se aplique automaticamente.     |
|                                                            |
|  [Copiar CLABE]  [Copiar referencia]                       |
|                                                            |
|  Su pago se reflejara en 1-2 horas habiles.                |
+----------------------------------------------------------+

Step 2c: OXXO REFERENCE
+----------------------------------------------------------+
|  PAGO EN OXXO                                              |
+----------------------------------------------------------+
|                                                            |
|  Presente este codigo de barras en cualquier OXXO:         |
|                                                            |
|  ||||| |||| ||||| |||| ||||| ||||                          |
|  Referencia: 0123-4567-8901-2345                           |
|                                                            |
|  Monto a pagar: $485.00 MXN                               |
|  Vigencia: hasta 18/Mar/2026                               |
|  Comision OXXO: $13.00                                     |
|                                                            |
|  [Descargar referencia]  [Enviar por WhatsApp]             |
|                                                            |
|  Su pago puede tardar hasta 24 horas en reflejarse.        |
+----------------------------------------------------------+

Step 3: CONFIRMATION
+----------------------------------------------------------+
|  PAGO CONFIRMADO                                           |
+----------------------------------------------------------+
|                                                            |
|       [checkmark icon]                                     |
|                                                            |
|  Su pago ha sido procesado exitosamente.                   |
|                                                            |
|  Monto: $485.00 MXN                                       |
|  Folio: PAG-2026-089431                                    |
|  Fecha: 16/Feb/2026 14:32                                  |
|  Metodo: Tarjeta terminacion 4521                          |
|                                                            |
|  [Descargar comprobante]  [Enviar por WhatsApp]            |
|                                                            |
|  Gracias por su pago puntual.                              |
|                                                            |
|  [Volver al inicio]                                        |
+----------------------------------------------------------+
```

#### 2.3.4 Meter Self-Reading Submission (Autolectura)

```
+----------------------------------------------------------+
|  ENVIAR AUTOLECTURA                                        |
+----------------------------------------------------------+
|                                                            |
|  Tome una foto del display de su medidor:                  |
|                                                            |
|  +---------------------------------------------------+    |
|  |                                                     |   |
|  |   [Camera viewfinder / Upload area]                 |   |
|  |                                                     |   |
|  |   [Tomar foto]    [Subir imagen]                    |   |
|  +---------------------------------------------------+    |
|                                                            |
|  O ingrese la lectura manualmente:                         |
|                                                            |
|  Lectura actual (numeros en negro):                        |
|  [__________] m3                                           |
|                                                            |
|  Lectura anterior: 1,245 m3 (registrada 15/Ene/2026)      |
|                                                            |
|  [Enviar lectura]                                          |
|                                                            |
|  Nota: La foto sera verificada contra la lectura           |
|  ingresada. Si hay discrepancia, se le notificara.         |
+----------------------------------------------------------+
```

#### 2.3.5 Contact/Complaint Submission

```
+----------------------------------------------------------+
|  REPORTAR PROBLEMA O QUEJA                                 |
+----------------------------------------------------------+
|                                                            |
|  Tipo de reporte:                                          |
|  [v Seleccione...]                                         |
|      Fuga en via publica                                   |
|      Fuga en mi propiedad                                  |
|      Sin servicio de agua                                   |
|      Baja presion                                          |
|      Agua turbia / contaminada                             |
|      Error en mi recibo                                     |
|      Medidor danado                                        |
|      Queja por atencion                                    |
|      Otro                                                  |
|                                                            |
|  Descripcion:                                              |
|  [________________________]                                |
|  [________________________]                                |
|  [________________________]                                |
|                                                            |
|  Ubicacion (si aplica):                                    |
|  [Usar mi ubicacion]  o  [Escribir direccion]              |
|                                                            |
|  Fotos (opcional):                                         |
|  [+] Agregar foto (max 3)                                  |
|                                                            |
|  [Enviar reporte]                                          |
+----------------------------------------------------------+
```

#### 2.3.6 PWA Technical Decisions

| Decision | Value |
|----------|-------|
| Framework | Next.js (static export for PWA) or React with Vite |
| PWA manifest | Installable on Android/iOS home screen |
| Service worker | Cache static assets; offline "account unavailable" page |
| Authentication | OTP via WhatsApp or SMS (no password for citizens) |
| Session | JWT with 30-day refresh token |
| Responsive | Mobile-first, breakpoints at 375px, 768px, 1024px |
| Performance budget | LCP < 2.5s, FID < 100ms, CLS < 0.1 |

### 2.4 Payment Kiosks

Physical terminals located at CEA offices and potentially convenience stores. Designed for fast, cash/card payment with minimal interaction.

#### 2.4.1 Kiosk Flow

```
SCREEN 1: WELCOME
+----------------------------------------------------------+
|                                                            |
|              CEA QUERETARO                                  |
|        Comision Estatal de Aguas                           |
|                                                            |
|                                                            |
|    +--------------------------------------------------+   |
|    |                                                    |  |
|    |    PAGO DE SERVICIO DE AGUA                        |  |
|    |                                                    |  |
|    |    [ESCANEAR CODIGO DE BARRAS DEL RECIBO]          |  |
|    |                                                    |  |
|    |              --- o ---                             |  |
|    |                                                    |  |
|    |    [INGRESAR NUMERO DE CUENTA]                     |  |
|    |                                                    |  |
|    +--------------------------------------------------+   |
|                                                            |
|    Horario: Lun-Vie 8:00-18:00 | Sab 9:00-14:00          |
+----------------------------------------------------------+

SCREEN 2: ACCOUNT CONFIRMATION
+----------------------------------------------------------+
|                                                            |
|   CONFIRME SU CUENTA                                       |
|                                                            |
|   Numero de cuenta: 12345                                  |
|   Titular: Juan Perez Lopez                                |
|   Direccion: Av. Zaragoza 123, Col. Centro                 |
|                                                            |
|   ADEUDO ACTUAL:                                           |
|                                                            |
|   Recibo Ene 2026:    $485.00                              |
|   --------------------------------                         |
|   TOTAL A PAGAR:      $485.00 MXN                          |
|                                                            |
|   +--------------------+  +--------------------+           |
|   | PAGAR TOTAL        |  | PAGAR OTRO MONTO   |          |
|   | $485.00            |  |                    |           |
|   +--------------------+  +--------------------+           |
|                                                            |
|   [Cancelar]                                               |
+----------------------------------------------------------+

SCREEN 3: PAYMENT
+----------------------------------------------------------+
|                                                            |
|   MONTO A PAGAR: $485.00 MXN                              |
|                                                            |
|   Seleccione metodo de pago:                               |
|                                                            |
|   +--------------------+  +--------------------+           |
|   |   EFECTIVO         |  |   TARJETA          |           |
|   |   Inserte billetes |  |   Inserte o acerque|          |
|   |   y monedas        |  |   su tarjeta       |           |
|   +--------------------+  +--------------------+           |
|                                                            |
+----------------------------------------------------------+

SCREEN 4: RECEIPT
+----------------------------------------------------------+
|                                                            |
|         PAGO EXITOSO                                       |
|                                                            |
|   [checkmark icon]                                         |
|                                                            |
|   Monto pagado: $485.00 MXN                               |
|   Folio: PAG-2026-089432                                   |
|   Fecha: 16/Feb/2026 14:35                                 |
|                                                            |
|   Imprimiendo su comprobante...                            |
|                                                            |
|   +--------------------+  +--------------------+           |
|   | ENVIAR POR         |  | IMPRIMIR OTRO      |           |
|   | WHATSAPP           |  | COMPROBANTE         |          |
|   +--------------------+  +--------------------+           |
|                                                            |
|   Gracias por su pago. Buen dia.                           |
|                                                            |
|   [Nueva operacion]   (auto-return to welcome in 30s)     |
+----------------------------------------------------------+
```

#### 2.4.2 Kiosk Design Decisions

| Decision | Value |
|----------|-------|
| Screen size | 15.6" or 21.5" touchscreen |
| Resolution | 1920x1080, designed at 150% scale for visibility |
| Touch targets | Minimum 60x60px (larger than standard -- users may have wet hands) |
| Font size | Minimum 24px body text, 36px headings |
| Timeout | 60 seconds inactivity returns to welcome |
| Accessibility | High contrast by default; large text; bilingual audio support optional |
| Error recovery | Network error: "Intente de nuevo en unos momentos." Card error: "Tarjeta no aceptada, intente con otra." |
| Receipt printer | Thermal printer; receipt includes QR code linking to digital receipt |
| Cash acceptor | Bills: $20, $50, $100, $200, $500. Coins: $1, $2, $5, $10, $20. Change dispensed. |

---

## 3. Operator Dashboard (Admin UI)

### 3.1 Technology & Layout

- **Framework:** React 18 + Next.js 14 (App Router)
- **UI Library:** shadcn/ui components (Tailwind CSS based)
- **Data Tables:** TanStack Table for sortable, filterable, paginated tables
- **Charts:** Recharts or Tremor for dashboard visualizations
- **Real-time:** Socket.io for live updates (new payments, alerts, SLA breaches)
- **Layout:** Left sidebar navigation + top bar (user, notifications, search)

#### 3.1.1 Main Layout

```
+------------------------------------------------------------------+
| [CEA Logo] SUPRA Water    [Global Search...]  [Notif] [User] [?] |
+---------------+--------------------------------------------------+
|               |                                                    |
|  NAVEGACION   |   AREA DE CONTENIDO                               |
|               |                                                    |
|  Dashboard    |   (varies per section)                            |
|               |                                                    |
|  OPERACIONES  |                                                    |
|  Contratos    |                                                    |
|  Facturacion  |                                                    |
|  Pagos        |                                                    |
|  Lecturas     |                                                    |
|               |                                                    |
|  ATENCION     |                                                    |
|  Contactos    |                                                    |
|  Impagados    |                                                    |
|  Ordenes      |                                                    |
|               |                                                    |
|  ANALISIS     |                                                    |
|  Reportes     |                                                    |
|  Indicadores  |                                                    |
|  Fraude       |                                                    |
|               |                                                    |
|  CONFIG       |                                                    |
|  Tarifas      |                                                    |
|  Usuarios     |                                                    |
|  Sistema      |                                                    |
|               |                                                    |
+---------------+--------------------------------------------------+
```

### 3.2 Dashboard (Home)

```
+------------------------------------------------------------------+
|  DASHBOARD                                    Hoy: 16/Feb/2026    |
+------------------------------------------------------------------+
|                                                                    |
|  +-------------+ +-------------+ +-------------+ +-------------+  |
|  | CUENTAS     | | RECAUDACION | | EFICIENCIA  | | ORDENES     |  |
|  | ACTIVAS     | | DEL MES     | | COBRO       | | PENDIENTES  |  |
|  |   387,421   | |  $48.2M     | |   89.3%     | |     127     |  |
|  |   +2.1%     | |  +12.4%     | |   +1.8pp    | |   -15       |  |
|  +-------------+ +-------------+ +-------------+ +-------------+  |
|                                                                    |
|  ALERTAS ACTIVAS                                [Ver todas (23)]   |
|  +--------------------------------------------------------------+ |
|  | [!] 3 pagos SPEI sin conciliar (> 24h)          Hace 2h      | |
|  | [!] SLA: 5 quejas proximas a vencer              Hace 30m     | |
|  | [!] Agente Voice AI: latencia alta (>3s)          Hace 15m    | |
|  | [i] Lote lecturas Zona Norte completado (2,340)   Hace 1h     | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  RECAUDACION DIARIA (ultimos 30 dias)                              |
|  +--------------------------------------------------------------+ |
|  |  $3M |                                               *       | |
|  |  $2M |     *  *        *     *  *     *  *  *  *  *  *  *   | |
|  |  $1M |  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  | |
|  |   $0 +---+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+ | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  ACTIVIDAD RECIENTE                                                |
|  +--------------------------------------------------------------+ |
|  | 14:32  Pago recibido: $485.00 - Cta 12345 (SPEI)            | |
|  | 14:30  WhatsApp: Reporte fuga - Cta 67890 (auto-resuelto)   | |
|  | 14:28  Factura generada: Lote Zona Sur (1,205 recibos)       | |
|  | 14:25  Orden completada: OT-2026-0341 (cambio medidor)       | |
|  | 14:22  Voice AI: Consulta saldo - Cta 11223 (resuelto)       | |
|  +--------------------------------------------------------------+ |
|                                                                    |
+------------------------------------------------------------------+
```

### 3.3 Contract Management

#### 3.3.1 Contract List

```
+------------------------------------------------------------------+
|  CONTRATOS                                [+ Nuevo contrato]       |
+------------------------------------------------------------------+
|  Buscar: [___________________] [Buscar]                            |
|  Filtros: Estado [Todos v] Tipo [Todos v] Zona [Todas v]         |
|                                                                    |
|  Mostrando 1-25 de 387,421                                        |
|  +--------------------------------------------------------------+ |
|  | # Contrato | Titular        | Toma     | Tipo     | Estado   | |
|  |------------|----------------|----------|----------|----------| |
|  | C-000012   | Juan Perez L.  | T-12345  | Domest.  | Activo   | |
|  | C-000013   | Maria Garcia H.| T-12346  | Comercial| Activo   | |
|  | C-000014   | Gob. Mpal Qro  | T-12347  | Gobierno | Activo   | |
|  | C-000015   | Pedro Sanchez M.| T-12348 | Domest.  | Cortado  | |
|  +--------------------------------------------------------------+ |
|  [< Anterior]  Pagina 1 de 15,497  [Siguiente >]                 |
+------------------------------------------------------------------+
```

#### 3.3.2 Contract Detail

```
+------------------------------------------------------------------+
|  < Contratos    CONTRATO C-000012                    [Acciones v] |
+------------------------------------------------------------------+
|                                                                    |
|  DATOS DEL CONTRATO                                                |
|  +------------------------------+  +---------------------------+  |
|  | Numero: C-000012             |  | Estado: ACTIVO            |  |
|  | Inicio: 15/Mar/2018         |  | Tipo toma: Domestica      |  |
|  | Tarifa: Domestica mensual   |  | Periodo: Mensual          |  |
|  | Metodo pago: Ventanilla     |  | Tarifa social: No         |  |
|  +------------------------------+  +---------------------------+  |
|                                                                    |
|  TITULAR                                                           |
|  Nombre: Juan Perez Lopez                                          |
|  RFC: PELJ850315XX1  |  CURP: PELJ850315HQRXXX01                 |
|  Telefono: 442-123-4567  |  WhatsApp: 442-123-4567               |
|  Email: juan.perez@email.com                                       |
|                                                                    |
|  TOMA T-12345                                                      |
|  Direccion: Av. Zaragoza 123, Col. Centro, Queretaro              |
|  Medidor: MED-2024-0891 (Activo, 3/4")                            |
|  Sector: QRO-CENTRO-01                                             |
|                                                                    |
|  TABS: [Recibos] [Pagos] [Lecturas] [Ordenes] [Contactos] [Hist] |
|  +--------------------------------------------------------------+ |
|  |  RECIBOS RECIENTES                                            | |
|  |  Ene 2026  |  18 m3  |  $485.00  |  Pendiente  | [Ver]      | |
|  |  Dic 2025  |  15 m3  |  $420.00  |  Pagado     | [Ver]      | |
|  |  Nov 2025  |  14 m3  |  $395.00  |  Pagado     | [Ver]      | |
|  +--------------------------------------------------------------+ |
|                                                                    |
+------------------------------------------------------------------+
```

### 3.4 Billing Operations

```
+------------------------------------------------------------------+
|  FACTURACION                                                       |
+------------------------------------------------------------------+
|  TABS: [Pendientes] [Generacion] [CFDI] [Notas de credito]       |
|                                                                    |
|  GENERACION MASIVA DE RECIBOS                                      |
|  +--------------------------------------------------------------+ |
|  | Zona: [v Seleccione...]                                       | |
|  | Periodo: [Feb 2026 v]                                         | |
|  | Tipo: [Todos v]                                               | |
|  |                                                                | |
|  | Lecturas disponibles para facturar: 12,405                    | |
|  | Ya facturadas: 10,200                                         | |
|  | Pendientes: 2,205                                             | |
|  |                                                                | |
|  | [Previsualizar]  [Generar recibos]                            | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  ESTADO DE TIMBRADO CFDI                                           |
|  +--------------------------------------------------------------+ |
|  | Pendientes de timbrar:    45                                  | |
|  | Timbrados hoy:          1,205                                 | |
|  | Errores de timbrado:       3  [Ver errores]                   | |
|  | Cancelados hoy:            1                                  | |
|  +--------------------------------------------------------------+ |
+------------------------------------------------------------------+
```

### 3.5 Payment Reconciliation

```
+------------------------------------------------------------------+
|  CONCILIACION DE PAGOS                                             |
+------------------------------------------------------------------+
|  TABS: [Pendientes] [Conciliados] [Rechazados]                   |
|                                                                    |
|  PAGOS PENDIENTES DE CONCILIAR                                     |
|  +--------------------------------------------------------------+ |
|  | Canal    | Referencia     | Monto   | Fecha    | Acciones     | |
|  |----------|----------------|---------|----------|--------------|  |
|  | SPEI     | REF-4567-001   | $485.00 | 16/Feb   | [Conciliar]  | |
|  | OXXO     | OXX-8901-234   | $420.00 | 15/Feb   | [Conciliar]  | |
|  | Banco    | DEP-2026-0891  | $2,100  | 15/Feb   | [Conciliar]  | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  RESUMEN DEL DIA                                                   |
|  +----------------------------+  +----------------------------+    |
|  | Pagos recibidos:     245   |  | Monto total: $156,230      |   |
|  | Conciliados auto:    198   |  | Pendientes:   $23,450      |   |
|  | Pendientes manual:    47   |  | Rechazados:    $1,200      |   |
|  +----------------------------+  +----------------------------+    |
+------------------------------------------------------------------+
```

### 3.6 Work Order Management

```
+------------------------------------------------------------------+
|  ORDENES DE SERVICIO                             [+ Nueva orden]   |
+------------------------------------------------------------------+
|  Vista: [Lista] [Mapa] [Kanban]                                   |
|  Filtros: Estado [Todos v] Tipo [Todos v] Tecnico [Todos v]      |
|                                                                    |
|  KANBAN VIEW:                                                      |
|  +------------+ +------------+ +------------+ +------------+      |
|  | PENDIENTES | | EN RUTA    | | EN PROGRESO| | COMPLETADAS|      |
|  | (23)       | | (8)        | | (5)        | | (127 hoy)  |      |
|  +------------+ +------------+ +------------+ +------------+      |
|  | OT-0341    | | OT-0338    | | OT-0335    | | OT-0330    |      |
|  | Cambio med.| | Corte serv.| | Inspeccion | | Reparacion |      |
|  | T-12345    | | T-45678    | | T-11223    | | T-99012    |      |
|  | Normal     | | Carlos G.  | | Maria L.   | | Pedro R.   |      |
|  +------------+ +------------+ +------------+ +------------+      |
|  | OT-0342    | | OT-0339    | | OT-0336    | | OT-0331    |      |
|  | Reconexion | | Lectura esp| | Verificar  | | Instalacion|      |
|  | ...        | | ...        | | fraude     | | ...        |      |
|  +------------+ +------------+ +------------+ +------------+      |
+------------------------------------------------------------------+
```

### 3.7 Contact/Complaint Queue

```
+------------------------------------------------------------------+
|  CONTACTOS Y QUEJAS                                                |
+------------------------------------------------------------------+
|  Vista: [Cola] [Mis asignados] [Resueltos]                        |
|  Filtros: Canal [Todos v] Tipo [Todos v] Prioridad [Todas v]     |
|                                                                    |
|  COLA DE ATENCION                                                  |
|  +--------------------------------------------------------------+ |
|  | [!] QUE-2026-0891  | Queja facturacion  | WhatsApp  | 2h    | |
|  |     Maria Garcia   | "Consumo excesivo en recibo enero"       | |
|  |     AI: No resuelto | SLA: Vence en 4h  | [Atender]          | |
|  +--------------------------------------------------------------+ |
|  | [i] CON-2026-1234  | Consulta tramite   | Telefono  | 30m   | |
|  |     Pedro Sanchez   | "Requisitos cambio de titular"          | |
|  |     AI: Resuelto auto | Satisfaccion: pendiente | [Revisar] | |
|  +--------------------------------------------------------------+ |
|  | [!] REP-2026-4521  | Reporte fuga       | WhatsApp  | 15m   | |
|  |     Anonimo        | "Fuga Calle Madero esq Allende"         | |
|  |     OT generada: OT-2026-0345 | [Ver orden]                  | |
|  +--------------------------------------------------------------+ |
+------------------------------------------------------------------+
```

### 3.8 Delinquency Management

```
+------------------------------------------------------------------+
|  GESTION DE IMPAGADOS                                              |
+------------------------------------------------------------------+
|  RESUMEN                                                           |
|  +----------+ +----------+ +----------+ +----------+ +----------+ |
|  | TOTAL    | | BAJO     | | MEDIO    | | ALTO     | | VULNERAB.| |
|  | MOROSOS  | | RIESGO   | | RIESGO   | | RIESGO   | |          | |
|  | 12,456   | | 5,230    | | 4,120    | | 2,806    | | 300      | |
|  | $48.2M   | | $12.1M   | | $16.8M   | | $17.5M   | | $1.8M   | |
|  +----------+ +----------+ +----------+ +----------+ +----------+ |
|                                                                    |
|  PROCEDIMIENTOS ACTIVOS                                            |
|  +--------------------------------------------------------------+ |
|  | Cuenta  | Titular       | Deuda    | Riesgo | Paso actual     | |
|  |---------|---------------|----------|--------|-----------------|  |
|  | 67890   | M. Garcia     | $2,450   | Medio  | WhatsApp aviso  | |
|  | 11223   | P. Sanchez    | $5,890   | Alto   | Orden de corte  | |
|  | 44556   | A. Rodriguez  | $890     | Bajo   | SMS recordatorio| |
|  | 78901   | R. Lopez (V)  | $1,200   | Vuln.  | Visita personal | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  (V) = Cuenta vulnerable -- No se permiten cortes automaticos     |
+------------------------------------------------------------------+
```

### 3.9 Reports and Analytics

```
+------------------------------------------------------------------+
|  REPORTES Y ANALITICA                                              |
+------------------------------------------------------------------+
|                                                                    |
|  REPORTES PREDEFINIDOS                                             |
|  +--------------------------------------------------------------+ |
|  | Operacion                                                     | |
|  |   Recaudacion diaria/mensual/anual                           | |
|  |   Eficiencia de cobro por zona                               | |
|  |   Cartera vencida por antiguedad                             | |
|  |   Consumo promedio por tipo de toma                          | |
|  |                                                               | |
|  | Servicio al cliente                                           | |
|  |   Tiempos de resolucion de quejas                            | |
|  |   Volumen por canal (WhatsApp, Telefono, Presencial)         | |
|  |   Tasa de resolucion automatica (AI)                         | |
|  |   Satisfaccion del cliente (CSAT)                            | |
|  |                                                               | |
|  | Regulatorio                                                   | |
|  |   Reporte CONAGUA mensual                                    | |
|  |   Indicadores de eficiencia trimestral                       | |
|  |   Reporte SEMARNAT de descargas                              | |
|  |                                                               | |
|  | Tecnico                                                       | |
|  |   Ordenes completadas por tecnico/equipo                     | |
|  |   Lecturas procesadas por zona                               | |
|  |   Anomalias detectadas por tipo                              | |
|  +--------------------------------------------------------------+ |
|                                                                    |
+------------------------------------------------------------------+
```

### 3.10 Tariff Configuration

```
+------------------------------------------------------------------+
|  CONFIGURACION DE TARIFAS                        [+ Nueva tarifa]  |
+------------------------------------------------------------------+
|                                                                    |
|  TARIFA DOMESTICA - VIGENTE DESDE 01/ENE/2026                     |
|  Aprobada por: Periodico Oficial del Estado, 15/Dic/2025          |
|  +--------------------------------------------------------------+ |
|  | Bloque      | Rango m3     | Precio/m3 | Cargo fijo           | |
|  |-------------|--------------|-----------|----------------------| |
|  | Basico      | 0 - 10       | $5.50     | $45.00               | |
|  | Intermedio  | 10 - 20      | $8.75     | --                   | |
|  | Excedente   | 20 - 40      | $15.30    | --                   | |
|  | Alto consumo| 40+          | $25.00    | --                   | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  Conceptos adicionales:                                            |
|  +--------------------------------------------------------------+ |
|  | Alcantarillado | 25% del cargo de agua                        | |
|  | Saneamiento    | $15.00 fijo por periodo                      | |
|  +--------------------------------------------------------------+ |
|                                                                    |
|  IVA: No aplica (servicio domestico exento)                        |
|  Descuento social: 50% para cuentas vulnerables                   |
|                                                                    |
|  [Editar tarifa]  [Ver historial]  [Simular factura]              |
+------------------------------------------------------------------+
```

### 3.11 User/Role Management

```
+------------------------------------------------------------------+
|  USUARIOS Y PERMISOS                              [+ Nuevo usuario]|
+------------------------------------------------------------------+
|                                                                    |
|  ROLES DEL SISTEMA                                                 |
|  +--------------------------------------------------------------+ |
|  | Rol             | Usuarios | Permisos clave                   | |
|  |-----------------|----------|----------------------------------| |
|  | admin           |    5     | Todo                             | |
|  | supervisor      |   12     | Ver todo, aprobar, configurar    | |
|  | operador        |   85     | CRUD contratos, facturacion      | |
|  | cajero          |   25     | Registrar pagos, recibos         | |
|  | atencion_cliente|   40     | Contactos, quejas, consultas     | |
|  | lecturista      |   20     | Registrar lecturas (movil)       | |
|  | tecnico         |   50     | Ordenes de servicio (movil)      | |
|  | auditor         |    3     | Solo lectura + logs de auditoria | |
|  | readonly        |   10     | Solo lectura                     | |
|  +--------------------------------------------------------------+ |
+------------------------------------------------------------------+
```

---

## 4. Technician Mobile App

### 4.1 Overview

The technician app is an Android-first (with iOS consideration for supervisors) mobile application optimized for field use. It replaces paper-based work orders and enables real-time tracking.

### 4.2 Key Design Constraints

| Constraint | Design Response |
|------------|----------------|
| Outdoor use (sun glare) | High contrast, large fonts, dark mode option |
| Wet/dirty hands | Large touch targets (min 48px), no small buttons |
| Spotty connectivity | Full offline mode; sync when connected |
| Low-end Android devices | Target Android 10+, lightweight assets, no heavy animations |
| GPS requirement | Automatic GPS capture on arrival/departure; photo geotagging |
| Battery life | Minimize background processes; efficient sync |

### 4.3 Screen Flows

#### 4.3.1 Work Order List (Today's Route)

```
+----------------------------------------+
| CEA QUERETARO - Campo         [Sync ^] |
| Carlos Garcia | 16/Feb/2026             |
+----------------------------------------+
|                                         |
|  MIS ORDENES DE HOY (8)                 |
|  Ruta optimizada | [Ver en mapa]        |
|                                         |
|  +-----------------------------------+  |
|  | 1. OT-2026-0341                   |  |
|  |    CAMBIO DE MEDIDOR              |  |
|  |    Av. Zaragoza 123, Col. Centro  |  |
|  |    08:30 - 09:30                  |  |
|  |    Prioridad: Normal              |  |
|  |    Estado: PENDIENTE              |  |
|  |    [Iniciar]                      |  |
|  +-----------------------------------+  |
|  | 2. OT-2026-0342                   |  |
|  |    RECONEXION                     |  |
|  |    Calle 5 de Mayo 45, Col. Nino  |  |
|  |    09:30 - 10:00                  |  |
|  |    Prioridad: Alta                |  |
|  |    Estado: PENDIENTE              |  |
|  |    [Iniciar]                      |  |
|  +-----------------------------------+  |
|  | 3. OT-2026-0343  ...             |  |
|  +-----------------------------------+  |
|                                         |
+----------------------------------------+
| [Ordenes]  [Mapa]  [Historial]  [Menu] |
+----------------------------------------+
```

#### 4.3.2 Route Map

```
+----------------------------------------+
| < Volver         RUTA DE HOY            |
+----------------------------------------+
|                                         |
|  +-----------------------------------+  |
|  |                                   |  |
|  |     [Map showing optimized        |  |
|  |      route with numbered pins     |  |
|  |      1 -> 2 -> 3 -> 4 -> ...     |  |
|  |      showing driving directions]  |  |
|  |                                   |  |
|  |  [Ubicacion actual: pin azul]     |  |
|  |  [Proxima parada: pin rojo]       |  |
|  |                                   |  |
|  +-----------------------------------+  |
|                                         |
|  Siguiente: OT-0341 - Cambio medidor   |
|  Av. Zaragoza 123 (1.2 km, 5 min)      |
|                                         |
|  [Navegar con Google Maps]              |
|                                         |
+----------------------------------------+
```

#### 4.3.3 Work Order Detail

```
+----------------------------------------+
| < Volver       OT-2026-0341            |
+----------------------------------------+
|                                         |
|  CAMBIO DE MEDIDOR                      |
|  Estado: EN PROGRESO                    |
|                                         |
|  DATOS DE LA ORDEN                      |
|  Toma: T-12345                          |
|  Titular: Juan Perez Lopez              |
|  Tel: 442-123-4567 [Llamar]             |
|  Direccion: Av. Zaragoza 123            |
|             Col. Centro, Queretaro      |
|             [Ver en mapa]               |
|                                         |
|  Medidor actual: MED-2024-0891          |
|  Lectura actual: 1,263 m3               |
|  Diametro: 3/4"                         |
|                                         |
|  Instrucciones:                         |
|  Cambiar medidor por falla en display.  |
|  Medidor nuevo: MED-2026-0123           |
|  Tomar lectura final del viejo y        |
|  lectura inicial del nuevo.             |
|                                         |
|  +-----------------------------------+  |
|  | [Llegue]                          |  |
|  | (Registra GPS + hora de llegada)  |  |
|  +-----------------------------------+  |
|                                         |
+----------------------------------------+
```

#### 4.3.4 Work Order Completion

```
+----------------------------------------+
| < Volver    COMPLETAR OT-2026-0341     |
+----------------------------------------+
|                                         |
|  LECTURA FINAL (medidor viejo):         |
|  [1263___] m3                           |
|                                         |
|  LECTURA INICIAL (medidor nuevo):       |
|  [0______] m3                           |
|                                         |
|  FOTOS (minimo 2):                      |
|  +--------+ +--------+ +--------+      |
|  | [Foto  | | [Foto  | | [+]    |      |
|  |  medidor| |  nueva | |        |      |
|  |  viejo] | |  inst.]| |        |      |
|  +--------+ +--------+ +--------+      |
|                                         |
|  MATERIALES UTILIZADOS:                 |
|  +-----------------------------------+  |
|  | Medidor 3/4" x1                   |  |
|  | Niple HG 3/4" x2                 |  |
|  | Teflon x1                         |  |
|  | [+ Agregar material]              |  |
|  +-----------------------------------+  |
|                                         |
|  RESULTADO:                             |
|  [v Seleccione...]                      |
|     Completado exitosamente             |
|     Completado con observaciones        |
|     No se pudo completar                |
|     Reprogramar                         |
|                                         |
|  NOTAS:                                 |
|  [________________________]             |
|                                         |
|  FIRMA DEL CLIENTE:                     |
|  +-----------------------------------+  |
|  |  [Signature capture area]         |  |
|  +-----------------------------------+  |
|                                         |
|  [Completar orden]                      |
|                                         |
+----------------------------------------+
```

#### 4.3.5 Photo Capture

```
+----------------------------------------+
| < Volver         TOMAR FOTO             |
+----------------------------------------+
|                                         |
|  +-----------------------------------+  |
|  |                                   |  |
|  |   [Camera viewfinder]            |  |
|  |                                   |  |
|  |                                   |  |
|  |                                   |  |
|  +-----------------------------------+  |
|                                         |
|  Tipo de foto:                          |
|  ( ) Medidor - lectura visible          |
|  ( ) Dano / falla                       |
|  ( ) Instalacion terminada              |
|  ( ) Antes del trabajo                  |
|  ( ) Despues del trabajo                |
|                                         |
|  [Capturar]                             |
|                                         |
|  GPS: 20.5881, -100.3899               |
|  Hora: 09:15:32                         |
|                                         |
+----------------------------------------+
```

### 4.4 Offline Mode

```
OFFLINE BEHAVIOR:
+----------------------------------------------------------+
| When device loses connectivity:                            |
|                                                            |
| 1. SHOW: "Sin conexion" banner (yellow)                   |
|    All locally cached work orders remain accessible.       |
|                                                            |
| 2. ALLOW:                                                  |
|    - View assigned work orders (cached from last sync)     |
|    - Navigate to work order locations (cached map tiles)   |
|    - Register arrival GPS                                  |
|    - Take photos (stored locally)                          |
|    - Fill completion forms                                  |
|    - Capture signatures                                    |
|    - Complete work orders (queued for sync)                 |
|                                                            |
| 3. BLOCK:                                                  |
|    - Viewing new/unsynced orders                           |
|    - Calling customer (no signal)                          |
|    - Real-time map routing                                  |
|                                                            |
| 4. ON RECONNECTION:                                        |
|    - Auto-sync queued completions                          |
|    - Upload photos                                         |
|    - Refresh work order list                               |
|    - Show: "Sincronizado" confirmation (green)             |
|    - Handle conflicts: server wins for status,             |
|      offline wins for field data (photos, notes, readings) |
+----------------------------------------------------------+
```

---

## 5. Design System

### 5.1 Color Palette

```
PRIMARY (Trust & Water)
  supra-blue-900:  #0C2340   -- Primary text, headings, dark backgrounds
  supra-blue-700:  #1B4F72   -- Primary buttons, active states
  supra-blue-500:  #2980B9   -- Links, accent elements
  supra-blue-300:  #7FB3D8   -- Hover states, secondary elements
  supra-blue-100:  #D4E6F1   -- Light backgrounds, highlights
  supra-blue-50:   #EBF5FB   -- Subtle backgrounds

SECONDARY (Nature & Growth)
  supra-green-700: #1E8449   -- Success states, positive indicators
  supra-green-500: #27AE60   -- Active/online, payment confirmed
  supra-green-100: #D5F5E3   -- Success backgrounds

ACCENT (Warmth & Energy)
  supra-amber-600: #D68910   -- Warnings, attention needed
  supra-amber-100: #FEF9E7   -- Warning backgrounds

DANGER
  supra-red-600:   #C0392B   -- Error states, destructive actions
  supra-red-100:   #FADBD8   -- Error backgrounds

NEUTRAL
  supra-gray-900:  #1C1C1E   -- Body text
  supra-gray-700:  #4A4A4A   -- Secondary text
  supra-gray-500:  #7B7B7B   -- Placeholder text, disabled
  supra-gray-300:  #D1D1D6   -- Borders, dividers
  supra-gray-100:  #F2F2F7   -- Page backgrounds
  supra-white:     #FFFFFF   -- Card backgrounds, inputs

STATUS COLORS (paired with icons, never color-alone)
  activo:     supra-green-500   + checkmark icon
  pendiente:  supra-amber-600   + clock icon
  cortado:    supra-red-600     + scissors icon
  baja:       supra-gray-500    + archive icon
  vulnerable: supra-blue-500    + shield icon
```

### 5.2 Typography

```
FONT FAMILY
  Primary: "Inter" (Google Fonts, excellent Spanish diacritics support)
  Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
  Monospace: "JetBrains Mono" (for account numbers, folios, references)

TYPE SCALE (rem-based for accessibility scaling)
  Display:    2.25rem  (36px)  -- Dashboard KPI numbers
  H1:         1.875rem (30px)  -- Page titles
  H2:         1.5rem   (24px)  -- Section headings
  H3:         1.25rem  (20px)  -- Card headings
  Body:       1rem     (16px)  -- Default body text
  Body small: 0.875rem (14px)  -- Table cells, secondary info
  Caption:    0.75rem  (12px)  -- Timestamps, meta info

LINE HEIGHT
  Headings: 1.3
  Body: 1.6
  Tight: 1.4 (tables, compact UI)

FONT WEIGHT
  Regular: 400 (body text)
  Medium: 500 (labels, table headers)
  Semibold: 600 (headings, buttons)
  Bold: 700 (KPI numbers, emphasis)

SPANISH DIACRITICS CHECK
  Tested characters: a e i o u A E I O U n N
  "Facturacion", "Informacion", "Numero", "Queretaro"
  All render correctly in Inter at all sizes.
```

### 5.3 Component Library

```
BUTTONS
  Primary:   supra-blue-700 bg, white text, 8px radius, 600 weight
  Secondary: white bg, supra-blue-700 border + text
  Danger:    supra-red-600 bg, white text (for destructive actions)
  Ghost:     transparent bg, supra-blue-500 text (inline actions)
  Sizes:     sm (32px h), md (40px h), lg (48px h), xl (56px h -- kiosk/mobile)

INPUTS
  Text input:    40px height, 8px radius, gray-300 border, blue-500 focus ring
  Select:        Same as text input with dropdown chevron
  Textarea:      Auto-grow, max 6 rows visible
  Search:        With magnifying glass icon prefix
  Date picker:   Calendar dropdown, dd/MM/yyyy format
  Number input:  With increment/decrement for readings

CARDS
  Default:       White bg, 1px gray-300 border, 8px radius, 16px padding
  Elevated:      Same + subtle shadow (0 1px 3px rgba(0,0,0,0.1))
  Interactive:   Hover: shadow increases, cursor: pointer
  Status card:   Left border color indicates status

TABLES
  Header:        gray-100 bg, semibold text, sticky
  Row:           White bg, gray-300 bottom border, hover: blue-50 bg
  Actions:       Right-aligned, ghost buttons
  Pagination:    Bottom, showing "1-25 de 387,421"
  Sort:          Click header to sort, arrow indicator

BADGES / STATUS CHIPS
  Success:    green-100 bg, green-700 text, rounded-full
  Warning:    amber-100 bg, amber-600 text
  Error:      red-100 bg, red-600 text
  Info:       blue-100 bg, blue-700 text
  Neutral:    gray-100 bg, gray-700 text

NOTIFICATIONS / TOASTS
  Success:    Green left border, checkmark icon
  Error:      Red left border, X icon
  Warning:    Amber left border, triangle icon
  Info:       Blue left border, info icon
  Position:   Top-right, auto-dismiss after 5 seconds

MODALS / DIALOGS
  Centered overlay, max-width 560px, 16px padding
  Confirmation dialog for destructive actions:
    "Esta seguro de cancelar esta factura?"
    [Cancelar] [Si, cancelar factura]

NAVIGATION
  Sidebar:     240px width, collapsible to 64px (icons only)
  Top bar:     64px height, fixed, global search + user menu
  Breadcrumbs: For detail pages (Contratos > C-000012)
  Tabs:        Underline style, horizontal scroll on mobile

CHARTS
  Bar chart:   Horizontal or vertical, supra-blue-500 bars
  Line chart:  supra-blue-500 line, supra-blue-100 fill
  Donut chart: Color-coded segments with legend
  Sparkline:   Inline mini chart for KPI cards
```

### 5.4 Icon Set

```
ICON LIBRARY: Lucide Icons (open-source, consistent, MIT license)
  Size: 20px default, 16px for inline, 24px for navigation
  Stroke width: 2px
  Color: Inherits from parent text color

DOMAIN-SPECIFIC ICONS:
  Water drop     -- Toma, servicio de agua
  Gauge/meter    -- Medidor, lectura
  Receipt/doc    -- Recibo, factura
  Currency       -- Pago, saldo
  Scissors       -- Corte de servicio
  Wrench         -- Orden de servicio, mantenimiento
  Phone          -- Voice AI, llamada
  Message circle -- WhatsApp, contacto
  Map pin        -- Ubicacion, ruta
  Shield         -- Vulnerable, protegido
  Alert triangle -- Anomalia, alerta
  Magnifying glass -- Fraude, inspeccion
  User           -- Titular, persona
  Building       -- Gobierno, comercial
  Home           -- Domestica
  Chart          -- Reporte, analitica
```

### 5.5 Responsive Breakpoints

```
BREAKPOINTS (mobile-first):
  xs:  0-374px      -- Small phones (legacy Android)
  sm:  375-639px    -- Standard mobile (primary citizen portal size)
  md:  640-767px    -- Large phone / small tablet
  lg:  768-1023px   -- Tablet (technician field tablet, if applicable)
  xl:  1024-1279px  -- Small laptop (operator dashboard minimum)
  2xl: 1280px+      -- Desktop (operator dashboard optimal)

DESIGN TARGETS:
  Citizen PWA:        Designed at 375px, scales up to 768px
  Technician app:     Designed at 375px (Android), with 768px tablet variant
  Operator dashboard: Designed at 1280px, responsive down to 1024px
  Kiosk:              Fixed at 1920x1080, rendered at 150% scale
```

### 5.6 Chatwoot/AGORA Integration Styling

```
AGORA (CHATWOOT) CUSTOMIZATION:
  The existing AGORA (Chatwoot) installation at CEA Queretaro
  handles human agent conversations and escalations from AI.

  Styling approach:
  - Apply SUPRA color palette via Chatwoot theming API
  - Custom widget CSS matching supra-blue-700 header
  - CEA logo in widget header
  - Spanish locale (already supported by Chatwoot)
  - Custom agent avatar for AI bot: water drop icon
  - Agent screen shows SUPRA context panel:
    sidebar with account info, AI conversation history,
    and suggested resolution from Claude classification

  No custom CRM build -- leverage Chatwoot's built-in:
  - Contact profiles (link to SUPRA person_id)
  - Conversation history
  - Canned responses in Spanish
  - Team assignment and routing
  - Reports (response time, resolution rate, CSAT)
```

---

## 6. Screen Inventory

### 6.1 Complete Screen List

#### Citizen Web Portal (PWA) -- 14 screens

| # | Screen | Priority | Notes |
|---|--------|----------|-------|
| C01 | Login / OTP verification | High | WhatsApp or SMS OTP, no password |
| C02 | Account dashboard (home) | High | Balance, consumption chart, actions |
| C03 | Invoice history list | High | Filterable, with PDF download |
| C04 | Invoice detail | Medium | Full breakdown with CFDI info |
| C05 | Payment - select invoices | High | Multi-select pending invoices |
| C06 | Payment - select method | High | Card, SPEI, OXXO, CoDi |
| C07 | Payment - card form | High | Embedded Conekta/Stripe form |
| C08 | Payment - SPEI reference | High | CLABE + reference + copy buttons |
| C09 | Payment - OXXO barcode | High | Downloadable barcode |
| C10 | Payment - confirmation | High | Success with folio and receipt |
| C11 | Meter self-reading submission | Medium | Photo + manual entry |
| C12 | Report problem / complaint | Medium | Categorized form + location |
| C13 | Payment plan view | Low | Installment schedule and status |
| C14 | Account settings / profile | Low | Phone, email, notification prefs |

#### Operator Dashboard -- 38 screens

| # | Screen | Priority | Notes |
|---|--------|----------|-------|
| O01 | Login | High | Email + password, 2FA for admins |
| O02 | Main dashboard | High | KPIs, alerts, activity feed |
| O03 | Contract list (search/filter) | High | Paginated, filterable |
| O04 | Contract detail | High | Tabs: invoices, payments, readings, orders |
| O05 | New contract form | High | Multi-step: person, toma, tariff, docs |
| O06 | Contract actions (baja, cambio titular) | Medium | Wizard with confirmation |
| O07 | Billing - pending invoices | High | Batch generation controls |
| O08 | Billing - invoice detail | High | Line items, CFDI status, delivery |
| O09 | Billing - CFDI management | Medium | Stamp, cancel, error handling |
| O10 | Billing - batch generation | High | Zone/period selector, preview |
| O11 | Billing - credit notes | Medium | Form linked to original invoice |
| O12 | Payment list | High | Filterable by channel, date, status |
| O13 | Payment detail | Medium | Full transaction info |
| O14 | Payment reconciliation | High | Pending SPEI/OXXO/bank matching |
| O15 | Payment plan list | Medium | Active plans with status |
| O16 | Payment plan detail | Medium | Installment tracker |
| O17 | Payment plan creation | Medium | Calculator with options |
| O18 | Meter reading list | Medium | By zone, period, status |
| O19 | Meter reading detail | Low | Individual reading with anomaly info |
| O20 | Reading batch management | Medium | Route/zone assignment |
| O21 | Contact/complaint queue | High | SLA tracking, AI classification |
| O22 | Contact detail | High | Full history, linked orders, resolution |
| O23 | Work order list (table/kanban/map) | High | Three view modes |
| O24 | Work order detail | High | Assignment, status, field data |
| O25 | Work order creation | Medium | Type-specific forms |
| O26 | Delinquency overview dashboard | High | Risk tiers, totals, trends |
| O27 | Delinquency procedure detail | Medium | Step history, actions |
| O28 | Fraud case list | Medium | Detection source, status |
| O29 | Fraud case detail | Medium | Inspections, evidence, resolution |
| O30 | Reports - revenue | Medium | Period selector, charts, export |
| O31 | Reports - collection efficiency | Medium | By zone, period |
| O32 | Reports - consumption patterns | Low | Charts, anomaly distribution |
| O33 | Reports - CONAGUA regulatory | Medium | Auto-generated, review + export |
| O34 | Tariff schedule list | Medium | Active/historical |
| O35 | Tariff schedule editor | Medium | Block editor with simulator |
| O36 | User management | Medium | CRUD, role assignment |
| O37 | System configuration | Low | Tenant settings, API keys |
| O38 | Audit log viewer | Low | Event stream, filterable |

#### Technician Mobile App -- 10 screens

| # | Screen | Priority | Notes |
|---|--------|----------|-------|
| T01 | Login | High | Employee credentials |
| T02 | Work order list (today) | High | Ordered by route |
| T03 | Route map | High | Optimized path, navigation |
| T04 | Work order detail | High | Customer info, instructions |
| T05 | Work order completion form | High | Type-specific fields |
| T06 | Photo capture | High | Categorized, geotagged |
| T07 | Signature capture | High | Customer + technician |
| T08 | Material entry | Medium | Predefined list + custom |
| T09 | Reading entry (for lecturistas) | High | Manual + photo OCR |
| T10 | History / completed orders | Low | Past work reference |

#### Kiosk -- 4 screens

| # | Screen | Priority | Notes |
|---|--------|----------|-------|
| K01 | Welcome / account entry | High | Barcode scan or manual |
| K02 | Account confirmation + balance | High | Payment amount selection |
| K03 | Payment processing | High | Cash acceptor or card terminal |
| K04 | Confirmation + receipt | High | Print receipt, WhatsApp option |

**Total screens: 66** (14 citizen + 38 operator + 10 technician + 4 kiosk)

### 6.2 Wireframe Specifications for Top 20 Critical Screens

The following screens are the highest priority for detailed wireframe design. ASCII wireframes are provided above in Sections 2-4 for these screens:

| Rank | Screen | Section Reference |
|------|--------|-------------------|
| 1 | C02 - Citizen account dashboard | Section 2.3.1 |
| 2 | O02 - Operator main dashboard | Section 3.2 |
| 3 | C05-C10 - Payment flow (6 screens) | Section 2.3.3 |
| 4 | T02 - Technician work order list | Section 4.3.1 |
| 5 | T04 - Work order detail | Section 4.3.3 |
| 6 | T05 - Work order completion | Section 4.3.4 |
| 7 | O03 - Contract list | Section 3.3.1 |
| 8 | O04 - Contract detail | Section 3.3.2 |
| 9 | O21 - Contact/complaint queue | Section 3.7 |
| 10 | O23 - Work order kanban | Section 3.6 |
| 11 | O26 - Delinquency dashboard | Section 3.8 |
| 12 | K01-K04 - Kiosk flow (4 screens) | Section 2.4.1 |
| 13 | C03 - Invoice history | Section 2.3.2 |
| 14 | O14 - Payment reconciliation | Section 3.5 |
| 15 | O34-O35 - Tariff configuration | Section 3.10 |
| 16 | T03 - Route map | Section 4.3.2 |
| 17 | C11 - Meter self-reading | Section 2.3.4 |
| 18 | O07-O10 - Billing screens | Section 3.4 |
| 19 | C12 - Report problem | Section 2.3.5 |
| 20 | O30-O33 - Reports | Section 3.9 |

### 6.3 User Flow Diagrams for Top 10 Critical Journeys

#### Journey 1: Citizen Pays Bill via WhatsApp
```
Citizen sends message --> AI greets --> Citizen says "pagar"
--> AI asks account # --> Citizen provides # --> AI shows balance
--> AI sends payment link --> Citizen clicks link
--> Citizen portal payment flow (C05-C10) --> Payment confirmed
--> AI sends confirmation template (pago_confirmado) --> Done
```

#### Journey 2: Citizen Reports Leak via WhatsApp
```
Citizen sends message --> AI greets --> Citizen reports leak
--> AI asks location --> Citizen shares location/address
--> AI asks description + photo --> Citizen provides
--> AI creates work order + contact --> AI confirms with folio
--> Work order assigned to technician --> Technician notified
--> Technician completes --> Citizen notified via WhatsApp
```

#### Journey 3: Citizen Calls for Balance Inquiry (Voice AI)
```
Call arrives --> Twilio routes to Voice AI --> AI greets in Spanish
--> AI asks how to help --> Citizen says "quiero saber mi saldo"
--> AI asks for account number --> Citizen says number
--> AI looks up account --> AI confirms name/address
--> AI reads balance and due date --> AI asks if anything else
--> Citizen says no --> AI says farewell --> Call ends
```

#### Journey 4: Operator Processes Monthly Billing
```
Operator opens Billing section (O07) --> Selects zone + period
--> System shows available readings count --> Operator clicks preview
--> Reviews sample invoices --> Clicks "Generate"
--> System generates invoices in background (BullMQ)
--> Progress bar shows completion --> CFDI stamping begins
--> Stamped invoices delivered via WhatsApp/email
--> Operator reviews any errors (O09)
```

#### Journey 5: Technician Completes Meter Replacement
```
Technician opens app (T01 login) --> Views today's orders (T02)
--> Taps order --> Views detail (T04) --> Taps "Llegue" (GPS logged)
--> Performs work --> Opens completion form (T05)
--> Enters old meter final reading --> Enters new meter initial reading
--> Takes photos (T06) of old meter, new installation
--> Selects materials used (T08) --> Gets customer signature (T07)
--> Taps "Completar orden" --> Syncs to server
--> Dashboard shows order completed (O23)
```

#### Journey 6: Delinquency Collection Sequence
```
Invoice passes due date --> Event: invoice.past_due
--> Collections Intelligence agent evaluates risk score
--> Score 0.5 (medium risk) --> Medium sequence begins
--> Day 1: WhatsApp reminder with payment link
--> Day 3: Voice AI call (automated)
--> Day 7: WhatsApp warning about service cut
--> Day 14: Formal letter generated
--> Day 21: Work order for corte created
--> [If payment received at any step: sequence stops, procedure resolved]
--> [If vulnerable account: different sequence, no auto-corte]
```

#### Journey 7: Operator Handles Escalated Complaint
```
AI agent receives WhatsApp complaint --> AI classifies as "disputa facturacion"
--> AI cannot resolve (complex) --> Escalates to AGORA/Chatwoot
--> Human agent receives handoff with context
--> Agent views SUPRA context panel (account, history, AI suggestion)
--> Agent investigates in operator dashboard (O04 contract detail)
--> Agent resolves: generates credit note (O11) or explains charges
--> Agent closes contact (O22) with resolution
--> Citizen receives WhatsApp confirmation
--> CSAT survey sent after 24 hours
```

#### Journey 8: Citizen Self-Service Payment Plan
```
Citizen sends "CONVENIO" via WhatsApp --> AI looks up account
--> AI shows debt summary and plan options
--> Citizen selects option --> AI explains requirements
--> Citizen uploads documents (INE, comprobante) via WhatsApp
--> Documents validated (OCR + AI verification)
--> Payment plan created in system --> Confirmation sent
--> Citizen can view plan in portal (C13)
--> Monthly reminders sent via WhatsApp template
```

#### Journey 9: Operator Configures New Tariff Schedule
```
Operator opens Tariffs (O34) --> Clicks "New tariff"
--> Fills tariff editor (O35): category, blocks, additional concepts
--> Uses "Simulate invoice" to test with sample accounts
--> Reviews results --> Saves as draft
--> Supervisor approves tariff --> Sets effective date
--> System applies new tariff to matching accounts on effective date
```

#### Journey 10: Fraud Detection to Resolution
```
Anomaly Detection agent flags suspicious reading
--> High confidence score --> Fraud Detection agent opens case (O28)
--> Case appears in fraud dashboard
--> Supervisor reviews case detail (O29)
--> Creates inspection work order --> Technician inspects
--> Technician uploads evidence (photos, notes)
--> Case confirmed as fraud --> Regularization invoice generated
--> Citizen notified --> Legal process initiated if needed
```

---

## 7. Sprint-by-Sprint Design Delivery

### 7.1 Design Sprint Plan

The design work aligns with the SUPRA 4-quarter implementation plan. Design deliverables run 1-2 sprints ahead of development.

#### Phase 1: Q1-Q2 2026 -- Foundation + Quick Wins

| Sprint | Design Deliverables | Development Dependency |
|--------|--------------------|-----------------------|
| **Sprint 1** (Weeks 1-2) | Design system foundation: color palette, typography, component library specs. Figma setup with design tokens. | None (design leads) |
| **Sprint 2** (Weeks 3-4) | WhatsApp conversation flows: all 6 templates + 4 conversation flows (A-D). Wireframes for operator login (O01) and main dashboard (O02). | Project scaffolding, DB schema |
| **Sprint 3** (Weeks 5-6) | Operator dashboard: contract list (O03), contract detail (O04), new contract form (O05). Voice AI call flow diagram. | Core CRUD APIs ready |
| **Sprint 4** (Weeks 7-8) | Citizen PWA: login (C01), dashboard (C02), invoice history (C03). Kiosk flow (K01-K04). | Auth + person/contract APIs |
| **Sprint 5** (Weeks 9-10) | Payment flow: all 6 screens (C05-C10). Payment reconciliation (O14). Operator billing screens (O07-O10). | Payment APIs, CFDI integration |
| **Sprint 6** (Weeks 11-12) | Technician app: all 10 screens (T01-T10). Offline mode specifications. Route map integration specs. | Work order APIs, field workforce agent |
| **Sprint 7** (Weeks 13-14) | Contact/complaint screens (O21, O22). Report/problem submission (C12). AGORA/Chatwoot theming. | Contact APIs, AI classification |
| **Sprint 8** (Weeks 15-16) | Delinquency management (O26, O27). Payment plan screens (O15-O17, C13). Self-reading (C11). | Delinquency APIs, collections agent |
| **Sprint 9** (Weeks 17-18) | Work order management (O23-O25) with kanban/map views. Tariff configuration (O34, O35). | Work order APIs, tariff engine |
| **Sprint 10** (Weeks 19-20) | Reports screens (O30-O33). User management (O36). System config (O37). Audit log (O38). | Analytics APIs, admin APIs |
| **Sprint 11** (Weeks 21-22) | Refinement and polish. Accessibility audit (WCAG 2.1 AA). Performance optimization review. | Full API coverage |
| **Sprint 12** (Weeks 23-24) | Final QA handoff. Design system documentation. Component library finalization. | Pre-launch readiness |

#### Phase 2: Q3-Q4 2026 -- Core Business Agents

| Sprint | Design Deliverables |
|--------|--------------------|
| Sprint 13-14 | Self-service contract flows via WhatsApp (digital alta/baja/cambio titular). Enhanced contract wizard in dashboard. |
| Sprint 15-16 | Anomaly detection dashboard. ML confidence visualization. Suspicious reading review flow for operators. |
| Sprint 17-18 | Enhanced complaint resolution flow. AI auto-resolution status indicators. Satisfaction survey integration. |
| Sprint 19-20 | Field workforce enhancements: real-time GPS tracking view for supervisors. Route optimization visualization. |
| Sprint 21-22 | Real-time analytics dashboard enhancements. Live Socket.io widgets for KPIs. |
| Sprint 23-24 | Payment plan self-service via WhatsApp. Improved delinquency orchestrator visualizations. |

#### Phase 3: Q1-Q2 2027 -- Intelligence Layer

| Sprint | Design Deliverables |
|--------|--------------------|
| Sprint 25-26 | Fraud detection dashboard. Geospatial clustering visualization. Case management workflow. |
| Sprint 27-28 | Collections intelligence visualization. Predictive scoring display. Vulnerability protection UI. |
| Sprint 29-30 | Consumption forecast charts. Tariff optimizer interface. "What-if" simulation tools. |
| Sprint 31-32 | Regulatory compliance report viewer. CONAGUA auto-report review screens. |

#### Phase 4: Q3-Q4 2027 -- Full Autonomy

| Sprint | Design Deliverables |
|--------|--------------------|
| Sprint 33-34 | Natural language BI interface. Conversational analytics for operators. |
| Sprint 35-36 | Multi-tenant marketplace UI (if applicable). Final system polish and documentation. |

### 7.2 Prototype Milestones

| Milestone | Date | Deliverable | Purpose |
|-----------|------|-------------|---------|
| M1 | Week 4 | Clickable WhatsApp prototype (Figma) | Validate conversation flows with citizen focus group |
| M2 | Week 8 | Interactive citizen portal prototype | Usability testing with 10 citizens (mixed demographics) |
| M3 | Week 10 | Operator dashboard prototype (core screens) | Usability testing with 5 CEA operators |
| M4 | Week 12 | Technician app prototype | Field testing with 3 CEA technicians |
| M5 | Week 16 | Kiosk prototype | In-office testing at 1 CEA location |
| M6 | Week 20 | Full system prototype (all 66 screens) | Executive stakeholder review |
| M7 | Week 24 | Production-ready design handoff | Development team final QA |

### 7.3 User Testing Plan

#### Citizen Testing (3 rounds)

| Round | Timing | Participants | Focus | Method |
|-------|--------|-------------|-------|--------|
| 1 | Week 8 | 10 citizens: 3 elderly (60+), 3 young adults (25-35), 2 commercial account holders, 2 low digital literacy | WhatsApp flows + portal dashboard | In-person at CEA office. Think-aloud protocol. Spanish only. |
| 2 | Week 16 | 15 citizens (expanded demographics) | Full payment flow, complaint submission, self-reading | Remote via WhatsApp (actual test messages). In-person for portal. |
| 3 | Week 22 | 20 citizens | End-to-end journeys across all channels | Mixed: in-person for kiosk/voice, remote for digital. |

**Key metrics to measure:**
- Task completion rate (target: >90% for primary tasks)
- Time to complete payment (target: <3 minutes portal, <5 messages WhatsApp)
- Comprehension of bill/balance information (target: >95% understand their balance)
- Error rate on account lookup (target: <5%)
- NPS/CSAT score (target: >70 NPS)

#### Operator Testing (2 rounds)

| Round | Timing | Participants | Focus | Method |
|-------|--------|-------------|-------|--------|
| 1 | Week 10 | 5 operators: 2 billing, 1 customer service, 1 supervisor, 1 cashier | Core workflows: contract lookup, billing generation, payment recording | Task-based testing at CEA office. Compare time vs current system. |
| 2 | Week 20 | 10 operators (all roles) | Full system: reports, delinquency, configuration, work orders | 2-hour testing session. SUS (System Usability Scale) survey. |

**Key metrics:**
- Task completion time vs legacy system (target: 50% faster)
- SUS score (target: >75)
- Error rate on billing generation (target: 0 unintended invoices)
- Training time estimate (target: <4 hours for core operations)

#### Technician Testing (2 rounds)

| Round | Timing | Participants | Focus | Method |
|-------|--------|-------------|-------|--------|
| 1 | Week 12 | 3 technicians + 2 lecturistas | Work order completion, photo capture, offline mode | Field test: ride-along for half day. Test in areas with poor connectivity. |
| 2 | Week 18 | 8 technicians | Full route, GPS tracking, material entry, signature | Full day field test. Measure order completion time. |

**Key metrics:**
- Work order completion time (target: comparable to paper + upload time saved)
- Offline sync reliability (target: 100% data preservation)
- Photo upload success rate (target: >99%)
- GPS accuracy (target: within 10m of actual location)

### 7.4 Dependencies on Backend API Readiness

| Design Deliverable | Required API | Target Sprint |
|-------------------|-------------|---------------|
| WhatsApp flows | WhatsApp Business API integration | Sprint 2 |
| Citizen dashboard | GET /contracts/:id, GET /invoices, GET /tomas/:id/consumption | Sprint 4 |
| Payment flow | POST /payments, payment gateway webhooks | Sprint 5 |
| Contract management | All /contracts endpoints | Sprint 3 |
| Billing operations | POST /invoices/generate, POST /cfdi/stamp | Sprint 5 |
| Work order app | All /work-orders endpoints, route optimization | Sprint 6 |
| Contact queue | POST /contacts, PATCH /contacts/:id, Chatwoot webhooks | Sprint 7 |
| Delinquency mgmt | Delinquency APIs, collections scoring | Sprint 8 |
| Reports | All /analytics endpoints, /reports/conagua | Sprint 10 |
| Voice AI | Twilio webhook integration, all account lookup tools | Sprint 3 |
| Kiosk | Payment APIs + barcode scanner integration | Sprint 5 |

### 7.5 Design Tools and Handoff Process

```
DESIGN TOOLS:
  Figma:        Primary design tool. All screens, components, prototypes.
  FigJam:       Whiteboarding for user flows and journey maps.
  Storybook:    Component library documentation (shared with frontend devs).

HANDOFF PROCESS:
  1. Designer completes screen in Figma
  2. Design review with product lead (async Figma comments)
  3. Developer inspects via Figma Dev Mode (spacing, colors, assets)
  4. Components built in Storybook matching Figma specs
  5. Designer reviews implemented screen vs Figma
  6. Sign-off or revision notes

DESIGN TOKENS (Figma -> Code sync):
  Colors, typography, spacing, shadows defined as Figma variables
  Exported as Tailwind CSS config or CSS custom properties
  Single source of truth: Figma variables

FILE STRUCTURE:
  Figma Project: "SUPRA Water 2026"
    Page: Design System (components, tokens, icons)
    Page: Citizen Portal (C01-C14)
    Page: Operator Dashboard (O01-O38)
    Page: Technician App (T01-T10)
    Page: Kiosk (K01-K04)
    Page: WhatsApp Flows (conversation mockups)
    Page: Voice AI (call flow diagrams)
    Page: User Testing (test scripts, results)
```

---

## Appendix A: Glossary of UI Terms in Spanish (MX)

| English | Spanish (MX) | Context |
|---------|-------------|---------|
| Dashboard | Tablero / Panel | Main overview screen |
| Invoice | Recibo | Citizen-facing. "Factura" for CFDI context. |
| Balance | Saldo | Amount owed |
| Payment | Pago | Transaction |
| Due date | Fecha limite de pago | On invoices |
| Overdue | Vencido | Past due date |
| Service cut | Corte de servicio | Disconnection |
| Reconnection | Reconexion | Service restoration |
| Work order | Orden de servicio | Field work |
| Complaint | Queja | Formal complaint |
| Inquiry | Consulta | Information request |
| Leak report | Reporte de fuga | Water leak |
| Meter reading | Lectura de medidor | Consumption measurement |
| Payment plan | Convenio de pago | Installment agreement |
| Account holder | Titular | Contract owner |
| Search | Buscar | Search action |
| Filter | Filtrar | Filter action |
| Download | Descargar | File download |
| Print | Imprimir | Print action |
| Save | Guardar | Save action |
| Cancel | Cancelar | Cancel action |
| Confirm | Confirmar | Confirm action |
| Back | Volver / Regresar | Navigation back |
| Next | Siguiente | Navigation forward |
| Submit | Enviar | Form submission |
| Loading | Cargando... | Loading state |
| Error | Error | Error state |
| Success | Exito | Success state |
| Required field | Campo obligatorio | Form validation |
| Invalid | No valido | Validation error |

---

## Appendix B: Accessibility Checklist

Before each design milestone, verify:

- [ ] Color contrast ratio >= 4.5:1 for normal text (AA)
- [ ] Color contrast ratio >= 3:1 for large text (AA)
- [ ] No information conveyed by color alone
- [ ] All interactive elements have visible focus indicators
- [ ] All images have alt text (Spanish)
- [ ] All form inputs have associated labels
- [ ] Error messages are descriptive and suggest corrections
- [ ] Touch targets >= 44x44px (48x48px for mobile/kiosk)
- [ ] Content is readable at 200% zoom
- [ ] Page structure uses semantic HTML (headings, landmarks, lists)
- [ ] Dynamic content updates are announced to screen readers (aria-live)
- [ ] Keyboard navigation follows logical tab order
- [ ] No keyboard traps
- [ ] Skip navigation link present on all pages
- [ ] Animations can be disabled (prefers-reduced-motion)
- [ ] Time-limited actions have sufficient duration or can be extended

---

*Document version: 1.0*
*Last updated: 2026-02-16*
*Author: UX/UI Designer, SUPRA Water 2026 Team*
