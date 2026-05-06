import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { InstallGameLighting } from '@component/game/threejs-lighting';
import { GCAThreeModel } from '../three-d-model/main-menu-3d-loader';

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

  const model = useMemo<GCAThreeModel>(() => new GCAThreeModel(), []);

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
      model.Start({ modelSrc, scene: sceneRef.current, renderer: rendererRef.current }); // ADD renderer: rendererRef.current
      rendererRef.current.setAnimationLoop(animationLoop);
    }

    // Clean up on unmount
    return () => {
      console.log('Cleanup: removing model from scene (Main Menu)');

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
  }, [animationLoop, model, modelSrc, className, style, canvasWidth, canvasHeight]);

  return (
    <canvas
      ref={canvasRef}
      className={className || 'w-full h-full absolute bottom-16 z-[-10]'}
      style={style}
    />
  );
}

export default ThreeModelRenderer;
