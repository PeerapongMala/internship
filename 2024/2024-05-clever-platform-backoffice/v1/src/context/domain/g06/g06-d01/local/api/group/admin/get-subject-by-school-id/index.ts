import axiosWithAuth from '@global/utils/axiosWithAuth';
import { AxiosResponse } from 'axios';
import {
  TGetSubjectBySchoolIDReq,
  TGetSubjectBySchoolIDRes,
} from '../../../helper/admin-school';
import dayjs from '@global/utils/dayjs';
import { TSubject } from '@domain/g06/g06-d01/local/type/subject';
import { TBasePaginationResponse } from '@domain/g06/g06-d02/local/types';

export const getSubjectBySchoolID = async (
  schoolID: string,
  options?: TGetSubjectBySchoolIDReq,
) => {
  let response: AxiosResponse<TGetSubjectBySchoolIDRes>;

  try {
    response = await axiosWithAuth.get(`/admin-school/v1/schools/${schoolID}/subjects`, {
      params: options,
    });
  } catch (error) {
    throw error;
  }

  const result: AxiosResponse<TBasePaginationResponse<TSubject>> = {
    ...response,
    data: {
      ...response.data,
      data: response.data.data.map((subject) => ({
        ...subject,
        updated_at: subject.updated_at ? dayjs(subject.updated_at) : null,
        created_at: subject.created_at ? dayjs(subject.created_at) : null,
      })),
    },
  };

  return result;
};
