import { TPaginationReq } from '@global/types/api';
import { BasePaginationAPIQueryParams } from '@global/utils/apiResponseHelper';

export interface TeacherStatFilterQueryParams extends BasePaginationAPIQueryParams {
  schoolId: string;
  'start-date': string;
  'end-date': string;
  page: number;
  limit: number;
}

export interface SchoolListQueryParams extends BasePaginationAPIQueryParams {
  type: string;
  page: number;
  limit: number;
}

export interface TeacherClassStatFilterQueryParams {
  schoolId: string;
  teacherId: string;
  'start-date': string;
  'end-date': string;
  page: number;
  limit: number;
}

export interface TeacherData {
  teacher_id: string;
  teacher_name: string;
  class_room_count: number;
  progress: number;
  homework_count: number;
  classData?: any[];
}

export interface TeacherStat {
  progress: number;
  teacher_name: string;
  class_room_count: number;
  homework_count: number;
}
export interface ClassStat {
  progress: number;
  scope: string;
}

export interface TeacherStatResponse {
  data: TeacherStat;
}

export interface TeacherClassStatResponse {
  data: ClassStat;
}

export interface TeacherDataResponse {
  data: TeacherData;
}

export interface FilterOption {
  id: string;
  name: string;
}
export interface FilterSchoolResponse {
  data: FilterOption;
}

export interface SchoolClassStatFilterQueryParams {
  schoolId: string;
  'start-date': string;
  'end-date': string;
  'academic-year': number;
  year: string;
  page: number;
  limit: number;
}

export interface SchoolTermFilterQueryParams extends BasePaginationAPIQueryParams {
  school_id: string;
}

export interface SchoolClassStatResponse {
  data: ClassStat;
}

export type SchoolTermResponse = {
  id: number;
  school_id: number;
  name: string;
  start_date: string;
  end_date: string;
};

export type TBestStudentQueryParams = TPaginationReq & {
  start_date?: string;
  end_date?: string;
  columns?: string;
  /**
   * 1 = เรียงตามด่าน, 2 = เรียนตามดาว
   */
  order_by?: 1 | 2;
};

export type TBestTeacherListByClassStarQueryParams = TPaginationReq & {
  school_affiliation_type?: string;
  school_id?: string;
  school_code?: string;
  school_name?: string;
  start_date?: string;
  end_date?: string;
  columns?: string;
};

export type TBestTeacherListByStudyGroupStarQueryParams =
  TBestTeacherListByClassStarQueryParams;
export type TBestTeacherListByHomeworkQueryParams =
  TBestTeacherListByClassStarQueryParams & { year?: string };

export type TBestTeacherListByLessonQueryParams = Omit<
  TBestTeacherListByClassStarQueryParams,
  'school_id' | 'school_code' | 'school_name' | 'school_affiliation_type'
> & {
  academic_year?: string;
  subject_name?: string;
};

export type TBestSchoolListByAvgClassStarQueryParams =
  TBestTeacherListByClassStarQueryParams;
