import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import { AuthRepository } from '@domain/g00/g00-d00/local/api/repository/auth';

import LoginMock from './login/index.json';
import { ILoginRequest, ILoginResponse, IUserData } from '@domain/g00/g00-d00/local/type';

const AuthMock: AuthRepository = {
  Login: function (req: ILoginRequest): Promise<DataAPIResponse<IUserData[]>> {
    return new Promise((resolve, reject) => {
      resolve(LoginMock as DataAPIResponse<IUserData[]>);
    });
  },
};

export default AuthMock;
