import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { SceneName } from '@/types/game';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import { SceneManager } from '@core-utils/scene/scene-manager';
import {
  SceneTemplate,
  SceneTemplateProps,
} from '@core-utils/scene/SceneTemplate';
import { ScrollableModal } from '@core-utils/ui/scrollable-modal/ScrollableModal';
import { useCharacterStore } from '@/store/characterStore';
import { useArcadeStore } from '@core-utils/api/arcade/arcade-store';
import { ArcadeRestAPI } from '@core-utils/api/arcade/rest-api';
import { playBackgroundMusic, pauseBackgroundMusic, playSoundEffect } from '@core-utils/sound';
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
  // const [showLoading, setShowLoading] = useState(true);

  const [, setBackgroundImage] = useState<string | undefined>();

  useEffect(() => {
    const sceneManager = SceneManager.getInstance();

    const handleSceneChange = (sceneName: string) => {
      if (sceneName === SceneName.MENU) {
        // Play background music (automatically handles audio unlock)
        playBackgroundMusic(SOUND_GROUPS.bgm.callof_the_jungle);
      } else {
        // Pause music when leaving menu scene
        pauseBackgroundMusic();
      }
    };
    sceneManager.subscribeSceneChange(handleSceneChange);
    handleSceneChange(sceneManager.getCurrentSceneName());

    return () => {
      sceneManager.unsubscribeSceneChange(handleSceneChange);
    };
  }, []);

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
    // const timer = setTimeout(() => setShowLoading(false), 3000);
    // return () => clearTimeout(timer);
  }, [resetGame]);

  const handleStart = () => {
    void playSoundEffect(SOUND_GROUPS.sfx.gui_button);
    createNewPlayer();
    startGame();
    SceneManager.getInstance().setScene(SceneName.GAME);
  };

  return (
    <>
      <ScrollableModal>
        <div className="justify-centern relative flex max-h-[314px] max-w-[543px] items-center">
          {/* <div
            className="absolute inset-0 bg-cover bg-bottom"
            style={{ backgroundImage: `url(${PUBLIC_ASSETS_LOCATION.image.background.mainMenu})` }}
          /> */}

          <div className="relative mb-16 flex flex-col items-center justify-center">
            {/* <div className="absolute top-0 left-0 w-full h-full">
          <div className="flex flex-col items-center justify-center min-h-screen w-full p-8"> */}
            <img
              src={PUBLIC_ASSETS_LOCATION.image.title}
              alt="title"
              className="w-350px h-350px animate-wiggle mb-8 object-center"
            />
            {/* {showLoading ? ( */}
            {isModelLoading ? (
              <img src={PUBLIC_ASSETS_LOCATION.image.loading} />
            ) : (
              // <></>
              <button
                onClick={handleStart}
                className="animate-idlebutton flex items-center justify-center pr-8 pl-8 transition duration-300 hover:scale-110"
              >
                <img
                  src={PUBLIC_ASSETS_LOCATION.image.playBtn}
                  alt="playBtn"
                  className="flex items-center justify-center object-center"
                />
              </button>
            )}
            {/* </section> */}
            {/* {!showLoading ? (
              <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4">
                <h2 className="text-4xl text-center font-bold drop-shadow-md">
                  Leaderboard
                </h2>
                <ul className="mt-4 max-h-96 overflow-y-auto w-full">
                  {leaderboard.length > 0 ? (
                    leaderboard.map((player, index) => (
                      <li
                        key={player.id}
                        className="flex justify-between items-center px-6 py-4  bg-white rounded-full"
                      >
                        <span className={`text-xl font-bold ${getRankClass(index)}`}>
                          #{index + 1} - {player.score} points
                        </span>
                        <span className={`text-xl font-bold ${getRankClass(index)}`}>
                          {`${Math.floor(
                            (player.lastCountdownTime ?? 0) / 60
                          )}:${Math.floor((player.lastCountdownTime ?? 0) % 60)
                            .toString()
                            .padStart(2, "0")}`}
                        </span>
                        <span className="text-gray-400 text-lg">
                          {new Date(player.timestamp).toLocaleDateString()}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-2xl italic text-yellow-500 py-6">
                      No scores yet
                    </li>
                  )}
                </ul>
              </div>
            ) : null} */}
          </div>
        </div>
      </ScrollableModal>
      {/* </div> */}
    </>
  );
}

// Class that extends SceneTemplate and delegates rendering to the functional component
export class SceneMainMenu extends SceneTemplate {
  constructor(props: SceneTemplateProps) {
    super(props);
    this.background = PUBLIC_ASSETS_LOCATION.image.background.mainMenu;
    // console.debug(logger.getCallerMessage("SceneMainMenu constructor called", { props: props }));
    // this.content = <MainMenuContent />;
    this.sceneInitial();
  }

  renderScene = () => {
    return <MainMenuContent />;
  };
}
