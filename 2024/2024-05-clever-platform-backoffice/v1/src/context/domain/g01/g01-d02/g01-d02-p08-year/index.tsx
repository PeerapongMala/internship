// import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { SeedYear } from '../local/type';
import { toDateTimeTH } from '@global/utils/date';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import { useNavigate } from '@tanstack/react-router';
import API from '../local/api';
import downloadCSV from '@global/utils/downloadCSV';
import showMessage from '@global/utils/showMessage';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const [records, setRecords] = useState<SeedYear[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<SeedYear[]>([]);
  const [search, setSearch] = useState({
    key: 'id',
    value: '',
  });
  const [statusTabIndex, setStatusTabIndex] = useState(0);

  const {
    page,
    pageSize: limit,
    totalCount: totalRecords,
    setPage,
    setPageSize: setLimit,
    setTotalCount: setTotalRecords,
  } = usePagination();

  const [fetching, setFetching] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SeedYear>();
  const [modalState, setModalState] = useState<'' | 'recall' | 'archive'>('');

  function closeModal() {
    setModalState('');
    setSelectedRecord(undefined);
  }

  function onDownload(data: { dateFrom: string; dateTo: string }) {
    API.seedYear
      .DownloadCSV({
        start_date: data.dateFrom ? data.dateFrom + 'T00:00:00Z' : undefined,
        end_date: data.dateTo ? data.dateTo + 'T00:00:00Z' : undefined,
      })
      .then((res) => {
        if (res instanceof Blob) {
          downloadCSV(res, 'years.csv');
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function onUpload(file: File | undefined) {
    if (file) {
      API.seedYear.UploadCSV(file).then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('อัปโหลดสำเร็จ', 'success');
          fetchRecords();
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }

  function onArchive(status: 'enabled' | 'disabled', record: SeedYear) {
    API.seedYear
      .Update(record.id, {
        ...record,
        status,
      })
      .then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage(
            `${status == 'enabled' ? 'เปิดใช้งาน' : 'จัดเก็บ'}สำเร็จ`,
            'success',
          );
          fetchRecords();
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function onBulkEdit(status: 'enabled' | 'disabled', records: SeedYear[]) {
    API.seedYear
      .BulkEdit(
        records.map((record) => ({
          seed_year_id: record.id,
          status,
        })),
      )
      .then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage(
            `${status == 'enabled' ? 'เปิดใช้งาน' : 'จัดเก็บ'}สำเร็จ`,
            'success',
          );
          setSelectedRecords([]);
          fetchRecords();
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  useEffect(() => {
    fetchRecords();
  }, [page, limit, statusTabIndex, search]);

  function fetchRecords() {
    setFetching(true);
    API.seedYear
      .Get({
        page,
        limit,
        status: statuses[statusTabIndex]?.value ?? '',
        [search.key]: search.value,
      })
      .then((res) => {
        if (res.status_code == 200) {
          setRecords(res.data);
          setTotalRecords(res._pagination.total_count);
        } else {
          showMessage(res.message, 'error');
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }

  const statuses = [
    {
      label: 'ทั้งหมด',
      value: '',
      className: '',
    },
    {
      label: 'แบบร่าง',
      value: 'draft',
      className: 'badge-outline-dark',
    },
    {
      label: 'ใช้งาน',
      value: 'enabled',
      className: 'badge-outline-success',
    },
    {
      label: 'ไม่ใช้งาน',
      value: 'disabled',
      className: 'badge-outline-danger',
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <CWBreadcrumbs
        links={[
          {
            label: 'สำหรับแอดมิน',
            href: '/',
            disabled: true,
          },

          {
            label: 'จัดการชั้นปี',
            href: '/',
          },
        ]}
      />

      <div>
        <div className="text-2xl font-bold">จัดการชั้นปี</div>
      </div>

      <CWTableTemplate
        header={{
          bulkEditActions: [
            {
              label: (
                <div className="flex items-center gap-3">
                  <IconArchive />
                  จัดเก็บ
                </div>
              ),
              onClick() {
                onBulkEdit('disabled', selectedRecords);
              },
            },
            {
              label: (
                <div className="flex items-center gap-3">
                  <IconArrowBackward duotone={false} />
                  เปิดใช้งาน
                </div>
              ),
              onClick() {
                onBulkEdit('enabled', selectedRecords);
              },
            },
          ],
          bulkEditDisabled: !selectedRecords.length,
          btnIcon: <IconPlus />,
          btnLabel: 'เพิ่มชั้นปี',
          onBtnClick() {
            navigate({ to: '/admin/year/create' });
          },
          inputSearchType: 'input-dropdown',
          onSearchDropdownSelect(e) {
            setSearch((prev) => ({
              ...prev,
              key: e.toString(),
            }));
          },
          searchDropdownValue: search.key,
          onSearchChange(e) {
            const value = e.currentTarget.value;
            setSearch((prev) => ({
              ...prev,
              value,
            }));
          },
          searchDropdownOptions: [
            {
              label: 'รหัสชั้นปี',
              value: 'id',
            },
            {
              label: 'ชื่อชั้นปี',
              value: 'name',
            },
            {
              label: 'ชื่อย่อ',
              value: 'short_name',
            },
          ],
          onDownload: (data) => {
            onDownload?.({
              dateFrom: data.dateFrom || '',
              dateTo: data.dateTo || '',
            });
          },
          onUpload,
        }}
        tabs={{
          items: statuses.map((status) => status.label),
          tabIndex: statusTabIndex,
          onTabChange: setStatusTabIndex,
        }}
        table={{
          records,
          minHeight: 400,
          page,
          onPageChange: setPage,
          limit,
          onLimitChange: setLimit,
          totalRecords,
          selectedRecords,
          onSelectedRecordsChange: setSelectedRecords,
          fetching,
          columns: [
            {
              accessor: '#',
              title: '#',
              render(_, index) {
                return index + 1;
              },
            },
            {
              accessor: 'id',
              title: 'รหัสชั้นปี',
            },
            {
              accessor: 'name',
              title: 'ชื่อชั้นปี',
            },
            {
              accessor: 'short_name',
              title: 'ชื่อย่อ',
            },
            {
              accessor: 'updated_at',
              title: 'แก้ไขล่าสุด',
              render(record, index) {
                return record.updated_at ? toDateTimeTH(record.updated_at) : '-';
              },
            },
            {
              accessor: 'updated_by',
              title: 'แก้ไขล่าสุดโดย',
              render(record, index) {
                return record.updated_by || '-';
              },
            },
            {
              accessor: 'status',
              title: 'เปิดใช้งาน',
              render(record, index) {
                const status = statuses.find((status) => status.value == record.status);
                return (
                  <span className={`badge ${status?.className ?? ''}`}>
                    {status?.label}
                  </span>
                );
              },
            },
            {
              accessor: 'moreBtn',
              title: 'รายละเอียด',
              width: 100,
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              render(record, index) {
                return (
                  <button
                    onClick={() => {
                      navigate({ to: `/admin/year/${record.id}` });
                    }}
                  >
                    <IconSearch />
                  </button>
                );
              },
            },
            {
              accessor: 'archiveBtn',
              title: 'จัดเก็บ',
              width: 100,
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              render(record, index) {
                return record.status == 'disabled' ? (
                  <button
                    onClick={() => {
                      setModalState('recall');
                      setSelectedRecord(record);
                    }}
                  >
                    <IconCornerUpLeft />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setModalState('archive');
                      setSelectedRecord(record);
                    }}
                  >
                    <IconArchive />
                  </button>
                );
              },
            },
          ],
        }}
      />
      <CWModalArchive
        open={modalState == 'archive'}
        onClose={closeModal}
        onOk={() => {
          if (selectedRecord) {
            onArchive('disabled', selectedRecord);
            closeModal();
          }
        }}
      />
      <CWModalArchiveRecall
        open={modalState == 'recall'}
        onClose={closeModal}
        onOk={() => {
          if (selectedRecord) {
            onArchive('enabled', selectedRecord);
            closeModal();
          }
        }}
      />
    </div>
  );
};

export default DomainJSX;
