import { TContentSubject } from '@domain/g06/local/types/content';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosError, AxiosResponse } from 'axios';
import { TPatchSubjectListAndDetailByIDRes } from '../../../../helper/grade';

export const patchUpdateSubjectByEvaluationFormID = async (
  evaluationFormId: number,
  body: TContentSubject[],
  onError?: (error: AxiosError) => void,
) => {
  let response: AxiosResponse<TPatchSubjectListAndDetailByIDRes>;
  try {
    response = await axiosWithAuth.patch(
      `/grade-system-form/v1/subject/${evaluationFormId}`,
      { data: body },
    );
  } catch (error) {
    onError?.(error as AxiosError);
    throw error;
  }

  return response;
};
