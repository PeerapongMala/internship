import { DataAPIResponse, FailedAPIResponse } from '../type.ts';

export interface ILoginRequest {
  school_code: string;
  student_id: string;
  pin: string;
}

export interface IUserData {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  school_id: string;
  school_name: string | null;
  school_code: string | null;
  school_image_url: string | null;
  image_url: string | null;
  access_token: string;
}

export interface AuthRepository {
  Login(req: ILoginRequest): Promise<DataAPIResponse<IUserData[]> | FailedAPIResponse>;
}
