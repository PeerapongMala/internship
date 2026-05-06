import CWButton from '@component/web/cw-button';
import CWSelect from '@component/web/cw-select';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';
import API from '@domain/g03/g03-d04/local/api';
import API_g03 from '@domain/g03/g03-d04/local/api';
import {
  CreateCommentRequest,
  ParamsTeacherStudent,
} from '@domain/g03/g03-d04/local/api/group/teacher-student/type.ts';
import showMessage from '@global/utils/showMessage';
import { useParams, useRouter } from '@tanstack/react-router';
import React, { useCallback, useEffect, useState } from 'react';

type SelectOption = { label: string; value: string | number };

const AddNote = ({
  setIsAddNotePage,
  userId,
  onSuccess,
}: {
  setIsAddNotePage: (value: boolean) => void;
  userId: string;
  onSuccess: () => void;
}) => {
  const {
    state: {
      location: { pathname },
    },
  } = useRouter();
  const { schoolId, studentId, classId, academicYear } = useParams({ from: '' });
  const isAdminPath = pathname.includes('/admin/school');

  const [filters, setFilters] = useState<Partial<ParamsTeacherStudent>>({});
  const [options, setOptions] = useState<{
    academicYear: SelectOption[];
    seedYear: SelectOption[];
    subject: SelectOption[];
    lesson: SelectOption[];
    subLesson: SelectOption[];
    level: SelectOption[];
  }>({
    academicYear: [],
    seedYear: [],
    subject: [],
    lesson: [],
    subLesson: [],
    level: [],
  });

  const [loading, setLoading] = useState({
    subject: false,
    lesson: false,
    subLesson: false,
    level: false,
  });

  // Fetch initial options
  const fetchInitialOptions = useCallback(async () => {
    if (!studentId || !academicYear) return;

    try {
      const userOrStudentId = isAdminPath ? userId : studentId;

      const [academicYearRes, seedYearRes] = await Promise.all([
        API.teacherStudent.GetCommentOption(userOrStudentId, 'academic-year', {}),
        API.teacherStudent.GetCommentOption(userOrStudentId, 'seed-year', {}),
      ]);

      const mapOptions = (response: any) =>
        response?.status_code === 200
          ? response.data.values.map((v: any) => ({ label: v.label, value: v.id }))
          : [];

      setOptions((prev) => ({
        ...prev,
        academicYear: mapOptions(academicYearRes),
        seedYear: mapOptions(seedYearRes),
      }));

      if (academicYear) {
        setFilters((prev) => ({
          ...prev,
          academic_year: academicYear,
        }));
      }
    } catch (error) {
      console.error('Error fetching initial options:', error);
    }
  }, [studentId, academicYear, userId, isAdminPath]);

  // Fetch dependent options
  const fetchDependentOptions = useCallback(
    async (type: 'subject' | 'lesson' | 'subLesson' | 'level') => {
      const currentFilters = filters;
      if (!studentId) return;

      try {
        setLoading((prev) => ({ ...prev, [type]: true }));
        const userOrStudentId = isAdminPath ? userId : studentId;

        let params = {};
        let endpoint = '';

        switch (type) {
          case 'subject':
            endpoint = 'subject';
            params = { seed_year_id: currentFilters.seed_year };
            console.log('Fetching subject with params:', params);
            if (!currentFilters.seed_year) return;
            break;
          case 'lesson':
            endpoint = 'lesson';
            params = {
              seed_year_id: currentFilters.seed_year,
              subject_id: currentFilters.subject_id,
            };
            console.log('Fetching lesson with params:', params);
            if (!currentFilters.subject_id) return;
            break;
          case 'subLesson':
            endpoint = 'sub-lesson';
            params = { lesson_id: currentFilters.lesson_id };
            if (!currentFilters.lesson_id) return;
            break;
          case 'level':
            endpoint = 'level';
            params = {
              seed_year_id: currentFilters.seed_year,
              subject_id: currentFilters.subject_id,
              lesson_id: currentFilters.lesson_id,
              sub_lesson_id: currentFilters.sub_lesson_id,
            };
            if (
              !(
                currentFilters.seed_year &&
                currentFilters.subject_id &&
                currentFilters.lesson_id &&
                currentFilters.sub_lesson_id
              )
            )
              return;
            break;
        }

        const res = await API.teacherStudent.GetCommentOption(
          userOrStudentId,
          endpoint,
          params,
        );

        const mapOptions = (response: any) => {
          if (!response?.data?.values) return [];
          return response.data.values.map((v: any) => ({
            label: v.label,
            value: v.id,
          }));
        };

        setOptions((prev) => ({
          ...prev,
          [type]: mapOptions(res),
        }));

        if (type === 'subject') {
          setOptions((prev) => ({
            ...prev,
            lesson: [],
            subLesson: [],
            level: [],
          }));
        } else if (type === 'lesson') {
          setOptions((prev) => ({
            ...prev,
            subLesson: [],
            level: [],
          }));
        } else if (type === 'subLesson') {
          setOptions((prev) => ({
            ...prev,
            level: [],
          }));
        }
      } catch (error) {
        console.error(`Error fetching ${type} options:`, error);
      } finally {
        setLoading((prev) => ({ ...prev, [type]: false }));
      }
    },
    [studentId, userId, isAdminPath, filters],
  );

  // Fetch subject options when seed year changes
  useEffect(() => {
    if (filters.seed_year) {
      fetchDependentOptions('subject');
    }
  }, [filters.seed_year]);

  useEffect(() => {
    fetchInitialOptions();
  }, [fetchInitialOptions]);

  // Handle dropdown changes
  const handleSeedYearChange = (e: any) => {
    const value = e.target.value;
    console.log('Setting seed_year to:', value);
    setFilters({
      ...filters,
      seed_year: value,
      subject_id: undefined,
      lesson_id: undefined,
      sub_lesson_id: undefined,
      level_id: undefined,
    });
  };

  const handleSubjectChange = (e: any) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      subject_id: value,
      lesson_id: undefined,
      sub_lesson_id: undefined,
      level_id: undefined,
    });
  };

  const handleLessonChange = (e: any) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      lesson_id: value,
      sub_lesson_id: undefined,
      level_id: undefined,
    });
  };

  const handleSubLessonChange = (e: any) => {
    const value = e.target.value;
    setFilters({ ...filters, sub_lesson_id: value, level_id: undefined });
  };

  // Fetch dependent options when their parent values change
  useEffect(() => {
    if (filters.subject_id && filters.seed_year) {
      fetchDependentOptions('lesson');
    } else {
      console.log('Missing required filters for lesson');
    }
  }, [filters.subject_id, filters.seed_year]);

  useEffect(() => {
    if (filters.lesson_id) {
      fetchDependentOptions('subLesson');
    }
  }, [filters.lesson_id]);

  useEffect(() => {
    if (filters.sub_lesson_id) {
      fetchDependentOptions('level');
    }
  }, [filters.sub_lesson_id]);

  const handleSubmit = async () => {
    if (filters.level_id && filters.text && filters.academic_year) {
      try {
        const body: CreateCommentRequest = {
          student_id: studentId,
          level_id: Number(filters.level_id),
          text: filters.text,
          academic_year: Number(filters.academic_year),
        };
        const res = await API_g03.teacherStudent.CreateComment(body);

        if (res.status_code === 200) {
          onSuccess();
          setIsAddNotePage(false);
          showMessage('เพิ่มโน้ตสำเร็จ', 'success');
        } else {
          console.error('Failed to create new comment:', res);
        }
      } catch (error) {
        console.error('Error while creating comment:', error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-5">
        <div className="cursor-pointer p-2" onClick={() => setIsAddNotePage(false)}>
          <IconArrowBackward />
        </div>
        <span className="text-xl font-bold">เพิ่มบันทึกครู</span>
      </div>

      <div className="flex items-start gap-5">
        <div className="panel flex-[3]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <CWSelect
              label="ปีการศึกษา"
              required
              options={options.academicYear}
              value={filters.academic_year}
              onChange={(e: any) =>
                setFilters({ ...filters, academic_year: e.target.value })
              }
              className="flex-1"
            />

            <CWSelect
              label="ชั้นปี"
              required
              options={options.seedYear}
              value={filters.seed_year}
              onChange={handleSeedYearChange}
              className="flex-1"
            />

            <CWSelect
              label="วิชา"
              required
              options={options.subject}
              value={filters.subject_id}
              onChange={handleSubjectChange}
              className="flex-1"
              disabled={!filters.seed_year || loading.subject}
            />

            <CWSelect
              label="บทที่"
              required
              options={options.lesson}
              value={filters.lesson_id}
              onChange={handleLessonChange}
              className="flex-1"
              disabled={!filters.subject_id || loading.lesson}
            />

            <CWSelect
              label="บทเรียนย่อยที่"
              required
              options={options.subLesson}
              value={filters.sub_lesson_id}
              onChange={handleSubLessonChange}
              className="flex-1"
              disabled={!filters.lesson_id || loading.subLesson}
            />

            <CWSelect
              label="ด่านที่"
              required
              options={options.level}
              value={filters.level_id}
              onChange={(e: any) => setFilters({ ...filters, level_id: e.target.value })}
              className="flex-1"
              disabled={!filters.sub_lesson_id || loading.level}
            />
          </div>

          <div className="mt-5">
            <span className="text-red-500">*</span> โน๊ต:
            <textarea
              className="form-textarea mt-1.5 max-h-[350px] min-h-[100px] w-full rounded-md border border-gray-300 p-2"
              placeholder="กรอกข้อความที่นี่"
              value={filters.text}
              onChange={(e) => setFilters({ ...filters, text: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="panel flex-1 sm:max-w-lg">
          <div className="gap-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label>แก้ไขล่าสุด:</label>
              <p>-</p>
              <label>แก้ไขล่าสุดโดย:</label>
              <p>-</p>
            </div>
            <CWButton
              title="บันทึก"
              onClick={handleSubmit}
              className="mt-4 w-full"
              disabled={!(filters.level_id && filters.text && filters.academic_year)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNote;
