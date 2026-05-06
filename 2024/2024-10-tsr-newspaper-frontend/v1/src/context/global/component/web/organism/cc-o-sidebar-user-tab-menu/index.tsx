import { useRef, useState, useEffect, RefObject } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { MdChevronRight, MdChevronLeft } from 'react-icons/md';
import CWModalConfirmLogout from '@component/web/molecule/modal/cw-modal/cw-modal-confirm-logout';
import StoreGlobalPersist from '@store/global/persist';
import Humanlogo from '@asset/illustation_Icon/Humanlogo.png'
import { GetProfile } from '../../../../../domain/g02/g02-d01/local/api/restapi/get-profile';
interface ProfileNavProps {
  menuRef: RefObject<HTMLDivElement>;
  navItems: { label: string; key: string }[];
  activeItem: string;
  onItemClick: (item: string) => void;
  scrollRight?: () => void;
  scrollLeft?: () => void;
  onLogoutClick?: (e: React.MouseEvent) => void;
}
interface ProfilebarMenu {
  defaultPath?: '' | 'password' | 'payment-history' | 'post-history' | 'logout';
}
export default function ProfilebarMenu({ defaultPath }: ProfilebarMenu) {
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';
  const { userData: globalUserData } = StoreGlobalPersist.StateGet(['userData']);
  const [user, setUser] = useState({ username: '', first_name: '', last_name: '', profile_image: '' });
  useEffect(() => {
    if (globalUserData) {
      setUser({
        username: globalUserData.username,
        first_name: globalUserData.first_name || '',
        last_name: globalUserData.last_name || '',
        profile_image: globalUserData.profile_image
      });
    } else {
      setUser({
        username: '',
        first_name: '',
        last_name: '',
        profile_image: ''
      });
    }
  }, [globalUserData]);

  interface Profile {
    email?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    branch?: string;
    tax_id?: string;
    phone?: string;
    address?: string;
    district?: string;
    sub_district?: string;
    province?: string;
    postal_code?: string;
    profile_image_url?: string
  };

  const [profileData, setProfileData] = useState<Profile>({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    company: '',
    branch: '',
    tax_id: '',
    phone: '',
    address: '',
    district: '',
    sub_district: '',
    province: '',
    postal_code: '',
    profile_image_url: ''
  });

  useEffect(() => {
    GetProfile()
      .then((res) => {

        setProfileData(res.data);
      })
      .catch((error) => {
        console.log(`Cant not Fetching ${error}`);
      });
  }, []);

  const navItems = [
    { label: 'ข้อมูลส่วนตัว', key: '' },
    { label: 'เปลี่ยนรหัสผ่าน', key: 'password' },
    { label: 'ประวัติการชำระเงิน', key: 'payment-history' },
    { label: 'ประกาศของฉัน', key: 'post-history' },
    { label: 'ออกจากระบบ', key: 'logout' },
  ];
  const [atStart, setAtStart] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<'profile' | 'password' | string>(
    defaultPath ?? '',
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (menuRef.current) {
      const activeItemElement = menuRef.current.querySelector(
        `.active-menu`,
      ) as HTMLElement;
      if (activeItemElement) {
        activeItemElement.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }
    checkIfAtEnd();
    checkIfAtStart();
  }, [activeItem]);
  const scrollRight = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({ left: 250, behavior: 'smooth' });
      setTimeout(checkIfAtEnd, 300);
      setTimeout(checkIfAtStart, 300);
    }
  };

  const scrollLeft = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({ left: -250, behavior: 'smooth' });
      setTimeout(checkIfAtStart, 300);
      setTimeout(checkIfAtEnd, 300);
    }
  };

  const checkIfAtEnd = () => {
    if (menuRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = menuRef.current;
      setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    }
  };

  const checkIfAtStart = () => {
    if (menuRef.current) {
      setAtStart(menuRef.current.scrollLeft <= 0);
    }
  };
  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleLogout = () => {
    localStorage.removeItem('storage-user');
    window.location.href = '/sign-in'
  };
  return (
    <aside className="bg-white dark:bg-[#262626] shadow-md w-full  md:border-none md:w-72 md:h-max lg:w-64 p-4 pb-0 rounded-t-3xl md:rounded-2xl">
      <div className="flex items-center mb-5">

        {profileData?.profile_image_url ? (
          <img
            className="size-[80px] object-cover  rounded-full"
            src={`${BACKEND_URL}${profileData.profile_image_url}`}
            alt="User Avatar"
          />
        ) : (
          <FaUserCircle
            className="text-gray-400 w-[80px] h-[80px]"
          
          />
        )}




        <h3 className="text-gray-700 font-semibold text-2xl mt-2 ml-2 dark:text-white">
          {user.username}
        </h3>
      </div>

      {/* Horizontal Tab Menu with Scroll Button */}
      <ProfileNav
        menuRef={menuRef}
        navItems={navItems}
        activeItem={activeItem}
        onItemClick={setActiveItem}
        scrollLeft={scrollLeft}
        scrollRight={scrollRight}
        atEnd={atEnd}
        atStart={atStart}
        onLogoutClick={handleLogoutClick}
      />
      <CWModalConfirmLogout
        open={isModalOpen}
        onClose={closeModal}
        onOk={handleLogout}
      />
    </aside>
  );
}

const ProfileNav: React.FC<ProfileNavProps & { atEnd: boolean; atStart: boolean }> = ({
  menuRef,
  navItems,
  activeItem,
  onItemClick,
  scrollRight,
  scrollLeft, atEnd, atStart,
  onLogoutClick,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between md:flex-col md:items-start md:relative md:mb-12">
        {!atStart && (
          <button onClick={scrollLeft} className=" md:hidden bg-transparent mr-2">
            <MdChevronLeft size={24} className="text-gray-500 dark:text-white" />
          </button>
        )}
        <nav ref={menuRef} className="flex overflow-x-auto no-scrollbar whitespace-nowrap text-sm pt-2  space-x-5 md:flex-col md:space-y-4 md:space-x-0">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={`/profile/${item.key}`}
              onClick={(e) => {
                if (item.key === 'logout') {
                  onLogoutClick?.(e);  // Only call logout click handler if it's the logout item
                } else {
                  onItemClick(item.key);
                }
              }}
              className={`flex-shrink-0 pb-[10px] transition-colors duration-200
                ${item.key === 'logout'
                  ? 'text-red-500 hover:text-red-700'
                  : activeItem === item.key
                    ? 'text-[#D9A84E] md:border-none border-b-2 border-[#D9A84E] z-10 active-menu'
                    : 'text-[#9096A2] hover:text-[#D9A84E] dark:hover:text-[#D9A84E]'
                }
              `}
            >
              <span className="px-6 py-[10px] text-sm leading-3">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Scroll button - Display only on mobile */}
        {!atEnd && (
          <button onClick={scrollRight} className=" md:hidden bg-transparent ml-2">
            <MdChevronRight size={24} className="text-gray-500 dark:text-white" />
          </button>
        )}
      </div>
    </div>

  );
};
