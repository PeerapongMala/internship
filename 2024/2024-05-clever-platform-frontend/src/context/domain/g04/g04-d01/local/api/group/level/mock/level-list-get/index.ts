import { pagination as paginationHelper } from '@core/helper/api-mock';
import { PaginationAPIResponse } from '@core/helper/api-type';
import { LevelList } from '@domain/g04/g04-d01/local/type';

const LevelInfoGet = (
  sublessonId: string,
  pagination?: { page?: number; limit?: number },
): Promise<PaginationAPIResponse<LevelList>> => {
  return Promise.resolve(
    paginationHelper<LevelList>({
      data: [],
      page: pagination?.page ?? 1,
      limit: pagination?.limit ?? 25,
    }),
  );
};

export default LevelInfoGet;
