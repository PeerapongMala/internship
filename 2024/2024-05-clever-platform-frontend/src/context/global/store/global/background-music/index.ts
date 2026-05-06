import {
  createSoundController,
  SOUND_SOURCES,
  SoundController,
  SoundKey,
} from '@global/helper/sound';
import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create, StoreApi, UseBoundStore } from 'zustand';
import StoreGlobalPersist from '../persist';

// ============ State ==============
interface StateInterface {
  looping: boolean;
  autoplay: boolean;
  currentSoundKey?: string;
  controller?: SoundController;
  isPaused: boolean;
}

const store = create(
  (): StateInterface => ({
    autoplay: true,
    looping: true,
    isPaused: false,
  }),
);

// ============ Method ==============
interface MethodInterface {
  setAutoplay: (autoplay: boolean) => void;
  setLooping: (looping: boolean) => void;
  setVolume: (volume: number) => void;
  playSound: (soundKey: SoundKey) => void;
  pauseSound: () => void;
  stopSound: () => void;
  resumeSound: () => void;
}

const method: MethodInterface = {
  setAutoplay: (autoplay: boolean) => {
    store.setState({ autoplay });
  },
  setLooping: (looping: boolean) => {
    store.setState({ looping });
  },
  setVolume: (volume: number) => {
    // set current volume to the controller
    const { controller } = store.getState();
    if (controller) {
      controller.setVolume(volume);
    }
  },
  playSound: (soundKey: SoundKey) => {
    if (SOUND_SOURCES[soundKey]) {
      const currentSoundKey = store.getState().currentSoundKey;
      if (currentSoundKey !== soundKey) {
        // Check if the current sound key is different from the new one
        // Stop the current sound if it exists
        const currentSoundController = store.getState().controller;
        if (currentSoundController) {
          currentSoundController.destory();
        }

        // get the current volume setting
        const { backgroundMusicVolumn: bgVolumn, enableBackgroundMusic } =
          StoreGlobalPersist.StateGetAllWithUnsubscribe().settings;

        // Create a new sound controller for the new sound key
        const controller = createSoundController(soundKey, {
          autoplay: store.getState().autoplay,
          loop: store.getState().looping,
          volume: enableBackgroundMusic ? bgVolumn : 0,
        });
        // if autoplay is true, play the sound immediately
        if (store.getState().autoplay) {
          controller.play();
        }

        store.setState({
          currentSoundKey: soundKey,
          controller: controller,
          isPaused: false,
        });
      } else if (store.getState().isPaused) {
        const { controller } = store.getState();
        if (controller) {
          controller.play();
          store.setState({ isPaused: false });
        }
      }
    }
  },
  pauseSound: () => {
    const { controller } = store.getState();
    if (controller) {
      controller.pause();
      store.setState({ isPaused: true });
    }
  },
  resumeSound: () => {
    const { controller, currentSoundKey } = store.getState();
    if (controller && currentSoundKey) {
      controller.play();
      store.setState({ isPaused: false });
    }
  },
  stopSound: () => {
    const { currentSoundKey, controller } = store.getState();
    if (currentSoundKey && controller) {
      controller.stop();
      store.setState({
        currentSoundKey: undefined,
        controller: undefined,
        isPaused: false,
      });
    }
  },
};

// ============ Export ==============
export interface IStoreBackgroundMusic {
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}

const StoreBackgroundMusic: {
  StateGet: (
    stateList: string[],
    shallowIs?: boolean,
  ) => IStoreBackgroundMusic['StateInterface'];
  StateSet: (prop: Partial<IStoreBackgroundMusic['StateInterface']>) => void;
  StateGetAllWithUnsubscribe: () => IStoreBackgroundMusic['StateInterface'];
  MethodGet: () => IStoreBackgroundMusic['MethodInterface'];
  StoreGet: () => UseBoundStore<StoreApi<IStoreBackgroundMusic['StateInterface']>>;
} = HelperZustand.StoreExport<
  IStoreBackgroundMusic['StateInterface'],
  IStoreBackgroundMusic['MethodInterface']
>(store, method);

// ============ Subscribe ==============
// Subscribe to changes in the global settings store
StoreGlobalPersist.StoreGet().subscribe((state) => {
  const { backgroundMusicVolumn: bgVolumn, enableBackgroundMusic } = state.settings;
  if (enableBackgroundMusic) {
    StoreBackgroundMusic.MethodGet().setVolume(bgVolumn ?? 50); // 50%
  } else {
    StoreBackgroundMusic.MethodGet().setVolume(0);
  }
});

export default StoreBackgroundMusic;
