import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import StudentList from '../../local/component/web/molecule/cw-m-list-student';
import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import { useNavigate } from '@tanstack/react-router';
import StoreGlobal from '@store/global';
import { useState, useEffect } from 'react';

const DomainJsx = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);
      setIsMobile(false);
      if (!isMobile) {
        StoreGlobal.MethodGet().TemplateSet(false);
        StoreGlobal.MethodGet().BannerSet(false);
        setIsMobile(true);
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  return (
    <ScreenTemplate className="items-center" header={false}>
      <span className="mt-5 text-2xl font-bold">ภาพรวม</span>
      <StudentList />
      <div className="mt-4 flex w-full justify-center">
        <FooterMenu />
      </div>
    </ScreenTemplate>
  );
};

export default DomainJsx;
