import { PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { SubjectSubLessons } from '../../../../type';
import { FilterQueryParams } from '../../../../repository-pattern';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SubLessonList = async (
  lessonId: number,
  query: FilterQueryParams,
): Promise<PaginationAPIResponse<SubjectSubLessons>> => {
  const url = `${BACKEND_URL}/academic-sub-lesson/v1/${lessonId}/sub-lessons`;

  const filterQuery = Object.fromEntries(
    Object.entries(query).filter(([k, v]) => v !== undefined),
  );
  const params = new URLSearchParams({
    ...(filterQuery as Record<string, string>),
  });
  return fetchWithAuth(url + '?' + params.toString())
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<SubjectSubLessons>) => {
      return res;
    });
};

export default SubLessonList;
