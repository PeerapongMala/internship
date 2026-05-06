import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { SceneData, useThreeRenderer } from '@component/game/canvas/gc-main-canvas';
import {
  GCAWeaponModel,
  getWeaponForCharacter,
} from '@component/game/three-d-model/weapon-loader';
import { InstallGameLighting } from '@component/game/threejs-lighting';
import { cn } from '@global/helper/cn';
import ParticleSystem from '../particle';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanUpModel(model: THREE.Object3D, cleanedObjects = new WeakSet()) {
  if (cleanedObjects.has(model)) return;
  cleanedObjects.add(model);

  if (model instanceof THREE.Mesh) {
    if (Array.isArray(model.material)) {
      model.material.forEach((mat) => {
        if (mat instanceof THREE.Material) {
          if ((mat as any).map) (mat as any).map.dispose();
          mat.dispose();
        }
      });
    } else if (model.material instanceof THREE.Material) {
      if ((model.material as any).map) (model.material as any).map.dispose();
      model.material.dispose();
    }
    if (model.geometry) model.geometry.dispose();
  }

  model.traverse((child) => cleanUpModel(child, cleanedObjects));
}

export default function WeaponModelRenderer({
  modelSrc,
  className,
  style,
  isAnswerCorrect,
  callbackReady,
}: {
  modelSrc?: string;
  isAnswerCorrect: boolean;
  className?: string;
  style?: React.CSSProperties;
  callbackReady?: (scene: SceneData) => void;
}) {
  const { rendererRef } = useThreeRenderer();
  const elementRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const timeRef = useRef<DOMHighResTimeStamp>();
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const canvasPositionRef = useRef<
    'initial' | 'final' | 'shooting' | 'losing' | 'winning'
  >('initial');

  const model = useMemo<GCAWeaponModel>(() => new GCAWeaponModel(), []);

  const canvasPosition = canvasPositionRef.current;

  const weaponName = useMemo(() => {
    return modelSrc ? getWeaponForCharacter(modelSrc) : '';
  }, [modelSrc]);

  // frame to start animation on timestamp (ms)
  const startFrame = 700;
  const shootParticalFrame = 2000 + startFrame;
  const answerFrame = 2000 + shootParticalFrame;

  const transitionSequence = (t: DOMHighResTimeStamp) => {
    const canvasPosition = canvasPositionRef.current;
    if (t >= startFrame && canvasPosition === 'initial') {
      canvasPositionRef.current = 'final';
    }

    // Wait for state update to take effect
    if (t >= shootParticalFrame && canvasPosition === 'final') {
      canvasPositionRef.current = 'shooting';
      // Create particles when reaching final position
      if (particleSystemRef.current) {
        // Position the particle system at a good spot for the effect
        particleSystemRef.current.setPosition(
          isAnswerCorrect ? 2 : -2, // X position based on answer
          isAnswerCorrect ? 1 : -1, // Y position based on answer
          0, // Z position
        );
        particleSystemRef.current.create();
      }
    }

    if (t >= answerFrame && canvasPosition === 'shooting') {
      canvasPositionRef.current = isAnswerCorrect ? 'winning' : 'losing';
    }
  };

  const animationLoopFn = (time: DOMHighResTimeStamp, frame?: DOMRect) => {
    if (rendererRef?.current && sceneRef?.current && cameraRef?.current) {
      // find delta time
      let deltaTime = 0;
      if (timeRef.current) deltaTime = time - timeRef.current;
      model.Update({ deltaTime });

      if (frame) {
        cameraRef.current.aspect = frame.width / frame.height;
        cameraRef.current.updateProjectionMatrix();
      }

      transitionSequence(time);

      // Update particle system if active
      if (particleSystemRef.current) particleSystemRef.current.update();

      rendererRef?.current.render(sceneRef.current, cameraRef.current);

      // update current time
      timeRef.current = time;
    }
  };

  const onDispose = () => {
    if (sceneRef.current) {
      sceneRef.current.traverse((child) => cleanUpModel(child));
      // Clean up particles
      if (particleSystemRef.current) {
        particleSystemRef.current.dispose();
      }
    }
    model?.ComponentRemove(sceneRef.current);
  };

  // Use weaponName instead of modelSrc for style decisions
  const canvasClasses = useMemo(() => {
    if (weaponName === 'ArrowMG') {
      return cn(
        className,
        'absolute w-[400px] h-[400px]',
        `transition-transform duration-[1.5s] ease-in-out absolute z-50`,
        canvasPosition === 'initial' ? 'left-[35%]' : 'bottom-0',
      );
    } else {
      return cn(
        className,
        'absolute w-[400px] h-[400px]',
        `z-50 transition-transform duration-[1.5s]`,
        canvasPosition === 'initial' ? 'opacity-50' : 'opacity-100',
      );
    }
  }, [className, canvasPosition, weaponName]);

  // Use weaponName instead of modelSrc for style decisions
  const canvasStyle = useMemo<React.CSSProperties>(() => {
    if (weaponName === 'ArrowMG') {
      let transform = '';
      let opacity = 1;
      let transition = '';

      if (canvasPosition === 'initial') {
        transform = isAnswerCorrect
          ? 'translate(-65%, -75%) rotate(-15deg) scale(0.9)'
          : 'translate(-65%, -65%) rotate(-10deg) scale(0.9)';
        opacity = 1;
        transition = 'transform 0.6s ease-in, opacity 0.6s ease-in';
      } else if (canvasPosition === 'final' || canvasPosition === 'shooting') {
        transform = isAnswerCorrect
          ? 'translate(35%, -73%) rotate(7deg) scale(1)'
          : 'translate(35%, -65%) rotate(18deg) scale(0.95)';
        opacity = 1;
        transition = 'transform 1s ease-out, opacity 1s ease-out';
      } else if (canvasPosition === 'losing') {
        transform = 'translate(-20%, 0%) rotate(-185deg) scale(0.75)';
        opacity = 1;
        transition = 'transform 2s ease-out, opacity 1s ease-out';
      } else if (canvasPosition === 'winning') {
        transform = 'translate(35%, -73%) rotate(7deg) scale(1)';
        opacity = 0; // fade out
        transition = 'transform 2s ease-out, opacity 2s ease-out';
      }

      return {
        ...style,
        transform,
        opacity,
        transition,
      };
    }

    return {
      ...style,
      transform:
        canvasPosition === 'initial' && !isAnswerCorrect
          ? 'translate(-100%, -20%)'
          : 'translate(0, -19%)',
      // top: '50%',
      left: '50%',
    };
  }, [style, canvasPosition, weaponName, isAnswerCorrect]);

  useEffect(() => {
    if (elementRef.current) {
      if (!sceneRef?.current || !cameraRef?.current || !rendererRef?.current) {
        // create a new scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Add fog to the scene to fade particles at the edges
        scene.fog = new THREE.Fog(0x000000, 15, 30);

        const camera = new THREE.PerspectiveCamera(
          80,
          elementRef.current.clientWidth / elementRef.current.clientHeight,
          0.1,
          1000,
        );
        camera.position.z = 6;
        cameraRef.current = camera;

        InstallGameLighting(scene);

        // Initialize enhanced particle system with multiple texture options
        particleSystemRef.current = new ParticleSystem(
          scene,
          [
            //"/assets/gameplay_particles/projectile18.png",
            // Add these files if available, otherwise comment them out
            '/assets/gameplay_particles/Explosion1.png',
            // '/assets/gameplay_particles/projectile3.png',
          ],
          70, // Increased number of particles
        );
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((child) => cleanUpModel(child));
      }

      // Only start loading when we have a valid modelSrc and loading is complete
      if (rendererRef?.current) {
        model.Start({
          modelSrc,
          scene: sceneRef.current,
          renderer: rendererRef.current,
          onLoaded: () => {
            if (sceneRef.current && cameraRef.current && elementRef.current) {
              console.log(`Registering scene for weapon model: ${weaponName}`);
              if (callbackReady) {
                callbackReady({
                  key: 'weapon-model-renderer',
                  scene: sceneRef.current!,
                  camera: cameraRef.current!,
                  renderElement: elementRef.current!,
                  animationLoopFn: animationLoopFn,
                  onDispose: onDispose,
                });
              }
            }
          },
        });
      }
    }
    return () => {
      console.log('REVOKE weapon-model-renderer');
    };
  }, [model, weaponName]);

  return (
    <div
      data-model-name="weapon-model-renderer"
      ref={elementRef}
      style={canvasStyle}
      className={canvasClasses}
    />
  );
}
