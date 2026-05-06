import {
  AffiliationContract,
  School,
  SeedPlatform,
  Subject,
} from '@domain/g01/g01-d02/local/type';
import {
  PaginationAPIResponse,
  DataAPIResponse,
  DataAPIRequest,
  PaginationAPIQueryParamsWithUseStatus,
  BasePaginationAPIQueryParams,
} from '../../../helper';
import {
  AffiliationContractFilterQueryParams,
  AffiliationContractRepository,
  AffiliationContractSubjectGroupListFilterQueryParams,
  AffiliationContractSubjectsFilterQueryParams,
} from '../../../repository/affiliation-contract';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  BaseAPIResponse,
  FailedAPIResponse,
  getQueryParams,
} from '@global/utils/apiResponseHelper';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const AffiliationContractRestAPI: AffiliationContractRepository = {
  Gets: function (
    affiliationId: string,
    query: AffiliationContractFilterQueryParams,
  ): Promise<PaginationAPIResponse<AffiliationContract>> {
    const url = `${BACKEND_URL}/school-affiliations/v1/${affiliationId}/contracts`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AffiliationContract>) => {
        return res;
      });
  },
  GetById: function (id: string): Promise<DataAPIResponse<AffiliationContract>> {
    const url = `${BACKEND_URL}/school-affiliations/v1/contracts/${id}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AffiliationContract[]>) => {
        // pull it out of array
        if (res.status_code === 200 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<AffiliationContract>;
        return res as DataAPIResponse<AffiliationContract>;
      });
  },
  Create: function (
    data: DataAPIRequest<AffiliationContract>,
  ): Promise<DataAPIResponse<AffiliationContract>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/contracts`;
    const body = JSON.stringify({
      ...data,
      school_affiliation_id: parseInt(data.school_affiliation_id!),
      seed_platform_id: parseInt(data.seed_platform_id?.toString()!),
    });
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<AffiliationContract[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<AffiliationContract>;
        return res as DataAPIResponse<AffiliationContract>;
      });
  },
  Update: function (
    contractId: number,
    data: DataAPIRequest<AffiliationContract>,
  ): Promise<DataAPIResponse<AffiliationContract>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/contracts/${contractId}`;
    const body = JSON.stringify(data);

    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<AffiliationContract[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (
          (res.status_code === 201 || res.status_code === 200) &&
          Array.isArray(res.data)
        )
          return {
            ...res,
            data: res.data?.at(0),
          } as DataAPIResponse<AffiliationContract>;
        return res as DataAPIResponse<AffiliationContract>;
      });
  },
  GetSchoolsContract: function (
    contractId: string,
    query: PaginationAPIQueryParamsWithUseStatus,
  ): Promise<PaginationAPIResponse<School>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/contracts/${contractId}/schools`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res;
      });
  },
  GetAllSchoolsInAffiliation: function (
    affiliationId: string,
    query: PaginationAPIQueryParamsWithUseStatus = {},
  ): Promise<PaginationAPIResponse<School>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/${affiliationId}/schools`;
    const params = getQueryParams(query);

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  GetSubjectsContract: function (
    contractId: string,
    query: AffiliationContractSubjectsFilterQueryParams = {},
  ): Promise<PaginationAPIResponse<Subject>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/contracts/${contractId}/subject-groups`;
    const params = getQueryParams(query);

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  GetCurriculumGroupList: function (
    query: BasePaginationAPIQueryParams = {},
  ): Promise<PaginationAPIResponse<string>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/curriculum-groups/list`;
    const params = getQueryParams(query);

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  GetSubjectGroupList: function (
    platformId: number,
    query: AffiliationContractSubjectGroupListFilterQueryParams = {},
  ): Promise<PaginationAPIResponse<Subject>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/platforms/${platformId}/subject-groups`;
    const params = getQueryParams(query);

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  DownloadCSV: function (
    schoolAffiliationId: number,
    query: {
      start_date?: string;
      end_date?: string;
    },
  ): Promise<Blob | FailedAPIResponse> {
    let url = `${BACKEND_URL}/school-affiliations/v1/school-affiliations/${schoolAffiliationId}/contracts`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString()).then((res) => {
      if (res.status == 200) {
        return res.blob();
      } else {
        return res.json();
      }
    });
  },
  GetSeedPlatformList: function (): Promise<DataAPIResponse<SeedPlatform[]>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/seed-platforms`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  AddContractSchools: function (
    contractId: number,
    school_ids: number[],
  ): Promise<DataAPIResponse<number[]>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/contracts/${contractId}/schools`;

    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ school_ids }),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  AddContractSubjects: function (
    contractId: number,
    subjects: { subject_group_id: number; is_enabled: boolean }[],
  ): Promise<DataAPIResponse<{ subject_group_id: number; is_enabled: boolean }[]>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/contracts/${contractId}/subject-groups`;

    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ subjects }),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  GetSchoolAffiliationContacts: function (
    affiliationId: number,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<AffiliationContract>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/${affiliationId}/contracts`;
    const params = getQueryParams(query);

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  DeleteContractSchool: function (
    contractId: number,
    school_ids: number[],
  ): Promise<DataAPIResponse<number[]>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/contracts/${contractId}/schools`;

    return fetchWithAuth(url, {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ school_ids }),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  DeleteContractSubjectGroup: function (
    contractId: number,
    subject_group_ids: number[],
  ): Promise<DataAPIResponse<number[]>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/contracts/${contractId}/subject-groups`;
    return fetchWithAuth(url, {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ subject_group_ids }),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  ToggleContractSubjectGroup: function (data: {
    contractId: number;
    subjectGroupId: number;
    is_enabled: boolean;
  }): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/school-affiliations/v1/contracts/${data.contractId}/subject-groups/${data.subjectGroupId}`;

    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ is_enabled: data.is_enabled }),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  BulkEditContractSchools: function (
    bulk_edit_list: {
      school_affiliation_id: number;
      status: string;
    }[],
  ): Promise<DataAPIResponse<{ school_affiliation_id: number; status: string }[]>> {
    let url = `${BACKEND_URL}/school-affiliations/v1/school-affiliations/bulk-edit`;

    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ bulk_edit_list }),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
  Refresh: function (contractId: number): Promise<BaseAPIResponse> {
    let url = `${BACKEND_URL}/school-affiliations/v1/contracts/${contractId}/refresh`;
    return fetchWithAuth(url, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },
};

export default AffiliationContractRestAPI;
