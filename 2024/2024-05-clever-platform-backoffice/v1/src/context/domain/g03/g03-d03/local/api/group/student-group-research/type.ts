export interface StudentGroupResearchQueryParams {
  start_date?: string;
  end_date?: string;
  search?: string;
  lesson_id?: string;
  sub_lesson_id?: string;
  level_id?: string;
}

export interface TTestPairModelStatListResponse {
  index: number;
  student_fullname: string;
  pre_test_score: number;
  post_test_score: number;
}

export interface TTestPairModelStatResponse {
  mean: {
    pre_test_score: number;
    post_test_score: number;
  };
  variance: {
    pre_test_score: number;
    post_test_score: number;
  };
  observations: {
    pre_test_score: number;
    post_test_score: number;
  };
  pearson_correlation: number;
  hypothesized_mean_difference: number;
  df: number;
  t_stat: number;
  p_one_tail: number;
  t_critical_one_tail: number;
  p_two_tail: number;
  t_critical_two_tail: number;
  TestScore: {
    n: {
      pre_test_score: number;
      post_test_score: number;
    };
    mean: {
      pre_test_score: number;
      post_test_score: number;
    };
    sd: {
      pre_test_score: number;
      post_test_score: number;
    };
    t: number;
    df: number;
    sig: number;
  };
}

export interface LessonResponse {
  id: number;
  index: number;
  label: string;
  status: string;
}
export interface SubLessonResponse {
  id: number;
  index: number;
  label: string;
  status: string;
}
export interface LevelResponse {
  id: number;
  index: number;
  level_type: string;
  question_type: string;
  status: string;
}

export interface DDRScoreResultResponse {
  student_id: string;
  student_title: string;
  student_first_name: string;
  student_last_name: string;
  question_data: {
    question_index: number;
    score: number;
  }[];
  score_sum: number;
}

export interface DDRSummaryResultResponse {
  sum_stat: {
    question_data: {
      question_index: number;
      score: number;
    }[];
    x: number;
    pow_x_sum: number;
  };
  hi_rank_correct_answer: {
    question_index: number;
    score: number;
  }[];
  low_rank_correct_answer: {
    question_index: number;
    score: number;
  }[];
  difficulty: {
    question_index: number;
    score: number;
  }[];
  b_index: {
    question_index: number;
    score: number;
  }[];
}
