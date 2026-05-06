import { StoreModelFileMethods } from '@global/store/global/avatar-models/index';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { getIsModelReady } from '../three-d-model/character-animation-controller';

interface PetModelRendererProps {
  modelSrc: string;
  className?: string;
  style?: React.CSSProperties;
  autoRotate?: boolean;
  isAnswerCorrect?: boolean;
  actualWidth?: number;
}

const PetBlobModelRenderer: React.FC<PetModelRendererProps> = ({
  modelSrc,
  className,
  style,
  autoRotate = true,
  isAnswerCorrect,
  actualWidth = 850,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scene] = useState<THREE.Scene>(new THREE.Scene());
  const [camera] = useState<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(70, 1, 0.005, 2000),
  );
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const requestRef = useRef<number | null>(null);
  const clock = useRef<THREE.Clock>(new THREE.Clock());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [animationInterval, setAnimationInterval] = useState(null);
  const [modelReady, setModelReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false); // Track if model is loaded
  const preloadedModelRef = useRef<THREE.Group | null>(null); // Store preloaded model

  // Get the display width from className (e.g., w-[1700px])
  const displayWidth = parseInt(className?.match(/w-\[(\d+)px\]/)?.[1] || '850');

  // Calculate the offset to center the actual rendering area
  const offsetX = (displayWidth - actualWidth) / 2;

  // Initialize scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup camera
    camera.position.z = 10;
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);

    // Create renderer
    const newRenderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    // Important: Set canvas size to the display width, not actual width
    newRenderer.setSize(displayWidth, canvasRef.current.clientHeight);
    newRenderer.setPixelRatio(window.devicePixelRatio);
    newRenderer.outputColorSpace = THREE.SRGBColorSpace;

    // Set the viewport to center the actual rendering area
    newRenderer.setViewport(offsetX, 0, actualWidth, canvasRef.current.clientHeight);

    setRenderer(newRenderer);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current || !renderer) return;

      const height = canvasRef.current.clientHeight;

      // Update the camera aspect ratio based on actualWidth
      camera.aspect = actualWidth / height;
      camera.updateProjectionMatrix();

      // Set renderer size to the full display width
      renderer.setSize(displayWidth, height);

      // But set viewport to the centered actual width
      renderer.setViewport(offsetX, 0, actualWidth, height);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size setup

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }

      if (newRenderer) {
        newRenderer.dispose();
      }

      // Clear scene
      while (scene.children.length > 0) {
        const object = scene.children[0];
        scene.remove(object);
      }
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!renderer || !modelReady) return;

    const animate = () => {
      // Update mixer for animations
      if (mixer) {
        mixer.update(clock.current.getDelta());
      }

      // Rotate model if needed
      if (autoRotate && model) {
        //model.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [renderer, mixer, model, autoRotate, scene, camera, modelReady]);

  // Load model immediately (separate from getIsModelReady check)
  useEffect(() => {
    if (!modelSrc || !renderer) return;

    setIsLoading(true);
    let objectUrl: string | null = null;

    const loadModel = async () => {
      try {
        // Check if model exists in IndexedDB
        const modelBlob = await StoreModelFileMethods.getItem(modelSrc);
        if (!modelBlob) {
          console.error(`Model ${modelSrc} not found in IndexedDB`);
          setIsLoading(false);
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
            switch (modelSrc) {
              case 'Snow_Bomb':
                fbxModel.scale.set(0.017, 0.017, 0.017);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -1.5;
                break;
              case 'Werewolf':
                fbxModel.scale.set(0.013, 0.013, 0.013);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 2;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -2.5;
                break;
              case 'Snake_Naga':
                fbxModel.scale.set(0.01, 0.01, 0.01);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 0.7;
                fbxModel.position.y = -3.5;
                fbxModel.position.z = -4.5;
                break;
              case 'Dragon_Fire':
                fbxModel.scale.set(0.01, 0.01, 0.01);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1;
                fbxModel.position.y = -2.2;
                fbxModel.position.z = -1.5;
                break;
              case 'Bloom':
                fbxModel.scale.set(0.017, 0.017, 0.017);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.6;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -2.5;
                break;
              case 'Blossom':
                fbxModel.scale.set(0.017, 0.017, 0.017);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.6;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -2.5;
                break;
              case 'Bomb':
                fbxModel.scale.set(0.017, 0.017, 0.017);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.3;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -2;
                break;
              case 'Bud':
                fbxModel.scale.set(0.027, 0.027, 0.027);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.2;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -2.5;
                break;
              case 'Dragon_Inferno':
                fbxModel.scale.set(0.009, 0.009, 0.009);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -2.5;
                break;
              case 'Dragon_Spark':
                fbxModel.scale.set(0.019, 0.019, 0.019);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.5;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -2.5;
                break;
              case 'Hermit_King':
                fbxModel.scale.set(0.016, 0.016, 0.016);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.5;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -2.5;
                break;
              case 'Poison_Bomb':
                fbxModel.scale.set(0.016, 0.016, 0.016);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.5;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -2.5;
                break;
              case 'Practice_Dummy':
                fbxModel.scale.set(0.021, 0.021, 0.021);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.5;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -2.5;
                break;
              case 'Shell':
                fbxModel.scale.set(0.025, 0.025, 0.025);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.5;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -2.5;
                break;
              case 'Snake':
                fbxModel.scale.set(0.025, 0.025, 0.025);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.5;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -6.5;
                break;
              case 'Snakelet':
                fbxModel.scale.set(0.025, 0.025, 0.025);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.5;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -3;
                break;
              case 'Spike':
                fbxModel.scale.set(0.025, 0.025, 0.025);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.5;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -2.5;
                break;
              case 'Sun_Blossom':
                fbxModel.scale.set(0.025, 0.025, 0.025);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.5;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -2.5;
                break;
              case 'Sunflora_Pixie':
                fbxModel.scale.set(0.025, 0.025, 0.025);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.5;
                fbxModel.position.y = -2.5;
                fbxModel.position.z = -2.5;
                break;
              case 'Sunflower_Fairy':
                fbxModel.scale.set(0.025, 0.025, 0.025);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.5;
                fbxModel.position.y = -3;
                fbxModel.position.z = -4.5;
                break;
              case 'Target_Dummy':
                fbxModel.scale.set(0.025, 0.025, 0.025);
                fbxModel.rotateY(-0.7);
                fbxModel.position.x = 1.5;
                fbxModel.position.y = -3.5;
                fbxModel.position.z = -5.5;
                break;
            }

            // Center model
            const box = new THREE.Box3().setFromObject(fbxModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            fbxModel.rotateY(-0.7);

            // Store the preloaded model but don't add to scene yet
            preloadedModelRef.current = fbxModel;
            setModelLoaded(true);
            setIsLoading(false);
          },
          undefined,
          (error) => {
            console.error('Error loading model:', error);
            setIsLoading(false);
            if (objectUrl) URL.revokeObjectURL(objectUrl);
          },
        );
      } catch (error) {
        console.error('Error loading model:', error);
        setIsLoading(false);
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      } finally {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      }
    };

    loadModel(); // Start loading immediately

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [modelSrc, renderer, scene]);

  // Check when model is ready and add to scene with animations
  useEffect(() => {
    if (!modelLoaded || !preloadedModelRef.current) return;

    const checkModelReadyInterval = setInterval(() => {
      if (getIsModelReady()) {
        clearInterval(checkModelReadyInterval);

        const fbxModel = preloadedModelRef.current;
        if (!fbxModel) return;

        // Remove previous model if exists
        if (model) {
          scene.remove(model);
          setModel(null);
        }

        // Add to scene
        scene.add(fbxModel);
        setModel(fbxModel);

        // Setup animation mixer
        if (fbxModel.animations && fbxModel.animations.length > 0) {
          const newMixer = new THREE.AnimationMixer(fbxModel);
          const action = newMixer.clipAction(fbxModel.animations[0]);
          action.play();
          setMixer(newMixer);
        }

        // Try to load animation
        loadAnimation(modelSrc, fbxModel);

        setModelReady(true);
      }
    }, 50);

    return () => {
      clearInterval(checkModelReadyInterval);
    };
  }, [modelLoaded, modelSrc, scene, model]);

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

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        className="bg-transparent"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default PetBlobModelRenderer;
