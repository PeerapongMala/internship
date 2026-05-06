import CoreSidebarMenu from '@component/web/molecule/cc-o-sidebar-admin-tab-menu';
import Announcement from './components/annoucement';
import { useNavigate } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';

const DomainJSX = () => {
  const navigate = useNavigate()
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  if (!accessToken) {
    navigate({ to: "/sign-in" })
  }
  return (
    <div className="bg-white dark:bg-[#262626]">
      <div className="my-[64px] md:my-[135px] md:mx-auto w-full max-w-[954px] flex flex-col gap-y-[63px] md:gap-y-20">
        <div className="px-[10px] md:px-0">
          <CoreSidebarMenu defaultPath="announcement" />
        </div>
        <Announcement />
      </div>
    </div>
  );
};

export default DomainJSX;
