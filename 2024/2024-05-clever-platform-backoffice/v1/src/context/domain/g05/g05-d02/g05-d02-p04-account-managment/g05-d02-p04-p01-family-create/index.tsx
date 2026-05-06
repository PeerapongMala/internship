import { useNavigate } from '@tanstack/react-router';
import InviteMemberMobile from './component/web/organism/cw-o-invite-member-mobile';
import FamilyTemplate from '../local/component/web/template/FamilyTemplate';
import { useEffect, useState } from 'react';
import StoreGlobal from '@store/global';

const DomainJsx = () => {
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
    <FamilyTemplate>
      <div className="mt-12 text-center font-noto-sans-thai text-base font-medium text-black">
        แสกนคิวอาร์เพื่อเพิ่มสมาชิก
      </div>

      <InviteMemberMobile />

      {/* <div className="flex items-center justify-center mt-10">
        <div
          onClick={() => navigate({ to: "/line/parent/management" })}
          className="w-[220px] h-[220px] bg-black "
        ></div>
      </div> */}
    </FamilyTemplate>
  );
};

export default DomainJsx;
