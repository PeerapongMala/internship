import { PUBLIC_ASSETS_LOCATION } from '@public-assets';

import { playSoundEffect } from '@core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

import { ARCADE_GAME_ID, GAME_BASE_URL } from '@core-utils/api';
import { useArcadeStore } from '@core-utils/api/arcade/arcade-store';

export const ScoreModal = (props: {
  round: number;
  score: number;
  timeString: string;
}) => {
  // Game data that could be passed as props in a real application
  const gameData = {
    round: 'รอบที่ ',
    scoreLabel: 'คะแนน',
    timeLabel: 'เวลา',
    playAgainButton: 'เล่นอีกครั้ง',
    homeButton: 'หน้าแรก',
  };

  // const { setProps: setGameplayStore } = useSceneGameplayStore();

  // const handlePlayAgain = () => {
  //   setGameplayStore({ round: 0, score: 0, seconds: 0 });
  //   SceneManager.getInstance().setScene(SceneName.GAME);
  // };

  const handleBackToMenu = () => {
    void playSoundEffect(SOUND_GROUPS.sfx.gui_button);
    // setGameplayStore({ round: 0, score: 0, seconds: 0 });
    // SceneManager.getInstance().setScene(SceneName.MENU);
    console.log('logout click');
    useArcadeStore.getState().clearArcadeStorage();
    window.location.href = `${GAME_BASE_URL}/arcade-leaderboard/${ARCADE_GAME_ID}`;
  };

  return (
    <>
      <div className="flex h-fit w-full items-center justify-center overflow-hidden">
        <div className="relative h-[537px] w-[415px]">
          {/* <RectTransform boxSize={{ width: 415, height: 537 }}> */}

          {/* Score modal background */}
          <img
            className="absolute h-full w-full"
            alt="Score Modal Background"
            src={PUBLIC_ASSETS_LOCATION.image.scoreModal}
          />

          {/* Round label */}
          {/* Round display */}
          <div
            className="font-kanit absolute text-center text-[40px] leading-[normal] font-bold tracking-[0] text-white [text-shadow:0px_4px_4px_#00000040]"
            style={{
              left: 0,
              right: 0,
              top: 0,
              transform: 'translateY(20px)',
            }}
          >
            {gameData.round}
            {props.round}
          </div>

          {/* Score label */}
          <div
            className="font-kanit absolute text-center text-[30.6px] leading-[normal] font-normal tracking-[0] text-[#ca7940]"
            style={{
              left: 0,
              right: 0,
              top: 0,
              transform: 'translateY(85px)',
            }}
          >
            {gameData.scoreLabel}
          </div>

          {/* Score display */}
          <div
            className="font-kanit absolute text-center text-[75.3px] font-bold text-[#ca7940] [text-shadow:0px_2px_2px_#00000040]"
            style={{
              left: 0,
              right: 0,
              top: 0,
              transform: 'translateY(110px)',
            }}
          >
            {props.score}
          </div>

          {/* Time label */}
          <div
            className="font-kanit absolute text-center text-[34.2px] leading-[normal] font-normal tracking-[0] text-[#ca7940]"
            style={{
              left: 0,
              right: 0,
              top: 0,
              transform: 'translateY(210px)',
            }}
          >
            {gameData.timeLabel}
          </div>

          {/* Timer display */}
          <div
            className="font-kanit absolute text-center text-[45px] leading-[normal] font-semibold tracking-[0] text-[#faf880]"
            style={{
              left: 0,
              right: 0,
              top: 0,
              transform: 'translateY(260px)',
            }}
          >
            {props.timeString}
          </div>

          {/* Play Again button */}
          {/* <div
            className="absolute"
            style={{
              left: '50%',
              right: 0,
              top: 0,
              transform: 'translate(-50%, 345px)',
            }}
          >
            <button
              className="animate-idlebutton absolute transition duration-300 hover:scale-110"
              onClick={handlePlayAgain}
            >
              <img src={PUBLIC_ASSETS_LOCATION.image.playAgainBtn} />
            </button>
          </div> */}

          {/* Back to Main Menu button */}
          <div
            className="absolute"
            style={{
              left: '50%',
              right: 0,
              top: 0,
              // transform: 'translate(-50%, 415px)',
              transform: 'translate(-50%, 375px)',
            }}
          >
            <button
              className="animate-idlebutton absolute transition duration-300 hover:scale-110"
              onClick={handleBackToMenu}
            >
              <img src={PUBLIC_ASSETS_LOCATION.image.mainMenuBtn} />
            </button>
          </div>

          {/* </RectTransform > */}
        </div>
      </div>
    </>
  );
};

export default ScoreModal;
