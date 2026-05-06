import IconSearch from '@component/web/atom/wc-a-icons/IconSearch.tsx';
import IconArchive from '@core/design-system/library/component/icon/IconArchive.tsx';
import InfoContract from '@domain/g01/g01-d04/g01-d04-p01-school-contract/pages/InfoContract';
import API from '@domain/g01/g01-d04/local/api';
import { SchoolContract } from '@domain/g01/g01-d04/local/type.ts';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import usePagination from '@global/hooks/usePagination';
import { BasePaginationAPIQueryParams } from '@global/utils/apiResponseHelper.ts';
import { toDateTimeTH } from '@global/utils/date.ts';
import showMessage from '@global/utils/showMessage.ts';
import { useParams } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';

function ManageContract() {
  const { schoolId } = useParams({ from: '' });

  const [records, setRecords] = useState<SchoolContract[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [filters, setFilters] = useState<Partial<BasePaginationAPIQueryParams>>({});
  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [showInfoContract, setShowInfoContract] = useState(false);
  const [selectedContract, setSelectedContract] = useState<SchoolContract | null>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      setFetching(true);
      try {
        const response = await API.school.GetContractList(schoolId, {
          page: pagination.page,
          limit: pagination.limit,
          search_text: filters.search_text,
        });

        if (response.status_code === 200) {
          setRecords(response.data);
          setPagination((prev) => ({
            ...prev,
            total_count: response._pagination.total_count,
          }));
        } else {
          showMessage('Failed to fetch contracts.', 'error');
        }
      } catch (error) {
        showMessage(`Failed to fetch contracts: ${error}`, 'error');
      } finally {
        setFetching(false);
      }
    };

    fetchContracts();
  }, [schoolId, pagination.page, pagination.limit, filters]);

  const columns: DataTableColumn<SchoolContract>[] = [
    { accessor: 'id', title: '#', render: (_, index) => index + 1 },
    { accessor: 'contract_id', title: 'รหัสสัญญา' },
    {
      accessor: 'contract_name',
      title: 'ชื่อสัญญา',
      render: (row) => row.contract_name || '-',
    },
    {
      accessor: 'start_date',
      title: 'วันที่เริ่มต้น',
      render: (row) =>
        row.start_date ? toDateTimeTH(new Date(row.start_date)).toString() : '-',
    },
    {
      accessor: 'end_date',
      title: 'วันที่สิ้นสุด',
      render: (row) =>
        row.end_date ? toDateTimeTH(new Date(row.end_date)).toString() : '-',
    },
    {
      accessor: 'updated_at',
      title: 'แก้ไขล่าสุด',
      render: (row) =>
        row.updated_at ? toDateTimeTH(new Date(row.updated_at)).toString() : '-',
    },
    {
      accessor: 'updated_by',
      title: 'แก้ไขล่าสุดโดย',
      render: (row) => row.updated_by || '-',
    },
    {
      accessor: 'infoContract',
      title: 'ดูหลักสูตร',
      render: (row) => (
        <button
          type="button"
          className="w-2 whitespace-nowrap !px-2"
          onClick={() => handleShowInfoContract(row)}
        >
          <IconSearch />
        </button>
      ),
    },
  ];

  const handleShowInfoContract = (contract: SchoolContract) => {
    setSelectedContract(contract);
    setShowInfoContract(true);
  };

  if (showInfoContract && selectedContract) {
    return (
      <InfoContract
        contractData={selectedContract}
        onBack={() => setShowInfoContract(false)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 font-noto-sans-thai">
      <p className="text-2xl font-bold">จัดการสัญญา</p>

      <div className="panel flex flex-col gap-5">
        <CWOHeaderTableButton
          showBulkEditButton={false}
          onSearchChange={(e) =>
            setFilters((prev) => ({ ...prev, search_text: e.target.value }))
          }
          showDownloadButton={false}
          showUploadButton={false}
        />

        <DataTable
          className="table-hover whitespace-nowrap"
          records={records}
          columns={columns}
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
          highlightOnHover
          withTableBorder
          withColumnBorders
          height="calc(100vh - 350px)"
          noRecordsText="ไม่พบข้อมูล"
          totalRecords={pagination.total_count}
          recordsPerPage={pagination.limit}
          page={pagination.page}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          onRecordsPerPageChange={(limit) =>
            setPagination({ page: 1, limit, total_count: pagination.total_count })
          }
          recordsPerPageOptions={pageSizeOptions}
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
          }
          fetching={fetching}
          loaderType="oval"
          loaderBackgroundBlur={4}
        />
      </div>
    </div>
  );
}

export default ManageContract;
