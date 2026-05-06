import axiosWithAuth from '@global/utils/axiosWithAuth';
import {
  TAdminReportPermission,
  TGetsAdminPermissionOption,
  TResGetsAdminReportPermission,
  TResultGetsAdminReportPermission,
  TResBulkEditAdminReportPermission,
  TEditStatusAdminReportPermission,
  TReqBulkEditAdminReportPermission,
  TAdminReportPermissionSchoolList,
  TResGetAdminReportPermission,
  TReqPostArpObserverAccesses,
  TReqPutArpObserverAccesses,
  TReqGetsArpObserverAccessListSchool,
  TResGetsArpObserverAccessListSchool,
  TReqGetsArpSchoolList,
  TResGetsArpSchoolList,
  TResPostArpObserverAccesses,
  TResPutArpObserverAccesses,
  TResPutsArpUpdateSchool,
  TResDeletesArpUpdateSchool,
} from '../../../helper/admin-report-permission';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export const getAdminReportPermission = async (
  id: number,
): Promise<TAdminReportPermission> => {
  let response: AxiosResponse<TResGetAdminReportPermission>;
  try {
    response = await axiosWithAuth.get(
      `/admin-report-permission/v1/observer-accesses/${id}`,
    );
  } catch (error) {
    throw error;
  }

  const result = response.data.data[0];

  if (!result) throw new Error('No admin report permission data found');

  return {
    ...result,
    created_at: result.created_at ? new Date(result.created_at) : null,
    updated_at: result.updated_at ? new Date(result.updated_at) : null,
  };
};

export const getsAdminReportPermission = async (
  params: TGetsAdminPermissionOption,
  abortController?: AbortController,
): Promise<TResultGetsAdminReportPermission> => {
  const url = '/admin-report-permission/v1/observer-accesses';

  try {
    const response = await axiosWithAuth.get(url, {
      params: params,
      signal: abortController?.signal,
    });

    const data: TResGetsAdminReportPermission = response.data;

    const transformData = data.data.map((report) => {
      return {
        ...report,
        created_at: report.created_at ? new Date(report.created_at) : null,
        updated_at: report.updated_at ? new Date(report.updated_at) : null,
      } as TAdminReportPermission;
    });

    return {
      ...data,
      data: transformData,
    } as TResultGetsAdminReportPermission;
  } catch (error) {
    throw error;
  }
};

export const bulkEditAdminReportPermission = async (
  lists: TEditStatusAdminReportPermission[],
): Promise<TResBulkEditAdminReportPermission> => {
  const url = `/admin-report-permission/v1/observer-accesses/bulk-edit`;
  const payload: TReqBulkEditAdminReportPermission = {
    bulk_edit_list: lists,
  };

  try {
    const response = await axiosWithAuth.post(url, payload);

    const data: TResBulkEditAdminReportPermission = response.data;

    return data;
  } catch (error) {
    console.error('Error deleting admin report permission:', error);
    throw error;
  }
};

export const getsAdminReportPermissionSchoolList = async (
  params?: Partial<TAdminReportPermissionSchoolList> & { page?: number; limit?: number },
): Promise<TAdminReportPermissionSchoolList[]> => {
  const url = '/admin-report-permission/v1/schools';

  try {
    const response = await axiosWithAuth.get(url, { params });

    const data: TAdminReportPermissionSchoolList[] = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching school list:', error);
    throw error;
  }
};

export const postArpObserverAccesses = async (payload: TReqPostArpObserverAccesses) => {
  let response: AxiosResponse<TResPostArpObserverAccesses>;
  try {
    response = await axiosWithAuth.post(
      '/admin-report-permission/v1/observer-accesses',
      payload,
    );
  } catch (error) {
    throw error;
  }

  const data = response.data.data[0];
  const result: TAdminReportPermission = {
    ...data,
    created_at: data.created_at ? new Date(data.created_at) : null,
    updated_at: data.updated_at ? new Date(data.updated_at) : null,
  };
  return result;
};

export const putArpObserverAccesses = async (
  id: number,
  payload: TReqPutArpObserverAccesses,
) => {
  let response: AxiosResponse<TResPutArpObserverAccesses>;
  try {
    response = await axiosWithAuth.put(
      `/admin-report-permission/v1/observer-accesses/${id}`,
      payload,
    );
  } catch (error) {
    throw error;
  }

  const data = response.data.data[0];
  const result: TAdminReportPermission = {
    ...data,
    created_at: data.created_at ? new Date(data.created_at) : null,
    updated_at: data.updated_at ? new Date(data.updated_at) : null,
  };
  return result;
};

export const getsArpObserverAccessListSchool = async (
  observerAccessId: number,
  params: TReqGetsArpObserverAccessListSchool,
  config?: AxiosRequestConfig,
) => {
  let response: AxiosResponse<TResGetsArpObserverAccessListSchool>;

  try {
    response = await axiosWithAuth.get(
      `/admin-report-permission/v1/observer-accesses/${observerAccessId}/schools`,
      {
        params: params,
        ...config,
      },
    );
  } catch (error) {
    throw error;
  }

  return response.data;
};

export const getsArpSchoolList = async (
  params: TReqGetsArpSchoolList,
  config?: AxiosRequestConfig,
) => {
  let response: AxiosResponse<TResGetsArpSchoolList>;

  try {
    response = await axiosWithAuth.get('/admin-report-permission/v1/schools', {
      params: params,
      ...config,
    });
  } catch (error) {
    throw error;
  }

  return response.data;
};

export const putArpUpdateSchools = async (
  observerAccessId: number,
  schoolId: number[],
) => {
  let response: AxiosResponse<TResPutsArpUpdateSchool>;

  try {
    response = await axiosWithAuth.patch(
      `/admin-report-permission/v1/observer-accesses/${observerAccessId}/schools`,
      { school_ids: schoolId },
    );
  } catch (error) {
    throw error;
  }

  return response.data.data;
};
export const deletesArpDeleteSchool = async (
  observerAccessId: number,
  schoolId: number[],
) => {
  let response: AxiosResponse<TResDeletesArpUpdateSchool>;

  try {
    response = await axiosWithAuth.delete(
      `/admin-report-permission/v1/observer-accesses/${observerAccessId}/schools/bulk-edit`,
      { data: { school_ids: schoolId } },
    );
  } catch (error) {
    throw error;
  }

  return response.data;
};
