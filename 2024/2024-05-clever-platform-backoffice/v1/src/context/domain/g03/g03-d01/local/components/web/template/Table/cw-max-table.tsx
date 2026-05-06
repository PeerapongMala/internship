import { DashboradProp, Lesson, ScoreMax, Subject } from '@domain/g03/g03-d01/local/type';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import CWPagination from '../../organism/cw-pagination';
import API from '@domain/g03/g03-d01/local/api';

const CWTableMax = ({
  academicYear,
  year,
  classroom,
  subject_id,
  lesson_id,
}: DashboradProp) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [allRecords, setAllRecords] = useState<ScoreMax[]>([]);
  const [page, setPage] = useState(1);
  const recordsPerPage = 5;

  const shouldFetch = useMemo(() => {
    return lesson_id;
  }, [lesson_id]);

  useEffect(() => {
    setPage(1);
  }, [lesson_id]);

  useEffect(() => {
    if (shouldFetch) {
      fetchMaxStudent();
    }
  }, [shouldFetch]);

  const fetchMaxStudent = async () => {
    if (!classroom || classroom.length === 0 || !subject_id || !lesson_id) {
      return;
    }
    try {
      setFetching(true);
      const res = await API.dashboard.GetA11({
        class_ids: classroom,
        subject_ids: subject_id,
        lesson_ids: lesson_id,
        limit: 10,
        page: 1,
      });
      if (res.status_code === 200) {
        setAllRecords(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setFetching(false);
    }
  };

  const currentPageRecords = useMemo(() => {
    const startIndex = (page - 1) * recordsPerPage;
    return allRecords.slice(startIndex, startIndex + recordsPerPage);
  }, [allRecords, page]);

  const columnDefs = useMemo<DataTableColumn<ScoreMax>[]>(() => {
    return [
      {
        accessor: 'index',
        title: '#',
        render: (record, index) => {
          const startIndex = (page - 1) * recordsPerPage;
          return startIndex + index + 1;
        },
      },
      {
        accessor: 'name',
        title: 'ชื่อ - นามสกุล',
        render: (record) => `${record.name}`,
      },
      {
        accessor: 'score',
        title: 'คะแนน',
        render: (record) => `${record.score} คะแนน`,
      },
    ];
  }, [page]);

  const totalPages = Math.ceil(allRecords.length / recordsPerPage);

  return (
    <div className="mt-5 h-[380px] w-full px-5">
      {!subject_id || subject_id.length === 0 || !lesson_id || lesson_id.length === 0 ? (
        <div className="flex h-[300px] w-full items-center justify-center">
          <div className="text-lg text-gray-500">โปรดเลือกวิชาและบทเรียน</div>
        </div>
      ) : (
        <div className="w-full">
          <div className="h-[300px] w-full">
            <div className="mt-5 w-full">
              {fetching ? (
                <div className="flex h-[200px] w-full items-center justify-center">
                  <div className="text-lg text-gray-500">กำลังโหลดข้อมูล...</div>
                </div>
              ) : (
                <DataTable
                  className="table-hover whitespace-nowrap"
                  columns={columnDefs}
                  records={currentPageRecords}
                  minHeight={200}
                  noRecordsText="ไม่พบข้อมูล"
                />
              )}
            </div>
          </div>
          {allRecords.length > 0 && (
            <CWPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CWTableMax;
