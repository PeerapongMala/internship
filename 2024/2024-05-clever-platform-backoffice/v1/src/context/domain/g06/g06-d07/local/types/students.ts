export type TStudentFilter = {
  search_text?: string;
  academic_year?: number;
  year?: string;
  school_room?: number;
  form_id?: number;
};

export type TStudent = {
  id: number;
  form_id: number;
  citizen_no: string;
  student_id: string;
  gender: string | null;
  title: string | null;
  thai_first_name: string;
  thai_last_name: string;
  birth_date: string | null;
  ethnicity: string | null;
  nationality: string | null;
  religion: string | null;
  parent_marital_status: string | null;
  father_title: string | null;
  father_first_name: string | null;
  father_last_name: string | null;
  mother_title: string | null;
  mother_first_name: string | null;
  mother_last_name: string | null;
  guardian_relation: string | null;
  guardian_title: string | null;
  guardian_first_name: string | null;
  guardian_last_name: string | null;
  address_no: string | null;
  address_moo: string | null;
  address_sub_district: string | null;
  address_district: string | null;
  address_province: string | null;
  address_postal_code: string | null;
  academic_year: string;
  year: string;
  school_room: string;
  school_term: string | null;
  school_code: string;
  school_name: string;
  master_student_id: number | null;
  master_student_title: string | null;
  master_student_first_name: string | null;
  master_student_last_name: string | null;
  match_in_master_data: boolean;
};

export type TStudentAdditionalInfo = Pick<
  TStudent,
  | 'id'
  | 'form_id'
  | 'citizen_no'
  | 'student_id'
  | 'gender'
  | 'title'
  | 'thai_first_name'
  | 'thai_last_name'
  | 'address_no'
  | 'address_moo'
  | 'address_sub_district'
  | 'address_district'
  | 'address_province'
  | 'address_postal_code'
>;

export type THandleTableStudentList = {
  fetchStudents: () => void;
};
