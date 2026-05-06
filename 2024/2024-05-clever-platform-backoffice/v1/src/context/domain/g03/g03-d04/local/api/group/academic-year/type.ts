export interface YearDropdownResponse {
  years: string[];
}

export interface ClassesDropdownResponse {
  classes: string[];
}

export interface CreateAcademicYearRangesRequest {
  school_id: number;
  name: string;
  start_date: string;
  end_date: string;
}

export interface DeleteAcademicYearRangesRequest {
  academicYearRangeId: number;
}

export interface GetAcademicYearRangesRequest {
  school_id: number;
}

export interface GetAcademicYearRangesResponse {
  id: number;
  school_id: number;
  name: string;
  start_date: string;
  end_date: string;
}

export interface GetClassResponse {
  id: number;
  academic_year: number;
  year: string;
  name: string;
  updated_at: string;
  updated_by: string;
}
