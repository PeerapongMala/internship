import API from '@domain/g06/g06-d07/local/api';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';

import { getUserData } from '@global/utils/store/getUserData';
import usePagination from '@global/hooks/usePagination';
import {
  TDocumentTemplate,
  THandleTableTemplateList,
  TTemplateFilter,
} from '@domain/g06/g06-d07/local/types/template';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import { useDocumentTemplateList } from '@domain/g06/g06-d07/local/hook/getlist/useTemplatelist';

type TableTemplateListProps = {
  filter: TTemplateFilter;
  onEditTemplate?: (teamplateID: number) => void;
};

const Component = (
  { filter, onEditTemplate }: TableTemplateListProps,
  ref: React.ForwardedRef<THandleTableTemplateList>,
) => {
  const {
    template,
    fetching,
    pagination,
    setPagination,
    pageSizeOptions,
    fetchTemplate,
  } = useDocumentTemplateList(filter);

  const columnDefs = useMemo<DataTableColumn<TDocumentTemplate>[]>(() => {
    const columns: DataTableColumn<TDocumentTemplate>[] = [
      {
        accessor: 'button-edit',
        title: 'แก้ไข',
        titleClassName: 'text-center px-1 py-0.5',
        cellsClassName: 'text-center px-1 py-0.5',

        render: (records) => (
          <button onClick={() => onEditTemplate?.(Number(records.id))}>
            <IconPencil />
          </button>
        ),
      },
      //   {
      //     accessor: 'index',
      //     title: '#',
      //     render: (_, i) => i + 1 + (pagination.page - 1) * pagination.limit,
      //   },
      {
        accessor: 'name',
        title: 'ชื่อเอกสาร',
        render: (records) => (
          <button
            className="text-blue-600 underline hover:text-blue-800"
            onClick={() => onEditTemplate?.(Number(records.id))}
          >
            {records.name}
          </button>
        ),
      },
      {
        accessor: 'format_id',
        title: 'Template เอกสาร',
        render: (records) => <div>รูปแบบที่ {records.format_id}</div>,
      },

      {
        accessor: 'is_default',
        title: 'ค่าเริ่มต้น',
        titleClassName: 'text-center',
        cellsClassName: 'flex w-full justify-center',
        render: (records) => (
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full ${records.is_default ? 'bg-green-600' : 'bg-red-600'}`}
          ></div>
        ),
      },
    ];

    return columns;
  }, [pagination.limit, pagination.page]);

  useImperativeHandle(ref, () => ({
    fetchTemplate,
  }));

  const showPagination = template.length > 0;

  if (!showPagination) {
    return (
      <DataTable
        className="table-hover mt-5 whitespace-nowrap"
        records={template}
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
      records={template}
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

const CWTableTemplateList = forwardRef<THandleTableTemplateList, TableTemplateListProps>(
  Component,
);

export default CWTableTemplateList;
