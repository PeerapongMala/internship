import { Link } from '@tanstack/react-router';
import { Dispatch, SetStateAction, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import ThemeToggle from '@component/web/atom/theme-toggle/wc-theme-toggle-button';
import CWModalConfirmLogout from '@component/web/molecule/modal/cw-modal/cw-modal-confirm-logout';

// other imports

const CWMHeaderResponsiveMobileSidebar = (props: {
  menuList: { name: string; path: string }[];
  sidebarOpenIs: boolean;
  SidebarOpenIsSet: Dispatch<SetStateAction<boolean>>;
  userRole: number | string;
}) => {
  const userRole = props.userRole;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleLogout = () => {
    localStorage.removeItem('storage-user');
    window.location.href = '/sign-in'
  };

  return (
    <>
      {props.sidebarOpenIs && (
        <div
          title="background"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          onClick={() => props.SidebarOpenIsSet(false)}
        ></div>
      )}
      <div
        title="sidebar"
        className={`fixed inset-y-0 left-0 z-50 bg-background text-text transform transition-transform duration-300 ease-in-out ${props.sidebarOpenIs ? 'translate-x-0' : '-translate-x-full'
          } w-[305px] shadow-lg`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-end">
            <button
              className="w-[20px] h-[20px] rounded-full flex items-center justify-center"
              onClick={() => props.SidebarOpenIsSet(false)}
            >
              <RxCross1 className="text-[#D9A84E]" size={24} />
            </button>
          </div>

          <nav className="flex flex-col p-6 gap-4 ">
            {props.menuList.map((menu) => (
              <Link
                key={menu.path}
                to={menu.path}
                onClick={() => props.SidebarOpenIsSet(false)}

                className="text-text text-base font-light py-2 hover:text-[#D9A84E]"
              >
                {menu.name}
              </Link>
            ))}
          </nav>

          <div className="mt-10 p-6 border-t border-gray-200 text-base">
            <ThemeToggle />
            {userRole === "1" || userRole === "2" ? (
              <div>
                <button
                  onClick={openModal}
                  className="bg-[#D9A84E] hover:bg-[#ffbb3d] duration-150 text-white mt-5 w-[152px] h-[38px] flex items-center justify-center gap-2 rounded-[6px]">
                  ออกจากระบบ
                </button>

                <CWModalConfirmLogout
                  open={isModalOpen}
                  onClose={closeModal}
                  onOk={handleLogout}
                />
              </div>

            ) : (
              <Link to={'/sign-in'} className="bg-[#D9A84E] text-white mt-5 w-[152px] h-[38px] flex items-center justify-center gap-2 rounded-[6px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 25 24"
                  fill="none"
                >
                  <path
                    d="M14.5 8V6C14.5 5.46957 14.2893 4.96086 13.9142 4.58579C13.5391 4.21071 13.0304 4 12.5 4H5.5C4.96957 4 4.46086 4.21071 4.08579 4.58579C3.71071 4.96086 3.5 5.46957 3.5 6V18C3.5 18.5304 3.71071 19.0391 4.08579 19.4142C4.46086 19.7893 4.96957 20 5.5 20H12.5C13.0304 20 13.5391 19.7893 13.9142 19.4142C14.2893 19.0391 14.5 18.5304 14.5 18V16M7.5 12H21.5M21.5 12L18.5 9M21.5 12L18.5 15"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <button onClick={() => props.SidebarOpenIsSet(false)}>

                  เข้าสู่ระบบ
                </button>

              </Link>

            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CWMHeaderResponsiveMobileSidebar;
