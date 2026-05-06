import UnderlineMenu from '@domain/g05/g05-d02/g05-d02-p04-account-managment/local/component/web/molecule/cw-m-underline-menu';
import { TUnderlineMenu } from '@domain/g05/g05-d02/g05-d02-p04-account-managment/local/component/web/molecule/cw-m-underline-menu/types/underline-menu';
import { FamilyMenuProps } from '@domain/g05/g05-d02/local/types/menu-props';

type FamilyIndexMenuProps = FamilyMenuProps;

const FamilyIndexMenu = ({ initialTab = 0, onTabChange }: FamilyIndexMenuProps) => {
  const menus: TUnderlineMenu[] = [
    {
      label: 'สมาชิกครอบครัว',
      onClick: (tab) => onTabChange?.(tab),
    },
    {
      label: 'My QR Code',
      onClick: (tab) => onTabChange?.(tab),
    },
  ];

  return <UnderlineMenu tabs={menus} initialActiveTab={initialTab} />;
};

export default FamilyIndexMenu;
