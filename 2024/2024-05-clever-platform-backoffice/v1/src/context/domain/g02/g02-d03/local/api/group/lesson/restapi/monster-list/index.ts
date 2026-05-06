import { ISubject } from '@domain/g02/g02-d02/local/type';
import { Monster } from '@domain/g02/g02-d03/local/Type';
import {
  BasePaginationAPIQueryParams,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { FilterQueryParams } from '../../../../repository-pattern';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const MonsterList = async (
  lesson_id: string,
  query: FilterQueryParams,
): Promise<PaginationAPIResponse<Monster>> => {
  const url = `${BACKEND_URL}/academic-lesson/v1/lessons/${lesson_id}/monsters`;
  const filterQuery = Object.fromEntries(
    Object.entries(query).filter(([k, v]) => v !== undefined),
  );
  const params = new URLSearchParams({
    ...(filterQuery as Record<string, string>),
  });

  return fetchWithAuth(url + '?' + params.toString())
    .then((res) => res.json())
    .then((res: PaginationAPIResponse<Monster>) => {
      return res;
    });
};
export default MonsterList;
