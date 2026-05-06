import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArcadeRestAPI } from '@core-utils/api/arcade/rest-api';
import { InstallGameLighting } from './threejs-lighting';
import { GCAThreeModel } from './character-animation-controller';

export function CharacterModelRenderer({
  accessPlayToken,
  modelId,
  className,
  style,
  canvasWidth = 1000,
  canvasHeight = 600,
  answerIsCorrect = true,
  onLoaded,
}: {
  accessPlayToken: string;
  modelId?: string;
  className?: string;
  style?: React.CSSProperties;
  canvasWidth?: number;
  canvasHeight?: number;
  answerIsCorrect?: boolean;
  onLoaded?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const timeRef = useRef<DOMHighResTimeStamp | null>(null);
  const [_modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  const model = useMemo<GCAThreeModel>(() => new GCAThreeModel(), []);

  // Fetch model from API
  useEffect(() => {
    let blobUrl: string | null = null;

    const fetchModel = async () => {
      console.log('🔍 Fetching model:', accessPlayToken);
      setIsLoadingApi(true);
      try {
        const response = await ArcadeRestAPI.GetModel(accessPlayToken);
        if (response instanceof ArrayBuffer) {
          console.log('📦 Received ArrayBuffer, size:', response.byteLength);
          const blob = new Blob([response], { type: 'application/octet-stream' });
          blobUrl = URL.createObjectURL(blob);
          setModelUrl(blobUrl);
          console.log('✅ Model fetched successfully');
        } else {
          console.error('❌ Failed to load model');
        }
      } catch (err) {
        console.error('❌ Error fetching model:', err);
      } finally {
        setIsLoadingApi(false);
      }
    };

    fetchModel();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [accessPlayToken]);

  // Effect to call onLoaded when model is loaded
  useEffect(() => {
    if (modelLoaded && onLoaded) {
      console.log(`Character model ${modelId} loaded, calling onLoaded callback`);
      onLoaded();
    }
  }, [modelLoaded, modelId, onLoaded]);

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
      if (modelId && rendererRef?.current && sceneRef?.current) {
        model.Start({
          modelSrc: modelId,
          scene: sceneRef.current,
          renderer: rendererRef.current,
          answerIsCorrect,
          onLoaded: () => {
            // Set modelLoaded to true when the model is fully loaded
            console.log(`Character model ${modelId} finished loading`);
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
    modelId,
    className,
    style,
    canvasWidth,
    canvasHeight,
    answerIsCorrect,
  ]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-lg bg-gray-900">
      {isLoadingApi && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
          <div className="text-white text-lg font-semibold">
            🔄 Loading model from API...
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className={className || `w-full h-full`}
        style={style}
      />

      {modelId && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
          Model ID: {modelId}
        </div>
      )}
    </div>
  );
}

export default CharacterModelRenderer;
