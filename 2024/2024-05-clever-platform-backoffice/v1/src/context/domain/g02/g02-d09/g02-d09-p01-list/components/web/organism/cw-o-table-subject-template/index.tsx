import { TSubjectTemplate } from '@domain/g06/local/types/subject-template';
import { TPagination } from '@global/types/api';
import { DataTable } from 'mantine-datatable';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import API from '@domain/g06/local/api';
import showMessage from '@global/utils/showMessage';
import { TGetListSubjectTemplateReq } from '@domain/g06/local/api/helpers/subject-template';
import CWSwitchTabs from '@component/web/cs-switch-taps';
import { EStatus } from '@global/enums';
import { formatToDate } from '@global/utils/format/date';
import CWButton from '@component/web/cw-button';
import IconPlus from '@core/design-system/library/component/icon/IconPlus';
import CWInputSearch from '@component/web/cw-input-search';
import { useNavigate } from '@tanstack/react-router';
import IconEye from '@core/design-system/library/component/icon/IconEye';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import ButtonBulkEdit from '../../molecule/cw-m-button-bulk-edit';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import useModal from '@global/utils/useModal';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import config from '@core/config';

type TableSubjectTemplateProps = {
  subjectTemplate: TSubjectTemplate[];
  pagination: TPagination;
  onSubjectTemplateChange: (subjectTemplates: TSubjectTemplate[]) => void;
  setPagination: Dispatch<SetStateAction<TPagination>>;
};

const TableSubjectTemplate = ({
  subjectTemplate,
  pagination,
  onSubjectTemplateChange,
  setPagination,
}: TableSubjectTemplateProps) => {
  const navigate = useNavigate();

  const modalArchive = useModal();
  const modalRecall = useModal();

  const [filter, setFilter] = useState<TGetListSubjectTemplateReq>({});
  const [selectedRecord, setSelectedRecords] = useState<TSubjectTemplate[]>([]);
  const [selectArchiveRecord, setSelectArchiveRecord] = useState<{
    id: number;
    isArchived: boolean;
  } | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const selectedRecordIDs = useMemo(
    () => selectedRecord.map((r) => r.id),
    [selectedRecord],
  );

  useEffect(() => {
    fetchData(filter, pagination);
  }, [pagination.page, pagination.limit, filter]);

  const fetchData = async (
    params: TGetListSubjectTemplateReq,
    pagination: TPagination,
  ) => {
    try {
      setIsFetching(true);
      const res = await API.SubjectTemplate.GetSubjectTemplateLists({
        ...params,
        page: pagination.page,
        limit: pagination.limit,
      });

      onSubjectTemplateChange(res.data.data);
      setPagination((prev) => ({
        ...prev,
        total_count: res.data._pagination.total_count,
      }));
    } catch (error) {
      showMessage('พบปัญหาในการในการนำเข้าข้อมูล', 'error');
      throw error;
    } finally {
      setIsFetching(false);
    }
  };

  const setStatus = (status: EStatus | undefined) => {
    setFilter((prev) => ({ ...prev, status }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleArchive = async (id: number, isArchived: boolean) => {
    const oprType = isArchived ? 'จัดเก็บ' : 'เรียกคืน';

    try {
      await API.SubjectTemplate.PostSubjectTemplateBulkEdit({
        bulk_edit_list: [
          { id: id, status: isArchived ? EStatus.DISABLED : EStatus.ENABLED },
        ],
      });

      showMessage(`${oprType}สำเร็จ`);
      fetchData(filter, pagination);
    } catch (error) {
      showMessage(`พบปัญหาในการ${oprType}`, 'error');
      throw error;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2.5">
        <ButtonBulkEdit
          updateItemIDLists={selectedRecordIDs}
          onSuccess={() => {
            fetchData(filter, pagination);
            setSelectedRecords([]);
          }}
        />

        <CWButton
          title="เพิ่ม Template ใบตัดเกรด"
          icon={<IconPlus />}
          onClick={() => navigate({ to: './create' })}
        />
        <div className="h-9 w-[1px] bg-neutral-300"></div>
        <CWInputSearch
          value={filter.name}
          onChange={(e) => setFilter((prev) => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <CWSwitchTabs
        tabs={[
          { id: '1', label: 'ทั้งหมด', onClick: () => setStatus(undefined) },
          { id: '2', label: 'ใช้งาน', onClick: () => setStatus(EStatus.ENABLED) },
          { id: '3', label: 'แบบร่าง', onClick: () => setStatus(EStatus.DRAFT) },
          { id: '4', label: 'ไม่ใช้งาน', onClick: () => setStatus(EStatus.DISABLED) },
        ]}
        initialTabId="1"
      />

      <DataTable
        records={subjectTemplate}
        columns={[
          {
            accessor: 'view_button',
            title: 'ดู',
            render: (record) => {
              return record.status === EStatus.DRAFT ? (
                <button onClick={() => navigate({ to: `./edit/${record.id}` })}>
                  <IconPen />
                </button>
              ) : (
                <button onClick={() => navigate({ to: `./view/${record.id}` })}>
                  <IconEye />
                </button>
              );
            },
          },
          { accessor: 'name', title: 'ชื่อ Template' },
          {
            accessor: 'updated_at',
            title: 'แก้ไขล่าสุด',

            render: (record) => {
              const date = record.updated_at ?? record.created_at;
              return date ? formatToDate(date, { shortMonth: true }) : '-';
            },
          },
          {
            accessor: 'updated_by',
            title: 'แก้ไขล่าสุดโดย',
            render: (record) => record.updated_by ?? record.created_by ?? '-',
          },
          {
            accessor: 'status',
            title: 'สถานะ',
            render: (record) => {
              switch (record.status) {
                case EStatus.ENABLED:
                  return <span className="badge badge-outline-success">ใช้งาน</span>;
                case EStatus.DRAFT:
                  return <span className="badge badge-outline-dark">แบบร่าง</span>;
                default:
                  return <span className="badge badge-outline-danger">ไม่ใช้งาน</span>;
              }
            },
          },
          {
            accessor: 'archive_button',
            title: 'จัดเก็บ',
            render: (record) => {
              return (
                <button
                  disabled={record.status == EStatus.DRAFT}
                  onClick={() => {
                    setSelectArchiveRecord({
                      id: record.id,
                      isArchived: record.status == EStatus.ENABLED,
                    });
                    record.status == EStatus.ENABLED
                      ? modalArchive.open()
                      : modalRecall.open();
                  }}
                >
                  {record.status == EStatus.DISABLED ? (
                    <IconCornerUpLeft />
                  ) : (
                    <IconArchive />
                  )}
                </button>
              );
            },
          },
        ]}
        className="table-hover whitespace-nowrap"
        highlightOnHover
        withTableBorder
        withColumnBorders
        height={'calc(100vh - 350px)'}
        noRecordsText="ไม่พบข้อมูล"
        totalRecords={pagination.total_count}
        recordsPerPage={pagination.limit}
        page={pagination.page}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page: page }))}
        onRecordsPerPageChange={(pageSize) =>
          setPagination((prev) => ({ ...prev, limit: pageSize, page: 1 }))
        }
        recordsPerPageOptions={config.pagination.itemPerPageOptions}
        paginationText={({ from, to, totalRecords }) =>
          `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
        }
        fetching={isFetching}
        loaderType="oval"
        loaderBackgroundBlur={4}
        isRecordSelectable={(record) => record.status !== EStatus.DRAFT}
        selectedRecords={selectedRecord}
        onSelectedRecordsChange={setSelectedRecords}
      />

      <CWModalArchive
        open={modalArchive.isOpen}
        onClose={() => {
          modalArchive.close();
          setSelectArchiveRecord(null);
        }}
        onOk={() => {
          if (!selectArchiveRecord) return;
          modalArchive.close();
          handleArchive(selectArchiveRecord.id, selectArchiveRecord?.isArchived);
        }}
      />

      <CWModalArchiveRecall
        open={modalRecall.isOpen}
        onClose={() => {
          modalRecall.close();
          setSelectArchiveRecord(null);
        }}
        onOk={() => {
          if (!selectArchiveRecord) return;
          modalRecall.close();
          handleArchive(selectArchiveRecord.id, selectArchiveRecord.isArchived);
        }}
      />
    </div>
  );
};
export default TableSubjectTemplate;
