import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { InstallGameLighting } from '@component/game/threejs-lighting';
import StoreGlobal from '@store/global/index.ts';
import { GCACharacterModel } from '../three-d-model/character-animation-controller';

export function ThreeModelRenderer({
  modelSrc,
  className,
  style,
  canvasWidth = 500, // Add default width
  canvasHeight = 600, // Add default height
  answerIsCorrect = true,
  onLoaded, // Add onLoaded callback prop
}: {
  modelSrc?: string;
  className?: string;
  style?: React.CSSProperties;
  canvasWidth?: number; // Add props for width and height
  canvasHeight?: number;
  answerIsCorrect?: boolean;
  onLoaded?: () => void; // Add type for onLoaded callback
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.Camera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const timeRef = useRef<DOMHighResTimeStamp>();
  const [modelLoaded, setModelLoaded] = useState(false); // Track if the model is loaded
  const [loadingError, setLoadingError] = useState<string | null>(null); // Add error state

  const model = useMemo<GCACharacterModel>(() => new GCACharacterModel(), []);

  // Effect to call onLoaded when model is loaded
  useEffect(() => {
    if (modelLoaded && onLoaded) {
      console.log(`Character model ${modelSrc} loaded, calling onLoaded callback`);
      onLoaded();
    }
  }, [modelLoaded, modelSrc, onLoaded]);

  const animationLoop = useCallback(
    (time: DOMHighResTimeStamp, frame: XRFrame) => {
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
    const canvasElement = canvasRef?.current;
    if (canvasElement) {
      if (!sceneRef?.current || !cameraRef?.current || !rendererRef?.current) {
        // create a new scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // setup camera
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
            preserveDrawingBuffer: true, // Set preserveDrawingBuffer to true
          });
          rendererRef.current = renderer;
          // Set renderer size based on props (or canvas attributes)
          rendererRef.current.setSize(canvasWidth, canvasHeight);
        }
      }

      // create a model and add to scene when loaded
      if (modelSrc) {
        console.log('Fall to if');
        StoreGlobal.MethodGet().loadingSet(false); // Set loading to true here
        model.Start({
          modelSrc,
          scene: sceneRef.current,
          renderer: rendererRef.current,
          answerIsCorrect,
          onLoaded: () => {
            // Set modelLoaded to true when the model is fully loaded
            console.log(`Character model ${modelSrc} finished loading`);
            setTimeout(() => {
              setModelLoaded(true);
              StoreGlobal.MethodGet().loadingSet(false); // Set loading to false here
            }, 50); // Add a small delay
          },
          onError: (error: string) => {
            // Add onError handler
            console.error('Error loading model:', error);
            setLoadingError(error);
            setModelLoaded(true); // Ensure modelLoaded is true to prevent indefinite loading
            StoreGlobal.MethodGet().loadingSet(false); // Also set loading to false on error
          },
        });
      } else {
        console.log('Fall to else');
        // If there's no model to load initially, reset the state
        setModelLoaded(false);
        setLoadingError(null);
        StoreGlobal.MethodGet().loadingSet(false); // Ensure loading is false when no model
      }

      rendererRef.current.setAnimationLoop(animationLoop);
    }

    // Clean up on unmount
    return () => {
      console.log('Cleanup: removing model from scene (Character Renderer)');

      // Dispose GCACharacterModel resources
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
        sceneRef.current.traverse((child: any) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat: any) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        sceneRef.current.clear();
        sceneRef.current = undefined;
      }

      // Clear camera reference
      cameraRef.current = undefined;

      console.log('Cleanup complete: renderer and scene disposed');
    };
  }, [
    animationLoop,
    model,
    modelSrc,
    className,
    style,
    canvasWidth,
    canvasHeight,
    answerIsCorrect,
  ]);

  // Add loading error handling
  if (loadingError) {
    return <div>Error loading model: {loadingError}</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      className={
        className ||
        `w-full h-full absolute bottom-16 z-[-10] ${modelLoaded ? 'opacity-100' : 'opacity-0'}`
      }
      style={style}
    />
  );
}

export default ThreeModelRenderer;
