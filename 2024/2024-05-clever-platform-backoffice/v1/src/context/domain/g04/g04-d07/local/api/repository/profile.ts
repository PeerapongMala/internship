import { BaseAPIResponse, DataAPIResponse, DataDetailAPIResponse } from '../helper';

export interface ICreateBugReportQueryParams {
  page?: string | number;
  limit?: string | number;
  status?: string | undefined;
  platform?: string;
  type?: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
  search_text?: string;
}

export interface IGetProfileDataProps {
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
}

export interface IUpdateProfileState extends IGetProfileDataProps {
  profile_image: File;
}

export interface IUpdateProfileReq {
  title: string;
  first_name: string;
  last_name: string;
  profile_image: any;
}

export interface IUpdateProfileReq {
  title: string;
  first_name: string;
  last_name: string;
  profile_image: any;
}

export interface IUpdatePasswordReq {
  password: string;
}

export interface ProfileRestAPITranslationRepository {
  GetG04D07A01: () => Promise<DataAPIResponse<IGetProfileDataProps>>;
  PATCHG04D07A02: (
    data: FormData,
  ) => Promise<DataDetailAPIResponse<IGetProfileDataProps>>;
  PATCHG04D07A03: (data: IUpdatePasswordReq) => Promise<BaseAPIResponse>;
}
