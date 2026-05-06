import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import themeConfig from '../../../../../theme.config';
import i18next from 'i18next';

const defaultState = {
  isDarkMode: false,
  mainLayout: 'app',
  theme: 'light',
  menu: 'vertical',
  layout: 'full',
  rtlClass: 'ltr',
  animation: '',
  navbar: 'navbar-sticky',
  locale: 'en',
  sidebar: false,
  pageTitle: '',
  languageList: [
    { code: 'zh', name: 'Chinese' },
    { code: 'da', name: 'Danish' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'el', name: 'Greek' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'es', name: 'Spanish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'tr', name: 'Turkish' },
  ],
  semidark: false,
};

// ============ State ==============
interface StateInterface {
  theme: string;
  menu: string;
  layout: string;
  rtlClass: string;
  animation: string;
  navbar: string;
  locale: string;
  isDarkMode: boolean;
  sidebar: boolean;
  semidark: boolean | string;
  languageList: { code: string; name: string }[];
}

// cant use method
const store = create(
  persist(
    (): StateInterface => ({
      theme: themeConfig.theme,
      menu: themeConfig.menu,
      layout: themeConfig.layout,
      rtlClass: themeConfig.rtlClass,
      animation: themeConfig.animation,
      navbar: themeConfig.navbar,
      locale: themeConfig.locale,
      isDarkMode: false,
      sidebar: defaultState.sidebar,
      semidark: themeConfig.semidark,
      languageList: [
        { code: 'zh', name: 'Chinese' },
        { code: 'da', name: 'Danish' },
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'el', name: 'Greek' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'it', name: 'Italian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'es', name: 'Spanish' },
        { code: 'sv', name: 'Swedish' },
        { code: 'tr', name: 'Turkish' },
        { code: 'ae', name: 'Arabic' },
      ],
    }),
    {
      name: 'vristo-theme-config',
    },
  ),
);

// ============ Method ==============

interface MethodInterface {
  themeToggle: (payload: string) => void;
  toggleMenu: (payload: string) => void;
  layoutToggle: (payload: string) => void;
  rtlToggle: (payload: string) => void;
  animationToggle: (payload: string) => void;
  navbarToggle: (payload: string) => void;
  semidarkToggle: (payload: string | boolean) => void;
  localeToggle: (payload: string) => void;
  sidebarToggle: () => void;
  pageTitleSet: (payload: string) => void;
}

const method: MethodInterface = {
  themeToggle(payload: string) {
    store.setState((state: StateInterface) => {
      payload = payload || state.theme; // light | dark | system

      let isDarkMode = false;
      if (payload === 'light') {
        isDarkMode = false;
      } else if (payload === 'dark') {
        isDarkMode = true;
      } else if (payload === 'system') {
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          isDarkMode = true;
        } else {
          isDarkMode = false;
        }
      }

      if (isDarkMode) {
        document.querySelector('body')?.classList.add('dark');
      } else {
        document.querySelector('body')?.classList.remove('dark');
      }

      return { theme: payload, isDarkMode };
    });
  },
  toggleMenu(payload: string) {
    store.setState((state: StateInterface) => {
      payload = payload || state.menu; // vertical, collapsible-vertical, horizontal
      // reset sidebar state
      return { menu: payload, sidebar: false };
    });
  },
  layoutToggle(payload: string) {
    store.setState((state: StateInterface) => {
      payload = payload || state.layout; // full, boxed-layout
      return { layout: payload };
    });
  },
  rtlToggle(payload: string) {
    store.setState((state: StateInterface) => {
      payload = payload || state.rtlClass; // rtl, ltr
      return { rtlClass: payload };
    });
    // update rtl, ltr direction after update store
    document
      .querySelector('html')
      ?.setAttribute('dir', store.getState().rtlClass || 'ltr');
  },
  animationToggle(payload: string) {
    store.setState((state: StateInterface) => {
      payload = payload || state.animation; // animate__fadeIn, animate__fadeInDown, animate__fadeInUp, animate__fadeInLeft, animate__fadeInRight, animate__slideInDown, animate__slideInLeft, animate__slideInRight, animate__zoomIn
      payload = payload?.trim();
      return { animation: payload };
    });
  },
  navbarToggle(payload: string) {
    store.setState((state: StateInterface) => {
      payload = payload || state.navbar; // navbar-sticky, navbar-floating, navbar-static
      return { navbar: payload };
    });
  },
  semidarkToggle(payload: string | boolean) {
    store.setState((state: StateInterface) => {
      payload = payload === true || payload === 'true' ? true : false;
      return { semidark: payload };
    });
  },
  localeToggle(payload: string) {
    store.setState((state: StateInterface) => {
      payload = payload || state.locale;
      i18next.changeLanguage(payload);
      return { locale: payload };
    });
  },
  sidebarToggle() {
    store.setState((state: StateInterface) => {
      return { sidebar: !state.sidebar };
    });
  },
  pageTitleSet(payload: string) {
    document.title = `${payload} | VRISTO - Multipurpose Tailwind Dashboard Template`;
  },
};

// ============ Export ==============
export interface IStoreVristoPersist {
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}

const StoreVristoPersist = HelperZustand.StoreExport<
  IStoreVristoPersist['StateInterface'],
  IStoreVristoPersist['MethodInterface']
>(store, method);

export default StoreVristoPersist;
