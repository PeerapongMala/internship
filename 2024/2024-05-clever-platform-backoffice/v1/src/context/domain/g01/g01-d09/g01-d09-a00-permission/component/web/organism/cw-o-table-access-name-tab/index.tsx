import CWSwitchTabs from '@component/web/cs-switch-taps';
import {
  ADMINISTRATIVE_ROLES,
  getAdministrativeRole,
  getAdministrativeRoleInThai,
} from '@domain/g01/g01-d09/local/helpers/admin-report-permission';
import React from 'react';

type AccessNameTabProps = {
  handleAccessNameChange?: (value: string) => void;
};

const AccessNameTab: React.FC<AccessNameTabProps> = ({ handleAccessNameChange }) => {
  const SwitchTabs = Object.keys(ADMINISTRATIVE_ROLES).map((key, i) => {
    return {
      id: (i + 1).toString(),
      label: getAdministrativeRoleInThai(key as keyof typeof ADMINISTRATIVE_ROLES),
      onClick: () =>
        handleAccessNameChange?.(
          getAdministrativeRole(key as keyof typeof ADMINISTRATIVE_ROLES),
        ),
    };
  });

  const firstTab = {
    id: '0',
    label: 'ทั้งหมด',
    onClick: () => handleAccessNameChange?.(''),
  };
  return <CWSwitchTabs tabs={[firstTab, ...SwitchTabs]} />;
};

export default AccessNameTab;
