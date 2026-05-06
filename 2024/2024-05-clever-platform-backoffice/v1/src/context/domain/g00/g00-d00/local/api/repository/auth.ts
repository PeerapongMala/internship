import { ILoginRequest, ILoginResponse, IUserData } from '../../type';
import { DataAPIResponse, FailedAPIResponse } from '@global/utils/apiResponseHelper';

export interface AuthRepository {
  Login(req: ILoginRequest): Promise<DataAPIResponse<IUserData[]> | FailedAPIResponse>;
}
