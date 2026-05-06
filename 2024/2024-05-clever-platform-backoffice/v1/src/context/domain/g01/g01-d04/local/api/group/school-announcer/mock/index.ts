import {
  BulkUserUpdateRecord,
  CreatedSchoolAnnouncer,
  SchoolAnnouncer,
  UpdatedUserEntity,
  UpdatedUserResponse,
} from '@domain/g01/g01-d04/local/type';
import {
  PaginationAPIResponse,
  DataAPIResponse,
  DataAPIRequest,
  BaseAPIResponse,
  BulkDataAPIRequest,
} from '@global/utils/apiResponseHelper';
import {
  pagination,
  responseDownloadCSV,
  responseFailed,
  responseOk,
} from '@global/utils/mockHelper';

import MOCK_DATA from './data.json';
import { isKeyOfObject, searchInRow } from '@global/utils/filters';
import {
  SchoolAnnouncerFilterQueryParams,
  SchoolAnnouncerRepository,
} from '../../../repository/school-announcer';

const MockSchoolAnnouncer: SchoolAnnouncerRepository = {
  Gets: function (
    schoolId: string,
    query: SchoolAnnouncerFilterQueryParams,
  ): Promise<PaginationAPIResponse<SchoolAnnouncer>> {
    const { page = 1, limit = 10, search_text, status, ...restQuery } = query;
    const data: SchoolAnnouncer[] = MOCK_DATA.filter((record) => {
      return !status || record.status === status;
    }).filter((record) => {
      return !search_text || searchInRow(search_text ?? '', record);
    }) as SchoolAnnouncer[];

    const filterQuery = Object.entries(restQuery).filter(([k, v]) => v !== undefined);
    const filteredData = filterQuery.reduce((prev, [k, v]) => {
      return prev.filter((record) => {
        if (isKeyOfObject<SchoolAnnouncer>(k, record)) {
          const fieldValue = record[k];
          return `${fieldValue}`.includes(`${v}`);
        }
        return true;
      });
    }, data);

    return Promise.resolve(
      pagination<SchoolAnnouncer>({ data: filteredData, page, limit }),
    );
  },
  GetById: function (announcerId: string): Promise<DataAPIResponse<SchoolAnnouncer>> {
    const data = MOCK_DATA.find((record) => record.id === announcerId) as SchoolAnnouncer;
    if (data) return Promise.resolve(responseOk({ data }));
    return Promise.reject(responseFailed({ statusCode: 404 }));
  },
  BulkEdit: function (
    data: BulkDataAPIRequest<BulkUserUpdateRecord>,
  ): Promise<BaseAPIResponse> {
    return Promise.resolve({
      status_code: 200,
      message: 'Edited',
    });
  },
  Create: function (
    data: DataAPIRequest<CreatedSchoolAnnouncer>,
  ): Promise<DataAPIResponse<SchoolAnnouncer>> {
    const createdAt = new Date().toISOString();
    const response = {
      ...data,
      id: '1',
      created_at: createdAt,
      created_by: 'self',
    } as SchoolAnnouncer;
    return Promise.resolve(responseOk({ data: response }));
  },
  Update: function (
    announcerId: string,
    data: DataAPIRequest<UpdatedUserEntity>,
  ): Promise<DataAPIResponse<UpdatedUserResponse>> {
    const updatedAt = new Date().toISOString();
    const response = {
      ...data,
      id: announcerId,
      updated_at: updatedAt,
      updated_by: 'self',
    } as UpdatedUserResponse;
    return Promise.resolve(responseOk({ data: response }));
  },
  UpdatePassword: function (data: {
    user_id: string;
    password: string;
  }): Promise<BaseAPIResponse> {
    return Promise.resolve({
      status_code: 200,
      message: 'Password updated',
    });
  },
  DownloadCSV: function (
    schoolId: string,
    query: DataAPIRequest<{ start_date: string; end_date: string }>,
  ): Promise<Blob> {
    return new Promise((resolve) => {
      const mock = [
        {
          No: 1,
          'Id (ห้ามแก้)': '45a47203-9d83-4e4f-b7b8-6eb748b2eed8',
          อีเมล: 'announcer@announcer.com',
          คำนำหน้า: 'นาย',
          ชื่อ: 'วอท',
          นามสกุล: 'เดอะ',
          เลขบัตรประชาชน: '550234993243',
          สถานะ: 'disabled',
          รหัสผ่าน: '',
        },
      ];

      const csvContent =
        Object.keys(mock[0]).join(',') +
        '\n' +
        mock.map((row) => Object.values(row).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });

      setTimeout(() => resolve(blob), 1000);
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
};

export default MockSchoolAnnouncer;
