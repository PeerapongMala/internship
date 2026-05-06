import { AxiosRequestConfig } from 'axios';
import {
  bulkEditAdminReportPermission,
  deletesArpDeleteSchool,
  getAdminReportPermission,
  getsAdminReportPermission,
  getsArpObserverAccessListSchool,
  getsArpSchoolList,
  postArpObserverAccesses,
  putArpObserverAccesses,
  putArpUpdateSchools as putsArpUpdateSchool,
} from '../group/admin-report-permission/restapi';
import {
  TGetsAdminPermissionOption,
  TResultGetsAdminReportPermission,
  TResBulkEditAdminReportPermission,
  TEditStatusAdminReportPermission,
  TAdminReportPermission,
  TReqPostArpObserverAccesses,
  TReqPutArpObserverAccesses,
  TReqGetsArpObserverAccessListSchool,
  TResGetsArpObserverAccessListSchool,
  TReqGetsArpSchoolList,
  TResGetsArpSchoolList,
  TResDeletesArpUpdateSchool,
} from '../helper/admin-report-permission';

interface AdminReportPermissionRepository {
  GetsAdminReportPermission: (
    params: TGetsAdminPermissionOption,
    abortController?: AbortController,
  ) => Promise<TResultGetsAdminReportPermission>;
  BulkEditAdminReportPermission: (
    lists: TEditStatusAdminReportPermission[],
  ) => Promise<TResBulkEditAdminReportPermission>;
  GetAdminReportPermission: (id: number) => Promise<TAdminReportPermission>;
  PostArpObserverAccesses: (
    payload: TReqPostArpObserverAccesses,
  ) => Promise<TAdminReportPermission>;
  PutArpObserverAccesses: (
    id: number,
    payload: TReqPutArpObserverAccesses,
  ) => Promise<TAdminReportPermission>;
  GetsArpObserverAccessListSchool: (
    observerAccessId: number,
    params: TReqGetsArpObserverAccessListSchool,
    config?: AxiosRequestConfig,
  ) => Promise<TResGetsArpObserverAccessListSchool>;
  GetsArpSchoolList: (
    params: TReqGetsArpSchoolList,
    config?: AxiosRequestConfig,
  ) => Promise<TResGetsArpSchoolList>;
  PutsArpUpdateSchool: (
    observerAccessId: number,
    schoolId: number[],
  ) => Promise<number[]>;
  DeletesArpDeleteSchool: (
    observerAccessId: number,
    schoolId: number[],
  ) => Promise<TResDeletesArpUpdateSchool>;
}

export const adminReportPermissionRepo: AdminReportPermissionRepository = {
  GetsAdminReportPermission: getsAdminReportPermission,
  BulkEditAdminReportPermission: bulkEditAdminReportPermission,
  GetAdminReportPermission: getAdminReportPermission,
  PostArpObserverAccesses: postArpObserverAccesses,
  PutArpObserverAccesses: putArpObserverAccesses,
  GetsArpObserverAccessListSchool: getsArpObserverAccessListSchool,
  GetsArpSchoolList: getsArpSchoolList,
  PutsArpUpdateSchool: putsArpUpdateSchool,
  DeletesArpDeleteSchool: deletesArpDeleteSchool,
};
