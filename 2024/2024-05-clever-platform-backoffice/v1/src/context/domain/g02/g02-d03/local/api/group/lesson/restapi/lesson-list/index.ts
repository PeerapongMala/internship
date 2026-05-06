import { LessonStatus } from '@domain/g02/g02-d03/local/Type';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@global/store/global/persist';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
// ตั้งค่า axios instance
const LessonList = async (
  subjectId: string,
  params: { status?: LessonStatus; search_text?: string; page?: number; limit?: number },
) => {
  let url = `${BACKEND_URL}/academic-lesson/v1/${subjectId}/lessons?`;
  if (params.status) url += `status=${params.status}`;
  if (params.search_text) url += `&search_text=${params.search_text}`;
  if (params.page) url += `&page=${params.page}`;
  if (params.limit) url += `&limit=${params.limit}`;

  const response = await fetchWithAuth(url, {
    method: 'GET',
  });

  return await response.json();
};

export default LessonList;
