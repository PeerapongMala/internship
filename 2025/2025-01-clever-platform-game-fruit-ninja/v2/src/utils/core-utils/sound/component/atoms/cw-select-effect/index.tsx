import { useState } from 'react';

import { TAddSound } from '../../molecule/cw-setting-panel';
import { useSoundEffectStore } from '../../../store/soundEffect';
import { SoundKey } from '../../../soundController';

export const CWSelectEffect = ({ effect_sound }: TAddSound) => {
  const [selectedEffect, setSelectedEffect] = useState<SoundKey>('no_sound');
  const { playEffect, stopEffect, volume, setVolume } = useSoundEffectStore();

  const effectSounds = effect_sound
    ? Object.keys(effect_sound)
      .filter((key) => key !== 'no_sound')
      .map((key) => key as SoundKey)
    : [];

  const handleEffectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const soundKey = event.target.value as SoundKey;
    setSelectedEffect(soundKey);
  };

  const handlePlayEffect = () => {
    if (selectedEffect !== 'no_sound') {
      playEffect(selectedEffect);
    }
  };

  const handleStopEffect = () => {
    if (selectedEffect !== 'no_sound') {
      stopEffect();
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="rounded-lg bg-gray-100 shadow-md">
      <div className="">
        <label
          htmlFor="effect-sound"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          เลือกเสียง Effect:
        </label>
        <select
          id="effect-sound"
          className="w-full rounded-md border border-gray-300 bg-amber-500 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={selectedEffect}
          onChange={handleEffectChange}
        >
          <option value="no_sound">-- เลือกเสียง --</option>
          {effectSounds.map((soundKey) => (
            <option key={soundKey} value={soundKey}>
              {soundKey}
            </option>
          ))}
        </select>
      </div>

      <div className="px-4">
        <label htmlFor="volume" className="mb-1 block text-sm font-medium text-gray-700">
          Volume: {volume}%
        </label>
        <input
          id="volume"
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full"
        />
      </div>

      <div className="mb-2 flex items-center justify-center gap-2">
        <button
          onClick={handlePlayEffect}
          disabled={selectedEffect === 'no_sound'}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          Play
        </button>

        <button
          onClick={handleStopEffect}
          disabled={selectedEffect === 'no_sound'}
          className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          Stop
        </button>
      </div>
    </div>
  );
};
