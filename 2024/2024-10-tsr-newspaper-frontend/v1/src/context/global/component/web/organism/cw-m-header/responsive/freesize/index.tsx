import Logo_dark from '@asset/Logo/Logo_TSR_Dark.png';
import Logo_Light from '@asset/Logo/Logo_TSR_Light.png';
import Humanlogo from '@asset/illustation_Icon/Humanlogo.png'
import { Link } from '@tanstack/react-router';
import ThemeToggle from '@component/web/atom/theme-toggle/wc-theme-toggle-button';
import { useEffect, useState } from 'react';
import CWModalConfirmLogout from '@component/web/molecule/modal/cw-modal/cw-modal-confirm-logout';

import { FaUserCircle } from 'react-icons/fa';


const CWMHeaderResponsiveFreesize = (props: {
  menuList: { name: string; path: string }[];
  userRole: number | string;
  userData?: { username: string, first_name?: string; last_name?: string, profile_image?: string }
  imageData: { image_url_list: string };
}) => {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  const userRole = props.userRole;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleLogout = () => {
    localStorage.removeItem('storage-user');
    window.location.href = '/sign-in';
  };



  return (
    <div className="bg-background text-text w-full flex justify-center text-base font-semibold ">
      <header className="w-full max-w-[1440px] h-[114px] flex items-center justify-between px-8">
        <div className="flex items-center gap-x-[40px] xl:gap-x-[88px]">
          <Link to={"/main"}>
            <img
              src={Logo_Light}
              alt="Logo"
              className="w-[168px] h-[168px] dark:hidden"
            />
            <img
            src={Logo_dark}
            alt="Logo-contact-dark"
            className="w-[168px] h-[168px] hidden dark:block"
            />
          </Link>

          <div className="flex gap-x-[21px]">
            {props.menuList.map((menu) => (
              <Link
                key={menu.path}
                to={menu.path}
                className="[&.active]:font-bold [&.active]:secondary"
              >
                {menu.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-8 text-base">
          <ThemeToggle />
          {userRole === '1' || userRole === '2' ? (
            <div className="relative group">
              <Link to={'/profile'} className="flex justify-center items-center gap-2">

                {props?.imageData?.image_url_list ? (
                  <img
                    className="w-[30px] h-[30px] object-cover   rounded-full"
                    src={`${BACKEND_URL}${props.imageData.image_url_list}`}
                    alt="User Avatar"
                  />
                ) : (
                  <FaUserCircle className="text-gray-400 w-[34px] h-[34px]" />
                )}



                <div className="text-[16px]">
                  {props.userData?.username
                    ? `${props.userData.username} `
                    : 'ไม่ทราบชื่อผู้ใช้งาน'}
                </div>
              </Link>
              <div className="absolute z-50 top-full right-0 bg-white dark:bg-dark text-text border-opacity-40 border-[#c9c9c9] dark:border-black rounded-xl shadow-lg w-48 py-2 hidden group-hover:block">
                <div className="flex flex-col gap-2 font-normal">
                  <Link
                    to="/profile"
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-black rounded-md"

                  >
                    บัญชีผู้ใช้
                  </Link>
                  <Link
                    to="/profile/payment-history"
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-black rounded-md"

                  >
                    ประวัติการชำระเงิน
                  </Link>
                  <Link
                    to="/profile/post-history"
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-black rounded-md"

                  >
                    ประกาศของฉัน
                  </Link>
                  {userRole === '1' && (
                    <Link
                      to="/admin/announcement"
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-black rounded-md"

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
            </div>
          ) : (
            <Link to="/sign-in">
              <button className="bg-[#D9A84E] text-[#FBFBFB] flex w-[152px] h-[38px] px-3 justify-center items-center gap-4 rounded-[6px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="24"
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
                เข้าสู่ระบบ
              </button>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default CWMHeaderResponsiveFreesize;
