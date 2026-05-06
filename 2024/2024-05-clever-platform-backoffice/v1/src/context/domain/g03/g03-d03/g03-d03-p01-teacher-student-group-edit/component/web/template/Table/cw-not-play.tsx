import CWSelect from '@component/web/cw-select';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import CWPagination from '../../organism/cw-pagination';
import {
  DashboradProp,
  NotStudentLogin,
} from '@domain/g03/g03-d03/local/api/group/student-overview/types';
import API from '@domain/g03/g03-d03/local/api';
import WCADropdown from '@domain/g03/g03-d01/local/components/web/atom/WCADropdown';

interface FlattenedNotStudentLogin extends NotStudentLogin {
  student_id: string;
  name: string;
  originalData: NotStudentLogin;
  index: number;
}
const CWNotplay = ({ study_group_id, lesson_ids, sub_lesson_ids }: DashboradProp) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [records, setRecords] = useState<FlattenedNotStudentLogin[]>([]);
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
  }, [
    study_group_id,
    dateRange,
    pagination.page,
    lesson_ids,
    sub_lesson_ids,
    study_group_id,
  ]);

  const fetchNotPlayStudent = async () => {
    if (!study_group_id || !lesson_ids) return;

    try {
      setFetching(true);
      const res = await API.studentOverviewRestAPI.GetA07({
        study_group_id: study_group_id,
        lesson_ids: lesson_ids,
        sub_lesson_ids: sub_lesson_ids,
        start_at: dateRange.start_at,
        end_at: dateRange.end_at,
        limit: 5,
        page: pagination.page,
      });

      if (res.status_code === 200) {
        const flattenedRecords = res.data.flatMap((item, parentIndex) =>
          item.not_participate_students.map((student, childIndex) => ({
            ...item,
            ...student,
            originalData: item,
            index: parentIndex * item.not_participate_students.length + childIndex + 1,
          })),
        );

        setRecords(flattenedRecords);
        setPagination((prev) => ({
          ...prev,
          total_count: res.data.reduce(
            (sum, item) => sum + item.not_participate_students.length,
            0,
          ),
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };

  const columnDefs = useMemo<DataTableColumn<FlattenedNotStudentLogin>[]>(
    () => [
      {
        accessor: 'index',
        title: '#',
      },
      {
        accessor: 'name',
        title: 'ชื่อ - นามสกุล',
      },
    ],
    [],
  );
  const totalPages = Math.ceil(pagination.total_count / pagination.limit);

  return (
    <div className="h-auto w-full">
      <div className="w-full border-b-2 border-neutral-100 px-2 py-3">
        <h1 className="font-bold">นักเรียนที่ไม่ได้เล่น</h1>
      </div>
      <div className="h-[300px] w-full px-5">
        <div className="mt-5 flex gap-5">
          <WCADropdown
            placeholder={getPlaceholder()}
            options={DATE_RANGE_OPTIONS}
            onSelect={handleDateRangeChange}
          />
        </div>
        <div className="mt-5 w-full">
          <DataTable
            fetching={fetching}
            className="table-hover whitespace-nowrap"
            columns={columnDefs}
            records={records}
            noHeader
            minHeight={200}
            noRecordsText="ไม่พบข้อมูล"
          />
        </div>
      </div>
      {records.length > 0 && (
        <div className="px-5">
          <CWPagination
            currentPage={pagination.page}
            totalPages={totalPages}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          />
        </div>
      )}
    </div>
  );
};

export default CWNotplay;
