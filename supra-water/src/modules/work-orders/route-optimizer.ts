import { db } from '../../config/database.js';

// =============================================================
// Route Optimizer — Simple geographic proximity ordering
// Uses PostGIS ST_Distance for distance calculation between
// work order locations. Returns ordered list with ETAs.
// =============================================================

interface WorkOrderLocation {
  order_id: string;
  lat: number;
  lng: number;
  address: string;
  order_type: string;
  priority: string;
  estimated_duration_minutes: number | null;
}

export interface OptimizedStop {
  order_id: string;
  sequence: number;
  lat: number;
  lng: number;
  address: string;
  order_type: string;
  priority: string;
  estimated_duration_minutes: number;
  distance_from_previous_km: number;
  estimated_travel_minutes: number;
  estimated_arrival_minutes: number;
}

export interface OptimizedRoute {
  technician_id: string;
  total_stops: number;
  total_distance_km: number;
  total_estimated_minutes: number;
  stops: OptimizedStop[];
}

// Average speed assumption for urban driving in Mexican cities (km/h)
const AVG_SPEED_KMH = 25;
const DEFAULT_DURATION_MINUTES = 30;

/**
 * Get optimized route for a technician's assigned work orders.
 * Uses a nearest-neighbor greedy algorithm sorting by geographic proximity.
 *
 * Starting point is the first work order with the highest priority,
 * then each subsequent stop is the nearest unvisited location.
 */
export async function getOptimizedRoute(
  tenantId: string,
  userId: string,
): Promise<OptimizedRoute> {
  // Fetch assigned pending/asignada work orders with their address coordinates
  const rows = await db.execute<WorkOrderLocation>({
    sql: `
      SELECT
        wo.id AS order_id,
        ST_Y(a.geom::geometry) AS lat,
        ST_X(a.geom::geometry) AS lng,
        COALESCE(a.street || ' ' || a.exterior_number || ', ' || a.colonia, 'Sin direccion') AS address,
        wo.order_type,
        wo.priority,
        wo.estimated_duration_minutes
      FROM work_orders wo
      JOIN addresses a ON wo.address_id = a.id
      WHERE wo.tenant_id = $1
        AND wo.assigned_to = $2
        AND wo.status IN ('asignada', 'en_ruta')
        AND wo.scheduled_date = CURRENT_DATE
        AND a.geom IS NOT NULL
      ORDER BY
        CASE wo.priority
          WHEN 'urgente' THEN 1
          WHEN 'alta' THEN 2
          WHEN 'normal' THEN 3
          WHEN 'baja' THEN 4
        END
    `,
    args: [tenantId, userId],
  });

  if (rows.length === 0) {
    return {
      technician_id: userId,
      total_stops: 0,
      total_distance_km: 0,
      total_estimated_minutes: 0,
      stops: [],
    };
  }

  const locations = rows as unknown as WorkOrderLocation[];

  // Nearest-neighbor greedy ordering
  const ordered = nearestNeighborSort(locations);

  // Build route with distance and time estimates
  let totalDistanceKm = 0;
  let cumulativeMinutes = 0;
  const stops: OptimizedStop[] = [];

  for (let i = 0; i < ordered.length; i++) {
    const loc = ordered[i];
    let distanceKm = 0;

    if (i > 0) {
      distanceKm = haversineDistance(
        ordered[i - 1].lat,
        ordered[i - 1].lng,
        loc.lat,
        loc.lng,
      );
    }

    const travelMinutes = (distanceKm / AVG_SPEED_KMH) * 60;
    cumulativeMinutes += travelMinutes;
    totalDistanceKm += distanceKm;

    const duration = loc.estimated_duration_minutes ?? DEFAULT_DURATION_MINUTES;

    stops.push({
      order_id: loc.order_id,
      sequence: i + 1,
      lat: loc.lat,
      lng: loc.lng,
      address: loc.address,
      order_type: loc.order_type,
      priority: loc.priority,
      estimated_duration_minutes: duration,
      distance_from_previous_km: Math.round(distanceKm * 100) / 100,
      estimated_travel_minutes: Math.round(travelMinutes),
      estimated_arrival_minutes: Math.round(cumulativeMinutes),
    });

    cumulativeMinutes += duration;
  }

  return {
    technician_id: userId,
    total_stops: stops.length,
    total_distance_km: Math.round(totalDistanceKm * 100) / 100,
    total_estimated_minutes: Math.round(cumulativeMinutes),
    stops,
  };
}

/**
 * Nearest-neighbor greedy sort.
 * Start from the first location (highest priority), then always pick
 * the closest unvisited location.
 */
function nearestNeighborSort(locations: WorkOrderLocation[]): WorkOrderLocation[] {
  if (locations.length <= 1) return [...locations];

  const remaining = [...locations];
  const result: WorkOrderLocation[] = [];

  // Start with the first one (highest priority from SQL ORDER BY)
  result.push(remaining.shift()!);

  while (remaining.length > 0) {
    const current = result[result.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = haversineDistance(
        current.lat,
        current.lng,
        remaining[i].lat,
        remaining[i].lng,
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    result.push(remaining.splice(nearestIdx, 1)[0]);
  }

  return result;
}

/**
 * Haversine formula to calculate distance between two lat/lng points in km.
 */
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
