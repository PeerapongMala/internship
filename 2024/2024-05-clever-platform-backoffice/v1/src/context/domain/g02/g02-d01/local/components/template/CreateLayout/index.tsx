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
import StoreGlobalPersist from '@store/global/persist';
import { Curriculum } from '../../../type';
import CWBreadcrumbs, { BreadcrumbItem } from '@component/web/cw-breadcrumbs';

export interface CreateLayoutProps {
  children: ReactNode;
  breadcrumbItems: BreadcrumbItem[];
  tabIndex?: number;
  title?: string;
}

const CreateLayout = ({ children, breadcrumbItems, title }: CreateLayoutProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  const { curriculumData }: { curriculumData: Curriculum } = StoreGlobalPersist.StateGet([
    'curriculumData',
  ]);

  return (
    <div className="flex flex-col gap-y-6">
      <CWBreadcrumbs links={breadcrumbItems} />
      <CWTitleGroup
        listText={[
          'สังกัดของฉัน',
          `${curriculumData.name} (${curriculumData.short_name})`,
        ]}
      />

      <div>{children}</div>
    </div>
  );
};

export default CreateLayout;
