import { Pagination, StudentDto } from '../../type';

export interface GetStudentListParams {
  page: number;
  limit: number;
  sort_order: 'ASC' | 'DESC';
  sory_by?: string;
  search_text?: string;
}

export interface CreatePhorpor5Payload {
  subject_teacher: string;
  head_of_subject: string;
  principal: string;
  deputy_director: string;
  registrar: string;
  sign_date?: string; // date format
  issue_date?: string; // date format
  document_number_start: string;
}

export interface StudentRepository {
  GetStudentList: (
    evaluationFormId: string,
    params: GetStudentListParams,
  ) => Promise<{
    students: StudentDto[];
    pagination: Pagination;
  }>;

  CreatePhorpor5: (
    evaluationFormId: string,
    payload: CreatePhorpor5Payload,
  ) => Promise<{ message: string; status_code: number }>;
}
