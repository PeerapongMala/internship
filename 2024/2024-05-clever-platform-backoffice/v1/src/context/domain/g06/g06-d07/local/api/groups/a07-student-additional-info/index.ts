import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TBasePaginationResponse } from '@domain/g06/g06-d02/local/types';
import { TGetListGradeSettingStudentAddressReq } from '../../types/grade-setting';
import { TStudentAdditionalInfo } from '../../../types/students';

export const getListStudentAdditionalInfo = async (
  params: TGetListGradeSettingStudentAddressReq,
) => {
  let response: AxiosResponse<TBasePaginationResponse<TStudentAdditionalInfo>>;

  try {
    response = await axiosWithAuth.get(`/grade-settings/v1/student-address`, {
      params: { ...params, year: params.year ? params.year : undefined },
    });
  } catch (error) {
    throw error;
  }

  return response;
};
