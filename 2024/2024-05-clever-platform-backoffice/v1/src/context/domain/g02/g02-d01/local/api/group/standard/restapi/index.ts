import { BulkEdit, IDownloadCsvFilter, Standard } from '@domain/g02/g02-d01/local/type';

import { StandardRepository } from '../../../repository';
import { DataAPIRequest, DataAPIResponse, PaginationAPIResponse } from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import downloadCSV from '@global/utils/downloadCSV';
import { FailedAPIResponse } from '@global/utils/apiResponseHelper';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const StandardRestAPI: StandardRepository = {
  Gets: function (
    curriculum_group_id: number,
    query,
  ): Promise<PaginationAPIResponse<Standard>> {
    const url = `${BACKEND_URL}/academic-standard/v1/${curriculum_group_id}/criteria`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Standard>) => {
        return res;
      });
  },

  GetById: function (id: number): Promise<DataAPIResponse<Standard>> {
    const url = `${BACKEND_URL}/academic-standard/v1/criteria/${id}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<Standard[]>) => {
        // we assume only get single data but backend response as a array
        // we pull it out of array, tricky but worked
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<Standard>;
        return res as DataAPIResponse<Standard>;
      })
      .then((res: DataAPIResponse<Standard>) => {
        return res;
      });
  },

  Create: function (
    standard: DataAPIRequest<Standard>,
  ): Promise<DataAPIResponse<Standard>> {
    let url = `${BACKEND_URL}/academic-standard/v1/criteria`;

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
      .then((res: DataAPIResponse<Standard[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<Standard>;
        return res as DataAPIResponse<Standard>;
      });
  },

  Update: function (
    standardId: number,
    standard: Partial<Standard>,
  ): Promise<DataAPIResponse<Standard>> {
    let url = `${BACKEND_URL}/academic-standard/v1/criteria/${standardId}`;

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
      .then((res: DataAPIResponse<Standard>) => {
        return res;
      });
  },
  UploadCSV: function (
    file: File,
    curriculumGroupId: number,
  ): Promise<DataAPIResponse<Standard>> {
    const url = `${BACKEND_URL}/academic-standard/v1/criteria/upload/csv`;

    const formData = new FormData();
    formData.append('csv_file', file);
    formData.append('curriculum_group_id', curriculumGroupId.toString());

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Standard>) => {
        return res;
      });
  },
  DownloadCSV: function (filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse> {
    const url = `${BACKEND_URL}/academic-standard/v1/criteria/download/csv?start_date=${filter.start_date}&end_date=${filter.end_date}&curriculum_group_id=${filter.curriculum_group_id}`;

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
          downloadCSV(res, 'criteria.csv');
        } else {
          return res as FailedAPIResponse;
        }
      });
  },
  BulkEdit(learningContent: Partial<BulkEdit>): Promise<DataAPIResponse<Standard>> {
    let url = `${BACKEND_URL}/academic-standard/v1/criteria/bulk-edit`;

    const body = JSON.stringify(learningContent);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Standard[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<Standard>;
        return res as DataAPIResponse<Standard>;
      });
  },
};

export default StandardRestAPI;
