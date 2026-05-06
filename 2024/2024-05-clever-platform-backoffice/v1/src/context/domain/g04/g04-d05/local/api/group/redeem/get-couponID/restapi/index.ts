import { AxiosError, AxiosResponse } from 'axios';
import { TGetCouponIDReq, TGetCouponIDRes } from '../../../../helper/redeem';
import axiosWithAuth from '@global/utils/axiosWithAuth';

export const getCouponID = async (
  req: TGetCouponIDReq,
  onError?: (error: AxiosError) => void,
): Promise<TGetCouponIDRes> => {
  try {
    const response: AxiosResponse<TGetCouponIDRes> = await axiosWithAuth.get(
      `/redeem/v1/coupon/${req.Param.couponId}`,
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    onError?.(err);
    throw error;
  }
};
