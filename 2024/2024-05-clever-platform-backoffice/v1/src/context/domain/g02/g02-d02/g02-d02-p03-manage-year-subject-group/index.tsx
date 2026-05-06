import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ManageYearStatus, IManageYear } from '../local/type';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';

import ManageYearHeader from './component/web/template/wc-t-header';
import Tabs from './component/web/molecule/wc-m-tabs';
import IconPlus from '@core/design-system/library/vristo/source/components/Icon/IconPlus';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconSearch from '@core/design-system/library/vristo/source/components/Icon/IconSearch';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import IconArchive from '@core/design-system/library/vristo/source/components/Icon/IconArchive';

import { DataTable } from 'mantine-datatable';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const [selectedTab, setSelectedTab] = useState('กลุ่มวิชา');
  const [selectedUseStatusType, setSelectedUseStatusType] = useState<
    ManageYearStatus | undefined
  >();

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedRecords, setSelectedRecords] = useState<IManageYear[]>([]);
  const [records, setRecords] = useState<IManageYear[]>([]);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    // Filter records based on selected status
    // setRecords(
    //   MANAGE_YEAR_MOCK_DATA.filter(
    //     (item) => !selectedUseStatusType || item.status === selectedUseStatusType
    //   )
    // );
  }, [selectedUseStatusType]);

  return (
    <div className="flex flex-col gap-y-5 font-noto-sans-thai text-[#0E1726]">
      <ManageYearHeader />

      <Tabs
        currentTab={selectedTab}
        setCurrentTab={setSelectedTab}
        tabs={[
          { label: 'กลุ่มวิชา', value: 'กลุ่มวิชา' },
          { label: 'หลักสูตร/วิชา', value: 'หลักสูตร/วิชา' },
        ]}
      />

      <div className="flex flex-col gap-5 rounded-md bg-white p-5 shadow">
        <div className="flex max-h-[40px] justify-between">
          <div className="flex gap-2.5">
            <button type="button" className="btn btn-primary flex gap-1">
              Bulk Edit
              <IconCaretDown />
            </button>
            <button type="button" className="btn btn-primary gap-1">
              <IconPlus />
              เพิ่มหลักสูตร
            </button>

            <div className="relative">
              <input type="text" placeholder="ค้นหา" className="form-input !pr-8" />
              <button type="button" className="!absolute right-0 top-0 mr-2 h-full">
                <IconSearch className="!h-5 !w-5" />
              </button>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button type="button" className="btn btn-primary flex gap-1">
              <IconDownload />
              CSV
            </button>
            <button type="button" className="btn btn-primary flex gap-1">
              <IconUpload />
              CSV
            </button>
          </div>
        </div>

        <Tabs
          currentTab={selectedUseStatusType}
          setCurrentTab={setSelectedUseStatusType}
          tabs={[
            { label: 'ทั้งหมด', value: undefined },
            { label: ManageYearStatus.DRAFT, value: ManageYearStatus.DRAFT },
            {
              label: ManageYearStatus.IN_USE,
              value: ManageYearStatus.IN_USE,
            },
            {
              label: ManageYearStatus.NOT_IN_USE,
              value: ManageYearStatus.NOT_IN_USE,
            },
          ]}
        />

        <div className="table-responsive">
          <DataTable
            className="table-hover whitespace-nowrap"
            columns={[
              { accessor: 'id', title: '#', render: (_, index) => index + 1 },
              { accessor: 'manageyearId', title: 'รหัสกลุ่มวิชา' },
              { accessor: 'manageyearName', title: 'ชื่อกลุ่มวิชา' },
              { accessor: 'courseCount', title: 'จำนวนหลักสูตร' },
              {
                accessor: 'updated_at',
                title: 'แก้ไขล่าสุด',
                render: ({ updated_at }) => updated_at,
              },
              { accessor: 'lastUpdatedBy', title: 'แก้ไขล่าสุดโดย' },
              {
                accessor: 'status',
                title: 'สถานะ',
                render: ({ status }) => (
                  <span
                    className={
                      status === ManageYearStatus.IN_USE
                        ? 'badge badge-outline-success'
                        : status === ManageYearStatus.DRAFT
                          ? 'badge badge-outline-dark'
                          : 'badge badge-outline-danger'
                    }
                  >
                    {status}
                  </span>
                ),
              },
              {
                accessor: 'edit',
                title: 'แก้ไข',
                render: ({ id }) => (
                  <Link to={`/affiliation/${id}`}>
                    <IconPencil />
                  </Link>
                ),
              },
              {
                accessor: 'archive',
                title: 'ปิดสังกัด',
                render: ({ status }) =>
                  status === ManageYearStatus.NOT_IN_USE ? (
                    <IconArrowBackward />
                  ) : (
                    <IconArchive />
                  ),
              },
            ]}
            records={records}
            // totalRecords={MANAGE_YEAR_MOCK_DATA.length}
            // page={page}
            // onPageChange={setPage}
            // recordsPerPage={pageSize}
            // recordsPerPageOptions={[10, 25, 50]}
            // onRecordsPerPageChange={setPageSize}
            // selectedRecords={selectedRecords}
            // onSelectedRecordsChange={setSelectedRecords}
            // minHeight={200}
            // paginationText={({ from, totalRecords }) => {
            //   const currentPage = Math.ceil(from / pageSize);
            //   const totalPage = Math.ceil(totalRecords / pageSize);
            //   return `แสดงหน้าที่ ${currentPage} จากทั้งหมด ${totalPage} หน้า`;
            // }}
          />
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;
