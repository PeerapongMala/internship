import {
  EngineThree,
  EngineThreeGameLoopPropsInterface,
} from 'skillvir-architecture-helper/library/game-core/engine/three';
import { SceneManager } from 'skillvir-architecture-helper/library/game-core/helper/scene-manager';
import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create, StoreApi, UseBoundStore } from 'zustand';
// import APIGlobal from '../api';
// import { GetMethodStoreGamePersist } from './persist';

// ============ State ==============
interface StateInterface {
  stateScene: string;
  stateSubScene: number;
  stateFlow: number;

  engineThree: EngineThree | null;
  sceneManager: SceneManager<EngineThreeGameLoopPropsInterface> | null;
  uiBG: {
    canvas: HTMLCanvasElement | null;
    context2d: CanvasRenderingContext2D | null;
  };
  ui: {
    canvas: HTMLCanvasElement | null;
    context2d: CanvasRenderingContext2D | null;
  };
  gameCanvasEnableIs: boolean;
  test1: number;
}

const store = create(
  (): StateInterface => ({
    stateScene: '',
    stateSubScene: 0,
    stateFlow: 0,
    engineThree: null,
    sceneManager: null,
    uiBG: {
      canvas: null,
      context2d: null,
    },
    ui: {
      canvas: null,
      context2d: null,
    },
    gameCanvasEnableIs: false,
    test1: 0,
  }),
);
// ============ Method ==============
interface MethodInterface {
  // gameInitial: (config: IGameCoreConfig) => void;
  EngineThreeSet: (engineThree: EngineThree) => void;
  SceneManagerSet: (
    sceneManager: SceneManager<EngineThreeGameLoopPropsInterface>,
  ) => void;
  SceneManagerSceneSet: (sceneName: string) => void;
  UIBGSet: (canvas: HTMLCanvasElement, context2d: CanvasRenderingContext2D) => void;
  UISet: (canvas: HTMLCanvasElement, context2d: CanvasRenderingContext2D) => void;
  GameCanvasEnableSet: (enableIs: boolean) => void;
  Test1Set: (test1: number) => void;
  Test1Increment: () => void;
  State: {
    Scene: { Set: (scene: string) => void };
    SubScene: { Set: (subScene: number) => void };
    Flow: { Set: (flow: number) => void };
  };
  // setLoading: (isLoading: boolean) => void;
  // signIn: (sEmail: string, sPassword: string) => Promise<HelperType.TypeGolangResponse>;
  // signOut: () => void;
}

const method: MethodInterface = {
  // gameInitial: (config: IGameCoreConfig) => {
  //   store.setState(() => ({ gameCore: new GameCore(config) }));
  // },
  EngineThreeSet: (engineThree: EngineThree) => {
    store.setState(() => ({ engineThree }));
  },
  SceneManagerSet: (sceneManager: SceneManager<EngineThreeGameLoopPropsInterface>) => {
    store.setState(() => ({ sceneManager }));
  },
  SceneManagerSceneSet: (sceneName: string) => {
    store.getState().sceneManager?.Set(sceneName);
  },
  UIBGSet: (canvas: HTMLCanvasElement, context2d: CanvasRenderingContext2D) => {
    store.setState(() => ({ uiBG: { canvas, context2d } }));
  },
  UISet: (canvas: HTMLCanvasElement, context2d: CanvasRenderingContext2D) => {
    store.setState(() => ({ ui: { canvas, context2d } }));
  },
  GameCanvasEnableSet: (gameCanvasEnableIs: boolean) => {
    store.setState(() => ({ gameCanvasEnableIs }));
  },
  Test1Set: (test1: number) => {
    store.setState(() => ({ test1 }));
  },
  Test1Increment: () => {
    store.setState((state) => ({ test1: state.test1 + 1 }));
  },

  State: {
    Scene: {
      Set: (stateScene: string) => {
        store.setState(() => ({ stateScene }));
      },
    },
    SubScene: {
      Set: (stateSubScene: number) => {
        store.setState(() => ({ stateSubScene }));
      },
    },
    Flow: {
      Set: (stateFlow: number) => {
        store.setState(() => ({ stateFlow }));
      },
    },
  },
  // setLoading: (isLoading: boolean) => {
  // store.setState((state: store) => ({ isLoading }));
  // store.setState(() => ({ isLoading }));
  // },
  //   signIn: async (
  //     sEmail: string,
  //     sPassword: string,
  //   ): Promise<HelperType.TypeGolangResponse> => {
  //     store.setState({ isLoading: true });
  //     // ======== Auth
  //     const resAuth = await APIGlobal.SetSignIn(sEmail, sPassword);
  //     if (resAuth.error) {
  //       store.setState({ isLoading: false });
  //       return { res: null, error: resAuth.error };
  //     }
  //     // await testGetToken();
  //     // ======== Get User Data
  //     const resReadUser = await APIGlobal.ReadUser();
  //     if (resReadUser.error) {
  //       store.setState({ isLoading: false });
  //       return { res: null, error: resReadUser.error };
  //     }
  //     GetMethodStoreGamePersist().setUserData(resReadUser.res?.data);
  //     store.setState({ isLoading: false });
  //     // setState({ isLoading: false });
  //     return { res: resReadUser.res, error: null };
  //   },
  //   signOut: async () => {
  //     store.setState({ isLoading: true });
  //     await APIGlobal.GetSignOut();
  //     // console.log('setUserData', setUserData);
  //     GetMethodStoreGamePersist().setUserData(null);
  //     store.setState({ isLoading: false });
  //   },
};

// ============ Export ==============
export interface IStoreGame {
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}
const StoreGame: {
  StateGet: (stateList: string[], shallowIs?: boolean) => IStoreGame['StateInterface'];
  StateSet: (prop: Partial<IStoreGame['StateInterface']>) => void;
  StateGetAllWithUnsubscribe: () => IStoreGame['StateInterface'];
  MethodGet: () => IStoreGame['MethodInterface'];
  StoreGet: () => UseBoundStore<StoreApi<IStoreGame['StateInterface']>>;
} = HelperZustand.StoreExport<
  IStoreGame['StateInterface'],
  IStoreGame['MethodInterface']
>(store, method);

export default StoreGame;
