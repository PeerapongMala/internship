import { AxiosResponse } from 'axios';
import { TPatchEvaluationForm } from '../../../../helper/grade';
import { TBaseResponse } from '@domain/g06/g06-d02/local/types';
import axiosWithAuth from '@global/utils/axiosWithAuth';

export const patchEvaluationForm = async (id: number, body: TPatchEvaluationForm) => {
  let response: AxiosResponse<Omit<TBaseResponse, 'data'>>;

  try {
    response = await axiosWithAuth.patch(`/grade-system-form/v1/evaluation-form/${id}`, {
      ...body,
      created_at: undefined,
      updated_at: body.updated_at?.toISOString(),
    });
  } catch (error) {
    throw error;
  }

  return response;
};
