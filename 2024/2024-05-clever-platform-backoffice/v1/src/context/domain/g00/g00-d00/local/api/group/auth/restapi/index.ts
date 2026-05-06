import { ILoginRequest, ILoginResponse, IUserData } from '@domain/g00/g00-d00/local/type';
import { AuthRepository } from '../../../repository/auth';
import { DataAPIResponse, FailedAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const AuthRestAPI: AuthRepository = {
  Login: function (
    req: ILoginRequest,
  ): Promise<DataAPIResponse<IUserData[]> | FailedAPIResponse> {
    const url = `${BACKEND_URL}/arriving/v1/auth/login/email-password`;

    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    })
      .then((res) => {
        return res.json();
      })
      .then((res: DataAPIResponse<IUserData[]> | FailedAPIResponse) => {
        return res;
      });
  },
};

export default AuthRestAPI;
