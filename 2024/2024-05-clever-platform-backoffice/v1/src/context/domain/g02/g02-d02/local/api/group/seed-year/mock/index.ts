import { ISeedYear } from '@domain/g02/g02-d02/local/type';
import {
  PaginationAPIResponse,
  BasePaginationAPIQueryParams,
  FailedAPIResponse,
} from '@global/utils/apiResponseHelper';
import { SeedYearRepository } from '@domain/g02/g02-d02/local/api/repository/seed-year';

import MockJson from './index.json';

const SeedYearMock: SeedYearRepository = {
  GetAll: (
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<ISeedYear> | FailedAPIResponse> => {
    return new Promise((resolve) => {
      resolve(MockJson as PaginationAPIResponse<ISeedYear>);
    });
  },
};

export default SeedYearMock;
