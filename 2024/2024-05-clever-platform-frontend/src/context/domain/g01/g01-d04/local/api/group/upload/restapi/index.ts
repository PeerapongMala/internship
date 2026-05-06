import { DataAPIResponse } from '@core/helper/api-type';
import { TLessonMeta, TLessonMetaReq } from '@domain/g01/g01-d04/local/types/lesson-meta';
import { fetchWithAuth } from '@global/helper/fetch';
import { UploadRepository } from '../../../repository';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPIUpload: UploadRepository = {
  GetLessonMeta: async function (
    body: TLessonMetaReq,
  ): Promise<DataAPIResponse<TLessonMeta[]>> {
    const url = `${BACKEND_URL}/academic-lesson/v1/lessons/meta`;
    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  },
};

export default RestAPIUpload;
