import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { RecordStatus, StudentGroup } from '../../type';
import {
  LastStudentLogin,
  Lesson,
  LessonProgress,
  NotStudentLogin,
  StudentOverview,
  SubLesson,
  SubLessonProgress,
  TopStudent,
} from '../group/student-overview/types';

export interface StudentGroupOverViewFilterQueryParams
  extends BasePaginationAPIQueryParams {
  start_at?: string;
  end_at?: string;
  study_group_id?: string;
  lesson_id?: number[];
  lesson_ids?: number[];
  sub_lesson_ids?: number[];
}

export interface StudentGroupOverviewRepository {
  GetA01(
    query?: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<Lesson>>;
  GetA02(
    query?: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<SubLesson>>;
  GetA03(
    query?: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<StudentOverview>>;
  GetA04(
    query?: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<any>>;
  GetA05(
    query?: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<TopStudent>>;
  GetA06(
    query?: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<LastStudentLogin>>;
  GetA07(
    query?: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<NotStudentLogin>>;
  GetA08(
    query?: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<LessonProgress>>;
  GetA09(
    query?: StudentGroupOverViewFilterQueryParams,
  ): Promise<PaginationAPIResponse<SubLessonProgress>>;
}
