// import { useNavigate, UseNavigateResult } from '@tanstack/react-router';
import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create } from 'zustand';

// import APIGlobal from '../api';
// import { GetMethodStoreGlobalPersist } from './persist';

const responsiveDefault = {
  // mobile: 480,
  mobile: 1020,
};

const ResponsiveCheck = (): ResponsiveSizeInterface => {
  const size = { width: window.innerWidth, height: window.innerHeight };
  const mobileIs = size.width <= responsiveDefault.mobile;
  const freesizeIs = size.width > responsiveDefault.mobile;
  return { size, mobileIs, freesizeIs };
};

interface ResponsiveSizeInterface {
  size: {
    width: number;
    height: number;
  };
  mobileIs: boolean;
  // desktooIs?: boolean;
  freesizeIs?: boolean;
}

// ============ State ==============
interface StateInterface {
  loadingIs: boolean;
  templateIs: boolean;
  bannerIs: boolean;
  responsiveEvent: ResponsiveSizeInterface;
  // navigate: UseNavigateResult<string> | (() => void);
}

const store = create(
  (): StateInterface => ({
    loadingIs: false,
    templateIs: false,
    bannerIs: false,
    // navigate: () => {},
    responsiveEvent: ResponsiveCheck(),
  }),
);

const ResponsiveEventCheck = () => {
  const responsiveEvent = ResponsiveCheck();
  // console.log('ResponsiveEventCheck -> responsiveEvent', responsiveEvent);
  store.setState(() => ({ responsiveEvent }));
};
window.addEventListener('resize', ResponsiveEventCheck);

// ============ Method ==============
interface MethodInterface {
  LoadingSet: (loadingIs: boolean) => void;
  BannerSet: (bannerIs: boolean) => void;
  TemplateSet: (templateIs: boolean) => void;
  // navigateSet: (navigate: UseNavigateResult<string> | (() => void)) => void;
  // signIn: (sEmail: string, sPassword: string) => Promise<HelperType.TypeGolangResponse>;
  // signOut: () => void;
}

const method: MethodInterface = {
  LoadingSet: (loadingIs: boolean) => {
    // StoreGlobal.setState((state: TypeStoreGlobal) => ({ isLoading }));
    store.setState(() => ({ loadingIs }));
  },
  BannerSet: (bannerIs: boolean) => {
    store.setState(() => ({ bannerIs }));
  },
  TemplateSet: (templateIs: boolean) => {
    store.setState(() => ({ templateIs }));
  },
  // navigateSet: (navigate: UseNavigateResult<string> | (() => void)) => {
  //   store.setState(() => ({ navigate }));
  // },

  // navigationUse: () => {
  //   const navigate = useNavigate();
  //   const setNavigate = useNavigationStore((state) => state.setNavigate);

  //   React.useEffect(() => {
  //     setNavigate(navigate);
  //   }, [navigate, setNavigate]);
  // },
  //   signIn: async (
  //     sEmail: string,
  //     sPassword: string,
  //   ): Promise<HelperType.TypeGolangResponse> => {
  //     StoreGlobal.setState({ isLoading: true });
  //     // ======== Auth
  //     const resAuth = await APIGlobal.SetSignIn(sEmail, sPassword);

  //     if (resAuth.error) {
  //       StoreGlobal.setState({ isLoading: false });
  //       return { res: null, error: resAuth.error };
  //     }

  //     // await testGetToken();

  //     // ======== Get User Data
  //     const resReadUser = await APIGlobal.ReadUser();
  //     if (resReadUser.error) {
  //       StoreGlobal.setState({ isLoading: false });
  //       return { res: null, error: resReadUser.error };
  //     }

  //     GetMethodStoreGlobalPersist().setUserData(resReadUser.res?.data);
  //     StoreGlobal.setState({ isLoading: false });
  //     // setState({ isLoading: false });
  //     return { res: resReadUser.res, error: null };
  //   },
  //   signOut: async () => {
  //     StoreGlobal.setState({ isLoading: true });

  //     await APIGlobal.GetSignOut();
  //     // console.log('setUserData', setUserData);
  //     GetMethodStoreGlobalPersist().setUserData(null);
  //     StoreGlobal.setState({ isLoading: false });
  //   },
};

// ============ Export ==============

// export const StoreGlobalNavigationInitial = () => {
//   const navigate = useNavigate();

//   store.setState(() => ({ navigate }));

//   // useEffect(() => {
//   //   navigateSet(navigate);
//   // }, [navigate, navigateSet]);
// };

export interface IStoreGlobal {
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}

const StoreGlobal = HelperZustand.StoreExport<
  IStoreGlobal['StateInterface'],
  IStoreGlobal['MethodInterface']
>(store, method);

export default StoreGlobal;
