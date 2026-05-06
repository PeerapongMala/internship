import { useTranslation } from 'react-i18next';
import StoreGlobal from '@global/store/global';
import { useParams, useNavigate, useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ISubject, ISubjectGroup, ManageYearStatus } from '../local/type';
import { Modal } from '@mantine/core';

import ConfigJson from './config/index.json';

import IconPlus from '@core/design-system/library/vristo/source/components/Icon/IconPlus';

import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import { toDateTimeTH } from '@global/utils/date';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import ManageSubjectHeader from './component/web/template/wc-t-header';
import { ICurriculum } from '@domain/g01/g01-d03/local/type';
import StoreGlobalPersist from '@store/global/persist';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigator = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { platformId, subjectGroupId, yearId } = useParams({ strict: false });

  const [records, setRecords] = useState<ISubject[]>([]);
  const {
    page,
    pageSize: limit,
    totalCount: totalRecords,
    setPage,
    setPageSize: setLimit,
    setTotalCount: setTotalRecords,
  } = usePagination();

  const [statusTabIndex, setStatusTabIndex] = useState(0);
  const [searchText, setSearchText] = useState<string>('');
  const [fetching, setFetching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<ISubject[]>([]);

  const [selectedRecord, setSelectedRecord] = useState<ISubject>();
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isRecallDialogOpen, setIsRecallDialogOpen] = useState(false);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  useEffect(() => {
    fetchSubjectGroups();
  }, [yearId, limit, page, searchText, statusTabIndex]);

  const { curriculumData }: { curriculumData: ICurriculum } = StoreGlobalPersist.StateGet(
    ['curriculumData'],
  );

  const fetchSubjectGroups = () => {
    setFetching(true);
    API.subject
      .GetAll(0, curriculumData.id, {
        limit,
        page,
        search_text: searchText,
        status: statuses[statusTabIndex]?.value ?? '',
        subject_group_id: subjectGroupId,
      })
      .then(async (res) => {
        if (res.status_code === 200) {
          setRecords(res.data);
          setTotalRecords(res._pagination.total_count);
        } else if (res.status_code === 401) {
          navigator({ to: '/' });
        } else {
          showMessage(res.message, 'error');
        }
      })
      .finally(() => {
        setFetching(false);
      });
  };

  function onArchive(status: 'enabled' | 'disabled', record: ISubject) {
    API.subject
      .Update(record.id, {
        ...record,
        status,
      })
      .then((res) => {
        if (res.status_code == 201 || res.status_code == 200) {
          showMessage(
            `${status == 'enabled' ? 'เปิดใช้งาน' : 'จัดเก็บ'}สำเร็จ`,
            'success',
          );
          fetchSubjectGroups();
        } else {
          showMessage(res.message, 'error');
        }
      })
      .finally(() => {
        closeArchiveModal();
      });
  }

  function onDownload(data: { dateFrom: string; dateTo: string }) {
    const startDateFormatted = data.dateFrom ? data.dateFrom : '';
    const endDateFormatted = data.dateTo ? data.dateTo : '';

    if (startDateFormatted && endDateFormatted) {
      API.subject
        .DownloadCsv(subjectGroupId, {
          end_date: endDateFormatted,
          start_date: startDateFormatted,
        })
        .then((res) => {
          if (typeof res == 'object') {
            showMessage(res.message, 'error');
          }
        });
    } else {
      showMessage('กรุณาเลือกวัน', 'warning');
    }
  }

  function onUpload(file: File | undefined) {
    if (file) {
      API.subject.UploadCsv(subjectGroupId, file).then((res) => {
        if (res.status_code === 200 || res.status_code == 201) {
          showMessage('อัพโหลดสําเร็จ', 'success');
          fetchSubjectGroups();
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }

  function onBulkEdit(status: 'enabled' | 'disabled', records: ISubject[]) {
    API.subject
      .BulkEdit(
        records.map((r) => ({
          id: r.id,
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
          fetchSubjectGroups();
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  const statuses = [
    { label: 'ทั้งหมด', value: '', className: '' },
    {
      label: 'แบบร่าง',
      value: ManageYearStatus.DRAFT,
      className: 'badge-outline-dark',
    },
    {
      label: 'ใช้งาน',
      value: ManageYearStatus.IN_USE,
      className: 'badge-outline-success',
    },
    {
      label: 'ไม่ใช้งาน',
      value: ManageYearStatus.NOT_IN_USE,
      className: 'badge-outline-danger',
    },
  ];

  function closeArchiveModal() {
    setIsArchiveDialogOpen(false);
    setIsRecallDialogOpen(false);
    setSelectedRecord(undefined);
  }

  return (
    <div className="flex flex-col gap-y-5 font-noto-sans-thai text-[#0E1726]">
      <ManageSubjectHeader />

      <CWTableTemplate
        header={{
          btnIcon: <IconPlus />,
          btnLabel: 'เพิ่มหลักสูตร',
          onBtnClick() {
            navigator({ to: `${pathname}/create` });
          },
          onSearchChange: (e) => {
            setSearchText(e.currentTarget.value);
          },
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
          fetching,
          limit,
          onLimitChange: setLimit,
          page,
          onPageChange: setPage,
          totalRecords,
          selectedRecords,
          onSelectedRecordsChange: setSelectedRecords,
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
            { accessor: 'id', title: 'รหัสหลักสูตร' },
            {
              accessor: 'seed_subject_group_name',
              title: 'กลุ่มวิชา',
            },
            {
              accessor: 'name',
              title: 'วิชา',
            },
            {
              accessor: 'project',
              title: 'แพลตฟอร์ม',
            },
            {
              accessor: 'updated_at',
              title: 'แก้ไขล่าสุด',
              render: ({ updated_at }) => (updated_at ? toDateTimeTH(updated_at) : '-'),
            },
            { accessor: 'updated_by', title: 'แก้ไขล่าสุดโดย' },
            {
              accessor: 'status',
              title: 'สถานะ',
              render: (record) => {
                const status = statuses.find((s) => s.value == record.status);
                return (
                  <span className={`badge ${status?.className ?? ''}`}>
                    {status?.label ?? ''}
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
                    navigator({
                      to: `${pathname}/${id}`,
                    });
                  }}
                >
                  <IconPen />
                </button>
              ),
            },
            {
              accessor: 'search',
              title: 'ดูข้อมูล',
              width: 80,
              titleClassName: 'text-center',
              cellsClassName: 'text-center',
              render: (records) => (
                <button
                  onClick={() => {
                    StoreGlobalPersist.MethodGet().setSubjectData(records);
                    StoreGlobalPersist.MethodGet().setPlatformId(platformId);
                    StoreGlobalPersist.MethodGet().setYearId(yearId);
                    StoreGlobalPersist.MethodGet().setSubjectGroupId(subjectGroupId);
                    navigator({ to: '/content-creator/lesson' });
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
                      setIsRecallDialogOpen(true);
                      setSelectedRecord(record);
                    }}
                  >
                    <IconCornerUpLeft />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsArchiveDialogOpen(true);
                      setSelectedRecord(record);
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
            onArchive('disabled', selectedRecord);
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
            onArchive('enabled', selectedRecord);
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
