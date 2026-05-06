import CWButtonSwitch from '@component/web/cw-button-switch';
import CWSelect from '@component/web/cw-select';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import API from '@domain/g01/g01-d04/local/api';
import { SubjectListResponse } from '@domain/g01/g01-d04/local/type.ts';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import StoreGlobal from '@global/store/global';
import { toDateTimeTH } from '@global/utils/date.ts';
import showMessage from '@global/utils/showMessage.ts';
import { useParams } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import usePagination from '@global/hooks/usePagination';

interface DropdownOption {
  value: number;
  label: string;
}

const SchoolSubject = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const { schoolId } = useParams({ from: '' });

  const [records, setRecords] = useState<SubjectListResponse[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [fetching, setFetching] = useState(false);
  const [selectedTab, setSelectedTab] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({
    curriculum_group_id: 0,
    seed_year_name: 0,
  });
  const [curriculumGroup, setCurriculumGroup] = useState<DropdownOption[]>([]);
  const [seedYear, setSeedYear] = useState<DropdownOption[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
  const [isToggle, setIsToggle] = useState<boolean>();

  // Set Sidebar
  useEffect(() => {
    const store = StoreGlobal.MethodGet();
    store.TemplateSet(true);
    store.BannerSet(true);
  }, []);

  // Fetch Subject List
  const fetchSubjectList = useCallback(async () => {
    if (!schoolId) return;
    try {
      setFetching(true);
      const res = await API.school.GetSubjectList(schoolId, {
        page: pagination.page,
        limit: pagination.limit,
        status: selectedTab || undefined,
        curriculum_group_id: selectedOptions.curriculum_group_id || undefined,
        seed_year_name: selectedOptions.seed_year_name
          ? 'ป.' + selectedOptions.seed_year_name
          : undefined,
        search_text: searchText,
      });

      if (res.status_code === 200) {
        setRecords(res.data);
        setPagination((prev) => ({ ...prev, total_count: res._pagination.total_count }));
      } else {
        showMessage(
          `Failed to fetch subjects: ${res.message || 'Unknown error'}`,
          'error',
        );
      }
    } catch (error) {
      showMessage(`Failed to fetch subjects: ${error}`, 'error');
    } finally {
      setFetching(false);
    }
  }, [
    schoolId,
    pagination.page,
    pagination.limit,
    selectedTab,
    selectedOptions,
    searchText,
  ]);

  // Fetch Dropdown Data
  const fetchDropdownData = useCallback(async () => {
    const fetchData = async (
      apiCall: (params: { page: number; limit: number }) => Promise<any>,
      setData: (data: DropdownOption[]) => void,
      errorMessage: string,
    ) => {
      try {
        setFetching(true);
        const res = await apiCall({ page: 1, limit: 10 });
        if (res.status_code === 200) {
          setData(
            res.data.map((item: any) => ({
              value: item.id,
              label: item.short_name || item.name, // Use short_name for SeedYear, name for CurriculumGroup
            })),
          );
        } else {
          showMessage(errorMessage, 'error'); // Show error message from the API
        }
      } catch (error) {
        console.error(`Error fetching ${errorMessage}:`, error);
        showMessage(`Failed to fetch ${errorMessage}: ${error}`, 'error');
      } finally {
        setFetching(false);
      }
    };

    await fetchData(API.school.GetSeedYear, setSeedYear, 'seed years');
    await fetchData(
      API.school.GetCurriculumGroup,
      setCurriculumGroup,
      'curriculum groups',
    );
  }, []);

  // Load Data
  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  useEffect(() => {
    fetchSubjectList();
  }, [fetchSubjectList]);

  // Handle School Status Toggle
  const handleOpenSchool = useCallback(
    async (school_id: number, subject_id: number, isToggle: boolean) => {
      try {
        setFetching(true);
        const res = await API.school.SubjectUpdate(
          Number(school_id),
          subject_id,
          isToggle,
        );
        if (res.status_code === 200) {
          showMessage('อัพเดทสำเร็จ', 'success');
        } else {
          showMessage(
            `Failed to update status: ${res.message || 'Unknown error'}`,
            'error',
          ); // Show message from API
        }
      } catch (error) {
        console.error('Error updating school status:', error);
        showMessage('เกิดข้อผิดพลาด', 'error');
      } finally {
        setFetching(false);
      }
    },
    [],
  );

  // DataTable Columns
  const columns: DataTableColumn<SubjectListResponse>[] = [
    { accessor: 'index', title: '#', render: (_, index) => index + 1 },
    { accessor: 'subject_id', title: 'รหัสวิชา' },
    { accessor: 'subject_group_name', title: 'สังกัดวิชา' },
    { accessor: 'platform_name', title: 'แพลตฟอร์ม' },
    { accessor: 'curriculum_group_name', title: 'กลุ่มวิชา' },
    { accessor: 'seed_year_name', title: 'ชั้นปี' },
    { accessor: 'subject_name', title: 'วิชา' },
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
      accessor: 'status',
      title: 'โรงเรียนเปิดใช้งาน',
      render: (row) => (
        <CWButtonSwitch
          initialState={row.status === 'enabled'}
          onToggle={(newState) => {
            setIsToggle(newState);
            handleOpenSchool(schoolId, row.subject_id, newState);
          }}
          onChange={(newState) =>
            console.log(`Changed schoolStatus for ${row.subject_id} to ${newState}`)
          }
        />
      ),
    },
  ];

  // Tabs List
  const tabsList = [
    { key: '', label: 'ทั้งหมด' },
    { key: 'enabled', label: 'ใช้งาน' },
    { key: 'disabled', label: 'ไม่ใช้งาน' },
  ];

  return (
    <div className="flex flex-col gap-4 font-noto-sans-thai">
      <p className="text-2xl font-bold">จัดการหลักสูตร</p>

      <div className="panel flex flex-col gap-5">
        <CWOHeaderTableButton
          showBulkEditButton={false}
          onSearchChange={(e) => setSearchText(e.target.value)}
          showDownloadButton={false}
          showUploadButton={false}
        />
        <div className="flex w-fit flex-wrap gap-2">
          <CWSelect
            title="สังกัดวิชา"
            options={curriculumGroup}
            value={selectedOptions.curriculum_group_id}
            onChange={(e) =>
              setSelectedOptions((prev) => ({
                ...prev,
                curriculum_group_id: e.target.value,
              }))
            }
            className="min-w-48"
            required={false}
          />
          <CWSelect
            title="ชั้นปี"
            options={seedYear}
            value={selectedOptions.seed_year_name}
            onChange={(e) =>
              setSelectedOptions((prev) => ({
                ...prev,
                seed_year_name: e.target.value,
              }))
            }
            className="min-w-48"
            required={false}
          />
        </div>

        <CWMTabs
          items={tabsList.map((t) => t.label)}
          currentIndex={tabsList.findIndex((tab) => tab.key === selectedTab)}
          onClick={(index) => setSelectedTab(tabsList[index].key)}
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
          fetching={fetching}
          loaderType="oval"
          loaderBackgroundBlur={4}
        />
      </div>
    </div>
  );
};

export default SchoolSubject;
