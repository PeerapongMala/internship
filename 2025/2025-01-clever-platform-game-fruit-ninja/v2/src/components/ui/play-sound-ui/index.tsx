import { SOUND_GROUPS } from '@assets/public-sound';
import { useSoundEffectStore } from '@core-utils/sound/store/soundEffect';

/**
 * play sound UI
 * @param soundKey sound name   // default = "sound_ui" = SOUND_GROUPS.gameplay.sound_ui
 * @param volume volume (0–100)    // default = 70
 */

export type PlaySoundUIOptions = {
  soundKey?: string;
  volume?: number;
};

export const playSoundUI = ({
  soundKey = SOUND_GROUPS.sfx.sound_ui,
  volume = 70,
}: PlaySoundUIOptions = {}) => {
  const { playEffect } = useSoundEffectStore.getState();
  playEffect(soundKey, { volume });
};
