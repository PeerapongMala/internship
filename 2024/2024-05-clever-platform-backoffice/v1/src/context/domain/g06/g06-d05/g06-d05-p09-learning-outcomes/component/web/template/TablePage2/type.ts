// types.ts

export type Student = {
  id: number;
  no: number;
  title: string;
  first_name: string;
  last_name: string;
};

export type GradeOverview = {
  evaluation_student_id: number;
  average_grade: number;
  rank: number;
};

export type SubjectScore = {
  id: number;
  name: string;
  class_score: {
    evaluation_student_id: number;
    score: number;
  }[];
  grade_score: {
    evaluation_student_id: number;
    grade: number;
  }[];
};

export type ApiResponseDataJson = {
  school_name: string;
  academic_year: string;
  year: string;
  subject: SubjectScore[];
  student_list: Student[];
  grade_overview: GradeOverview[];
};

export type GradeScore = {
  evaluation_student_id: number;
  grade: number;
};
