import { useEffect, useState } from "react";
// import { useGameStore } from "../../store/gameStore";
// import { useLeaderboardStore } from "../../store/leaderboardStore";
import { logger } from "../../utils/core-utils/debug/logger";
import { SceneTemplate, SceneTemplateProps } from "../../utils/core-utils/scene/scene-template";
import { SceneManager } from "../../utils/core-utils/scene/scene-manager";
import { SceneName } from "../../types/GameType";
import { PUBLIC_ASSETS_LOCATION } from "../../assets/public-assets-locations";

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
  // const { startGame, resetGame } = useGameStore();
  // const { createNewPlayer } = useLeaderboardStore();
  const [showLoading, setShowLoading] = useState(true);

  const [, setBackgroundImage] = useState<string | undefined>();

  useEffect(() => {

    const fallbackImage = new URL(
      '/image/background/main-menu-bg.png',
      import.meta.url,
    ).href;
    setBackgroundImage(fallbackImage);

    // resetGame();
    SceneManager.getInstance().setScene(SceneName.MENU);
    const timer = setTimeout(() => setShowLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    // createNewPlayer();
    // startGame();
    SceneManager.getInstance().setScene(SceneName.GAME);
  };

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-bottom"
          style={{ backgroundImage: `url(${PUBLIC_ASSETS_LOCATION.image.background.mainMenu})` }}
        />

        <div className="relative flex flex-col items-center justify-center">
          {/* <div className="absolute top-0 left-0 w-full h-full">
          <div className="flex flex-col items-center justify-center min-h-screen w-full p-8"> */}
          <img
            src={PUBLIC_ASSETS_LOCATION.image.title}
            alt="title"
          // className="w-350px h-350px object-center mb-8 animate-scale"
          />
          {showLoading ? (
            <img
              src={PUBLIC_ASSETS_LOCATION.image.loading}
            />
          ) : (
            // <></>
            <button
              onClick={handleStart}
            // className="flex items-center justify-center hover:scale-110 transition duration-300 pr-8 pl-8"
            >
              <img
                src={PUBLIC_ASSETS_LOCATION.image.playBtn}
                alt="playBtn"
              // className="flex items-center justify-center object-center"
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
      {/* </div> */}
    </>
  );
}

// Class that extends SceneTemplate and delegates rendering to the functional component
export class SceneMainMenu extends SceneTemplate {
  constructor(props: SceneTemplateProps) {
    super(props);
    console.debug(logger.getCallerMessage("SceneMainMenu constructor called", { props: props }));
    this.content = <MainMenuContent />;
    this.sceneInitial();
  }

}
