import { DataAPIResponse } from '@core/helper/api-type';
import { RewardList } from '@domain/g02/g02-d03/g02-d03-p01-streak-login/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const RewardListGet = async (
  subjectId: string,
): Promise<DataAPIResponse<RewardList[]>> => {
  const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
  const url = `${backendURL}/streak-login/v1/subject-reward-status/${subjectId}`;

  const response = await fetchWithAuth(url, {
    method: 'GET',
  });

  return await response.json();
};

export default RewardListGet;
