export interface Subject {
  subject_id?: number;
  subject_name?: string;
}
export interface OverviewProp {
  overviewData?: OverviewStats | null;
  subjectData?: Subject[];
  selectedSubject?: number | null;
  lessonData?: FilterLubLesson[];
  selectedLesson?: number | null;

  onSubjectChange?: (id: number | null) => void;
  onStartDateChange?: (value: string | undefined) => void;
  onEndDateChange?: (value: string | undefined) => void;
  //date
  startDate?: string;
  endDate?: string;

  user_id?: number;
  class_id?: number | null;
  subject_id?: number | null;
}
export interface LevelStats {
  level_passed: number;
  level_failed: number;
  total_level: number;
  pass_percent: number;
  failed_percent: number;
}

export interface ScoreStats {
  score: number;
  total_score: number;
}

export interface TimeStats {
  average_test_time: number;
}

export interface PointStats {
  attemp_count: number;
}

export interface OverviewStats {
  level_stats: LevelStats;
  score_stats: ScoreStats;
  time_stats: TimeStats;
  point_stats: PointStats;
}

export interface Lesson {
  lesson_id: number;
  lesson_name: string;
  progress: number;
}
export interface SubLesson {
  sub_lesson_id: number;
  sub_lesson_name: string;
  progress: number;
}
export interface FilterLubLesson {
  lesson_id: number;
  lesson_name: string;
}
