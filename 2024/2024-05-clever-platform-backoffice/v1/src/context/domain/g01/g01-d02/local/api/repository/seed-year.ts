import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { SeedYear } from '../../type';

export interface SeedYearFilterQueryParams extends BasePaginationAPIQueryParams {
  id?: SeedYear['id'];
  name?: SeedYear['name'];
  short_name?: SeedYear['short_name'];
}

export interface SeedYearRepository {
  BulkEdit(
    bulk_edit_list: {
      seed_year_id: SeedYear['id'];
      status: SeedYear['status'];
    }[],
  ): Promise<
    DataAPIResponse<{ seed_year_id: SeedYear['id']; status: SeedYear['status'] }[]>
  >;
  Get(query?: SeedYearFilterQueryParams): Promise<PaginationAPIResponse<SeedYear>>;
  DownloadCSV(query?: {
    start_date?: string;
    end_date?: string;
  }): Promise<Blob | FailedAPIResponse>;
  UploadCSV(file: File): Promise<BaseAPIResponse>;
  Update(
    seedYearId: SeedYear['id'],
    data: DataAPIRequest<SeedYear>,
  ): Promise<DataAPIResponse<SeedYear>>;
  Create(data: DataAPIRequest<SeedYear>): Promise<DataAPIResponse<SeedYear>>;
  GetById(seedYearId: SeedYear['id']): Promise<DataAPIResponse<SeedYear>>;
}
