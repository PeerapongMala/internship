import StoreGlobal from '@store/global';
import { useEffect } from 'react';

const WCARouteNotFound = () => {
  useEffect(() => {
    StoreGlobal.MethodGet().BannerSet(false);
  }, []);

  return (
    <div className="text-white">
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  );
};

export default WCARouteNotFound;
