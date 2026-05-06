import { ISubject } from '@domain/g02/g02-d02/local/type';
import {
  BasePaginationAPIQueryParams,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { FilterQueryParams } from '../../../../repository-pattern';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SubjectList = async (
  curriculumGroupId: number,
  query: FilterQueryParams,
): Promise<PaginationAPIResponse<ISubject>> => {
  const url = `${BACKEND_URL}/academic-courses/v1/${curriculumGroupId}/subjects`;
  const filterQuery = Object.fromEntries(
    Object.entries(query).filter(([k, v]) => v !== undefined),
  );
  const params = new URLSearchParams({
    ...(filterQuery as Record<string, string>),
  });

  return fetchWithAuth(url + '?' + params.toString())
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<ISubject>) => {
      return res;
    });
};
export default SubjectList;
