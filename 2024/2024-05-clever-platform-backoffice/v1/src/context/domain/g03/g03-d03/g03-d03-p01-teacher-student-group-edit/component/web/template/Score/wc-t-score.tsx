import { useCallback, useEffect, useState } from 'react';
import { DataTableColumn } from 'mantine-datatable';
import { useParams } from '@tanstack/react-router';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
dayjs.extend(buddhistEra);

import API from '@domain/g03/g03-d03/local/api';
import API0301 from '@domain/g03/g03-d01/local/api';
import downloadCSV from '@global/utils/downloadCSV';
import showMessage from '@global/utils/showMessage';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import { toDateTimeTH } from '@global/utils/date';
import CwProgress from '@component/web/cw-progress';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import { GetStudyGroupStatListResponse } from '@domain/g03/g03-d03/local/api/group/student-score/type';
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
  }) => void;
}

interface AcademicYearInfo {
  academic_year: number;
  start_date: string;
  end_date: string;
}

const CwScore = ({ setSubTabScore, setTitleLesson }: Props) => {
  const { studentGroupId } = useParams({ strict: false });
  const [isFetching, setFetching] = useState<boolean>(false);

  const [academicYears, setAcademicYears] = useState<AcademicYearInfo[]>([]);

  const [optionSubjects, setOptionSubjects] = useState<
    { value: string | number; label: string }[]
  >([]);
  const [optionLessons, setOptionLessons] = useState<
    { value: string | number; label: string }[]
  >([]);

  const [filters, setFilters] = useState<
    Partial<{
      academic_year: string;
      start_date: string;
      end_date: string;
      subject_id: string;
      lesson_id: string;
      search: string;
    }>
  >({});

  const [records, setRecords] = useState<GetStudyGroupStatListResponse[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  function toDateEN(date: Date | string | undefined | null): string {
    if (!date) return '';
    return (
      new Date(date)
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .split('/')
        .reverse()
        .join('-') || ''
    );
  }

  useEffect(() => {
    API0301.dashboard.GetA01({ limit: -1 }).then((res) => {
      if (res.status_code == 200) {
        setAcademicYears(res.data);

        // ปีปัจจุบัน
        const currentYear = new Date().getFullYear() + 543;
        const currentYearIndex = res.data.findIndex(
          (year) => year.academic_year === currentYear,
        );

        if (currentYearIndex !== -1) {
          setFilters((prev) => ({
            ...prev,
            academic_year: String(currentYear),
            start_date: toDateEN(res.data[currentYearIndex].start_date),
            end_date: toDateEN(res.data[currentYearIndex].end_date),
          }));
        }
      }
    });

    API.studentGroupScore.GetStatOptions('subject', studentGroupId).then((res) => {
      if (res.status_code == 200 && res.data?.values) {
        setOptionSubjects(
          res.data.values.map((item: any) => ({
            value: String(item.id), // Ensure value is string if needed by CWTableTemplate
            label: item.label,
          })),
        );
      }
    });

    API.studentGroupScore.GetStatOptions('lesson', studentGroupId).then((res) => {
      if (res.status_code == 200 && res.data?.values) {
        setOptionLessons(
          res.data.values.map((item: any) => ({
            value: String(item.id), // Ensure value is string if needed by CWTableTemplate
            label: item.label,
          })),
        );
      }
    });
  }, [studentGroupId]);

  useEffect(() => {
    setFetching(true);
    API.studentGroupScore
      .GetLessonStatList(+studentGroupId, {
        subject_id: filters.subject_id || undefined,
        lesson_id: filters.lesson_id || undefined,
        start_date: filters?.start_date || undefined,
        end_date: filters?.end_date || undefined,
        search: filters.search || undefined,
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
      if (filters?.academic_year || (data?.start_date && data?.end_date)) {
        API.studentGroupScore
          .DownloadStatCSV(+studentGroupId, {
            academic_year: Number(filters?.academic_year) || undefined,
            subject_id: filters.subject_id || undefined,
            lesson_id: filters.lesson_id || undefined,
            start_date: filters?.start_date || data?.start_date || undefined,
            end_date: filters?.end_date || data?.end_date || undefined,
            search: filters.search || undefined,
          })
          .then((res) => {
            if (res instanceof Blob) {
              downloadCSV(res, 'student-group-score.csv');
            } else {
              showMessage(res.message, 'error');
            }
          });
      } else {
        showMessage('กรุณาเลือกปีการศึกษาหรือช่วงวันทีก่อน', 'warning');
      }
    },
    [studentGroupId, filters],
  );

  const rowColumns: DataTableColumn<GetStudyGroupStatListResponse>[] = [
    {
      title: 'ดูข้อมูล',
      accessor: 'actions',
      textAlign: 'center',
      width: 100,
      render: (record) => (
        <div className="flex w-full justify-center">
          <button
            onClick={() => {
              setSubTabScore(record?.lesson_index);
              setTitleLesson({
                curriculum_group_short_name: record?.curriculum_group_short_name,
                subject_name: record?.subject_name,
                lesson_name: record?.lesson_name,
                sub_lesson_name: '',
                lesson_id: record?.lesson_id?.toString(),
              });
            }}
          >
            <IconEye />
          </button>
        </div>
      ),
    },
    {
      accessor: 'index',
      title: '#',
      width: 50,
      render: (_, index) => (pagination.page - 1) * pagination.limit + index + 1,
    },
    { title: 'บทเรียน', accessor: 'lesson_name' },
    {
      title: 'ด่านที่ผ่านเฉลี่ย (ด่าน)',
      accessor: 'total_passed_level',
      textAlign: 'right',
      width: 200,
      render: ({ total_passed_level }) => {
        const value = total_passed_level?.value || 0;
        const total = total_passed_level?.total || 0;
        return (
          <div className="flex flex-col items-end">
            <span>{`${value}/${total}`}</span>
            <div className="w-16">
              <CwProgress percent={total === 0 ? 0 : value / total} />
            </div>
          </div>
        );
      },
    },
    {
      title: 'คะแนนรวมเฉลี่ย (คะแนน)',
      accessor: 'total_score',
      textAlign: 'right',
      width: 200,
      render: ({ total_score }) => {
        const value = total_score?.value || 0;
        const total = total_score?.total || 0;
        return (
          <div className="flex flex-col items-end">
            <span>{`${value}/${total}`}</span>
            <div className="w-16">
              <CwProgress percent={total === 0 ? 0 : value / total} />
            </div>
          </div>
        );
      },
    },
    {
      title: 'ทำข้อสอบโดยเฉลี่ย (ครั้ง)',
      accessor: 'average_total_attempt',
      width: 200,
      titleClassName: 'text-right',
      cellsClassName: 'text-right',
      render: ({ average_total_attempt }) =>
        new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(average_total_attempt || 0),
    },
    {
      title: 'เวลาเฉลี่ย/ข้อ',
      accessor: 'average_time_used',
      width: 150,
      titleClassName: 'text-right',
      cellsClassName: 'text-right',
      render: ({ average_time_used }) => formatTimeString(average_time_used),
    },
    {
      title: 'ทำข้อสอบล่าสุด',
      accessor: 'last_played_at',
      render: ({ last_played_at }) =>
        last_played_at ? toDateTimeTH(last_played_at) : '-',
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <CWTableTemplate
        header={{
          showBulkEditButton: false,
          showUploadButton: false,
          onSearchChange(e) {
            const value = e.currentTarget.value;
            setFilters((prev) => ({ ...prev, search: value }));
            setPagination((prev) => ({ ...prev, page: 1 }));
          },
          onDownload(data) {
            Download({ start_date: data.dateFrom, end_date: data.dateTo });
          },
        }}
        filters={[
          {
            key: 'academic_year',
            options: academicYears.map((year, i) => {
              let value = i;
              let label = year.academic_year.toString();
              const currentDate = new Date();
              if (currentDate.getFullYear() + 543 === year.academic_year) {
                label = `ข้อมูลปีปัจจุบัน (${year.academic_year})`;
                if (!filters.academic_year) {
                  setFilters((prev) => ({
                    ...prev,
                    academic_year: String(year.academic_year),
                    start_date: toDateEN(year.start_date),
                    end_date: toDateEN(year.end_date),
                  }));
                }
              }
              return { label, value };
            }),
            value: academicYears.findIndex(
              (aYear) => String(aYear.academic_year) === filters?.academic_year,
            ),
            onChange(index: number | null) {
              if (index === null || index < 0) {
                setFilters((prev) => ({
                  ...prev,
                  academic_year: undefined,
                  start_date: undefined,
                  end_date: undefined,
                }));
                setPagination((prev) => ({ ...prev, page: 1 }));
                return;
              }
              const selectedYearInfo: AcademicYearInfo = academicYears[index];
              setFilters((prev) => ({
                ...prev,
                academic_year: String(selectedYearInfo?.academic_year),
                start_date: toDateEN(selectedYearInfo?.start_date),
                end_date: toDateEN(selectedYearInfo?.end_date),
              }));
            },
            placeholder: 'ปีการศึกษา',
          },
          {
            key: 'academic_year_range',
            type: 'date-range',
            value: [filters?.start_date || undefined, filters?.end_date || undefined],
            onChange(value: [Date | null, Date | null]) {
              setFilters((prev) => ({
                ...prev,
                academic_year: undefined,
                start_date: value[0] ? toDateEN(value[0]) : undefined,
                end_date: value[1] ? toDateEN(value[1]) : undefined,
              }));
              setPagination((prev) => ({ ...prev, page: 1 }));
            },
          },
          {
            key: 'subject_id',
            options: optionSubjects,
            value: filters.subject_id,
            onChange(value: string | null) {
              setFilters((prev) => ({ ...prev, subject_id: value ?? undefined }));
              setPagination((prev) => ({ ...prev, page: 1 }));
            },
            placeholder: 'วิชา',
          },
          {
            key: 'lesson_id',
            options: optionLessons,
            value: filters.lesson_id,
            onChange(value: string | null) {
              setFilters((prev) => ({ ...prev, lesson_id: value ?? undefined }));
              setPagination((prev) => ({ ...prev, page: 1 }));
            },
            placeholder: 'บทเรียน',
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
                onLimitChange: (limit) =>
                  setPagination((prev) => ({ ...prev, page: 1, limit })),
                onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
                options: pageSizeOptions,
                noRecordsText: 'ไม่พบข้อมูล',
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

export default CwScore;
