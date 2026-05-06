import { BaseAPIResponse, DataAPIResponse, DataDetailAPIResponse } from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import StoreGlobalPersist from '@store/global/persist';
import {
  IGetProfileDataProps,
  IUpdatePasswordReq,
  IUpdateProfileReq,
  ProfileRestAPITranslationRepository,
} from '../../../repository/profile';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

const RestAPITranslation: ProfileRestAPITranslationRepository = {
  GetG04D07A01: async function (): Promise<DataAPIResponse<IGetProfileDataProps>> {
    const url = `${BACKEND_URL}/gamemaster-profile/v1/gamemaster`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
  PATCHG04D07A02: function (
    data: FormData,
  ): Promise<DataDetailAPIResponse<IGetProfileDataProps>> {
    let url = `${BACKEND_URL}/gamemaster-profile/v1/gamemaster`;

    return fetchWithAuth(url, {
      method: 'PATCH',
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  PATCHG04D07A03: function (data: IUpdatePasswordReq): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/gamemaster-profile/v1/gamemaster/password`;
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
};

export default RestAPITranslation;
