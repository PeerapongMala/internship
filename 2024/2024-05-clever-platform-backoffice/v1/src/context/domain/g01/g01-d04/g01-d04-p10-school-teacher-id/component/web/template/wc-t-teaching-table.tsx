import { useEffect, useState } from 'react';
import { TeacherTeachingLogRecord } from '@domain/g01/g01-d04/local/type';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import CWWhiteBox from '@component/web/cw-white-box';
import API from '@domain/g01/g01-d04/local/api';

interface TeachingTableProps {
  teacherId: string;
}

const TeachingTable: React.FC<TeachingTableProps> = ({ teacherId }) => {
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total_count: number;
  }>({
    page: 1,
    limit: PAGE_SIZES[0],
    total_count: 0,
  });
  const [records, setRecords] = useState<TeacherTeachingLogRecord[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    setIsFetching(true);
    API.schoolTeacher
      .ListTeachingLog(teacherId, {
        page: pagination.page,
        limit: pagination.limit,
      })
      .then((res) => {
        if (res.status_code === 200) {
          setRecords(res.data);
          setPagination((prev) => ({
            ...prev,
            total_count: res._pagination.total_count,
          }));
        }
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [pagination.page, pagination.limit]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (size: number) => {
    // when changed page size, also reseting current page
    setPagination((prev) => ({ ...prev, limit: size, page: 1 }));
  };

  const columns: DataTableColumn<TeacherTeachingLogRecord>[] = [
    {
      accessor: 'index',
      title: '#',
      render: (_: any, index: number) => index + 1,
    },
    {
      accessor: 'academic_year',
      title: 'ปีการศึกษา',
    },
    { accessor: 'curriculum_group_name', title: 'สังกัดวิชา' },
    { accessor: 'subject', title: 'วิชา' },
    {
      accessor: 'year',
      title: 'ชั้นปี',
    },
  ];

  return (
    <CWWhiteBox className="flex flex-col gap-5">
      <DataTable
        className="table-hover whitespace-nowrap"
        records={records}
        columns={columns}
        // selectedRecords={selectedRecords}
        // onSelectedRecordsChange={setSelectedRecords}
        minHeight={300}
        highlightOnHover
        withTableBorder
        withColumnBorders
        noRecordsText="ไม่พบข้อมูล"
        totalRecords={pagination.total_count}
        recordsPerPage={pagination.limit}
        page={pagination.page}
        onPageChange={handlePageChange}
        onRecordsPerPageChange={handlePageSizeChange}
        recordsPerPageOptions={[10, 25, 50, 100]}
        paginationText={({ from, to, totalRecords }) =>
          `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
        }
        fetching={isFetching}
      />
    </CWWhiteBox>
  );
};

export default TeachingTable;
