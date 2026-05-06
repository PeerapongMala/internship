import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TBaseResponse } from '@global/types/api';
import {
  TPostSubjectTemplateCreateBody,
  TPostSubjectTemplateCreateRes,
} from '../../../helpers/subject-template';

export const postSubjectTemplateCreate = async (body: TPostSubjectTemplateCreateBody) => {
  let response: AxiosResponse<TBaseResponse<TPostSubjectTemplateCreateRes[]>>;
  try {
    response = await axiosWithAuth.post(`/subject-template/v1/templates`, body);
  } catch (error) {
    throw error;
  }

  return response;
};
