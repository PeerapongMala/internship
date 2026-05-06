import { StoreItem } from '../type';
import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface StoreItemQueryParams extends BasePaginationAPIQueryParams {
  school_id?: string;
  search_text?: string;
  type?: ItemType;
  status?: string;
}

export interface StoreItemRepository {
  Get(
    subjectId: number,
    query?: StoreItemQueryParams,
  ): Promise<PaginationAPIResponse<StoreItem>>;
  Create(
    subjectId: number,
    store_item: DataAPIRequest<StoreItem>,
  ): Promise<DataAPIResponse<StoreItem>>;
  Update(
    subjectId: number,
    store_item_id: StoreItem['id'],
    store_item: DataAPIRequest<StoreItem>,
  ): Promise<DataAPIResponse<StoreItem>>;
  UpdateStatus(
    store_item_id: StoreItem['id'],
    status: StoreItem['status'],
  ): Promise<DataAPIResponse<StoreItem>>;
  GetById(
    subjectId: number,
    store_item_id: StoreItem['id'],
  ): Promise<DataAPIResponse<StoreItem>>;
  BulkEdit(
    bulk_edit_list: { id: StoreItem['id']; status: StoreItem['status'] }[],
  ): Promise<BaseAPIResponse>;
}
