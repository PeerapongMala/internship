import { useEffect } from 'react';
import CWBreadcrumbs from '@global/component/web/cw-breadcrumbs';
import CWTitleBack from '@global/component/web/cw-title-back';
import StoreGlobal from '@store/global';
import { useNavigate } from '@tanstack/react-router';
import IconArrowBackward from '@core/design-system/library/component/icon/IconArrowBackward';

interface ReportPermissionHeaderProp {
  href?: string;
}
const ReportPermissionHeader = ({ href }: ReportPermissionHeaderProp) => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);
  const navigate = useNavigate();
  return (
    <>
      <CWBreadcrumbs
        links={[
          { label: 'สำหรับแอดมิน', href: '#' },
          { label: 'แก้ไขสิทธิ์การเข้าถึง', href: '#' },
        ]}
      />
      <div className="flex gap-5">
        {/* <CWTitleBack label="แก้ไขสิทธิ์การเข้าถึง" href="/admin/report-permission" /> */}
        {href && (
          <button
            onClick={() => {
              navigate({ to: `${href}` });
            }}
          >
            <IconArrowBackward />
          </button>
        )}

        <h1 className="flex items-center justify-center text-[26px] font-bold">
          แก้ไขสิทธิ์การเข้าถึง
        </h1>
      </div>
    </>
  );
};

export default ReportPermissionHeader;
