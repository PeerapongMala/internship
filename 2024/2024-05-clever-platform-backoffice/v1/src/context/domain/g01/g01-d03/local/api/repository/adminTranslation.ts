import { ICurriculum } from '../../type';
import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '../helper';

export interface AdminTranslationFilterQueryParams extends BasePaginationAPIQueryParams {
  search_text?: string;
}

export interface AdminTranslationRepository {
  GetG00D00A01(
    query: AdminTranslationFilterQueryParams,
  ): Promise<PaginationAPIResponse<ICurriculum>>;
}
