import CWButtonSwitch from '@component/web/cw-button-switch';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import { TPagination } from '@domain/g05/g05-d02/local/types';
import { EEvaluationSheetStatus } from '@domain/g06/g06-d02/local/enums/evaluation';
import {
  TEvaluationFormFilledFilter,
  TEvaluationSheet,
} from '@domain/g06/g06-d02/local/types/grade';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import 'dayjs/locale/th';
import dayjs from '@global/utils/dayjs';
import { useNavigate } from '@tanstack/react-router';
import API from '@domain/g06/g06-d02/local/api';
import useModal from '@global/utils/useModal';
import ModalArchive from '@core/design-system/library/component/web/Modal/ModalArchive';
import { TPatchEvaluationSheetReq } from '@domain/g06/g06-d02/local/api/helper/grade';
import showMessage from '@global/utils/showMessage';
import config from '@core/config';

type FilledEvaluationFormTableProps = {
  fetching?: boolean;
  evaluationSheets: TEvaluationSheet[];
  searchFilter: TEvaluationFormFilledFilter;
  evaluationFormID: number;
  pagination: TPagination;
  onPaginationChange?: (pagination: TPagination) => void;
  handleRefetch?: () => void;
};

type ModalController = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const FilledEvaluationFormTable = ({
  evaluationSheets,
  pagination,
  searchFilter,
  fetching,
  evaluationFormID,
  onPaginationChange,
  handleRefetch,
}: FilledEvaluationFormTableProps) => {
  const navigate = useNavigate();

  const modalArchive = useModal();

  const modalArchiveRecall = useModal();

  const [selectedArchived, setSelectedArchived] = useState<TEvaluationSheet | undefined>(
    undefined,
  );

  const patchEvaluationSheet = async (
    evaluationSheetId: number,
    req: TPatchEvaluationSheetReq,
  ) => {
    try {
      const res = await API.Grade.PatchEvaluationSheet(evaluationSheetId, req);
      if (res.status === 200) {
        showMessage('จัดเก็บสำเร็จ');
        return;
      }
    } catch (error) {
      console.error('Error fetching evaluation sheet:', error);
    } finally {
    }
  };

  const getStatusBadgeClass = (status?: EEvaluationSheetStatus) => {
    switch (status) {
      case EEvaluationSheetStatus.ENABLED:
        return 'badge-outline-success';
      case EEvaluationSheetStatus.DRAFT:
        return 'badge-outline-dark';
      case EEvaluationSheetStatus.SENT:
        return 'badge-outline-warning';
      case EEvaluationSheetStatus.APPROVE:
        return 'badge-outline-info';
      case EEvaluationSheetStatus.DISABLED:
      default:
        return 'badge-outline-danger';
    }
  };

  const getStatusBadgeLabel = (status?: EEvaluationSheetStatus): string => {
    switch (status) {
      case EEvaluationSheetStatus.ENABLED:
        return 'ใช้งาน';
      case EEvaluationSheetStatus.DRAFT:
        return 'แบบร่าง';
      case EEvaluationSheetStatus.SENT:
        return 'ส่งข้อมูลแล้ว';
      case EEvaluationSheetStatus.APPROVE:
        return 'ออกรายงานแล้ว';
      case EEvaluationSheetStatus.DISABLED:
      default:
        return 'ไม่ใช้งาน';
    }
  };

  const columns = useMemo(() => {
    const columns: DataTableColumn<TEvaluationSheet>[] = [
      {
        accessor: 'is_lock',
        title: 'ล็อกใบประเมิน',
        titleClassName: 'text-center px-1 py-0.5',
        cellsClassName: 'text-center px-1 py-0.5',
        width: 120,
        render: (record, index) => (
          <div className="flex w-full justify-center">
            <CWButtonSwitch
              disabled={false}
              isLoading={false}
              customOnClassName="bg-red-500"
              initialState={record.is_lock ?? false}
              onToggle={async (value: boolean) => {
                try {
                  await patchEvaluationSheet(record.id, { is_lock: value });
                  showMessage('ล๊อกใบประเมินสำเร็จ');
                  handleRefetch?.();
                } catch (error) {
                  showMessage('พบปัญหาในการล๊อกใบประเมิน');
                  throw error;
                }
              }}
            />
          </div>
        ),
      },
      {
        accessor: 'view-evaluation',
        title: 'ดู',
        titleClassName: 'text-center px-1 py-0.5',
        cellsClassName: 'text-center px-1 py-0.5',
        width: 60,

        render: (record) => (
          <button
            onClick={() =>
              navigate({
                to: `/grade-system/data-entry/${record.id}`,
              })
            }
          >
            <IconSearch />
          </button>
        ),
      },
      {
        accessor: 'action-archive',
        title: 'จัดเก็บ',
        titleClassName: 'text-center px-1 py-0.5',
        cellsClassName: 'text-center px-1 py-0.5',
        width: 80,
        render: (record) => {
          const disabledApprove = record.status === EEvaluationSheetStatus.APPROVE;
          return (
            <div className="flex w-full justify-center">
              {record.status === EEvaluationSheetStatus.DISABLED ? (
                <button disabled type="button">
                  <IconCornerUpLeft className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (disabledApprove) return;
                    modalArchive.open();
                    setSelectedArchived(record);
                  }}
                  className={`${disabledApprove ? 'cursor-not-allowed opacity-25' : ''}`}
                  disabled={disabledApprove}
                >
                  <IconArchive className="h-5 w-5" />
                </button>
              )}
            </div>
          );
        },
      },
      // {
      //   accessor: 'index',
      //   title: <span className="text-primary">#</span>,
      //   cellsClassName: 'text-primary',
      //   render: (_, i) => i + 1 + (pagination.page - 1) * pagination.limit,
      // },
      {
        accessor: 'id',
        title: 'รหัสใบประเมิน',
        render: (record) => (
          <button
            type="button"
            onClick={() =>
              navigate({
                to: `/grade-system/data-entry/${record.id}`,
              })
            }
            className="cursor-pointer text-blue-600 underline hover:text-blue-800"
          >
            {String(record.id).padStart?.(7, '0')}
          </button>
        ),
      },
      {
        accessor: 'evaluation_form_title',
        title: 'หัวข้อใบประเมิน',
        render: (record) => (
          <button
            type="button"
            onClick={() =>
              navigate({
                to: `/grade-system/data-entry/${record.id}`,
              })
            }
            className="cursor-pointer text-blue-600 underline hover:text-blue-800"
          >
            {(record.general_type ? record.general_type : record.subject_name) ?? '-'}
          </button>
        ),
      },

      {
        accessor: 'updated_by',
        title: 'แก้ไขล่าสุดโดย',
        render: (record) => record.updated_by ?? '-',
      },
      {
        accessor: 'updated_at',
        title: 'แก้ไขล่าสุดเมื่อ',
        render: (record) =>
          record.updated_at?.locale('th').format('DD MMM BBBB HH:mm') ?? '-',
      },
      {
        accessor: 'status',
        title: 'สถานะ',
        titleClassName: 'text-center w-min',
        cellsClassName: 'text-center w-min',
        render: ({ status }) => (
          <span className={`badge ${getStatusBadgeClass(status)}`}>
            {getStatusBadgeLabel(status)}
          </span>
        ),
      },
    ];

    return columns;
  }, [searchFilter, pagination]);

  return (
    <>
      <DataTable
        columns={columns}
        records={evaluationSheets}
        highlightOnHover
        withTableBorder
        withColumnBorders
        height={'calc(100vh - 350px)'}
        totalRecords={pagination.total_count}
        recordsPerPage={pagination.limit}
        page={pagination.page}
        onPageChange={(page) => onPaginationChange?.({ ...pagination, page })}
        onRecordsPerPageChange={(pageSize) =>
          onPaginationChange?.({ ...pagination, limit: pageSize, page: 1 })
        }
        recordsPerPageOptions={config.pagination.itemPerPageOptions}
        paginationText={({ from, to, totalRecords }) => (
          <span className="whitespace-nowrap">
            แสดงที่ {from} ถึง {to} จาก {totalRecords} รายการ
          </span>
        )}
        fetching={fetching}
      />

      <ModalArchive
        open={modalArchive.isOpen}
        onClose={modalArchive.close}
        onOk={async () => {
          if (!selectedArchived) {
            return;
          }

          await patchEvaluationSheet(selectedArchived.id, {
            status: EEvaluationSheetStatus.DISABLED,
          });

          modalArchive.close();
          handleRefetch?.();
        }}
      />
    </>
  );
};

export default FilledEvaluationFormTable;
