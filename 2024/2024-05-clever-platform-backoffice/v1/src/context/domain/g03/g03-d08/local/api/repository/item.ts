import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { Subject } from '../type';

export interface ItemQueryParams extends BasePaginationAPIQueryParams {
  school_id?: number;
  search_text?: string;
  type?: ItemType;
}

export interface ItemRepository {
  GetGroup(query?: BasePaginationAPIQueryParams): Promise<PaginationAPIResponse<Subject>>;
  GetGroupById(subjectId: Subject['id']): Promise<DataAPIResponse<Subject>>;
  Get(subjectId: number, query?: ItemQueryParams): Promise<PaginationAPIResponse<Item>>;
  Create(subjectId: number, item: DataAPIRequest<Item>): Promise<BaseAPIResponse>;
  Update(itemId: Item['id'], item: DataAPIRequest<Item>): Promise<BaseAPIResponse>;
  GetById(itemId: Item['id'], item: DataAPIRequest<Item>): Promise<DataAPIResponse<Item>>;
  BulkEdit(
    bulk_edit_list: { id: Item['id']; status: Item['status'] }[],
  ): Promise<BaseAPIResponse>;
  GetTemplate(type: Item['type']): Promise<PaginationAPIResponse<Item>>;
}
