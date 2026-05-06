import { ISeedYear } from '@domain/g02/g02-d02/local/type';
import { SeedYearRepository } from '../../../repository/seed-year';
import { PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SeedYearRestAPI: SeedYearRepository = {
  GetAll: function (query): Promise<PaginationAPIResponse<ISeedYear>> {
    const url = `${BACKEND_URL}/academic-courses/v1/seed-years`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, any>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<ISeedYear>) => {
        return res;
      });
  },
};

export default SeedYearRestAPI;
