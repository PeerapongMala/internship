import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import AnnouncementDetailTemplate from './component/web/template/cw-t-announcement-detail';
import { useNavigate, useParams } from '@tanstack/react-router';
import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';
import { useEffect, useState } from 'react';
import StoreGlobal from '@store/global';

const DomainJsx = () => {
  const { announcementId } = useParams({
    from: '/line/parent/clever/announcement/student/$user_id/announcement/$announcementId',
  });
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
    <ScreenTemplate className="items-center" headerTitle="ประกาศ" header={false}>
      {/* <CWBreadcrumbs links={[{ label: 'การเรียนการสอน' }, { label: 'จัดการประกาศ' }]} /> */}
      <AnnouncementDetailTemplate announcementId={announcementId} />
      <FooterMenu />
    </ScreenTemplate>
  );
};

export default DomainJsx;
