import { EEvaluationSheetStatus } from '@domain/g06/g06-d02/local/enums/evaluation';
import { EScoreEvaluationType } from '@domain/g06/local/enums/evaluation';
import { EGradeStatus } from '@domain/g06/local/enums/grade';
import { TContentIndicatorSetting } from '@domain/g06/local/types/content';
import {
  TAdditionalFieldNutrition,
  TGeneralTemplateAdditionalData,
} from '@domain/g06/local/types/template';

export interface TPagination {
  page: number;
  limit: number;
  total_count: number;
}
export interface IAddNoteRequest {
  evaluation_sheet_id: number;
  note_value: string;
}

export interface IUpdateSheetRequest {
  id: number;
  start_edit_at: string;
  json_student_score_data: IJsonStudentScoreDaum[];
  status?: EEvaluationSheetStatus;
  additional_data?: Pick<TGeneralTemplateAdditionalData, 'hours' | 'nutrition'>;
}

export interface IGetHistoryCompare {
  version_left: IVersionDetail;
  version_right: IVersionDetail;
}

export interface IVersionDetail {
  id: number;
  sheet_id: number;
  version: string;
  is_lock: boolean;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  json_student_score_data: IJsonStudentScoreDaum[];
}

export interface IGetHistoryList {
  id: number;
  sheet_id: number;
  version: string;
  is_lock: boolean;
  status: string;
  updated_at: string;
  updated_by: string;
  user_id: string;
  email: string;
  title: string;
  first_name: string;
  last_name: string;
  user_access_name: null | string[];
  start_edit_at: string;
  end_edit_at: string;
  is_current_version: boolean;
}

export type IGetHistoryDropdown = Pick<IGetHistoryList, 'version' | 'updated_at'>;

export type THistorySubject = {
  subject_name: string;
  year: string;
  class_name: string;
};

export interface IGetNote {
  id: number;
  sheet_id: number;
  note_value: string;
  title: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export type ETypeTab =
  | 'คะแนนรายวิชา'
  | 'เวลาเรียน'
  | 'คุณลักษณะอันพึงประสงค์'
  | 'สมรรถนะ'
  | 'กิจกรรมพัฒนาผู้เรียน';

export interface IGetSheetDetail {
  id: number;
  sheet_id: number;
  version: string;
  is_lock: boolean;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  json_student_score_data: IJsonStudentScoreDaum[];
  student_lesson_score: TJsonStudentLessonScoreData[];
  student_list: IStudent[];
  subject_data: null | IGetSubjectData;
  sheet_data: null | IGetSheetData;
  additional_data: TGeneralTemplateAdditionalData;
  academic_year_start_date: string;
  academic_year_end_date: string;
}

interface IGetSheetData {
  id: number;
  form_id: number;
  value_type: number;
  evaluation_form_general_evaluation_id: number;
  is_lock: boolean;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  current_data_entry_id: number;
  school_id: number;
  academic_year: string;
  year: string;
  school_room: string;
  school_term: string;
  subject_name: null | string;
  general_type: string | null;
  general_name: string | null;
  general_additional_data?: TSheetAdditionalData | null;
}

export type TSheetAdditionalData = TGeneralTemplateAdditionalData;

export interface IGetSubjectData {
  id: number;
  form_id: number;
  template_subject_id: number;
  subject_name: string;
  is_clever: boolean;
  clever_subject_id: number | null;
  hours: number | null;
  indicator: IIndicator[];
}

export interface IGetTitleSheet {
  id: number;
  form_id: number;
  template_subject_id: number;
  subject_name: string;
  indicator: IIndicator[];
}

type TGetSheetCompare = Pick<
  IGetSheetDetail,
  | 'id'
  | 'sheet_id'
  | 'version'
  | 'is_lock'
  | 'status'
  | 'created_at'
  | 'created_by'
  | 'updated_at'
  | 'updated_by'
  | 'json_student_score_data'
  | 'additional_data'
>;
export interface IGetSheetCompare {
  version_left: TGetSheetCompare;
  version_right: TGetSheetCompare;
}

export interface IIndicator {
  id: number;
  evaluation_form_subject_id: number;
  name: string;
  max_value: number;
  sort: number;
  score_evaluation_type: EScoreEvaluationType;
  setting?: TContentIndicatorSetting[];
}

export interface IStudent {
  id: number;
  citizen_no?: string;
  student_id?: string;
  title: string;
  thai_first_name: string;
  thai_last_name: string;
  eng_first_name?: string;
  eng_last_name?: string;
  no: number;
}

export interface IGetSheetList {
  subject_name?: string;
  general_name?: string;
  id: number;
  form_id: number;
  value_type: number;
  evaluation_form_general_evaluation_id: number;
  is_lock: boolean;
  status: string;
  school_id: number;
  academic_year: string;
  year: string;
  school_room: string;
  school_term: string;
}

export interface IJsonStudentScoreDaum {
  evaluation_student_id: number;
  student_indicator_data: IStudentIndicatorDaum[];

  // อันดับนักเรียน
  order: number;
  additional_fields?: TJsonStudentAdditionalFields;
  // for show ui
  student_detail?: IStudent | null;
}

export type TJsonStudentAdditionalFields = {
  remark?: string;
  grade_status?: EGradeStatus;
};

export type TJsonStudentLessonScoreData = {
  evaluation_student_id: number;
  evaluation_form_indicator_id: number;
  score: number;
  max_score: number;
};

export interface IStudentIndicatorDaum {
  indicator_id?: number;
  indicator_general_name?: string;
  value: number;
  additional_fields?: TStudentIndicatorAdditionalField & { [key: string]: any };
}

export type TStudentIndicatorAdditionalField = {
  is_replace_score?: boolean;
  replaced_score?: number;
  game_score?: number;
};

export type TOnInputScoreChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  indexJsonStudentScoreData: number,
  indexStudentIndicator: number,
  indicatorData: IStudentIndicatorDaum,
) => void;
