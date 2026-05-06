import { ReactNode, useNavigate } from '@tanstack/react-router';
import LayoutDefault from '@core/design-system/library/vristo/component/layout/default';
import CWMBreadcrumb, {
  CWMBreadcrumbItems,
} from '@component/web/molecule/cw-m-breadcrumb';
import CWMTabs from '@component/web/molecule/cw-n-tabs';
import WCABox from '@component/web/atom/wc-a-box';
import { useEffect } from 'react';
import StoreGlobal from '@global/store/global';
import CWTitleGroup from '@component/web/cw-title-group';
import CWWhiteBox from '@component/web/cw-white-box';
import StoreGlobalPersist from '@store/global/persist';
import { Curriculum } from '../../../type';
import CWBreadcrumbs, { BreadcrumbItem } from '@component/web/cw-breadcrumbs';

export interface MainLayoutProps {
  children: ReactNode;
  breadcrumbItems: BreadcrumbItem[];
  tabIndex: number;
  title: string;
}

const MainLayout = ({ children, breadcrumbItems, tabIndex, title }: MainLayoutProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);

  const listTab = [
    'กลุ่มสาระการเรียนรู้',
    'สาระ',
    'มาตรฐาน',
    'สาระการเรียนรู้',
    'ตัวชี้วัด / ผลการเรียนรู้',
  ];

  const onClickTab = (index: number) => {
    switch (index) {
      case 0:
        navigate({ to: '/content-creator/standard/learning-area' });
        break;
      case 1:
        navigate({ to: '/content-creator/standard/content' });
        break;
      case 2:
        navigate({ to: '/content-creator/standard/standard' });
        break;
      case 3:
        navigate({ to: '/content-creator/standard/learning-content' });
        break;
      default:
        navigate({ to: '/content-creator/standard/indicator' });
    }
  };

  return (
    <div className="flex flex-col gap-y-6">
      <CWBreadcrumbs links={breadcrumbItems} />
      <CWTitleGroup
        listText={[
          'สังกัดของฉัน',
          `${curriculumData.name} (${curriculumData.short_name})`,
        ]}
      />
      <p className="text-2xl font-bold">{title}</p>
      <CWMTabs {...{ currentIndex: tabIndex, items: listTab, onClick: onClickTab }} />
      <CWWhiteBox>{children}</CWWhiteBox>
    </div>
  );
};

export default MainLayout;
