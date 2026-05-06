import { BulkUserUpdateRecord, IObserverResponse, UpdatedUserResponse } from '../../type';
import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  BulkDataAPIRequest,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export type SchoolObserverFilterQueryParams = BasePaginationAPIQueryParams & {
  id?: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  observer_access_id?: string | number;
};

// declare generic type
export interface SchoolObserverRepository {
  // g01-d04-a53: api observer list
  Gets(
    schoolId: string,
    query: SchoolObserverFilterQueryParams,
  ): Promise<PaginationAPIResponse<any>>;
  // g01-d04-a54: api observer get
  GetById(id: string): Promise<DataAPIResponse<any>>;
  // g01-d04-a55: api observer create
  Create(observer: FormData): Promise<DataAPIResponse<IObserverResponse>>;
  // g01-d04-a50: api user update
  Update(id: string, observer: FormData): Promise<DataAPIResponse<UpdatedUserResponse>>;
  // g01-d04-a51: api auth email password update
  UpdatePassword(data: { user_id: string; password: string }): Promise<BaseAPIResponse>;
  // a11-api-observer-access-list: get list observer access
  GetObserverAccessList(): Promise<PaginationAPIResponse<any>>;
  // g01-d04-a52: api user case bulk edit
  BulkEdit(data: BulkDataAPIRequest<BulkUserUpdateRecord>): Promise<BaseAPIResponse>;
  // g01-d04-a66: api observer case download csv
  DownloadCSV(
    schoolId: string,
    query: DataAPIRequest<{ start_date: string; end_date: string }>,
  ): Promise<Blob>;
  // g01-d04-a67: api observer case upload csv
  UploadCSV(
    schoolId: string,
    data: DataAPIRequest<{ csv_file: File }>,
  ): Promise<BaseAPIResponse>;
  // Update observer accesses
  UpdateObserverAccesses(
    observerId: string,
    accessIds: number[],
  ): Promise<BaseAPIResponse>;
}
