import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { SceneName } from '@/types/game';
import { logger } from '@core-utils/debug/logger';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import {
  SceneTemplate,
  SceneTemplateProps,
} from '@core-utils/scene/SceneTemplate';
import { SceneManager } from '@core-utils/scene/scene-manager';
import { ScrollableModal } from '@core-utils/ui/scrollable-modal/ScrollableModal';
import { useBackgroundMusicStore } from '@core-utils/sound/store/backgroundMusic';
import { playSoundUI } from '@/components/ui/play-sound-ui';
import { SOUND_GROUPS } from '@assets/public-sound';
import { ARCADE_GAME_ID, GAME_BASE_URL } from '@core-utils/api';
import { useArcadeStore } from '@/utils/core-utils/api/arcade/arcade-store';
import { pauseBackgroundMusic, playBackgroundMusic } from '@/utils/core-utils/sound/simpleAudio';

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
  const [showLoading, setShowLoading] = useState(true);

  const [, setBackgroundImage] = useState<string | undefined>();

  const { playSound, pauseSound } = useBackgroundMusicStore();
  const { clearArcadeStorage } = useArcadeStore();
  useEffect(() => {
    const fallbackImage = new URL('/image/background/main-menu-bg.png', import.meta.url)
      .href;
    setBackgroundImage(fallbackImage);

    resetGame();
    SceneManager.getInstance().setScene(SceneName.MENU);
    const timer = setTimeout(() => setShowLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [resetGame]);

  useEffect(() => {
    const sceneManager = SceneManager.getInstance();

    const handleSceneChange = (sceneName: string) => {
      if (sceneName === SceneName.MENU) {
        // Play background music (automatically handles audio unlock)
        playBackgroundMusic(SOUND_GROUPS.bgm.cookie_and_candy_1);
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
  }, [playSound, pauseSound]);

  const handleStart = () => {
    createNewPlayer();
    startGame();
    SceneManager.getInstance().setScene(SceneName.GAME);
  };
  const handleLogout = () => {
    console.log('logout click');
    clearArcadeStorage();
    window.location.href = `${GAME_BASE_URL}/arcade-leaderboard/${ARCADE_GAME_ID}`;
  };

  return (
    <>
      <ScrollableModal>
        <div className="relative flex h-fit w-[340px] flex-col items-center justify-center">
          {/* Title Section */}
          <div className="relative h-[222px] w-full">
            <img
              src={PUBLIC_ASSETS_LOCATION.image.title}
              alt="title"
              className="animate-infinite absolute my-8 animate-bounce object-center"
            />
          </div>
          {showLoading && (
            // Loading Section
            <div
              className="relative flex h-[222px] w-full items-center justify-center"
            // style={{
            //   left: '50%',
            //   top: '350px',
            //   transform: 'translate(-50%, -50%)',
            // }}
            >
              <img src={PUBLIC_ASSETS_LOCATION.image.loading} />
            </div>
          )}
          {!showLoading && (
            <div
              className="relative flex h-[300px] w-full flex-col items-center justify-center"
            // style={{
            //   left: '50%',
            //   top: '330px',
            //   transform: 'translate(-50%, -50%)',
            // }}
            >
              {/* Play Button Section */}
              <div className="relative flex h-[222px] w-full flex-col items-center justify-center">
                <button
                  onClick={() => {
                    (handleStart(), playSoundUI());
                  }}
                  className="animate-idlebutton transition duration-300 hover:scale-110"
                >
                  <img
                    src={PUBLIC_ASSETS_LOCATION.image.playBtn}
                    alt="playBtn"
                    className="flex size-[200px] items-center justify-center object-center"
                  />
                </button>
              </div>

              {/* Logout Button Section */}
              <div className="relative flex h-[222px] w-full flex-col items-center justify-center">
                <button
                  className="absolute transition duration-300 hover:scale-110"
                  onClick={handleLogout}
                >
                  <img src={PUBLIC_ASSETS_LOCATION.image.logout_btn} alt="logoutBtn" />
                </button>
              </div>
            </div>
          )}
        </div>
      </ScrollableModal>
    </>
  );
}

// Class that extends SceneTemplate and delegates rendering to the functional component
export class SceneMainMenu extends SceneTemplate {
  constructor(props: SceneTemplateProps) {
    super(props);
    console.debug(
      logger.getCallerMessage('SceneMainMenu constructor called', { props: props }),
    );
    // this.content = <MainMenuContent />;
    this.background = PUBLIC_ASSETS_LOCATION.image.background.mainMenu;
    this.sceneInitial();
  }

  renderScene = () => {
    return <MainMenuContent />;
  };
}
