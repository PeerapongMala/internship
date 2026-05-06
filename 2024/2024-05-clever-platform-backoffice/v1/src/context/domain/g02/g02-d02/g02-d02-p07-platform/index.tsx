import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from '@tanstack/react-router';
import ConfigJson from './config/index.json';
import { ICurriculum } from '@domain/g01/g01-d03/local/type';
import StoreGlobalPersist from '@store/global/persist';
import showMessage from '@global/utils/showMessage';
import { useEffect, useState } from 'react';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import { IPlatform } from '../local/type';
import { toDateTimeTH } from '@global/utils/date';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import CWLayout from '../local/components/cw-layout';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import API from '../local/api';
import StoreGlobal from '@store/global';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const pathname = '/content-creator/course/platform';

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const curriculum: ICurriculum =
    StoreGlobalPersist.StateGetAllWithUnsubscribe().curriculumData;
  if (!curriculum) {
    showMessage('กรุณาเลือกหลักสูตร', 'error');
    window.location.href = `/curriculum`;
  }

  const [platforms, setPlatforms] = useState<IPlatform[]>([]);

  const {
    page,
    pageSize: limit,
    totalCount: totalRecords,
    setPage,
    setPageSize: setLimit,
    setTotalCount: setTotalRecords,
  } = usePagination();

  const [searchText, setSearchText] = useState('');
  const [selectedRecords, setSelectedRecords] = useState<IPlatform[]>([]);
  const [fetching, setFetching] = useState(false);
  const [statusTabIndex, setStatusTabIndex] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState<IPlatform>();
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isRecallDialogOpen, setIsRecallDialogOpen] = useState(false);

  const statuses = [
    {
      key: '',
      label: 'ทั้งหมด',
      className: '',
    },
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

  function onArchive(record: IPlatform) {
    const status = record.status == 'disabled' ? 'enabled' : 'disabled';
    API.platform.Update(record.id, { ...record, status }).then((res) => {
      if (res.status_code == 201 || res.status_code == 200) {
        showMessage(
          `${status == 'enabled' ? 'เปิดใช้งาน' : 'จัดเก็บ'}แพลตฟอร์มสำเร็จ`,
          'success',
        );
        fetchRecords();
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  function onBulkEdit(status: 'enabled' | 'disabled', records: IPlatform[]) {
    API.platform.BulkEdit(records.map((res) => ({ ...res, status }))).then((res) => {
      if (res.status_code == 201 || res.status_code == 200) {
        showMessage(
          `${status == 'enabled' ? 'เปิดใช้งาน' : 'จัดเก็บ'}แพลตฟอร์มสำเร็จ`,
          'success',
        );
        setSelectedRecords([]);
        fetchRecords();
      } else {
        showMessage(res.message, 'error');
      }
    });
  }

  function fetchRecords() {
    if (curriculum.id) {
      setFetching(true);
      API.platform
        .Get(curriculum.id, {
          page,
          limit,
          platform_name: searchText,
          status: statuses[statusTabIndex]?.key ?? '',
        })
        .then((res) => {
          if (res.status_code == 200) {
            setPlatforms(res.data);
            setTotalRecords(res._pagination.total_count);
          } else {
            showMessage(res.message, 'error');
          }
          setFetching(false);
        });
    }
  }

  useEffect(() => {
    fetchRecords();
  }, [curriculum.id, page, limit, statusTabIndex, searchText]);

  function closeArchiveModal() {
    setIsArchiveDialogOpen(false);
    setIsRecallDialogOpen(false);
    setSelectedRecord(undefined);
  }

  return (
    <CWLayout
      navigate={{
        title: 'จัดการแพลตฟอร์ม',
        to: '/curriculum',
        description: 'เลือกแพลตฟอร์มที่คุณต้องการจัดการ',
      }}
    >
      {/* <div className="flex flex-col gap-3 rounded-md bg-neutral-100 p-3">
        <div className="text-xl font-bold">{curriculum.short_name}</div>
        <div>{totalRecords} แพลตฟอร์ม</div>
      </div> */}

      <CWTableTemplate
        header={{
          btnIcon: <IconPlus />,
          btnLabel: 'เพิ่มแพลตฟอร์ม',
          onBtnClick() {
            navigate({ to: `${pathname}/create` });
          },
          showDownloadButton: false,
          showUploadButton: false,
          onSearchChange: (e) => {
            setPage(1);
            setSearchText(e.currentTarget.value);
          },
          bulkEditDisabled: !selectedRecords.length,
          bulkEditActions: [
            {
              label: (
                <div className="flex items-center gap-2">
                  <IconArchive /> จัดเก็บ
                </div>
              ),
              onClick: () => {
                onBulkEdit('disabled', selectedRecords);
              },
            },
            {
              label: (
                <div className="flex items-center gap-2">
                  <IconCornerUpLeft /> เปิดใช้งาน
                </div>
              ),
              onClick: () => {
                onBulkEdit('enabled', selectedRecords);
              },
            },
          ],
        }}
        tabs={{
          items: statuses.map((s) => s.label),
          tabIndex: statusTabIndex,
          onTabChange: setStatusTabIndex,
        }}
        table={{
          selectedRecords,
          onSelectedRecordsChange: setSelectedRecords,
          records: platforms,
          fetching,
          page,
          onPageChange: setPage,
          limit,
          onLimitChange: setLimit,
          totalRecords,
          minHeight: 400,
          columns: [
            {
              accessor: '#',
              title: '#',
              width: 40,
              render(_, index) {
                return index + 1;
              },
            },
            {
              accessor: 'id',
              title: 'รหัส',
            },
            {
              accessor: 'seed_platform_name',
              title: 'ชื่อแพลตฟอร์ม',
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
              title: 'สถานะ',
              render(record, index) {
                const status = statuses.find((s) => s.key == record.status);
                return (
                  <span className={`badge ${status?.className ?? ''}`}>
                    {status ? status.label : record.status}
                  </span>
                );
              },
            },
            {
              accessor: 'editBtn',
              title: 'แก้ไข',
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              width: 80,
              render(record, index) {
                return (
                  <button
                    onClick={() => {
                      navigate({
                        to: `${pathname}/${record.id}/edit`,
                      });
                    }}
                  >
                    <IconPen />
                  </button>
                );
              },
            },
            {
              accessor: 'moreBtn',
              title: 'ดูข้อมูล',
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              width: 80,
              render(record, index) {
                return (
                  <button
                    onClick={() => {
                      navigate({
                        to: `${pathname}/${record.id}/year`,
                      });
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
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              width: 80,
              render(record, index) {
                return (
                  <>
                    {record.status == 'disabled' ? (
                      <button
                        onClick={() => {
                          setIsRecallDialogOpen(true);
                          setSelectedRecord(record);
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
                    )}
                  </>
                );
              },
            },
          ],
        }}
      />

      <CWModalArchive
        open={isArchiveDialogOpen}
        onClose={closeArchiveModal}
        onOk={() => {
          if (selectedRecord) {
            onArchive(selectedRecord);
          } else {
            showMessage('กรุณาเลือกรายการจัดเก็บ', 'warning');
          }
          closeArchiveModal();
        }}
      />
      <CWModalArchiveRecall
        open={isRecallDialogOpen}
        onClose={closeArchiveModal}
        onOk={() => {
          if (selectedRecord) {
            onArchive(selectedRecord);
          } else {
            showMessage('กรุณาเลือกรายการเปิดใช้งาน', 'warning');
          }
          closeArchiveModal();
        }}
      />
    </CWLayout>
  );
};

export default DomainJSX;
