import { DataAPIResponse, PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { IGetPhorpor5Detail } from '../../../../type';
import { FilterQueryParams } from '../../../../repository-pattern';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const GetDetailPhorpor5 = async (
  evaluationFormId: number,
  phorpor5Id: number,
  query: FilterQueryParams,
): Promise<PaginationAPIResponse<IGetPhorpor5Detail> | undefined> => {
  try {
    const url = `${BACKEND_URL}/porphor5/v1/${evaluationFormId}/detail?id=${phorpor5Id}`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<IGetPhorpor5Detail>) => {
        return res;
      });
  } catch (error) {
    console.error('CreatePhorpor5 Error:', error);
    return undefined;
  }
};

export default GetDetailPhorpor5;
