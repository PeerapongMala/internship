import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import { Item } from '../type';

export interface ItemRepository {
  Get(type: ItemType): Promise<DataAPIResponse<Item[]>>;
}
