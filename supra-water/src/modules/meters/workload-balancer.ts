// =============================================================
// Workload Balancer — Geographic clustering + workload equalization
// Partitions meter-reading nodes into balanced routes using k-means
// geographic clustering, then refines partitions so each capturista
// has roughly equal total work time.
// =============================================================

export interface BalancerNode {
  id: string;
  lat: number;
  lng: number;
  accessDifficulty: number;
  avgServiceTimeMin: number;
}

export interface BalancerConfig {
  numCapturistas: number;
  maxReadingsPerRoute: number;
  shiftDurationMin: number; // default 480 (8 hours)
}

export interface NodePartition {
  partitionIndex: number;
  nodes: BalancerNode[];
  totalEstimatedMin: number;
  totalNodes: number;
}

// Walking speed for travel time estimates (km/h)
const WALKING_SPEED_KMH = 5;
const KMEANS_MAX_ITERATIONS = 100;
const REFINEMENT_MAX_ITERATIONS = 50;
const WORKLOAD_RATIO_THRESHOLD = 1.15;

/**
 * Main entry point. Clusters nodes geographically, balances workload
 * across partitions, and enforces capacity/duration constraints.
 */
export function balanceWorkload(
  nodes: BalancerNode[],
  config: BalancerConfig,
): NodePartition[] {
  if (nodes.length === 0) {
    return [];
  }

  const k = Math.min(config.numCapturistas, nodes.length);

  // Step 1: K-means geographic clustering
  let assignments = kmeansCluster(nodes, k);

  // Step 2: Refinement pass — swap border nodes to equalize workload
  assignments = refinePartitions(nodes, assignments, k);

  // Step 3: Build partitions from assignments
  let partitions = buildPartitions(nodes, assignments, k);

  // Step 4: Enforce maxReadingsPerRoute constraint (split overloaded partitions)
  partitions = enforceMaxReadings(partitions, config.maxReadingsPerRoute);

  // Step 5: Enforce shiftDurationMin constraint (move excess nodes)
  partitions = enforceShiftDuration(partitions, config.shiftDurationMin);

  return partitions;
}

// -----------------------------------------------------------------
// K-means geographic clustering
// -----------------------------------------------------------------

function kmeansCluster(nodes: BalancerNode[], k: number): number[] {
  // Initialize centroids using k-means++ seeding
  const centroids = initCentroidsKMeansPP(nodes, k);
  let assignments = new Array<number>(nodes.length).fill(0);

  for (let iter = 0; iter < KMEANS_MAX_ITERATIONS; iter++) {
    // Assign each node to the nearest centroid
    const newAssignments = nodes.map((node) => {
      let bestCluster = 0;
      let bestDist = Infinity;
      for (let c = 0; c < k; c++) {
        const dist = squaredEuclidean(
          node.lat,
          node.lng,
          centroids[c].lat,
          centroids[c].lng,
        );
        if (dist < bestDist) {
          bestDist = dist;
          bestCluster = c;
        }
      }
      return bestCluster;
    });

    // Check for convergence
    let changed = false;
    for (let i = 0; i < nodes.length; i++) {
      if (newAssignments[i] !== assignments[i]) {
        changed = true;
        break;
      }
    }
    assignments = newAssignments;

    if (!changed) break;

    // Recompute centroids
    for (let c = 0; c < k; c++) {
      let sumLat = 0;
      let sumLng = 0;
      let count = 0;
      for (let i = 0; i < nodes.length; i++) {
        if (assignments[i] === c) {
          sumLat += nodes[i].lat;
          sumLng += nodes[i].lng;
          count++;
        }
      }
      if (count > 0) {
        centroids[c] = { lat: sumLat / count, lng: sumLng / count };
      }
    }
  }

  return assignments;
}

/**
 * K-means++ initialization: pick first centroid uniformly at random,
 * then pick subsequent centroids weighted by squared distance to the
 * nearest existing centroid.
 */
function initCentroidsKMeansPP(
  nodes: BalancerNode[],
  k: number,
): { lat: number; lng: number }[] {
  const centroids: { lat: number; lng: number }[] = [];

  // Pick first centroid: use the geographic median approximation
  // (deterministic for reproducibility)
  const sortedByLat = [...nodes].sort((a, b) => a.lat - b.lat);
  const medianNode = sortedByLat[Math.floor(sortedByLat.length / 2)];
  centroids.push({ lat: medianNode.lat, lng: medianNode.lng });

  for (let c = 1; c < k; c++) {
    // Compute distance from each node to its nearest centroid
    const distances = nodes.map((node) => {
      let minDist = Infinity;
      for (const centroid of centroids) {
        const dist = squaredEuclidean(
          node.lat,
          node.lng,
          centroid.lat,
          centroid.lng,
        );
        if (dist < minDist) minDist = dist;
      }
      return minDist;
    });

    // Pick the node with the largest distance (deterministic farthest-first)
    let maxDist = -1;
    let maxIdx = 0;
    for (let i = 0; i < distances.length; i++) {
      if (distances[i] > maxDist) {
        maxDist = distances[i];
        maxIdx = i;
      }
    }

    centroids.push({ lat: nodes[maxIdx].lat, lng: nodes[maxIdx].lng });
  }

  return centroids;
}

// -----------------------------------------------------------------
// Workload refinement — swap border nodes between clusters
// -----------------------------------------------------------------

function refinePartitions(
  nodes: BalancerNode[],
  assignments: number[],
  k: number,
): number[] {
  const result = [...assignments];

  for (let iter = 0; iter < REFINEMENT_MAX_ITERATIONS; iter++) {
    const workloads = computeClusterWorkloads(nodes, result, k);
    const maxWorkload = Math.max(...workloads);
    const minWorkload = Math.min(...workloads.filter((w) => w > 0));

    if (minWorkload <= 0 || maxWorkload / minWorkload <= WORKLOAD_RATIO_THRESHOLD) {
      break;
    }

    // Find the heaviest and lightest clusters
    const heaviestCluster = workloads.indexOf(maxWorkload);
    const lightestCluster = workloads.indexOf(minWorkload);

    // Find border nodes in the heaviest cluster that are closest to the lightest
    const lightestCentroid = computeClusterCentroid(nodes, result, lightestCluster);
    let bestSwapIdx = -1;
    let bestSwapDist = Infinity;

    for (let i = 0; i < nodes.length; i++) {
      if (result[i] !== heaviestCluster) continue;

      const dist = haversineDistanceKm(
        nodes[i].lat,
        nodes[i].lng,
        lightestCentroid.lat,
        lightestCentroid.lng,
      );
      if (dist < bestSwapDist) {
        bestSwapDist = dist;
        bestSwapIdx = i;
      }
    }

    if (bestSwapIdx === -1) break;

    // Only swap if the heaviest cluster has more than 1 node
    const heaviestCount = result.filter((a) => a === heaviestCluster).length;
    if (heaviestCount <= 1) break;

    result[bestSwapIdx] = lightestCluster;
  }

  return result;
}

function computeClusterWorkloads(
  nodes: BalancerNode[],
  assignments: number[],
  k: number,
): number[] {
  const workloads = new Array<number>(k).fill(0);

  for (let c = 0; c < k; c++) {
    const clusterNodes = nodes.filter((_, i) => assignments[i] === c);
    workloads[c] = computePartitionWorkload(clusterNodes);
  }

  return workloads;
}

function computeClusterCentroid(
  nodes: BalancerNode[],
  assignments: number[],
  cluster: number,
): { lat: number; lng: number } {
  let sumLat = 0;
  let sumLng = 0;
  let count = 0;
  for (let i = 0; i < nodes.length; i++) {
    if (assignments[i] === cluster) {
      sumLat += nodes[i].lat;
      sumLng += nodes[i].lng;
      count++;
    }
  }
  return count > 0
    ? { lat: sumLat / count, lng: sumLng / count }
    : { lat: 0, lng: 0 };
}

// -----------------------------------------------------------------
// Partition building and constraint enforcement
// -----------------------------------------------------------------

function buildPartitions(
  nodes: BalancerNode[],
  assignments: number[],
  k: number,
): NodePartition[] {
  const partitions: NodePartition[] = [];

  for (let c = 0; c < k; c++) {
    const clusterNodes = nodes.filter((_, i) => assignments[i] === c);
    if (clusterNodes.length === 0) continue;

    partitions.push({
      partitionIndex: partitions.length,
      nodes: clusterNodes,
      totalEstimatedMin: computePartitionWorkload(clusterNodes),
      totalNodes: clusterNodes.length,
    });
  }

  return partitions;
}

/**
 * If any partition has more than maxReadingsPerRoute nodes, split it
 * into sub-partitions of at most maxReadingsPerRoute each.
 */
function enforceMaxReadings(
  partitions: NodePartition[],
  maxReadings: number,
): NodePartition[] {
  const result: NodePartition[] = [];

  for (const partition of partitions) {
    if (partition.totalNodes <= maxReadings) {
      result.push({ ...partition, partitionIndex: result.length });
      continue;
    }

    // Split oversized partition using k-means
    const numSplits = Math.ceil(partition.totalNodes / maxReadings);
    const subAssignments = kmeansCluster(partition.nodes, numSplits);

    for (let s = 0; s < numSplits; s++) {
      const subNodes = partition.nodes.filter((_, i) => subAssignments[i] === s);
      if (subNodes.length === 0) continue;

      result.push({
        partitionIndex: result.length,
        nodes: subNodes,
        totalEstimatedMin: computePartitionWorkload(subNodes),
        totalNodes: subNodes.length,
      });
    }
  }

  return result;
}

/**
 * If a partition's total estimated time exceeds shiftDurationMin,
 * move excess nodes (starting from the highest-workload nodes) to
 * the nearest under-capacity partition.
 */
function enforceShiftDuration(
  partitions: NodePartition[],
  shiftDurationMin: number,
): NodePartition[] {
  // Multiple passes until no partition exceeds the shift duration
  // or we run out of capacity everywhere
  for (let pass = 0; pass < 20; pass++) {
    let anyOverloaded = false;

    for (let p = 0; p < partitions.length; p++) {
      if (partitions[p].totalEstimatedMin <= shiftDurationMin) continue;
      anyOverloaded = true;

      // Sort nodes by individual workload descending (move heaviest first)
      const sortedNodes = [...partitions[p].nodes].sort(
        (a, b) => nodeWorkload(b) - nodeWorkload(a),
      );

      // Find nearest under-capacity partition
      const pCentroid = centroidOf(partitions[p].nodes);
      const targetIdx = findNearestUnderCapacityPartition(
        partitions,
        p,
        pCentroid,
        shiftDurationMin,
      );

      if (targetIdx === -1) {
        // No under-capacity partition found; cannot move nodes
        break;
      }

      // Move nodes one at a time until this partition is within budget
      while (
        partitions[p].totalEstimatedMin > shiftDurationMin &&
        sortedNodes.length > 1 // keep at least 1 node
      ) {
        const nodeToMove = sortedNodes.shift()!;
        const targetWorkload = nodeWorkload(nodeToMove);

        // Check that target can absorb this node
        if (
          partitions[targetIdx].totalEstimatedMin + targetWorkload >
          shiftDurationMin
        ) {
          // Try another target
          break;
        }

        // Move node
        partitions[p].nodes = partitions[p].nodes.filter(
          (n) => n.id !== nodeToMove.id,
        );
        partitions[p].totalNodes = partitions[p].nodes.length;
        partitions[p].totalEstimatedMin = computePartitionWorkload(
          partitions[p].nodes,
        );

        partitions[targetIdx].nodes.push(nodeToMove);
        partitions[targetIdx].totalNodes = partitions[targetIdx].nodes.length;
        partitions[targetIdx].totalEstimatedMin = computePartitionWorkload(
          partitions[targetIdx].nodes,
        );
      }
    }

    if (!anyOverloaded) break;
  }

  // Re-index partitions and filter empties
  return partitions
    .filter((p) => p.totalNodes > 0)
    .map((p, i) => ({ ...p, partitionIndex: i }));
}

function findNearestUnderCapacityPartition(
  partitions: NodePartition[],
  excludeIdx: number,
  fromCentroid: { lat: number; lng: number },
  shiftDurationMin: number,
): number {
  let bestIdx = -1;
  let bestDist = Infinity;

  for (let i = 0; i < partitions.length; i++) {
    if (i === excludeIdx) continue;
    if (partitions[i].totalEstimatedMin >= shiftDurationMin) continue;

    const targetCentroid = centroidOf(partitions[i].nodes);
    const dist = haversineDistanceKm(
      fromCentroid.lat,
      fromCentroid.lng,
      targetCentroid.lat,
      targetCentroid.lng,
    );
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  }

  return bestIdx;
}

// -----------------------------------------------------------------
// Workload computation helpers
// -----------------------------------------------------------------

/**
 * Per-node workload: service time + access difficulty penalty.
 */
function nodeWorkload(node: BalancerNode): number {
  return node.avgServiceTimeMin + node.accessDifficulty * 2;
}

/**
 * Total partition workload: sum of per-node workloads + estimated
 * walking time between nodes (nearest-neighbor order approximation).
 */
function computePartitionWorkload(nodes: BalancerNode[]): number {
  if (nodes.length === 0) return 0;

  // Sum of per-node service + access time
  let total = nodes.reduce((sum, n) => sum + nodeWorkload(n), 0);

  // Estimate walking time using nearest-neighbor ordering
  if (nodes.length > 1) {
    const ordered = nearestNeighborOrder(nodes);
    for (let i = 1; i < ordered.length; i++) {
      const distKm = haversineDistanceKm(
        ordered[i - 1].lat,
        ordered[i - 1].lng,
        ordered[i].lat,
        ordered[i].lng,
      );
      const walkMinutes = (distKm / WALKING_SPEED_KMH) * 60;
      total += walkMinutes;
    }
  }

  return total;
}

/**
 * Simple nearest-neighbor ordering for walk time estimation.
 */
function nearestNeighborOrder(nodes: BalancerNode[]): BalancerNode[] {
  if (nodes.length <= 1) return [...nodes];

  const remaining = [...nodes];
  const result: BalancerNode[] = [remaining.shift()!];

  while (remaining.length > 0) {
    const current = result[result.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = squaredEuclidean(
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

// -----------------------------------------------------------------
// Geo math utilities
// -----------------------------------------------------------------

function centroidOf(nodes: BalancerNode[]): { lat: number; lng: number } {
  if (nodes.length === 0) return { lat: 0, lng: 0 };
  const sumLat = nodes.reduce((s, n) => s + n.lat, 0);
  const sumLng = nodes.reduce((s, n) => s + n.lng, 0);
  return { lat: sumLat / nodes.length, lng: sumLng / nodes.length };
}

/**
 * Squared Euclidean distance on lat/lng — used only for k-means
 * assignment (relative comparison, no need for full haversine).
 */
function squaredEuclidean(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  return dLat * dLat + dLng * dLng;
}

/**
 * Haversine formula — returns distance in km between two lat/lng points.
 */
function haversineDistanceKm(
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
