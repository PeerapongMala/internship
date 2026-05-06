import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface AnnounceRewardFilterQueryParams extends BasePaginationAPIQueryParams {
  search?: string;
  title?: string;
}

export interface AnnounceRewardRepository {
  Get(
    query?: AnnounceRewardFilterQueryParams,
  ): Promise<PaginationAPIResponse<AnnouceReward>>;
  GetById(announceId: number): Promise<DataAPIResponse<AnnouceReward>>;
  Create(announce: DataAPIRequest<AnnouceReward>): Promise<DataAPIResponse<undefined>>;
  Update(
    announceId: number,
    announce: DataAPIRequest<AnnouceRewardUpdate>,
  ): Promise<DataAPIResponse<undefined>>;
  BulkEdit(
    announces: Pick<AnnouceReward, 'id' | 'status'>[],
  ): Promise<DataAPIResponse<undefined>>;
  DownloadCSV(query: {
    start_date: string;
    end_date: string;
  }): Promise<Blob | FailedAPIResponse>;
  UploadCSV(file: File): Promise<DataAPIResponse<undefined>>;
  DeleteItem(
    announceId: AnnouceReward['id'],
    itemId: AnnounceRewardItem['item_id'],
  ): Promise<BaseAPIResponse>;
  DeleteCoin(
    announceId: AnnouceReward['id'],
    coin_type: string,
  ): Promise<BaseAPIResponse>;
}
