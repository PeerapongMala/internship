import { unlockAudioContext, SoundGroup } from './soundController';
import { useBackgroundMusicStore } from './store/backgroundMusic';
import { useSoundEffectStore } from './store/soundEffect';
import { initializeSounds } from './store/soundSourceStore';

let audioUnlocked = false;
let audioInitialized = false;

/**
 * Internal function to ensure audio is unlocked
 */
async function ensureAudioUnlocked(): Promise<void> {
  if (audioUnlocked) return;

  try {
    await unlockAudioContext();
    audioUnlocked = true;
  } catch (error) {
    console.warn('Failed to unlock audio:', error);
  }
}

/**
 * Play background music with loop
 * Automatically handles audio unlock, ready state, etc.
 *
 * @param soundKey - Sound key or URL (e.g., '/sound/bgm/callof_the_jungle.wav')
 *
 * @example
 * ```typescript
 * import { playBackgroundMusic } from '@core-utils/sound/simpleAudio';
 *
 * playBackgroundMusic('/sound/bgm/callof_the_jungle.wav');
 * ```
 */
export async function playBackgroundMusic(soundKey: string): Promise<void> {
  try {
    await ensureAudioUnlocked();
  } catch (error) {
    console.error('❌ Failed to unlock audio:', error);
  }

  const { playSound } = useBackgroundMusicStore.getState();
  playSound(soundKey);
}

/**
 * Pause current background music
 */
export async function pauseBackgroundMusic(): Promise<void> {
  const { pauseSound } = useBackgroundMusicStore.getState();
  await pauseSound();
}

/**
 * Stop current background music
 */
export async function stopBackgroundMusic(): Promise<void> {
  const { stopSound } = useBackgroundMusicStore.getState();
  await stopSound();
}

/**
 * Resume paused background music
 */
export async function resumeBackgroundMusic(): Promise<void> {
  const { resumeSound } = useBackgroundMusicStore.getState();
  await resumeSound();
}

/**
 * Play sound effect (one-shot)
 *
 * @param soundKey - Sound key or URL
 * @param volume - Volume 0-100 (default: 70)
 *
 * @example
 * ```typescript
 * import { playSoundEffect } from '@core-utils/sound/simpleAudio';
 *
 * playSoundEffect('/sound/sfx/button_click.wav');
 * ```
 */
export async function playSoundEffect(
  soundKey: string,
  volume: number = 70,
): Promise<void> {
  try {
    await ensureAudioUnlocked();
  } catch (error) {
    console.error('❌ Failed to unlock audio:', error);
  }

  const { playEffect } = useSoundEffectStore.getState(); // Assuming 'playEffect' is the correct property
  playEffect(soundKey, { volume });
}

/**
 * Set background music volume
 * @param volume - Volume 0-100
 */
export function setBackgroundMusicVolume(volume: number): void {
  const { setVolume } = useBackgroundMusicStore.getState();
  setVolume(volume);
}

/**
 * Set sound effect volume
 * @param volume - Volume 0-100
 */
export function setSoundEffectVolume(volume: number): void {
  const { setVolume } = useSoundEffectStore.getState();
  setVolume(volume);
}

/**
 * Initialize audio system with sound sources
 * Call this once in your app initialization
 *
 * @param bgm - Background music sound group
 * @param sfx - Sound effects sound group
 *
 * @example
 * ```typescript
 * import { initAudioSystem } from '@core-utils/sound/simpleAudio';
 * import { SOUND_GROUPS } from '@/assets/public-sound';
 *
 * // In App.tsx
 * initAudioSystem(SOUND_GROUPS.bgm, SOUND_GROUPS.sfx);
 * ```
 */
export function initAudioSystem(bgm: SoundGroup, sfx: SoundGroup): void {
  if (audioInitialized) {
    console.warn('⚠️ Audio system already initialized');
    return;
  }

  audioInitialized = true;

  // Initialize sound sources first
  initializeSounds(bgm, sfx);

  const unlockAudio = async () => {
    if (audioUnlocked) return;

    console.log('🔓 First interaction detected - unlocking audio');

    try {
      await ensureAudioUnlocked();
    } catch (error) {
      console.error('❌ Failed to unlock audio:', error);
    }

    // Cleanup listeners after first interaction
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
  };

  // Listen for any user interaction
  document.addEventListener('click', unlockAudio, { once: true });
  document.addEventListener('touchstart', unlockAudio, { once: true });
  document.addEventListener('keydown', unlockAudio, { once: true });

  console.log('🎧 Audio system initialized, waiting for user interaction...');
}

/**
 * Check if audio has been unlocked
 */
export function isAudioUnlocked(): boolean {
  return audioUnlocked;
}

/**
 * Reset audio system (useful for testing or cleanup)
 */
export function resetAudioSystem(): void {
  audioUnlocked = false;
  audioInitialized = false;
  console.log('🔄 Audio system reset');
}
