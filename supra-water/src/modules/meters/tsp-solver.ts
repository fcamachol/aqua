// =============================================================
// TSP Solver — 2-opt Heuristic for Reading Route Optimization
//
// Builds an initial tour via nearest-neighbor, then iteratively
// improves it using 2-opt segment reversal. Edge weight factors
// in haversine distance, access difficulty, and service time.
// Handles up to 500 nodes efficiently.
// =============================================================

// ─── Types ──────────────────────────────────────────────────────

export interface TSPNode {
  id: string;
  lat: number;
  lng: number;
  accessDifficulty: number; // 1-5
  avgServiceTimeMin: number;
}

export interface TourCost {
  totalDistanceM: number;
  totalTimeMin: number;
}

// ─── Constants ──────────────────────────────────────────────────

const EARTH_RADIUS_M = 6_371_000; // Earth radius in meters
const DEFAULT_MAX_ITERATIONS = 1000;

// ─── Haversine Distance ─────────────────────────────────────────

/**
 * Calculate distance in meters between two lat/lng points
 * using the haversine formula.
 */
function haversineDistanceM(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_M * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// ─── Weight Function ────────────────────────────────────────────

/**
 * Compute the weighted cost of traveling from nodeA to nodeB.
 * weight = haversineDistance(A, B) + (B.accessDifficulty * 2) + B.avgServiceTimeMin
 *
 * The access difficulty and service time penalties are additive
 * so that harder-to-reach nodes are naturally deferred unless
 * geographically convenient.
 */
function weight(nodeA: TSPNode, nodeB: TSPNode): number {
  const dist = haversineDistanceM(nodeA.lat, nodeA.lng, nodeB.lat, nodeB.lng);
  return dist + nodeB.accessDifficulty * 2 + nodeB.avgServiceTimeMin;
}

// ─── Precomputed Weight Matrix ──────────────────────────────────

/**
 * Build an NxN weight matrix for fast lookup during 2-opt.
 * weightMatrix[i][j] = weight from nodes[i] to nodes[j].
 */
function buildWeightMatrix(nodes: TSPNode[]): number[][] {
  const n = nodes.length;
  const matrix: number[][] = new Array(n);
  for (let i = 0; i < n; i++) {
    matrix[i] = new Array(n);
    matrix[i][i] = 0;
    for (let j = i + 1; j < n; j++) {
      const w = weight(nodes[i], nodes[j]);
      matrix[i][j] = w;
      matrix[j][i] = weight(nodes[j], nodes[i]);
    }
  }
  return matrix;
}

// ─── Nearest Neighbor Heuristic ─────────────────────────────────

/**
 * Build an initial tour by always visiting the nearest unvisited node.
 * Returns an array of indices into the original nodes array.
 */
function nearestNeighborTour(
  nodes: TSPNode[],
  weightMatrix: number[][],
): number[] {
  const n = nodes.length;
  const visited = new Uint8Array(n);
  const tour: number[] = [0];
  visited[0] = 1;

  for (let step = 1; step < n; step++) {
    const current = tour[tour.length - 1];
    let nearestIdx = -1;
    let nearestWeight = Infinity;

    for (let j = 0; j < n; j++) {
      if (!visited[j] && weightMatrix[current][j] < nearestWeight) {
        nearestWeight = weightMatrix[current][j];
        nearestIdx = j;
      }
    }

    tour.push(nearestIdx);
    visited[nearestIdx] = 1;
  }

  return tour;
}

// ─── 2-opt Improvement ──────────────────────────────────────────

/**
 * Iteratively reverse segments of the tour to reduce total weight.
 * Continues until no improvement is found or maxIterations is reached.
 *
 * The 2-opt move reverses the sub-tour between indices i and k.
 * A swap is accepted if it reduces the total tour cost.
 */
function twoOptImprove(
  tour: number[],
  weightMatrix: number[][],
  maxIterations: number,
): number[] {
  const n = tour.length;
  if (n < 4) return tour;

  let improved = true;
  let iterations = 0;
  let bestTour = tour.slice();

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 0; i < n - 2; i++) {
      for (let k = i + 2; k < n; k++) {
        // Current edges: (i, i+1) and (k, k+1 or wrap)
        const a = bestTour[i];
        const b = bestTour[i + 1];
        const c = bestTour[k];
        const d = k + 1 < n ? bestTour[k + 1] : bestTour[0];

        const currentCost =
          weightMatrix[a][b] + weightMatrix[c][d];
        const newCost =
          weightMatrix[a][c] + weightMatrix[b][d];

        if (newCost < currentCost - 1e-10) {
          // Reverse the segment between i+1 and k
          reverseSegment(bestTour, i + 1, k);
          improved = true;
        }
      }
    }
  }

  return bestTour;
}

/**
 * Reverse the portion of the array between indices start and end (inclusive).
 */
function reverseSegment(arr: number[], start: number, end: number): void {
  let left = start;
  let right = end;
  while (left < right) {
    const tmp = arr[left];
    arr[left] = arr[right];
    arr[right] = tmp;
    left++;
    right--;
  }
}

// ─── Tour Cost Calculation ──────────────────────────────────────

/**
 * Compute the total distance (meters) and estimated time (minutes)
 * for visiting nodes in the given order.
 *
 * Distance is pure haversine (no penalties).
 * Time includes walk time (distance / 80m per min) plus service time at each stop.
 */
export function computeTourCost(nodes: TSPNode[]): TourCost {
  if (nodes.length === 0) {
    return { totalDistanceM: 0, totalTimeMin: 0 };
  }

  let totalDistanceM = 0;
  let totalTimeMin = 0;

  // Walking speed ~80 m/min (~4.8 km/h) for urban walking
  const walkSpeedMPerMin = 80;

  for (let i = 0; i < nodes.length; i++) {
    if (i > 0) {
      const dist = haversineDistanceM(
        nodes[i - 1].lat,
        nodes[i - 1].lng,
        nodes[i].lat,
        nodes[i].lng,
      );
      totalDistanceM += dist;
      totalTimeMin += dist / walkSpeedMPerMin;
    }
    totalTimeMin += nodes[i].avgServiceTimeMin;
  }

  return {
    totalDistanceM: Math.round(totalDistanceM * 100) / 100,
    totalTimeMin: Math.round(totalTimeMin * 100) / 100,
  };
}

// ─── Main TSP Solver ────────────────────────────────────────────

/**
 * Solve TSP for the given nodes using nearest-neighbor + 2-opt.
 * Returns nodes reordered in optimized visit sequence.
 *
 * @param nodes - Array of stops with coordinates and metadata
 * @param maxIterations - Maximum 2-opt improvement iterations (default 1000)
 * @returns Nodes in optimized visit order
 */
export function solveTSP(
  nodes: TSPNode[],
  maxIterations: number = DEFAULT_MAX_ITERATIONS,
): TSPNode[] {
  if (nodes.length <= 2) return [...nodes];

  // Build weight matrix once for O(1) lookups
  const weightMatrix = buildWeightMatrix(nodes);

  // Phase 1: Nearest-neighbor greedy tour
  const initialTour = nearestNeighborTour(nodes, weightMatrix);

  // Phase 2: 2-opt local search improvement
  const optimizedTour = twoOptImprove(initialTour, weightMatrix, maxIterations);

  // Map indices back to nodes in optimized order
  return optimizedTour.map((idx) => nodes[idx]);
}
