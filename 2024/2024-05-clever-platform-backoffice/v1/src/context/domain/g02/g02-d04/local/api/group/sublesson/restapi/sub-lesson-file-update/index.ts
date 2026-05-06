import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export async function SubLessonFileUpdate(subLessonIds: number[]) {
  let url = `${BACKEND_URL}/academic-level/v1/sub-lessons/file`;

  const body = JSON.stringify({
    sub_lesson_ids: subLessonIds,
  });

  return fetchWithAuth(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: body,
  })
    .then((res) => res.json())
    .then((res: DataAPIResponse<never>) => {
      return res;
    });
}
