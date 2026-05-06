import IconClose from '@core/design-system/library/component/icon/IconClose';
import { TResponsiblePersonData } from '@domain/g06/g06-d02/local/types/grade';
import { DataTableColumn, DataTable } from 'mantine-datatable';
import { useMemo } from 'react';

type ResponsibleTableProps = {
  onRemove?: (removedPersonID: string) => void;
  persons: TResponsiblePersonData[];
};

const ResponsibleTable = ({ onRemove, persons }: ResponsibleTableProps) => {
  const columnDefs = useMemo<DataTableColumn<TResponsiblePersonData>[]>(() => {
    const columns: (DataTableColumn<TResponsiblePersonData> | undefined)[] = [
      {
        accessor: '#',
        title: '#',
        render: (_, i) => {
          return <span>{i + 1}</span>;
        },
      },
      {
        accessor: 'user_id',
        title: 'รหัสบัญชี',
        render: (record) => {
          return record.user_id;
        },
      },
      {
        accessor: 'prefix',
        title: 'คำนำหน้า',
        render: (record) => {
          return record.title;
        },
      },
      {
        accessor: 'firstName',
        title: 'ชื่อ',
        render: (record) => {
          return record.first_name;
        },
      },
      {
        accessor: 'lastName',
        title: 'สกุล',
        render: (record) => {
          return record.last_name;
        },
      },
      {
        accessor: 'email',
        title: 'อีเมล',
        render: (record) => {
          return record.email;
        },
      },
      {
        accessor: 'access_type',
        title: 'สิทธิ์การเข้าถึง',
        render: ({ teacher_roles }) => {
          const roleMapping: Record<number, string> = {
            1: 'ผู้ดูแลระบบตัดเกรด',
            2: 'กรอกคะแนน',
            3: 'ตัดเกรด',
          };

          if (!Array.isArray(teacher_roles)) return '-';

          const validRoles = [1, 2, 3].filter((roleId) => teacher_roles.includes(roleId));

          const displayRoles = validRoles.map((roleId) => roleMapping[roleId]);

          return displayRoles.length > 0
            ? displayRoles.join(', ')
            : 'ไม่มีหน้าที่รับผิดชอบ';
        },
      },
      onRemove && {
        accessor: 'remove',
        title: 'ลบออก',
        render: (record) => {
          return (
            <button type="button" onClick={() => onRemove?.(record.user_id)}>
              <IconClose />
            </button>
          );
        },
      },
    ];

    return columns.filter((item) => !!item);
  }, [onRemove, persons]);

  return (
    <DataTable
      idAccessor="user_id"
      minHeight={200}
      records={persons}
      columns={columnDefs}
      noRecordsText="ไม่มีหน้าที่รับผิดชอบ"
    />
  );
};

export default ResponsibleTable;
