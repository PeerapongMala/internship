import { PaginationAPIResponse } from '@global/utils/apiResponseHelper';

import {
  FilterSchoolResponse,
  SchoolClassStatFilterQueryParams,
  SchoolClassStatResponse,
  SchoolListQueryParams,
  SchoolTermFilterQueryParams,
  SchoolTermResponse,
  TBestStudentQueryParams,
  TBestTeacherListByClassStarQueryParams,
  TeacherClassStatFilterQueryParams,
  TeacherClassStatResponse,
  TeacherDataResponse,
  TeacherStatFilterQueryParams,
  TBestTeacherListByStudyGroupStarQueryParams,
  TBestTeacherListByHomeworkQueryParams,
  TBestTeacherListByLessonQueryParams,
  TBestSchoolListByAvgClassStarQueryParams,
} from '../group/progress-dashboard/restapi/type';
import { ICurriculum } from '@domain/g00/g00-d00/local/type';
export interface ProgressDashboardRepository {
  // RestAPI
  GetFilterSchool(
    query: SchoolListQueryParams,
  ): Promise<PaginationAPIResponse<FilterSchoolResponse>>;
  GetTeacher(
    query: TeacherStatFilterQueryParams,
  ): Promise<PaginationAPIResponse<TeacherDataResponse>>;
  GetTeacherClassStat(
    query: TeacherClassStatFilterQueryParams,
  ): Promise<PaginationAPIResponse<TeacherClassStatResponse>>;
  GetSchoolClassStat(
    query: SchoolClassStatFilterQueryParams,
  ): Promise<PaginationAPIResponse<SchoolClassStatResponse>>;
  GetClassLevel(): Promise<PaginationAPIResponse<ICurriculum>>;
  GetAcademicYearRange(
    query: SchoolTermFilterQueryParams,
  ): Promise<PaginationAPIResponse<SchoolTermResponse>>;
  GetBestStudentCSV(query: TBestStudentQueryParams): Promise<string>;
  GetBestTeacherListByClassStar(
    query: TBestTeacherListByClassStarQueryParams,
  ): Promise<string>;
  GetBestTeacherListByStudyGroupStar(
    query: TBestTeacherListByStudyGroupStarQueryParams,
  ): Promise<string>;
  GetBestTeacherListByHomework(
    query: TBestTeacherListByHomeworkQueryParams,
  ): Promise<string>;
  GetBestTeacherListByLesson(query: TBestTeacherListByLessonQueryParams): Promise<string>;
  GetBestSchoolByAvgClassStar(
    query: TBestSchoolListByAvgClassStarQueryParams,
  ): Promise<string>;
}
