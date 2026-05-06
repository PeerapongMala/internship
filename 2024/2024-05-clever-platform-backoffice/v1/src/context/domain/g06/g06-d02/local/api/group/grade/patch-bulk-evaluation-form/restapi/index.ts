import { TBaseResponse } from '@domain/g06/g06-d02/local/types';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TPatchBulkEvaluationForm } from '../../../../helper/grade';

export const patchBulkEvaluationForm = async (items: TPatchBulkEvaluationForm) => {
  let response: AxiosResponse<Omit<TBaseResponse, 'data'>>;

  const payload = {
    bulk_edit_list: items.map((item) => ({
      ...item,
      created_at: item.created_at?.toISOString(),
      updated_at: item.updated_at?.toISOString(),
    })),
  };

  try {
    response = await axiosWithAuth.patch(
      `/grade-system-form/v1/evaluation-form/bulk-edit`,
      payload,
    );
  } catch (error) {
    throw error;
  }

  return response;
};
