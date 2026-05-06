import { PaginationAPIResponse } from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  ChatConfigRestAPITranslationRepository,
  IUpdateChatConfig,
} from '../../../repository/chatConfig';
import StoreGlobalPersist from '@store/global/persist';
import { IChatConfig } from '@domain/g04/g04-d05/local/type';
import { BaseAPIResponse } from '@global/utils/apiResponseHelper';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

const RestAPITranslation: ChatConfigRestAPITranslationRepository = {
  GetG04D08A01: async function (
    query = {
      page: '1',
      limit: '10',
    },
  ): Promise<PaginationAPIResponse<IChatConfig>> {
    const url = `${BACKEND_URL}/chat-config/v1/configs?page=${query?.page}&limit=${query?.limit}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
  PatchG04D08A02: async function (data: IUpdateChatConfig): Promise<BaseAPIResponse> {
    const url = `${BACKEND_URL}/chat-config/v1/config/status`;
    const body = JSON.stringify(data);
    return fetchWithAuth(url, {
      method: 'PATCH',
      body: body,
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res: BaseAPIResponse) => {
        return res;
      });
  },
};

export default RestAPITranslation;
