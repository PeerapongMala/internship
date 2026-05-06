export interface IStudentIndicator {
  indicator_id: number | null;
  indicator_general_name: string;
  value: number;
}

export interface IStudentAdditionalFields {
  eng_first_name?: string | null;
  eng_last_name?: string | null;
  id: number;
  student_id: string;
  thai_first_name: string;
  thai_last_name: string;
  title: string;
  no: number;
}

export interface IStudentScore {
  evaluation_student_id: number;
  student_indicator_data: IStudentIndicator[];
  additional_fields: IStudentAdditionalFields;
}

export interface IFormData {
  classroom_name: string;
  academic_year: number;
  id: number;
  form_id: number;
  order: number;
  name: string;
  data_json: IStudentScore[];
  student_list: IStudentListItem[];
  created_at: string;
  additional_data?: IAdditionalData;
}

export interface IAPIResponse<T = unknown> {
  status_code: number;
  message: string;
  data: T;
}

export interface IStudentListItem {
  id: number;
  no: number;
  title: string;
  thai_first_name: string;
  thai_last_name: string;
}

export interface IAdditionalData {
  nutrition: {
    date: string;
  }[][];
}

export interface IJsonStudentScoreDaum {
  evaluation_student_id: number;
  student_indicator_data: {
    indicator_general_name: string;
    value: number;
  }[];
  order: number;
  student_detail: IStudentAdditionalFields;
}
