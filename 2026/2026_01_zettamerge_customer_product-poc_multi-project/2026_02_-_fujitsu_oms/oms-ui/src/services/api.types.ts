export interface ServiceResult<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResult<T> extends ServiceResult<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

/** Simulated network delay (300-800ms) */
export function delay(ms?: number): Promise<void> {
  const duration = ms ?? Math.floor(Math.random() * 500) + 300;
  return new Promise((resolve) => setTimeout(resolve, duration));
}
