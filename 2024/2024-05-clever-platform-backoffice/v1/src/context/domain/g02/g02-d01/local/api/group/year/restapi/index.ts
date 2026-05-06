import { Learning, Year } from '@domain/g02/g02-d01/local/type';

import { YearRepository } from '../../../repository';
import { DataAPIRequest, DataAPIResponse, PaginationAPIResponse } from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const YearRestAPI: YearRepository = {
  Gets: function (
    curriculum_group_id: number,
    query,
  ): Promise<PaginationAPIResponse<Year>> {
    const url = `${BACKEND_URL}/academic-standard/v1/${curriculum_group_id}/years`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Year>) => {
        return res;
      });
  },
};
export default YearRestAPI;
