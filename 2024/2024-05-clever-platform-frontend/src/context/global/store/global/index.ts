import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create, StoreApi, UseBoundStore } from 'zustand';

// import APIGlobal from '../api';
// import { GetMethodStoreGlobalPersist } from './persist';

// ============ State ==============
type URLType = `https://${string}` | `http://${string}` | 'localhost';
interface StateInterface {
  apiBaseURL?: URLType | 'mock';
  loadingIs: boolean;
  initializedIs: boolean;
  // server app version e.g. '1.5.0.123-20260204', '1.5.0.123-20260204-beta'
  appVersion: `${number}.${number}.${number}.${number}${string}`;
  tosId: number;
  wsBaseURL?: string;
  activeCanvas: boolean;
  imageBackgroundUrl?: string;
  redirectUrl?: string; // For redirect after login
  showMemoryInfo?: boolean; // For showing memory info component
  scale?: number; // For scaling UI components
  cursorPosition?: { x: number; y: number }; // For tracking cursor position
}

const store = create(
  (): StateInterface => ({
    apiBaseURL: import.meta.env.VITE_API_BASE_URL ?? 'mock',
    wsBaseURL: import.meta.env.VITE_WS_BASE_URL,
    loadingIs: false,
    initializedIs: false,
    // Auto-injected during build via vite.config.ts define
    // Format: 'major.minor.release.build-YYYYMMDD' where build auto-increments from CI
    // e.g. '1.5.0.456-20260204' (major=1, minor=5, release=0, build=456 from CI, date=2026-02-04)
    appVersion: (import.meta.env.VITE_APP_VERSION ||
      '1.5.0.0-20260204') as `${number}.${number}.${number}.${number}${string}`,
    tosId: 1,
    activeCanvas: false,
    imageBackgroundUrl: '',
    redirectUrl: '',
    scale: 1,
    cursorPosition: { x: 0, y: 0 },
  }),
);

// ============ Method ==============
interface MethodInterface {
  loadingSet: (loadingIs: boolean) => void;
  initializedSet: (initializedIs: boolean) => void;
  // signIn: (sEmail: string, sPassword: string) => Promise<HelperType.TypeGolangResponse>;
  // signOut: () => void;
  redirectUrlSet: (redirectUrl: string) => void;
  activeCanvasSet: (activeCanvas: boolean) => void;
  imageBackgroundUrlSet: (imageBackgroundUrl: string) => void;
  imageBackgroundUrlBySubjectGroupSet: (subjectGroupId: number) => void;
  scaleSet: (scale: number) => void; // For scaling UI components
  cursorPositionSet: (cursorPosition: { x: number; y: number }) => void;
}

const method: MethodInterface = {
  loadingSet: (loadingIs: boolean) => {
    // StoreGlobal.setState((state: TypeStoreGlobal) => ({ isLoading }));
    store.setState(() => ({ loadingIs }));
  },
  initializedSet: (initializedIs: boolean) => {
    // StoreGlobal.setState((state: TypeStoreGlobal) => ({ isLoading }));
    store.setState(() => ({ initializedIs }));
  },
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
  redirectUrlSet: (redirectUrl: string) => {
    store.setState(() => ({ redirectUrl })); // Logic to update redirectUrl
  },
  activeCanvasSet: (activeCanvas: boolean) => {
    store.setState(() => ({ activeCanvas })); // Logic to update activeCanvas
  },
  imageBackgroundUrlSet: (imageBackgroundUrl: string) => {
    store.setState(() => ({ imageBackgroundUrl })); // Logic to update imageBackgroundUrl
  },
  imageBackgroundUrlBySubjectGroupSet: (subjectGroupId: number) => {
    const backgroundUrlByGroup: Record<number, string> = {
      1: '/assets/images/background/subject-group-1/1-4-default.png',
      2: '/assets/images/background/subject-group-2/2-3-default.png',
      3: '/assets/images/background/subject-group-3/3-2-default.png',
      4: '/assets/images/background/subject-group-4/4-5-default.png',
    };
    const imageBackgroundUrl =
      backgroundUrlByGroup[subjectGroupId] || '/assets/images/background/map1/map1.png';
    store.setState(() => ({ imageBackgroundUrl }));
  },
  scaleSet: (scale: number) => {
    store.setState(() => ({ scale }));
  },
  cursorPositionSet: (cursorPosition: { x: number; y: number }) => {
    store.setState(() => ({ cursorPosition }));
  },
};

// ============ Export ==============
export interface IStoreGlobal {
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}

const StoreGlobal: {
  StateGet: (stateList: string[], shallowIs?: boolean) => IStoreGlobal['StateInterface'];
  StateSet: (prop: Partial<IStoreGlobal['StateInterface']>) => void;
  StateGetAllWithUnsubscribe: () => IStoreGlobal['StateInterface'];
  MethodGet: () => IStoreGlobal['MethodInterface'];
  StoreGet: () => UseBoundStore<StoreApi<IStoreGlobal['StateInterface']>>;
} = HelperZustand.StoreExport<
  IStoreGlobal['StateInterface'],
  IStoreGlobal['MethodInterface']
>(store, method);

export default StoreGlobal;
