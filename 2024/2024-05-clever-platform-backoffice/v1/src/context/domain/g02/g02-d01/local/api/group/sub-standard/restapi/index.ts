import {
  BulkEdit,
  IDownloadCsvFilter,
  Standard,
  SubCriteria,
  SubStandard,
} from '@domain/g02/g02-d01/local/type';

import { SubStandardRepository } from '../../../repository';
import { DataAPIRequest, DataAPIResponse, PaginationAPIResponse } from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { FailedAPIResponse } from '@global/utils/apiResponseHelper';
import downloadCSV from '@global/utils/downloadCSV';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SubStandardRestAPI: SubStandardRepository = {
  Gets: function (
    substandardId: number,
    substandardValue: string,
    query,
  ): Promise<PaginationAPIResponse<SubStandard>> {
    const url = `${BACKEND_URL}/academic-standard/v1/sub-criteria/${substandardId}/${substandardValue}`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<SubStandard>) => {
        return res;
      });
  },

  GetById: function (id: number): Promise<DataAPIResponse<SubStandard>> {
    const url = `${BACKEND_URL}/academic-standard/v1/sub-criteria/topics/${id}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<SubStandard[]>) => {
        // we assume only get single data but backend response as a array
        // we pull it out of array, tricky but worked
        if (res.status_code === 200 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<SubStandard>;
        return res as DataAPIResponse<SubStandard>;
      })
      .then((res: DataAPIResponse<SubStandard>) => {
        return res;
      });
  },

  Create: function (
    standard: DataAPIRequest<SubStandard>,
  ): Promise<DataAPIResponse<SubStandard>> {
    let url = `${BACKEND_URL}/academic-standard/v1/sub-criteria/topics`;

    const body = JSON.stringify(standard);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<SubStandard[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<SubStandard>;
        return res as DataAPIResponse<SubStandard>;
      });
  },

  Update: function (
    subStandardId: number,
    standard: Partial<SubStandard>,
  ): Promise<DataAPIResponse<SubStandard>> {
    let url = `${BACKEND_URL}/academic-standard/v1/sub-criteria/topics/${subStandardId}`;

    const body = JSON.stringify(standard);
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<SubStandard>) => {
        return res;
      });
  },
  UploadCSV: function (
    file: File,
    subCriteriaId: number,
  ): Promise<DataAPIResponse<SubStandard>> {
    const url = `${BACKEND_URL}/academic-standard/v1/sub-criteria/${subCriteriaId}/topics/upload/csv`;

    const formData = new FormData();
    formData.append('csv_file', file);
    formData.append('sub_criteria_id', subCriteriaId.toString());

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<SubStandard>) => {
        return res;
      });
  },
  DownloadCSV: function (filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse> {
    const url = `${BACKEND_URL}/academic-standard/v1/sub-criteria/${filter.sub_criteria_id}/report/download/csv?start_date=${filter.start_date}&end_date=${filter.end_date}`;

    return fetchWithAuth(url)
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        } else {
          return res.json();
        }
      })
      .then((res) => {
        // check if res is a blob
        if (res instanceof Blob) {
          downloadCSV(res, 'sub-criteria.csv');
        } else {
          return res as FailedAPIResponse;
        }
      });
  },
  BulkEdit(subStandard: Partial<BulkEdit>): Promise<DataAPIResponse<SubStandard>> {
    let url = `${BACKEND_URL}/academic-standard/v1/sub-criteria/topics/bulk-edit`;

    const body = JSON.stringify(subStandard);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<SubStandard[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<SubStandard>;
        return res as DataAPIResponse<SubStandard>;
      });
  },
  GetBySubStandard: function (
    curriculumGroupId: number,
    query: any,
  ): Promise<DataAPIResponse<SubCriteria[]>> {
    const url = `${BACKEND_URL}/academic-standard/v1/${curriculumGroupId}/sub-criteria`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: DataAPIResponse<SubCriteria[]>) => {
        return res;
      });
  },
  UpdateSubStandard: function (
    subStandardId: number,
    query: any,
  ): Promise<DataAPIResponse<any>> {
    let url = `${BACKEND_URL}/academic-standard/v1/sub-criteria/${subStandardId}`;

    const body = JSON.stringify(query);
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<any>) => {
        return res;
      });
  },
};

export default SubStandardRestAPI;
