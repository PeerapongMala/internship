import { EEvaluationKey, EScoreEvaluationType } from '../enums/evaluation';

export type TContentSubject = {
  id?: number;
  clever_subject_id?: number;
  clever_subject_template_id?: number | null;
  subject_name: string;
  is_clever: boolean;
  indicator: TContentIndicator[];
  subject_no?: string | null; // for g06-d01
  learning_area?: string | null; // for g06-d01
  hours?: number | null; // for g06-d01
  credits?: number | null;
  is_extra?: boolean | null;
};

export type TContentIndicator = {
  id?: number;
  evaluation_form_subject_id: number;
  name: string;
  max_value: number;
  sort: number;
  score_evaluation_type: EScoreEvaluationType;
  setting?: TContentIndicatorSetting[];
  clever_lesson_id?: number | null;
  clever_sub_lesson_id?: number | null;
  clever_subject_template_indicator_id?: number | null;
};

export type TContentIndicatorSetting = {
  id?: number; // undefined when want to removed
  evaluation_form_indicator_id?: number | null;
  evaluation_key: EEvaluationKey | 'STAGE_LIST';
  evaluation_topic: string;
  value: string; //'[1,2]' store like [level_id,level_id]
  weight: number;
  level_count: number;
};
