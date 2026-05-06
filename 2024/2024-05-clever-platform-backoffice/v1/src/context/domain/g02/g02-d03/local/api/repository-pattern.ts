import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { APITypeAPIResponse } from '../../../../../../core/helper/api-type';
import {
  BulkEditItem,
  Platform,
  IBulkEdit,
  IDownloadCsvFilter,
  Lesson,
  LessonStatus,
  LevelType,
  Monster,
  SubjectLessons,
  TLessonBulkEditBody,
} from '../Type';
import { ISubject } from '@domain/g02/g02-d02/local/type';
import { TBaseResponse } from '@global/types/api';
import { AxiosResponse } from 'axios';

export interface FilterQueryParams extends BasePaginationAPIQueryParams {
  platform_id?: number;
  subject_group_id?: number;
  year_id?: number;
  learning_area_id?: number;
  status?: LessonStatus;
  level_type?: LevelType;
}

export interface RepositoryPatternInterface {
  Lesson: {
    SubjectList: {
      Get(
        curriculumGroupId: number,
        query: FilterQueryParams,
      ): Promise<PaginationAPIResponse<ISubject>>;
    };
    LessonCreate: {
      Post(body: {
        subject_id?: number;
        index?: number;
        name?: string;
        font_name?: string;
        font_size?: string;
        status?: string;
        created_by?: string;
        updated_by?: string;
        admin_login_as?: string;
      }): Promise<DataAPIResponse<any>>;
    };
    LessonUpdate: {
      Patch(id: number, body: any): Promise<any>;
    };
    LessonList: {
      Get(
        subjectId: string,
        params: {
          status?: LessonStatus;
          search_text?: string;
          page?: number;
          limit?: number;
        },
      ): Promise<PaginationAPIResponse<SubjectLessons>>;
    };
    LessonGetById: {
      Get(lessonId: string): Promise<any>;
    };
    LessonGetBy: {
      Get(lessonId: string): Promise<DataAPIResponse<SubjectLessons>>;
    };
    UploadCSV: {
      Post(file: File, subjectId: number): Promise<DataAPIResponse<Lesson[]>>;
    };
    DownloadCSV: {
      Get(filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse>;
    };
    BulkEdit: {
      Post(lessonList: Partial<IBulkEdit>): Promise<DataAPIResponse<Lesson>>;
    };
    LessonLevelBulkEdit: {
      Post(body: TLessonBulkEditBody): Promise<AxiosResponse<TBaseResponse>>;
    };
    SortLesson: {
      Patch(
        subjectID: number,
        items: {
          lessons: {
            [key: string]: number;
          };
        },
      ): Promise<any>;
    };
    MonsterList: {
      Get(
        lesson_id: string,
        query: FilterQueryParams,
      ): Promise<PaginationAPIResponse<Monster>>;
    };
    MonsterCreate: {
      Post(lesson_id: string, data: any): Promise<DataAPIResponse<any>>;
    };
    MonsterDelete: {
      Delete(monster_ids: number[]): Promise<DataAPIResponse<any>>;
    };
    PlatformList: {
      Get(
        curriculumGroupId: number,
        query: FilterQueryParams,
      ): Promise<PaginationAPIResponse<Platform>>;
    };
  };
}
