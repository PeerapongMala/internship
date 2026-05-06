import { useNavigate } from '@tanstack/react-router';
import SidebarMenu from '../../../../global/component/web/organism/cc-o-sidebar-user-tab-menu';
import PostHistory from './component/post-history';
import StoreGlobal from '@store/global';
import StoreGlobalPersist from '@store/global/persist';

const DomainJSX = () => {
  const { responsiveEvent } = StoreGlobal.StateGet(['responsiveEvent']);
  const navigate = useNavigate()
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  if (!accessToken) {
    navigate({ to: "/sign-in" })
  }
  return (
    <div>
      <main
        className={` min-h-screen pb-32 flex  
                        ${responsiveEvent.mobileIs ? 'flex-row  ' : 'flex-col'}`}
      >
        <div
          className={`container mx-auto  px-auto 
          ${responsiveEvent.mobileIs ? 'my-10 p-1' : 'mt-20'}
          `}
        >
          <div
            className={
              'w-min-[360px] flex flex-col justify-center md:flex-row gap-x-10 space-y-4 md:gap-x-0 md:space-y-0 md:space-x-[30px]'
            }
          >
            <SidebarMenu defaultPath="post-history" />
            <div
              className={
                ` rounded-[20px] h-fit pt-14 xl:pt-[57.87px] px-6 xl:px-[46px] pb-[57px] xl:pb-[53.51px] bg-white dark:bg-[#262626] shadow-md 
                ${
                  responsiveEvent.mobileIs ? 'w-full w-min-[360px]' : 'max-w-[869px] w-full'
                }`
              }
            >
              <PostHistory />{' '}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DomainJSX;
