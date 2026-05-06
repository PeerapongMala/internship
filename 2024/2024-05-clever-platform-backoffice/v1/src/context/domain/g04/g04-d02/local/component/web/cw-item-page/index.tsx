import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import { toDateTimeTH } from '@global/utils/date';
import { Image } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import CWTableTemplate from '../cw-table-template';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import CWTitleBack from '@component/web/cw-title-back';
import usePagination from '@global/hooks/usePagination';

export interface CWItemPageProps {
  translationKey: string;
  itemType: ItemType;
  breadcrumbs: {
    label: string;
    href: string;
  }[];
  onDataLoad(params: {
    setRecords: Dispatch<SetStateAction<Item[]>>;
    setTotalRecords: (total: number) => void;
    setFetching: Dispatch<SetStateAction<boolean>>;
    page: number;
    limit: number;
    status: string;
    searchText: string;
    filters?: {
      key: string;
      value: string;
    };
  }): void;
  onEnabled(record: Item): void;
  onDisabled(record: Item): void;
  onEdit(record: Item): void;
  onBulkEdit(status: 'enabled' | 'disabled', records: Item[]): Promise<boolean>;
  // Use for reload records when update
  reload?: boolean;
  view?: 'teacher' | 'gm';
  userType?: 'gm' | 'teacher';
}

const CWItemPage = function ({
  translationKey,
  view = 'gm',
  itemType,
  breadcrumbs,
  onDataLoad,
  onEnabled,
  onDisabled,
  onEdit,
  reload,
  onBulkEdit,
  userType = 'gm',
}: CWItemPageProps) {
  const { t } = useTranslation([translationKey]);
  const navigate = useNavigate();

  const [currentStatusTabIndex, setCurrentStatusTabIndex] = useState(0);
  const [records, setRecords] = useState<Item[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    key: 'id',
    value: '',
  });
  const {
    page,
    pageSize: limit,
    totalCount: totalRecords,
    setPage,
    setPageSize: setLimit,
    setTotalCount: setTotalRecords,
  } = usePagination();
  const [fetching, setFetching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<Item[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<Item>();
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
      filters,
    });
  }, [itemType, page, limit, searchText, currentStatusTabIndex, reload, filters]);

  const statuses = [
    { key: '', label: 'ทั้งหมด' },
    {
      key: 'draft',
      label: 'แบบร่าง',
      className: 'badge-outline-dark',
    },
    {
      key: 'enabled',
      label: 'ใช้งาน',
      className: 'badge-outline-success',
    },
    {
      key: 'disabled',
      label: 'ไม่ใช้งาน',
      className: 'badge-outline-danger',
    },
  ];
  const getTabs = () => {
    const baseTabs = [
      {
        key: 'frame',
        label: 'กรอบรูป',
      },
      {
        key: 'badge',
        label: 'โล่',
      },
      {
        key: 'coupon',
        label: 'คูปอง',
      },
    ];
    if (userType === 'teacher') {
      return baseTabs.filter((tab) => tab.key === 'coupon');
    }

    return baseTabs;
  };
  const tabs = getTabs();

  return (
    <div className="flex flex-col gap-4">
      <CWBreadcrumbs links={breadcrumbs} />

      <div className="flex flex-col gap-1">
        {userType === 'teacher' ? (
          <CWTitleBack label="จัดการไอเทม" href="../.." />
        ) : (
          <div className="text-2xl font-bold">จัดการไอเทม</div>
        )}
        <div className="mt-2">
          สร้างไอเทมประเภทต่าง ๆ จากเทมเพลต เพื่อใช้สำหรับแจกรางวัล
          หรือสร้างสินค้าในร้านค้า
        </div>
      </div>

      <CWMTabs
        items={tabs.map((item) => item.label)}
        currentIndex={tabs.findIndex((t) => t.key == itemType)}
        onClick={(index) => {
          navigate({ to: `../${tabs[index].key}` });
        }}
      />

      <CWTableTemplate
        header={{
          btnIcon: <IconPlus />,
          btnLabel: 'เพิ่มไอเทม',
          onBtnClick() {
            navigate({
              to: `./create`,
              params: {
                itemType,
              },
            });
          },
          inputSearchType: view == 'teacher' ? 'input-dropdown' : 'input',
          searchDropdownOptions: [
            {
              label: 'รหัสไอเทม',
              value: 'id',
            },
            {
              label: 'ชื่อไอเทม',
              value: 'name',
            },
            {
              label: 'คำอธิบาย',
              value: 'description',
            },
          ],
          searchDropdownValue: filters.key,
          onSearchDropdownSelect(selected) {
            setFilters((prev) => ({
              ...prev,
              key: selected.toString(),
            }));
          },
          onSearchChange: (e) => {
            const value = e.currentTarget.value;
            if (view == 'teacher') {
              setFilters((prev) => ({
                ...prev,
                value,
              }));
            } else {
              setSearchText(value);
            }
          },
          showDownloadButton: false,
          showUploadButton: false,
          bulkEditActions: [
            {
              label: (
                <div className="flex gap-3">
                  <IconArchive /> จัดเก็บ
                </div>
              ),
              onClick() {
                onBulkEdit('disabled', selectedRecords).then((res) => {
                  if (res) setSelectedRecords([]);
                });
              },
            },
            {
              label: (
                <div className="flex gap-3 text-nowrap">
                  <IconArrowBackward duotone={false} /> เปิดใช้งาน
                </div>
              ),
              onClick() {
                onBulkEdit('enabled', selectedRecords).then((res) => {
                  if (res) setSelectedRecords([]);
                });
              },
            },
          ],
          bulkEditDisabled: !selectedRecords.length,
        }}
        tabs={{
          items: statuses.map((s) => s.label),
          tabIndex: currentStatusTabIndex,
          onTabChange: setCurrentStatusTabIndex,
        }}
        table={{
          records,
          minHeight: 400,
          fetching,
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
              width: 40,
              render: (_, index) => index + 1,
            },
            {
              accessor: 'id',
              title: 'รหัสไอเทม',
            },
            {
              accessor: 'image_url',
              title: itemType == 'badge' ? 'รูปโล่' : 'รูปภาพ',
              width: 84,
              cellsClassName: 'text-center',
              render(record) {
                return (
                  record.image_url && (
                    <Image
                      fit="cover"
                      src={record.image_url}
                      alt={record.id.toString()}
                      className="w-8"
                    />
                  )
                );
              },
            },
            {
              accessor: 'name',
              title: 'ชื่อไอเทม',
              hidden: !(itemType == 'frame' || itemType == 'coupon'),
            },
            {
              accessor: 'type',
              title: 'รูปแบบโล่',
              hidden: !(itemType == 'badge'),
              render() {
                return 'รูปแบบโล่';
              },
            },
            {
              accessor: 'badge_description',
              title: 'ข้อความที่แสดงในโล่',
              hidden: !(itemType == 'badge'),
            },
            {
              accessor: 'description',
              title: 'คำอธิบาย',
            },
            {
              accessor: 'created_by',
              title: 'สร้างโดย',
              hidden: view == 'gm',
            },
            {
              accessor: 'updated_at',
              title: 'แก้ไขล่าสุด',
              render: (record) =>
                record.updated_at ? toDateTimeTH(record.updated_at) : '-',
            },
            {
              accessor: 'updated_by',
              title: 'แก้ไขล่าสุดโดย',
              render(record, index) {
                return 'updated_by_name' in record
                  ? (record.updated_by_name as string) || '-'
                  : record.updated_by || '-';
              },
            },
            {
              title: 'สถานะ',
              accessor: 'status',
              render: (record) => {
                const status = statuses.find((s) => s.key == record.status);
                return (
                  <span className={`badge text-nowrap ${status?.className ?? ''}`}>
                    {status?.label ?? record.status}
                  </span>
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
                  <button type="button" onClick={() => onEdit(record)}>
                    <IconPencil />
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
                  <>
                    {record.status == 'disabled' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setModalState('recall');
                          setSelectedRecord(record);
                        }}
                      >
                        <IconCornerUpLeft />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setModalState('archive');
                          setSelectedRecord(record);
                        }}
                      >
                        <IconArchive />
                      </button>
                    )}
                  </>
                );
              },
            },
          ],
        }}
      />
      <CWModalArchive
        open={modalState == 'archive'}
        onClose={() => {
          setSelectedRecord(undefined);
          setModalState('');
        }}
        onOk={() => {
          if (selectedRecord) {
            onDisabled?.(selectedRecord);
            closeModal();
          }
        }}
      />
      <CWModalArchiveRecall
        open={modalState == 'recall'}
        onClose={() => {
          setSelectedRecord(undefined);
          setModalState('');
        }}
        onOk={() => {
          if (selectedRecord) {
            onEnabled?.(selectedRecord);
            closeModal();
          }
        }}
      />
    </div>
  );
};

export default CWItemPage;
