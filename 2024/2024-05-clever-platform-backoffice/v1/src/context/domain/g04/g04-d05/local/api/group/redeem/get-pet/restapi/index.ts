import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosError, AxiosResponse } from 'axios';
import { TGetListPetReq, TGetListPetRes } from '../../../../helper/pet';

export const getPet = async (
  req: TGetListPetReq,
  onError?: (error: AxiosError) => void,
) => {
  let response: AxiosResponse<TGetListPetRes>;
  try {
    response = await axiosWithAuth.get('/redeem/v1/drop-down/pet');
  } catch (error) {
    const err = error as AxiosError;
    onError?.(err);
    throw error;
  }

  const data = response.data;
  return data;
};
