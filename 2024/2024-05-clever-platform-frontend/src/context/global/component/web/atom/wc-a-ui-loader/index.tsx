import StoreGlobal from '../../../../store/global';
import StoreLessons from '../../../../store/global/lessons';

import { LottieComponentProps, useLottie } from 'lottie-react';
import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const WCAUILoader = (props: any) => {
  const { loadingIs } = StoreGlobal.StateGet(['loadingIs']);

  // check service worker is registered
  // if `needRefresh` is true, then sw need to update
  // and when it updated, `needRefresh` will be false (state) and ui will be re-rendered
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onNeedRefresh: () => {
      console.log('🔄 SW Need Refresh!');
    },
    onRegisteredSW: (swScriptUrl, registration) => {
      console.log('✅ SW Registered!');
    },
    onRegisterError(error) {
      console.log('❌ SW registration error', error);
    },
  });
  const [backgroundAnimation, setBackgroundAnimation] = useState();

  // 🆕 Prevent SW update if lesson download is in progress
  useEffect(() => {
    if (needRefresh) {
      // Check if any lesson is being downloaded
      const lessonsStore = StoreLessons.MethodGet();
      const allLessons = lessonsStore.all();
      const hasActiveDownloads = Object.values(allLessons || {}).some((lesson) => {
        if (!lesson || typeof lesson !== 'object' || !('id' in lesson)) return false;
        return lessonsStore.isDownloadInProgress(String(lesson.id));
      });

      if (hasActiveDownloads) {
        console.log('⏸️ SW update delayed: Lesson download in progress');
        // Delay the update until download is complete
        setNeedRefresh(false);
        return;
      }

      // Safe to update SW
      console.log('✅ Safe to update SW: No active downloads');
      updateServiceWorker(true);
    }
  }, [needRefresh, updateServiceWorker, setNeedRefresh]);

  const AnimationBackgroundDefault = new URL(
    '/assets/particle/loader.json',
    import.meta.url,
  ).href;
  const options: LottieComponentProps = {
    animationData: backgroundAnimation,
    loop: true,
  };

  const lottie = useLottie(options);
  lottie.setSpeed(1.5);

  const { View } = lottie;

  useEffect(() => {
    fetch(AnimationBackgroundDefault)
      .then((response) => response.json())
      .then((data) => {
        setBackgroundAnimation(data);
      })
      .catch((error) => {
        console.error('Error loading animation:', error);
      });
  }, [AnimationBackgroundDefault, loadingIs]);

  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      {loadingIs && (
        <>
          <div className="absolute w-[20%] z-50">{View}</div>
          <div className="absolute h-full w-full opacity-50 bg-black z-40" />
        </>
      )}
      <div className="absolute top-0 left-0 w-full h-full">{props.children}</div>
    </div>
  );
};

export default WCAUILoader;
