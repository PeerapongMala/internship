import {
  BulkEdit,
  IDownloadCsvFilter,
  LearningContent,
} from '@domain/g02/g02-d01/local/type';

import { LearningContentRepository } from '../../../repository';
import { DataAPIRequest, DataAPIResponse, PaginationAPIResponse } from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { FailedAPIResponse } from '@global/utils/apiResponseHelper';
import downloadCSV from '@global/utils/downloadCSV';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const LearningContentRestAPI: LearningContentRepository = {
  Gets: function (
    curriculum_group_id: number,
    query,
  ): Promise<PaginationAPIResponse<LearningContent>> {
    const url = `${BACKEND_URL}/academic-standard/v1/${curriculum_group_id}/learning-content`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<LearningContent>) => {
        return res;
      });
  },

  GetById: function (id: number): Promise<DataAPIResponse<LearningContent>> {
    const url = `${BACKEND_URL}/academic-standard/v1/learning-content/${id}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<LearningContent[]>) => {
        // we assume only get single data but backend response as a array
        // we pull it out of array, tricky but worked
        if (res.status_code === 200 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<LearningContent>;
        return res as DataAPIResponse<LearningContent>;
      })
      .then((res: DataAPIResponse<LearningContent>) => {
        return res;
      });
  },

  Create: function (
    learningContent: DataAPIRequest<LearningContent>,
  ): Promise<DataAPIResponse<LearningContent>> {
    let url = `${BACKEND_URL}/academic-standard/v1/learning-content`;

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
      .then((res: DataAPIResponse<LearningContent[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<LearningContent>;
        return res as DataAPIResponse<LearningContent>;
      });
  },

  Update: function (
    learningContentId: number,
    learningContent: Partial<LearningContent>,
  ): Promise<DataAPIResponse<LearningContent>> {
    let url = `${BACKEND_URL}/academic-standard/v1/learning-content/${learningContentId}`;

    const body = JSON.stringify(learningContent);
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<LearningContent>) => {
        return res;
      });
  },
  UploadCSV: function (
    file: File,
    curriculumGroupId: number,
  ): Promise<DataAPIResponse<LearningContent>> {
    const url = `${BACKEND_URL}/academic-standard/v1/learning-content/upload/csv`;

    const formData = new FormData();
    formData.append('csv_file', file);
    formData.append('curriculum_group_id', curriculumGroupId.toString());

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<LearningContent>) => {
        return res;
      });
  },
  DownloadCSV: function (filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse> {
    const url = `${BACKEND_URL}/academic-standard/v1/learning-content/download/csv?start_date=${filter.start_date}&end_date=${filter.end_date}&curriculum_group_id=${filter.curriculum_group_id}`;

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
          downloadCSV(res, 'learning_content.csv');
        } else {
          return res as FailedAPIResponse;
        }
      });
  },
  BulkEdit(
    learningContent: Partial<BulkEdit>,
  ): Promise<DataAPIResponse<LearningContent>> {
    let url = `${BACKEND_URL}/academic-standard/v1/learning-content/bulk-edit`;

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
      .then((res: DataAPIResponse<LearningContent[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<LearningContent>;
        return res as DataAPIResponse<LearningContent>;
      });
  },
};

export default LearningContentRestAPI;
