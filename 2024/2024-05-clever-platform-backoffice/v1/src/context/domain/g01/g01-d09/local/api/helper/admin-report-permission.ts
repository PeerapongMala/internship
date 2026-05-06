import { EAdminReportPermissionStatus } from '../../enums/admin-permission';
import { TReqPagination, TResPagination } from './pagination';
import { TSchool } from './school';

export type TGetsAdminPermissionOption = {
  page?: number;
  limit?: number;
  id?: number;
  name?: string;
  status?: EAdminReportPermissionStatus;
  access_name?: string;
};

export type TAdminReportPermission = {
  id: number;
  name: string;
  access_name: string;
  district_zone?: string;
  area_office?: string;
  district_group?: string;
  district?: string;
  school_affiliation_id?: number | null;
  school_affiliation_name?: string | null;
  school_affiliation_group?: string | null;
  school_affiliation_type?: string | null;
  lao_type?: string | null;
  status: EAdminReportPermissionStatus;
  created_at: Date | null;
  created_by: string;
  updated_at: Date | null;
  updated_by: string | null;
};

export type TAdminReportPermissionSchoolList = {
  id: number;
  school_name: string;
  school_affiliation_id: number;
  school_affiliation_group: string;
};

export type TResGetAdminReportPermission = {
  data: (Omit<TAdminReportPermission, 'created_at' | 'updated_at'> & {
    created_at: string | null;
    updated_at: string | null;
  })[];
  message: string;
};

export type TEditStatusAdminReportPermission = {
  observer_access_id: number;
  status: EAdminReportPermissionStatus;
};

export type TResGetsAdminReportPermission = TResPagination & {
  data: (Omit<TAdminReportPermission, 'created_at' | 'updated_at'> & {
    created_at: string;
    updated_at: string;
  })[];
  message: string;
};

export type TResultGetsAdminReportPermission = TResPagination & {
  statusCode: string;
  data: TAdminReportPermission[];
  message: string;
};

export type TReqBulkEditAdminReportPermission = {
  bulk_edit_list: TEditStatusAdminReportPermission[];
};
export type TResBulkEditAdminReportPermission = TResPagination & {
  message: string;
};

/**
 * Request Post Admin Report Permission ObServer Access
 */
export type TReqPostArpObserverAccesses = {
  name: string;
  access_name: string;
  district_zone?: string;
  area_office?: string;
  district_group?: string;
  district?: string;
  school_affiliation_id?: number | null;
  status: EAdminReportPermissionStatus;
};
export type TResPostArpObserverAccesses = {
  message: string;
  data: (Omit<TAdminReportPermission, 'created_at' | 'updated_at'> & {
    created_at: string | null;
    updated_at: string | null;
  })[];
};

/**
 * Request Put Admin Report Permission ObServer Access
 */
export type TReqPutArpObserverAccesses = TReqPostArpObserverAccesses;
export type TResPutArpObserverAccesses = TResPostArpObserverAccesses;

export type TObServerAccessSchool = {
  id: number;
  code: string;
  name: string;
  school_affiliation: string;
};
export type TReqGetsArpObserverAccessListSchool = Partial<TReqPagination> &
  Partial<TObServerAccessSchool>;
export type TResGetsArpObserverAccessListSchool = TResPagination & {
  message: string;
  data: TObServerAccessSchool[];
};

export type TObserverSchool = Pick<
  TSchool,
  'id' | 'school_affiliation_name' | 'school_name'
>;
export type TReqGetsArpSchoolList = TReqPagination & {
  school_id?: number;
  school_name?: string;
  code?: string;
  name?: string;
  school_affiliation?: string;
  school_affiliation_id?: number;
  school_affiliation_group?: string;
  search?: {
    key: string;
    value: string;
  };
};

export type TResGetsArpSchoolList = TResPagination & {
  data: TObserverSchool[];
};

export type TResPutsArpUpdateSchool = {
  message: string;
  data: number[];
};
export type TResDeletesArpUpdateSchool = {
  message: string;
};
