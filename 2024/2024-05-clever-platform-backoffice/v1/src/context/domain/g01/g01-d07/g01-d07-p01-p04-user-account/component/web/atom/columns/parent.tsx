import { DataTableColumn } from 'mantine-datatable';
import { UserAccountResponse } from '../../../../../local/type';
import IconSearch from '@component/web/atom/wc-a-icons/IconSearch';
import { statusLabels } from '../../../../constants';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import IconCornerUpLeft from '@core/design-system/library/component/icon/IconCornerUpLeft';

export const getParentColumns = (
  navigate: any,
  onArchive: (user: string) => void,
  onOpen: (user: string) => void,
): DataTableColumn<UserAccountResponse>[] => [
  {
    accessor: 'index',
    title: '#',
    render: (record, index) => {
      return index + 1;
    },
  },
  {
    accessor: 'id',
    title: 'รหัสบัญชี',
  },
  {
    accessor: 'title',
    title: 'คำนำหน้า',
    render: (row: UserAccountResponse) => row.title || '-',
  },
  {
    accessor: 'first_name',
    title: 'ชื่อ',
    render: (row: UserAccountResponse) => row.first_name || '-',
  },
  {
    accessor: 'last_name',
    title: 'นามสกุล',
    render: (row: UserAccountResponse) => row.last_name || '-',
  },
  {
    accessor: 'email',
    title: 'อีเมล',
    render: (row: UserAccountResponse) => row.email || '-',
  },
  {
    accessor: 'line_id',
    title: 'LINE ID',
    render: (row: UserAccountResponse) => row.line_user_id || '-',
  },
  {
    accessor: 'status',
    title: 'เปิดใช้งาน',
    render: (row: UserAccountResponse) => {
      const statusText = row.status.toLowerCase();
      const badgeClass =
        statusText === 'enabled'
          ? 'badge-outline-success'
          : statusText === 'disabled'
            ? 'badge-outline-danger'
            : 'badge-outline-dark';
      return (
        <span className={`badge ${badgeClass} flex w-16 items-center justify-center`}>
          {statusLabels[statusText] || statusLabels['draft']}
        </span>
      );
    },
  },
  {
    accessor: 'last_login',
    title: 'ใช้งานล่าสุด',
    render: (row: UserAccountResponse) => {
      return row.last_login
        ? new Date(row.last_login).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
        : '-';
    },
  },
  {
    accessor: 'actions',
    title: 'ดูข้อมูล',
    render: (row: UserAccountResponse) => (
      <button
        type="button"
        className="w-2 whitespace-nowrap !px-2"
        onClick={() => navigate({ to: `${location.pathname}/parent/${row.id}` })}
      >
        <IconSearch />
      </button>
    ),
  },
  {
    accessor: 'actions',
    title: 'ปิดบัญชี',
    render: (row: UserAccountResponse) =>
      row.status === 'enabled' ? (
        <button
          type="button"
          className="w-2 whitespace-nowrap !px-2"
          onClick={() => onArchive(row.id)}
        >
          <IconArchive />
        </button>
      ) : (
        <button
          type="button"
          className="w-2 whitespace-nowrap !px-2"
          onClick={() => onOpen(row.id)}
        >
          <IconCornerUpLeft />
        </button>
      ),
  },
];
