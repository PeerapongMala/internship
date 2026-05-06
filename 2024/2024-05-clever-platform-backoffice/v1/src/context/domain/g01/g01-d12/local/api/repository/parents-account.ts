import {
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { ParentsAccountResponse } from '../../type';

export interface ParentsAccountRepository {
  // g07-d00-a01: parents account list
  Gets(
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<ParentsAccountResponse>>;
  GetById(id: string): Promise<ParentsAccountResponse>;
  Close(id: string): Promise<void>;
}
