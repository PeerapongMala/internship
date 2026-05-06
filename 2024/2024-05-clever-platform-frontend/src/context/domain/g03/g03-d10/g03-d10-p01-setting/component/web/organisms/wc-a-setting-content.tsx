import { useTranslation } from 'react-i18next';

import ScrollableContainer from '@global/component/web/atom/wc-a-scrollable-container';
import { cn } from '@global/helper/cn';
import IconMicrophone from '../../../assets/icon-microphone.svg';
import IconMusic from '../../../assets/icon-music.svg';
import ConfigJson from '../../../config/index.json';
import Checkbox from '../atoms/wc-a-checkbox';
import { IconSmall } from '../atoms/wc-a-icon';
import Selector from '../atoms/wc-a-selector';
import Slider from '../atoms/wc-a-slider';
import { TextNormal } from '../atoms/wc-a-text';

interface SettingContentProps {
  isEnableBackgroundMusic: boolean;
  setEnableBackgroundMusic: (value: boolean) => void;
  backgroundMusicVolumn: number;
  setBackgroundMusicVolumn: (value: number) => void;
  isEnableSFXMusic: boolean;
  setEnableSFXMusic: (value: boolean) => void;
  sfxMusicVolumn: number;
  setSFXMusicVolumn: (value: number) => void;
  isEnableSoundMusic: boolean;
  setEnableSoundMusic: (value: boolean) => void;
  soundVolumn: number;
  setSoundVolumn: (value: number) => void;
  fontSize: number;
  setFontSize: (value: number) => void;
  textLanguage: string;
  setTextLanguage: (value: string) => void;
  soundLanguage: string;
  setSoundLanguage: (value: string) => void;
  isEnableGameplayModelRenderer: boolean;
  setEnableGameplayModelRenderer: (value: boolean) => void;
  isEnableParticle: boolean;
  setEnableParticle: (value: boolean) => void;

}

export function SettingContent({
  isEnableBackgroundMusic,
  setEnableBackgroundMusic,
  backgroundMusicVolumn,
  setBackgroundMusicVolumn,
  isEnableSFXMusic,
  setEnableSFXMusic,
  sfxMusicVolumn,
  setSFXMusicVolumn,
  isEnableSoundMusic,
  setEnableSoundMusic,
  soundVolumn,
  setSoundVolumn,
  fontSize,
  setFontSize,
  textLanguage,
  setTextLanguage,
  soundLanguage,
  setSoundLanguage,
  isEnableGameplayModelRenderer,
  setEnableGameplayModelRenderer,
  isEnableParticle,
  setEnableParticle,

}: SettingContentProps) {
  const { t } = useTranslation([ConfigJson.key]);
  return (
    <ScrollableContainer className="flex-1 flex flex-col items-start w-full h-max divide-y-2 divide-[#fcd401] divide-dashed overflow-auto">
      {/* row 1: background music & sfx music */}
      <div className="flex-1 flex justify-between items-center w-full p-4 gap-8">
        <div className="flex-1 flex flex-col w-full gap-4">
          <div className="flex items-center gap-4">
            <Checkbox
              id="checkbox-background-music"
              checked={isEnableBackgroundMusic}
              onChange={setEnableBackgroundMusic}
            />
            <label htmlFor="checkbox-background-music">
              <TextNormal>{t('label_background_music')}</TextNormal>
            </label>
          </div>
          <div className="flex items-center gap-4">
            <IconSmall src={IconMusic} />
            <Slider
              value={backgroundMusicVolumn}
              onValueChange={setBackgroundMusicVolumn}
              minValue={0}
              maxValue={100}
              step={5}
              className="w-3/4"
              disabled={!isEnableBackgroundMusic}
            />
            <TextNormal>{`${backgroundMusicVolumn}%`}</TextNormal>
          </div>
        </div>
        <div className="flex-1 flex flex-col w-full gap-4">
          <div className="flex items-center gap-4">
            <Checkbox
              id="checkbox-sfx-music"
              checked={isEnableSFXMusic}
              onChange={setEnableSFXMusic}
            />
            <label htmlFor="checkbox-sfx-music">
              <TextNormal>{t('label_sfx_music')}</TextNormal>
            </label>
          </div>
          <div className="flex items-center gap-4">
            <IconSmall src={IconMusic} />
            <Slider
              value={sfxMusicVolumn}
              onValueChange={setSFXMusicVolumn}
              minValue={0}
              maxValue={100}
              step={5}
              className="w-3/4"
              disabled={!isEnableSFXMusic}
            />
            <TextNormal>{`${sfxMusicVolumn}%`}</TextNormal>
          </div>
        </div>
      </div>
      {/* row 2: font size adjustment & sfx music */}
      <div className="flex-1 flex justify-between items-center w-full p-4 gap-8">
        <div className="flex-1 flex flex-col w-full gap-4">
          <div className="flex items-center gap-4">
            <Checkbox
              id="checkbox-sound-music"
              checked={isEnableSoundMusic}
              onChange={setEnableSoundMusic}
            />
            <label htmlFor="checkbox-sound-music">
              <TextNormal>{t('label_sound_music')}</TextNormal>
            </label>
          </div>
          <div className="flex items-center gap-4">
            <Slider
              value={soundVolumn}
              onValueChange={setSoundVolumn}
              minValue={0}
              maxValue={100}
              step={5}
              className="w-[84%]"
              disabled={!isEnableSoundMusic}
            />
            <TextNormal>{`${soundVolumn}%`}</TextNormal>
          </div>
        </div>
        <div className="flex-1 flex flex-col w-full gap-4">
          <div className={cn('flex items-center gap-4', 'hidden')}>
            <Checkbox
              id="checkbox-enable-gameplay-model-renderer"
              checked={isEnableGameplayModelRenderer}
              onChange={setEnableGameplayModelRenderer}
            />
            <label htmlFor="checkbox-enable-gameplay-model-renderer">
              <TextNormal>{t('label_enable_gameplay_model_renderer')}</TextNormal>
            </label>
          </div>
          <div className={cn('flex items-center gap-4', 'hidden')}>
            <Checkbox
              id="checkbox-enable-particle"
              checked={isEnableParticle}
              onChange={setEnableParticle}
            />
            <label htmlFor="checkbox-enable-particle">
              <TextNormal>{t('label_enable_particle')}</TextNormal>
            </label>
          </div>
        </div>
        {/* <div className="flex-1 flex flex-col w-full gap-4">
          <div className="flex items-center gap-4">
            <TextNormal>{t('label_font_size')}</TextNormal>
          </div>
          <div className="flex items-center gap-4">
            <IconSmall src={IconFontDecrease} />
            <Slider
              value={fontSize}
              onValueChange={setFontSize}
              step={1}
              minValue={1}
              maxValue={4}
              className="w-3/4"
            />
            <IconSmall src={IconFontIncrease} />
          </div>
        </div> */}
      </div>
      {/* row 3: text & sound language */}
      <div className="flex-1 flex  items-center w-full p-4 gap-8">

        <div className="flex-1 flex  w-full gap-4">
          <div className="flex items-center gap-4">
            <IconSmall src={IconMicrophone} />
            <TextNormal>{t('label_sound_language')}</TextNormal>
          </div>
          <div className="flex items-center gap-4">
            <Selector
              value={soundLanguage}
              onValueChange={setSoundLanguage}
              options={[
                { label: t('option_label_language_th'), value: 'th' },
                { label: t('option_label_language_en'), value: 'en' },
                { label: t('option_label_language_cn'), value: 'cn' },
              ]}
            />
          </div>
        </div>
      </div>

    </ScrollableContainer>
  );
}

export default SettingContent;
