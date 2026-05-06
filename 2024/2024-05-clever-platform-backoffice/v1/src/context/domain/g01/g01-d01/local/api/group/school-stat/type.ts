// School

export interface AffiliationTabsOption {
  id: string;
  label: string;
  onClick: () => void;
}
export interface SchoolStatTableQuery {
  school_id?: number;
  school_code?: string;
  school_name?: string;
  inspection_area?: string;
  area_office?: string;
  school_affiliation_group?: string;
  district_group?: string;
  district?: string;
  province?: string;
  lao_district?: string;
  start_date?: string;
  end_date?: string;
}
export interface SchoolStatTableResponse {
  data: SchoolStatSchool[];
}

export interface SchoolStatFilter
  extends Pick<
    SchoolStatTableQuery,
    | 'school_affiliation_group'
    | 'inspection_area'
    | 'area_office'
    | 'start_date'
    | 'end_date'
    | 'district_group'
    | 'district'
    | 'province'
    | 'lao_district'
  > {
  search_value?: string;
  search_field?: string | number;
}

export interface SchoolStatSchool {
  school_id: number;
  school_code: string;
  school_name: string;
  class_count: number;
  student_count: number;
  average_passed_level: number | null;
  total_levels_count: number;
  average_score: number | null;
  total_score: number | null;
  play_count: number;
  average_time_used: number;
}

// Class
export interface SchoolStatClassTableQuery {
  class_id?: number;
  school_id: number;
  start_date?: string;
  end_date?: string;
}

export interface SchoolStatClassTableResponse {
  data: SchoolStatClass[];
}

export interface SchoolStatClass {
  academic_year: number;
  class_id?: number;
  class_year: string;
  class_name: string;
  student_count: number;
  average_passed_level: number | null;
  total_levels_count: number;
  average_score: number | null;
  total_score: number | null;
  play_count: number;
  average_time_used: number;
}

// Student
export interface SchoolStatStudentTableQuery {
  student_id?: number;
  class_id: number;
  start_date?: string;
  end_date?: string;
}

export interface SchoolStatStudentTableResponse {
  data: SchoolStatStudent[];
}

export interface SchoolStatStudent {
  user_id: string;
  student_id: string;
  title: string;
  first_name: string;
  last_name: string;
  passed_level_count: number;
  total_levels_count: number;
  score: number;
  total_score: number | null;
  play_count: number;
  average_time_used: number;
  last_login: string | null;
}

// Lesson
export interface SchoolStatLessonTableQuery {
  student_user_id: string;
  start_date?: string;
  end_date?: string;
  curriculum_group_id?: number;
  subject_id?: number;
  lesson_id?: number;
  class_id?: number;
}

export interface SchoolStatLessonTableResponse {
  data: SchoolStatLesson[];
}

export interface SchoolStatLesson {
  average_time_used: number;
  curriculum_group_short_name: string;
  last_login: string | null;
  lesson_id: number;
  lesson_index: number;
  lesson_name: string;
  passed_level_count: number;
  play_count: number;
  score: number;
  subject: string;
  total_level_count: number;
  total_score: number;
}

export interface LessonDropdownFilterQuery {
  student_user_id: string;
  curriculum_group_id?: string;
  subject_id?: string;
}

export interface LessonDropdownFilterResponse {
  data: CurriculumGroupDropdown[] | SubjectDropdown[] | LessonDropdown[];
}
export interface CurriculumGroupDropdown {
  id: number;
  name: string;
  short_name: string;
}
export interface SubjectDropdown {
  id: number;
  name: string;
}
export interface LessonDropdown {
  id: number;
  name: string;
}

export interface LessonStatFilter
  extends Pick<
    SchoolStatLessonTableQuery,
    'curriculum_group_id' | 'subject_id' | 'lesson_id'
  > {
  search_value?: string;
}

// SubLesson
export interface SchoolStatSubLessonTableQuery {
  student_user_id: string;
  start_date?: string;
  end_date?: string;
  lesson_id: number;
  sub_lesson_id?: number;
  class_id?: number;
}

export interface SchoolStatSubLessonTableResponse {
  data: SchoolStatLesson[];
}

export interface SchoolStatSubLesson {
  average_time_used: number;
  last_played: string;
  lesson_index: number;
  passed_level_count: number;
  play_count: number;
  score: number;
  sub_lesson_id: number;
  sub_lesson_index: number;
  sub_lesson_name: string;
  total_level_count: number;
  total_score: number;
}
export interface SubLessonStatFilter
  extends Pick<SchoolStatSubLessonTableQuery, 'sub_lesson_id'> {
  search_value?: string;
}
export interface SubLessonDropdownFilterQuery {
  student_user_id: string;
  lesson_id: number;
}
export interface SubLessonDropdownFilterResponse {
  data: SubLessonDropdown[];
}

export interface SubLessonDropdown {
  id: number;
  name: string;
}

// Level
export interface SchoolStatLevelTableQuery {
  student_user_id: string;
  start_date?: string;
  end_date?: string;
  sub_lesson_id: number;
  question_type?: 'multiple-choices' | 'pairing' | 'sorting' | 'placeholder' | 'input';
  difficulty?: 'easy' | 'medium' | 'hard';
  level_type?: string;
  academic_year?: number;
  class_id?: number;
}

export interface SchoolStatLevelTableResponse {
  data: SchoolStatLevel[];
}
export interface SchoolStatLevel {
  level_id: number;
  level_index: number;
  level_type: string;
  question_type: 'multiple-choices' | 'pairing' | 'sorting' | 'placeholder' | 'input';
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  total_score: number;
  play_count: number;
  average_time_used: number;
  last_played: Date;
}
export interface LevelStatFilter
  extends Pick<
    SchoolStatLevelTableQuery,
    'academic_year' | 'question_type' | 'difficulty'
  > {
  search_value?: string;
}
export interface AcademicYearDropdownFilterQuery {
  student_user_id: string;
}

// Play Log
export interface SchoolStatPlayLogTableQuery {
  student_user_id: string;
  start_date?: string;
  end_date?: string;
  level_id: number;
  academic_year?: number;
  play_index?: number;
  class_id?: number;
}

export interface SchoolStatPlayLogTableResponse {
  data: SchoolStatPlayLog[];
}
export interface SchoolStatPlayLog {
  play_index: number;
  id: number;
  score: number;
  average_time_used: number;
  played_at: Date;
  class_id?: number;
}
export interface PlayLogStatFilter
  extends Pick<SchoolStatPlayLogTableQuery, 'play_index' | 'academic_year'> {}

// GetLevel
export interface GetLevelQuery {
  list_questions?: boolean;
  level_id: number;
}
export interface GetLevelResponse {
  data: Level[];
}
interface LanguageInfo {
  subject_language_type: string;
  language: string;
  translations: string[];
}

interface SubCriteria {
  id: number;
  index: number;
  name: string;
  sub_criteria_topics: any[];
}

interface TagGroup {
  id: number;
  index: number;
  name: string;
  tags: any[];
}
interface Standard {
  learning_area_name: string;
  criteria_name: string;
  criteria_short_name: string;
  indicator_name: string;
  indicator_short_name: string;
}

interface Level {
  id: number;
  sub_lesson_id: number;
  index: number;
  bloom_type: number;
  question_type: 'multiple-choices' | 'pairing' | 'sorting' | 'placeholder' | 'input';
  level_type: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  lock_next_level: boolean;
  timer_type: string;
  timer_time: number;
  status: string;
  wizard_index: number;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  admin_login_as: string | null;
  question_count: number;
  language: LanguageInfo;
  sub_criteria: SubCriteria[];
  tag_groups: TagGroup[];
  standard: Standard;
  curriculum_group_id: number;
  curriculum_group_name: string;
  year_id: number;
  year_name: string;
  subject_group_id: number;
  subject_group_name: string;
  subject_id: number;
  subject_name: string;
  lesson_id: number;
  lesson_name: string;
  sub_lesson_name: string;
  questions: any[];
}

// GetPlayLog
export interface GetPlayLogQuery {
  play_log_id: number;
}

export interface GetPlayLogResponse {
  data: PlayLog[];
}

interface PlayLog {
  question_id: number;
  question_index: number;
  question_type: 'multiple-choices' | 'pairing' | 'sorting' | 'placeholder' | 'input';
  time_used: number;
  is_correct: boolean;
  answer: any[];
}
