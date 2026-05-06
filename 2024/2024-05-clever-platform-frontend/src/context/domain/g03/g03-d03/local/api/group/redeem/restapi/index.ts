import { BaseAPIResponse, DataAPIResponse } from '@core/helper/api-type';
import { fetchWithAuth } from '@global/helper/fetch';
import StoreGlobalPersist from '@store/global/persist';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

// const redeemCoupon = (couponCode: string): Promise<BaseAPIResponse> => {
//   const url = `${BACKEND_URL}/redeem-game/v1/redeem/coupon/${couponCode}`;
//   return fetchWithAuth(url, {
//     method: 'POST',
//   })
//     .then((res) => res.json())
//     .then((res: BaseAPIResponse) => {
//       return res;
//     });
// };
const redeemCoupon = (couponCode: string): Promise<DataAPIResponse<any>> => {
  const url = `${BACKEND_URL}/redeem-game/v1/redeem/coupon/${couponCode}`;
  return fetchWithAuth(url, {
    method: 'POST',
  })
    .then((res) => res.json())
    .then((res: BaseAPIResponse) => {
      return {
        status_code: res.status_code,
        message: res.message,
        data: res.data, // Add the data property here
      } as DataAPIResponse<any>;
    })
    .catch((error) => {
      return error;
    });
};

export default redeemCoupon;
