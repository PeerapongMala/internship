import {
  AffiliationContract,
  CreatedAffiliationContract,
  School,
  Subject,
  UpdatedAffiliationContract,
} from '@domain/g01/g01-d02/local/type';
import {
  PaginationAPIResponse,
  DataAPIResponse,
  DataAPIRequest,
  pagination,
  PaginationAPIQueryParamsWithUseStatus,
  responseOk,
  responseFailed,
  responseCreated,
  BasePaginationAPIQueryParams,
} from '../../../helper';
import {
  AffiliationContractFilterQueryParams,
  AffiliationContractRepository,
  AffiliationContractSubjectsFilterQueryParams,
} from '../../../repository/affiliation-contract';

import {
  CreatedAffiliationContractSchema,
  UpdatedAffiliationContractSchema,
} from '@domain/g01/g01-d02/local/schema';

import MOCK_DATA from './data.json';
import SCHOOL_MOCK_DATA from './schools/data.json';
import SUBJECT_MOCK_DATA from './subjects/data.json';
import { searchInRow } from '@global/utils/filters';

const AffiliationContractMock: any = {
  Gets: function (
    affiliationId: string,
    query: AffiliationContractFilterQueryParams,
  ): Promise<PaginationAPIResponse<AffiliationContract>> {
    const { page = 1, limit = 10, search_text } = query;
    const data: AffiliationContract[] = MOCK_DATA.filter(
      (record) => record.school_affiliation_id === affiliationId,
    ).filter((record) => {
      return !search_text || record.name.includes(search_text);
    }) as AffiliationContract[];
    return Promise.resolve(pagination<AffiliationContract>({ data, page, limit }));
  },
  GetById: function (id: string): Promise<DataAPIResponse<AffiliationContract>> {
    const data = MOCK_DATA.find((record) => `${record.id}` === id) as AffiliationContract;
    if (data) return Promise.resolve(responseOk({ data }));
    return Promise.reject(responseFailed({ statusCode: 404 }));
  },
  Create: function (
    data: DataAPIRequest<CreatedAffiliationContract>,
  ): Promise<DataAPIResponse<AffiliationContract>> {
    return CreatedAffiliationContractSchema.validate(data)
      .then((res) => {
        const now = new Date().toISOString();
        return responseCreated({
          data: {
            ...res,
            id: 1,
            created_at: now,
            created_by: 'self',
            updated_at: now,
            updated_by: 'self',
          } as AffiliationContract,
        });
      })
      .catch((err) => {
        return responseFailed({ statusCode: 400, message: err });
      });
  },
  Update: function (
    contractId: number,
    data: DataAPIRequest<UpdatedAffiliationContract>,
  ): Promise<DataAPIResponse<AffiliationContract>> {
    return UpdatedAffiliationContractSchema.validate(data)
      .then((res) => {
        const now = new Date().toISOString();
        return responseOk({
          data: {
            ...res,
            updated_at: now,
            updated_by: 'self',
          } as AffiliationContract,
        });
      })
      .catch((err) => responseFailed({ statusCode: 400, message: err }));
  },

  GetSchoolsContract: function (
    contractId: string,
    query: PaginationAPIQueryParamsWithUseStatus,
  ): Promise<PaginationAPIResponse<School>> {
    const { page = 1, limit = 10, search_text } = query;
    const data: School[] = SCHOOL_MOCK_DATA.filter(
      // to-do: filter with contract id
      (record) => record,
    ).filter((record) => {
      return !search_text || record.school_name.includes(search_text);
    }) as School[];
    return Promise.resolve(pagination<School>({ data, page, limit }));
  },
  GetAllSchoolsInAffiliation: function (
    affiliationId: string,
    query: PaginationAPIQueryParamsWithUseStatus,
  ): Promise<PaginationAPIResponse<School>> {
    const { page = 1, limit = 10, search_text } = query;
    const data: School[] = SCHOOL_MOCK_DATA.filter(
      (record) => record.school_affiliation_type === affiliationId,
    ).filter((record) => {
      return !search_text || record.school_name.includes(search_text);
    }) as School[];
    return Promise.resolve(pagination<School>({ data, page, limit }));
  },
  GetSubjectsContract: function (
    contractId: string,
    query: AffiliationContractSubjectsFilterQueryParams,
  ): Promise<PaginationAPIResponse<Subject>> {
    const { page = 1, limit = 10, search_text } = query;
    const data: Subject[] = SUBJECT_MOCK_DATA.filter(
      // to-do: filter with contract id
      (record) => record,
    ).filter((record) => {
      return !search_text || searchInRow(search_text, record);
    }) as Subject[];
    return Promise.resolve(pagination<Subject>({ data, page, limit }));
  },
  // GetYearList: function (
  //   curriculumIdL: string,
  // ): Promise<PaginationAPIResponse<AnyARecord>> {
  //   const { page = 1, limit = 10 } = query;
  //   const data: string[] = SUBJECT_MOCK_DATA.filter(
  //     (record) => record.curriculum_group === curriculumIdL,
  //   ).map((record) => record.year);
  //   const uniqueData: string[] = [...new Set(data)];
  //   return Promise.resolve(pagination<string>({ data: uniqueData, page, limit }));
  // },
  GetCurriculumGroupList: function (
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<string>> {
    const { page = 1, limit = 10 } = query;
    const data: string[] = SUBJECT_MOCK_DATA.map((record) => record.curriculum_group);
    const uniqueData: string[] = [...new Set(data)];
    return Promise.resolve(pagination<string>({ data: uniqueData, page, limit }));
  },
  GetSubjectGroupList: function (
    platformId: number,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<Subject>> {
    const { page = 1, limit = 10, search_text } = query;
    const data: Subject[] = SUBJECT_MOCK_DATA.filter(
      // to-do: filter with contract id
      (record) => record,
    ).filter((record) => {
      return !search_text || searchInRow(search_text, record);
    }) as Subject[];
    return Promise.resolve(pagination<Subject>({ data, page, limit }));
  },
};

export default AffiliationContractMock;
