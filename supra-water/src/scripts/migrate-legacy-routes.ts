/**
 * Legacy AquaCIS Route Migration Script
 *
 * Migrates zona, libreta, ptoserv, and lote data from the legacy cf_quere_pro
 * PostgreSQL database into the new SUPRA route_graphs / route_nodes /
 * route_edges / route_assignments schema.
 *
 * Usage:
 *   npx tsx src/scripts/migrate-legacy-routes.ts \
 *     --legacy-db "postgres://user:pass@host:5432/cf_quere_pro" \
 *     --supra-db "postgres://user:pass@host:5432/supra" \
 *     [--dry-run] \
 *     [--explotacion-id <numeric-legacy-id>]
 *
 * Environment variable fallbacks:
 *   LEGACY_DATABASE_URL, DATABASE_URL, DRY_RUN, EXPLOTACION_ID
 */

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { explotaciones } from '../../db/schema/tenants.js';
import { sectoresHidraulicos } from '../../db/schema/infrastructure.js';
import { tomas } from '../../db/schema/tomas.js';
import { users } from '../../db/schema/users.js';
import {
  routeGraphs,
  routeNodes,
  routeEdges,
  routeAssignments,
} from '../../db/schema/reading-routes.js';

// =============================================================
// CLI argument parsing
// =============================================================

interface MigrationConfig {
  legacyDbUrl: string;
  supraDbUrl: string;
  dryRun: boolean;
  explotacionIdFilter: string | null;
}

function parseArgs(): MigrationConfig {
  const args = process.argv.slice(2);
  const config: MigrationConfig = {
    legacyDbUrl: process.env.LEGACY_DATABASE_URL ?? '',
    supraDbUrl: process.env.DATABASE_URL ?? '',
    dryRun: process.env.DRY_RUN === 'true',
    explotacionIdFilter: process.env.EXPLOTACION_ID ?? null,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--legacy-db':
        config.legacyDbUrl = args[++i];
        break;
      case '--supra-db':
        config.supraDbUrl = args[++i];
        break;
      case '--dry-run':
        config.dryRun = true;
        break;
      case '--explotacion-id':
        config.explotacionIdFilter = args[++i];
        break;
    }
  }

  if (!config.legacyDbUrl) {
    console.error('ERROR: Legacy DB URL required. Use --legacy-db or LEGACY_DATABASE_URL');
    process.exit(1);
  }
  if (!config.supraDbUrl) {
    console.error('ERROR: SUPRA DB URL required. Use --supra-db or DATABASE_URL');
    process.exit(1);
  }

  return config;
}

// =============================================================
// Stats tracking
// =============================================================

interface MigrationStats {
  zonasMigrated: number;
  zonasSkipped: number;
  zonasFailed: number;
  graphsMigrated: number;
  graphsSkipped: number;
  graphsFailed: number;
  nodesMigrated: number;
  nodesSkipped: number;
  nodesFailed: number;
  edgesCreated: number;
  assignmentsMigrated: number;
  assignmentsSkipped: number;
  assignmentsFailed: number;
}

function createStats(): MigrationStats {
  return {
    zonasMigrated: 0,
    zonasSkipped: 0,
    zonasFailed: 0,
    graphsMigrated: 0,
    graphsSkipped: 0,
    graphsFailed: 0,
    nodesMigrated: 0,
    nodesSkipped: 0,
    nodesFailed: 0,
    edgesCreated: 0,
    assignmentsMigrated: 0,
    assignmentsSkipped: 0,
    assignmentsFailed: 0,
  };
}

// =============================================================
// Legacy row types
// =============================================================

interface LegacyZona {
  zonexpid: string;
  zonid: string;
  zondescrip: string;
  zonsnactiva: string;
}

interface LegacyLibreta {
  libexpid: string;
  libzonid: string;
  libcod: string;
  libdesc: string | null;
}

interface LegacyPtoserv {
  ptosid: string;
  ptosexpid: string;
  ptoszonid: string | null;
  ptoslibcod: string | null;
  ptosemplid: string;
  ptoscodrec: string | null;
  ptosobserv: string | null;
  ptosestado: string;
  ptosnnoaccess: string;
}

interface LegacyLote {
  lotcod: string;
  lotplecexpid: string;
  lotpleczonid: string;
  lotpleclibcod: string;
  lotplecanno: string;
  lotplecperiid: string;
  lotestado: string;
  lotfeccrea: string;
  lotnumabo: string;
}

// =============================================================
// Main migration
// =============================================================

async function main() {
  const config = parseArgs();

  console.log('='.repeat(60));
  console.log('SUPRA — Legacy Route Migration Script');
  console.log('='.repeat(60));
  console.log(`  Mode:          ${config.dryRun ? 'DRY RUN (no writes)' : 'LIVE'}`);
  console.log(`  Legacy DB:     ${config.legacyDbUrl.replace(/\/\/.*@/, '//*****@')}`);
  console.log(`  SUPRA DB:      ${config.supraDbUrl.replace(/\/\/.*@/, '//*****@')}`);
  console.log(`  Filter:        ${config.explotacionIdFilter ?? 'ALL explotaciones'}`);
  console.log('='.repeat(60));
  console.log();

  // Connect to legacy database (raw pg client for reads)
  const legacyClient = postgres(config.legacyDbUrl, {
    max: 5,
    idle_timeout: 30,
    connect_timeout: 10,
  });

  // Connect to SUPRA database (Drizzle ORM for writes)
  const supraClient = postgres(config.supraDbUrl, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 10,
  });
  const db = drizzle(supraClient);

  const stats = createStats();

  // Lookup caches: legacy composite key → SUPRA UUID
  const zoneMap = new Map<string, string>();       // "expid:zonid" → sector UUID
  const graphMap = new Map<string, string>();       // "expid:zonid:libcod" → graph UUID
  const nodeMap = new Map<string, string>();        // "expid:zonid:libcod:seq" → node UUID
  const expMap = new Map<string, { id: string; tenantId: string }>(); // "expid" → { UUID, tenantId }
  const emplMap = new Map<string, string>();        // "emplid" → user UUID

  try {
    // ---------------------------------------------------------
    // Pre-load SUPRA lookup tables
    // ---------------------------------------------------------
    console.log('[PREP] Loading SUPRA explotaciones lookup...');
    const supraExps = await db.select().from(explotaciones);
    for (const exp of supraExps) {
      expMap.set(exp.code, { id: exp.id, tenantId: exp.tenantId });
    }
    console.log(`[PREP]   Found ${supraExps.length} explotaciones in SUPRA`);

    console.log('[PREP] Loading SUPRA sectores_hidraulicos lookup...');
    const supraSectors = await db.select().from(sectoresHidraulicos);
    for (const s of supraSectors) {
      // Build lookup key using explotacion code + sector code
      const expEntry = supraExps.find(e => e.id === s.explotacionId);
      if (expEntry) {
        zoneMap.set(`${expEntry.code}:${s.code}`, s.id);
      }
    }
    console.log(`[PREP]   Found ${supraSectors.length} sectores in SUPRA`);

    console.log('[PREP] Loading SUPRA users lookup...');
    const supraUsers = await db.select().from(users);
    for (const u of supraUsers) {
      // Users may have a legacy employee code stored in their name or metadata
      // For now, index by name for fuzzy matching later
      emplMap.set(u.name, u.id);
    }
    console.log(`[PREP]   Found ${supraUsers.length} users in SUPRA`);
    console.log();

    // ---------------------------------------------------------
    // Step 1: Migrate zonas → sectores_hidraulicos
    // ---------------------------------------------------------
    console.log('[STEP 1] Migrating zonas → sectores_hidraulicos...');

    const expFilter = config.explotacionIdFilter
      ? `WHERE zonexpid = ${Number(config.explotacionIdFilter)}`
      : '';
    const legacyZonas = await legacyClient<LegacyZona[]>`
      SELECT zonexpid, zonid, zondescrip, zonsnactiva
      FROM zona ${legacyClient.unsafe(expFilter)}
      ORDER BY zonexpid, zonid
    `;

    for (const zona of legacyZonas) {
      try {
        const expCode = zona.zonexpid.toString().trim();
        const zoneCode = zona.zonid.trim();
        const key = `${expCode}:${zoneCode}`;

        // Check if already mapped
        if (zoneMap.has(key)) {
          stats.zonasSkipped++;
          continue;
        }

        const expEntry = expMap.get(expCode);
        if (!expEntry) {
          console.warn(`  [WARN] Zone ${zoneCode}: no matching explotacion for code=${expCode}, skipping`);
          stats.zonasSkipped++;
          continue;
        }

        // Check if sector already exists in SUPRA by code
        const existing = await db
          .select()
          .from(sectoresHidraulicos)
          .where(
            and(
              eq(sectoresHidraulicos.explotacionId, expEntry.id),
              eq(sectoresHidraulicos.code, zoneCode),
            ),
          )
          .limit(1);

        if (existing.length > 0) {
          zoneMap.set(key, existing[0].id);
          stats.zonasSkipped++;
          continue;
        }

        const sectorId = uuidv4();
        if (config.dryRun) {
          console.log(`  [DRY] Would INSERT sectores_hidraulicos: code=${zoneCode}, name="${zona.zondescrip.trim()}", explotacion=${expEntry.id}`);
        } else {
          await db.insert(sectoresHidraulicos).values({
            id: sectorId,
            tenantId: expEntry.tenantId,
            explotacionId: expEntry.id,
            code: zoneCode,
            name: zona.zondescrip.trim(),
            active: zona.zonsnactiva.trim() === 'S',
          });
        }

        zoneMap.set(key, sectorId);
        stats.zonasMigrated++;
      } catch (err) {
        console.error(`  [ERR] Failed to migrate zona ${zona.zonid}: ${err}`);
        stats.zonasFailed++;
      }
    }

    console.log(`[STEP 1] Complete: ${stats.zonasMigrated} migrated, ${stats.zonasSkipped} skipped, ${stats.zonasFailed} failed`);
    console.log();

    // ---------------------------------------------------------
    // Step 2: Migrate libretas → route_graphs
    // ---------------------------------------------------------
    console.log('[STEP 2] Migrating libretas → route_graphs...');

    const libExpFilter = config.explotacionIdFilter
      ? `WHERE libexpid = ${Number(config.explotacionIdFilter)}`
      : '';
    const legacyLibretas = await legacyClient<LegacyLibreta[]>`
      SELECT libexpid, libzonid, libcod, libdesc
      FROM libreta ${legacyClient.unsafe(libExpFilter)}
      ORDER BY libexpid, libzonid, libcod
    `;

    for (const lib of legacyLibretas) {
      try {
        const expCode = lib.libexpid.toString().trim();
        const zoneCode = lib.libzonid.trim();
        const libCode = lib.libcod.toString().trim();
        const key = `${expCode}:${zoneCode}:${libCode}`;

        const expEntry = expMap.get(expCode);
        if (!expEntry) {
          console.warn(`  [WARN] Libreta ${libCode}: no matching explotacion for code=${expCode}, skipping`);
          stats.graphsSkipped++;
          continue;
        }

        const zoneKey = `${expCode}:${zoneCode}`;
        const zoneId = zoneMap.get(zoneKey);
        if (!zoneId) {
          console.warn(`  [WARN] Libreta ${libCode}: no matching zone for key=${zoneKey}, skipping`);
          stats.graphsSkipped++;
          continue;
        }

        const graphId = uuidv4();
        const routeName = lib.libdesc?.trim() || `Libreta ${libCode} - Zona ${zoneCode}`;

        if (config.dryRun) {
          console.log(`  [DRY] Would INSERT route_graphs: name="${routeName}", zone=${zoneId}, explotacion=${expEntry.id}`);
        } else {
          await db.insert(routeGraphs).values({
            id: graphId,
            tenantId: expEntry.tenantId,
            explotacionId: expEntry.id,
            zoneId,
            name: routeName.substring(0, 100),
            description: `Migrated from legacy libreta expid=${expCode} zonid=${zoneCode} libcod=${libCode}`,
            status: 'draft',
            totalNodes: 0,
          });
        }

        graphMap.set(key, graphId);
        stats.graphsMigrated++;
      } catch (err) {
        console.error(`  [ERR] Failed to migrate libreta ${lib.libcod}: ${err}`);
        stats.graphsFailed++;
      }
    }

    console.log(`[STEP 2] Complete: ${stats.graphsMigrated} migrated, ${stats.graphsSkipped} skipped, ${stats.graphsFailed} failed`);
    console.log();

    // ---------------------------------------------------------
    // Step 3: Migrate ptoserv → route_nodes
    // ---------------------------------------------------------
    console.log('[STEP 3] Migrating ptoserv → route_nodes...');

    const ptosExpFilter = config.explotacionIdFilter
      ? `WHERE ptosexpid = ${Number(config.explotacionIdFilter)}`
      : '';
    const legacyPtoserv = await legacyClient<LegacyPtoserv[]>`
      SELECT ptosid, ptosexpid, ptoszonid, ptoslibcod, ptosemplid,
             ptoscodrec, ptosobserv, ptosestado, ptosnnoaccess
      FROM ptoserv ${legacyClient.unsafe(ptosExpFilter)}
      ORDER BY ptosexpid, ptoszonid, ptoslibcod, ptoscodrec
    `;

    // Pre-load tomas from SUPRA for linking (ptosid → toma)
    console.log('  [PREP] Loading tomas lookup...');
    const supraTomas = await db.select().from(tomas);
    const tomaByNumber = new Map<string, { id: string; meterId: string | null }>();
    for (const t of supraTomas) {
      tomaByNumber.set(t.tomaNumber, { id: t.id, meterId: t.meterId });
    }
    console.log(`  [PREP] Found ${supraTomas.length} tomas in SUPRA`);

    // Track nodes per graph for totalNodes update and edge generation
    const graphNodeSequences = new Map<string, { nodeId: string; seq: number }[]>();

    for (const ptos of legacyPtoserv) {
      try {
        const expCode = ptos.ptosexpid.toString().trim();
        const zoneCode = ptos.ptoszonid?.trim() ?? '';
        const libCode = ptos.ptoslibcod?.toString().trim() ?? '';

        if (!zoneCode || !libCode) {
          stats.nodesSkipped++;
          continue;
        }

        const graphKey = `${expCode}:${zoneCode}:${libCode}`;
        const graphId = graphMap.get(graphKey);
        if (!graphId) {
          stats.nodesSkipped++;
          continue;
        }

        // Resolve toma: try matching by ptosid as toma_number
        const ptosIdStr = ptos.ptosid.toString().trim();
        const tomaEntry = tomaByNumber.get(ptosIdStr);
        if (!tomaEntry) {
          // Service point has no matching toma in SUPRA yet — skip
          stats.nodesSkipped++;
          continue;
        }

        const sequenceOrder = ptos.ptoscodrec ? parseInt(ptos.ptoscodrec, 10) : 0;

        // Map access difficulty from ptosnnoaccess flag
        // 'S' (si, no access) = high difficulty (4), 'N' = normal (1)
        const accessDifficulty = ptos.ptosnnoaccess?.trim() === 'S' ? 4 : 1;

        const nodeId = uuidv4();
        const nodeKey = `${graphKey}:${sequenceOrder}`;

        if (config.dryRun) {
          console.log(`  [DRY] Would INSERT route_nodes: graph=${graphId}, toma=${tomaEntry.id}, seq=${sequenceOrder}`);
        } else {
          await db.insert(routeNodes).values({
            id: nodeId,
            graphId,
            tomaId: tomaEntry.id,
            meterId: tomaEntry.meterId,
            location: 'SRID=4326;POINT(0 0)', // Placeholder — will be geocoded later
            accessDifficulty,
            avgServiceTimeMin: '5.00',
            sequenceOrder,
            isEntryPoint: false,
            isExitPoint: false,
            notes: ptos.ptosobserv?.trim() || null,
          });
        }

        nodeMap.set(nodeKey, nodeId);

        // Track for edge generation
        if (!graphNodeSequences.has(graphId)) {
          graphNodeSequences.set(graphId, []);
        }
        graphNodeSequences.get(graphId)!.push({ nodeId, seq: sequenceOrder });

        stats.nodesMigrated++;
      } catch (err) {
        console.error(`  [ERR] Failed to migrate ptoserv ${ptos.ptosid}: ${err}`);
        stats.nodesFailed++;
      }
    }

    // Update totalNodes on each graph
    if (!config.dryRun) {
      for (const [graphId, nodes] of graphNodeSequences) {
        await db
          .update(routeGraphs)
          .set({ totalNodes: nodes.length })
          .where(eq(routeGraphs.id, graphId));
      }
    }

    // Mark entry/exit points (lowest and highest sequence per graph)
    if (!config.dryRun) {
      for (const [, nodes] of graphNodeSequences) {
        if (nodes.length === 0) continue;
        nodes.sort((a, b) => a.seq - b.seq);
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        await db
          .update(routeNodes)
          .set({ isEntryPoint: true })
          .where(eq(routeNodes.id, first.nodeId));
        if (first.nodeId !== last.nodeId) {
          await db
            .update(routeNodes)
            .set({ isExitPoint: true })
            .where(eq(routeNodes.id, last.nodeId));
        }
      }
    }

    console.log(`[STEP 3] Complete: ${stats.nodesMigrated} migrated, ${stats.nodesSkipped} skipped, ${stats.nodesFailed} failed`);
    console.log();

    // ---------------------------------------------------------
    // Step 4: Migrate lote → route_assignments
    // ---------------------------------------------------------
    console.log('[STEP 4] Migrating lote → route_assignments...');

    const loteExpFilter = config.explotacionIdFilter
      ? `WHERE lotplecexpid = ${Number(config.explotacionIdFilter)}`
      : '';
    const legacyLotes = await legacyClient<LegacyLote[]>`
      SELECT lotcod, lotplecexpid, lotpleczonid, lotpleclibcod,
             lotplecanno, lotplecperiid, lotestado, lotfeccrea, lotnumabo
      FROM lote ${legacyClient.unsafe(loteExpFilter)}
      ORDER BY lotplecexpid, lotpleczonid, lotpleclibcod
    `;

    // Map legacy lote status codes to new status values
    // Legacy: 0=pending, 1=in progress, 2=completed, 3=cancelled
    const loteStatusMap: Record<string, string> = {
      '0': 'pendiente',
      '1': 'en_progreso',
      '2': 'completada',
      '3': 'cancelada',
    };

    for (const lote of legacyLotes) {
      try {
        const expCode = lote.lotplecexpid.toString().trim();
        const zoneCode = lote.lotpleczonid.trim();
        const libCode = lote.lotpleclibcod.toString().trim();
        const graphKey = `${expCode}:${zoneCode}:${libCode}`;

        const graphId = graphMap.get(graphKey);
        if (!graphId) {
          stats.assignmentsSkipped++;
          continue;
        }

        // Find a user to assign — we need at least a placeholder user
        // In legacy system, the employee is on ptoserv, not lote
        // Use the first available user, or create a placeholder reference
        const firstUser = supraUsers[0];
        if (!firstUser) {
          console.warn('  [WARN] No users in SUPRA — cannot create assignments');
          stats.assignmentsSkipped++;
          continue;
        }

        const status = loteStatusMap[lote.lotestado.toString().trim()] ?? 'pendiente';

        // Build a synthetic billing_period_id from year + period
        const billingPeriodId = uuidv4();
        const readingsTotal = parseInt(lote.lotnumabo, 10) || 0;

        const assignmentId = uuidv4();

        if (config.dryRun) {
          console.log(`  [DRY] Would INSERT route_assignments: graph=${graphId}, status=${status}, readings=${readingsTotal}, lote=${lote.lotcod}`);
        } else {
          await db.insert(routeAssignments).values({
            id: assignmentId,
            graphId,
            userId: firstUser.id,
            billingPeriodId,
            assignedDate: lote.lotfeccrea || new Date().toISOString().split('T')[0],
            status,
            readingsCompleted: status === 'completada' ? readingsTotal : 0,
            readingsTotal,
          });
        }

        stats.assignmentsMigrated++;
      } catch (err) {
        console.error(`  [ERR] Failed to migrate lote ${lote.lotcod}: ${err}`);
        stats.assignmentsFailed++;
      }
    }

    console.log(`[STEP 4] Complete: ${stats.assignmentsMigrated} migrated, ${stats.assignmentsSkipped} skipped, ${stats.assignmentsFailed} failed`);
    console.log();

    // ---------------------------------------------------------
    // Step 5: Generate placeholder edges between consecutive nodes
    // ---------------------------------------------------------
    console.log('[STEP 5] Generating placeholder edges for consecutive nodes...');

    for (const [graphId, nodes] of graphNodeSequences) {
      if (nodes.length < 2) continue;
      nodes.sort((a, b) => a.seq - b.seq);

      for (let i = 0; i < nodes.length - 1; i++) {
        const fromNode = nodes[i];
        const toNode = nodes[i + 1];

        try {
          if (config.dryRun) {
            console.log(`  [DRY] Would INSERT route_edges: from=${fromNode.nodeId} → to=${toNode.nodeId}, graph=${graphId}`);
          } else {
            await db.insert(routeEdges).values({
              id: uuidv4(),
              graphId,
              fromNodeId: fromNode.nodeId,
              toNodeId: toNode.nodeId,
              distanceM: '0.00',
              estimatedWalkMin: '0.00',
              isOptimal: true,
            });
          }
          stats.edgesCreated++;
        } catch (err) {
          console.error(`  [ERR] Failed to create edge ${fromNode.nodeId} → ${toNode.nodeId}: ${err}`);
        }
      }
    }

    console.log(`[STEP 5] Complete: ${stats.edgesCreated} placeholder edges created`);
    console.log();

    // ---------------------------------------------------------
    // Summary
    // ---------------------------------------------------------
    console.log('='.repeat(60));
    console.log('MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`  Zonas → sectores_hidraulicos:`);
    console.log(`    Migrated: ${stats.zonasMigrated}  |  Skipped: ${stats.zonasSkipped}  |  Failed: ${stats.zonasFailed}`);
    console.log(`  Libretas → route_graphs:`);
    console.log(`    Migrated: ${stats.graphsMigrated}  |  Skipped: ${stats.graphsSkipped}  |  Failed: ${stats.graphsFailed}`);
    console.log(`  Ptoserv → route_nodes:`);
    console.log(`    Migrated: ${stats.nodesMigrated}  |  Skipped: ${stats.nodesSkipped}  |  Failed: ${stats.nodesFailed}`);
    console.log(`  Lote → route_assignments:`);
    console.log(`    Migrated: ${stats.assignmentsMigrated}  |  Skipped: ${stats.assignmentsSkipped}  |  Failed: ${stats.assignmentsFailed}`);
    console.log(`  Placeholder edges created: ${stats.edgesCreated}`);
    console.log();

    const totalMigrated =
      stats.zonasMigrated + stats.graphsMigrated + stats.nodesMigrated + stats.assignmentsMigrated + stats.edgesCreated;
    const totalFailed =
      stats.zonasFailed + stats.graphsFailed + stats.nodesFailed + stats.assignmentsFailed;
    const totalSkipped =
      stats.zonasSkipped + stats.graphsSkipped + stats.nodesSkipped + stats.assignmentsSkipped;

    console.log(`  TOTAL MIGRATED: ${totalMigrated}`);
    console.log(`  TOTAL SKIPPED:  ${totalSkipped}`);
    console.log(`  TOTAL FAILED:   ${totalFailed}`);

    if (config.dryRun) {
      console.log();
      console.log('  ** DRY RUN — no data was written to SUPRA **');
    }

    console.log('='.repeat(60));
  } catch (err) {
    console.error('FATAL migration error:', err);
    process.exit(1);
  } finally {
    await legacyClient.end();
    await supraClient.end();
  }
}

main().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
