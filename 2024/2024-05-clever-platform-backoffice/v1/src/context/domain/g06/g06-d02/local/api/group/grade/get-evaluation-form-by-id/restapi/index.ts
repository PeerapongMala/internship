import { TBaseResponse } from '@domain/g06/g06-d02/local/types';
import { TEvaluationForm } from '@domain/g06/g06-d02/local/types/grade';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosError, AxiosResponse } from 'axios';
import dayjs from '@global/utils/dayjs';

export const getEvaluationFormByID = async (
  id: number,
  onError?: (error: AxiosError) => void,
) => {
  let response: AxiosResponse<Pick<TBaseResponse<TEvaluationForm>, 'data'>>;

  try {
    response = await axiosWithAuth.get(`/grade-system-form/v1/evaluation-form/${id}`);
  } catch (error) {
    onError?.(error as AxiosError);
    throw error;
  }

  if (!response.data.data.wizard_index) {
    response.data.data.wizard_index = 1;
  }
  response.data.data.created_at = response.data.data?.created_at
    ? dayjs(response.data.data.created_at)
    : null;
  response.data.data.updated_at = response.data.data?.updated_at
    ? dayjs(response.data.data.updated_at)
    : null;

  return response;
};
