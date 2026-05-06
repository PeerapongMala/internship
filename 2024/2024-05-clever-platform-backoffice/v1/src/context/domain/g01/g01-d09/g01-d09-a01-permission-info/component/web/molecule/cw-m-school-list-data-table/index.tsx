import CWInputCheckbox from '@component/web/cw-input-checkbox';
import IconClose from '@core/design-system/library/component/icon/IconClose';
import API from '@domain/g01/g01-d09/local/api';
import { TObServerAccessSchool } from '@domain/g01/g01-d09/local/api/helper/admin-report-permission';
import useStore from '@domain/g01/g01-d09/local/stores';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useState } from 'react';

type SchoolListDataTableProps = {
  selectedRecords: TObServerAccessSchool[];
  onSelectedRecord?: (records: TObServerAccessSchool[]) => void;
  searchText: { key: string; value: string };
};

const SchoolListDataTable = ({
  selectedRecords,
  onSelectedRecord,
  searchText,
}: SchoolListDataTableProps) => {
  const obsSchoolStore = useStore.observerAccessSchool();
  const formStore = useStore.observerAccessForm();
  const schoolListStore = useStore.observerAccessSchoolList();

  // useEffect(() => {
  //   fetchData();
  //   return () => {
  //     obsSchoolStore.resetPagination();
  //     obsSchoolStore.setSchools([]);
  //     schoolListStore.resetPagination();
  //   };
  // }, [searchText,]);

  const fetchData = () => {
    if (!formStore.formData?.id) return;
    obsSchoolStore.fetchData(formStore.formData.id);
  };

  const handleDeleteSchool = async (schoolID: number) => {
    if (!formStore.formData?.id) return;

    await API.adminReportPermissionAPI.DeletesArpDeleteSchool(formStore.formData?.id, [
      schoolID,
    ]);

    fetchData();
  };

  const handleSelectionChange = (selectedRows: TObServerAccessSchool[]) => {
    onSelectedRecord?.(selectedRows);
  };

  const columns: DataTableColumn<(typeof obsSchoolStore.schools)[number]>[] = [
    {
      accessor: 'Index',
      width: 1,
      title: '#',
      render: (_, index) =>
        (obsSchoolStore.pagination.page - 1) * obsSchoolStore.pagination.limit +
        index +
        1,
    },
    {
      accessor: 'SchoolID',
      width: 60,
      title: 'รหัสโรงเรียน',
      render: (record) => record.id?.toString().padStart(5, '0'),
    },
    {
      accessor: 'SchoolShortName',
      width: 60,
      title: 'รหัสย่อโรงเรียน',
      render: (record) => record.code,
    },
    {
      accessor: 'SchoolName',
      width: 60,
      title: 'ชื่อโรงเรียน',
      render: (record) => record.name,
    },
    {
      accessor: 'SchoolAffiliation',
      width: 60,
      title: 'สังกัด',
      render: (record) => record.school_affiliation,
    },
    {
      accessor: 'Delete',
      width: 60,
      title: 'เอาออก',
      render: (record) => (
        <button onClick={() => handleDeleteSchool(record.id)}>
          <IconClose />
        </button>
      ),
    },
  ];

  return (
    <DataTable
      highlightOnHover
      withTableBorder
      withColumnBorders
      columns={columns}
      records={obsSchoolStore.schools}
      noRecordsText="ไม่พบข้อมูล"
      minHeight={200}
      totalRecords={obsSchoolStore.pagination.total_count}
      recordsPerPage={obsSchoolStore.pagination.limit}
      page={obsSchoolStore.pagination.page}
      onPageChange={(page) => {
        obsSchoolStore.changePage(page);
        fetchData();
      }}
      onRecordsPerPageChange={(limit: number) => {
        obsSchoolStore.changeLimit(limit);
        fetchData();
      }}
      recordsPerPageOptions={[10, 25, 50, 100]}
      paginationText={({ from, to, totalRecords }) =>
        `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
      }
      selectedRecords={selectedRecords}
      onSelectedRecordsChange={handleSelectionChange}
    />
  );
};

export default SchoolListDataTable;
