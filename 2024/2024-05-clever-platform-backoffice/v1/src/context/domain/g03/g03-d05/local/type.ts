export enum Status {
  IN_USE = 'enabled',
  DRAFT = 'draft',
  NOT_IN_USE = 'disabled',
}
export enum StatusToggle {
  ON = 'on',
  OFF = 'off',
}
export enum Tier {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}
export interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

export interface Lesson {
  id: number;
  course: string;
  subject_name: string;
  seed_year_name: string;
  lesson_name: string;
  subject_id: string;
  is_enabled: boolean;
  updated_at?: string;
  updated_by?: string;
  is_extra: boolean;
}
export interface SubLesson {
  id: number;
  curriculum_group_short_name: string;
  subject: string;
  year: string;
  sublesson_name: string;
  is_enabled: boolean;
  is_enabled_level?: boolean;
  updated_at?: string;
  updated_by?: string;
}

export interface Level {
  id: number;
  level_index: number;
  level_type: 'test' | 'sub-lesson-post-test' | 'pre-post-test';
  question_type: 'multiple-choices' | 'pairing' | 'sorting' | 'placeholder' | 'input';
  difficulty: 'easy' | 'medium' | 'hard';
  question_amount: number;
}

export interface GroupUnlock {
  id: number;
  study_group_name: string;
  year: string;
  class: number;
  student_count: number;
}
export interface StudentUnlock {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  last_login: string | null;
}

export interface LevelPaginationResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: Level[];
}

export interface UnlockedGroup {
  id: string;
  study_group_name: string;
  year: string;
  class: string;
  student_count: number;
}

export interface UnlockedGroupPaginationResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: UnlockedGroup[];
}

export interface StudentUnlockPaginationResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: StudentUnlock[];
}

export interface ClassResponse {
  id: number;
  academic_year: string;
  year: string;
  name: string;
  updated_at: string | null;
  updated_by: string | null;
}

export interface ClassPaginationResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: ClassResponse[];
}

export interface StudentUnlockResponse {
  status_code: number;
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: StudentUnlock[];
  message: string;
}
