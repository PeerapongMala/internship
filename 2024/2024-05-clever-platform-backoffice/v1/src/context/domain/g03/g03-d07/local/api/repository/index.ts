import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';

import {
  academicYear,
  CreateReward,
  FilterSubject,
  GetByStudent,
  IDownloadCsv,
  ItemList,
  SpecialReward,
  SpecialRewardInside,
  Status,
  StatusReward,
  Student,
  TeacherItem,
  TeacherReward,
} from '../../type';

export interface FilterQueryParams extends BasePaginationAPIQueryParams {
  subject_group_id?: number;
  subject_id?: number;
  lesson_id?: number;
  sub_lesson_id?: number;
  status?: StatusReward;
  type?: string;
  description?: string;
  name?: string;
  amount?: string;
  searchText?: {
    key: '';
    value: '';
  };
  subject_name?: number;
  academic_year?: number;
  year?: string;
  class_name?: number;
  [key: string]: any;
  debouncedFilterSearch?: { key: string; value: string };
  first_name?: string;
  last_name?: string;
}

export interface RewardRepository {
  // dropdown
  GetSubject: (query: FilterQueryParams) => Promise<PaginationAPIResponse<FilterSubject>>;
  // GetStudent: () => Promise<PaginationAPIResponse<Student>>;
  GetAcademicYear: (
    query: FilterQueryParams,
  ) => Promise<PaginationAPIResponse<academicYear>>;
  GetYear: (query: FilterQueryParams) => Promise<PaginationAPIResponse<any>>;
  GetClass: (query: FilterQueryParams) => Promise<PaginationAPIResponse<any>>;
  GetTeacherItem: (
    subjectId: string,
    query: FilterQueryParams,
  ) => Promise<PaginationAPIResponse<TeacherItem>>;
  GetByItem: (ItemId: string) => Promise<DataAPIResponse<ItemList>>;

  // get list
  GetsStudent: (query: FilterQueryParams) => Promise<PaginationAPIResponse<Student>>;
  GetsItem: () => Promise<PaginationAPIResponse<any>>;

  GetsReward: (query: FilterQueryParams) => Promise<PaginationAPIResponse<TeacherReward>>;

  GetByStudent: (student_id: string) => Promise<DataAPIResponse<GetByStudent>>;

  CreateReward: (data: CreateReward) => Promise<PaginationAPIResponse<any>>;

  DownloadCSV(filter: IDownloadCsv): Promise<void | FailedAPIResponse>;
  UploadCSV(file: File): Promise<DataAPIResponse<TeacherReward>>;

  CallBack: (rewardId: number) => Promise<DataAPIResponse<any>>;

  BulkEdit: (data: Partial<[]>) => Promise<DataAPIResponse<any>>;
}
