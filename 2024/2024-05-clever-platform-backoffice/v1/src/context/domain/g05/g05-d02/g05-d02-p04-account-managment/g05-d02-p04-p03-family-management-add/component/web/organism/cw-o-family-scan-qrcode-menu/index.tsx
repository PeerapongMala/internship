import UnderlineMenu from '@domain/g05/g05-d02/g05-d02-p04-account-managment/local/component/web/molecule/cw-m-underline-menu';
import { TUnderlineMenu } from '@domain/g05/g05-d02/g05-d02-p04-account-managment/local/component/web/molecule/cw-m-underline-menu/types/underline-menu';
import { useNavigate } from '@tanstack/react-router';

type FamilyMenuProps = {
  activeTab?: 0 | 1;
};

const FamilyScanQRMenu = ({ activeTab = 1 }: FamilyMenuProps) => {
  const navigate = useNavigate();

  const menus: TUnderlineMenu[] = [
    {
      label: 'สมาชิกครอบครัว',
      onClick: () => navigate({ to: '/line/parent/management' }),
    },
    {
      label: 'Scan QR Code',
      onClick: () => navigate({ to: '/line/parent/manahement/add' }),
    },
  ];

  return <UnderlineMenu tabs={menus} initialActiveTab={activeTab} />;
};

export default FamilyScanQRMenu;
