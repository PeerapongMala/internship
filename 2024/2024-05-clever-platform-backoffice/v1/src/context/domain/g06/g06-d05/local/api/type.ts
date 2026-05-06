import { TAdditionalFieldNutrition } from '@domain/g06/local/types/template';
import { ApiResponseDataJson } from '../../g06-d05-p09-learning-outcomes/component/web/template/TablePage2/type';

export interface Course {
  id: string;
  course_id: string;
  name: string;
  time: string;
  subject_area: string;
  teacher_name: string;
}

export interface ClassTime {
  month: number;
  year: number;
  total_days: number;
  students: {
    name: string;
    no: string;
    attendance_summary: {
      present: number;
      absent: number;
      leave: number;
    };
    attendance_records: {
      day: number;
      status: 'present' | 'absent' | 'leave' | '';
    }[];
  }[];
}

export interface FatherMother {
  id: string;
  student_name: string;
  no: string;
  father: {
    name: string;
    profession: string;
  };
  mother: {
    name: string;
    profession: string;
  };
}

export interface Phorpor5Class {
  academicYear: number; // ปีการศึกษา
  subjectName: string; // รายวิชา
  subjectCode: string; // รหัสวิชา
  attendanceHours: number; // มาเรียน (ชั่วโมง / ปี)
  learningGroup: string; // กลุ่มสาระการเรียนรู้
  subjectTeacher: {
    // ครูประจำวิชา
    name: string; // ชื่อ
    position: string; // ตำแหน่ง
  };
  classTeacher: {
    // ครูประจำชั้น
    name: string; // ชื่อ
    position: string; // ตำแหน่ง
  };
  studentsAtStart: {
    // นักเรียนต้นปีการศึกษา
    male: number; // ชาย (จำนวน)
    female: number; // หญิง (จำนวน)
  };
  studentsLeftDuringYear: {
    // ออกระหว่างปีการศึกษา
    male: number; // ชาย (จำนวน)
    female: number; // หญิง (จำนวน)
  };
  studentsJoinedDuringYear: {
    // เข้าระหว่างปีการศึกษา
    male: number; // ชาย (จำนวน)
    female: number; // หญิง (จำนวน)
  };
  studentsAtEnd: {
    // รวมสิ้นปีการศึกษา
    male: number; // ชาย (จำนวน)
    female: number; // หญิง (จำนวน)
  };
  achievementSummaries: {
    // สรุปผลสัมฤทธิ์ทางการเรียนรู้ (array)
    subjectCode: string; // รหัสวิชา
    subjectName: string; // รายวิชา
    ms: number; // มส
    r: number; // ร
    zero: number; // 0
    one: number; // 1
    onePointFive: number; // 1.5
    two: number; // 2
    three: number; // 3
    four: number; // 4
  }[];
  evaluationSummary: {
    // สรุปการประเมิน
    desirableQualities: {
      // คุณลักษณะอันพึงประสงค์
      notPass: number; // ไม่ผ่าน
      pass: number; // ผ่าน
      good: number; // ดี
      excellent: number; // เยี่ยม
    };
    literacyThinkingWriting: {
      // อ่าน คิด วิเคราะห์ และ เขียน
      notPass: number; // ไม่ผ่าน
      pass: number; // ผ่าน
      good: number; // ดี
      excellent: number; // เยี่ยม
    };
    coreCompetencies: {
      // สมรรถนะสำคัญของผู้เรียน
      notPass: number; // ไม่ผ่าน
      pass: number; // ผ่าน
      good: number; // ดี
      excellent: number; // เยี่ยม
    };
  };
}

export interface Phorpor5Course {
  academicYear: number; // ปีการศึกษา
  subjectName: string; // รายวิชา
  subjectCode: string; // รหัสวิชา
  attendanceHours: number; // มาเรียน (ชั่วโมง / ปี)
  learningGroup: string; // กลุ่มสาระการเรียนรู้
  subjectTeacher: {
    // ครูประจำวิชา
    name: string; // ชื่อ
    position: string; // ตำแหน่ง
  };
  classTeacher: {
    // ครูประจำชั้น
    name: string; // ชื่อ
    position: string; // ตำแหน่ง
  };
  studentsAtStart: {
    // นักเรียนต้นปีการศึกษา
    male: number; // ชาย (จำนวน)
    female: number; // หญิง (จำนวน)
  };
  studentsLeftDuringYear: {
    // ออกระหว่างปีการศึกษา
    male: number; // ชาย (จำนวน)
    female: number; // หญิง (จำนวน)
  };
  studentsJoinedDuringYear: {
    // เข้าระหว่างปีการศึกษา
    male: number; // ชาย (จำนวน)
    female: number; // หญิง (จำนวน)
  };
  studentsAtEnd: {
    // รวมสิ้นปีการศึกษา
    male: number; // ชาย (จำนวน)
    female: number; // หญิง (จำนวน)
  };
  achievementSummaries: {
    // สรุปผลสัมฤทธิ์ทางการเรียนรู้ (array)
    subjectCode: string; // รหัสวิชา
    subjectName: string; // รายวิชา
    ms: number; // มส
    r: number; // ร
    zero: number; // 0
    one: number; // 1
    onePointFive: number; // 1.5
    two: number; // 2
    three: number; // 3
    four: number; // 4
  }[];
  evaluationSummary: {
    // สรุปการประเมิน
    desirableQualities: {
      // คุณลักษณะอันพึงประสงค์
      notPass: number; // ไม่ผ่าน
      pass: number; // ผ่าน
      good: number; // ดี
      excellent: number; // เยี่ยม
    };
    literacyThinkingWriting: {
      // อ่าน คิด วิเคราะห์ และ เขียน
      notPass: number; // ไม่ผ่าน
      pass: number; // ผ่าน
      good: number; // ดี
      excellent: number; // เยี่ยม
    };
    coreCompetencies: {
      // สมรรถนะสำคัญของผู้เรียน
      notPass: number; // ไม่ผ่าน
      pass: number; // ผ่าน
      good: number; // ดี
      excellent: number; // เยี่ยม
    };
  };
}

interface DataJson {
  school_name: string;
  school_area: string;
  academic_year: string;
  year: string;
  subject: Subject[];
  student_status: StudentStatus;
  approval: Approval;
}

export interface Parent {
  id: string;
  student_name: string;
  no: string;
  parent: {
    name: string;
    profession: string;
    relationship: string;
    address: string;
  };
}

export interface Student {
  id: string;
  student_name: string;
  no: string;
  student_number: string;
  id_card: string;
  birthdate: string;
}

// ! New Version

export interface StudentBasicInfo {
  id: number;
  no: number;
  student_id: string;
  title: string;
  first_name: string;
  last_name: string;
}

// For "รายวิชา" endpoint
export interface Subject {
  subjectName: string | undefined;
  subject_code: string;
  id: number;
  code: string;
  subject_name?: string; // Only in some responses
  name?: string; // Alternative to subject_name in other responses
  hours: number;
  total_score?: number;
  learning_group: string;
  general_type?: string | null;
  general_name?: string | null;
  SchoolName?: string;
  SchoolArea?: string;
  teacher: string[];
  teacher_advisor: string | null;
  scores?: Record<string, number>;
  is_subject?: boolean;
}

export interface SubjectData {
  academic_year: string;
  year: string;
  subjects: Subject[];
}

// For "ปก ปพ.5 รายชั้น" endpoint
export interface StudentStatus {
  start_total: number;
  start_male: number;
  start_female: number;
  end_total: number;
  end_male: number;
  end_female: number;
  transfer_in_total: number;
  transfer_in_male: number;
  transfer_in_female: number;
  transfer_out_total: number;
  transfer_out_male: number;
  transfer_out_female: number;
}

export interface Approval {
  subject_teacher: string;
  head_of_subject: string;
  deputy_director: string;
  principal: string;
  approved: boolean;
  date: string;
}

export interface CoverPageData {
  school_name: string;
  school_area: string;
  academic_year: string;
  year: string;
  subject: Subject[];
  student_status: StudentStatus;
  approval: Approval;
}

// For "ชื่อนักเรียน" endpoint
export interface StudentInfo extends StudentBasicInfo {
  citizen_no: string;
  birth_date: string;
}

// For "บิดา-มารดา" endpoint
export interface ParentInfo {
  id: number;
  no: number;
  student_id: string;
  title: string;
  first_name: string;
  last_name: string;
  number: string;
  father_title: string;
  father_first_name: string;
  father_last_name: string;
  father_occupation: string;
  mother_title: string;
  mother_first_name: string;
  mother_last_name: string;
  mother_occupation: string;
}

// For "ผู้ปกครอง" endpoint
export interface GuardianInfo {
  id: number;
  no: number;
  student_id: string;
  title: string;
  first_name: string;
  last_name: string;
  number: string;
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
}

// For "ภาวะโภชนาการ" endpoint
export interface NutritionIndicator {
  indicator_id: null;
  indicator_general_name: string;
  value: number;
}

export interface NutritionAdditionalFields {
  eng_first_name: string | null;
  eng_last_name: string | null;
  id: number;
  student_id: string;
  thai_first_name: string;
  thai_last_name: string;
  title: string;
}

export interface NutritionDataItem {
  evaluation_student_id: number;
  student_indicator_data: NutritionIndicator[];
  additional_fields: NutritionAdditionalFields;
}

export interface NutritionResponse {
  data_json: NutritionDataItem[];
  student_list: {
    id: number;
    no: number;
    title: string;
    thai_first_name: string;
    thai_last_name: string;
  }[];
}

// For "ผลสัมฤทธิ์ทางการเรียน" endpoint
export interface AchievementData {
  school_name: string;
  school_area: string;
  academic_year: string;
  year: string;
  subject: Subject[];
}

export type FormData =
  | SubjectData
  | CoverPageData
  | StudentInfo[]
  | ParentInfo[]
  | GuardianInfo[]
  | NutritionResponse
  | AchievementData
  | ApiResponseDataJson;
export interface AdditionalData {
  hours?: number;
  end_date?: string;
  start_date?: string;
  nutrition?: TAdditionalFieldNutrition[];
}
// Main form interface
export interface IGetPhorpor5Detail {
  year: any;
  academic_year: any;
  title: string;
  first_name: string;
  last_name: string;
  id: number;
  form_id: number;
  order: number;
  name: string;
  data_json: FormData;
  created_at: string;
  student_list?: Array<{
    id: number;
    no: number;
    title: string;
    thai_first_name: string;
    thai_last_name: string;
  }>;
  additional_data?: AdditionalData;
}
export interface IGetPhorpor5List {
  id: number;
  form_id: number;
  order: number;
  name: string;
  created_at: string;
}

export interface IUpdatePhorpor5Request {
  id: number;
  data_json: {
    academic_year: string;
    year: string;
    subjects: {
      id: number;
      code: string;
      subject_name: string;
      hours_per_year: string;
      total_score: number;
      learning_group: string;
      general_type: null | string;
      general_name: null | string;
      SchoolName: string;
      SchoolArea: string;
      teacher: null | string;
      teacher_advisor: null | string;
    }[];
  };
}

export interface GetEvaluationForm {
  id: number;
  school_id: number;
  template_id: number;
  academic_year: string;
  year: string;
  school_room: string;
  student_count: number;
  school_term: string | null;
  is_lock: boolean;
  status: 'reported' | 'draft' | 'submitted' | 'approved';
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  is_archived: boolean;
  wizard_index: number;
}
