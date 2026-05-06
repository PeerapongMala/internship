import axiosWithAuth from '@global/utils/axiosWithAuth';
import { TGetListRedeemReq, TGetListRedeemRes } from '../../../../helper/redeem';
import dayjs from 'dayjs';
import { AxiosError, AxiosResponse } from 'axios';

export const getList = async (
  req: TGetListRedeemReq,
  onError?: (error: AxiosError) => void,
) => {
  const query = req.Query;
  let response: AxiosResponse<TGetListRedeemRes>;
  try {
    response = await axiosWithAuth.get('/redeem/v1/coupon/list', {
      params: {
        ...query,
        started_at_start: query.started_at_start
          ? dayjs(query.started_at_start).toISOString()
          : undefined,
        started_at_end: query.started_at_end
          ? dayjs(query.started_at_end).toISOString()
          : undefined,
        ended_at_start: query.ended_at_start
          ? dayjs(query.ended_at_start).toISOString()
          : undefined,
        ended_at_end: query.ended_at_end
          ? dayjs(query.ended_at_end).toISOString()
          : undefined,
      },
    });
  } catch (error) {
    const err = error as AxiosError;
    onError?.(err);
    throw error;
  }

  const data = response.data;
  return data;
};
