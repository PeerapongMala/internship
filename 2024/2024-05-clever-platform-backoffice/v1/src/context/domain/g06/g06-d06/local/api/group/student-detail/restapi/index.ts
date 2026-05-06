import get from 'lodash/get';
import first from 'lodash/first';
import { StudentDetail, StudentDetailDto } from '@domain/g06/g06-d06/local/type';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { getQueryParams, PaginationAPIResponse } from '@global/utils/apiResponseHelper';
import {
  GetStudentDetailParams,
  StudentDetailRepository,
} from '../../../repository/student-detail';
import { defaultTo } from 'lodash';
import { TSubjectType } from '@domain/g06/g06-d06/local/types/student-report-form';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiStudentDetailRepository implements StudentDetailRepository {
  private apiClient: typeof fetchWithAuth;

  constructor() {
    this.apiClient = fetchWithAuth;
  }

  async GetStudentDetail(
    evaluationFormId: string,
    params: GetStudentDetailParams,
  ): Promise<StudentDetailDto> {
    try {
      const queryParams = getQueryParams(params);
      const response: PaginationAPIResponse<StudentDetail> = await this.apiClient(
        `${BACKEND_URL}/porphor5/v1/porphor6/${evaluationFormId}/detail` +
          '?' +
          queryParams.toString(),
      ).then((r) => r.json());

      if (response.status_code !== 200) {
        throw new Error(response.message);
      }

      return this.transformToStudentDetailDto(first(response.data));
    } catch (error) {
      throw error;
    }
  }

  private transformToStudentDetailDto(
    data: Partial<StudentDetail | undefined>,
  ): StudentDetailDto {
    const dobStr = defaultTo(get(data, 'data_json.birth_date'), '');

    return {
      id: get(data, 'id', 0),
      formId: get(data, 'form_id', 0),
      order: get(data, 'order', 0),
      studentId: get(data, 'student_id', 0),
      createdAt: get(data, 'created_at', ''),
      studentIdNo: get(data, 'student_id_no', ''),
      title: get(data, 'title', ''),
      thaiFirstName: get(data, 'thai_first_name', ''),
      thaiLastName: get(data, 'thai_last_name', ''),
      engFirstName: get(data, 'eng_first_name', ''),
      engLastName: get(data, 'eng_last_name', ''),
      academicYear: get(data, 'academic_year', ''),
      year: get(data, 'year', ''),
      schoolRoom: get(data, 'school_room', ''),
      school_address: get(data, 'school_address', ''),
      age_year: get(data, 'age_year', 0),
      age_month: get(data, 'age_month', 0),
      normal_credits: get(data, 'normal_credits', 0),
      extra_credits: get(data, 'extra_credits', 0),
      total_credits: get(data, 'total_credits', 0),
      province: get(data, 'province', ''),
      dataJson: {
        citizenNo: get(data, 'data_json.citizen_no', ''),
        school_name: get(data, 'data_json.school_name', ''),
        school_area: get(data, 'data_json.school_area', ''),
        evaluationStudentId: get(data, 'data_json.evaluation_student_id', 0),
        title: get(data, 'data_json.title', ''),
        thaiFirstName: get(data, 'data_json.thai_first_name', ''),
        thaiLastName: get(data, 'data_json.thai_last_name', ''),
        engFirstName: get(data, 'data_json.eng_first_name', ''),
        engLastName: get(data, 'data_json.eng_last_name', ''),
        number: get(data, 'data_json.number', 0),
        studentId: get(data, 'data_json.student_id', ''),
        birthDate: get(data, 'data_json.birth_date', ''),
        nationality: get(data, 'data_json.nationality', ''),
        religion: get(data, 'data_json.religion', ''),
        parentMaritalStatus: get(data, 'data_json.parent_marital_status', ''),
        gender: get(data, 'data_json.gender', ''),
        general: defaultTo(data?.data_json?.general, []).map((g) => ({
          evaluationStudentId: get(g, 'evaluation_student_id', 0),
          generalName: get(g, 'general_name', '-'),
          generalType: get(g, 'general_type', '-'),
          maxAttendance: get(g, 'max_attendance', {}),
          studentIndicatorData: defaultTo(g.student_indicator_data, []).map((i) => ({
            indicatorGeneralName: get(i, 'indicator_general_name', '-'),
            indicatorId: get(i, 'indicator_id', 0),
            value: get(i, 'value', 0),
          })),
          nutrition: get(g, 'nutrition', []),
          subjectName: get(g, 'subject_name', '-'),
        })),
        ethnicity: get(data, 'data_json.ethnicity', ''),
        scorePercentage: get(data, 'data_json.score_percentage', 0),
        totalScoreRank: get(data, 'data_json.total_score_rank', 0),
        averageLearningScore: get(data, 'data_json.average_learning_score', 0),
        averageLearningRank: get(data, 'data_json.average_learning_rank', 0),
        subject: get(data, 'data_json.subject', []).map((subj) => ({
          subjectCode: get(subj, 'subject_code', ''),
          subjectName: get(subj, 'subject_name', ''),
          hours: get(subj, 'hours', ''),
          totalScore: get(subj, 'total_score', 0),
          avgScore: get(subj, 'avg_score', 0),
          score: get(subj, 'score', 0),
          grade: get(subj, 'grade', ''),
          note: get(subj, 'note', ''),
          sheetId: get(subj, 'sheet_id', 0),
          credits: get(subj, 'credits', 0),
          type: get(subj, 'type', undefined),
        })),
        subjectTeacher: get(data, 'data_json.subject_teacher', ''),
        headOfSubject: get(data, 'data_json.head_of_subject', ''),
        principal: get(data, 'data_json.principal', ''),
        registrar: get(data, 'data_json.registrar', ''),
        signDate: get(data, 'data_json.sign_date', ''),
        issueDate: get(data, 'data_json.issue_date', ''),
        fatherTitle: get(data, 'data_json.father_title', ''),
        fatherFirstName: get(data, 'data_json.father_first_name', ''),
        fatherLastName: get(data, 'data_json.father_last_name', ''),
        fatherOccupation: get(data, 'data_json.father_occupation', ''),
        motherTitle: get(data, 'data_json.mother_title', ''),
        motherFirstName: get(data, 'data_json.mother_first_name', ''),
        motherLastName: get(data, 'data_json.mother_last_name', ''),
        motherOccupation: get(data, 'data_json.mother_occupation', ''),
        guardianTitle: get(data, 'data_json.guardian_title', ''),
        guardianFirstName: get(data, 'data_json.guardian_first_name', ''),
        guardianLastName: get(data, 'data_json.guardian_last_name', ''),
        guardianRelation: get(data, 'data_json.guardian_relation', ''),
        guardianOccupation: get(data, 'data_json.guardian_occupation', ''),
        addressNo: get(data, 'data_json.address_no', ''),
        addressMoo: get(data, 'data_json.address_moo', ''),
        addressSubDistrict: get(data, 'data_json.address_sub_district', ''),
        addressDistrict: get(data, 'data_json.address_district', ''),
        addressProvince: get(data, 'data_json.address_province', ''),
        addressPostalCode: get(data, 'data_json.address_postal_code', ''),
        additionalField: get(data, 'data_json.additional_field', null),
      },
    };
  }
}

const apiStudentDetailRepository = new ApiStudentDetailRepository();

export default apiStudentDetailRepository;
