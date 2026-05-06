import StoreGlobal from '@global/store/global';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import { useNavigate, useParams } from '@tanstack/react-router';

import CWRecordLayout from '../local/component/web/cw-record-layout';
import API from '../local/api';
import showMessage from '@global/utils/showMessage';
import downloadCSV from '@global/utils/downloadCSV';
import { getDateTime } from '@domain/g01/g01-d05/local/utils';
import usePagination from '@global/hooks/usePagination';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const {
    announceType,
  }: {
    announceType: AnnouncementType;
  } = useParams({ strict: false });

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  if (!['system', 'event', 'reward', 'notification'].includes(announceType)) {
    navigate({ to: '/gamemaster/announcement/system' });
  }

  const {
    page,
    pageSize: limit,
    totalCount: totalRecords,
    setPage,
    setPageSize: setLimit,
    setTotalCount: setTotalRecords,
  } = usePagination();

  const [records, setRecords] = useState<Announcement[]>([]);
  const [fetching, setFetching] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<Announcement[]>([]);
  const [filters, setFilters] = useState<{
    search?: string;
    status?: string;
    school_id?: string;
    started_at?: string;
    ended_at?: string;
    arcade_game_id?: string;
    subject_id?: string;
    academic_year?: string;
    year_id?: string;
    class_id?: string;
    announcement_id?: string;
    title?: string;
    school_name?: string;
  }>({});

  function onEdit(record: Announcement) {
    navigate({ to: `/gamemaster/announcement/$announceType/${record.id}` });
  }

  function onActive(record: Announcement) {
    API.announce[announceType]
      .Update(record.id, {
        ...record,
        status: 'enabled',
      })
      .then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('เปิดใช้งานสำเร็จ', 'success');
          fetchRecords();
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function onInactive(record: Announcement) {
    API.announce[announceType]
      .Update(record.id, {
        ...record,
        status: 'disabled',
      })
      .then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('จัดเก็บสำเร็จ', 'success');
          fetchRecords();
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function onDownload(data: { dateFrom: string; dateTo: string }) {
    if (data.dateFrom && data.dateTo) {
      API.announce[announceType]
        .DownloadCSV({
          start_date: data.dateFrom,
          end_date: data.dateTo,
        })
        .then((res) => {
          if (res instanceof Blob) {
            downloadCSV(res, `${getDateTime()}_announcement_${announceType}s.csv`);
          } else {
            showMessage(res.message, 'error');
          }
        });
    } else {
      showMessage('กรุณาเลือกวัน', 'warning');
    }
  }

  function onUpload(file: File | undefined) {
    if (file) {
      API.announce[announceType].UploadCSV(file).then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('อัปโหลดสำเร็จ', 'success');
          fetchRecords();
        } else {
          showMessage(res.message, 'error');
        }
      });
    }
  }

  function onBulkEdit(status: 'enabled' | 'disabled', records: Announcement[]) {
    API.announce[announceType]
      .BulkEdit(
        records.map((record) => ({
          id: record.id,
          status,
        })),
      )
      .then((res) => {
        if (res.status_code == 200 || res.status_code == 201) {
          showMessage('Bulk edit สำเร็จ', 'success');
          setSelectedRecords([]);
          fetchRecords();
        } else {
          showMessage(res.message, 'error');
        }
      });
  }

  function fetchRecords() {
    setFetching(true);
    API.announce[announceType]
      ?.Get({
        page,
        limit,
        ...filters,
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

  useEffect(() => {
    fetchRecords();
  }, [page, limit, filters, announceType]);

  useEffect(() => {
    setRecords([]);
    setFilters({});
    setSelectedRecords([]);
  }, [announceType]);

  return (
    <CWRecordLayout
      selectedRecords={selectedRecords}
      onSelectedRecordsChange={setSelectedRecords}
      type={announceType}
      title={'จัดการประกาศ'}
      description={
        <>
          {totalRecords} {'รายการ'}
        </>
      }
      rows={records}
      filters={filters}
      onFiltersChange={(data) => {
        setFilters({
          status: data.status || undefined,
          school_id: data.school_id || undefined,
          started_at: data.started_at || undefined,
          ended_at: data.ended_at || undefined,
          arcade_game_id: data.arcade_game_id || undefined,
          subject_id: data.subject_id || undefined,
          year_id: data.year_id || undefined,
          academic_year: data.academic_year || undefined,
          class_id: data.class_id || undefined,
          announcement_id: data.announcement_id || undefined,
          title: data.title || undefined,
          school_name: data.school_name || undefined,
        });
      }}
      fetching={fetching}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={setLimit}
      totalRecords={totalRecords}
      onDownload={onDownload}
      onUpload={onUpload}
      onEdit={onEdit}
      onSee={onEdit}
      onActive={onActive}
      onInactive={onInactive}
      onBulkEdit={onBulkEdit}
    />
  );
};

export default DomainJSX;
