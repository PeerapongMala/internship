import { TDocumentTemplate } from '@domain/g06/g06-d07/local/types/template';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { StudentDetailDto } from '../type';

export enum TSubjectType {
  PRIMARY = 'primary',
  EXTRA = 'extra',
}

export type TTemplateProps = {
  templateData: TDocumentTemplate;
  studentDetail: StudentDetailDto | null;

  studentData?: {
    fullname: string;
    idNo: string;
    studentNo: string | number;
    academic_year: string;
    year: string;
    province: string;
  } | null;
  grades?: {
    scorePercentage: number;
    totalScoreRank: number;
    avgLearnScore: number;
    avgLearnRank: number;
    normal_credits: number;
    extra_credits: number;
    total_credits: number;
  } | null;
  gradespr6?: {
    scorePercentage: number;
    totalScoreRank: number;
    avgLearnScore: number;
    avgLearnRank: number;
    normal_credits: number;
    extra_credits: number;
    total_credits: number;
  } | null;
  generals?: {
    evaluationStudentId: number;
    generalName: string;
    generalType: string;
    maxAttendance: {
      [key: string]: number;
    };
    studentIndicatorData: {
      indicatorGeneralName: string;
      indicatorId: number | null;
      value: number;
    }[];
    subjectName: string | null;
    nutrition: {
      date: string;
    }[][];
  }[];
  school?: {
    name: string;
    area: string;
  } | null;
  allsign?: {
    subjectTeacher: string;
    headOfSubject: string;
    principal: string;
    registrar: string;
    signDate: string;
  } | null;
  summary?: {
    hours: number;
    totalScore: number;
    avgScore: number;
    score: number;
    credits: number;
    type?: TSubjectType;
  };
};
