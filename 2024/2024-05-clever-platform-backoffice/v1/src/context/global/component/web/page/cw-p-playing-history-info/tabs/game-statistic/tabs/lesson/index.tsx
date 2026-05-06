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
  OptionShow,
  ParamsTeacherStudent,
  SubLessonStatResponse,
} from '@domain/g03/g03-d04/local/api/group/teacher-student/type.ts';
import usePagination from '@global/hooks/usePagination';
import { toDateTimeTH } from '@global/utils/date.ts';
import downloadCSV from '@global/utils/downloadCSV.ts';
import { formatTimeString } from '@global/utils/format/time';
import showMessage from '@global/utils/showMessage.ts';
import { useParams, useRouter } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';

const Lesson = ({
  userId,
  targetLessonId,
  setShowSubLesson,
  setTargetSubLessonId,
}: {
  userId: string;
  targetLessonId: number;
  setShowSubLesson: React.Dispatch<React.SetStateAction<boolean>>;
  setTargetSubLessonId: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
  const { schoolId, studentId, classId, academicYear } = useParams({ from: '' });
  const router = useRouter();
  const isAdminPath = router.state.location.pathname.includes('/admin/school');
  const sid = isAdminPath ? userId : studentId;

  const [data, setData] = useState<SubLessonStatResponse[]>([]);
  const [fetching, setFetching] = useState(false);
  const [filters, setFilters] = useState<Partial<ParamsTeacherStudent>>({});

  const [subjectOptions, setSubjectOptions] = useState<OptionShow[]>([]);

  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return { isOpen, open, close };
  };

  const modalDownload = useModal();

  const fetchData = async () => {
    setFetching(true);
    try {
      const response = await API.teacherStudent.GetSubLessonStat(sid, targetLessonId, {
        search: filters.search,
        start_date: filters.start_date,
        end_date: filters.end_date,
        lesson_id: filters.lesson_id,
        subject_id: filters.subject_id,
        sub_lesson_id: filters.sub_lesson_id,
        curriculum_group_id: filters.curriculum_group_id,
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
  };

  useEffect(() => {
    fetchData();
  }, [filters, studentId, userId, pagination.page, pagination.limit]);

  useEffect(() => {
    const fetchOptions = async () => {
      setFetching(true);
      try {
        if (isAdminPath) {
          const response = await API_g01.schoolStudent.PlayLog.GetSubLesson(sid, {
            academic_year: academicYear,
          });
          if (response.status_code === 200) {
            const options = response.data.map((item) => ({
              id: item.id,
              label: item.name,
            }));
            setSubjectOptions(options);
          }
        } else {
          const response = await API.teacherStudent.GetOptions(
            sid,
            academicYear,
            'sub-lesson',
          );
          if (response.status_code === 200) {
            setSubjectOptions(response.data.values);
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
    API.teacherStudent
      .DownloadLevelStatByLessonCsv(sid, targetLessonId, {
        start_date: dateFrom,
        end_date: dateTo,
        search: filters.search,
        curriculum_group_id: filters.curriculum_group_id,
        lesson_id: filters.lesson_id,
        subject_id: filters.subject_id,
      })
      .then((res) => {
        if (res instanceof Blob) {
          downloadCSV(res, `${getDateTime()}_${userId}_lesson_stat.csv`);
          modalDownload.close();
        } else {
          showMessage('Download failed!', 'error');
        }
      })
      .catch(() => {
        showMessage('Download failed!', 'error');
      });
  };

  const rowColumns: DataTableColumn<SubLessonStatResponse>[] = [
    {
      title: 'ดู',
      accessor: 'view',
      textAlign: 'center',
      render: (row) => (
        <div className="flex w-full justify-center">
          <button
            type="button"
            onClick={() => {
              setShowSubLesson(true);
              setTargetSubLessonId(row.sub_lesson_id);
            }}
          >
            <IconEye className="h-5 w-5" />
          </button>
        </div>
      ),
    },
    {
      accessor: 'sub_lesson_id',
      title: '#',
    },
    {
      title: 'บทเรียนย่อย',
      accessor: 'sub_lesson_name',
    },
    {
      title: 'ด่านที่',
      accessor: 'level_gruop',
      render: (row) => (
        <span>
          {row.level_group.from === 0 ? '' : row.level_group.from} -{' '}
          {row.level_group.to === 0 ? '' : row.level_group.to}
        </span>
      ),
    },
    {
      title: 'ด่านที่ผ่านเฉลี่ย',
      accessor: 'averageStageCompleted',
      textAlign: 'right',
      render: (row) => (
        <div className="flex flex-col items-end">
          <span>
            {row.total_passed_level.value ?? 0} / {row.total_passed_level.total ?? 0}
          </span>
          <div className="ml-auto w-16">
            <CWProgressBar
              score={row.total_passed_level.value ?? 0}
              total={row.total_passed_level.total ?? 0}
            />
          </div>
        </div>
      ),
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
      title: 'เวลาเฉลี่ย/ครั้ง',
      accessor: 'average_time_used',
      textAlign: 'right',
      render: (record) => (
        <div className="text-end">{formatTimeString(record.average_time_used)}</div>
      ),
    },
    {
      accessor: 'last_played_at',
      title: 'ทำข้อสอบล่าสุด',
      render: (record) =>
        record.last_played_at ? toDateTimeTH(record.last_played_at) : '-',
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
        <CWMDaterange
          onChange={(e) => {
            const [startDate, endDate] = e.map(
              (date) => date?.toISOString().split('T')[0] || '',
            );
            setFilters((prev) => ({ ...prev, start_date: startDate, end_date: endDate }));
          }}
        />
        <CWSelect
          title="บทเรียนย่อย"
          options={subjectOptions.map((s) => ({ value: s.id, label: s.label }))}
          value={filters.sub_lesson_id}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              sub_lesson_id: e.target.value,
            }))
          }
          className="w-48"
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
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
          }
          recordsPerPageOptions={pageSizeOptions}
        />
      </div>
    </div>
  );
};

export default Lesson;
