import {
  BasePaginationAPIQueryParams,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

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
  Status,
} from '../../type';

export interface ICreateBugReportQueryParams {
  page?: string;
  limit?: string;
  status?: string;
  platform?: string;
  type?: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
}

export interface IUpdateBugStatus {
  bug_id: string;
  status: string;
  message: string;
}

export interface IGetCSVFilter {
  startDate: string;
  endDate: string;
}

export interface FilterQueryParams extends BasePaginationAPIQueryParams {
  subject_group_id?: number;
  subject_id?: number;
  lesson_id?: number;
  sub_lesson_id?: number;
  status?: Status;
  type?: string;
  description?: string;
  name?: string;
  amount?: string;
  searchText?: {
    key: '';
    value: '';
  };
}

export interface GamificationRepository {
  GetSeedYear: () => Promise<PaginationAPIResponse<SeedYear>>;
  Gets: (
    seed_subject_group_id: number,
    level_type: Leveltype,
    page: number,
    limit: number,
  ) => Promise<PaginationAPIResponse<LevelReward>>;
  GetsLevel: (query: FilterQueryParams) => Promise<PaginationAPIResponse<SpecialReward>>;
  GetsSpecialRewardInside: (
    level_id: number,
    query: FilterQueryParams,
  ) => Promise<PaginationAPIResponse<SpecialRewardInside>>;
  GetSubject: (query: FilterQueryParams) => Promise<PaginationAPIResponse<FilterSubject>>;
  GetLesson: (query: FilterQueryParams) => Promise<PaginationAPIResponse<FilterLesson>>;
  GetSublesson: (
    query: FilterQueryParams,
  ) => Promise<PaginationAPIResponse<FilterSublesson>>;

  GetDataCard: (level_id: number) => Promise<PaginationAPIResponse<GetDataCard>>;

  GetItem: (query: FilterQueryParams) => Promise<PaginationAPIResponse<Item>>;
  CreateItem: (data: CreateItem) => Promise<PaginationAPIResponse<CreateItem>>;
  EditItem: (level_id: number, levelSpecial_id: number, amount: number) => Promise<any>;
  DeleteItem: (level_id: number, level_special_reward_ids: number[]) => Promise<any>;
}
