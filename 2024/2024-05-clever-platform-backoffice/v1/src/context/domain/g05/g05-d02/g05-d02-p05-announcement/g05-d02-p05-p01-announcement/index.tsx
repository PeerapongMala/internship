import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import AnnouncementListTemplate from './component/web/template/cw-t-announcement-list';
import { useEffect, useState } from 'react';
import { TPagination } from '../../local/types';
import ScreenTemplate from '@domain/g05/local/component/web/template/cw-t-line-layout';
import { TAnnouncement } from '../../local/types/announcement';
import API from '../../local/api';
import { useNavigate, useParams } from '@tanstack/react-router';
import StoreGlobal from '@store/global';
import usePagination from '@global/hooks/usePagination';

const DomainJsx = () => {
  const searchParam: {
    user_id: string;
  } = useParams({ strict: false });
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
  const { pagination, setPagination } = usePagination();
  const [announcements, setAnnouncements] = useState<TAnnouncement[]>([]);

  useEffect(() => {
    fetchAnnouncementList();
  }, [pagination.page, pagination.limit]);

  const fetchAnnouncementList = async () => {
    const user_id = searchParam.user_id;

    if (!user_id) return;

    const response = await API.Announcement.GetAnnouncementList({
      user_id: user_id,
      page: pagination.page,
      limit: pagination.limit,
    });

    setAnnouncements(response.data.data);
    setPagination((prev) => ({
      ...prev,
      total_count: response.data._pagination.total_count,
    }));
  };

  return (
    <ScreenTemplate className="items-center" headerTitle="ประกาศ" header={false}>
      {/* <CWBreadcrumbs links={[{ label: 'การเรียนการสอน' }, { label: 'จัดการประกาศ' }]} /> */}

      {searchParam.user_id ? (
        <AnnouncementListTemplate
          announcements={announcements}
          pagination={pagination}
          setPagination={setPagination}
        />
      ) : (
        <div className="text-red-500">ไม่พบข้อมูล</div>
      )}

      <FooterMenu />
    </ScreenTemplate>
  );
};

export default DomainJsx;
