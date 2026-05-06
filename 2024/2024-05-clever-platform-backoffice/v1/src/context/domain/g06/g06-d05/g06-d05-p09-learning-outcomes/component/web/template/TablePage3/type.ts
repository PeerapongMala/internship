export type Student = {
  id: number;
  no: number;
  student_id: string;
  title: string;
  first_name: string;
  last_name: string;
  citizen_no: string;
  birth_date: string;
};

export type ClassScore = {
  evaluation_student_id: number;
  score: number;
};

export type Subject = {
  id: number;
  code: string;
  name: string;
  hours: number;
  max_score: number;
  learning_group: string;
  teacher: string[];
  teacher_advisor: string[];
  scores: Record<string, number>; // eg. "0": 2, "1.5": 0, "มส": 0
  class_score: ClassScore[];
  grade_score: any;
  is_subject: boolean;
};

export type DataJson = {
  school_name: string;
  school_area: string;
  academic_year: string;
  year: string;
  subject: Subject[];
  male_count: number;
  female_count: number;
  total_count: number;
  student_list: Student[];
};

export type EvaluationItem = {
  id: number;
  form_id: number;
  order: number;
  name: string;
  data_json: DataJson;
  created_at: string;
  additional_data?: {
    nutrition: { date: string }[][];
  };
};

export type EvaluationFormResponse = {
  status_code: number;
  message: string;
  data: EvaluationItem[];
};

export type StudentWithScore = Student & {
  totalScore: number;
  percent: number;
  rank: number;
};

export type Score = {
  evaluation_student_id: number;
  score: number;
};
