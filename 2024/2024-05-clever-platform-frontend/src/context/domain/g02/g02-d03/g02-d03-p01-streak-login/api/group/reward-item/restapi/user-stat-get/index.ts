import { DataAPIResponse } from '@core/helper/api-type';
import { UserStat } from '@domain/g02/g02-d03/g02-d03-p01-streak-login/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const UserStatGet = async (subjectId: string): Promise<DataAPIResponse<UserStat>> => {
  const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
  const url = `${backendURL}/streak-login/v1/user-stat/${subjectId}`;

  const response = await fetchWithAuth(url, {
    method: 'GET',
  });

  return await response.json();
};

export default UserStatGet;
