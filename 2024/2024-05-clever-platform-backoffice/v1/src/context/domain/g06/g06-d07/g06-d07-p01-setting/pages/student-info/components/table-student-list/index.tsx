import {
  THandleTableStudentList,
  TStudent,
  TStudentFilter,
} from '@domain/g06/g06-d07/local/types/students';
import API from '@domain/g06/g06-d07/local/api';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { TPagination } from '@domain/g06/g06-d02/local/types';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import { getUserData } from '@global/utils/store/getUserData';
import usePagination from '@global/hooks/usePagination';

type TableStudentListProps = {
  filter: TStudentFilter;
  onEditStudent?: (studentID: number) => void;
};

const Component = (
  { filter, onEditStudent }: TableStudentListProps,
  ref: React.ForwardedRef<THandleTableStudentList>,
) => {
  const userData = getUserData();
  const [students, setStudents] = useState<TStudent[]>([]);
  const [fetching, setFetching] = useState(false);
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  // reset page to 1 when filter change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filter]);

  useEffect(() => {
    fetchStudents();
  }, [pagination.limit, pagination.page, filter]);

  const fetchStudents = async () => {
    setFetching(true);
    try {
      const response = await API.GradeSetting.GetListStudentInformation({
        school_id: userData.school_id,
        ...filter,
        ...pagination,
      });

      setStudents(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total_count: response.data._pagination.total_count,
      }));
    } catch (error) {
      throw error;
    } finally {
      setFetching(false);
    }
  };

  const columnDefs = useMemo<DataTableColumn<TStudent>[]>(() => {
    const columns: DataTableColumn<TStudent>[] = [
      {
        accessor: 'button-edit',
        title: 'แก้ไข',
        titleClassName: 'text-center px-1 py-0.5',
        cellsClassName: 'text-center px-1 py-0.5',
        render: (user) => (
          <button className="justify-center" onClick={() => onEditStudent?.(user.id)}>
            <IconPencil />
          </button>
        ),
      },
      // {
      //   accessor: 'index',
      //   title: 'ที่',
      //   render: (_, i) => i + 1 + (pagination.page - 1) * pagination.limit,
      // },
      {
        accessor: 'citizen_no',
        title: 'เลขประจำตัวประชาชน',
        render: (user) => (
          <button
            className="text-blue-600 underline hover:text-blue-800"
            onClick={() => onEditStudent?.(user.id)}
          >
            {user.citizen_no}
          </button>
        ),
      },
      {
        accessor: 'year',
        title: 'ชั้น',
      },
      {
        accessor: 'school_room',
        title: 'ห้อง',
      },
      {
        accessor: 'student_id',
        title: 'รหัสนักเรียน',
      },
      {
        accessor: 'fullname',
        title: 'ชื่อ-สกุล',
        render: (user) => (
          <button
            className="text-blue-600 underline hover:text-blue-800"
            onClick={() => onEditStudent?.(user.id)}
          >
            {`${user.thai_first_name} ${user.thai_last_name}`}
          </button>
        ),
      },
      {
        accessor: 'match_in_master_data',
        title: 'ตรงกับระบบ',
        titleClassName: 'text-center',
        cellsClassName: 'flex w-full justify-center',
        render: (user) => (
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full ${user.match_in_master_data ? 'bg-green-600' : 'bg-red-600'}`}
          ></div>
        ),
      },
    ];

    return columns;
  }, [pagination.limit, pagination.page]);

  useImperativeHandle(ref, () => ({
    fetchStudents,
  }));

  const showPagination = students.length > 0;

  if (!showPagination) {
    return (
      <DataTable
        className="table-hover mt-5 whitespace-nowrap"
        records={students}
        columns={columnDefs}
        highlightOnHover
        withTableBorder
        withColumnBorders
        height={'calc(100vh - 350px)'}
        noRecordsText="ไม่พบข้อมูล"
        fetching={fetching}
        loaderType="oval"
        loaderBackgroundBlur={4}
      />
    );
  }

  return (
    <DataTable
      className="table-hover mt-5 whitespace-nowrap"
      records={students}
      columns={columnDefs}
      highlightOnHover
      withTableBorder
      withColumnBorders
      height={'calc(100vh - 350px)'}
      noRecordsText="ไม่พบข้อมูล"
      totalRecords={pagination.total_count}
      recordsPerPage={pagination.limit}
      page={pagination.page}
      onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      onRecordsPerPageChange={(limit) =>
        setPagination((prev) => ({
          ...prev,
          page: pagination.page * limit > pagination.total_count ? 1 : pagination.page,
          limit,
        }))
      }
      recordsPerPageOptions={pageSizeOptions}
      paginationText={({ from, to, totalRecords }) =>
        `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
      }
      fetching={fetching}
      loaderType="oval"
      loaderBackgroundBlur={4}
    />
  );
};

const TableStudentList = forwardRef<THandleTableStudentList, TableStudentListProps>(
  Component,
);

export default TableStudentList;
