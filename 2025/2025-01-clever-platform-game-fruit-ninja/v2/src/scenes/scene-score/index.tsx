import { useLeaderboardStore } from '@/store/leaderboardStore';
import { useTimerStore } from '@/store/timerStore';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import ScoreModal from './components/ScoreModal';
import {
  SceneTemplate,
  SceneTemplateProps,
} from '@core-utils/scene/SceneTemplate';
import { ScrollableModal } from '@core-utils/ui/scrollable-modal/ScrollableModal';
import { RectTransform } from '@core-utils/ui/rect-transform/RectTransform';
import { useSceneScoreStore } from './sceneScoreStore';

// Functional component for hooks and rendering
function ScoreSceneContent() {
  const { round, score, timeString } = useSceneScoreStore();
  useTimerStore();
  useLeaderboardStore();

  return (
    <>
      <div className="relative flex h-screen w-full items-center justify-center">
        {/* <div
          className="absolute inset-0 bg-cover bg-bottom"
          style={{
            backgroundImage: `url(${PUBLIC_ASSETS_LOCATION.image.background.score})`,
          }}
        /> */}
        {/* Decorations */}
        <RectTransform boxSize={{ width: 1280, height: 720 }}>
          <div className="animate-updown">
            <div className="animate-leftright">
              <img
                className="relative h-full w-full"
                src={PUBLIC_ASSETS_LOCATION.image.modalElements}
              />
            </div>
          </div>
        </RectTransform>
        {/* Decorations */}

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
    // this.content = <ScoreSceneContent />;
    this.background = PUBLIC_ASSETS_LOCATION.image.background.score;
    this.sceneInitial();
  }

  renderScene = () => {
    return <ScoreSceneContent />;
  };
}
