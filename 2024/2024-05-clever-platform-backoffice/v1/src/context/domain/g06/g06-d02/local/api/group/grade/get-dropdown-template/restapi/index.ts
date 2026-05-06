import { TBasePaginationResponse } from '@domain/g06/g06-d02/local/types';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import {
  TGetDropdownEvaluationTemplateReq,
  TGetDropdownEvaluationTemplateRes,
} from '../../../../helper/grade';

export const getDropdownEvaluationTemplate = async (
  req: TGetDropdownEvaluationTemplateReq,
  onError?: (error: unknown) => void,
) => {
  let response: AxiosResponse<TBasePaginationResponse<TGetDropdownEvaluationTemplateRes>>;
  try {
    response = await axiosWithAuth.get(
      `/grade-system-form/v1/drop-down/${req.school_id}/template-list`,
      {
        params: {
          ...req,
          limit: req.limit ?? -1,
        },
      },
    );
  } catch (error) {
    onError?.(error);
    throw error;
  }

  return response.data;
};
