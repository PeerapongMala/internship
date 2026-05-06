import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { StatusRedeem } from '../types/redeem';
export interface RedeemFilterQueryParams extends BasePaginationAPIQueryParams {
  status?: StatusRedeem | undefined;
  academic_year?: number;
}
export interface RedeemRepository {
  GetsRedeem(query: RedeemFilterQueryParams): Promise<PaginationAPIResponse<any>>;
  ToggleStatus(
    couponTransactionId: number,
    isEnabled: StatusRedeem,
  ): Promise<DataAPIResponse<any>>;
}
