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

export enum BugReportStatus {
  WAITING = 'pending',
  EDITING = 'in-progress',
  SUCCESS = 'resolved',
  CLOSING = 'closed',
}

export interface BugReport {
  id: number;
  platform: string;
  type: string;
  description: string;
  device_id: string;
  version: string;
  role: string;
  priority: string;
  status: string;
  image_url: string;
  created_at: string;
  created_by: string;
  updated_at?: string | null;
  updated_by?: string | null;
}
