import CWWhiteBox from '@component/web/cw-white-box';
import IconEye from '@core/design-system/library/component/icon/IconEye.tsx';
import API_g01 from '@domain/g01/g01-d04/local/api';
import { Classroom } from '@domain/g01/g01-d05/local/api/type.ts';
import API_g03 from '@domain/g03/g03-d04/local/api';
import { PlayingHistoryResponse } from '@domain/g03/g03-d04/local/api/group/account-student/type.ts';
import { toDateTimeTH } from '@global/utils/date.ts';
import { Link, useRouter } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';

const PlayingHistory = ({ studentId }: { studentId: string }) => {
  // ตรวจสอบ path ของ URL
  const router = useRouter();
  const isTeacherPath = router.state.location.pathname.includes('/teacher/student');
  const isAdminPath = router.state.location.pathname.includes('/admin/school');

  const [records, setRecords] = useState<Classroom[] | PlayingHistoryResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [fetching, setFetching] = useState(false);

  const columns: DataTableColumn<Classroom | PlayingHistoryResponse>[] = [
    {
      accessor: 'watchInfo',
      title: 'ดูข้อมูล',
      titleClassName: 'text-center',
      render: (record) => (
        <div className="flex w-full justify-center">
          <Link to={`${location.pathname}/history/${record.id}/${record.academic_year}`}>
            <IconEye />
          </Link>
        </div>
      ),
    },
    {
      accessor: 'index',
      title: '#',
      render: (_: any, index: number) => index + 1,
    },
    {
      accessor: 'academic_year',
      title: 'ปีการศึกษา',
    },
    {
      accessor: 'year',
      title: 'ชั้นปี',
    },
    {
      accessor: 'name',
      title: 'ห้อง',
    },
    {
      accessor: 'updated_at',
      title: 'แก้ไขล่าสุด',
      render: (record) => {
        return record.updated_at ? toDateTimeTH(record.updated_at) : '-';
      },
    },
    {
      accessor: 'updated_by',
      title: 'แก้ไขล่าสุดโดย',
      render: (record) => {
        return record.updated_by ?? '-';
      },
    },
  ];

  useEffect(() => {
    setFetching(true);
    if (isAdminPath) {
      API_g01.schoolStudent.PlayLog.getClassess(studentId, {
        limit,
        page,
      }).then((res) => {
        if (res.status_code == 200) {
          setRecords(res.data);
          setTotalRecords(res._pagination.total_count);
        }
        setFetching(false);
      });
    } else if (isTeacherPath) {
      API_g03.accountStudent
        .GetPlayingHistory(studentId, {
          limit,
          page,
        })
        .then((res) => {
          if (res.status_code == 200) {
            setRecords(res.data);
            setTotalRecords(res._pagination.total_count);
          }
          setFetching(false);
        });
    }
  }, [page, limit, studentId]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const onRecordsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };
  return (
    <>
      <CWWhiteBox>
        <DataTable
          className="table-hover whitespace-nowrap"
          records={records}
          columns={columns}
          highlightOnHover
          withTableBorder
          withColumnBorders
          height={'calc(100vh - 350px)'}
          noRecordsText="ไม่พบข้อมูล"
          fetching={fetching}
          totalRecords={totalRecords}
          recordsPerPage={limit}
          page={page}
          onPageChange={handlePageChange}
          onRecordsPerPageChange={onRecordsPerPageChange}
          recordsPerPageOptions={[10, 25, 50, 100]}
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
          }
        />
      </CWWhiteBox>
    </>
  );
};

export default PlayingHistory;
