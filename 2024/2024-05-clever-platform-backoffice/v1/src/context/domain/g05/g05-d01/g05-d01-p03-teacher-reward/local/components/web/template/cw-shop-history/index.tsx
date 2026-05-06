import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { NewStoreItem, StoreItem, StoreTransaction } from '../../../../api/types/shop';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { useNavigate } from '@tanstack/react-router';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';
import { toDateTH, toDateTimeTH } from '@global/utils/date';
import CwProgress from '@component/web/cw-progress';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import { useTranslation } from 'react-i18next';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import usePagination from '@global/hooks/usePagination';

export interface CWShopHistoryProps {
  translationKey: string;
  breadcrumbs: {
    label: string;
    href: string;
  }[];
  itemType: ItemType;
  onDataLoad(params: {
    setRecords: Dispatch<SetStateAction<StoreTransaction[]>>;
    setTotalRecords: (total: number) => void;
    setFetching: Dispatch<SetStateAction<boolean>>;
    searchText: string;
    page: number;
    limit: number;
  }): void;
  onBulkEdit(
    status: StoreTransaction['status'],
    records: StoreTransaction[],
  ): Promise<any>;
  onReclaim(record: StoreTransaction): void;
  item?: NewStoreItem;
  onDownload?: (data: { start_date: string; end_date: string }) => void;
  onUpload?: (file: File | undefined) => void;
  reload?: boolean;
}

const CWShopHistory = function ({
  translationKey,
  breadcrumbs,
  itemType,
  onBulkEdit,
  onDataLoad,
  onReclaim,
  item,
  reload,
}: CWShopHistoryProps) {
  const { t } = useTranslation([translationKey]);
  const navigate = useNavigate();
  const [records, setRecords] = useState<StoreTransaction[]>([]);
  const {
    page,
    pageSize: limit,
    totalCount: totalRecords,
    setPage,
    setPageSize: setLimit,
    setTotalCount: setTotalRecords,
  } = usePagination();
  const [searchText, setSearchText] = useState('');
  const [fetching, setFetching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<StoreTransaction[]>([]);

  const statuses = [
    {
      label: 'เรียกคืน',
      value: 'recalled',
      className: 'badge-outline-danger',
    },
    {
      label: 'ใช้คูปองแล้ว',
      value: 'enabled',
      className: 'badge-outline-success',
    },
  ];

  useEffect(() => {
    onDataLoad({
      setRecords,
      searchText,
      setTotalRecords,
      setFetching,
      page,
      limit,
    });
  }, [page, limit, searchText, reload]);

  return (
    <div className="flex flex-col gap-6 px-5 font-noto-sans-thai md:px-0">
      <div className="mt-5 flex items-center justify-center gap-4 text-2xl">
        <button
          onClick={() => {
            navigate({ to: '../..' });
          }}
        >
          <IconArrowBackward />
        </button>
        <div className="font-bold">ประวัติการซื้อ</div>
      </div>

      {item ? (
        <>
          <div className="flex flex-col gap-2 *:rounded-lg *:bg-gray-100 *:p-3 sm:flex-row sm:gap-4 sm:*:p-4">
            {/* รายการแรก - รหัสและชื่อไอเทม */}
            <div className="flex-1">
              <div className="text-sm sm:text-base">รหัสไอเทม: {item.id}</div>
              <div className="text-lg sm:text-xl">{item.item_name}</div>
            </div>

            {/* รายการที่สอง - ช่วงเวลาขาย */}
            <div className="flex-1">
              <div className="text-sm sm:text-base">ช่วงเวลาขาย:</div>
              <div className="text-lg sm:text-xl">
                {item.open_date == null && item.closed_date == null ? (
                  'ไม่มีกำหนด'
                ) : (
                  <>
                    {item.open_date ? toDateTH(item.open_date) : 'ไม่มีกำหนด'} -{' '}
                    {item.closed_date ? toDateTH(item.closed_date) : 'ไม่มีกำหนด'}
                  </>
                )}
              </div>
            </div>

            {/* รายการที่สาม - จำนวนขาย */}
            <div className="flex-1">
              <div className="text-sm sm:text-base">ขายแล้ว / ทั้งหมด:</div>
              <div className="text-lg sm:text-xl">
                <div>
                  {item.initial_stock == null
                    ? 'ไม่จำกัด'
                    : `${item.stock} / ${item.initial_stock}`}
                </div>
                <div className="w-full sm:w-24">
                  <CwProgress
                    percent={
                      item.initial_stock ? (item.stock / item.initial_stock) * 100 : 100
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <CWTableTemplate
            header={{
              bulkEditDisabled: !selectedRecords.length,
              bulkEditActions: [
                {
                  label: (
                    <div className="flex gap-2">
                      <IconCornerUpLeft />
                      <div>เรียกคืน</div>
                    </div>
                  ),
                  onClick: () => {
                    onBulkEdit('recalled', selectedRecords).then((res) => {
                      if (res) {
                        setSelectedRecords([]);
                      }
                    });
                  },
                },
              ],
              onSearchChange: (e) => {
                const value = e.currentTarget.value;
                setSearchText(value);
              },
              showDownloadButton: false,
              showUploadButton: false,
            }}
            table={{
              records,
              fetching,
              minHeight: 400,
              page,
              onPageChange: setPage,
              limit,
              onLimitChange: setLimit,
              totalRecords,
              selectedRecords,
              onSelectedRecordsChange: setSelectedRecords,
              columns: [
                {
                  accessor: '#',
                  title: '#',
                  render(_, index) {
                    return index + 1;
                  },
                },
                {
                  accessor: 'student_id',
                  title: 'รหัสนักเรียน',
                },
                {
                  accessor: 'title',
                  title: 'คำนำหน้า',
                },
                {
                  accessor: 'first_name',
                  title: 'ชื่อ',
                },
                {
                  accessor: 'last_name',
                  title: 'สกุล',
                },
                {
                  accessor: 'bought_at',
                  title: 'วันที่ซื้อสินค้า',
                  render(record, index) {
                    return toDateTimeTH(record.bought_at);
                  },
                },
                {
                  accessor: 'recalled_at',
                  title: 'วันที่เรียกคืนสินค้า',
                  render(record, index) {
                    return record.recalled_at ? toDateTimeTH(record.recalled_at) : '-';
                  },
                },
                {
                  accessor: 'status',
                  title: 'สถานะ',
                  render(record, index) {
                    const status = statuses.find((s) => s.value == record.status);
                    return (
                      <span className={`badge text-nowrap ${status?.className ?? ''}`}>
                        {status?.label ?? record.status}
                      </span>
                    );
                  },
                },
                {
                  accessor: 'reclaimBtn',
                  title: 'เรียกคืน',
                  render(record, index) {
                    return (
                      <button
                        disabled={record.status == 'recalled'}
                        onClick={() => {
                          onReclaim(record);
                        }}
                      >
                        <IconCornerUpLeft
                          className={record.status == 'recalled' ? 'text-gray-400' : ''}
                        />
                      </button>
                    );
                  },
                },
              ],
            }}
          />
        </>
      ) : (
        <div>ไม่พบข้อมูล</div>
      )}
    </div>
  );
};

export default CWShopHistory;
