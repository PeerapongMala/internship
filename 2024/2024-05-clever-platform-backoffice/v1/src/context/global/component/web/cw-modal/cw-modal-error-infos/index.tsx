import { DataTable, DataTableColumn } from 'mantine-datatable';
import CWModalCustom, { ModalPopupProps } from '../cw-modal-custom';
import { TErrorInfos, TModalErrorInfosOptions } from './type';

type ModalErrorInfosProps = TModalErrorInfosOptions &
  ModalPopupProps & {
    errorLists: TErrorInfos[];
  };

// million-ignore
const ModalErrorInfos = ({
  errorLists,
  contextTitle,
  messageTitle,
  ...props
}: ModalErrorInfosProps) => {
  const columns: DataTableColumn<TErrorInfos>[] = [
    {
      accessor: 'index',
      title: contextTitle ?? 'ลำดับ',
      render: (_, index) => index + 1,
    },
    {
      accessor: 'context',
      title: messageTitle ?? 'หัวข้อ',
    },
    {
      accessor: 'message',
      title: <span className="text-red-500"> ปัญหาที่พบ </span>,
    },
  ];

  // The number of items to show before scrolling
  const scrollThreshold = 5;

  // Calculate the fixed height
  const rowHeight = 50;
  const headerHeight = 50;
  const tableHeight = scrollThreshold * rowHeight + headerHeight;

  return (
    <CWModalCustom className="w-fit max-w-[80%]" {...props}>
      <DataTable
        idAccessor={({ context, message }) =>
          `${context?.toString()}-${message?.toString()}`
        }
        height={errorLists.length > scrollThreshold ? tableHeight : 'auto'}
        columns={columns}
        records={errorLists}
      />
    </CWModalCustom>
  );
};

export default ModalErrorInfos;
