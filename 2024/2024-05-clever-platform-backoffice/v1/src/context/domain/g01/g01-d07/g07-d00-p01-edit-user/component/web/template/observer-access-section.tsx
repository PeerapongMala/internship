import { DataTable } from 'mantine-datatable';
import { ObserverData } from '../../../types';
import { ObserverAccessResponse } from '../../../../local/type';
import { useEffect, useMemo, useState } from 'react';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import config from '@core/config';

interface ObserverAccessSectionProps {
  userData: ObserverData;
  observerAccesses: ObserverAccessResponse[];
  handleObserverAccessChange?: (accessId: number, checked: boolean) => void;
  onTabChange: (accessName: string) => void;
  pagination: {
    page: number;
    limit: number;
    total_count: number;
  };
  setPagination: (pagination: any) => void;
}

const Section = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative flex flex-col rounded-md bg-white p-4 shadow dark:bg-black ${className}`}
  >
    <div className="flex w-full justify-between pb-4">
      <p className="pb-4 text-lg font-bold">{title}</p>
      <a href="/admin/report-permission">
        <button className="btn btn-primary">สิทธิ์การเข้าถึง</button>
      </a>
    </div>
    {children}
  </div>
);

const ObserverAccessSection = ({
  userData,
  observerAccesses,
  handleObserverAccessChange,
  onTabChange,
  pagination,
  setPagination,
}: ObserverAccessSectionProps) => {
  const getColumns = (selectedTab: string) => {
    const baseColumns = [
      {
        accessor: 'select',
        title: 'เลือก',
        width: 80,
        render: (record: ObserverAccessResponse) => (
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={userData.observer_accesses.some(
              (userAccess) => userAccess.observer_access_id === record.id,
            )}
            onChange={(e) => handleObserverAccessChange?.(record.id, e.target.checked)}
          />
        ),
      },
      { accessor: 'id', title: 'รหัส', width: 100 },
      { accessor: 'name', title: 'ชื่อสิทธิ์การใช้งาน' },
      {
        accessor: 'created_at',
        title: 'วันที่สร้าง',
        render: (record: ObserverAccessResponse) =>
          record.created_at
            ? new Date(record.created_at).toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : '-',
      },
      {
        accessor: 'updated_at',
        title: 'แก้ไขล่าสุด',
        render: (record: ObserverAccessResponse) =>
          record.updated_at
            ? new Date(record.updated_at).toLocaleDateString('th-TH', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : '-',
      },
      { accessor: 'updated_by', title: 'แก้ไขล่าสุดโดย' },
    ];

    switch (selectedTab) {
      case 'schoolExecutives':
        return [
          ...baseColumns.slice(0, 3),
          { accessor: 'district_zone', title: 'เขตตรวจ' },
          { accessor: 'area_office', title: 'เขตพื้นที่' },
          ...baseColumns.slice(3),
        ];
      case 'ministryExecutives':
        return [
          ...baseColumns.slice(0, 3),
          { accessor: 'district_group', title: 'กลุ่มเขต' },
          ...baseColumns.slice(3),
        ];
      case 'regionalGroupExecutives':
        return [
          ...baseColumns.slice(0, 3),
          { accessor: 'district_group', title: 'กลุ่มเขต' },
          { accessor: 'district', title: 'เขต' },
          ...baseColumns.slice(3),
        ];
      case 'privateEdCommissionExecutives':
      case 'municipalExecutives':
        return [
          ...baseColumns.slice(0, 3),
          { accessor: 'school_affiliation_group', title: 'ประเภท' },
          { accessor: 'school_affiliation_name', title: 'ชื่อสังกัด' },
          ...baseColumns.slice(3),
        ];
      default:
        return baseColumns;
    }
  };

  const tabsList: { key: string; label: string }[] = useMemo(
    () => [
      { key: 'ทั้งหมด', label: 'ทั้งหมด' },
      { key: 'schoolExecutives', label: 'ผู้บริหารโรงเรียน' },
      { key: 'ministryExecutives', label: 'ผู้บริหารกระทรวง' },
      { key: 'primaryEdServiceAreaExecutives', label: 'ผู้บริหาร สพป.' },
      { key: 'regionalGroupExecutives', label: 'ผู้บริหารกลุ่มเขต' },
      { key: 'areaExecutives', label: 'ผู้บริหาร เขตพื้นที่' },
      { key: 'privateEdCommissionExecutives', label: 'ผู้บริหารเครือโรงเรียน(สข)' },
      { key: 'municipalExecutives', label: 'ผู้บริหาร เทศบาล' },
    ],
    [],
  );

  const [selectedTab, setSelectedTab] = useState(tabsList[0].key);

  const handleTabChange = (index: number) => {
    const newTab = tabsList[index].key;
    setSelectedTab(newTab);
    onTabChange(newTab === 'ทั้งหมด' ? '' : newTab);
  };

  return (
    <Section className="col-span-3" title="ความรับผิดชอบ">
      <div className="w-full overflow-x-auto">
        <div className="mb-4 overflow-x-auto">
          <div className="min-w-max">
            <CWMTabs
              items={tabsList.map((t) => t.label)}
              currentIndex={tabsList.findIndex((tab) => tab.key === selectedTab)}
              onClick={handleTabChange}
            />
          </div>
        </div>
        <DataTable
          className="table-hover whitespace-nowrap"
          records={observerAccesses}
          columns={getColumns(selectedTab)}
          highlightOnHover
          withTableBorder
          withColumnBorders
          // height={'calc(100vh - 350px)'}
          noRecordsText="ไม่พบข้อมูล"
          totalRecords={pagination.total_count}
          recordsPerPage={pagination.limit}
          page={pagination.page}
          onPageChange={(page) => setPagination((prev: any) => ({ ...prev, page }))}
          onRecordsPerPageChange={(limit) =>
            setPagination({
              page: 1,
              limit,
              total_count: pagination.total_count,
            })
          }
          recordsPerPageOptions={config.pagination.itemPerPageOptions}
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
          }
        />
      </div>
    </Section>
  );
};

export default ObserverAccessSection;
