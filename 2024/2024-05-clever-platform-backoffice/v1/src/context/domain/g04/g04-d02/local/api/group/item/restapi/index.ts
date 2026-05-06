import {
  BaseAPIResponse,
  DataAPIRequest,
  DataAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { ItemQueryParams, ItemRepository } from '../../../repository/item';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const ItemRestAPI: ItemRepository = {
  Get: function (query: ItemQueryParams = {}): Promise<PaginationAPIResponse<Item>> {
    let url = `${BACKEND_URL}/items/v1/item`;
    if (query.type == 'badge') {
      url = `${BACKEND_URL}/items/v1/item/badge/lists`;
    }

    const params = getQueryParams({
      ...query,
      status: query.status || undefined,
    });
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Item>) => {
        return res as PaginationAPIResponse<Item>;
      });
  },
  Create: function (item: DataAPIRequest<Item>): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/items/v1/item`;
    if (item.type == 'badge') {
      url = `${BACKEND_URL}/items/v1/item/badge`;
    }
    const formData = getItemFormData(item);
    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: BaseAPIResponse) => {
        return res;
      });
  },
  Update: function (
    itemId: Item['id'],
    item: DataAPIRequest<Item>,
  ): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/items/v1/item`;
    if (item.type == 'badge') {
      url = `${BACKEND_URL}/items/v1/item/badge`;
    }
    const formData = getItemFormData(item);
    if (item.school_id) {
      formData.append('school_id', item.school_id.toString());
    }
    formData.append('id', itemId.toString());

    return fetchWithAuth(url, {
      method: 'PATCH',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: BaseAPIResponse) => {
        return res;
      });
  },
  GetById: function (
    itemId: Item['id'],
    type: Item['type'],
  ): Promise<DataAPIResponse<Item>> {
    let url = `${BACKEND_URL}/items/v1/item/${itemId}`;
    if (type == 'badge') {
      url = `${BACKEND_URL}/items/v1/item/badge/${itemId}`;
    }

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<Item[]>) => {
        if (res.status_code == 200 && Array.isArray(res.data)) {
          return { ...res, data: res.data?.[0] };
        }
        return res as DataAPIResponse<Item>;
      });
  },
  BulkEdit: function (
    bulk_edit_list: { id: Item['id']; status: Item['status'] }[],
  ): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/items/v1/item/bulk-edit`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ bulk_edit_list }),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
};

export default ItemRestAPI;

function getItemFormData(data: DataAPIRequest<Item>) {
  const formData = new FormData();
  const keys = [
    'type',
    'name',
    'description',
    'image',
    'image_url',
    'status',
    'template_path',
    'badge_description',
  ] as const;

  for (let key of keys) {
    if (data[key] != undefined) {
      if (typeof data[key] == 'object') {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key].toString());
      }
    }
  }
  return formData;
}
