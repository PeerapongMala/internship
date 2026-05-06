import { MutableRefObject, useRef } from 'react';
import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create } from 'zustand';

// Responsive size check function (same as in your original code)
const responsiveDefault = { mobile: 1020 };

const ResponsiveCheck = (): ResponsiveSizeInterface => {
  const size = { width: window.innerWidth, height: window.innerHeight };
  const mobileIs = size.width <= responsiveDefault.mobile;
  const freesizeIs = size.width > responsiveDefault.mobile;
  return { size, mobileIs, freesizeIs };
};

type UserRole = 'admin' | 'member' | 'guest' | null;

interface ResponsiveSizeInterface {
  size: { width: number; height: number };
  mobileIs: boolean;
  freesizeIs?: boolean;
}

interface StateInterface {
  loadingIs: boolean;
  templateIs: boolean;
  bannerIs: boolean;
  responsiveEvent: ResponsiveSizeInterface;
  userRole: UserRole;
  templateDivRef: MutableRefObject<null | HTMLDivElement> | null
}

const store = create<StateInterface>((set) => ({
  loadingIs: false,
  templateIs: false,
  bannerIs: false,
  responsiveEvent: ResponsiveCheck(),
  userRole: localStorage.getItem('userRole') as UserRole || 'guest',
  templateDivRef : null
}));

const ResponsiveEventCheck = () => {
  const responsiveEvent = ResponsiveCheck();
  store.setState(() => ({ responsiveEvent }));
};
window.addEventListener('resize', ResponsiveEventCheck);

// ============ Method ==============
interface MethodeInterface {
  LoadingSet: (loadingIs: boolean) => void;
  BannerSet: (bannerIs: boolean) => void;
  TemplateSet: (templateIs: boolean) => void;
  setUserRole: (role: UserRole) => void;
  getUserRole: () => UserRole;
  TemplateDivRefSet: (divRef: MutableRefObject<null | HTMLDivElement>) => void
  TemplateScrollReset: () => void
}

const method: MethodeInterface = {
  LoadingSet: (loadingIs: boolean) => {
    store.setState(() => ({ loadingIs }));
  },
  BannerSet: (bannerIs: boolean) => {
    store.setState(() => ({ bannerIs }));
  },
  TemplateSet: (templateIs: boolean) => {
    store.setState(() => ({ templateIs }));
  },
  setUserRole: (role: UserRole) => {
    store.setState(() => ({ userRole: role }));
  },
  getUserRole: () => {
    return store.getState().userRole;  // Return directly from state
  },
  TemplateDivRefSet: (divRef: MutableRefObject<null | HTMLDivElement>) => {
    store.setState(() => ({ templateDivRef: divRef }));
  },
  TemplateScrollReset: () => {
    store.getState().templateDivRef?.current?.scrollTo(0, 0)
  }
};
export interface IStoreGlobal {
  StateInterface: StateInterface;
  MethodeInterface: MethodeInterface;
}

const StoreGlobal = HelperZustand.StoreExport<
  IStoreGlobal['StateInterface'],
  IStoreGlobal['MethodeInterface']
>(store, method);

export default StoreGlobal;
