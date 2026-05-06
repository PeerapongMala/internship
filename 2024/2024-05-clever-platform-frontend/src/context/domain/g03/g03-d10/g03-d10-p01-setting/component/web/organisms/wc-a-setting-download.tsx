import { useTranslation } from 'react-i18next';

import ScrollableContainer from '@global/component/web/atom/wc-a-scrollable-container';
import ConfigJson from '../../../config/index.json';
import Selector from '../atoms/wc-a-selector';
import Slider from '../atoms/wc-a-slider';
import { TextNormal } from '../atoms/wc-a-text';

interface SettingContentProps {
  downloadSpeedPreset: string;
  setDownloadSpeedPreset: (preset: string) => void;
  assetConcurrency: number;
  setAssetConcurrency: (value: number) => void;
  sublessonConcurrency: number;
  setSublessonConcurrency: (value: number) => void;
  sublessonDelay: number;
  setSublessonDelay: (value: number) => void;
  levelDelay: number;
  setLevelDelay: (value: number) => void;
  questionDelay: number;
  setQuestionDelay: (value: number) => void;
}

export function DownloadContent({
  downloadSpeedPreset,
  setDownloadSpeedPreset,
  assetConcurrency,
  setAssetConcurrency,
  sublessonConcurrency,
  setSublessonConcurrency,
  sublessonDelay,
  setSublessonDelay,
  levelDelay,
  setLevelDelay,
  questionDelay,
  setQuestionDelay,
}: SettingContentProps) {
  const { t } = useTranslation([ConfigJson.key]);

  const presetOptions = [
    { label: t('downloadContent.preset.ultra_slow'), value: 'ultra_slow' },
    { label: t('downloadContent.preset.slow'), value: 'slow' },
    { label: t('downloadContent.preset.normal'), value: 'normal' },
    { label: t('downloadContent.preset.fast'), value: 'fast' },
    { label: t('downloadContent.preset.turbo'), value: 'turbo' },
    { label: t('downloadContent.preset.custom'), value: 'custom' },
  ];

  return (
    <ScrollableContainer className="flex-1 flex flex-col items-start w-full h-max divide-y-2 divide-[#fcd401] divide-dashed overflow-auto mb-5">
      {/* Preset Section */}
      <div className="flex-1 flex justify-between items-center w-full p-4 gap-8">
        <div className="flex-1 flex w-full justify-between gap-4">
          <div className="flex items-center gap-4">
            <TextNormal>{t('downloadContent.title.preset')}</TextNormal>
          </div>
          <div className="flex items-center gap-4 w-[300px] pr-5">
            <Selector
              value={downloadSpeedPreset}
              onValueChange={setDownloadSpeedPreset}
              options={presetOptions}
            />
          </div>
        </div>
      </div>

      {/* Asset Section */}
      <div className="flex-1 flex flex-col w-full p-4 gap-4">
        <div className="flex items-center gap-4">
          <TextNormal className="font-bold">{t('downloadContent.title.asset')}</TextNormal>
        </div>
        <div className="flex items-center gap-4 px-5">
          <TextNormal className="w-[400px]">{t('downloadContent.assetConcurrency')}</TextNormal>
          <Slider
            value={assetConcurrency}
            onValueChange={setAssetConcurrency}
            minValue={1}
            maxValue={15}
            step={1}
            className="w-3/4"
          />
          <TextNormal className="w-12 text-right">{`${assetConcurrency}`}</TextNormal>
        </div>
      </div>

      {/* Sublesson Section */}
      <div className="flex-1 flex flex-col w-full p-4 gap-4">
        <div className="flex items-center gap-4">
          <TextNormal className="font-bold">{t('downloadContent.title.sublesson')}</TextNormal>
        </div>
        <div className="flex items-center gap-4 px-5">
          <TextNormal className="w-[400px]">{t('downloadContent.sublessonConcurrency')}</TextNormal>
          <Slider
            value={sublessonConcurrency}
            onValueChange={setSublessonConcurrency}
            minValue={1}
            maxValue={15}
            step={1}
            className="w-3/4"
          />
          <TextNormal className="w-12 text-right">{`${sublessonConcurrency}`}</TextNormal>
        </div>
        <div className="flex items-center gap-4 px-5">
          <TextNormal className="w-[400px]">{t('downloadContent.sublessonDelay')}</TextNormal>
          <Slider
            value={sublessonDelay}
            onValueChange={setSublessonDelay}
            minValue={0}
            maxValue={200}
            step={10}
            className="w-3/4"
          />
          <TextNormal className="w-12 text-right">{`${sublessonDelay}`}</TextNormal>
        </div>
      </div>

      {/* Level & Question Section */}
      <div className="flex-1 flex flex-col w-full p-4 gap-4">
        <div className="flex items-center gap-4">
          <TextNormal className="font-bold">{t('downloadContent.title.level')}</TextNormal>
        </div>
        <div className="flex items-center gap-4 px-5">
          <TextNormal className="w-[400px]">{t('downloadContent.levelDelay')}</TextNormal>
          <Slider
            value={levelDelay}
            onValueChange={setLevelDelay}
            minValue={0}
            maxValue={100}
            step={10}
            className="w-3/4"
          />
          <TextNormal className="w-12 text-right">{`${levelDelay}`}</TextNormal>
        </div>
        <div className="flex items-center gap-4 px-5">
          <TextNormal className="w-[400px]">{t('downloadContent.questionDelay')}</TextNormal>
          <Slider
            value={questionDelay}
            onValueChange={setQuestionDelay}
            minValue={0}
            maxValue={150}
            step={10}
            className="w-3/4"
          />
          <TextNormal className="w-12 text-right">{`${questionDelay}`}</TextNormal>
        </div>
      </div>
    </ScrollableContainer>
  );
}

export default DownloadContent;