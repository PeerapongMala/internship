interface StudentDetail {
  id: number;
  no: number;
  title: string;
  thai_first_name: string;
  thai_last_name: string;
}

interface IndicatorData {
  indicator_id: number | null;
  indicator_general_name: string;
  value: number;
  additional_fields?: {
    club_name?: string;
  };
}

interface StudentIndicatorRecord {
  evaluation_student_id: number;
  student_indicator_data: IndicatorData[];
  additional_fields: {
    id: number;
    student_id: string;
    title: string;
    thai_first_name: string;
    thai_last_name: string;
    club_name?: string;
  };
}

interface FormData {
  id: number;
  form_id: number;
  order: number;
  name: string;
  data_json: StudentIndicatorRecord[];
  student_list: StudentDetail[];
}

interface IStudentDetail {
  id: number;
  no: number;
  title: string;
  thai_first_name: string;
  thai_last_name: string;
}

interface IDataJson {
  evaluation_student_id: number;
  student_indicator_data: {
    indicator_id: number | null;
    indicator_general_name: string;
    value: number;
    additional_fields?: Record<string, any>;
  }[];
  additional_fields: {
    [key: string]: any;
  };
}

interface IDataItem {
  id: number;
  form_id: number;
  order: number;
  name: string;
  data_json: IDataJson[];
  student_list: IStudentDetail[];
}
