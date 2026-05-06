import { DataTable } from 'mantine-datatable';
import { getContentCreatorColumns } from '../atom/columns/content-creator';
import { UserAccountResponse } from '../../../../local/type';
import config from '@core/config';

interface ContentCreatorTableProps {
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
  pathname: string;
  onOpen: (user: string) => void;
}

export const ContentCreatorTable = ({
  records,
  selectedRecords,
  onSelectedRecordsChange,
  pagination,
  setPagination,
  navigate,
  onArchive,
  onOpen,
  pathname,
}: ContentCreatorTableProps) => {
  return (
    <DataTable
      className="table-hover whitespace-nowrap"
      records={records}
      columns={getContentCreatorColumns(navigate, onArchive, onOpen, pathname)}
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
      recordsPerPageOptions={config.pagination.itemPerPageOptions}
      paginationText={({ from, to, totalRecords }) =>
        `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
      }
    />
  );
};
