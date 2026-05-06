import CWModalQuestionView from '@component/web/cw-modal/cw-modal-question-view';
import CwProgress from '@component/web/cw-progress';
import CWSelect from '@component/web/cw-select';
import CWMDaterange from '@component/web/molecule/cw-m-date-range';
import IconEye from '@core/design-system/library/component/icon/IconEye.tsx';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import API from '@domain/g03/g03-d03/local/api';
import { StudentGroupInfo } from '@domain/g03/g03-d03/local/api/group/student-group-info/type.ts';
import {
  LessonStatList,
  ParamsLessonStat,
} from '@domain/g03/g03-d03/local/api/group/student-group-lesson/type.ts';
import downloadCSV from '@global/utils/downloadCSV.ts';
import { getLevelType, getQuestionType } from '@global/utils/levelConvert';
import { formatTimeString } from '@global/utils/format/time';
import showMessage from '@global/utils/showMessage.ts';
import { useParams } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useMemo, useState } from 'react';
import { TPagination } from '@global/types/api';
import usePagination from '@global/hooks/usePagination';

const TeacherStudentGroupLesson = () => {
  const { studentGroupId } = useParams({ from: '' });

  const [data, setData] = useState<LessonStatList[]>([]);
  const [fetching, setFetching] = useState(false);
  const [filters, setFilters] = useState<Partial<ParamsLessonStat>>({});
  const [academicYears, setAcademicYears] = useState<number[]>([]);
  const [studentGroup, setStudentGroup] = useState<StudentGroupInfo>();
  console.log({ studentGroup: studentGroup });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [levelId, setLevelId] = useState<number | undefined>(undefined);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [lessonOptions, setLessonOptions] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [subLessonOptions, setSubLessonOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Helper to toggle modal
  const useModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    return { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) };
  };

  const modalDownload = useModal();

  const onDownload = (dateFrom: string, dateTo: string) => {
    if (!studentGroup?.class_academic_year) return;
    const currentYear = (new Date().getFullYear() + 543).toString();
    API.studentGroupLesson
      .DownloadLessonStatCsv(studentGroupId, {
        academic_year: studentGroup?.class_academic_year,
        search: filters.search,
        start_date: dateFrom,
        end_date: dateTo,
        lesson_id: filters.lesson_id,
        sub_lesson_id: filters.sub_lesson_id,
      })
      .then((res) => {
        if (res instanceof Blob) {
          downloadCSV(res, `student_group_${studentGroupId}_lesson_stat`);
          modalDownload.close();
        } else {
          showMessage('Download failed!', 'error');
        }
      })
      .catch(() => showMessage('Download failed!', 'error'));
  };

  const fetchLessonStatList = async () => {
    if (!studentGroup?.class_academic_year) return;
    setFetching(true);
    try {
      const response = await API.studentGroupLesson.GetLessonStatList(studentGroupId, {
        academic_year: studentGroup?.class_academic_year,
        search: filters.search,
        start_date: filters.start_date,
        end_date: filters.end_date,
        lesson_id: filters.lesson_id,
        sub_lesson_id: filters.sub_lesson_id,
        page: pagination.page,
        limit: pagination.limit,
      });
      if (response?.status_code === 200) {
        setData(response.data);
        setPagination((prev) => ({
          ...prev,
          total_count: response._pagination.total_count,
        }));
      }
    } catch (err) {
      console.error('Error fetching lesson stats:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLessonStatList();
  }, [
    studentGroupId,
    studentGroup?.class_academic_year,
    filters,
    pagination.limit,
    pagination.page,
  ]);

  useEffect(() => {
    API.other.GetAcademicYears().then((res) => {
      if (res.status_code === 200) setAcademicYears(res.data);
    });
    API.studentGroupInfo.GetStudyGroupById(+studentGroupId).then((res) => {
      if (res.status_code === 200)
        setStudentGroup(Array.isArray(res.data) ? res.data[0] : res.data);
    });
  }, [studentGroupId]);

  useEffect(() => {
    if (studentGroup?.class_academic_year) {
      API.studentGroupLesson
        .GetLessonParams(studentGroupId, {
          academic_year: studentGroup?.class_academic_year,
        })
        .then((res) => {
          if (res.status_code === 200) {
            const options = res.data.map((lesson) => ({
              value: lesson.id,
              label: lesson.label,
            }));
            setLessonOptions(options);
          } else {
            showMessage('Failed to fetch lesson params', 'error');
          }
        });
    }
  }, [studentGroupId, studentGroup?.class_academic_year]);

  useEffect(() => {
    if (filters.lesson_id) {
      API.studentGroupLesson
        .GetSubLessonParams(studentGroupId, filters.lesson_id)
        .then((res) => {
          if (res.status_code === 200) {
            const options = res.data.map((lesson) => ({
              value: lesson.id,
              label: lesson.label,
            }));
            setSubLessonOptions(options);
          } else {
            showMessage('Failed to fetch sub-lesson params', 'error');
          }
        });
    }
  }, [filters.academic_year, filters.lesson_id, studentGroupId]);

  const columns = useMemo<DataTableColumn<LessonStatList>[]>(() => {
    const columns: DataTableColumn<LessonStatList>[] = [
      {
        accessor: 'view',
        title: 'ดูคำถาม',
        titleClassName: 'text-center',
        render: (record: LessonStatList) => (
          <div
            className="flex w-full cursor-pointer justify-center"
            onClick={() => {
              setIsModalOpen(true);
              setLevelId(record.level_index);
            }}
          >
            <IconEye />
          </div>
        ),
      },
      {
        accessor: 'index',
        title: '#',
        render: (_, i) => i + 1 + (pagination.page - 1) * pagination.limit,
      },
      { accessor: 'level_index', title: 'ด่านที่' },
      { accessor: 'lesson_name', title: 'บทเรียน' },
      { accessor: 'sub_lesson_name', title: 'บทเรียนย่อย' },
      {
        accessor: 'level_type',
        title: 'ประเภท',
        render: (record) => getLevelType(record?.level_type),
      },
      {
        accessor: 'level_question_type',
        title: 'รูปแบบคำถาม',
        render: (record) => getQuestionType(record?.level_question_type),
      },
      {
        accessor: 'level_difficulty',
        title: 'ระดับ',
        render: (row: LessonStatList) => {
          const text = row.level_difficulty.toLowerCase();
          const statusLabels: { [key: string]: string } = {
            easy: 'ง่าย',
            medium: 'ปานกลาง',
            hard: 'ยาก',
          };

          const badgeClass =
            text === 'easy'
              ? 'success'
              : text === 'medium'
                ? 'warning'
                : text === 'hard'
                  ? 'error'
                  : 'secondary';

          return (
            <span
              className={`badge badge-outline-${badgeClass} flex w-16 items-center justify-center`}
            >
              {statusLabels[text] || 'ไม่ระบุ'}
            </span>
          );
        },
      },
      {
        title: 'คะเเนนรวม (คะแนน)',
        accessor: '',
        titleClassName: 'text-right',
        render: (row: LessonStatList) => (
          <div className="flex flex-col p-2">
            <span className="text-right">
              {Math.floor(row.avg_score_per_level.score)}/{row.avg_score_per_level.total}
            </span>
            <div className="ml-auto w-16">
              <CwProgress
                percent={
                  Math.floor(row.avg_score_per_level.score) /
                  row.avg_score_per_level.total
                }
              />
            </div>
          </div>
        ),
      },
      {
        title: 'ทำข้อสอบ (ครั้ง)',
        accessor: 'total_attempt',
        titleClassName: 'text-right',
        cellsClassName: 'text-right',
      },
      {
        title: 'เวลาเฉลี่ย/ข้อ',
        accessor: 'average_time_used',
        titleClassName: 'text-right',
        cellsClassName: 'text-right',
        render: ({ average_time_used }) => formatTimeString(average_time_used),
      },
    ];
    return columns;
  }, [pagination.page, pagination.limit]);

  const resetPage = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <>
      <div className="bg-[#F5F5F5] p-5 shadow-sm">
        <h1 className="text-2xl font-bold">{studentGroup?.name}</h1>
        <h2>
          ปีการศึกษา: {studentGroup?.class_academic_year} / {studentGroup?.subject_name} /{' '}
          {studentGroup?.class_year} / ห้อง {studentGroup?.class_name}
        </h2>
      </div>

      <div className="panel flex flex-col gap-5">
        <CWOHeaderTableButton
          showBulkEditButton={false}
          onDownload={(data) => onDownload(data.dateFrom, data.dateTo)}
          onSearchChange={(e) => {
            setFilters((prev) => ({ ...prev, search: e.target.value }));
            resetPage();
          }}
          showUploadButton={false}
        />

        <div className="flex w-fit flex-wrap gap-2">
          {/* <CWSelect
            title={`ข้อมูลปัจจุบัน (${new Date().getFullYear() + 543})`}
            value={filters.academic_year}
            options={academicYears.map((year) => ({
              label: String(year),
              value: String(year),
            }))}
            className="min-w-48"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, academic_year: e.target.value }))
            }
          /> */}
          <CWMDaterange
            onChange={(e) => {
              const startDate = e[0]?.toISOString().split('T')[0] || '';
              const endDate = e[1]?.toISOString().split('T')[0] || '';
              setFilters((prev) => ({
                ...prev,
                start_date: startDate,
                end_date: endDate,
              }));
              resetPage();
            }}
          />
          <CWSelect
            title="บทเรียน"
            value={filters.lesson_id}
            options={lessonOptions}
            className="min-w-48"
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, lesson_id: e.target.value }));
              resetPage();
            }}
          />
          <CWSelect
            title="บทเรียนย่อย"
            value={filters.sub_lesson_id}
            options={subLessonOptions}
            className="min-w-48"
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, sub_lesson_id: e.target.value }));
              resetPage();
            }}
            disabled={!filters.academic_year && !filters.lesson_id}
          />
        </div>

        <DataTable
          idAccessor="index"
          className="table-hover whitespace-nowrap"
          records={data}
          columns={columns}
          highlightOnHover
          withTableBorder
          withColumnBorders
          height={'calc(100vh - 350px)'}
          noRecordsText="ไม่พบข้อมูล"
          fetching={fetching}
          loaderType="oval"
          loaderBackgroundBlur={4}
          totalRecords={pagination.total_count}
          page={pagination.page}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          recordsPerPage={pagination.limit}
          onRecordsPerPageChange={(limit: number) =>
            setPagination((prev) => ({ ...prev, page: 1, limit }))
          }
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
          }
          recordsPerPageOptions={pageSizeOptions}
        />
        <CWModalQuestionView
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          levelId={levelId}
        />
      </div>
    </>
  );
};

export default TeacherStudentGroupLesson;
