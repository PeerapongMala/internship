import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import Dropdown from '../Dropdown';
import IconMenu from '../Icon/IconMenu';
import IconCalendar from '../Icon/IconCalendar';
import IconEdit from '../Icon/IconEdit';
import IconChatNotification from '../Icon/IconChatNotification';
import IconSearch from '../Icon/IconSearch';
import IconXCircle from '../Icon/IconXCircle';
import IconSun from '../Icon/IconSun';
import IconMoon from '../Icon/IconMoon';
import IconLaptop from '../Icon/IconLaptop';
import IconMailDot from '../Icon/IconMailDot';
import IconArrowLeft from '../Icon/IconArrowLeft';
import IconInfoCircle from '../Icon/IconInfoCircle';
import IconBellBing from '../Icon/IconBellBing';
import IconUser from '../Icon/IconUser';
import IconMail from '../Icon/IconMail';
import IconLockDots from '../Icon/IconLockDots';
import IconLogout from '../Icon/IconLogout';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuApps from '../Icon/Menu/IconMenuApps';
import IconMenuComponents from '../Icon/Menu/IconMenuComponents';
import IconMenuElements from '../Icon/Menu/IconMenuElements';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import IconMenuPages from '../Icon/Menu/IconMenuPages';
import IconMenuMore from '../Icon/Menu/IconMenuMore';
import { Link, useLocation } from '@tanstack/react-router';
import StoreVristoPersist, { IStoreVristoPersist } from '@store/global/vristo-persist';

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
  const themeConfig = { theme, semidark, sidebar, rtlClass, locale, menu, languageList };

  const isRtl = rtlClass === 'rtl' ? true : false;

  function createMarkup(messages: any) {
    return { __html: messages };
  }
  const [messages, setMessages] = useState([
    {
      id: 1,
      image:
        '<span className="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
      title: 'Congratulations!',
      message: 'Your OS has been updated.',
      time: '1hr',
    },
    {
      id: 2,
      image:
        '<span className="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg g xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>',
      title: 'Did you know?',
      message: 'You can switch between artboards.',
      time: '2hr',
    },
    {
      id: 3,
      image:
        '<span className="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>',
      title: 'Something went wrong!',
      message: 'Send Reposrt',
      time: '2days',
    },
    {
      id: 4,
      image:
        '<span className="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>',
      title: 'Warning',
      message: 'Your password strength is low.',
      time: '5days',
    },
  ]);

  const removeMessage = (value: number) => {
    setMessages(messages.filter((user) => user.id !== value));
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      profile: 'user-profile.jpeg',
      message:
        '<strong className="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
      time: '45 min ago',
    },
    {
      id: 2,
      profile: 'profile-34.jpeg',
      message:
        '<strong className="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
      time: '9h Ago',
    },
    {
      id: 3,
      profile: 'profile-16.jpeg',
      message: '<strong className="text-sm mr-1">Anna Morgan</strong>Upload a file',
      time: '9h Ago',
    },
  ]);

  const removeNotification = (value: number) => {
    setNotifications(notifications.filter((user) => user.id !== value));
  };

  const [search, setSearch] = useState(false);

  const setLocale = (flag: string) => {
    setFlag(flag);
    if (flag.toLowerCase() === 'ae') {
      StoreVristoPersist.MethodGet().rtlToggle('rtl');
    } else {
      StoreVristoPersist.MethodGet().rtlToggle('ltr');
    }
  };
  const [flag, setFlag] = useState(themeConfig.locale);

  const { t } = useTranslation();

  return (
    <header
      className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}
    >
      <div className="shadow-sm">
        <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
          <div className="horizontal-logo flex items-center justify-between lg:hidden ltr:mr-2 rtl:ml-2">
            <Link to="/" className="main-logo flex shrink-0 items-center">
              <img
                className="inline w-8 ltr:-ml-1 rtl:-mr-1"
                src="/assets/images/logo.svg"
                alt="logo"
              />
              <span className="hidden align-middle text-2xl font-semibold transition-all duration-300 md:inline ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light">
                VRISTO
              </span>
            </Link>
            <button
              title="Menu"
              type="button"
              className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary lg:hidden ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary"
              onClick={() => {
                StoreVristoPersist.MethodGet().sidebarToggle();
              }}
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>

          <div className="hidden sm:block ltr:mr-2 rtl:ml-2">
            <ul className="flex items-center space-x-2 rtl:space-x-reverse dark:text-[#d0d2d6]">
              <li>
                <Link
                  to="/apps/calendar"
                  className="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                >
                  <IconCalendar />
                </Link>
              </li>
              <li>
                <Link
                  to="/apps/todolist"
                  className="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                >
                  <IconEdit />
                </Link>
              </li>
              <li>
                <Link
                  to="/apps/chat"
                  className="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60"
                >
                  <IconChatNotification />
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex items-center space-x-1.5 sm:flex-1 lg:space-x-2 ltr:ml-auto ltr:sm:ml-0 rtl:mr-auto rtl:space-x-reverse sm:rtl:mr-0 dark:text-[#d0d2d6]">
            <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
              <form
                className={`${search && '!block'} absolute inset-x-0 top-1/2 z-10 mx-4 hidden -translate-y-1/2 sm:relative sm:top-0 sm:mx-0 sm:block sm:translate-y-0`}
                onSubmit={() => setSearch(false)}
              >
                <div className="relative">
                  <input
                    type="text"
                    className="peer form-input bg-gray-100 placeholder:tracking-widest sm:bg-transparent ltr:pl-9 ltr:pr-9 ltr:sm:pr-4 rtl:pl-9 rtl:pr-9 rtl:sm:pl-4"
                    placeholder="Search..."
                  />
                  <button
                    title="Search"
                    type="button"
                    className="absolute inset-0 h-9 w-9 appearance-none peer-focus:text-primary ltr:right-auto rtl:left-auto"
                  >
                    <IconSearch className="mx-auto" />
                  </button>
                  <button
                    title="Close"
                    type="button"
                    className="absolute top-1/2 block -translate-y-1/2 hover:opacity-80 sm:hidden ltr:right-2 rtl:left-2"
                    onClick={() => setSearch(false)}
                  >
                    <IconXCircle />
                  </button>
                </div>
              </form>
              <button
                title="Search"
                type="button"
                onClick={() => setSearch(!search)}
                className="search_btn rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 sm:hidden dark:bg-dark/40 dark:hover:bg-dark/60"
              >
                <IconSearch className="mx-auto h-4.5 w-4.5 dark:text-[#d0d2d6]" />
              </button>
            </div>
            <div>
              {themeConfig.theme === 'light' ? (
                <button
                  className={`${
                    themeConfig.theme === 'light' &&
                    'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
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
                  className={`${
                    themeConfig.theme === 'dark' &&
                    'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
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
                  className={`${
                    themeConfig.theme === 'system' &&
                    'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                  }`}
                  onClick={() => {
                    StoreVristoPersist.MethodGet().themeToggle('light');
                  }}
                >
                  <IconLaptop />
                </button>
              )}
            </div>
            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                  <img
                    className="h-5 w-5 rounded-full object-cover"
                    src={`/assets/images/flags/${flag.toUpperCase()}.svg`}
                    alt="flag"
                  />
                }
              >
                <ul className="grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                  {themeConfig.languageList.map((item: any) => {
                    return (
                      <li key={item.code}>
                        <button
                          type="button"
                          className={`flex w-full rounded-lg hover:text-primary ${i18next.language === item.code ? 'bg-primary/10 text-primary' : ''}`}
                          onClick={() => {
                            i18next.changeLanguage(item.code);
                            // setFlag(item.code);
                            setLocale(item.code);
                          }}
                        >
                          <img
                            src={`/assets/images/flags/${item.code.toUpperCase()}.svg`}
                            alt="flag"
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Dropdown>
            </div>
            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={<IconMailDot />}
              >
                <ul className="w-[300px] !py-0 text-xs text-dark sm:w-[375px] dark:text-white-dark">
                  <li className="mb-5" onClick={(e) => e.stopPropagation()}>
                    <div className="relative !h-[68px] w-full overflow-hidden rounded-t-md p-5 text-white hover:!bg-transparent">
                      <div
                        className="bg- absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url('/assets/images/menu-heade.jpg')`,
                          backgroundRepeat: 'no-repeat',
                          width: '100%',
                          height: '100%',
                        }}
                      ></div>
                      <h4 className="relative z-10 text-lg font-semibold">Messages</h4>
                    </div>
                  </li>
                  {messages.length > 0 ? (
                    <>
                      <li onClick={(e) => e.stopPropagation()}>
                        {messages.map((message) => {
                          return (
                            <div key={message.id} className="flex items-center px-5 py-3">
                              <div
                                dangerouslySetInnerHTML={createMarkup(message.image)}
                              ></div>
                              <span className="px-3 dark:text-gray-500">
                                <div className="text-sm font-semibold dark:text-white-light/90">
                                  {message.title}
                                </div>
                                <div>{message.message}</div>
                              </span>
                              <span className="whitespace-pre rounded bg-white-dark/20 px-1 font-semibold text-dark/60 ltr:ml-auto ltr:mr-2 rtl:ml-2 rtl:mr-auto dark:text-white-dark">
                                {message.time}
                              </span>
                              <button
                                type="button"
                                className="text-neutral-300 hover:text-danger"
                                onClick={() => removeMessage(message.id)}
                              >
                                <IconXCircle />
                              </button>
                            </div>
                          );
                        })}
                      </li>
                      <li className="mt-5 border-t border-white-light text-center dark:border-white/10">
                        <button
                          type="button"
                          className="group !h-[48px] justify-center !py-4 font-semibold text-primary dark:text-gray-400"
                        >
                          <span className="group-hover:underline ltr:mr-1 rtl:ml-1">
                            VIEW ALL ACTIVITIES
                          </span>
                          <IconArrowLeft className="transition duration-300 group-hover:translate-x-1 ltr:ml-1 rtl:mr-1" />
                        </button>
                      </li>
                    </>
                  ) : (
                    <li className="mb-5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent"
                      >
                        <div className="mx-auto mb-4 rounded-full text-primary ring-4 ring-primary/30">
                          <IconInfoCircle fill={true} className="h-10 w-10" />
                        </div>
                        No data available.
                      </button>
                    </li>
                  )}
                </ul>
              </Dropdown>
            </div>
            <div className="dropdown shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                button={
                  <span>
                    <IconBellBing />
                    <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                      <span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
                      <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
                    </span>
                  </span>
                }
              >
                <ul className="w-[300px] divide-y !py-0 text-dark sm:w-[350px] dark:divide-white/10 dark:text-white-dark">
                  <li onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-4 py-2 font-semibold">
                      <h4 className="text-lg">Notification</h4>
                      {notifications.length ? (
                        <span className="badge bg-primary/80">
                          {notifications.length}New
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  </li>
                  {notifications.length > 0 ? (
                    <>
                      {notifications.map((notification) => {
                        return (
                          <li
                            key={notification.id}
                            className="dark:text-white-light/90"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="group flex items-center px-4 py-2">
                              <div className="grid place-content-center rounded">
                                <div className="relative h-12 w-12">
                                  <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    alt="profile"
                                    src={`/assets/images/${notification.profile}`}
                                  />
                                  <span className="absolute bottom-0 right-[6px] block h-2 w-2 rounded-full bg-success"></span>
                                </div>
                              </div>
                              <div className="flex flex-auto ltr:pl-3 rtl:pr-3">
                                <div className="ltr:pr-3 rtl:pl-3">
                                  <h6
                                    dangerouslySetInnerHTML={{
                                      __html: notification.message,
                                    }}
                                  ></h6>
                                  <span className="block text-xs font-normal dark:text-gray-500">
                                    {notification.time}
                                  </span>
                                </div>
                                <button
                                  title="Remove"
                                  type="button"
                                  className="text-neutral-300 opacity-0 hover:text-danger group-hover:opacity-100 ltr:ml-auto rtl:mr-auto"
                                  onClick={() => removeNotification(notification.id)}
                                >
                                  <IconXCircle />
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                      <li>
                        <div className="p-4">
                          <button className="btn btn-primary btn-small block w-full">
                            Read All Notifications
                          </button>
                        </div>
                      </li>
                    </>
                  ) : (
                    <li onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent"
                      >
                        <div className="mx-auto mb-4 rounded-full text-primary ring-4 ring-primary/30">
                          <IconInfoCircle fill={true} className="h-10 w-10" />
                        </div>
                        No data available.
                      </button>
                    </li>
                  )}
                </ul>
              </Dropdown>
            </div>
            <div className="dropdown flex shrink-0">
              <Dropdown
                offset={[0, 8]}
                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                btnClassName="relative group block"
                button={
                  <img
                    className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100"
                    src="/assets/images/user-profile.jpeg"
                    alt="userProfile"
                  />
                }
              >
                <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                  <li>
                    <div className="flex items-center px-4 py-4">
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src="/assets/images/user-profile.jpeg"
                        alt="userProfile"
                      />
                      <div className="truncate ltr:pl-4 rtl:pr-4">
                        <h4 className="text-base">
                          John Doe
                          <span className="rounded bg-success-light px-1 text-xs text-success ltr:ml-2 rtl:ml-2">
                            Pro
                          </span>
                        </h4>
                        <button
                          type="button"
                          className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"
                        >
                          johndoe@gmail.com
                        </button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link to="/users/profile" className="dark:hover:text-white">
                      <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/apps/mailbox" className="dark:hover:text-white">
                      <IconMail className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                      Inbox
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth/boxed-lockscreen" className="dark:hover:text-white">
                      <IconLockDots className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                      Lock Screen
                    </Link>
                  </li>
                  <li className="border-t border-white-light dark:border-white-light/10">
                    <Link to="/auth/boxed-signin" className="!py-3 text-danger">
                      <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
                      Sign Out
                    </Link>
                  </li>
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* horizontal menu */}
        <ul className="horizontal-menu hidden border-t border-[#ebedf2] bg-white px-6 py-1.5 font-semibold text-black lg:space-x-1.5 xl:space-x-8 rtl:space-x-reverse dark:border-[#191e3a] dark:bg-black dark:text-white-dark">
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuDashboard className="shrink-0" />
                <span className="px-1">{t('dashboard')}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link to="/">{t('sales')}</Link>
              </li>
              <li>
                <Link to="/analytics">{t('analytics')}</Link>
              </li>
              <li>
                <Link to="/finance">{t('finance')}</Link>
              </li>
              <li>
                <Link to="/crypto">{t('crypto')}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuApps className="shrink-0" />
                <span className="px-1">{t('apps')}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link to="/apps/chat">{t('chat')}</Link>
              </li>
              <li>
                <Link to="/apps/mailbox">{t('mailbox')}</Link>
              </li>
              <li>
                <Link to="/apps/todolist">{t('todo_list')}</Link>
              </li>
              <li>
                <Link to="/apps/notes">{t('notes')}</Link>
              </li>
              <li>
                <Link to="/apps/scrumboard">{t('scrumboard')}</Link>
              </li>
              <li>
                <Link to="/apps/contacts">{t('contacts')}</Link>
              </li>
              <li className="relative">
                <button type="button">
                  {t('invoice')}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link to="/apps/invoice/list">{t('list')}</Link>
                  </li>
                  <li>
                    <Link to="/apps/invoice/preview">{t('preview')}</Link>
                  </li>
                  <li>
                    <Link to="/apps/invoice/add">{t('add')}</Link>
                  </li>
                  <li>
                    <Link to="/apps/invoice/edit">{t('edit')}</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/apps/calendar">{t('calendar')}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuComponents className="shrink-0" />
                <span className="px-1">{t('components')}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link to="/components/tabs">{t('tabs')}</Link>
              </li>
              <li>
                <Link to="/components/accordions">{t('accordions')}</Link>
              </li>
              <li>
                <Link to="/components/modals">{t('modals')}</Link>
              </li>
              <li>
                <Link to="/components/cards">{t('cards')}</Link>
              </li>
              <li>
                <Link to="/components/carousel">{t('carousel')}</Link>
              </li>
              <li>
                <Link to="/components/countdown">{t('countdown')}</Link>
              </li>
              <li>
                <Link to="/components/counter">{t('counter')}</Link>
              </li>
              <li>
                <Link to="/components/sweetalert">{t('sweet_alerts')}</Link>
              </li>
              <li>
                <Link to="/components/timeline">{t('timeline')}</Link>
              </li>
              <li>
                <Link to="/components/notifications">{t('notifications')}</Link>
              </li>
              <li>
                <Link to="/components/media-object">{t('media_object')}</Link>
              </li>
              <li>
                <Link to="/components/list-group">{t('list_group')}</Link>
              </li>
              <li>
                <Link to="/components/pricing-table">{t('pricing_tables')}</Link>
              </li>
              <li>
                <Link to="/components/lightbox">{t('lightbox')}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuElements className="shrink-0" />
                <span className="px-1">{t('elements')}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link to="/elements/alerts">{t('alerts')}</Link>
              </li>
              <li>
                <Link to="/elements/avatar">{t('avatar')}</Link>
              </li>
              <li>
                <Link to="/elements/badges">{t('badges')}</Link>
              </li>
              <li>
                <Link to="/elements/breadcrumbs">{t('breadcrumbs')}</Link>
              </li>
              <li>
                <Link to="/elements/buttons">{t('buttons')}</Link>
              </li>
              <li>
                <Link to="/elements/buttons-group">{t('button_groups')}</Link>
              </li>
              <li>
                <Link to="/elements/color-library">{t('color_library')}</Link>
              </li>
              <li>
                <Link to="/elements/dropdown">{t('dropdown')}</Link>
              </li>
              <li>
                <Link to="/elements/infobox">{t('infobox')}</Link>
              </li>
              <li>
                <Link to="/elements/jumbotron">{t('jumbotron')}</Link>
              </li>
              <li>
                <Link to="/elements/loader">{t('loader')}</Link>
              </li>
              <li>
                <Link to="/elements/pagination">{t('pagination')}</Link>
              </li>
              <li>
                <Link to="/elements/popovers">{t('popovers')}</Link>
              </li>
              <li>
                <Link to="/elements/progress-bar">{t('progress_bar')}</Link>
              </li>
              <li>
                <Link to="/elements/search">{t('search')}</Link>
              </li>
              <li>
                <Link to="/elements/tooltips">{t('tooltips')}</Link>
              </li>
              <li>
                <Link to="/elements/treeview">{t('treeview')}</Link>
              </li>
              <li>
                <Link to="/elements/typography">{t('typography')}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuDatatables className="shrink-0" />
                <span className="px-1">{t('tables')}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link to="/tables">{t('tables')}</Link>
              </li>
              <li className="relative">
                <button type="button">
                  {t('datatables')}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link to="/datatables/basic">{t('basic')}</Link>
                  </li>
                  <li>
                    <Link to="/datatables/advanced">{t('advanced')}</Link>
                  </li>
                  <li>
                    <Link to="/datatables/skin">{t('skin')}</Link>
                  </li>
                  <li>
                    <Link to="/datatables/order-sorting">{t('order_sorting')}</Link>
                  </li>
                  <li>
                    <Link to="/datatables/multi-column">{t('multi_column')}</Link>
                  </li>
                  <li>
                    <Link to="/datatables/multiple-tables">{t('multiple_tables')}</Link>
                  </li>
                  <li>
                    <Link to="/datatables/alt-pagination">{t('alt_pagination')}</Link>
                  </li>
                  <li>
                    <Link to="/datatables/checkbox">{t('checkbox')}</Link>
                  </li>
                  <li>
                    <Link to="/datatables/range-search">{t('range_search')}</Link>
                  </li>
                  <li>
                    <Link to="/datatables/export">{t('export')}</Link>
                  </li>
                  <li>
                    <Link to="/datatables/column-chooser">{t('column_chooser')}</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuForms className="shrink-0" />
                <span className="px-1">{t('forms')}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link to="/forms/basic">{t('basic')}</Link>
              </li>
              <li>
                <Link to="/forms/input-group">{t('input_group')}</Link>
              </li>
              <li>
                <Link to="/forms/layouts">{t('layouts')}</Link>
              </li>
              <li>
                <Link to="/forms/validation">{t('validation')}</Link>
              </li>
              <li>
                <Link to="/forms/input-mask">{t('input_mask')}</Link>
              </li>
              <li>
                <Link to="/forms/select2">{t('select2')}</Link>
              </li>
              <li>
                <Link to="/forms/touchspin">{t('touchspin')}</Link>
              </li>
              <li>
                <Link to="/forms/checkbox-radio">{t('checkbox_and_radio')}</Link>
              </li>
              <li>
                <Link to="/forms/switches">{t('switches')}</Link>
              </li>
              <li>
                <Link to="/forms/wizards">{t('wizards')}</Link>
              </li>
              <li>
                <Link to="/forms/file-upload">{t('file_upload')}</Link>
              </li>
              <li>
                <Link to="/forms/quill-editor">{t('quill_editor')}</Link>
              </li>
              <li>
                <Link to="/forms/markdown-editor">{t('markdown_editor')}</Link>
              </li>
              <li>
                <Link to="/forms/date-picker">{t('date_and_range_picker')}</Link>
              </li>
              <li>
                <Link to="/forms/clipboard">{t('clipboard')}</Link>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuPages className="shrink-0" />
                <span className="px-1">{t('pages')}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li className="relative">
                <button type="button">
                  {t('users')}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link to="/users/profile">{t('profile')}</Link>
                  </li>
                  <li>
                    <Link to="/users/user-account-settings">{t('account_settings')}</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/pages/knowledge-base">{t('knowledge_base')}</Link>
              </li>
              <li>
                <Link to="/pages/contact-us-boxed" target="_blank">
                  {t('contact_us_boxed')}
                </Link>
              </li>
              <li>
                <Link to="/pages/contact-us-cover" target="_blank">
                  {t('contact_us_cover')}
                </Link>
              </li>
              <li>
                <Link to="/pages/faq">{t('faq')}</Link>
              </li>
              <li>
                <Link to="/pages/coming-soon-boxed" target="_blank">
                  {t('coming_soon_boxed')}
                </Link>
              </li>
              <li>
                <Link to="/pages/coming-soon-cover" target="_blank">
                  {t('coming_soon_cover')}
                </Link>
              </li>
              <li>
                <Link to="/pages/maintenence" target="_blank">
                  {t('maintenence')}
                </Link>
              </li>
              <li className="relative">
                <button type="button">
                  {t('error')}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link to="/pages/error404" target="_blank">
                      {t('404')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/pages/error500" target="_blank">
                      {t('500')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/pages/error503" target="_blank">
                      {t('503')}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="relative">
                <button type="button">
                  {t('login')}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link to="/auth/cover-login" target="_blank">
                      {t('login_cover')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth/boxed-signin" target="_blank">
                      {t('login_boxed')}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="relative">
                <button type="button">
                  {t('register')}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link to="/auth/cover-register" target="_blank">
                      {t('register_cover')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth/boxed-signup" target="_blank">
                      {t('register_boxed')}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="relative">
                <button type="button">
                  {t('password_recovery')}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link to="/auth/cover-password-reset" target="_blank">
                      {t('recover_id_cover')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth/boxed-password-reset" target="_blank">
                      {t('recover_id_boxed')}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="relative">
                <button type="button">
                  {t('lockscreen')}
                  <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                    <IconCaretDown />
                  </div>
                </button>
                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                  <li>
                    <Link to="/auth/cover-lockscreen" target="_blank">
                      {t('unlock_cover')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth/boxed-lockscreen" target="_blank">
                      {t('unlock_boxed')}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li className="menu nav-item relative">
            <button type="button" className="nav-link">
              <div className="flex items-center">
                <IconMenuMore className="shrink-0" />
                <span className="px-1">{t('more')}</span>
              </div>
              <div className="right_arrow">
                <IconCaretDown />
              </div>
            </button>
            <ul className="sub-menu">
              <li>
                <Link to="/dragndrop">{t('drag_and_drop')}</Link>
              </li>
              <li>
                <Link to="/charts">{t('charts')}</Link>
              </li>
              <li>
                <Link to="/font-icons">{t('font_icons')}</Link>
              </li>
              <li>
                <Link to="/widgets">{t('widgets')}</Link>
              </li>
              <li>
                <Link to="https://vristo.sbthemes.com" target="_blank">
                  {t('documentation')}
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
