import { useEffect } from 'react';
import { SoundGroup } from '../soundController';
import { useSoundSourcesStore } from '../store/soundSourceStore';

type TSoundSources = {
  bgm: SoundGroup;
  sfx: SoundGroup;
};

export const useInitSound = ({ bgm, sfx }: TSoundSources) => {
  const { setBgSounds, setEffectSounds } = useSoundSourcesStore();

  useEffect(() => {
    setBgSounds(bgm);
    setEffectSounds(sfx);
  }, [setBgSounds, setEffectSounds, bgm, sfx]);
};
