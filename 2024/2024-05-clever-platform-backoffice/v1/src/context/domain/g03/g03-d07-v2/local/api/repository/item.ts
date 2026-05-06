import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import { Item } from '../types/shop';

export interface ItemRepository {
  Get(subjectId: number, type: ItemType): Promise<DataAPIResponse<Item[]>>;
}
