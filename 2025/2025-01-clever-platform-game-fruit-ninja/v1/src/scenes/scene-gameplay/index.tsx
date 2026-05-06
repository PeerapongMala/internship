import React, { useEffect, useRef } from "react";
import * as THREE from "three";
// import { ScoreDisplay } from "../../components/ScoreDisplay";
// import { TimerUI } from "../../components/TimerUI";
import { SceneTemplate, SceneTemplateProps } from "../../utils/core-utils/scene/scene-template";
import { PUBLIC_ASSETS_LOCATION } from "../../assets/public-assets-locations";
import GamePage from "../../context/GamePage";

// Functional component for hooks and rendering
function GameSceneContent() {
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number>();

  // Cleanup function
  const cleanup = () => {
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    // Clean up scene
    sceneRef.current.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });

    // // Clean up refs
    // if (characterDataRef.current?.DisplayModel) {
    //   characterDataRef.current.DisplayModel = null;
    // }
    // if (keyboardRef.current) {
    //   keyboardRef.current.cleanup();
    // }

    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // stopAllSound();
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center relative overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${PUBLIC_ASSETS_LOCATION.image.background.gameplay})` }}
      />

      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        {/* <ScoreDisplay />
        <TimerUI /> */}
        {/* <Canvas
          shadows
          camera={{
            position: [0, 10, 32],
            fov: 75,
            near: 0.5,
            far: 300,
          }}
          onCreated={({ gl }: { gl: THREE.WebGLRenderer }) => {
            rendererRef.current = gl;
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 3, 1]} intensity={1} castShadow />
          <OrbitControls enableDamping dampingFactor={0.25} enableZoom />
        </Canvas> */}
        <GamePage />
      </div>
    </div>
  );
}

// Class that extends SceneTemplate and delegates rendering to the functional component
export class SceneGameplay extends SceneTemplate {
  constructor(props: SceneTemplateProps) {
    super(props);
    this.content = <GameSceneContent />;
    this.sceneInitial();
  }
}
