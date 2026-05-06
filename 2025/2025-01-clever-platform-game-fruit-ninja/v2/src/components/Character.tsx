import { Suspense, useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import * as THREE from 'three';
import { CharacterData } from '@/types/game';
import { FetchArcadeConfig } from '@/utils/ArcadeGameAPI';

const ANIMATION_PATH = '/Animations/Running_Test.fbx';

interface CharacterProps {
  characterChoice: number;
  onCharacterLoaded?: (characterData: CharacterData) => void;
}
export function Character({ onCharacterLoaded }: CharacterProps) {
  const Config = FetchArcadeConfig().model_data;
  const modelPath =
    '/character/set' +
    Config.AvatarId +
    '/character' +
    Config.ModelId +
    '/level' +
    Config.LevelId +
    '.fbx';

  // Memoize models to prevent unnecessary reloading
  const model = useMemo(() => useFBX(modelPath), [modelPath]);
  const animationModel = useMemo(() => useFBX(ANIMATION_PATH), []);

  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const loadedRef = useRef(false); // Prevent redundant execution

  useEffect(() => {
    if (loadedRef.current || !model || !animationModel) return;
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
    if (groupRef.current) {
      model.scale.set(0.05, 0.05, 0.05); // Adjust the scale of the character if needed
      model.position.set(0, 0, 0); // Set the initial position of the character
      model.rotation.set(-3.14 / 2, 0, -Math.PI / 2);

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

  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
  });

  // Memoized character rendering
  const CharacterContent = useMemo(
    () => (
      <group ref={groupRef}>
        <primitive object={model} />
      </group>
    ),
    [model],
  );

  return <Suspense fallback={null}>{CharacterContent}</Suspense>;
}
