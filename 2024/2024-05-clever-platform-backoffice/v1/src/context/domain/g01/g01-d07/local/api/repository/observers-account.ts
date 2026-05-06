import { ObserverAccessResponse, ObserversAccountResponse } from '../../../local/type.ts';
import {
  BasePaginationAPIQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

interface GetObserverAccessesParams {
  access_name?: string;
}

export interface ObserversAccountRepository {
  // g07-d00-a01: parents account list
  Gets(
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<ObserversAccountResponse>>;
  GetById(id: string): Promise<ObserversAccountResponse>;
  Close(id: string): Promise<void>;
  GetObserverAccesses(
    params?: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<ObserverAccessResponse>>;
  UpdateObserverAccesses(userId: string, observer_accesses: number[]): Promise<void>;
}
