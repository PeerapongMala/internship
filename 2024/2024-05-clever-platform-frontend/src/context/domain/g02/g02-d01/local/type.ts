export interface UserData {
  id: string;
  student_id: string;
  school_id: string;
  school_name: string;
  school_code: string;
  school_image?: string | null;
  family_id?: number;
  family_owner?: string | null;
  title: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
  temp_image?: string | null;
}

export interface LoginWithPinRequest {
  school_code: string;
  student_id: string;
  pin: string;
}

export interface LoginWithPinDataResponse extends Omit<UserData, 'temp_image'> {
  access_token: string;
}

export interface UserWithPinDataResponse
  extends Omit<LoginWithPinDataResponse, 'access_token'> {
  pin: string;
}

export interface LoginAsAdminRequest {
  email: string;
  password: string;
  school_code: string;
  student_id: string;
}

export interface LoginAsAdminDataResponse extends UserData {
  access_token: string;
  admin_id: string;
  admin_title: string;
  admin_first_name: string;
  admin_last_name: string;
}

export interface CheckCode {
  provider_access_token: string;
  provider?: 'line' | 'google';
}
export interface LoginWithLineResponse extends UserData {
  access_token: string;
  provider?: 'line' | 'google';
}

export interface LoginWithProviderResponse extends UserData {
  access_token: string;
  provider?: 'line' | 'google';
}

export interface School_Id {
  school_id: string;
}
export interface CheckSchool {
  is_exists: boolean;
}

export interface CheckStudent {
  title: string;
  first_name: string;
  last_name: string;
  image_path: string | null;
}

export interface BindLoginRequest {
  school_code: string;
  student_id: string;
  pin: string;
  provider_access_token?: string;
  provider?: 'line' | 'google';
}

export interface CheckAdminRequest {
  email: string;
  password: string;
}

export interface CheckAdminDataResponse {
  is_admin: boolean;
}
