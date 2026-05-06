import FamilyIndexMenu from './component/web/organism/cw-o-family-index-menu';
import FamilyCreatePanel from './component/web/organism/cw-o-family-create-panel';
import { useEffect, useState } from 'react';
import FooterMenu from '../../local/component/web/organism/cw-o-footer-menu';
import FamilyTemplate from '../local/component/web/template/FamilyTemplate';
import MyQrCodeTemplate from '../local/component/web/template/cw-t-my-qr-code';
import StoreGlobal from '@store/global';
import { useNavigate } from '@tanstack/react-router';

const DomainJsx = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const isMobile = window.innerWidth > 768;
      StoreGlobal.MethodGet().TemplateSet(isMobile);
      StoreGlobal.MethodGet().BannerSet(isMobile);
      setIsMobile(false);
      if (!isMobile) {
        StoreGlobal.MethodGet().TemplateSet(false);
        StoreGlobal.MethodGet().BannerSet(false);
        setIsMobile(true);
      }
    };
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [navigate]);

  return (
    <FamilyTemplate
      familyMenu={
        <FamilyIndexMenu
          initialTab={selectedTab}
          onTabChange={(tab) => setSelectedTab(tab)}
        />
      }
    >
      {selectedTab === 0 && <FamilyCreatePanel />}

      {selectedTab === 1 && <MyQrCodeTemplate />}
      <div className="mt-4 flex justify-center">
        <FooterMenu />
      </div>
    </FamilyTemplate>
  );
};

export default DomainJsx;
