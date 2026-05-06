import { ICurriculum } from '@domain/g01/g01-d03/local/type';
import { getQueryParams, PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import {
  PlatformFilterQueryParams,
  PlatformRepository,
} from '../../../repository/platform';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { SeedPlatformRepository } from '../../../repository/seed-platform';
import { ISeedPlatform } from '@domain/g02/g02-d02/local/type';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SeedPlatformRestAPI: SeedPlatformRepository = {
  Get: function (
    query: PlatformFilterQueryParams = {},
  ): Promise<PaginationAPIResponse<ISeedPlatform>> {
    let url = `${BACKEND_URL}/academic-courses/v1/seed-platforms`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<ISeedPlatform>) => {
        return res;
      });
  },
};

export default SeedPlatformRestAPI;
