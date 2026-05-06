import { DataAPIResponse } from '@core/helper/api-type';
import {
  BindLoginRequest,
  CheckAdminDataResponse,
  CheckAdminRequest,
  CheckCode,
  CheckSchool,
  CheckStudent,
  LoginAsAdminDataResponse,
  LoginAsAdminRequest,
  LoginWithPinDataResponse,
  LoginWithPinRequest,
  LoginWithProviderResponse,
} from '../type';

export interface RepositoryPatternInterface {
  Auth: {
    LoginWithPin: (
      body: LoginWithPinRequest,
    ) => Promise<DataAPIResponse<LoginWithPinDataResponse>>;
    LoginAsAdmin: (
      body: LoginAsAdminRequest,
    ) => Promise<DataAPIResponse<LoginAsAdminDataResponse>>;
    CheckAdmin: (
      body: CheckAdminRequest,
    ) => Promise<DataAPIResponse<CheckAdminDataResponse>>;
    CheckAuthWithProvider: (
      provider: 'line' | 'google',
      code: string,
    ) => Promise<DataAPIResponse<CheckCode>>;
    CheckBindProvider: (
      provider: 'line' | 'google',
      code: CheckCode,
    ) => Promise<DataAPIResponse<LoginWithProviderResponse>>;
    CheckSchoolId: (School_code: string) => Promise<DataAPIResponse<CheckSchool>>;
    CheckStudentId: (
      school_code: string,
      student_id: string,
    ) => Promise<DataAPIResponse<CheckStudent>>;
    BindLogin: (
      provider: 'line' | 'google',
      body: BindLoginRequest,
    ) => Promise<DataAPIResponse<any>>;
  };
}
