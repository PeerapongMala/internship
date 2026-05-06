import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Dispatch, SetStateAction, useState } from 'react';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import { Link, useParams } from '@tanstack/react-router';
import { Flex, Space, Text } from '@mantine/core';
import CWInputSearch from '@component/web/cw-input-search';
import Box from '@component/web/atom/Box';
import { StudentDto } from '@domain/g06/g06-d06/local/type';
import type { usePagination } from '@mantine/hooks';
import { Controller, UseFormReturn } from 'react-hook-form';
import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { TEvaluationForm } from '@domain/g06/g06-d02/local/types/grade';
import config from '@core/config';

const columns = (
  reportId: number,
  evaluationForm?: any,
): DataTableColumn<StudentDto>[] => [
  {
    accessor: 'view',
    title: 'ดู',
    titleClassName: 'text-center px-1 py-0.5',
    cellsClassName: 'text-center px-1 py-0.5',
    render(record) {
      return (
        <div className="flex items-center justify-center">
          <Link
            to={`/grade-system/evaluation/report/${reportId}/phorpor6/student-records/${record.id}`}
            state={evaluationForm}
          >
            <IconEye className="h-5 w-5" />
          </Link>
        </div>
      );
    },
  },

  // {
  //   accessor: 'id',
  //   title: '#',
  // },
  {
    accessor: 'academicYear',
    title: 'ปีการศึกษา',
  },
  {
    accessor: 'year',
    title: 'ชั้นปี',
  },
  {
    accessor: 'schoolRoom',
    title: 'ห้อง',
  },
  {
    accessor: 'studentIdNo',
    title: 'รหัสนักเรียน',
    render(record) {
      return (
        <Link
          to={`/grade-system/evaluation/report/${reportId}/phorpor6/student-records/${record.id}`}
          state={evaluationForm}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {record.studentIdNo}
        </Link>
      );
    },
  },
  {
    accessor: 'title',
    title: 'คำนำหน้า',
  },
  {
    accessor: 'thaiFirstName',
    title: 'ชื่อ',
    render(record) {
      return (
        <Link
          to={`/grade-system/evaluation/report/${reportId}/phorpor6/student-records/${record.id}`}
          state={evaluationForm}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {record.thaiFirstName}
        </Link>
      );
    },
  },
  {
    accessor: 'thaiLastName',
    title: 'สกุล',
    render(record) {
      return (
        <Link
          to={`/grade-system/evaluation/report/${reportId}/phorpor6/student-records/${record.id}`}
          state={evaluationForm}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {record.thaiLastName}
        </Link>
      );
    },
  },
];

interface StudentPaginationTable extends ReturnType<typeof usePagination> {
  totalRecords: number;
  recordsPerPage: number;
  onPageChange(page: number): void;
  onRecordsPerPageChange(records: number): void;
}

interface StudentTable {
  state?: TEvaluationForm;
  form: UseFormReturn<{ search: string }>;
  onSubmit(): void;
  data: StudentDto[];
  seletedData: StudentDto[];
  onSelect: Dispatch<SetStateAction<StudentDto[]>>;
  onCreate(): void;
  pagination: StudentPaginationTable;
}

const StudentTable: React.FC<StudentTable> = (props) => {
  const { form, state, onSubmit, data, seletedData, onSelect, onCreate, pagination } =
    props;
  const params = useParams({
    strict: false,
  });
  const evaluationFormID = Number(params.evaluationFormId);
  if (data.length === 0 && pagination.totalRecords === 0) {
    return (
      <Flex direction="column" justify="center" align="center" gap="xs">
        <Space h="3.125rem" />
        <Text size="sm" fw={700}>
          คุณยังไม่ได้ออกรายงาน
        </Text>
        <Text size="sm">กรุณาตรวจสอบสถานะ หรือออกรายงาน</Text>
        <Space h="xs" />
        <CWButton
          variant={'primary'}
          title={'สร้างรายงาน'}
          onClick={onCreate}
          disabled={false}
          icon={<IconPlus />}
        />
      </Flex>
    );
  }

  return (
    <Box>
      <div className="w-[200px]">
        <Controller
          name="search"
          control={form.control}
          render={({ field }) => (
            <CWInputSearch {...field} placeholder="ค้นหา" onClick={onSubmit} />
          )}
        />
      </div>

      <Space h="lg" />
      <DataTable
        className="table-hover whitespace-nowrap"
        records={data}
        columns={columns(evaluationFormID, state)}
        highlightOnHover
        withTableBorder
        withColumnBorders
        height={'calc(100vh - 350px)'}
        noRecordsText="ไม่พบข้อมูล"
        totalRecords={pagination.totalRecords}
        recordsPerPage={pagination.recordsPerPage}
        page={pagination.active}
        onPageChange={pagination.onPageChange}
        onRecordsPerPageChange={pagination.onRecordsPerPageChange}
        recordsPerPageOptions={config.pagination.itemPerPageOptions}
        paginationText={({ from, to, totalRecords }) =>
          `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
        }
      />
    </Box>
  );
};

export default StudentTable;
