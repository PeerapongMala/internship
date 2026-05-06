import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface ItemQueryParams extends BasePaginationAPIQueryParams {
  search_text?: string;
  type?: ItemType;
}

export interface ItemRepository {
  Get(query?: ItemQueryParams): Promise<PaginationAPIResponse<Item>>;
  Create(item: DataAPIRequest<Item>): Promise<BaseAPIResponse>;
  Update(itemId: Item['id'], item: DataAPIRequest<Item>): Promise<BaseAPIResponse>;
  GetById(itemId: Item['id'], type: Item['type']): Promise<DataAPIResponse<Item>>;
  BulkEdit(
    bulk_edit_list: { id: Item['id']; status: Item['status'] }[],
  ): Promise<BaseAPIResponse>;
}
