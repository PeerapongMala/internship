import { TSubjectType } from './types/student-report-form';

export interface Student {
  id: number;
  form_id: number;
  order: number;
  student_id: number;
  created_at: string;
  student_id_no: string;
  title: string;
  thai_first_name: string;
  thai_last_name: string;
  eng_first_name: string;
  eng_last_name: string;
  academic_year: string;
  year: string;
  school_room: string;
}

export interface StudentDto {
  id: string;
  formId: number;
  order: number;
  studentId: number;
  createdAt: string;
  studentIdNo: string;
  title: string;
  thaiFirstName: string;
  thaiLastName: string;
  engFirstName: string;
  engLastName: string;
  academicYear: string;
  year: string;
  schoolRoom: string;
}

export interface StudentInfo {
  name: string;
  surname: string;
  dob: string;
  age: string;
  month: string;
  gender: string;
  ethnicity: string;
  nationality: string;
  religion: string;
  id_no: string;
  citizen_no: string;
  father_fullname: string;
  father_job: string;
  mother_fullname: string;
  mother_job: string;
  parents_status: string;
  guardian_fullname: string;
  guardian_job: string;
  address: string;
}

export interface StudentInfoDto {
  name: string;
  surname: string;
  dob: string;
  age: string;
  month: string;
  gender: string;
  ethnicity: string;
  nationality: string;
  religion: string;
  idNo: string;
  citizenNo: string;
  fatherFullname: string;
  fatherJob: string;
  motherFullname: string;
  motherJob: string;
  parentsStatus: string;
  guardianFullname: string;
  guardianJob: string;
  address: string;
}

export const GeneralType = {
  time: 'เวลาเรียน',
  nutrition: 'ภาวะโภชนาการ',
  activities: 'กิจกรรมพัฒนาผู้เรียน',
  capacity: 'สมรรถนะ',
  attribute: 'คุณลักษณะอันพึงประสงค์',
};

export interface StudentDetail {
  id: number;
  form_id: number;
  order: number;
  student_id: number;
  created_at: string;
  student_id_no: string;
  title: string;
  thai_first_name: string;
  thai_last_name: string;
  eng_first_name: string;
  eng_last_name: string;
  academic_year: string;
  year: string;
  school_room: string;
  school_address: string;
  data_json: {
    citizen_no: string;
    school_name: string;
    school_area: string;
    evaluation_student_id: number;
    title: string;
    thai_first_name: string;
    thai_last_name: string;
    eng_first_name: string;
    eng_last_name: string;
    number: number;
    student_id: string;
    birth_date: string;
    nationality: string;
    religion: string;
    parent_marital_status: string;
    gender: string;
    general: Array<{
      evaluation_student_id: number;
      general_name: string;
      general_type: string;
      max_attendance: { [key: string]: number };
      student_indicator_data: Array<{
        indicator_general_name: string;
        indicator_id: number | null;
        value: number;
      }>;
      subject_name: string | null;
      nutrition: Array<Array<{ date: string }>>;
    }>;
    ethnicity: string;
    score_percentage: number;
    total_score_rank: number;
    average_learning_score: number;
    average_learning_rank: number;
    subject: Array<{
      subject_code: string;
      subject_name: string;
      hour: string;
      total_score: number;
      avg_score: number;
      score: number;
      grade: string;
      note: string;
      sheet_id: number;
      credits: number;
      is_extra: TSubjectType;
    }>;
    subject_teacher: string;
    head_of_subject: string;
    principal: string;
    registrar: string;
    sign_date: string;
    issue_date: string;
    father_title: string;
    father_first_name: string;
    father_last_name: string;
    father_occupation: string;
    mother_title: string;
    mother_first_name: string;
    mother_last_name: string;
    mother_occupation: string;
    guardian_title: string;
    guardian_first_name: string;
    guardian_last_name: string;
    guardian_relation: string;
    guardian_occupation: string;
    address_no: string;
    address_moo: string;
    address_sub_district: string;
    address_district: string;
    address_province: string;
    address_postal_code: string;
    additional_field: any;
  };
}

export interface StudentDetailDto {
  id: number;
  formId: number;
  order: number;
  studentId: number;
  createdAt: string;
  studentIdNo: string;
  title: string;
  thaiFirstName: string;
  thaiLastName: string;
  engFirstName: string;
  engLastName: string;
  academicYear: string;
  year: string;
  schoolRoom: string;
  school_address: string;
  age_year: number;
  age_month: number;
  normal_credits: number; // พื้นฐาน
  extra_credits: number; // เพิ่มเติม
  total_credits: number; // รวม
  province: string;
  dataJson: {
    citizenNo: string;
    school_name: string;
    school_area: string;
    evaluationStudentId: number;
    title: string;
    thaiFirstName: string;
    thaiLastName: string;
    engFirstName: string;
    engLastName: string;
    number: number;
    studentId: string;
    birthDate: string;
    nationality: string;
    religion: string;
    parentMaritalStatus: string;
    gender: string;
    general: Array<{
      evaluationStudentId: number;
      generalName: string;
      generalType: string;
      maxAttendance: { [key: string]: number };
      studentIndicatorData: Array<{
        indicatorGeneralName: string;
        indicatorId: number | null;
        value: number;
      }>;
      subjectName: string | null;
      nutrition: Array<Array<{ date: string }>>;
    }>;
    ethnicity: string;
    scorePercentage: number;
    totalScoreRank: number;
    averageLearningScore: number;
    averageLearningRank: number;
    subject: Array<{
      subjectCode: string;
      subjectName: string;
      hours: string;
      totalScore: number;
      avgScore: number;
      score: number;
      grade: string;
      note: string;
      sheetId: number;
      credits: number;
      type?: TSubjectType;
    }>;
    subjectTeacher: string;
    headOfSubject: string;
    principal: string;
    registrar: string;
    signDate: string;
    issueDate: string;
    fatherTitle: string;
    fatherFirstName: string;
    fatherLastName: string;
    fatherOccupation: string;
    motherTitle: string;
    motherFirstName: string;
    motherLastName: string;
    motherOccupation: string;
    guardianTitle: string;
    guardianFirstName: string;
    guardianLastName: string;
    guardianRelation: string;
    guardianOccupation: string;
    addressNo: string;
    addressMoo: string;
    addressSubDistrict: string;
    addressDistrict: string;
    addressProvince: string;
    addressPostalCode: string;
    additionalField: any;
  };
}

/*

  Assessment

*/

interface MeasurementRound {
  measurement_date: string;
  weight_kg: string | null;
  height_cm: string | null;
}

interface NutritionAssessmentRound {
  weight_for_age: string | null;
  height_for_age: string | null;
  weight_for_height: string | null;
}

interface Semester {
  round_1: MeasurementRound;
  round_2: MeasurementRound;
}

interface NutritionSemester {
  round_1: NutritionAssessmentRound;
  round_2: NutritionAssessmentRound;
}

interface MonthlyAttendance {
  month: string;
  total_days: number | null;
  days_attended: number | null;
  attendance_percentage: number | null;
  notes: string | null;
}

interface AnnualSummary {
  total_days: number;
  days_attended: number;
  attendance_percentage: number;
  notes: string | null;
}

export interface Assessment {
  weight_height_measurement: {
    semester_1: Semester;
    semester_2: Semester;
  };
  nutritional_assessment_by_age: {
    semester_1: NutritionSemester;
    semester_2: NutritionSemester;
  };
  // attendance_summary: {
  //   months: MonthlyAttendance[];
  //   annual_summary: AnnualSummary;
  // };
}

interface MeasurementRoundDto {
  measurementDate: Date;
  weight: string;
  height: string;
}

interface NutritionAssessmentRoundDto {
  weightAge: string;
  heightAge: string;
  weightHeight: string;
}

interface SemesterDto {
  round1: MeasurementRoundDto;
  round2: MeasurementRoundDto;
}

interface NutritionSemesterDto {
  round1: NutritionAssessmentRoundDto;
  round2: NutritionAssessmentRoundDto;
}

interface MonthlyAttendanceDto {
  month: string;
  totalDays: number;
  daysAttended: number;
  attendancePercentage: number;
  notes: string;
}

interface AnnualSummaryDto {
  totalDays: number;
  daysAttended: number;
  attendancePercentage: number;
  notes: string;
}

export interface AssessmentDto {
  measurement: {
    semester1: SemesterDto;
    semester2: SemesterDto;
  };
  nutritional: {
    semester1: NutritionSemesterDto;
    semester2: NutritionSemesterDto;
  };
}

/**
 *
 * Student Phorpor6 Grade
 *
 */

export interface StudentGrade {
  student_info: {
    name: string;
    student_id: string;
    class_number: string;
  };
  subjects: Array<{
    subject_code: string;
    subject_name: string;
    hours: number;
    full_score: number;
    passing_score: number;
    score: number;
    result: number;
    note: string;
  }>;
  grades: {
    gpa: number;
    best_grade: number;
    average_grade: number;
    best_average_grade: number;
  };
  activities: {
    guidance: string;
    scouts: string;
    community: string;
    public_service: string;
  };
  evaluations: {
    desired_characteristics: string;
    reading_analysis_writing: string;
    key_competencies: string;
  };
}

export interface StudentGradeDto {
  studentInfo: {
    name: string;
    studentId: string;
    classNumber: string;
  };
  subjects: Array<{
    subjectCode: string;
    subjectName: string;
    hours: number;
    fullScore: number;
    passingScore: number;
    score: number;
    result: number;
    note: string;
  }>;
  grades: {
    gpa: number;
    bestGrade: number;
    averageGrade: number;
    bestAverageGrade: number;
  };
  activities: {
    guidance: string;
    scouts: string;
    community: string;
    publicService: string;
  };
  evaluations: {
    desiredCharacteristics: string;
    readingAnalysisWriting: string;
    keyCompetencies: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}
