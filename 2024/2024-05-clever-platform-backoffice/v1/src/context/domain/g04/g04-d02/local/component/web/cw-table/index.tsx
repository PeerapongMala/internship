import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../config/index.json';
import { DataTable, DataTableColumn, DataTableProps } from 'mantine-datatable';
import config from '@core/config';

export interface CWTableProps<T> {
  columns: DataTableColumn<T>[];
  records: T[];
  className?: string;
  page?: number;
  onPageChange?: (pageIndex: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  totalRecords?: number;

  fetching?: boolean;
  minHeight?: number | string;
  selectedRecords?: T[];
  onSelectedRecordsChange?: (records: T[]) => void;
  recordsPerPageOptions?: number[];
  options?: { [key: string]: any } & Partial<Record<keyof DataTableProps, any>>;
  noRecordsText?: string;
  withPagination?: boolean;
}

const CWTable = function <T extends Record<string, any>>({
  className,
  page,
  onPageChange,
  limit,
  onLimitChange,
  totalRecords,
  records,
  recordsPerPageOptions = config.pagination.itemPerPageOptions,
  ...props
}: CWTableProps<T>) {
  const { t } = useTranslation(ConfigJson.key);

  return (
    <DataTable
      className={className}
      columns={props.columns}
      records={records}
      page={page}
      recordsPerPage={limit}
      noRecordsText={props.noRecordsText}
      onPageChange={onPageChange}
      totalRecords={totalRecords}
      paginationText={({ totalRecords }) => (
        <span className="text-nowrap">{`แสดง ${page ?? 0} จาก ${Math.ceil(totalRecords / (limit ?? 10))} หน้า`}</span>
      )}
      paginationWrapBreakpoint="lg"
      recordsPerPageOptions={recordsPerPageOptions}
      onRecordsPerPageChange={(limit) => {
        onPageChange?.(1);
        onLimitChange?.(limit);
      }}
      withTableBorder
      minHeight={props.minHeight}
      onSelectedRecordsChange={props.onSelectedRecordsChange}
      highlightOnHover
      selectedRecords={props.selectedRecords}
      withRowBorders={false}
      fetching={props.fetching}
      defaultColumnRender={(row: T, _, accessor) => {
        const key = accessor as keyof T;
        return key in row
          ? row[key] != null || row[key] != undefined
            ? row[key]
            : '-'
          : '-';
      }}
      {...props.options}
    />
  );
};

export default CWTable;
