import { StudentDetailDto } from '../../type';

export interface GetStudentDetailParams {
  id: string;
}

export interface StudentDetailRepository {
  GetStudentDetail: (
    evaluationFormId: string,
    params: GetStudentDetailParams,
  ) => Promise<StudentDetailDto>;
}
