import CWMTabs from '@component/web/molecule/cw-n-tabs';
import IconArchive from '@core/design-system/library/component/icon/IconArchive.tsx';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import IconPlus from '@core/design-system/library/component/icon/IconPlus.tsx';
import CWOHeaderTableButton from '@domain/g01/g01-d05/local/component/web/organism/cw-o-header-table-button';
import { WCAInputDateFlat } from '@global/component/web/atom/wc-a-input-date';

import StoreGlobal from '@global/store/global';
import showMessage from '@global/utils/showMessage';
import { Link, useNavigate } from '@tanstack/react-router';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { toDateTimeTH, fromISODateToYYYYMMDD } from '@global/utils/date';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import ArchiveModal from '@global/component/web/cw-modal/cw-modal-archive';
import RecallModal from '@global/component/web/cw-modal/cw-modal-archive-recall';

import API from '../local/api';
import { BaseAnnouncementEntity, Pagination } from '../local/type';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import usePagination from '@global/hooks/usePagination';

const Announcement = () => {
  const navigator = useNavigate();

  const [records, setRecords] = useState<BaseAnnouncementEntity[]>([]);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [startAt, setStartAt] = useState<string>('');
  const [endAt, setEndAt] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('');

  const [selectedRecord, setSelectedRecord] = useState<BaseAnnouncementEntity>();
  const [selectedRecords, setSelectedRecords] = useState<BaseAnnouncementEntity[]>([]);

  const [showModalArchive, setShowModalArchive] = useState(false);
  const [showModalBulkArchive, setShowModalBulkArchive] = useState(false);
  const [showModalRecall, setShowModalRecall] = useState(false);
  const [showModalBulkRecall, setShowModalBulkRecall] = useState(false);

  const [search, setSearch] = useState<string>('');

  // Sidebar
  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth < 768;
      StoreGlobal.MethodGet().TemplateSet(!isMobile);
      StoreGlobal.MethodGet().BannerSet(!isMobile);

      // ถ้าต้องการ redirect ในกรณีเฉพาะ
      if (isMobile && window.location.pathname !== '/line/teacher/announcement') {
        navigator({ to: '/line/teacher/announcement' });
      }
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigator]);

  const fetchAnnoucements = async () => {
    try {
      const res = await API.announcement.Gets({
        page: pagination.page,
        limit: pagination.limit,
        status: selectedTab,
        started_at: startAt,
        ended_at: endAt,
        title: search,
      });
      if (res.status_code === 200) {
        setRecords(res.data);
        setPagination((prev) => ({
          ...prev,
          total_count: res._pagination.total_count,
        }));
      }
    } catch (error) {
      showMessage(`Failed to fetch announcements: ${error}`, 'error');
    }
  };

  useEffect(() => {
    fetchAnnoucements();
  }, [pagination.page, pagination.limit, selectedTab, startAt, endAt, search]);

  const onArchive = async (
    status: 'enabled' | 'disabled',
    record: BaseAnnouncementEntity,
  ) => {
    const res = await API.announcement.Update(record.id, { ...record, status });
    if (res.status_code == 200 || res.status_code == 201) {
      showMessage(`${status == 'enabled' ? 'เปิดใช้งาน' : 'จัดเก็บ'}สำเร็จ`, 'success');
      fetchAnnoucements();
    } else {
      showMessage(res.message, 'error');
    }
  };

  const onBulkEdit = async (
    status: 'enabled' | 'disabled',
    records: BaseAnnouncementEntity[],
  ) => {
    const res = await API.announcement.BulkEdit(
      records.map((record) => ({
        id: record.id,
        status,
      })),
    );
    if (res.status_code == 200 || res.status_code == 201) {
      showMessage(`${status == 'enabled' ? 'เปิดใช้งาน' : 'จัดเก็บ'}สำเร็จ`, 'success');
      setSelectedRecords([]);
      fetchAnnoucements();
    } else {
      showMessage(res.message, 'error');
    }
  };

  const onDownloadCSV = async (data: Record<string, any>): Promise<void> => {
    if (!data.dateFrom || !data.dateTo) {
      console.error('Missing required date range');
      showMessage(`กรุณาระบุวันที่`, 'info');
      return Promise.reject(new Error('Date range is required'));
    }

    const query = {
      startDate: data.dateFrom as string,
      endDate: data.dateTo as string,
    };

    try {
      await API.announcement.DownloadCSV(query);
      showMessage('ดาวน์โหลด Csv สำเร็จ');
    } catch (error) {
      showMessage(`การดาวน์โหลดมีปัญหา: ${error}`, 'error');
      throw error;
    }
  };

  const onUploadCSV = async (file?: File): Promise<void> => {
    if (!file) {
      console.error('No file selected');
      showMessage('No file selected');
      return Promise.reject(new Error('File is required for upload'));
    }

    try {
      const res = await API.announcement.UploadCSV(file);
      if (res.status_code === 201) {
        fetchAnnoucements();
        showMessage('อัปโหลด Csv สำเร็จ');
      } else showMessage(`การอัปโหลดมีปัญหา`, 'error');
    } catch (error) {
      showMessage(`การอัปโหลดมีปัญหา: ${error}`, 'error');
      throw error;
    }
  };

  const searchByTitle = (title: string) => {
    setSearch(title);
    fetchAnnoucements();
  };

  const toFiveDigitString = (num: number) => num.toString().padStart(5, '0');

  function closeModal() {
    setShowModalArchive(false);
    setShowModalBulkArchive(false);
    setShowModalRecall(false);
    setShowModalBulkRecall(false);
  }

  const STATUS_LIST = [
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
    <div className="flex flex-col gap-5">
      <CWBreadcrumbs
        links={[
          {
            label: 'การเรียนการสอน',
            href: '/',
            disabled: true,
          },
          {
            label: 'จัดการประกาศ',
          },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">จัดการประกาศ</h1>
        <h2 className="text-sm">{pagination.total_count} รายการ</h2>
      </div>

      <div className="panel flex flex-col gap-5">
        <CWOHeaderTableButton
          btnIcon={<IconPlus />}
          btnLabel="เพิ่มประกาศ"
          onBtnClick={() => {
            navigator({ to: '/teacher/announcement/add' });
          }}
          bulkEditActions={[
            {
              label: (
                <div className="flex items-center gap-3">
                  <IconArchive />
                  จัดเก็บ
                </div>
              ),
              onClick() {
                setShowModalBulkArchive(true);
              },
            },
            {
              label: (
                <div className="flex items-center gap-2">
                  <IconCornerUpLeft />
                  เปิดใช้งาน
                </div>
              ),
              onClick() {
                setShowModalBulkRecall(true);
              },
            },
          ]}
          bulkEditDisabled={!selectedRecords.length}
          showBulkEditButton={true}
          showDownloadButton={true}
          showUploadButton={true}
          onDownload={onDownloadCSV}
          onUpload={onUploadCSV}
          onSearchChange={(e) => searchByTitle(e.target.value)}
        />

        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="relative w-full max-w-[250px]">
            <WCAInputDateFlat
              onChange={(dates) => {
                setStartAt(dates[0] ? fromISODateToYYYYMMDD(dates[0].toISOString()) : '');
              }}
              placeholder="วันที่เริ่มเผยแพร่"
            />
          </div>
          <div className="relative w-full max-w-[250px]">
            <WCAInputDateFlat
              onChange={(dates) => {
                setEndAt(dates[0] ? fromISODateToYYYYMMDD(dates[0].toISOString()) : '');
              }}
              placeholder="วันที่หยุดเผยแพร่"
            />
          </div>
        </div>

        <CWMTabs
          items={STATUS_LIST.map((s) => s.label)}
          currentIndex={STATUS_LIST.findIndex((s) => s.value === selectedTab)}
          onClick={(index) => setSelectedTab(STATUS_LIST[index].value)}
        />

        <div className="datatables">
          {records.length > 0 ? (
            <DataTable
              height={'calc(100vh - 350px)'}
              className="table-hover whitespace-nowrap"
              columns={[
                {
                  accessor: '#',
                  title: '#',
                  render: (_, index) => index + 1,
                },
                {
                  accessor: 'id',
                  title: 'รหัสประกาศ',
                  render: (record: BaseAnnouncementEntity) =>
                    toFiveDigitString(record.id),
                },
                {
                  accessor: 'title',
                  title: 'หัวข้อประกาศ',
                },
                {
                  accessor: 'started_at',
                  title: 'วันที่เริ่มเผยแพร่',
                  render: (record: BaseAnnouncementEntity) =>
                    toDateTimeTH(record.started_at),
                },
                {
                  accessor: 'ended_at',
                  title: 'วันที่หยุดเผยแพร่',
                  render: (record: BaseAnnouncementEntity) =>
                    toDateTimeTH(record.ended_at),
                },
                {
                  accessor: 'status',
                  title: 'เปิดใช้งาน',
                  render: (record: BaseAnnouncementEntity) => {
                    const status = STATUS_LIST.find(
                      (status) => status.value === record.status,
                    );
                    return (
                      <span className={`badge ${status?.className ?? ''}`}>
                        {status?.label}
                      </span>
                    );
                  },
                },
                {
                  accessor: 'editBtn',
                  title: 'แก้ไข',
                  textAlign: 'center',
                  render: (record: BaseAnnouncementEntity) => (
                    <div className="flex w-full justify-center">
                      <Link to={`/teacher/announcement/edit/${record.id}`}>
                        <IconPen />
                      </Link>
                    </div>
                  ),
                },
                {
                  accessor: 'archiveBtn',
                  title: 'จัดเก็บ',
                  render: (record: BaseAnnouncementEntity) =>
                    record.status === 'disabled' ? (
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowModalRecall(true);
                        }}
                      >
                        <IconCornerUpLeft />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowModalArchive(true);
                        }}
                      >
                        <IconArchive />
                      </button>
                    ),
                },
              ]}
              records={records}
              totalRecords={pagination.total_count}
              recordsPerPage={pagination.limit}
              page={pagination.page}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
              onRecordsPerPageChange={(limit) =>
                setPagination((prev) => ({ ...prev, limit, page: 1 }))
              }
              recordsPerPageOptions={pageSizeOptions}
              paginationText={({ from, to, totalRecords }) =>
                `แสดงที่ ${from} - ${to} จาก ${totalRecords} รายการ`
              }
              fetching={false} // ปรับตามสถานะ fetching จริงของคุณ
              loaderType="oval"
              loaderBackgroundBlur={4}
              selectedRecords={selectedRecords}
              onSelectedRecordsChange={setSelectedRecords}
              withTableBorder={false}
              withColumnBorders={false}
              highlightOnHover
            />
          ) : (
            <DataTable
              height={'calc(100vh - 350px)'}
              className="table-hover whitespace-nowrap"
              columns={[
                {
                  accessor: '#',
                  title: '#',
                  render: (_, index) => index + 1,
                },
                {
                  accessor: 'id',
                  title: 'รหัสประกาศ',
                  render: (record: BaseAnnouncementEntity) =>
                    toFiveDigitString(record.id),
                },
                {
                  accessor: 'title',
                  title: 'หัวข้อประกาศ',
                },
                {
                  accessor: 'started_at',
                  title: 'วันที่เริ่มเผยแพร่',
                  render: (record: BaseAnnouncementEntity) =>
                    toDateTimeTH(record.started_at),
                },
                {
                  accessor: 'ended_at',
                  title: 'วันที่หยุดเผยแพร่',
                  render: (record: BaseAnnouncementEntity) =>
                    toDateTimeTH(record.ended_at),
                },
                {
                  accessor: 'status',
                  title: 'เปิดใช้งาน',
                  render: (record: BaseAnnouncementEntity) => {
                    const status = STATUS_LIST.find(
                      (status) => status.value === record.status,
                    );
                    return (
                      <span className={`badge ${status?.className ?? ''}`}>
                        {status?.label}
                      </span>
                    );
                  },
                },
                {
                  accessor: 'editBtn',
                  title: 'แก้ไข',
                  textAlign: 'center',
                  render: (record: BaseAnnouncementEntity) => (
                    <div className="flex w-full justify-center">
                      <Link to={`/teacher/announcement/edit/${record.id}`}>
                        <IconPen />
                      </Link>
                    </div>
                  ),
                },
                {
                  accessor: 'archiveBtn',
                  title: 'จัดเก็บ',
                  render: (record: BaseAnnouncementEntity) =>
                    record.status === 'disabled' ? (
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowModalRecall(true);
                        }}
                      >
                        <IconCornerUpLeft />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowModalArchive(true);
                        }}
                      >
                        <IconArchive />
                      </button>
                    ),
                },
              ]}
              records={[]}
              noRecordsText="ไม่พบข้อมูล"
              fetching={false}
              withTableBorder
              withColumnBorders
              highlightOnHover
            />
          )}
        </div>
      </div>

      {/* Archive Modal */}
      <ArchiveModal
        open={showModalArchive}
        onClose={closeModal}
        onOk={() => {
          if (selectedRecord) {
            onArchive('disabled', selectedRecord);
            setSelectedRecord(undefined);
            closeModal();
          } else showMessage('กรุณาเลือกประกาศ', 'warning');
        }}
      />
      <ArchiveModal
        open={showModalBulkArchive}
        onClose={closeModal}
        onOk={() => {
          if (selectedRecords.length) {
            onBulkEdit('disabled', selectedRecords);
            closeModal();
          } else showMessage('กรุณาเลือกประกาศ', 'warning');
        }}
      />
      <RecallModal
        open={showModalRecall}
        onClose={closeModal}
        onOk={() => {
          if (selectedRecord) {
            onArchive('enabled', selectedRecord);
            setSelectedRecord(undefined);
            closeModal();
          } else showMessage('กรุณาเลือกประกาศ', 'warning');
        }}
      />
      <RecallModal
        open={showModalBulkRecall}
        onClose={closeModal}
        onOk={() => {
          if (selectedRecords.length) {
            onBulkEdit('enabled', selectedRecords);
            closeModal();
          } else showMessage('กรุณาเลือกประกาศ', 'warning');
        }}
      />
    </div>
  );
};

export default Announcement;
