import {
  convertToDataResponse,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@core/helper/api-type';
import {
  LoginAsAdminDataResponse,
  LoginAsAdminRequest,
} from '@domain/g02/g02-d01/local/type';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const LoginAsAdmin = (
  body: LoginAsAdminRequest,
): Promise<DataAPIResponse<LoginAsAdminDataResponse>> => {
  const url = `${backendURL}/game-arriving/v1/login/admin-login-as`;
  return fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<LoginAsAdminDataResponse>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    });
};

export default LoginAsAdmin;
