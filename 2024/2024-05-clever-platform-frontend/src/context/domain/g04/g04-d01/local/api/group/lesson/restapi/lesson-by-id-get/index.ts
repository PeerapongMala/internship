import {
  convertToDataResponse,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@core/helper/api-type';
import { LessonEntity } from '@domain/g04/g04-d01/local/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const LessonByIdGet = (
  lessonId: string,
  no_empty_level?: boolean,
): Promise<DataAPIResponse<LessonEntity>> => {
  const url = new URL(`${backendURL}/learning-lesson/v1/lesson/${lessonId}`);
  if (no_empty_level !== undefined) {
    url.searchParams.set('no_empty_level', String(no_empty_level));
  }

  return fetchWithAuth(url.toString())
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<LessonEntity>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    });
};

export default LessonByIdGet;
