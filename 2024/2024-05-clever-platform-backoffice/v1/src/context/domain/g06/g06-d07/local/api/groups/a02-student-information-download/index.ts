import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TGetGradeSettingStudentInfoDownloadReq } from '../../types/grade-setting';

export const downloadStudentInformation = async (
  params: TGetGradeSettingStudentInfoDownloadReq,
) => {
  let response: AxiosResponse<Blob>;

  try {
    response = await axiosWithAuth.get(
      `/grade-settings/v1/student-information/download/csv`,
      { params: params, responseType: 'blob' },
    );

    response.data = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
  } catch (error) {
    throw error;
  }

  return response;
};
