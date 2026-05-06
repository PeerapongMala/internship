import { SceneData, useThreeRenderer } from '@component/game/canvas/gc-main-canvas';
import { useEffect, useState } from 'react';
import CharacterModelRenderer from './scenes/character-model-renderer';
import MonsterModelRenderer from './scenes/monster-model-renderer';
import WeaponModelRenderer from './scenes/weapon-model-renderer';
// import WeaponModelRenderer from './scenes/weapon-model-renderer';

interface GCTFightSceneProps {
  answerIsCorrect: boolean;
  characterModelId?: string;
  monsterName?: string;
}

export function GCTFightScene({
  answerIsCorrect,
  characterModelId,
  monsterName,
}: GCTFightSceneProps) {
  const {
    shouldRunAnimationLoop,
    registerScene,
    scenesRef,
    startAllScenes,
    disposeScenes,
  } = useThreeRenderer();

  const [scenes, setScenes] = useState<SceneData[]>([]);

  useEffect(() => {
    return () => {
      console.log('GCTFightScene: Cleaning up');
      disposeScenes && disposeScenes();
    };
  }, []);

  useEffect(() => {
    console.log(`Current scenes: `, scenes);
    const sceneKeys = scenes.map((s) => s.key);
    if (
      scenes.length === 3 &&
      sceneKeys.includes('character-model-renderer') &&
      sceneKeys.includes('weapon-model-renderer') &&
      sceneKeys.includes('monster-model-renderer') &&
      registerScene
    ) {
      console.log('GCTFightScene: Register all scenes');
      scenes.forEach((s) => registerScene(s));

      // when the component mounts, we start the animation loop
      console.log('GCTFightScene: Starting scenes');
      startAllScenes!();
    }
  }, [scenes]);

  const addScene = (sceneData: SceneData) => {
    setScenes((prev) => {
      return [...prev, sceneData];
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-between">
      <CharacterModelRenderer
        modelSrc={characterModelId}
        className="w-[400px] h-full left-[5%] absolute"
        isAnswerCorrect={answerIsCorrect}
        callbackReady={addScene}
      />
      <WeaponModelRenderer
        modelSrc={characterModelId}
        className="z-10"
        isAnswerCorrect={answerIsCorrect}
        callbackReady={addScene}
      />{' '}
      {/* <MovingProjectile className="absolute h-full w-full z-0" /> */}
      <MonsterModelRenderer
        modelSrc={monsterName || 'Target_Dummy'}
        className="w-[400px] h-full right-[5%] absolute"
        isAnswerCorrect={answerIsCorrect}
        callbackReady={addScene}
      />
    </div>
  );
}
