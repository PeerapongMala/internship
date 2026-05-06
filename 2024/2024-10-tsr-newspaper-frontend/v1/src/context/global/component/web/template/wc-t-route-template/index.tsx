import CWMHeader from '@component/web/organism/cw-m-header/index';
import StoreGlobal from '@store/global/index';
import Footer from '@component/web/organism/cwo-footer';
import StoreGlobalPersist from '@store/global/persist';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from '@tanstack/react-router';
import Arrow from '@asset/icon/Arrowbutton.svg';

const WCTRouteTemplate = (props: { children?: React.ReactNode }) => {
  const [showButton, setShowButton] = useState(false);
  const templateIs = StoreGlobal?.StateGet?.(['templateIs']) ?? false;
  const { role } = StoreGlobalPersist.StateGet(['role']);
  const divRef = useRef<null | HTMLDivElement>(null);
  const location = useLocation();

  const handleScroll = () => {
    if (divRef.current) {
      if (divRef.current.scrollTop > 50) { 
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    }
  };

  useEffect(() => {
    if (divRef.current) {
      divRef.current.addEventListener('scroll', handleScroll); 
    }
    return () => {
      if (divRef.current) {
        divRef.current.removeEventListener('scroll', handleScroll); 
      }
    };
  }, []);

  useEffect(() => {
    divRef?.current?.scrollTo(0, 0); 
  }, [location]);

  if (!templateIs) {
    return (
      <div className="flex flex-col min-h-screen uh-notch-p-x" ref={divRef}>
        {props.children}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen uh-notch-p-x">
      <CWMHeader userRole={role || ''} />
      <main
        ref={divRef}
        className="bg-neutral-100 dark:bg-[#414141] flex-1 flex flex-col overflow-y-auto"
      >
        {props.children}
        {showButton && ( 
          <button
            className="size-[54px] flex justify-center items-center fixed xl:right-16 right-10 bottom-4 bg-[#D9A84E] rounded-full z-50"
            onClick={() => {
              divRef?.current?.scrollTo(0, 0); 
            }}
          >
            <Arrow />
          </button>
        )}
        <Footer />
      </main>
    </div>
  );
};

export default WCTRouteTemplate;
