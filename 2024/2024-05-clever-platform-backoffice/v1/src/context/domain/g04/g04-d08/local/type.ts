export interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

export interface Curriculum {
  id: number;
  name?: string;
  short_name?: string;
  status?: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string | null;
  updated_by?: string | null;
}
