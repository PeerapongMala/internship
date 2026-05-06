import { ICurriculum } from '../../type';
import {
  FailedAPIResponse,
  PaginationAPIResponse,
  BasePaginationAPIQueryParams,
} from '@global/utils/apiResponseHelper';
export interface FilterQueryParams extends BasePaginationAPIQueryParams {
  search_text?: string;
}
export interface CurriculumRepository {
  GetAll: (
    filter: FilterQueryParams,
  ) => Promise<PaginationAPIResponse<ICurriculum> | FailedAPIResponse>;
}
