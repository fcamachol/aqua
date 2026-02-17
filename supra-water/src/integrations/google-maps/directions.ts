// =============================================================
// Google Maps Directions API — SUPRA Water 2026 §5.2
// Work order route optimization for field technicians
// =============================================================

export interface GoogleMapsConfig {
  apiKey: string;
  baseUrl?: string;
  maxRetries?: number;
  timeoutMs?: number;
}

// ---- Types ----

export interface LatLng {
  lat: number;
  lng: number;
}

export interface WaypointInput {
  /** Unique ID for this stop (e.g. work order ID) */
  id: string;
  location: LatLng;
  label?: string;
}

export interface RouteRequest {
  /** Technician starting location */
  origin: LatLng;
  /** Final destination (often same as origin for round trips) */
  destination: LatLng;
  /** Work order locations to visit */
  waypoints: WaypointInput[];
  /** Let Google optimize waypoint order (default: true) */
  optimizeWaypoints?: boolean;
  /** Travel mode (default: driving) */
  travelMode?: 'driving' | 'walking' | 'bicycling';
  /** Departure time for traffic estimates (default: now) */
  departureTime?: Date;
}

export interface OptimizedRoute {
  /** Total distance in meters */
  totalDistanceMeters: number;
  /** Total duration in seconds */
  totalDurationSeconds: number;
  /** Total duration with traffic in seconds */
  totalDurationInTrafficSeconds?: number;
  /** Optimized order of waypoint IDs */
  waypointOrder: string[];
  /** Leg details between each stop */
  legs: RouteLeg[];
  /** Encoded polyline for the full route */
  overviewPolyline: string;
}

export interface RouteLeg {
  /** Waypoint ID for the destination of this leg */
  waypointId?: string;
  startAddress: string;
  endAddress: string;
  distanceMeters: number;
  durationSeconds: number;
  durationInTrafficSeconds?: number;
}

// ---- Distance Matrix ----

export interface DistanceMatrixRequest {
  origins: LatLng[];
  destinations: LatLng[];
  travelMode?: 'driving' | 'walking' | 'bicycling';
  departureTime?: Date;
}

export interface DistanceMatrixResult {
  rows: Array<{
    elements: Array<{
      status: 'OK' | 'NOT_FOUND' | 'ZERO_RESULTS';
      distanceMeters: number;
      durationSeconds: number;
      durationInTrafficSeconds?: number;
    }>;
  }>;
  originAddresses: string[];
  destinationAddresses: string[];
}

// ---- Client ----

export class GoogleMapsClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly maxRetries: number;
  private readonly timeoutMs: number;

  constructor(config: GoogleMapsConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl ?? 'https://maps.googleapis.com/maps/api';
    this.maxRetries = config.maxRetries ?? 3;
    this.timeoutMs = config.timeoutMs ?? 15_000;
  }

  /**
   * Calculate an optimized route through multiple work order locations.
   */
  async getOptimizedRoute(req: RouteRequest): Promise<OptimizedRoute> {
    const params = new URLSearchParams({
      origin: `${req.origin.lat},${req.origin.lng}`,
      destination: `${req.destination.lat},${req.destination.lng}`,
      key: this.apiKey,
      mode: req.travelMode ?? 'driving',
      language: 'es',
      region: 'mx',
    });

    if (req.waypoints.length > 0) {
      const prefix = (req.optimizeWaypoints !== false) ? 'optimize:true|' : '';
      const waypointStr = req.waypoints
        .map((w) => `${w.location.lat},${w.location.lng}`)
        .join('|');
      params.set('waypoints', prefix + waypointStr);
    }

    if (req.departureTime) {
      params.set('departure_time', String(Math.floor(req.departureTime.getTime() / 1000)));
    } else {
      params.set('departure_time', 'now');
    }

    const data = await this.request<GoogleDirectionsResponse>(
      `/directions/json?${params.toString()}`,
    );

    if (data.status !== 'OK' || !data.routes.length) {
      throw new Error(`Google Directions API error: ${data.status} — ${data.error_message ?? 'No routes found'}`);
    }

    const route = data.routes[0];
    const waypointOrder = (route.waypoint_order ?? []).map(
      (idx: number) => req.waypoints[idx].id,
    );

    const legs: RouteLeg[] = route.legs.map((leg: GoogleLeg, i: number) => ({
      waypointId: i < waypointOrder.length ? waypointOrder[i] : undefined,
      startAddress: leg.start_address,
      endAddress: leg.end_address,
      distanceMeters: leg.distance.value,
      durationSeconds: leg.duration.value,
      durationInTrafficSeconds: leg.duration_in_traffic?.value,
    }));

    const totalDistanceMeters = legs.reduce((sum, l) => sum + l.distanceMeters, 0);
    const totalDurationSeconds = legs.reduce((sum, l) => sum + l.durationSeconds, 0);
    const totalDurationInTraffic = legs.every((l) => l.durationInTrafficSeconds != null)
      ? legs.reduce((sum, l) => sum + (l.durationInTrafficSeconds ?? 0), 0)
      : undefined;

    return {
      totalDistanceMeters,
      totalDurationSeconds,
      totalDurationInTrafficSeconds: totalDurationInTraffic,
      waypointOrder,
      legs,
      overviewPolyline: route.overview_polyline.points,
    };
  }

  /**
   * Get a distance/time matrix between multiple origins and destinations.
   */
  async getDistanceMatrix(req: DistanceMatrixRequest): Promise<DistanceMatrixResult> {
    const params = new URLSearchParams({
      origins: req.origins.map((o) => `${o.lat},${o.lng}`).join('|'),
      destinations: req.destinations.map((d) => `${d.lat},${d.lng}`).join('|'),
      key: this.apiKey,
      mode: req.travelMode ?? 'driving',
      language: 'es',
      region: 'mx',
    });

    if (req.departureTime) {
      params.set('departure_time', String(Math.floor(req.departureTime.getTime() / 1000)));
    } else {
      params.set('departure_time', 'now');
    }

    const data = await this.request<GoogleDistanceMatrixResponse>(
      `/distancematrix/json?${params.toString()}`,
    );

    if (data.status !== 'OK') {
      throw new Error(`Distance Matrix API error: ${data.status} — ${data.error_message ?? ''}`);
    }

    return {
      rows: data.rows.map((row) => ({
        elements: row.elements.map((el) => ({
          status: el.status as 'OK' | 'NOT_FOUND' | 'ZERO_RESULTS',
          distanceMeters: el.distance?.value ?? 0,
          durationSeconds: el.duration?.value ?? 0,
          durationInTrafficSeconds: el.duration_in_traffic?.value,
        })),
      })),
      originAddresses: data.origin_addresses,
      destinationAddresses: data.destination_addresses,
    };
  }

  // ---- Internal ----

  private async request<T>(path: string): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 10_000);
        await new Promise((r) => setTimeout(r, delay + Math.random() * delay * 0.1));
        console.log(`[google-maps] Retry ${attempt}/${this.maxRetries} for ${path.split('?')[0]}`);
      }

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);

        const url = `${this.baseUrl}${path}`;
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);

        const json = await response.json() as Record<string, unknown>;

        console.log(
          `[google-maps] GET ${path.split('?')[0]} -> ${response.status}`,
        );

        if (!response.ok) {
          if (response.status === 429 || response.status >= 500) {
            lastError = new Error(`Google Maps ${response.status}: ${JSON.stringify(json)}`);
            continue;
          }
          throw new Error(`Google Maps API error ${response.status}: ${JSON.stringify(json)}`);
        }

        return json as T;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (lastError.name === 'AbortError') {
          lastError = new Error(`Google Maps request timed out after ${this.timeoutMs}ms`);
          continue;
        }
        if (lastError.message.includes('Google Maps API error')) throw lastError;
        continue;
      }
    }

    throw lastError ?? new Error('Google Maps request failed after all retries');
  }
}

// ---- Google API Response Types (internal) ----

interface GoogleDirectionsResponse {
  status: string;
  error_message?: string;
  routes: Array<{
    waypoint_order: number[];
    legs: GoogleLeg[];
    overview_polyline: { points: string };
  }>;
}

interface GoogleLeg {
  start_address: string;
  end_address: string;
  distance: { value: number; text: string };
  duration: { value: number; text: string };
  duration_in_traffic?: { value: number; text: string };
}

interface GoogleDistanceMatrixResponse {
  status: string;
  error_message?: string;
  origin_addresses: string[];
  destination_addresses: string[];
  rows: Array<{
    elements: Array<{
      status: string;
      distance?: { value: number; text: string };
      duration?: { value: number; text: string };
      duration_in_traffic?: { value: number; text: string };
    }>;
  }>;
}
