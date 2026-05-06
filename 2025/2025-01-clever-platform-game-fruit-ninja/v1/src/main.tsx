import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./css/App.css"; // Ensure this path is correct
import { logger } from "./utils/core-utils/debug/logger";
import { SceneName } from "./types/GameType";
import { SceneManager } from "./utils/core-utils/scene/scene-manager";
// import { TempAppContainer } from "./utils/core-utils/scene/TempAppContainer";
import { SceneManagerContent } from "./utils/core-utils/scene/scene-manager-content";
import { SceneGameplay } from "./scenes/scene-gameplay";
import { SceneMainMenu } from "./scenes/scene-main-menu";
import { SceneScore } from "./scenes/scene-score";

const initScenes = () => {
  const sceneManager = SceneManager.getInstance();
  // sceneManager.addScene(new TempAppContainer({ sceneName: SceneName.APP }));
  sceneManager.addScene(new SceneMainMenu({ sceneName: SceneName.MENU }));
  sceneManager.addScene(new SceneGameplay({
    sceneName: SceneName.GAME
    // , children: <CountdownModal seconds={3} /> 
  }));
  sceneManager.addScene(new SceneScore({ sceneName: SceneName.SCORE }));
  // sceneManager.setScene(SceneName.APP);
  sceneManager.setScene(SceneName.MENU);
  // sceneManager.setScene(SceneName.GAME);
  // sceneManager.setScene(SceneName.SCORE);

  const sceneList = sceneManager.getSceneList();
  console.debug(logger.getCallerMessage(sceneList));
};

initScenes();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    {/* <App /> */}
    <SceneManagerContent />
  </BrowserRouter>
);
