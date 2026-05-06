export interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}
export interface ScoreMax {
  student_id: string;
  name: string;
  score: number;
}
export interface ScoreMin {
  student_id: string;
  name: string;
  score: number;
}
export interface DashboradProp {
  academicYearData?: Academicyear[];
  academicYear?: number | null;
  year?: string | null;
  classroom?: number[] | null;
  subject_id?: number[] | null;
  lesson_id?: number[] | null;
  lesson_name?: string;
  lessonOverview?: resLesson[] | null;
  start_at?: string | null;
  end_at?: string | null;
  // ลเขทั้งหมด
  homwwork_total?: number;
  level_total?: number;
  score_total?: number;
  point_total?: number;
  lesson_total?: number;
  sub_lesson_total?: number;
  // เลขที่ผ่าน
  level_total_pass?: number;
  score_total_pass?: number;
  point_total_pass?: number;

  onHomeworkTotalChange?: (total: number) => void;
  onLevelTotalChange?: (total: number) => void;
  onScoreTotalChange?: (total: number) => void;
  onPointTotalChange?: (total: number) => void;
  onLessonTotalChange?: (total: number) => void;
  onSubLessonTotalChange?: (total: number) => void;

  // set pass
  onLevelTotalPassChange?: (total: number) => void;
  onScoreTotalPassChange?: (total: number) => void;
  onPointTotalPassChange?: (total: number) => void;
}
export interface Academicyear {
  academic_year: number;
  start_date: string;
  end_date: string;
}
export interface Year<T = string> {
  year: T;
}
export interface Classroom {
  class_id: number;
  name: string;
}
export interface TotalStudent {
  student_count: number;
}

export interface BodyLatestHomwork {
  academic_year?: number;
  year?: string;
  class_ids?: number[];
  subject_ids?: number[];
  lesson_ids?: number[];
  limit?: number;
}

export interface LatestHomework {
  homework_name: string;
  homework_level_ids: number[];
  started_at: string;
  closed_at: string;
  due_at: string;
  not_start: number;
  in_progress: number;
  submitted: number;
  submitted_late: number;
  total_submission: number;
}
export interface Level {
  total_level: number;
  passed_level: number;
  failed_level: number;
}
export interface Score {
  total_score: number;
  student_score: number;
}

export interface questionOverview {
  total_question: number;
  total_level: number;
  level_submitted: number;
}

export interface bottomStudent {
  student_id: string;
  name: string;
  score: number;
}

export interface Subject {
  subject_id: number;
  name: string;
}
export interface Lesson {
  subject_id: number;
  lesson_id: number;
  name: string;
}

export interface resLesson {
  scope: string;
  progress: number;
}
export interface resSubLesson {
  scope: string;
  progress: number;
}

export interface ResHomework {
  total_homework: number;
  not_start: number;
  in_progress: number;
  done: number;
}
