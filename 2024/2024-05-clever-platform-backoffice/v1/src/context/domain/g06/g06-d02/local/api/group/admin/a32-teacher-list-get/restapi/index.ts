import { AxiosError, AxiosResponse } from 'axios';
import { TTeacherListGetReq, TTeacherListGetRes } from '../../../../helper/admin';
import axiosWithAuth from '@global/utils/axiosWithAuth';
import { TTeacherUser } from '@domain/g06/g06-d02/local/types/admin';
import dayjs from 'dayjs';
import { TBasePaginationResponse } from '@domain/g06/g06-d02/local/types';

// g01-d04-a36
export const getTeacherList = async (
  options: TTeacherListGetReq,
  onError?: (err: AxiosError) => void,
  controller?: AbortController,
) => {
  let response: AxiosResponse<TTeacherListGetRes>;
  try {
    response = await axiosWithAuth.get(`/admin-school/v1/teachers`, {
      params: {
        ...options,
        search: options.search ? options.search : undefined,
        school_id: options.schoolID,
        grade_subject_id: options.grade_subject_id,
      },
      signal: controller?.signal,
    });
  } catch (error) {
    if ((error as any)?.name === 'CanceledError') {
      throw error;
    }

    onError?.(error as AxiosError);
    throw error;
  }

  const result: AxiosResponse<TBasePaginationResponse<TTeacherUser>> = {
    ...response,
    data: {
      ...response.data,
      data: response.data.data.map((user) => ({
        ...user,
        created_at: user.created_at ? dayjs(user.created_at) : null,
        updated_at: user.updated_at ? dayjs(user.updated_at) : null,
        last_login: user.last_login ? dayjs(user.last_login) : null,
      })),
    },
  };

  return result;
};
