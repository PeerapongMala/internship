import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import {
  Academicyear,
  Classroom,
  LatestHomework,
  Lesson,
  Level,
  questionOverview,
  ResHomework,
  resLesson,
  resSubLesson,
  Score,
  ScoreMax,
  ScoreMin,
  Subject,
  SubjectFilter,
  TotalStudent,
  Year,
} from '../../type';

export interface FilterQueryParams extends BasePaginationAPIQueryParams {
  academic_year?: number;
  year?: string;
  class_ids?: number[];
  class_id?: number[];
  subject_ids?: number[];
  lesson_ids?: number[];
  start_at?: string;
  end_at?: string;
}
export interface DashboardRepository {
  GetA01: (query: FilterQueryParams) => Promise<PaginationAPIResponse<Academicyear>>;
  GetA02: (query: FilterQueryParams) => Promise<PaginationAPIResponse<Year>>;
  GetA03: (query: FilterQueryParams) => Promise<PaginationAPIResponse<Classroom>>;
  GetA04: (query: FilterQueryParams) => Promise<PaginationAPIResponse<TotalStudent>>;
  GetA05: (query: FilterQueryParams) => Promise<PaginationAPIResponse<LatestHomework>>;
  GetA06: (query: FilterQueryParams) => Promise<PaginationAPIResponse<Level>>;
  GetA07: (query: FilterQueryParams) => Promise<PaginationAPIResponse<Score>>;
  GetA08: (query: FilterQueryParams) => Promise<PaginationAPIResponse<questionOverview>>;
  GetA09: (query: FilterQueryParams) => Promise<PaginationAPIResponse<Subject>>;
  GetA10: (query: FilterQueryParams) => Promise<PaginationAPIResponse<Lesson>>;
  GetA11: (query: FilterQueryParams) => Promise<PaginationAPIResponse<ScoreMax>>;
  GetA12: (query: FilterQueryParams) => Promise<PaginationAPIResponse<ScoreMin>>;
  GetA13: (query: FilterQueryParams) => Promise<PaginationAPIResponse<resLesson>>;
  GetA14: (query: FilterQueryParams) => Promise<PaginationAPIResponse<resSubLesson>>;
  GetA15: (query: FilterQueryParams) => Promise<PaginationAPIResponse<ResHomework>>;
  GetA16: (query: FilterQueryParams) => Promise<PaginationAPIResponse<SubjectFilter>>;
  GetYearFilter: (query: FilterQueryParams) => Promise<PaginationAPIResponse<any>>;
}
