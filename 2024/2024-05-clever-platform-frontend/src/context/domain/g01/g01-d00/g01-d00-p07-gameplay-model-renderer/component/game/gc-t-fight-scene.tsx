import { SceneData, useThreeRenderer } from '@component/game/canvas/gc-main-canvas';
import { useEffect, useState } from 'react';
import CharacterModelRenderer from './scenes/character-model-renderer';
import MonsterModelRenderer from './scenes/monster-model-renderer';
import WeaponModelRenderer from './scenes/weapon-model-renderer';
// import WeaponModelRenderer from './scenes/weapon-model-renderer';

interface GCTFightSceneProps {
  answerIsCorrect: boolean;
  weaponId?: string;
  monsterName?: string;
}

export function GCTFightScene({
  answerIsCorrect,
  weaponId,
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

  const CHARACTER_MODEL_CONST = 'set1_character1_level1';
  const MONSTER_MODEL_CONST = '';

  const addScene = (sceneData: SceneData) => {
    setScenes((prev) => {
      return [...prev, sceneData];
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-between">
      <CharacterModelRenderer
        modelSrc={CHARACTER_MODEL_CONST}
        className="w-[400px] h-full left-[5%] absolute"
        isAnswerCorrect={answerIsCorrect}
        callbackReady={addScene}
      />
      <WeaponModelRenderer
        modelSrc={CHARACTER_MODEL_CONST}
        className="z-10"
        isAnswerCorrect={answerIsCorrect}
        callbackReady={addScene}
      />
      {/* original code commented out for reference */}
      {/* <CharacterModelRenderer
        modelSrc={'set1_character1_level1'}
        className="w-[400px] h-[100%] bottom-32 -left-16 z-0 top-0 overflow-visible"
        answerIsCorrect={answerIsCorrect}
      /> */}
      <MonsterModelRenderer
        modelSrc={'Bloom'}
        className="w-[400px] h-full right-[5%] absolute"
        isAnswerCorrect={answerIsCorrect}
        callbackReady={addScene}
      />
    </div>
  );
}
