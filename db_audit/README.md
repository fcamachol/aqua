# Database Audit: cf_quere_pro

Cleanup roadmap for the AQUASIS/CEA Queretaro water utility database.
Target: reduce from **4,114 tables** to **~300-400** (90%+ reduction).

## Execution Order

```
1. pre_cleanup_inventory.sql    -- FIRST: capture baseline snapshot
2. verification_queries.sql     -- Safety checks (run per-table before dropping)
3. phase1_drop_transient_tables.sql   -- LOW risk,    ~2,650 tables removed
4. phase2_consolidate_and_merge.sql   -- LOW-MED,     ~50 tables removed
5. phase3_domain_value_consolidation.sql -- MEDIUM,    ~35-40 tables removed
6. phase4_audit_log_history.sql       -- MED-HIGH,    ~100-180 tables removed
7. phase5_spain_regional_evaluation.sql  -- HIGH,      ~25 tables (needs Aqualia OK)
```

## Before Each Phase

1. Take a full `pg_dump` backup
2. Run `pre_cleanup_inventory.sql` (first time only) or validation from previous phase
3. Schedule maintenance window (Phases 2-5 require brief downtime)
4. Run the relevant section of `verification_queries.sql`

## Key Safety Notes

- Phase 1 is safe to run immediately (transient/orphaned tables only)
- Phases 2-4 require application code changes before dropping source tables
- Phase 5 **requires written Aqualia ERP team confirmation**
- All DROP statements use `IF EXISTS CASCADE` for safety
- Replacement tables are created BEFORE drops in each phase

## Full Report

See [DATABASE_AUDIT.md](DATABASE_AUDIT.md) for the complete analysis.
