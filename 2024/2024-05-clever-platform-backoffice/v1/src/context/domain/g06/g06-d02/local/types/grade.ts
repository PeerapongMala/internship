import { Dayjs } from 'dayjs';
import {
  EEvaluationFormStatus,
  EEvaluationFormType,
  EEvaluationSheetStatus,
  EResponsibleTeacherType,
} from '../enums/evaluation';
import { EGradeTemplateType } from '@domain/g06/local/enums/evaluation';
import { TPagination } from '.';

export type TEvaluationForm = {
  id: number;
  school_id: number;
  template_id: number;
  template_name: string;
  academic_year: string;
  year: string;
  school_room: string;
  school_term?: string;
  is_lock: boolean | null;
  status: EEvaluationFormStatus;
  is_archived: boolean | null;
  ongoing_sheet_count: number;
  total_signed_sheet_count: number;
  created_at: Dayjs | null;
  created_by: string;
  updated_at: Dayjs | null;
  updated_by: string;
  wizard_index: number;
};

export type TEvaluationTemplate = {
  id: number;
  year: string;
  template_name: string;
  version: string;
  active_flag: string;
  status: string;
  subject_count: number;
};

export type TEvaluationFormEdit = Partial<TEvaluationForm>;
export type TEvaluationFormCreate = Omit<TEvaluationFormEdit, 'id'>;

export type TEvaluationFormGetListFilter = {
  search?: string;
  year?: string;
  status?: EEvaluationFormStatus;
  is_archived?: boolean;
};

export type TGradeResponsiblePerson = {
  id: number;
  type: EEvaluationFormType;
  name: string;
  clever_subject_id?: number;
  person_data: TResponsiblePersonData[];
};

export type TResponsiblePersonData = {
  user_type: EResponsibleTeacherType;
  user_id: string;
  email: string;
  title: string;
  first_name: string;
  last_name: string;
  teacher_roles: number;
};

export type TEvaluationFormFilledFilter = {
  status?: EEvaluationSheetStatus;
  evaluationTitle?: string;
  pagination: TPagination;
  filterSearchSelect?:
    | { type: 'only_subject' }
    | { type: 'general_type'; value: EGradeTemplateType }
    | undefined;
};

export type TEvaluationSheet = {
  id: number;
  form_id: number;
  value_type: number;
  evaluation_form_subject_id: number | null;
  evaluation_form_general_evaluation_id: number | null;
  is_lock: boolean;
  status: EEvaluationSheetStatus;
  school_id: number;
  academic_year: number | null;
  year: string | null;
  school_room: number | null;
  school_term: string | null;
  subject_name: string | null;
  general_type: EGradeTemplateType | null;
  general_name: string | null;
  created_at?: Dayjs | null;
  created_by?: string | null;
  updated_at?: Dayjs | null;
  updated_by?: string | null;
};
