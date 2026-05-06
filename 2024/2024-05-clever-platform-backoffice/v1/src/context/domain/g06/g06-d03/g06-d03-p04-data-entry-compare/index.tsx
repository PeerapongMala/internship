import StoreGlobal from '@global/store/global';
import { useEffect } from 'react';
import LayoutDefault from '@core/design-system/library/component/layout/default';

const DomainJSX = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(false);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return <LayoutDefault></LayoutDefault>;
};

export default DomainJSX;
