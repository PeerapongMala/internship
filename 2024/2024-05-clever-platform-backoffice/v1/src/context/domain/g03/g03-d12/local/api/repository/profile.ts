import { BaseAPIResponse, DataAPIResponse } from '../helper';

export interface IGetProfileTeacherDataProps {
  id: string;
  email: string;
  title: string;
  first_name: string;
  last_name: string;
  id_number: string;
  image_url: string;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  last_login: string;
  line_user_id: string;
}

export interface IUpdateProfileState extends IGetProfileTeacherDataProps {
  profile_image: File;
}

export interface IUpdateTeacherProfileReq {
  title: string;
  first_name: string;
  last_name: string;
  profile_image: any;
  status: string;
}

export interface ITeacherUpdateRes {
  id: string;
  email: string;
  title: string;
  first_name: string;
  last_name: string;
  id_number: any;
  image_url: string;
  status: string;
  created_at: string;
  created_by: any;
  updated_at: string;
  updated_by: string;
  last_login: any;
}

export interface IUpdatePasswordReq {
  password: string;
}

export interface IUpdateTeacherAuth {
  provider: string;
}

export interface ProfileTeacherRestAPITranslationRepository {
  GetG03D12A01: () => Promise<DataAPIResponse<IGetProfileTeacherDataProps>>;
  PATCHG03D12A02: (data: IUpdatePasswordReq) => Promise<BaseAPIResponse>;
  PATCHG03D12A03: (data: FormData) => Promise<DataAPIResponse<ITeacherUpdateRes>>;
  PATCHG03D12A04: (data: IUpdateTeacherAuth) => Promise<BaseAPIResponse>;
}
