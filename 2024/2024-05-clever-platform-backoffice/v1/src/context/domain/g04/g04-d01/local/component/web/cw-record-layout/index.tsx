import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../../local/config/index.json';

import CWLayout from '../cw-layout';
import CWHeader from '../cw-header';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import CWTableTemplate from '@domain/g04/g04-d02/local/component/web/cw-table-template';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import { useNavigate } from '@tanstack/react-router';
import IconPencil from '@core/design-system/library/vristo/source/components/Icon/IconPencil';
import IconArrowBackward from '@core/design-system/library/vristo/source/components/Icon/IconArrowBackward';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import { useEffect, useState } from 'react';
import { toDateTimeTH } from '@global/utils/date';
import IconEye from '@core/design-system/library/vristo/source/components/Icon/IconEye';
import API from '../../../api';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import { BsRecord2 } from 'react-icons/bs';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';

interface CWRecordLayoutProps<T> {
  title: React.ReactNode;
  type: 'system' | 'event' | 'reward' | 'notification';
  description?: React.ReactNode;
  fetching: boolean;
  rows: T[];
  filters: Record<string, any>;
  onFiltersChange?: (data: Record<string, any>) => void;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (page: number) => void;
  totalRecords: number;
  onUpload?: (file: File | undefined) => void;
  onDownload?: (data: { dateFrom: string; dateTo: string }) => void;
  onEdit?: (data: T, index: number) => void;
  onSee?: (data: T, index: number) => void;
  onActive?: (data: T) => void;
  onInactive?: (data: T) => void;
  onBulkEdit?: (status: 'enabled' | 'disabled', records: T[]) => void;
  selectedRecords: T[];
  onSelectedRecordsChange: (records: T[]) => void;
}

const CWRecordLayout = function ({
  type,
  title,
  description,
  rows,
  page,
  setPage,
  limit,
  setLimit,
  totalRecords,
  onFiltersChange = () => {},
  onUpload,
  onDownload,
  onEdit,
  onSee,
  onActive,
  onInactive,
  onBulkEdit,
  fetching,
  filters,
  selectedRecords,
  onSelectedRecordsChange,
}: CWRecordLayoutProps<Announcement>) {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  const [statusTabIndex, setStatusTabIndex] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState<Announcement>();
  const [modalState, setModalState] = useState<'' | 'recall' | 'archive'>('');

  function closeModal() {
    setModalState('');
    setSelectedRecord(undefined);
  }

  const announceTypes = [
    {
      key: 'system',
      label: `ระดับโรงเรียน: ประกาศจากระบบ`,
      href: '/gamemaster/announcement/system',
    },
    {
      key: 'event',
      label: `ระดับวิชา: กิจกรรม`,
      href: '/gamemaster/announcement/event',
    },
    {
      key: 'reward',
      label: `ระดับวิชา: แจกไอเทม`,
      href: '/gamemaster/announcement/reward',
    },
    {
      key: 'notification',
      label: `ระดับวิชา: แจ้งเตือนจากระบบ`,
      href: '/gamemaster/announcement/notification',
    },
  ];

  const [schools, setSchools] = useState<DropdownSchool[]>([]);
  const [subjects, setSubjects] = useState<DropdownSubject[]>([]);
  const [years, setYears] = useState<DropdownYear[]>([]);
  const [academicYears, setAcademicYears] = useState<number[]>([]);
  const [search, setSearch] = useState<{ key: string; value: string }>({
    key: 'announcement_id',
    value: '',
  });

  useEffect(() => {
    API.other.GetSchools({ limit: -1 }).then((res) => {
      if (res.status_code == 200) {
        setSchools(res.data);
      }
    });
  }, []);

  useEffect(() => {
    API.other
      .GetYears({
        school_id: filters.school_id || undefined,
        limit: -1,
      })
      .then((res) => {
        if (res.status_code == 200) {
          setYears(res.data);
        } else {
          setYears([]);
        }
      });

    if (filters.school_id) {
      API.other
        .GetAcademicYearsBySchoolId(filters.school_id, { limit: -1 })
        .then((res) => {
          if (res.status_code == 200) {
            setAcademicYears(res.data.map((d) => d.academic_year));
          } else {
            setAcademicYears([]);
          }
        });
    } else {
      setAcademicYears([]);
    }
  }, [filters.school_id]);

  useEffect(() => {
    API.other
      .GetSubjects({
        school_id: filters.school_id || undefined,
        year_id: filters.year_id || undefined,
        limit: -1,
      })
      .then((res) => {
        if (res.status_code == 200) {
          setSubjects(res.data);
        }
      });
  }, [filters.school_id, filters.year_id]);

  const statuses = [
    { key: '', label: 'ทั้งหมด' },
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

  function onFilters(key: string, value: any) {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  }

  useEffect(() => {
    onFiltersChange({
      ...filters,
      [search.key]: search.value,
    });
  }, [search]);

  return (
    <CWLayout>
      <CWHeader title={title} description={description} />

      <CWMTabs
        items={announceTypes.map((t) => t.label)}
        currentIndex={announceTypes.findIndex((t) => t.key == type)}
        onClick={(index) => {
          navigate({ to: `/gamemaster/announcement/${announceTypes[index].key}` });
        }}
      />

      <CWTableTemplate
        header={{
          btnIcon: <IconPlus />,
          btnLabel: 'เพิ่มประกาศ',
          onBtnClick: () => {
            navigate({ to: `/gamemaster/announcement/$announceType/create` });
          },
          onDownload: (data) => {
            onDownload?.({
              dateFrom: data.dateFrom || '',
              dateTo: data.dateTo || '',
            });
          },
          onUpload: onUpload,
          inputSearchType: 'input-dropdown',
          onSearchDropdownSelect(selected) {
            delete filters[search.key];
            setSearch((prev) => ({
              ...prev,
              key: selected.toString(),
            }));
          },
          onSearchChange: (e) => {
            const value = e.currentTarget.value;
            setSearch((prev) => ({
              ...prev,
              value,
            }));
          },
          searchDropdownOptions: [
            {
              label: type == 'event' ? 'รหัสกิจกรรม' : 'รหัสประกาศ',
              value: 'announcement_id',
            },
            {
              label: 'ชื่อโรงเรียน',
              value: 'school_name',
            },
            {
              label: type == 'event' ? 'หัวข้อกิจกรรม' : 'หัวข้อประกาศ',
              value: 'title',
            },
          ],
          bulkEditActions: [
            {
              label: (
                <div className="flex gap-3">
                  <IconArchive /> จัดเก็บ
                </div>
              ),
              onClick() {
                onBulkEdit?.('disabled', selectedRecords);
              },
            },
            {
              label: (
                <div className="flex gap-3 text-nowrap">
                  <IconCornerUpLeft /> เปิดใช้งาน
                </div>
              ),
              onClick() {
                onBulkEdit?.('enabled', selectedRecords);
              },
            },
          ],
          bulkEditDisabled: !selectedRecords.length,
          searchDropdownValue: search.key,
        }}
        filters={[
          {
            key: 'started_at',
            type: 'date',
            placeholder:
              type == 'reward'
                ? 'วันที่แจกไอเทม'
                : type == 'event'
                  ? 'วันที่เริ่มกิจกรรม'
                  : 'วันที่เริ่มเผยเเพร่',
            value: filters.started_at,
            onChange(value) {
              onFilters('started_at', value);
            },
          },
          {
            key: 'ended_at',
            type: 'date',
            placeholder: type == 'event' ? 'วันที่จบกิจกรรม' : 'วันที่หยุดเผยเเพร่',
            hidden: !['system', 'event', 'notification'].includes(type),
            value: filters.ended_at,
            onChange(value) {
              onFilters('ended_at', value);
            },
          },
          {
            key: 'school_id',
            placeholder: 'ชื่อโรงเรียน',
            value: filters.school_id,
            options: schools.map((s) => ({ label: s.name, value: s.id.toString() })),
            onChange(value) {
              onFilters('school_id', value);
            },
          },
          {
            key: 'subject_id',
            placeholder: 'วิชา',
            hidden: !['event', 'reward', 'notification'].includes(type),
            value: filters.subject_id,
            options: subjects.map((s) => ({
              label: s.SubjectName,
              value: s.id.toString(),
            })),
            onChange(value) {
              onFilters('subject_id', value);
            },
          },
          {
            key: 'academic_year',
            placeholder: 'ปีการศึกษา',
            hidden: !['event', 'reward', 'notification'].includes(type),
            value: filters.academic_year,
            options: academicYears.map((y) => ({
              label: y.toString(),
              value: y.toString(),
            })),
            onChange(value) {
              onFilters('academic_year', value);
            },
          },
          {
            key: 'year_id',
            placeholder: 'ชั้นปี',
            hidden: !['event', 'reward', 'notification'].includes(type),
            value: filters.year_id,
            options: years.map((s) => ({ label: s.name, value: s.id.toString() })),
            onChange(value) {
              onFilters('year_id', value);
            },
          },
        ]}
        tabs={{
          tabIndex: statusTabIndex,
          key: 'status',
          items: statuses.map((s) => s.label),
          onTabChange: (i) => {
            setStatusTabIndex(i);
            onFilters('status', statuses[i]?.key ?? '');
          },
        }}
        table={{
          records: rows,
          selectedRecords,
          onSelectedRecordsChange,
          limit,
          onLimitChange: setLimit,
          onPageChange: setPage,
          page,
          totalRecords,
          fetching,
          columns: [
            {
              accessor: 'seeBtn',
              width: 75,
              title: 'ดู',
              render(record, index) {
                return (
                  <button onClick={() => onSee?.(record, index)}>
                    <IconEye duotone={false} />
                  </button>
                );
              },
              hidden: !['event'].includes(type),
            },
            {
              accessor: 'index',
              title: '#',
              width: 40,
              render(record, index) {
                return index + 1;
              },
            },
            {
              accessor: 'id',
              title: type == 'event' ? 'รหัสกิจกรรม' : 'รหัสประกาศ',
            },
            {
              accessor: 'school_name',
              title: 'โรงเรียน',
              width: 150,
              ellipsis: true,
            },
            {
              accessor: 'subject_name',
              title: 'วิชา',
              hidden: !['event', 'reward', 'notification'].includes(type),
            },
            {
              accessor: 'academic_year',
              title: 'ปีการศึกษา',
              hidden: !['event', 'reward', 'notification'].includes(type),
            },
            {
              accessor: 'seed_year_name',
              title: 'ชั้นปี',
              hidden: !['event', 'reward', 'notification'].includes(type),
            },
            {
              accessor: 'title',
              title: type == 'event' ? 'หัวข้อกิจกรรม' : 'หัวข้อประกาศ',
              width: 300,
              ellipsis: true,
            },
            {
              accessor: 'arcade_game_name',
              title: 'กิจกรรม',
              ellipsis: true,
              hidden: !['event'].includes(type),
            },
            {
              accessor: 'started_at',
              title:
                type == 'reward'
                  ? 'วันที่แจกไอเทม'
                  : type == 'event'
                    ? 'วันที่เริ่มกิจกรรม'
                    : 'วันที่เริ่มเผยเเพร่',
              render(record, index) {
                return record.started_at ? toDateTimeTH(record.started_at) : '';
              },
              hidden: !['system', 'event', 'notification'].includes(type),
            },
            {
              accessor: 'ended_at',
              title: type == 'event' ? 'วันที่จบกิจกรรม' : 'วันที่หยุดเผยเเพร่',
              render(record, index) {
                return record.ended_at ? toDateTimeTH(record.ended_at) : '';
              },
              hidden: !['system', 'event'].includes(type),
            },
            {
              accessor: 'amount',
              title: 'จำนวนไอเทม',
              ellipsis: true,
              hidden: !['reward'].includes(type),
              render(record, index) {
                return 'item_list' in record ? record.item_list.length : '';
              },
            },
            {
              accessor: 'status',
              title: 'สถานะ',
              render(record, index) {
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
              width: 75,
              title: 'แก้ไข',
              render(record, index) {
                return (
                  <button onClick={() => onEdit?.(record, index)}>
                    <IconPencil />
                  </button>
                );
              },
              hidden: !['system', 'reward', 'notification'].includes(type),
            },
            {
              accessor: 'archiveBtn',
              width: 75,
              title: 'จัดเก็บ',
              render(record, index) {
                return (
                  <>
                    {record.status == 'disabled' ? (
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
                    )}
                  </>
                );
              },
            },
          ],
          minHeight: 400,
        }}
      />
      <CWModalArchive
        open={modalState == 'archive'}
        onClose={closeModal}
        onOk={() => {
          if (selectedRecord) {
            onInactive?.(selectedRecord);
            closeModal();
          }
        }}
      />
      <CWModalArchiveRecall
        open={modalState == 'recall'}
        onClose={closeModal}
        onOk={() => {
          if (selectedRecord) {
            onActive?.(selectedRecord);
            closeModal();
          }
        }}
      />
    </CWLayout>
  );
};

export default CWRecordLayout;
