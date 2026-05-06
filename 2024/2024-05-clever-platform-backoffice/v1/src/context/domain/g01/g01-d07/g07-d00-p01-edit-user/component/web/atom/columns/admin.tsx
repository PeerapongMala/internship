import { DataTableColumn } from 'mantine-datatable';

import IconSearch from '@component/web/atom/wc-a-icons/IconSearch';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import { statusLabels } from '../../../../constants';
import CWModalPopup from '@context/global/component/web/cw-modal/cw-modal-popup';
import { useState } from 'react';
import { UserAccountResponse } from '@domain/g01/g01-d07/local/type';

export const getAdminColumns = (
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
    accessor: 'roles',
    title: 'ความรับผิดชอบ',
    render: (row: UserAccountResponse) => {
      const [isOpen, setIsOpen] = useState(false);

      const getRoleText = (role: number) => {
        switch (role) {
          case 1:
            return 'แอดมิน';
          case 2:
            return 'นักวิชาการ';
          case 3:
            return 'ผู้ดูแลเกม';
          default:
            return role.toString();
        }
      };

      const rolesInModal = row.roles.map(getRoleText).join(', ') || '-';

      return (
        <div>
          <button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer text-blue-600 underline hover:text-blue-600"
          >
            {row.roles.join(', ') || '-'}
          </button>

          <CWModalPopup
            open={isOpen}
            onClose={() => setIsOpen(false)}
            title="ความรับผิดชอบ"
            message={rolesInModal}
            variant="primary"
            buttonName="ปิด"
          />
        </div>
      );
    },
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
