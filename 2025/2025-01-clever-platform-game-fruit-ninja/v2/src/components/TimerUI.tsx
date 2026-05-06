import { useEffect } from 'react';
import { useTimerStore } from '@/store/timerStore';
import { useGameStore } from '@/store/gameStore';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { SceneName } from '@/types/game';
import { SceneManager } from '@core-utils/scene/scene-manager';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';

export function TimerUI() {
  const { timeRemaining, isRunning, updateTime, startTimer, stopTimer, resetTimer } =
    useTimerStore();
  const { score, isPlaying, pauseGame } = useGameStore();
  // const { setScene } = useGameStore();
  const { setScene } = SceneManager.getInstance();
  const { currentPlayer, addToLeaderboard } = useLeaderboardStore();

  // Start/stop timer based on game state
  useEffect(() => {
    if (isPlaying) {
      resetTimer();
      startTimer();
    } else {
      stopTimer();
    }
  }, [isPlaying, startTimer, stopTimer, resetTimer]);

  useEffect(() => {
    let lastTime = performance.now();

    const updateTimer = () => {
      if (isRunning && isPlaying) {
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
        updateTime(deltaTime);
        lastTime = currentTime;

        if (timeRemaining <= 0) {
          // Game over - time's up
          pauseGame(); // Pause the game first
          if (currentPlayer) {
            currentPlayer.score = score;
            currentPlayer.lastCountdownTime = timeRemaining;
            addToLeaderboard(currentPlayer);
          }
          SceneManager.getInstance().setScene(SceneName.SCORE);
        }
      }
    };

    const intervalId = setInterval(updateTimer, 100); // Update every 100ms for smooth countdown

    return () => clearInterval(intervalId);
  }, [
    isRunning,
    isPlaying,
    timeRemaining,
    updateTime,
    setScene,
    currentPlayer,
    addToLeaderboard,
    pauseGame,
  ]);

  // Format time as MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60);
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return (
    // <RectTransform
    //   boxSize={{ width: 244, height: 155 }}
    //   position={{ x: 0, y: 15 }}
    //   anchor={Anchor.TopRight}
    //   pivot={Pivot.TopRight}
    //   showPivot
    // >
    <div className="absolute flex h-screen w-screen items-center justify-center overflow-hidden">
      <div
        className="absolute"
        style={{
          left: 0,
          right: 0,
          top: 0,
          transform: 'translateY(20px)',
          color: timeRemaining <= 30 ? 'red' : 'white',
        }}
      >
        <img
          className="absolute"
          style={{
            left: '50%',
            top: 0,
            transform: 'translate(-50%, 0)',
          }}
          // className="absolute w-full h-full"
          src={PUBLIC_ASSETS_LOCATION.image.scoreBadge}
        // className="w-full h-full object-center scale-90"
        />

        {/* <RectTransform
            boxSize={{ width: 0, height: 70 }}
            anchor={Anchor.TopStretch}
            position={{ x: 0, y: -38 }}
          > */}
        <div
          className="font-kanit absolute text-center text-[30px] font-bold [text-shadow:_0_2px_4px_rgb(127_127_127_/_0.8)]"
          style={{
            top: 0,
            left: 0,
            right: 0,
            transform: 'translate(20px, 10px)',
          }}
        >
          {score}
        </div>
        {/* </RectTransform> */}
        {/* <RectTransform
            boxSize={{ width: 0, height: 70 }}
            anchor={Anchor.TopStretch}
            position={{ x: 0, y: 10 }}
          > */}
        <div
          className="font-kanit absolute text-center text-[40px] font-bold [text-shadow:_0_2px_4px_rgb(127_127_127_/_0.8)]"
          style={{
            top: 0,
            left: 0,
            right: 0,
            transform: 'translate(0%, 60px)',
          }}
        >
          {timeString}
        </div>
        {/* </RectTransform> */}
        {/* </RectTransform> */}
      </div>
    </div>
  );
}
