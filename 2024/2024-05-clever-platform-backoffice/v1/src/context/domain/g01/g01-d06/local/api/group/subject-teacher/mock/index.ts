import { Affiliation } from '@domain/g01/g01-d02/local/type';

import {
  DataAPIResponse,
  DataAPIRequest,
  pagination,
  PaginationAPIResponse,
  responseFailed,
  responseOk,
} from '@domain/g01/g01-d02/local/api/helper';
import { isKeyOfObject } from '@domain/g01/g01-d02/local/helper';

import MOCK_DATA from './data.json';
import { AffiliationRepository } from '@domain/g01/g01-d02/local/api/repository/affiliation';
import { BaseAPIResponse } from '@global/utils/apiResponseHelper';

const AffiliationMock: AffiliationRepository = {
  Gets: function (query): Promise<PaginationAPIResponse<Affiliation>> {
    const {
      page = 1,
      limit = 10,
      school_affiliation_group,
      status,
      search_text,
      ...restQuery
    } = query;
    const data: Affiliation[] = MOCK_DATA.filter(
      (record) =>
        !school_affiliation_group ||
        record.school_affiliation_group === school_affiliation_group,
    ).filter((record) => !status || record.status === status) as Affiliation[];

    const filterQuery = Object.entries(restQuery).filter(([k, v]) => v !== undefined);
    const filteredData = filterQuery.reduce((prev, [k, v]) => {
      return prev.filter((record) => {
        if (isKeyOfObject<Affiliation>(k, record)) {
          const fieldValue = record[k];
          return `${fieldValue}`.includes(`${v}`);
        }
        return true;
      });
    }, data);

    return Promise.resolve(pagination<Affiliation>({ data: filteredData, page, limit }));
  },
  GetById: function (id: string): Promise<DataAPIResponse<Affiliation>> {
    const data = MOCK_DATA.find((record) => record.id === id) as Affiliation;
    if (data) return Promise.resolve(responseOk({ data }));
    return Promise.reject(responseFailed({ statusCode: 404 }));
  },
  Create: function (
    affiliation: DataAPIRequest<Affiliation>,
  ): Promise<DataAPIResponse<Affiliation>> {
    const createdAt = new Date().toISOString();
    const data = {
      ...affiliation,
      id: '000001',
      created_at: createdAt,
      created_by: 'self',
    } as Affiliation;
    return Promise.resolve(responseOk({ data }));
  },
  Update: function (
    affiliation: DataAPIRequest<Affiliation>,
  ): Promise<DataAPIResponse<Affiliation>> {
    const updatedAt = new Date().toISOString();
    const data = {
      ...affiliation,
      updated_at: updatedAt,
      updated_by: 'self',
    } as Affiliation;
    return Promise.resolve(responseOk({ data }));
  },
  Download: function (startDate: string, endDate: string): Promise<Blob> {
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

  Upload: function (file: File): Promise<DataAPIResponse<null>> {
    return Promise.resolve({
      status_code: 200,
      message: 'upload',
      data: null, // ข้อมูลที่ต้องการใน response
    });
  },
};

export default AffiliationMock;
