import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { InstallGameLighting } from './threejs-lighting';
import { GCAThreeModel } from './character-animation-controller-mainmenu';

export function ThreeModelRenderer({
  modelSrc,
  className,
  style,
  canvasWidth = 1000, // Add default width
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const timeRef = useRef<DOMHighResTimeStamp | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false); // Track if the model is loaded

  const model = useMemo<GCAThreeModel>(() => new GCAThreeModel(), []);

  // Effect to call onLoaded when model is loaded
  useEffect(() => {
    if (modelLoaded && onLoaded) {
      console.log(`Character model ${modelSrc} loaded, calling onLoaded callback`);
      onLoaded();
    }
  }, [modelLoaded, modelSrc, onLoaded]);

  const animationLoop = useCallback(
    (time: DOMHighResTimeStamp, _frame: XRFrame) => {
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

        if (!rendererRef?.current && canvasRef?.current) {
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
      if (modelSrc && rendererRef?.current && sceneRef?.current) {
        model.Start({
          modelSrc,
          scene: sceneRef.current,
          renderer: rendererRef.current,
          answerIsCorrect,
          onLoaded: () => {
            // Set modelLoaded to true when the model is fully loaded
            console.log(`Character model ${modelSrc} finished loading`);
            setModelLoaded(true);
          },
        });
      } else {
        // If there's no model to load, consider it "loaded" immediately
        //setModelLoaded(true);
      }

      rendererRef?.current?.setAnimationLoop(animationLoop);
    }

    // Clean up on unmount
    return () => {
      model?.ComponentRemove(sceneRef.current);
      rendererRef.current?.setAnimationLoop(null);
      rendererRef.current?.clear();
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
    <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-lg bg-gray-900">
      {/* <canvas
        ref={canvasRef}
        className={
          className ||
          `w-full h-full absolute -bottom-36 -left-[55%] z-[-10] ${modelLoaded ? 'opacity-100' : 'opacity-0'}`
        }
        style={style}
      />*/}
      {/* <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.target.enemy} autoRotate autoFitCamera /> */}
      <canvas
        ref={canvasRef}
        className={
          className ||
          `w-full h-full`
        }
        style={style}
      />
    </div>
  );
}

export default ThreeModelRenderer;
