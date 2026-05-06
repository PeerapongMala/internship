export interface SubjectScoreMap {
  [score: string]: number;
}

export interface SubjectData {
  id: number;
  name: string;
  scores: SubjectScoreMap;
}

export interface AcademicInfo {
  school_name: string;
  academic_year: string;
  year: string;
  male_count: number;
  female_count: number;
  total_count: number;
}

export interface DataJSON extends AcademicInfo {
  subject: SubjectData[];
}
