import { TLessonBulkEditBody } from '@domain/g02/g02-d03/local/Type';
import { TBaseResponse } from '@global/types/api';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';

export const LessonLevelBulkEdit = async (body: TLessonBulkEditBody) => {
  let response: AxiosResponse<TBaseResponse>;

  try {
    response = await axiosWithAuth.post(
      '/academic-level/v1/lesson-levels/bulk-edit',
      body,
    );
  } catch (error) {
    throw error;
  }

  return response;
};
