import CWModalConfirmLogout from '@component/web/cw-modal/cw-modal-confirm-logout';
import IconMenu from '@core/design-system/library/vristo/source/components/Icon/IconMenu';
import StoreGlobalPersist, { IStoreGlobalPersist } from '@global/store/global/persist';
import StoreVristoPersist, { IStoreVristoPersist } from '@store/global/vristo-persist';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { useTranslation } from 'react-i18next';

import logo from '../../asset/Frame.png';
import HumanLogo from '../../asset/Humanlogo.png';
import IconArrowRight from '@core/design-system/library/component/icon/IconArrowRight';
import IconUser from '@core/design-system/library/component/icon/IconUser';
import IconUpload from '@component/web/atom/wc-a-icons/IconUpload';
import { ICurriculum, IUserData } from '@domain/g00/g00-d00/local/type';
import { isMobile } from 'react-device-detect';
import { shouldShowHeader } from '@global/utils/deviceLayout';
import CWAvatar from '@component/web/atom/cw-a-avatar';

const Header = () => {
  const location = useLocation();
  useEffect(() => {
    const selector = document.querySelector(
      'ul.horizontal-menu a[href="' + window.location.pathname + '"]',
    );
    if (selector) {
      selector.classList.add('active');
      const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
      for (let i = 0; i < all.length; i++) {
        all[0]?.classList.remove('active');
      }
      const ul: any = selector.closest('ul.sub-menu');
      if (ul) {
        let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
        if (ele) {
          ele = ele[0];
          setTimeout(() => {
            ele?.classList.add('active');
          });
        }
      }
    }
  }, [location]);

  const {
    theme,
    semidark,
    sidebar,
    rtlClass,
    locale,
    menu,
    languageList,
  }: IStoreVristoPersist['StateInterface'] = StoreVristoPersist.StateGet([
    'theme',
    'semidark',
    'sidebar',
    'rtlClass',
    'locale',
    'menu',
    'languageList',
  ]);
  const themeConfig = {
    theme,
    semidark,
    sidebar,
    rtlClass,
    locale,
    menu,
    languageList,
  };

  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const settingRef = useRef<HTMLDivElement>(null);
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const checkHide = () => {
      const isCleverPath =
        location.pathname.startsWith('/line/parent/clever/lesson') ||
        location.pathname.startsWith('/line/parent/family');

      setIsHidden(isCleverPath && isMobile);
    };

    checkHide();

    window.addEventListener('resize', checkHide);
    return () => window.removeEventListener('resize', checkHide);
  }, [location.pathname]);

  const toggleSetting = () => {
    setIsOpenSetting(!isOpenSetting);
  };
  const handleLogout = () => {
    (StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface']).clearAll();
    // localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  const navigate = useNavigate();
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    image_url: '',
    access_token: '',
  });
  const { userData: globalUserData } = StoreGlobalPersist.StateGet(['userData']);
  const { targetData: globalTargetData } = StoreGlobalPersist.StateGet(['targetData']);
  const { isLoginAs } = StoreGlobalPersist.StateGet(['isLoginAs']);
  const { curriculumData }: { curriculumData: ICurriculum } = StoreGlobalPersist.StateGet(
    ['curriculumData'],
  );

  useEffect(() => {
    if (globalUserData) {
      setUser(globalUserData);
    }
  }, [globalUserData]);

  useEffect(() => {
    if (globalTargetData) {
      setUser(globalTargetData);
    }
  }, [globalTargetData]);

  // ฟังก์ชันสำหรับการกลับไปใช้ admin token
  const handleLogoutAsTeacher = () => {
    const storeMethods =
      StoreGlobalPersist.MethodGet() as IStoreGlobalPersist['MethodInterface'];
    setUser(globalUserData);
    storeMethods.setTargetData(null);
    storeMethods.setAccessToken(globalUserData.access_token);
    storeMethods.setIsLoginAs(false);
    storeMethods.setClassData(undefined);

    navigate({
      to: `/admin/school/${globalTargetData.school_id}?tab=user-management&tablist=teacher`,
    });
    sessionStorage.clear();
  };
  // by role
  const { userData }: { userData: IUserData } = StoreGlobalPersist.StateGet(['userData']);
  const role = userData?.roles || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingRef.current && !settingRef.current.contains(event.target as Node)) {
        setIsOpenSetting(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // if (!shouldShowHeader(location.pathname, isMobile)) return null;

  return (
    <header
      className={`z-[9999999] ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''} ${isHidden ? 'hidden' : ''}`}
    >
      <div className="shadow-sm" ref={settingRef}>
        <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
          <div className="horizontal-logo flex items-center justify-between lg:hidden ltr:mr-2 rtl:ml-2">
            {/* <Link to="/" className="main-logo flex shrink-0 items-center">
            </Link> */}
            <img className="w-[200px]" src={logo} alt="logo" />
            <button
              title="Menu"
              type="button"
              className="collapse-icon absolute left-[35%] flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary md:left-[10%] lg:hidden ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary"
              onClick={() => {
                StoreVristoPersist.MethodGet().sidebarToggle();
              }}
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>

          <div className="flex h-[50px] items-center justify-end space-x-1.5 sm:flex-1 lg:space-x-2 ltr:ml-auto ltr:sm:ml-0 rtl:mr-auto rtl:space-x-reverse sm:rtl:mr-0 dark:text-[#d0d2d6]">
            {/* Toggle Theme */}
            {/* <div>
              {themeConfig.theme === 'light' ? (
                <button
                  className={`${themeConfig.theme === 'light' &&
                    'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                    }`}
                  onClick={() => {
                    StoreVristoPersist.MethodGet().themeToggle('dark');
                  }}
                >
                  <IconSun />
                </button>
              ) : (
                ''
              )}
              {themeConfig.theme === 'dark' && (
                <button
                  className={`${themeConfig.theme === 'dark' &&
                    'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                    }`}
                  onClick={() => {
                    StoreVristoPersist.MethodGet().themeToggle('system');
                  }}
                >
                  <IconMoon />
                </button>
              )}
              {themeConfig.theme === 'system' && (
                <button
                  className={`${themeConfig.theme === 'system' &&
                    'flex items-center p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60'
                    }`}
                  onClick={() => {
                    StoreVristoPersist.MethodGet().themeToggle('light');
                  }}
                >
                  <IconLaptop />
                </button>
              )}
            </div> */}

            <div
              className="flex w-[200px] cursor-pointer gap-3 rounded-md border-2 object-contain px-1 py-0.5 hover:bg-neutral-100"
              onClick={toggleSetting}
            >
              <CWAvatar src={user?.image_url} alt={user?.image_url} />

              <div className="flex items-center justify-center">
                <h1 className="text-[16px] font-bold">{user?.first_name || 'Guest'}</h1>

                <div className="absolute right-8">
                  {isOpenSetting ? (
                    <IconArrowRight className="rotate-90" />
                  ) : (
                    <IconArrowRight />
                  )}
                </div>
              </div>

              <AnimateHeight duration={300} height={isOpenSetting ? 'auto' : 0}>
                <div className="absolute right-5 top-14 z-50 mt-5 flex w-[200px] flex-col rounded-md bg-white shadow">
                  {role.length > 0 && role[0] === 1 && (
                    <Link to={'/admin/profile/'}>
                      <button className="flex w-full gap-3 py-3 pl-6 text-[14px] font-bold hover:bg-neutral-100">
                        <IconUser className="text-[14px]" />
                        บัญชีผู้ใช้
                      </button>
                    </Link>
                  )}
                  {/* นักวิชาการ */}
                  {role.length > 0 && role[0] === 2 && curriculumData && (
                    <Link to={'/content-creator/profile/'}>
                      <button className="flex w-full gap-3 py-3 pl-6 text-[14px] font-bold hover:bg-neutral-100">
                        <IconUser className="text-[14px]" />
                        บัญชีผู้ใช้
                      </button>
                    </Link>
                  )}
                  {/* gm */}
                  {role.length > 0 && role[0] === 3 && (
                    <Link to={'/gamemaster/profile/'}>
                      <button className="flex w-full gap-3 py-3 pl-6 text-[14px] font-bold hover:bg-neutral-100">
                        <IconUser className="text-[14px]" />
                        บัญชีผู้ใช้
                      </button>
                    </Link>
                  )}
                  {/* teacher */}
                  {role.length > 0 && role[0] === 6 && (
                    <Link to={'/teacher/profile/'}>
                      <button className="flex w-full gap-3 py-3 pl-6 text-[14px] font-bold hover:bg-neutral-100">
                        <IconUser className="text-[14px]" />
                        บัญชีผู้ใช้
                      </button>
                    </Link>
                  )}
                  <button
                    className="flex w-full gap-3 py-3 pl-6 text-[14px] font-bold text-red-500 hover:bg-neutral-100"
                    onClick={openModal}
                  >
                    <IconUpload className="rotate-90 text-[10px]" />
                    <p className="text-[14px]"> ออกจากระบบ</p>
                  </button>
                </div>
              </AnimateHeight>

              <CWModalConfirmLogout
                open={isModalOpen}
                onClose={closeModal}
                onOk={handleLogout}
              />
            </div>
          </div>
        </div>
        {isLoginAs && (
          <div className="flex flex-row justify-between bg-primary px-6 py-1.5 text-white">
            <span>
              Log in as {user.first_name} {user.last_name}
            </span>
            <button className="text-sm" onClick={handleLogoutAsTeacher}>
              X
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
