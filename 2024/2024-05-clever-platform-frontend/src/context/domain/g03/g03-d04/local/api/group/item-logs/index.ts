import { DataAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { RewardItem } from '../../../types';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

export const ItemLogsAll = async (): Promise<DataAPIResponse<RewardItem[]>> => {
  const url = `${backendURL}/main-menu/custom-avatar/custom-avatar/v1/reward-logs`;
  const res = await fetchWithAuth(url, {
    method: 'GET',
  });
  const res_1 = await res.json();
  console.log(res_1);
  return res_1;
};
