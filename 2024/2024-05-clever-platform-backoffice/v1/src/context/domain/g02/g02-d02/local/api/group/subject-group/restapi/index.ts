import {
  ICreateSubjectGroup,
  IDownloadCsvFilter,
  ISubjectGroup,
  IUpdateSubjectGroup,
} from '@domain/g02/g02-d02/local/type';
import { SubjectGroupRepository } from '../../../repository/subject-group';
import {
  BasePaginationAPIQueryParams,
  DataAPIResponse,
  FailedAPIResponse,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import downloadCSV from '@global/utils/downloadCSV';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SubjectGroupRestAPI: SubjectGroupRepository = {
  GetAll: function (
    yearId: number,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<ISubjectGroup>> {
    const url = `${BACKEND_URL}/academic-courses/v1/${yearId}/subject-groups`;

    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, any>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<ISubjectGroup>) => {
        return res;
      });
  },
  GetById: function (
    subjectGroupId: ISubjectGroup['id'],
  ): Promise<DataAPIResponse<ISubjectGroup>> {
    const url = `${BACKEND_URL}/academic-courses/v1/subject-groups/${subjectGroupId}`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<ISubjectGroup[]>) => {
        if (res.status_code == 201 || res.status_code == 200) {
          return { ...res, data: res.data[0] } as DataAPIResponse<ISubjectGroup>;
        }
        return res as DataAPIResponse<ISubjectGroup>;
      });
  },
  Create: function (data: ICreateSubjectGroup): Promise<DataAPIResponse<ISubjectGroup>> {
    const url = `${BACKEND_URL}/academic-courses/v1/subject-groups/`;

    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<ISubjectGroup[]>) => {
        if (res.status_code == 201 || res.status_code == 200) {
          return { ...res, data: res.data[0] } as DataAPIResponse<ISubjectGroup>;
        }
        return res as DataAPIResponse<ISubjectGroup>;
      });
  },
  Update: function (
    subjectGroupId: ISubjectGroup['id'],
    data: IUpdateSubjectGroup,
  ): Promise<DataAPIResponse<ISubjectGroup>> {
    const url = `${BACKEND_URL}/academic-courses/v1/subject-groups/${subjectGroupId}`;

    return fetchWithAuth(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<ISubjectGroup[]>) => {
        if (res.status_code == 201 || res.status_code == 200) {
          return { ...res, data: res.data[0] } as DataAPIResponse<ISubjectGroup>;
        }
        return res as DataAPIResponse<ISubjectGroup>;
      });
  },
  DownloadCsv: function (filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse> {
    const url = `${BACKEND_URL}/academic-courses/v1/${filter.curriculum_group_id}/subject-groups/download/csv?start_date=${filter.start_date}&end_date=${filter.end_date}`;

    return fetchWithAuth(url)
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        } else {
          return res.json();
        }
      })
      .then((res) => {
        // check if res is a blob
        if (res instanceof Blob) {
          downloadCSV(res, 'subject_group.csv');
        } else {
          return res as FailedAPIResponse;
        }
      });
  },
  UploadCsv: function (
    file: File | null,
    curriculumGroupId: number,
  ): Promise<DataAPIResponse<ISubjectGroup[]>> {
    const url = `${BACKEND_URL}/academic-courses/v1/${curriculumGroupId}/subject-groups/upload/csv`;

    const formData = new FormData();
    formData.append('csv_file', file!);

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    }).then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return res.json();
      }
    });
  },
  BulkEdit: function (
    subjectGroups: Pick<ISubjectGroup, 'id' | 'status'>[],
    admin_login_as?: ISubjectGroup['admin_login_as'],
  ): Promise<DataAPIResponse<undefined>> {
    const url = `${BACKEND_URL}/academic-courses/v1/subject-groups/bulk-edit`;

    const data = {
      bulk_edit_list: subjectGroups.map((group) => ({
        subject_group_id: group.id,
        status: group.status,
      })),
      admin_login_as,
    };

    return fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<undefined>) => {
        return res;
      });
  },
};

export default SubjectGroupRestAPI;
