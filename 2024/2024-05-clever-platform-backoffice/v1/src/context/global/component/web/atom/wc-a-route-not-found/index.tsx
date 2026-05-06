import StoreGlobal from '@store/global';
import { useEffect } from 'react';
import WCAUILoader from '../wc-a-ui-loader';

const WCARouteNotFound = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().TemplateSet(true);
    StoreGlobal.MethodGet().BannerSet(true);
  }, []);

  return (
    <div className="mt-[15rem] flex justify-center font-bold text-black">
      <div className="text-center">
        <h1 className="text-[24px]">404</h1>
        <p className="mt-5 text-[18px]">Page not found</p>
      </div>
    </div>
  );
};

export default WCARouteNotFound;
