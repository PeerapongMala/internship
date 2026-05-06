import { EStatus } from '@global/enums';
import { LevelType } from '../constant/level';
import { EScoreEvaluationType } from '../enums/evaluation';

export type TSubjectTemplate = {
  id: number;
  name: string;
  subject_id: number;
  subject_name: string;
  seed_year_id: number;
  seed_year_short_name: string;
  status: EStatus;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  wizard_index: number;
  indicators?: TSubjectTemplateIndicator[];
};

export type TSubjectTemplateIndicator = {
  id: number;
  subject_template_id: number;
  lesson_id: number;
  sub_lesson_id: number;
  name: string;
  type: EScoreEvaluationType;
  index: number;
  value: number;
  levels: TSubjectTemplateIndicatorLevel[];
};

export type TSubjectTemplateIndicatorLevel = {
  subject_template_indicator_id: number;
  level_type: LevelType;
  weight: number;
  levels: number[];
  level_count: number;
};
