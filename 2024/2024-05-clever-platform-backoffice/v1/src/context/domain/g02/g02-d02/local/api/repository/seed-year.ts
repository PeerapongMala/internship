import { ISeedYear } from '../../type';
import {
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

export interface SeedYearRepository {
  GetAll(query: BasePaginationAPIQueryParams): Promise<PaginationAPIResponse<ISeedYear>>;
}
