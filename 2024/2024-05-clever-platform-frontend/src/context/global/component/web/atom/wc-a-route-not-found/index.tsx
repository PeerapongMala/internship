import { useEffect } from 'react';

import StoreGame from '../../../../store/game';

const WCARouteNotFound = () => {
  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
  }, []);

  return (
    <div className="text-white">
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  );
};

export default WCARouteNotFound;
