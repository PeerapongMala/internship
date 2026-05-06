import {
  Content,
  Learning,
  Indicator,
  BulkEdit,
  IDownloadCsvFilter,
} from '@domain/g02/g02-d01/local/type';

import { IndicatorRepository } from '../../../repository';
import { DataAPIRequest, DataAPIResponse, PaginationAPIResponse } from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { FailedAPIResponse } from '@global/utils/apiResponseHelper';
import downloadCSV from '@global/utils/downloadCSV';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const IndicatorRestAPI: IndicatorRepository = {
  Gets: function (
    curriculum_group_id: number,
    query,
  ): Promise<PaginationAPIResponse<Indicator>> {
    const url = `${BACKEND_URL}/academic-standard/v1/${curriculum_group_id}/indicators`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Indicator>) => {
        return res;
      });
  },

  GetById: function (id: number): Promise<DataAPIResponse<Indicator>> {
    const url = `${BACKEND_URL}/academic-standard/v1/indicators/${id}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<Indicator[]>) => {
        // we assume only get single data but backend response as a array
        // we pull it out of array, tricky but worked
        if (res.status_code === 200 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<Indicator>;
        return res as DataAPIResponse<Indicator>;
      })
      .then((res: DataAPIResponse<Indicator>) => {
        return res;
      });
  },

  Create: function (
    indicators: DataAPIRequest<Indicator>,
  ): Promise<DataAPIResponse<Indicator>> {
    let url = `${BACKEND_URL}/academic-standard/v1/indicators`;

    const body = JSON.stringify(indicators);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Indicator[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<Indicator>;
        return res as DataAPIResponse<Indicator>;
      });
  },

  Update: function (
    indicatorsId: number,
    indicators: Partial<Indicator>,
  ): Promise<DataAPIResponse<Indicator>> {
    let url = `${BACKEND_URL}/academic-standard/v1/indicators/${indicatorsId}`;

    const body = JSON.stringify(indicators);
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Indicator>) => {
        return res;
      });
  },
  BulkEdit(indicator: Partial<BulkEdit>): Promise<DataAPIResponse<Indicator>> {
    let url = `${BACKEND_URL}/academic-standard/v1/indicators/bulk-edit`;

    const body = JSON.stringify(indicator);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Indicator[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<Indicator>;
        return res as DataAPIResponse<Indicator>;
      });
  },
  UploadCSV: function (
    file: File,
    curriculumGroupId: number,
  ): Promise<DataAPIResponse<Indicator>> {
    const url = `${BACKEND_URL}/academic-standard/v1/indicators/upload/csv`;

    const formData = new FormData();
    formData.append('csv_file', file);
    formData.append('curriculum_group_id', curriculumGroupId.toString());

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Indicator>) => {
        return res;
      });
  },
  DownloadCSV: function (filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse> {
    const url = `${BACKEND_URL}/academic-standard/v1/indicators/download/csv?start_date=${filter.start_date}&end_date=${filter.end_date}&curriculum_group_id=${filter.curriculum_group_id}`;

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
          downloadCSV(res, 'indicator.csv');
        } else {
          return res as FailedAPIResponse;
        }
      });
  },
};

export default IndicatorRestAPI;
