import { ISeedSubjectGroup } from '@domain/g02/g02-d02/local/type';
import { SeedSubjectGroupRepository } from '../../../repository/seed-subject-group';
import { PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SeedSubjectGroupRestAPI: SeedSubjectGroupRepository = {
  GetAll: function (): Promise<PaginationAPIResponse<ISeedSubjectGroup>> {
    const url = `${BACKEND_URL}/academic-courses/v1/seed-subject-groups`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<ISeedSubjectGroup>) => {
        return res;
      });
  },
};

export default SeedSubjectGroupRestAPI;
