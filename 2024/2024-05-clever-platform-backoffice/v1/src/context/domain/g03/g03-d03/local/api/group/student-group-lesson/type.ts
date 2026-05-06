export interface LessonStatList {
  index: number;
  level_index: number;
  level_type: 'test' | 'sub-lesson-post-test' | 'pre-post-test';
  level_question_type:
    | 'multiple-choices'
    | 'pairing'
    | 'sorting'
    | 'placeholder'
    | 'input';
  level_difficulty: 'easy' | 'medium' | 'hard';
  avg_score_per_level: {
    score: number;
    total: number;
  };
  total_attempt: number;
  average_time_used: number;
}

export interface ParamsLessonStat {
  academic_year: number;
  start_date?: string;
  end_date?: string;
  search?: string;
  lesson_id?: string;
  sub_lesson_id?: string;
  page?: number;
  limit?: number;
}

export interface LessonOptions {
  id: string;
  index: string;
  label: string;
  status: string;
}
