import { create } from 'zustand';
import { SoundSources, SoundGroup } from '../soundController';

interface SoundSourcesState {
  bgSounds: SoundSources;
  effectSounds: SoundSources;
  setBgSounds: (sources: SoundSources) => void;
  setEffectSounds: (sources: SoundSources) => void;
}

export const useSoundSourcesStore = create<SoundSourcesState>((set) => ({
  bgSounds: {},
  effectSounds: {},
  setBgSounds: (sources) => set({ bgSounds: sources }),
  setEffectSounds: (sources) => set({ effectSounds: sources }),
}));

// Helper function to initialize sounds without using hooks
export const initializeSounds = (bgm: SoundGroup, sfx: SoundGroup) => {
  const { setBgSounds, setEffectSounds } = useSoundSourcesStore.getState();
  setBgSounds(bgm);
  setEffectSounds(sfx);
};
