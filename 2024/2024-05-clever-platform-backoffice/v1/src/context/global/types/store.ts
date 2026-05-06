type TStoreClassData = {
  class_id: number;
  academic_year: number;
  year: string;
  class_name: string;
  updated_at: string | null;
  updated_by: string | null;
};

type TStoreAcademicYearRangeData = {
  id: number;
  school_id: number;
  name: string;
  start_date: string;
  end_date: string;
};
type TStoreLessonData = {
  subject_id: number;
  lesson_index: number;
  lesson_id: number;
  name: string;
};

type TEvaluationForm = {
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
};
