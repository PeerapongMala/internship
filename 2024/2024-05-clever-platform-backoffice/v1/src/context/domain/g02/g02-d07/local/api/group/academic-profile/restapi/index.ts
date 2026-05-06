import { BaseAPIResponse, DataAPIResponse, DataDetailAPIResponse } from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import StoreGlobalPersist from '@store/global/persist';
import {
  AcademicProfileAPITranslationRepository,
  IGetAcademicProfileDataProps,
  IUpdatePasswordReq,
} from '../../../repository/profile';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

const RestAPITranslation: AcademicProfileAPITranslationRepository = {
  PATCHG02D07A01: function (data: IUpdatePasswordReq): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/academic-profile/v1/content-creator/password`;
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
  GETG02D07A02: async function (): Promise<
    DataAPIResponse<IGetAcademicProfileDataProps>
  > {
    const url = `${BACKEND_URL}/academic-profile/v1/content-creator`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
  PATCHG02D07A03: function (data: FormData): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/academic-profile/v1/content-creator`;

    return fetchWithAuth(url, {
      method: 'PATCH',
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
};

export default RestAPITranslation;
