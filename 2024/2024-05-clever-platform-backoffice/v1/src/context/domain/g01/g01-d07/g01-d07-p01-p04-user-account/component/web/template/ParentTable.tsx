import { DataTable } from 'mantine-datatable';
import { getParentColumns } from '../atom/columns/parent';
import { ParentsAccountResponse, UserAccountResponse } from '../../../../local/type';

interface ParentTableProps {
  records: UserAccountResponse[];
  selectedRecords: any[];
  onSelectedRecordsChange: (records: any[]) => void;
  pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  setPagination: (pagination: any) => void;
  navigate: any;
  onArchive: (user: string) => void;
  onOpen: (user: string) => void;
}

export const ParentTable = ({
  records,
  selectedRecords,
  onSelectedRecordsChange,
  pagination,
  setPagination,
  navigate,
  onArchive,
  onOpen,
}: ParentTableProps) => {
  return (
    <DataTable
      className="table-hover whitespace-nowrap"
      records={records}
      columns={getParentColumns(navigate, onArchive, onOpen)}
      selectedRecords={selectedRecords}
      onSelectedRecordsChange={onSelectedRecordsChange}
      highlightOnHover
      withTableBorder
      withColumnBorders
      height={'calc(100vh - 350px)'}
      noRecordsText="ไม่พบข้อมูล"
      totalRecords={pagination.total_count}
      recordsPerPage={pagination.limit}
      page={pagination.page}
      onPageChange={(page) => setPagination((prev: any) => ({ ...prev, page }))}
      onRecordsPerPageChange={(limit) =>
        setPagination({
          page: 1,
          limit,
          total_count: pagination.total_count,
        })
      }
      recordsPerPageOptions={[10, 25, 50, 100]}
      paginationText={({ from, to, totalRecords }) =>
        `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
      }
    />
  );
};
