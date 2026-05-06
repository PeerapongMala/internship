import {
  LessonRepository,
  Course,
  Subject,
  LessonPaginationResponse,
  SubLessonPaginationResponse,
  LevelPaginationResponse,
  GroupUnlockPaginationResponse,
  UnlockedGroupPaginationResponse,
  StudentUnlockPaginationResponse,
  AcademicYearPaginationResponse,
} from '../../repository/lesson';
import { ClassPaginationResponse, StudentUnlockResponse } from '../../../type';
import fetchWithAuth from '@global/utils/fetchWithAuth';
import { boolean } from 'yup';

const backendUrl = import.meta.env.VITE_API_BASE_URL;

const LessonRestAPI: LessonRepository = {
  GetCourses: async function (classId: string): Promise<Course[]> {
    const url = `${backendUrl}/teacher-lesson/v1/classes/${classId}/curriculum-groups`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    const data = await response.json();
    return data.data.map((course: any) => ({
      id: course.id,
      name: course.name,
    }));
  },

  GetSubjects: async function (classId: string): Promise<Subject[]> {
    const url = `${backendUrl}/teacher-lesson/v1/classes/${classId}/subjects`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch subjects');
    }
    const data = await response.json();
    return data.data.map((subject: any) => ({
      id: subject.id,
      name: subject.name,
    }));
  },

  GetLessons: async function (
    classId: string,
    page: number,
    limit: number,
    status?: boolean,
    curriculumGroupId?: string,
    subjectId?: string,
    lesson_id?: string,
    is_parent?: boolean,
    is_extra?: boolean,
  ): Promise<LessonPaginationResponse> {
    let url = `${backendUrl}/teacher-lesson/v1/classes/${classId}/lessons?page=${page}&limit=${limit}`;

    if (status !== undefined) {
      url += `&is_enabled=${status}`;
    }
    if (curriculumGroupId) {
      url += `&curriculum_group_id=${curriculumGroupId}`;
    }
    if (subjectId) {
      url += `&subject_id=${subjectId}`;
    }
    if (lesson_id) {
      url += `&lesson_id=${lesson_id}`;
    }
    if (is_parent) {
      url += `&is_parent=${is_parent}`;
    }
    if (typeof is_extra !== 'undefined') {
      url += `&is_extra=${is_extra}`;
    }

    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch lessons');
    }
    return response.json();
  },

  ToggleStatus: async function (
    classId: string,
    lessonId: number,
    isEnabled: boolean,
  ): Promise<void> {
    const url = `${backendUrl}/teacher-lesson/v1/classes/${classId}/lessons/${lessonId}`;
    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_enabled: isEnabled }),
    });

    if (!response.ok) {
      throw new Error('Failed to update lesson status');
    }
  },
  ToggleLevel: async function (
    classId: string,
    lessonId: number,
    isEnabled: boolean,
  ): Promise<void> {
    const url = `${backendUrl}/teacher-lesson/v1/classes/${classId}/subLessons/${lessonId}/level-lock`;
    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_enabled: isEnabled }),
    });

    if (!response.ok) {
      throw new Error('Failed to update lesson status');
    }
  },

  GetSubLessons: async function (
    classId: string,
    lessonId: number,
    page: number,
    limit: number,
    status?: boolean,
    subLessonId?: string,
  ): Promise<SubLessonPaginationResponse> {
    let url = `${backendUrl}/teacher-lesson/v1/classes/${classId}/sub-lessons?page=${page}&limit=${limit}&lesson_id=${lessonId}`;

    if (status !== undefined) {
      url += `&is_enabled=${status}`;
    }

    if (subLessonId) {
      url += `&sub_lesson_id=${subLessonId}`;
    }

    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch sub-lessons');
    }
    return response.json();
  },

  ToggleSubLessonStatus: async function (
    classId: string,
    subLessonId: number,
    isEnabled: boolean,
  ): Promise<void> {
    const url = `${backendUrl}/teacher-lesson/v1/classes/${classId}/sub-lessons/${subLessonId}`;
    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_enabled: isEnabled }),
    });

    if (!response.ok) {
      throw new Error('Failed to update sub-lesson status');
    }
  },

  GetLevels: async function (
    classId: string,
    subLessonId: number,
    page: number,
    limit: number,
    status?: string,
    level_type?: string,
    question_type?: string,
    difficulty?: string,
  ): Promise<LevelPaginationResponse> {
    let url = `${backendUrl}/teacher-lesson/v1/classes/${classId}/sub-lessons/${subLessonId}/levels?page=${page}&limit=${limit}`;

    if (status) {
      url += `&status=${status}`;
    }
    if (level_type) {
      url += `&level_type=${level_type}`;
    }
    if (question_type) {
      url += `&question_type=${question_type}`;
    }
    if (difficulty) {
      url += `&difficulty=${difficulty}`;
    }

    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch levels');
    }
    return response.json();
  },

  GetGroups: async function (
    classId: string,
    subjectId: string,
    page: number,
    limit: number,
    searchField?: string,
    searchValue?: string,
  ): Promise<GroupUnlockPaginationResponse> {
    let url = `${backendUrl}/teacher-lesson/v1/classes/${classId}/subjects/${subjectId}/study-groups?page=${page}&limit=${limit}`;
    if (searchField && searchValue) {
      url += `&${searchField}=${searchValue}`;
    }

    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch groups');
    }
    return response.json();
  },

  AssignGroupsToLevel: async function (
    levelId: number,
    studyGroupIds: number[],
  ): Promise<void> {
    const url = `${backendUrl}/teacher-lesson/v1/levels/${levelId}/study-groups`;
    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ study_group_ids: studyGroupIds }),
    });

    if (!response.ok) {
      throw new Error('Failed to assign groups to level');
    }
  },

  AssignStudentsToLevel: async function (
    levelId: number,
    studentIds: string[],
    classId: number,
  ): Promise<void> {
    const url = `${backendUrl}/teacher-lesson/v1/levels/${levelId}/students`;
    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_ids: studentIds,
        level_id: levelId,
        class_id: classId,
      }),
    });
  },

  GetUnlockedGroups: async function (
    classId: string,
    levelId: number,
    page: number,
    limit: number,
  ): Promise<UnlockedGroupPaginationResponse> {
    const url = `${backendUrl}/teacher-lesson/v1/classes/${classId}/levels/${levelId}/unlocked-study-groups?page=${page}&limit=${limit}`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch unlocked groups');
    }
    return response.json();
  },

  GetStudents: async function (
    classId: string,
    levelId: number,
    page: number,
    limit: number,
  ): Promise<StudentUnlockPaginationResponse> {
    const url = `${backendUrl}/teacher-lesson/v1/classes/${classId}/levels/${levelId}/unlocked-students?page=${page}&limit=${limit}`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return response.json();
  },
  GetStudentsNoUnlock: async function (
    classId: string,
    page: number,
    limit: number,
    searchField: string,
    searchValue: string,
  ): Promise<StudentUnlockResponse> {
    let url = `${backendUrl}/teacher-lesson/v1/classes/${classId}/students?page=${page}&limit=${limit}`;
    if (searchField && searchValue) {
      url += `&${searchField}=${searchValue}`;
    }
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return response.json();
  },

  DeleteUnlockedGroups: async function (
    levelId: number,
    studyGroupIds: string[],
  ): Promise<void> {
    const url = `${backendUrl}/teacher-lesson/v1/levels/${levelId}/study-groups/bulk-edit`;
    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        study_group_ids: studyGroupIds,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete unlocked groups');
    }
  },
  DeleteUnlockedStudents: async function (
    classId: string,
    levelId: number,
    studentIds: string[],
  ): Promise<void> {
    const url = `${backendUrl}/teacher-lesson/v1/classes/${classId}/levels/${levelId}/students/bulk-edit`;
    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_ids: studentIds,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete unlocked groups');
    }
  },

  GetClasses: async function (
    page: number,
    limit: number,
    academicYear?: string,
    id?: string,
    year?: string,
    name?: string,
    student_id?: string,
  ): Promise<ClassPaginationResponse> {
    let url = `${backendUrl}/teacher-lesson/v1/classes?page=${page}&limit=${limit}`;

    if (academicYear) {
      url += `&academic_year=${academicYear}`;
    }
    if (id) {
      url += `&id=${id}`;
    }
    if (year) {
      url += `&year=${year}`;
    }
    if (name) {
      url += `&name=${name}`;
    }
    if (student_id) {
      url += `&student_id=${name}`;
    }

    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch classes');
    }
    return response.json();
  },

  GetAcademicYears: async function (
    page: number,
    limit: number,
  ): Promise<AcademicYearPaginationResponse> {
    const url = `${backendUrl}/teacher-lesson/v1/seed-academic-years?page=${page}&limit=${limit}`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error('Failed to fetch academic years');
    }
    return response.json();
  },
};

export default LessonRestAPI;
