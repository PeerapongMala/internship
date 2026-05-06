import { AxiosResponse } from 'axios';
import {
  TGetListEvaluationSheetReq,
  TGetListEvaluationSheetRes,
} from '../../../../helper/grade';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import dayjs from '@global/utils/dayjs';
import { TEvaluationSheet } from '@domain/g06/g06-d02/local/types/grade';
import { TBasePaginationResponse } from '@domain/g06/g06-d02/local/types';

export const getListEvaluationSheet = async (params: TGetListEvaluationSheetReq) => {
  let response: AxiosResponse<TGetListEvaluationSheetRes>;

  try {
    response = await axiosWithAuth.get('/grade-system-form/v1/evaluation-sheet', {
      params: params,
    });
  } catch (error) {
    throw error;
  }

  const result: AxiosResponse<TBasePaginationResponse<TEvaluationSheet>> = {
    ...response,
    data: {
      ...response.data,
      data: response.data.data.map((sheet) => ({
        ...sheet,
        created_at: sheet.created_at ? dayjs(sheet.created_at) : null,
        updated_at: sheet.updated_at ? dayjs(sheet.updated_at) : null,
      })),
    },
  };

  return result;
};
