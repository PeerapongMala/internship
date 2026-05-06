import downloadCSV from '@global/utils/downloadCSV';

import fetchWithAuth from '@global/utils/fetchWithAuth';
import { OverviewRepository, FilterQueryParams } from '../../../repository/overview';
import StoreGlobalPersist from '@store/global/persist';

import {
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { Subject } from '@domain/g05/g05-d01/g05-d01-p01-teacher-dashboard/local/type';
import {
  FilterLubLesson,
  Lesson,
  OverviewStats,
  SubLesson,
} from '@domain/g05/g05-d02/local/types/overview';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const RestAPIOverview: OverviewRepository = {
  GetSubject: function (
    user_id: string,
    class_id: number,
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<Subject>> {
    const url = `${BACKEND_URL}/line-parent/v1/dashboard/subjects/${user_id}/${class_id}`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Subject>) => {
        return res;
      });
  },
  GetOverview: function (
    user_id: string,
    class_id: number,
    subject_id: number,
    query: FilterQueryParams,
  ): Promise<DataAPIResponse<OverviewStats>> {
    const url = `${BACKEND_URL}/line-parent/v1/dashboard/overview-stat/${user_id}/${class_id}/${subject_id}`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: DataAPIResponse<OverviewStats>) => {
        return res;
      });
  },
  GetLesson: function (
    user_id: number,
    class_id: number,
    subject_id: number,
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<Lesson>> {
    const url = `${BACKEND_URL}/line-parent/v1/dashboard/lesson-progress/${user_id}/${class_id}/${subject_id}`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Lesson>) => {
        return res;
      });
  },
  GetSubLesson: function (
    user_id: number,
    class_id: number,
    subject_id: number,
    lesson_id: number,
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<SubLesson>> {
    const url = `${BACKEND_URL}/line-parent/v1/dashboard/sub-lesson-progress/${user_id}/${class_id}/${subject_id}/${lesson_id}`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<SubLesson>) => {
        return res;
      });
  },
  GetFilterLesson: function (
    user_id: number,
    subject_id: number,
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<FilterLubLesson>> {
    const url = `${BACKEND_URL}/line-parent/v1/dashboard/lessons/${user_id}/${subject_id}`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<FilterLubLesson>) => {
        return res;
      });
  },
};

export default RestAPIOverview;
