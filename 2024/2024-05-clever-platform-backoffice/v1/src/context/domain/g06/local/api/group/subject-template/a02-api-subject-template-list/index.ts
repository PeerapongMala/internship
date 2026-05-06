import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import {
  TGetListSubjectTemplateReq,
  TGetListSubjectTemplateRes,
} from '../../../helpers/subject-template';

export const getSubjectTemplateLists = async (params: TGetListSubjectTemplateReq) => {
  let response: AxiosResponse<TGetListSubjectTemplateRes>;
  try {
    response = await axiosWithAuth.get(`/subject-template/v1/templates`, {
      params: params,
    });
  } catch (error) {
    throw error;
  }

  return response;
};
