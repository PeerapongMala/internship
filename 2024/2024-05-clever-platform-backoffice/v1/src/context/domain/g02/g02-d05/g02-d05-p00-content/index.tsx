import StoreGlobal from '@global/store/global';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from './config/index.json';
import LayoutDefault from '@core/design-system/library/component/layout/default';
import { Link } from '@tanstack/react-router';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <LayoutDefault>
      <Link className="btn btn-outline-primary w-44" to="/content-creator/create-setting">
        สร้างด่านใหม่
      </Link>
    </LayoutDefault>
  );
};

export default DomainJSX;
