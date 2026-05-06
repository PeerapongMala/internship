import {
  GroupUnlock,
  Level,
  StudentUnlock,
  UnlockedGroup,
  ClassResponse,
  ClassPaginationResponse,
  StudentUnlockResponse,
  StudentResponseLesson,
} from '../../type';

export interface Course {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface LessonResponse {
  lesson_id: number;
  curriculum_group: string;
  curriculum_group_short_name: string;
  subject: string;
  year: string;
  subject_id: string;
  lesson_name: string;
  lesson_index: number;
  is_enabled: boolean;
  student_id: string;
}

export interface LessonPaginationResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: LessonResponse[];
}

export interface SubLessonResponse {
  sub_lesson_id: number;
  curriculum_group: string;
  curriculum_group_short_name: string;
  subject: string;
  year: string;
  lesson_index: number;
  sub_lesson_name: string;
  sub_lesson_index: number;
  is_enabled: boolean;
}

export interface SubLessonPaginationResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: SubLessonResponse[];
}

export interface LevelPaginationResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: Level[];
}

export interface GroupUnlockPaginationResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: GroupUnlock[];
}

export interface UnlockedGroupPaginationResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: UnlockedGroup[];
}

export interface StudentUnlockPaginationResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: StudentUnlock[];
}

export interface AcademicYearPaginationResponse {
  _pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  data: number[];
}

export interface LessonRepository {
  GetCourses(classId: string, isParent?: boolean): Promise<Course[]>;
  GetSubjects(classId: string, isParent?: boolean): Promise<Subject[]>;
  GetLessons(
    classId: string,
    page: number,
    limit: number,
    status?: boolean,
    curriculumGroupId?: string,
    subjectId?: string,
    lesson_id?: string,
    isParent?: boolean,
  ): Promise<LessonPaginationResponse>;
  ToggleStatus(classId: string, lessonId: number, isEnabled: boolean): Promise<void>;
  GetSubLessons(
    classId: string,
    lessonId: number,
    page: number,
    limit: number,
    status?: boolean,
    subLessonId?: string,
  ): Promise<SubLessonPaginationResponse>;
  ToggleSubLessonStatus(
    classId: string,
    subLessonId: number,
    isEnabled: boolean,
  ): Promise<void>;
  GetLevels(
    classId: string,
    subLessonId: number,
    page: number,
    limit: number,
    status?: string,
    level_type?: string,
    question_type?: string,
    difficulty?: string,
  ): Promise<LevelPaginationResponse>;
  GetGroups(
    classId: string,
    subjectId: string,
    page: number,
    limit: number,
    searchField?: string,
    searchValue?: string,
  ): Promise<GroupUnlockPaginationResponse>;
  AssignGroupsToLevel(levelId: number, studyGroupIds: number[]): Promise<void>;
  AssignStudentsToLevel(
    levelId: number,
    studentIds: string[],
    classId: number,
  ): Promise<void>;
  GetUnlockedGroups(
    classId: string,
    levelId: number,
    page: number,
    limit: number,
  ): Promise<UnlockedGroupPaginationResponse>;
  GetStudents(
    classId: string,
    levelId: number,
    page: number,
    limit: number,
  ): Promise<StudentUnlockPaginationResponse>;
  GetStudentsNoUnlock(
    classId: string,
    page: number,
    limit: number,
    searchField: string,
    searchValue: string,
  ): Promise<StudentUnlockResponse>;
  GetAllStudents(
    classId: string,
    page: number,
    limit: number,
    searchField: string,
    searchValue: string,
  ): Promise<StudentUnlockResponse>;
  GetAllStudentsListForLesson(
    classId: string,
    page: number,
    limit: number,
    searchField: string,
    searchValue: string,
  ): Promise<StudentResponseLesson>;
  DeleteUnlockedGroups(levelId: number, studyGroupIds: string[]): Promise<void>;
  DeleteUnlockedStudents(
    classId: string,
    levelId: number,
    studentIds: string[],
  ): Promise<void>;
  GetClasses(
    page: number,
    limit: number,
    academicYear?: string,
    id?: string,
    year?: string,
    name?: string,
    student_id?: string,
  ): Promise<ClassPaginationResponse>;
  GetAcademicYears(page: number, limit: number): Promise<AcademicYearPaginationResponse>;
}
