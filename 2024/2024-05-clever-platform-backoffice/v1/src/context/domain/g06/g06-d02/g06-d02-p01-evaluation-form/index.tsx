import StoreGlobal from '@global/store/global';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import CWSchoolCard from '@component/web/cw-school-card';
import CWBreadcrumbs from '@component/web/cw-breadcrumbs';
import EvaluatePanel from './component/web/template/cw-t-evaluation-panel';
import { getUserData } from '@global/utils/store/getUserData';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const userData = getUserData();

  const schoolID: string = userData?.school_id;

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <LayoutDefault>
      <CWBreadcrumbs
        showSchoolName={true}
        links={[
          { label: 'การเรียนการสอน', href: '/', disabled: true },
          { label: 'ระบบตัดเกรด (ปพ.)', href: '/', disabled: true },
          { label: 'จัดการ Template ตัดเกรด', href: '/grade-system/evaluation' },
        ]}
      />
      <CWSchoolCard className="mt-5" />
      <div className="w-full">
        <div className="my-7">
          <h1 className="text-[28px] font-bold">จัดการใบประเมิน</h1>
        </div>

        <EvaluatePanel schoolID={schoolID} />
      </div>
    </LayoutDefault>
  );
};

export default DomainJSX;
