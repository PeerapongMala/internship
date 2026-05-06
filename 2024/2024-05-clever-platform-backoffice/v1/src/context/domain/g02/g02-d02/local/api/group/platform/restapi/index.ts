import { ICurriculum } from '@domain/g01/g01-d03/local/type';
import { IPlatformBase, IPlatform } from '@domain/g02/g02-d02/local/type';
import {
  DataAPIRequest,
  DataAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import {
  PlatformFilterQueryParams,
  PlatformRepository,
} from '../../../repository/platform';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const PlatformRestAPI: PlatformRepository = {
  Create: function (
    platform: DataAPIRequest<IPlatformBase>,
  ): Promise<DataAPIResponse<IPlatform>> {
    let url = `${BACKEND_URL}/academic-courses/v1/platforms`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(platform),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<IPlatform[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<IPlatform>;
        return res as DataAPIResponse<IPlatform>;
      });
  },
  Update: function (
    platformId: IPlatform['id'],
    platform: DataAPIRequest<IPlatformBase>,
  ): Promise<DataAPIResponse<IPlatform>> {
    let url = `${BACKEND_URL}/academic-courses/v1/platforms/${platformId}`;
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(platform),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<IPlatform[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<IPlatform>;
        return res as DataAPIResponse<IPlatform>;
      });
  },
  Get: function (
    curriculumGroupId: ICurriculum['id'],
    query: PlatformFilterQueryParams = {},
  ): Promise<PaginationAPIResponse<IPlatform>> {
    let url = `${BACKEND_URL}/academic-courses/v1/${curriculumGroupId}/platforms`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<IPlatform>) => {
        return res;
      });
  },
  GetById: function (platformId: IPlatform['id']): Promise<DataAPIResponse<IPlatform>> {
    let url = `${BACKEND_URL}/academic-courses/v1/platforms/${platformId}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<IPlatform[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.[0] } as DataAPIResponse<IPlatform>;
        return res as DataAPIResponse<IPlatform>;
      });
  },
  BulkEdit: function (
    platforms: Pick<IPlatform, 'id' | 'status'>[],
    admin_login_as?: string,
  ): Promise<DataAPIResponse<undefined>> {
    let url = `${BACKEND_URL}/academic-courses/v1/platforms/bulk-edit`;
    const data = {
      bulk_edit_list: platforms.map((p) => ({ platform_id: p.id, status: p.status })),
      admin_login_as,
    };
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<IPlatform[]>) => {
        return { ...res, data: undefined };
      });
  },
};

export default PlatformRestAPI;
