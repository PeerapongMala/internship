import { useLeaderboardStore } from '@/store/leaderboardStore';
import { useTimerStore } from '@/store/timerStore';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import ScoreModal from './components/ScoreModal';
import {
  SceneTemplate,
  SceneTemplateProps,
} from '@core-utils/scene/SceneTemplate';
import { useSceneScoreStore } from './sceneScoreStore';
import { ScrollableModal } from '@core-utils/ui/scrollable-modal/ScrollableModal';


// Functional component for hooks and rendering
function ScoreSceneContent() {
  // const { score } = useGameStore();
  const { round, score, timeString } = useSceneScoreStore();
  useTimerStore();
  useLeaderboardStore();


  // const minutes = Math.floor(timeRemaining / 60);
  // const seconds = Math.floor(timeRemaining % 60);
  // const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
  //   .toString()
  //   .padStart(2, "0")}`;

  return (
    <>
      <div className="flex h-screen w-screen items-center justify-center">
        {/* <div
          className="absolute inset-0 bg-cover bg-bottom"
          style={{
            backgroundImage: `url(${PUBLIC_ASSETS_LOCATION.image.background.score})`,
          }}
        /> */}
        <ScrollableModal>
          <ScoreModal round={round} score={score} timeString={timeString} />
        </ScrollableModal>
      </div>
    </>
  );
}

// function ScoreCard({ player }: { player: any }) {
//   return (
//     <section className="text-center mb-8">
//       <h1 className="text-6xl font-extrabold tracking-wide drop-shadow-md mb-4">
//         Game Over!
//       </h1>
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <ScoreStat label="Your Score:" value={player?.score || 0} />
//         <TimeSurvivedStat player={player} />
//       </div>
//     </section>
//   );
// }

// function ScoreStat({ label, value }: { label: string; value: number }) {
//   return (
//     <div className="text-4xl font-bold text-yellow-500 mb-2">
//       {label} {value}
//     </div>
//   );
// }

// function TimeSurvivedStat({ player }: { player: any }) {
//   const time = player?.lastCountdownTime || 0;
//   return (
//     <div className="text-2xl text-gray-700">
//       Time Survived:{" "}
//       {`${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(
//         2,
//         "0"
//       )}`}
//     </div>
//   );
// }

// Class that extends SceneTemplate and delegates rendering to the functional component
export class SceneScore extends SceneTemplate {
  constructor(props: SceneTemplateProps) {
    super(props);
    this.background = PUBLIC_ASSETS_LOCATION.image.background.score;
    // this.content = <ScoreSceneContent />;
    this.sceneInitial();
  }

  renderScene = () => {
    return <ScoreSceneContent />;
  };
}
