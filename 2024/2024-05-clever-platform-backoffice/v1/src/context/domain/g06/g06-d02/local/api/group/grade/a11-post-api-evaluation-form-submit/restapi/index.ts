import { TBaseResponse } from '@domain/g06/g06-d02/local/types';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';

export const postEvaluationFormSubmit = async (evaluationFormID: number) => {
  let response: AxiosResponse<Omit<TBaseResponse, 'data'>>;
  try {
    response = await axiosWithAuth.post(
      `grade-system-form/v1/evaluation-form/${evaluationFormID}/submit`,
    );
  } catch (error) {
    throw error;
  }

  return response;
};
