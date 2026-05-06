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
import { ICurriculum, IUserData } from '@domain/g00/g00-d00/local/type';
import IconfileTitle from '@core/design-system/library/component/icon/IconfileTitle';
import IconFileText1 from '@core/design-system/library/component/icon/IconFileText1';
import IconMessageSquare from '@core/design-system/library/component/icon/IconMessageSquare';
import config from '@core/config';

const SidebarDev = () => {
  const [currentMenu, setCurrentMenu] = useState<string>('dashboard');
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

  useEffect(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]',
    );

    if (selector) {
      selector.classList.add('active');
      const ul = selector.closest('ul.sub-menu');
      if (ul) {
        const ele = ul.closest('li.menu')?.querySelectorAll('.link');
        if (ele && ele.length) {
          setTimeout(() => {
            (ele[0] as HTMLElement).click();
          });
        }
      }
    }
  }, []);

  const { curriculumData }: { curriculumData: ICurriculum } = StoreGlobalPersist.StateGet(
    ['curriculumData'],
  );
  const { isLoginAs } = StoreGlobalPersist.StateGet(['isLoginAs']);
  const { userData }: { userData: IUserData } = StoreGlobalPersist.StateGet(['userData']);

  const [debugActive, setDebugActive] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);

  useEffect(() => {
    const storedDebugMode = localStorage.getItem('debugMode') === 'true';
    setDebugActive(storedDebugMode);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift' && !shiftPressed) {
        setShiftPressed(true);

        const hasDebugMode = localStorage.getItem('debugMode') === 'true';

        if (hasDebugMode) {
          const newDebugState = !debugActive;
          setDebugActive(newDebugState);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftPressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [debugActive, shiftPressed]);

  const role = debugActive
    ? [1, 2, 3, 4, 5, 6, 7, 8]
    : isLoginAs
      ? [6] // ถ้า loginAs เป็น true ให้ใช้ role ครู (6)
      : userData?.roles || [];

  const teacherRoles = userData?.teacher_roles;

  useEffect(() => {
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      StoreVristoPersist.MethodGet().sidebarToggle();
    }
  }, [location]);

  return (
    <div className={semidark ? 'dark' : ''}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] font-noto-sans-thai shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
      >
        <div className="h-full bg-white dark:bg-black">
          <div className="flex items-center justify-between px-4 py-3">
            <img className="w-[200px]" src={logo} alt="logo" />
            <button
              title="Toggle Sidebar"
              type="button"
              className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
              onClick={() => StoreVristoPersist.MethodGet().sidebarToggle()}
            >
              <IconArrowLeft className="m-auto" />
            </button>
          </div>
          <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
            <ul className="relative h-full space-y-0.5 overflow-y-auto p-4 py-0 font-semibold">
              {(role.includes(1) ||
                role.includes(4) ||
                role.includes(6) ||
                role.includes(1) ||
                (role.includes(2) && curriculumData)) && (
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
                      <IconArrowDown />
                    </div>
                  </button>

                  <AnimateHeight
                    duration={300}
                    height={currentMenu === 'dashboard' ? 'auto' : 0}
                  >
                    <ul className="sub-menu -ml-5 text-gray-500">
                      {(role.includes(1) || role.includes(4)) && (
                        <>
                          <li>
                            <Link to="/admin/report/progress-dashboard">
                              {t('รายงานความก้าวหน้า')}
                            </Link>
                          </li>
                          <li>
                            <Link to="/admin/report/provincial-dashboard">
                              {t('ภาพรวมจังหวัด')}
                            </Link>
                          </li>
                          <li>
                            <Link to="/admin/report/school-stat">
                              {t('รายงานระดับโรงเรียน')}
                            </Link>
                          </li>
                          <li>
                            <Link to="/admin/report/overall-statistics-summary">
                              {t('สรุปสถิติทั้งหมด')}
                            </Link>
                          </li>
                        </>
                      )}
                      {/* {role.includes(2) && (
                        <li>
                          <Link to="/admin/dashboard">{t('<แอดมิน: สถิติทั้งหมด>')}</Link>
                        </li>
                      )} */}
                      {role.includes(6) && (
                        <li>
                          <Link to="/teacher/dashboard">{t('ภาพรวมนักเรียน')}</Link>
                        </li>
                      )}
                      {/* {role.includes(8) && (
                        <li>
                          <Link to="/parant/dashboard">
                            {t('<ผู้ปกครอง/นักเรียน: สถิติรวมทุกวิชา>')}
                          </Link>
                        </li>
                      )}
                      {role.includes(4) && (
                        <li>
                          <Link to="/observer">
                            {t('<ผู้สังเกตการณ์: แยกระดับการมองเห็น>')}
                          </Link>
                        </li>
                      )} */}
                    </ul>
                  </AnimateHeight>
                </li>
              )}
              {role.includes(1) && (
                <>
                  <SectionHeader title="จัดการแอปพลิเคชัน" />
                  {/* <NavItem
                    to="/iconpreview"
                    icon={
                      <IconPaperclip className="shrink-0 group-hover:!text-primary" />
                    }
                    label="Icon Preview"
                  />
                  <NavItem
                    to="/components"
                    icon={
                      <IconPaperclip className="shrink-0 group-hover:!text-primary" />
                    }
                    label="components Preview"
                  /> */}
                  <NavItem
                    to="/admin/affiliation"
                    icon={<IconFile className="shrink-0 group-hover:!text-primary" />}
                    label="สังกัดโรงเรียน / สัญญา"
                  />
                  <NavItem
                    to="/admin/year"
                    icon={
                      <IconFileText1 className="shrink-0 group-hover:!text-primary" />
                    }
                    label="ชั้นปี"
                  />
                  <NavItem
                    to="/admin/curriculum"
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
                  <NavItem
                    to="/admin/report-permission"
                    icon={<IconUserPlus className="shrink-0 group-hover:!text-primary" />}
                    label="สิทธิ์การเข้าถึง"
                  />
                  {/* <NavItem
                    to="/bug-report"
                    icon={<IconError className="shrink-0 group-hover:!text-primary" />}
                    label="แจ้งปัญหาการใช้งาน"
                  /> */}
                  <NavItem
                    to="/admin/how-to-use"
                    icon={<IconError className="shrink-0 group-hover:!text-primary" />}
                    label="วิธีการใช้งาน"
                  />
                </>
              )}

              {/* Grade System */}
              {/* // TODO_GRADE: remove debugActive to show grade menu on production */}
              {role.includes(6) && (
                <>
                  {teacherRoles?.length > 0 && <SectionHeader title="ระบบตัดเกรด" />}
                  {teacherRoles?.includes(1) && (
                    <NavItem
                      to="/grade-system/template"
                      icon={<IconFile className="shrink-0 group-hover:!text-primary" />}
                      label="จัดการ Template"
                    />
                  )}
                  {teacherRoles?.includes(1) && (
                    <NavItem
                      to="/grade-system/setting"
                      icon={<IconFile className="shrink-0 group-hover:!text-primary" />}
                      label="ตั้งค่าระบบ"
                    />
                  )}
                  {teacherRoles?.includes(2) && (
                    <NavItem
                      to="/grade-system/evaluation"
                      icon={<IconFile className="shrink-0 group-hover:!text-primary" />}
                      label="จัดการใบประเมิน"
                    />
                  )}
                  {teacherRoles?.includes(3) && (
                    <NavItem
                      to="/grade-system/data-entry"
                      icon={<IconFile className="shrink-0 group-hover:!text-primary" />}
                      label="กรอกใบประเมิน"
                    />
                  )}
                </>
              )}

              {role.includes(6) && (
                <>
                  <SectionHeader title="การเรียนการสอน" />
                  <NavItem
                    to="/teacher/student-group"
                    icon={<IconGroup className="shrink-0 group-hover:!text-primary" />}
                    label="กลุ่มเรียน"
                  />
                  <NavItem
                    to="/teacher/student/all-student"
                    icon={<IconUser className="shrink-0 group-hover:!text-primary" />}
                    label="นักเรียน"
                  />
                  <NavItem
                    to="/teacher/lesson"
                    icon={<IconBook className="shrink-0 group-hover:!text-primary" />}
                    label="จัดการบทเรียน"
                  />
                  <NavItem
                    to="/teacher/homework/homework"
                    icon={<IconBookmark className="shrink-0 group-hover:!text-primary" />}
                    label="การบ้าน"
                  />
                  <NavItem
                    to="/teacher/reward"
                    icon={<IconReward className="shrink-0 group-hover:!text-primary" />}
                    label="จัดการรางวัล"
                  />
                  <NavItem
                    to="/teacher/chat"
                    icon={
                      <IconMessageSquare className="shrink-0 group-hover:!text-primary" />
                    }
                    label="แชทครู"
                  />
                  {/* <NavItem
                    to="/teacher/item"
                    icon={<IconFolder className="shrink-0 group-hover:!text-primary" />}
                    label="จัดการไอเทม"
                  />
                  <NavItem
                    to="/teacher/shop"
                    icon={<IconFolder className="shrink-0 group-hover:!text-primary" />}
                    label="จัดการร้านค้า"
                  /> */}
                  <NavItem
                    to="/teacher/announcement"
                    icon={<IconVolume className="shrink-0 group-hover:!text-primary" />}
                    label="ประกาศ"
                  />
                  {/* <NavItem
                    to="/bug-report"
                    icon={<IconError className="shrink-0 group-hover:!text-primary" />}
                    label="แจ้งปัญหาการใช้งาน"
                  /> */}
                  <NavItem
                    to="/teacher/how-to-use"
                    icon={<IconError className="shrink-0 group-hover:!text-primary" />}
                    label="วิธีการใช้งาน"
                  />
                </>
              )}
              {(role.includes(1) || role.includes(2)) && (
                <>
                  <SectionHeader title="เกี่ยวกับหลักสูตร" />
                  <NavItem
                    to="/curriculum"
                    icon={<IconServer className="shrink-0 group-hover:!text-primary" />}
                    label="สังกัดวิชาของคุณ"
                  />
                </>
              )}
              {curriculumData && (role.includes(1) || role.includes(2)) && (
                <>
                  <NavItem
                    to="/content-creator/standard/learning-area"
                    icon={<IconBarChart className="shrink-0 group-hover:!text-primary" />}
                    label="มาตรฐานหลัก"
                  />
                  <NavItem
                    to="/content-creator/standard/sub-standard"
                    icon={<IconBarChart className="shrink-0 group-hover:!text-primary" />}
                    label="มาตรฐานย่อย"
                  />
                  <NavItem
                    to="/content-creator/course"
                    icon={<IconBook className="shrink-0 group-hover:!text-primary" />}
                    label="หลักสูตร"
                  />
                  <NavItem
                    to="/content-creator/lesson"
                    icon={<IconBook className="shrink-0 group-hover:!text-primary" />}
                    label="บทเรียน"
                  />
                  <ul className="sub-menu -ml-5 pl-4 text-gray-500">
                    <li>
                      <Link
                        to="/content-creator/lesson"
                        onClick={(event) => event.preventDefault()}
                        disabled={true}
                        className="pointer-events-none"
                      >
                        {t('บทเรียนหลัก')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/content-creator/sublesson"
                        onClick={(event) => event.preventDefault()}
                        disabled={true}
                        className="pointer-events-none"
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
                  </ul>

                  {/* Grade System */}
                  <NavItem
                    to="/content-creator/grade-template"
                    icon={<IconFile className="shrink-0 group-hover:!text-primary" />}
                    label="จัดการเกณฑ์ใบตัดเกรด"
                  />

                  <NavItem
                    to="/content-creator/translation"
                    icon={<IconActivity className="shrink-0 group-hover:!text-primary" />}
                    label="จัดการข้อความ"
                  />
                  {/* <NavItem
                    to="/bug-report"
                    icon={<IconError className="shrink-0 group-hover:!text-primary" />}
                    label="แจ้งปัญหาการใช้งาน"
                  /> */}
                  <NavItem
                    to="/content-creator/how-to-use"
                    icon={<IconError className="shrink-0 group-hover:!text-primary" />}
                    label="วิธีการใช้งาน"
                  />
                </>
              )}
              {(role.includes(3) || role.includes(1)) && (
                <>
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
                </>
              )}
              {role.includes(3) && (
                <>
                  <SectionHeader title="จัดการเกม" />
                  <NavItem
                    to="/gamemaster/chat-config"
                    icon={<IconFolder className="shrink-0 group-hover:!text-primary" />}
                    label="ตั้งค่าแชท"
                  />
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
                  {/* <NavItem
                    to="/gamemaster/bug-report"
                    icon={<IconError className="shrink-0 group-hover:!text-primary" />}
                    label="ปัญหาการใช้งาน"
                  /> */}
                  <NavItem
                    to="/gamemaster/how-to-use"
                    icon={<IconError className="shrink-0 group-hover:!text-primary" />}
                    label="วิธีการใช้งาน"
                  />
                </>
              )}
              {role.includes(8) && (
                <>
                  <SectionHeader title="ผู้ปกครอง" />
                  <NavItem
                    to="/line/parent/clever/dashboard/choose-student"
                    icon={<IconPieChart className="shrink-0 group-hover:!text-primary" />}
                    label="ภาพรวม"
                    context="dashboard"
                  />
                  <NavItem
                    to="/line/parent/clever/homework/choose-student"
                    icon={<IconBookmark className="shrink-0 group-hover:!text-primary" />}
                    label="การบ้าน"
                    context="homework"
                  />
                  <NavItem
                    to="/line/parent/choose-student"
                    icon={<IconBook className="shrink-0 group-hover:!text-primary" />}
                    label="บทเรียน"
                    context="lesson"
                  />
                  <NavItem
                    to="/line/parent/family"
                    icon={<IconGroup className="shrink-0 group-hover:!text-primary" />}
                    label="ครอบครัว"
                  />
                  <NavItem
                    to="/line/parent/clever/announcement/choose-student"
                    icon={<IconVolume className="shrink-0 group-hover:!text-primary" />}
                    label="ประกาศ"
                    context="announcement"
                  />
                  <NavItem
                    to="/line/parent/clever/bug-report"
                    icon={<IconError className="shrink-0 group-hover:!text-primary" />}
                    label="รายงาน"
                  />
                </>
              )}
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default SidebarDev;
