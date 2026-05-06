import axiosWithAuth from '@global/utils/axiosWithAuth';
import { TGetSubjectListAndDetailRes } from '../../../helper/grade';
import { AxiosError } from 'axios';

export const getSubjectListAndDetailByEvaluationFormID = async (
  evaluationFormID: number,
  onError?: (error: AxiosError) => void,
) => {
  let response: TGetSubjectListAndDetailRes;
  try {
    response = await axiosWithAuth.get(
      `/grade-system-form/v1/subject/${evaluationFormID}`,
    );
  } catch (error) {
    onError?.(error as AxiosError);
    throw error;
  }

  response = {
    ...response,
    data: {
      ...response.data,
      data: response.data.data.map((item) => ({
        ...item,
        indicator: item.indicator ? item.indicator : [],
      })),
    },
  };

  return response;
};
