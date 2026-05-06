import { PaginationAPIResponse } from '@core/helper/api-type';
import { LevelList } from '@domain/g04/g04-d01/local/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const LevelInfoGet = (sublessonId: string): Promise<PaginationAPIResponse<LevelList>> => {
  const url = `${backendURL}/level/v1/level-detail/${sublessonId}`;
  return fetchWithAuth(url, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<LevelList>) => {
      return res;
    });
};

export default LevelInfoGet;
