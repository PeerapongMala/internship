import { GCAThreeModel } from '@component/game/three-d-model';
import { InstallGameLighting } from '@component/game/threejs-lighting';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export function ThreeModelRenderer({ modelSrc }: { modelSrc?: string }) {
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
          90,
          canvasElement.clientWidth / canvasElement.clientHeight,
          0.1,
          1000,
        );
        camera.position.z = 8;
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
        }
      }

      // create a model and add to scene when loaded
      model.Start({
        modelSrc,
        scene: sceneRef.current,
        renderer: rendererRef.current, // Pass renderer to the Start method
      });
      rendererRef.current.setAnimationLoop(animationLoop);
      rendererRef.current.setAnimationLoop(animationLoop);
    }

    // Clean up on unmount
    return () => {
      console.log('Cleanup: removing model from scene (Avatar Custom)');

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
  }, [animationLoop, model, modelSrc]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

export default ThreeModelRenderer;
