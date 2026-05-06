import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TDocumentTemplate } from '../../../types/template';
import { TBasePaginationResponse } from '@global/types/api';
import { TGetListGradeSettingTemplateInfoReq } from '../../types/grade-setting';

export const getDocumentTemplate = async (
  params: TGetListGradeSettingTemplateInfoReq,
) => {
  let response: AxiosResponse<TBasePaginationResponse<TDocumentTemplate>>;

  try {
    response = await axiosWithAuth.get(`/grade-settings/v1/document_template`, {
      params: params,
    });
  } catch (error) {
    throw error;
  }

  return response;
};
