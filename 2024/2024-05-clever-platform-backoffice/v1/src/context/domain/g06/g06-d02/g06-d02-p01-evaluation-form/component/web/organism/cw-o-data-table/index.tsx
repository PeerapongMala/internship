import CWButtonSwitch from '@component/web/cw-button-switch';
import CWInputCheckbox from '@component/web/cw-input-checkbox';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import CwProgress from '@component/web/cw-progress';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import IconSearch from '@core/design-system/library/component/icon/IconSearch';
import API from '@domain/g06/g06-d02/local/api';
import { EEvaluationFormStatus } from '@domain/g06/g06-d02/local/enums/evaluation';
import {
  getStatusBadgeClass,
  getStatusBadgeLabel,
} from '@domain/g06/g06-d02/local/helpers/status';
import { TBasePaginationResponse, TPagination } from '@domain/g06/g06-d02/local/types';
import {
  TEvaluationForm,
  TEvaluationFormGetListFilter,
} from '@domain/g06/g06-d02/local/types/grade';
import usePagination from '@global/hooks/usePagination';
import showMessage from '@global/utils/showMessage';
import useModal from '@global/utils/useModal';
import { useNavigate } from '@tanstack/react-router';
import { AxiosError, isCancel } from 'axios';
import { DataTable as MantineTable, DataTableColumn } from 'mantine-datatable';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

type DataTableProps = {
  schoolID: string;
  filterSearch: TEvaluationFormGetListFilter;
  checkedLists: number[];
  onToggleCheckBox?: (id: number[], isCheck: boolean) => void;
};

const Component = (
  { filterSearch, schoolID, checkedLists, onToggleCheckBox }: DataTableProps,
  ref: React.ForwardedRef<unknown>,
) => {
  const navigate = useNavigate();

  const [fetching, setFetching] = useState<boolean>(false);
  const { pagination, setPagination, pageSizeOptions } = usePagination();

  const [isSelectedAllCurrentPage, setIsSelectedAllCurrentPage] = useState(false);
  const [records, setRecords] = useState<TEvaluationForm[]>([]);
  const [isLockFetching, setIsLockFetching] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectedArchiveItem, setSelectedArchiveItem] = useState<
    | {
        id: number;
        status: EEvaluationFormStatus.ENABLED | EEvaluationFormStatus.DISABLED;
      }
    | undefined
  >(undefined);

  const handleToggleLock = async (id: number, isLock: boolean) => {
    const operationType = isLock ? 'ล็อก' : 'ปลดล็อก';
    setIsLockFetching((prev) => ({ ...prev, [id]: true }));

    try {
      await API.Grade.PatchEvaluationForm(id, { is_lock: isLock });
    } catch (error) {
      showMessage(`พบปัญหาในขณะ${operationType}ใบเกรด`, 'warning');
      throw error;
    } finally {
      setIsLockFetching((prev) => ({ ...prev, [id]: false }));
    }

    showMessage(`${operationType}ใบเกรดสำเร็จ`);
  };

  const {
    isOpen: isOpenArchiveModal,
    close: closeArchiveModal,
    open: openArchiveModal,
  } = useModal();
  const {
    isOpen: isOpenArchiveRecallModal,
    close: closeArchiveRecallModal,
    open: openArchiveRecallModal,
  } = useModal();
  const handleClickArchive = (
    id: number,
    status: EEvaluationFormStatus.DISABLED | EEvaluationFormStatus.ENABLED,
  ) => {
    status === EEvaluationFormStatus.ENABLED
      ? openArchiveRecallModal()
      : openArchiveModal();

    setSelectedArchiveItem({ id, status });
  };
  const handleArchive = async (
    id: number,
    status: EEvaluationFormStatus.DISABLED | EEvaluationFormStatus.ENABLED,
    onSuccess?: () => void,
  ) => {
    const operationType =
      status === EEvaluationFormStatus.ENABLED ? 'เรียกคืน' : 'จัดเก็บ';
    try {
      await API.Grade.PatchEvaluationForm(id, {
        is_archived: !(status === EEvaluationFormStatus.ENABLED),
      });
      await fetchEvaluationList();
      showMessage(`${operationType}สำเร็จ`);
      setSelectedArchiveItem(undefined);
      onSuccess?.();
    } catch (error) {
      const err = error as AxiosError;
      if (err) {
        const status = err.status;

        if (status === 400) {
          showMessage(`เรียกคืนไม่สำเร็จ\nห้องเรียนไม่สามารถซ้ำกันได้`, 'error');
        } else {
          showMessage(`เกิดข้อผิดพลาดในการ${operationType}`, 'error');
        }
      } else {
        showMessage(`เกิดข้อผิดพลาดในการ${operationType}`, 'error');
      }
      throw error;
    }
  };

  const fetchEvaluationList = async (controller?: AbortController) => {
    setFetching(true);
    let result: TBasePaginationResponse<TEvaluationForm>;

    try {
      result = await API.Grade.GetEvaluationFormList(
        {
          schoolID: schoolID,
          search: filterSearch?.search,
          year: filterSearch?.year,
          status: filterSearch?.status,
          is_archived: filterSearch?.status
            ? filterSearch.status === EEvaluationFormStatus.DISABLED
            : undefined,
          page: pagination.page,
          limit: pagination.limit,
        },
        controller,
      );
    } catch (error) {
      if (isCancel(error)) throw error;
      showMessage('พบปัญหาในการในการนำเข้าข้อมูล', 'error');
      throw error;
    } finally {
      setFetching(false);
    }
    setIsLockFetching({});

    setRecords(result.data);
    setPagination((prev) => ({ ...prev, total_count: result._pagination.total_count }));
  };

  // reset page and total_count when filter change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1, total_count: 0 }));
  }, [filterSearch]);

  useEffect(() => {
    const controller = new AbortController();
    fetchEvaluationList(controller);

    return () => {
      controller.abort();
    };
  }, [pagination.page, pagination.limit, filterSearch]);

  useEffect(() => {
    if (records.length === 0 || checkedLists.length === 0) {
      setIsSelectedAllCurrentPage(false);
      return;
    }

    // Check if every record is present in checkedLists
    const isSelectedAll = records.every((record) => checkedLists.includes(record.id));

    setIsSelectedAllCurrentPage(isSelectedAll);
  }, [records, checkedLists]);

  const columnDefs = useMemo<DataTableColumn<TEvaluationForm>[]>(() => {
    const columns: DataTableColumn<TEvaluationForm>[] = [
      // Checkbox เลือกทั้งหมด
      {
        accessor: 'checkbox',
        title: (
          <CWInputCheckbox
            key={`checkbox-all`}
            checked={isSelectedAllCurrentPage}
            onChange={(e) => {
              setIsSelectedAllCurrentPage(e.currentTarget.checked);
              onToggleCheckBox?.(
                records.map((record) => record.id),
                e.currentTarget.checked,
              );
            }}
          />
        ),
        titleClassName: 'px-1 py-0.5 text-center',
        cellsClassName: 'px-1 py-0.5 text-center',
        render: (record) => (
          <CWInputCheckbox
            key={`checkbox-${record.id}`}
            checked={checkedLists.includes(record.id)}
            onChange={(e) => {
              onToggleCheckBox?.([record.id], e.currentTarget.checked);
            }}
          />
        ),
      },

      // ดูรายงาน
      {
        accessor: 'view-evaluation-report',
        title: 'ดูรายงาน',
        titleClassName: 'px-1 py-0.5 text-center w-min',
        cellsClassName: 'px-1 py-0.5 text-center w-min',
        render: (record) => {
          const isDisabled = [
            EEvaluationFormStatus.DRAFT,
            EEvaluationFormStatus.DISABLED,
          ].includes(record.status);
          return (
            <button
              type="button"
              disabled={isDisabled}
              onClick={() =>
                !isDisabled &&
                navigate({ to: `/grade-system/evaluation/report/${record.id}` })
              }
            >
              <IconSearch
                className={`h-5 w-5 ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`}
              />
            </button>
          );
        },
      },

      // ดูใบประเมิน
      {
        accessor: 'view-evaluation',
        title: 'ดูใบประเมิน',
        titleClassName: 'px-1 py-0.5 text-center w-min',
        cellsClassName: 'px-1 py-0.5 text-center w-min',
        render: (record) => (
          <button
            type="button"
            onClick={() => {
              const dest =
                record.status === EEvaluationFormStatus.DRAFT
                  ? `/grade-system/evaluation/edit/${record.id}`
                  : `/grade-system/evaluation/info/${record.id}`;
              navigate({ to: dest });
            }}
          >
            <IconSearch className="h-5 w-5" />
          </button>
        ),
      },

      // ล็อกใบเกรด
      {
        accessor: 'is_lock',
        title: 'ล็อกใบเกรด',
        titleClassName: 'px-1 py-0.5 text-center w-min',
        cellsClassName: 'px-1 py-0.5 text-center w-min',
        render: (record) => (
          <CWButtonSwitch
            customOnClassName="bg-red-500"
            disabled={
              isLockFetching[record.id] || record.status === EEvaluationFormStatus.DRAFT
            }
            isLoading={isLockFetching[record.id]}
            initialState={record.is_lock ?? false}
            onToggle={(value: boolean) => handleToggleLock(record.id, value)}
          />
        ),
      },

      // จัดเก็บ / เรียกคืน
      {
        accessor: 'archive',
        title: 'จัดเก็บ',
        titleClassName: 'px-1 py-0.5 text-center w-min',
        cellsClassName: 'px-1 py-0.5 text-center w-min',
        render: (record) =>
          record.is_archived ? (
            <button
              type="button"
              onClick={() => handleClickArchive(record.id, EEvaluationFormStatus.ENABLED)}
            >
              <IconCornerUpLeft className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                handleClickArchive(record.id, EEvaluationFormStatus.DISABLED)
              }
            >
              <IconArchive className="h-5 w-5" />
            </button>
          ),
      },

      // ลำดับ
      // {
      //   accessor: 'index',
      //   title: '#',
      //   titleClassName: 'px-1 py-0.5 text-center',
      //   cellsClassName: 'px-1 py-0.5 text-center',
      //   render: (_, index) => index + 1 + (pagination.page - 1) * pagination.limit,
      // },

      // รหัสใบตัดเกรด
      {
        accessor: 'id',
        title: 'รหัสใบตัดเกรด',
      },
      // Template (เป็น hyperlink)
      {
        accessor: 'template_name',
        title: 'Template',
        titleClassName: 'px-1 py-0.5',
        cellsClassName: 'px-1 py-0.5',
        render: (record) => (
          <button
            className="text-blue-600 underline hover:text-blue-800"
            onClick={() => navigate({ to: `/grade-system/evaluation/edit/${record.id}` })}
          >
            {record.template_name}
          </button>
        ),
      },

      // ปีการศึกษา
      {
        accessor: 'academic_year',
        title: 'ปีการศึกษา',
        titleClassName: 'px-1 py-0.5 text-center',
        cellsClassName: 'px-1 py-0.5 text-center',
      },

      // ชั้นปี
      {
        accessor: 'year',
        title: 'ชั้นปี',
        titleClassName: 'px-1 py-0.5 text-center',
        cellsClassName: 'px-1 py-0.5 text-center',
      },

      // ห้อง
      {
        accessor: 'school_room',
        title: 'ห้อง',
        titleClassName: 'px-1 py-0.5 text-center',
        cellsClassName: 'px-1 py-0.5 text-center',
      },

      // การกรอกข้อมูล (หัวข้อ)
      {
        accessor: 'signed_count',
        title: 'การกรอกข้อมูล (หัวข้อ)',
        titleClassName: 'px-1 py-0.5 text-center',
        cellsClassName: 'px-1 py-0.5 flex items-center gap-1',
        render: (record) => {
          const ongoingCount = record.ongoing_sheet_count;
          const totalCount = record.total_signed_sheet_count;
          const remainingPercentage =
            totalCount !== 0 ? (ongoingCount / totalCount) * 100 : 0;

          return (
            <>
              <span>
                {ongoingCount} / {totalCount}
              </span>
              <div className="w-[72px]">
                <CwProgress percent={remainingPercentage} />
              </div>
            </>
          );
        },
      },

      // สถานะ
      {
        accessor: 'status',
        title: 'สถานะ',
        titleClassName: 'px-1 py-0.5 text-center w-min',
        cellsClassName: 'px-1 py-0.5 text-center w-min',
        render: ({ status, is_archived: isArchived }) => (
          <span
            className={`badge ${getStatusBadgeClass(isArchived ? EEvaluationFormStatus.DISABLED : status)}`}
          >
            {getStatusBadgeLabel(isArchived ? EEvaluationFormStatus.DISABLED : status)}
          </span>
        ),
      },
    ];

    return columns;
  }, [filterSearch, isLockFetching, checkedLists, isSelectedAllCurrentPage]);

  useImperativeHandle(ref, () => ({
    fetchEvaluationList: fetchEvaluationList,
  }));
  return (
    <div>
      {records.length > 0 ? (
        <MantineTable
          className="table-hover whitespace-nowrap"
          records={records}
          columns={columnDefs}
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
          recordsPerPageOptions={pageSizeOptions}
          paginationText={({ from, to, totalRecords }) =>
            `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
          }
          fetching={fetching}
          loaderType="oval"
          loaderBackgroundBlur={4}
        />
      ) : (
        <MantineTable
          className="table-hover whitespace-nowrap"
          records={records}
          columns={columnDefs}
          highlightOnHover
          withTableBorder
          withColumnBorders
          height={'calc(100vh - 350px)'}
          noRecordsText="ไม่พบข้อมูล"
          fetching={fetching}
          loaderType="oval"
          loaderBackgroundBlur={4}
        />
      )}

      <CWModalArchive
        open={isOpenArchiveModal}
        onOk={() => {
          if (!selectedArchiveItem) {
            closeArchiveModal();
            return;
          }
          handleArchive(
            selectedArchiveItem?.id,
            selectedArchiveItem?.status,
            closeArchiveModal,
          );
        }}
        onClose={() => {
          setSelectedArchiveItem(undefined);
          closeArchiveModal();
        }}
      />

      <CWModalArchiveRecall
        open={isOpenArchiveRecallModal}
        onOk={() => {
          if (!selectedArchiveItem) {
            closeArchiveRecallModal();
            return;
          }
          handleArchive(
            selectedArchiveItem?.id,
            selectedArchiveItem?.status,
            closeArchiveRecallModal,
          );
          closeArchiveRecallModal();
        }}
        onClose={() => {
          setSelectedArchiveItem(undefined);
          closeArchiveRecallModal();
        }}
      />
    </div>
  );
};

const DataTable = forwardRef(Component);

export default DataTable;
