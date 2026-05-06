import { ICurriculum } from '@domain/g00/g00-d00/local/type';
import {
  PaginationAPIResponse,
  BasePaginationAPIQueryParams,
  FailedAPIResponse,
} from '@global/utils/apiResponseHelper';
import { CurriculumRepository } from '@domain/g00/g00-d00/local/api/repository/curriculum';

import GetAllMock from './get-all/index.json';

const CurriculumMock: CurriculumRepository = {
  GetAll: (
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<ICurriculum> | FailedAPIResponse> => {
    return new Promise((resolve) => {
      resolve(GetAllMock as PaginationAPIResponse<ICurriculum>);
    });
  },
};

export default CurriculumMock;
