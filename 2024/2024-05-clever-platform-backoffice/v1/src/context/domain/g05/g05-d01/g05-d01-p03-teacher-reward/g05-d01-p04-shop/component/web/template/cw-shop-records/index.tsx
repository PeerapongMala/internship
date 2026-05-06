import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import IconMagnifer from '@domain/g01/g01-d06/local/component/web/atom/wc-a-icon-magnify';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';

import { toDateTimeTH } from '@global/utils/date';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import { StoreItem } from '@domain/g03/g03-d09/local/api/type';
import CWLayout from '../cw-layout';
import IconCopy from '@core/design-system/library/component/icon/IconCopy';
import usePagination from '@global/hooks/usePagination';
import CWTable from '@domain/g04/g04-d02/local/component/web/cw-table';
import CWButton from '@component/web/cw-button';
import CWInputSearch from '@component/web/cw-input-search';
import CWMDropdown, { DropdownItem } from '@component/web/molecule/cw-m-dropdown';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import SelectUserSubjectData from '@component/web/cw-select-user-subject-data';
import CWSelect from '@component/web/cw-select';
import CWMAccordion from '@component/web/molecule/cw-m-accordion';
import { getUserSubjectData } from '@global/utils/store/user-subject';

export interface CWShopRecordsProps {
  translationKey: string;
  breadcrumbs?: {
    label: string;
    href: string;
  }[];
  className?: string;
  type: 'frame' | 'badge' | 'coupon';
  onDataLoad(params: {
    setRecords: React.Dispatch<React.SetStateAction<StoreItem[]>>;
    setTotalRecords: (total: number) => void;
    setFetching: React.Dispatch<React.SetStateAction<boolean>>;
    page: number;
    limit: number;
    status: string;
    searchText: string;
  }): void;
  onArchive: (record: StoreItem) => void;
  onBulkEditEnable: (records: StoreItem[]) => Promise<boolean>;
  onBulkEditDisable: (records: StoreItem[]) => Promise<boolean>;
  reload?: boolean;
  itemHref: string;
  userType?: 'gm' | 'teacher';
}

const CWShopRecords = function ({
  translationKey,
  breadcrumbs,
  type,
  onDataLoad,
  onArchive,
  onBulkEditEnable,
  onBulkEditDisable,
  reload,
  itemHref,
  userType = 'gm',
  className,
}: CWShopRecordsProps) {
  const userSubjectData = getUserSubjectData();
  const navigate = useNavigate();

  const statuses = [
    { key: '', label: 'ทั้งหมด', className: '' },
    { key: 'pending', label: 'รอเผยแพร่', className: 'badge-outline-warning' },
    { key: 'enabled', label: 'เผยแพร่', className: 'badge-outline-success' },
    { key: 'expired', label: 'หมดอายุ', className: 'badge-outline-danger' },
  ] as const;

  const [selectedRecords, setSelectedRecords] = useState<StoreItem[]>([]);
  const [currentStatusTabIndex, setCurrentStatusTabIndex] = useState(0);
  const [records, setRecords] = useState<StoreItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const {
    page,
    pageSize: limit,
    totalCount: totalRecords,
    setPage,
    setPageSize: setLimit,
    setTotalCount: setTotalRecords,
  } = usePagination();
  const [fetching, setFetching] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<StoreItem>();
  const [modalState, setModalState] = useState<'' | 'recall' | 'archive'>('');

  function closeModal() {
    setModalState('');
    setSelectedRecord(undefined);
  }

  useEffect(() => {
    onDataLoad({
      limit,
      page,
      searchText,
      setFetching,
      setRecords,
      setTotalRecords,
      status: statuses[currentStatusTabIndex]?.key ?? '',
    });
  }, [reload, type, page, limit, searchText, currentStatusTabIndex, userSubjectData.id]);

  const hasRecords = records.length > 0;

  // Bulk edit dropdown items
  const bulkEditActions: DropdownItem[] = [
    {
      label: (
        <div className="flex gap-3">
          <IconArchive /> หมดอายุ
        </div>
      ),
      onClick: () => {
        onBulkEditDisable(selectedRecords).then((res) => {
          if (res) setSelectedRecords([]);
        });
      },
    },
    {
      label: (
        <div className="flex gap-3">
          <IconArrowBackward duotone={false} /> เผยแพร่
        </div>
      ),
      onClick: () => {
        onBulkEditEnable(selectedRecords).then((res) => {
          if (res) setSelectedRecords([]);
        });
      },
    },
  ];

  return (
    <CWLayout
      breadcrumbs={breadcrumbs}
      type={type}
      itemHref={itemHref}
      userType={userType}
    >
      <div className={`panel flex flex-col gap-5 ${className ?? ''}`}>
        <CWMDropdown
          disabled={!selectedRecords.length}
          label={
            <>
              Bulk Edit <IconArrowDown />
            </>
          }
          items={bulkEditActions}
        />

        <CWMAccordion title="ตัวกรอง" headerClassName="bg-[#D5DDFF]">
          <div className="mt-3 flex flex-col gap-3 bg-[#F0F3FF] px-3 py-5">
            {/* Search */}
            <CWInputSearch
              placeholder={'ค้นหา'}
              onChange={(e) => setSearchText(e.currentTarget.value)}
              className="w-full md:w-auto"
            />

            <SelectUserSubjectData className="w-full" />
          </div>
        </CWMAccordion>
        <CWButton
          className="w-full gap-2 !px-3 !font-bold md:w-auto"
          icon={<IconPlus />}
          onClick={() => {
            navigate({ to: '/line/teacher/reward/store/coupon/create' });
          }}
          title="รางวัล"
        />

        {/* Status Select (instead of tabs) */}
        <CWSelect
          options={statuses.map((s, index) => ({
            label: s.label,
            value: String(index),
          }))}
          value={String(currentStatusTabIndex)}
          onChange={(val) => {
            const index = parseInt(val.target.value, 10);
            setCurrentStatusTabIndex(index);
            setPage(1);
          }}
          className="w-full text-primary md:w-60"
          hideEmptyOption
        />

        {/* Table */}
        <CWTable
          className={className}
          records={records}
          page={page}
          onPageChange={setPage}
          limit={limit}
          onLimitChange={setLimit}
          totalRecords={totalRecords}
          fetching={fetching}
          minHeight={400}
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
          withPagination={hasRecords}
          noRecordsText={hasRecords ? undefined : 'ไม่มีข้อมูล'}
          columns={[
            {
              accessor: '#',
              title: '#',
              width: 40,
              render: (_, index) => index + 1,
            },
            { accessor: 'id', title: 'รหัสสินค้า' },
            { accessor: 'item_name', title: 'ชื่อสินค้า' },
            {
              accessor: 'open_date',
              title: 'วันที่เผยแพร่',
              render: (record) =>
                record.open_date ? toDateTimeTH(record.open_date) : 'เผยแพร่ทันที',
            },
            {
              accessor: 'closed_date',
              title: 'วันที่หยุดเผยแพร่',
              render: (record) =>
                record.closed_date ? toDateTimeTH(record.closed_date) : 'ไม่กำหนด',
            },
            {
              accessor: 'price',
              title: 'ราคา (เหรียญทอง)',
              titleClassName: 'text-right',
              cellsClassName: 'text-right',
              render: (record) => record.price.toLocaleString(),
            },
            {
              accessor: 'stock',
              title: 'ขายแล้ว / ทั้งหมด',
              titleClassName: 'text-center',
              render: (record) => (
                <div className="flex gap-2 *:flex-1">
                  <div className="text-end font-bold">{record.stock ?? 0}</div>
                  <div className="text-white-dark">
                    /{record.initial_stock ?? 'ไม่จำกัด'}
                  </div>
                </div>
              ),
            },
            {
              accessor: 'status',
              title: 'สถานะ',
              render: (record) => {
                const status = statuses.find((s) => s.key === record.status);
                return (
                  <span className={`badge text-nowrap ${status?.className ?? ''}`}>
                    {status?.label ?? record.status}
                  </span>
                );
              },
            },
            {
              accessor: 'historyBtn',
              title: 'ประวัติ',
              width: 80,
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              render: (record) => (
                <button onClick={() => navigate({ to: `./${record.id}/history` })}>
                  <IconMagnifer />
                </button>
              ),
            },
            {
              accessor: 'editBtn',
              title: 'แก้ไข',
              width: 80,
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              render: (record) => (
                <button onClick={() => navigate({ to: `./${record.id}` })}>
                  <IconPen />
                </button>
              ),
            },
            {
              accessor: 'copy',
              title: 'คัดลอกรางวัล',
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              render: (record) => (
                <button
                  onClick={() =>
                    navigate({
                      to: `/teacher/reward/store/coupon/create`,
                      search: { id: `${record?.id}` },
                    })
                  }
                >
                  <IconCopy />
                </button>
              ),
            },
            {
              accessor: 'archiveBtn',
              title: 'จัดเก็บ',
              width: 80,
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              render: (record) => (
                <button
                  onClick={() => {
                    setSelectedRecord(record);
                    setModalState(record.status === 'expired' ? 'recall' : 'archive');
                  }}
                >
                  {record.status === 'expired' ? <IconCornerUpLeft /> : <IconArchive />}
                </button>
              ),
            },
          ]}
        />
      </div>

      {/* Modals */}
      <CWModalArchive
        open={modalState === 'archive'}
        onClose={closeModal}
        onOk={() => {
          if (selectedRecord) {
            onArchive(selectedRecord);
            closeModal();
          }
        }}
      />
      <CWModalArchiveRecall
        open={modalState === 'recall'}
        onClose={closeModal}
        onOk={() => {
          if (selectedRecord) {
            onArchive(selectedRecord);
            closeModal();
          }
        }}
      />
    </CWLayout>
  );
};

export default CWShopRecords;
