import downloadCSV from '@global/utils/downloadCSV';

import fetchWithAuth from '@global/utils/fetchWithAuth';
import { RewardRepository, FilterQueryParams } from '../../../repository/reward';
import StoreGlobalPersist from '@store/global/persist';

import {
  BulkDataAPIRequest,
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
  ModalClassroom,
  ModalStudyGroup,
  Student,
  TeacherItem,
  TeacherReward,
} from '@domain/g03/g03-d07-v2/local/type';
import { NewCreateReward } from '@domain/g03/g03-d07-v2/local/type';
import { CopyReward, StudyGroupFilter } from '../../../types/reward';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;

const RestAPIGamification: RewardRepository = {
  // filter
  GetSubject: async function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<FilterSubject>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/teacher-subject/drop-down`;
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
  // GetStudent: async function (): Promise<PaginationAPIResponse<Student>> {
  //   const url = `${BACKEND_URL}/teacher-reward/v1/students/drop-down`;
  //   const response = await fetchWithAuth(url, {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });
  //   return response.json();
  // },
  GetAcademicYear: async function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<academicYear>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/academic-year/drop-down`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<academicYear>) => {
        return res;
      });
  },

  GetYear: async function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<any>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/year/drop-down`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<academicYear>) => {
        return res;
      });
  },
  // filter class_room
  GetClass: async function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<any>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/class/drop-down`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<any>) => {
        return res;
      });
  },
  // filter study_group
  GetStudyGroup: async function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<StudyGroupFilter>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/study-group/drop-down`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<StudyGroupFilter>) => {
        return res;
      });
  },

  GetTeacherItem: async function (
    subjectId: string,
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<TeacherItem>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/teacher-items/${subjectId}/drop-down`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<TeacherItem>) => {
        return res;
      });
  },
  GetByItem: async function (ItemId: string): Promise<DataAPIResponse<ItemList>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/reward/${ItemId}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },

  // get list

  GetsStudent: async function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<Student>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/students/drop-down`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<Student>) => {
        return res;
      });
  },
  GetsClassroomModal: async function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<ModalClassroom>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/class/drop-down`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<ModalClassroom>) => {
        return res;
      });
  },
  GetsStudyGroupModal: async function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<ModalStudyGroup>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/study-group/drop-down`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<ModalStudyGroup>) => {
        return res;
      });
  },

  GetsItem: async function (): Promise<PaginationAPIResponse<Student>> {
    const url = `${BACKEND_URL}/gamification/v1/seed-subject-groups`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },

  GetsReward: function (
    query: FilterQueryParams,
  ): Promise<PaginationAPIResponse<TeacherReward>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/reward`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<TeacherReward>) => {
        return res;
      });
  },

  GetByStudent: async function (
    student_id: string,
  ): Promise<DataAPIResponse<GetByStudent>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/reward/student/${student_id}`;
    const response = await fetchWithAuth(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },

  CreateReward: function (
    data: NewCreateReward,
  ): Promise<PaginationAPIResponse<NewCreateReward>> {
    let url = `${BACKEND_URL}/teacher-reward/v1/reward`;

    const formData = new FormData();

    if (data.subject_id) formData.append('subject_id', data.subject_id);
    if (data.reward_name) formData.append('reward_name', data.reward_name);
    if (data.reward_amount) formData.append('reward_amount', data.reward_amount);
    if (data.study_group_ids) formData.append('study_group_ids', data.study_group_ids);
    if (data.class_ids) formData.append('class_ids', data.class_ids);
    if (data.status) formData.append('status', data.status);
    if (data.images_key) formData.append('images_key', data.images_key);

    if (data.student_ids) {
      data.student_ids.forEach((id, index) => {
        formData.append(`student_ids`, id);
      });
    }

    if (data.image) {
      formData.append('image', data.image);
    }

    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<NewCreateReward[]>) => {
        if (res.status_code === 201 && Array.isArray(res.data))
          return {
            ...res,
            data: res.data?.at(0),
          } as PaginationAPIResponse<NewCreateReward>;
        return res as PaginationAPIResponse<NewCreateReward>;
      });
  },
  DownloadCSV: function (filter: IDownloadCsv): Promise<void | FailedAPIResponse> {
    let url = `${BACKEND_URL}/teacher-reward/v1/reward/download/csv?start_date=${filter.start_date}&end_date=${filter.end_date}`;

    // เพิ่ม subject_id ถ้ามีค่า
    if (filter.subject_id !== undefined) {
      url += `&subject_id=${filter.subject_id}`;
    }

    return fetchWithAuth(url)
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        } else {
          return res.json();
        }
      })
      .then((res) => {
        if (res instanceof Blob) {
          downloadCSV(res, 'reward.csv');
        } else {
          return res as FailedAPIResponse;
        }
      });
  },
  UploadCSV: function (file: File): Promise<DataAPIResponse<TeacherReward>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/reward/upload/csv`;

    const formData = new FormData();
    formData.append('csv_file', file);

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<TeacherReward>) => {
        return res;
      });
  },

  CallBack: async function (rewardId: number): Promise<DataAPIResponse<any>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/reward/${rewardId}`;
    const response = await fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  },
  BulkEdit(data: Partial<[]>): Promise<DataAPIResponse<any>> {
    let url = `${BACKEND_URL}/teacher-reward/v1/reward/bulk-edit`;

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
      .then((res: DataAPIResponse<any>) => {
        // pull it out of array
        // note: when create succesfully, it response HTTP 201 Created
        if (res.status_code === 201 && Array.isArray(res.data))
          return { ...res, data: res.data?.at(0) } as DataAPIResponse<any>;
        return res as DataAPIResponse<any>;
      });
  },
  CopyByIdReward: async function (
    teacherRewardId: string,
    query: any,
  ): Promise<PaginationAPIResponse<CopyReward>> {
    const url = `${BACKEND_URL}/teacher-reward/v1/reward/${teacherRewardId}/copy`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<CopyReward>) => {
        return res;
      });
  },
};

export default RestAPIGamification;
