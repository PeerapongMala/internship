import { DataAPIResponse, getQueryParams } from '@global/utils/apiResponseHelper';
import { ItemRepository } from '../../../repository/item';
import { Item } from '../../../types/shop';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const ItemRestAPI: ItemRepository = {
  Get: function (subjectId: number, type: ItemType): Promise<DataAPIResponse<Item[]>> {
    let url = `${BACKEND_URL}/teacher-item/v1/subjects/${subjectId}/items`;
    const params = getQueryParams({ type });
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        if (res.status_code == 200) {
          res.data = res.data || [];
        }
        return res || [];
      });
  },
};

export default ItemRestAPI;
