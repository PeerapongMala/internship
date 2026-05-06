import {
  FAST_PRESET,
  NORMAL_PRESET,
  SLOW_PRESET,
  TURBO_PRESET,
  ULTRA_SLOW_PRESET,
} from '@global/helper/download-config';
import StoreGlobalPersist from '@store/global/persist';
import DownloadContent from '../organisms/wc-a-setting-download';
import Footer from './wc-a-footer';

function TabDownload({
  setShowLanguageModal,
}: {
  setShowLanguageModal: (isOpen: boolean) => void;
}) {
  const { settings } = StoreGlobalPersist.StateGet(['settings']);

  // Determine current preset based on config values
  const getCurrentPreset = (): 'ultra_slow' | 'slow' | 'normal' | 'fast' | 'turbo' | 'custom' => {
    const config = settings.downloadConfig;
    if (
      config.sublessonConcurrency === ULTRA_SLOW_PRESET.sublessonConcurrency &&
      config.sublessonDelay === ULTRA_SLOW_PRESET.sublessonDelay &&
      config.levelDelay === ULTRA_SLOW_PRESET.levelDelay &&
      config.questionDelay === ULTRA_SLOW_PRESET.questionDelay &&
      config.assetConcurrency === ULTRA_SLOW_PRESET.assetConcurrency
    ) {
      return 'ultra_slow';
    }
    if (
      config.sublessonConcurrency === SLOW_PRESET.sublessonConcurrency &&
      config.sublessonDelay === SLOW_PRESET.sublessonDelay &&
      config.levelDelay === SLOW_PRESET.levelDelay &&
      config.questionDelay === SLOW_PRESET.questionDelay &&
      config.assetConcurrency === SLOW_PRESET.assetConcurrency
    ) {
      return 'slow';
    }
    if (
      config.sublessonConcurrency === NORMAL_PRESET.sublessonConcurrency &&
      config.sublessonDelay === NORMAL_PRESET.sublessonDelay &&
      config.levelDelay === NORMAL_PRESET.levelDelay &&
      config.questionDelay === NORMAL_PRESET.questionDelay &&
      config.assetConcurrency === NORMAL_PRESET.assetConcurrency
    ) {
      return 'normal';
    }
    if (
      config.sublessonConcurrency === FAST_PRESET.sublessonConcurrency &&
      config.sublessonDelay === FAST_PRESET.sublessonDelay &&
      config.levelDelay === FAST_PRESET.levelDelay &&
      config.questionDelay === FAST_PRESET.questionDelay &&
      config.assetConcurrency === FAST_PRESET.assetConcurrency
    ) {
      return 'fast';
    }
    if (
      config.sublessonConcurrency === TURBO_PRESET.sublessonConcurrency &&
      config.sublessonDelay === TURBO_PRESET.sublessonDelay &&
      config.levelDelay === TURBO_PRESET.levelDelay &&
      config.questionDelay === TURBO_PRESET.questionDelay &&
      config.assetConcurrency === TURBO_PRESET.assetConcurrency
    ) {
      return 'turbo';
    }
    return 'custom';
  };

  return (
    <>
      <DownloadContent
        {...{
          downloadSpeedPreset: getCurrentPreset(),
          setDownloadSpeedPreset: (preset: string) => {
            // If custom is selected, don't change anything - keep current values
            if (preset === 'custom') {
              return;
            }

            // Type guard: only accept valid presets
            if (
              preset !== 'ultra_slow' &&
              preset !== 'slow' &&
              preset !== 'normal' &&
              preset !== 'fast' &&
              preset !== 'turbo'
            ) {
              return;
            }

            let newConfig;
            switch (preset) {
              case 'ultra_slow':
                newConfig = ULTRA_SLOW_PRESET;
                break;
              case 'slow':
                newConfig = SLOW_PRESET;
                break;
              case 'normal':
                newConfig = NORMAL_PRESET;
                break;
              case 'fast':
                newConfig = FAST_PRESET;
                break;
              case 'turbo':
                newConfig = TURBO_PRESET;
                break;
              default:
                newConfig = NORMAL_PRESET;
                break;
            }
            StoreGlobalPersist.MethodGet().updateSettings({
              downloadConfig: newConfig,
            });
          },
          // Download config individual values
          assetConcurrency: settings.downloadConfig.assetConcurrency,
          setAssetConcurrency: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              downloadConfig: {
                ...settings.downloadConfig,
                assetConcurrency: value,
              },
            });
          },
          sublessonConcurrency: settings.downloadConfig.sublessonConcurrency,
          setSublessonConcurrency: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              downloadConfig: {
                ...settings.downloadConfig,
                sublessonConcurrency: value,
              },
            });
          },
          sublessonDelay: settings.downloadConfig.sublessonDelay,
          setSublessonDelay: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              downloadConfig: {
                ...settings.downloadConfig,
                sublessonDelay: value,
              },
            });
          },
          levelDelay: settings.downloadConfig.levelDelay,
          setLevelDelay: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              downloadConfig: {
                ...settings.downloadConfig,
                levelDelay: value,
              },
            });
          },
          questionDelay: settings.downloadConfig.questionDelay,
          setQuestionDelay: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              downloadConfig: {
                ...settings.downloadConfig,
                questionDelay: value,
              },
            });
          },


        }}
      />
      {/* footer content */}
      <Footer setShowLanguageModal={setShowLanguageModal} />
    </>
  );
}

export default TabDownload;
