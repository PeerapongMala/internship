export interface Nutritional {
  id: number;
  form_id: number;
  order: number;
  name: string;
  data_json: EvaluationStudent[];
  created_at: string;
  student_list: Student[];
}

export interface EvaluationStudent {
  evaluation_student_id: number;
  student_indicator_data: IndicatorData[];
  additional_fields: StudentDetail;
}

export interface IndicatorData {
  indicator_id: number | null;
  indicator_general_name: string;
  value: number;
}

export interface StudentDetail {
  id: number;
  student_id: string;
  title: string;
  thai_first_name: string;
  thai_last_name: string;
  eng_first_name: string | null;
  eng_last_name: string | null;
}

export interface Student {
  id: number;
  no: number;
  title: string;
  thai_first_name: string;
  thai_last_name: string;
}

export interface StudentIndicator {
  indicator_id: number | null;
  indicator_general_name: string;
  value: number;
}

export interface EvaluationStudentFull {
  evaluation_student_id: number;
  student_indicator_data: IndicatorData[];
  additional_fields: StudentDetail;
}

export interface EvaluationStudentLite {
  evaluation_student_id: number;
  student_indicator_data: StudentIndicator[];
  additional_fields: {
    eng_first_name: string | null;
    eng_last_name: string | null;
    id: number;
    student_id: string;
    thai_first_name: string;
    thai_last_name: string;
    title: string;
  };
}

export interface NutritionDate {
  date: string;
}

export interface Nutritional {
  id: number;
  form_id: number;
  order: number;
  name: string;
  data_json: EvaluationStudent[];
  created_at: string;
  student_list: {
    id: number;
    no: number;
    title: string;
    thai_first_name: string;
    thai_last_name: string;
  }[];
  additional_data: {
    nutrition: NutritionDate[][];
  };
}
