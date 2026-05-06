import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import StoreGlobal from '@store/global';
import IconUser from '@core/design-system/library/component/icon/IconUser';
import IconError from '@core/design-system/library/component/icon/IconError';
import IconLogout from '@core/design-system/library/vristo/source/components/Icon/IconLogout';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@store/global/persist';

const DomainJsx = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const mobile = window.innerWidth <= 768;
      StoreGlobal.MethodGet().TemplateSet(!mobile);
      StoreGlobal.MethodGet().BannerSet(!mobile);
      setIsMobile(mobile);
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const handleLogout = () => {
    (StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']).clearAll();
    sessionStorage.clear();
    navigate({ to: '/line/connect/login-student', search: { logged_out: true } });
  };

  return (
    <ScreenTemplate
      className="mb-24 items-center"
      headerTitle="ตั้งค่า"
      header={false}
      bg_white={isMobile}
      footer={isMobile}
    >
      <div className="mb-5 mt-5 flex w-full flex-col">
        <div className="relative flex items-center justify-center md:mt-0 md:justify-start">
          <p className="text-2xl font-bold md:ml-10">ตั้งค่า</p>
        </div>

        <div className="mt-6 flex w-full flex-col divide-y">
          <div
            onClick={() => navigate({ to: '/line/student/clever/bug-report' })}
            className="flex cursor-pointer items-center gap-3 px-6 py-4 text-gray-700 hover:bg-gray-100"
          >
            <IconError className="h-5 w-5" />
            <span>รายงานปัญหา</span>
          </div>
          <div
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-50"
          >
            <IconLogout className="h-5 w-5" />
            <span>ออกจากระบบ</span>
          </div>
        </div>

        <div className="mt-4 flex w-full justify-center">
          <FooterMenu />
        </div>
      </div>
    </ScreenTemplate>
  );
};

export default DomainJsx;
