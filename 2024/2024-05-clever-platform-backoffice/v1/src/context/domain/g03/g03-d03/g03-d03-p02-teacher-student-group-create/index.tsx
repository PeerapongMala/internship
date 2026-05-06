import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import Breadcrumbs from '@component/web/atom/Breadcums';
import CWTitleBack from '@component/web/cw-title-back';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import StoreGlobal from '@global/store/global';
import TeacherStudentGroupInfo from '@domain/g03/g03-d03/g03-d03-p02-teacher-student-group-create/component/web/template/Info';
import ConfigJson from './config/index.json';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <>
      <LayoutDefault>
        <CWBreadcrumbs
          links={[
            {
              label: 'การเรียนการสอน',
              href: '/',
              disabled: true,
            },
            {
              label: 'กลุ่มเรียน',
              href: '/teacher/student-group',
            },
            {
              label: 'เพิ่มกลุ่มเรียน',
              href: '/',
            },
          ]}
        />
        <div className="w-full">
          <div className="my-7">
            <CWTitleBack label="กลุ่มเรียน" href="/teacher/student-group" />
          </div>
        </div>
        <TeacherStudentGroupInfo />
      </LayoutDefault>
    </>
  );
};

export default DomainJSX;
