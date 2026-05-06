import { create } from 'zustand';
import { GeneralType, StudentDetailDto } from '../type';
import { api } from '../api';
import defaultTo from 'lodash/defaultTo';
import { createSelector } from 'reselect';
import { utils } from '../utils';
import { DateFormat } from '../utils/date-format';
import { StringFormat } from '../utils/string-format';
import { get, values } from 'lodash';
import dayjs from 'dayjs';
import {
  getWeightHeightMeasurement,
  getAssessmentMeasurement,
  transformToStudentAssessmentDTO,
  transformToTable,
  transformAttendanceData,
  transformHealthData,
} from '../../g06-d06-p07-phorpor6-report-assessment/helper';

export interface StudentDetailState {
  // State
  studentDetail: StudentDetailDto | null;
  isLoading: boolean;

  // Actions
  fetchStudentDetail: (evaluationFormId: string, id: string) => Promise<void>;
  resetStudentDetail: () => void;
}

export const useStudentDetailStore = create<StudentDetailState>((set, get) => ({
  // Initial state
  studentDetail: null,
  isLoading: false,

  // Actions
  fetchStudentDetail: async (evaluationFormId: string, id: string) => {
    try {
      set({ isLoading: true });
      const studentDetail = await api.studentDetail.GetStudentDetail(evaluationFormId, {
        id,
      });

      set({
        studentDetail,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
      });
    }
  },

  resetStudentDetail: () => {
    set({ studentDetail: null });
  },
}));

const getStudentDetail = (state: StudentDetailState) => state.studentDetail;
const getIsLoading = (state: StudentDetailState) => state.isLoading;

// Selectors as separate functions
export const studentDetailSelectors = {
  getStudentDetail,
  getIsLoading,

  getPhorpor6Form: createSelector([getStudentDetail], (studentDetail) => {
    if (!studentDetail) return null;

    return {
      fullname: `${studentDetail.thaiFirstName} ${studentDetail.thaiLastName}`,
      idNo: defaultTo(studentDetail?.studentIdNo, '-'),
      studentNo: defaultTo(studentDetail?.studentId, '-'),
      academic_year: defaultTo(studentDetail.academicYear, ''),
      year: defaultTo(studentDetail.year, ''),
      province: defaultTo(studentDetail.province, ''),
    };
  }),

  getPhorpor6Breadcrumb: createSelector([getStudentDetail], (studentDetail) => {
    if (!studentDetail) return null;
    return {
      gradeLevel: defaultTo(studentDetail.year, ''),
      academicYear: defaultTo(studentDetail.academicYear, ''),
      room: `${studentDetail.year}/${get(studentDetail.schoolRoom.match(/\d/g), '0', '-')}`,
      term: 1,
    };
  }),

  getSchool: createSelector([getStudentDetail], (studentDetail) => {
    if (!studentDetail) return null;

    return {
      name: defaultTo(studentDetail.dataJson.school_name, '-'),
      area: defaultTo(studentDetail.dataJson.school_area, '-'),
    };
  }),

  getPhorpor6ReportForm: createSelector([getStudentDetail], (studentDetail) => {
    if (!studentDetail) return null;
    return studentTransformFunc.phorpor6reportDto(studentDetail);
  }),

  getPhorpor6CertificateForm: createSelector([getStudentDetail], (studentDetail) => {
    if (!studentDetail) return null;
    return studentTransformFunc.phorpor6CertificateDto(studentDetail);
  }),

  getPhorpor6InforForm: createSelector([getStudentDetail], (studentDetail) => {
    if (!studentDetail) return null;
    return studentTransformFunc.phorpor6InforDto(studentDetail);
  }),
  getGrade: createSelector([getStudentDetail], (studentDetail) => {
    if (!studentDetail) return null;
    return {
      scorePercentage: defaultTo(studentDetail.dataJson.scorePercentage, 0),
      totalScoreRank: defaultTo(studentDetail.dataJson.totalScoreRank, 0),
      avgLearnScore: defaultTo(studentDetail.dataJson.averageLearningScore, 0),
      avgLearnRank: defaultTo(studentDetail.dataJson.averageLearningRank, 0),
      normal_credits: defaultTo(studentDetail.normal_credits, 0), // พื้นฐาน
      extra_credits: defaultTo(studentDetail.extra_credits, 0), // เพิ่มเติม
      total_credits: defaultTo(studentDetail.total_credits, 0), // รวม
    };
  }),

  getGeneral: createSelector([getStudentDetail], (studentDetail) => {
    if (!studentDetail) return null;
    return defaultTo(studentDetail?.dataJson?.general, []);
  }),

  getGeneralPhorpor6: createSelector([getStudentDetail], (studentDetail) => {
    if (!studentDetail) return null;
    return defaultTo(studentDetail?.dataJson?.general, []).filter((i) =>
      [GeneralType.activities, GeneralType.capacity, GeneralType.attribute].includes(
        i.generalType,
      ),
    );
  }),

  getGeneralPhorpor6Report: createSelector([getStudentDetail], (studentDetail) => {
    if (!studentDetail) return null;
    return defaultTo(studentDetail?.dataJson?.general, []).filter((i) =>
      [GeneralType.time, GeneralType.nutrition].includes(i.generalType),
    );
  }),

  getAllSign: createSelector([getStudentDetail], (studentDetail) => {
    if (!studentDetail) return null;
    return studentTransformFunc.allSign(studentDetail);
  }),

  getAssessmentForPage: createSelector([getStudentDetail], (studentDetail) => {
    if (!studentDetail) return null;
    const generals = defaultTo(studentDetail?.dataJson?.general, []).filter((i) =>
      [GeneralType.time, GeneralType.nutrition].includes(i.generalType),
    );

    const measurement = getWeightHeightMeasurement(generals);
    const assessment = getAssessmentMeasurement(generals);
    const targetGeneral = generals?.find((i) => i.generalType === GeneralType.time);
    const maxAttendance = values(targetGeneral?.maxAttendance);
    const attenanceData =
      targetGeneral?.studentIndicatorData?.map((i, index) => {
        const attendedDays = i.value || 0;
        const maxAttendedDays = maxAttendance[index] || 0;
        const percentage = (attendedDays / maxAttendedDays) * 100;
        return {
          month: dayjs(i.indicatorGeneralName).format('MMMM BBBB'),
          percentage: percentage || '-',
          totalDays: maxAttendedDays || '-',
          notes: '-',
          attendedDays: attendedDays || '-',
        };
      }) || [];
    const data = transformToStudentAssessmentDTO({
      weight_height_measurement: measurement as any,
      nutritional_assessment_by_age: assessment as any,
    });
    const { tableData } = transformToTable(data);

    return {
      tableData,
      attenanceData,
    };
  }),
};

export const studentTransformFunc = {
  allSign: (studentDetail: StudentDetailDto) => {
    return {
      subjectTeacher: defaultTo(studentDetail?.dataJson?.subjectTeacher, ''),
      headOfSubject: defaultTo(studentDetail?.dataJson?.headOfSubject, ''),
      principal: defaultTo(studentDetail?.dataJson?.principal, ''),
      registrar: defaultTo(studentDetail?.dataJson?.registrar, ''),
      signDate: defaultTo(studentDetail?.dataJson?.signDate, ''),
    };
  },

  school: (studentDetail: StudentDetailDto) => {
    if (!studentDetail) return null;

    return {
      name: defaultTo(studentDetail.dataJson.school_name, '-'),
      area: defaultTo(studentDetail.dataJson.school_area, '-'),
    };
  },

  phorpor6InforDto: (studentDetail: StudentDetailDto) => {
    if (!studentDetail) return null;

    const dob = utils.getAgeYearMonth(studentDetail.dataJson.birthDate);
    return {
      academic_year: defaultTo(studentDetail.academicYear, ''),
      year: defaultTo(studentDetail.year, ''),
      firstName: defaultTo(studentDetail.thaiFirstName, ''),
      lastName: defaultTo(studentDetail.thaiLastName, ''),
      dob: DateFormat.thaiDate(studentDetail.dataJson.birthDate),
      age: defaultTo(studentDetail.age_year, '-'),
      ageMonth: defaultTo(studentDetail.age_month, '-'),
      gender: defaultTo(studentDetail.dataJson.gender, '-'),
      ethnicity: defaultTo(studentDetail.dataJson.ethnicity, '-'),
      nationality: defaultTo(studentDetail.dataJson.nationality, '-'),
      religion: defaultTo(studentDetail.dataJson.religion, '-'),
      idNo: defaultTo(studentDetail.studentIdNo, '-'),
      citizenNo: defaultTo(studentDetail.dataJson?.citizenNo, '-'),
      school_Address: defaultTo(studentDetail.school_address, '-'),
      address: StringFormat.Address(
        studentDetail.dataJson.addressNo,
        studentDetail.dataJson.addressMoo,
        studentDetail.dataJson.addressSubDistrict,
        studentDetail.dataJson.addressDistrict,
        studentDetail.dataJson.addressProvince,
        studentDetail.dataJson.addressPostalCode,
      ),
      fatherFullname: StringFormat.Fullname(
        studentDetail.dataJson.fatherTitle,
        studentDetail.dataJson.fatherFirstName,
        studentDetail.dataJson.fatherLastName,
      ),
      fatherJob: defaultTo(studentDetail.dataJson.fatherOccupation, '-'),
      motherFullname: StringFormat.Fullname(
        studentDetail.dataJson.motherTitle,
        studentDetail.dataJson.motherFirstName,
        studentDetail.dataJson.motherLastName,
      ),
      motherJob: defaultTo(studentDetail.dataJson.motherOccupation, '-'),
      parentStatus: defaultTo(studentDetail.dataJson.parentMaritalStatus, '-'),
      guardianFullname: StringFormat.Fullname(
        studentDetail.dataJson.guardianTitle,
        studentDetail.dataJson.guardianFirstName,
        studentDetail.dataJson.guardianLastName,
      ),
      guardianJob: defaultTo(studentDetail.dataJson.guardianOccupation, '-'),
    };
  },

  phorpor6reportDto: (studentDetail: StudentDetailDto) => {
    if (!studentDetail) return null;
    const dob = utils.getAgeYearMonth(studentDetail.dataJson.birthDate);
    return {
      firstName: defaultTo(studentDetail.thaiFirstName, ''),
      lastName: defaultTo(studentDetail.thaiLastName, ''),
      dob: DateFormat.thaiDate(studentDetail.dataJson.birthDate),
      age: defaultTo(studentDetail.age_year, '-'),
      ageMonth: defaultTo(studentDetail.age_month, '-'),
      idNo: defaultTo(studentDetail?.studentIdNo, '-'),
      citizenNo: defaultTo(studentDetail?.dataJson?.citizenNo, '-'),
      grade: defaultTo(studentDetail.year, '-'),
      studentNo: defaultTo(studentDetail?.studentId, '-'),
      academicYear: defaultTo(studentDetail.academicYear, '-'),
      issuedDate: DateFormat.day(studentDetail.dataJson.issueDate),
      issuedMonth: DateFormat.month(studentDetail.dataJson.issueDate),
      issuedYear: DateFormat.year(studentDetail.dataJson.issueDate),
    };
  },
  phorpor6CertificateDto: (studentDetail: StudentDetailDto) => {
    if (!studentDetail) return null;
    return {
      firstName: defaultTo(studentDetail.thaiFirstName, ''),
      lastName: defaultTo(studentDetail.thaiLastName, ''),
      idNo: defaultTo(studentDetail?.studentIdNo, '-'),
      citizenNo: defaultTo(studentDetail?.dataJson?.citizenNo, '-'),
      dob: DateFormat.thaiDate(studentDetail.dataJson.birthDate),
      gender: studentDetail.dataJson.gender,
      nationality: studentDetail.dataJson.nationality,
      religion: studentDetail.dataJson.religion,
      fatherFullname: StringFormat.Fullname(
        studentDetail.dataJson.fatherTitle,
        studentDetail.dataJson.fatherFirstName,
        studentDetail.dataJson.fatherLastName,
      ),
      motherFullname: StringFormat.Fullname(
        studentDetail.dataJson.motherTitle,
        studentDetail.dataJson.motherFirstName,
        studentDetail.dataJson.motherLastName,
      ),
      issuedDate: DateFormat.day(studentDetail.dataJson.issueDate),
      issuedMonth: DateFormat.month(studentDetail.dataJson.issueDate),
      issuedYear: DateFormat.year(studentDetail.dataJson.issueDate),
    };
  },

  phorpor6AssessmentDto: (studentDetail: StudentDetailDto) => {
    if (!studentDetail) return null;

    const generals = defaultTo(studentDetail?.dataJson?.general, []).filter((i) =>
      [GeneralType.time, GeneralType.nutrition].includes(i.generalType),
    );

    const measurement = getWeightHeightMeasurement(generals);
    const assessment = getAssessmentMeasurement(generals);
    const targetGeneral = generals?.find((i) => i.generalType === GeneralType.time);
    const maxAttendance = values(targetGeneral?.maxAttendance);
    const attenanceData =
      targetGeneral?.studentIndicatorData?.map((i, index) => {
        const attendedDays = i.value || 0;
        const maxAttendedDays = maxAttendance[index] || 0;
        const percentage = (attendedDays / maxAttendedDays) * 100;
        return {
          month: dayjs(i.indicatorGeneralName).format('MMMM BBBB'),
          percentage: percentage || '-',
          totalDays: maxAttendedDays || '-',
          notes: '-',
          attendedDays: attendedDays || '-',
        };
      }) || [];
    const data = transformToStudentAssessmentDTO({
      weight_height_measurement: measurement as any,
      nutritional_assessment_by_age: assessment as any,
    });
    const { tableData } = transformToTable(data);
    return {
      data: transformHealthData(tableData),
      attenanceData: transformAttendanceData(attenanceData),
    };
  },
};
