import { LevelTypeValueTH } from '@domain/g06/local/constant/level';
import { TContentIndicatorSetting } from '@domain/g06/local/types/content';

export type TGetSheetDataOptions = {
  version?: string;
  indicator_id?: number;
  no_student_lesson_score?: boolean;
};

export type TEvaluationFormSettingGetScoreReq = {
  sheet_id: number;
  student_id: number;
  indicator_id: number;
  school_id: number;
  setting: Pick<TContentIndicatorSetting, 'id' | 'weight'>[];
};

export type TEvaluationFormSettingGetScoreRes = {
  evaluation_student_id: number;
  evaluation_form_indicator_id: number;
  level_type: LevelTypeValueTH;
  score: number;
  max_score: number;
};
