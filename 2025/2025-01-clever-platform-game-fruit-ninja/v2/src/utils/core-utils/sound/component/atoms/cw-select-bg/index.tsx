import { useState, useEffect } from 'react';

import { TAddSound } from '../../molecule/cw-setting-panel';
import { useBackgroundMusicStore } from '../../../store/backgroundMusic';
import { SoundKey } from '../../../soundController';

export const CWSelectBackground = ({ bg_sound }: TAddSound) => {
  const [selectedSound, setSelectedSound] = useState<SoundKey>('no_sound');
  const { playSound, currentSoundKey, stopSound } = useBackgroundMusicStore();

  useEffect(() => {
    // Sync selectedSound with currentSoundKey from store
    if (currentSoundKey) {
      setSelectedSound(currentSoundKey as SoundKey);
    } else {
      setSelectedSound('no_sound');
    }
  }, [currentSoundKey]);

  const backGroundSounds = bg_sound
    ? Object.keys(bg_sound)
      .filter((key) => key !== 'no_sound')
      .map((key) => key as SoundKey)
    : [];

  const handleSoundChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const soundKey = event.target.value as SoundKey;
    setSelectedSound(soundKey);

    // Stop current sound
    stopSound();

    // Play new sound if not 'no_sound'
    if (soundKey !== 'no_sound') {
      playSound(soundKey);
    } else {
      stopSound();
    }
  };

  return (
    <div className="mb-4">
      <label
        htmlFor="background-sound"
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        เลือกเสียงพื้นหลัง:
      </label>
      <select
        id="background-sound"
        className="w-full max-w-xs rounded-md border border-gray-300 bg-amber-500 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={selectedSound}
        onChange={handleSoundChange}
      >
        <option value="no_sound">-- ไม่มีเสียง --</option>
        {backGroundSounds?.map((soundKey) => (
          <option key={soundKey} value={soundKey}>
            {soundKey}
          </option>
        ))}
      </select>
    </div>
  );
};
