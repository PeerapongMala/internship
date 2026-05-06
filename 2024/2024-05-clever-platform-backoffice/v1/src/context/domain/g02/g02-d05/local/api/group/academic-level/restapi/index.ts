import { AcademicLevel } from '@domain/g02/g02-d05/local/type';
import { AcademicLevelRepository } from '../../../repository/academicLevel';
import { DataAPIResponse, PaginationAPIResponse } from '../../../helper';
import fetchWithAuth from '@global/utils/fetchWithAuth';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const AcademicLevelRestAPI: AcademicLevelRepository = {
  Gets: function (
    subLessonId: string,
    query,
  ): Promise<PaginationAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-level/v1/${subLessonId}/levels`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });
    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res) => {
        if (res.status_code === 200) {
          return {
            ...res,
            _pagination: res._pagination || {
              limit: 0,
              page: 0,
              total_count: 0,
            },
          } as PaginationAPIResponse<AcademicLevel>;
        }
        return res;
      });
  },
  GetById: function (id: string): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-level/v1/levels/${id}/`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  GetYearList: function (curriculumId: string): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-courses/v1/${curriculumId}/years?page=1&limit=-1`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  GetSubjectGroupList: function (
    yearId: string,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-courses/v1/${yearId}/subject-groups?page=1&limit=-1`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  GetSubjectList: function (
    curriculumGroupId: string,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-courses/v1/${curriculumGroupId}/subjects?page=1&limit=-1`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  GetG02D02A26: function (subjectId: string): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-courses/v1/subjects/${subjectId}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  GetG02D04A07SubLessonById: function (
    subLessonId: string,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-sub-lesson/v1/sub-lessons/${subLessonId}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  GetG00D00A01: function (): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/arriving/v1/curriculum-groups?page=1&limit=-1`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  DeleteG02D05A28: function (
    questionId: string,
    passwordObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/${questionId}`;

    const body = JSON.stringify(passwordObject);
    const options = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  GetG02D05A29: function (
    levelId: string,
    query: any,
  ): Promise<PaginationAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-level/v1/levels/${levelId}/questions`;
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    return fetchWithAuth(url + '?' + params.toString())
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  GetG02D05A32LessonCaseListBySubject: function (
    subjectId: string,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-level/v1/${subjectId}/lessons`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  GetG02D05A33: function (lessonId: string): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-level/v1/${lessonId}/sub-lessons`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  GetG02D05A34: function (subjectId: string): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-level/v1/${subjectId}/tags`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  GetG02D05A35SubCriteriaCaseListByCurriculumGroup: function (
    curriculumGroupId: string,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-level/v1/${curriculumGroupId}/sub-criteria`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  UpdateG02D05A36: function (
    subLessonId: string,
    academicLevels: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-level/v1/sub-lessons/${subLessonId}/levels/sort`;
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(academicLevels),
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  UpdateG02D05A39: function (
    academicLevelId: string,
    questions: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-level/v1/levels/${academicLevelId}/questions/sort`;
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(questions),
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  GetG02D05A37: function (
    curriculumGroupId: string,
    query,
  ): Promise<PaginationAPIResponse<AcademicLevel>> {
    const filterQuery = Object.fromEntries(
      Object.entries(query).filter(([k, v]) => v !== undefined),
    );

    if (filterQuery.text) {
      filterQuery.text = filterQuery.text.replace(/\\/g, '\\\\');
    }
    const params = new URLSearchParams({
      ...(filterQuery as Record<string, string>),
    });

    const url = `${BACKEND_URL}/academic-level/v1/${curriculumGroupId}/saved-text?${params}`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.status_code === 200) {
          return {
            ...res,
            _pagination: res._pagination || {
              limit: 0,
              page: 0,
              total_count: 0,
            },
          } as PaginationAPIResponse<AcademicLevel>;
        }
        return res;
      });
  },
  GetG02D05A41: function (subLessonId: string): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-level/v1/${subLessonId}/standard`;
    return fetchWithAuth(url)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  UpdateG02D05A46: function (
    academicLevels: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    const url = `${BACKEND_URL}/academic-level/v1/levels/bulk-edit`;
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(academicLevels),
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: PaginationAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  CreateG02D05A08: function (
    question: FormData,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/multiple-choice`;

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: question,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  UpdateG02D05A09: function (
    questionId: string,
    question: FormData,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/multiple-choice/${questionId}`;

    const options = {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
      },
      body: question,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  CreateG02D05A12: function (
    question: FormData,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/group`;

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: question,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  UpdateG02D05A13: function (
    questionId: string,
    question: FormData,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/group/${questionId}`;

    const options = {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
      },
      body: question,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  CreateG02D05A16: function (
    question: FormData,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/sort`;

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: question,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  UpdateG02D05A17: function (
    questionId: string,
    question: FormData,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/sort/${questionId}`;

    const options = {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
      },
      body: question,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  CreateG02D05A20: function (
    question: FormData,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/placeholder`;

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: question,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  UpdateG02D05A21: function (
    questionId: string,
    question: FormData,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/placeholder/${questionId}`;

    const options = {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
      },
      body: question,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  CreateG02D05A24: function (
    question: FormData,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/input`;

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: question,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  UpdateG02D05A25: function (
    questionId: string,
    question: FormData,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/input/${questionId}`;

    const options = {
      method: 'PATCH',
      headers: {
        accept: 'application/json',
      },
      body: question,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  CreateG02D05A38: function (
    curriculumId: string,
    translateForm: FormData,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/${curriculumId}/saved-text/`;

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: translateForm,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  UpdateG02D05A42: function (
    groupId: string,
    soundForm: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/saved-text/${groupId}/speech`;

    const body = JSON.stringify(soundForm);
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  DeleteG02D05A45: function (
    groupId: string,
    textObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/saved-text/${groupId}/speech`;

    const body = JSON.stringify(textObject);
    const options = {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  CreateG02D05A47: function (
    textObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/saved-text/translate`;

    const body = JSON.stringify(textObject);
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  UpdateG02D05A48: function (
    groupId: string,
    textObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/saved-text/${groupId}`;

    const body = JSON.stringify(textObject);
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  Create: function (
    academicLevel: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/levels`;

    const body = JSON.stringify(academicLevel);
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  Update: function (
    academicLevelId: string,
    academicLevel: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/levels/${academicLevelId}`;

    const body = JSON.stringify(academicLevel);
    const options = {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  UploadCSV: function (
    subLessonId: string,
    file: File,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/${subLessonId}/levels/upload/csv`;

    const formData = new FormData();
    formData.append('csv_file', file);

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body: formData,
    };

    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  CreateG02D05A51: function (
    questionId: string,
    textObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/${questionId}/translate`;

    const body = JSON.stringify(textObject);
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  CreateG02D05A52: function (
    questionId: string,
    textObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/${questionId}/text-save`;

    const body = JSON.stringify(textObject);
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  CreateG02D05A53: function (
    questionId: string,
    textObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/${questionId}/speech`;

    const body = JSON.stringify(textObject);
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
  CreateG02D05A54: function (
    questionId: string,
    textObject: Partial<AcademicLevel>,
  ): Promise<DataAPIResponse<AcademicLevel>> {
    let url = `${BACKEND_URL}/academic-level/v1/questions/${questionId}/text-to-ai-save`;

    const body = JSON.stringify(textObject);
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    return fetchWithAuth(url, options)
      .then((res) => res.json())
      .then((res: DataAPIResponse<AcademicLevel>) => {
        return res;
      });
  },
};

export default AcademicLevelRestAPI;
