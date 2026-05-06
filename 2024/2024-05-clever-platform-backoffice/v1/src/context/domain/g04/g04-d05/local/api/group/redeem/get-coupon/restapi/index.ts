import { AxiosError, AxiosResponse } from 'axios';
import { TGetCouponReq, TGetCouponRes } from '../../../../helper/redeem';
import axiosWithAuth from '@global/utils/axiosWithAuth';

export const getCoupon = async (
  req: TGetCouponReq,
  onError?: (error: AxiosError) => void,
) => {
  let response: AxiosResponse<TGetCouponRes>;

  const startDate = req.Query?.used_at_start
    ? req.Query?.used_at_start.toISOString()
    : undefined;
  const endDate = req.Query?.used_at_end
    ? req.Query?.used_at_end.toISOString()
    : undefined;

  try {
    response = await axiosWithAuth.get(
      `/redeem/v1/coupon/transaction/list/${req.Param.couponId}`,
      {
        params: {
          ...req.Query,
          used_at_start: startDate,
          used_at_end: endDate,
        },
      },
    );
  } catch (error) {
    const err = error as AxiosError;
    onError?.(err);
    throw error;
  }

  return response.data;
};
