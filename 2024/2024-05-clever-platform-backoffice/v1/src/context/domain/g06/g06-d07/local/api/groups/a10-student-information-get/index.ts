import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TStudent } from '../../../types/students';
import { TBaseResponse } from '@global/types/api';

export const getStudentInformation = async (
  // id of student. not student_id
  id: number,
) => {
  let response: AxiosResponse<TBaseResponse<TStudent>>;

  try {
    response = await axiosWithAuth.get(`/grade-settings/v1/student-information/${id}`);
  } catch (error) {
    throw error;
  }

  return response;
};
