import { sql } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { db } from '../../config/database.js';

// ─── Types ──────────────────────────────────────────────────────

/** Drizzle DB instance type used across the project. */
type DrizzleDB = PostgresJsDatabase;

/** A geographic coordinate pair. */
export interface LatLng {
  lat: number;
  lng: number;
}

/** A node with an ID and location, used for distance matrix computation. */
export interface NodeWithLocation {
  id: string;
  lat: number;
  lng: number;
}

/** Minimal route_node shape returned by spatial queries. */
export interface RouteNode {
  id: string;
  graphId: string;
  tomaId: string;
  meterId: string | null;
  lat: number;
  lng: number;
  accessDifficulty: number;
  avgServiceTimeMin: number;
  sequenceOrder: number;
  isEntryPoint: boolean;
  isExitPoint: boolean;
  notes: string | null;
  distanceM: number;
}

/** Provider interface for geocoding services (Google Maps, Nominatim, etc.). */
export interface GeocodingProvider {
  geocode(address: string): Promise<LatLng | null>;
}

// ─── Constants ──────────────────────────────────────────────────

const EARTH_RADIUS_M = 6_371_000;
const DEFAULT_RATE_LIMIT = 10; // requests per second
const DEFAULT_MAX_DISTANCE_M = 500;

// ─── Haversine Distance ─────────────────────────────────────────

/**
 * Compute the great-circle distance between two points on Earth in meters
 * using the Haversine formula.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const rLat1 = toRad(lat1);
  const rLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLng / 2) ** 2;

  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Distance Matrix ────────────────────────────────────────────

/**
 * Compute a symmetric 2D distance matrix in meters for the given nodes
 * using the Haversine formula. Pure TypeScript — no DB call required.
 *
 * Returns matrix[i][j] = distance in meters between nodes[i] and nodes[j].
 */
export function computeDistanceMatrix(nodes: NodeWithLocation[]): number[][] {
  const n = nodes.length;
  const matrix: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = haversineDistance(
        nodes[i].lat,
        nodes[i].lng,
        nodes[j].lat,
        nodes[j].lng,
      );
      matrix[i][j] = d;
      matrix[j][i] = d;
    }
  }

  return matrix;
}

/**
 * Compute a distance matrix using PostGIS ST_Distance on geography type
 * for higher accuracy on large distances. Requires the nodes to already
 * exist as route_nodes in the database.
 */
export async function computeDistanceMatrixDB(
  database: DrizzleDB,
  nodeIds: string[],
): Promise<number[][]> {
  if (nodeIds.length === 0) return [];

  const rows = await database.execute<{ from_id: string; to_id: string; distance_m: number }>(
    sql`
      SELECT
        a.id AS from_id,
        b.id AS to_id,
        ST_Distance(a.location::geography, b.location::geography) AS distance_m
      FROM route_nodes a
      CROSS JOIN route_nodes b
      WHERE a.id = ANY(${nodeIds})
        AND b.id = ANY(${nodeIds})
        AND a.id < b.id
    `,
  );

  // Build index map for O(1) lookups
  const idxMap = new Map<string, number>();
  nodeIds.forEach((id, i) => idxMap.set(id, i));

  const n = nodeIds.length;
  const matrix: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));

  for (const row of rows) {
    const i = idxMap.get(row.from_id)!;
    const j = idxMap.get(row.to_id)!;
    const d = Number(row.distance_m);
    matrix[i][j] = d;
    matrix[j][i] = d;
  }

  return matrix;
}

// ─── Geocoding ──────────────────────────────────────────────────

/**
 * Batch geocode an array of addresses to lat/lng coordinates.
 *
 * Uses the provided GeocodingProvider and applies rate limiting
 * to avoid overwhelming the upstream service.
 *
 * @param addresses  — Array of address strings to geocode
 * @param provider   — Geocoding service implementing the GeocodingProvider interface
 * @param rateLimit  — Maximum requests per second (defaults to 10)
 */
export async function geocodeAddresses(
  addresses: string[],
  provider: GeocodingProvider,
  rateLimit: number = DEFAULT_RATE_LIMIT,
): Promise<(LatLng | null)[]> {
  const results: (LatLng | null)[] = [];
  const intervalMs = 1000 / rateLimit;

  for (let i = 0; i < addresses.length; i++) {
    const start = Date.now();

    try {
      const result = await provider.geocode(addresses[i]);
      results.push(result);
    } catch {
      results.push(null);
    }

    // Rate-limit: wait for the remainder of the interval before next request
    if (i < addresses.length - 1) {
      const elapsed = Date.now() - start;
      const wait = intervalMs - elapsed;
      if (wait > 0) {
        await sleep(wait);
      }
    }
  }

  return results;
}

// ─── Nearest Node ───────────────────────────────────────────────

/**
 * Find the closest route_node to a given point within a route graph,
 * using PostGIS ST_DWithin for efficient index-backed spatial search.
 *
 * @param database     — Drizzle DB instance
 * @param point        — The reference point (lat/lng)
 * @param graphId      — The route_graph to search within
 * @param maxDistanceM — Search radius in meters (default 500)
 */
export async function findNearestNode(
  database: DrizzleDB,
  point: LatLng,
  graphId: string,
  maxDistanceM: number = DEFAULT_MAX_DISTANCE_M,
): Promise<RouteNode | null> {
  const rows = await database.execute<{
    id: string;
    graph_id: string;
    toma_id: string;
    meter_id: string | null;
    lat: number;
    lng: number;
    access_difficulty: number;
    avg_service_time_min: number;
    sequence_order: number;
    is_entry_point: boolean;
    is_exit_point: boolean;
    notes: string | null;
    distance_m: number;
  }>(
    sql`
      SELECT
        id,
        graph_id,
        toma_id,
        meter_id,
        ST_Y(location) AS lat,
        ST_X(location) AS lng,
        access_difficulty,
        avg_service_time_min,
        sequence_order,
        is_entry_point,
        is_exit_point,
        notes,
        ST_Distance(location::geography, ST_SetSRID(ST_MakePoint(${point.lng}, ${point.lat}), 4326)::geography) AS distance_m
      FROM route_nodes
      WHERE graph_id = ${graphId}
        AND ST_DWithin(
          location::geography,
          ST_SetSRID(ST_MakePoint(${point.lng}, ${point.lat}), 4326)::geography,
          ${maxDistanceM}
        )
      ORDER BY distance_m ASC
      LIMIT 1
    `,
  );

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    graphId: row.graph_id,
    tomaId: row.toma_id,
    meterId: row.meter_id,
    lat: Number(row.lat),
    lng: Number(row.lng),
    accessDifficulty: Number(row.access_difficulty),
    avgServiceTimeMin: Number(row.avg_service_time_min),
    sequenceOrder: Number(row.sequence_order),
    isEntryPoint: Boolean(row.is_entry_point),
    isExitPoint: Boolean(row.is_exit_point),
    notes: row.notes,
    distanceM: Number(row.distance_m),
  };
}

// ─── Path Distance ──────────────────────────────────────────────

/**
 * Compute the total distance of an ordered path through the given node IDs
 * using PostGIS ST_MakeLine + ST_Length on geography.
 *
 * The nodes are connected in the order specified by nodeIds, and the total
 * length of the resulting LineString is returned in meters.
 *
 * @param database — Drizzle DB instance
 * @param nodeIds  — Ordered array of route_node UUIDs defining the path
 */
export async function computePathDistance(
  database: DrizzleDB,
  nodeIds: string[],
): Promise<number> {
  if (nodeIds.length < 2) return 0;

  const rows = await database.execute<{ total_distance_m: number }>(
    sql`
      WITH ordered_nodes AS (
        SELECT
          rn.location,
          ord.seq
        FROM unnest(${nodeIds}::uuid[]) WITH ORDINALITY AS ord(node_id, seq)
        JOIN route_nodes rn ON rn.id = ord.node_id
        ORDER BY ord.seq
      )
      SELECT ST_Length(
        ST_MakeLine(array_agg(location ORDER BY seq))::geography
      ) AS total_distance_m
      FROM ordered_nodes
    `,
  );

  if (rows.length === 0) return 0;
  return Number(rows[0].total_distance_m);
}

// ─── Helpers ────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
