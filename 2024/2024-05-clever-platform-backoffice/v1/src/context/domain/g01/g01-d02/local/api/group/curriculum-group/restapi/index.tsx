import { CurriculumGroup } from '@domain/g01/g01-d02/local/type';
import {
  PaginationAPIResponse,
  DataAPIResponse,
  FailedAPIResponse,
  BaseAPIResponse,
  DataAPIRequest,
  getQueryParams,
} from '@global/utils/apiResponseHelper';
import {
  CurriculumGroupFilterQueryParams,
  CurriculumGroupRepository,
} from '../../../repository/curriculum-group';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const CurriculumGroupRestAPI: CurriculumGroupRepository = {
  Get: function (
    query: CurriculumGroupFilterQueryParams = {},
  ): Promise<PaginationAPIResponse<CurriculumGroup>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/curriculum-groups/list`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  BulkEdit: function (
    bulk_edit_list: {
      curriculum_group_id: CurriculumGroup['id'];
      status: CurriculumGroup['status'];
    }[],
  ): Promise<
    DataAPIResponse<
      { curriculum_group_id: CurriculumGroup['id']; status: CurriculumGroup['status'] }[]
    >
  > {
    let url = `${BACKEND_URL}/school-affiliations/v1/curriculum-groups/bulk-edit`;
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
  DownloadCSV: function (
    query: {
      start_date?: string;
      end_date?: string;
    } = {},
  ): Promise<Blob | FailedAPIResponse> {
    let url = `${BACKEND_URL}/school-affiliations/v1/curriculum-groups/download/csv`;
    const params = getQueryParams(query);

    return fetchWithAuth(url + '?' + params.toString()).then((res) => {
      if (res.status == 200) {
        return res.blob();
      } else {
        return res.json();
      }
    });
  },
  UploadCSV: function (file: File): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/school-affiliations/v1/curriculum-groups/upload/csv`;

    const formData = new FormData();
    formData.append('csv_file', file);

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  Update: function (
    curriculumGrouopId: CurriculumGroup['id'],
    data: DataAPIRequest<CurriculumGroup>,
  ): Promise<DataAPIResponse<CurriculumGroup>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/curriculum-groups/${curriculumGrouopId}`;
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<CurriculumGroup[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<CurriculumGroup>;
        return res as DataAPIResponse<CurriculumGroup>;
      });
  },
  Create: function (
    data: DataAPIRequest<CurriculumGroup>,
  ): Promise<DataAPIResponse<CurriculumGroup>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/curriculum-groups`;
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<CurriculumGroup[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<CurriculumGroup>;
        return res as DataAPIResponse<CurriculumGroup>;
      });
  },
  GetById: function (
    curriculumGrouopId: CurriculumGroup['id'],
  ): Promise<DataAPIResponse<CurriculumGroup>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/curriculum-groups/${curriculumGrouopId}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<CurriculumGroup[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<CurriculumGroup>;
        return res as DataAPIResponse<CurriculumGroup>;
      });
  },
};

export default CurriculumGroupRestAPI;
