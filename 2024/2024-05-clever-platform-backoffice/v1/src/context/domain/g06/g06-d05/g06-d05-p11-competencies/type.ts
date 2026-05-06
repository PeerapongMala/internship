interface Indicator {
  indicator_id: number | null;
  indicator_general_name: string;
  value: number;
}

interface EvaluationStudent {
  evaluation_student_id: number;
  student_indicator_data: Indicator[];
  additional_fields: {
    id: number;
    student_id: string;
    thai_first_name: string;
    thai_last_name: string;
    title: string;
  };
}

interface Student {
  id: number;
  no: number;
  title: string;
  thai_first_name: string;
  thai_last_name: string;
}

interface MergedStudent extends Student {
  indicators: Indicator[];
}

export interface IStudentIndicatorDaum {
  indicator_general_name: string;
  value: number;
}

export interface IJsonStudentScoreDaum {
  evaluation_student_id: number;
  student_detail: {
    id: number;
    no: number;
    title: string;
    thai_first_name: string;
    thai_last_name: string;
  };
  student_indicator_data: IStudentIndicatorDaum[];
  order: number;
}

export interface IUpdateSheetRequest {
  id: number;
  start_edit_at: string;
  json_student_score_data: IJsonStudentScoreDaum[];
}
