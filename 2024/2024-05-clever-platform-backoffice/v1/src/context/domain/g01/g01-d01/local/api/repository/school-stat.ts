import {
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import {
  AcademicYearDropdownFilterQuery,
  GetLevelQuery,
  GetLevelResponse,
  GetPlayLogQuery,
  GetPlayLogResponse,
  LessonDropdownFilterQuery,
  LessonDropdownFilterResponse,
  SchoolStatClassTableQuery,
  SchoolStatClassTableResponse,
  SchoolStatLessonTableQuery,
  SchoolStatLessonTableResponse,
  SchoolStatLevelTableQuery,
  SchoolStatLevelTableResponse,
  SchoolStatPlayLogTableQuery,
  SchoolStatPlayLogTableResponse,
  SchoolStatStudentTableQuery,
  SchoolStatStudentTableResponse,
  SchoolStatSubLessonTableQuery,
  SchoolStatSubLessonTableResponse,
  SchoolStatTableQuery,
  SchoolStatTableResponse,
  SubLessonDropdownFilterQuery,
  SubLessonDropdownFilterResponse,
} from '@domain/g01/g01-d01/local/api/group/school-stat/type.ts';
import { FetchOptions } from '@global/utils/fetchWithAuth';

export interface SchoolStatRepository {
  GetSchoolTable(
    query: BasePaginationAPIQueryParams & SchoolStatTableQuery,
    options?: FetchOptions,
  ): Promise<PaginationAPIResponse<SchoolStatTableResponse>>;
  GetClassTable(
    query: BasePaginationAPIQueryParams & SchoolStatClassTableQuery,
    options?: FetchOptions,
  ): Promise<PaginationAPIResponse<SchoolStatClassTableResponse>>;
  GetStudentTable(
    query: BasePaginationAPIQueryParams & SchoolStatStudentTableQuery,
    options?: FetchOptions,
  ): Promise<PaginationAPIResponse<SchoolStatStudentTableResponse>>;
  GetLessonTable(
    query: BasePaginationAPIQueryParams & SchoolStatLessonTableQuery,
    options?: FetchOptions,
  ): Promise<PaginationAPIResponse<SchoolStatLessonTableResponse>>;
  GetSubLessonTable(
    query: BasePaginationAPIQueryParams & SchoolStatSubLessonTableQuery,
  ): Promise<PaginationAPIResponse<SchoolStatSubLessonTableResponse>>;
  GetLevelTable(
    query: BasePaginationAPIQueryParams & SchoolStatLevelTableQuery,
  ): Promise<PaginationAPIResponse<SchoolStatLevelTableResponse>>;
  GetPlayLogTable(
    query: BasePaginationAPIQueryParams & SchoolStatPlayLogTableQuery,
  ): Promise<PaginationAPIResponse<SchoolStatPlayLogTableResponse>>;
  //
  DownloadSchoolCSV(
    query: BasePaginationAPIQueryParams & SchoolStatTableQuery,
  ): Promise<void>;
  DownloadClassCSV(
    query: BasePaginationAPIQueryParams & SchoolStatClassTableQuery,
  ): Promise<void>;
  DownloadStudentCSV(
    query: BasePaginationAPIQueryParams & SchoolStatStudentTableQuery,
  ): Promise<void>;
  DownloadLessonCSV(
    query: BasePaginationAPIQueryParams & SchoolStatLessonTableQuery,
  ): Promise<void>;
  DownloadSubLessonCSV(
    query: BasePaginationAPIQueryParams & SchoolStatSubLessonTableQuery,
  ): Promise<void>;
  DownloadSubLessonCSV(
    query: BasePaginationAPIQueryParams & SchoolStatSubLessonTableQuery,
  ): Promise<void>;
  DownloadLevelCSV(
    query: BasePaginationAPIQueryParams & SchoolStatLevelTableQuery,
  ): Promise<void>;
  DownloadPlayLogCSV(
    query: BasePaginationAPIQueryParams & SchoolStatPlayLogTableQuery,
  ): Promise<void>;
  //
  DropdownCurriculumGroups(
    query: BasePaginationAPIQueryParams & LessonDropdownFilterQuery,
    options?: FetchOptions,
  ): Promise<PaginationAPIResponse<LessonDropdownFilterResponse>>;
  DropdownSubjectList(
    query: BasePaginationAPIQueryParams & LessonDropdownFilterQuery,
    options?: FetchOptions,
  ): Promise<PaginationAPIResponse<LessonDropdownFilterResponse>>;
  DropdownLessonList(
    query: BasePaginationAPIQueryParams & LessonDropdownFilterQuery,
    options?: FetchOptions,
  ): Promise<PaginationAPIResponse<LessonDropdownFilterResponse>>;
  DropdownSubLessonList(
    query: BasePaginationAPIQueryParams & SubLessonDropdownFilterQuery,
  ): Promise<PaginationAPIResponse<SubLessonDropdownFilterResponse>>;
  DropdownAcademicYearList(
    query: BasePaginationAPIQueryParams & AcademicYearDropdownFilterQuery,
  ): Promise<PaginationAPIResponse<number[]>>;
  //
  GetLevel(
    query: BasePaginationAPIQueryParams & GetLevelQuery,
  ): Promise<GetLevelResponse>;
  GetPlayLog(
    query: BasePaginationAPIQueryParams & GetPlayLogQuery,
  ): Promise<PaginationAPIResponse<GetPlayLogResponse>>;
}
