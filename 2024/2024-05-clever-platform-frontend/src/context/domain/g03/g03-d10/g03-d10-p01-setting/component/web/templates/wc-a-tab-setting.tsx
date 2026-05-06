import StoreGlobalPersist from '@store/global/persist';
import SettingContent from '../organisms/wc-a-setting-content';
import Footer from './wc-a-footer';

function TabSetting({
  setShowLanguageModal,
}: {
  setShowLanguageModal: (isOpen: boolean) => void;
}) {
  const { settings } = StoreGlobalPersist.StateGet(['settings']);


  return (
    <>
      <SettingContent
        {...{
          isEnableBackgroundMusic: settings.enableBackgroundMusic,
          setEnableBackgroundMusic: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              enableBackgroundMusic: value ?? false,
            });
          },
          backgroundMusicVolumn: settings.backgroundMusicVolumn,
          setBackgroundMusicVolumn: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              backgroundMusicVolumn: value,
            });
          },
          isEnableSFXMusic: settings.enableSFXMusic,
          setEnableSFXMusic: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              enableSFXMusic: value,
            });
          },
          sfxMusicVolumn: settings.SFXVolumn,
          setSFXMusicVolumn: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              SFXVolumn: value,
            });
          },
          isEnableSoundMusic: settings.enableSoundMusic,
          setEnableSoundMusic: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              enableSoundMusic: value,
            });
          },
          soundVolumn: settings.soundVolumn,
          setSoundVolumn: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              soundVolumn: value,
            });
          },
          fontSize: settings.fontSize,
          setFontSize: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              fontSize: value,
            });
          },
          textLanguage: settings.textLanguage,
          setTextLanguage: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              textLanguage: value,
            });
          },
          soundLanguage: settings.soundLanguage,
          setSoundLanguage: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              soundLanguage: value,
            });
          },
          isEnableGameplayModelRenderer: settings.enableGameplayModelRenderer,
          setEnableGameplayModelRenderer: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              enableGameplayModelRenderer: value,
            });
          },
          isEnableParticle: settings.enableParticle,
          setEnableParticle: (value) => {
            StoreGlobalPersist.MethodGet().updateSettings({
              enableParticle: value,
            });
          },



        }}
      />
      {/* footer content */}
      <Footer setShowLanguageModal={setShowLanguageModal} />
    </>
  );
}

export default TabSetting;
