import { PaginationAPIResponse } from '@core/helper/api-type';
import { SublessonItemList } from '@domain/g04/g04-d01/local/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const SublessonAllGet = (
  lessonId: string,
  no_empty_level?: boolean,
): Promise<PaginationAPIResponse<SublessonItemList>> => {
  const url = new URL(`${backendURL}/learning-lesson/v1/lesson/${lessonId}/sublessons`);
  url.searchParams.set('limit', '-1');
  if (no_empty_level !== undefined) {
    url.searchParams.set('no_empty_level', String(no_empty_level));
  }

  return fetchWithAuth(url.toString(), {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<SublessonItemList>) => {
      return res;
    });
};

export default SublessonAllGet;
