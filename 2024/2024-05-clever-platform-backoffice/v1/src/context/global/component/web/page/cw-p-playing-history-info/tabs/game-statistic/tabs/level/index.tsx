import CWModalQuestionView from '@component/web/cw-modal/cw-modal-question-view';
import CwProgress from '@component/web/cw-progress';
import CWProgressBar from '@component/web/cw-progress-bar';
import CWSelect from '@component/web/cw-select';
import CWMDaterange from '@component/web/molecule/cw-m-date-range';
import IconEye from '@core/design-system/library/component/icon/IconEye.tsx';
import API_g01 from '@domain/g01/g01-d04/local/api';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import { getDateTime } from '@domain/g01/g01-d05/local/utils';
import API from '@domain/g03/g03-d04/local/api';
import {
  LevelPlayLogResponse,
  OptionShow,
  ParamsTeacherStudentBySubLesson,
} from '@domain/g03/g03-d04/local/api/group/teacher-student/type.ts';
import usePagination from '@global/hooks/usePagination';
import { toDateTimeTH } from '@global/utils/date.ts';
import downloadCSV from '@global/utils/downloadCSV.ts';
import { formatTimeString } from '@global/utils/format/time';
import showMessage from '@global/utils/showMessage.ts';
import { useParams, useRouter } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';

const LessonLevel = ({
  userId,
  targetLevelId,
}: {
  userId: string;
  targetLevelId: number | undefined;
}) => {
  const { schoolId, studentId, classId, academicYear } = useParams({ from: '' });
  const router = useRouter();
  const isAdminPath = router.state.location.pathname.includes('/admin/school');
  const sid = isAdminPath ? userId : studentId;

  const [data, setData] = useState<LevelPlayLogResponse[]>([]);
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
    if (targetLevelId) {
      setFetching(true);
      try {
        const response = await API.teacherStudent.GetLevelLogList(sid, targetLevelId, {
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
        if (response?.status_code === 200) {
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
    if (targetLevelId) {
      API.teacherStudent
        .DownloadLevelStatByLevelCsv(sid, targetLevelId, {
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
            downloadCSV(res, `${getDateTime()}_${userId}_level_stat.csv`);
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

  const rowColumns: DataTableColumn<LevelPlayLogResponse>[] = [
    {
      title: 'ดูคำตอบ',
      accessor: 'view',
      textAlign: 'center',
      render: (row) => (
        <div
          className="flex w-full cursor-pointer justify-center"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <IconEye />
        </div>
      ),
    },
    {
      accessor: 'play_log_id',
      title: '#',
    },
    {
      accessor: 'score',
      title: 'คะแนน',
      textAlign: 'right',
      render: (row) => (
        <div className="flex flex-col items-end">
          <span>
            {row.score ?? 0} / {row.max_score ?? 0}
          </span>
          <div className="ml-auto w-16">
            <CWProgressBar score={row.score ?? 0} total={row.max_score ?? 0} />
          </div>
        </div>
      ),
    },
    {
      accessor: 'average_time_used',
      title: 'เวลาเฉลี่ย/ข้อ',
      textAlign: 'right',
      render: (row) => (
        <div className="text-end">{formatTimeString(row.average_time_used)}</div>
      ),
    },
    {
      accessor: 'played_at',
      title: 'เวลาทำข้อสอบ',
      render: (row) => toDateTimeTH(row.played_at),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <CWModalQuestionView
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        levelId={targetLevelId}
      />
    </div>
  );
};

export default LessonLevel;
