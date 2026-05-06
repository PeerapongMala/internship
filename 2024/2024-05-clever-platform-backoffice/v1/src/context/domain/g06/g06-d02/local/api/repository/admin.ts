import { AxiosError, AxiosResponse } from 'axios';
import { TBasePaginationResponse } from '../../types';
import { TTeacherUser } from '../../types/admin';
import { TTeacherListGetReq } from '../helper/admin';
import { getTeacherList } from '../group/admin/a32-teacher-list-get/restapi';

export interface AdminRepository {
  GetTeacherList: (
    options: TTeacherListGetReq,
    onError?: (err: AxiosError) => void,
    controller?: AbortController,
  ) => Promise<AxiosResponse<TBasePaginationResponse<TTeacherUser>, any>>;
}

export const adminRepository: AdminRepository = {
  GetTeacherList: getTeacherList,
};
