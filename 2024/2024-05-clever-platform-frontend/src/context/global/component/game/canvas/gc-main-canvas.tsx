import { calculateScaledSize } from '@global/helper/scaler';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type SceneData = {
  key: string;
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderElement: HTMLDivElement;
  animationLoopFn?: (time: DOMHighResTimeStamp, frame?: DOMRect) => void;
  onDispose?: () => void;
};

type RendererContextType = {
  rendererRef?: React.RefObject<THREE.WebGLRenderer>;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  scenesRef?: React.RefObject<SceneData[]>;
  registerScene?(sceneData: SceneData): void;
  unregisterScene?(key: string): void;
  startAllScenes?(): void;
  shouldRunAnimationLoop?(shouldRun: boolean): void;
  disposeScenes?(): void;
};

const ThreeRendererContext = createContext<RendererContextType | null>({});

export const useThreeRenderer = () => {
  const context = useContext(ThreeRendererContext);
  if (!context) {
    throw new Error('useThreeRenderer must be used within a GCMainCanvasProvider');
  }
  return context;
};

export function GCMainCanvasProvider({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const scenesRef = useRef<SceneData[]>([]);
  const startTimeRef = useRef<DOMHighResTimeStamp | null>(null);
  const scaleRef = useRef<ReturnType<typeof calculateScaledSize> | null>(null);
  const [isRunningLoop, setRunningLoop] = useState<boolean>(true);
  // debounce for debug when resizing
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debugLogOnceRef = useRef<boolean>(true);

  const startAllScenes = async () => {
    // cleanup previous scenes first
    shouldRunAnimationLoop(false);

    // then start animation
    setTimeout(() => {
      shouldRunAnimationLoop(true);
    }, 500);
  };

  const animationMainLoop = (time: DOMHighResTimeStamp, frame: XRFrame) => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    // note: I don't know why this is needed.
    renderer.setScissorTest(false);
    renderer.clear(false, true);

    // set the scissor for divide the viewport from canvas to render each scene
    renderer.setScissorTest(true);
    renderer.autoClear = false;

    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.outputColorSpace = THREE.SRGBColorSpace;

    // if start time is null, set this current time to start time
    if (startTimeRef.current === null) {
      startTimeRef.current = time;
    }
    // step time = current time - start time
    const stepTime = time - startTimeRef.current;
    const scale = scaleRef.current;
    // console.log(
    //   `(step=${stepTime}, t=${time}) GCMainCanvasProvider: Rendering ${scenes.current.map((s) => s.key).join(', ')}`,
    // );

    // Loop through all registered scenes and render them
    for (const {
      key,
      scene,
      camera,
      renderElement,
      animationLoopFn,
    } of scenesRef.current) {
      // get the viewport relative position of this element
      const rect = renderElement.getBoundingClientRect();
      const { left, right, top, bottom, width, height } = rect;

      const isOffscreen =
        bottom < 0 ||
        top > renderer.domElement.clientHeight ||
        right < 0 ||
        left > renderer.domElement.clientWidth;

      if (!isOffscreen) {
        // note 1: (x, y) is bottom-left position of canvas
        // note 2: position y is calculate by window's height minus with bottom + padding axis-y
        //         this should equal the height from bottom of canvas to element
        // ref: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
        const x = left - (scale?.paddingX ?? 0);
        const y = window.innerHeight - bottom - (scale?.paddingY ?? 0);
        renderer.setScissor(x, y, width, height);
        renderer.setViewport(x, y, width, height);

        if (debugLogOnceRef.current) {
          console.log({
            key,
            renderElement,
            rect,
            isOffscreen,
            render: { x, y, width, height },
          });
        }

        if (animationLoopFn) {
          animationLoopFn(stepTime, rect);
        }
      } else if (debugLogOnceRef.current) {
        console.log({ key, renderElement, rect, isOffscreen });
      }
    }

    debugLogOnceRef.current = false;
  };

  const registerScene = (sceneData: SceneData) => {
    scenesRef.current.push(sceneData);
    onWindowResize(); // Adjust renderer size on new scene registration
  };

  const unregisterScene = (key: string) => {
    scenesRef.current = scenesRef.current.filter((s) => {
      const isTargetScene = s.key === key;
      if (isTargetScene && s.onDispose) {
        s.onDispose();
      }
      return !isTargetScene; // keep scenes that are not the target
    });
    onWindowResize(); // Adjust renderer size on new scene registration
  };

  const shouldRunAnimationLoop = (shouldRun: boolean) => {
    setRunningLoop(shouldRun);
    if (rendererRef.current) {
      if (shouldRun) {
        // set main animation loop to be running
        rendererRef.current.setAnimationLoop(animationMainLoop);
      } else {
        // clear time and animation loop
        startTimeRef.current = null;
        rendererRef.current.setAnimationLoop(null);
        rendererRef.current.clear(false, true);
      }
    }
  };

  const disposeScenes = () => {
    shouldRunAnimationLoop(false);
    scenesRef.current.forEach(({ onDispose }) => {
      onDispose && onDispose();
    });
    scenesRef.current = [];
  };

  const onWindowResize = () => {
    if (canvasRef.current && rendererRef.current) {
      const renderer = rendererRef.current;
      const { offsetWidth: width, offsetHeight: height } = document.body;
      const scenarioSize: { width: number; height: number } = {
        width: 1280,
        height: 720,
      };
      const scale = calculateScaledSize({ width, height }, scenarioSize, true);
      if (scale) {
        renderer.setSize(scale.width, scale.height, false);
        scaleRef.current = scale;
      }

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        debugLogOnceRef.current = true;
        console.log(scaleRef.current);
      }, 1000);
    }
  };

  useEffect(() => {
    window?.addEventListener('resize', onWindowResize);

    if (!rendererRef.current && canvasRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({
        canvas: canvasRef?.current,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false,
      });
      // do resize once
      onWindowResize();
    }

    return () => {
      console.log('REVOKE GCMainCanvasProvider');
      window.removeEventListener('resize', onWindowResize);
      disposeScenes();
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <ThreeRendererContext.Provider
      value={{
        rendererRef,
        canvasRef,
        scenesRef,
        registerScene,
        unregisterScene,
        shouldRunAnimationLoop,
        startAllScenes,
        disposeScenes,
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full absolute" />
      {children}
    </ThreeRendererContext.Provider>
  );
}
