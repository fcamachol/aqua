# AquaCIS 2.0 — Master Implementation Plan

## Overview

This document is the master index for the AquaCIS 2.0 transformation — a 36-month program to modernize CEA Queretaro's water utility Customer Information System from a legacy monolith (4,114 PostgreSQL tables, 5 SOAP services, 13.5% API integration) into a cloud-native, microservices-based platform with smart metering, customer self-service, and modern billing.

**Generated:** 2026-02-16
**Total documentation:** 34,604 lines across 38 files (28 analysis reports + 10 phase plans)

---

## Program Timeline

```
Month:  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 ... 36
        |--Phase 1--|
           |---Phase 2---|
        |------Phase 4------|
              |--------Phase 3---------|
              |--------Phase 5---------|
                          |----------Phase 6----------|
                                         |--------Phase 7--------|
                                               |--------Phase 8--------|
                                                     |-------------Phase 9------------->
                                                           |---------Phase 10--------->
```

### Track 1: Database Modernization (Months 1-8)
| Phase | Name | Duration | Target |
|-------|------|----------|--------|
| 1 | Emergency DB Cleanup | Months 1-2 | 4,114 → ~1,470 tables |
| 2 | History & Lookup Consolidation | Months 2-4 | ~1,470 → ~1,150 tables |
| 3 | Structural Fixes & Normalization | Months 4-8 | ~1,150 → ~230 tables |

### Track 2: API Modernization (Months 1-10)
| Phase | Name | Duration | Target |
|-------|------|----------|--------|
| 4 | API Integration Waves | Months 1-5 | 17 → 90+ operations (71%+) |
| 5 | SOAP→REST Modernization | Months 4-10 | RESTful API via Strangler Fig |

### Track 3: Cloud & Platform (Months 8-22)
| Phase | Name | Duration | Target |
|-------|------|----------|--------|
| 6 | Cloud & Microservices | Months 8-16 | Azure AKS + first 4 microservices |
| 7 | Billing Modernization | Months 12-20 | Modern tariff engine + CFDI 4.0 |
| 8 | Customer Platform | Months 14-22 | PWA + WhatsApp + payments |

### Track 4: Smart Infrastructure (Months 18-36+)
| Phase | Name | Duration | Target |
|-------|------|----------|--------|
| 9 | Smart Metering & IoT | Months 18-36+ | 10K meter pilot + LoRaWAN |
| 10 | GIS, Analytics & Go-Live | Months 20-36 | Full platform cutover |

---

## Phase Plans

| # | Plan File | Lines | Tasks | Effort |
|---|-----------|-------|-------|--------|
| 1 | `PHASE_01_DB_EMERGENCY_CLEANUP.md` | 1,105 | 28 tasks | 91 hours |
| 2 | `PHASE_02_DB_CONSOLIDATION.md` | 368 | ~32 tasks | 480 hours |
| 3 | `PHASE_03_DB_NORMALIZATION.md` | 1,665 | 47 tasks | 761 hours |
| 4 | `PHASE_04_API_INTEGRATION.md` | 811 | 73 tasks | ~500 hours |
| 5 | `PHASE_05_API_MODERNIZATION.md` | 870 | 34 tasks | ~600 hours |
| 6 | `PHASE_06_CLOUD_MICROSERVICES.md` | 429 | 52 tasks | 200 person-days |
| 7 | `PHASE_07_BILLING_MODERNIZATION.md` | 677 | ~40 tasks | ~700 hours |
| 8 | `PHASE_08_CUSTOMER_PLATFORM.md` | 930 | ~45 tasks | 8.5 FTEs / 28 weeks |
| 9 | `PHASE_09_SMART_METERING.md` | 677 | ~50 tasks | $1.8M pilot / $75-86M full |
| 10 | `PHASE_10_GIS_ANALYTICS_GOLIVE.md` | 921 | ~60 tasks | 13-16 FTE peak |
| **Total** | | **8,453** | **~461 tasks** | |

---

## Analysis Reports (Foundation)

### Division A: Database Deep Analysis
| Report | Lines | Health Score |
|--------|-------|-------------|
| `A1-core-schema-analysis.md` | 581 | 3.5/10 |
| `A2-billing-domain-analysis.md` | 640 | 6/10 |
| `A3-customer-domain-analysis.md` | 567 | 5/10 |
| `A4-infrastructure-domain-analysis.md` | 810 | 6.5/10 |
| `A5-work-orders-analysis.md` | 662 | 6.5/10 |
| `A6-collections-domain-analysis.md` | 704 | 7/10 |
| `A7-lookup-config-analysis.md` | 614 | 3/10 |
| `A8-history-audit-analysis.md` | 747 | 4/10 |
| `A9-antipatterns-analysis.md` | 570 | 9/10 severity |

### Division B: API Deep Analysis
| Report | Lines | Readiness Score |
|--------|-------|----------------|
| `B1-contracts-api-analysis.md` | 608 | 6/10 |
| `B2-debt-api-analysis.md` | 953 | 8/10 |
| `B3-meters-api-analysis.md` | 604 | 7/10 |
| `B4-readings-portal-analysis.md` | 471 | 5/10 |
| `B5-work-orders-api-analysis.md` | 690 | 7/10 |
| `B6-rest-integration-analysis.md` | 740 | 4/10 |
| `B7-gap-analysis.md` | 790 | 3/10 |

### Division C: Next-Gen Research
| Report | Lines | Focus |
|--------|-------|-------|
| `C1-modern-cis-platforms.md` | 762 | SAP, Oracle, Open Smartflex comparison |
| `C2-api-modernization.md` | 917 | SOAP→REST migration strategies |
| `C3-db-modernization.md` | 1,341 | PostgreSQL best practices |
| `C4-cloud-native-architecture.md` | 1,290 | Microservices, CQRS, Kubernetes |
| `C5-billing-systems.md` | 944 | Tariff engines, CFDI 4.0, payments |
| `C6-customer-portal.md` | 1,024 | PWA, WhatsApp, digital identity |
| `C7-iot-smart-metering.md` | 950 | LoRaWAN, AMI, leak detection |
| `C8-open-source-water.md` | 838 | PostGIS, EPANET, Camunda, CKAN |

### Synthesis Reports
| Report | Lines | Purpose |
|--------|-------|---------|
| `SYSTEM_HEALTH_REPORT.md` | 386 | Composite health: 5.1/10 |
| `INTEGRATION_ROADMAP.md` | 1,044 | 20-week API integration plan |
| `DATABASE_OPTIMIZATION_PLAN.md` | 1,218 | 94% table reduction strategy |
| `NEXTGEN_ARCHITECTURE_BLUEPRINT.md` | 1,019 | AquaCIS 2.0 vision |

---

## Key Metrics

| Metric | Current | Target | Phase |
|--------|---------|--------|-------|
| Database tables | 4,114 | ~230 | 1-3 |
| API integration | 13.5% (17/126) | 71%+ (90+/126) | 4 |
| API architecture | SOAP passthrough | RESTful BFF | 5 |
| Infrastructure | On-premises monolith | Azure AKS microservices | 6 |
| Billing | Legacy batch | Event-sourced + CFDI 4.0 | 7 |
| Customer engagement | 4/10 maturity | 7.2/10 maturity | 8 |
| Smart metering | 0 smart meters | 10K pilot (400K roadmap) | 9 |
| NRW (water loss) | ~40% | 18% target | 9-10 |
| System health | 5.1/10 | 8.5/10 | All |

## Technology Stack (AquaCIS 2.0)

- **Cloud:** Azure Mexico Central (AKS, ACR, Key Vault)
- **Backend:** Go + TypeScript microservices
- **Frontend:** Vue 3 PWA (evolved AGORA)
- **Database:** PostgreSQL + TimescaleDB + Redis
- **Messaging:** Apache Kafka
- **IoT:** ThingsBoard PE + EMQX + ChirpStack (LoRaWAN)
- **Workflow:** Camunda 8 (Zeebe)
- **GIS:** PostGIS + GeoServer + QGIS
- **BI:** Apache Superset
- **Payments:** Conekta (OXXO, SPEI, CoDi, cards)
- **Monitoring:** Prometheus + Grafana
- **CI/CD:** GitHub Actions + ArgoCD

## Cost Summary

| Category | Estimate |
|----------|----------|
| Cloud infrastructure | $3,500-5,000/month |
| Software development (36 months) | $1.8-2.7M |
| Smart meter pilot (10K units) | $1.8M |
| Full AMI deployment (400K, 72 months) | $75-86M |
| 10-year NRW revenue recovery | $100-120M |
