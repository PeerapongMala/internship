import { AxiosError, AxiosResponse } from 'axios';
import { TPutGradeResponsiblePersonReq } from '../../../../helper/grade';
import { TBaseResponse } from '@domain/g06/g06-d02/local/types';
import axiosWithAuth from '@global/utils/axiosWithAuth';

export const putGradeResponsiblePerson = async (
  evaluationFormID: number,
  body: TPutGradeResponsiblePersonReq,
  onError?: (err: AxiosError) => void,
) => {
  let response: AxiosResponse<Omit<TBaseResponse, 'data'>>;

  try {
    response = await axiosWithAuth.put(
      `/grade-system-form/v1/responsible-person/${evaluationFormID}`,
      {
        data: [...body],
      },
    );
  } catch (error) {
    onError?.(error as AxiosError);
    throw error;
  }

  return response;
};
