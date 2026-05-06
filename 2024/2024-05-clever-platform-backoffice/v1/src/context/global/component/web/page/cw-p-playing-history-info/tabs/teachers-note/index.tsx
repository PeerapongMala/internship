import CWAvatar from '@component/web/atom/cw-a-avatar';
import CWButton from '@component/web/cw-button';
import CWInputSearch from '@component/web/cw-input-search';
import CWModalDelete from '@component/web/cw-modal/cw-modal-delete';
import CWSelect from '@component/web/cw-select';
import CWWhiteBox from '@component/web/cw-white-box';
import CWMDaterange from '@component/web/molecule/cw-m-date-range';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import IconPlus from '@core/design-system/library/component/icon/IconPlus.tsx';
import IconTrash from '@core/design-system/library/component/icon/IconTrash.tsx';
import API_g01 from '@domain/g01/g01-d04/local/api';
import { OptionInterface, TeacherNoteResponse } from '@domain/g01/g01-d04/local/type.ts';
import API_g03 from '@domain/g03/g03-d04/local/api';
import { ParamsTeacherStudent } from '@domain/g03/g03-d04/local/api/group/teacher-student/type.ts';
import { toDateTimeTH } from '@global/utils/date.ts';
import showMessage from '@global/utils/showMessage';
import { useParams, useRouter } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';

const TeachersNote = ({
  userId,
  setIsAddNotePage,
  setIsEditNotePage,
  setNoteUpdateData,
  refreshTrigger,
}: {
  userId: string;
  setIsAddNotePage: (value: boolean) => void;
  setIsEditNotePage: (value: boolean) => void;
  setNoteUpdateData: (value: TeacherNoteResponse) => void;
  refreshTrigger: number;
}) => {
  const router = useRouter();
  const isTeacherPath = router.state.location.pathname.includes('/teacher/student');
  const isAdminPath = router.state.location.pathname.includes('/admin/school');
  const { schoolId, studentId, classId, academicYear } = useParams({ from: '' });

  const [data, setData] = useState<TeacherNoteResponse[]>([]);
  const [curriculumGroups, setCurriculumGroups] = useState<OptionInterface[]>([]);
  const [classYears, setClassYears] = useState<OptionInterface[]>([]);
  const [subjects, setSubjects] = useState<OptionInterface[]>([]);
  const [lessons, setLessons] = useState<OptionInterface[]>([]);
  const [subLessons, setSubLessons] = useState<OptionInterface[]>([]);

  const [filters, setFilters] = useState<Partial<ParamsTeacherStudent>>({});

  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);

  const [modalDelete, setModalDelete] = useState<boolean>(false);

  const fetchDataForAdmin = async () => {
    const responses = await Promise.all([
      API_g01.schoolStudent.PlayLog.GetCurriculumGroups(studentId),
      API_g01.schoolStudent.PlayLog.getSubjects(studentId),
      API_g01.schoolStudent.PlayLog.getLessons(studentId),
      API_g01.schoolStudent.PlayLog.GetSubLesson(studentId),
    ]);

    const [curriculum, subjectsData, lessonsData, subLessonsData] = responses;

    if (curriculum.status_code === 200) setCurriculumGroups(curriculum?.data || []);
    if (subjectsData.status_code === 200) setSubjects(subjectsData?.data || []);
    if (lessonsData.status_code === 200) setLessons(lessonsData?.data || []);
    if (subLessonsData.status_code === 200) setSubLessons(subLessonsData?.data || []);
  };

  const fetchDataForTeacher = async () => {
    const responses = await Promise.all([
      API_g03.teacherStudent.GetCommentOption(userId, 'curriculum-group', {}),
      API_g03.teacherStudent.GetCommentOption(userId, 'subject', {}),
      API_g03.teacherStudent.GetCommentOption(userId, 'lesson', {}),
      API_g03.teacherStudent.GetCommentOption(userId, 'sub-lesson', {}),
    ]);

    const [curriculum, subjectsData, lessonsData, subLessonsData] = responses;

    if (curriculum?.status_code === 200)
      setCurriculumGroups(
        curriculum.data?.values?.map(({ id, label }) => ({ id, name: label })) || [],
      );
    if (subjectsData?.status_code === 200)
      setSubjects(
        subjectsData.data?.values?.map(({ id, label }) => ({ id, name: label })) || [],
      );
    if (lessonsData?.status_code === 200)
      setLessons(
        lessonsData.data?.values?.map(({ id, label }) => ({ id, name: label })) || [],
      );
    if (subLessonsData?.status_code === 200)
      setSubLessons(
        subLessonsData.data?.values?.map(({ id, label }) => ({ id, name: label })) || [],
      );
  };

  useEffect(() => {
    const fetchYears = async () => {
      if (!filters.curriculum_group_id) {
        setClassYears([]);
        return;
      }
      const response = await API_g03.teacherStudent.GetCommentOption(
        userId,
        'seed-year',
        {
          curriculum_group_id: filters.curriculum_group_id,
        },
      );
      if (response.status_code === 200) {
        setClassYears(
          response.data?.values?.map(({ id, label }) => ({ id, name: label })) || [],
        );
      } else {
        setClassYears([]);
      }
      setFilters((prev) => ({
        ...prev,
        class_year_id: undefined,
        subject_id: undefined,
        lesson_id: undefined,
        sub_lesson_id: undefined,
      }));
    };

    if (isTeacherPath) fetchYears();
  }, [filters.curriculum_group_id]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!filters.curriculum_group_id || !filters.class_year) {
        setSubjects([]);
        return;
      }
      const response = await API_g03.teacherStudent.GetCommentOption(userId, 'subject', {
        curriculum_group_id: filters.curriculum_group_id,
        seed_year_id: filters.class_year,
      });
      if (response.status_code === 200) {
        setSubjects(
          response.data?.values?.map(({ id, label }) => ({ id, name: label })) || [],
        );
      } else {
        setSubjects([]);
      }
      setFilters((prev) => ({
        ...prev,
        subject_id: undefined,
        lesson_id: undefined,
        sub_lesson_id: undefined,
      }));
    };

    if (isTeacherPath) fetchSubjects();
  }, [filters.curriculum_group_id, filters.class_year]);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!filters.subject_id) {
        setLessons([]);
        return;
      }
      const response = await API_g03.teacherStudent.GetCommentOption(userId, 'lesson', {
        subject_id: filters.subject_id,
      });
      if (response.status_code === 200) {
        setLessons(
          response.data?.values?.map(({ id, label }) => ({ id, name: label })) || [],
        );
      } else {
        setLessons([]);
      }
      setFilters((prev) => ({
        ...prev,
        lesson_id: undefined,
        sub_lesson_id: undefined,
      }));
    };

    if (isTeacherPath) fetchLessons();
  }, [filters.subject_id]);

  useEffect(() => {
    const fetchSubLessons = async () => {
      if (!filters.lesson_id) {
        setSubLessons([]);
        return;
      }
      const response = await API_g03.teacherStudent.GetCommentOption(
        userId,
        'sub-lesson',
        {
          lesson_id: filters.lesson_id,
        },
      );
      if (response.status_code === 200) {
        setSubLessons(
          response.data?.values?.map(({ id, label }) => ({ id, name: label })) || [],
        );
      } else {
        setSubLessons([]);
      }
      setFilters((prev) => ({
        ...prev,
        sub_lesson_id: undefined,
      }));
    };

    if (isTeacherPath) fetchSubLessons();
  }, [filters.lesson_id]);

  useEffect(() => {
    if (isAdminPath) {
      fetchDataForAdmin();
    } else if (isTeacherPath) {
      fetchDataForTeacher();
    }
  }, [isAdminPath, isTeacherPath, userId, studentId, refreshTrigger]);

  const fetchData = async () => {
    try {
      if (isAdminPath) {
        const notesResponse = await API_g01.schoolStudent.GetTeacherNote(studentId, {
          search: filters.search,
          start_date: filters.start_date,
          end_date: filters.end_date,
          lesson_id: filters.lesson_id,
          subject_id: filters.subject_id,
          sub_lesson_id: filters.sub_lesson_id,
          curriculum_group_id: filters.curriculum_group_id,
        });
        if (notesResponse.status_code === 200) {
          setData(notesResponse.data);
        }
      } else if (isTeacherPath) {
        const commentResponse = await API_g03.teacherStudent.GetCommentList(
          userId,
          academicYear,
          {
            search: filters.search,
            start_date: filters.start_date,
            end_date: filters.end_date,
            lesson_id: filters.lesson_id,
            subject_id: filters.subject_id,
            sub_lesson_id: filters.sub_lesson_id,
            curriculum_group_id: filters.curriculum_group_id,
            class_year: filters.seed_year_id,
          },
        );
        if (commentResponse.status_code === 200) {
          setData(commentResponse.data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdminPath, isTeacherPath, userId, studentId, filters, refreshTrigger]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {isTeacherPath && (
          <>
            <CWButton
              variant="primary"
              className="!px-2"
              title="เพิ่มข้อมูล"
              onClick={() => setIsAddNotePage(true)}
              icon={<IconPlus />}
            />
            <div className="border-r-2"></div>
          </>
        )}
        <CWInputSearch
          placeholder="ค้นหา"
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />
      </div>

      <div className="flex w-fit flex-wrap gap-2">
        <CWMDaterange
          onChange={(e) => {
            const [startDate, endDate] = e.map(
              (date) => date?.toISOString().split('T')[0] || '',
            );
            setFilters((prev) => ({ ...prev, start_date: startDate, end_date: endDate }));
          }}
        />
        <CWSelect
          title="สังกัดวิชา"
          options={curriculumGroups.map(({ id, name }) => ({ value: id, label: name }))}
          value={filters.curriculum_group_id}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, curriculum_group_id: e.target.value }))
          }
          className="min-w-48"
        />

        <CWSelect
          title="ชั้นปี"
          options={classYears.map(({ id, name }) => ({ value: id, label: name }))}
          value={filters.class_year}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, class_year: e.target.value }))
          }
          disabled={!filters.curriculum_group_id}
          className={`min-w-48 ${!filters.curriculum_group_id ? 'pointer-events-none opacity-50' : ''}`}
        />

        <CWSelect
          title="วิชา"
          options={subjects.map(({ id, name }) => ({ value: id, label: name }))}
          value={filters.subject_id}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, subject_id: e.target.value }))
          }
          disabled={!filters.class_year}
          className={`min-w-48 ${!filters.class_year ? 'pointer-events-none opacity-50' : ''}`}
        />

        <CWSelect
          title="บทเรียน"
          options={lessons.map(({ id, name }) => ({ value: id, label: name }))}
          value={filters.lesson_id}
          onChange={(e) => setFilters((prev) => ({ ...prev, lesson_id: e.target.value }))}
          disabled={!filters.subject_id}
          className={`min-w-48 ${!filters.subject_id ? 'pointer-events-none opacity-50' : ''}`}
        />

        <CWSelect
          title="บทเรียนย่อย"
          options={subLessons.map(({ id, name }) => ({ value: id, label: name }))}
          value={filters.sub_lesson_id}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, sub_lesson_id: e.target.value }))
          }
          disabled={!filters.lesson_id}
          className={`min-w-48 ${!filters.lesson_id ? 'pointer-events-none opacity-50' : ''}`}
        />
      </div>

      {!data || data.length === 0 ? (
        <div className="flex items-center justify-center p-5 text-gray-500">
          <p>ยังไม่มีบักทึกจากครู ในตอนนี้</p>
        </div>
      ) : (
        <>
          {data.map((teacher, index) => (
            <CWWhiteBox className="flex flex-col gap-5 p-5" key={index}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CWAvatar src={teacher.image_url} alt={`${teacher.teacher}`} />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{teacher.teacher}</p>
                    <p className="text-xs text-neutral-500">
                      ปีการศึกษา {teacher.academic_year}, {teacher.year}{' '}
                      {teacher.created_at
                        ? toDateTimeTH(new Date(teacher.created_at))
                        : '-'}
                    </p>
                  </div>
                </div>
                {isTeacherPath && (
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => {
                        setNoteUpdateData(teacher);
                        setIsEditNotePage(true);
                      }}
                    >
                      <IconPen />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCommentId(teacher.comment_id);
                        setModalDelete(true);
                      }}
                    >
                      <IconTrash />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm">{teacher.text}</p>
              <div className="flex flex-wrap gap-2">
                {[
                  teacher.year,
                  teacher.subject,
                  `บทที่ ${teacher.lesson_index} ${teacher.lesson}`,
                  `บทที่ ${teacher.lesson_index} - ${teacher.sub_lesson_index} ${teacher.sub_lesson}`,
                  `ด่านที่ ${teacher.level_index}`,
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-primary px-2 py-1 text-sm text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CWWhiteBox>
          ))}
        </>
      )}
      <CWModalDelete
        open={modalDelete}
        onClose={() => {
          setModalDelete(false);
          setSelectedCommentId(null);
        }}
        onOk={async () => {
          if (!selectedCommentId) return;

          try {
            const res = await API_g03.teacherStudent.DeleteComment(selectedCommentId);

            if (res.status_code === 200) {
              await fetchData();
              setModalDelete(false);
              setSelectedCommentId(null);

              showMessage('ลบบันทึกของครูสำเร็จ', 'success');
            } else {
              showMessage('ลบบันทึกของครูไม่สำเร็จ', 'error');
            }
          } catch (error) {
            console.error('Error while deleting comment:', error);
            showMessage('เกิดข้อผิดพลาดในการลบโน้ต', 'error');
          }
        }}
      />
    </div>
  );
};

export default TeachersNote;
