import { Link } from '@tanstack/react-router';
import { Dispatch, SetStateAction } from 'react';
import { RxCross1 } from 'react-icons/rx';

const CWMHeaderResponsiveMobileSidebar = (props: {
  menuList: { name: string; path: string }[];
  sidebarOpenIs: boolean;
  SidebarOpenIsSet: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      {props.sidebarOpenIs && (
        <div
          title="background"
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
          onClick={() => props.SidebarOpenIsSet(false)}
        ></div>
      )}
      <div
        title="sidebar"
        className={`bg-secondary-414143 fixed inset-y-0 left-0 z-50 transform text-white transition-transform duration-300 ease-in-out ${
          props.sidebarOpenIs ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="h-full w-[430px] flex-col items-start justify-center bg-[#414143]">
          <div className="flex-col items-start justify-start px-4">
            <div
              className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#d36b61]"
              onClick={() => props.SidebarOpenIsSet(false)}
            >
              <RxCross1 className="text-white" size={'24px'} />
            </div>
          </div>
          <div className="inline-flex w-full shrink grow basis-0 flex-col items-start justify-start gap-2 self-stretch p-6">
            {props.menuList.map((menu) => (
              <Link
                key={menu.path}
                to={menu.path}
                className="font-hx h-14 self-stretch px-6 py-2 text-2xl font-normal text-white [&.active]:bg-[#3f444b]"
              >
                {menu.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};
export default CWMHeaderResponsiveMobileSidebar;
