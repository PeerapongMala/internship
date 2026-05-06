import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { ItemQueryParams, ItemRepository } from '../../../repository/item';
import { Subject } from '../../../type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const ItemRestAPI: ItemRepository = {
  GetGroup: function (
    query: BasePaginationAPIQueryParams = {},
  ): Promise<PaginationAPIResponse<Subject>> {
    let url = `${BACKEND_URL}/teacher-item/v1/teacher-item-groups`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Subject>) => {
        return res as PaginationAPIResponse<Subject>;
      });
  },
  GetGroupById: function (subjectId: Subject['id']): Promise<DataAPIResponse<Subject>> {
    let url = `${BACKEND_URL}/teacher-item/v1/teacher-item-groups`;
    const params = getQueryParams({
      id: subjectId,
    });
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        if (res.status_code == 200 && Array.isArray(res.data)) {
          return { ...res, data: res.data?.[0] };
        }
        return res as DataAPIResponse<Subject>;
      });
  },
  Get: function (
    subjectId: number,
    query: ItemQueryParams = {},
  ): Promise<PaginationAPIResponse<Item>> {
    let url = `${BACKEND_URL}/teacher-item/v1/subjects/${subjectId}/items`;
    const params = getQueryParams({
      ...query,
      status: query.status || undefined,
      school_id: query.school_id || undefined,
    });
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Item>) => {
        return res as PaginationAPIResponse<Item>;
      });
  },
  Create: function (
    subjectId: number,
    item: DataAPIRequest<Item>,
  ): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/teacher-item/v1/subjects/${subjectId}/items`;
    const formData = getItemFormData(item);
    if (item.image_url) {
      formData.append('default_image', item.image_url);
    }
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
    let url = `${BACKEND_URL}/teacher-item/v1/items/${itemId}`;
    const formData = getItemFormData(item);
    if (item.school_id) {
      formData.append('school_id', item.school_id.toString());
    }
    if (item.image_url) formData.append('default_image', item.image_url);

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
    item: DataAPIRequest<Item>,
  ): Promise<DataAPIResponse<Item>> {
    let url = `${BACKEND_URL}/teacher-item/v1/items/${itemId}`;
    if (item) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(item)) {
        params.append(key, String(value));
      }
      url += `?${params.toString()}`;
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
    let url = `${BACKEND_URL}/teacher-item/v1/items/bulk-edit`;
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
  GetTemplate: function (
    itemType: Item['type'] = 'badge',
  ): Promise<PaginationAPIResponse<Item>> {
    let url = `${BACKEND_URL}/teacher-item/v1/template-items`;
    const params = getQueryParams({ type: itemType, limit: -1 });
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Item>) => {
        return res as PaginationAPIResponse<Item>;
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
    'template_item_id',
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
