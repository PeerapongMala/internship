import fetchWithAuth from '@global/utils/fetchWithAuth';
import { DataAPIResponse, FailedAPIResponse } from '@global/utils/apiResponseHelper';

interface IUserData {
  access_token: string;
  [key: string]: any;
}
interface ILoginWithOauthRequest {
  provider_access_token: string;
}

interface IBindStudentWithOauthRequest {
  school_code: string;
  student_id: string;
  pin: string;
  provider_access_token: string;
}

interface IBindUserWithOauthRequest {
  email: string;
  password: string;
  provider_access_token: string;
}

interface IRegisterParentRequest {
  provider: string; // 'line' (or others if extended)
  provider_access_token: string;
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  birth_date?: string;
  relationship?: string;
}
// #endregion

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

/**
 * A collection of methods that call the given endpoints from the Postman JSON.
 */
const AuthLineArrivingAPI = {
  /**
   * a01-api-auth-case-login-with-oauth
   * POST /line-arriving/v1/oauth/line/login
   */
  async loginWithOauth(
    req: ILoginWithOauthRequest,
  ): Promise<DataAPIResponse<IUserData[]> | FailedAPIResponse> {
    const url = `${BACKEND_URL}/line-arriving/v1/oauth/line/login/user`;

    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    return response.json();
  },

  /**
   * a02-api-auth-case-bind-student-with-oauth
   * POST /line-arriving/v1/oauth/line/bind
   */
  async bindStudentWithOauth(
    req: IBindStudentWithOauthRequest,
  ): Promise<DataAPIResponse<IUserData[]> | FailedAPIResponse> {
    const url = `${BACKEND_URL}/line-arriving/v1/oauth/line/bind/student`;

    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    return response.json();
  },

  /**
   * a03-api-auth-case-bind-user-with-oauth
   * POST /line-arriving/v1/oauth/line/bind/user
   *
   * NOTE:
   * In your "teacher login" page, you're calling this method as `API.Login(...)`.
   * That page supplies { email, password, provider_access_token } in the request body.
   */
  async Login(
    req: IBindUserWithOauthRequest,
  ): Promise<DataAPIResponse<IUserData[]> | FailedAPIResponse> {
    const url = `${BACKEND_URL}/line-arriving/v1/oauth/line/bind/user`;

    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    return response.json();
  },

  /**
   * a04-api-parent-case-register
   * POST /line-arriving/v1/parent/register
   */
  async registerParent(
    req: IRegisterParentRequest,
  ): Promise<DataAPIResponse<IUserData[]> | FailedAPIResponse> {
    const url = `${BACKEND_URL}/line-arriving/v1/parent/register`;

    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    return response.json();
  },
};

export default AuthLineArrivingAPI;
