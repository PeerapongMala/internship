import { ISeedSubjectGroup } from '@domain/g02/g02-d02/local/type';
import {
  PaginationAPIResponse,
  BasePaginationAPIQueryParams,
  FailedAPIResponse,
} from '@global/utils/apiResponseHelper';
import { SeedSubjectGroupRepository } from '@domain/g02/g02-d02/local/api/repository/seed-subject-group';

import GetAllMockJson from './get-all/index.json';

const SeeISeedSubjectGroupMock: SeedSubjectGroupRepository = {
  GetAll: (): Promise<PaginationAPIResponse<ISeedSubjectGroup> | FailedAPIResponse> => {
    return new Promise((resolve) => {
      resolve(GetAllMockJson as PaginationAPIResponse<ISeedSubjectGroup>);
    });
  },
};

export default SeeISeedSubjectGroupMock;
