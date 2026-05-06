import {
  ICreateSubject,
  IDownloadCsvFilter,
  ISubject,
  IUpdateSubject,
} from '@domain/g02/g02-d02/local/type';
import { SubjectQueryParams, SubjectRepository } from '../../../repository/subject';
import {
  BasePaginationAPIQueryParams,
  DataAPIRequest,
  DataAPIResponse,
  FailedAPIResponse,
  getQueryParams,
  PaginationAPIResponse,
} from '@global/utils/apiResponseHelper';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import downloadCSV from '@global/utils/downloadCSV';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const SubjectRestAPI: SubjectRepository = {
  GetAll: function (
    subjectGroupId: number,
    curriculumGroupId: number,
    query: BasePaginationAPIQueryParams,
  ): Promise<PaginationAPIResponse<ISubject>> {
    const url = `${BACKEND_URL}/academic-courses/v1/${curriculumGroupId}/subjects`;
    const params = getQueryParams(query);

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<ISubject>) => {
        return res;
      });
  },
  GetById: function (id: number): Promise<DataAPIResponse<ISubject>> {
    const url = `${BACKEND_URL}/academic-courses/v1/subjects/${id}`;

    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: DataAPIResponse<ISubject[]>) => {
        if (res.status_code == 201 || res.status_code == 200) {
          return { ...res, data: res.data[0] } as DataAPIResponse<ISubject>;
        }
        return res as DataAPIResponse<ISubject>;
      });
  },
  Create: function (
    data: DataAPIRequest<IUpdateSubject>,
  ): Promise<DataAPIResponse<ISubject>> {
    const url = `${BACKEND_URL}/academic-courses/v1/subjects`;
    const formData = getSubjectFormData(data);

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<ISubject[]>) => {
        if (res.status_code == 201 || res.status_code == 200) {
          return { ...res, data: res.data[0] } as DataAPIResponse<ISubject>;
        }
        return res as DataAPIResponse<ISubject>;
      });
  },
  Update: function (
    subjectId: ISubject['id'],
    data: DataAPIRequest<IUpdateSubject>,
  ): Promise<DataAPIResponse<ISubject>> {
    const url = `${BACKEND_URL}/academic-courses/v1/subjects/${subjectId}`;
    const formData = getSubjectFormData(data);

    return fetchWithAuth(url, {
      method: 'PATCH',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<ISubject[]>) => {
        if (res.status_code == 201 || res.status_code == 200) {
          return { ...res, data: res.data[0] } as DataAPIResponse<ISubject>;
        }
        return res as DataAPIResponse<ISubject>;
      });
  },
  DownloadCsv: function (
    subjectGroupId: number,
    filter: IDownloadCsvFilter,
  ): Promise<void | FailedAPIResponse> {
    const url = `${BACKEND_URL}/academic-courses/v1/${subjectGroupId}/subjects/download/csv`;
    const params = getQueryParams(filter);

    return fetchWithAuth(url + '?' + params.toString())
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
          downloadCSV(res, 'subject.csv');
        } else {
          return res as FailedAPIResponse;
        }
      });
  },
  UploadCsv: function (
    subjectGroupId: number,
    file: File | null,
  ): Promise<DataAPIResponse<undefined>> {
    const url = `${BACKEND_URL}/academic-courses/v1/${subjectGroupId}/subjects/upload/csv`;

    const formData = new FormData();
    formData.append('csv_file', file!);

    return fetchWithAuth(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res: DataAPIResponse<undefined>) => {
        return res;
      });
  },
  BulkEdit: function (
    subjects: Pick<ISubject, 'id' | 'status'>[],
    admin_login_as?: ISubject['admin_login_as'],
  ): Promise<DataAPIResponse<undefined>> {
    const url = `${BACKEND_URL}/academic-courses/v1/subjects/bulk-edit`;

    const data = {
      bulk_edit_list: subjects.map((subject) => ({
        subject_id: subject.id,
        status: subject.status,
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

function getSubjectFormData(data: DataAPIRequest<IUpdateSubject>) {
  const formData = new FormData();
  (
    [
      'subject_group_id',
      'name',
      'project',
      'subject_language_type',
      'subject_language',
      'status',
    ] as const
  ).forEach((key) => {
    if (data[key] != undefined) {
      formData.append(key, data[key].toString());
    }
  });

  if (data.subject_translation_languages) {
    for (const subTranLang of data.subject_translation_languages) {
      formData.append('subject_translation_languages', subTranLang);
    }
  }
  if (data.subject_image) {
    formData.append('subject_image', data.subject_image);
  }
  return formData;
}

export default SubjectRestAPI;
