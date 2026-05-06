import { ICurriculum } from '@domain/g00/g00-d00/local/type';
import { CurriculumRepository } from '../../../repository/curriculum';
import {
  FailedAPIResponse,
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const CurriculumAPI: CurriculumRepository = {
  GetAll: function (query: BasePaginationAPIQueryParams) {
    const url = `${BACKEND_URL}/arriving/v1/curriculum-groups`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, any>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<ICurriculum>) => {
        return res;
      });
  },
};

export default CurriculumAPI;
