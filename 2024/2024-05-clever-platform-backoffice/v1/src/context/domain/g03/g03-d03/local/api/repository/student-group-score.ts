import {
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import {
  GetStudyGroupStatOptionsResponse,
  GetStudyGroupStatListRequest,
  GetStudyGroupStatListResponse,
} from '../group/student-score/type';

export interface StudentGroupScoreRepository {
  GetStatOptions(
    optionType: string,
    studyGroupId: number,
  ): Promise<DataAPIResponse<GetStudyGroupStatOptionsResponse>>;

  GetLessonStatList(
    studentGroupId: number,
    query: GetStudyGroupStatListRequest,
  ): Promise<PaginationAPIResponse<GetStudyGroupStatListResponse>>;

  DownloadStatCSV(
    studyGroupId: number,
    query: GetStudyGroupStatListRequest,
  ): Promise<Blob | FailedAPIResponse>;

  GetSubLessonStatOptions(
    optionType: string,
    studyGroupId: number,
    lessonId: number,
  ): Promise<DataAPIResponse<GetStudyGroupStatOptionsResponse>>;

  GetStatSubLessonList(
    studentGroupId: number,
    query: GetStudyGroupStatListRequest,
  ): Promise<PaginationAPIResponse<GetStudyGroupStatListResponse>>;

  DownloadSubLessonStatCSV(
    studyGroupId: number,
    query: GetStudyGroupStatListRequest,
  ): Promise<Blob | FailedAPIResponse>;

  GetLevelStatList(
    studentGroupId: number,
    query: GetStudyGroupStatListRequest,
  ): Promise<PaginationAPIResponse<GetStudyGroupStatListResponse>>;

  DownloadLevelStatCSV(
    studyGroupId: number,
    query: GetStudyGroupStatListRequest,
  ): Promise<Blob | FailedAPIResponse>;
}
