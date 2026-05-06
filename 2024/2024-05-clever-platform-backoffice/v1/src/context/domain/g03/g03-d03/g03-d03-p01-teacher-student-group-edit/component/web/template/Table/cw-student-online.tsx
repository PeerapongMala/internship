import CWSelect from '@component/web/cw-select';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import CWPagination from '../../organism/cw-pagination';
import {
  DashboradProp,
  FlattenedNotStudentLogin,
  LastStudentLogin,
} from '@domain/g03/g03-d03/local/api/group/student-overview/types';
import API from '@domain/g03/g03-d03/local/api';
import WCADropdown from '@domain/g03/g03-d01/local/components/web/atom/WCADropdown';

export interface ScoreMax {
  id: number;
  first_name: string;
  last_name: string;
  subject_name: string;
  lesson_name: string;
  score: number;
}

const CWStudentOnline = ({
  study_group_id,
  lesson_ids,
  sub_lesson_ids,
}: DashboradProp) => {
  const score = 2;
  const scoreLimit = 20;
  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<LastStudentLogin[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total_count: 0 });
  const [selectedRange, setSelectedRange] = useState<string>('7days');
  const [dateRange, setDateRange] = useState<{ start_at: string; end_at: string }>({
    start_at: '',
    end_at: '',
  });
  const DATE_RANGE_OPTIONS = [
    { value: '3days', label: '3 วันล่าสุด' },
    { value: '7days', label: '7 วันล่าสุด' },
    { value: '15days', label: '15 วันล่าสุด' },
    { value: '30days', label: '30 วันล่าสุด' },
  ];

  const getISODateString = (date: Date) => {
    return date.toISOString();
  };

  const calculateDateRange = (range: string) => {
    const now = new Date();
    const endAt = new Date(now.setHours(23, 59, 59, 999));
    const startAt = new Date();

    let days = 7;
    switch (range) {
      case '3days':
        days = 3;
        break;
      case '15days':
        days = 15;
        break;
      case '30days':
        days = 30;
        break;
      default:
        days = 7;
    }

    startAt.setDate(endAt.getDate() - days);
    startAt.setHours(0, 0, 0, 0);

    setDateRange({
      start_at: getISODateString(startAt),
      end_at: getISODateString(endAt),
    });
  };

  const handleDateRangeChange = (value: string | number) => {
    const range = typeof value === 'string' ? value : value.toString();
    setSelectedRange(range);
    calculateDateRange(range);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    calculateDateRange(selectedRange);
  }, []);
  const getPlaceholder = () => {
    const selectedOption = DATE_RANGE_OPTIONS.find((opt) => opt.value === selectedRange);
    return selectedOption ? selectedOption.label : 'เลือกช่วงเวลา';
  };

  useEffect(() => {
    if (dateRange.start_at && dateRange.end_at) {
      fetchNotPlayStudent();
    }
  }, [study_group_id, dateRange, pagination.page]);

  const fetchNotPlayStudent = async () => {
    if (!study_group_id) return;

    try {
      setFetching(true);
      const res = await API.studentOverviewRestAPI.GetA06({
        study_group_id: study_group_id,
        start_at: dateRange.start_at,
        end_at: dateRange.end_at,
      });

      if (res.status_code === 200) {
        setRecords(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="h-[380px] w-full">
      <div className="w-full border-b-2 border-neutral-100 px-2 py-3">
        <h1 className="font-bold">นักเรียนที่ใช้งาน</h1>
      </div>
      <div className="flex w-full flex-col px-5">
        <div className="mt-5 flex gap-5">
          <WCADropdown
            placeholder={getPlaceholder()}
            options={DATE_RANGE_OPTIONS}
            onSelect={handleDateRangeChange}
          />
        </div>
        <div className="mt-5 flex w-full text-2xl font-semibold">
          <p>{records[0]?.last_logged_in_student_count}</p>/
          <p>{records[0]?.total_student} คน</p>
        </div>
      </div>
    </div>
  );
};

export default CWStudentOnline;
