import { AxiosResponse } from 'axios';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import {
  TGetHomeworkStatusReq,
  TGetHomeworkStatusRes,
} from '@domain/g05/local/api/helper/student';

export const getHomeworkStatus = async (req: TGetHomeworkStatusReq) => {
  let response: AxiosResponse<TGetHomeworkStatusRes>;
  try {
    response = await axiosWithAuth.get(
      `/line-parent/v1/homework/status/${req.student_id}/${req.class_id}`,
    );
  } catch (error) {
    throw error;
  }

  return response;
};
