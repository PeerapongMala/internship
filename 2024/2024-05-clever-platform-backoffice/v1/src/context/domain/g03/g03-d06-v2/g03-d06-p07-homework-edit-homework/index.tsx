// import { useTranslation } from 'react-i18next';
import MockActivityThumbnail from '@asset/mock-activity.jpg';
import StoreGlobal from '@global/store/global';
import { Link, useNavigate, useLocation, useSearch } from '@tanstack/react-router';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import SidePanel from '../local/components/organisms/Sidepanel';
import Checkbox from '../local/components/organisms/Checkbox';
// import API from '../local/api';
import InfoHomework from './components/web/template/InfoHomework';
import SentHomework from './components/web/template/SentHomework';
import CWTitleBack from '@component/web/cw-title-back';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import CWNeutralBox from '@component/web/cw-neutral-box';
import { IUserData } from '@domain/g00/g00-d00/local/type';
import StoreGlobalPersist from '@store/global/persist';
import { getUserData } from '@global/utils/store/getUserData';
import { getUserSubjectData } from '@global/utils/store/user-subject';
import ModalContactAdminForSubject from '@component/web/cw-modal/cw-modal-contact-admin-for-subject';

// ปัญหารูป Thjumbnail
const DomainJSX = () => {
  const userData = getUserData();

  if (!userData.is_subject_teacher) {
    return <ModalContactAdminForSubject />;
  }

  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const schoolId = userData.school_id;
  const { curriculum_group_name, started_at, due_at, close_at, lesson_name } = search;

  const { year_id, id: subject_id, name: subject_name, year_name } = getUserSubjectData();

  const handleBack = () => {
    navigate({ to: '/homework/homework' });
  };

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth < 768;
      StoreGlobal.MethodGet().TemplateSet(!isMobile);
      StoreGlobal.MethodGet().BannerSet(!isMobile);

      if (isMobile && window.location.pathname !== '/line/teacher/homework/homework') {
        navigate({ to: '/line/teacher/homework/homework' });
      }
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  const [activeTablist, setActiveTablist] = useState('0');

  return (
    <div className="w-full">
      <div className="flex w-full">
        <div>
          <CWBreadcrumbs
            links={[
              { label: 'การเรียนการสอน', href: '#' },
              { label: 'การบ้าน', href: '#' },
            ]}
          />
          <div className="my-8 flex items-center gap-5">
            <CWTitleBack
              label="ดูการบ้าน"
              href={`../../?subject_name=${subject_name}&curriculum_group_name=${curriculum_group_name}&year_name=${year_name}&subject_id=${subject_id}&year_id=${year_id}`}
            />
          </div>
        </div>
      </div>

      <CWNeutralBox>
        <div className="flex">
          <h1 className="text-[24px] font-bold">
            {subject_name} / {year_name} / {lesson_name}
          </h1>
        </div>
        <div className="mt-3 flex flex-row gap-2">
          <p>
            วันที่สั่งการบ้าน:{' '}
            {new Date(started_at).toLocaleDateString('th-TH', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
          <p>
            วันที่ส่งการบ้าน:{' '}
            {new Date(due_at).toLocaleDateString('th-TH', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
          <p>
            วันที่ปิดการบ้าน:{' '}
            {new Date(close_at).toLocaleDateString('th-TH', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      </CWNeutralBox>

      <div className="">
        <div className="mt-5 w-full">
          {/* Tabs */}
          <div className="flex bg-white shadow-sm">
            <button
              onClick={() => setActiveTablist('0')}
              className={`px-5 py-1 text-[14px] text-black ${activeTablist === '0' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
            >
              ข้อมูลการบ้าน
            </button>
            <button
              onClick={() => setActiveTablist('1')}
              className={`px-5 py-1 text-black ${activeTablist === '1' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
            >
              ข้อมูลการส่งการบ้าน
            </button>
          </div>

          {/* Content */}
          <div className="mt-5 w-full">
            {activeTablist === '0' ? (
              <InfoHomework />
            ) : (
              <SentHomework schoolID={schoolId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;
