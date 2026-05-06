import axiosWithAuth from '@global/utils/axiosWithAuth';
import {
  TGetAcademicSubLessonReq,
  TGetAcademicSubLessonRes,
} from '../../../../helpers/academic';
import { AxiosResponse } from 'axios';

export const getSubLessonByLessonID = async (
  lessonID: number,
  params?: TGetAcademicSubLessonReq,
) => {
  let response: AxiosResponse<TGetAcademicSubLessonRes>;
  try {
    response = await axiosWithAuth.get(
      `/academic-sub-lesson/v1/${lessonID}/sub-lessons?page=1&limit=-1`,
      { params },
    );
  } catch (error) {
    throw error;
  }

  return response;
};
