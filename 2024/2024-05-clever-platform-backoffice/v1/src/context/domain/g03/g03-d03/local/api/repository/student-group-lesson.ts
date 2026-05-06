import {
  LessonOptions,
  LessonStatList,
  ParamsLessonStat,
} from '@domain/g03/g03-d03/local/api/group/student-group-lesson/type.ts';
import {
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper.ts';

export interface StudentGroupLessonRepository {
  GetLessonStatList(
    studyGroupId: string,
    query: ParamsLessonStat,
  ): Promise<PaginationAPIResponse<LessonStatList>>;

  DownloadLessonStatCsv(
    studyGroupId: string,
    query?: ParamsLessonStat,
  ): Promise<Blob | FailedAPIResponse>;

  GetLessonParams(
    studyGroupId: string,
    query: ParamsLessonStat,
  ): Promise<PaginationAPIResponse<LessonOptions>>;

  GetSubLessonParams(
    studyGroupId: string,
    lesson_id: string,
  ): Promise<PaginationAPIResponse<LessonOptions>>;
}
