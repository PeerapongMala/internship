import React, { useMemo, useState } from 'react';
import { DataTable, DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import usePagination from '@global/hooks/usePagination';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconSorted from '@core/design-system/library/component/icon/IconSorted';
import IconUnSorted from '@core/design-system/library/component/icon/IconUnSorted';

const recordData = [...Array(300).keys()].map((index) => ({
  id: index + 1,
  name: `ด่านที่ ${index + 1}`,
  type: `ประเภท ${index + 1}`,
  status: `สถานะ ${index + 1}`,
  action: `ดำเนินการ ${index + 1}`,
}));

interface RecordType {
  id: number;
  name: string;
  type: string;
  status: string;
  action: string;
}

const columns: DataTableColumn<RecordType>[] = [
  {
    accessor: 'id',
    title: 'ด่านที่',
    sortable: true,
  },
  {
    accessor: 'name',
    title: 'ชื่อด่าน',
    sortable: true,
  },
  {
    accessor: 'type',
    title: 'ประเภท',
    sortable: true,
  },
  {
    accessor: 'status',
    title: 'สถานะ',
    sortable: true,
  },
  {
    accessor: 'action',
    title: 'ดำเนินการ',
    titleClassName: 'text-center',
    render: () => (
      <div className="flex w-full justify-center">
        <button type="button">
          <IconArchive className="h-5 w-5" />
        </button>
      </div>
    ),
  },
];

const DataTablePreview = () => {
  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [records, setRecords] = useState(recordData.slice(0, pagination.limit));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<RecordType>>({
    columnAccessor: 'id',
    direction: 'asc',
  });

  const sortedRecords = useMemo(() => {
    const data = [...recordData];
    const { columnAccessor, direction } = sortStatus;

    data.sort((a, b) => {
      const v1 = a[columnAccessor as keyof RecordType];
      const v2 = b[columnAccessor as keyof RecordType];
      if (v1 < v2) return direction === 'asc' ? -1 : 1;
      if (v1 > v2) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [sortStatus]);

  const paginatedRecords = useMemo(() => {
    return sortedRecords.slice(
      (pagination.page - 1) * pagination.limit,
      pagination.page * pagination.limit,
    );
  }, [sortedRecords, pagination]);

  return (
    <DataTable
      className="table-hover whitespace-nowrap"
      records={paginatedRecords}
      columns={columns}
      selectedRecords={selectedRecords}
      onSelectedRecordsChange={setSelectedRecords}
      highlightOnHover
      withTableBorder
      withColumnBorders
      height={'calc(100vh - 350px)'}
      noRecordsText="ไม่พบข้อมูล"
      totalRecords={recordData.length}
      recordsPerPage={pagination.limit}
      page={pagination.page}
      onPageChange={(page) => {
        setPagination((prev) => ({
          ...prev,
          page,
        }));
        setRecords(
          recordData.slice((page - 1) * pagination.limit, page * pagination.limit),
        );
      }}
      onRecordsPerPageChange={(limit) => {
        setPagination((prev) => ({
          ...prev,
          limit,
          page: 1,
        }));
        setRecords(recordData.slice(0, limit));
      }}
      recordsPerPageOptions={pageSizeOptions}
      paginationText={({ from, to, totalRecords }) =>
        `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
      }
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      sortIcons={{
        sorted: <IconSorted />,
        unsorted: <IconUnSorted />,
      }}
    />
  );
};

export default DataTablePreview;
