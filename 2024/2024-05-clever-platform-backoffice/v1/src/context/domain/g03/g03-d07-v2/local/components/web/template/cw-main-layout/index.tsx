import { ReactNode, useNavigate } from '@tanstack/react-router';

import { useEffect } from 'react';
import StoreGlobal from '@global/store/global';
import CWTitleGroup from '@component/web/cw-title-group';
import CWWhiteBox from '@component/web/cw-white-box';
import StoreGlobalPersist from '@store/global/persist';
import CWMTab from '@component/web/molecule/cw-m-tab';
import { Curriculum } from '@domain/g02/g02-d01/local/type';
import CWButton from '@component/web/cw-button';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import { CWMBreadcrumbItems } from '@component/web/molecule/cw-m-breadcrumb';

export interface MainLayoutProps {
  children: ReactNode;
  breadcrumbItems: {
    href?: string;
    label: string;
    disabled?: boolean;
  }[];
  buttonCreate?: { icon?: React.ReactNode; title: string; onClick?: () => void };
  title: string;
}

const CWMainLayout = ({
  children,
  breadcrumbItems,
  title,
  buttonCreate,
}: MainLayoutProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const tabs = [
    {
      name: 'แลกรางวัล',
      to: '/teacher/reward',
      state: { from: '/teacher/reward' },
      checkActiveUrl: '/teacher/reward',
    },
    {
      name: 'รางวัลฟรี',
      to: '/teacher/reward/free',
      state: { from: '/teacher/reward/free' },
      checkActiveUrl: '/teacher/reward/free',
    },
    {
      name: 'รางวัลในร้านค้า',
      to: '/teacher/reward/store/coupon',
      state: { from: '/teacher/reward/store/coupon' },
      checkActiveUrl: '/teacher/reward/store/coupon',
    },
  ];

  return (
    <div className="flex flex-col gap-y-4 px-4 md:gap-y-6 md:px-0">
      <CWBreadcrumbs links={breadcrumbItems} />

      <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="break-words text-xl font-bold md:text-2xl">{title}</h1>
        {buttonCreate && (
          <CWButton
            title={buttonCreate.title}
            onClick={buttonCreate.onClick}
            icon={buttonCreate.icon}
            className="w-full md:w-auto"
          />
        )}
      </div>

      <div className="overflow-x-auto">
        <CWMTab tabs={tabs} />
      </div>

      <div className="w-full overflow-x-auto">{children}</div>
    </div>
  );
};

export default CWMainLayout;
