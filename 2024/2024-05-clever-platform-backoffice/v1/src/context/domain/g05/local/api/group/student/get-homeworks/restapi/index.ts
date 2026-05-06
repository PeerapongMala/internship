import { AxiosResponse } from 'axios';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { TGetHomeworksReq, TGetHomeworksRes } from '@domain/g05/local/api/helper/student';

export const getHomeworks = async (req: TGetHomeworksReq) => {
  let response: AxiosResponse<TGetHomeworksRes>;
  try {
    response = await axiosWithAuth.get(
      `/line-parent/v1/homeworks/${req.student_id}/${req.class_id}`,
    );
  } catch (error) {
    throw error;
  }

  return response;
};
