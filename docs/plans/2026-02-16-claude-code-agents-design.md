# Claude Code Agents & Skills Design — SUPRA Water 2026

**Date:** 2026-02-16
**Approach:** Domain-Aligned Agent Team
**Total:** 9 agents + 11 skills (20 files)

---

## Agents (`.claude/agents/`)

### 1. `db-architect.md`
Database schema design, migrations, optimization. Knows the full legacy schema (4,114 tables), target schema (~230 tables), PostgreSQL 16, TimescaleDB, pgvector, Drizzle ORM. References `db_audit/`, `db_mapping/`, and Phase 1-3 plans.

### 2. `api-builder.md`
REST API endpoints, Express routers, middleware, Zod validation. Implements the SUPRA API spec (Section 6 of architecture). Handles JWT auth, tenant isolation (`tenant_id` on every query), BullMQ job queues, and domain events via pg LISTEN/NOTIFY.

### 3. `legacy-bridge.md`
Aquasis SOAP integration and strangler fig migration. Deep knowledge of all 5 SOAP WSDL contracts, the CEA API reference, and data mapping between legacy AquaCIS and new SUPRA schemas. Builds adapter layers that route traffic between old and new systems.

### 4. `frontend-dev.md`
Vue 3 PWA development, AGORA/Chatwoot integration. Uses Composition API, Pinia state management, Tailwind CSS, Socket.io for real-time. All UI in Spanish (es-MX). WCAG 2.1 accessibility. Mobile-first responsive design.

### 5. `ai-agent-builder.md`
Builds the 8 SUPRA production AI agents. Creates n8n workflows, Claude API system prompts, tool function definitions, WhatsApp Business API templates, Twilio voice flows. Tests agent behavior with simulated conversations.

### 6. `devops-engineer.md`
Infrastructure and deployment. Docker Compose for local dev, GCP Cloud Run for production, Traefik v3 reverse proxy, GitHub Actions CI/CD, Prometheus + Grafana monitoring, Sentry error tracking. Manages environment configs and secrets.

### 7. `billing-specialist.md`
Mexican fiscal compliance expert. CFDI 4.0 stamping via Finkok PAC, SAT catalog validation, tarifa escalonada calculations, payment processing (Conekta: SPEI, CoDi, OXXO, cards). Understands CEA Queretaro tariff structures and regulatory requirements.

### 8. `test-engineer.md`
Testing strategy and implementation. Vitest for unit tests, Supertest for API integration tests, Playwright for E2E. Creates test data fixtures with realistic Mexican water domain data (RFC, CURP, toma numbers, meter readings). Coverage targets and CI integration.

### 9. `project-lead.md`
Orchestration agent. Tracks progress against the 10-phase master plan. Reviews PRs for architectural consistency. Delegates work to specialized agents. Maintains the project CLAUDE.md with current context.

---

## Skills (`.claude/skills/`)

### Development
1. **`new-migration.md`** — Generate Drizzle ORM migration with tenant_id, indexes, rollback
2. **`new-endpoint.md`** — Scaffold REST endpoint (router + handler + Zod schema + tests)
3. **`new-service.md`** — Create domain microservice with SUPRA boilerplate
4. **`new-ai-agent.md`** — Create SUPRA AI agent (prompt + tools + n8n + tests)
5. **`soap-to-rest.md`** — Migrate SOAP operation to REST via strangler fig

### Integration
6. **`cfdi-validate.md`** — Validate CFDI 4.0 compliance
7. **`aquasis-map.md`** — Map Aquasis SOAP operation to SUPRA data model

### DevOps
8. **`deploy-service.md`** — Deploy to GCP Cloud Run
9. **`add-monitoring.md`** — Add Prometheus metrics + Grafana dashboard

### Project Management
10. **`phase-status.md`** — Check progress against phase plan
11. **`domain-glossary.md`** — Mexican water utility term reference

---

## Design Decisions

- **Language:** Agent prompts in English, but agents understand and use Spanish domain terms naturally (toma, lectura, factura, adeudo, etc.)
- **Architecture:** Domain-aligned, one agent per major concern area
- **Skills:** Trigger-based (`/command`), focused on repeatable workflows
- **Context:** Each agent references specific project documentation files for deep context
