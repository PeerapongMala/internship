import CWBreadcrumbs, { BreadcrumbItem } from '@component/web/cw-breadcrumbs';
import CWSchoolCard from '@component/web/cw-school-card';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import { ReactNode } from 'react';
import CWTitleBack from '@component/web/cw-title-back';
import { useNavigate } from '@tanstack/react-router';

type LayoutEvaluationFormProps = {
  breadCrumbs?: BreadcrumbItem[];
  subPageTitle?: string;
  titleSubPage?: string;
  children?: ReactNode;
};

const LayoutEvaluationForm = ({
  breadCrumbs,
  subPageTitle,
  children,
}: LayoutEvaluationFormProps) => {
  const navigate = useNavigate();

  const defaultBreadCrumb = [
    { label: 'การเรียนการสอน', href: '/', disabled: true },
    { label: 'ระบบตัดเกรด (ปพ.)', href: '/', disabled: true },
    { label: 'จัดการใบประเมิน', href: '/grade-system/evaluation' },
  ];

  // รองรับ breadcrumb จาก props และ map ให้เหมาะกับ <CWBreadcrumbs>
  const breadCrumbLinks =
    breadCrumbs && breadCrumbs.length > 0
      ? [...defaultBreadCrumb, ...breadCrumbs]
      : defaultBreadCrumb;

  return (
    <LayoutDefault>
      <div className="flex w-full flex-col gap-5">
        <CWBreadcrumbs showSchoolName={true} links={breadCrumbLinks} />

        {subPageTitle && (
          <CWTitleBack
            label={subPageTitle}
            onClick={() => navigate({ to: '/grade-system/evaluation' })}
          />
        )}

        <CWSchoolCard />

        {children}
      </div>
    </LayoutDefault>
  );
};

export default LayoutEvaluationForm;
