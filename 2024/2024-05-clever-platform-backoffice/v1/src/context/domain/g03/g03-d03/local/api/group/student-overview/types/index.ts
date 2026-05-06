import { StudentGroupInfo } from '../../student-group-info/type';

export interface Student {
  student_id: string;
  name: string;
}
export interface Lesson {
  lesson_id: number;
  name: string;
}
export interface SubLesson {
  lesson_id: number;
  name: string;
}
export interface StudentOverview {
  level_stats: {
    level_passed: number;
    total_level: number;
  };
  score_stats: {
    average_score: number;
    total_score: number;
  };
  time_stats: {
    average_test_time: number;
    average_test_taken: number;
  };
}

export interface StudentLevel {
  total_level: number;
  level_passed: number;
  level_failed: number;
}
export interface TopStudent {
  student_id: string;
  name: string;
  score: number;
}
export interface LastStudentLogin {
  total_student: number;
  last_logged_in_student_count: number;
  last_logged_in_students: Student[];
}

export interface NotStudentLogin {
  total_student: number;
  not_participate_student_count: number;
  not_participate_students: Student[];
}

export interface DashboradProp {
  study_group_id?: string;
  lesson_ids?: number[] | null;
  sub_lesson_ids?: number[];
  start_at?: string;
  end_at?: string;

  studentGroup?: StudentGroupInfo;
  subject_name?: string;
  year_name?: string;
  lesson_name?: string;
  sub_lesson_name?: string;

  total_lesson?: number;
  total_sub_lesson?: number;

  onLevelTotalChange?: (number: number) => void;
  onLessonTotalChange?: (number: number) => void;
  onSubLessonTotalChange?: (number: number) => void;
}

export interface FlattenedNotStudentLogin extends NotStudentLogin {
  student_id: string;
  name: string;
  originalData: NotStudentLogin;
  index: number;
}
export interface FlattenedLastStudentLogin extends LastStudentLogin {
  student_id: string;
  name: string;
  originalData: NotStudentLogin;
  index: number;
}

export interface LessonProgress {
  scope: string;
  progress: number;
}
export interface SubLessonProgress {
  scope: string;
  progress: number;
}
