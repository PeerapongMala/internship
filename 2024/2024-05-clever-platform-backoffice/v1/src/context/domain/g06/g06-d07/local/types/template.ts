export type TTemplateFilter = {
  name?: string;
  format_id?: number;
  id?: string; // id template
  is_default?: boolean;
};

export type ColorSettings = {
  [key: string]: string;
};
export interface TDocumentTemplate {
  id: number;
  school_id: number;
  format_id: string | undefined;
  name: string;
  logo_image: File | string | null;
  background_image: File | string | null;
  colour_setting: ColorSettings;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_default: boolean;
  delete_logo_image?: boolean;
  delete_background_image?: boolean;
}
export type THandleTableTemplateList = {
  fetchTemplate: () => void;
};
export enum score_type {
  standard = 'พื้นฐาน',
  extra = 'เพิ่มเติม',
  activitie = 'กิจกรรม',
}
export type TTemplateProps = {
  templateData: TDocumentTemplate;
  studentData?: {
    id: string;
    name: string;
    number: string;
    province: string;
  };
  scores?: Array<{
    subject_code?: string; //รหัสวิชา
    subject: string; // รายวิชา
    weight: number;
    semester1: number;
    semester2: number;
    total: number;
    grade: number | string;
    study_time?: number; // เวลาเรียน
    study_average?: string; // คะแนนเต็ม
    study_total?: string; // เฉลี่ยในชั้นเรียน
    academic_results?: number; // คะแนนที่ได้
    type?: string;
    normal_score?: string; // คะแนนปกติ
    exam_score?: string; // คะแนนสอบ
    retest_score?: string; // คะแนนแก้ตัว
    attribute?: string; // คุณลักษณะ
    read_things?: string; // อ่านคิดวิเคราะห์เขียน
  }>;
  summary?: {
    basicCredits: number;
    additionalCredits: number;
    totalCredits: number;
    gpa: string;
    evaluations: {
      socialMental: string;
      workEthics: string;
      skillDevelopment: string;
    };
    percentage?: string; // คะแนนคิดเป็นร้อยละ
    percentage_no?: string; // คะแนนรวมได้ลำดับที่
    development_assessment?: {
      guide?: string; // แนะแนว
      boy_girl_scout?: string; // ลูกเสือ-เนตรนารี
      gather?: string; // ชุมนุม
      activities: string; // กิจกรรม
    };
  };
  signatures?: {
    homeroom: { name: string; position: string };
    head: { name: string; position: string };
    project: { name: string; position: string };
    director: { name: string; position: string };
  };
};
