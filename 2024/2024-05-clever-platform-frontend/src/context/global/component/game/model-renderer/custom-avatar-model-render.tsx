import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { InstallGameLighting } from '@component/game/threejs-lighting';
import { GCAThreeModel } from '../three-d-model/model-spin-animation';
import StoreGlobal from '@store/global/index.ts';

export function ThreeModelRenderer({
  modelSrc,
  className,
  style,
  canvasWidth = 1200, // Add default width
  canvasHeight = 1500, // Add default height
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
  const currentModelSrcRef = useRef<string | undefined>(undefined); // Track current model to prevent stale callbacks

  const model = useMemo<GCAThreeModel>(() => new GCAThreeModel(), []);

  // Effect to call onLoaded when model is loaded
  useEffect(() => {
    if (modelLoaded && onLoaded) {
      console.log(`Character model ${modelSrc} loaded, calling onLoaded callback`);
      onLoaded();
    }
  }, [modelLoaded, modelSrc, onLoaded]);

  useEffect(() => {
    if (modelLoaded) {
      StoreGlobal.MethodGet().loadingSet(false);
    } else {
      StoreGlobal.MethodGet().loadingSet(true);
    }
  }, [modelLoaded]);

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
        // Track current model to prevent stale callbacks
        currentModelSrcRef.current = modelSrc;
        setModelLoaded(false); // Reset loading state when switching models

        model.Start({
          modelSrc,
          scene: sceneRef.current,
          renderer: rendererRef.current,
          answerIsCorrect,
          onLoaded: () => {
            // Only update state if this is still the current model (prevent stale callbacks)
            if (currentModelSrcRef.current === modelSrc) {
              console.log(`Character model ${modelSrc} finished loading`);
              setModelLoaded(true);
            } else {
              console.log(`Ignoring stale callback for ${modelSrc}, current is ${currentModelSrcRef.current}`);
            }
          },
        });
      } else {
        // If there's no model to load, consider it "loaded" immediately
        setModelLoaded(true);
      }

      rendererRef.current.setAnimationLoop(animationLoop);
    }

    // Clean up on unmount or when modelSrc changes
    return () => {
      console.log('Cleanup: removing model from scene (Shop)');
      currentModelSrcRef.current = undefined; // Invalidate current model ref

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

  return (
    <canvas
      ref={canvasRef}
      className={
        className ||
        `w-full h-full absolute -bottom-36 -left-[75%] z-[-10] ${modelLoaded ? 'opacity-100' : 'opacity-0'}`
      }
      style={style}
    />
  );
}

export default ThreeModelRenderer;
