import { DataTableColumn } from 'mantine-datatable';
import { UserAccountResponse } from '@domain/g01/g01-d07/local/type';

import IconSearch from '@component/web/atom/wc-a-icons/IconSearch';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import { statusLabels } from '../../../../constants/index';

export const getContentCreatorColumns = (
  navigate: any,
  onArchive: (user: string) => void,
  pathname: string,
): DataTableColumn<UserAccountResponse>[] => [
  {
    accessor: 'id',
    title: '#',
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
    accessor: 'status',
    title: 'เปิดใช้งาน',
    render: (row: any) => {
      const statusText = row.status.toLowerCase();
      const badgeClass =
        statusText === 'enabled'
          ? 'badge-outline-success'
          : statusText === 'disabled'
            ? 'badge-outline-danger'
            : 'badge-outline-secondary';
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
        onClick={() =>
          navigate({
            to: `${location.pathname}/${row.id}`,
          })
        }
      >
        <IconSearch />
      </button>
    ),
  },
  {
    accessor: 'actions',
    title: 'เปลี่ยนรหัสผ่าน',
    render: (row: UserAccountResponse) => (
      <button
        type="button"
        className="w-2 whitespace-nowrap !px-2"
        onClick={() =>
          navigate({
            to: `${location.pathname}/${row.id}`,
          })
        }
      >
        <IconSearch />
      </button>
    ),
  },
  {
    accessor: 'actions',
    title: 'ปิดบัญชี',
    render: (row: UserAccountResponse) => (
      <button
        type="button"
        className="w-2 whitespace-nowrap !px-2"
        onClick={() => onArchive(row.id)}
      >
        <IconArchive />
      </button>
    ),
  },
];
