import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import FullscreenModal from '@component/web/molecule/wc-m-full-screen-modal';
import ModalChangeLanguage from '@global/component/web/molecule/wc-m-modal-change-language';
import { cn } from '@global/helper/cn';
import StoreGame from '@global/store/game';
import StoreLessons from '@store/global/lessons';
import StoreGlobalPersist from '@store/global/persist';
import StoreSubjects from '@store/global/subjects';
import StoreSublessons from '@store/global/sublessons';
import StoreLoadingScene from '@store/web/loading-scene';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import ImageBGLogin from './assets/background-login.jpg';
import ConfigJson from './config/index.json';
import './index.css';
import { StateFlow } from './types';
import CLEVERMATH from '/logo/Clever_Math__Innomath.png';
import NEXTGEN from '/logo/NEXTGEN_LOGO.png';
import SCHOOL from '/logo/SCHOOL_LOGO.png';

interface LogoCardProps {
  imageUrl: string;
  alt: string;
  isSelected: boolean;
}

function LogoCard({ imageUrl, alt, isSelected }: LogoCardProps) {
  return (
    <div
      className={`size-[300px] flex items-center justify-center p-4  transition-transform `}
    >
      <div className="relative w-full h-full">
        <img
          src={imageUrl || '/placeholder.svg?height=200&width=200'}
          alt={alt}
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  );
}

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();
  const [showLogoDiv, setShowLogoDiv] = useState(true);
  const [logoVisible, setLogoVisible] = useState(true);
  const [stateFlowEnabled, setStateFlowEnabled] = useState(false);
  const logoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { userData } = StoreGlobalPersist.StateGet(['userData']);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(0);

    // init loading scene
    StoreLoadingScene.MethodGet().loadingSceneInit();
    StoreLoadingScene.MethodGet().loadingSceneSet({
      sceneData: ImageBGLogin,
    });

    const timer = setTimeout(() => {
      setShowLogoDiv(false);

      logoTimerRef.current = setTimeout(() => {
        setLogoVisible(false);
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(timer);
      if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    };
  }, []);

  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  const [showChangeLanguageModal, setShowChangeLanguageModal] = useState(true);
  const [showFullScreenModal, setShowFullScreenModal] = useState(false);

  const { loadingIs } = StoreLoadingScene.StateGet(['loadingIs']);

  const LoadingSceneUI = useCallback(
    () => StoreLoadingScene.MethodGet().uiGet(),
    [loadingIs],
  );

  const { visited } = StoreGlobalPersist.StateGet(['visited']);

  useEffect(() => {
    if (showLogoDiv === false) {
      handleOnInitLoading();
    }
  }, [showLogoDiv]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    if (userData?.school_code && userData?.student_id) {
      // Auto-navigate to PIN page
      navigate({ to: '/pin', viewTransition: true });
    } else {
      // No previous login data, start from SchoolID state
      navigate({ to: '/login-id', viewTransition: true });
    }
  }, []);

  const handleOnInitLoading = async () => {
    await StoreLoadingScene.MethodGet().start({
      delay: 500,
    });

    // step 1: initial store state
    await StoreLoadingScene.MethodGet().step({
      fn: async () => {
        let state = false;
        while (!state) {
          const { isReady: isSubjectStoreReady } =
            StoreSubjects.StateGetAllWithUnsubscribe();
          const { isReady: isLessonStoreReady } =
            StoreLessons.StateGetAllWithUnsubscribe();
          const { isReady: isSubLessonStoreReady } =
            StoreSublessons.StateGetAllWithUnsubscribe();
          state = isLessonStoreReady && isSubLessonStoreReady && isSubjectStoreReady;

          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      },
      progressPercentage: 1 * (100 / 3),
      titleText: t('loading-scene-step-1'),
      delay: 500,
    });

    // step 2: check if the user first visit the app
    await StoreLoadingScene.MethodGet().step({
      fn: async () => {
        if (!visited) {
          // step 2.1: if user first visit the app
          //           show set config modals (language and fullscreen mode)
          handleOnFirstVisit();
        } else {
          // step 2.2: if the user already visited the app
          //           continue to version update page
          await StoreLoadingScene.MethodGet().step({
            fn: () => {
              // set state flow to 0 for go to version update page
              StoreLoadingScene.MethodGet().complete({
                delay: 300,
                cb: () => {
                  // navigate to version update page
                  navigate({ to: '/login-id', viewTransition: true });
                },
              });
            },
            progressPercentage: 2 * (100 / 3),
            titleText: t('loading-scene-step-3'),
            // progressText: t('loadingScene.loading'),
            delay: 500,
          });
        }
      },
      progressPercentage: 2 * (100 / 3),
      titleText: t('loading-scene-step-2'),
      // progressText: t('loadingScene.loading'),
      delay: 500,
    });
  };

  const handleOnFirstVisit = async () => {
    // enable state flow for show modals
    setStateFlowEnabled(true);

    // set state flow to change language flow
    StoreGame.MethodGet().State.Flow.Set(StateFlow.Language);

    // set laoding scene complete for hide loading scene
    await StoreLoadingScene.MethodGet().complete({
      delay: 1000,
    });
  };

  const handleAfterSelectLanguage = async (language: string) => {
    // go next flow
    StoreGame.MethodGet().State.Flow.Set(StateFlow.FullScreen);
  };

  const handleAfterFullScreenModal = async () => {
    setShowFullScreenModal(false);
    // set visited to true
    StoreGlobalPersist.MethodGet().setVisited(true);
    // set state flow to out transition
    StoreGame.MethodGet().State.Flow.Set(StateFlow.Out);
    // navigate to version update page
    navigate({ to: '/login-id', viewTransition: true });
  };

  return loadingIs ? (
    <LoadingSceneUI />
  ) : (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      className="flex-1"
    >
      {logoVisible ? (
        <>
          <div
            className={`absolute inset-0 flex items-center justify-center`}
            style={{
              background:
                '#ffffff',
            }}
          />
          <SafezonePanel>
            <div
              className={cn(
                'flex flex-row gap-10 items-center justify-center w-full h-full',
                showLogoDiv ? 'fade-in' : 'fade-out',
              )}
            >
              <LogoCard
                imageUrl={SCHOOL}
                alt="SCHOOL"
                isSelected={false}
              />
              <LogoCard
                imageUrl={CLEVERMATH}
                alt="CLEVERMATH"
                isSelected={false}
              />
              <LogoCard
                imageUrl={NEXTGEN}
                alt="NEXTGEN"
                isSelected={false}
              />

            </div>
          </SafezonePanel>
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 bg-cover bg-bottom"
            style={{ backgroundImage: `url()` }}
          />
          <SafezonePanel className="absolute inset-0">
            {/* Safezone */}
            {stateFlowEnabled && stateFlow === StateFlow.Language && (
              <ModalChangeLanguage
                showModal={showChangeLanguageModal}
                setShowModal={setShowChangeLanguageModal}
                onLanguageChange={handleAfterSelectLanguage}
              />
            )}
            {stateFlowEnabled && stateFlow === StateFlow.FullScreen && (
              /* FullScreen */
              <FullscreenModal
                onClose={handleAfterFullScreenModal}
                onConfirm={handleAfterFullScreenModal}
              />
            )}
          </SafezonePanel>
        </>
      )}
    </ResponsiveScaler>
  );
};

export default DomainJSX;
