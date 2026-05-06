import {
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

import {
  TTestPairModelStatListResponse,
  StudentGroupResearchQueryParams,
  TTestPairModelStatResponse,
  LessonResponse,
  SubLessonResponse,
  LevelResponse,
  DDRScoreResultResponse,
  DDRSummaryResultResponse,
} from '../group/student-group-research/type';

export interface StudentGroupResearchRepository {
  GetResearchTTestPairModelStatCSV(
    studyGroupId: number,
    params: {
      search?: string;
    },
  ): Promise<Blob | FailedAPIResponse>;

  GetTTestPairModelStatList(
    studentGroupId: number,
    query: StudentGroupResearchQueryParams,
  ): Promise<PaginationAPIResponse<TTestPairModelStatListResponse>>;

  GetTTestPairModelStatResult(
    studentGroupId: number,
    query: StudentGroupResearchQueryParams,
  ): Promise<DataAPIResponse<TTestPairModelStatResponse>>;

  GetLessonParams(studentGroupId: number): Promise<PaginationAPIResponse<LessonResponse>>;

  GetSubLessonParams(
    studentGroupId: number,
    lesson_id: string,
  ): Promise<PaginationAPIResponse<SubLessonResponse>>;

  GetLevelParams(
    studentGroupId: number,
    sub_lesson_id: string,
  ): Promise<PaginationAPIResponse<LevelResponse>>;

  GetDDRScoreResultCsv(
    studyGroupId: number,
    params: {
      search?: string;
      level_id?: string;
    },
  ): Promise<Blob | FailedAPIResponse>;

  GetDDRSummaryResultCsv(
    studyGroupId: number,
    params: {
      level_id?: string;
    },
  ): Promise<Blob | FailedAPIResponse>;

  GetDDRScoreResult(
    studentGroupId: number,
    query: StudentGroupResearchQueryParams,
  ): Promise<PaginationAPIResponse<DDRScoreResultResponse>>;

  GetDDRSummaryResult(
    studentGroupId: number,
    params: {
      level_id?: string;
    },
  ): Promise<PaginationAPIResponse<DDRSummaryResultResponse>>;
}
