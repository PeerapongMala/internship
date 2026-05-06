import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { APITypeAPIResponse } from '../../../../../../core/helper/api-type';
import {
  Sublesson,
  Lesson,
  IDownloadCsvFilter,
  IBulkEdit,
  SubjectSubLessons,
  LessonStatus,
  SubLessonData,
} from '../api/type';
export interface FilterQueryParams extends BasePaginationAPIQueryParams {
  status?: LessonStatus;
}
export interface RepositoryPatternInterface {
  Sublesson: {
    SubLessonList: {
      Get(
        lessonId: number,
        query: FilterQueryParams,
      ): Promise<PaginationAPIResponse<SubjectSubLessons>>;
    };
    SubLessonGet: {
      Get(lessonId: number): Promise<DataAPIResponse<SubLessonData>>;
    };

    SubLessonCreate: {
      Post(body: any): Promise<DataAPIResponse<any>>;
    };
    SubLessonUpdate: {
      Patch(id: number, body: any): Promise<DataAPIResponse<any>>;
    };
    SubLessonFileUpdate: {
      Post(subLessonIds: number[]): Promise<DataAPIResponse<never>>;
    };
    UploadCSV: {
      Post(file: File, subjectId: number): Promise<DataAPIResponse<Sublesson[]>>;
    };
    DownloadCSV: {
      Get(
        filter: IDownloadCsvFilter,
      ): Promise<void | FailedAPIResponse | DataAPIResponse<any>>;
    };
    BulkEdit: {
      Post(lessonList: IBulkEdit): Promise<DataAPIResponse<Sublesson>>;
    };
    Indicator: {
      List(curriculum_group_id: number): Promise<DataAPIResponse<any>>;
    };
    SubLessonSoft: {
      Patch(
        lessonId: number,
        query: {
          sub_lessons: {
            [key: string]: number;
          };
        },
      ): Promise<DataAPIResponse<any>>;
    };
  };
}
