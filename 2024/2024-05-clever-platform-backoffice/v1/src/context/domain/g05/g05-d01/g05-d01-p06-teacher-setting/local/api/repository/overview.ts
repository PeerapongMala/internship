import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import {
  FilterLubLesson,
  Lesson,
  OverviewStats,
  Subject,
  SubLesson,
} from '../../types/overview';

export interface FilterQueryParams extends BasePaginationAPIQueryParams {
  started_at?: string;
  ended_at?: string;
}
export interface OverviewRepository {
  GetSubject: (
    user_id: string,
    class_id: number,
    query: FilterQueryParams,
  ) => Promise<PaginationAPIResponse<Subject>>;
  GetOverview: (
    user_id: string,
    class_id: number,
    subject_id: number,
    query: FilterQueryParams,
  ) => Promise<DataAPIResponse<OverviewStats>>;
  GetLesson: (
    user_id: number,
    class_id: number,
    subject_id: number,
    query: FilterQueryParams,
  ) => Promise<PaginationAPIResponse<Lesson>>;
  GetSubLesson: (
    user_id: number,
    class_id: number,
    subject_id: number,
    lesson_id: number,
    query: FilterQueryParams,
  ) => Promise<PaginationAPIResponse<SubLesson>>;
  GetFilterLesson: (
    user_id: number,
    subject_id: number,
    query: FilterQueryParams,
  ) => Promise<PaginationAPIResponse<FilterLubLesson>>;
}
