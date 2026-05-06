import {
  convertToDataResponse,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@core/helper/api-type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const tosId = StoreGlobal.StateGetAllWithUnsubscribe().tosId;

const TermCheckAcceptance = (): Promise<DataAPIResponse<boolean>> => {
  return fetchWithAuth(`${backendURL}/terms/v1/${tosId}/acceptance`)
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<boolean>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    });
};

export default TermCheckAcceptance;
