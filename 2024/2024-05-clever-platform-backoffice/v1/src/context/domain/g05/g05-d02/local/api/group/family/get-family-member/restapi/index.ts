import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TGetFamilyReq, TGetFamilyRes } from '../../../../helper/family';
import { TBaseResponse } from '@domain/g06/g06-d02/local/types';
import { TFamily } from '@domain/g05/g05-d02/local/types/family';

export const getFamily = async (req: TGetFamilyReq) => {
  let response: AxiosResponse<TGetFamilyRes>;
  try {
    response = await axiosWithAuth.get(`/line-parent/v1/family/members`, {
      params: {
        limit: -1,
      },
    });
  } catch (error) {
    throw error;
  }

  const data = response.data.data;
  const result: AxiosResponse<TBaseResponse<TFamily>> = {
    ...response,
    data: {
      ...response.data,
      data: {
        family_id: data.family_id,
        id: data.family_id,
        members: data.member,
      },
    },
  };

  return result;
};
