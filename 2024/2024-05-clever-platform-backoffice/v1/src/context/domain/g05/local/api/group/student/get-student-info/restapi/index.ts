import {
  TGetStudentInfoReq,
  TGetStudentInfoRes,
} from '@domain/g05/local/api/helper/student';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';

export const getStudentInfo = async (req: TGetStudentInfoReq) => {
  let response: AxiosResponse<TGetStudentInfoRes>;
  try {
    response = await axiosWithAuth.get(
      `/line-parent/v1/homework/student/${req.userId}`,
      {},
    );
  } catch (error) {
    throw error;
  }

  return response;
};
