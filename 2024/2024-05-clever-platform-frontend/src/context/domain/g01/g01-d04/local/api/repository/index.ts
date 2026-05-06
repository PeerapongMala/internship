import { DataAPIResponse } from '@core/helper/api-type';
import { TLessonMeta, TLessonMetaReq } from '../../types/lesson-meta';

export interface UploadRepository {
  GetLessonMeta: (body: TLessonMetaReq) => Promise<DataAPIResponse<TLessonMeta[]>>;
}
