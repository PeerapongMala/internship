import { EEvaluationKey, EGradeTemplateType } from '@domain/g06/local/enums/evaluation';
import {
  TContentIndicator,
  TContentIndicatorSetting,
} from '@domain/g06/local/types/content';
import { TGeneralTemplateAdditionalData } from '@domain/g06/local/types/template';

export interface GradeTemplateRecord {
  id: number;
  year?: string;
  template_name?: string;
  version?: string;
  active_flag?: boolean;
  status?: EStatusTemplate;
  subject_count?: number;
}

export type Indicators = Omit<TContentIndicator, 'setting'> & {
  template_subject_id: number;
  indicator_name: string;
  setting?: Settings[];
};

export type Settings = Omit<TContentIndicatorSetting, 'evaluation_form_indicator_id'> & {
  indicator_id?: number | null;
  evaluation_key: EEvaluationKey | 'STAGE_LIST';
};

export interface SubjectContent {
  subject_id?: number;
  subject_name: string;
  indicator?: Indicators[];
}

export interface Subjects {
  id?: number;
  subject_name: string;
  is_clever: boolean;
  clever_subject_id?: number;
  clever_subject_template_id?: number | null;
  indicator: TContentIndicator[];
  subject_no: string | null;
  learning_area: string | null;
  hours: number | null;
  credits?: number | null;
  is_extra?: boolean | null;
}

export interface GradeTemplateContent {
  template: {
    id: number;
    school_id: number;
    year: string;
    template_name: string;
    active_flag: boolean;
    version?: string | null;
    status: EStatusTemplate;
  };
  subjects: Subjects[];
  general_templates: {
    template_id?: number;
    general_template_id?: number | null;
    template_type: string;
    template_name: string;
  }[];

  // id?: string | number;
  // school_id?: number;
  // year?: string;
  // template_name?: string;
  // active_flag?: boolean;
  // version?: string;
  // status?: useStatus;
  // created_at?: string;
  // created_by?: string;
  // updated_at?: string;
  // updated_by?: string;
  // admin_login_as?: null | string;
  // subjects?: Subjects[];
  // general_templates?: GeneralTemplates[];
}

export type TCreateGradeTemplateContent = Omit<GradeTemplateContent, 'template'> & {
  template: {
    school_id: number;
    year: string;
    template_name: string;
    active_flag: boolean;
    version?: string | null;
    status: EStatusTemplate;
  };
};

export interface Criteria {
  id?: number | string;
  indicator_id?: number;
  evaluation_key?: string;
  evaluation_topic?: string;
  value?: string;
  weight?: number;
}

export interface Indicator {
  indicator_id?: string | number;
  indicator_name?: string;
  total_weight?: number;
  score_evaluation_type?: string;
  data: Criteria[];
}

export interface GeneralTemplates {
  template_id: string;
  template_type: EGradeTemplateType;
  template_name: string;
  id?: string | number;
  school_id?: number;
  status?: EStatusTemplate;
  active_flag?: boolean;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  additional_data?: TGeneralTemplateAdditionalData;
}

export interface GeneralTemplateDropdown {
  template_type: string;
  template: GeneralTemplateDropdownItem[];
}
export type GeneralTemplateDropdownItem = {
  id: number;
  name: string;
  status: EStatusTemplate;
  active_flag: boolean;
};

export interface Year {
  id?: string | number;
  name: string;
  short_name?: string;
}

export enum EStatusTemplate {
  published = 'enabled',
  cancel = 'disabled',
  draft = 'draft',
}
