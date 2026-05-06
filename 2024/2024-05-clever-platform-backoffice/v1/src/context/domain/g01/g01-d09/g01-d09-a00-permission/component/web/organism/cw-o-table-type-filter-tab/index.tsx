import CWSwitchTabs from '@component/web/cs-switch-taps';
import {
  EAdminReportPermissionStatus as STATUS,
  EAdminReportPermissionStatusLabel as STATUS_LABEL,
} from '@domain/g01/g01-d09/local/enums/admin-permission';

type TableTypeFilterTabProps = {
  handleOnFilterChange: (tab?: STATUS) => void;
};

const TableTypeFilterTab = ({ handleOnFilterChange }: TableTypeFilterTabProps) => {
  const SwitchTabs = [
    {
      id: '1',
      label: 'ทั้งหมด',
      onClick: () => handleOnFilterChange(),
    },
    {
      id: '2',
      label: STATUS_LABEL.draft,
      onClick: () => handleOnFilterChange(STATUS.DRAFT),
    },
    {
      id: '3',
      label: STATUS_LABEL.enabled,
      onClick: () => handleOnFilterChange(STATUS.ENABLE),
    },
    {
      id: '4',
      label: STATUS_LABEL.disabled,
      onClick: () => handleOnFilterChange(STATUS.DISABLE),
    },
  ];

  return <CWSwitchTabs tabs={SwitchTabs} />;
};

export default TableTypeFilterTab;
