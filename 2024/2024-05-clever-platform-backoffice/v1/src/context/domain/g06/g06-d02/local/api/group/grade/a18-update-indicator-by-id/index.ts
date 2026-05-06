import axiosWithAuth from '@global/utils/axiosWithAuth';
import {
  TPatchEvaluationFormIndicatorReq,
  TPatchEvaluationFormIndicatorRes,
} from '../../../helper/grade';

export const patchIndicatorByID = async (
  id: number,
  body: TPatchEvaluationFormIndicatorReq,
) => {
  const response = await axiosWithAuth.patch<TPatchEvaluationFormIndicatorRes>(
    `/grade-system-form/v1/indicator/${id}`,
    body,
  );

  return response;
};
