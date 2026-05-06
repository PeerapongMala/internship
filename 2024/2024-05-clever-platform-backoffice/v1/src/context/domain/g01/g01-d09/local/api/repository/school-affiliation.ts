import {
  getAllLaoSchoolAffiliations,
  getAllSchoolAffiliations,
  getLaoSchoolAffiliations,
  getSchoolAffiliations,
} from '../group/school-affiliations/restapi';
import { TReqPagination } from '../helper/pagination';
import {
  TReqGetAllSchoolAffiliations,
  TReqGetLaoSchoolAffiliations,
  TReqGetSchoolAffiliations,
  TResGetLaoSchoolAffiliations,
  TResGetSchoolAffiliations,
} from '../helper/school_affiliation';

interface SchoolAffiliationRepository {
  GetSchoolAffiliations: (
    params: TReqGetSchoolAffiliations,
  ) => Promise<TResGetSchoolAffiliations>;
  GetAllSchoolAffiliations: (
    params: TReqGetAllSchoolAffiliations,
  ) => Promise<TResGetSchoolAffiliations[]>;
  GetLaoSchoolAffiliations: (
    params: TReqPagination & TReqGetLaoSchoolAffiliations,
  ) => Promise<TResGetLaoSchoolAffiliations>;
  GetAllLaoSchoolAffiliations: (
    params: TReqGetLaoSchoolAffiliations,
  ) => Promise<TResGetLaoSchoolAffiliations[]>;
}

export const schoolAffiliationRepo: SchoolAffiliationRepository = {
  GetSchoolAffiliations: getSchoolAffiliations,
  GetAllSchoolAffiliations: getAllSchoolAffiliations,
  GetLaoSchoolAffiliations: getLaoSchoolAffiliations,
  GetAllLaoSchoolAffiliations: getAllLaoSchoolAffiliations,
};
