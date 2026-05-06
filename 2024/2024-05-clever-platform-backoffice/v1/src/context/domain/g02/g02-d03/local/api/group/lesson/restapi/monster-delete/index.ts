import { ISubject } from '@domain/g02/g02-d02/local/type';
import { Monster } from '@domain/g02/g02-d03/local/Type';
import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { FilterQueryParams } from '../../../../repository-pattern';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const DeleteMonster = async (monster_ids: number[]): Promise<DataAPIResponse<any>> => {
  let url = `${BACKEND_URL}/academic-lesson/v1/lessons/monsters`;

  const body = JSON.stringify({ monster_ids });
  return fetchWithAuth(url, {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: body,
  })
    .then((res) => res.json())
    .then((res: DataAPIResponse<any>) => {
      return res;
    });
};

export default DeleteMonster;
