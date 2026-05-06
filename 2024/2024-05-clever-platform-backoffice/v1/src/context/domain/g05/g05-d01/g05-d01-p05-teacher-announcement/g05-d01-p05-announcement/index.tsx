import CWMBreadcrumb from '@component/web/molecule/cw-m-breadcrumb';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import IconArchive from '@core/design-system/library/component/icon/IconArchive.tsx';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import IconPlus from '@core/design-system/library/component/icon/IconPlus.tsx';
import { WCAInputDateFlat } from '@global/component/web/atom/wc-a-input-date';
import StoreGlobal from '@global/store/global';
import showMessage from '@global/utils/showMessage';
import { Link, useNavigate } from '@tanstack/react-router';
import { DataTable } from 'mantine-datatable';
import { useEffect, useRef, useState } from 'react';
import { toDateTimeTH, fromISODateToYYYYMMDD } from '@global/utils/date';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import CWInputSearch from '@component/web/cw-input-search';
import CWButton from '@component/web/cw-button';
import CWMDropdown from '@component/web/molecule/cw-m-dropdown';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import { Modal } from '@core/design-system/library/vristo/source/components/Modal';

import API from '../local/api';
import { BaseAnnouncementEntity } from '../local/type';
import ArchiveModal from '../local/component/web/molecule/ArchiveModal';
import LineLiffPage from '../../local/component/web/template/cw-t-lineliff-page';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import usePagination from '@global/hooks/usePagination';
import CWSelect from '@component/web/cw-select';
import CWMAccordion from '@component/web/molecule/cw-m-accordion';

const Announcement = () => {
  const navigator = useNavigate();

  const [records, setRecords] = useState<BaseAnnouncementEntity[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<BaseAnnouncementEntity[]>([]);

  const { pagination, setPagination, pageSizeOptions } = usePagination();
  const [startAt, setStartAt] = useState<string>('');
  const [endAt, setEndAt] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('');

  const [selectedRecord, setSelectedRecord] = useState<BaseAnnouncementEntity>();
  const [showModalArchive, setShowModalArchive] = useState(false);
  const [showModalBulkArchive, setShowModalBulkArchive] = useState(false);

  const [search, setSearch] = useState<string>('');

  // Download/Upload modal state
  const [modalState, setModalState] = useState<'' | 'download' | 'upload'>('');
  const [formData, setFormData] = useState({ dateFrom: '', dateTo: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  function closeModal() {
    setModalState('');
    setFormData({ dateFrom: '', dateTo: '' });
  }

  // Sidebar
  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);

      if (isMobile && window.location.pathname !== '/teacher/announcement') {
        navigator({ to: '/teacher/announcement' });
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
    if (res.status_code === 200 || res.status_code === 201) {
      showMessage(`${status === 'enabled' ? 'เปิดใช้งาน' : 'จัดเก็บ'}สำเร็จ`, 'success');
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
    if (res.status_code === 200 || res.status_code === 201) {
      showMessage(`${status === 'enabled' ? 'เปิดใช้งาน' : 'จัดเก็บ'}สำเร็จ`, 'success');
      setSelectedRecords([]);
      fetchAnnoucements();
    } else {
      showMessage(res.message, 'error');
    }
  };

  const onDownloadCSV = async (data: Record<string, any>): Promise<void> => {
    if (!data.dateFrom || !data.dateTo) {
      showMessage('กรุณาระบุวันที่', 'info');
      return Promise.reject(new Error('Date range is required'));
    }
    try {
      await API.announcement.DownloadCSV({
        startDate: data.dateFrom,
        endDate: data.dateTo,
      });
      showMessage('ดาวน์โหลด Csv สำเร็จ');
    } catch (error) {
      showMessage(`การดาวน์โหลดมีปัญหา: ${error}`, 'error');
      throw error;
    }
  };

  const onUploadCSV = async (file?: File): Promise<void> => {
    if (!file) {
      showMessage('No file selected');
      return Promise.reject(new Error('File is required for upload'));
    }
    try {
      const res = await API.announcement.UploadCSV(file);
      if (res.status_code === 201) {
        fetchAnnoucements();
        showMessage('อัปโหลด Csv สำเร็จ');
      } else {
        showMessage('การอัปโหลดมีปัญหา', 'error');
      }
    } catch (error) {
      showMessage(`การอัปโหลดมีปัญหา: ${error}`, 'error');
      throw error;
    }
  };

  const searchByTitle = (title: string) => {
    setSearch(title);
  };

  const toFiveDigitString = (num: number) => num.toString().padStart(5, '0');

  function closeArchiveModal() {
    setShowModalArchive(false);
    setShowModalBulkArchive(false);
  }

  const STATUS_LIST = [
    { label: 'ทั้งหมด', value: '', className: '' },
    { label: 'แบบร่าง', value: 'draft', className: 'badge-outline-dark' },
    { label: 'ใช้งาน', value: 'enabled', className: 'badge-outline-success' },
    { label: 'ไม่ใช้งาน', value: 'disabled', className: 'badge-outline-danger' },
  ] as const;

  return (
    <LineLiffPage className="mb-24 flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex w-full flex-col items-center gap-1">
          <h1 className="text-2xl font-bold">จัดการประกาศ</h1>
          <h2 className="text-sm">{pagination.total_count} รายการ</h2>
        </div>

        {/* Inline replacement for CWOHeaderTableButton */}
        <div className="flex w-full flex-wrap justify-between gap-2">
          <div className="flex w-full flex-wrap gap-2">
            {/* Bulk Edit */}
            <CWMDropdown
              disabled={!selectedRecords.length}
              label={
                <>
                  Bulk Edit <IconArrowDown />
                </>
              }
              items={[
                {
                  label: (
                    <div className="flex items-center gap-3">
                      <IconArchive /> จัดเก็บ
                    </div>
                  ),
                  onClick: () => setShowModalBulkArchive(true),
                },
                {
                  label: (
                    <div className="flex items-center gap-3">
                      <IconArrowBackward duotone={false} /> เปิดใช้งาน
                    </div>
                  ),
                  onClick: () => onBulkEdit('enabled', selectedRecords),
                },
              ]}
            />

            {/* Add button */}
            <CWButton
              parentClassname="w-full mt-2 "
              onClick={() => navigator({ to: '/line/teacher/announcement/add' })}
              icon={<IconPlus />}
              title="เพิ่มประกาศ"
            />
          </div>

          <CWMAccordion
            className="w-full"
            title="ตัวกรอง"
            headerClassName="bg-[#D5DDFF] mt-2"
          >
            <div className="mt-3 flex w-full flex-col gap-3 bg-[#F0F3FF] px-3 py-5">
              {/* Search */}
              <CWInputSearch
                placeholder="ค้นหา"
                onChange={(e) => searchByTitle(e.target.value)}
                className="w-full md:w-auto"
              />

              <div className="grid w-full grid-cols-2 gap-5">
                {/* วันที่เริ่มเผยแพร่ */}
                <WCAInputDateFlat
                  placeholder="วันที่เริ่มเผยแพร่"
                  options={{
                    mode: 'single',
                    dateFormat: 'd/m/Y',
                    allowInput: true,
                    disableMobile: true,
                  }}
                  onChange={(dates: Date[]) =>
                    setStartAt(
                      dates?.[0] ? fromISODateToYYYYMMDD(dates[0].toISOString()) : '',
                    )
                  }
                  className="w-full"
                  hideIcon
                />

                {/* วันที่หยุดเผยแพร่ */}
                <WCAInputDateFlat
                  placeholder="วันที่หยุดเผยแพร่"
                  options={{
                    mode: 'single',
                    dateFormat: 'd/m/Y',
                    allowInput: true,
                    disableMobile: true,
                  }}
                  onChange={(dates: Date[]) =>
                    setEndAt(
                      dates?.[0] ? fromISODateToYYYYMMDD(dates[0].toISOString()) : '',
                    )
                  }
                  className="w-full"
                  hideIcon
                />
              </div>
            </div>
          </CWMAccordion>

          {/* <div className="flex flex-1 gap-2 md:justify-end">
            <CWButton
              className="gap-2 !px-3 !font-bold"
              onClick={() => setModalState('download')}
              icon={<IconDownload />}
              title={'Download'}
            />

            <CWButton
              className="gap-2 !px-3 !font-bold"
              onClick={() => fileInputRef.current?.click()}
              icon={<IconUpload />}
              title={'Upload'}
            />
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".csv"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                onUploadCSV(file);
              }}
            />
          </div> */}
        </div>

        {/* {modalState === 'download' && (
          <Modal open onClose={closeModal} title="ดาวน์โหลด" className="w-96">
            <div className="flex flex-col gap-4">
              {[
                { name: 'dateFrom', label: 'ตั้งแต่วันที่' },
                { name: 'dateTo', label: 'ถึงวันที่' },
              ].map((config, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex gap-1">{config.label}:</div>
                  <input
                    type="date"
                    name={config.name}
                    className="rounded border p-1"
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, [config.name]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex w-full gap-2">
              <button className="btn btn-outline-dark w-full" onClick={closeModal}>
                ยกเลิก
              </button>
              <button
                className="btn btn-primary flex w-full gap-1"
                onClick={async () => {
                  await onDownloadCSV(formData);
                  closeModal();
                }}
              >
                <IconDownload /> Download
              </button>
            </div>
          </Modal>
        )} */}

        {/* Tabs */}

        <CWSelect
          hideEmptyOption
          options={STATUS_LIST.map((s, index) => ({
            label: s.label,
            value: s.value,
          }))}
          value={selectedTab}
          onChange={(e) => {
            setSelectedTab(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          className="w-full text-primary md:w-60"
        />

        {/* DataTable */}
        <div className="datatables w-full">
          <DataTable
            className="table-hover mantine-mobile-layout whitespace-nowrap"
            records={records}
            highlightOnHover
            withTableBorder
            withColumnBorders
            minHeight={'250px'}
            noRecordsText="ไม่พบข้อมูล"
            selectedRecords={selectedRecords}
            onSelectedRecordsChange={setSelectedRecords}
            page={pagination.page}
            recordsPerPage={pagination.limit}
            totalRecords={pagination.total_count}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
            onRecordsPerPageChange={(_limit) =>
              setPagination((prev) => ({ ...prev, limit: _limit }))
            }
            recordsPerPageOptions={pageSizeOptions}
            columns={[
              { accessor: '#', title: '#', render: (_r, i) => i + 1 },
              {
                accessor: 'id',
                title: 'รหัสประกาศ',
                render: (record: BaseAnnouncementEntity) => toFiveDigitString(record.id),
              },
              { accessor: 'title', title: 'หัวข้อประกาศ' },
              {
                accessor: 'started_at',
                title: 'วันที่เริ่มเผยแพร่',
                render: (record: BaseAnnouncementEntity) =>
                  toDateTimeTH(record.started_at),
              },
              {
                accessor: 'ended_at',
                title: 'วันที่หยุดเผยแพร่',
                render: (record: BaseAnnouncementEntity) => toDateTimeTH(record.ended_at),
              },
              {
                accessor: 'status',
                title: 'เปิดใช้งาน',
                render: (record: BaseAnnouncementEntity) => {
                  const status = STATUS_LIST.find((s) => s.value === record.status);
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
                    <Link to={`/line/teacher/announcement/edit/${record.id}`}>
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
                    <button onClick={() => onArchive('enabled', record)}>
                      <IconArrowBackward duotone={false} />
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
          />
        </div>

        {/* Archive Modals */}
        <ArchiveModal
          open={showModalArchive}
          onClose={closeArchiveModal}
          onArchive={() => {
            if (selectedRecord) {
              onArchive('disabled', selectedRecord);
              setSelectedRecord(undefined);
              setShowModalArchive(false);
            } else {
              showMessage('กรุณาเลือกประกาศ', 'warning');
            }
          }}
        />
        <ArchiveModal
          open={showModalBulkArchive}
          onClose={closeArchiveModal}
          onArchive={() => {
            if (selectedRecords.length) {
              onBulkEdit('disabled', selectedRecords);
              setShowModalBulkArchive(false);
            } else {
              showMessage('กรุณาเลือกประกาศ', 'warning');
            }
          }}
        />
      </div>
      <FooterMenu />
    </LineLiffPage>
  );
};

export default Announcement;
