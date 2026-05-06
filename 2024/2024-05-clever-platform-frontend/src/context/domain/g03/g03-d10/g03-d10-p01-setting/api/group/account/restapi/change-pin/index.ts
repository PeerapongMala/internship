import { BaseAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const AccountChangePIN = async (pin: string): Promise<BaseAPIResponse> => {
  const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

  const url = `${backendURL}/settings/v1/change-pin`;

  const res = await fetchWithAuth(url, {
    method: 'PATCH',
    body: JSON.stringify({ pin }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
};

export default AccountChangePIN;
