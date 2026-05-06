import {
  AdminLoginAsResponse,
  BulkUserUpdateRecord,
  CreatedTeacherRecord,
  TeacherAccess,
  TeacherClassLogRecord,
  TeacherRecord,
  TeacherTeachingLogRecord,
  UpdatedTeacherAccessRecord,
  UpdatedUserEntity,
  UpdatedUserResponse,
} from '@domain/g01/g01-d04/local/type';
import {
  SchoolTeacherFilterQueryParams,
  SchoolTeacherRepository,
} from '../../../repository/school-teacher';
import {
  BaseAPIResponse,
  BasePaginationAPIQueryParams,
  BulkDataAPIRequest,
  DataAPIRequest,
  DataAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import { pagination, responseFailed, responseOk } from '@global/utils/mockHelper';

import MOCK_DATA from './data.json';
import { isKeyOfObject, searchInRow } from '@global/utils/filters';

const MockSchoolTeacher: SchoolTeacherRepository = {
  Gets: function (
    schoolId: string,
    query: SchoolTeacherFilterQueryParams,
  ): Promise<PaginationAPIResponse<TeacherRecord>> {
    const { page = 1, limit = 10, search_text, status, ...restQuery } = query;
    const data: TeacherRecord[] = MOCK_DATA.filter((record) => {
      return !status || record.status === status;
    }).filter((record) => {
      return !search_text || searchInRow(search_text ?? '', record);
    }) as TeacherRecord[];

    const filterQuery = Object.entries(restQuery).filter(([k, v]) => v !== undefined);
    const filteredData = filterQuery.reduce((prev, [k, v]) => {
      return prev.filter((record) => {
        if (isKeyOfObject<TeacherRecord>(k, record)) {
          const fieldValue = record[k];
          return `${fieldValue}`.includes(`${v}`);
        }
        return true;
      });
    }, data);

    return Promise.resolve(
      pagination<TeacherRecord>({ data: filteredData, page, limit }),
    );
  },

  AdminLoginAs: function (
    targetId: string,
  ): Promise<PaginationAPIResponse<AdminLoginAsResponse>> {
    const data = MOCK_DATA.find((record) => record.id === targetId) as TeacherRecord;
    return Promise.reject(responseFailed({ statusCode: 404 }));
  },
  GetById: function (id: string): Promise<DataAPIResponse<TeacherRecord>> {
    const data = MOCK_DATA.find((record) => record.id === id) as TeacherRecord;
    if (data) return Promise.resolve(responseOk({ data }));
    return Promise.reject(responseFailed({ statusCode: 404 }));
  },
  Create: function (
    teacher: DataAPIRequest<CreatedTeacherRecord>,
  ): Promise<DataAPIResponse<TeacherRecord>> {
    const createdAt = new Date().toISOString();
    const data = {
      ...teacher,
      id: '000001',
      created_at: createdAt,
      created_by: 'self',
    } as TeacherRecord;
    return Promise.resolve(responseOk({ data }));
  },
  Update: function (
    id: string,
    teacher: DataAPIRequest<UpdatedUserEntity>,
  ): Promise<DataAPIResponse<UpdatedUserResponse>> {
    const updatedAt = new Date().toISOString();
    const data = {
      ...teacher,
      id: id,
      updated_at: updatedAt,
      updated_by: 'self',
    } as UpdatedUserResponse;
    return Promise.resolve(responseOk({ data }));
  },
  AccessListGets: function (): Promise<PaginationAPIResponse<TeacherAccess>> {
    const accessLists: TeacherAccess[] = [
      {
        teacher_access_id: 1,
        access_name: 'ผู้ดูแลระบบตัดเกรด',
      },
      {
        teacher_access_id: 2,
        access_name: 'กรอกคะแนน',
      },
      {
        teacher_access_id: 3,
        access_name: 'ตัดเกรด',
      },
    ];
    return Promise.resolve(
      pagination<TeacherAccess>({
        data: accessLists,
        page: 1,
        limit: 10,
      }),
    );
  },
  UpdateTeacherAccess(
    teacherId: string,
    access: DataAPIRequest<UpdatedTeacherAccessRecord>,
  ): Promise<DataAPIResponse<number[]>> {
    const accessList = access.teacher_accesses?.map((item) => Number(item)) ?? [];
    return Promise.resolve(
      responseOk({
        data: accessList,
      }),
    );
  },
  BulkUpdate: function (
    data: BulkDataAPIRequest<BulkUserUpdateRecord>,
  ): Promise<BaseAPIResponse> {
    return Promise.resolve({
      status_code: 200,
      message: 'Edited',
    });
  },
  DownloadCSV: function (
    schoolId: string,
    data: DataAPIRequest<{ start_date: string; end_date: string }>,
  ): Promise<any> {
    return Promise.resolve({
      status_code: 200,
      message: 'download',
    });
  },
  UploadCSV: function (
    schoolId: string,
    data: DataAPIRequest<{ csv_file: File }>,
  ): Promise<BaseAPIResponse> {
    return Promise.resolve({
      status_code: 200,
      message: 'upload',
    });
  },
  ResetPassword: function (data: { user_id: string; password: string }): Promise<any> {
    return Promise.resolve({
      status_code: 200,
      message: 'Password updated',
    });
  },
  ListTeachingLog: function (
    teacherId: string,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<TeacherTeachingLogRecord>> {
    const teachingLogs: TeacherTeachingLogRecord[] = [
      {
        academic_year: 2562,
        curriculum_group_name: 'กระทรวงศึกษาธิการ',
        subject: 'คณิตศาสตร์ 1',
        year: 'ป.1',
      },
      {
        academic_year: 2563,
        curriculum_group_name: 'กระทรวงศึกษาธิการ',
        subject: 'คณิตศาสตร์ 1',
        year: 'ป.2',
      },
      {
        academic_year: 2564,
        curriculum_group_name: 'กระทรวงศึกษาธิการ',
        subject: 'คณิตศาสตร์ 1',
        year: 'ป.3',
      },
    ];
    return Promise.resolve(
      pagination<TeacherTeachingLogRecord>({
        data: teachingLogs,
        page: query?.page ?? 1,
        limit: query?.limit ?? 10,
      }),
    );
  },
  ListClassLog: function (
    teacherId: string,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<TeacherClassLogRecord>> {
    const classLogs: TeacherClassLogRecord[] = [
      { class_id: 1, class_name: 'ทดสอบ 1', class_year: 'ป.4' },
      { class_id: 2, class_name: 'ทดสอบ 2', class_year: 'ป.4' },
      { class_id: 3, class_name: 'ทดสอบ 3', class_year: 'ป.4' },
      { class_id: 4, class_name: 'ทดสอบ 4', class_year: 'ป.4' },
    ];
    return Promise.resolve(
      pagination<TeacherClassLogRecord>({
        data: classLogs,
        page: query?.page ?? 1,
        limit: query?.limit ?? 10,
      }),
    );
  },
};

export default MockSchoolTeacher;
