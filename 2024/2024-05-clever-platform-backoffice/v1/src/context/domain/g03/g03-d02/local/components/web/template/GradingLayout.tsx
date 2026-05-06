import { ReactNode } from '@tanstack/react-router';
import LayoutDefault from '@core/design-system/library/vristo/component/layout/default';
import CWMBreadcrumb, {
  CWMBreadcrumbItems,
} from '@component/web/molecule/cw-m-breadcrumb';
import CWMSchoolCard, {
  CWMSchoolCardProps,
} from '@component/web/molecule/cw-m-school-card';
import CWMTabs, { CWMTabsProps } from '@component/web/molecule/cw-n-tabs';
import WCABox from '@component/web/atom/wc-a-box';

export interface GradingContainerProps {
  children: ReactNode;
  breadcrumbItems: CWMBreadcrumbItems[];
  schoolCard: CWMSchoolCardProps;
  tabs: CWMTabsProps;
  title: string;
}

const GradingContainer = ({
  children,
  breadcrumbItems,
  schoolCard,
  tabs,
  title,
}: GradingContainerProps) => {
  return (
    <LayoutDefault>
      <div className="flex flex-col gap-y-6">
        <CWMBreadcrumb items={breadcrumbItems} />
        <CWMSchoolCard {...schoolCard} />
        <p className="text-2xl font-semibold">{title}</p>
        <CWMTabs {...tabs} />
        <WCABox>{children}</WCABox>
      </div>
    </LayoutDefault>
  );
};

export default GradingContainer;
