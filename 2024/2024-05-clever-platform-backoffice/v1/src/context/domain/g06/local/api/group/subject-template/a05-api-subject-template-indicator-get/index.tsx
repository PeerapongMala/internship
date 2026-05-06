import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import { TGetIndicatorSubjectTemplateByIDRes } from '../../../helpers/subject-template';

export const getIndicatorSubjectTemplateByID = async (id: number) => {
  let response: AxiosResponse<TGetIndicatorSubjectTemplateByIDRes>;
  try {
    response = await axiosWithAuth.get(`/subject-template/v1/indicators/${id}`);
  } catch (error) {
    throw error;
  }

  return response;
};
