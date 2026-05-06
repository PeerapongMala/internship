import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TBaseResponse } from '@global/types/api';
import { TPostSubjectTemplateUpdateBody } from '../../../helpers/subject-template';

export const postSubjectTemplateUpdate = async (
  id: number,
  body: TPostSubjectTemplateUpdateBody,
) => {
  let response: AxiosResponse<TBaseResponse<undefined>>;
  try {
    response = await axiosWithAuth.patch(`/subject-template/v1/templates/${id}`, body);
  } catch (error) {
    throw error;
  }

  return response;
};
