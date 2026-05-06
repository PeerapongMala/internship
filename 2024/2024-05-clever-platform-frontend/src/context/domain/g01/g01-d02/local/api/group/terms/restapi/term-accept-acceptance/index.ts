import { BaseAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const tosId = StoreGlobal.StateGetAllWithUnsubscribe().tosId;

const TermAcceptAcceptance = (): Promise<BaseAPIResponse> => {
  return fetchWithAuth(`${backendURL}/terms/v1/accept`, {
    method: 'POST',
    body: JSON.stringify({
      tos_id: tosId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res: BaseAPIResponse) => {
      return res;
    });
};

export default TermAcceptAcceptance;
