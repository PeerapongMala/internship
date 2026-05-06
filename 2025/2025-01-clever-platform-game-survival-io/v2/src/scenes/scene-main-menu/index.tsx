import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { useCharacterStore } from '@/store/characterStore';
import { SceneName } from '@/types/game';
import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';
import {
  SceneTemplate,
  SceneTemplateProps,
} from '@core-utils/scene/SceneTemplate';
import { SceneManager } from '@core-utils/scene/scene-manager';
import { ScrollableModal } from '@core-utils/ui/scrollable-modal/ScrollableModal';
import { useArcadeStore } from '@core-utils/api/arcade/arcade-store';
import { ArcadeRestAPI } from '@core-utils/api/arcade/rest-api';
import { playBackgroundMusic, playSoundEffect } from '@core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

// function getRankClass(index: number): string {
//   switch (index) {
//     case 0:
//       return "text-yellow-400";
//     case 1:
//       return "text-gray-300";
//     case 2:
//       return "text-orange-400";
//     default:
//       return "text-gray-500";
//   }
// }

// Functional component for hooks and rendering
function MainMenuContent() {
  const { startGame, resetGame } = useGameStore();
  const { createNewPlayer } = useLeaderboardStore();
  const { playToken } = useArcadeStore(); // 🔐 ดึง playToken มาเช็ค
  const {
    setPreloadedModelUrl,
    setIsModelLoading,
    setModelLoadError,
    preloadedModelUrl,
    isModelLoading
  } = useCharacterStore(); // 🎮 ดึง character store
  const [showLoading, setShowLoading] = useState(true);

  const [, setBackgroundImage] = useState<string | undefined>();

  // 🎮 Pre-load character model ที่หน้า main menu
  useEffect(() => {
    const preloadModel = async () => {
      // ถ้าไม่มี playToken ไม่ต้องโหลด
      if (!playToken || playToken === '') {
        console.log('⏸️ No playToken - skipping model preload');
        return;
      }

      // ถ้าโหลดไว้แล้ว ไม่ต้องโหลดซ้ำ
      if (preloadedModelUrl) {
        console.log('✅ Model already preloaded:', preloadedModelUrl);
        return;
      }

      console.log('🔄 [MainMenu] Starting model preload...');
      setIsModelLoading(true);
      setModelLoadError(null);

      try {
        console.log('📡 [MainMenu] Calling ArcadeRestAPI.GetModel...');
        const response = await ArcadeRestAPI.GetModel(playToken);

        if (response instanceof ArrayBuffer) {
          console.log('✅ [MainMenu] Model loaded, size:', response.byteLength);
          const blob = new Blob([response], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          setPreloadedModelUrl(url);
          console.log('✅ [MainMenu] Model URL created and stored:', url);
        } else {
          console.error('❌ [MainMenu] Response is not ArrayBuffer');
          setModelLoadError('Invalid response format');
        }
      } catch (err) {
        console.error('❌ [MainMenu] Error preloading model:', err);
        setModelLoadError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsModelLoading(false);
      }
    };

    preloadModel();
  }, [playToken, preloadedModelUrl, setPreloadedModelUrl, setIsModelLoading, setModelLoadError]);

  useEffect(() => {
    const fallbackImage = new URL('/image/background/main-menu-bg.png', import.meta.url)
      .href;
    setBackgroundImage(fallbackImage);

    resetGame();
    SceneManager.getInstance().setScene(SceneName.MENU);
    // Start BGM on main menu
    void playBackgroundMusic(SOUND_GROUPS.bgm.miami_heatwave);
    const timer = setTimeout(() => setShowLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [resetGame]);

  const handleStart = () => {
    void playSoundEffect(SOUND_GROUPS.sfx.ui_button);
    // 🛡️ ตรวจสอบว่ามี playToken หรือไม่
    if (!playToken || playToken === '') {
      alert('⚠️ กรุณาเข้าสู่ระบบและรับ Play Token ก่อนเริ่มเกม');
      SceneManager.getInstance().setScene(SceneName.LOGIN);
      return;
    }

    createNewPlayer();
    startGame();
    SceneManager.getInstance().setScene(SceneName.GAME);
  };

  return (
    <>
      <ScrollableModal>
        <div className="relative flex max-h-[618px] max-w-[1137px] items-center justify-center">
          {/* Title Section */}
          {/* <div className='absolute w-[1137px] h-[368px]'> */}
          <div className="animate-updown">
            <div className="animate-leftright">
              <img
                src={PUBLIC_ASSETS_LOCATION.image.title}
                alt="title"
                className="mb-[100px] flex h-auto w-[1137px] items-center justify-center object-center"
              />
            </div>
          </div>
          {/* </div> */}
          {showLoading && (
            // Loading Section
            <div
              className="absolute flex h-[222px] w-full items-center justify-center"
              style={{
                left: '50%',
                top: '500px',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <img src={PUBLIC_ASSETS_LOCATION.image.loading} />
            </div>
          )}
          {/* 🎮 Model Loading Indicator */}
          {showLoading && isModelLoading && playToken && (
            <div
              className="absolute flex items-center justify-center rounded-lg bg-blue-500/80 px-6 py-3 text-white shadow-lg backdrop-blur-sm"
              style={{
                top: '80px',
                left: '50%',
                transform: 'translate(-50%, 0)',
              }}
            >
              <span className="text-lg font-bold">🎨 กำลังโหลดโมเดลตัวละคร...</span>
            </div>
          )}
        </div>
      </ScrollableModal>
      {!showLoading && (
        <>
          {/* 🔐 แจ้งเตือนถ้าไม่มี playToken */}
          {(!playToken || playToken === '') && (
            <div
              className="absolute flex items-center justify-center rounded-lg bg-red-500/80 px-6 py-3 text-white shadow-lg backdrop-blur-sm"
              style={{
                top: '20px',
                left: '50%',
                transform: 'translate(-50%, 0)',
              }}
            >
              <span className="text-lg font-bold">⚠️ กรุณาเข้าสู่ระบบและรับ Play Token ก่อนเริ่มเกม</span>
            </div>
          )}

          {/* <div
            className='absolute w-full max-h-[163px]'
            style={{
              left: '50%',
              bottom: 0,
              transform: 'translate(-50%, 0)',
            }}
          > */}
          <div
            className="absolute flex h-auto max-w-[1137px] items-center justify-center"
            style={{
              // left: '50%',
              bottom: 0,
              // transform: 'translate(-50%, 0)',
            }}
          >
            <img
              src={PUBLIC_ASSETS_LOCATION.image.playBtnBG}
              alt="playBtn"
              className="pointer-events-none"
            />
            {/* Play Button */}
            <div
              className="absolute flex max-h-[163px] w-full items-center justify-center px-[40%]"
              style={{
                left: '50%',
                bottom: '70%',
                transform: 'translate(-50%, 50%)',
              }}
            >
              <button
                onClick={handleStart}
                onMouseEnter={() => void playSoundEffect(SOUND_GROUPS.sfx.ui_button)}
                disabled={!playToken || playToken === ''} // 🔒 ปิดการใช้งานถ้าไม่มี playToken
                className={`animate-idlebutton h-auto w-[50%] transition duration-300 hover:scale-110 ${!playToken || playToken === ''
                  ? 'cursor-not-allowed opacity-50 grayscale' // 🔒 ปรับสีให้ดูว่าปิดการใช้งาน
                  : ''
                  }`}
                title={!playToken || playToken === '' ? 'กรุณาเข้าสู่ระบบและรับ Play Token ก่อน' : 'คลิกเพื่อเริ่มเกม'}
              >
                <img
                  src={PUBLIC_ASSETS_LOCATION.image.playBtn}
                  className="flex items-center justify-center object-center"
                />
              </button>
            </div>
            {/* Exit Button Section */}
            <div
              className="absolute flex max-h-[163px] w-full items-center justify-center px-[40%]"
              style={{
                right: '20%',
                bottom: '40%',
                transform: 'translate(50%, 50%)',
              }}
            >
              <button
                // onClick={handleStart}
                onClick={() => void playSoundEffect(SOUND_GROUPS.sfx.ui_button)}
                onMouseEnter={() => void playSoundEffect(SOUND_GROUPS.sfx.ui_button)}
                className="animate-idlebutton h-auto w-[50%] transition duration-300 hover:scale-110"
              >
                <img
                  src={PUBLIC_ASSETS_LOCATION.image.exitBtn}
                  className="flex items-center justify-center object-center"
                />
              </button>
            </div>
          </div>
          {/* </div> */}
        </>
      )}
    </>
  );
}

// Class that extends SceneTemplate and delegates rendering to the functional component
export class SceneMainMenu extends SceneTemplate {
  constructor(props: SceneTemplateProps) {
    super(props);
    // console.debug(logger.getCallerMessage("SceneMainMenu constructor called", { props: props }));
    // this.content = <MainMenuContent />;
    this.background = PUBLIC_ASSETS_LOCATION.image.background.mainMenu;
    this.sceneInitial();
  }

  renderScene = () => {
    return <MainMenuContent />;
  };
}
