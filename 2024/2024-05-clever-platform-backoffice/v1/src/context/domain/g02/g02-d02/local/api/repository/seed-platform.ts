import {
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { ISeedPlatform } from '../../type';

export interface SeedPlatformFilterQueryParams extends BasePaginationAPIQueryParams {}

export interface SeedPlatformRepository {
  Get(
    query?: SeedPlatformFilterQueryParams,
  ): Promise<PaginationAPIResponse<ISeedPlatform>>;
}
