import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataTableColumn } from 'mantine-datatable';
import { useParams } from '@tanstack/react-router';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
dayjs.extend(buddhistEra);

import API from '@domain/g03/g03-d03/local/api';
import showMessage from '@global/utils/showMessage';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import { toDateTimeTH } from '@global/utils/date';
import CwProgress from '@component/web/cw-progress';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import { GetStudyGroupStatListResponse } from '@domain/g03/g03-d03/local/api/group/student-score/type';
import downloadCSV from '@global/utils/downloadCSV';
import CWModalQuestionView from '@component/web/cw-modal/cw-modal-question-view';
import { formatTimeString } from '@global/utils/format/time';
import { TPagination } from '@global/types/api';
import usePagination from '@global/hooks/usePagination';

interface Props {
  setSubTabScore: (value: number) => void;
  titleLesson: {
    curriculum_group_short_name?: string;
    subject_name?: string;
    lesson_name?: string;
    sub_lesson_name?: string;
    sub_lesson_id?: string;
  };
  subTabScore: number;
}

const CwLevel = ({ setSubTabScore, titleLesson, subTabScore }: Props) => {
  const { studentGroupId } = useParams({ strict: false });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isFetching, setFetching] = useState<boolean>(false);
  const [levelId, setLevelId] = useState<number>(0);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [optionAcademicYear, setOptionAcademicYear] = useState<
    { value: number; label: string }[]
  >([]);

  const [optionLevelType] = useState<{ value: string; label: string }[]>([
    { value: 'test', label: 'แบบฝึกหัด' },
    { value: 'sub-lesson-post-test', label: 'แบบฝึกหัดท้ายบทเรียนย่อย' },
    { value: 'pre-post-test', label: 'แบบฝึกหัดก่อนเรียน' },
  ]);

  const [optionDifficulty] = useState<{ value: string; label: string }[]>([
    { value: 'easy', label: 'ง่าย' },
    { value: 'medium', label: 'ปานกลาง' },
    { value: 'hard', label: 'ยาก' },
  ]);

  const [filters, setFilters] = useState<
    Partial<{
      academic_year: number;
      start_date: string;
      end_date: string;
      sub_lesson_id: string;
      search: string;
      difficulty: string;
      level_type: string;
    }>
  >({
    sub_lesson_id: titleLesson.sub_lesson_id,
  });
  const [records, setRecords] = useState<GetStudyGroupStatListResponse[]>([]);

  useEffect(() => {
    if (subTabScore === 2) {
      API.studentGroupScore
        .GetStatOptions('academic-year', studentGroupId)
        .then((res) => {
          if (res.status_code == 200) {
            setOptionAcademicYear(
              res.data?.values.map((item) => ({
                label: `ข้อมูลย้อนหลัง (${item.label})`,
                value: item.id,
              })),
            );
          }
        });
    }
  }, [titleLesson, subTabScore]);

  useEffect(() => {
    setFetching(true);
    API.studentGroupScore
      .GetLevelStatList(+studentGroupId, {
        ...filters,
        academic_year: filters.academic_year || undefined,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
        search: filters.search || undefined,
        sub_lesson_id: filters.sub_lesson_id || undefined,
        page: pagination.page,
        limit: pagination.limit,
      })
      .then((res) => {
        if (res.status_code == 200) {
          setRecords(res.data);
          setPagination((prev) => ({
            ...prev,
            total_count: res?._pagination?.total_count ?? res.data?.length,
          }));
        } else {
          showMessage(res.message, 'error');
        }
        setFetching(false);
      });
  }, [studentGroupId, filters]);

  const Download = useCallback(
    (data: { start_date: string; end_date: string }) => {
      if (data.start_date && data.end_date) {
        API.studentGroupScore
          .DownloadLevelStatCSV(+studentGroupId, {
            ...filters,
            academic_year: filters.academic_year || undefined,
            start_date: data.start_date || undefined,
            end_date: data.end_date || undefined,
            sub_lesson_id: filters.sub_lesson_id || undefined,
            search: filters.search || undefined,
          })
          .then((res) => {
            if (res instanceof Blob) {
              downloadCSV(res, 'student-group-level-stat.csv');
            } else {
              showMessage(res.message, 'error');
            }
          });
      } else {
        showMessage('กรุณาเลือกวันที่ก่อน', 'warning');
      }
    },
    [studentGroupId, filters, titleLesson],
  );

  const rowColumns = useMemo<DataTableColumn<GetStudyGroupStatListResponse>[]>(
    () => [
      {
        title: 'ดูคำถาม',
        accessor: '',
        render: (record) => {
          return (
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setLevelId(record.level_id);
                  setOpenModal(true);
                }}
              >
                <IconEye />
              </button>
            </div>
          );
        },
      },
      {
        accessor: 'index',
        title: '#',
        render: (_, index) => index + 1 + (pagination.page - 1) * pagination.limit,
      },
      {
        title: 'ด่านที่',
        titleClassName: 'text-right',
        cellsClassName: 'text-right',
        accessor: 'level_index',
      },
      {
        title: 'ประเภท',
        accessor: 'level_type',

        render: ({ level_type }) => (
          <>
            {level_type === 'test' && <span>แบบฝึกหัด</span>}
            {level_type === 'pre-post-test' && <span>แบบฝึกหัดก่อนเรียน</span>}
            {level_type === 'sub-lesson-post-test' && (
              <span>แบบฝึกหัดท้ายบทเรียนย่อย</span>
            )}
          </>
        ),
      },
      {
        title: 'รูปแบบคำถาม',
        accessor: 'question_type',
      },
      {
        title: 'ระดับ',
        accessor: 'difficulty',
        render: ({ difficulty }) => (
          <>
            {difficulty === 'easy' && (
              <span className="rounded border border-success px-2 text-success">
                ง่าย
              </span>
            )}
            {difficulty === 'medium' && (
              <span className="rounded border border-warning px-2 text-warning">
                ปานกลาง
              </span>
            )}
            {difficulty === 'hard' && (
              <span className="rounded border border-danger px-2 text-danger">ยาก</span>
            )}
          </>
        ),
      },
      {
        title: 'คะแนนรวมเฉลี่ย (คะแนน)',
        accessor: 'total_score',
        render: ({ total_score }) => {
          return (
            <div className="flex flex-col">
              <span className="text-right">
                {total_score?.value}/{total_score?.total}
              </span>
              <div className="ml-auto w-16">
                <CwProgress percent={total_score?.value / total_score?.total} />
              </div>
            </div>
          );
        },
      },
      {
        title: 'ทำข้อสอบแล้ว (คน)',
        accessor: 'total_score',
        render: ({ user_play_count }) => {
          return (
            <div className="flex flex-col">
              <span className="text-right">
                {user_play_count?.value}/{user_play_count?.total}
              </span>
              <div className="ml-auto w-16">
                <CwProgress percent={user_play_count?.value / user_play_count?.total} />
              </div>
            </div>
          );
        },
      },
      {
        title: 'ทำข้อสอบโดยเฉลี่ย (ครั้ง)',
        accessor: 'average_total_attempt',
        titleClassName: 'text-right',
        cellsClassName: 'text-right',
        render: ({ average_total_attempt }) =>
          new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }).format(average_total_attempt),
      },
      {
        title: 'ทำข้อสอบแล้ว (ครั้ง)',
        accessor: 'total_attempt',
        titleClassName: 'text-right',
        cellsClassName: 'text-right',
        render: ({ total_attempt }) =>
          new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }).format(total_attempt),
      },
      {
        title: 'เวลาเฉลี่ย/ข้อ',
        accessor: 'average_time_used',
        titleClassName: 'text-right',
        cellsClassName: 'text-right',
        render: ({ average_time_used }) => formatTimeString(average_time_used),
      },
      {
        title: 'ทำข้อสอบล่าสุด',
        accessor: 'last_played_at',
        render: ({ last_played_at }) => {
          return last_played_at ? toDateTimeTH(last_played_at) : '-';
        },
      },
    ],
    [pagination.limit, pagination.page],
  );

  function toDateEN(date: Date) {
    return (
      date
        ?.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .split('/')
        .reverse()
        .join('-') || ''
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-[10px] rounded-[10px] p-[10px]">
        <div className="flex items-center gap-[10px]">
          <div className="hover:cursor-pointer" onClick={() => setSubTabScore(1)}>
            <IconArrowBackward />
          </div>
          <p className="text-xl font-bold">
            {`${titleLesson.curriculum_group_short_name} / ${titleLesson.subject_name} / ${titleLesson.lesson_name} / ${titleLesson.sub_lesson_name}`}
          </p>
        </div>
      </div>
      <CWTableTemplate
        header={{
          showBulkEditButton: false,
          showUploadButton: false,
          onSearchChange(e) {
            const value = e.currentTarget.value;
            setFilters((prev) => ({
              ...prev,
              search: value,
            }));
          },
          onDownload(data) {
            Download({
              start_date: data.dateFrom,
              end_date: data.dateTo,
            });
          },
        }}
        filters={[
          {
            key: 'academic_year',
            options: optionAcademicYear,
            value: filters.academic_year,
            onChange(value) {
              setFilters((prev) => ({
                ...prev,
                academic_year: value,
              }));
            },
          },
          {
            key: 'academic_year_range',
            type: 'date-range',
            value: [filters.start_date, filters.end_date],
            onChange(value) {
              setFilters((prev) => ({
                ...prev,
                start_date: toDateEN(value[0]),
                end_date: toDateEN(value[1]),
              }));
            },
          },
          {
            key: 'level_type',
            options: optionLevelType,
            value: filters.level_type,
            onChange(value) {
              setFilters((prev) => ({
                ...prev,
                level_type: value,
              }));
            },
            placeholder: 'ประเภท',
          },
          {
            key: 'difficulty',
            options: optionDifficulty,
            value: filters.difficulty,
            onChange(value) {
              setFilters((prev) => ({
                ...prev,
                difficulty: value,
              }));
            },
            placeholder: 'ระดับ',
          },
        ]}
        table={{
          minHeight: 400,
          records,
          columns: rowColumns,
          fetching: isFetching,
          page: pagination.page,
          limit: pagination.limit,
          onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
          onLimitChange: (limit) =>
            setPagination((prev) => ({ ...prev, page: 1, limit })),
          options: pageSizeOptions,
          totalRecords: pagination.total_count,
        }}
      />
      <CWModalQuestionView
        open={openModal}
        onClose={() => setOpenModal(false)}
        levelId={levelId}
      />
    </div>
  );
};

export default CwLevel;
