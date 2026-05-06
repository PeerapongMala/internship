import { DataTableColumn } from 'mantine-datatable';
import {
  ObserversAccountResponse,
  UserAccountResponse,
} from '@domain/g01/g01-d07/local/type';
import IconSearch from '@component/web/atom/wc-a-icons/IconSearch';
import IconArchive from '@core/design-system/library/component/icon/IconArchive';
import { statusLabels } from '../../../../constants';

import { useState } from 'react';
import CWModalPopup from '@context/global/component/web/cw-modal/cw-modal-popup';

export const getObserversColumns = (
  navigate: any,
  onArchive: (user: string) => void,
  pathname: string,
): DataTableColumn<ObserversAccountResponse>[] => [
  {
    accessor: 'id',
    title: '#',
  },
  {
    accessor: 'title',
    title: 'คำนำหน้า',
    render: (row: ObserversAccountResponse) => row.title || '-',
  },
  {
    accessor: 'first_name',
    title: 'ชื่อ',
    render: (row: ObserversAccountResponse) => row.first_name || '-',
  },
  {
    accessor: 'last_name',
    title: 'นามสกุล',
    render: (row: ObserversAccountResponse) => row.last_name || '-',
  },
  {
    accessor: 'email',
    title: 'อีเมล',
    render: (row: ObserversAccountResponse) => row.email || '-',
  },

  {
    accessor: 'roles',
    title: 'ความรับผิดชอบ',
    render: (row: ObserversAccountResponse) => {
      const [isOpen, setIsOpen] = useState(false);
      const accessNames = row.observer_accesses.map((access) => access.name);

      if (accessNames.length <= 1) {
        return accessNames.join(', ') || '-';
      }

      return (
        <div>
          <button
            onClick={() => setIsOpen(true)}
            className="max-w-40 cursor-pointer truncate text-blue-600 underline hover:text-blue-600"
          >
            {accessNames.join(', ')}
          </button>

          <CWModalPopup
            open={isOpen}
            onClose={() => setIsOpen(false)}
            title="ความรับผิดชอบ"
            message={accessNames.join(', ')}
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
    render: (row: ObserversAccountResponse) => {
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
    render: (row: ObserversAccountResponse) => (
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
    render: (row: ObserversAccountResponse) => (
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
