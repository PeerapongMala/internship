import { DataAPIResponse } from '@core/helper/api-type';
import { GoldCoinResponse } from '@domain/g02/g02-d03/g02-d03-p01-streak-login/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const GoldCoinGet = async (): Promise<DataAPIResponse<GoldCoinResponse>> => {
  const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
  const url = `${backendURL}/level/v1/gold-coin`;

  const response = await fetchWithAuth(url, {
    method: 'GET',
  });

  return await response.json();
};

export default GoldCoinGet;
