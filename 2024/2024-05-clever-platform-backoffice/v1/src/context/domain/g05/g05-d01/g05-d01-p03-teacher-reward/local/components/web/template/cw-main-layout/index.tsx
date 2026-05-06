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
import FooterMenu from '@domain/g05/g05-d01/local/component/web/organism/cw-o-footer-menu';
import LineLiffPage from '@domain/g05/g05-d01/local/component/web/template/cw-t-lineliff-page';
import CWSchoolCard from '@component/web/cw-school-card';

export interface MainLayoutProps {
  children: ReactNode;
  breadcrumbItems: {
    href?: string;
    label: string;
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
      to: '/line/teacher/reward',
      state: { from: '/line/teacher/reward' },
      checkActiveUrl: '/line/teacher/reward',
    },
    {
      name: 'รางวัลฟรี',
      to: '/line/teacher/reward/free',
      state: { from: '/line/teacher/reward/free' },
      checkActiveUrl: '/line/teacher/reward/free',
    },
    {
      name: 'รางวัลในร้านค้า',
      to: '/line/teacher/reward/store/coupon',
      state: { from: '/line/teacher/reward/store/coupon' },
      checkActiveUrl: '/line/teacher/reward/store/coupon',
    },
  ];

  return (
    <LineLiffPage className="mb-28">
      <CWSchoolCard className="w-full" />
      <div className="flex flex-col gap-y-4 md:gap-y-6 md:px-0">
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
        <FooterMenu />
      </div>
    </LineLiffPage>
  );
};

export default CWMainLayout;
