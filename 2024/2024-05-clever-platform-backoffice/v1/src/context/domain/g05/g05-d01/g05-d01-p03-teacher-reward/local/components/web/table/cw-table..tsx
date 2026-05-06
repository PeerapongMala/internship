import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Pagination } from '@domain/g03/g03-d07/local/type';
import { useMemo } from 'react';

interface PaginationTextProps {
  from: number;
  to: number;
  totalRecords: number;
}

interface CWTableProps<T> {
  columns: DataTableColumn<T>[];
  records: T[];
  fetching?: boolean;
  pagination?: Pagination;
  height?: string;
  minHeight?: number;
  noRecordsText?: string;
  recordsPerPageOptions?: number[];
  isRecordSelectable?: (record: T, index: number) => boolean;
  rowClassName?: (record: T, index: number) => string;
  selectedRecords?: T[];
  onPageChange?: (page: number) => void;
  onRecordsPerPageChange?: (limit: number) => void;
  onSelectedRecordsChange?: (records: T[]) => void;
}

const CWTable = <T,>({
  columns,
  records = [],
  fetching = false,
  pagination,
  height = 'calc(100vh - 350px)',
  minHeight = 200,
  noRecordsText = 'ไม่พบข้อมูล',
  recordsPerPageOptions = [10, 15, 30, 50, 100],
  isRecordSelectable,
  rowClassName,
  selectedRecords,
  onPageChange,
  onRecordsPerPageChange,
  onSelectedRecordsChange,
}: CWTableProps<T>) => {
  // เงื่อนไขสำหรับ pagination
  const paginationProps = pagination
    ? {
        totalRecords: pagination.total_count,
        recordsPerPage: pagination.limit,
        page: pagination.page,
        onPageChange: onPageChange ?? (() => {}),
        onRecordsPerPageChange: onRecordsPerPageChange ?? (() => {}),
        recordsPerPageOptions,
        paginationText: ({ from, to, totalRecords }: PaginationTextProps) =>
          `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`,
      }
    : {};

  // เงื่อนไขการเลือกแถว
  const selectionProps =
    isRecordSelectable || selectedRecords || onSelectedRecordsChange
      ? {
          isRecordSelectable,
          selectedRecords,
          onSelectedRecordsChange: onSelectedRecordsChange ?? (() => {}),
        }
      : {};

  // เงื่อนไข className ของแถว
  const rowClassProps = rowClassName ? { rowClassName } : {};

  return (
    <DataTable
      fetching={fetching}
      className="table-hover whitespace-nowrap"
      columns={columns}
      records={records}
      minHeight={minHeight}
      height={height}
      noRecordsText={noRecordsText}
      {...paginationProps}
      {...selectionProps}
      {...rowClassProps}
    />
  );
};

export default CWTable;
