---
name: phase-status
description: Check progress against a specific SUPRA Water implementation phase plan
---

# SUPRA Water Phase Status Check

When this skill is invoked, assess the current progress of a specific implementation phase (or provide an overview of all phases) by examining the codebase for evidence of task completion.

## Step 1: Identify the Phase

Ask the user which phase to check, or show the master plan overview.

The SUPRA Water 2026 program has 10 phases across 36 months:

- **Phase 1** - Foundation & Infrastructure (months 1-3)
- **Phase 2** - Core Data Model & Migration (months 2-5)
- **Phase 3** - Authentication & Authorization (months 3-6)
- **Phase 4** - Contract Management / Contratacion (months 4-8)
- **Phase 5** - Meter Reading / Medicion (months 6-10)
- **Phase 6** - Billing / Facturacion & CFDI (months 8-14)
- **Phase 7** - Payments & Collections / Cobranza (months 10-16)
- **Phase 8** - Customer Service / Atencion al Cliente (months 14-20)
- **Phase 9** - Analytics & Reporting (months 18-24)
- **Phase 10** - Optimization & Handoff (months 24-36)

Read `plans/MASTER_PLAN_INDEX.md` to get the official phase list and overview. If the user says "all" or "overview", summarize the status of all phases.

## Step 2: Read the Phase Plan

Read the corresponding phase plan document:

- Look for files matching `plans/PHASE_*` using glob search
- Common naming: `plans/PHASE_01_FOUNDATION.md`, `plans/PHASE_02_DATA_MODEL.md`, etc.
- Extract all defined tasks, deliverables, and acceptance criteria from the plan

Parse each task and note:
- Task description
- Estimated effort (if specified)
- Dependencies on other phases
- Expected deliverables (files, endpoints, tests)

## Step 3: Check for Evidence of Completion

For each task in the phase plan, search the codebase for evidence of completion:

**Code artifacts:**
- Search for expected source files (e.g., `src/services/billing/`, `src/models/contract.ts`)
- Check if expected TypeScript interfaces, classes, and functions exist
- Verify expected database migration files exist (e.g., `migrations/`)

**Configuration:**
- Docker and docker-compose configuration
- Environment variable definitions
- CI/CD pipeline configurations
- Infrastructure as code files

**Tests:**
- Unit tests in `__tests__/` or `*.test.ts` / `*.spec.ts`
- Integration tests
- E2E tests
- Check if tests pass by looking for test files (do not run them unless asked)

**Documentation:**
- API documentation (OpenAPI/Swagger specs)
- Mapping documents in `docs/mappings/`
- Architecture decision records

**Endpoints:**
- Route definitions in Express routers
- Controller implementations
- Middleware

Classify each task as:
- **COMPLETED** - All expected artifacts exist and appear functional
- **IN PROGRESS** - Some artifacts exist but the task is not fully done
- **BLOCKED** - Cannot proceed due to a dependency on another incomplete task
- **NOT STARTED** - No evidence of work found

## Step 4: Generate Status Report

Produce a structured report:

```
SUPRA WATER 2026 - PHASE {N} STATUS REPORT
============================================
Phase: {Phase Name}
Date: {current date}
Timeline: Months {start}-{end}

OVERALL PROGRESS: {completed}/{total} tasks ({percentage}%)

COMPLETED TASKS ({count}):
  [x] {Task description}
      Evidence: {file paths, endpoints found}

IN PROGRESS TASKS ({count}):
  [~] {Task description}
      Status: {what exists, what is missing}

BLOCKED TASKS ({count}):
  [!] {Task description}
      Blocked by: Phase {N} - {dependency description}

NOT STARTED TASKS ({count}):
  [ ] {Task description}
      Expected deliverables: {what needs to be created}
```

## Step 5: Calculate Completion Percentage

Calculate progress using weighted completion:

- Each task contributes equally unless effort estimates are provided
- If effort estimates exist (e.g., story points, days), weight by effort
- IN PROGRESS tasks count as 50% complete
- BLOCKED tasks count as 0% complete

```
Completion: {X}% ({completed_weight} + {in_progress_weight * 0.5}) / {total_weight}
```

## Step 6: Identify Cross-Phase Dependencies

Check for dependencies that may be blocking progress:

- Read other phase plans to identify prerequisite tasks
- Check if blocking tasks from earlier phases are complete
- Flag circular dependencies or scheduling conflicts
- Note if the current date puts the phase behind schedule based on the planned timeline

```
DEPENDENCIES:
  Phase {N} depends on:
    - Phase {M}, Task: "{description}" - {COMPLETED/INCOMPLETE}
    - Phase {K}, Task: "{description}" - {COMPLETED/INCOMPLETE}

  Phase {N} blocks:
    - Phase {P}, Task: "{description}"
```

## Step 7: Recommend Next Steps

Based on the analysis, suggest the **3 highest-priority tasks** to work on next:

Prioritization criteria (in order):
1. Tasks that unblock other tasks or phases
2. Tasks that are in progress and close to completion
3. Tasks on the critical path of the overall timeline
4. Tasks with the highest business value (billing, payments, compliance)
5. Foundation tasks that enable multiple future tasks

```
RECOMMENDED NEXT ACTIONS:
  1. [HIGH] {Task description}
     Reason: {why this is the top priority}
     Estimated effort: {time estimate}

  2. [HIGH] {Task description}
     Reason: {why this matters}
     Estimated effort: {time estimate}

  3. [MEDIUM] {Task description}
     Reason: {why this is next}
     Estimated effort: {time estimate}
```

## Step 8: Output the Report

Present the complete report in a readable format. If the user requests it, save the report to `reports/phase-{N}-status-{date}.md`.

Offer to:
- Drill down into any specific task for more detail
- Start working on one of the recommended tasks
- Compare with the previous status report if one exists
- Generate a summary suitable for stakeholder communication
