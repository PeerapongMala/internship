import { ISubject } from '@domain/g02/g02-d02/local/type';
import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { string } from 'yup';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export const CreateMonster = async (
  lesson_id: string,
  data: { monster_lists: [image_path?: string, level_type?: string] },
): Promise<DataAPIResponse<any>> => {
  let url = `${BACKEND_URL}/academic-lesson/v1/lessons/${lesson_id}/monsters`;

  const body = JSON.stringify(data);
  return fetchWithAuth(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: body,
  })
    .then((res) => res.json())
    .then((res: DataAPIResponse<any[]>) => {
      // pull it out of array
      // note: when create succesfully, it response HTTP 201 Created
      if (res.status_code === 201 && Array.isArray(res.data))
        return { ...res, data: res.data?.at(0) } as DataAPIResponse<any>;
      return res as DataAPIResponse<any>;
    });
};
