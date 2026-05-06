import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import { createSoundController, SoundController, SoundKey } from '../soundController';
import { useSoundSourcesStore } from './soundSourceStore';

interface BackgroundMusicState {
  looping: boolean;
  autoplay: boolean;
  currentSoundKey?: SoundKey;
  controller?: SoundController;
  isPaused: boolean;
  volume: number;
  isCreating: boolean; // Track if we're creating a controller
}

interface BackgroundMusicActions {
  setAutoplay: (autoplay: boolean) => void;
  setLooping: (looping: boolean) => void;
  setVolume: (volume: number) => void;
  playSound: (soundKey: SoundKey) => void;
  pauseSound: () => Promise<void>;
  stopSound: () => Promise<void>;
  resumeSound: () => Promise<void>;
}

type BackgroundMusicStore = BackgroundMusicState & BackgroundMusicActions;
// Default volumes for sfx and bgm (used in controller creation)
const DEFAULT_VOLUMES = {
  sfx: 0.7,
  bgm: 0.6,
};

const initialState: BackgroundMusicState = {
  autoplay: true,
  looping: true,
  isPaused: false,
  volume: 50,
  currentSoundKey: undefined,
  controller: undefined,
  isCreating: false,
};

export const useBackgroundMusicStore = create(
  persist<BackgroundMusicStore>(
    (set, get) => ({
      ...initialState,
      setAutoplay: (autoplay) => set({ autoplay }),
      setLooping: (looping) => set({ looping }),
      setVolume: (volume: number) => {
        const { controller } = get();
        if (controller && typeof controller.setVolume === 'function') {
          controller.setVolume(volume);
          set({ volume });
        } else {
          console.warn('No valid controller for setVolume', controller);
        }
      },
      playSound: (soundKey) => {
        const { currentSoundKey, isPaused, controller, volume, autoplay, looping, isCreating } =
          get();
        const { bgSounds, effectSounds } = useSoundSourcesStore.getState();
        const soundSources = { ...bgSounds, ...effectSounds };

        // if sound value is url, find the key
        const findSoundKey =
          Object.keys(soundSources).find((key) => soundSources[key] === soundKey) ??
          soundKey;

        if (!soundSources[findSoundKey]) {
          console.warn('Sound key not found:', findSoundKey);
          return;
        }

        // If we're already creating a controller for the same sound, skip
        if (isCreating && currentSoundKey === findSoundKey) {
          console.log('⏳ Already creating controller for:', findSoundKey);
          return;
        }

        // If same sound is already playing, do nothing
        if (currentSoundKey === findSoundKey && !isPaused && controller) {
          console.log('🔁 Sound already playing:', findSoundKey);
          return;
        }

        // If same sound is paused, resume it
        if (currentSoundKey === findSoundKey && isPaused && controller) {
          controller.play();
          set({ isPaused: false });
          return;
        }

        // Mark as creating
        set({ isCreating: true });

        if (controller) controller.destroy();

        const newController = createSoundController(
          findSoundKey,
          soundSources,
          DEFAULT_VOLUMES,
          {
            autoplay: false, // Don't use autoplay, call play() explicitly instead
            loop: looping,
            volume,
          },
        );

        set({
          currentSoundKey: findSoundKey,
          controller: newController,
          isPaused: false,
          isCreating: false, // Done creating
        });

        // Play after setting state (if autoplay is enabled)
        if (autoplay) {
          newController.play().catch(err => {
            console.error('Failed to play sound:', err);
          });
        }
      },

      pauseSound: async () => {
        const { controller } = get();
        if (controller) {
          await controller.pause();
          set({ isPaused: true });
        }
      },

      resumeSound: async () => {
        const { controller } = get();
        if (controller) {
          await controller.play();
          set({ isPaused: false });
        }
      },

      stopSound: async () => {
        const { controller } = get();
        if (controller) {
          await controller.stop();
          controller.destroy();
          set({
            currentSoundKey: undefined,
            controller: undefined,
            isPaused: false,
          });
        }
      },
    }),
    {
      name: 'background-music-storage',
      // Rehydrate store from persisted state
      onRehydrateStorage: () => async (state) => {
        if (!state) return;

        const { bgSounds, effectSounds } = useSoundSourcesStore.getState();
        const soundSources = { ...bgSounds, ...effectSounds };

        // Check if sound sources are loaded before trying to rehydrate
        if (state.currentSoundKey && Object.keys(soundSources).length > 0) {
          try {
            const controller = createSoundController(
              state.currentSoundKey,
              soundSources,
              DEFAULT_VOLUMES,
              {
                autoplay: state.autoplay,
                loop: state.looping,
                volume: state.volume,
              },
            );
            state.controller = controller;
          } catch (err) {
            console.warn('Failed to rehydrate sound controller:', err);
            // Reset currentSoundKey if rehydration fails
            state.currentSoundKey = undefined;
            state.controller = undefined;
          }
        } else {
          // Clear controller if sound sources not loaded yet
          state.controller = undefined;
        }
      },
    },
  ),
);
