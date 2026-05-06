import { BasePaginationAPIQueryParams } from '@global/utils/apiResponseHelper';

export interface GetStudyGroupStatOptionsResponse {
  option_type: string;
  parent_key: string;
  values: {
    id: number;
    label: string;
    parent_id: number;
  }[];
}

export interface GetStudyGroupStatListRequest extends BasePaginationAPIQueryParams {
  academic_year?: number;
  subject_id?: string;
  lesson_id?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  sub_lesson_id?: string;
}

export interface GetStudyGroupStatListResponse {
  curriculum_group_short_name: string;
  subject_name: string;
  lesson_id: number;
  lesson_index: number;
  lesson_name: string;
  total_passed_level: {
    value: number;
    total: number;
  };
  total_score: {
    value: number;
    total: number;
  };
  average_time_used: number;
  average_total_attempt: number;
  last_played_at: string;
  level_group: {
    from: number;
    to: number;
  };
  sub_lesson_name: string;
  sub_lesson_id: number;
  sub_lesson_index: number;
  total_passed_sub_level: {
    value: number;
    total: number;
  };
  total_score_sub: {
    value: number;
    total: number;
  };
  average_time_used_sub: number;
  average_total_attempt_sub: number;
  last_played_at_sub: string;
  level_group_sub: {
    from: number;
    to: number;
  };
  level_index: number;
  level_type: string;
  question_type: string;
  difficulty: string;
  user_play_count: {
    value: number;
    total: number;
  };
  total_attempt: number;
  level_id: number;
}
