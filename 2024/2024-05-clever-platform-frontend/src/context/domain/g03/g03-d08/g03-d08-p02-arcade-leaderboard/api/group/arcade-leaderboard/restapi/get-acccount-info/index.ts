import { DataAPIResponse } from '@core/helper/api-type';
import { UserDetail } from '@domain/g02/g02-d03/g02-d03-p01-streak-login/type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobal from '@store/global';

const AccountInfoGet = async (): Promise<DataAPIResponse<UserDetail>> => {
  const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;
  const url = `${backendURL}/arcade-game/v1/arcade-game/student/info`;

  const response = await fetchWithAuth(url, {
    method: 'GET',
  });

  return await response.json();
};

export default AccountInfoGet;
