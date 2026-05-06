import StoreGlobalPersist, { IStoreGlobalPersist } from '@global/store/global/persist';
import { DataAPIRequest, DataAPIResponse } from '@global/utils/apiResponseHelper';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const SubLessonUpdate = async (
  id: number,
  body: {
    indicator_id?: number;
    name?: string;
    status?: string;
    updated_by: string;
  },
): Promise<DataAPIResponse<any>> => {
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  let url = `${BACKEND_URL}/academic-sub-lesson/v1/sub-lessons/${id}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};

export default SubLessonUpdate;
