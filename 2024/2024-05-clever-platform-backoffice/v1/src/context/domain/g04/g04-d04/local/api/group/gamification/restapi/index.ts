import downloadCSV from '@global/utils/downloadCSV';

import fetchWithAuth from '@global/utils/fetchWithAuth';
import {
  ICreateBugReportQueryParams,
  GamificationRepository,
  IUpdateBugStatus,
  FilterQueryParams,
} from '../../../repository';
import StoreGlobalPersist from '@store/global/persist';
import {
  CreateItem,
  FilterLesson,
  FilterSubject,
  FilterSublesson,
  GetDataCard,
  Item,
  LevelReward,
  Leveltype,
  SeedYear,
  SpecialReward,
  SpecialRewardInside,
} from '@domain/g04/g04-d04/local/type';
import {
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

const RestAPIGamification: GamificationRepository = {
  GetSeedYear: async function (): Promise<PaginationAPIResponse<SeedYear>> {
    const url = `${BACKEND_URL}/gamification/v1/seed-subject-groups`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },

  Gets: async function (
    seed_subject_group_id: number,
    level_type: Leveltype,
    page: number,
    limit: number,
  ): Promise<PaginationAPIResponse<LevelReward>> {
    const params = new URLSearchParams({
      seed_subject_group_id: seed_subject_group_id.toString(),
      level_type: level_type,
      page: page.toString(),
      limit: limit.toString(),
    });
    const url = `${BACKEND_URL}/gamification/v1/level-rewards?${params.toString()}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.json();
  },

  GetsLevel: async function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<SpecialReward>> {
    const url = `${BACKEND_URL}/gamification/v1/levels`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<SpecialReward>) => {
        return res;
      });
  },
  GetsSpecialRewardInside: async function (
    level_id: number,
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<SpecialRewardInside>> {
    const url = `${BACKEND_URL}/gamification/v1/levels/${level_id}/special-rewards`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<SpecialRewardInside>) => {
        return res;
      });
  },

  GetSubject: async function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<FilterSubject>> {
    const url = `${BACKEND_URL}/gamification/v1/subjects`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<FilterSubject>) => {
        return res;
      });
  },

  GetLesson: async function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<FilterLesson>> {
    const url = `${BACKEND_URL}/gamification/v1/lessons`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<FilterLesson>) => {
        return res;
      });
  },

  GetSublesson: async function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<FilterSublesson>> {
    const url = `${BACKEND_URL}/gamification/v1/sub-lessons`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<FilterLesson>) => {
        return res;
      });
  },
  GetDataCard: async function (
    level_id: number,
  ): Promise<PaginationAPIResponse<GetDataCard>> {
    const url = `${BACKEND_URL}/gamification/v1/levels/${level_id}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },

  GetItem: async function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<Item>> {
    const url = `${BACKEND_URL}/gamification/v1/items`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Item>) => {
        return res;
      });
  },

  CreateItem: function (data: CreateItem): Promise<PaginationAPIResponse<CreateItem>> {
    let url = `${BACKEND_URL}/gamification/v1/levels/bulk-edit`;

    const body = JSON.stringify(data);
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<CreateItem[]>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as PaginationAPIResponse<CreateItem>;
        return res as PaginationAPIResponse<CreateItem>;
      });
  },

  EditItem: function (
    level_id: number,
    levelSpecial_id: number,
    amount: number,
  ): Promise<PaginationAPIResponse<any>> {
    let url = `${BACKEND_URL}/gamification/v1/levels/${level_id}/special-rewards/${levelSpecial_id}`;

    const body = JSON.stringify({ amount });
    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: any) => {
        return res;
      });
  },

  DeleteItem: function (
    level_id: number,
    level_special_reward_ids: number[],
  ): Promise<PaginationAPIResponse<any>> {
    let url = `${BACKEND_URL}/gamification/v1/levels/${level_id}/special-rewards/bulk-edit`;

    const body = JSON.stringify({ level_special_reward_ids });
    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: body,
    })
      .then((res) => res.json())
      .then((res: any) => {
        return res;
      });
  },
};

export default RestAPIGamification;
