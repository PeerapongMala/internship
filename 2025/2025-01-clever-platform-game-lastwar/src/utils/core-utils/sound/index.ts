/**
 * Sound System - Main API
 *
 * This is the main entry point for the sound system.
 * Use these functions for playing sounds in your components.
 *
 * @example
 * ```typescript
 * import { playSoundEffect, playBackgroundMusic, initAudioSystem } from '@core-utils/sound';
 * import { SOUND_GROUPS } from '@/assets/public-sound';
 *
 * // Initialize once in App.tsx
 * initAudioSystem(SOUND_GROUPS.bgm, SOUND_GROUPS.sfx);
 *
 * // Play sound effects
 * void playSoundEffect(SOUND_GROUPS.sfx.gui_button);
 *
 * // Play background music
 * void playBackgroundMusic(SOUND_GROUPS.bgm.callof_the_jungle);
 * ```
 */

// Export main API from simpleAudio
export {
  playBackgroundMusic,
  pauseBackgroundMusic,
  stopBackgroundMusic,
  resumeBackgroundMusic,
  playSoundEffect,
  setBackgroundMusicVolume,
  setSoundEffectVolume,
  initAudioSystem,
  isAudioUnlocked,
  resetAudioSystem,
} from './simpleAudio';

// Export stores for advanced usage (e.g., volume controls, reactive state)
export { useBackgroundMusicStore } from './store/backgroundMusic';
export { useSoundEffectStore } from './store/soundEffect';
export { useSoundSourcesStore } from './store/soundSourceStore';

// Export types
export type { SoundGroup } from './soundController';
