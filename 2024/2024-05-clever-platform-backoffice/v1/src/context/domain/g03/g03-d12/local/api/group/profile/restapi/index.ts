import { BaseAPIResponse, DataAPIResponse, DataDetailAPIResponse } from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import StoreGlobalPersist from '@store/global/persist';
import {
  IGetProfileTeacherDataProps,
  ITeacherUpdateRes,
  IUpdatePasswordReq,
  IUpdateTeacherAuth,
  ProfileTeacherRestAPITranslationRepository,
} from '../../../repository/profile';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

const RestAPITranslation: ProfileTeacherRestAPITranslationRepository = {
  GetG03D12A01: async function (): Promise<DataAPIResponse<IGetProfileTeacherDataProps>> {
    const url = `${BACKEND_URL}/teacher-profile/v1/teacher`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
  PATCHG03D12A02: function (data: IUpdatePasswordReq): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/teacher-profile/v1/teacher/password`;
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
  PATCHG03D12A03: function (data: FormData): Promise<DataAPIResponse<ITeacherUpdateRes>> {
    let url = `${BACKEND_URL}/teacher-profile/v1/teacher`;

    return fetchWithAuth(url, {
      method: 'PATCH',
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  PATCHG03D12A04: function (data: IUpdateTeacherAuth): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/teacher-profile/v1/teacher/oauth`;
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
