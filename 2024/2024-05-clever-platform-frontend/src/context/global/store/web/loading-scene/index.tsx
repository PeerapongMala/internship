import LoadingScreen from '@component/web/template/wc-t-loading-scene';
import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create, StoreApi, UseBoundStore } from 'zustand';

// ============ State ==============
interface StateInterface {
  loadingIs: boolean;
  progress: number;
  characterData?: string;
  sceneData?: string;
  title?: string;
  footer?: string;
  progressText?: string;
  callbackWhenComplete?: () => Awaited<void>;
}

const store = create(
  (): StateInterface => ({
    loadingIs: false,
    progress: 0,
    callbackWhenComplete: () => {},
  }),
);

// ============ Method ==============
interface MethodInterface {
  loadingToggle: () => void;
  loadingSceneInit: () => void;
  loadingSceneSet: (state: StateInterface | Partial<StateInterface>) => void;
  titleUpdate: (title: string) => void;
  footerUpdate: (footer: string) => void;
  progressUpdate: (progress: number) => void;
  progressTextUpdate: (progressText: string) => void;
  step: ({
    fn,
    progressPercentage,
    progressText,
    titleText,
    footerText,
    delay,
  }: {
    fn?: () => any;
    progressPercentage?: number;
    progressText?: string;
    titleText?: string;
    footerText?: string;
    delay?: number;
  }) => Promise<boolean>;
  start: (options?: {
    delay?: number;
    cbAfterComplete?: () => Awaited<void>;
  }) => Promise<boolean>;
  complete: (options?: { delay?: number; cb?: () => Awaited<void> }) => Promise<boolean>;
  uiGet: () => JSX.Element;
}

const method: MethodInterface = {
  loadingToggle: () => {
    store.setState((state) => ({ loadingIs: !state.loadingIs }));
  },
  loadingSceneInit: () => {
    store.setState(() => ({
      title: undefined,
      footer: undefined,
      characterData: undefined,
      sceneData: undefined,
      loadingIs: false,
      progress: 0,
      progressText: undefined,
      callbackWhenComplete: undefined,
    }));
  },
  loadingSceneSet: (state: StateInterface | Partial<StateInterface>) => {
    store.setState(() => state);
  },
  titleUpdate: (title: string) => {
    store.setState(() => ({ title }));
  },
  footerUpdate: (footer: string) => {
    store.setState(() => ({ footer }));
  },
  progressUpdate: (progress) => {
    const roundedProgress = Math.round(Math.max(0, Math.min(progress, 100)));
    store.setState(() => ({ progress: roundedProgress }));
  },
  progressTextUpdate: (progressText) => {
    store.setState(() => ({ progressText }));
  },
  step: async ({
    fn,
    progressPercentage,
    progressText,
    titleText,
    footerText,
    delay = 0,
  }) => {
    if (progressText) {
      store.setState(() => ({ progressText }));
    }
    if (titleText) {
      store.setState(() => ({ title: titleText }));
    }
    if (footerText) {
      store.setState(() => ({ footer: footerText }));
    }

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (fn) await fn();

        // update progress
        if (progressPercentage) {
          const roundedProgress = Math.round(
            Math.max(0, Math.min(progressPercentage ?? 0, 100)),
          );
          store.setState(() => ({
            progress: roundedProgress,
          }));
        }

        resolve(true);
      }, delay);
    });
  },
  start: ({ delay, cbAfterComplete } = { delay: 0 }) => {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        if (cbAfterComplete) {
          store.setState(() => ({ callbackWhenComplete: cbAfterComplete }));
        }
        store.setState(() => ({ progress: 0, loadingIs: true }));
        resolve(true);
      }, delay),
    );
  },
  complete: async (options) => {
    const { callbackWhenComplete } = store.getState();
    return new Promise((resolve, reject) => {
      // set progress to 100%
      // to show the loading screen for a while before closing it
      store.setState(() => ({
        progress: 100,
      }));

      // setTimeout to delay the loading screen close
      setTimeout(async () => {
        if (options?.cb) await options.cb();
        if (callbackWhenComplete) await callbackWhenComplete();

        // cleanup state after scene transition
        store.setState(() => ({ progress: 0, loadingIs: false }));

        resolve(true);
      }, options?.delay ?? 0);
    });
  },
  uiGet: () => {
    const { loadingIs, characterData, sceneData, footer, title, progress, progressText } =
      store();
    return (
      <LoadingScreen
        isOpen={loadingIs}
        {...{ characterData, sceneData, footer, title, progress, progressText }}
      />
    );
  },
};

// ============ Export ==============
export interface IStoreLoadingScene {
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}

const StoreLoadingScene: {
  StateGet: (
    stateList: string[],
    shallowIs?: boolean,
  ) => IStoreLoadingScene['StateInterface'];
  StateSet: (prop: Partial<IStoreLoadingScene['StateInterface']>) => void;
  StateGetAllWithUnsubscribe: () => IStoreLoadingScene['StateInterface'];
  MethodGet: () => IStoreLoadingScene['MethodInterface'];
  StoreGet: () => UseBoundStore<StoreApi<IStoreLoadingScene['StateInterface']>>;
} = HelperZustand.StoreExport<
  IStoreLoadingScene['StateInterface'],
  IStoreLoadingScene['MethodInterface']
>(store, method);

export default StoreLoadingScene;
