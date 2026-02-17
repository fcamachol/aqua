// =============================================================
// Route Optimizer — Orchestration Service
//
// Ties together workload balancer, TSP solver, and PostGIS utils
// to produce optimized reading routes for a zone/billing period.
//
// Pipeline: Query tomas → Balance workload → Solve TSP per partition
//           → Persist route_graphs, route_nodes, route_edges
// =============================================================

import { sql, eq, and } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { routeGraphs, routeNodes, routeEdges } from '../../../db/schema/reading-routes.js';
import { tomas } from '../../../db/schema/tomas.js';
import { meters } from '../../../db/schema/meters.js';
import { acometidas } from '../../../db/schema/infrastructure.js';
import { solveTSP, computeTourCost, type TSPNode } from './tsp-solver.js';
import { balanceWorkload, type BalancerNode, type BalancerConfig } from './workload-balancer.js';
import { haversineDistance } from './postgis-utils.js';

// ─── Types ──────────────────────────────────────────────────────

type DrizzleDB = PostgresJsDatabase;

export interface OptimizeZoneParams {
  zoneId: string;
  billingPeriodId: string;
  numCapturistas: number;
  maxReadingsPerRoute: number;
  shiftDurationMin?: number;         // default 480
  optimizationMethod?: 'tsp_2opt' | 'tsp_nearest' | 'manual'; // default 'tsp_2opt'
  tenantId: string;
  explotacionId: string;
  zoneName?: string;                  // for route naming
}

export interface OptimizedRouteSummary {
  graphId: string;
  name: string;
  totalNodes: number;
  totalDistanceM: number;
  estimatedDurationMin: number;
}

/** Toma row returned by the zone query. */
interface ZoneToma {
  tomaId: string;
  meterId: string | null;
  lat: number;
  lng: number;
  accessible: boolean;
}

// ─── Constants ──────────────────────────────────────────────────

const WALK_SPEED_M_PER_MIN = 80; // ~4.8 km/h urban walking
const DEFAULT_SERVICE_TIME_MIN = 5;
const DEFAULT_ACCESS_DIFFICULTY = 1;

// ─── Main Entry Point ───────────────────────────────────────────

/**
 * Optimize reading routes for a zone and billing period.
 *
 * Queries all tomas in the zone, partitions them into balanced workloads,
 * runs TSP on each partition, and persists the results as route_graphs,
 * route_nodes, and route_edges within a single transaction.
 */
export async function optimizeZoneRoutes(
  db: DrizzleDB,
  params: OptimizeZoneParams,
): Promise<OptimizedRouteSummary[]> {
  const {
    zoneId,
    tenantId,
    explotacionId,
    numCapturistas,
    maxReadingsPerRoute,
    shiftDurationMin = 480,
    optimizationMethod = 'tsp_2opt',
    zoneName = 'Zona',
  } = params;

  // ── Step 1: Query tomas in the zone with their meters ──────────
  const zoneTomas = await queryZoneTomas(db, zoneId, tenantId);

  if (zoneTomas.length === 0) {
    return [];
  }

  // ── Step 2: Map tomas to balancer nodes ────────────────────────
  const balancerNodes: BalancerNode[] = zoneTomas.map((t) => ({
    id: t.tomaId,
    lat: t.lat,
    lng: t.lng,
    accessDifficulty: t.accessible ? DEFAULT_ACCESS_DIFFICULTY : 3,
    avgServiceTimeMin: DEFAULT_SERVICE_TIME_MIN,
  }));

  // ── Step 3: Balance workload into partitions ───────────────────
  const balancerConfig: BalancerConfig = {
    numCapturistas,
    maxReadingsPerRoute,
    shiftDurationMin,
  };

  const partitions = balanceWorkload(balancerNodes, balancerConfig);

  if (partitions.length === 0) {
    return [];
  }

  // ── Step 4: TSP-optimize each partition + persist in transaction ─
  // Build a lookup from tomaId to meter info for node insertion
  const tomaLookup = new Map(zoneTomas.map((t) => [t.tomaId, t]));

  const results = await db.transaction(async (tx) => {
    const summaries: OptimizedRouteSummary[] = [];

    for (let i = 0; i < partitions.length; i++) {
      const partition = partitions[i];
      const routeNumber = i + 1;
      const routeName = `${zoneName} - Ruta ${routeNumber}`;

      // 4a. Map partition nodes to TSP nodes
      const tspNodes: TSPNode[] = partition.nodes.map((n) => ({
        id: n.id,
        lat: n.lat,
        lng: n.lng,
        accessDifficulty: n.accessDifficulty,
        avgServiceTimeMin: n.avgServiceTimeMin,
      }));

      // 4b. Solve TSP for this partition
      let orderedNodes: TSPNode[];
      if (optimizationMethod === 'manual') {
        orderedNodes = tspNodes; // keep original order
      } else {
        orderedNodes = solveTSP(
          tspNodes,
          optimizationMethod === 'tsp_nearest' ? 0 : undefined,
        );
      }

      // 4c. Compute tour cost for stats
      const tourCost = computeTourCost(orderedNodes);

      // 4d. Create route_graph record
      const [graph] = await tx
        .insert(routeGraphs)
        .values({
          tenantId,
          explotacionId,
          zoneId,
          name: routeName,
          status: 'draft',
          optimizationMethod,
          totalNodes: orderedNodes.length,
          totalDistanceM: String(tourCost.totalDistanceM),
          estimatedDurationMin: Math.ceil(tourCost.totalTimeMin),
        })
        .returning({ id: routeGraphs.id });

      const graphId = graph.id;

      // 4e. Insert route_nodes with optimized sequence_order
      const nodeInserts = orderedNodes.map((node, seq) => {
        const tomaInfo = tomaLookup.get(node.id);
        return {
          graphId,
          tomaId: node.id,
          meterId: tomaInfo?.meterId ?? null,
          location: sql`ST_SetSRID(ST_MakePoint(${node.lng}, ${node.lat}), 4326)`,
          accessDifficulty: node.accessDifficulty,
          avgServiceTimeMin: String(node.avgServiceTimeMin),
          sequenceOrder: seq + 1,
          isEntryPoint: seq === 0,
          isExitPoint: seq === orderedNodes.length - 1,
        };
      });

      const insertedNodes = await tx
        .insert(routeNodes)
        .values(nodeInserts)
        .returning({ id: routeNodes.id, sequenceOrder: routeNodes.sequenceOrder });

      // Sort inserted nodes by sequence order to align with orderedNodes
      insertedNodes.sort((a, b) => a.sequenceOrder - b.sequenceOrder);

      // 4f. Insert route_edges between consecutive nodes
      if (insertedNodes.length > 1) {
        const edgeInserts = [];
        for (let e = 0; e < insertedNodes.length - 1; e++) {
          const fromNode = orderedNodes[e];
          const toNode = orderedNodes[e + 1];
          const distanceM = haversineDistance(
            fromNode.lat,
            fromNode.lng,
            toNode.lat,
            toNode.lng,
          );
          const walkMin = distanceM / WALK_SPEED_M_PER_MIN;

          edgeInserts.push({
            graphId,
            fromNodeId: insertedNodes[e].id,
            toNodeId: insertedNodes[e + 1].id,
            distanceM: String(Math.round(distanceM * 100) / 100),
            estimatedWalkMin: String(Math.round(walkMin * 100) / 100),
            isOptimal: true,
          });
        }

        await tx.insert(routeEdges).values(edgeInserts);
      }

      summaries.push({
        graphId,
        name: routeName,
        totalNodes: orderedNodes.length,
        totalDistanceM: tourCost.totalDistanceM,
        estimatedDurationMin: Math.ceil(tourCost.totalTimeMin),
      });
    }

    return summaries;
  });

  return results;
}

// ─── Zone Tomas Query ───────────────────────────────────────────

/**
 * Query all tomas in a zone (sector hidraulico) that have valid coordinates.
 * Joins tomas → acometidas to resolve the zone relationship,
 * and tomas → meters for meter accessibility info.
 */
async function queryZoneTomas(
  db: DrizzleDB,
  zoneId: string,
  tenantId: string,
): Promise<ZoneToma[]> {
  const rows = await db.execute<{
    toma_id: string;
    meter_id: string | null;
    latitude: string | null;
    longitude: string | null;
    accessible: boolean | null;
  }>(
    sql`
      SELECT
        t.id AS toma_id,
        t.meter_id,
        t.latitude,
        t.longitude,
        m.accessible
      FROM ${tomas} t
      INNER JOIN ${acometidas} a ON a.id = t.acometida_id
      LEFT JOIN ${meters} m ON m.id = t.meter_id
      WHERE a.sector_id = ${zoneId}
        AND t.tenant_id = ${tenantId}
        AND t.status = 'activa'
        AND t.latitude IS NOT NULL
        AND t.longitude IS NOT NULL
    `,
  );

  return rows.map((row) => ({
    tomaId: row.toma_id,
    meterId: row.meter_id,
    lat: Number(row.latitude),
    lng: Number(row.longitude),
    accessible: row.accessible !== false,
  }));
}
