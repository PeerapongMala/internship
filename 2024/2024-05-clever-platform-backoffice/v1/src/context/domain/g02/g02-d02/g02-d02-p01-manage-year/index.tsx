import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';

import IManageYearHeader from './component/web/template/wc-t-header';
import IconPlus from '@core/design-system/library/vristo/source/components/Icon/IconPlus';

import StoreGlobalPersist from '@store/global/persist';

import { ManageYearStatus, IManageYear } from '../local/type';
import API from '../local/api';
import { ICurriculum } from '@domain/g00/g00-d00/local/type';
import showMessage from '@global/utils/showMessage';
import { toDateTimeTH } from '@global/utils/date';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { t } = useTranslation();

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const {
    page,
    pageSize,
    totalCount: totalRecords,
    setPage,
    setPageSize,
    setTotalCount: setTotalRecords,
  } = usePagination();

  const [selectedRecords, setSelectedRecords] = useState<IManageYear[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<IManageYear>();
  const [records, setRecords] = useState<IManageYear[]>([]);

  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isRecallDialogOpen, setIsRecallDialogOpen] = useState(false);
  const [statusTabIndex, setStatusTabIndex] = useState(0);
  const [searchText, setSearchText] = useState('');

  const navigate = useNavigate();
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  const { curriculumData }: { curriculumData: ICurriculum } = StoreGlobalPersist.StateGet(
    ['curriculumData'],
  );
  const location = useLocation();
  const pathname = location.pathname;
  const { platformId } = useParams({ strict: false });

  useEffect(() => {
    if (!curriculumData) {
      navigate({
        to: '/curriculum',
      });
    } else if (!accessToken) {
      navigate({ to: '/' });
    }
  }, []);

  function fetchRecords() {
    API.manageYear
      .GetAll(platformId, {
        limit: pageSize,
        page,
        status: statuses[statusTabIndex]?.value ?? '',
        search_text: searchText,
      })
      .then((res) => {
        if (res.status_code === 200) {
          setRecords(res.data);
          setTotalRecords(res._pagination.total_count);
        } else if (res.status_code === 401) {
          navigate({ to: '/' });
        }
      });
  }

  useEffect(() => {
    fetchRecords();
  }, [platformId, page, pageSize, statusTabIndex, searchText]);

  function onDisabled() {
    if (selectedRecord) onUpdateArchive('disabled', selectedRecord, 'จัดเก็บสำเร็จ');
  }

  function onEnabled() {
    if (selectedRecord) onUpdateArchive('enabled', selectedRecord, 'เปิดใช้งานสำเร็จ');
  }

  function onUpdateArchive(
    status: 'disabled' | 'enabled',
    data: IManageYear,
    successMsg: string,
  ) {
    API.manageYear
      .Update(data.id, {
        ...data,
        status,
      })
      .then((res) => {
        if (res.status_code == 201 || res.status_code == 200) {
          showMessage(successMsg, 'success');
          fetchRecords();
        } else {
          showMessage(res.message, 'error');
        }
        setSelectedRecord(undefined);
      });
  }

  function onBulkEdit(status: 'enabled' | 'disabled', records: IManageYear[]) {
    API.manageYear.BulkEdit(records.map((r) => ({ ...r, status }))).then((res) => {
      if (res.status_code == 201 || res.status_code == 200) {
        showMessage(`${status == 'enabled' ? 'เปิดใช้งาน' : 'จัดเก็บ'}สำเร็จ`, 'success');
        fetchRecords();
        setSelectedRecords([]);
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  function onDownload(data: { dateFrom: string; dateTo: string }) {
    const startDate = data.dateFrom;
    const endDate = data.dateTo;

    if (startDate && endDate) {
      API.manageYear
        .DownloadCsv(platformId, {
          start_date: startDate,
          end_date: endDate,
        })
        .then((res) => {
          if (res instanceof Object) {
            showMessage(res.message, 'error');
          }
        });
    } else {
      showMessage('กรุณาเลือกช่วงวัน', 'warning');
    }
  }

  function onUpload(file: File | undefined) {
    if (file) {
      API.manageYear.UploadCsv(platformId, file).then((res) => {
        if (res.status_code === 200 || res.status_code == 201) {
          showMessage('อัพโหลดสําเร็จ');
          fetchRecords();
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }

  function closeArchiveModal() {
    setSelectedRecord(undefined);
    setIsArchiveDialogOpen(false);
    setIsRecallDialogOpen(false);
  }

  const statuses = [
    { label: 'ทั้งหมด', value: '' },
    { label: 'แบบร่าง', value: ManageYearStatus.DRAFT },
    { label: 'ใช้งาน', value: ManageYearStatus.IN_USE },
    { label: 'ไม่ใช้งาน', value: ManageYearStatus.NOT_IN_USE },
  ];

  return (
    <div className="flex flex-col gap-y-5 font-noto-sans-thai text-[#0E1726]">
      <IManageYearHeader totalRecords={totalRecords} />

      <CWTableTemplate
        header={{
          bulkEditDisabled: !selectedRecords.length,
          bulkEditActions: [
            {
              label: (
                <div className="flex gap-3">
                  <IconArchive /> จัดเก็บ
                </div>
              ),
              onClick: () => {
                onBulkEdit('disabled', selectedRecords);
              },
            },
            {
              label: (
                <div className="flex gap-2">
                  <IconCornerUpLeft /> เปิดใช้งาน
                </div>
              ),
              onClick: () => {
                onBulkEdit('enabled', selectedRecords);
              },
            },
          ],
          btnIcon: <IconPlus />,
          btnLabel: 'เพิ่มชั้นปี',
          onBtnClick() {
            navigate({ to: `${pathname}/create` });
          },
          onSearchChange: (e) => setSearchText(e.currentTarget.value),
          onDownload: (data) => {
            onDownload?.({
              dateFrom: data.dateFrom || '',
              dateTo: data.dateTo || '',
            });
          },
          onUpload,
        }}
        tabs={{
          items: statuses.map((s) => s.label),
          tabIndex: statusTabIndex,
          onTabChange: setStatusTabIndex,
        }}
        table={{
          records,
          minHeight: 400,
          limit: pageSize,
          onLimitChange: setPageSize,
          page,
          onPageChange: setPage,
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
            { accessor: 'id', title: 'รหัสชั้นปี' },
            { accessor: 'seed_year_name', title: 'ชื่อชั้นปี' },
            { accessor: 'seed_year_short_name', title: 'ชื่อย่อ' },
            {
              accessor: 'updated_at',
              title: 'แก้ไขล่าสุด',
              render: ({ updated_at }) => (updated_at ? toDateTimeTH(updated_at) : ''),
            },
            { accessor: 'updated_by', title: 'แก้ไขโดย' },
            {
              accessor: 'status',
              title: 'สถานะ',
              render: ({ status }) => {
                const statusClass = {
                  [ManageYearStatus.IN_USE]: 'badge-outline-success',
                  [ManageYearStatus.DRAFT]: 'badge-outline-dark',
                  [ManageYearStatus.NOT_IN_USE]: 'badge-outline-danger',
                };
                return (
                  <span className={`badge ${statusClass[status]}`}>
                    {status === ManageYearStatus.IN_USE
                      ? 'ใช้งาน'
                      : status === ManageYearStatus.DRAFT
                        ? 'แบบร่าง'
                        : 'ไม่ใช้งาน'}
                  </span>
                );
              },
            },
            {
              accessor: 'edit',
              title: 'แก้ไข',
              width: 80,
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              render: ({ id }) => (
                <button
                  onClick={() => {
                    navigate({ to: `${pathname}/${id}` });
                  }}
                >
                  <IconPen />
                </button>
              ),
            },
            {
              accessor: 'view',
              title: 'ดูข้อมูล',
              width: 80,
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              render: ({ id }) => (
                <button
                  onClick={() => {
                    navigate({ to: `${pathname}/${id}/subject-group` });
                  }}
                >
                  <IconSearch />
                </button>
              ),
            },
            {
              accessor: 'archive',
              title: 'จัดเก็บ',
              width: 80,
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              render: (record) =>
                record.status === ManageYearStatus.NOT_IN_USE ? (
                  <button
                    onClick={() => {
                      setSelectedRecord(record);
                      setIsRecallDialogOpen(true);
                    }}
                  >
                    <IconCornerUpLeft />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedRecord(record);
                      setIsArchiveDialogOpen(true);
                    }}
                  >
                    <IconArchive />
                  </button>
                ),
            },
          ],
        }}
      />
      <CWModalArchive
        open={isArchiveDialogOpen}
        onClose={closeArchiveModal}
        onOk={() => {
          if (selectedRecord) {
            onDisabled();
            closeArchiveModal();
          } else {
            showMessage('กรุณาเลือกรายการจัดเก็บ', 'warning');
            closeArchiveModal();
          }
        }}
      />
      <CWModalArchiveRecall
        open={isRecallDialogOpen}
        onClose={closeArchiveModal}
        onOk={() => {
          if (selectedRecord) {
            onEnabled();
            closeArchiveModal();
          } else {
            showMessage('กรุณาเลือกรายการเปิดใช้งาน', 'warning');
            closeArchiveModal();
          }
        }}
      />
    </div>
  );
};

export default DomainJSX;
