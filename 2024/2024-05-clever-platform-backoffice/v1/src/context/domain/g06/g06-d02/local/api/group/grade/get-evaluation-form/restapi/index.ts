import { AxiosResponse } from 'axios';
import {
  TGetEvaluationFormListReq,
  TGetEvaluationFormListRes,
} from '../../../../helper/grade';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { TEvaluationForm } from '@domain/g06/g06-d02/local/types/grade';
import { TBasePaginationResponse } from '@domain/g06/g06-d02/local/types';
import dayjs from 'dayjs';

export const getEvaluationFormList = async (
  req: TGetEvaluationFormListReq,
  controller?: AbortController,
) => {
  let response: AxiosResponse<TGetEvaluationFormListRes>;
  try {
    response = await axiosWithAuth.get(
      `/grade-system-form/v1/${req.schoolID}/evaluation-form`,
      {
        params: {
          ...req,
        },
        signal: controller?.signal,
      },
    );
  } catch (error) {
    throw error;
  }

  const data = response.data;
  const result: TBasePaginationResponse<TEvaluationForm> = {
    ...data,
    data: data.data.map((item) => ({
      ...item,
      created_at: item.created_at ? dayjs(item.created_at) : null,
      updated_at: item.updated_at ? dayjs(item.updated_at) : null,
    })),
  };

  return result;
};
