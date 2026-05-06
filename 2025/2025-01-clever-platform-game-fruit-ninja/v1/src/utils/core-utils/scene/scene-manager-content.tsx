import { useEffect, useState } from "react";
import { logger } from "../debug/logger";
import { SceneManager } from "./scene-manager";

export const SceneManagerContent = () => {
  const [, setCurrentScene] = useState(SceneManager.getInstance().getCurrentSceneName());

  useEffect(() => {
    SceneManager.getInstance().init((scene) => {
      setCurrentScene(scene);
      console.debug(logger.getCallerMessage(`Scene changed to: ${scene}`));
    });
  }, []);

  return (
    <>
      {SceneManager.getInstance().renderScene()}
    </>
  );
};
