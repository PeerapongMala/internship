import CWPagination from '@component/web/cw-pagination';
import { TSchool } from '@domain/g01/g01-d09/local/api/helper/school';
import useStore from '@domain/g01/g01-d09/local/stores';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import './index.css';

type SchoolSelectTableProps = {
  selectedFilterGroup?: string;
  selectedFilterSchoolAff?: number;
  selectedSearchSchool?: string;
};

const SchoolSelectTable = ({
  selectedFilterGroup,
  selectedFilterSchoolAff,
  selectedSearchSchool,
}: SchoolSelectTableProps) => {
  const store = useStore.observerAccessSchoolList();
  const obsAccessStore = useStore.observerAccessSchool();
  const formStore = useStore.observerAccessForm();
  const schoolAffStore = useStore.schoolAffiliation();

  const [selectedRecords, setSelectedRecords] = useState<TSchool[]>([]);

  useEffect(() => {
    fetchAllSchoolSelection();

    schoolAffStore.fetchAllSchoolAffiliation();

    return () => {
      store.resetPagination();
      store.setSchools([]);
      store.selectedClearSelectedSchools();
      refetchObserverAccessData();
    };
  }, []);

  useEffect(() => {
    store.fetchSchoolData({
      school_name: selectedSearchSchool?.length === 0 ? undefined : selectedSearchSchool,
      school_affiliation_group:
        selectedFilterGroup?.length === 0 ? undefined : selectedFilterGroup,
      school_affiliation_id: selectedFilterSchoolAff
        ? selectedFilterSchoolAff
        : undefined,
    });
  }, [selectedFilterGroup, selectedFilterSchoolAff, selectedSearchSchool]);

  const handleSelectionChange = (
    selectedRows: TSchool[] | ((prevState: TSchool[]) => TSchool[]),
  ) => {
    if (Array.isArray(selectedRows)) {
      setSelectedRecords(selectedRows);

      const selectedIds = selectedRows.map((record) => record.id);
      store.setSelectedSchoolIds(selectedIds);
    }
  };

  const fetchAllSchoolSelection = () => {
    if (formStore.formData.id)
      store.selectedFetchAllSchoolSelection(formStore.formData.id);
  };

  const refetchObserverAccessData = () => {
    if (!formStore.formData?.id) return;
    obsAccessStore.fetchData(formStore.formData.id);
  };

  const columns: DataTableColumn<(typeof store.schools)[number]>[] = [
    {
      accessor: 'Select',
      cellsClassName: '!p-0 !py-2 !bg-white',
      render(record, index) {
        return (
          <div
            className={`grid grid-cols-4 gap-2 rounded-lg border px-4 py-2 hover:cursor-pointer ${selectedRecords.some((r) => r.id == record.id) ? 'border border-primary' : ''}`}
          >
            <div>{record.id}</div>
            <div>{record.school_name}</div>
            <div>{record.school_affiliation_name}</div>
          </div>
        );
      },
    },
    //   {
    //     accessor: 'Select',
    //     title: <CWInputCheckbox disabled />,
    //     width: 1,
    //     render: (record) => (
    //       <CWInputCheckbox
    //         checked={store.selectedSchoolIds.includes(record.id)}
    //         defaultValue={0}
    //         onChange={() => store.selectedToggleSchoolSelection(record.id)}
    //       />
    //     ),
    //   },
    //   {
    //     accessor: 'SchoolID',
    //     width: 60,
    //     title: 'รหัสโรงเรียน',
    //     render: (record) => record.id?.toString().padStart(5, '0'),
    //   },
    //   {
    //     accessor: 'SchoolName',
    //     width: 60,
    //     render: (record) => record.school_name,
    //   },
    //   {
    //     accessor: 'SchoolAffiliation',
    //     width: 60,
    //     render: (record) => record.school_affiliation_name,
    //   },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="custom-data-table-container">
        <DataTable
          rowClassName={'!bg-white table-no-bg-color'}
          noHeader
          withTableBorder={false}
          withColumnBorders={false}
          columns={columns}
          records={store.schools}
          noRecordsText="ไม่พบข้อมูล"
          className="custom-data-table"
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={handleSelectionChange}
          minHeight={200}
        />
      </div>

      <CWPagination
        currentPage={store.pagination.page}
        onPageChange={(page) => store.changePage(page)}
        pageSize={store.pagination.limit}
        setPageSize={(size) => store.changeLimit(size)}
        totalPages={Math.ceil(store.pagination.total_count / store.pagination.limit)}
      />
    </div>
  );
};

export default SchoolSelectTable;
