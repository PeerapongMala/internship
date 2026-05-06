import { AxiosResponse } from 'axios';
import {
  TPatchEvaluationSheetReq,
  TPatchEvaluationSheetRes,
} from '../../../../helper/grade';
import axiosWithAuth from '@global/utils/axiosWithAuth';

export const patchEvaluationSheet = async (
  evaluationSheetId: number,
  body: TPatchEvaluationSheetReq,
) => {
  let response: AxiosResponse<TPatchEvaluationSheetRes>;

  try {
    response = await axiosWithAuth.patch(
      `/grade-system-form/v1/evaluation-sheet/${evaluationSheetId}`,
      body,
    );
  } catch (error) {
    throw error;
  }

  return response;
};
