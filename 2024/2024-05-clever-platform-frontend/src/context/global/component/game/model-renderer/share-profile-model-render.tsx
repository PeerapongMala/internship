import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { InstallGameLighting } from '@component/game/threejs-lighting';
import { GCAThreeModel } from '../three-d-model/index';

function cleanUpModel(model: THREE.Object3D, cleanedObjects = new WeakSet()) {
  if (cleanedObjects.has(model)) {
    return; // If already cleaned, skip the object
  }

  cleanedObjects.add(model);

  if (model instanceof THREE.Mesh) {
    // Dispose of materials and textures
    if (Array.isArray(model.material)) {
      model.material.forEach((mat) => {
        if (mat instanceof THREE.Material) {
          // Check if the material has a 'map' property (texture)
          if ((mat as any).map) {
            (mat as any).map.dispose(); // Dispose of textures
          }
          mat.dispose();
        }
      });
    } else if (model.material instanceof THREE.Material) {
      // Check if the material has a 'map' property (texture)
      if ((model.material as any).map) {
        (model.material as any).map.dispose(); // Dispose of textures
      }
      model.material.dispose();
    }

    // Dispose of geometry
    if (model.geometry) {
      model.geometry.dispose();
    }
  }

  // Recursively clean up child objects if any
  model.traverse((child) => cleanUpModel(child, cleanedObjects));
}

// Delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function ThreeModelRenderer({
  modelSrc,
  className,
  style,
  canvasWidth = 500, // Add default width
  canvasHeight = 600, // Add default height
}: {
  modelSrc?: string;
  className?: string;
  style?: React.CSSProperties;
  canvasWidth?: number; // Add props for width and height
  canvasHeight?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.Camera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const timeRef = useRef<DOMHighResTimeStamp>();
  const [isLoading, setIsLoading] = useState(true); // Loading state to control model loading

  const model = useMemo<GCAThreeModel>(() => new GCAThreeModel(), []);

  const animationLoop = useCallback(
    (time: DOMHighResTimeStamp) => {
      if (rendererRef?.current && sceneRef?.current && cameraRef?.current) {
        // initial delta time to 0
        let deltaTime = 0;
        // if not first render, find delta time
        if (timeRef?.current) {
          deltaTime = time - timeRef?.current;
        }
        // update model
        model.Update({ deltaTime });
        // update renderer
        rendererRef?.current.render(sceneRef?.current, cameraRef?.current);
        // update current time
        timeRef.current = time;
      }
    },
    [model],
  );

  useEffect(() => {
    const loadModelWithDelay = async () => {
      await delay(500); // 1000ms (1 second) delay before loading the model
      setIsLoading(false); // Set loading to false after the delay
    };

    loadModelWithDelay();

    const canvasElement = canvasRef?.current;
    if (canvasElement) {
      if (!sceneRef?.current || !cameraRef?.current || !rendererRef?.current) {
        // Create a new scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Setup camera
        const camera = new THREE.PerspectiveCamera(
          80,
          canvasElement.clientWidth / canvasElement.clientHeight,
          0.1,
          1000,
        );
        camera.position.z = 6;
        cameraRef.current = camera;

        // Create lighting
        InstallGameLighting(sceneRef.current);

        if (!rendererRef?.current) {
          const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef?.current,
            antialias: true,
            alpha: true,
          });
          rendererRef.current = renderer;
          // Set renderer size based on props (or canvas attributes)
          rendererRef.current.setSize(canvasWidth, canvasHeight);
        }
      }

      // Cleanup the scene before adding a new model
      if (sceneRef.current) {
        sceneRef.current.traverse((child) => cleanUpModel(child));
      }

      // Load the model into the scene only if not loading
      if (!isLoading && modelSrc) {
        model.Start({ modelSrc, scene: sceneRef.current, renderer: rendererRef.current });
      }

      // Start the animation loop
      rendererRef.current.setAnimationLoop(animationLoop);
    }

    // Cleanup on component unmount
    return () => {
      console.log('Cleanup: removing model from scene (Share Profile)');

      // Clean up all objects in scene
      if (sceneRef.current) {
        sceneRef.current.traverse((child) => cleanUpModel(child));
      }

      // Dispose GCAThreeModel resources (textures, geometries, materials)
      model?.dispose();
      model?.ComponentRemove(sceneRef.current);

      // Stop animation loop
      rendererRef.current?.setAnimationLoop(null);

      // Clear and dispose renderer to free GPU memory
      rendererRef.current?.clear();
      rendererRef.current?.dispose();
      rendererRef.current = undefined;

      // Clear scene
      if (sceneRef.current) {
        sceneRef.current.clear();
        sceneRef.current = undefined;
      }

      // Clear camera reference
      cameraRef.current = undefined;

      console.log('Cleanup complete: renderer and scene disposed');
    };
  }, [animationLoop, model, modelSrc, canvasWidth, canvasHeight, isLoading]);

  return (
    <canvas
      ref={canvasRef}
      className={className || 'w-full h-full absolute -bottom-8 z-[-10]'}
      style={style}
    />
  );
}

export default ThreeModelRenderer;
