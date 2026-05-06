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
  WAITING = 'waiting',
  EDITING = 'editing',
  SUCCESS = 'success',
  CLOSING = 'closing',
}
export enum CouponStatus {
  WAITING = 'waiting',
  PUBLISH = 'published',
  EXPIRE = 'expired',
  DISABLED = 'disabled',
}
export enum UsedCouponStatus {
  USED = 'used',
  RECALL = 'recall',
}

export interface BugReport {
  id: string;
  date_report: string;
  platform_name: string;
  category: string;
  report_name: string;
  device_id: string;
  version: string;
  report_by?: string;
  job_position: string;
  priority: string;
  status: BugReportStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string | null;
  updated_by?: string | null;
}

export type Redeem = {
  id: number;
  started_at?: string;
  ended_at: string;
  code: string;
  total_coupon?: string;
  date_remaining: string;
  show_status: CouponStatus;
  status: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string | null;
  updated_by?: string | null;

  used_count?: number; // จำนวนคูปองที่ใช้
  initial_stock?: number | 'ไม่จำกัด'; // จำนวนคูปองที่เหลือ หรือ "ไม่จำกัด"
};

export type CouponID = {
  id: number;
  code: string;
  started_at: string;
  ended_at: string;
  initial_stock: number;
  stock: number;
  avatar_id: number | null;
  pet_id: number | null;
  gold_coin_amount: number;
  arcade_coin_amount: number;
  ice_amount: number;
  status: CouponStatus;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
};

export interface History {
  coupon_transaction_id: number;
  user_id: string;
  student_id: string;
  title: string;
  first_name: string;
  last_name: string;
  school_name: string;
  recalled_at: string | null;
  status: UsedCouponStatus;
  used_at: string;
}

export interface IChatConfig {
  chat_level: 'subject' | 'class' | 'group' | 'private';
  status: boolean;
}

export interface IBugReportProps {
  id: number;
  platform: string;
  type: string;
  version: string;
  priority: string;
  description: string;
  browser: string;
  os: string;
  url: string;
  status: string;
  created_at: string;
  created_by: string;
  role: string;
  images: string;
}

export interface IBugReportDetailProps {
  id: number;
  platform: string;
  type: string;
  version: string;
  priority: string;
  description: string;
  browser: string;
  os: string;
  url: string;
  status: string;
  created_at: string;
  created_by: string;
  creator_id: string;
  role: string;
  images: string[];
}

export interface IBugReportLogProps {
  id: number;
  bug_id: number;
  status: string;
  message: string;
  updated_at: string;
  updated_by: string;
  created_at: string;
  created_by: string;
}
export interface Pet {
  id: 1;
  model_id: string;
}

export interface Avatar {
  id: number;
  model_id: string;
  level: number;
}
