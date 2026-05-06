import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import AnimateHeight from 'react-animate-height';
import { useState, useEffect } from 'react';

import { Link, useLocation } from '@tanstack/react-router';
import StoreVristoPersist, { IStoreVristoPersist } from '@store/global/vristo-persist';
import IconPaperclip from '@core/design-system/library/vristo/source/components/Icon/IconPaperclip';
import IconActivity from '@core/design-system/library/component/icon/IconActivity';
import IconBook from '@core/design-system/library/component/icon/IconBook';
import IconBookmark from '@core/design-system/library/component/icon/IconBookmark';
import IconError from '@core/design-system/library/component/icon/IconError';
import IconFile from '@core/design-system/library/component/icon/IconFile';
import IconFolder from '@core/design-system/library/component/icon/IconFolder';
import IconGroup from '@core/design-system/library/component/icon/IconGroup';
import IconHome from '@core/design-system/library/component/icon/IconHome';
import IconImportContacts from '@core/design-system/library/component/icon/IconImportContacts';
import IconReward from '@core/design-system/library/component/icon/IconReward';
import IconServer from '@core/design-system/library/component/icon/IconServer';
import IconUser from '@core/design-system/library/component/icon/IconUser';
import IconVolume from '@core/design-system/library/component/icon/IconVolume';
import IconBarChart from '@core/design-system/library/component/icon/IconBarChart';
import IconPieChart from '@core/design-system/library/component/icon/IconPieChart';
import IconUserPlus from '@core/design-system/library/component/icon/IconUserPlus';
import logo from '../../asset/Frame.png';

import SectionHeader from '@core/design-system/library/vristo/source/components/Layouts/Sidebar/SectionHeader';
import NavItem from '@core/design-system/library/vristo/source/components/Layouts/Sidebar/NavItem';
import IconMenu from '@core/design-system/library/vristo/source/components/Icon/IconMenu';
import IconArrowLeft from '@core/design-system/library/component/icon/IconArrowLeft';
import IconArrowDown from '@core/design-system/library/component/icon/IconArrowDown';
import StoreGlobalPersist from '@store/global/persist';
import { ICurriculum } from '@domain/g00/g00-d00/local/type';

const SidebarDemo = () => {
  const [currentMenu, setCurrentMenu] = useState<string>('');
  const [errorSubMenu, setErrorSubMenu] = useState(false);

  const { semidark, sidebar }: IStoreVristoPersist['StateInterface'] =
    StoreVristoPersist.StateGet(['semidark', 'sidebar']);
  const themeConfig = { semidark, sidebar };

  const location = useLocation();

  const { t } = useTranslation(['global']);
  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? '' : value;
    });
  };

  // useEffect(() => {
  //   const selector = document.querySelector(
  //     '.sidebar ul a[href="' + window.location.pathname + '"]'
  //   );

  //   if (selector) {
  //     selector.classList.add('active');
  //     const ul = selector.closest('ul.sub-menu');
  //     if (ul) {
  //       const ele = ul.closest('li.menu')?.querySelectorAll('.link');
  //       if (ele && ele.length) {
  //         setTimeout(() => {
  //           ele[0].click();
  //         });
  //       }
  //     }
  //   }
  // }, []);

  const { curriculumData }: { curriculumData: ICurriculum } = StoreGlobalPersist.StateGet(
    ['curriculumData'],
  );

  useEffect(() => {
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      StoreVristoPersist.MethodGet().sidebarToggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className={semidark ? 'dark' : ''}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] font-noto-sans-thai shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
      >
        <div className="h-full bg-white dark:bg-black">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="main-logo flex shrink-0 items-center">
              <img className="w-[200px]" src={logo} alt="logo" />
            </Link>
            {/* <button
              title="Menu"
              type="button"
              className="collapse-icon flex-none dark:text-[#d0d2d6] hover:text-primary dark:hover:text-primary flex lg:hidden ltr:ml-2 rtl:mr-2 p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:bg-white-light/90 dark:hover:bg-dark/60"
              onClick={() => {
                StoreVristoPersist.MethodGet().sidebarToggle();
              }}
            >
              <IconMenu className="w-5 h-5" />
            </button> */}
            <button
              title="Toggle Sidebar"
              type="button"
              className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
              onClick={() => StoreVristoPersist.MethodGet().sidebarToggle()}
            >
              <IconArrowLeft className="m-auto" />
            </button>
          </div>
          {/* @ts-ignore */}
          <PerfectScrollbar className="relative h-[calc(100vh-80px)] overflow-y-auto">
            <ul className="relative h-full space-y-0.5 p-4 py-0 font-semibold">
              {/* <li className="menu nav-item">
                <button
                  type="button"
                  className={`${currentMenu === "dashboard" ? "active" : ""} nav-link group w-full`}
                  onClick={() => toggleMenu("dashboard")}
                >
                  <div className="flex items-center">
                    <IconBarChart />
                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t("รายงาน")}
                    </span>
                  </div>
                  <div
                    className={
                      currentMenu !== "dashboard"
                        ? "rtl:rotate-90 -rotate-90"
                        : ""
                    }
                  >
                    <IconArrowDown />
                  </div>
                </button>

                <AnimateHeight
                  duration={300}
                  height={currentMenu === "dashboard" ? "auto" : 0}
                >
                  <ul className="sub-menu -ml-5 text-gray-500">
                    <li>
                      <Link to="/teacher/dashboard">
                        {t("<ครู: วิชาที่รับผิดชอบและนร.ที่ดูแล>")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/parant/dashboard">
                        {t("<ผู้ปกครอง/นักเรียน: สถิติรวมทุกวิชา>")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/dashboard">
                        {t("<แอดมิน: สิถิติทั้งหมด>")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/observer">
                        {t("<ผู้สังเกตการณ์: แยกระดับการมองเห็น>")}
                      </Link>
                    </li>
                  </ul>
                </AnimateHeight>
              </li> */}

              <div>
                <SectionHeader title="จัดการแอปพลิเคชั่น" />
                {/* <NavItem
                  to="/iconpreview"
                  icon={
                    <IconPaperclip className="group-hover:!text-primary shrink-0" />
                  }
                  label="Icon Preview"
                />
                <NavItem
                  to="/components"
                  icon={
                    <IconPaperclip className="group-hover:!text-primary shrink-0" />
                  }
                  label="components Preview"
                />
                <NavItem
                  to="/admin/affiliation"
                  icon={
                    <IconFile className="group-hover:!text-primary shrink-0" />
                  }
                  label="สังกัดโรงเรียน / สัญญา"
                />
                <NavItem
                  to="/admin/report-permission"
                  icon={
                    <IconBook className="group-hover:!text-primary shrink-0" />
                  }
                  label="สังกัดวิชา"
                /> */}
                <NavItem
                  to="/admin/school"
                  icon={<IconHome className="shrink-0 group-hover:!text-primary" />}
                  label="โรงเรียน"
                />
                <NavItem
                  to="/admin/family"
                  icon={<IconGroup className="shrink-0 group-hover:!text-primary" />}
                  label="ครอบครัว"
                />
                <NavItem
                  to="/admin/user-account"
                  icon={<IconUser className="shrink-0 group-hover:!text-primary" />}
                  label="ผู้ใช้งาน"
                />
                {/* 
                <NavItem
                  to="/admin/translation"
                  icon={
                    <IconActivity className="group-hover:!text-primary shrink-0" />
                  }
                  label="จัดการข้อความ"
                /> */}
              </div>

              <div>
                <SectionHeader title="เกี่ยวกับหลักสูตร" />
                <NavItem
                  to="/curriculum"
                  icon={<IconServer className="shrink-0 group-hover:!text-primary" />}
                  label="สังกัดวิชาของคุณ"
                />
                {curriculumData && (
                  <>
                    <NavItem
                      to="/content-creator/standard/learning-area"
                      icon={
                        <IconBarChart className="shrink-0 group-hover:!text-primary" />
                      }
                      label="มาตรฐานหลัก"
                    />
                    <NavItem
                      to="/content-creator/standard/sub-standard"
                      icon={
                        <IconBarChart className="shrink-0 group-hover:!text-primary" />
                      }
                      label="มาตรฐานย่อย"
                    />

                    {/* <NavItem
                      to="/bloom"
                      icon={
                        <IconBarChart className="group-hover:!text-primary shrink-0" />
                      }
                      label="จัดการทฤษฎีการวัดพฤติกรรม (Bloom)"
                    /> */}
                    <NavItem
                      to="/content-creator/course"
                      icon={<IconBook className="shrink-0 group-hover:!text-primary" />}
                      label="หลักสูตร"
                    />
                    {/* <li className="menu nav-item">
                  <div className="flex items-center px-2.5 py-2.5">
                    <IconBook className="group-hover:!text-primary shrink-0" />
                    <Link to="/content-creator/lesson" className='hover:text-primary'>
                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark hover:text-primary">
                      {t('บทเรียน')}
                    </span>
                    </Link>
                  </div> */}
                    <NavItem
                      to="/content-creator/lesson"
                      icon={<IconBook className="shrink-0 group-hover:!text-primary" />}
                      label="บทเรียน"
                    />
                  </>
                )}
                {/* </li> */}
                <ul className="sub-menu -ml-5 pl-4 text-gray-500">
                  <li>
                    <Link
                      to="/content-creator/lesson"
                      // onClick={(event) => event.preventDefault()}
                    >
                      {t('บทเรียนหลัก')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/content-creator/sublesson"
                      onClick={(event) => event.preventDefault()}
                      className="pointer-events-none"
                      disabled={true}
                    >
                      {t('บทเรียนย่อย')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/content-creator/level"
                      onClick={(event) => event.preventDefault()}
                      disabled={true}
                      className="pointer-events-none"
                    >
                      {t('ข้อมูลด่าน')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/content-creator/special-reward"
                      onClick={(event) => event.preventDefault()}
                      disabled={true}
                      className="pointer-events-none"
                    >
                      {t('รางวัลพิเศษ')}
                    </Link>
                  </li>
                </ul>
                <NavItem
                  to="/data-entry"
                  icon={<IconBook className="shrink-0 group-hover:!text-primary" />}
                  label="ระบบตัดเกรด"
                />
                <ul className="sub-menu -ml-5 pl-4 text-gray-500">
                  <li>
                    <Link
                      to="/data-entry"
                      // onClick={(event) => event.preventDefault()}
                    >
                      {t('จัดการใบประเมิน (Admin)')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/data-entry/report">{t('ใบประเมิน')}</Link>
                  </li>
                  <li>
                    <Link to="/data-entry/setting">{t('ตั้งค่าระบบ (Admin)')}</Link>
                  </li>
                </ul>
                <NavItem
                  to="/content-creator/translation"
                  icon={<IconActivity className="shrink-0 group-hover:!text-primary" />}
                  label="จัดการข้อความ"
                />
                <NavItem
                  to="/admin/report-permission"
                  icon={<IconUserPlus className="shrink-0 group-hover:!text-primary" />}
                  label="สิทธิ์การเข้าถึง"
                />
              </div>
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default SidebarDemo;
