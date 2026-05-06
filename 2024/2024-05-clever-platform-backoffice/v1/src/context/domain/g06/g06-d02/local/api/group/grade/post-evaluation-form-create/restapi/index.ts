import { AxiosError, AxiosResponse } from 'axios';
import { TPostEvaluationFormReq } from '../../../../helper/grade';
import { TBaseResponse } from '@domain/g06/g06-d02/local/types';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { TEvaluationForm } from '@domain/g06/g06-d02/local/types/grade';

export const postEvaluationFormCreate = async (
  body: TPostEvaluationFormReq,
  onError?: (err: AxiosError) => void,
) => {
  let response: AxiosResponse<TBaseResponse<Partial<TEvaluationForm>>>;
  try {
    response = await axiosWithAuth.post('/grade-system-form/v1/evaluation-form', body);
  } catch (error) {
    onError?.(error as AxiosError);
    throw error;
  }

  return response;
};
