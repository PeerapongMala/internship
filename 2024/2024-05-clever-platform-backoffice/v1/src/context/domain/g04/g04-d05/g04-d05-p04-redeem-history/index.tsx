import { useEffect, useState, useMemo, SetStateAction, useRef } from 'react';
import {
  BugReport,
  BugReportStatus,
  CouponID,
  CouponStatus,
  Curriculum,
  History,
  UsedCouponStatus,
} from '../local/type';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { toDateTimeTH } from '@global/utils/date';

import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useDebouncedValue } from '@mantine/hooks';
import StoreGlobalPersist from '@store/global/persist';
import StoreGlobal from '@store/global';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import Tabs from '@component/web/cw-tabs';
import CWInputSearch from '@component/web/cw-input-search';

import CWWhiteBox from '@component/web/cw-white-box';
import CWSelect from '@component/web/cw-select';
import CWButton from '@component/web/cw-button';
import IconDownload from '@component/web/atom/wc-a-icons/IconDownload';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import { WCAInputDateFlat } from '@component/web/atom/wc-a-input-date';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import CWNeutralBox from '@component/web/cw-neutral-box';
import ProgressBar from '../local/components/web/organism/Progressbar';
import CWTitleBack from '@component/web/cw-title-back';
import showMessage from '@global/utils/showMessage';
import Dropdown from '@core/design-system/library/vristo/source/components/Dropdown';
import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconUpload from '@component/web/atom/wc-a-icons/IconUpload';
import API from '../local/api';
import { TGetCouponIDRes } from '../local/api/helper/redeem';
import dayjs from '../../../../global/utils/dayjs';
import EventTimeRange from './components/web/atom/cw-a-event-time-range';
import usePagination from '@global/hooks/usePagination';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

const DomainJSX = () => {
  const navigate = useNavigate();
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [user, setUser] = useState({ id: '', first_name: '' });
  const { userData: globalUserData } = StoreGlobalPersist.StateGet(['userData']);
  const { historyId } = useParams({ strict: false });

  const [filterSearch, setFilterSearch] = useState<any>({
    search_text: '',
    year_id: undefined,
    status: undefined,
  });
  const totalAvg = 10;

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const refUpload = useRef<HTMLInputElement>(null);
  const [records, setRecords] = useState<History[]>([]);
  const [couponInfo, setCouponInfo] = useState<CouponID>();
  const [selectedRecords, setSelectedRecords] = useState<History[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [searchText, setSearchText] = useState<string>('');
  const [useDate, setUseDate] = useState<string>('');

  useEffect(() => {
    fetchCouponList();
  }, [pagination.page, pagination.limit, searchText, startDate, endDate]);

  const fetchCouponList = async () => {
    setFetching(true);
    try {
      const response = await API.redeem.GetCoupon({
        Query: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchText,
          used_at_start: startDate ?? undefined,
          used_at_end: endDate ?? undefined,
        },
        Param: { couponId: historyId as string },
      });
      setRecords(response.data || []);

      setPagination((prev) => ({
        ...prev,
        total_count: response._pagination.total_count || 0,
      }));
    } catch (error) {
      console.error('Error fetching coupon list:', error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCouponID();
  }, []);

  const fetchCouponID = async () => {
    setFetching(true);
    try {
      const response: TGetCouponIDRes = await API.redeem.GetCouponID({
        Param: { couponId: historyId as string },
        status_code: 0,
        message: '',
      });

      const transformedRecords: CouponID = {
        id: response.data.id,
        code: response.data.code || '',
        started_at: response.data.started_at || '',
        ended_at: response.data.ended_at || '',
        initial_stock: response.data.initial_stock || 0,
        stock: response.data.stock || 0,
        avatar_id: response.data.avatar_id || null,
        pet_id: response.data.pet_id || null,
        gold_coin_amount: response.data.gold_coin_amount || 0,
        arcade_coin_amount: response.data.arcade_coin_amount || 0,
        ice_amount: response.data.ice_amount || 0,
        status: response.data.status || '',
        created_at: response.data.created_at || '',
        created_by: response.data.created_by || '',
        updated_at: response.data.updated_at || '',
        updated_by: response.data.updated_by || '',
      };

      setCouponInfo(transformedRecords);
    } catch (error) {
      console.error('Error fetching coupon ID:', error);
    } finally {
      setFetching(false);
    }
  };

  const columnDefs = useMemo<DataTableColumn<History>[]>(() => {
    const finalDefs: DataTableColumn<History>[] = [
      {
        accessor: 'index',
        title: '#',
        render: (record) => {
          return record.coupon_transaction_id;
        },
      },
      {
        accessor: 'id',
        title: 'รหัสนักเรียน',
        render: (record) => {
          return record.student_id;
        },
      },
      {
        accessor: 'title',
        title: 'คำนำหน้า',
        render: (record) => {
          return record.title;
        },
      },
      {
        accessor: 'first_name',
        title: 'ชื่อ',
        render: (record) => {
          return record.first_name;
        },
      },
      {
        accessor: 'last_name',
        title: 'สกุล',
        render: (record) => {
          return record.last_name;
        },
      },
      {
        accessor: 'shcool_name',
        title: 'โรงเรียน',
        render: (record) => {
          return record.school_name;
        },
      },
      {
        accessor: 'date_use_coupon',
        title: 'วันที่ใช้คูปอง',
        render: (record) => {
          return record.used_at ? toDateTimeTH(record.used_at) : '-';
        },
      },

      {
        accessor: 'date_recall_coupon',
        title: 'วันที่เรียกคืนคูปอง',
        render: (record) => {
          return record.recalled_at ? toDateTimeTH(record.recalled_at) : '-';
        },
      },

      {
        accessor: 'status',
        title: 'สถานะ',
        render: ({ status }) => {
          if (status === UsedCouponStatus.RECALL)
            return <span className="badge badge-outline-danger">เรียกคืน</span>;
          else if (status === UsedCouponStatus.USED)
            return <span className="badge badge-outline-success">ใช้คูปองแล้ว</span>;
        },
      },
    ];
    return finalDefs;
  }, []);

  const handleSelectionChange = (selectedRows: SetStateAction<History[]>) => {
    setSelectedRecords(selectedRows);
  };
  const handleBulkEdit = (status: UsedCouponStatus) => {
    if (selectedRecords.length === 0) {
      showMessage('กรุณาเลือกข้อมูลเพื่อแก้ไขสถานะ', 'error');
      return;
    }

    const updatedRecords = records.map((record) =>
      selectedRecords.some(
        (selected) => selected.coupon_transaction_id === record.coupon_transaction_id,
      )
        ? { ...record, status }
        : record,
    );

    setRecords(updatedRecords);
    showMessage('Bulk edit simulated successfully');
  };

  const paginatedRecords = useMemo(() => {
    return records.slice(
      (pagination.page - 1) * pagination.limit,
      pagination.page * pagination.limit,
    );
  }, [records, pagination.page, pagination.limit]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) =>
      [record.first_name, record.last_name, record.school_name].some((field) =>
        field?.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
  }, [records, searchText]);

  return (
    <div className="w-full">
      <CWBreadcrumbs
        links={[
          { label: 'ระบบเกม', href: '#' },
          { label: 'ข้อมูลการตลาด', href: '#' },
          { label: 'จัดการคูปอง', href: '#' },
          { label: 'ประวัติการใช้คูปอง', href: '#' },
        ]}
      />

      <div className="mt-5 flex w-full flex-col gap-3">
        <CWTitleBack label="ประวัติการใช้คูปอง" href="../../" />
      </div>

      <div className="mt-5 flex w-full gap-5">
        <EventTimeRange couponInfo={couponInfo} />
        <CWNeutralBox>
          <div className="flex flex-col gap-5">
            <h1>ไอเทม</h1>
            <p className="text-[20px]">
              เหรียญ / เหรียญ Arcade:{' '}
              {`${couponInfo?.gold_coin_amount ?? '-'} / ${couponInfo?.arcade_coin_amount ?? '-'}`}
            </p>
          </div>
        </CWNeutralBox>
        <CWNeutralBox className="flex flex-col gap-3">
          <h1>คูปองคงเหลือ</h1>
          <div className="flex flex-col text-[22px]">
            <div className="flex">
              <p>{couponInfo?.stock ?? '-'}</p>/<p>{couponInfo?.initial_stock ?? '-'}</p>
            </div>
            <ProgressBar
              score={couponInfo?.stock ?? 0}
              total={couponInfo?.initial_stock ?? 0}
            />
          </div>
        </CWNeutralBox>
      </div>

      <CWWhiteBox className="mt-5">
        <div className="my-5 flex w-full gap-5">
          <div className="flex gap-3">
            <CWInputSearch
              placeholder="ค้นหา"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>

          <WCAInputDateFlat
            options={{
              dateFormat: 'd/m/Y',
            }}
            placeholder="วันที่เริ่ม"
            className="col-span-1"
            onChange={(date) => setStartDate(date[0])}
          />

          <WCAInputDateFlat
            options={{
              dateFormat: 'd/m/Y',
            }}
            placeholder="วันที่สิ้นสุด"
            className="col-span-1"
            onChange={(date) => setEndDate(date[0])}
          />
        </div>

        <div className="mt-5 w-full">
          <DataTable
            className="table-hover whitespace-nowrap"
            minHeight={200}
            columns={columnDefs}
            records={filteredRecords}
            totalRecords={filteredRecords.length}
            recordsPerPage={pagination.limit}
            page={pagination.page}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            onRecordsPerPageChange={(limit) => {
              console.log('Records Per Page Changed:', limit);
              setPagination((prev) => ({ ...prev, limit, page: 1 }));
            }}
            recordsPerPageOptions={pageSizeOptions}
            paginationText={({ from, to, totalRecords }) =>
              `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
            }
          />
        </div>
      </CWWhiteBox>
    </div>
  );
};

export default DomainJSX;
