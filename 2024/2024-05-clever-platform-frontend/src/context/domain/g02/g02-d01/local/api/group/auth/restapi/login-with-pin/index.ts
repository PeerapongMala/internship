import {
  convertToDataResponse,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@core/helper/api-type';
import {
  LoginWithPinDataResponse,
  LoginWithPinRequest,
} from '@domain/g02/g02-d01/local/type';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

const LoginWithPin = (
  body: LoginWithPinRequest,
): Promise<DataAPIResponse<LoginWithPinDataResponse>> => {
  const url = `${backendURL}/game-arriving/v1/login/pin`;
  return fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<LoginWithPinDataResponse>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    });
};

export default LoginWithPin;
