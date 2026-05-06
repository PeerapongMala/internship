import LogoBritania1 from '@asset/logo-britania-1.png';
import { useState } from 'react';
import { SlMenu } from 'react-icons/sl';

import CWMHeaderResponsiveMobileSidebar from './sidebar';

const CWMHeaderResponsiveMobile = (props: {
  menuList: { name: string; path: string }[];
}) => {
  const [sidebarOpenIs, SidebarOpenIsSet] = useState(false);

  return (
    <div className="relative">
      <header className="flex h-[54px] items-center justify-start bg-white pr-4">
        <button
          type="button"
          title="Open Sidebar"
          className="flex items-center justify-center bg-[#d36b61] px-[15px] py-4"
          onClick={() => SidebarOpenIsSet(true)}
        >
          <SlMenu className="text-white" size={'24px'} />
        </button>
        <div className="flex flex-auto justify-center">
          <img
            alt="Logo Britania 1"
            className="flex h-10 w-[232.86px] object-contain"
            src={LogoBritania1}
          />
        </div>
      </header>
      <CWMHeaderResponsiveMobileSidebar
        menuList={props.menuList}
        sidebarOpenIs={sidebarOpenIs}
        SidebarOpenIsSet={SidebarOpenIsSet}
      />
    </div>
  );
};
export default CWMHeaderResponsiveMobile;
