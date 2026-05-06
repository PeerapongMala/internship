import { PaginationAPIResponse } from '@core/helper/api-type';
import { LessonItemList } from '@domain/g04/g04-d01/local/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const LessonAllGet = (
  subjectId: string,
): Promise<PaginationAPIResponse<LessonItemList>> => {
  const url = `${backendURL}/learning-lesson/v1/subject/${subjectId}/lessons?limit=-1`;
  return fetchWithAuth(url, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<LessonItemList>) => {
      return res;
    });
};

export default LessonAllGet;
