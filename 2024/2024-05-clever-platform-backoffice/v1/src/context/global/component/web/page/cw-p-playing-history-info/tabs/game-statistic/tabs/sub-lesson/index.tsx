import CwProgress from '@component/web/cw-progress';
import CWSelect from '@component/web/cw-select';
import CWMDaterange from '@component/web/molecule/cw-m-date-range';
import IconEye from '@core/design-system/library/component/icon/IconEye.tsx';
import API_g01 from '@domain/g01/g01-d04/local/api';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import { getDateTime } from '@domain/g01/g01-d05/local/utils';
import { AcademicLevelType, QuestionType } from '@domain/g02/g02-d05/local/type';
import API from '@domain/g03/g03-d04/local/api';
import {
  LevelStatResponse,
  OptionShow,
  ParamsTeacherStudentBySubLesson,
} from '@domain/g03/g03-d04/local/api/group/teacher-student/type.ts';
import { getLevelType, getQuestionType } from '@global/utils/levelConvert';
import { toDateTimeTH } from '@global/utils/date.ts';
import downloadCSV from '@global/utils/downloadCSV.ts';
import showMessage from '@global/utils/showMessage.ts';
import { useParams, useRouter } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import CWProgressBar from '@component/web/cw-progress-bar';
import { formatTimeString } from '@global/utils/format/time';
import usePagination from '@global/hooks/usePagination';

const SubLesson = ({
  userId,
  targetSubLessonId,
  setShowLessonLevel,
  setTargetLevelId,
}: {
  userId: string;
  targetSubLessonId: number | undefined;
  setShowLessonLevel: React.Dispatch<React.SetStateAction<boolean>>;
  setTargetLevelId: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
  const { schoolId, studentId, classId, academicYear } = useParams({ from: '' });
  const router = useRouter();
  const isAdminPath = router.state.location.pathname.includes('/admin/school');
  const sid = isAdminPath ? userId : studentId;

  const [data, setData] = useState<LevelStatResponse[]>([]);
  const [fetching, setFetching] = useState(false);
  const [filters, setFilters] = useState<Partial<ParamsTeacherStudentBySubLesson>>({});

  const [academicYearOptions, setAcademicYearOptions] = useState<OptionShow[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
  };

  const modalDownload = useModal();

  const fetchData = async () => {
    if (targetSubLessonId) {
      setFetching(true);
      try {
        const response = await API.teacherStudent.GetLevelStat(sid, targetSubLessonId, {
          search: filters.search,
          start_date: filters.start_date,
          end_date: filters.end_date,
          lesson_id: filters.lesson_id,
          subject_id: filters.subject_id,
          sub_lesson_id: filters.sub_lesson_id,
          curriculum_group_id: filters.curriculum_group_id,
          academic_year: filters.academic_year,
          question_type: filters.question_type,
          difficulty: filters.difficulty,
          limit: pagination.limit,
          page: pagination.page,
        });
        if (response.status_code === 200) {
          setData(response.data);
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
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, studentId, userId, pagination.page, pagination.limit]);

  useEffect(() => {
    const fetchOptions = async () => {
      setFetching(true);
      try {
        if (isAdminPath) {
          const response =
            await API_g01.schoolStudent.PlayLog.GetAcademicYears(studentId);
          if (response.status_code === 200) {
            const options = response.data.map((item) => ({
              id: item,
              label: item.toString(),
            }));
            setAcademicYearOptions(options);
          }
        } else {
          const response = await API.teacherStudent.GetOptions(
            sid,
            academicYear,
            'academic-year',
          );
          if (response.status_code === 200) {
            setAcademicYearOptions(response.data.values);
          }
        }
      } catch (error) {
        console.error('Error while fetching options:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchOptions();
  }, [sid, academicYear]);

  const onDownload = (dateFrom: string, dateTo: string) => {
    if (targetSubLessonId) {
      API.teacherStudent
        .DownloadLevelStatBySubLessonCsv(sid, targetSubLessonId, {
          start_date: dateFrom,
          end_date: dateTo,
          search: filters.search,
          curriculum_group_id: filters.curriculum_group_id,
          lesson_id: filters.lesson_id,
          subject_id: filters.subject_id,
          academic_year: filters.academic_year,
          question_type: filters.question_type,
          difficulty: filters.difficulty,
        })
        .then((res) => {
          if (res instanceof Blob) {
            downloadCSV(res, `${getDateTime()}_${userId}_sub-lesson_stat.csv`);
            modalDownload.close();
          } else {
            showMessage('Download failed!', 'error');
          }
        })
        .catch(() => {
          showMessage('Download failed!', 'error');
        });
    }
  };

  const rowColumns: DataTableColumn<LevelStatResponse>[] = [
    {
      title: 'ดู',
      accessor: 'view',
      textAlign: 'center',
      render: (row) => (
        <div className="flex w-full justify-center">
          <button
            type="button"
            onClick={() => {
              setShowLessonLevel(true);
              setTargetLevelId(row.level_id);
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
    },
    {
      title: 'ด่านที่',
      accessor: 'level_id',
    },
    {
      title: 'ประเภท',
      accessor: 'level_type',
      render: (row) => {
        return getLevelType(row.level_type as keyof typeof AcademicLevelType);
      },
    },
    {
      title: 'รูปแบบคำถาม',
      accessor: 'question_type',
      render: (row) => {
        return getQuestionType(row.question_type as keyof typeof QuestionType);
      },
    },
    {
      accessor: 'difficulty',
      title: 'ระดับ',
      render: (row) => {
        const difficultyMap: Record<string, string> = {
          easy: 'ง่าย',
          medium: 'ปานกลาง',
          hard: 'ยาก',
        };
        const text = row.difficulty.toLowerCase();
        const badgeClass =
          text === 'easy'
            ? 'badge-outline-success'
            : text === 'medium'
              ? 'badge-outline-warning'
              : text === 'hard'
                ? 'badge-outline-danger'
                : 'badge-outline-secondary';
        return (
          <span className={`badge ${badgeClass} flex w-16 items-center justify-center`}>
            {difficultyMap[text] || row.difficulty}
          </span>
        );
      },
    },
    {
      title: 'คะแนนรวมเฉลี่ย (คะแนน)',
      accessor: 'averageScore',
      textAlign: 'right',
      render: (row) => (
        <div className="flex flex-col items-end">
          <span>
            {row.total_score.value ?? 0} / {row.total_score.total ?? 0}
          </span>
          <div className="ml-auto w-16">
            <CWProgressBar
              score={row.total_score.value ?? 0}
              total={row.total_score.total ?? 0}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'ทำข้อสอบแล้ว (ครั้ง)',
      accessor: 'total_attempt',
      textAlign: 'right',
      render: (row) => (
        <div className="w-full text-right">
          <span>{row.total_attempt}</span>
        </div>
      ),
    },
    {
      title: 'เวลาเฉลี่ย/ครั้ง',
      accessor: 'average_time_used',
      textAlign: 'right',
      render: (row) => (
        <div className="w-full text-right">
          <span>{formatTimeString(row.average_time_used)}</span>
        </div>
      ),
    },

    {
      accessor: 'last_played_at',
      title: 'ทำข้อสอบล่าสุด',
      render: (record) => toDateTimeTH(record.last_played_at),
    },
  ];

  return (
    <div className="panel flex flex-col gap-5">
      <CWOHeaderTableButton
        showBulkEditButton={false}
        showUploadButton={false}
        onSearchChange={(evt) => {
          setFilters((prev) => ({
            ...prev,
            search: evt.target.value,
          }));
        }}
        onDownload={(data) => onDownload(data.dateFrom, data.dateTo)}
      />

      <div className="flex w-fit flex-wrap gap-2">
        <CWSelect
          title="ข้อมูลย้อนหลัง"
          options={academicYearOptions.map((y) => ({ value: y.id, label: y.label }))}
          value={filters.academic_year}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              academic_year: e.target.value,
            }))
          }
          className="min-w-48"
        />
        <CWMDaterange
          onChange={(e) => {
            const [startDate, endDate] = e.map(
              (date) => date?.toISOString().split('T')[0] || '',
            );
            setFilters((prev) => ({ ...prev, start_date: startDate, end_date: endDate }));
          }}
        />
        <CWSelect
          title="ประเภท"
          options={[
            {
              value: 'test',
              label: 'แบบฝึกหัด',
            },
            {
              value: 'pre-post-test',
              label: 'แบบฝึกหัดก่อนเรียน',
            },
            {
              value: 'sub-lesson-post-test',
              label: 'แบบฝึกหัดท้ายบทเรียนย่อย',
            },
          ]}
          value={filters.question_type}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              question_type: e.target.value,
            }))
          }
          className="min-w-48"
        />
        <CWSelect
          title="ระดับ"
          options={[
            {
              value: 'easy',
              label: 'ง่าย',
            },
            {
              value: 'medium',
              label: 'ปานกลาง',
            },
            {
              value: 'hard',
              label: 'ยาก',
            },
          ]}
          value={filters.difficulty}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              difficulty: e.target.value,
            }))
          }
          className="min-w-48"
        />
      </div>

      <div className="datatables">
        <DataTable
          className="table-hover whitespace-nowrap"
          records={data}
          columns={rowColumns}
          highlightOnHover
          withTableBorder
          withColumnBorders
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
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
          }
          recordsPerPageOptions={pageSizeOptions}
        />
      </div>
    </div>
  );
};

export default SubLesson;
