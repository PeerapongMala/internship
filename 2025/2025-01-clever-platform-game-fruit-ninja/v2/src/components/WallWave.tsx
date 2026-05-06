import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';
import { createTextTexture } from '@/utils/TextTextureUtility';
import { useCharacterStore } from '@/store/characterStore';
import type { WaveObject } from './Wave';

interface WallConfig {
  readonly WIDTH: number;
  readonly HEIGHT: number;
  readonly DEPTH: number;
  readonly SPEED: number;
  readonly SPAWN_DISTANCE: number;
  readonly LANE_WIDTH: number;
  readonly FONT_SIZE: number;
  readonly SPAWN_INTERVAL: number;
}

const WALL_CONFIG: WallConfig = {
  WIDTH: 30,
  HEIGHT: 10,
  DEPTH: 2,
  SPEED: 0.2,
  SPAWN_DISTANCE: -220,
  LANE_WIDTH: 10,
  FONT_SIZE: 24,
  SPAWN_INTERVAL: 6000,
};

export interface WallEffect {
  type: 'hp' | 'burst' | 'burstSpeed';
  value: number;
  displayText: string;
}

interface WallSide {
  effect: WallEffect;
  mesh: THREE.Group;
  lastCollisionTime?: number;
  hp: number;
  boundingBox: THREE.Box3;
}

interface Wall {
  position: THREE.Vector3;
  entityData: WallSide;
}

const WALL_EFFECTS = {
  BURST: { type: 'burst' as const, value: 1, displayText: '🔫 +1 burst' },
  BURST_SPEED: {
    type: 'burstSpeed' as const,
    value: 0.1,
    displayText: '+0.1 burst speed',
  },
} as const;

interface WallProps {
  speed?: number;
  onCollision?: (effect: WallEffect) => void;
  wave?: any[];
  onWaveComplete?: () => void;
}

export function WallWave({ onCollision, wave, onWaveComplete }: WallProps) {
  const walls = useRef<any[]>([]);
  const { isPlaying } = useGameStore();
  const lastSpawnTime = useRef(Date.now());
  const gameStartTime = useRef(0);
  const lastSpawnPosition = useRef<number | null>(null);
  const { boundingBox: characterBox } = useCharacterStore();
  const hasSpawned = useRef(false);
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (isPlaying) {
      gameStartTime.current = Date.now();
      lastSpawnTime.current = gameStartTime.current;
      lastSpawnPosition.current = null;
    }
  }, [isPlaying]);

  const createWallMaterial = (effect: WallEffect) => {
    const materials = Array(6)
      .fill(null)
      .map((_, index) => {
        const texture = createTextTexture(index === 4 ? effect.displayText : '', true, {
          font: {
            normal: `bold ${WALL_CONFIG.FONT_SIZE}px Arial`,
            wall: `bold ${WALL_CONFIG.FONT_SIZE}px Arial`,
          },
        });
        return new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 1,
        });
      });
    return materials;
  };

  const createWallSide = (
    isLeft: boolean,
    position: THREE.Vector3,
    effect: WallEffect,
  ) => {
    const group = new THREE.Group();

    // Create barrier mesh
    const barrierGeometry = new THREE.BoxGeometry(
      WALL_CONFIG.WIDTH / 2,
      WALL_CONFIG.HEIGHT,
      WALL_CONFIG.DEPTH,
    );

    const barrierMaterial = new THREE.MeshPhongMaterial({
      color: isLeft ? 0x00ff00 : 0xff0000,
      transparent: true,
      opacity: 0.6,
    });

    const barrierMesh = new THREE.Mesh(barrierGeometry, barrierMaterial);

    // Position the barrier
    const xOffset = isLeft ? -WALL_CONFIG.LANE_WIDTH / 2 : WALL_CONFIG.LANE_WIDTH / 2;
    barrierMesh.position.set(xOffset, 0, 0);

    // Create text mesh
    const textGeometry = new THREE.BoxGeometry(
      WALL_CONFIG.WIDTH / 2,
      WALL_CONFIG.HEIGHT,
      0.1,
    );

    const textMaterials = createWallMaterial(effect);
    const textMesh = new THREE.Mesh(textGeometry, textMaterials);
    textMesh.position.set(xOffset, 0, -WALL_CONFIG.DEPTH / 2 - 0.1);

    group.add(barrierMesh);
    group.add(textMesh);
    group.position.copy(position);

    const createBoundingBox = (mesh: THREE.Group) => {
      const HitboxBox = new THREE.Box3();
      HitboxBox.setFromObject(mesh);
      HitboxBox.expandByVector(new THREE.Vector3(1, 1, 1));
      return HitboxBox;
    };

    return {
      effect,
      mesh: group,
      lastCollisionTime: 0,
      hp: 1,
      boundingBox: createBoundingBox(group),
    };
  };

  const handleDisposeWall = (walldata: WallSide) => {
    if (walldata.mesh.parent) {
      walldata.mesh.parent.remove(walldata.mesh);
      walldata.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
      });
    }
  };

  const createWall = (waveObject: WaveObject) => {
    const position = new THREE.Vector3(
      0,
      WALL_CONFIG.HEIGHT / 2,
      WALL_CONFIG.SPAWN_DISTANCE,
    );

    const leftWallConfig = waveObject.left;

    const leftEffect: WallEffect = leftWallConfig?.effect
      ? {
        type: leftWallConfig.effect as 'burst' | 'burstSpeed' | 'hp',
        value: parseFloat(leftWallConfig.value ?? '0'),
        displayText: `${leftWallConfig.effect} +${leftWallConfig.value}`,
      }
      : WALL_EFFECTS.BURST;

    const newEntity = createWallSide(true, position, leftEffect);

    return {
      position,
      entityData: newEntity,
    };
  };

  const cleanWall = (wallIndex: number) => {
    const targetWall: Wall = walls.current[wallIndex];
    if (targetWall) {
      handleDisposeWall(targetWall.entityData);
      walls.current.splice(wallIndex, 1);
    }
  };

  const cleanupWalls = () => {
    walls.current.forEach((wall: Wall) => {
      if (wall.entityData.mesh.parent) {
        wall.entityData.mesh.parent.remove(wall.entityData.mesh);
        wall.entityData.mesh.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else if (child.material) {
              child.material.dispose();
            }
          }
        });
      }
    });
    walls.current = [];
  };

  const handleCollision = (effect: WallEffect) => {
    if (onCollision) {
      onCollision(effect);
    }
  };

  useFrame((state) => {
    //if (!isPlaying || !wave || wave.length <= 0) return;
    if (!isPlaying || !wave) return;
    //if (walls.current.length <= 0) return;
    const currentTime = Date.now();
    wave.forEach((element, index) => {
      if (currentTime - lastSpawnTime.current > element.distanceAt * 1000) {
        const newWall = createWall(element);

        if (newWall) {
          newWall.position.set(0, 0, WALL_CONFIG.SPAWN_DISTANCE);

          newWall.entityData.mesh.position.set(
            (Math.floor(Math.random() * 3 - 1) * 30) / 2,
            0,
            WALL_CONFIG.SPAWN_DISTANCE,
          );

          state.scene.add(newWall.entityData.mesh);
          walls.current.push(newWall);
        }
        console.log(wave);
        wave.splice(index, 1);
      }
    });

    walls.current.forEach((wall: Wall, index) => {
      wall.position.z += WALL_CONFIG.SPEED;
      wall.entityData.mesh.position.z = wall.position.z;
      wall.entityData.boundingBox.setFromObject(wall.entityData.mesh);

      if (
        characterBox.intersectsBox(wall.entityData.boundingBox) &&
        wall.entityData.mesh.parent
      ) {
        handleDisposeWall(wall.entityData);
        handleCollision(wall.entityData.effect);
      }

      if (wall.position.z > 20) {
        cleanWall(index);
      }
    });

    if (
      wave &&
      wave.length <= 0 &&
      hasCompleted.current != true &&
      walls.current.length <= 0
    ) {
      hasCompleted.current = true;
      console.log('Sending wave complete');
      if (onWaveComplete) {
        onWaveComplete();
      }
    }
  });

  useEffect(() => {
    if (!isPlaying) {
      cleanupWalls();
      hasSpawned.current = false;
      hasCompleted.current = false;
    }
    return () => {
      cleanupWalls();
      hasSpawned.current = false;
      hasCompleted.current = false;
    };
  }, [isPlaying]);

  return (
    <>
      {walls.current.map((wall, index) => (
        <group key={index}>
          <primitive object={wall.entityData.mesh} />
        </group>
      ))}
    </>
  );
}
