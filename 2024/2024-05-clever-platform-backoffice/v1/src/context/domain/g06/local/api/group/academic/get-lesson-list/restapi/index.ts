import axiosWithAuth from '@global/utils/axiosWithAuth';
import {
  TGetAcademicLessonReq,
  TGetAcademicLessonRes,
} from '../../../../helpers/academic';
import { AxiosResponse } from 'axios';

export const getLessonByLessonID = async (
  subjectID: number,
  params?: TGetAcademicLessonReq,
) => {
  let response: AxiosResponse<TGetAcademicLessonRes>;
  try {
    response = await axiosWithAuth.get(`/academic-lesson/v1/${subjectID}/lessons`, {
      params,
    });
  } catch (error) {
    throw error;
  }

  return response;
};
