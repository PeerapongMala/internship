import ProgressBar from '@component/web/atom/wc-a-progress-bar/load-model-progress-bar';
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import ConfigJson from '@domain/g01/g01-d03/local/config/index.json';
import ThreeModelRenderer from '@global/component/game/model-renderer/character-model-renderer-initial';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import ImageBGGeneral from '/default/background-login.png';

interface LoadingScreenProps {
  isOpen: boolean;
  progress?: number;
  sceneData?: string;
  characterData?: string;
  title?: string;
  footer?: string;
  progressText?: string;
}

const LoadingScreen = ({
  isOpen,
  sceneData,
  characterData,
  title,
  footer,
  progress = 0,
  progressText = '',
}: LoadingScreenProps) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const screenId = 'loading-scene-template';

  useEffect(() => {
    const loadingSceneElement = document.getElementById(screenId);

    if (!document.startViewTransition) {
      if (loadingSceneElement) {
        loadingSceneElement.style.opacity = isOpen ? '1' : '0';
        loadingSceneElement.style.zIndex = isOpen ? '999' : '-1';
      }
      return () => { };
    }

    // use ViewTransition API
    const transition = document.startViewTransition(() => {
      if (loadingSceneElement) {
        loadingSceneElement.style.opacity = isOpen ? '1' : '0';
        loadingSceneElement.style.zIndex = isOpen ? '999' : '-1';
      }
    });
    return () => {
      transition.skipTransition();
    };
  }, [isOpen]);

  return (
    <ResponsiveScaler
      id={screenId}
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 bg-gray-800 overflow-hidden transition-allease-in-out"
    >
      <div
        className="absolute inset-0 bg-cover bg-bottom"
        //style={{ backgroundImage: `url(${sceneData ? sceneData : ImageBGGeneral})` }}
        style={{ backgroundImage: `url(${ImageBGGeneral})` }}
      />
      <SafezonePanel className="relative flex flex-col items-center justify-center pb-10">
        <div className="w-full min-h-[75%] flex justify-center items-center">
          <ThreeModelRenderer
            modelSrc={'set2_character1_level1'}
            className="relative h-full w-full"
          />
        </div>
        {/* <div className="grow mt-[9rem]"></div> */}
        <div className="w-full flex justify-center px-24 h-full mb-3">
          <ProgressBar progress={progress} title={title} footer={progressText} />
        </div>
        <div className="h-20 w-full flex justify-center px-16 text-2xl items-center">
          {footer}
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default LoadingScreen;
