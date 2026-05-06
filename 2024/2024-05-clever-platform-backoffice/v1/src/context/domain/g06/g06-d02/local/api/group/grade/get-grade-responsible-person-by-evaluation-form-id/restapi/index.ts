import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosError, AxiosResponse } from 'axios';
import { TGetGradeResponsiblePersonRes } from '../../../../helper/grade';

export const getGradeResponsiblePersonByEvaluationID = async (
  evaluationFormID: number,
  onError?: (error: AxiosError) => void,
) => {
  let response: AxiosResponse<TGetGradeResponsiblePersonRes>;
  try {
    response = await axiosWithAuth.get(
      `/grade-system-form/v1/responsible-person/${evaluationFormID}`,
    );
  } catch (error) {
    onError?.(error as AxiosError);
    throw error;
  }

  return response;
};
