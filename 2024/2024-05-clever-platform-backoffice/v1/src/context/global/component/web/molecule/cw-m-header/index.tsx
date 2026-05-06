import path from 'path';
import { useTranslation } from 'react-i18next';

import StoreGlobal from '../../../../store/global';
import CWMHeaderResponsiveFreesize from './responsive/freesize';
import CWMHeaderResponsiveMobile from './responsive/mobile';

const CWMHeader = () =>
  // props: { children?: React.ReactNode }

  {
    const { t, i18n } = useTranslation(['global']);

    const menuList: { name: string; path: string }[] = [
      {
        name: t('header.menu.privileges'),
        path: '/privileges',
      },
      {
        name: t('header.menu.memberGetMember'),
        path: '/member-get-member',
      },
      {
        name: t('header.menu.britaniaActivity'),
        path: '/britania-activity',
      },
      {
        name: t('header.menu.about'),
        path: '/about',
      },
      {
        name: t('header.menu.contact'),
        path: '/contact',
      },
    ];
    const { responsiveEvent } = StoreGlobal.StateGet(['responsiveEvent']);
    return (
      <header>
        {responsiveEvent.mobileIs ? (
          <CWMHeaderResponsiveMobile menuList={menuList} />
        ) : (
          <CWMHeaderResponsiveFreesize menuList={menuList} />
        )}
      </header>
    );
  };

export default CWMHeader;
