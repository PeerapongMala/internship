import CoreSidebarMenu from '@component/web/molecule/cc-o-sidebar-admin-tab-menu';
import AdminDownload from './components/admin-download';
import  { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import StoreGlobalPersist from '@store/global/persist';

const DomainJSX = () => {
  const navigate = useNavigate()
  const accessToken = StoreGlobalPersist.StateGetAllWithUnsubscribe().accessToken;
  if (!accessToken) {
    navigate({ to: "/sign-in" })
  }
  return (
    <div className="bg-white dark:bg-[#262626] ">
      <div className="my-[64px] md:my-[135px] md:mx-auto w-full max-w-[954px] flex flex-col gap-y-[63px] md:gap-y-20">
        <div className="px-[10px] xl:px-0">
        <CoreSidebarMenu defaultPath="download" />
        <div className="mt-20 w-full text-left mb-[28px]">
            <nav aria-label="breadcrumb" className="block w-full">
              <ol className="flex w-full flex-wrap items-center">
                <li className="flex cursor-pointer items-center text-sm font-normal leading-normal text-[#D9A84E] antialiased transition-colors duration-300 hover:text-pink-500">
                  <a href="#">
                    <span>ADMIN</span>
                  </a>
                  <span className="pointer-events-none mx-2 select-none text-black dark:text-[#9096A2]">
                    /
                  </span>
                </li>
                <li className="flex items-center text-sm font-normal leading-normal text-[#9096A2]">
                  <span>ดาวน์โหลดใบแจ้งหนี้และใบเสร็จ</span>
                </li>
              </ol>
            </nav>
          </div>
          <AdminDownload />
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;
