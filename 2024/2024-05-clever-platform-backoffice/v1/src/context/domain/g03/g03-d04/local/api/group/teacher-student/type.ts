import { TeacherNoteResponse } from '@domain/g01/g01-d04/local/type.ts';
import { BasePaginationAPIQueryParams } from '@global/utils/apiResponseHelper.ts';

export interface TeacherStudentResponse {
  id: number;
  student_id: string;
  student_title: string;
  student_first_name: string;
  student_last_name: string;
  student_last_login: string;
  class_id: number;
  class_year: string;
  class_name: string;
  academic_year: number;
  total_passed_star: number;
  total_passed_level: number;
  total_star: number;
  total_level: number;
  total_attempt: number;
  last_played: string;
  avg_time_used: string | null;
}

export interface TeacherStudentRequest {
  limit: number;
}

export interface TeacherStudentParamSearch {
  academic_year: number;
  year: string;
  class_name: string;
  search: string;
  curriculum_group_id: number;
  subject_id: number;
  lesson_id: number;
  sub_lesson_id: number;
}

export interface StudentStatRequest extends BasePaginationAPIQueryParams {
  academic_year?: string;
  class_name?: string;
  year?: string;
  search?: string;
  school_id?: number;
  class_id?: number;
  subject_id: number;
}

export interface StudentStatResponse {
  user_id: string;
  student_id: string;
  student_title: string;
  student_first_name: string;
  student_last_name: string;
  student_last_login: string | null;
  class_id: number;
  class_year: string;
  class_name: string;
  academic_year: number;
  total_passed_star: number;
  total_passed_level: number;
  total_star: number;
  total_level: number;
  total_attempt: number;
  last_played: string;
  avg_time_used: number | null;
}

export interface LessonStatResponse {
  class_id: number;
  academic_year: number;
  class_year: string;
  class_name: string;
  curriculum_group_short_name: string;
  subject_name: string;
  lesson_id: number;
  lesson_index: number;
  lesson_name: string;
  total_score: {
    value: number;
    total: number;
  };
  total_passed_level: {
    value: number;
    total: number;
  };
  average_time_used: number;
  total_attempt: number;
  last_played_at: string;
}

export interface StudyGroupListResponse {
  study_group_id: number;
  study_group_name: string;
}

export interface OptionsResponse {
  option_type: string;
  parent_key: string;
  values: {
    id: number;
    label: string;
    parent_id: number;
  }[];
}

export interface OptionShow {
  id: number;
  label: string;
}

export interface RewardListResponse {
  reward_id: number;
  item_id: number;
  item_type: string;
  item_image_url: string;
  item_name: string;
  description: string;
  amount: number;
  gived_by: string;
  received_at: string; // ISO
  used_at?: string | null; // Optional, can be null
}

export interface CommentOption {
  option_type: string;
  parent_key: string;
  values: {
    id: number;
    label: string;
    parent_id: number;
  }[];
}

export interface ParamsDownloadCsv {
  search?: string;
  start_date?: string;
  end_date?: string;
  curriculum_group_id?: string;
  lesson_id?: string;
  sub_lesson_id?: string;
  subject_id?: string;
  class_year?: string;
}

export interface ParamsTeacherStudent extends ParamsDownloadCsv {
  level_id?: string;
  seed_year?: string;
  academic_year?: string;
  text?: string;
  seed_year_id?: string;
  subject_id?: string;
  lesson_id?: string;
  sub_lesson_id?: string;
  class_year?: string;
  limit?: number;
  page?: number;
}

export interface ParamsTeacherStudentBySubLesson extends ParamsTeacherStudent {
  question_type?: string;
  difficulty?: string;
}

export type CommentListResponse = TeacherNoteResponse;

export interface CreateCommentRequest {
  student_id: string;
  level_id: number;
  text: string;
  academic_year: number;
  admin_login_as?: string;
}

export interface UpdateCommentRequest {
  text: string;
  admin_login_as?: string;
}

export interface SubLessonStatResponse {
  sub_lesson_id: number;
  index: number;
  sub_lesson_name: string;
  level_group: {
    from: number;
    to: number;
  };
  total_passed_level: {
    value: number;
    total: number;
  };
  total_score: {
    value: number;
    total: number;
  };
  average_time_used: number;
  total_attempt: number;
  last_played_at: string;
}

export interface LevelStatResponse {
  level_id: number;
  index: number;
  level_type: string;
  question_type: string;
  difficulty: string;
  total_score: {
    value: number;
    total: number;
  };
  average_time_used: number;
  total_attempt: number;
  last_played_at: string;
}

export interface LevelPlayLogResponse {
  play_log_id: number;
  play_sequence: number;
  score: number;
  max_score: number;
  average_time_used: number;
  played_at: string;
}
