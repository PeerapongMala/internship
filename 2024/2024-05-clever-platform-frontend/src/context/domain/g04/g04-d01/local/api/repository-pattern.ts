import { DataAPIResponse, PaginationAPIResponse } from '@core/helper/api-type';

import {
  SubLessonUrlListResponseV1,
  SubLessonUrlListResponseV2,
  ZipResponse,
} from '@global/helper/zipDownload';
import {
  LessonEntity,
  LessonItemList,
  LevelDetails,
  LevelList,
  MonsterItemList,
  SubLessonCheck,
  SublessonEntity,
  SublessonItemList,
} from '../type';

export interface RepositoryPatternInterface {
  Lesson: {
    LessonAll: {
      Get(subjectId: string): Promise<PaginationAPIResponse<LessonItemList>>;
    };
    LessonById: {
      Get(
        lessonId: string,
        no_empty_level?: boolean,
      ): Promise<DataAPIResponse<LessonEntity>>;
    };
    LessonMonstersById: {
      Get(lessonId: string): Promise<PaginationAPIResponse<MonsterItemList[]>>;
    };
  };
  Sublesson: {
    SublessonAll: {
      Get(
        lessonId: string,
        no_empty_level?: boolean,
      ): Promise<PaginationAPIResponse<SublessonItemList>>;
    };
    SublessonById: {
      Get(sublessonId: string): Promise<DataAPIResponse<SublessonEntity>>;
    };
  };
  Level: {
    LevelQuiz: {
      Get(
        sublessonId: string,
        pagination?: { page?: number; limit?: number },
      ): Promise<PaginationAPIResponse<LevelDetails>>;
      GetZip(sublessonId: string): Promise<ZipResponse<LevelDetails>>;
    };
    LevelList: {
      Get(sublessonId: string): Promise<PaginationAPIResponse<LevelList>>;
    };
    LevelSubLessonUrl: {
      Get: (lessonID: string) => Promise<DataAPIResponse<SubLessonUrlListResponseV1>>;
      Post: (
        lessonID: string,
        query: SubLessonCheck[],
      ) => Promise<DataAPIResponse<SubLessonUrlListResponseV1>>;
      PostV2: (
        lessonID: string,
        query: SubLessonCheck[],
      ) => Promise<DataAPIResponse<SubLessonUrlListResponseV2>>;
    };
  };
}
