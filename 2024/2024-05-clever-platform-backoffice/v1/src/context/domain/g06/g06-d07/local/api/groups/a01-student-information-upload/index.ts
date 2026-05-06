import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TPostGradeSettingStudentInfoUploadReq } from '../../types/grade-setting';
import { TBaseResponse } from '@domain/g06/g06-d02/local/types';

export const uploadStudentInformation = async (
  body: TPostGradeSettingStudentInfoUploadReq,
) => {
  let response: AxiosResponse<TBaseResponse>;

  const formData = new FormData();

  Object.keys(body).forEach((key) => {
    const propKey = key as keyof typeof body;
    formData.append(propKey, body[propKey] as any);
  });

  try {
    response = await axiosWithAuth.post(
      `/grade-settings/v1/student-information/upload/csv`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  } catch (error) {
    throw error;
  }

  return response;
};
