import { DataAPIResponse, getQueryParams } from '@global/utils/apiResponseHelper';
import { ItemRepository } from '../../../repository/item';
import { Item } from '../../../type';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const ItemRestAPI: ItemRepository = {
  Get: function (type: ItemType): Promise<DataAPIResponse<Item[]>> {
    let url = `${BACKEND_URL}/items/v1/item`;
    const params = getQueryParams({ type, limit: -1 });
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        if (res.status == 200) {
          res.data = res.data || [];
        }
        return res;
      });
  },
};

export default ItemRestAPI;
