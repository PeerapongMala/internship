import {
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface AnnounceNotificationFilterQueryParams
  extends BasePaginationAPIQueryParams {
  search?: string;
  title?: string;
}

export interface AnnounceNotificationRepository {
  Get(
    query?: AnnounceNotificationFilterQueryParams,
  ): Promise<PaginationAPIResponse<AnnouceNotification>>;
  GetById(announceId: number): Promise<DataAPIResponse<AnnouceNotification>>;
  Create(
    announce: DataAPIRequest<AnnouceNotification>,
  ): Promise<DataAPIResponse<undefined>>;
  Update(
    announceId: number,
    announce: DataAPIRequest<AnnouceNotification>,
  ): Promise<DataAPIResponse<undefined>>;
  BulkEdit(
    announces: Pick<AnnouceNotification, 'id' | 'status'>[],
  ): Promise<DataAPIResponse<undefined>>;
  DownloadCSV(query: {
    start_date: string;
    end_date: string;
  }): Promise<Blob | FailedAPIResponse>;
  UploadCSV(file: File): Promise<DataAPIResponse<undefined>>;
}
