import fetchWithAuth from '@global/utils/fetchWithAuth';
import { DataAPIResponse, FailedAPIResponse } from '@global/utils/apiResponseHelper';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export const Indicators = async (
  curriculum_group_id: number,
): Promise<DataAPIResponse<any>> => {
  let url = `${BACKEND_URL}/academic-standard/v1/${curriculum_group_id}/indicators`;

  return fetchWithAuth(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((res: DataAPIResponse<any>) => {
      return res as DataAPIResponse<any>;
    });
};
