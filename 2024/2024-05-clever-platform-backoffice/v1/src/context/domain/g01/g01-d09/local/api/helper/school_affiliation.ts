import { TReqPagination, TResPagination } from './pagination';

export type TSchoolAffiliations = {
  id: number;
  school_affiliation_group: string;
  type: string;
  name: string;
  short_name: string;
  status: string;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
};

export type TResSchoolAffiliations = Omit<
  TSchoolAffiliations,
  'created_at' | 'updated_at'
> & {
  created_at: string;
  updated_at: string;
};

export const transformSchoolAffiliation = (
  data: TResSchoolAffiliations,
): TSchoolAffiliations => {
  return {
    ...data,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };
};

export type TReqGetSchoolAffiliations = TReqPagination & {
  search_text?: string;
  school_affiliation_group?: string;
  status?: 'enabled' | 'disabled' | 'draft';
  type?: string;
};
export type TResGetSchoolAffiliations = TResPagination & {
  message: string;
  data: TResSchoolAffiliations[];
};

export type TReqGetAllSchoolAffiliations = {
  search_text?: string;
  school_affiliation_group?: string;
  status?: 'enabled' | 'disabled' | 'draft';
  type?: 'รัฐ' | 'เอกชน';
};

// LaoSchoolAffiliations
export enum ELaoType {
  PAO = 'อบจ',
  SAO = 'อบต',
  CityMunicipality = 'เทศบาลนคร',
  SubdistrictMunicipality = 'เทศบาลตำบล',
  DistrictMunicipality = 'เทศบาลอำเภอ',
}
export type TLaoSchoolAffiliations = {
  id: number;
  school_affiliation_group: string;
  name: string;
  short_name: string;
  status: string;
  created_at: Date;
  created_by: string;
  updated_at: Date | null;
  updated_by: string;
  lao_type: ELaoType;
  district: string;
  sub_district: string;
  province: string;
};
export type TResLaoSchoolAffiliations = Omit<TLaoSchoolAffiliations, 'updated_at'> & {
  updated_at: string | null;
};
export type TReqGetLaoSchoolAffiliations = {
  status?: 'enabled' | 'disabled' | 'draft';
  lao_type?: ELaoType;
};
export type TResGetLaoSchoolAffiliations = TResPagination & {
  message: string;
  data: TResLaoSchoolAffiliations[];
};
export const transformLaoSchoolAffiliation = (
  data: TResLaoSchoolAffiliations,
): TLaoSchoolAffiliations => {
  return {
    ...data,
    created_at: new Date(data.created_at),
    updated_at: data.updated_at ? new Date(data.updated_at) : null,
  };
};
