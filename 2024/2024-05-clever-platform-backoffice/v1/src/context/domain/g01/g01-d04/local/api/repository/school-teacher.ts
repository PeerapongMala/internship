import {
  AdminLoginAsResponse,
  BulkUserUpdateRecord,
  CreatedTeacherRecord,
  TeacherAccess,
  TeacherClassLogRecord,
  TeacherRecord,
  TeacherTeachingLogRecord,
  UpdatedTeacherAccessRecord,
  UpdatedUserEntity,
  UpdatedUserResponse,
} from '../../type';
import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  BulkDataAPIRequest,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export type SchoolTeacherFilterQueryParams = BasePaginationAPIQueryParams & {
  id?: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export interface SchoolTeacherRepository {
  // g01-d04-a36: api teacher list
  Gets(
    schoolId: string,
    query: SchoolTeacherFilterQueryParams,
  ): Promise<PaginationAPIResponse<TeacherRecord>>;

  // g01-d04-a40 api-auth-case-admin-login-as
  AdminLoginAs(targetId: string): Promise<PaginationAPIResponse<AdminLoginAsResponse>>;

  // g01-d04-a42: api teacher get
  GetById(id: string): Promise<DataAPIResponse<TeacherRecord>>;

  // g01-d04-a41: api teacher create
  Create(
    teacher: DataAPIRequest<CreatedTeacherRecord>,
  ): Promise<DataAPIResponse<TeacherRecord>>;

  // g01-d04-a50: api user update
  Update(
    id: string,
    teacher: DataAPIRequest<UpdatedUserEntity>,
  ): Promise<DataAPIResponse<UpdatedUserResponse>>;

  // g01-d04-a58: api teacher access list
  AccessListGets(): Promise<PaginationAPIResponse<TeacherAccess>>;

  // g01-d04-a57: api teacher case update teacher accesses
  UpdateTeacherAccess(
    teacherId: string,
    access: DataAPIRequest<UpdatedTeacherAccessRecord>,
  ): Promise<DataAPIResponse<number[]>>;

  // g01-d04-a52: api user case bulk edit
  BulkUpdate(data: BulkDataAPIRequest<BulkUserUpdateRecord>): Promise<BaseAPIResponse>;

  // g01-d04-a37: api teacher case download csv
  DownloadCSV(
    schoolId: string,
    query: DataAPIRequest<{ start_date: string; end_date: string }>,
  ): Promise<Blob>;

  // g01-d04-a38: api teacher case upload csv
  UploadCSV(
    schoolId: string,
    data: DataAPIRequest<{ csv_file: File }>,
  ): Promise<BaseAPIResponse>;

  // g01-d04-a51: api auth email password update
  ResetPassword(data: { user_id: string; password: string }): Promise<BaseAPIResponse>;

  // g01-d04-a46: api teacher case list teaching log
  ListTeachingLog(
    teacherId: string,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<TeacherTeachingLogRecord>>;

  // g01-d04-a47: api teacher case list class log
  ListClassLog(
    teacherId: string,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<TeacherClassLogRecord>>;
}
