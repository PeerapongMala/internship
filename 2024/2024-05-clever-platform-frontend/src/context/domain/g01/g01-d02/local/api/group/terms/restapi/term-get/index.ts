import {
  convertToDataResponse,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@core/helper/api-type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const tosId = StoreGlobal.StateGetAllWithUnsubscribe().tosId;

const TermGet = (): Promise<DataAPIResponse<TermOfService>> => {
  return fetchWithAuth(`${backendURL}/terms/v1/tos/${tosId}`)
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<TermOfService>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    })
    .then((res: DataAPIResponse<TermOfService>) => {
      if (res.status_code !== 200) return res;

      // parse the content field from string to object
      // if JSON parse fails, return the original response
      try {
        return {
          ...res,
          data: {
            ...res.data,
            content: JSON.parse(res.data.content as string),
          },
        };
      } catch (e) {
        return res;
      }
    });
};

export default TermGet;
