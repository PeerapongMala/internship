import React, { useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { toDateTimeTH } from '@global/utils/date.ts';
import API from '@domain/g01/g01-d04/local/api';
import {
  ContractSubjectGroupResponse,
  SchoolContract,
} from '@domain/g01/g01-d04/local/type.ts';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward.tsx';
import showMessage from '@global/utils/showMessage.ts';
import { useParams } from '@tanstack/react-router';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import CWSelect from '@component/web/cw-select';
import usePagination from '@global/hooks/usePagination';

interface InfoContractProps {
  contractData: SchoolContract;
  onBack?: () => void;
}

const InfoContract = ({ contractData, onBack }: InfoContractProps) => {
  const { schoolId } = useParams({ from: '' });
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [selectedCurriculumGroupId, setSelectedCurriculumGroupId] = useState<number>(0);
  const [selectedSeedYearShortName, setSelectedSeedYearShortName] = useState<string>('');
  const [curriculumGroup, setCurriculumGroup] = useState<
    { value: number; label: string }[]
  >([]);
  const [seedYear, setSeedYear] = useState<{ value: number; label: string }[]>([]);
  const [records, setRecords] = useState<ContractSubjectGroupResponse[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [fetching, setFetching] = useState(false);

  const tabsList = [
    { key: '', label: 'ทั้งหมด' },
    { key: 'enabled', label: 'ใช้งาน' },
    { key: 'disabled', label: 'ไม่ใช้งาน' },
  ];

  const statusLabels: Record<string, string> = {
    enabled: 'ใช้งาน',
    disabled: 'ไม่ใช้งาน',
  };

  const fetchDropdownData = async () => {
    try {
      const [seedYearResponse, curriculumGroupResponse] = await Promise.all([
        API.school.GetSeedYear({ page: 1, limit: 10 }),
        API.school.GetCurriculumGroup({ page: 1, limit: 10 }),
      ]);

      if (seedYearResponse.status_code === 200) {
        setSeedYear(
          seedYearResponse.data.map((item) => ({
            value: item.id,
            label: item.short_name,
          })),
        );
      }

      if (curriculumGroupResponse.status_code === 200) {
        setCurriculumGroup(
          curriculumGroupResponse.data.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchContractSubjectGroup = async () => {
    setFetching(true);
    try {
      const res = await API.school.GetContractSubjectGroup(
        schoolId,
        contractData.contract_id.toString(),
        {
          page: pagination.page,
          limit: pagination.limit,
          status: selectedTab || undefined,
          curriculum_group_id: selectedCurriculumGroupId || undefined,
          seed_year_name: selectedSeedYearShortName || undefined,
        },
      );
      if (res.status_code === 200) {
        setRecords(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count,
        }));
      }
    } catch (err) {
      showMessage(`Failed to fetch SchoolContract: ${err}`, 'error');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchContractSubjectGroup();
  }, [
    contractData,
    pagination.page,
    pagination.limit,
    selectedTab,
    selectedCurriculumGroupId,
    selectedSeedYearShortName,
    schoolId,
  ]);

  const columns: DataTableColumn<ContractSubjectGroupResponse>[] = [
    {
      accessor: 'contract_id',
      title: '#',
    },
    {
      accessor: 'subject_id',
      title: 'รหัสวิชา',
    },
    {
      accessor: 'curriculum_group_name',
      title: 'สังกัดวิชา',
    },
    {
      accessor: 'subject_name',
      title: 'วิชา',
    },
    {
      accessor: 'seed_year_short_name',
      title: 'ชั้นปี',
    },
    {
      accessor: 'updated_at',
      title: 'แก้ไขล่าสุด',
      render: (row: ContractSubjectGroupResponse) =>
        row.updated_at ? toDateTimeTH(new Date(row.updated_at)).toString() : '-',
    },
    {
      accessor: 'updated_by',
      title: 'แก้ไขล่าสุดโดย',
      render: (row: ContractSubjectGroupResponse) => row.updated_by || '-',
    },
    {
      accessor: 'status',
      title: 'เปิดใช้งาน',
      render: (row: ContractSubjectGroupResponse) => {
        const statusText = row.status.toLowerCase();
        const badgeClass =
          statusText === 'enabled'
            ? 'badge-outline-success'
            : statusText === 'disabled'
              ? 'badge-outline-danger'
              : 'badge-outline-secondary';
        return (
          <span className={`badge ${badgeClass} flex w-16 items-center justify-center`}>
            {statusLabels[statusText]}
          </span>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4 font-noto-sans-thai">
      <div className="flex flex-row gap-2.5">
        <div className="cursor-pointer p-2" onClick={onBack}>
          <IconArrowBackward />
        </div>
        <span className="flex items-center text-xl font-bold">สัญญาหลักสูตร</span>
      </div>
      <div className="gap-[10px] rounded-md bg-neutral-100 p-2.5 dark:bg-black">
        <p className="text-xl font-bold">{contractData.contract_name}</p>
      </div>

      <div className="relative flex flex-col gap-4 rounded-md bg-white p-4 shadow dark:bg-black">
        <div className="flex w-[60%] gap-6">
          <CWSelect
            title="สังกัดวิชา"
            options={curriculumGroup.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            value={selectedCurriculumGroupId}
            onChange={(e: { target: { value: any } }) => {
              setSelectedCurriculumGroupId(Number(e.target.value));
            }}
            className="min-w-48"
          />
          <CWSelect
            title="ชั้นปี"
            options={seedYear.map((option) => ({
              value: option.label,
              label: option.label,
            }))}
            value={selectedSeedYearShortName}
            onChange={(e: { target: { value: any } }) => {
              setSelectedSeedYearShortName(e.target.value);
            }}
            className="min-w-48"
          />
        </div>

        <CWMTabs
          items={tabsList.map((tab) => tab.label)}
          currentIndex={tabsList.findIndex((tab) => tab.key === selectedTab)}
          onClick={(index) => setSelectedTab(tabsList[index].key)}
        />

        <DataTable
          className="table-hover whitespace-nowrap"
          fetching={fetching}
          records={records}
          columns={columns}
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
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
            setPagination({
              page: 1,
              limit,
              total_count: pagination.total_count,
            })
          }
          recordsPerPageOptions={pageSizeOptions}
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
          }
        />
      </div>
    </div>
  );
};

export default InfoContract;
