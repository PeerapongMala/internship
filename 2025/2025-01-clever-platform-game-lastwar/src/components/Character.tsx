import { Suspense, useEffect, useRef, useMemo, useState } from 'react';
// Replace useFBX with FBXLoader
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import * as THREE from 'three';
import { CharacterData } from '@/types/game';
import { useCharacterStore } from '@/store/characterStore';
import { TimeManager } from '@/utils/core-utils/timer/time-manager';
import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';

interface CharacterProps {
  characterChoice: number;
  onCharacterLoaded?: (characterData: CharacterData) => void;
}
export function Character({ onCharacterLoaded }: CharacterProps) {
  // const Config = FetchArcadeConfig().model_data;
  //   '/character/set' +
  //   Config.AvatarId +
  //   '/character' +
  //   Config.ModelId +
  //   '/level' +
  //   Config.LevelId +
  //   '.fbx';

  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const loadedRef = useRef(false); // Prevent redundant execution
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [animationModel, setAnimationModel] = useState<THREE.Group | null>(null);

  // ใช้ค่าจาก characterStore แทน local state (preloadedModelUrl ถูก set มาจาก main menu แล้ว)
  const { preloadedModelUrl } = useCharacterStore();

  // กำหนด finalModelPath จาก preloadedModelUrl หรือ defaultModelPath
  // const finalModelPath = preloadedModelUrl || defaultModelPath;
  const finalModelPath = preloadedModelUrl || PUBLIC_ASSETS_LOCATION.model.character.model.default;
  const finalAnimationPath = PUBLIC_ASSETS_LOCATION.model.character.animation.default;

  // console.log('🎮 Character rendering:', {
  //   preloadedModelUrl,
  //   isModelPreloading,
  //   finalModelPath,
  // });

  // Load FBX models via FBXLoader
  useEffect(() => {
    const loader = new FBXLoader();
    let cancelled = false;

    loader.load(
      finalModelPath,
      (object) => {
        if (!cancelled) setModel(object);
      },
      undefined,
      (err) => {
        console.error('Failed to load character FBX:', finalModelPath, err);
      },
    );

    loader.load(
      finalAnimationPath,
      (object) => {
        if (!cancelled) setAnimationModel(object);
      },
      undefined,
      (err) => {
        console.error('Failed to load animation FBX:', finalAnimationPath, err);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [finalModelPath, finalAnimationPath]);

  // Reset loadedRef when model path changes (fix: character invisible bug)
  useEffect(() => {
    loadedRef.current = false;
  }, [finalModelPath, finalAnimationPath]);

  useEffect(() => {
    if (loadedRef.current || !model || !animationModel) {
      console.log('⚠️ Skip loading:', {
        loadedRefCurrent: loadedRef.current,
        hasModel: !!model,
        hasAnimationModel: !!animationModel
      });
      return;
    }

    console.log('✅ Loading character with model:', model);
    loadedRef.current = true; // Prevent multiple executions
    /*
        LoadCharacter(modelPath, (character: any) => {
      let mixer: any = null;
      character.scale.set(0.05, 0.05, 0.05);
      character.translateY(-2);
      LoadFBXAnimation(
        'public/assets/animation/Running_Test.fbx',
        (animationClip: any) => {
          character.animations.push(animationClip); // Add the new animation clip to the character's animations array
          mixer = new THREE.AnimationMixer(character);
          const clips = character.animations;
          console.log(clips);
          const clip = THREE.AnimationClip.findByName(clips, 'mixamo.com');
          const action = mixer.clipAction(clip);
          action.play();

          // Play all animations
          clips.forEach(function (clip: any) {
            //clip.play();
            mixer.clipAction(clip).play();
          });
          this.mixer = mixer;
        },
        (error: any) => {},
      );
    });

    */
    if (groupRef.current && model) {
      model.scale.set(0.05, 0.05, 0.05); // Adjust the scale of the character if needed
      model.position.set(0, 0, 0); // Set the initial position of the character
      // model.rotation.set(-3.14 / 2, 0, -Math.PI / 2);

      // Handle animations
      const clips = animationModel?.animations || [];
      if (clips.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        mixerRef.current = mixer;
        mixerRef.current?.stopAllAction();

        const action = mixer.clipAction(clips[0]);
        action.play();

        // Notify parent component
        onCharacterLoaded?.({
          DisplayModel: model,
          mixer,
          animations: clips,
        });
      }
    }
  }, [model, animationModel, onCharacterLoaded]);

  useEffect(() => {
    const timeManager = TimeManager.getInstance();

    const unsubUpdate = timeManager.update((delta) => {
      // Get latest game state from TimeManager
      if (!timeManager.isPlaying()) return;

      // Only update animation when game is playing
      mixerRef.current?.update(delta);
    });

    return () => {
      unsubUpdate();
    };
  }, []);  // Memoized character rendering
  const CharacterContent = useMemo(
    () => {
      if (!model) {
        console.log('⚠️ No model to render');
        return null;
      }
      console.log('✅ Rendering model:', model);
      return (
        <group ref={groupRef}>
          <primitive object={model} />
        </group>
      );
    },
    [model],
  );

  // console.log('🎬 Character component render, model:', !!model);

  return <Suspense fallback={null}>{CharacterContent}</Suspense>;
}
