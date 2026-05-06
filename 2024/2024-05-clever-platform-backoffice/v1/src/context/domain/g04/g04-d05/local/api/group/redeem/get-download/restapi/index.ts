import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosError, AxiosResponse } from 'axios';
import { TGetDownloadReq, TGetDownloadRes } from '../../../../helper/redeem';

export const getDownload = async (
  req: TGetDownloadReq,
  onError?: (error: AxiosError) => void,
) => {
  try {
    const response: AxiosResponse<Blob> = await axiosWithAuth.get(
      '/redeem/v1/coupon/csv/download',
      {
        params: {
          start_date: req.start_date,
          end_date: req.end_date,
        },
        responseType: 'blob',
      },
    );

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    onError?.(err);
    throw error;
  }
};
