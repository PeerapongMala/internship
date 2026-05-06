import './index.css';

import { RotateSpinner } from 'react-spinners-kit';

import StoreGlobal from '../../../../store/global';

const WCAUILoader = (props: any) => {
  const { loadingIs } = StoreGlobal.StateGet(['loadingIs']);
  if (loadingIs) {
    return (
      <>
        {props.children}
        <div className="uh-h-screen BGLoaderOverlay flex items-center justify-center">
          <RotateSpinner size={60} color="white" className="" />
        </div>
      </>
    );
  }

  return <>{props.children}</>;
};

export default WCAUILoader;
