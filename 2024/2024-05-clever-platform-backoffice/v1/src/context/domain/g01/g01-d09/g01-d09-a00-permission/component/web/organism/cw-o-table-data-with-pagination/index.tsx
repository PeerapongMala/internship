import { DataTable, DataTableColumn } from 'mantine-datatable';
import CWInputCheckbox from '@global/component/web/cw-input-checkbox';
import { TAdminReportPermission } from '@context/domain/g01/g01-d09/local/api/helper/admin-report-permission';
import { TPagination } from '@context/domain/g01/g01-d09/local/types/pagination';
import dayjs from '@global/utils/dayjs';
import CWButton from '@global/component/web/cw-button';
import IconPen from '@core/design-system/library/component/icon/IconPen';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import {
  EAdminReportPermissionStatus as STATUS,
  EAdminReportPermissionStatusLabel as STATUS_LABEL,
} from '@domain/g01/g01-d09/local/enums/admin-permission';
import ArchiveConfirmationModal from '../../molecule/cw-m-modal-archive-confirmation';
import { SetStateAction, useState } from 'react';
import useObserverAccessStore from '@domain/g01/g01-d09/local/stores/observer-access-form';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';
import API from '@domain/g01/g01-d09/local/api';
import CWModalArchive from '@component/web/cw-modal/cw-modal-archive';
import useModal from '@global/utils/useModal';
import CWModalArchiveRecall from '@component/web/cw-modal/cw-modal-archive-recall';
import config from '@core/config';

type DataTableWithPaginationProps = {
  records: TAdminReportPermission[];
  pagination: TPagination;
  onPaginationChange: (pagination: TPagination) => void;
  handleRowSelect: (selectedRows: TAdminReportPermission) => void;
  handleRefetchData?: () => void;
  selectedRecords: TAdminReportPermission[];
  onSelectRecordsChange?: (items: TAdminReportPermission[]) => void;
  selectedAccessName?: string;
  fetching?: boolean;
};

const DataTableWithPagination = ({
  records,
  pagination,
  onPaginationChange,
  handleRefetchData,
  selectedRecords,
  onSelectRecordsChange,
  selectedAccessName,
  fetching,
}: DataTableWithPaginationProps) => {
  const navigate = useNavigate();
  const arpStore = useObserverAccessStore();

  const [isOpenArchiveModal, setIsOpenArchiveModal] = useState(false);
  const [archiveId, setArchiveId] = useState<number>();

  const [isOpenRecallModal, setIsOpenRecallModal] = useState(false);
  const [recallId, setRecallId] = useState<number>();

  const statusColors: { [key in keyof typeof STATUS_LABEL]: string } = {
    enabled: 'badge-outline-success',
    disabled: 'badge-outline-danger',
    draft: 'badge-outline-dark',
  };
  //base
  const baseColumns: DataTableColumn<(typeof records)[number]>[] = [
    {
      accessor: 'Index',
      title: '#',
      render: (_, index) => (pagination.page - 1) * pagination.limit + index + 1,
    },
    {
      accessor: 'ID',
      title: 'รหัสสิทธิ์การเข้าถึง',
      render: (record) => record.id.toString().padStart(3, '0'),
    },
    {
      accessor: 'Name',
      title: 'ชื่อสิทธิ์การใช้งาน',
      render: (record) => record.name,
    },
  ];

  const handleRecall = async () => {
    if (!recallId) return;

    try {
      await API.adminReportPermissionAPI.BulkEditAdminReportPermission([
        {
          observer_access_id: recallId,
          status: STATUS.ENABLE,
        },
      ]);
      handleRefetchData?.();
    } catch (error) {
      console.error('Error recalling:', error);
    } finally {
      setIsOpenRecallModal(false);
      setRecallId(undefined);
    }
  };

  const handleArchive = async () => {
    if (!archiveId) return;

    try {
      await API.adminReportPermissionAPI.BulkEditAdminReportPermission([
        {
          observer_access_id: archiveId,
          status: STATUS.DISABLE,
        },
      ]);
      handleRefetchData?.();
    } catch (error) {
      console.error('Error archiving:', error);
    } finally {
      setIsOpenArchiveModal(false);
      setArchiveId(undefined);
    }
  };

  const actionColumns: DataTableColumn<(typeof records)[number]>[] = [
    {
      accessor: 'EditLasted',
      title: 'แก้ไขล่าสุด',
      render: (record) =>
        record.updated_at ? dayjs(record.updated_at).format('D MMM BBBB HH:mm') : '-',
    },
    {
      accessor: 'EditedBy',
      title: 'แก้ไขล่าสุดโดย',
      render: (record) => record.updated_by ?? '-',
    },
    {
      accessor: 'Status',
      title: 'สถานะ',
      render: (record) => (
        <span
          className={cn(
            `badge font-bold`,
            statusColors[record.status] ?? 'badge-outline-info',
          )}
        >
          {STATUS_LABEL[record.status]}
        </span>
      ),
    },
    {
      accessor: 'Edit',
      title: 'แก้ไข',
      render: (record) => (
        <button
          onClick={() => {
            arpStore.updateField('id', record.id);
            navigate({
              to: '/admin/report-permission/info',
              search: (prev: any) => ({ ...prev, id: record.id }),
            });
          }}
          className="text-black hover:underline"
        >
          <IconPen />
        </button>
      ),
    },
    {
      accessor: 'Actions',
      title: 'จัดเก็บ',
      textAlign: 'center',
      render: (record) => (
        <div className="flex justify-center">
          {record.status === STATUS.DISABLE ? (
            <button
              onClick={() => {
                setRecallId(record.id);
                setIsOpenRecallModal(true);
              }}
              className=""
            >
              <IconCornerUpLeft className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                setArchiveId(record.id);
                setIsOpenArchiveModal(true);
              }}
              className=""
            >
              <IconArchive className="h-5 w-5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const getAdditionalColumns = (): DataTableColumn<(typeof records)[number]>[] => {
    switch (selectedAccessName) {
      case 'ผู้บริหาร สพป':
        return [
          {
            accessor: 'เขตตรวจ',
            title: 'เขตตรวจ',
            render: (record) => record.district_zone ?? '-',
          },
          {
            accessor: 'เขตพื้นที่',
            title: 'เขตพื้นที่',
            render: (record) => record.area_office ?? '-',
          },
        ];
      case 'ผู้บริหาร กลุ่มเขต':
        return [
          {
            accessor: 'กลุ่มเขต',
            title: 'กลุ่มเขต',
            render: (record) => record.district_group ?? '-',
          },
        ];
      case 'ผู้บริหาร เขตพื้นที่':
        return [
          {
            accessor: 'กลุ่มเขต',
            title: 'กลุ่มเขต',
            render: (record) => record.district_group ?? '-',
          },
          {
            accessor: 'เขต',
            title: 'เขต',
            render: (record) => record.area_office ?? '-',
          },
        ];
      case 'ผู้บริหารเครือโรงเรียนประเภท (สช)':
        return [
          {
            accessor: 'ประเภท',
            title: 'ประเภท',
            render: (record) => record.school_affiliation_type ?? '-',
          },
          {
            accessor: 'ชื่อสังกัด',
            title: 'ชื่อสังกัด',
            render: (record) => record.school_affiliation_name ?? '-',
          },
        ];
      case 'ผู้บริหาร เทศบาล':
        return [
          {
            accessor: 'ประเภท',
            title: 'ประเภท',
            render: (record) => record.lao_type ?? '-',
          },
          {
            accessor: 'ชื่อสังกัด',
            title: 'ชื่อสังกัด',
            render: (record) => record.school_affiliation_name ?? '-',
          },
        ];
      default:
        return [];
    }
  };

  const columns = [...baseColumns, ...getAdditionalColumns(), ...actionColumns];

  return (
    <>
      <DataTable
        className="table-hover whitespace-nowrap pt-6"
        fetching={fetching}
        records={records}
        columns={columns}
        highlightOnHover
        withTableBorder
        withColumnBorders
        height={'534px'}
        noRecordsText="ไม่พบข้อมูล"
        totalRecords={pagination.total_count}
        recordsPerPage={pagination.limit}
        page={pagination.page}
        onPageChange={(page) => onPaginationChange({ ...pagination, page })}
        onRecordsPerPageChange={(limit) =>
          onPaginationChange({ ...pagination, limit, page: 1 })
        }
        recordsPerPageOptions={config.pagination.itemPerPageOptions}
        paginationText={({ from, to, totalRecords }) =>
          `แสดงที่ ${from} ถึง ${to} จาก ${totalRecords} รายการ`
        }
        selectedRecords={selectedRecords}
        onSelectedRecordsChange={onSelectRecordsChange}
      />
      {isOpenArchiveModal && (
        <CWModalArchive
          open={isOpenArchiveModal}
          onClose={() => setIsOpenArchiveModal(false)}
          onOk={handleArchive}
        />
      )}
      {isOpenRecallModal && (
        <CWModalArchiveRecall
          open={isOpenRecallModal}
          onClose={() => setIsOpenRecallModal(false)}
          onOk={handleRecall}
        />
      )}
    </>
  );
};

export default DataTableWithPagination;
