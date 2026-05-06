import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWTitleBack from '@component/web/cw-title-back';
import StoreGlobal from '@store/global';
import { useEffect } from 'react';

const SchoolStatRootTemplate: React.FC<
  React.PropsWithChildren<{ children: any; showBackButton: boolean }>
> = ({ children, showBackButton }) => {
  // Sidebar
  useEffect((): void => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <CWBreadcrumbs
        links={[
          {
            label: 'รายงาน',
            href: '/',
            disabled: true,
          },
          {
            label: 'รายงานระดับโรงเรียน',
            href: 'admin/report/school-stat',
          },
        ]}
      />

      <div className="flex flex-row">
        {showBackButton ? (
          <CWTitleBack label="รายงานระดับโรงเรียน" href="../.." />
        ) : (
          <div className="flex gap-4">
            <p className="text-[26px] font-bold">รายงานระดับโรงเรียน</p>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default SchoolStatRootTemplate;
