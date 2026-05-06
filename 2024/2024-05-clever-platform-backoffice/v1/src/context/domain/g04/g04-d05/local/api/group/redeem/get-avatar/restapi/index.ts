import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosError, AxiosResponse } from 'axios';
import { TGetListAvatarReq, TGetListAvatarRes } from '../../../../helper/avatar';

export const getAvatar = async (
  req: TGetListAvatarReq,
  onError?: (error: AxiosError) => void,
) => {
  let response: AxiosResponse<TGetListAvatarRes>;
  try {
    response = await axiosWithAuth.get('/redeem/v1/drop-down/avatar');
  } catch (error) {
    const err = error as AxiosError;
    onError?.(err);
    throw error;
  }

  const data = response.data;
  return data;
};
