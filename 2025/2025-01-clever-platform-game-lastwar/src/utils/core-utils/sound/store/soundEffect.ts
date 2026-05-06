import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import {
  createSoundController,
  playOneShotSound,
  SoundController,
  SoundKey,
} from '../soundController';
import { useSoundSourcesStore } from './soundSourceStore';

interface SoundEffectState {
  currentSoundKey?: SoundKey;
  controller?: SoundController;
  isPaused: boolean;
  volume: number;
}

interface SoundEffectActions {
  setVolume: (volume: number) => void;
  playEffect: (soundKey: SoundKey, option?: { volume?: number }) => void;
  pauseEffect: () => void;
  stopEffect: () => void;
  resumeEffect: () => void;
}

type SoundEffectStore = SoundEffectState & SoundEffectActions;

// ============ Default State ==============
const initialState: SoundEffectState = {
  isPaused: false,
  volume: 70,
  currentSoundKey: undefined,
  controller: undefined,
};
// Default volumes for sfx and bgm (used in controller creation)
const DEFAULT_VOLUMES = {
  sfx: 0.7,
  bgm: 0.6,
};

// ============ Helpers ==============
const cleanupCurrentController = (controller?: SoundController): void => {
  if (controller) {
    controller.destroy();
  }
};
// ============ Store ==============
export const useSoundEffectStore = create(
  persist<SoundEffectStore>(
    (set, get) => ({
      ...initialState,

      setVolume: (volume: number) => {
        const { controller } = get();
        if (controller && typeof controller.setVolume === 'function') {
          controller.setVolume(volume);
          set({ volume });
        } else {
          console.warn('No valid controller for setVolume', controller);
          set({ volume }); // update state anyway
        }
      },

      playEffect: (soundKey: SoundKey, option?: { volume?: number }) => {
        const { bgSounds, effectSounds } = useSoundSourcesStore.getState();
        const soundSources = { ...bgSounds, ...effectSounds };

        const findSoundKey =
          Object.keys(soundSources).find((key) => soundSources[key] === soundKey) ??
          soundKey;

        if (!soundSources[findSoundKey]) {
          console.warn(`Sound "${findSoundKey}" not found`);
          return;
        }

        const volume = option?.volume ?? 70;
        playOneShotSound(findSoundKey, soundSources, volume);
      },

      pauseEffect: () => {
        const { controller } = get();
        if (controller) {
          controller.pause();
          set({ isPaused: true });
        }
      },

      resumeEffect: () => {
        const { controller, currentSoundKey } = get();
        if (controller && currentSoundKey) {
          controller.play();
          set({ isPaused: false });
        }
      },

      stopEffect: () => {
        const { controller } = get();
        cleanupCurrentController(controller);
        set({
          currentSoundKey: undefined,
          controller: undefined,
          isPaused: false,
        });
      },
    }),
    {
      name: 'sound-effect-storage',

      // Rehydrate store from persisted state
      onRehydrateStorage: () => (state) => {
        const { bgSounds, effectSounds } = useSoundSourcesStore.getState();
        const soundSources = { ...bgSounds, ...effectSounds };
        if (state?.currentSoundKey && soundSources) {
          try {
            const controller = createSoundController(
              state.currentSoundKey,
              soundSources,
              DEFAULT_VOLUMES,
              {
                autoplay: false,
                loop: false,
                volume: state.volume,
              },
            );
            state.controller = controller;
          } catch (err) {
            console.warn('Failed to recreate sound controller on rehydrate', err);
            state.controller = undefined;
          }
        }
      },
    },
  ),
);
