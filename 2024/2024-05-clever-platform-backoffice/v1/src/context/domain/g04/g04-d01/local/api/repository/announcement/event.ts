import {
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface AnnounceEventFilterQueryParams extends BasePaginationAPIQueryParams {
  search?: string;
  title?: string;
}

export interface AnnounceEventRepository {
  Get(
    query?: AnnounceEventFilterQueryParams,
  ): Promise<PaginationAPIResponse<AnnouceEvent>>;
  GetById(announceId: number): Promise<DataAPIResponse<AnnouceEvent>>;
  Create(announce: DataAPIRequest<AnnouceEvent>): Promise<DataAPIResponse<undefined>>;
  Update(
    announceId: number,
    announce: DataAPIRequest<AnnouceEvent>,
  ): Promise<DataAPIResponse<undefined>>;
  BulkEdit(
    announces: Pick<AnnouceEvent, 'id' | 'status'>[],
  ): Promise<DataAPIResponse<undefined>>;
  DownloadCSV(query: {
    start_date: string;
    end_date: string;
  }): Promise<Blob | FailedAPIResponse>;
  UploadCSV(file: File): Promise<DataAPIResponse<undefined>>;
}
