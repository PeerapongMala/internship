import {
  PaginationAPIResponse,
  DataAPIRequest,
  DataAPIResponse,
  BaseAPIResponse,
  FailedAPIResponse,
} from '@global/utils/apiResponseHelper';
import { ItemQueryParams, ItemRepository } from '../../../repository/item';
import { searchInRow } from '@global/utils/filters';

import _MOCK_DATA from './data.json';
let MOCK_DATA = _MOCK_DATA as Item[];

const ItemMock: ItemRepository = {
  Get: function (query: ItemQueryParams = {}): Promise<PaginationAPIResponse<Item>> {
    const items = MOCK_DATA.filter((item) => {
      let yes = true;
      if (query.search_text) {
        yes = searchInRow(query.search_text, item);
      }
      if (query.status && query.type) {
        yes = item.status === query.status && item.type === query.type;
      } else if (query.status) {
        yes = item.status === query.status;
      } else if (query.type) {
        yes = item.type === query.type;
      }
      return yes;
    }).slice(
      ((query.page ?? 1) - 1) * (query.limit ?? 10),
      (query.page ?? 1) * (query.limit ?? 10),
    );

    return Promise.resolve<PaginationAPIResponse<Item>>({
      status_code: 200,
      _pagination: {
        limit: query.limit ?? 10,
        page: query.page ?? 1,
        total_count: items.length,
      },
      data: items,
      message: 'Success',
    });
  },
  Create: function (item: DataAPIRequest<Item>): Promise<DataAPIResponse<Item>> {
    if (item.name && item.description && item.type) {
      const _item: Item = {
        id: MOCK_DATA.length + 1,
        name: item.name,
        description: item.description,
        type: item.type,
        status: item.status ?? 'draft',
        created_at: new Date().toISOString(),
        created_by: 'self',
        badge_description: item.badge_description,
        admin_login_as: '',
        image_url: '',
        template_item_id: null,
        template_path: '',
        updated_at: null,
        updated_by: null,
      };
      MOCK_DATA.push(_item);
      return Promise.resolve<DataAPIResponse<Item>>({
        status_code: 201,
        data: _item,
        message: 'Success',
      });
    } else {
      return Promise.resolve<DataAPIResponse<Item>>({
        status_code: 400,
        message: 'Failed',
      });
    }
  },
  Update: function (
    itemId: Item['id'],
    item: DataAPIRequest<Item>,
  ): Promise<DataAPIResponse<Item>> {
    const _item = MOCK_DATA.find((item) => item.id === itemId);
    if (_item) {
      _item.name = item.name ?? _item.name;
      _item.description = item.description ?? _item.description;
      _item.type = item.type ?? _item.type;
      _item.status = item.status ?? _item.status;
      _item.updated_at = new Date().toISOString();
      _item.updated_by = 'self';
      _item.badge_description = item.badge_description ?? _item.badge_description;

      return Promise.resolve<DataAPIResponse<Item>>({
        status_code: 200,
        data: _item,
        message: 'Success',
      });
    } else {
      return Promise.resolve<DataAPIResponse<Item>>({
        status_code: 404,
        message: 'Failed',
      });
    }
  },
  GetById: function (
    itemId: Item['id'],
    type: Item['type'],
  ): Promise<DataAPIResponse<Item>> {
    const item = MOCK_DATA.find((item) => item.id === itemId);
    if (item) {
      return Promise.resolve<DataAPIResponse<Item>>({
        status_code: 200,
        data: item,
        message: 'Success',
      });
    } else {
      return Promise.resolve<DataAPIResponse<Item>>({
        status_code: 404,
        message: 'Failed',
      });
    }
  },
  BulkEdit: function (
    bulk_edit_list: { id: Item['id']; status: Item['status'] }[],
  ): Promise<BaseAPIResponse> {
    bulk_edit_list.forEach((edit) => {
      const item = MOCK_DATA.find((item) => item.id === edit.id);
      if (item) {
        item.status = edit.status;
      }
    });
    return Promise.resolve<BaseAPIResponse>({ status_code: 200, message: 'Success' });
  },
};

export default ItemMock;
