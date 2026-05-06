import {
  convertToDataResponse,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@core/helper/api-type';
import { SublessonEntity } from '@domain/g04/g04-d01/local/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const SublessonByIdGet = (
  sublessonId: string,
): Promise<DataAPIResponse<SublessonEntity>> => {
  const url = `${backendURL}/learning-lesson/v1/sublesson/${sublessonId}`;
  return fetchWithAuth(url, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<SublessonEntity>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    });
};

export default SublessonByIdGet;
