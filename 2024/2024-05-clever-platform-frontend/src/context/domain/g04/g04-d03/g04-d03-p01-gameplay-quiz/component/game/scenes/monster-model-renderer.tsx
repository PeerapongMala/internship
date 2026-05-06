import { StoreModelFileMethods } from '@global/store/global/avatar-models/index';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
// import { getIsModelReady } from '../three-d-model/character-animation-controller';
import { SceneData, useThreeRenderer } from '@component/game/canvas/gc-main-canvas';
import { cn } from '@global/helper/cn';

interface MonsterModelRendererProps {
  modelSrc: string;
  className?: string;
  style?: React.CSSProperties;
  autoRotate?: boolean;
  isAnswerCorrect?: boolean;
  actualWidth?: number;
  callbackReady?: (scene: SceneData) => void;
}

const MonsterModelRenderer: React.FC<MonsterModelRendererProps> = ({
  modelSrc,
  className,
  style,
  isAnswerCorrect,
  callbackReady,
}) => {
  const { rendererRef } = useThreeRenderer();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);

  const timeRef = useRef<DOMHighResTimeStamp>();
  const [modelReady, setModelReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false); // Track if model is loaded
  const preloadedModelRef = useRef<THREE.Group | null>(null); // Store preloaded model

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return;

    // create a new scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // setup camera
    const camera = new THREE.PerspectiveCamera(
      70,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.005,
      2000,
    );
    camera.position.z = 10;
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 2);
    sceneRef.current.add(directionalLight);
  }, []);

  const onDispose = () => {
    // Clear scene
    sceneRef?.current?.clear();
  };

  const animateLoopFn = (time: DOMHighResTimeStamp, rect?: DOMRect) => {
    if (rendererRef?.current && sceneRef?.current && cameraRef?.current) {
      // find delta time
      let deltaTime = 0;
      if (timeRef?.current) deltaTime = time - timeRef?.current;

      if (rect) {
        cameraRef.current.aspect = rect.width / rect.height;
        cameraRef.current.updateProjectionMatrix();
      }

      // Update mixer for animations
      if (mixer) {
        mixer.update(deltaTime);
      }

      // update renderer
      rendererRef?.current.render(sceneRef?.current, cameraRef?.current);
      // update current time
      timeRef.current = time;
    }
  };

  const loadModel = async () => {
    let objectUrl: string = '';
    try {
      // Check if model exists in IndexedDB
      const modelBlob = await StoreModelFileMethods.getItem(modelSrc);
      if (!modelBlob) {
        console.error(`Model ${modelSrc} not found in IndexedDB`);
        return;
      }

      // Create object URL for the blob
      objectUrl = URL.createObjectURL(modelBlob);
      // Load the model
      const loader = new FBXLoader();
      loader.load(
        objectUrl,
        (fbxModel) => {
          // Process model
          fbxModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          // Apply model-specific transformations
          fbxModel.rotateY(-0.7);
          switch (modelSrc) {
            case 'Snow_Bomb':
              fbxModel.scale.set(0.017, 0.017, 0.017);
              fbxModel.position.x = 1;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -1.5;
              break;
            case 'Werewolf':
              fbxModel.scale.set(0.013, 0.013, 0.013);
              fbxModel.position.x = 2;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -2.5;
              break;
            case 'Snake_Naga':
              fbxModel.scale.set(0.01, 0.01, 0.01);
              fbxModel.position.x = 0.7;
              fbxModel.position.y = -3.5;
              fbxModel.position.z = -4.5;
              break;
            case 'Dragon_Fire':
              fbxModel.scale.set(0.01, 0.01, 0.01);
              fbxModel.position.x = 1;
              fbxModel.position.y = -2.2;
              fbxModel.position.z = -1.5;
              break;
            case 'Bloom':
              fbxModel.scale.set(0.017, 0.017, 0.017);
              fbxModel.position.x = 1.6;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -2.5;
              break;
            case 'Blossom':
              fbxModel.scale.set(0.017, 0.017, 0.017);
              fbxModel.position.x = 1.6;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -2.5;
              break;
            case 'Bomb':
              fbxModel.scale.set(0.017, 0.017, 0.017);
              fbxModel.position.x = 1.3;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -2;
              break;
            case 'Bud':
              fbxModel.scale.set(0.027, 0.027, 0.027);
              fbxModel.position.x = 1.2;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -2.5;
              break;
            case 'Dragon_Inferno':
              fbxModel.scale.set(0.009, 0.009, 0.009);
              fbxModel.position.x = 1;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -2.5;
              break;
            case 'Dragon_Spark':
              fbxModel.scale.set(0.019, 0.019, 0.019);
              fbxModel.position.x = 1.5;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -2.5;
              break;
            case 'Hermit_King':
              fbxModel.scale.set(0.016, 0.016, 0.016);
              fbxModel.position.x = 1.5;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -2.5;
              break;
            case 'Poison_Bomb':
              fbxModel.scale.set(0.016, 0.016, 0.016);
              fbxModel.position.x = 1.5;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -2.5;
              break;
            case 'Practice_Dummy':
              fbxModel.scale.set(0.021, 0.021, 0.021);
              fbxModel.position.x = 1.5;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -2.5;
              break;
            case 'Shell':
              fbxModel.scale.set(0.025, 0.025, 0.025);
              fbxModel.position.x = 1.5;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -2.5;
              break;
            case 'Snake':
              fbxModel.scale.set(0.025, 0.025, 0.025);
              fbxModel.position.x = 1.5;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -6.5;
              break;
            case 'Snakelet':
              fbxModel.scale.set(0.025, 0.025, 0.025);
              fbxModel.position.x = 1.5;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -3;
              break;
            case 'Spike':
              fbxModel.scale.set(0.025, 0.025, 0.025);
              fbxModel.position.x = 1.5;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -2.5;
              break;
            case 'Sun_Blossom':
              fbxModel.scale.set(0.025, 0.025, 0.025);
              fbxModel.position.x = 1.5;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -2.5;
              break;
            case 'Sunflora_Pixie':
              fbxModel.scale.set(0.025, 0.025, 0.025);
              fbxModel.position.x = 1.5;
              fbxModel.position.y = -2.5;
              fbxModel.position.z = -2.5;
              break;
            case 'Sunflower_Fairy':
              fbxModel.scale.set(0.025, 0.025, 0.025);
              fbxModel.position.x = 1.5;
              fbxModel.position.y = -3;
              fbxModel.position.z = -4.5;
              break;
            case 'Target_Dummy':
              fbxModel.scale.set(0.025, 0.025, 0.025);
              fbxModel.position.x = 1.5;
              fbxModel.position.y = -3.5;
              fbxModel.position.z = -5.5;
              break;
          }

          // Center model
          const box = new THREE.Box3().setFromObject(fbxModel);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          // Store the preloaded model but don't add to scene yet
          preloadedModelRef.current = fbxModel;

          setModelLoaded(true);
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
          if (objectUrl) URL.revokeObjectURL(objectUrl);
        },
      );
    } catch (error) {
      console.error('Error loading model:', error);
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  };

  // Function to load animation
  const loadAnimation = async (modelId: string, loadedModel: THREE.Group) => {
    try {
      // Try to get animation with _Anim suffix
      const animId = `${modelId}_Anim`;
      const animBlob = await StoreModelFileMethods.getItem(animId);

      if (!animBlob) {
        return;
      }

      const objectUrl = URL.createObjectURL(animBlob);

      const loader = new FBXLoader();

      loader.load(
        objectUrl,
        (animModel) => {
          if (!animModel.animations || animModel.animations.length === 0) {
            URL.revokeObjectURL(objectUrl);
            return;
          }

          // Create new mixer for the loaded model
          const newMixer = new THREE.AnimationMixer(loadedModel);

          const dieAnimationIndex = animModel.animations.findIndex((clip) =>
            clip.name.toLowerCase().includes('die'),
          );

          const takeDamageAnimationIndex = animModel.animations.findIndex((clip) =>
            clip.name.toLowerCase().includes('take'),
          );

          const idleAnimationIndex = animModel.animations.findIndex((clip) =>
            clip.name.toLowerCase().includes('idle'),
          );

          const attackAnimationIndex = animModel.animations.findIndex((clip) =>
            clip.name.toLowerCase().includes('attack'),
          );

          //console.log('Attack index: ', attackAnimationIndex);
          const attackAnimations = animModel.animations
            .map((clip, index) => {
              if (clip.name.toLowerCase().includes('attack')) {
                return { clip, index };
              }
              return null;
            })
            .filter((item) => item !== null);

          if (isAnswerCorrect) {
            // Play idle animation with looping
            const idle = newMixer.clipAction(animModel.animations[idleAnimationIndex]);
            idle.reset();
            idle.setLoop(THREE.LoopRepeat, Infinity); // Set to loop infinitely
            idle.clampWhenFinished = false; // Don't freeze at the end
            idle.play();

            // Setup take damage animation (non-looping)
            const takeDamage = newMixer.clipAction(
              animModel.animations[takeDamageAnimationIndex],
            );
            takeDamage.reset();
            takeDamage.setLoop(THREE.LoopOnce, 1);
            takeDamage.clampWhenFinished = true;

            // Setup die animation (non-looping)
            //const die = newMixer.clipAction(animModel.animations[10]);

            const die = newMixer.clipAction(animModel.animations[dieAnimationIndex]);

            die.reset();
            die.setLoop(THREE.LoopOnce, 1);
            die.clampWhenFinished = true;

            // Animation sequence with crossfades - idle, then take damage, then die
            setTimeout(() => {
              // Fade out idle, fade in take damage
              idle.fadeOut(0.3);

              setTimeout(() => {
                takeDamage.fadeIn(0.3);
                takeDamage.play();

                // When take damage animation is done, play die
                const takeDamageDuration = takeDamage.getClip().duration * 1000; // Convert to milliseconds

                setTimeout(() => {
                  takeDamage.fadeOut(0.3);

                  setTimeout(() => {
                    die.fadeIn(0.3);
                    die.play();
                    // Die animation stays at the end frame since clampWhenFinished = true
                  }, 300); // After take damage fade out
                }, takeDamageDuration); // Wait for take damage animation to finish
              }, 300); // After idle fade out
            }, 1300); // Initial delay
          } else {
            // First play idle animation (looping)
            const idle = newMixer.clipAction(animModel.animations[idleAnimationIndex]);
            idle.reset();
            idle.setLoop(THREE.LoopRepeat, Infinity);
            idle.play();

            // Setup take damage animation (non-looping)
            const takeDamage = newMixer.clipAction(
              animModel.animations[takeDamageAnimationIndex],
            );
            takeDamage.reset();
            takeDamage.setLoop(THREE.LoopOnce, 1);
            takeDamage.clampWhenFinished = true;

            let attack = null;
            if (attackAnimations.length > 0) {
              // Get a random index within the attackAnimations array
              const randomIndex = Math.floor(Math.random() * attackAnimations.length);
              const selectedAttack = attackAnimations[randomIndex];

              attack = newMixer.clipAction(selectedAttack.clip);
            } else {
              // Fallback to a known animation index if available
              if (animModel.animations.length > 5) {
                attack = newMixer.clipAction(animModel.animations[14]);
              }
            }

            // Only set up attack animation if we found it
            if (attack) {
              attack.reset();
              attack.setLoop(THREE.LoopOnce, 1);
              attack.clampWhenFinished = true;
            }

            // Animation sequence with crossfades - first take damage, then attack
            setTimeout(() => {
              // Fade out idle, fade in take damage
              idle.fadeOut(0.3);

              setTimeout(() => {
                takeDamage.fadeIn(0.3);
                takeDamage.play();

                // When take damage animation is done, play attack
                const takeDamageDuration = takeDamage.getClip().duration * 1000; // Convert to milliseconds

                setTimeout(() => {
                  takeDamage.fadeOut(0.3);

                  setTimeout(() => {
                    attack?.fadeIn(0.3);
                    attack?.play();

                    // When attack animation is done, go back to idle

                    // When you need to get the attack duration
                    let attackDuration = 1000; // Default duration in milliseconds

                    if (attack) {
                      attackDuration = attack.getClip().duration * 1000; // Convert to milliseconds
                    } else {
                      console.warn(
                        'No attack animation available, using default duration',
                      );
                    }

                    setTimeout(() => {
                      attack?.fadeOut(0.3);

                      setTimeout(() => {
                        idle.reset();
                        idle.fadeIn(0.3);
                        idle.play();
                      }, 300); // After attack fade out
                    }, attackDuration); // Wait for attack animation to finish
                  }, 300); // After take damage fade out
                }, takeDamageDuration); // Wait for take damage animation to finish
              }, 300); // After idle fade out
            }, 1000); // Initial delay
          }

          setMixer(newMixer);
          URL.revokeObjectURL(objectUrl);
        },
        undefined,
        (error) => {
          console.error('Error loading animation:', error);
          URL.revokeObjectURL(objectUrl);
        },
      );
    } catch (error) {
      console.error('Error loading animation:', error);
    }
  };

  // Load model immediately (separate from getIsModelReady check)
  useEffect(() => {
    if (!modelSrc) return;
    loadModel(); // Start loading immediately
  }, [modelSrc]);

  // Check when model is ready and add to scene with animations
  useEffect(() => {
    if (!modelLoaded || !preloadedModelRef.current) return;

    const fbxModel = preloadedModelRef.current;
    if (containerRef?.current && sceneRef.current && !modelReady && fbxModel) {
      console.log(`model ready!`, { fbxModel });
      // Remove previous model if exists
      // if (model) {
      //   scene.remove(model);
      //   setModel(null);
      // }

      // Add to scene
      sceneRef.current.add(fbxModel);
      setModel(fbxModel);

      // Setup animation mixer
      if (fbxModel.animations && fbxModel.animations.length > 0) {
        const newMixer = new THREE.AnimationMixer(fbxModel);
        setMixer(newMixer);
        const action = newMixer.clipAction(fbxModel.animations[0]);
        action.play();
      }

      // Try to load animation
      loadAnimation(modelSrc, fbxModel);

      if (callbackReady)
        callbackReady({
          key: 'monster-model-renderer',
          scene: sceneRef.current!,
          camera: cameraRef.current!,
          renderElement: containerRef.current,
          animationLoopFn: animateLoopFn,
          onDispose: onDispose,
        });

      setModelReady(true);
    }

    return () => {
      console.log('REVOKE monster-model-renderer');
    };
  }, [modelLoaded, modelSrc, model]);
  return (
    <div
      data-model-name="monster-model-renderer"
      ref={containerRef}
      style={style}
      className={cn(className)}
    />
  );
};

export default MonsterModelRenderer;
