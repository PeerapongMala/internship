import { AxiosError, AxiosResponse } from 'axios';
import { TPostUploadReq, TPostUploadRes } from '../../../../helper/redeem';
import axiosWithAuth from '@global/utils/axiosWithAuth';

export const postUpload = async (
  req: TPostUploadReq,
  onError?: (error: AxiosError) => void,
) => {
  const body = req.Body;

  const formData = new FormData();
  formData.append('csv_file', body.csv_file);

  let response: AxiosResponse<TPostUploadRes>;
  try {
    response = await axiosWithAuth.post('/redeem/v1/coupon/csv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
