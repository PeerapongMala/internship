import IconSearch from '@component/web/atom/wc-a-icons/IconSearch.tsx';
import CWSelect from '@component/web/cw-select';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import IconArchive from '@core/design-system/library/component/icon/IconArchive.tsx';
import IconPlus from '@core/design-system/library/component/icon/IconPlus.tsx';
import CloseSchoolModal from '@domain/g01/g01-d04/g01-d04-p00-school/component/web/molecule/CloseSchoolModal.tsx';
import {
  SchoolListQueryParams,
  SchoolResponse,
  SchoolUpdateRequest,
} from '@domain/g01/g01-d04/local/type.ts';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import CWTLayout from '@domain/g01/g01-d05/local/component/web/template/cw-t-layout';
import StoreGlobal from '@global/store/global';
import showMessage from '@global/utils/showMessage';
import { Pagination } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import API from '../local/api';
import ConfigJson from './config/index.json';
import usePagination from '@global/hooks/usePagination';

interface Pagination {
  page: number;
  limit: number;
  total_count: number;
}

const AdminSchool = () => {
  // Sidebar
  useEffect((): void => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  const navigate = useNavigate();

  // Translates
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const [records, setRecords] = useState<SchoolResponse[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [filters, setFilters] = useState<Partial<SchoolListQueryParams>>({});
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('');

  const [affiliationOptions, setAffiliationOptions] = useState<
    { label: string; value: any }[]
  >([]);
  const [provinceOptions, setProvinceOptions] = useState<{ label: string; value: any }[]>(
    [],
  );

  const fetchSchools = async () => {
    setFetching(true);
    try {
      const res = await API.school.Gets({
        page: pagination.page,
        limit: pagination.limit,
        status: selectedTab,
        school_affiliation_id: filters.school_affiliation_id,
        province: filters.province,
        search_text: filters.search_text,
      });
      if (res.status_code === 200) {
        setRecords(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count,
        }));
      }
    } catch (error) {
      showMessage(`Failed to fetch schools: ${error}`, 'error');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [pagination.page, pagination.limit, selectedTab, filters]);

  useEffect(() => {
    const fetchAffiliations = async () => {
      setFetching(true);
      try {
        const res = await API.school.GetSchoolAffiliations({
          limit: -1,
        });
        if (res.status_code === 200)
          setAffiliationOptions(res.data.map((v) => ({ label: v.name, value: v.id })));
      } catch (error) {
        console.error('Failed to fetch school affiliations', error);
      } finally {
        setFetching(false);
      }
    };

    const fetchProvinces = async () => {
      try {
        const res = await API.school.GetProvincesList({ limit: -1 });
        if (res.status_code === 200)
          setProvinceOptions(
            res.data.map((v) => ({ label: v.province, value: v.province })),
          );
        console.log(provinceOptions);
      } catch (error) {
        console.error('Failed to fetch school affiliations', error);
      }
    };

    fetchAffiliations();
    fetchProvinces();
  }, []);

  const columns: DataTableColumn<SchoolResponse>[] = [
    {
      accessor: 'id',
      title: '#',
    },
    {
      accessor: 'code',
      title: 'รหัสโรงเรียน',
      render: (row: any) => row.code || '-',
    },
    {
      accessor: 'name',
      title: 'ชื่อโรงเรียน',
      render: (row: any) => row.name || '-',
    },
    {
      accessor: 'school_affiliation_name',
      title: 'สังกัด',
      render: (row: any) => row.school_affiliation_name || '-',
    },
    {
      accessor: 'school_affiliation_id',
      title: 'รหัสสังกัด',
      render: (row: any) => row.school_affiliation_id || '-',
    },
    {
      accessor: 'province',
      title: 'จังหวัด',
      render: (row: any) => row.province || '-',
    },
    {
      accessor: 'status',
      title: 'สถานะ',
      render: (row: any) => {
        const statusText = row.status.toLowerCase();
        const badgeClass =
          statusText === 'enabled'
            ? 'badge-outline-success'
            : statusText === 'disabled'
              ? 'badge-outline-danger'
              : 'badge-outline-dark';
        return (
          <span className={`badge ${badgeClass} flex w-16 items-center justify-center`}>
            {statusLabels[statusText] || statusLabels['draft']}
          </span>
        );
      },
    },
    {
      accessor: 'contract_count',
      title: 'จำนวนสัญญา',
    },
    {
      accessor: 'infoButton',
      title: 'ดูโรงเรียน',
      render: (row: any) => (
        <button
          type="button"
          className="w-2 whitespace-nowrap !px-2"
          onClick={() =>
            navigate({
              to: `${location.pathname}/${row.id}`,
            })
          }
        >
          <IconSearch />
        </button>
      ),
    },
    {
      accessor: 'closeSchool',
      title: 'ปิดโรงเรียน',
      render: (row: any) => (
        <button
          type="button"
          className="w-2 whitespace-nowrap !px-2"
          onClick={() => {
            setModalClose(true);
            setCloseSchoolId(row.id);
          }}
        >
          <IconArchive />
        </button>
      ),
    },
  ];

  const tabsList = [
    { key: '', label: 'ทั้งหมด' },
    { key: 'draft', label: 'แบบร่าง' },
    { key: 'enabled', label: 'ใช้งาน' },
    { key: 'disabled', label: 'ไม่ใช้งาน' },
  ];

  const statusLabels: Record<string, string> = {
    enabled: 'ใช้งาน',
    disabled: 'ไม่ใช้งาน',
    draft: 'แบบร่าง',
  };

  const [modalClose, setModalClose] = useState(false);
  const [closeSchoolId, setCloseSchoolId] = useState<string>('');

  const handleCloseSchool = async () => {
    try {
      const school: SchoolResponse | undefined = records.find(
        (record) => record.id === Number(closeSchoolId),
      );
      if (!school) {
        showMessage('School not found.', 'error');
        return;
      }

      const updatedData: SchoolUpdateRequest = {
        ...school,
        name: school.name || '-',
        address: school.address || '-',
        region: school.region || '-',
        province: school.province || '-',
        district: school.district || '-',
        sub_district: school.sub_district || '-',
        post_code: school.post_code || '-',
        school_affiliation_id: school.school_affiliation_id,
        status: 'disabled',
        updated_by: school.updated_by || '-',
      };

      await API.school.Update(closeSchoolId, updatedData);

      await fetchSchools();
      setModalClose(false);
    } catch (error) {
      showMessage(`Failed to close the school: ${error}`, 'error');
    }
  };

  const onDownload = (dateFrom: string, dateTo: string) => {
    if (!dateFrom || !dateTo) {
      showMessage('กรุณาเลือกวันที่', 'warning');
      return;
    }

    API.school.DownloadCSV({
      start_date: dateFrom,
      end_date: dateTo,
      search_text: filters.search_text,
    });
  };

  const onUploadCSV = async (file?: File): Promise<void> => {
    if (!file) {
      console.error('No file selected');
      return Promise.reject(new Error('File is required for upload'));
    }

    try {
      await API.school.UploadCSV({ file });
      fetchSchools();
      showMessage('อัปโหลด Csv สำเร็จ');
    } catch (error) {
      showMessage(`การอัปโหลดมีปัญหา: ${error}`, 'error');
      throw error;
    }
  };

  const onBulkEdit = async (records: SchoolResponse[]): Promise<void> => {
    if (records.length === 0) {
      console.error('No records selected for bulk edit');
      return Promise.reject(new Error('No records selected'));
    }

    const data = records.map((record) => ({
      id: record.id,
      status: (record.status = 'disabled'),
    }));

    try {
      await API.school.BulkEdit(data);
      console.log('Bulk edit completed successfully');
      API.school.Gets({ page: pagination.page, limit: pagination.limit }).then((res) => {
        if (res.status_code === 200) {
          setRecords(res.data);
        }
      });
      setSelectedRecords([]);
    } catch (error) {
      console.error('Failed to perform bulk edit:', error);
      throw error;
    }
  };

  return (
    <CWTLayout
      breadcrumbs={[
        { text: 'สำหรับแอดมิน', href: '/', disabled: true },
        { text: 'จัดการโรงเรียน', href: '/' },
      ]}
    >
      <div className="flex flex-col gap-[23px]">
        <div>
          <p className="text-2xl font-bold">จัดการโรงเรียน</p>
          <p className="text-sm font-normal">{pagination.total_count} โรงเรียน</p>
        </div>
      </div>

      <div className="panel flex flex-col gap-5">
        {/* Main Content */}
        <CWOHeaderTableButton
          bulkEditDisabled={selectedRecords.length === 0}
          bulkEditActions={[
            {
              label: (
                <div className="flex gap-2">
                  <IconArchive />
                  <div>ปิดใช้งาน</div>
                </div>
              ),
              onClick: () => onBulkEdit(selectedRecords),
            },
          ]}
          onSearchChange={(e) =>
            setFilters((prev) => ({ ...prev, search_text: e.target.value }))
          }
          onBtnClick={(): void => {
            navigate({ to: `${location.pathname}/create` });
          }}
          btnIcon={<IconPlus />}
          btnLabel="เพิ่มโรงเรียน"
          onDownload={(data) => onDownload(data.dateFrom, data.dateTo)}
          onUpload={onUploadCSV}
        />
        <div className="grid grid-cols-4  gap-5">
          <CWSelect
            title="สังกัด"
            options={affiliationOptions}
            value={filters.school_affiliation_id}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, school_affiliation_id: e.target.value }))
            }
            className="min-w-64 col-span-1"
            disabled={fetching}
          />
          <CWSelect
            title="จังหวัด"
            options={provinceOptions}
            value={filters.province}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, province: e.target.value }))
            }
            className="min-w-64 col-span-1"
            disabled={fetching}
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
        />
      </div>

      <CloseSchoolModal
        isOpen={modalClose}
        onClose={() => setModalClose(false)}
        onConfirm={handleCloseSchool}
        closeSchoolId={closeSchoolId}
      />
    </CWTLayout>
  );
};

export default AdminSchool;
