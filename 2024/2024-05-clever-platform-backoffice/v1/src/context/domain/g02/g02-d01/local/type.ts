export enum LearningStatus {
  IN_USE = 'enabled',
  DRAFT = 'draft',
  NOT_IN_USE = 'disabled',
}

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
export interface Year {
  id: number;
  curriculum_group_id?: number | string;
  name?: string;
  seed_year_name: string;
  created_at?: string;
  created_by?: string;
  updated_at?: string | null;
  updated_by?: string | null;
}
export interface BulkEditItem {
  learning_area_id?: number;
  content_id?: number;
  criteria_id?: number;
  learning_content_id?: number;
  indicator_id?: number;
  sub_criteria_topic_id?: number;
  status: LearningStatus;
}

export interface BulkEdit {
  bulk_edit_list: BulkEditItem[];
  admin_login_as?: string;
}

export interface Learning {
  id?: string | number;
  curriculum_group_id?: number | string;
  curriculum_group_name?: string;
  year_id?: number;
  seed_year_id?: number;
  seed_year_name?: string;
  seed_year_short_name?: string;
  name: string;
  status?: LearningStatus;
  content?: Content[];
  standard?: Standard[];
  learningContent?: LearningContent[];
  indicator?: Indicator[];
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  admin_login_as?: null | string;
}
export interface Content {
  learning_area_id?: number;
  learning_area_name?: string;
  year_id?: number;
  id?: string | number;
  name?: string;
  seed_year_name?: string;
  status?: LearningStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  admin_login_as?: null | string;
}
export interface ICreateContent {
  learning_area_id?: number;
  name?: string;
  status?: LearningStatus;
}
export interface IUpdateContent {
  learning_area_id?: number;
  name?: string;
  seed_year_name?: string;
  status?: LearningStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  admin_login_as?: null | string;
}
export interface Standard {
  content_id?: number;
  id?: string | number;
  year_id?: number;
  name?: string;
  short_name?: string;
  learning_area_name?: string;
  content_name?: string;
  seed_year_name?: string;
  status?: LearningStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  admin_login_as?: null | string;
}
export interface ICreateStandard {
  content_id?: number;
  name?: string;
  short_name?: string;
  status?: LearningStatus;
}
export interface IUpdateStandard {
  id?: number | string;
  content_id?: number;
  name?: string;
  short_name?: string;
  status?: LearningStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  admin_login_as?: null | string;
}
export interface LearningContent {
  id?: string | number;
  criteria_id: number;
  learning_area_name?: string;
  seed_year_name?: string;
  content_name?: string;
  criteria_name?: string;
  criteria_short_name?: string;
  name: string;
  status?: LearningStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  admin_login_as?: null | string;
}
export interface ICreateLearningContent {
  criteria_id?: number;
  name?: string;
  status?: LearningStatus;
}
export interface IUpdateLearningContent {
  id?: string | number;
  criteria_id?: number;
  learning_area_name?: string;
  seed_year_name?: string;
  content_name?: string;
  criteria_name?: string;
  criteria_short_name?: string;
  name?: string;
  status?: LearningStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  admin_login_as?: null | string;
}
export interface Indicator {
  id?: string | number;
  criteria_id?: number;
  year_id?: number;
  learning_area_name?: string;
  seed_year_name?: string;
  content_name?: string;
  criteria_name?: string;
  criteria_short_name?: string;
  learning_content_id?: number;
  learning_content_name?: string;
  learning_content_short_name?: string;
  name: string;
  short_name: string;
  transcript_name: string;
  status?: LearningStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  admin_login_as?: null | string;
}

export interface ICreateIndicator {
  id?: string | number;
  criteria_id?: number;
  year_id?: number;
  learning_area_name?: string;
  seed_year_name?: string;
  content_name?: string;
  criteria_name?: string;
  criteria_short_name?: string;
  learning_content_id?: number;
  learning_content_name?: string;
  learning_content_short_name?: string;
  name?: string;
  short_name?: string;
  transcript_name?: string;
  status?: LearningStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  admin_login_as?: null | string;
}
export interface IUpdateIndicator {
  id?: string | number;
  criteria_id?: number;
  learning_area_name?: string;
  seed_year_name?: string;
  content_name?: string;
  criteria_name?: string;
  criteria_short_name?: string;
  learning_content_id?: number;
  learning_content_name?: string;
  name?: string;
  short_name?: string;
  transcript_name?: string;
  status?: LearningStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  admin_login_as?: null | string;
}

export interface SubStandard {
  id?: number;
  sub_criteria_id?: number;
  year_id?: number;
  criteria_id?: number;
  learning_area_name?: string;
  content_name?: string;
  criteria_name?: string;
  criteria_short_name?: string;
  learning_content_id?: number;
  learning_content_name?: string;
  indicator_id?: number;
  indicator_name: string;
  indicator_short_name: string;
  indicator_transcript_name: string;
  seed_year_name: string;
  short_name: string;
  name: string;
  status?: LearningStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  admin_login_as?: null | string;
}

export interface ICreateSubStandard {
  id?: number;
  sub_criteria_id?: number;
  indicator_id?: number;
  year_id?: number;
  seed_year_name?: string;
  short_name: string;
  name: string;
  status?: LearningStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  admin_login_as?: null | string;
}

export interface IUpdateSubStandard {
  id?: number;
  sub_criteria_id?: number;
  year_id?: number;
  criteria_id?: number;
  learning_area_name?: string;
  content_name?: string;
  criteria_name?: string;
  criteria_short_name?: string;
  learning_content_id?: number;
  learning_content_name?: string;
  indicator_id?: number;
  indicator_name?: string;
  indicator_short_name?: string;
  indicator_transcript_name?: string;
  seed_year_name?: string;
  short_name?: string;
  name?: string;
  status?: LearningStatus;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  admin_login_as?: null | string;
}

export interface IDownloadCsvFilter {
  start_date: string;
  end_date: string;
  curriculum_group_id?: number;
  sub_criteria_id?: number;
}

export interface IReport {
  id: number;
  sub_criteria_id: number;
  sub_criteria_name: string;
  indicator_id: number;
  indicator_name: string;
  indicator_short_name: string;
  indicator_transcript_name: string;
  learning_content_id: number;
  learning_content_name: string;
  criteria_id: number;
  criteria_name: string;
  criteria_short_name: string;
  content_id: number;
  content_name: string;
  learning_area_id: number;
  learning_area_name: string;
  year_id: number;
  seed_year_name: string;
  name: string;
  short_name: string;
  status: LearningStatus;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  admin_login_as: null | string;
}

export interface SubCriteria {
  admin_login_as: null;
  curriculum_group_id: number;
  id: number;
  index: number;
  name: string;
  updated_at: null;
  updated_by: null;
}
