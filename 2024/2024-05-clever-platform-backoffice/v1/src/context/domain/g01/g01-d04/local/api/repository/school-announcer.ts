import {
  BulkEditRequest,
  BulkUserUpdateRecord,
  CreatedSchoolAnnouncer,
  SchoolAnnouncer,
  UpdatedUserEntity,
  UpdatedUserResponse,
} from '@domain/g01/g01-d04/local/type.ts';
import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  BulkDataAPIRequest,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export type SchoolAnnouncerFilterQueryParams = BasePaginationAPIQueryParams & {
  first_name?: string;
  last_name?: string;
};

export interface SchoolAnnouncerRepository {
  // g01-d04-a48: api announcer list
  Gets(
    schoolId: string,
    query: SchoolAnnouncerFilterQueryParams,
  ): Promise<PaginationAPIResponse<SchoolAnnouncer>>;
  // g01-d04-a56: api user get
  GetById(announcerId: string): Promise<DataAPIResponse<SchoolAnnouncer>>;
  // g01-d04-a52: api user case bulk edit
  BulkEdit(data: BulkDataAPIRequest<BulkUserUpdateRecord>): Promise<BaseAPIResponse>;
  // g01-d04-a49: api announcer create
  Create(
    data: DataAPIRequest<CreatedSchoolAnnouncer>,
  ): Promise<DataAPIResponse<SchoolAnnouncer>>;
  // g01-d04-a50: api user update
  Update(
    announcerId: string,
    data: DataAPIRequest<UpdatedUserEntity>,
  ): Promise<DataAPIResponse<UpdatedUserResponse>>;
  // g01-d04-a51: api auth email password update
  UpdatePassword(data: { user_id: string; password: string }): Promise<BaseAPIResponse>;
  // g01-d04-a64: api announcer case download csv
  DownloadCSV(
    schoolId: string,
    query: DataAPIRequest<{ start_date: string; end_date: string }>,
  ): Promise<Blob>;
  // g01-d04-a65: api announcer case upload csv
  UploadCSV(
    schoolId: string,
    data: DataAPIRequest<{ csv_file: File }>,
  ): Promise<BaseAPIResponse>;
}
