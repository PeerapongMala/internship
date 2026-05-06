import { DataAPIResponse } from '@core/helper/api-type';

export interface RedeemRepository {
  redeemCoupon: (couponCode: string) => Promise<DataAPIResponse<any>>;
}
