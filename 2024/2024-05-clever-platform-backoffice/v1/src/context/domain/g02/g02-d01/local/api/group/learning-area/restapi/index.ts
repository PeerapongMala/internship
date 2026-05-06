import { BulkEdit, IDownloadCsvFilter, Learning } from '@domain/g02/g02-d01/local/type';

import { LearningAreaRepository } from '../../../repository';
import { DataAPIRequest } from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  FailedAPIResponse,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import downloadCSV from '@global/utils/downloadCSV';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const LearningAreaRestAPI: LearningAreaRepository = {
  Gets: function (
    curriculum_group_id: number,
    query,
  ): Promise<PaginationAPIResponse<Learning>> {
    const url = `${BACKEND_URL}/academic-standard/v1/${curriculum_group_id}/learning-area`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Learning>) => {
        return res;
      });
  },

  // GetById: function (id: number): Promise<DataAPIResponse<Learning>> {
  //   const url = `${BACKEND_URL}/academic-standard/v1/learning-area/${id}`;
  //   return fetchWithAuth(url)
  //     .then((res) => res.json())
  //     .then((res: DataAPIResponse<Learning[]>) => {
  //       // we assume only get single data but backend response as a array
  //       // we pull it out of array, tricky but worked
  //       if (res.status_code === 200 && Array.isArray(res.data))
  //         return { ...res, data: res.data?.at(0) } as DataAPIResponse<Learning>;
  //       return res as DataAPIResponse<Learning>;
  //     })
  //     .then((res: DataAPIResponse<Learning>) => {
  //       return res;
  //     });
  // },
  GetById: function (id: number): Promise<DataAPIResponse<Learning>> {
    const url = `${BACKEND_URL}/academic-standard/v1/learning-area/${id}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<Learning[]>) => {
        // we assume only get single data but backend response as a array
        // we pull it out of array, tricky but worked
        if (res.status_code === 200 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<Learning>;
        return res as DataAPIResponse<Learning>;
      })
      .then((res: DataAPIResponse<Learning>) => {
        return res;
      });
  },

  Create: function (
    learningArea: DataAPIRequest<Learning>,
  ): Promise<DataAPIResponse<Learning>> {
    let url = `${BACKEND_URL}/academic-standard/v1/learning-area`;

    const body = JSON.stringify(learningArea);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Learning[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<Learning>;
        return res as DataAPIResponse<Learning>;
      });
  },

  Update: function (
    learningAreaId: number,
    learningArea: Partial<Learning>,
  ): Promise<DataAPIResponse<Learning>> {
    let url = `${BACKEND_URL}/academic-standard/v1/learning-area/${learningAreaId}`;

    const body = JSON.stringify(learningArea);
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Learning>) => {
        return res;
      });
  },

  BulkEdit(learningArea: Partial<BulkEdit>): Promise<DataAPIResponse<Learning>> {
    let url = `${BACKEND_URL}/academic-standard/v1/learning-area/bulk-edit`;

    const body = JSON.stringify(learningArea);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Learning[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<Learning>;
        return res as DataAPIResponse<Learning>;
      });
  },
  UploadCSV: function (
    file: File,
    curriculumGroupId: number,
  ): Promise<DataAPIResponse<Learning>> {
    const url = `${BACKEND_URL}/academic-standard/v1/learning-area/upload/csv`;

    const formData = new FormData();
    formData.append('csv_file', file);
    formData.append('curriculum_group_id', curriculumGroupId.toString());

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<Learning>) => {
        return res;
      });
  },
  DownloadCSV: function (filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse> {
    const url = `${BACKEND_URL}/academic-standard/v1/learning-area/download/csv?start_date=${filter.start_date}&end_date=${filter.end_date}&curriculum_group_id=${filter.curriculum_group_id}`;

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
          downloadCSV(res, 'learning_area.csv');
        } else {
          return res as FailedAPIResponse;
        }
      });
  },
};

export default LearningAreaRestAPI;
