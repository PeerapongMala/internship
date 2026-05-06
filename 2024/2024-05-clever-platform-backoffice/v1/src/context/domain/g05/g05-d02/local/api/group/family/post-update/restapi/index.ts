import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosError, AxiosResponse } from 'axios';
import { TPostUpdateDataReq, TPostUpdateDataRes } from '../../../../helper/family';

export const postUpdateData = async (
  req: TPostUpdateDataReq,
  onError?: (error: AxiosError) => void,
) => {
  const body = req.Body;
  let response: AxiosResponse<TPostUpdateDataRes>;
  try {
    response = await axiosWithAuth.post('/line-parent/v1/family/update-data', body);
  } catch (error) {
    const err = error as AxiosError;
    onError?.(err);
    throw error;
  }

  const data = response.data;
  return data;
};
