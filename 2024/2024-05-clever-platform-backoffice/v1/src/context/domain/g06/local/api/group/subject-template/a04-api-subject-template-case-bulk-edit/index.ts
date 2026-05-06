import { AxiosResponse } from 'axios';
import { TPostSubjectTemplateBulkEditBody } from '../../../helpers/subject-template';
import { TBaseResponse } from '@global/types/api';
import axiosWithAuth from '@global/utils/axiosWithAuth';

export async function postSubjectTemplateBulkEdit(
  body: TPostSubjectTemplateBulkEditBody,
) {
  let response: AxiosResponse<TBaseResponse<undefined>>;
  try {
    response = await axiosWithAuth.post(`/subject-template/v1/bulk-edit`, body);
  } catch (error) {
    throw error;
  }

  return response;
}
