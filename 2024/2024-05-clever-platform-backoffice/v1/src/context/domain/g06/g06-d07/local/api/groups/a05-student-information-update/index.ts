import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TStudent } from '../../../types/students';
import { TBaseResponse } from '@global/types/api';
import { TPostGradeSettingStudentInfoReq } from '../../types/grade-setting';

export const postStudentUpdate = async (
  // id of student. not student_id
  id: number,
  body: TPostGradeSettingStudentInfoReq,
) => {
  let response: AxiosResponse<TBaseResponse<TStudent>>;

  try {
    response = await axiosWithAuth.post(
      `/grade-settings/v1/student-information/${id}`,
      body,
    );
  } catch (error) {
    throw error;
  }

  return response;
};
