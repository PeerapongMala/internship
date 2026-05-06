import { PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { SubjectSubLessons } from '../../../../type';
import { FilterQueryParams } from '../../../../repository-pattern';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SubLessonSoft = async (
  lessonId: number,
  query: {
    sub_lessons: {
      [key: string]: number;
    };
  },
): Promise<PaginationAPIResponse<SubjectSubLessons>> => {
  console.log({ query: query });
  const url = `${BACKEND_URL}/academic-sub-lesson/v1/${lessonId}/sub-lessons/sort`;
  const options = {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(query),
  };
  return fetchWithAuth(url, options)
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<any>) => {
      return res;
    });
};

export default SubLessonSoft;
