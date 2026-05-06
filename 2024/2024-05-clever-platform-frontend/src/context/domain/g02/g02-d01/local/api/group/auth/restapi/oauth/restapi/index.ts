import {
  convertToDataResponse,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@core/helper/api-type';
import {
  BindLoginRequest,
  CheckCode,
  CheckSchool,
  CheckStudent,
  LoginWithLineResponse,
  LoginWithProviderResponse,
} from '@domain/g02/g02-d01/local/type';
import StoreGlobal from '@store/global';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

// transfer Oauth token to auth
export const CheckAuthWithProvider = (
  provider: 'line' | 'google',
  code: string,
): Promise<DataAPIResponse<CheckCode>> => {
  const url = `${backendURL}/game-arriving/v1/oauth/${provider}/profile?auth_code=${code}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<CheckCode>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    });
};
// เช็คว่า ผูกกันยัง
export const CheckBindProvider = (
  provider: 'line' | 'google',
  code: CheckCode,
): Promise<DataAPIResponse<LoginWithProviderResponse>> => {
  if (!provider) {
    console.error('Provider is undefined');
    return Promise.reject('Provider is undefined');
  }
  const url = `${backendURL}/game-arriving/v1/oauth/${provider}/login`;
  return fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify(code),
  })
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<LoginWithLineResponse>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    });
};
// check schoolid
export const CheckSchoolId = (
  School_code: string,
): Promise<DataAPIResponse<CheckSchool>> => {
  const url = `${backendURL}/game-arriving/v1/schools/existence?school_code=${School_code}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<CheckSchool>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    });
};

export const CheckStudentId = (
  school_code: string,
  student_id: string,
): Promise<DataAPIResponse<CheckStudent>> => {
  const param = new URLSearchParams({ school_code, student_id });
  const url = `${backendURL}/game-arriving/v1/students?${param.toString()}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<CheckStudent>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    });
};

// ผูก  + backend
export const BindLogin = (
  provider: 'line' | 'google',
  body: BindLoginRequest,
): Promise<DataAPIResponse<any>> => {
  const url = `${backendURL}/game-arriving/v1/oauth/${provider}/bind`;
  return fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<any>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    });
};
