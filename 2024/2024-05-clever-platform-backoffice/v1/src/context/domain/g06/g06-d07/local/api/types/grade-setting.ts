import { TPaginationReq } from '@global/types/api';
import { TStudent, TStudentFilter } from '../../types/students';
import { TTemplateFilter } from '../../types/template';

export type TPostGradeSettingStudentInfoUploadReq = {
  csv_file: File;
  academic_year: number;
};

export type TGetGradeSettingStudentInfoDownloadReq = {
  school_id: number;
  academic_year?: number;
  year?: string;
  school_room?: number;
};
// student
export type TGetListGradeSettingStudentInfoReq = TPaginationReq &
  TStudentFilter & { school_id: string };
// template
export type TGetListGradeSettingTemplateInfoReq = TPaginationReq &
  TTemplateFilter & { school_id: string };

export type TPostGradeSettingStudentInfoReq = Partial<Omit<TStudent, 'id' | 'form_id'>>;

export type TGetListGradeSettingStudentAddressReq = TPaginationReq &
  TStudentFilter & {
    school_id: string;
    student_id?: number;
  };
