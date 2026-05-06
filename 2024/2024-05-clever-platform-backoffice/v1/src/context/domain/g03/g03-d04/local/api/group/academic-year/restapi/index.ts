import {
  ClassesDropdownResponse,
  CreateAcademicYearRangesRequest,
  GetAcademicYearRangesRequest,
  GetAcademicYearRangesResponse,
  GetClassResponse,
  YearDropdownResponse,
} from '@domain/g03/g03-d04/local/api/group/academic-year/type.ts';
import { AcademicYearRepository } from '@domain/g03/g03-d04/local/api/repository/academic-year';
import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const AcademicYearRestAPI: AcademicYearRepository = {
  GetDropdownAcademicYear: async function (): Promise<DataAPIResponse<number[]>> {
    const url = `${backendUrl}/teacher-student/v1/academic-years`;
    const res = await fetchWithAuth(url);
    if (!res.ok)
      throw new Error(`Failed to fetch GetDropdownAcademicYear: ${res.statusText}`);
    return res.json();
  },
  GetDropdownYear: async function (
    academic_year: string,
  ): Promise<DataAPIResponse<YearDropdownResponse>> {
    const url = `${backendUrl}/teacher-student/v1/academic-years/${academic_year}/years`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<YearDropdownResponse[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data)) {
          return res as unknown as DataAPIResponse<YearDropdownResponse>;
        }
        throw new Error('No data found or unexpected response format');
      });
  },

  GetDropdownClasses: function (
    academic_year: string,
    year: string,
  ): Promise<DataAPIResponse<ClassesDropdownResponse>> {
    const url = `${backendUrl}/teacher-student/v1/academic-years/${academic_year}/years/${year}/classes`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<ClassesDropdownResponse[]>) => {
        if (res.status_code === 200 && Array.isArray(res.data)) {
          return res as unknown as DataAPIResponse<ClassesDropdownResponse>;
        }
        throw new Error('No data found or unexpected response format');
      });
  },

  CreateAcademicYearRanges: function (
    params: DataAPIRequest<CreateAcademicYearRangesRequest>,
  ): Promise<BaseAPIResponse> {
    const url = `${backendUrl}/teacher-student/v1/academic-year-ranges`;
    const body = JSON.stringify(params);

    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: BaseAPIResponse) => {
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 200) return res;
        throw new Error('Error creating academic year ranges');
      });
  },
  DeleteAcademicYearRanges: function (params): Promise<DataAPIResponse<undefined>> {
    const url = `${backendUrl}/teacher-student/v1/academic-year-ranges/${params.academicYearRangeId}`;
    return fetchWithAuth(url, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  },

  GetAcademicYearRangesList: async function (
    query: BasePaginationAPIQueryParams & {
      school_id: GetAcademicYearRangesRequest['school_id'];
    },
  ): Promise<PaginationAPIResponse<GetAcademicYearRangesResponse>> {
    const url = `${backendUrl}/teacher-student/v1/academic-year-ranges`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );

    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch GetAcademicYearRangesList: ${res.statusText}`);
    }
    return await res.json();
  },
  GetDropdownYearList: async function (
    query: BasePaginationAPIQueryParams,
  ): Promise<DataAPIResponse<YearDropdownResponse>> {
    const url = `${backendUrl}/teacher-student/v1/years`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );

    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch GetDropdownYearList: ${res.statusText}`);
    }
    return await res.json();
  },

  GetDropdownClassesList: async function (
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<GetClassResponse>> {
    const url = `${backendUrl}/teacher-student/v1/classes`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined),
    );

    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const res = await fetchWithAuth(`${url}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch GetDropdownClassesList: ${res.statusText}`);
    }
    return await res.json();
  },
};

export default AcademicYearRestAPI;
