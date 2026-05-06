import { useEffect, useState, useMemo, SetStateAction, useRef } from 'react';
import { CouponStatus, Curriculum, Redeem } from '../local/type';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { toDateTimeTH } from '@global/utils/date';

import { Link, useNavigate } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';
import StoreGlobal from '@store/global';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import Tabs from '@component/web/cw-tabs';
import CWInputSearch from '@component/web/cw-input-search';

import CWWhiteBox from '@component/web/cw-white-box';
import CWButton from '@component/web/cw-button';
import IconDownload from '@component/web/atom/wc-a-icons/IconDownload';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import showMessage from '@global/utils/showMessage';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import API from '../local/api';
import { AxiosError } from 'axios';
import dayjs from '../../../../global/utils/dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import CWModalDownload from '@component/web/cw-modal/cw-modal-download';
import downloadCSV from '@global/utils/downloadCSV';
import UploadButton from './components/web/organism/cw-o-upload';
import ModalArchive from '@core/design-system/library/component/web/Modal/ModalArchive';
import usePagination from '@global/hooks/usePagination';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const DomainJSX = () => {
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const navigate = useNavigate();

  const modalDownload = useModal();
  const modalArchive = useModal();
  const modalArchiveRecall = useModal();
  const GoToCreate = () => {
    navigate({ to: '/gamemaster/redeem/create' });
  };

  const [records, setRecords] = useState<Redeem[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [initialState, setInitialState] = useState<Redeem[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<Redeem[]>([]);
  const [statusFilter, setStatusFilter] = useState<CouponStatus | undefined>(undefined);
  const refUpload = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState('');
  const [startDateFilter, setStartDateFilter] = useState<string | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<string | null>(null);
  const [selectedArchivedRedeem, setSelectedArchivedRedeem] = useState<
    Redeem | undefined
  >(undefined);
  const [selectedArchivedType, setSelectedArchivedType] = useState<Status | undefined>(
    undefined,
  );

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [statusFilter]);

  useEffect(() => {
    fetchRedeemList();
  }, [
    statusFilter,
    pagination.limit,
    pagination.page,
    searchText,
    startDateFilter,
    endDateFilter,
  ]);

  const fetchRedeemList = async () => {
    const payload = {
      page: pagination.page,
      limit: pagination.limit,
      search: searchText,
      started_at_start: startDateFilter
        ? dayjs(startDateFilter, 'DD/MM/YYYY').toISOString()
        : undefined,
      started_at_end: startDateFilter ? new Date() : undefined,
      ended_at_start: endDateFilter ? new Date() : undefined,
      ended_at_end: endDateFilter
        ? dayjs(endDateFilter, 'DD/MM/YYYY').toISOString()
        : undefined,
      status: statusFilter,
    };

    const data = await API.redeem.GetList(
      {
        Query: payload,
      },
      onFetchRedeemListError,
    );

    setPagination((prev) => ({ ...prev, total_count: data._pagination.total_count }));

    setRecords(data.data);
  };

  const onFetchRedeemListError = (err: AxiosError) => {
    console.error(err);
  };

  const columnDefs = useMemo<DataTableColumn<Redeem>[]>(() => {
    const finalDefs: DataTableColumn<Redeem>[] = [
      {
        accessor: 'id',
        title: '#',
        render: (_, index) => {
          return index + 1 + (pagination.page - 1) * pagination.limit;
        },
      },
      {
        accessor: 'started_at',
        title: 'วันที่เผยแพร่',
        render: (record) => {
          return record.started_at ? toDateTimeTH(record.started_at) : '-';
        },
      },
      {
        accessor: 'ended_at',
        title: 'วันที่หมดอายุ',
        render: (record) => {
          return record.ended_at ? toDateTimeTH(record.ended_at) : '-';
        },
      },
      {
        accessor: 'code',
        title: 'รหัสโค้ดคูปอง',
        render: (record) => {
          return record.code;
        },
      },
      {
        accessor: 'used_count',
        title: 'การใช้งานคูปอง',
        render: (record) => (
          <div className="flex">
            <p className="font-bold">{record.used_count}</p> /
            <p className="text-gray-400">
              {record.initial_stock === undefined ? 'ไม่จำกัด' : record.initial_stock}
            </p>
          </div>
        ),
      },
      {
        accessor: 'days_remaining',
        title: 'วันคงเหลือ',
        render: (record) => {
          if (!record.ended_at) return '-';
          const endDate = dayjs(record.ended_at);
          const startDate = dayjs(record.started_at);
          const diffDays = endDate.diff(startDate, 'day');

          return diffDays > 0 ? `${diffDays} วัน` : 'หมดอายุแล้ว';
        },
      },

      {
        accessor: 'status',
        title: 'สถานะ',
        render: ({ show_status }) => {
          if (show_status === CouponStatus.WAITING)
            return <span className="badge badge-outline-warning">รอเผยแพร่</span>;
          else if (show_status === CouponStatus.EXPIRE)
            return <span className="badge badge-outline-danger">หมดอายุ</span>;
          else if (show_status === CouponStatus.PUBLISH)
            return <span className="badge badge-outline-success">เผยแพร่</span>;
          else if (show_status === CouponStatus.DISABLED)
            return <span className="badge badge-outline-danger">ปิดใช้งาน</span>;
        },
      },
      {
        accessor: 'history',
        title: 'ประวัติ',
        render: ({ id }) => (
          <Link to="./$historyId/history" params={{ historyId: id }}>
            <IconSearch />
          </Link>
        ),
      },

      {
        accessor: 'archive',
        title: 'จัดเก็บ',
        render: (record) => {
          const { show_status } = record;
          const isDisabled =
            show_status === CouponStatus.DISABLED || show_status === CouponStatus.EXPIRE;
          return isDisabled ? (
            <button
              type="button"
              onClick={() => {
                modalArchiveRecall.open();
                setSelectedArchivedRedeem(record);
                setSelectedArchivedType('enabled');
              }}
              className={isDisabled ? 'cursor-not-allowed opacity-50' : ''}
              disabled={isDisabled}
            >
              <IconArchive />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                modalArchive.open();
                setSelectedArchivedRedeem(record);
                setSelectedArchivedType('disabled');
              }}
            >
              <IconArchive />
            </button>
          );
        },
      },
    ];

    return finalDefs;
  }, [statusFilter, pagination.page, pagination.limit, records]);

  const handleSelectionChange = (selectedRows: SetStateAction<Redeem[]>) => {
    setSelectedRecords(selectedRows);
  };

  const handleBulkEdit = async (status: 'enabled' | 'disabled') => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกข้อมูลเพื่อแก้ไขสถานะ', 'error');
      return;
    }

    await API.redeem.BulkEditCoupon(selectedRecords, status);

    fetchRedeemList();
    setSelectedRecords([]);

    showMessage('อัพเดทสถานะจัดเก็บสำเร็จ');
  };

  const handleArchived = async () => {
    if (!selectedArchivedRedeem || !selectedArchivedType) {
      setSelectedArchivedRedeem(undefined);
      setSelectedArchivedType(undefined);
      return;
    }

    try {
      await API.redeem.BulkEditCoupon([selectedArchivedRedeem], selectedArchivedType);
      await fetchRedeemList();
    } catch (error) {
      showMessage('ไม่สามารถอัพเดทสถานะจัดเก็บได้', 'error');
    }
    setSelectedArchivedRedeem(undefined);
    setSelectedArchivedType(undefined);
    modalArchive.close();
    modalArchiveRecall.close();
  };

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDownload = async () => {
    try {
      const data = await API.redeem.GetDownload({
        start_date: startDate,
        end_date: endDate,
      });

      downloadCSV(data, 'coupon_data.csv');
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    try {
      const res = await API.redeem.PostUpload({
        Body: {
          csv_file: file,
        },
      });

      console.log('Upload successful:', res);
    } catch (error) {
      console.error('Upload failed:', error);
      return;
    }
    fetchRedeemList();
  };

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'ระบบเกม', href: '#' },
          { label: 'ข้อมูลการตลาด', href: '#' },
          { label: 'จัดการคูปอง', href: '#' },
        ]}
      />

      <div className="mt-5 flex w-full flex-col gap-3">
        <h1 className="text-[26px] font-bold">จัดการคูปอง</h1>
        <p>{pagination.total_count} รายการ</p>
      </div>

      <CWWhiteBox className="mt-5">
        <div className="flex w-full justify-between gap-3">
          <div className="flex gap-3">
            <div className="dropdown">
              <Dropdown
                placement={'bottom-start'}
                btnClassName="btn btn-primary dropdown-toggle gap-1"
                button={
                  <>
                    Bulk Edit
                    <IconCaretDown />
                  </>
                }
                disabled={selectedRecords.length === 0}
              >
                <ul className="!min-w-[170px]">
                  {/* <li>
                    <button
                      type="button"
                      className="w-full"
                      onClick={() => handleBulkEdit('enabled')}
                    >
                      <div className="flex w-full justify-between">
                        <span>เปิดใช้งาน</span>
                        <IconCornerUpLeft />
                      </div>
                    </button>
                  </li> */}
                  <li>
                    <button
                      type="button"
                      className="w-full"
                      onClick={() => handleBulkEdit('disabled')}
                    >
                      <div className="flex w-full justify-between">
                        <span>ปิดใช้งาน</span>
                        <IconArchive />
                      </div>
                    </button>
                  </li>
                </ul>
              </Dropdown>
            </div>
            <CWButton
              title="เพิ่มโค้ด"
              icon={<IconPlus />}
              onClick={GoToCreate}
              className="h-[38px]"
            />
            <p className="border-0 border-l border-neutral-300" />
            <CWInputSearch
              placeholder="ค้นหา"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="flex gap-x-[10px]">
            <CWButton
              title="Download"
              icon={<IconDownload />}
              onClick={modalDownload.open}
            />
            {
              <CWModalDownload
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                onDownload={handleDownload}
                open={modalDownload.isOpen}
                onClose={modalDownload.close}
              />
            }
            <UploadButton onFileChange={handleUpload} />
          </div>
        </div>

        <div className="my-5 grid grid-cols-8 gap-5">
          <div className="relative col-span-2">
            <WCAInputDateFlat
              options={{
                dateFormat: 'd/m/Y',
              }}
              placeholder="วันที่เผยแพร่"
              className="w-full"
              onChange={(date) =>
                setStartDateFilter(date?.[0] ? dayjs(date[0]).format('DD/MM/YYYY') : null)
              }
            />
          </div>

          <div className="relative col-span-2">
            <WCAInputDateFlat
              options={{
                dateFormat: 'd/m/Y',
              }}
              placeholder="วันที่หมดอายุ"
              className="w-full"
              onChange={(date) =>
                setEndDateFilter(date?.[0] ? dayjs(date[0]).format('DD/MM/YYYY') : null)
              }
            />
          </div>
        </div>

        <div className="w-full">
          <Tabs
            currentTab={statusFilter}
            setCurrentTab={(value) => setStatusFilter(value)}
            tabs={[
              { label: 'ทั้งหมด', value: undefined },
              { label: 'รอเผยแพร่', value: CouponStatus.WAITING },
              { label: 'เผยแพร่', value: CouponStatus.PUBLISH },
              { label: 'หมดอายุ', value: CouponStatus.EXPIRE },
              { label: 'ปิดใช้งาน', value: CouponStatus.DISABLED },
            ]}
          />
        </div>

        <div className="mt-5 w-full">
          <DataTable
            className="table-hover whitespace-nowrap"
            minHeight={200}
            columns={columnDefs}
            records={records}
            totalRecords={pagination.total_count}
            recordsPerPage={pagination.limit}
            page={pagination.page}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            onRecordsPerPageChange={(limit) => {
              setPagination((prev) => ({ ...prev, limit }));
            }}
            recordsPerPageOptions={pageSizeOptions}
            paginationText={({ from, to, totalRecords }) =>
              `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
            }
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={handleSelectionChange}
          />
        </div>
      </CWWhiteBox>

      <ModalArchive
        open={modalArchive.isOpen}
        onOk={handleArchived}
        onClose={() => {
          setSelectedArchivedRedeem(undefined);
          setSelectedArchivedType(undefined);
          modalArchive.close();
        }}
      />
      {/* <CWModalArchiveRecall
        open={modalArchiveRecall.isOpen}
        onOk={handleArchived}
        onClose={() => {
          setSelectedArchivedRedeem(undefined);
          setSelectedArchivedType(undefined);
          modalArchiveRecall.close()
        }}
      /> */}
    </div>
  );
};

export default DomainJSX;
