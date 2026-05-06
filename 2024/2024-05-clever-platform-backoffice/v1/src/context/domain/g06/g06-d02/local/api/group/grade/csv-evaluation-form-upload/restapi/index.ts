import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TBaseResponse } from '../../../../../types';

export const csvEvaluationFormUpload = async (schoolID: string, file: File) => {
  let response: AxiosResponse<Omit<TBaseResponse, 'data'>>;
  try {
    response = await axiosWithAuth.post(
      `/grade-system-form/v1/${schoolID}/evaluation-form/upload/csv`,
      {
        csv_file: file,
      },
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
