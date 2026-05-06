import { BasePaginationAPIQueryParams } from '@global/utils/apiResponseHelper';

export interface BaseDateCreated {
  created_by?: string | number | null;
  created_at?: string | number | null;
  updated_by?: string | number | null;
  updated_at?: string | number | null;
}

export interface BaseAnnouncementEntity extends BaseDateCreated {
  id: number;
  school_id: number;
  school_name: string;
  scope: string;
  type: string;
  title: string;
  image_url?: string | null;
  description: string;
  status: string;
  started_at: string;
  ended_at: string;
  admin_login_as: string | null;
  announcement_image?: File;
}

export interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

export interface AnnouncementListQueryParams extends BasePaginationAPIQueryParams {
  started_at?: string;
  ended_at?: string;
  title?: string;
}

export interface BulkEditRequest {
  id: number;
  status: string;
}

export interface CsvDownloadRequest {
  startDate: string;
  endDate: string;
}
