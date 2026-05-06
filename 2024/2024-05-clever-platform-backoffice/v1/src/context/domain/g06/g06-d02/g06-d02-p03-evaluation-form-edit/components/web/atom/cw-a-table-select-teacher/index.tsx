import { TPagination } from '@domain/g06/g06-d02/local/types';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useMemo, useState } from 'react';
import './index.css';
import CWPagination from '@component/web/cw-pagination';
import { TTeacherUser } from '@domain/g06/g06-d02/local/types/admin';

type TableSelectTeacherProps = {
  fetching?: boolean;
  teachers: TTeacherUser[];
  pagination: TPagination;
  onPaginationChange: (pagination: TPagination) => void;
  selectedTeacher: TTeacherUser[];
  onSelectedTeacherChange?: (selectedItems: TTeacherUser[]) => void;
  isRecordSelectable?: (record: TTeacherUser) => boolean;
};

const TableSelectTeacher = ({
  fetching,
  teachers,
  pagination,
  onPaginationChange,
  selectedTeacher,
  onSelectedTeacherChange,
  isRecordSelectable,
}: TableSelectTeacherProps) => {
  const columnDefs = useMemo<DataTableColumn<TTeacherUser>[]>(() => {
    const columns: (DataTableColumn<TTeacherUser> | undefined)[] = [
      {
        accessor: 'id',
        render: (record) => {
          return record.id;
        },
      },
      {
        accessor: 'prefix',
        render: (record) => {
          return record.title;
        },
      },
      {
        accessor: 'firstName',
        render: (record) => {
          return record.first_name;
        },
      },
      {
        accessor: 'LastName',
        render: (record) => {
          return record.last_name;
        },
      },
    ];

    return columns
      .filter((column) => !!column)
      .map((col) => ({ ...col, cellsClassName: '!bg-transparent' }));
  }, [teachers]);

  return (
    <div className="flex flex-col gap-5">
      <DataTable
        fetching={fetching}
        minHeight={200}
        noHeader
        rowClassName={'table-no-bg-color'}
        withTableBorder={false}
        records={teachers}
        columns={columnDefs}
        selectedRecords={selectedTeacher}
        onSelectedRecordsChange={onSelectedTeacherChange}
        isRecordSelectable={isRecordSelectable}
        selectionTrigger="cell"
      />

      <CWPagination
        currentPage={pagination.page}
        onPageChange={(page: number) => onPaginationChange({ ...pagination, page })}
        pageSize={pagination.limit}
        setPageSize={(limit: number) => onPaginationChange({ ...pagination, limit })}
        totalPages={Math.ceil(pagination.total_count / pagination.limit)}
      />
    </div>
  );
};
export default TableSelectTeacher;
