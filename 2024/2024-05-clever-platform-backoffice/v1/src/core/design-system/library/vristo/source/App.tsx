import StoreVristoPersist, { IStoreVristoPersist } from '@store/global/vristo-persist';
import { PropsWithChildren, useEffect } from 'react';

function App({ children }: PropsWithChildren) {
  const { sidebar, menu, layout, rtlClass }: IStoreVristoPersist['StateInterface'] =
    StoreVristoPersist.StateGet(['sidebar', 'menu', 'layout', 'rtlClass']);

  //   useEffect(() => {
  //       dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
  //       dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
  //       dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
  //       dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
  //       dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
  //       dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
  //       dispatch(toggleLocale(localStorage.getItem('i18nextLng') || themeConfig.locale));
  //       dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
  //   }, [dispatch, themeConfig.theme, themeConfig.menu, themeConfig.layout, themeConfig.rtlClass, themeConfig.animation, themeConfig.navbar, themeConfig.locale, themeConfig.semidark]);

  return (
    <div
      className={`${(sidebar && 'toggle-sidebar') || ''} ${menu} ${layout} ${
        rtlClass
      } main-section relative font-nunito text-sm font-normal antialiased`}
    >
      {children}
    </div>
  );
}

export default App;
