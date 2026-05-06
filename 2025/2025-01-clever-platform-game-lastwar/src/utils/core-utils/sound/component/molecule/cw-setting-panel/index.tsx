import { useSoundSourcesStore } from '../../../store/soundSourceStore';
import { CWSelectBackground } from '../../atoms/cw-select-bg';
import { CWSelectEffect } from '../../atoms/cw-select-effect';
import { CWSoundBackgoundControl } from '../../atoms/cw-sound-bg-control';

export type TAddSound = {
  bg_sound?: any;
  effect_sound?: any;
};

const CWSettingsPanel = () => {
  const { bgSounds, effectSounds } = useSoundSourcesStore();

  return (
    <div className="reletive w-[200px] bg-gray-100">
      <CWSelectBackground bg_sound={bgSounds} />
      <CWSoundBackgoundControl />
      <CWSelectEffect effect_sound={effectSounds} />
    </div>
  );
};

export default CWSettingsPanel;
