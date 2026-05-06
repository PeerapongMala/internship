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
import { formatTimeString } from '@global/utils/format/time';
import { TPagination } from '@global/types/api';
import usePagination from '@global/hooks/usePagination';

interface Props {
  setSubTabScore: (value: number) => void;
  setTitleLesson: (value: {
    curriculum_group_short_name?: string;
    subject_name?: string;
    lesson_name?: string;
    lesson_id?: string;
    sub_lesson_name?: string;
    sub_lesson_id?: string;
  }) => void;
  titleLesson: {
    curriculum_group_short_name?: string;
    subject_name?: string;
    lesson_name?: string;
    lesson_id?: string;
    sub_lesson_name?: string;
    sub_lesson_id?: string;
  };
  subTabScore: number;
}
const CwSubLesson = ({
  setSubTabScore,
  setTitleLesson,
  titleLesson,
  subTabScore,
}: Props) => {
  const { studentGroupId } = useParams({ strict: false });
  const [isFetching, setFetching] = useState<boolean>(false);
  const [optionAcademicYear, setOptionAcademicYear] = useState<
    { value: number; label: string }[]
  >([]);

  const [optionSubLessons, setOptionSubLessons] = useState<
    { value: number; label: string }[]
  >([]);

  const [filters, setFilters] = useState<
    Partial<{
      academic_year: number;
      start_date: string;
      end_date: string;
      sub_lesson_id: string;
      search: string;
      lesson_id: string;
    }>
  >({
    lesson_id: titleLesson.lesson_id,
  });

  const [records, setRecords] = useState<GetStudyGroupStatListResponse[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  useEffect(() => {
    if (subTabScore === 1) {
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
      API.studentGroupScore
        .GetSubLessonStatOptions(
          'sub-lesson',
          studentGroupId,
          Number(titleLesson?.lesson_id),
        )
        .then((res) => {
          if (res.status_code == 200) {
            setOptionSubLessons(
              res.data?.values.map((item) => ({
                value: item.id,
                label: item.label,
              })),
            );
          }
        });
    }
  }, [titleLesson, subTabScore]);

  useEffect(() => {
    setFetching(true);
    API.studentGroupScore
      .GetStatSubLessonList(+studentGroupId, {
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
            total_count: res._pagination.total_count,
          }));
        } else {
          showMessage(res.message, 'error');
        }
        setFetching(false);
      });
  }, [studentGroupId, filters, pagination.page, pagination.limit]);

  const Download = useCallback(
    (data: { start_date: string; end_date: string }) => {
      if (data.start_date && data.end_date) {
        API.studentGroupScore
          .DownloadSubLessonStatCSV(+studentGroupId, {
            ...filters,
            academic_year: filters.academic_year || undefined,
            start_date: data.start_date || undefined,
            end_date: data.end_date || undefined,
            sub_lesson_id: filters.sub_lesson_id || undefined,
            search: filters.search || undefined,
          })
          .then((res) => {
            if (res instanceof Blob) {
              downloadCSV(res, 'student-group-sub-lesson-stat.csv');
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
        title: 'ดูข้อมูล',
        accessor: 'view',
        textAlign: 'center',
        width: 100,
        render: (record) => {
          return (
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setSubTabScore(2);
                  setTitleLesson({
                    curriculum_group_short_name: titleLesson.curriculum_group_short_name,
                    subject_name: titleLesson.subject_name,
                    lesson_name: titleLesson.lesson_name,
                    lesson_id: titleLesson.lesson_id,
                    sub_lesson_name: record.sub_lesson_name,
                    sub_lesson_id: record.sub_lesson_id.toString(),
                  });
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
        width: 50,
        render: (_, index) => index + 1 + (pagination.page - 1) * pagination.limit,
      },
      {
        title: 'บทเรียนย่อย',
        accessor: 'sub_lesson_name',
        width: 180,
      },
      {
        title: 'ด่านที่ผ่านเฉลี่ย (ด่าน)',
        accessor: 'total_passed_level',
        width: 200,
        titleClassName: 'text-right',
        cellsClassName: 'text-right',
        render: ({ total_passed_level }) => {
          return (
            <div className="flex flex-col items-end">
              <span className="">
                {total_passed_level?.value}/{total_passed_level?.total}
              </span>
              <div className="w-16">
                <CwProgress
                  percent={total_passed_level?.value / total_passed_level?.total}
                />
              </div>
            </div>
          );
        },
      },
      {
        title: 'คะแนนรวมเฉลี่ย (คะแนน)',
        accessor: 'total_score',
        width: 200,
        titleClassName: 'text-right',
        cellsClassName: 'text-right',
        render: ({ total_score }) => {
          return (
            <div className="flex flex-col items-end">
              <span className="">
                {total_score?.value}/{total_score?.total}
              </span>
              <div className="w-16">
                <CwProgress percent={total_score?.value / total_score?.total} />
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
        width: 200,
        render: ({ average_total_attempt }) =>
          new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }).format(average_total_attempt),
      },
      {
        title: 'เวลาเฉลี่ย/ข้อ',
        accessor: 'average_time_used',
        titleClassName: 'text-right',
        cellsClassName: 'text-right',
        width: 200,
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
    [pagination.limit, pagination.page, setSubTabScore, setTitleLesson, titleLesson],
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
          <div className="hover:cursor-pointer" onClick={() => setSubTabScore(0)}>
            <IconArrowBackward />
          </div>
          <p className="text-xl font-bold">
            {`${titleLesson.curriculum_group_short_name} / ${titleLesson.subject_name} / ${titleLesson.lesson_name}`}
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
            key: 'sub_lesson_id',
            options: optionSubLessons,
            value: filters.sub_lesson_id,
            onChange(value) {
              setFilters((prev) => ({
                ...prev,
                sub_lesson_id: value,
              }));
            },
            placeholder: 'บทเรียนย่อย',
          },
        ]}
        table={
          records.length > 0
            ? {
                minHeight: 400,
                records,
                columns: rowColumns,
                fetching: isFetching,
                page: pagination.page,
                limit: pagination.limit,
                totalRecords: pagination.total_count,
                onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
                onLimitChange: (limit) =>
                  setPagination((prev) => ({ ...prev, page: 1, limit })),
                options: pageSizeOptions,
              }
            : {
                minHeight: 400,
                records: [],
                columns: rowColumns,
                fetching: isFetching,
                noRecordsText: 'ไม่พบข้อมูล',
              }
        }
      />
    </div>
  );
};

export default CwSubLesson;
