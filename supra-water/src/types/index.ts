import type { Request } from 'express';

// JWT payload attached to authenticated requests
export interface JwtPayload {
  userId: string;
  tenantId: string;
  role: UserRole;
  email: string;
}

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'operator'
  | 'field_tech'
  | 'cashier'
  | 'reader'
  | 'customer'
  | 'agent';

// Express request with auth context
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
  tenantId: string;
  correlationId: string;
}

// Standard API response envelope
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
}

// Paginated response envelope
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Structured API error
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    correlationId: string;
  };
}
