import CwProgress from '@component/web/cw-progress';
import CWSelect from '@component/web/cw-select';
import LessonLevel from '@component/web/page/cw-p-playing-history-info/tabs/game-statistic/tabs/level';
import SubLesson from '@component/web/page/cw-p-playing-history-info/tabs/game-statistic/tabs/sub-lesson';
import IconEye from '@core/design-system/library/component/icon/IconEye.tsx';
import API_g01 from '@domain/g01/g01-d04/local/api';
import { SchoolStudentFilterQueryParams } from '@domain/g01/g01-d04/local/api/repository/school-student.ts';
import { OptionInterface } from '@domain/g01/g01-d04/local/type.ts';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import { getDateTime } from '@domain/g01/g01-d05/local/utils';
import API_g03 from '@domain/g03/g03-d04/local/api';
import {
  LessonStatResponse,
  OptionsResponse,
  ParamsTeacherStudent,
} from '@domain/g03/g03-d04/local/api/group/teacher-student/type.ts';
import { toDateTimeTH } from '@global/utils/date.ts';
import downloadCSV from '@global/utils/downloadCSV.ts';
import showMessage from '@global/utils/showMessage.ts';
import { useParams, useRouter } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useCallback, useEffect, useState } from 'react';

import Lesson from './tabs/lesson';
import CWProgressBar from '@component/web/cw-progress-bar';
import { formatTimeString } from '@global/utils/format/time';
import usePagination from '@global/hooks/usePagination';

const GameStatistic = ({
  userId,
  classroomId,
}: {
  userId: string;
  classroomId: number;
}) => {
  // ตรวจสอบ path ของ URL
  const router = useRouter();
  const isTeacherPath = router.state.location.pathname.includes('/teacher/student');
  const isAdminPath = router.state.location.pathname.includes('/admin/school');
  const { schoolId, studentId, classId, academicYear } = useParams({ from: '' });

  const [showLesson, setShowLesson] = useState(false);
  const [showSubLesson, setShowSubLesson] = useState(false);
  const [showLessonLevel, setShowLessonLevel] = useState(false);
  const [records, setRecords] = useState<LessonStatResponse[]>([]);
  const [fetching, setFetching] = useState(false);
  const [inputValueSearch, setInputValueSearch] = useState('');
  const [filters, setFilters] = useState<Partial<ParamsTeacherStudent>>({});

  const [targetLessonId, setTargetLessonId] = useState<number>();
  const [targetSubLessonId, setTargetSubLessonId] = useState<number>();
  const [targetLevelId, setTargetLevelId] = useState<number>();

  //const [academicYears, setAcademicYears] = useState<number[]>([]);
  const [curriculumGroups, setCurriculumGroups] = useState<OptionInterface[]>([]);
  const [classYears, setClassYears] = useState<OptionInterface[]>([]);
  const [subjects, setSubjects] = useState<OptionInterface[]>([]);
  const [lessons, setLessons] = useState<OptionInterface[]>([]);

  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [csvQuery, setCsvQuery] = useState<Record<'start_date' | 'end_date', string>>({
    start_date: '',
    end_date: '',
  });

  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
  };

  const modalDownload = useModal();

  const columns: DataTableColumn<LessonStatResponse>[] = [
    {
      accessor: 'view',
      title: 'ดูข้อมูล',
      titleClassName: 'text-center',
      render: (record) => (
        <div className="flex w-full justify-center">
          <button
            type="button"
            onClick={() => {
              setShowLesson(true);
              setTargetLessonId(record.lesson_id);
            }}
          >
            <IconEye className="h-5 w-5" />
          </button>
        </div>
      ),
    },
    {
      accessor: 'index',
      title: '#',
      render: (_: any, index: number) => index + 1,
    },
    { accessor: 'lesson_name', title: 'บทเรียนหลัก' },
    {
      accessor: 'level',
      title: 'ด่านที่ผ่าน (ด่าน)',
      textAlign: 'right',
      render: (record) => (
        <div className="flex flex-col items-end">
          <span>
            {record.total_passed_level.value} / {record.total_passed_level.total}
          </span>
          <div className="ml-auto w-16">
            <CWProgressBar
              score={record.total_passed_level.value}
              total={record.total_passed_level.total}
            />
          </div>
        </div>
      ),
    },
    {
      accessor: 'score',
      title: 'คะแนนรวม (คะแนน)',
      textAlign: 'right',
      render: (record) => (
        <div className="flex flex-col items-end">
          <span>
            {record.total_score.value} / {record.total_score.total}
          </span>
          <div className="ml-auto w-16">
            <CWProgressBar
              score={record.total_score.value}
              total={record.total_score.total}
            />
          </div>
        </div>
      ),
    },
    {
      accessor: 'total_attempt',
      title: 'ทำข้อสอบ (ครั้ง)',
      textAlign: 'right',
      render: (record) => <div className="text-end">{record.total_attempt}</div>,
    },
    {
      accessor: 'average_time_used',
      title: 'เวลาเฉลี่ย/ข้อ',
      textAlign: 'right',
      render: (record) => (
        <div className="text-end">{formatTimeString(record.average_time_used)}</div>
      ),
    },
    {
      accessor: 'last_played_at',
      title: 'เข้าสู่ระบบล่าสุด',
      render: (record) => toDateTimeTH(record.last_played_at),
    },
  ];

  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const sid = isAdminPath ? userId : studentId;
      const response =
        await API_g03.teacherStudent.GetLessonStatListByStudentIdAndAcademicYear(
          sid,
          academicYear,
          {
            search: inputValueSearch,
            academic_year: academicYear,
            curriculum_group_id: filters.curriculum_group_id,
            class_year: filters.seed_year_id,
            seed_year_id: filters.seed_year_id,
            subject_id: filters.subject_id,
            lesson_id: filters.lesson_id,
            limit: pagination.limit,
            page: pagination.page,
          },
        );
      if (response?.status_code === 200) {
        setRecords(response.data);
        setPagination((prev) => ({
          ...prev,
          total_count: response?._pagination?.total_count || response?.data?.length,
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  }, [
    userId,
    classroomId,
    filters,
    isAdminPath,
    isTeacherPath,
    inputValueSearch,
    pagination.page,
    pagination.limit,
  ]);

  useEffect(() => {
    fetchData();
  }, [filters, userId, pagination.page, pagination.limit]);

  useEffect(() => {
    const fetchFiltersData = async () => {
      if (isAdminPath) {
        // const fetchAcademicYears =
        //   await API_g01.schoolStudent.PlayLog.GetAcademicYears(studentId);
        // setAcademicYears(
        //   fetchAcademicYears.status_code === 200 ? fetchAcademicYears.data : [],
        // );

        const fetchCurriculumGroups =
          await API_g01.schoolStudent.PlayLog.GetCurriculumGroups(studentId, {
            academic_year: filters.academic_year,
          });
        setCurriculumGroups(
          fetchCurriculumGroups.status_code === 200 ? fetchCurriculumGroups.data : [],
        );

        const fetchSubjects = await API_g01.schoolStudent.PlayLog.getSubjects(studentId, {
          academic_year: filters.academic_year,
        });
        setSubjects(fetchSubjects.status_code === 200 ? fetchSubjects.data : []);

        const fetchLessons = await API_g01.schoolStudent.PlayLog.getLessons(studentId, {
          academic_year: filters.academic_year,
        });
        setLessons(fetchLessons.status_code === 200 ? fetchLessons.data : []);
      } else if (isTeacherPath) {
        async function fetchAndSetOptions(
          studentId: any,
          academicYear: string,
          optionType: 'curriculum-group' | 'subject' | 'lesson',
          setOptions: (options: OptionInterface[]) => void,
        ) {
          const response = await API_g03.teacherStudent.GetOptions(
            studentId,
            academicYear,
            optionType,
          );

          if (response.status_code === 200 && response.data) {
            const optionsResponse = response.data as unknown as OptionsResponse;
            if (Array.isArray(optionsResponse.values)) {
              const options = optionsResponse.values.map((item) => ({
                id: item.id,
                name: item.label,
              }));
              setOptions(options);
            } else {
              setOptions([]);
            }
          } else {
            setOptions([]);
          }

          const fetchYear = await API_g01.schoolStudent.GetSeedYears();
          setClassYears(fetchYear.status_code === 200 ? fetchYear.data : []);

          const subjectResult = await API_g01.schoolStudent.PlayLog.getSubjects(userId, {
            class_year: filters.class_year,
            curriculum_group_id: filters.curriculum_group_id,
          });
          setSubjects(subjectResult.status_code === 200 ? subjectResult.data : []);

          const lessonResult = await API_g01.schoolStudent.PlayLog.getLessons(userId, {
            class_year: filters.class_year,
            curriculum_group_id: filters.curriculum_group_id,
            subject_id: filters.subject_id,
          });

          setLessons(lessonResult.status_code === 200 ? lessonResult.data : []);
        }

        {
          await fetchAndSetOptions(
            studentId,
            academicYear,
            'curriculum-group',
            setCurriculumGroups,
          );
          await fetchAndSetOptions(studentId, academicYear, 'subject', setSubjects);
          await fetchAndSetOptions(studentId, academicYear, 'lesson', setLessons);
        }
      }
    };

    fetchFiltersData();
  }, [
    filters.academic_year,
    filters.curriculum_group_id,
    filters.class_year,
    userId,
    studentId,
  ]);

  const onFilters = (key: keyof SchoolStudentFilterQueryParams, value: any) => {
    if (key === 'curriculum_group_id') {
      setFilters({
        curriculum_group_id: value,
        class_year: undefined,
        seed_year_id: undefined,
        subject_id: undefined,
        lesson_id: undefined,
      });
    } else if (key === 'class_year') {
      setFilters((prev) => ({
        ...prev,
        class_year: value,
        seed_year_id: value,
        subject_id: undefined,
        lesson_id: undefined,
      }));
    } else if (key === 'subject_id') {
      setFilters((prev) => ({
        ...prev,
        subject_id: value,
        lesson_id: undefined,
      }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const onDownload = (dateFrom: string, dateTo: string) => {
    API_g03.teacherStudent
      .DownloadLessonStatCsv(userId, academicYear, {
        start_date: dateFrom,
        end_date: dateTo,
        search: inputValueSearch,
        curriculum_group_id: filters.curriculum_group_id,
        class_year: filters.seed_year_id,
        lesson_id: filters.lesson_id,
        subject_id: filters.subject_id,
      })
      .then((res) => {
        if (res instanceof Blob) {
          downloadCSV(res, `${getDateTime()}_${userId}_playlogs.csv`);
          modalDownload.close();
        } else {
          showMessage('Download failed!', 'error');
        }
      })
      .catch(() => {
        showMessage('Download failed!', 'error');
      });
  };

  if (showLesson) {
    if (!showSubLesson && targetLessonId) {
      return (
        <Lesson
          userId={userId}
          targetLessonId={targetLessonId}
          setShowSubLesson={setShowSubLesson}
          setTargetSubLessonId={setTargetSubLessonId}
        />
      );
    }
    if (!showLessonLevel) {
      return (
        <SubLesson
          userId={userId}
          targetSubLessonId={targetSubLessonId}
          setTargetLevelId={setTargetLevelId}
          setShowLessonLevel={setShowLessonLevel}
        />
      );
    }
    return <LessonLevel userId={userId} targetLevelId={targetLevelId} />;
  }

  return (
    <div className="panel flex flex-col gap-5">
      <CWOHeaderTableButton
        showBulkEditButton={false}
        showUploadButton={false}
        onSearchChange={(evt) => {
          setInputValueSearch(evt.target.value);
        }}
        onDownload={(data) => onDownload(data.dateFrom, data.dateTo)}
      />

      <div className="flex w-fit flex-wrap gap-2">
        <CWSelect
          options={curriculumGroups.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          required={false}
          className="min-w-48"
          title="สังกัดวิชา"
          value={filters.curriculum_group_id}
          onChange={(e) => onFilters('curriculum_group_id', e.currentTarget.value)}
        />

        <CWSelect
          options={classYears.map((s) => ({ value: s.id, label: s.name }))}
          required={false}
          className={`min-w-48 ${!filters.curriculum_group_id ? 'pointer-events-none opacity-50' : ''}`}
          title="ชั้นปี"
          value={filters.class_year}
          onChange={(e) => onFilters('class_year', Number(e.currentTarget.value))}
          disabled={!filters.curriculum_group_id}
        />

        <CWSelect
          options={subjects.map((s) => ({ value: s.id, label: s.name }))}
          required={false}
          className={`min-w-48 ${!filters.class_year ? 'pointer-events-none opacity-50' : ''}`}
          title="วิชา"
          value={filters.subject_id}
          onChange={(e) => onFilters('subject_id', e.currentTarget.value)}
          disabled={!filters.class_year}
        />

        <CWSelect
          options={lessons.map((l) => ({ value: l.id, label: l.name }))}
          required={false}
          className={`min-w-48 ${!filters.subject_id ? 'pointer-events-none opacity-50' : ''}`}
          title="บทเรียน"
          value={filters.lesson_id}
          onChange={(e) => onFilters('lesson_id', e.currentTarget.value)}
          disabled={!filters.subject_id}
        />
      </div>

      {records.length > 0 ? (
        <DataTable
          className="table-hover whitespace-nowrap"
          records={records}
          columns={columns}
          highlightOnHover
          withTableBorder
          withColumnBorders
          minHeight={200}
          height={'calc(100vh - 350px)'}
          noRecordsText="ไม่พบข้อมูล"
          fetching={fetching}
          totalRecords={pagination.total_count}
          recordsPerPage={pagination.limit}
          page={pagination.page}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          onRecordsPerPageChange={(limit) => {
            setPagination((prev) => ({ ...prev, limit, page: 1 }));
          }}
          recordsPerPageOptions={pageSizeOptions}
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
          }
        />
      ) : (
        <DataTable
          className="table-hover whitespace-nowrap"
          records={records}
          columns={columns}
          highlightOnHover
          withTableBorder
          withColumnBorders
          minHeight={200}
          height={'calc(100vh - 350px)'}
          noRecordsText="ไม่พบข้อมูล"
          fetching={fetching}
        />
      )}
    </div>
  );
};

export default GameStatistic;
