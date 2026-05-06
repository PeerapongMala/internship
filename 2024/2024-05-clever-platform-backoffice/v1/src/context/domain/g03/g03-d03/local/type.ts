export enum Status {
  IN_USE = 'enabled',
  DRAFT = 'draft',
  NOT_IN_USE = 'disabled',
}

export type RecordStatus = 'enabled' | 'draft' | 'disabled';

export interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

export interface StudentGroup {
  id: number;
  class_id: number;
  study_group_name: string;
  subject_name: string | null;
  year: string;
  school_id: number;
  academic_year: number;
  room: number;
  student_count: number;
  avg_stars_earned: number;
  avg_max_possible_stars: number;
  avg_passed_levels: number;
  avg_all_levels: number;
  avg_play_time: number;
  avg_time_per_question: number;
  status: RecordStatus;
  total_count: number;
}

export interface SchoolHeader {
  school_id: number;
  school_name: string;
  school_code: string;
  shool_image_url: string | null;
}

export interface StudentGroupPlayLog {
  user_id: string;
  student_index: number;
  student_id: number;
  student_title: string;
  student_first_name: string;
  student_last_name: string;
  total_passed_level: {
    value: number;
    total: number;
  };
  total_score: {
    value: number;
    total: number;
  };
  total_attempt: number;
  average_time_used: number;
  lastest_login_at: string;
}
