import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import AnimateHeight from 'react-animate-height';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMinus from '../Icon/IconMinus';

import { Link, useLocation } from '@tanstack/react-router';
import StoreVristoPersist, { IStoreVristoPersist } from '@store/global/vristo-persist';
import IconPaperclip from '../Icon/IconPaperclip';

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

import SectionHeader from './Sidebar/SectionHeader';
import NavItem from './Sidebar/NavItem';

const Sidebar = () => {
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
              <img
                className="ml-[5px] w-8 flex-none"
                src="/assets/images/logo.svg"
                alt="logo"
              />
              <span className="align-middle text-2xl font-semibold lg:inline ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light">
                {t('VRISTO')}
              </span>
            </Link>

            <button
              title="Toggle Sidebar"
              type="button"
              className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
              onClick={() => StoreVristoPersist.MethodGet().sidebarToggle()}
            >
              <IconCaretsDown className="m-auto rotate-90" />
            </button>
          </div>
          {/* @ts-ignore */}
          <PerfectScrollbar className="relative h-[calc(100vh-80px)] overflow-y-auto">
            <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
              <li className="menu nav-item">
                <button
                  type="button"
                  className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`}
                  onClick={() => toggleMenu('dashboard')}
                >
                  <div className="flex items-center">
                    <IconBarChart />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t('รายงาน')}
                    </span>
                  </div>
                  <div
                    className={
                      currentMenu !== 'dashboard' ? '-rotate-90 rtl:rotate-90' : ''
                    }
                  >
                    <IconCaretDown />
                  </div>
                </button>

                <AnimateHeight
                  duration={300}
                  height={currentMenu === 'dashboard' ? 'auto' : 0}
                >
                  <ul className="sub-menu -ml-5 text-gray-500">
                    <li>
                      <Link to="/admin/report/progress-dashboard">
                        {t('รายงานความก้าวหน้า')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/teacher/dashboard">
                        {t('<ครู: วิชาที่รับผิดชอบและนร.ที่ดูแล>')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/parant/dashboard">
                        {t('<ผู้ปกครอง/นักเรียน: สถิติรวมทุกวิชา>')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/dashboard">{t('<แอดมิน: สิถิติทั้งหมด>')}</Link>
                    </li>
                    <li>
                      <Link to="/observer">
                        {t('<ผู้สังเกตการณ์: แยกระดับการมองเห็น>')}
                      </Link>
                    </li>
                  </ul>
                </AnimateHeight>
              </li>

              <div>
                <SectionHeader title="จัดการแอปพลิเคชั่น" />
                <NavItem
                  to="/"
                  icon={<IconPaperclip className="shrink-0 group-hover:!text-primary" />}
                  label="Icon Preview"
                />
                <NavItem
                  to="/components"
                  icon={<IconPaperclip className="shrink-0 group-hover:!text-primary" />}
                  label="components Preview"
                />
                <NavItem
                  to="/admin/affiliation"
                  icon={<IconFile className="shrink-0 group-hover:!text-primary" />}
                  label="สังกัดโรงเรียน / สัญญา"
                />
                <NavItem
                  to="/admin/report-permission"
                  icon={<IconBook className="shrink-0 group-hover:!text-primary" />}
                  label="สังกัดวิชา"
                />
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
                <NavItem
                  to="/admin/translation"
                  icon={<IconActivity className="shrink-0 group-hover:!text-primary" />}
                  label="จัดการข้อความ"
                />
              </div>

              <div>
                <SectionHeader title="ระบบตัดเกรด" />
                <NavItem
                  to="/grade-system/template"
                  icon={<IconFile className="shrink-0 group-hover:!text-primary" />}
                  label="จัดการใบประเมิน (Admin)"
                />
                <NavItem
                  to="/grade-system/evaluation-form"
                  icon={<IconFile className="shrink-0 group-hover:!text-primary" />}
                  label="ใบประเมินรายวิชา/รายห้อง"
                />
                <NavItem
                  to="/grade-system/setting"
                  icon={<IconFile className="shrink-0 group-hover:!text-primary" />}
                  label="ตั้งค่าระบบ (Admin)"
                />
              </div>

              <div>
                <SectionHeader title="การเรียนการสอน" />
                <NavItem
                  to="/teacher/student-group"
                  icon={<IconGroup className="shrink-0 group-hover:!text-primary" />}
                  label="กลุ่มเรียน"
                />
                <NavItem
                  to="/teacher/student"
                  icon={<IconUser className="shrink-0 group-hover:!text-primary" />}
                  label="นักเรียน"
                />
                <NavItem
                  to="/teacher/lesson"
                  icon={<IconBook className="shrink-0 group-hover:!text-primary" />}
                  label="จัดการบทเรียน"
                />
                <NavItem
                  to="/teacher/"
                  icon={
                    <IconImportContacts className="shrink-0 group-hover:!text-primary" />
                  }
                  label="ใบงาน"
                />
                <li className="menu nav-item">
                  <div className="flex items-center px-2.5 py-2.5">
                    <IconBookmark className="shrink-0 group-hover:!text-primary" />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t('การบ้าน')}
                    </span>
                  </div>
                </li>
                <ul className="sub-menu -ml-5 pl-4 text-gray-500">
                  <li>
                    <Link to="/homework/template">{t('Template')}</Link>
                  </li>
                  <li>
                    <Link to="/homework/homework">{t('การบ้าน')}</Link>
                  </li>
                </ul>
                <NavItem
                  to="/teacher/reward"
                  icon={<IconReward className="shrink-0 group-hover:!text-primary" />}
                  label="การให้รางวัลครู"
                />
                <NavItem
                  to="/teacher/chat"
                  icon={<IconReward className="shrink-0 group-hover:!text-primary" />}
                  label="แชทนักเรียน"
                />
                <NavItem
                  to="/teacher/item"
                  icon={<IconFolder className="shrink-0 group-hover:!text-primary" />}
                  label="จัดการไอเทม"
                />
                <NavItem
                  to="/teacher/shop"
                  icon={<IconFolder className="shrink-0 group-hover:!text-primary" />}
                  label="จัดการร้านค้า"
                />
                <NavItem
                  to="/teacher/announcement"
                  icon={<IconVolume className="shrink-0 group-hover:!text-primary" />}
                  label="ประกาศ"
                />
              </div>

              <div>
                <SectionHeader title="สังเกตการเรียน" />
                <NavItem
                  to="/ovserver/family"
                  icon={<IconGroup className="shrink-0 group-hover:!text-primary" />}
                  label="จัดการบัญชีครอบครัว"
                />
                <NavItem
                  to="/ovserver/student"
                  icon={<IconBook className="shrink-0 group-hover:!text-primary" />}
                  label="ข้อมูลนักเรียน"
                />
                <NavItem
                  to="/ovserver/homework"
                  icon={<IconBookmark className="shrink-0 group-hover:!text-primary" />}
                  label="ข้อมูลการบ้าน"
                />
                <NavItem
                  to="/ovserver/tester"
                  icon={
                    <IconImportContacts className="shrink-0 group-hover:!text-primary" />
                  }
                  label="ข้อมูลแบบทดสอบ"
                />
                <NavItem
                  to="/ovserver/reward"
                  icon={<IconReward className="shrink-0 group-hover:!text-primary" />}
                  label="การให้รางวัลโดยผู้ปกครอง"
                />
              </div>

              <div>
                <SectionHeader title="เกี่ยวกับหลักสูตร" />
                <NavItem
                  to="/curriculum"
                  icon={<IconServer className="shrink-0 group-hover:!text-primary" />}
                  label="สังกัดวิชาของคุณ"
                />
                <NavItem
                  to="/content-creator/standard/learning-area"
                  icon={<IconBarChart className="shrink-0 group-hover:!text-primary" />}
                  label="มาตรฐานหลัก"
                />
                <li className="menu nav-item">
                  <div className="flex items-center px-2.5 py-2.5">
                    <IconBarChart className="shrink-0 group-hover:!text-primary" />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t('มาตรฐานย่อย')}
                    </span>
                  </div>
                </li>
                <ul className="sub-menu -ml-5 pl-4 text-gray-500">
                  <li>
                    <Link to="/content-creator/standard/sub-standard">
                      {t('มาตรฐานย่อย 1')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/content-creator/standard/2">{t('มาตรฐานย่อย 2')}</Link>
                  </li>
                  <li>
                    <Link to="/content-creator/standard/3">{t('มาตรฐานย่อย 3')}</Link>
                  </li>
                </ul>
                <NavItem
                  to="/bloom"
                  icon={<IconBarChart className="shrink-0 group-hover:!text-primary" />}
                  label="จัดการทฤษฎีการวัดพฤติกรรม (Bloom)"
                />
                <NavItem
                  to="/content-creator/course"
                  icon={<IconBook className="shrink-0 group-hover:!text-primary" />}
                  label="หลักสูตร"
                />
                <li className="menu nav-item">
                  <div className="flex items-center px-2.5 py-2.5">
                    <IconBook className="shrink-0 group-hover:!text-primary" />
                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                      {t('บทเรียน')}
                    </span>
                  </div>
                </li>
                <ul className="sub-menu -ml-5 pl-4 text-gray-500">
                  <li>
                    <Link to="/content-creator/lesson">{t('บทเรียนหลัก')}</Link>
                  </li>
                  <li>
                    <Link to="/content-creator/sublesson">{t('บทเรียนย่อย')}</Link>
                  </li>
                  <li>
                    <Link to="/content-creator/level">{t('ข้อมูลด่าน')}</Link>
                  </li>
                  <li>
                    <Link to="/content-creator/special-reward">{t('รางวัลพิเศษ')}</Link>
                  </li>
                </ul>
                <NavItem
                  to="/content-creator/translation"
                  icon={<IconActivity className="shrink-0 group-hover:!text-primary" />}
                  label="จัดการข้อความ"
                />
              </div>

              <div>
                <SectionHeader title="รายงานและการประกาศ" />
                <NavItem
                  to="/gamemaster/announcement"
                  icon={<IconVolume className="shrink-0 group-hover:!text-primary" />}
                  label="การประกาศ"
                />
                <NavItem
                  to="/gamemaster/redeem"
                  icon={<IconPieChart className="shrink-0 group-hover:!text-primary" />}
                  label="ข้อมูลการตลาด"
                />
              </div>

              <div>
                <SectionHeader title="ตั้งค่าแชท" />
                <NavItem
                  to="/gamemaster/item"
                  icon={<IconFolder className="shrink-0 group-hover:!text-primary" />}
                  label="จัดการไอเทม"
                />
                <NavItem
                  to="/gamemaster/shop"
                  icon={<IconFolder className="shrink-0 group-hover:!text-primary" />}
                  label="จัดการร้านค้า"
                />
                <NavItem
                  to="/gamemaster/gamification"
                  icon={<IconFolder className="shrink-0 group-hover:!text-primary" />}
                  label="จัดการรางวัลด่าน"
                />
                <NavItem
                  to="/gamemaster/bug-report"
                  icon={<IconError className="shrink-0 group-hover:!text-primary" />}
                  label="แจ้งปัญหาการใช้งาน"
                />
                <NavItem
                  to="/gamemaster/howtouse"
                  icon={<IconError className="shrink-0 group-hover:!text-primary" />}
                  label="วิธีการใช้งาน"
                />
              </div>
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
