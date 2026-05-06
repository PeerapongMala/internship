import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TimeManager } from '../time-manager';

// -------------------- Box Component --------------------
export const Box: React.FC<{ mesh: THREE.Mesh; timeManager: TimeManager }> = ({
  mesh,
  timeManager,
}) => {
  const velocityY = useRef(0);

  useEffect(() => {
    const unsubUpdate = timeManager.update((dt) => {
      mesh.rotation.y += dt;
    });
    const unsubFixed = timeManager.fixedUpdate((dt) => {
      velocityY.current -= 9.81 * dt;
      mesh.position.y += velocityY.current * dt;
      if (mesh.position.y < -2) {
        velocityY.current = 5;
        mesh.position.y = -2;
      }
    });

    return () => {
      unsubUpdate();
      unsubFixed();
    };
  }, [mesh, timeManager]);

  return null;
};

// -------------------- Controls --------------------
export function Controls({ timeManager }: { timeManager: TimeManager }) {
  const [playing, setPlayingState] = useState(timeManager.playing);
  const [timeScale, setTimeScaleState] = useState(timeManager.timeScale);

  const togglePlay = () => {
    timeManager.setPlaying(!playing);
    setPlayingState(!playing);
  };

  const changeScale = (val: number) => {
    timeManager.setTimeScale(val);
    setTimeScaleState(val);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginTop: 8,
        color: 'white',
        fontFamily: 'sans-serif',
      }}
    >
      <button onClick={togglePlay} style={{ padding: '4px 8px' }}>
        {playing ? '⏸ Pause' : '▶ Play'}
      </button>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span>
          Time Scale: <strong>{timeScale.toFixed(1)}x</strong>
        </span>
        <input
          type="range"
          min={0}
          max={2}
          step={0.1}
          value={timeScale}
          onChange={(e) => changeScale(parseFloat(e.target.value))}
        />
      </label>
    </div>
  );
}

// -------------------- CanvasWrapper --------------------
export function CanvasWrapper({
  title,
  singleton,
}: {
  title: string;
  singleton?: boolean;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const [timeManager, setTimeManager] = useState<TimeManager | null>(null);
  const [box, setBox] = useState<THREE.Mesh | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);
    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    if (mount.current) {
      mount.current.innerHTML = '';
      mount.current.appendChild(renderer.domElement);
    }

    const resizeCanvas = () => {
      if (mount.current) {
        const width = mount.current.clientWidth;
        const height = mount.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (mount.current) resizeObserver.observe(mount.current);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const boxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x0077ff }),
    );
    scene.add(boxMesh);

    let tm: TimeManager;
    if (singleton) {
      tm = TimeManager.getInstance();
      tm.addRenderTarget(renderer, scene, camera);
    } else {
      tm = new TimeManager(1 / 50);
      tm.addRenderTarget(renderer, scene, camera);
      tm.start();
    }

    setBox(boxMesh);
    setTimeManager(tm);

    return () => {
      if (singleton) tm.removeRenderTarget(renderer);
      renderer.dispose();
      boxMesh.geometry.dispose();
      (boxMesh.material as THREE.Material).dispose();
      resizeObserver.disconnect();
    };
  }, [singleton]);

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <h3>{title}</h3>
      <div ref={mount} style={{ width: '100%', height: '100%' }} />
      {timeManager && box && <Box mesh={box} timeManager={timeManager} />}
      {timeManager && <Controls timeManager={timeManager} />}
    </div>
  );
}

// -------------------- Demo --------------------
export function TimeManagerDemo() {
  return (
    <div>
      TimeManagerDemo
      <br />
      <div style={{ display: 'flex', gap: '16px' }}>
        <CanvasWrapper title="Canvas Instance 1" />
        <CanvasWrapper title="Canvas Instance 2" />
        <CanvasWrapper title="Canvas Singleton Instance A" singleton />
        <CanvasWrapper title="Canvas Singleton Instance B" singleton />
      </div>
    </div>
  );
}

export default TimeManagerDemo;
