// import { useTranslation } from 'react-i18next';
import MockActivityThumbnail from '@asset/mock-activity.jpg';
import StoreGlobal from '@global/store/global';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import IconSearch from '@core/design-system/library/vristo/source/components/Icon/IconSearch';
// import API from '../local/api';
import SidePanel from '../local/components/organisms/Sidepanel';

import SelectLesson from './components/template/SelectLesson';
import Breadcrumbs from '@core/design-system/library/component/web/Breadcrumbs';
import TitleBack from '@core/design-system/library/component/web/TitleBack';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';

// ปัญหารูป Thjumbnail
const DomainJSX = () => {
  // const { subjectId } = useParams()

  const navigate = useNavigate();
  // useEffect(() =>{
  //     API.Subject.SubjectAll.Get()
  //     .then((res) => {
  //         return res.json();
  //       })
  //       .then((data) => {
  //         setDataSubject(data);
  //       })
  //       .catch((err) => console.error(err));
  // },[])

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);

      // ถ้าต้องการ redirect ในกรณีเฉพาะ
      if (isMobile && window.location.pathname !== '/teacher/homework/homework') {
        navigate({ to: '/teacher/homework/homework' });
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);
  let time = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
  const byAdmin = 'Admin GM';
  const handleClick = () => {
    alert('Click');
  };
  const userId = '0000001';

  return (
    <div className="w-full">
      <Breadcrumbs
        links={[
          { label: 'เกี่ยวกับหลักสูตร', href: '#' },
          { label: 'การบ้าน', href: '#' },
        ]}
      />
      <div className="my-5 flex items-center gap-3">
        <TitleBack label="แก้ไขการบ้าน" href="../../" />
      </div>
      <div className="mt-5 flex w-full gap-5">
        {/* Tabs */}
        <div className="w-[75%]">
          {/* Content */}
          <div className="w-full">
            <SelectLesson />
          </div>
        </div>
        <SidePanel
          userId={userId}
          time={time}
          byAdmin={byAdmin}
          onClick={handleClick}
          titleName="รหัสการบ้าน"
        />
      </div>
      <div className="mt-4 flex justify-center">
        <FooterMenu />
      </div>
    </div>
  );
};

export default DomainJSX;
