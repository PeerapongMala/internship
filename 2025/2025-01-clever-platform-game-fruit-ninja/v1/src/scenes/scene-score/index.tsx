import React from "react";
// import { useGameStore } from "../../store/gameStore";
// import { useLeaderboardStore } from "../../store/leaderboardStore";
// import { useTimerStore } from "../../store/timerStore";
// import ScoreModal from "../../components/ui/ScoreModal";
import { SceneTemplate, SceneTemplateProps } from "../../utils/core-utils/scene/scene-template";
import { PUBLIC_ASSETS_LOCATION } from "../../assets/public-assets-locations";

// Functional component for hooks and rendering
function ScoreSceneContent() {
  // const { score } = useGameStore();
  // const { timeRemaining } = useTimerStore();

  // const handleBackToMenu = () => {
  //   SceneManager.getInstance().setScene(SceneName.MENU);
  // };

  // const minutes = Math.floor(timeRemaining / 60);
  // const seconds = Math.floor(timeRemaining % 60);
  // const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
  //   .toString()
  //   .padStart(2, "0")}`;

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-bottom"
          style={{
            backgroundImage: `url(${PUBLIC_ASSETS_LOCATION.image.background.score})`,
          }}
        />
        <img
          src={PUBLIC_ASSETS_LOCATION.image.background.score}
        />
        {/* <ScoreModal score={score} timeString={timeString} /> */}
        <span>SCORE</span>
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
    this.content = <ScoreSceneContent />;
    this.sceneInitial();
  }
}
