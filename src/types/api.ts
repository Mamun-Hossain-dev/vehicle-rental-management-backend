export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = never> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: PaginationMeta;
}
