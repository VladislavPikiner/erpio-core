export interface UserSession {
  id: string;
  role: 'admin' | 'cashier' | 'customer';
  branchId: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
