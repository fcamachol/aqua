import { sql, type SQL } from 'drizzle-orm';

// ─── Pagination helpers ─────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parse pagination query params from an Express request query object.
 */
export function parsePagination(query: Record<string, unknown>): PaginationParams {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(query.limit) || DEFAULT_LIMIT));
  const sort = typeof query.sort === 'string' ? query.sort : 'created_at';
  const order = query.order === 'asc' ? 'asc' : 'desc';
  return { page, limit, sort, order };
}

/**
 * Build Drizzle offset/limit values from parsed params.
 */
export function paginationOffsetLimit(params: PaginationParams): { offset: number; limit: number } {
  return {
    offset: (params.page - 1) * params.limit,
    limit: params.limit,
  };
}

/**
 * Wrap rows + total count into a PaginatedResult envelope.
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams,
): PaginatedResult<T> {
  return {
    success: true,
    data,
    pagination: {
      page: params.page,
      pageSize: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}
