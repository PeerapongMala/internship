import Logo_dark from '@asset/Logo/Logo_TSR_Dark.png';
import Logo_Light from '@asset/Logo/Logo_TSR_Light.png';
import Humanlogo from '@asset/illustation_Icon/Humanlogo.png'
import { useState } from 'react';
import { SlMenu } from 'react-icons/sl';
import { Link } from '@tanstack/react-router';
import CWMHeaderResponsiveMobileSidebar from './sidebar';
import CWModalConfirmLogout from '@component/web/molecule/modal/cw-modal/cw-modal-confirm-logout';

import { FaUserCircle } from 'react-icons/fa';

const CWMHeaderResponsiveMobile = (props: {
  userRole: number | string;
  menuList: { name: string; path: string }[];
  userData?: { username: string, firs_tname?: string; last_name?: string, profile_image?: string }
  imageData: { image_url_list: string };
}) => {
  const [sidebarOpenIs, SidebarOpenIsSet] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  const userRole = props.userRole;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleLogout = () => {
    localStorage.removeItem('storage-user');
    window.location.href = '/sign-in'
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="relative z-20">
      <header className="h-[70px] px-4 bg-background flex items-center justify-between shadow-md z-20">
        {/* Menu Button */}
        <button
          type="button"
          title="Open Sidebar"
          className="flex items-center "
          onClick={() => SidebarOpenIsSet(true)}

        >
          <SlMenu className="text-text" size={24} />
        </button>

        {/* Logo */}
        <div className="flex-auto flex justify-center">
          <Link to={"/main"}>
          <img
              src={Logo_Light}
              alt="Logo"
              className="w-[104px] h-auto object-contain dark:hidden"
            />
            <img
            src={Logo_dark}
            alt="Logo-contact-dark"
            className="w-[104px] h-auto object-contain hidden dark:block"
            />
          </Link>

        </div>

        {userRole === '1' || userRole === '2' ? (
          <div className="hover:cursor-pointer">


            {props?.imageData?.image_url_list ? (
              <img
                className="w-[30px] h-[30px] object-cover  rounded-full"
                src={`${BACKEND_URL}${props.imageData.image_url_list}`}
                alt="User Avatar"
                onClick={toggleMenu}
              />
            ) : (
              <FaUserCircle className="text-gray-400  w-[34px] h-[34px]" onClick={toggleMenu} />
            )}
            {isMenuOpen && (
              <div className="absolute top-12 right-8 bg-white dark:bg-dark text-text  border-[#C9C9C9] dark:border-black rounded-xl shadow-lg w-48 py-2 z-10">
                <div className="flex flex-col gap-2">
                  <Link
                    to="/profile"
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-black rounded-md"
                    onClick={toggleMenu}

                  >
                    บัญชีผู้ใช้
                  </Link>
                  <Link
                    to="/profile/payment-history"
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-black rounded-md"
                    onClick={toggleMenu}
                  >
                    ประวัติการชำระเงิน
                  </Link>
                  <Link
                    to="/profile/post-history"
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-black rounded-md"
                    onClick={toggleMenu}
                  >
                    ประกาศของฉัน
                  </Link>
                  {userRole === '1' && (
                    <Link
                      to="/admin/announcement"
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-black rounded-md"
                      onClick={toggleMenu}
                    >
                      จัดการแอดมิน
                    </Link>
                  )}
                  <button onClick={openModal} className="text-left px-4 py-2 cursor-pointer text-rose-500 hover:text-rose-800 hover:bg-gray-100 dark:hover:bg-black rounded-md">
                    ออกจากระบบ
                  </button>
                  <CWModalConfirmLogout
                    open={isModalOpen}
                    onClose={closeModal}
                    onOk={handleLogout}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </header>
      {/* Sidebar */}
      <CWMHeaderResponsiveMobileSidebar
        userRole={props.userRole}
        menuList={props.menuList}
        sidebarOpenIs={sidebarOpenIs}
        SidebarOpenIsSet={SidebarOpenIsSet}
      />
    </div>
  );
};

export default CWMHeaderResponsiveMobile;
