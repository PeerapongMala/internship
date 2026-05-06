import { CopyShop, NewStoreItem, StoreItem } from '../types/shop';
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
  Create(subjectId: number, formData: FormData): Promise<DataAPIResponse<NewStoreItem>>;
  Update(
    subjectId: number,
    store_id: StoreItem['id'],
    formData: FormData,
  ): Promise<DataAPIResponse<NewStoreItem>>;
  UpdateStatus(
    store_item_id: StoreItem['id'],
    status: StoreItem['status'],
  ): Promise<DataAPIResponse<StoreItem>>;
  GetById(
    subjectId: number,
    store_item_id: StoreItem['id'],
  ): Promise<DataAPIResponse<NewStoreItem>>;
  BulkEdit(
    bulk_edit_list: { id: StoreItem['id']; status: StoreItem['status'] }[],
  ): Promise<BaseAPIResponse>;
  CopyByIdShop: (
    teacherShopItemId: string,
    query: any,
  ) => Promise<PaginationAPIResponse<CopyShop>>;
}
