import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosError, AxiosResponse } from 'axios';
import { TPostListRedeemReq, TPostListRedeemRes } from '../../../../helper/redeem';

export const post = async (
  req: TPostListRedeemReq,
  onError?: (error: AxiosError) => void,
) => {
  const body = req.Body;
  let response: AxiosResponse<TPostListRedeemRes>;
  try {
    response = await axiosWithAuth.post('/redeem/v1/coupon/create', body);
  } catch (error) {
    const err = error as AxiosError;
    onError?.(err);
    throw error;
  }

  const data = response.data;
  return data;
};
