import {
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface AnnounceGlobalFilterQueryParams extends BasePaginationAPIQueryParams {
  search?: string;
  title?: string;
}

export interface AnnounceGlobalRepository {
  Get(
    query?: AnnounceGlobalFilterQueryParams,
  ): Promise<PaginationAPIResponse<AnnouceSystem>>;
  GetById(announceId: number): Promise<DataAPIResponse<AnnouceSystem>>;
  Create(announce: DataAPIRequest<AnnouceSystem>): Promise<DataAPIResponse<undefined>>;
  Update(
    announceId: number,
    announce: DataAPIRequest<AnnouceSystem>,
  ): Promise<DataAPIResponse<undefined>>;
  BulkEdit(
    announces: Pick<AnnouceSystem, 'id' | 'status'>[],
  ): Promise<DataAPIResponse<undefined>>;
  DownloadCSV(query: {
    start_date: string;
    end_date: string;
  }): Promise<Blob | FailedAPIResponse>;
  UploadCSV(file: File): Promise<DataAPIResponse<undefined>>;
}
