import { StoreItem, StoreTransaction } from '../types/shop';
import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface StoreTransactionQueryParams extends BasePaginationAPIQueryParams {
  search_text?: string;
  type?: ItemType;
  status?: string;
}

export interface StoreTransactionRepository {
  Get(
    store_id: StoreItem['id'],
    query?: StoreTransactionQueryParams,
  ): Promise<PaginationAPIResponse<StoreTransaction>>;
  UpdateStatus(
    id: StoreTransaction['id'],
    status: StoreTransaction['status'],
  ): Promise<DataAPIResponse<StoreTransaction>>;
  BulkEdit(
    bulk_edit_list: {
      id: StoreTransaction['id'];
      status: StoreTransaction['status'];
    }[],
  ): Promise<BaseAPIResponse>;
}
