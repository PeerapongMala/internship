import axiosWithAuth from '@global/utils/axiosWithAuth';
import {
  TGetListAcademicYearReq,
  TGetListAcademicYearRes,
} from '../../../helpers/teacher';
import { AxiosResponse } from 'axios';

//bo-g03-d04-teacher-student-api-academic-year-list
export const getAcademicYearBySchoolID = async (params: TGetListAcademicYearReq) => {
  let response: AxiosResponse<TGetListAcademicYearRes>;
  try {
    response = await axiosWithAuth.get(`/teacher-student/v1/academic-year-ranges`, {
      params: params,
    });
  } catch (error) {
    throw error;
  }

  return response;
};
