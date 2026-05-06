import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { SceneData, useThreeRenderer } from '@component/game/canvas/gc-main-canvas';
import { GCACharacterModel } from '@component/game/three-d-model/character-animation-controller';
import { InstallGameLighting } from '@component/game/threejs-lighting';
import { cn } from '@global/helper/cn';
import StoreGlobal from '@store/global/index.ts';

interface CharacterModelRendererProps {
  modelSrc?: string;
  className?: string;
  style?: React.CSSProperties;
  isAnswerCorrect?: boolean;
  callbackReady?: (scene: SceneData) => void;
}

export function CharacterModelRenderer({
  modelSrc,
  className,
  style,
  isAnswerCorrect = true,
  callbackReady,
}: CharacterModelRendererProps) {
  const { rendererRef } = useThreeRenderer();
  const elementRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const timeRef = useRef<DOMHighResTimeStamp>();
  // const [sceneState, setSceneState] = useState<'initial' | 'loading' | 'failed' | 'done'>(
  //   'initial',
  // );
  const sceneStateRef = useRef<string>('initial');
  const sceneState = sceneStateRef.current;

  const model = useMemo<GCACharacterModel>(() => new GCACharacterModel(), []);

  const animateLoopFn = (time: DOMHighResTimeStamp, rect?: DOMRect) => {
    if (rendererRef?.current && sceneRef?.current && cameraRef?.current) {
      // find delta time
      let deltaTime = 0;
      if (timeRef?.current) deltaTime = time - timeRef?.current;

      if (rect) {
        cameraRef.current.aspect = rect.width / rect.height;
        cameraRef.current.updateProjectionMatrix();
      }

      // update model
      model.Update({ deltaTime });
      // update renderer
      rendererRef?.current.render(sceneRef?.current, cameraRef?.current);
      // update current time
      timeRef.current = time;
    }
  };

  const onDispose = () => {
    // model?.ComponentRemove(sceneRef.current);
    sceneRef.current?.clear();
  };

  useEffect(() => {
    if (elementRef.current) {
      if (!sceneRef?.current || !cameraRef?.current || !rendererRef?.current) {
        // create a new scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        // setup camera
        const camera = new THREE.PerspectiveCamera(
          80,
          elementRef.current.clientWidth / elementRef.current.clientHeight,
          0.2,
          1000,
        );
        camera.position.z = 6;
        cameraRef.current = camera;
        // Create lighting
        InstallGameLighting(sceneRef.current);
      }

      // create a model and add to scene when loaded
      if (modelSrc && sceneState === 'initial' && rendererRef?.current) {
        // StoreGlobal.MethodGet().loadingSet(true); // Set loading to true here
        sceneStateRef.current = 'loading';
        model.Start({
          modelSrc,
          scene: sceneRef.current,
          renderer: rendererRef.current,
          answerIsCorrect: isAnswerCorrect,
          onLoaded: () => {
            // Set modelLoaded to true when the model is fully loaded
            // console.log(`Character model ${targetModelSrc} finished loading`);
            if (sceneRef.current && cameraRef.current && elementRef.current) {
              console.log(`Registering scene for character model: ${modelSrc}`);
              if (callbackReady)
                callbackReady({
                  key: 'character-model-renderer',
                  scene: sceneRef.current!,
                  camera: cameraRef.current!,
                  renderElement: elementRef.current!,
                  animationLoopFn: animateLoopFn,
                  onDispose: onDispose,
                });
            }
            sceneStateRef.current = 'done';
            StoreGlobal.MethodGet().loadingSet(false); // Set loading to false here
          },
          onError: (error: string) => {
            // Add onError handler
            console.error('Error loading model:', error);
            sceneStateRef.current = 'failed';
            StoreGlobal.MethodGet().loadingSet(false); // Also set loading to false on error
          },
        });
      } else {
        // If there's no model to load initially, reset the state
        sceneStateRef.current = 'failed';
        StoreGlobal.MethodGet().loadingSet(false); // Ensure loading is false when no model
      }
    }

    return () => {
      console.log('REVOKE character-model-renderer');
      // if (unregisterScene) unregisterScene('character-model-renderer');
    };
  }, [model]);

  return (
    <div
      data-model-name="character-model-renderer"
      ref={elementRef}
      style={style}
      className={cn(className)}
    />
  );
}

export default CharacterModelRenderer;
