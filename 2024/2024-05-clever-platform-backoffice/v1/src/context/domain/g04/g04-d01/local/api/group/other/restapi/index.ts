import { getQueryParams, PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import { ItemQueryParams, OtherRepository } from '../../../repository/other';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPIOther: OtherRepository = {
  GetSchools: function (
    query: ItemQueryParams,
  ): Promise<PaginationAPIResponse<DropdownSchool>> {
    const url = `${BACKEND_URL}/gm-announcement/v1/announcement/drop-down/school`;

    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<DropdownSchool>) => {
        return res;
      });
  },
  GetSubjects: function (
    query: ItemQueryParams,
  ): Promise<PaginationAPIResponse<DropdownSubject>> {
    const url = `${BACKEND_URL}/gm-announcement/v1/announcement/drop-down/subject`;

    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<DropdownSubject>) => {
        return res;
      });
  },
  GetYears: function (
    query: ItemQueryParams,
  ): Promise<PaginationAPIResponse<DropdownYear>> {
    const url = `${BACKEND_URL}/gm-announcement/v1/announcement/drop-down/year`;

    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<DropdownYear>) => {
        return res;
      });
  },
  GetAcademicYears: function (
    query: ItemQueryParams,
  ): Promise<PaginationAPIResponse<DropdownAcademicYear>> {
    const url = `${BACKEND_URL}/gm-announcement/v1/announcement/drop-down/academic-year`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<DropdownAcademicYear>) => {
        return res;
      });
  },
  GetArcadeGames: function (): Promise<PaginationAPIResponse<DropdownArcadeGame>> {
    const url = `${BACKEND_URL}/gm-announcement/v1/announcement/drop-down/arcade-game`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<DropdownArcadeGame>) => {
        return res;
      });
  },
  GetItems: function (
    query: ItemQueryParams = {},
  ): Promise<PaginationAPIResponse<DropdownItem>> {
    const url = `${BACKEND_URL}/gm-announcement/v1/announcement/drop-down/items`;

    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<DropdownItem>) => {
        return res;
      });
  },
  GetAcademicYearsBySchoolId: function (
    schoolId: number,
    query: ItemQueryParams,
  ): Promise<PaginationAPIResponse<DropdownAcademicYear>> {
    const url = `${BACKEND_URL}/gm-announcement/v1/announcement/drop-down/${schoolId}/academic-year`;
    const params = getQueryParams(query);
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<DropdownAcademicYear>) => {
        return res;
      });
  },
};

export default RestAPIOther;
