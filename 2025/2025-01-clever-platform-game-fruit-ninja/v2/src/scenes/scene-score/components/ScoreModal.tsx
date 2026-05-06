import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import { playSoundUI } from '@/components/ui/play-sound-ui';
import { RectTransform } from '@core-utils/ui/rect-transform/RectTransform';
import { Anchor } from '@core-utils/ui/rect-transform/type';
import { ARCADE_GAME_ID, GAME_BASE_URL } from '@core-utils/api';
import { useArcadeStore } from '@core-utils/api/arcade/arcade-store';

export const ScoreModal = (props: {
  round: number;
  score: number;
  timeString: string;
}) => {
  const { clearArcadeStorage } = useArcadeStore();
  // Game data that could be passed as props in a real application
  const gameData = {
    title: 'จบเกม',
    round: 'รอบที่',
    scoreLabel: 'คะแนน',
    timeLabel: 'เวลา',
    playAgainButton: 'เล่นอีกครั้ง',
    homeButton: 'หน้าแรก',
  };

  // const containerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (containerRef.current) {
  //     const { scrollHeight, clientHeight } = containerRef.current;
  //     const middle = (scrollHeight - clientHeight) / 2;

  //     containerRef.current.scrollTo({
  //       top: middle,
  //       behavior: "smooth",
  //     });
  //   }
  // }, []);

  const handlePlayAgain = () => {
    // SceneManager.getInstance().setScene(SceneName.GAME);
    console.log('logout click');
    clearArcadeStorage();
    window.location.href = `${GAME_BASE_URL}/arcade-leaderboard/${ARCADE_GAME_ID}`;
  };

  const handleBackToMenu = () => {
    // SceneManager.getInstance().setScene(SceneName.MENU);
    console.log('logout click');
    clearArcadeStorage();
    window.location.href = `${GAME_BASE_URL}/arcade-leaderboard/${ARCADE_GAME_ID}`;
  };

  return (
    <>
      {/* Score modal */}
      <div className="relative h-fit max-w-[533px]">
        {/* <RectTransform boxSize={{ width: 533, height: 586 }}> */}

        <div className="relative flex h-fit w-full max-w-[533px] flex-col items-center justify-around">
          {/* Score modal background */}
          <img
            className="relative h-fit max-w-[533px]"
            alt="Score Modal Background"
            src={PUBLIC_ASSETS_LOCATION.image.scoreModal}
          />

          {/* Modal label */}
          <div
            className="font-kanit absolute text-center text-[40px] leading-[normal] font-bold tracking-[0] text-[#ffffff] [text-shadow:0px_4px_4px_#00000040]"
            style={{
              left: 0,
              right: 0,
              top: '150px',
              transform: 'translateY(-50%)',
            }}
          >
            {gameData.title}
          </div>

          {/* Score label */}
          <div
            className="font-kanit absolute text-center text-[24px] leading-[normal] font-bold tracking-[0] text-[#60cfff]"
            style={{
              left: 0,
              right: 0,
              top: '210px',
              transform: 'translateY(-50%)',
            }}
          >
            {gameData.scoreLabel}
          </div>

          {/* Score display */}
          <div
            className="font-kanit absolute text-center text-[75.3px] font-bold text-[#ff7cab] [text-shadow:0px_2px_2px_#00000040]"
            style={{
              left: 0,
              right: 0,
              top: '275px',
              transform: 'translateY(-50%)',
            }}
          >
            {props.score}
          </div>

          <div
            className="absolute flex w-full items-center justify-center px-10"
            style={{
              left: 0,
              right: 0,
              top: '400px',
              transform: 'translateY(-50%)',
            }}
          >
            {/* Round label */}
            {/* Round display */}
            <div className="font-kanit w-full text-center text-[24px] leading-[normal] font-bold tracking-[0] text-[#60cfff]">
              {gameData.round}
              <br />
              {props.round}
            </div>

            {/* Time label */}
            {/* Timer display */}
            <div className="font-kanit w-full text-center text-[24px] leading-[normal] font-bold tracking-[0] text-[#60cfff]">
              {gameData.timeLabel}
              <br />
              {props.timeString}
            </div>
          </div>

          {/* Back to Main Menu button */}
          <div
            className="absolute"
            style={{
              left: '50%',
              right: 0,
              top: 0,
              transform: 'translate(-50%, 480px)',
            }}
          >
            <button
              className="animate-idlebutton absolute transition duration-300 hover:scale-110"
              onClick={() => {
                (handleBackToMenu(), playSoundUI());
              }}
            >
              <img src={PUBLIC_ASSETS_LOCATION.image.mainMenuBtn} />
            </button>
          </div>

          {/* Play Again button */}
          <RectTransform
            boxSize={{ width: 64, height: 64 }}
            anchor={Anchor.TopRight}
            position={{ x: -50, y: 100 }}
          >
            <button
              className="animate-idlebutton relative h-full w-full transition duration-300 hover:scale-110"
              onClick={() => {
                (handlePlayAgain(), playSoundUI());
              }}
            >
              <img src={PUBLIC_ASSETS_LOCATION.image.playAgainBtn} />
            </button>
          </RectTransform>

          {/* </RectTransform > */}
        </div>
      </div>
    </>
  );
};

export default ScoreModal;
