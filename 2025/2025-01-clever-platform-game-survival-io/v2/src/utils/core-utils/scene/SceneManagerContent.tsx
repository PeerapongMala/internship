import { useEffect, useState, useMemo } from 'react';
import { SceneManager } from './scene-manager';
// import { TimeProvider, useTime } from '../timer/time-provider';

export const SceneManagerContent = () => {
  const sceneManager = SceneManager.getInstance();
  const [currentSceneName, setCurrentSceneName] = useState(sceneManager.getCurrentSceneName());
  const [renderTrigger, forceRender] = useState(0);
  // const { deltaTime, fixedDeltaTime } = useTime();

  // //* Update: smooth rendering
  // useEffect(() => {
  //   sceneManager.getCurrentScene()?.update(deltaTime);
  // }, [deltaTime]);

  // //* FixedUpdate: physics rendering
  // useEffect(() => {
  //   console.info('SceneManagerContent fixedUpdate called with fixedDeltaTime:', fixedDeltaTime);
  //   sceneManager.getCurrentScene()?.fixedUpdate(fixedDeltaTime);
  // }, [fixedDeltaTime]);

  useEffect(() => {
    // # region on started handler
    sceneManager.init((scene) => {
      setCurrentSceneName(scene);
      forceRender((prev) => prev + 1);
    });

    // Subscribe to rerender events
    const handleRerender = () => {
      forceRender((prev) => prev + 1);
    };
    sceneManager.subscribeRerender(handleRerender);

    console.debug('SceneManager started!');
    // # endregion

    // # region on unmounted handler
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';

      sceneManager.unsubscribeSceneChangeAll();
    };
    // # endregion

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      console.debug('Cleanup on unmount');
      sceneManager.unsubscribeRerender(handleRerender);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Memoize scene rendering to prevent infinite loops
  const sceneContent = useMemo(() => {
    const currentScene = sceneManager.getCurrentScene();

    if (!currentScene) {
      console.warn('No current scene found for:', currentSceneName);
      return null;
    }

    // Don't use renderTrigger in key to avoid recreating the scene
    return <div key={currentSceneName}>{currentScene.render()}</div>;
  }, [currentSceneName, renderTrigger]); // Depend on renderTrigger to re-render, but key stays same

  return (
    <>
      {/* <TimeProvider> */}
      <div className="absolute top-0 left-0 h-full w-full">{sceneContent}</div>
      {/* </TimeProvider> */}
    </>
  );
};
