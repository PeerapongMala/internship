import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import { useNavigate } from '@tanstack/react-router';
import { DataTableColumn } from 'mantine-datatable';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import IconMagnifer from '@domain/g01/g01-d06/local/component/web/atom/wc-a-icon-magnify';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';

import { toDateTimeTH } from '@global/utils/date';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { useTranslation } from 'react-i18next';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import { StoreItem } from '@domain/g03/g03-d09/local/api/type';
import CWLayout from '../cw-layout';
import IconCopy from '@core/design-system/library/component/icon/IconCopy';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import usePagination from '@global/hooks/usePagination';
import { getUserSubjectData } from '@global/utils/store/user-subject';

export interface CWShopRecordsProps<T> {
  translationKey: string;
  breadcrumbs?: {
    label: string;
    href: string;
  }[];
  type: 'frame' | 'badge' | 'coupon';
  onDataLoad(params: {
    setRecords: Dispatch<SetStateAction<StoreItem[]>>;
    setTotalRecords: (total: number) => void;
    setFetching: Dispatch<SetStateAction<boolean>>;
    page: number;
    limit: number;
    status: string;
    searchText: string;
  }): void;
  onArchive: (record: T) => void;
  onBulkEditEnable: (records: T[]) => Promise<boolean>;
  onBulkEditDisable: (records: T[]) => Promise<boolean>;
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
}: CWShopRecordsProps<StoreItem>) {
  const { t } = useTranslation([translationKey]);
  const navigate = useNavigate();
  const subjectData = getUserSubjectData();

  const subjectId = subjectData?.id;
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
  }, [reload, type, page, limit, searchText, currentStatusTabIndex, subjectId]);

  const columns: DataTableColumn<StoreItem>[] = [
    {
      accessor: '#',
      title: '#',
      width: 40,
      render: (_, index) => index + 1,
    },
    {
      accessor: 'item_name',
      title: 'ชื่อสินค้า',
    },
    {
      accessor: 'open_date',
      title: 'วันที่เผยแพร่',
      render(record) {
        return record.open_date ? toDateTimeTH(record.open_date) : 'เผยแพร่ทันที';
      },
    },
    {
      accessor: 'closed_date',
      title: 'วันที่หยุดเผยแพร่',
      render(record) {
        return record.closed_date ? toDateTimeTH(record.closed_date) : 'ไม่กำหนด';
      },
    },
    {
      accessor: 'price',
      title: 'ราคา (เหรียญทอง)',
      titleClassName: 'text-right',
      cellsClassName: 'text-right',
      render(record) {
        return record.price.toLocaleString();
      },
    },
    {
      accessor: 'stock',
      title: 'ขายแล้ว / ทั้งหมด',
      titleClassName: 'text-center',
      render(record) {
        return (
          <div className="flex gap-2 *:flex-1">
            <div className="text-end font-bold">{record.stock ?? 0}</div>
            <div className="text-white-dark">/{record.initial_stock ?? 'ไม่จำกัด'}</div>
          </div>
        );
      },
    },
    {
      accessor: 'status',
      title: 'สถานะ',
      render(record) {
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
      render(record) {
        return (
          <button onClick={() => navigate({ to: `./${record.id}/history` })}>
            <IconMagnifer />
          </button>
        );
      },
    },
    {
      accessor: 'editBtn',
      title: 'แก้ไข',
      width: 80,
      titleClassName: 'text-center',
      cellsClassName: 'text-center',
      render(record) {
        return (
          <button onClick={() => navigate({ to: `./${record.id}` })}>
            <IconPen />
          </button>
        );
      },
    },
    {
      accessor: 'copy',
      title: 'คัดลอกรางวัล',
      titleClassName: 'text-center',
      cellsClassName: 'text-center',
      render(record) {
        return (
          <button
            onClick={() =>
              navigate({
                to: `/teacher/reward/store/coupon/create`,
                search: { id: `${record.id}` },
              })
            }
          >
            <IconCopy />
          </button>
        );
      },
    },
    {
      accessor: 'archiveBtn',
      title: 'จัดเก็บ',
      width: 80,
      titleClassName: 'text-center',
      cellsClassName: 'text-center',
      render(record) {
        return (
          <button
            onClick={() => {
              setSelectedRecord(record);
              setModalState(record.status === 'expired' ? 'recall' : 'archive');
            }}
          >
            {record.status === 'expired' ? <IconCornerUpLeft /> : <IconArchive />}
          </button>
        );
      },
    },
  ];

  // แยกเงื่อนไข table data แบบมีข้อมูล/ไม่มีข้อมูล
  const tableData =
    records.length > 0
      ? {
        records,
        page,
        onPageChange: setPage,
        limit,
        onLimitChange: setLimit,
        totalRecords,
        fetching,
        minHeight: 400,
        selectedRecords,
        onSelectedRecordsChange: setSelectedRecords,
        columns,
        paginationText: ({
          from,
          to,
          totalRecords,
        }: {
          from: number;
          to: number;
          totalRecords: number;
        }) => `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`,

        recordsPerPageOptions: [10, 15, 30, 50, 100],
        loaderType: 'oval',
        loaderBackgroundBlur: 4,
      }
      : {
        records: [],
        fetching,
        minHeight: 400,
        columns,
        noRecordsText: 'ไม่พบข้อมูล',
        withTableBorder: true,
        withColumnBorders: true,
        loaderType: 'oval',
        loaderBackgroundBlur: 4,
      };

  return (
    <CWLayout
      breadcrumbs={breadcrumbs}
      type={type}
      itemHref={itemHref}
      userType={userType}
    >
      <CWTableTemplate
        header={{
          bulkEditActions: [
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
          ],
          showDownloadButton: false,
          showUploadButton: false,
          showButtonSpecial: {
            show: true,
            onClick: () => {
              navigate({ to: '/teacher/reward/store/coupon/create' });
            },
            title: 'รางวัล',
            icon: <IconPlus />,
          },
          bulkEditDisabled: !selectedRecords.length,
          onSearchChange: (e) => setSearchText(e.currentTarget.value),
          selectSubject: true
        }}
        tabs={{
          items: statuses.map((s) => s.label),
          tabIndex: currentStatusTabIndex,
          onTabChange: setCurrentStatusTabIndex,
        }}
        table={tableData}
      />
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
