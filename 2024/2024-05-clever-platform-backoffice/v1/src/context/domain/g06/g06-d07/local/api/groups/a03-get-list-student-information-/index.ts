import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TBasePaginationResponse } from '@domain/g06/g06-d02/local/types';
import { TGetListGradeSettingStudentInfoReq } from '../../types/grade-setting';
import { TStudent } from '../../../types/students';

export const getListStudentInformation = async (
  params: TGetListGradeSettingStudentInfoReq,
) => {
  let response: AxiosResponse<TBasePaginationResponse<TStudent>>;

  try {
    response = await axiosWithAuth.get(`/grade-settings/v1/student-information`, {
      params: { ...params, year: params.year ? params.year : undefined },
    });
  } catch (error) {
    throw error;
  }

  return response;
};
