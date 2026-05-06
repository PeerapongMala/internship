import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TPostAddFamilyReq, TPostAddFamilyRes } from '../../../../helper/family';

export const addFamilyMember = async (body: TPostAddFamilyReq) => {
  let response: AxiosResponse<TPostAddFamilyRes>;
  try {
    response = await axiosWithAuth.post('/line-parent/v1/family/add-member', {
      ...body,
    });
  } catch (error) {
    throw error;
  }

  return response;
};
