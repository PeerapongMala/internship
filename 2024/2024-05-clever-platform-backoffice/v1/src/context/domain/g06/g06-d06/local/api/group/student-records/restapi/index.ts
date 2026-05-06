import get from 'lodash/get';
import map from 'lodash/map';
import {
  CreatePhorpor5Payload,
  GetStudentListParams,
  StudentRepository,
} from '../../../repository/student-records';
import { Pagination, Student, StudentDto } from '@domain/g06/g06-d06/local/type';
import mock from '../mock/index.json';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { getQueryParams, PaginationAPIResponse } from '@global/utils/apiResponseHelper';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;
const isMock = !import.meta.env.PROD && import.meta.env.VITE_DEBUG_API_IS_MOCK === 'true';

export class ApiStudentRepository implements StudentRepository {
  private apiClient: typeof fetchWithAuth;

  constructor() {
    this.apiClient = fetchWithAuth;
  }

  async CreatePhorpor5(
    evaluationFormId: string,
    payload: CreatePhorpor5Payload,
  ): Promise<{ message: string; status_code: number }> {
    try {
      const response = await this.apiClient(
        `${BACKEND_URL}/porphor5/v1/${evaluationFormId}/create`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then((r) => r.json());

      return response;
    } catch (error) {
      throw error;
    }
  }

  async GetStudentList(
    evaluationFormId: string,
    params: GetStudentListParams = { page: 1, limit: 10, sort_order: 'ASC' },
  ): Promise<{ students: StudentDto[]; pagination: Pagination }> {
    try {
      if (isMock) {
        return {
          students: map(mock.data, (dto) => this.transformToStudentDTO(dto)),
          pagination: {
            page: params.page,
            limit: params.limit,
            total_count: mock.data.length,
          },
        };
      }
      const queryParams = getQueryParams(params);
      const response: PaginationAPIResponse<Student> = await this.apiClient(
        `${BACKEND_URL}/porphor5/v1/porphor6/${evaluationFormId}/list` +
          '?' +
          queryParams.toString(),
      ).then((r) => r.json());

      if (response.status_code !== 200) {
        throw new Error(response.message);
      }

      const students = map(response.data, (dto) => this.transformToStudentDTO(dto));
      return {
        students,
        pagination: get(response, '_pagination', {
          page: 1,
          limit: 1,
          total_count: 1,
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  private transformToStudentDTO(partialDto: Partial<Student>): StudentDto {
    return {
      id: String(get(partialDto, 'id', '')),
      formId: get(partialDto, 'form_id', 0),
      order: get(partialDto, 'order', 0),
      studentId: get(partialDto, 'student_id', 0),
      createdAt: get(partialDto, 'created_at', ''),
      studentIdNo: get(partialDto, 'student_id_no', ''),
      title: get(partialDto, 'title', ''),
      thaiFirstName: get(partialDto, 'thai_first_name', ''),
      thaiLastName: get(partialDto, 'thai_last_name', ''),
      engFirstName: get(partialDto, 'eng_first_name', ''),
      engLastName: get(partialDto, 'eng_last_name', ''),
      academicYear: get(partialDto, 'academic_year', ''),
      year: get(partialDto, 'year', ''),
      schoolRoom: get(partialDto, 'school_room', ''),
    };
  }
}

const apiStudentRepository = new ApiStudentRepository();

export default apiStudentRepository;
