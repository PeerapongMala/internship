import { AuthRepository, ILoginRequest, IUserData } from './auth-repository.ts';
import { DataAPIResponse, FailedAPIResponse } from '../type.ts';

// ✅ ใช้ค่าโดยตรงแทนการ import จาก index.ts เพื่อหลีกเลี่ยง circular dependency
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8001';

const AuthRestAPI: AuthRepository = {
  Login: function (
    req: ILoginRequest,
  ): Promise<DataAPIResponse<IUserData[]> | FailedAPIResponse> {
    const url = `${BACKEND_URL}/game-arriving/v1/login/pin`;

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
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

export { AuthRestAPI };
