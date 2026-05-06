import {
  TGetStudentInFamilyReq,
  TGetStudentInFamilyRes,
} from '@domain/g05/local/api/helper/student';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';

export const getStudentInFamily = async (req: TGetStudentInFamilyReq) => {
  let response: AxiosResponse<TGetStudentInFamilyRes>;
  try {
    response = await axiosWithAuth.get(`/line-parent/v1/homework/students`, {
      params: {
        page: req.page,
        limit: req.limit,
      },
    });
  } catch (error) {
    throw error;
  }

  return response;
};
