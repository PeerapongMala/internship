import { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { WaveSpawnObjectInfo } from './Wave';
import * as THREE from 'three';

export interface CombinedWaveProps {
  wave: WaveSpawnObjectInfo[];
  onWaveComplete: () => void;
}

export function CombinedWave({ wave, onWaveComplete }: CombinedWaveProps) {
  const [currentWaveIndex, setCurrentWaveIndex] = useState(0);
  type WallType = {
    leftSide: { mesh: THREE.Mesh };
    rightSide: { mesh: THREE.Mesh };
  };
  type ObstacleType = {
    leftSide: { mesh: THREE.Mesh };
    rightSide: { mesh: THREE.Mesh };
  };

  const walls = useRef<WallType[]>([]);
  const obstacles = useRef<ObstacleType[]>([]);
  const lastSpawnTime = useRef(0);

  useEffect(() => {
    if (currentWaveIndex >= wave.length) {
      onWaveComplete();
      return;
    }
  }, [currentWaveIndex, wave.length, onWaveComplete]);

  const handleWaveComplete = () => {
    setCurrentWaveIndex((prevIndex) => prevIndex + 1);
  };

  const currentWave = wave[currentWaveIndex];

  useFrame((state) => {
    if (!currentWave) return;

    const currentTime = Date.now();
    if (currentTime - lastSpawnTime.current > 6000) {
      if (currentWave.type === 'wall') {
        const wall = createWall();
        state.scene.add(wall.leftSide.mesh);
        state.scene.add(wall.rightSide.mesh);
        walls.current.push(wall);
      } else if (currentWave.type === 'obstacle') {
        const obstacle = createObstacle();
        state.scene.add(obstacle.leftSide.mesh);
        state.scene.add(obstacle.rightSide.mesh);
        obstacles.current.push(obstacle);
      }
      lastSpawnTime.current = currentTime;
      handleWaveComplete();
    }

    // Update positions and check for completion
    updatePositionsAndCheckCompletion();
  });

  const createWall = () => {
    // Replace this with the actual implementation from WallWave
    return {
      leftSide: { mesh: new THREE.Mesh() },
      rightSide: { mesh: new THREE.Mesh() },
    };
  };

  const createObstacle = () => {
    // Replace this with the actual implementation from ObstacleWave
    return {
      leftSide: { mesh: new THREE.Mesh() },
      rightSide: { mesh: new THREE.Mesh() },
    };
  };

  const updatePositionsAndCheckCompletion = () => {
    // ...existing code to update positions and check for completion...
  };

  return (
    <>
      {walls.current.map((wall, index) => (
        <group key={index}>
          <primitive object={wall.leftSide.mesh} />
          <primitive object={wall.rightSide.mesh} />
        </group>
      ))}
      {obstacles.current.map((obstacle, index) => (
        <group key={index}>
          <primitive object={obstacle.leftSide.mesh} />
          <primitive object={obstacle.rightSide.mesh} />
        </group>
      ))}
    </>
  );
}
